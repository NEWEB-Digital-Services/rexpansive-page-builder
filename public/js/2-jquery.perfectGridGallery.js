/*
 *  Perfect Grid Gallery
 */

; (function ($, window, document, undefined) {

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
    function perfectGridGallery(element, options) {
        console.log('creating object');
        this.element = element;

        this.$element = $(element);
        // attach data info to expose it
        // $(this.element).data('perfectGridGallery', this);

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
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
        this.packerySettings = {
            itemSelector: '',
            masonry: null,
            percentPosition: false,
        };
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(perfectGridGallery.prototype, {
        init: function () {
            this._defineDataSettings();

            this._definePrivateProperties();

            this._setGridPadding();

            this._defineDynamicPrivateProperties();

            this._definepackerySettings();

            this._calculateBlockHeight();
            
            this._launchPackery();

            this.$element.on('layoutComplete', function () {
                //console.log('layout complete');
            });

            $(window).on('load',
                { Gallery: this },
                function (event) {
                    var G = event.data.Gallery;
                    setTimeout(function () {
                        //console.log('relayouting grid');
                        G.relayoutGrid();
                    }, 400);
                });
        },

        refreshGrid: function () {
            // console.log('refreshGrid');
            // console.log(this.$element);
            // console.log('refreshGrid');

            this._defineDynamicPrivateProperties();

            //this._setGridPadding();

            this._calculateBlockHeight();
            this._launchPackery();

            var G = this;

            // this.$element.Packery('layout');

            setTimeout(function () {
                //console.log('refreshing grid');
                // G.$element.Packery('layout');
                G.relayoutGrid();
                G.$element.trigger('rearrangeComplete');
                G.$element.trigger('refreshComplete');
            }, 400);
        },

        reLaunchGrid: function () {
            //console.log('relaunch packey 0');
            //console.log(this.packerySettings);
            this.$element.packery(this.packerySettings);
        },

        destroyGrid: function () {
           // console.log('destroying packery');
            $(window).off('resize');
            this.$element.packery('destroy');
        },

        recalculateBlocks: function () {
            //console.log('recalculate block');
            this.properties.wrapWidth = Math.round(this.$element.width());
            this.properties.singleWidth = Math.round(this.properties.wrapWidth * this.settings.gridItemWidth);

            this._calculateBlockHeightFixed();
        },

        relayoutGrid: function () {
            //console.log('parte relayout');
            // this.$element.Packery('reloadItems');
            //console.log('relayoutGrid');
            //this.$element.packery('layout');
            //this.$element.trigger('relayoutComplete');
        },

        cleanLayoutGrid: function () {
            //console.log('cleanLayoutGrid');
            //this.$element.packery('layout');
            // this.$element.trigger('rearrangeComplete');
        },

        // insert elements in the Packery grid and reload the items according to perfectGridGallery
        insertInGrid: function (elems, callback) {
            //console.log('InsertElement');
            this.properties.setDesktopPadding = false;
            this.properties.setMobilePadding = false;
            //console.log(elems);
            // append items to grid
            $grid.append( $items );

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._calculateBlockHeight();

            this.$element.packery( 'appended', $items );

            //this.$element.trigger('elementsInserted');
            if (typeof callback === 'function') {
                callback.call();
            }
        },

        // Get methods
        getSingleWidth: function () {
            //console.log('getWidth');
            return this.properties.singleWidth;
        },

        getSeparator: function () {
            //console.log('getSeparator');
            return this.settings.separator;
        },

        setProperty: function (definition) {
            //console.log('setting properties');
            //console.log(definition);
            this.properties[definition[0]] = definition[1];
        },

        setPackeryProperty: function (definition) {
            var obj = {};
            obj[definition[0]] = definition[1];

            //console.log(definition);
            //console.log('defining properties');
            this.$element.packery(obj);
        },

        // Override options set by the jquery call with the html data attributes, if presents
        _defineDataSettings: function () {
            //console.log('defining data Settings');
            if ('undefined' != typeof this.$element.data('separator')) {
                this.settings.separator = parseInt(this.$element.data('separator'));
            }
            if ('undefined' != typeof this.$element.data('layout')) {
                this.settings.galleryLayout = this.$element.data('layout').toString();
            }
            if ('undefined' != typeof this.$element.data('full-height')) {
                this.settings.fullHeight = this.$element.data('full-height').toString();
            }
            if ('undefined' != typeof this.$element.data('mobile-padding')) {
                this.settings.mobilePadding = this.$element.data('mobile-padding').toString();
            }
        },

        // Define usefull private properties
        _defineDynamicPrivateProperties: function () {
            //console.log('defining dynamic Properties');
            this.properties.wrapWidth = Math.round(this.$element.width());
            //console.log('wrap width');
            //console.log(this.properties.wrapWidth);
            this.properties.singleWidth = Math.round(this.properties.wrapWidth * this.settings.gridItemWidth);
            //console.log(this.properties.singleWidth);

            if (this.settings.fullHeight == 'true') {
                this.properties.gridTotalArea = this._calculateArea();
            }
        },

        _definePrivateProperties: function () {
            //console.log('defininfg private properties');
            this.properties.halfSeparator = Math.round(this.settings.separator / 2);
            this.properties.paddingTopBottom = this._check_parent_class('distance-block-top-bottom');

            this.properties.gridTopSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-top') ? parseInt(this.$element.attr('data-row-separator-top')) : null);
            this.properties.gridRightSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-right') ? parseInt(this.$element.attr('data-row-separator-right')) : null);
            this.properties.gridBottomSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-bottom') ? parseInt(this.$element.attr('data-row-separator-bottom')) : null);
            this.properties.gridLeftSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-left') ? parseInt(this.$element.attr('data-row-separator-left')) : null);
        },

        // Calcualte viewport area to implement full height feature
        _calculateArea: function () {
            var temp_area = 0;
            //console.log('calculating area');
            this.$element.find(this.settings.itemSelector).each(function () {
                var $this = $(this);
                temp_area += parseInt($this.attr('data-height')) * parseInt($this.attr('data-width'));
            });

            return temp_area;
        },

        // define Packery Settings
        _definepackerySettings: function () {
            //console.log('defining Packery settings');
            this.packerySettings.itemSelector = this.settings.itemSelector;
            this.packerySettings.masonry = null
            /*{
                columnWidth: this.settings.gridSizerSelector
            }*/;
        },

        // Launching Packery plugin
        _launchPackery: function () {
            console.log('creating packery');
            //console.log(this.packerySettings);
            var $settings = [];// = this.packerySettings;
            console.log('old settings');
            console.log($settings);
            $settings['gutter'] = 10;
            $settings['columnWidth'] = 60;
            $settings['rowHeight'] = 60;
            console.log('new settings');
            console.log($settings);
            var $container = this.$element.packery($settings);
            var $items = this.$element.find('.perfect-grid-item');

            $items.each(function () {
                console.log($settings['columnWidth']);
                $(this).resizable({
                    grid: $settings['columnWidth'],
                    resize: function () {
                        console.log('resizing');
                    }
                }); 
                $(this).draggable({
                    stop: function () {
                        console.log('end dragging');
                    }
                });
            });

            var resizeTimeout;
            $items.on('resize', function( event, ui ) {
                //console.log('resizZzZzing');
              // debounce
              if ( resizeTimeout ) {
                clearTimeout( resizeTimeout );
              }
            
              resizeTimeout = setTimeout( function() {
                $container.packery( 'fit', ui.element[0] );
              }, 100 );
            });
            // bind drag events to Packery
            this.$element.packery('bindUIDraggableEvents', $items);

            //this.properties.gridActive = true;
        },

        // setting the blocks and wrap padding
        _setGridPadding: function () {
            //console.log('setting grid padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                this.properties.setDesktopPadding = true;
                if (this._check_parent_class("rex-block-grid")) {
                    this.properties.setMobilePadding = true;
                } else {
                    this.properties.setMobilePadding = false;
                }

                if (null !== this.properties.gridTopSeparator) {
                    this.$element.css('margin-top', this.properties.gridTopSeparator - this.properties.halfSeparator);
                } else {
                    this.$element.css('margin-top', this.properties.halfSeparator);
                }

                if (null !== this.properties.gridBottomSeparator) {
                    this.$element.css('margin-bottom', this.properties.gridBottomSeparator - this.properties.halfSeparator);
                } else {
                    this.$element.css('margin-bottom', this.properties.halfSeparator);
                }

                if (!this.properties.paddingTopBottom) {

                    if (null !== this.properties.gridLeftSeparator) {
                        this.$element.css('margin-left', this.properties.gridLeftSeparator - this.properties.halfSeparator);
                    } else {
                        this.$element.css('margin-left', this.properties.halfSeparator);
                    }

                    if (null !== this.properties.gridRightSeparator) {
                        this.$element.css('margin-right', this.properties.gridRightSeparator - this.properties.halfSeparator);
                    } else {
                        this.$element.css('margin-right', this.properties.halfSeparator);
                    }
                }

                if (this.$element.find(this.settings.itemSelector).hasClass('wrapper-expand-effect')) {
                    this.$element.find(this.settings.itemSelector).css('padding-bottom', this.properties.halfSeparator);
                    this.$element.find(this.settings.itemSelector).css('padding-left', this.properties.halfSeparator);
                    this.$element.find(this.settings.itemSelector).css('padding-right', this.properties.halfSeparator);
                } else {

                    if (this.properties.paddingTopBottom) {
                        this.$element.find(this.settings.itemSelector).css('padding-top', this.properties.halfSeparator);
                        this.$element.find(this.settings.itemSelector).css('padding-bottom', this.properties.halfSeparator);
                    } else {
                        this.$element.find(this.settings.itemSelector).css('padding', this.properties.halfSeparator);
                    }
                }

            } else if (this._viewport().width < 768 && !this.properties.setMobilePadding && !this._check_parent_class("rex-block-grid")) {
                this.properties.setMobilePadding = true;
                this.properties.setDesktopPadding = false;

                if ('false' == this.settings.mobilePadding) {
                    this.$element.find(this.settings.itemSelector).css('padding-top', this.properties.halfSeparator);
                    this.$element.find(this.settings.itemSelector).css('padding-bottom', this.properties.halfSeparator);
                    this.$element.find(this.settings.itemSelector).css('padding-left', 0);
                    this.$element.find(this.settings.itemSelector).css('padding-right', 0);
                } else if ('true' == this.settings.mobilePadding) {
                    this.$element.find(this.settings.itemSelector).css('padding', this.properties.halfSeparator);
                }
            }
        },

        // Calculate the height of the blocks, depending on viewport size, and gallery type
        _calculateBlockHeight: function () {
            //console.log('calculating height');
            if (this.settings.galleryLayout == 'fixed') {
                if (this._viewport().width >= 768 || this._check_parent_class("rex-block-grid")) {
                    if (this.settings.fullHeight == 'false') {
                        this._calculateBlockHeightFixed();
                    } else {
                        ;
                        // console.log('bbb');
                        var wrap_height = this._viewport().height;

                        this.properties.singleWidth = wrap_height / (this.properties.gridTotalArea / 12);

                        this._calculateBlockHeightFixed();
                    }
                }
            } else if (this.settings.galleryLayout == 'masonry') {
                this._calculateBlockHeightMasonry();
            }
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

        // Calculate masonry blocks height
        _calculateBlockHeightMasonry: function () {
            //console.log('calculating block height masonry');
            var Gallery = this;
            this.$element.find(this.settings.itemSelector + ' .empty-content')
                .add(this.$element.find(this.settings.itemSelector + ' .image-content :not(.text-wrap)'))
                .add(this.$element.find(this.settings.itemSelector + '.only-background').children())
                .add(this.$element.find(this.settings.itemSelector + '.block-has-slider').children())
                .each(function () {
                    var $this = $(this);
                    if ($this.css('background-image') != 'none' || $this.hasClass('empty-content') || ($this.css('background-color') != 'none' && $this.find('img').length === 0) || $this.hasClass('block-has-slider')) {
                        var gridHeight = Gallery.properties.singleWidth * $this.parents(Gallery.settings.itemSelector).attr('data-height') - (Gallery.properties.halfSeparator * 2);
                        $this.height(gridHeight);
                        if ($this.parent().hasClass('only-color-background')) {
                            $this.parent().height(gridHeight);
                        }
                    }
                });
        },

        // Calculate the viewport of the window
        _viewport: function () {
            var e = window, a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return { width: e[a + 'Width'], height: e[a + 'Height'] };
        },

        // check if the parent wrap of the grd has a particular class
        _check_parent_class: function (c) {
            if (this.$element.parents(this.settings.gridParentWrap).hasClass(c)) {
                return true;
            } else {
                return false;
            }
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new perfectGridGallery(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                if (instance instanceof perfectGridGallery && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
})(jQuery, window, document);
