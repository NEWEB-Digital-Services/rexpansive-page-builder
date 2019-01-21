<!DOCTYPE html>
<html lang="en">
  <head>
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Test Griglia</title>

    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
    />
    <link
      rel="stylesheet"
      href="public/js/vendor/gridstack.js-0.4.0/dist/gridstack.css"
    />
    <link
      rel="stylesheet"
      href="public/js/vendor/gridstack.js-0.4.0/dist/gridstack-extra.css"
    />

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.0/jquery-ui.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js"></script>
    <script src="public/js/vendor/gridstack.js-0.4.0/dist/gridstack.js"></script>
    <script src="public/js/vendor/gridstack.js-0.4.0/dist/gridstack.jQueryUI.js"></script>

    <style>
      #grid1 {
        background: lightgoldenrodyellow;
      }

      .grid-stack-item-content {
        color: #fff;
        text-align: center;
        background-color: #18bc9c;
        outline: 3px dotted black;
      }

      .grid-stack-item.red-block .grid-stack-item-content {
        background: rgba(255, 0, 0, 1);
      }

      .grid-stack-item.green-block .grid-stack-item-content {
        background: rgba(0, 255, 0, 1);
      }

      .grid-stack-item.blue-block .grid-stack-item-content {
        background: rgba(0, 0, 255, 1);
      }

      .grid-stack-item.water-block .grid-stack-item-content {
        background: rgba(0, 255, 255, 1);
      }

      /* .grid-stack > .grid-stack-item > .grid-stack-item-content {
        position: static;
      } */

      .grid-stack-item-removing {
        opacity: 0.5;
      }

      .sidebar {
        background: rgba(0, 255, 0, 0.1);
        height: 150px;
        padding: 25px 0;
        text-align: center;
      }

      .sidebar .grid-stack-item {
        width: 200px;
        height: 100px;
        border: 2px dashed green;
        text-align: center;
        line-height: 100px;
        z-index: 10;
        background: rgba(0, 255, 0, 0.1);
        cursor: default;
        display: inline-block;
      }

      .sidebar .grid-stack-item .grid-stack-item-content {
        background: none;
      }

      .filter {
        cursor: pointer;
        display: inline-block;
        padding: 10px;
        border: 1px solid black;
      }

      .filter:hover {
        background-color:#eee;
        color: #aaa;
      }

      .mask {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        z-index: 10;
      }

      .mask-col {
        min-width: 8.3333333333%;
        height: 100%;
        float: left;
      }

      .mask-col:not(:last-child) {
        border-right: 1px solid rgba(221,221,221,0.5);
      }

      .mask-row {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid rgba(221,221,221,0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .num {
        width: 8.3333333333%;
        text-align: center;
        font-size: 30px;
        font-weight:bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Test inserimento elemento</h1>

      <div class="row">
        <div class="col-12">
          <p class="text-center"><button id="insert-btn" class="btn btn-primary">Insert</button></p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="grid-stack grid-stack-12" id="grid1">
            <div class="grid-stack-item red-block" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="4">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(0)</div>
              </div>
            </div>
            <div class="grid-stack-item green-block" data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="4">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(1)</div>
              </div>
            </div>
            <div class="grid-stack-item blue-block" data-gs-x="8" data-gs-y="0" data-gs-width="4" data-gs-height="4">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(2)</div>
              </div>
            </div>
            <div class="grid-stack-item blue-block" data-gs-x="0" data-gs-y="4" data-gs-width="3" data-gs-height="3">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(3)</div>
              </div>
            </div>
            <div class="grid-stack-item blue-block" data-gs-x="3" data-gs-y="4" data-gs-width="3" data-gs-height="3">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(4)</div>
              </div>
            </div>
            <div class="grid-stack-item blue-block" data-gs-x="6" data-gs-y="4" data-gs-width="6" data-gs-height="3">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(5)</div>
              </div>
            </div>
            <div class="grid-stack-item blue-block" data-gs-x="0" data-gs-y="7" data-gs-width="6" data-gs-height="4">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(6)</div>
              </div>
            </div>
            <div class="grid-stack-item red-block" data-gs-x="6" data-gs-y="7" data-gs-width="3" data-gs-height="4">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(7)</div>
              </div>
            </div>
            <div class="grid-stack-item blue-block" data-gs-x="10" data-gs-y="7" data-gs-width="3" data-gs-height="4">
              <div class="grid-stack-item-content">
                <div class="text-wrap">(8)</div>
              </div>
            </div>
            <div class="mask">
              <?php
              for($j=0; $j<12; $j++) {
                ?><div class="mask-col"></div><?php
              }
              ?>
            </div>
            <div class="mask">
              <?php
              $z = 0;
              for($i=0; $i<18; $i++) {
                ?><div class="mask-row"><?php
                for($j=0; $j<12; $j++) {
                  ?><span class="num"><?php echo $z; ?></span><?php
                  $z++;
                }
                ?></div><?php
              }
              ?>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      /**
       * insertion sort algorithm implementation
       */
      Array.prototype.insertionSort = function() {
        var length = this.length;
        
        for(var i = 1, j; i < length; i++) {
          var temp = this[i];
          for(var j = i - 1; j >= 0 && this[j] > temp; j--) {
            this[j+1] = this[j];
          }
          this[j+1] = temp;
        }
      }

      /**
       * Setting the grid-index positions
       */
      Array.prototype.setGrid = function(x,y,w,h) {
        for(var i=0; i<h; i++) {
          for(var j=0; j<w; j++) {
            this.push((x+j)+((y+i)*12));
          }
        }
        this.insertionSort();
      }

      /**
       * Fill the grid from a starting point to prevent insertions
       * in previous place
       */
      Array.prototype.checkGrid = function(place) {
        var i=0;
        while(this[i] < place) {
          var last = this[i];
          if( last !== this[i+1] ) {
            this.push(last+1);
          }
          i++;
        }
        this.insertionSort();
      }

      Array.prototype.willFit = function(width,height) {
        var holes = this.findHoles();

        // Search in the holes for a free space
        for(var z=0; z<holes.length; z++) {
          for(var w=this[holes[z]]+1; w<this[holes[z]+1]; w++) {
            var free = this.searchFreeSpace(w,width,height);
            if(free) {return w;}
          }
        }

        // No free spaces in the holes
        // Search the index starting from the last non-free index
        var lastFreeElement = this[this.length-1] + 1;
        var startRow = Math.floor( ( lastFreeElement ) / 12 );
        var endRow = Math.floor( ( ( lastFreeElement ) + ( width - 1 ) ) / 12 );      

        while( startRow !== endRow ) {
          lastFreeElement = lastFreeElement + 1;
          startRow = Math.floor( ( lastFreeElement ) / 12 );
          endRow = Math.floor( ( ( lastFreeElement ) + ( width - 1 ) ) / 12 );
        }

        return lastFreeElement;
      }

      /**
       * Finding the holes from a grid-index array
       */
      Array.prototype.findHoles = function() {
        var result = [];
        for( var i=0; i<this.length; i++) {
          if( this[i] + 1 !== this[i+1] ) {
            result.push(i);
          }
        }
        return result;
      }

      /**
       * Searching if a block can fit the grid starting from a certain index
       */
      Array.prototype.searchFreeSpace = function(start,width,height) {
        // Check if the element overflows the grid
        var startRow = Math.floor( ( start ) / 12 );
        var endRow = Math.floor( ( start+width-1 ) / 12 );

        if( startRow !== endRow ) {
          return false;
        }

        // Check if the element fits or the spaces are already occupied
        for( var i=0; i<height; i++ ) {
          for( var j=0; j<width; j++ ) {
            var temp = start+j+(i*12);
            if( -1 !== this.indexOf( temp ) ) {
              return false;
            }
          }
        }

        return true;
      }

      var getCoord = function( val, maxWidth ) {
        return {
          x: val % maxWidth,
          y: Math.floor( val / maxWidth )
        }
      };

      var getIndex = function(coord, maxWidth) {
        return coord[0] + ( coord[1] * maxWidth );
      }

      $(function() {
        var findHole = function(arr, start) {
          start = "undefined" !== typeof start ? start : 0;
          for(var i=start; i<arr.length; i++) {
            if( arr[i] + 1 !== arr[i+1] ) {
              if( "undefined" !== typeof arr[i+1] ) {
                return i;
              } else {
                return arr.length-1;
              }
            }
          }
          return arr.length-1;
        };
        
        $(window).on("load", function() {
          var $grid = $("#grid1");
          var options = {
            width: 12,
            float: true,
            animate: true,
            verticalMargin: 0
          };

          $grid.gridstack(options);
          var grid = $grid.data("gridstack");

          var newNodeIndex = $grid.find('.grid-stack-item').length;

          $insertBtn = $('#insert-btn');
          $insertBtn.on("click", function(e) {
            e.preventDefault();
            var newNode = {
              x: 0,
              y: 0,
              width: 3,
              height: 4,
              // width: Math.floor(Math.random()*12),
              // height: Math.floor(Math.random()*12)
            };

            var markGrid = [];
            markGrid.setGrid(newNode.x, newNode.y, newNode.width, newNode.height);

            var newPositions = [];

            for(var i=0; i<grid.grid.nodes.length; i++) {
              var newPosition = {};
              // Find elements to move
              if( ( grid.grid.nodes[i].x + ( grid.grid.width * grid.grid.nodes[i].y ) ) >= ( newNode.x + ( grid.grid.width * newNode.y ) ) ) {
                var linearCoord = markGrid.willFit(grid.grid.nodes[i].width,grid.grid.nodes[i].height);
                var newCoords = getCoord(linearCoord,12);
                newPosition.x = newCoords.x;
                newPosition.y = newCoords.y;
                newPosition.el = grid.grid.nodes[i];
                markGrid.setGrid( newCoords.x, newCoords.y, grid.grid.nodes[i].width, grid.grid.nodes[i].height);
                markGrid.checkGrid(linearCoord);
              }
              newPositions.push(newPosition);
            }

            grid.batchUpdate();

            for(var j=0; j<newPositions.length; j++) {
              if( newPositions[j].hasOwnProperty('x') && newPositions[j].hasOwnProperty('y') && newPositions[j].hasOwnProperty('el') ) {
                grid.move( newPositions[j].el.el, newPositions[j].x, newPositions[j].y );
              }
            }

            grid.commit();

            grid.addWidget('<div class="water-block" data-gs-x="' + newNode.x + '" data-gs-y="' + newNode.y + '" data-gs-width="' + newNode.width + '" data-gs-height="' + newNode.height + '"><div class="grid-stack-item-content"><div class="text-wrap">(' + newNodeIndex + ')</div></div></div></div>');
            newNodeIndex = newNodeIndex + 1;
          });
        });
      });
    </script>
  </body>
</html>
