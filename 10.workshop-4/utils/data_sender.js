let CONFIG = {
  MQTT_PREFIX: Shelly.getComponentConfig("mqtt").topic_prefix,
  MQTT_TOPIC: "/telemetry",
  INTERCAL_IN_SECONDS: 10
}

Timer.set(1000 * CONFIG.INTERCAL_IN_SECONDS, true, function () {
  Shelly.call("Shelly.GetStatus", null, function (data) {
    let wifiData = data.wifi;
    let sysData = data.sys;
    let switchData = data["switch:0"];

    let payload = {
      upTime: sysData.uptime,
      ramSize: sysData.ram_size,
      ramFree: sysData.ram_free,
      ramMinFree: sysData.ram_min_free,
      totalEnergy: switchData.aenergy.total,
      wifiStrength: wifiData.rssi,
      state: switchData.output,
      apower: switchData.apower,
      voltage: switchData.voltage,
      current: switchData.current,
      temperature: switchData.temperature.tC
    }

    MQTT.publish(CONFIG.MQTT_PREFIX + CONFIG.MQTT_TOPIC, JSON.stringify(payload));
  })
})