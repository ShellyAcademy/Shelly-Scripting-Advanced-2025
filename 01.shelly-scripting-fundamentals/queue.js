function Queue() {
  this.items = [];

  this.enqueue = function (element) {
    this.items.push(element);
  };

  this.dequeue = function () {
    if (this.isEmpty()) {
      return 'Queue is empty';
    }
    return this.items.splice(0, 1)[0];
  };

  this.isEmpty = function () {
    return this.items.length === 0;
  };

  this.size = function () {
    return this.items.length;
  };

  this.front = function () {
    if (this.isEmpty()) {
      return 'Queue is empty';
    }
    return this.items[0];
  };
}

// Example usage:
// Example usage:
var queue = new Queue();
console.log(queue.isEmpty()); // Output: true
queue.enqueue('First');
queue.enqueue('Second');
console.log(queue.front()); // Output: 'First'
console.log(queue.dequeue()); // Output: 'First'
console.log(queue.front()); // Output: 'Second'
console.log(queue.isEmpty()); // Output: false
console.log(queue.size()); // Output: 1
