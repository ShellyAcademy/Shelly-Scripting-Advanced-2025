let counter = 0;

function stackOverflow() {
  counter++;
  if (counter > 15) {
    return;
  }
  stackOverflow();
}

stackOverflow();