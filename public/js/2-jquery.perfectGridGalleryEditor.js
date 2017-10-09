/*
 *  Perfect Grid Gallery
 */

; (function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "perfectGridGalleryEditor",
        defaults = {
            itemSelector: '.perfect-grid-item',
            gridItemWidth: 0.0833333333,
            numberCol: 12,
            gridSizerSelector: '.perfect-grid-sizer',
            galleryLayout: 'fixed',
            separator: 20,
            fullHeight: 'false',
            gridParentWrap: '.rexpansive_section',
            mobilePadding: 'false'
        };

    // The actual plugin constructor
    function perfectGridGalleryEditor(element, options) {

        this.element = element;
        this.$element = $(element);

        // attach data info to expose it
        // $(this.element).data('perfectGridGalleryEditor', this);

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
            elementIsResizing: false,
            elementHasScrollBar: false,
            elementStartingH: 0,
            percentFactorHandlers: 0.15,
            lostPixels: 0,
            elemHasFocus: false,
            edgesElementsSetted: false,
            windowIsReisized: false,
            resizeHandle: ''
        };
        this.packerySettings = {
            itemSelector: '',
            columnWidth: 0,
            rowHeight: 0,
            gutter: 0,
            percentPosition: false,
        };
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(perfectGridGalleryEditor.prototype, {
        init: function () {

            this._saveStateElements();

            this._defineDataSettings();

            this._setGutter();

            this._definePrivateProperties();

            this._setParentGridPadding();

            this._defineDynamicPrivateProperties();

            this.prepareElements();

            this._launchGridStack();

            this.linkResizeEvents();

            /*
            var grid = this;
            var testDiv = document.createElement('div');
            $(testDiv).attr({
                'class': 'editable medium-editor-element',
                'style': 'width: 100px; height: 100px; background-color: yellow;'
            });
            $($('.rexpansive_section').parent()).prepend(testDiv);
            $(grid.$element).children('.grid-stack-item').each(function(){
        
                if (($(this).find('.text-wrap')).length != 0) {
                    if ($(this).hasClass('block-has-slider')) {
                        $($(this).find('.rex-slider-element-title')).addClass('editable medium-editor-element');
                    } else {
                        $($(this).find('.text-wrap')).addClass('editable medium-editor-element');
                        //gallery.fixElementTextSize($elem, null);
                    }
                } else {
                    var textEl = document.createElement('div');
                    $(textEl).addClass('text-wrap editable medium-editor-element');
                    $($(this).find('.rex-custom-scrollbar')).append(textEl);
                }
            });
            
            var editor = new MediumEditor('.editable', { 
                // options go here
            });
            */

            $(window).on('resize', { Gallery: this, Util: Util }, function (event) {
                if (!event.data.Util.elementIsResizing) {
                    console.log('resized window');
                    var G = event.data.Gallery;
                    var grid = G.$element.data('gridstack');
                    G._defineDynamicPrivateProperties();
                    grid.cellHeight(grid.cellWidth());
                    grid._initStyles();
                    grid._updateStyles(grid.cellHeight());
                }
            });

            /* $(window).on('load', { Gallery: this }, function (event) {
                ;
            }); */
        },

        refreshGrid: function () {

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._fixHeightAllElements();

            //this._launchGridStack();

            var G = this;
            this.$element.packery('layout');
            $('.perfect-grid-item').each(function () {
                console.log('refreshing item');
                G.fitLayoutGrid(this);
            });
            /*
            setTimeout(function () {
                //console.log('refreshing grid');
                // G.$element.Packery('layout');
                G.relayoutGrid();
                G.$element.trigger('rearrangeComplete');
                G.$element.trigger('refreshComplete');
            }, 400); */
        },

        fixElementTextSize: function ($elem, $handler) {
            var block = $($elem)[0];
            if (($(block).find('.text-wrap')).length != 0) {
                var $textWrap = $(block).find('.text-wrap');
                var $blockContent = $(block).find('.grid-stack-item-content')[0];
                if (!$($blockContent).hasClass('scrollbar-enabled') && ($($textWrap).innerHeight() != null)) {
                    var maxBlockHeight, textHeight;
                    maxBlockHeight = $($blockContent).innerHeight();
                    textHeight = $($textWrap).innerHeight();
                    /*  if (($handler == 'e' || $handler == 'w') && !this.properties.elementHasScrollBar) {
                         maxBlockHeight = $($blockContent).innerHeight();
                         textHeight = $($textWrap).innerHeight();
                         if (textHeight >= maxBlockHeight) {
                             block['attributes']['data-gs-height'].value = parseInt(block['attributes']['data-gs-height'].value) + 1;
                         }
                         if (!Util.elementIsResizing) {
                                 maxBlockHeight = $($blockContent).innerHeight();
                                 textHeight = $($textWrap).innerHeight();
                                 if (textHeight >= maxBlockHeight) {
                                     block['attributes']['data-gs-height'].value = parseInt(block['attributes']['data-gs-height'].value) + 1;
                                 }
                         }
                     } else {
                     }*/
                    this.updateElementScrollBar($($blockContent), textHeight, maxBlockHeight);
                }
            }
        },

        updateElementScrollBar: function ($blockContent, textHeight, maxBlockHeight) {
            if (textHeight >= maxBlockHeight) {
                if (!$blockContent.hasClass('scrollbar-enabled')) {
                    $blockContent.addClass('scrollbar-enabled');
                    $blockContent.mCustomScrollbar();
                }
            } else {
                if ($blockContent.hasClass('scrollbar-enabled')) {
                    $blockContent.removeClass('scrollbar-enabled');
                    $blockContent.mCustomScrollbar('destroy');
                }
            }
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

        getGridSize: function () {
            return this.properties.wrapWidth;
        },

        setGridSize: function (width) {
            $(this.$element).outerWidth(width);
        },

        relayoutGrid: function () {
            // this.$element.Packery('reloadItems');
            //console.log('relayoutGrid');
            //this.$element.packery('layout');
            //this.$element.trigger('relayoutComplete');
        },

        fitLayoutGrid: function ($elem) {
            this.$element.packery('fit', $elem);
        },

        cleanLayoutGrid: function () {
            this.$element.packery('layout');
            //this.$element.trigger('rearrangeComplete');
        },

        // insert elements in the Packery grid and reload the items according to perfectGridGalleryEditor
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

        // Updating elements properties

        updateAllElementsAllNewProperties: function () {
            var Gallery = this;
            this.$element.find('.perfect-grid-item').each(function () {
                Gallery.updateElementAllNewProperties(this);
            });
        },

        updateAllElementsXYproperties: function () {
            var Gallery = this;
            this.$element.find('.perfect-grid-item').each(function () {
                Gallery.updateElementXYproperties(this);
            });
        },

        updateElementAllNewProperties: function ($elem) {
            this.updateElementXYproperties($elem);
            this.updateElementWHproperties($elem);
        },

        updateElementXYproperties: function ($elem) {
            this.updateElementProperty($elem, 'x');
            this.updateElementProperty($elem, 'y');
        },

        updateElementWHproperties: function ($elem) {
            this.updateElementProperty($elem, 'w');
            this.updateElementProperty($elem, 'h');/* 
            var w = $($elem)[0]['attributes']['data-width'].value;
            var h = $($elem)[0]['attributes']['data-height'].value;
            $('#'+$elem.id+' > .el-size-viewer').text(w+' x '+h); */
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
                    var w = parseInt(block['attributes']['data-gs-width'].value);
                    var nW = Math.round(parseInt($(block).outerWidth()) / width);
                    if (nW <= 0) {
                        nW = 1;
                    }
                    block['attributes']['data-gs-width'].value = nW;
                    // updating element class
                    $(block).removeClass("w" + w);
                    $(block).addClass("w" + nW);
                    break;
                }
                case 'h': {
                    var h = parseInt(block['attributes']['data-gs-height'].value);
                    var nH = Math.round(parseInt($(block).outerHeight()) / width);
                    if (nH <= 0) {
                        nH = 1;
                    }
                    block['attributes']['data-gs-height'].value = nH;
                    if (h == 1) {
                        $(block).removeClass('h1');
                    }
                    if (nH == 1) {
                        $(block).addClass('h1');
                    }
                    break;
                }
                default: {
                    break;
                }
            }
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
            this.properties.wrapWidth = $(this.$element).outerWidth();
            this.properties.singleWidth = $(this.$element).outerWidth() * this.settings.gridItemWidth;
            /* 
            this.properties.singleWidth = Math.floor($(this.$element).outerWidth()/12);
            this.properties.wrapWidth = this.properties.singleWidth*12; */
            /* if (this.settings.fullHeight == 'true') {
                this.properties.gridTotalArea = this._calculateArea();
            } */
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
        },

        // Calcualte viewport area to implement full height feature
        _calculateArea: function () {
            var temp_area = 0;
            this.$element.find(this.settings.itemSelector).each(function () {
                var $this = $(this);
                temp_area += parseInt($this.attr('data-height')) * parseInt($this.attr('data-width'));
            });
            return temp_area;
        },

        // define Packery Settings
        _definePackerySettings: function () {
            this.packerySettings.itemSelector = this.settings.itemSelector;
            this.packerySettings.gutter = 0;
            this.packerySettings.columnWidth = this.properties.singleWidth;
            this.packerySettings.rowHeight = this.properties.singleWidth;
            this.packerySettings.percentPosition = false;
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

        _fixHeightGrid: function () {
            var grid = $(this.$element)[0];
            $(this.element).outerHeight(grid['attributes']['data-gs-current-height'].value * this.properties.singleWidth);
        },

        _fixAllElementsContentSize: function () {
            var Gallery = this;
            Gallery.$element.find(Gallery.settings.itemSelector).each(function () {
                Gallery._fixElementHeight(this);
            });
            this.properties.edgesElementsSetted = true;
        },

        _updateElementPadding: function ($elem) {
            $($elem).css('left', this.properties.halfSeparatorElementLeft);
            $($elem).css('top', this.properties.halfSeparatorElementTop);
            $($elem).css('bottom', this.properties.halfSeparatorElementBottom);
            $($elem).css('right', this.properties.halfSeparatorElementRight);
        },

        _fixElementHeight: function ($elem) {
            var child = $($elem).children('.grid-stack-item-content');
            var h;
            if (Util.elementIsResizing) {
                h = $($elem).outerHeight() - this.properties.gutter;
            } else {
                h = this.properties.singleWidth * parseInt($($elem).attr('data-gs-height')) - this.properties.gutter;
            }
            $(child).outerHeight(h);
            if (!this.properties.edgesElementsSetted) {
                var h2 = this.properties.singleWidth * parseInt($($elem).attr('data-gs-height'));
                $($elem).outerHeight(h2);
                this._updateElementPadding(child);
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

        _addSizeViewer: function ($elem) {
            var spanViewer = document.createElement('span');
            spanViewer.setAttribute('id', $elem.id.concat('-size-viewer'));
            $(spanViewer).addClass('el-size-viewer');
            $(spanViewer).css('left', this.properties.halfSeparatorElementLeft);
            $(spanViewer).css('top', this.properties.halfSeparatorElementTop);
            $elem.append(spanViewer);
        },

        // add span elements that will be used as handles of the element
        _addHandles: function ($elem, $handles) {
            var span;
            var div;
            var handle;
            $($handles.split(', ')).each(function () {
                handle = this;
                span = $(document.createElement('span')).attr({
                    'class': 'circle-handle circle-handle-' + handle,
                    'data-axis': handle
                });
                div = $(document.createElement('div')).attr({
                    'class': 'ui-resizable-handle ui-resizable-' + handle,
                    'id': $elem.id + handle,
                    'data-axis': handle
                });
                $(span).appendTo($(div));
                $(div).appendTo($($elem));
            });

            $($elem).mousedown(function (e) {
                if (!$($elem).hasClass('focused')) {
                    $($elem).children('.el-size-viewer').addClass('focused');
                    $($elem).addClass('focused');
                    $($elem).parent().addClass('focused');
                    $($elem).parent().parent().addClass('focused');
                    $($elem).parent().parent().parent().addClass('focused');
                    $($elem).parent().parent().parent().parent().addClass('focused');
                }
            });

            $(document).mouseup(function (e) {
                $($elem).children('.el-size-viewer').removeClass('focused');
                $($elem).removeClass('focused');
                $($elem).parent().removeClass('focused');
                $($elem).parent().parent().removeClass('focused');
                $($elem).parent().parent().parent().removeClass('focused');
                $($elem).parent().parent().parent().parent().removeClass('focused');
            });

            $($elem).hover(function () {
                if (!Util.elementIsResizing) {
                    $($elem).children('.el-size-viewer').addClass('focused');
                    $($elem).addClass('focused');
                    $($elem).parent().addClass('focused');
                    $($elem).parent().parent().addClass('focused');
                    $($elem).parent().parent().parent().addClass('focused');
                    $($elem).parent().parent().parent().parent().addClass('focused');
                }
            }, function () {
                if (!Util.elementIsResizing) {
                    $($elem).children('.el-size-viewer').removeClass('focused');
                    $($elem).removeClass('focused');
                    $($elem).parent().removeClass('focused');
                    $($elem).parent().parent().removeClass('focused');
                    $($elem).parent().parent().parent().removeClass('focused');
                    $($elem).parent().parent().parent().parent().removeClass('focused');
                }
            });

            $($elem).dblclick(function () {
                if (($($elem).find('.text-wrap')).length != 0) {
                    if ($($elem).hasClass('block-has-slider')) {
                        $($($elem).find('.rex-slider-element-title')).addClass('editable medium-editor-element');
                    } else {
                        $($($elem).find('.text-wrap')).addClass('editable medium-editor-element');
                        //gallery.fixElementTextSize($elem, null);
                    }
                } else {
                    var textEl = document.createElement('div');
                    $(textEl).addClass('text-wrap editable medium-editor-element');
                    $($($elem).find('.rex-custom-scrollbar')).append(textEl);
                }
            });
        },

        // fixes position of the handles of the element
        _fixHandlesPosition: function ($elem) {
            // variables for the east handler
            var le = $($elem).outerWidth() - 20,
                te = 0,
                he = ($($elem).outerHeight()) * (1 - this.properties.percentFactorHandlers),
                leCircle = 15,
                teCircle = $($elem).outerHeight() / 2;

            // variables for the south handler
            var ls = 0,
                ts = $($elem).outerHeight() - 20,
                ws = ($($elem).outerWidth()) * (1 - this.properties.percentFactorHandlers),
                lsCircle = $($elem).outerWidth() / 2,
                tsCircle = 15;

            // variables for the south-east handler
            var lse = $($elem).outerWidth() * (1 - this.properties.percentFactorHandlers),
                tse = $($elem).outerHeight() * (1 - this.properties.percentFactorHandlers),
                wlse = $($elem).outerWidth() * (this.properties.percentFactorHandlers * 2),
                hlse = $($elem).outerHeight() * (this.properties.percentFactorHandlers * 2),
                lseCircle = $($elem).outerWidth() * this.properties.percentFactorHandlers - 5,
                tseCircle = $($elem).outerHeight() * this.properties.percentFactorHandlers - 5;

            $('#' + $elem.id.concat('e')).css('left', le + 'px');
            $('#' + $elem.id.concat('e')).css('top', te + 'px');
            $('#' + $elem.id.concat('e')).css('height', he + 'px');
            $('#' + $elem.id.concat('e') + ' > .circle-handle-e').css('left', leCircle + 'px');
            $('#' + $elem.id.concat('e') + ' > .circle-handle-e').css('top', teCircle + 'px');

            $('#' + $elem.id.concat('s')).css('left', ls + 'px');
            $('#' + $elem.id.concat('s')).css('top', ts + 'px');
            $('#' + $elem.id.concat('s')).css('width', ws + 'px');
            $('#' + $elem.id.concat('s') + ' > .circle-handle-s').css('left', lsCircle + 'px');
            $('#' + $elem.id.concat('s') + ' > .circle-handle-s').css('top', tsCircle + 'px');

            $('#' + $elem.id.concat('se')).css('left', lse + 'px');
            $('#' + $elem.id.concat('se')).css('top', tse + 'px');
            $('#' + $elem.id.concat('se')).css('width', wlse + 'px');
            $('#' + $elem.id.concat('se')).css('height', hlse + 'px');
            $('#' + $elem.id.concat('se') + ' > .circle-handle-se').css('left', lseCircle + 'px');
            $('#' + $elem.id.concat('se') + ' > .circle-handle-se').css('top', tseCircle + 'px');

        },

        createResizePlaceHolder: function ($elem) {
            var block = $($elem)[0];
            var $placeholder = document.createElement('div');
            $($elem).parent().append($placeholder);
            $($placeholder).addClass('resizePlaceHolder');
            $($placeholder).addClass('w' + parseInt(block['attributes']['data-width'].value));
            var x = parseInt(block['attributes']['data-row'].value - 1) * this.properties.singleWidth;
            var y = parseInt(block['attributes']['data-col'].value - 1) * this.properties.singleWidth;
            $($placeholder).css('transform', 'translate(' + y + 'px, ' + x + 'px)');
            $($placeholder).css('position', 'absolute');
            return $placeholder;
        },

        updateResizePlaceHolder: function ($resizePlaceHolder, $elem) {
            var block = $($elem)[0];
            var width = this.properties.singleWidth;
            var w = parseInt(block['attributes']['data-width'].value);

            var nW = Math.round(parseInt($(block).outerWidth()) / width);
            if (nW <= 0) {
                nW = 1;
            }
            // updating element class
            $($resizePlaceHolder).removeClass();
            $($resizePlaceHolder).addClass('resizePlaceHolder ' + 'w' + nW);
            var nH = Math.round(parseInt($(block).outerHeight()) / width);
            if (nH <= 0) {
                nH = 1;
            }
            $($resizePlaceHolder).css('width', nW * width + "px");
            $($resizePlaceHolder).css('height', nH * width + "px");
        },

        updateSizeViewerText: function ($elem, x, y) {
            if (x === undefined || y === undefined) {
                x = $($elem)[0]['attributes']['data-gs-width'].value;
                y = $($elem)[0]['attributes']['data-gs-height'].value;
            }
            $('#' + $elem.id + ' > .el-size-viewer').text(x + ' x ' + y);
        },

        prepareElements: function () {
            var gallery = this;
            $(gallery.$element).children('.grid-stack-item').each(function () {
                gallery._updateElementPadding($(this).children('.grid-stack-item-content'));
                gallery._addHandles(this, 'e, s, se');
                gallery._addSizeViewer(this);
                gallery.updateSizeViewerText(this);
                $('#' + this.id).attr("data-gs-min-width", "1");
                $('#' + this.id).attr("data-gs-min-height", "1");
                $('#' + this.id).attr("data-gs-max-width", "12");
                if (($(this).find('.text-wrap')).length != 0) {
                    if (!$(this).hasClass('block-has-slider')) {
                        gallery.fixElementTextSize(this, null);
                    }
                }
            });
        },

        linkResizeEvents: function () {
            var gallery = this;
            var block, $textWrap, $blockContent, xStart, xView, yView;

            $(gallery.$element).on('resizestart', function (event, ui) {
                gallery.properties.resizeHandle = $(event.toElement).attr('data-axis');
                block = $(event.target)[0];
                if (!$(block).hasClass('block-has-slider') && ($(block).find('.text-wrap')).length != 0) {
                    $textWrap = $(block).find('.text-wrap');
                    $blockContent = $($textWrap).parents('.grid-stack-item-content')[0];
                    if ($($blockContent).hasClass('scrollbar-enable')) {
                        gallery.properties.elementHasScrollBar = true;
                    }
                }
                Util.elementIsResizing = true;
                if(gallery.properties.resizeHandle == 'e' || gallery.properties.resizeHandle == 'se'){
                    xStart = parseInt(block['attributes']['data-gs-x'].value);
                    $('#' + block.id).attr("data-gs-max-width", (gallery.settings.numberCol - xStart));
                }
            }).on('resize', function (event, ui) {
                block = $(event.target)[0];
                if (!$(block).hasClass('block-has-slider')) {
                    gallery.fixElementTextSize(block, gallery.properties.resizeHandle);
                };
                xView = Math.round($(event.target).outerWidth() / gallery.properties.singleWidth);
                yView = Math.round($(event.target).outerHeight() / gallery.properties.singleWidth);
                gallery.updateSizeViewerText(block, xView, yView);
                if(gallery.properties.resizeHandle == 'w' || gallery.properties.resizeHandle == 'sw'){

                }
            }).on('gsresizestop', function (event, elem) {
                Util.elementIsResizing = false;
                gallery.properties.elementHasScrollBar = false;
                gallery.updateSizeViewerText(elem);
            });
        },

        // Launching Packery plugin
        _launchGridStack: function () {
            var gallery = this;
            $(gallery.$element).gridstack({
                cellHeight: gallery.properties.singleWidth,
                draggable: {
                    containment: 'parent',
                    handle: '.grid-stack-item-content',
                    scroll: false,
                },
                resizable: {
                    minWidth: gallery.properties.singleWidth,
                    minHeight: gallery.properties.singleWidth,
                    handles: {
                        'e': '.ui-resizable-e',
                        's': '.ui-resizable-s',
                        //'w': '.ui-resizable-w',
                        'se': '.ui-resizable-se',
                        //'sw': '.ui-resizable-sw'
                    }
                },
                verticalMargin: 0,
                width: gallery.settings.numberCol
            });

            // eventi per il drag
            /* .on('dragstart', function (event, ui) {
                ;
            }).on('drag', function (event, ui) {
                ;
            }).on('dragstop', function (event, ui) {
                ;
            }) */

            //var grid = this.$element.data('gridstack');

            //$('.grid-stack-item').addTouch();
        },

        _setParentGridPadding: function () {
            var $parent = $(this.$element.parent());
            //console.log('setting grid padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                //console.log('setting grid padding');
                this.properties.setDesktopPadding = true;
                if (this._check_parent_class("rex-block-grid")) {
                    this.properties.setMobilePadding = true;
                } else {
                    this.properties.setMobilePadding = false;
                }

                if (null !== this.properties.gridTopSeparator) {
                    $parent.css('padding-top', this.properties.gridTopSeparator - this.properties.halfSeparatorTop);
                } else {
                    $parent.css('padding-top', this.properties.halfSeparatorTop);
                }

                if (null !== this.properties.gridBottomSeparator) {
                    $parent.css('padding-bottom', this.properties.gridBottomSeparator - this.properties.halfSeparatorBottom);
                } else {
                    $parent.css('padding-bottom', this.properties.halfSeparatorBottom);
                }

                if (!this.properties.paddingTopBottom) {

                    if (null !== this.properties.gridLeftSeparator) {
                        $parent.css('padding-left', this.properties.gridLeftSeparator - this.properties.halfSeparatorLeft);
                    } else {
                        $parent.css('padding-left', this.properties.halfSeparatorLeft);
                    }

                    if (null !== this.properties.gridRightSeparator) {
                        $parent.css('padding-right', this.properties.gridRightSeparator - this.properties.halfSeparatorRight);
                    } else {
                        $parent.css('padding-right', this.properties.halfSeparatorRight);
                    }
                }
            }
        },
        // setting the blocks and wrap padding
        _setGridPadding: function () {
            console.log('setting grid padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                //console.log('setting grid padding');
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
                        //this.properties.singleWidth = wrap_height / (this.properties.gridTotalArea / this.properties.numberCol);
                        this.properties.singleWidth = (this.properties.gridTotalArea / wrap_height) / this.properties.numberCol;
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
                    $.data(this, 'plugin_' + pluginName, new perfectGridGalleryEditor(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                if (instance instanceof perfectGridGalleryEditor && typeof instance[options] === 'function') {
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
