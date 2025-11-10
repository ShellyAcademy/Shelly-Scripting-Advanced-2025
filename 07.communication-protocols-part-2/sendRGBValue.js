function setDataToOtherDevice(remoteDeviceIP, payload) {
    let config = {
        TEXT_VC_ID: 200,
        DEBUG: true,
        CREATE_GROUP_FOR_VC: false,
        new_VC_Config: {
            name: "P2P_Event_Box",
            persisted: false,
            default_value: "content_not_provided",
            max_len: 255,
            meta: {
                ui: {
                    view: "label",
                    icon: "https://img.icons8.com/material-rounded/50/000000/text-box.png"
                }
            }
        },
        baseUrls: {
            createTextVirtualComponentURL: function (remoteDeviceIP, new_VC_Config) {
                return remoteDeviceIP + "/rpc/Virtual.Add?type=text&config=" + JSON.stringify(new_VC_Config);
            },
            setContentToTextVirtualComponentURL: function (remoteDeviceIP, textVC_id, payloadString) {
                return remoteDeviceIP + "/rpc/Text.Set?id=" + textVC_id + "&value=" + payloadString;
            },
            createGroupURL: function (remoteDeviceIP) {
                return remoteDeviceIP + "/rpc/Virtual.Add?type=group";
            },
            setTextVirtualComponentToGroupURL: function (remoteDeviceIP, groupId, newVCId) {
                return remoteDeviceIP + "/rpc/Group.Set?id=" + groupId + "&value=[\"text:" + newVCId + "\"]";
            }
        }
    };
    let payloadString = JSON.stringify(payload);
    function logDebug(message) {
        if (config.DEBUG) {
            console.log(message);
        }
    }
    function logError(response, operation) {
        if (config.DEBUG && response.code !== 200) {
            console.log("Failed to " + operation + ", HTTP error message: " + JSON.parse(response.body).message);
            return true;
        }
        return false;
    }
    function makeHttpCall(url, callback, userdata) {
        Shelly.call("HTTP.GET", { url: url }, callback, userdata);
    }
    function handleGroupSet(groupSetResponse) {
        if (logError(groupSetResponse, "set group")) {
            return;
        }
        logDebug("Group set successfully");
    }
    function handleGroupCreation(groupResponse, error_code, error_msg, userdata) {
        if (logError(groupResponse, "create group")) {
            return;
        }
        logDebug("Created a group for the virtual component");
        let groupId = JSON.parse(groupResponse.body).id;
        makeHttpCall(config.baseUrls.setTextVirtualComponentToGroupURL(remoteDeviceIP, groupId, userdata.newId), handleGroupSet);
    }
    function handleValueSet(setValueResponse, error_code, error_msg, userdata) {
        if (logError(setValueResponse, "set value")) {
            return;
        }
        logDebug("Value set successfully after creating virtual component");
        if (config.CREATE_GROUP_FOR_VC) {
            makeHttpCall(config.baseUrls.createGroupURL(remoteDeviceIP), handleGroupCreation, userdata);
        }
    }
    function handleVCCreation(createResponse) {
        if (logError(createResponse, "create virtual component")) {
            return;
        }
        logDebug("Created Text virtual component for device with IP: " + remoteDeviceIP);
        let newVCId = JSON.parse(createResponse.body).id;
        makeHttpCall(config.baseUrls.setContentToTextVirtualComponentURL(remoteDeviceIP, newVCId, payloadString), handleValueSet, {newId: newVCId});
    }
    function handleInitialSetAttempt(response) {
        if (response.code === 200) {
            logDebug("Value set successfully to device with IP: " + remoteDeviceIP);
        } else if (response.code === 500) {
            makeHttpCall(config.baseUrls.createTextVirtualComponentURL(remoteDeviceIP, config.new_VC_Config), handleVCCreation);
        }
    }
    makeHttpCall(config.baseUrls.setContentToTextVirtualComponentURL(remoteDeviceIP, config.TEXT_VC_ID, payloadString), handleInitialSetAttempt);
}

Shelly.addStatusHandler(function(statusData) {
  if (typeof statusData.component != "undefined" &&
   statusData.component === "rgb:0"
  ) {
    if (
      statusData.delta.brightness &&
      statusData.delta.rgb &&
      statusData.delta.output
    ) {
      let payload = statusData;
      console.log(payload);
      setDataToOtherDevice("http://192.168.10.108", payload);
    }
  }
})