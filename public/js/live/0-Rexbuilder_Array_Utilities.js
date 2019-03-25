/**
 * JS Object to manipulate and reorder a grid
 * @param {int} maxWidth max column width
 * @since 2.0.0
 */
function IndexedGrid( maxWidth ) {
  this.grid = [];
  this.maxWidth = maxWidth;
}

/**
 * Insertion sort algorithm on the grid
 *
 * @return void
 * @since 2.0.0
 */
IndexedGrid.prototype.insertionSort = function () {
  var length = this.grid.length;

  for (var i = 1, j; i < length; i++) {
    var temp = this.grid[i];
    for (var j = i - 1; j >= 0 && this.grid[j] > temp; j--) {
      this.grid[j + 1] = this.grid[j];
    }
    this.grid[j + 1] = temp;
  }
}

/**
 * Set the array-grid with an element defined by
 * [x,y] coordinates, width and height
 *
 * @param int $x
 * @param int $y
 * @param int $w
 * @param int $h
 * @return void
 * @since 2.0.0
 */
IndexedGrid.prototype.setGrid = function (x, y, w, h) {
  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      this.grid.push((x + j) + ((y + i) * this.maxWidth));
    }
  }
  this.insertionSort();
}

/**
 * Check on the grid if there are empty spaces before some point
 * Fill them if there are then reorder the grid
 *
 * @param int $place
 * @return void
 * @since 2.0.0
 */
IndexedGrid.prototype.checkGrid = function (place) {
  var i = 0;
  while (this.grid[i] < place) {
    var last = this.grid[i];
    if ((last+1) !== this.grid[i + 1]) {
      this.grid.push(last + 1);
    }
    i++;
  }
  this.insertionSort();
}

/**
 * Check in the array-grid the first available position for a block
 * with a certain widht and height
 *
 * @param int $width
 * @param int $height
 * @return int
 * @since 2.0.0
 */
IndexedGrid.prototype.willFit = function (width, height) {
  if( 0 == this.grid.length )
  {
    return 0;
  }

  var holes = this.findHoles();

  // Search in the holes for a free space
  for (var z = 0; z < holes.length; z++) {
    for (var w = this.grid[holes[z]] + 1; w < this.grid[holes[z] + 1]; w++) {
      var free = this.searchFreeSpace(w, width, height);
      if (free) { return w; }
    }
  }

  // No free spaces in the holes
  // Search the index starting from the last non-free index
  var lastFreeElement = this.grid[this.grid.length - 1] + 1;
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
 * Find the possibile holes on the array-grid
 *
 * @return int
 * @since 2.0.0
 */
IndexedGrid.prototype.findHoles = function () {
  var result = [];
  for (var i = 0; i < this.grid.length; i++) {
    if ( "undefined" == typeof this.grid[i + 1] || this.grid[i] + 1 !== this.grid[i + 1]) {
      result.push(i);
    }
  }
  return result;
}

/**
 * Check if a block can stay on a start position
 *
 * @param int $start
 * @param int $width
 * @param int $height
 * @return bool
 * @since 2.0.0
 */
IndexedGrid.prototype.searchFreeSpace = function (start, width, height) {
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
      if (-1 !== this.grid.indexOf(temp)) {
        return false;
      }
    }
  }

  return true;
}

IndexedGrid.prototype.negativeGrid = function()
{
  // var last = this.grid[this.grid.length-1];
  var temp = [];
  for ( var j=0; j < this.grid.length; j++ )
  {
    if ( this.grid[j]+1 !== this.grid[j+1] )
    {
      for( var z = this.grid[j]+1; z < this.grid[j+1]; z++ )
      {
        temp.push(z);
      }
    }
  }
  return temp;
}