;(function( $, window, document, undefined ) {
    'use strict';

    $.textResize = function(element, options) {
        this.options = {};

        element.data('textResize', this);

        this.init = function(element, options) {
            this.options = $.extend({}, $.textResize.defaultOptions, options);

            var viewportsizestart = this.options.viewportsizestart;

            var section;
            var b = [];

            if(element[0].getAttribute('data-layout') == 'fixed' && element[0].getAttribute('data-full-height') != 'true' && 'false' != element[0].getAttribute('data-launch-text-resize')) {
                var blocks = element[0].getElementsByClassName(this.options.blockSelector);
                var j = 0;

                for(j=0;j<blocks.length;j++) {
                    b.push(new RexBlock(blocks[j], this.options.containerSelector, this.options.contentSelector));
                }

                section = new RexSection(b, element);
                b = [];
            }
        };

        /** --- BLOCK OBJECT ---------- */
        var RexBlock = function(element, container, content) {
            this.element_reference = element;
            if( '' == container ) {
              this.container_reference = this.element_reference.children[0];    // .grid-item-content
            } else {
              this.container_reference = this.element_reference.getElementsByClassName(container)[0];
            }
            this.content_reference = this.element_reference.getElementsByClassName(content)[0];

            this.overflow = false;

            // this.row_number = null;

            this.initialState = {
                block_height: null,
                wrap: null,
                content: null,
            };

            this.heights = {
                wrap: null,
                content: null,
            };

            this.x = parseInt(this.element_reference.getAttribute('data-col'));
            this.y = parseInt(this.element_reference.getAttribute('data-row'));

            this.toFix = false;

            //this.calculateCoords();
            this.compare();

            //this.block_height = null;
            //this.block_width = null;

            this.block_height = parseInt(this.element_reference.getAttribute('data-height'));
            this.block_width = parseInt(this.element_reference.getAttribute('data-width'));
            //var block_classes = (this.element_reference.getAttribute('class')).match(/w\d+\b/g);
            //this.block_width = parseInt(block_classes[0].match(/\d+/g)[0]);

            this.initialBlockArea = this.calculateBlockArea();
            this.workingBlockArea = this.calculateBlockArea();

            this.modified = false;
            this.mods = 0;

            this.height_to_add = 0;
            this.neighbourghs = [];

            this.calculateInitialState();

            this.calculateHeights();

            this.compare();
        }

        RexBlock.prototype.init = function() {
            // this.calculateCoords();
            this.calculateInitialState();
        };

        RexBlock.prototype.calculateCoords = function() {
            //this.x = $(this.element_reference).position().left;
            this.x = $(this.element_reference).attr('data-col');
            //this.y = $(this.element_reference).position().top;
            this.y = $(this.element_reference).attr('data-row');
        };

        RexBlock.prototype.calculateInitialState = function() {
            this.initialState.wrap = $(this.container_reference).innerHeight();
            this.initialState.block_height = parseInt(this.element_reference.getAttribute('data-height'));

            if(typeof this.content_reference != 'undefined') {
                this.initialState.content = $(this.content_reference).innerHeight();
            }
        };

        RexBlock.prototype.setInitialState = function() {
            this.setBlockHeight(this.initialState.block_height);
        };

        RexBlock.prototype.clearNeighborhood = function() {
            this.height_to_add = 0;
            this.neighbourghs = [];
        };

        RexBlock.prototype.calculateHeights = function() {
          this.heights.wrap = $(this.container_reference).innerHeight();

          if(typeof this.content_reference != 'undefined') {
            // this.heights.content = this.content_reference.clientHeight;
            // this.heights.content = this.content_reference.scrollHeight;
            // this.heights.content = this.content_reference.offsetHeight;
            // this.heights.content = $(this.content_reference).height();
            this.heights.content = $(this.content_reference).innerHeight();
            // this.heights.content = $(this.content_reference).outerHeight();
          }
          // console.log($(this.container_reference));
          // console.log($(this.content_reference));
          // console.log(this.heights);
        };

        RexBlock.prototype.calculateBlockArea = function() {
            return this.block_width * this.block_height;
        };

        RexBlock.prototype.setBlockHeight = function(n) {
            this.block_height = n;
            $(this.element_reference).attr('data-height', n);
        };

        RexBlock.prototype.compare = function() {
          if( this.heights.wrap < this.heights.content ) {
            this.overflow = true;
          } else {
            this.overflow = false;
          }
        };

        /* ------ SECTION OBJECT -------- */
        var RexSection = function(blocks, perfectGrid) {
            this.sectionReference = perfectGrid;
            this.perfectGridReference = perfectGrid.data('plugin_perfectGridGallery');

            this.sectionReference.perfectGridGallery('setIsotopeProperty',['transitionDuration','0']);

            this.blocks = blocks;

            // Ordering the blocks based on the position
            /*this.blocks.sort(function(a, b) {
                return a.y - b.y;
            });*/

            // Ordering the blocks based on the number of mods that they need

            this.blocks_to_compare = [];
            this.steps = 0;

            this.initialSectionArea = 0;
            this.workingSectionArea = 0;

            this.mods_vals = null;

            this.findBlocksToCompare();

            this.getInitialSectionArea();

            this.findSteps();
            this.markBlocks();

            // this.findModVals();

            // this.fixHeights();

            this.setNeighbouroodFix();
            this.newFixHeights();

            this.sectionReference.perfectGridGallery('setIsotopeProperty',['transitionDuration','0.4s']);

            // N° of rows = this.limiters.length

            this.sectionReference.on('rearrangeComplete', { ref: this } , function(event) {
                if(_viewport().width >= 768 || $(this).data('plugin_perfectGridGallery')._check_parent_class("rex-block-grid") ) {
                  event.data.ref.updateHeights();
                }
            });
        }

        RexSection.prototype.getInitialSectionArea = function() {
            for(var i = 0; i < this.blocks.length; i++ ) {
                this.initialSectionArea += this.blocks[i].initialBlockArea;
            }
        };

        /**
         *  Find the blocks where the text overflows and put them in an array
         *
         */
        RexSection.prototype.findBlocksToCompare = function() {
            for(var i = 0; i < this.blocks.length; i++) {

                if(this.blocks[i].overflow) {
                    // this.blocks[i].mods++;
                    // this.blocks[i].toFix = true;
                    this.blocks_to_compare.push(this.blocks[i]);
                }
            }
        };

        /**
         *  Find the steps to add to the blocks to fit the text
         *  the value find is the max step for all the blocks
         *
         */
        RexSection.prototype.findSteps = function() {
            //var temp_steps = 1;
            var temp_steps;
            var unit_height = this.sectionReference.perfectGridGallery('getSingleWidth');
            var unit_separator = this.sectionReference.perfectGridGallery('getSeparator');

            // var unit_height = unit_block;

            for(var i=0;i<this.blocks_to_compare.length;i++) {
                temp_steps = 0;
                if(this.blocks_to_compare[i].overflow) {
                    do {
                        temp_steps++;
                    } while( ( ( ( this.blocks_to_compare[i].block_height + temp_steps ) * unit_height ) - unit_separator ) < this.blocks_to_compare[i].heights.content )

                    // } while( ( this.blocks_to_compare[i].heights.wrap + ( unit_height * temp_steps ) - unit_separator ) < this.blocks_to_compare[i].heights.content ) // OLD CONDITION

                    this.blocks_to_compare[i].height_to_add = temp_steps;

                }
                // console.log(temp_steps);
            }
        };

        /**
         *  Mark the blocks that must increase their height to maintain the proportion
         *  in the grid
         */
        RexSection.prototype.markBlocks = function() {
            for(var j = 0; j < this.blocks_to_compare.length; j++) {
                for(var i = 0; i<this.blocks.length; i++) {
                    if((this.blocks[i].x != this.blocks_to_compare[j].x && this.blocks[i].y < this.blocks_to_compare[j].y && this.blocks[i].block_height > this.blocks_to_compare[j].y) ||
                        (this.blocks[i].x != this.blocks_to_compare[j].x && this.blocks[i].y == this.blocks_to_compare[j].y)) {
                        // this.blocks[i].toFix = true;
                        // this.blocks[i].mods++;
                        // $(this.blocks[i].element_reference).css('background-color', 'yellow');

                        this.blocks_to_compare[j].neighbourghs.push(this.blocks[i]);
                    }
                }
            }
        };

        RexSection.prototype.setNeighbouroodFix = function() {
            for(var j = 0; j < this.blocks_to_compare.length; j++) {
                for(var i = 0; i < this.blocks_to_compare[j].neighbourghs.length; i++) {
                    if(this.blocks_to_compare[j].neighbourghs[i].height_to_add < this.blocks_to_compare[j].height_to_add) {
                        this.blocks_to_compare[j].neighbourghs[i].height_to_add = this.blocks_to_compare[j].height_to_add;
                    }
                }
            }
        };

        RexSection.prototype.newFixHeights = function() {
            var unit_block = this.sectionReference.perfectGridGallery('getSingleWidth');
            var unit_separator = this.sectionReference.perfectGridGallery('getSeparator');

            for(var i = 0; i < this.blocks.length; i++) {
                if(this.blocks[i].height_to_add > 0) {
                    this.blocks[i].setBlockHeight( this.blocks[i].block_height + this.blocks[i].height_to_add );

                    var x = ( this.blocks[i].block_height * unit_block ) - unit_separator;
                    // var x = $(this.blocks[i].element_reference).height() + ( ( unit_block * this.blocks[i].height_to_add ) ); // OLD SETTING

                    // $(this.blocks[i].element_reference).height( $(this.blocks[i].element_reference).height() + ( ( unit_block * this.blocks[i].height_to_add ) ) );
                    $(this.blocks[i].element_reference).height( x );

                    // console.log('altezza calcolata', x);
                    // console.log('altezza blocco',$(this.blocks[i].element_reference).height());
                }
            }

            var foo = this.sectionReference;

            // setTimeout(function() {
            foo.perfectGridGallery('relayoutGrid');
            // },200); // THIS must correspond to the height transition
        };

        /**
         *  Check if the proportion of the grid is maintained
         */
        RexSection.prototype.checkResize = function() {
            return ((this.workingSectionArea - this.initialSectionArea) % 12);
        };

        /**
         *  Calculate runtime section area
         */
        RexSection.prototype.calculateWorkingSectionArea = function() {
            this.workingSectionArea = 0;
            var i = 0;
            for(i=0; i<this.blocks.length; i++) {
                this.workingSectionArea += this.blocks[i].workingBlockArea;
            }
        };

        /**
         *  Update the height in case of resize of the window
         */
        RexSection.prototype.updateHeights = function() {
            this.steps = 0;

            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].setInitialState();
                this.blocks[i].clearNeighborhood();
            }

            this.sectionReference.perfectGridGallery('recalculateBlocks');

            for(var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].calculateHeights();
                this.blocks[i].compare();
            }

            this.findBlocksToCompare();
            this.findSteps();
            this.markBlocks();

            // this.findModVals();

            // this.fixHeights();
            this.setNeighbouroodFix();
            this.newFixHeights();
        };

        var _viewport = function() {
            var e = window, a = 'inner';
            if (!('innerWidth' in window )) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
        };

        // Public functions

        this.init(element, options);
    };

    $.fn.textResize = function(options) {
        return this.each(function() {
            (new $.textResize($(this), options));
        });
    };

    //Private functions

    $.textResize.defaultOptions = {
        viewportsizestart: 768,
        blockSelector: 'perfect-grid-item',
        containerSelector: '',
        contentSelector: 'text-wrap',
    };

})( jQuery, window, document );
