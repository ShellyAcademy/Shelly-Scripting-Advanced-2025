let queue = [];

function enqueue(value) {
  queue.push(value);
}

function dequeue(queue) {
  if (queue.length === 0) {
    return "Queue is empty";
  }
  return queue.splice(0, 1)[0];
}

function isEmpty() {
  return queue.length === 0;
}

enqueue(1);
enqueue(2);
console.log(queue);
dequeue(queue);
console.log(queue);