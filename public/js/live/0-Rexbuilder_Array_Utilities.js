/**
 * insertion sort algorithm implementation
 */
Array.prototype.insertionSort = function () {
  var length = this.length;

  for (var i = 1, j; i < length; i++) {
    var temp = this[i];
    for (var j = i - 1; j >= 0 && this[j] > temp; j--) {
      this[j + 1] = this[j];
    }
    this[j + 1] = temp;
  }
}

/**
 * Setting the grid-index positions
 */
Array.prototype.setGrid = function (x, y, w, h) {
  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      this.push((x + j) + ((y + i) * 12));
    }
  }
  this.insertionSort();
}

/**
 * Fill the grid from a starting point to prevent insertions
 * in previous place
 */
Array.prototype.checkGrid = function (place) {
  var i = 0;
  while (this[i] < place) {
    var last = this[i];
    if (last !== this[i + 1]) {
      this.push(last + 1);
    }
    i++;
  }
  this.insertionSort();
}

Array.prototype.willFit = function (width, height) {
  var holes = this.findHoles();

  // Search in the holes for a free space
  for (var z = 0; z < holes.length; z++) {
    for (var w = this[holes[z]] + 1; w < this[holes[z] + 1]; w++) {
      var free = this.searchFreeSpace(w, width, height);
      if (free) { return w; }
    }
  }

  // No free spaces in the holes
  // Search the index starting from the last non-free index
  var lastFreeElement = this[this.length - 1] + 1;
  var startRow = Math.floor((lastFreeElement) / 12);
  var endRow = Math.floor(((lastFreeElement) + (width - 1)) / 12);

  while (startRow !== endRow) {
    lastFreeElement = lastFreeElement + 1;
    startRow = Math.floor((lastFreeElement) / 12);
    endRow = Math.floor(((lastFreeElement) + (width - 1)) / 12);
  }

  return lastFreeElement;
}

/**
 * Finding the holes from a grid-index array
 */
Array.prototype.findHoles = function () {
  var result = [];
  for (var i = 0; i < this.length; i++) {
    if (this[i] + 1 !== this[i + 1]) {
      result.push(i);
    }
  }
  return result;
}

/**
 * Searching if a block can fit the grid starting from a certain index
 */
Array.prototype.searchFreeSpace = function (start, width, height) {
  // Check if the element overflows the grid
  var startRow = Math.floor((start) / 12);
  var endRow = Math.floor((start + width - 1) / 12);

  if (startRow !== endRow) {
    return false;
  }

  // Check if the element fits or the spaces are already occupied
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var temp = start + j + (i * 12);
      if (-1 !== this.indexOf(temp)) {
        return false;
      }
    }
  }

  return true;
}