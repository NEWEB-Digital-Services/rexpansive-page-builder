/*
 *  Perfect Grid Gallery
 */

; (function ($, window, document, undefined) {

    "use strict";

    var elementIsResizing;

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
            halfSeparatorTop: 0,
            halfSeparatorRight: 0,
            halfSeparatorBottom: 0,
            halfSeparatorLeft: 0,
            halfSeparatorElementTop: 0,
            halfSeparatorElementRight: 0,
            halfSeparatorElementBottom: 0,
            halfSeparatorElementLeft: 0,
            gridTopSeparator: null,
            gridRightSeparator: null,
            gridBottomSeparator: null,
            gridLeftSeparator: null,
            wrapWidth: 0,
            singleWidth: 0,
            gridTotalArea: 0,
            gridActive: false,
            paddingTopBottom: false,
            setMobilePadding: false,
            setDesktopPadding: false,
            elementResizeEvent: false,
            gutter: 0,
            packeryReady: false
        };
        this.packerySettings = {
            itemSelector: '',
            columnWidth: 0,
            rowHeight: 0,
            gutter: 0,
            percentPosition: false
        };
        this.elementIsResizing = false;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(perfectGridGallery.prototype, {
        init: function () {
            
            this._saveElementsState();

            this._defineDataSettings();

            this._setGutter();

            this._definePackerySettings();

            this._definePrivateProperties();

            this._setGridPadding();

            this._defineDynamicPrivateProperties();

            this._fixSize();

            this._launchPackery();


            this.$element.on('layoutComplete', function () {
                //console.log('layout complete');
            });

            $(window).on('resize', { Gallery: this }, function (event) {
                
                if (!event.data.Gallery.elementIsResizing) {
                    event.data.Gallery._defineDynamicPrivateProperties();
                    event.data.Gallery._fixSize();
                }
            });

            $(window).on('load', { Gallery: this }, function (event) {
                var G = event.data.Gallery;
                setTimeout(function () {
                    //G.relayoutGrid();
                }, 400);
            });
        },

        refreshGrid: function () {

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

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
            this.$element.packery(this.packerySettings);
        },

        destroyGrid: function () {
            $(window).off('resize');
            this.$element.packery('destroy');
        },

        recalculateBlocks: function () {
            /* this.properties.wrapWidth = Math.round(this.$element.innerWidth());
            this.properties.singleWidth = Math.round(this.properties.wrapWidth * this.settings.gridItemWidth);

            this._calculateBlockHeightFixed(); */
        },

        relayoutGrid: function () {
            //console.log('parte relayout');
            // this.$element.Packery('reloadItems');
            //console.log('relayoutGrid');
            //this.$element.packery('layout');
            //this.$element.trigger('relayoutComplete');
        },

        cleanLayoutGrid: function () {
            this.$element.packery('layout');
            //this.$element.trigger('rearrangeComplete');
        },

        // insert elements in the Packery grid and reload the items according to perfectGridGallery
        insertInGrid: function (elems, callback) {

            this.properties.setDesktopPadding = false;
            this.properties.setMobilePadding = false;

            // append items to grid

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._calculateBlockHeight();

            this.$element.packery('appended', $items);

            if (typeof callback === 'function') {
                callback.call();
            }
        },

        // Get methods
        getSingleWidth: function () {
            return this.properties.singleWidth;
        },

        getSeparator: function () {
            return this.properties.gutter;
        },

        setProperty: function (definition) {
            this.properties[definition[0]] = definition[1];
        },

        setPackeryProperty: function (definition) {
            var obj = {};
            obj[definition[0]] = definition[1];
            this.$element.packery(obj);
        },

        isEven: function (number) {
            return number % 2 == 0;
        },

        saveElementNewProperties: function($elem) {
            var width = this.properties.singleWidth;
            var block = $($elem)[0];
            var x = block['attributes']['data-row'].value,
                y = block['attributes']['data-col'].value,
                w = block['attributes']['data-width'].value,
                h = block['attributes']['data-height'].value;

            var nX = Math.round(parseInt($(block).position().left) / width),
                nY = Math.round(parseInt($(block).position().top) / width),
                nW = Math.round(parseInt($(block).outerWidth()) / width),
                nH = Math.round(parseInt($(block).outerHeight()) / width);

            if (nX === 0) {
                nX = 1;
            }
            if (nY === 0) {
                nY = 1;
            }
            
            if (nW === 0) {
                nW = 1;
            }
            
            if (nH === 0) {
                nH = 1;
            }
            
            block['attributes']['data-row'].value = nX;
            block['attributes']['data-col'].value = nY;
            block['attributes']['data-width'].value = nW;
            block['attributes']['data-height'].value = nH;

            // updating element class
            $(block).removeClass("w" + w);
            $(block).addClass("w" + nW);
        },

        // Override options set by the jquery call with the html data attributes, if presents
        _defineDataSettings: function () {

            if ('undefined' != typeof this.$element.data('separator')) {
                this.properties.gutter = parseInt(this.$element.data('separator'));
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
            this.properties.wrapWidth = Math.floor(this.$element.innerWidth());

            this.properties.singleWidth = Math.floor(this.properties.wrapWidth * this.settings.gridItemWidth);

            if (this.settings.fullHeight == 'true') {
                this.properties.gridTotalArea = this._calculateArea();
            }
        },

        _definePrivateProperties: function () {
            //console.log('defininfg private properties');
            if (this.isEven(this.properties.gutter)) {
                this.properties.halfSeparatorTop = this.properties.gutter / 2;
                this.properties.halfSeparatorRight = this.properties.gutter / 2;
                this.properties.halfSeparatorBottom = this.properties.gutter / 2;
                this.properties.halfSeparatorLeft = this.properties.gutter / 2;
            } else {
                this.properties.halfSeparatorTop = Math.ceil(this.properties.gutter / 2);
                this.properties.halfSeparatorRight = Math.floor(this.properties.gutter / 2);
                this.properties.halfSeparatorBottom = Math.floor(this.properties.gutter / 2);
                this.properties.halfSeparatorLeft = Math.ceil(this.properties.gutter / 2);
            }

            this.properties.paddingTopBottom = this._check_parent_class('distance-block-top-bottom');

            this.properties.gridTopSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-top') ? parseInt(this.$element.attr('data-row-separator-top')) : null);
            this.properties.gridRightSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-right') ? parseInt(this.$element.attr('data-row-separator-right')) : null);
            this.properties.gridBottomSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-bottom') ? parseInt(this.$element.attr('data-row-separator-bottom')) : null);
            this.properties.gridLeftSeparator = ('undefined' !== typeof this.$element.attr('data-row-separator-left') ? parseInt(this.$element.attr('data-row-separator-left')) : null);
            /* 
            console.log("top: "+this.properties.gridTopSeparator);
            console.log("left: "+this.properties.gridLeftSeparator);
            console.log("right: "+this.properties.gridRightSeparator);
            console.log("bottom: "+this.properties.gridBottomSeparator);  */
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
        _definePackerySettings: function () {
            //console.log(this.settings.);
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

        _fixSize: function () {
            var Gallery = this;
            Gallery.$element.find(Gallery.settings.itemSelector).each(function () {
                var h = Gallery.properties.singleWidth * parseInt($(this).attr('data-height'));

                $(this).outerHeight(h);

                $(this).css('width', "");
                $(this).css('padding-left', Gallery.properties.halfSeparatorElementLeft);
                $(this).css('padding-top', Gallery.properties.halfSeparatorElementTop);
                $(this).css('padding-bottom', Gallery.properties.halfSeparatorElementBottom);
                $(this).css('padding-right', Gallery.properties.halfSeparatorElementRight);
            });
            if (this.properties.packeryReady) {
                this.cleanLayoutGrid();
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

        _saveElementsState: function () {
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

        // add span elements that will be used as handles of the element
        _addHandles: function ($elem) {
            var $handles = [];

            for (var $i = 0; $i < 3; $i++) {
                $handles[$i] = document.createElement('span');
            }

            $handles[0].setAttribute('class', 'ui-resizable-handle ui-resizable-e');
            $handles[0].setAttribute('id', $elem.id.concat('e'));
            $handles[1].setAttribute('class', 'ui-resizable-handle ui-resizable-se');
            $handles[1].setAttribute('id', $elem.id.concat('se'));
            $handles[2].setAttribute('class', 'ui-resizable-handle ui-resizable-s');
            $handles[2].setAttribute('id', $elem.id.concat('s'));

            for (var $i = 0; $i < 3; $i++) {
                $('#' + $elem.id).append($handles[$i]);
            }
        },

        // fixes position of the handles of the element
        _fixHandlesPosition: function ($elem, $gallery) {
            var le = $($elem).outerWidth() - $gallery.properties.halfSeparatorElementLeft - 5,
                te = $($elem).outerHeight() / 2 - $gallery.properties.halfSeparatorElementTop,
                ls = $($elem).outerWidth() / 2 - $gallery.properties.halfSeparatorElementLeft,
                ts = $($elem).outerHeight() - $gallery.properties.halfSeparatorElementTop - 5,
                lse = $($elem).outerWidth() - $gallery.properties.halfSeparatorElementLeft - 5,
                tse = $($elem).outerHeight() - $gallery.properties.halfSeparatorElementTop - 5;

            $('#' + $elem.id.concat('e')).css('left', le + 'px');
            $('#' + $elem.id.concat('e')).css('top', te + 'px');
            $('#' + $elem.id.concat('se')).css('left', lse + 'px');
            $('#' + $elem.id.concat('se')).css('top', tse + 'px');
            $('#' + $elem.id.concat('s')).css('left', ls + 'px');
            $('#' + $elem.id.concat('s')).css('top', ts + 'px');
        },

        // Launching Packery plugin
        _launchPackery: function () {

            var Gallery = this;
            var $container = this.$element.packery(this.packerySettings);
            var $items = this.$element.find('.perfect-grid-item');

            var resizeTimeout;

            $items.each(function () {
                Gallery._addHandles(this);
                Gallery._fixHandlesPosition(this, Gallery);

                $(this).resizable({
                    //grid: Gallery.properties.singleWidth,
                    handles: {
                        'e': '.ui-resizable-e',
                        's': '.ui-resizable-s',
                        'se': '.ui-resizable-se'
                    },
                    start: function () {
                        Gallery.elementIsResizing = true;
                        var width = Gallery.properties.singleWidth;
                        var block = $(this)[0];
                        var x = parseInt(block['attributes']['data-row'].value),
                            y = parseInt(block['attributes']['data-col'].value),
                            w = parseInt(block['attributes']['data-width'].value),
                            h = parseInt(block['attributes']['data-height'].value);
                        console.log(x+" "+y+" "+w+" "+h+" "+width);
                        var aa = (12-(y-1+w))*width;
                        console.log(12-((y)+w));
                        console.log(aa);
                        $(this).resizable("option", "maxWidth", aa);
                    },
                    resize: function (event, ui) {

                        Gallery._fixHandlesPosition(this, Gallery);

                        if (resizeTimeout) {
                            clearTimeout(resizeTimeout);
                        }

                        resizeTimeout = setTimeout(function () {
                            $container.packery('fit', ui.element[0]);
                        }, 100);
                    },
                    stop: function () {
                        Gallery.elementIsResizing = false;
                        Gallery.saveElementNewProperties(this);
                        Gallery._fixSize();
                        Gallery._fixHandlesPosition(this, Gallery);
                    }
                });
                $(this).draggable({
                    stop: function() {
                        ;
                    }
                });
            });

            // bind drag events to Packery
            this.$element.packery('bindUIDraggableEvents', $items);
            console.log($container.data('packery') );
            // packery is ready
            //Gallery.properties.packeryReady = true;
        },

        // setting the blocks and wrap padding
        _setGridPadding: function () {
            //console.log('setting grid padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                console.log('setting grid padding');
                this.properties.setDesktopPadding = true;
                if (this._check_parent_class("rex-block-grid")) {
                    this.properties.setMobilePadding = true;
                } else {
                    this.properties.setMobilePadding = false;
                }

                if (null !== this.properties.gridTopSeparator) {
                    this.$element.css('margin-top', this.properties.gridTopSeparator - this.properties.halfSeparatorTop);
                } else {
                    this.$element.css('margin-top', this.properties.halfSeparatorTop);
                }

                if (null !== this.properties.gridBottomSeparator) {
                    this.$element.css('margin-bottom', this.properties.gridBottomSeparator - this.properties.halfSeparatorBottom);
                } else {
                    this.$element.css('margin-bottom', this.properties.halfSeparatorBottom);
                }

                if (!this.properties.paddingTopBottom) {

                    if (null !== this.properties.gridLeftSeparator) {
                        this.$element.css('margin-left', this.properties.gridLeftSeparator - this.properties.halfSeparatorLeft);
                    } else {
                        this.$element.css('margin-left', this.properties.halfSeparatorLeft);
                    }

                    if (null !== this.properties.gridRightSeparator) {
                        this.$element.css('margin-right', this.properties.gridRightSeparator - this.properties.halfSeparatorRight);
                    } else {
                        this.$element.css('margin-right', this.properties.halfSeparatorRight);
                    }
                }
            }
            /*
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
        }*/
        },

        // Calculate the height of the blocks, depending on viewport size, and gallery type
        _calculateBlockHeight: function () {
            //console.log('calculating height');
            if (this.settings.galleryLayout == 'fixed') {
                if (this._viewport().width >= 768 || this._check_parent_class("rex-block-grid")) {
                    if (this.settings.fullHeight == 'true') {
                        // console.log('bbb');
                        var wrap_height = this._viewport().height;
                        //this.properties.singleWidth = wrap_height / (this.properties.gridTotalArea / 12);
                        this.properties.singleWidth = (this.properties.gridTotalArea / wrap_height) / 12;
                    }
                    this._calculateBlockHeightFixed();
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
