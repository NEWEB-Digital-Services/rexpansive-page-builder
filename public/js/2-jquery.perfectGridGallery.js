/*
 *  Perfect Grid Gallery
 */

;( function( $, window, document, undefined ) {

    "use strict";

    // Create the defaults once
    var pluginName = "perfectGridGallery",
        defaults = {
          itemSelector: '.perfect-grid-item',
          gridItemWidth: 0.0833333333,
          gridSizerSelector: '.perfect-grid-sizer',
          galleryLayout: 'fixed',
          separator: 20,
          fullHeight: 'false',
          gridParentWrap: '.rexpansive_section',
          mobilePadding: 'false',
        };

    // The actual plugin constructor
    function pefectGridGallery ( element, options ) {
        this.element = element;

        this.$element = $(element);
        // attach data info to expose it
        // $(this.element).data('perfectGridGallery', this);

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.properties = {
            halfSeparator: 0,
            wrapWidth: 0,
            singleWidth: 0,
            gridTotalArea: 0,
            gridActive: false,
            paddingTopBottom: false,
            setMobilePadding: false,
            setDesktopPadding: false,
            gridTopSeparator: null,
            gridRightSeparator: null,
            gridBottomSeparator: null,
            gridLeftSeparator: null,
            elementResizeEvent: false,
        };
        this.isotopeSettings = {
            itemSelector: '',
            masonry: null,
            percentPosition: false,
            // transitionDuration: 0,
            // animationEngine: 'jquery',
        };
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( pefectGridGallery.prototype, {
        init: function() {
            console.log('launching normal grid');
            
            this._defineDataSettings();
            this._definePrivateProperties();

            this._setGridPadding();

            this._defineDynamicPrivateProperties();

            this._defineIsotopeSettings();


            this._calculateBlockHeight();
            this._launchIsotope();

            $(window).on('resize', { Gallery: this }, function( event ) {
                var G = event.data.Gallery;
                G._setGridPadding();

                G._defineDynamicPrivateProperties();

                G._calculateBlockHeight();
                G._launchIsotope();
            });
            $(window).on('load', { Gallery: this }, function (event) {
                ;
            });
        },

        refreshGrid: function() {
            // console.log('refreshGrid');
            // console.log(this.$element);

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._calculateBlockHeight();
            this._launchIsotope();

            var G = this;
            this.$element.packery('layout');
            $('.perfect-grid-item').each(function () {
                console.log('refreshing item');
                G.fitLayoutGrid(this);
            });
        },

        destroyGrid: function() {
            $(window).off('resize');
            this.$element.isotope('destroy');
        },

        recalculateBlocks: function() {

            this.properties.wrapWidth = Math.round( this.$element.width() );
            this.properties.singleWidth = Math.round( this.properties.wrapWidth * this.settings.gridItemWidth );

            this._calculateBlockHeightFixed();
        },

        relayoutGrid: function() {
            //console.log('parte relayout');
            // this.$element.isotope('reloadItems');
            this.$element.isotope('layout');

            this.$element.trigger('relayoutComplete');
        },

        cleanLayoutGrid: function() {
            this.$element.isotope('layout');
            // this.$element.trigger('rearrangeComplete');
        },

        // insert elements in the isotope grid and reload the items according to perfectGridGallery
        insertInGrid: function(elems, callback) {

          this.properties.setDesktopPadding = false;
          this.properties.setMobilePadding = false;

          this.$element.isotope('insert', elems);

          this._defineDynamicPrivateProperties();

          this._setGridPadding();

          this._calculateBlockHeight();

          this.$element.isotope('layout');

          //this.$element.trigger('elementsInserted');
          if( typeof callback === 'function' ) {
              callback.call();
          }
        },

        // Get methods
        getSingleWidth: function() {
            return this.properties.singleWidth;
        },

        getSeparator: function() {
            return this.settings.separator;
        },

        setProperty: function(definition) {
          this.properties[definition[0]] = definition[1];
        },

        updateElementProperty: function ($elem, $case) {
            var width = this.properties.singleWidth;
            var block = $($elem)[0];

            switch ($case) {
                case 'x': {
                    var x = parseInt(block['attributes']['data-row'].value);
                    var nX = Math.round(parseInt($(block).position().top) / width);
                    if (nX <= 0) {
                        nX = 0;
                    }
                    nX = nX + 1;
                    block['attributes']['data-row'].value = nX;
                    break;
                }
                case 'y': {
                    var y = parseInt(block['attributes']['data-col'].value);
                    var nY = Math.round(parseInt($(block).position().left) / width);
                    if (nY <= 0) {
                        nY = 0;
                    }
                    nY = nY + 1;

                    if (nY > 12) {
                        nY = 12;
                    }
                    block['attributes']['data-col'].value = nY;
                    break;
                }
                case 'w': {
                    var w = parseInt(block['attributes']['data-width'].value);
                    var nW = Math.round(parseInt($(block).outerWidth()) / width);
                    if (nW <= 0) {
                        nW = 1;
                    }
                    block['attributes']['data-width'].value = nW;
                    // updating element class
                    $(block).removeClass("w" + w);
                    $(block).addClass("w" + nW);
                    break;
                }
                case 'h': {
                    var h = parseInt(block['attributes']['data-height'].value);
                    var nH = Math.round(parseInt($(block).outerHeight()) / width);
                    if (nH <= 0) {
                        nH = 1;
                    }
                    block['attributes']['data-height'].value = nH;
                    break;
                }
                default: {
                    break;
                }
            }
        },

        // Override options set by the jquery call with the html data attributes, if presents
        _defineDataSettings: function() {
            if( 'undefined' != typeof this.$element.data('separator') ) {
                this.settings.separator = parseInt(this.$element.data('separator'));
            }
            if( 'undefined' != typeof this.$element.data('layout') ) {
                this.settings.galleryLayout = this.$element.data('layout').toString();
            }
            if( 'undefined' != typeof this.$element.data('full-height') ) {
                this.settings.fullHeight = this.$element.data('full-height').toString();
            }
            if( 'undefined' != typeof this.$element.data('mobile-padding') ) {
              this.settings.mobilePadding = this.$element.data('mobile-padding').toString();
            }
        },

        // Define usefull private proerties
        _defineDynamicPrivateProperties: function() {
            this.properties.wrapWidth = Math.round( this.$element.width() );
            this.properties.singleWidth = Math.round( this.properties.wrapWidth * this.settings.gridItemWidth );

            if(this.settings.fullHeight == 'true') {
                this.properties.gridTotalArea = this._calculateArea();
            }
        },

        _definePrivateProperties: function() {
            this.properties.halfSeparator = Math.round( this.settings.separator / 2 );
            this.properties.paddingTopBottom = this._check_parent_class('distance-block-top-bottom');

            this.properties.gridTopSeparator = ( 'undefined' !== typeof this.$element.attr('data-row-separator-top') ? parseInt( this.$element.attr('data-row-separator-top') ) : null );
            this.properties.gridRightSeparator =  ( 'undefined' !== typeof this.$element.attr('data-row-separator-right') ? parseInt( this.$element.attr('data-row-separator-right') ) : null );
            this.properties.gridBottomSeparator = ( 'undefined' !== typeof this.$element.attr('data-row-separator-bottom') ? parseInt( this.$element.attr('data-row-separator-bottom') ) : null );
            this.properties.gridLeftSeparator = ( 'undefined' !== typeof this.$element.attr('data-row-separator-left') ? parseInt( this.$element.attr('data-row-separator-left') ) : null );
        },

        // Calcualte viewport area to implement full height feature
        _calculateArea: function() {
            var temp_area = 0;

            this.$element.find(this.settings.itemSelector).each(function() {
                var $this = $(this);
                temp_area += parseInt($this.attr('data-height')) * parseInt($this.attr('data-width'));
            });

            return temp_area;
        },

        // define Packery Settings
        _definePackerySettings: function () {
            this.packerySettings.itemSelector = this.settings.itemSelector;
            this.packerySettings.columnWidth = this.settings.gridSizerSelector;
            this.packerySettings.rowHeight = this.settings.gridSizerSelector;
            this.packerySettings.percentPosition = true;
            this.packerySettings.gutter = 0;
        },

        _setGutter: function () {
            if (this.isEven(this.properties.gutter)) {
                this.properties.halfSeparatorElementTop = this.properties.gutter / 2;
                this.properties.halfSeparatorElementRight = this.properties.gutter / 2;
                this.properties.halfSeparatorElementBottom = this.properties.gutter / 2;
                this.properties.halfSeparatorElementLeft = this.properties.gutter / 2;
            } else {
                this.properties.halfSeparatorElementTop = Math.floor(this.properties.gutter / 2);
                this.properties.halfSeparatorElementRight = Math.ceil(this.properties.gutter / 2);
                this.properties.halfSeparatorElementBottom = Math.floor(this.properties.gutter / 2);
                this.properties.halfSeparatorElementLeft = Math.ceil(this.properties.gutter / 2);
            }
        },

        _fixHeightAllElements: function () {
            var Gallery = this;
            Gallery.$element.find(Gallery.settings.itemSelector).each(function () {
                Gallery._fixHeightElement(this);
            });
        },

        _updateElementPadding: function ($elem) {
            $($elem).css('width', "");
            $($elem).css('padding-left', this.properties.halfSeparatorElementLeft);
            $($elem).css('padding-top', this.properties.halfSeparatorElementTop);
            $($elem).css('padding-bottom', this.properties.halfSeparatorElementBottom);
            $($elem).css('padding-right', this.properties.halfSeparatorElementRight);
        },

        _fixHeightElement: function ($elem) {
            var h = this.properties.singleWidth * parseInt($($elem).attr('data-height'));
            $($elem).outerHeight(h);
            this._updateElementPadding($elem);
        },

        // Calculate fixed blocks height
        _calculateBlockHeightFixed: function () {
            //console.log('calculating block height');
            var Gallery = this;
            this.$element.find(this.settings.itemSelector + ':not(.horizontal-carousel):not(.wrapper-expand-effect)')
                .add(this.$element.find(this.settings.itemSelector + '.only-gallery'))
                .each(function () {
                    // console.log($(this).attr('id'), '->', $(this).attr('data-height'));
                    $(this).height((Gallery.properties.singleWidth * $(this).attr('data-height')) - (Gallery.properties.halfSeparator * 2));
                });
        },

        _saveStateElements: function () {
            var $items = this.$element.find('.perfect-grid-item');
            $items.each(function () {
                store.set(this['id'], {
                    "properties": [
                        { "x": this['attributes']['data-row'].value },
                        { "y": this['attributes']['data-col'].value },
                        { "w": this['attributes']['data-width'].value },
                        { "h": this['attributes']['data-height'].value }
                    ]
                });
            });
        },

        // Launching Packery plugin
        _launchPackery: function () {

            var Gallery = this;
            var $container = this.$element.packery(this.packerySettings);
            var $items = this.$element.find('.perfect-grid-item');

            $items.each(function () {
                $(this).draggable({
                    stop: function () {
                        Gallery.updateAllElementsXYproperties();
                    }
                });
            });

            // bind drag events to Packery
            this.$element.packery('bindUIDraggableEvents', $items);
            // packery is ready
            Gallery.properties.packeryReady = true;
        },

        _setParentGridPadding: function () {
            var $parent = $(this.$element.parent());
            //console.log('setting grid padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                //console.log('setting grid padding');
                this.properties.setDesktopPadding = true;
                if( this._check_parent_class("rex-block-grid") ) {
                    this.properties.setMobilePadding = true;
                } else {
                    this.properties.setMobilePadding = false;
                }

                if( null !== this.properties.gridTopSeparator ) {
                    this.$element.css( 'margin-top', this.properties.gridTopSeparator - this.properties.halfSeparator );
                } else {
                    this.$element.css( 'margin-top', this.properties.halfSeparator );
                }

                if( null !== this.properties.gridBottomSeparator ) {
                    this.$element.css( 'margin-bottom', this.properties.gridBottomSeparator - this.properties.halfSeparator );
                } else {
                    this.$element.css( 'margin-bottom', this.properties.halfSeparator );
                }

                if( !this.properties.paddingTopBottom ) {

                    if( null !== this.properties.gridLeftSeparator ) {
                      this.$element.css( 'margin-left', this.properties.gridLeftSeparator - this.properties.halfSeparator );
                    } else {
                      this.$element.css( 'margin-left', this.properties.halfSeparator );
                    }

                    if( null !== this.properties.gridRightSeparator ) {
                      this.$element.css( 'margin-right', this.properties.gridRightSeparator - this.properties.halfSeparator );
                    } else {
                      this.$element.css( 'margin-right', this.properties.halfSeparator );
                    }
                }

                if(this.$element.find( this.settings.itemSelector ).hasClass('wrapper-expand-effect')) {
                  this.$element.find( this.settings.itemSelector ).css( 'padding-bottom', this.properties.halfSeparator );
                  this.$element.find( this.settings.itemSelector ).css( 'padding-left', this.properties.halfSeparator );
                  this.$element.find( this.settings.itemSelector ).css( 'padding-right', this.properties.halfSeparator );
                } else {

                    if( this.properties.paddingTopBottom ) {
                      this.$element.find( this.settings.itemSelector ).css( 'padding-top', this.properties.halfSeparator );
                      this.$element.find( this.settings.itemSelector ).css( 'padding-bottom', this.properties.halfSeparator );
                    } else {
                      this.$element.find( this.settings.itemSelector ).css( 'padding', this.properties.halfSeparator );
                    }
                }

            } else if( this._viewport().width < 768 && !this.properties.setMobilePadding && !this._check_parent_class("rex-block-grid") ) {
                this.properties.setMobilePadding = true;
                this.properties.setDesktopPadding = false;

                if( 'false' == this.settings.mobilePadding ) {
                  this.$element.find( this.settings.itemSelector ).css( 'padding-top', this.properties.halfSeparator );
                  this.$element.find( this.settings.itemSelector ).css( 'padding-bottom', this.properties.halfSeparator );
                  this.$element.find( this.settings.itemSelector ).css( 'padding-left', 0 );
                  this.$element.find( this.settings.itemSelector ).css( 'padding-right', 0 );
                } else if( 'true' == this.settings.mobilePadding ) {
                  this.$element.find( this.settings.itemSelector ).css( 'padding', this.properties.halfSeparator );
                }
            }
        },

        // Calculate the height of the blocks, depending on viewport size, and gallery type
        _calculateBlockHeight: function() {

            if( this.settings.galleryLayout == 'fixed' ) {
              if(this._viewport().width >= 768 || this._check_parent_class("rex-block-grid") ) {
                if(this.settings.fullHeight == 'false') {
                    this._calculateBlockHeightFixed();
                } else {;
                    // console.log('bbb');
                    var wrap_height = this._viewport().height;

                    this.properties.singleWidth = wrap_height / ( this.properties.gridTotalArea / 12 );

                    this._calculateBlockHeightFixed();
                }
              }
            } else if( this.settings.galleryLayout == 'masonry' ) {
                this._calculateBlockHeightMasonry();
            }
        },

        // Calculate fixed blocks height
        _calculateBlockHeightFixed: function() {
            var Gallery = this;
            this.$element.find(this.settings.itemSelector + ':not(.horizontal-carousel):not(.wrapper-expand-effect)')
                .add(this.$element.find(this.settings.itemSelector + '.only-gallery'))
                .each(function() {
                    // console.log($(this).attr('id'), '->', $(this).attr('data-height'));
                    $(this).height( ( Gallery.properties.singleWidth * $(this).attr('data-height') ) - ( Gallery.properties.halfSeparator * 2 ) );
            });
        },

        // Calculate masonry blocks height
        _calculateBlockHeightMasonry: function() {
            var Gallery = this;
            this.$element.find(this.settings.itemSelector + ' .empty-content')
                .add(this.$element.find(this.settings.itemSelector + ' .image-content :not(.text-wrap)'))
                .add(this.$element.find(this.settings.itemSelector + '.only-background').children())
                .add(this.$element.find(this.settings.itemSelector + '.block-has-slider').children())
                .each(function() {
                    var $this = $(this);
                    if( $this.css('background-image') != 'none' || $this.hasClass('empty-content') || ( $this.css('background-color') != 'none' && $this.find('img').length === 0 ) || $this.hasClass('block-has-slider') ) {
                        var gridHeight = Gallery.properties.singleWidth * $this.parents(Gallery.settings.itemSelector).attr('data-height') - ( Gallery.properties.halfSeparator * 2 );
                        $this.height(gridHeight);
                        if($this.parent().hasClass('only-color-background')) {
                            $this.parent().height(gridHeight);
                        }
                    }
            });
        },

        // Calculate the viewport of the window
        _viewport: function() {
            var e = window, a = 'inner';
            if (!('innerWidth' in window )) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
        },

        // check if the parent wrap of the grd has a particular class
        _check_parent_class: function( c ) {
            if( this.$element.parents( this.settings.gridParentWrap ).hasClass( c ) ) {
                return true;
            } else {
                return false;
            }
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new pefectGridGallery( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                if (instance instanceof pefectGridGallery && typeof instance[options] === 'function') {
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
} )( jQuery, window, document );
