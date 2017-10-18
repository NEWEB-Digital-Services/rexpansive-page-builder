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
            singleHeight: null,
            gridTotalArea: 0,
            gridActive: false,
            paddingTopBottom: false,
            setMobilePadding: false,
            setDesktopPadding: false,
            elementResizeEvent: false,
            gutter: 0,
            elementIsResizing: false,
            elementIsDragging: false,
            elementStartingH: 0,
            percentFactorHandlers: 0.15,
            lostPixels: 0,
            elemHasFocus: false,
            edgesElementsSetted: false,
            windowIsReisized: false,
            resizeHandle: '',
            sectionNumber: null,
            elementEdited: null,
            gridstackInstanceID: null,
            gridChanged: false,
            gridHover: false
        };

        this.init();
    }
    
    // Avoid Plugin.prototype conflicts
    $.extend(perfectGridGalleryEditor.prototype, {
        init: function () {
            
            // getting section number
            this.properties.sectionNumber = ($(this.element).children('.grid-stack-item')[0].id).split('_')[1];
            this.$element.addClass('grid-number-' + this.properties.sectionNumber);

            this._saveStateElements();

            this._defineDataSettings();

            this._setGutter();

            this._definePrivateProperties();

            this._setParentGridPadding();

            this._defineDynamicPrivateProperties();

            this._prepareElements();

            this._launchGridStack();

            this._linkResizeEvents();

            this._linkDragEvents();

            var gallery = this;
            var $elem;
            Util.elementIsDragging = false;
            Util.elementIsResizing = false;
            
            

            $(gallery.element).children('.grid-stack-item').each(function () {
                $elem = $(this);
                gallery.updateSizeViewerText($elem);
            });

            //this._launchTextEditor();
            (gallery.$element).parent().parent().hover(function (event) {
                gallery.showToolBox();
            }, function () {
                //gallery.hideToolBox();
            });
            
            $(window).on('keydown', { Gallery: this, Util: Util }, function (event) {
                if (event.keyCode == 27) {
                    var G = event.data.Gallery;
                    var grid = G.$element.data('gridstack');
                    grid.enable();
                    $(G.$element).addClass('gridActive');
                    G.properties.elementEdited = null;
                }
            });

            $(window).on('mousedown', { Gallery: this, Util: Util }, function (event) {
                var G = event.data.Gallery;
                var target = event.target;
                if (G.properties.elementEdited !== null && $(target).parents('.medium-editor-toolbar').length === 0) {
                    var $items = $($(target).parents('.grid-stack-item'));
                    if (($items.length === 0) || $items[0].id !== G.properties.elementEdited.id) {
                        var grid = G.$element.data('gridstack');
                        grid.enable();
                        $(G.$element).addClass('gridActive');
                        G.properties.elementEdited = null;
                    }
                }
            });

            $(window).on('resize', { Gallery: this, Util: Util }, function (event) {
                if (!event.data.Util.elementIsResizing) {
                    var G = event.data.Gallery;
                    var grid = G.$element.data('gridstack');
                    G._defineDynamicPrivateProperties();
                    if (!(G.settings.galleryLayout == 'masonry')) {
                        grid.cellHeight(G.properties.singleHeight);
                        grid._initStyles();
                        grid._updateStyles(G.properties.singleHeight);
                    } else {
                        // if there is masonry layout
                        if (G.settings.galleryLayout == 'masonry') {
                            G._calculateBlockHeightMasonry($elem);
                        }
                        $(G.element).children('.grid-stack-item').each(function () {
                            $elem = $(this);
                            G.updateSizeViewerText($elem);
                        });
                    }
                }
            });

            $(window).on('load', { Gallery: this, Util: Util }, function (event) {
                var gallery = event.data.Gallery;
                var $elem;
                // if there is masonry layout
                if (gallery.settings.galleryLayout == 'masonry') {
                    gallery._calculateBlockHeightMasonry();
                }
                gallery.updateAllElementsProperties();
                $(gallery.element).children('.grid-stack-item').each(function () {
                    // if there is masonry layout
                    $elem = $(this);
                    gallery.updateSizeViewerText($elem);
                });

                $(gallery.element).on('change', { Gallery: gallery, Util: Util }, function(event, items) {
                    if(!Util.elementIsDragging && !Util.elementIsResizing){
                        event.data.Gallery.updateAllElementsProperties();
                    } 
                });
            });
            

            // launching event 'editor is ready'
            var gridReadyEvent = jQuery.Event("gridGalleryEditorReady");
            gridReadyEvent.gallery = this;
            $(document).trigger(gridReadyEvent);
        },

        refreshGrid: function () {

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._fixHeightAllElements();

            //this._launchGridStack();

            /*
            setTimeout(function () {
                //console.log('refreshing grid');
                // G.$element.Packery('layout');
                G.relayoutGrid();
                G.$element.trigger('rearrangeComplete');
                G.$element.trigger('refreshComplete');
            }, 400); */
        },

        fixElementTextSize: function (block, $handler) {
            var $textWrap = $($(block).find('.text-wrap'));
            var $blockContent = $($(block).find('.grid-stack-item-content')[0]);
            var maxBlockHeight, textHeight;
            maxBlockHeight = $blockContent.innerHeight();
            textHeight = $textWrap.innerHeight();
            if (this.settings.galleryLayout != 'masonry' && $handler !== null) {
                $blockContent.mCustomScrollbar("update");
            } else {
                if (this.settings.galleryLayout != 'masonry' && $(block).find('.mCustomScrollBox').length === 0) {
                    $blockContent.mCustomScrollbar();
                    if (textHeight < maxBlockHeight) {
                        $blockContent.mCustomScrollbar('disable');
                    }
                } else {
                    if (this.settings.galleryLayout == 'masonry' || $blockContent.hasClass('mCS_no_scrollbar')) {
                        var w = parseInt(block['attributes']['data-gs-width'].value);
                        var h = parseInt(block['attributes']['data-gs-height'].value);
                        var grid = this.$element.data('gridstack');
                        var i = 0;
                        var n;
                        if (textHeight >= maxBlockHeight) {
                            if (this.settings.galleryLayout == 'masonry') {
                                n = textHeight - maxBlockHeight;
                            } else {
                                n = Math.max(Math.floor((textHeight - maxBlockHeight) / this.properties.singleWidth), 1);
                            }
                            while (i < n) {
                                h = h + 1;
                                i++;
                            }
                        } else {
                            if (this.settings.galleryLayout == 'masonry') {
                                n = maxBlockHeight - textHeight;
                            } else {
                                n = Math.floor((maxBlockHeight - textHeight) / this.properties.singleWidth);
                            }
                            while (i < n) {
                                h = h - 1;
                                i++;
                            }
                            h = Math.max(h, this.properties.elementStartingH);
                        }
                        grid.update(block, null, null, w, h);
                    }
                }
            }
        },

        _removeScrollbar: function(){
            var $elem;
            var $blockContent;
            $(this.element).children('.grid-stack-item').each(function () {
                $elem = $(this);
                $blockContent = $($elem.find('.grid-stack-item-content')[0]);
                if (!$elem.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') &&!$blockContent.hasClass('youtube-player')) {
                    $blockContent.mCustomScrollbar('destroy');
                }
            });
        },

        restoreBackup: function () {
            var block;
            var G = this;
            $(G.element).children('.grid-stack-item').each(function () {
                block = $(this)[0];
                $(this).attr({
                    'data-gs-x': block['attributes']['data-col'].value,
                    'data-gs-y': block['attributes']['data-row'].value,
                    'data-gs-width': block['attributes']['data-width'].value,
                    'data-gs-height': block['attributes']['data-height'].value
                });
                G.updateSizeViewerText($(this));
            });
        },

        reLaunchGrid: function (data) {
            //console.log('selected layout: '+data['layout']);
            var G = this;
            var grid = G.$element.data('gridstack');
            var oldLayout = G.settings.galleryLayout;
            G.settings.galleryLayout = data['layout'];
            G._defineDynamicPrivateProperties();
            if (oldLayout != G.settings.galleryLayout) {
                
                Util.elementIsResizing = true;
                Util.elementIsDragging = true;

                // destroying gridstack & jquery ui
                grid.destroy(false);
                var $elem;
                $(G.element).children('.grid-stack-item').each(function () {
                    $elem = $(this);
                    $elem.draggable("destroy");
                    $elem.resizable("destroy");
                });
                G.$element.removeClass('grid-stack-instance-'+this.properties.gridstackInstanceID);
                // adding back the handles for resizing
                $(G.element).children('.grid-stack-item').each(function () {
                    G._addHandles(this, 'e, s, w, se, sw');
                });

                // relaunching grid
                if (G.settings.galleryLayout == 'masonry') {
                    G._removeScrollbar();
                    G._launchGridStack();
                    G._calculateBlockHeightMasonry();
                    $(G.element).children('.grid-stack-item').each(function () {
                        G.updateSizeViewerText($(this));
                    });
                } else {
                    G.restoreBackup();
                    var $blockContent;
                    $(G.element).children('.grid-stack-item').each(function () {
                        $elem = $(this);
                        $blockContent = $elem.find('.grid-stack-item-content');
                        if (!$elem.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') &&!$blockContent.hasClass('youtube-player')) {
                            G.fixElementTextSize($elem, null);
                        }
                    });
                    
                    G._launchGridStack();
                }
                Util.elementIsResizing = false;
                Util.elementIsDragging = false;
            }
            return;
        },
        
        destroyGrid: function () {
            grid.destroy(false);
            var $elem;
            $(G.element).children('.grid-stack-item').each(function () {
                $elem = $(this);
                $elem.draggable("destroy");
                $elem.resizable("destroy");
            });
            G.$element.removeClass('grid-stack-instance-'+this.properties.gridstackInstanceID);
        },

        recalculateBlocks: function () {
            /* this.properties.wrapWidth = Math.round(this.$element.innerWidth());
            this.properties.singleWidth = Math.round(this.properties.wrapWidth * this.settings.gridItemWidth);

            this._calculateBlockHeightFixed(); */
        },

        getGridWidth: function () {
            return this.properties.wrapWidth;
        },

        setGridWidth: function (width) {
            $(this.$element).outerWidth(width);
        },

        relayoutGrid: function () {
            // this.$element.Packery('reloadItems');
            //console.log('relayoutGrid');
            //this.$element.packery('layout');
            //this.$element.trigger('relayoutComplete');
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

        getSectionNumber: function(){
            return this.properties.sectionNumber;
        },
        setProperty: function (definition) {
            this.properties[definition[0]] = definition[1];
        },

        isEven: function (number) {
            return number % 2 == 0;
        },

        // Updating elements properties
        updateAllElementsProperties: function () {
            var Gallery = this;
            this.$element.find('.perfect-grid-item').each(function () {
                //console.log('updatinng '+this.id+' element');
                Gallery.updateElementAllProperties($(this));
            });
        },

        updateElementAllProperties: function ($elem) {
            this.updateElementProperty($elem, 'x');
            this.updateElementProperty($elem, 'y');
            this.updateElementProperty($elem, 'w');
            this.updateElementProperty($elem, 'h');
        },

        updateElementProperty: function ($elem, $case) {
            var block = $elem[0];
            var width = this.properties.singleWidth;
            
            switch ($case) {
                case 'x': {
                    block['attributes']['data-col'].value = parseInt(block['attributes']['data-gs-x'].value);
                    break;
                }
                case 'y': {
                    if(this.settings.galleryLayout == 'masonry'){
                        block['attributes']['data-row'].value = Math.round(parseInt(block['attributes']['data-gs-y'].value)*this.properties.singleHeight/width);
                    } else {
                        block['attributes']['data-row'].value = parseInt(block['attributes']['data-gs-y'].value);
                    }
                    break;
                }
                case 'w': {
                    var w = parseInt(block['attributes']['data-gs-width'].value);
                    var oldW = block['attributes']['data-width'].value;
                    block['attributes']['data-width'].value = w;
                    // updating element class
                    $(block).removeClass("w" + oldW);
                    $(block).addClass("w" + w);
                    break;
                }
                case 'h': {
                    var h;
                    var oldH = block['attributes']['data-height'].value;
                    if (this.settings.galleryLayout == 'masonry') {
                        h = Math.round(parseInt(block['attributes']['data-gs-height'].value)*this.properties.singleHeight / width);
                    } else {
                        h = parseInt(block['attributes']['data-gs-height'].value);
                    }

                    block['attributes']['data-height'].value = h;
                    // updating element class
                    $(block).removeClass("h" + oldH);
                    $(block).addClass("h" + h);
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

            if (this.settings.galleryLayout == 'masonry') {
                this.properties.singleHeight = 3;
            } else {
                this.properties.singleHeight = $(this.$element).outerWidth() * this.settings.gridItemWidth;
            }
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
                this.properties.halfSeparatorRight = Math.ceil(this.properties.gutter / 2);
                this.properties.halfSeparatorBottom = Math.floor(this.properties.gutter / 2);
                this.properties.halfSeparatorLeft = Math.floor(this.properties.gutter / 2);
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

        _setGutter: function () {
            if (this.isEven(this.properties.gutter)) {
                this.properties.halfSeparatorElementTop = this.properties.gutter / 2;
                this.properties.halfSeparatorElementRight = this.properties.gutter / 2;
                this.properties.halfSeparatorElementBottom = this.properties.gutter / 2;
                this.properties.halfSeparatorElementLeft = this.properties.gutter / 2;
            } else {
                this.properties.halfSeparatorElementTop = Math.floor(this.properties.gutter / 2);
                this.properties.halfSeparatorElementRight = Math.floor(this.properties.gutter / 2);
                this.properties.halfSeparatorElementBottom = Math.ceil(this.properties.gutter / 2);
                this.properties.halfSeparatorElementLeft = Math.ceil(this.properties.gutter / 2);
            }
        },

        _fixHeightGrid: function () {
            var grid = $(this.$element)[0];
            $(this.element).outerHeight(grid['attributes']['data-gs-current-height'].value * this.properties.singleWidth);
        },

        _updateElementPadding: function ($elem) {
            $($elem).css('left', this.properties.halfSeparatorElementLeft);
            $($elem).css('top', this.properties.halfSeparatorElementTop);
            $($elem).css('bottom', this.properties.halfSeparatorElementBottom);
            $($elem).css('right', this.properties.halfSeparatorElementRight);
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
            //$(spanViewer).css('left', this.properties.halfSeparatorElementRight);
            //$(spanViewer).css('top', this.properties.halfSeparatorElementTop);
            $(spanViewer).css('left', 0);
            $(spanViewer).css('top', 0);
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
                if (this.settings.layout == 'masonry') {
                    y = $($elem)[0]['attributes']['data-gs-height'].value * this.properties.singleHeight;
                } else {
                    y = $($elem)[0]['attributes']['data-gs-height'].value;
                }
            }
            var name = $elem.id === undefined ? $elem[0]['attributes']['id'].value : $elem.id;
            $('#' + name + ' > .el-size-viewer').text(x + ' x ' + y);
        },

        showToolBox: function(){
            this.$element.parents('.rexpansive_section').children('.toolBox').addClass('tool-box-active');
        },

        hideToolBox: function(){
            this.$element.parents('.rexpansive_section').children('.toolBox').removeClass('tool-box-active');
        },

        _prepareElements: function () {
            var gallery = this;
            var blockContent;
            var imageWidth;
            $(gallery.$element).children('.grid-stack-item').each(function () {
                var $elem = $(this);
                gallery._updateElementPadding($elem.children('.grid-stack-item-content'));
                gallery._addHandles(this, 'e, s, w, se, sw');
                gallery._addSizeViewer(this);
                
                blockContent = $elem.find('.grid-stack-item-content');
                imageWidth = blockContent.attr('data-background-image-width');
                if($elem.outerWidth()<imageWidth){
                    if(!blockContent.hasClass('small-width')){
                        blockContent.addClass('small-width');
                    }
                } else {
                    blockContent.removeClass('small-width');
                }
                
                $('#' + this.id).attr({
                    "data-gs-min-width": 1,
                    "data-gs-min-height": 1,
                    "data-gs-max-width": 500
                });
                
                // adding text wrap element if it's not there
               /*  if (($elem.find('.text-wrap')).length == 0) {
                    var textEl = document.createElement('div');
                    $(textEl).addClass('text-wrap');
                    $($elem.find('.rex-custom-scrollbar')).append(textEl);
                } */

                $elem.click(function(event){
                    gallery._focusElement($elem);
                });

                $elem.mousedown(function (event) {
                    if ((gallery.properties.elementEdited === null) && !$elem.hasClass('focused')) {
                        gallery._focusElement($elem);
                    }
                });

                $(document).mouseup(function (e) {
                    gallery._unFocusElement($elem);
                    // FIXARE
                    /* $($elem[0].id).trigger('hover'); */
                });

                $elem.hover(function (event) {
                    if (!Util.elementIsResizing) {
                        gallery._focusElement($elem);
                    }
                    if (gallery.properties.elementEdited != null) {
                        var grid = gallery.$element.data('gridstack');
                        if ($($elem)[0].id !== gallery.properties.elementEdited.id) {
                            grid.enable();
                            $(gallery.$element).addClass('gridActive');
                            gallery._focusElement($elem);
                        } else {
                            grid.disable();
                            $(gallery.$element).removeClass('gridActive');
                            gallery._unFocusElement($elem);
                        }
                    }
                }, function () {
                    if (!Util.elementIsResizing) {
                        gallery._unFocusElement($elem);
                    }
                });

                $elem.keydown(function () {
                    console.log('keydown');
                    //gallery.fixElementTextSize(this, null);
                });

                $elem.dblclick(function () {
                    console.log('double click event');
                    gallery._hideSizeViewer($elem);
                    var grid = gallery.$element.data('gridstack');
                    grid.disable();
                    $(gallery.$element).removeClass('gridActive');
                    console.log('disable grid');
                    gallery.properties.elementEdited = this;
                    gallery.properties.elementStartingH = parseInt($elem[0]['attributes']['data-gs-height'].value);
                    var textWrap = $elem.find('.text-wrap');
                    console.log(textWrap);
                    $(textWrap)[0].focus();
                    //$(textWrap.lastChild)[0].focus();
                    /* if()#mCSB_1_container > div > div
                    $()[0].focus(); */
                });
            });
        },

        _hideSizeViewer: function($elem){
            $elem.children('.el-size-viewer').removeClass('focused');
        },
        
        _focusElement: function ($elem) {
            $elem.children('.el-size-viewer').addClass('focused');
            $elem.addClass('focused');
            $elem.parent().addClass('focused');
            $elem.parent().parent().addClass('focused');
            $elem.parent().parent().parent().addClass('focused');
            $elem.parent().parent().parent().parent().addClass('focused');
        },
        
        _unFocusElement: function ($elem) {
            $elem.children('.el-size-viewer').removeClass('focused');
            $elem.removeClass('focused');
            $elem.parent().removeClass('focused');
            $elem.parent().parent().removeClass('focused');
            $elem.parent().parent().parent().removeClass('focused');
            $elem.parent().parent().parent().parent().removeClass('focused');
        },

        _linkResizeEvents: function () {
            var gallery = this;
            var block, xStart, wStart, xView, yView;
            var imageWidth;
            var $blockContent;
            $(gallery.$element).on('resizestart', function (event, ui) {
                gallery.properties.resizeHandle = $(event.toElement).attr('data-axis');
                block = $(event.target)[0];
                $blockContent = $(block).find('.grid-stack-item-content');
                imageWidth = $blockContent.attr('data-background-image-width');
                Util.elementIsResizing = true;
                xStart = parseInt(block['attributes']['data-gs-x'].value);
                if (gallery.properties.resizeHandle == 'e' || gallery.properties.resizeHandle == 'se') {
                    $('#' + block.id).attr("data-gs-max-width", (gallery.settings.numberCol - xStart));
                } else {
                    wStart = parseInt(block['attributes']['data-gs-width'].value);
                    //$('#' + block.id).attr("data-gs-max-width", (xStart + wStart));
                }
            }).on('resize', function (event, ui) {
                if($(block).outerWidth()<imageWidth){
                    if(!$blockContent.hasClass('small-width')){
                        $blockContent.addClass('small-width');
                    }
                } else {
                    $blockContent.removeClass('small-width');
                }
                xView = Math.round($(block).outerWidth() / gallery.properties.singleWidth);
                if (gallery.settings.galleryLayout == 'masonry') {
                    yView = $(block).outerHeight();
                } else {
                    if (! $(block).hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') &&!$blockContent.hasClass('youtube-player')) {
                        gallery.fixElementTextSize(block, gallery.properties.singleWidth);
                    }
                    yView = Math.round($(block).outerHeight() / gallery.properties.singleWidth);
                } 
                gallery.updateSizeViewerText(block, xView, yView);
                /* if (gallery.properties.resizeHandle == 'w' || gallery.properties.resizeHandle == 'sw') {
                    ;
                } */
            }).on('gsresizestop', function (event, elem) {
                gallery.updateSizeViewerText(elem);
                if (gallery.settings.galleryLayout == 'masonry') {
                    $('#' + block.id).attr("data-height", Math.round(($('#' + block.id).attr("data-gs-height")) / gallery.properties.singleWidth));
                }
                $('#' + block.id).attr("data-gs-max-width", "500");
                gallery.updateAllElementsProperties();
                Util.elementIsResizing = false;
            });
        },
        
        _linkDragEvents: function(){
            var gallery = this;
            
            // eventi per il drag
            $(gallery.$element).on('dragstart', function (event, ui) {
                Util.elementIsDragging = true;
                //console.log('drag start');
            }).on('drag', function (event, ui) {
                //console.log('dragging');
            }).on('dragstop', function (event, ui) {
                //console.log('drag end');
                Util.elementIsDragging = false;
            })
        },

        // Launching Packery plugin
        _launchGridStack: function () {
            var gallery = this;
            var floating;
            if (gallery.settings.galleryLayout == 'masonry') {
                floating = false;
            } else {
                floating = true;
            }

            $(gallery.$element).gridstack({
                acceptWidgets: false,
                alwaysShowResizeHandle: true,
                disableOneColumnMode: true,
                cellHeight: gallery.properties.singleHeight,
                draggable: {
                    containment: 'parent',
                    handle: '.grid-stack-item-content',
                    scroll: false,
                },
                float: floating,
                resizable: {
                    minWidth: gallery.properties.singleWidth,
                    minHeight: gallery.properties.singleHeight,
                    handles: {
                        'e': '.ui-resizable-e',
                        's': '.ui-resizable-s',
                        'w': '.ui-resizable-w',
                        'se': '.ui-resizable-se',
                        'sw': '.ui-resizable-sw'
                    }
                },
                verticalMargin: 0,
                width: gallery.settings.numberCol
            });

            var classList = gallery.$element.attr('class').split(/\s+/);
            var classNameParts;
            $.each(classList, function (index, item) {
                classNameParts = item.split('-');
                if (classNameParts[2] != undefined && classNameParts[2] == 'instance') {
                    gallery.properties.gridstackInstanceID = classNameParts[3];
                }
            });
            //console.log(gallery.$element.data('gridstack'));
            //console.log('gridstack ready');
            $(gallery.$element).addClass('gridActive');
        },

        _addElementToTextEditor: function ($editor, $elem) {
            if (($elem.find('.text-wrap')).length != 0) {
                $editor.addElements($($elem).find('.text-wrap'));
            } else {
                var textEl = document.createElement('div');
                $(textEl).addClass('text-wrap');
                $($elem.find('.rex-custom-scrollbar')).append(textEl);
                $editor.addElements(textEl);
            }
        },

        _launchTextEditor: function () {
            var gallery = this;
            var divToolbar = document.createElement('div');

            $(divToolbar).attr({
                'id': this.properties.sectionNumber + '-SectionTextEditor',
                'class': 'editable',
                'style': 'display: none'
            });
            $($('.rexpansive_section').parent()).prepend(divToolbar);

            rangy.init();

            var editor = new MediumEditor('.editable', {
                toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'h2']
                },
                placeholder: {
                    /* This example includes the default options for placeholder,
                       if nothing is passed this is what it used */
                    text: '',
                    hideOnClick: true
                }
            });
            var $elem;
            var $blockContent;
            $(gallery.$element).children('.grid-stack-item').each(function () {
                //fixing scrollbars
                $elem = $(this);
                $blockContent = $elem.find('.grid-stack-item-content');
                if (!$elem.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') &&!$blockContent.hasClass('youtube-player')) {
                    gallery._addElementToTextEditor(editor, $elem);
                    gallery.fixElementTextSize(this, null);
                }
            });
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
                    $(this).height((Gallery.properties.singleWidth * $(this).attr('data-height')) - (Gallery.properties.halfSeparator * 2));
                });
        },

        // Calculate masonry blocks height
        _calculateBlockHeightMasonry: function () {
            var gallery = this;
            var grid = gallery.$element.data('gridstack');
            var w;
            var $elem;
            var gutter = gallery.properties.gutter;
            var sw = gallery.properties.singleWidth;
            var origH;
            var h, backgroundHeight, h2, hText;
            var $this;
            Util.elementIsResizing = true;
            this.$element.find('.grid-stack-item-content').each(function () {
                h = 0;
                backgroundHeight = 0;
                h2 = 0;
                hText = 0;
                $this = $(this);
                $elem = $this.parent();
                w = $elem[0]['attributes']['data-width'].value;
                if ($this.hasClass('full-image-background')) {
                    backgroundHeight = (parseInt($this.attr('data-background-image-height')) * (w * sw)) / (parseInt($this.attr('data-background-image-width')));
                } else if ($this.hasClass('natural-image-background')) {
                    if ($this.hasClass('small-width')) {
                        backgroundHeight = (parseInt($this.attr('data-background-image-height')) * (w * sw)) / (parseInt($this.attr('data-background-image-width')));
                    } else {
                        backgroundHeight = parseInt($this.attr('data-background-image-height')) + gutter;
                    }
                }

                if ($($this.find('.text-wrap')[0]).text().length != 0) {
                    hText = $($this.find('.text-wrap')[0]).innerHeight() + gutter;
                }
                if ((backgroundHeight == 0 && hText == 0) || $this.hasClass('youtube-player') || $this.hasClass('empty-content') || $this.hasClass('block-has-slider') || $elem.hasClass('block-has-slider')) {
                    origH = $elem.attr('data-height');
                    h2 = Math.ceil(sw * origH);
                };
                h = Math.max(backgroundHeight, h2, hText);
                h = Math.ceil(h / gallery.properties.singleHeight);
                $elem.attr('data-gs-height', h);
                grid.update($elem, null, null, w, h);
            });
            Util.elementIsResizing = false;
            //gallery.updateAllElementsProperties();
            /*  else if($elem.hasClass('natural-fluid-image') || $elem.find('.natural-image-content').length != 0){
                h = $($elem.find('.natural-image-content')[0]).innerHeight();
                h+= gallery.properties.halfSeparatorElementBottom;
            } 
                /*          this.$element.find(this.settings.itemSelector + ' .empty-content')
                .add(this.$element.find(this.settings.itemSelector + ' .image-content :not(.text-wrap)'))
    .add(this.$element.find(this.settings.itemSelector + '.only-background').children())
    .add(this.$element.find(this.settings.itemSelector + '.block-has-slider').children())
                .each(function () {
                    var $this = $(this);
                    if ($this.css('background-image') != 'none' ||
                        $this.hasClass('empty-content') ||
                        ($this.css('background-color') != 'none' && $this.find('img').length === 0) ||
                        $this.parent().hasClass('block-has-slider')) {
                        var gridHeight =
                            Gallery.properties.singleWidth *
                            $this.parents(Gallery.settings.itemSelector).attr('data-gs-height');
                        $this.parents(Gallery.settings.itemSelector).attr('data-gs-height') = gridHeight;
                    }
                }); */
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
