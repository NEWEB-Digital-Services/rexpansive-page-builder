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
            mobilePadding: 'false',
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
            packeryReady: false,
            elementIsResizing: false,
            elementHasScrollBar: false,
            elementStartingH: 0,
            percentFactorHandlers: 0.15,
            lostPixels: 0,
            elemHasFocus: false
        };
        this.packerySettings = {
            itemSelector: '',
            columnWidth: 0,
            rowHeight: 0,
            gutter: 0,
            percentPosition: false
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

            //this._setGridPadding();
            this._setParentGridPadding();
/*
            this._definePackerySettings();
            
            var $container = this.$element.packery(this.packerySettings);

            this._defineDynamicPrivateProperties($container); */
            
                        
            //var $container = this.$element.packery(this.packerySettings);

            this._defineDynamicPrivateProperties();

            this._definePackerySettings();

            this._fixHeightAllElements();
            
            this._launchPackery();

            console.log(this.properties.wrapWidth, this.properties.singleWidth);

            this.$element.on('layoutComplete', function () {
                //console.log('layout complete');
            });

            $(window).on('resize', { Gallery: this }, function (event) {
                //Fixare le ancore
                /* if (!event.data.Gallery.properties.elementIsResizing) {
                    var G = event.data.Gallery;
                    G._defineDynamicPrivateProperties();
                    G._fixHeightAllElements();
                    $(G).children('.perfect-grid-item').each(function (G) {
                        G._fixHandlesPosition(this);
                    });
                } */
            });

            $(window).on('load', { Gallery: this }, function (event) {
                /* var G = event.data.Gallery;
                setTimeout(function () {
                    $(G.$element).find('.perfect-grid-item').each(function(){
                        console.log('ciao');
                        //G.fitLayoutGrid(this);
                    });
                }, 10000); */
            });
        },

        refreshGrid: function () {

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._fixHeightAllElements();

            //this._launchPackery();

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

        fixElementTextSize: function ($elem, $handler, $elemHasScrollbar) {
            var $textElement = $('#' + $elem.id).find('.text-wrap');
            if (!$($elem).hasClass('block-has-slider') && ($($textElement).innerHeight() != null)) {
                var block = $($elem)[0];
                var hStep = this.properties.singleWidth;
                var currentHeightBlock, maxBlockHeight, textHeight;
                var $textContent = $($elem).children('.text-content');
                currentHeightBlock = parseInt(block['attributes']['data-height'].value);
                maxBlockHeight = currentHeightBlock * hStep;
                textHeight = $($textElement).innerHeight();
                if ($handler == 'e') {
                    if (this.properties.elementHasScrollBar) {
                        this.updateElementScrollBar($textContent, textHeight, maxBlockHeight);
                    } else {
                        do {
                            this.updateElementProperty($elem, 'w');
                            currentHeightBlock = parseInt(block['attributes']['data-height'].value);
                            maxBlockHeight = currentHeightBlock * hStep;
                            textHeight = $($textElement).innerHeight();
                            if (textHeight >= maxBlockHeight) {
                                block['attributes']['data-height'].value = currentHeightBlock + 1;
                                this._fixHeightElement(block);
                            }
                        } while (textHeight > maxBlockHeight);
                    }
                } else {
                    this.updateElementScrollBar($textContent, textHeight, maxBlockHeight);
                }
            }
        },

        updateElementScrollBar: function ($textContent, textHeight, maxBlockHeight) {
            if (textHeight >= maxBlockHeight) {
                if (!$textContent.hasClass('.rex-custom-scrollbar')) {
                    $textContent.addClass('.rex-custom-scrollbar');
                    $textContent.mCustomScrollbar();
                }
            } else {
                if ($textContent.hasClass('.rex-custom-scrollbar')) {
                    $textContent.removeClass('.rex-custom-scrollbar');
                    $textContent.mCustomScrollbar('destroy');
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

        relayoutGrid: function () {
            //console.log('parte relayout');
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
        
        updateElementXYproperties: function($elem){
            this.updateElementProperty($elem, 'x');
            this.updateElementProperty($elem, 'y');
        },

        updateElementWHproperties: function($elem){
            this.updateElementProperty($elem, 'w');
            this.updateElementProperty($elem, 'h');
            var w = $($elem)[0]['attributes']['data-width'].value;
            var h = $($elem)[0]['attributes']['data-height'].value;
            $('#'+$elem.id+' > .el-size-viewer').text(w+' x '+h);
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
                    console.log('invalid choise!');
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

            var startingWidth = $(this.$element).outerWidth();
            var n = Math.floor($(this.$element).outerWidth()/12);
            var newWidth = n*12;
            this.properties.lostPixels = startingWidth-newWidth;
            this.properties.wrapWidth =  newWidth;
            this.properties.singleWidth = n;
            $(this.$element).css('width', newWidth);
            //this.$element.packery('destroy');
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
            this.packerySettings.itemSelector = this.settings.itemSelector;
            this.packerySettings.columnWidth = this.properties.singleWidth;
            this.packerySettings.rowHeight = this.properties.singleWidth;
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
            //$($elem).css('width', "");
            $($elem).css('padding-left', this.properties.halfSeparatorElementLeft);
            $($elem).css('padding-top', this.properties.halfSeparatorElementTop);
            $($elem).css('padding-bottom', this.properties.halfSeparatorElementBottom);
            $($elem).css('padding-right', this.properties.halfSeparatorElementRight);
        },

        _fixHeightElement: function ($elem) {
            var h = this.properties.singleWidth * parseInt($($elem).attr('data-height'));
            var w = this.properties.singleWidth * parseInt($($elem).attr('data-width'));
            $($elem).outerHeight(h);
            $($elem).outerWidth(w);
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

        _addSizeViewer: function($elem){
            var spanViewer = document.createElement('span');
            spanViewer.setAttribute('id', $elem.id.concat('-size-viewer'));
            $(spanViewer).addClass('el-size-viewer');
            $(spanViewer).css('left', this.properties.halfSeparatorElementLeft);
            $(spanViewer).css('bottom', this.properties.halfSeparatorElementBottom);
            $elem.append(spanViewer);
        },

        // add span elements that will be used as handles of the element
        _addHandles: function ($elem) {
            var Gallery = this;
            var $handles = [];
            var $circles = [];
            for (var $i = 0; $i < 3; $i++) {
                $handles[$i] = document.createElement('div');
            }
            for (var $i = 0; $i < 3; $i++) {
                $circles[$i] = document.createElement('span');
            }

            // east handler
            $handles[0].setAttribute('class', 'ui-resizable-handle ui-resizable-e');
            $handles[0].setAttribute('id', $elem.id.concat('e'));
            $($handles[0]).css('width', '40px');
            $circles[0].setAttribute('class','circle-handle circle-handle-e');
            $($circles[0]).css('position', 'absolute');

            // south handler
            $handles[1].setAttribute('class', 'ui-resizable-handle ui-resizable-s');
            $handles[1].setAttribute('id', $elem.id.concat('s'));
            $($handles[1]).css('height', '40px');
            $circles[1].setAttribute('class', 'circle-handle circle-handle-s');
            $($circles[1]).css('position', 'absolute');

            // south-est handler
            $handles[2].setAttribute('class', 'ui-resizable-handle ui-resizable-se');
            $handles[2].setAttribute('id', $elem.id.concat('se'));
            $circles[2].setAttribute('class', 'circle-handle circle-handle-se');
            $($circles[2]).css('position', 'absolute');

            $($elem).mousedown(function () {
                $($elem).css({
                    'overflow': 'visible',
                    'z-index': '2',
                    'outline': '1px dashed rgba(0,0,0,0.5)',
                    '-webkit-box-shadow': '0px 0px 111px 1px rgba(0,0,0,0.8)',
                    '-moz-box-shadow': '0px 0px 111px 1px rgba(0,0,0,0.8)',
                    'box-shadow': '0px 0px 111px 1px rgba(0,0,0,0.8)',
                });
                $($elem).parent().css('overflow', 'visible');
                $($elem).parent().parent().css('overflow', 'visible');
                $($elem).parent().parent().parent().css('overflow', 'visible');
                $($elem).parent().parent().parent().parent().css('z-index', '31');
                $('#' + $elem.id + ' > ' + ' .ui-resizable-handle').css('visibility', 'visible');
                $('#' + $elem.id + ' > ' + ' .el-size-viewer').css('visibility', 'visible');
                if (!$($elem).hasClass('elem-is-resizing')) {
                    $($elem).addClass('elem-is-resizing');
                }
            });

            $(document).mouseup(function (e) {
                $('.elem-is-resizing').css({
                    'overflow': 'hidden',
                    'z-index': '',
                    'outline': 'none',
                    '-webkit-box-shadow': 'none',
                    '-moz-box-shadow': 'none',
                    'box-shadow': 'none',
                });
                $('.elem-is-resizing').parent().css('overflow', 'hidden');
                $('.elem-is-resizing').parent().parent().css('overflow', 'hidden');
                $('.elem-is-resizing').parent().parent().parent().css('overflow', 'hidden');
                $('.elem-is-resizing').parent().parent().parent().parent().css('z-index', 'auto');
                $('#' + $elem.id + ' > ' + ' .ui-resizable-handle').css('visibility', 'hidden');
                $('#' + $elem.id + ' > ' + ' .el-size-viewer').css('visibility', 'hidden');
                $('.elem-is-resizing').removeClass('elem-is-resizing');
            });

            $($elem).hover(function () {
                if (!Gallery.properties.elementIsResizing) {
                    $($elem).css({
                        'overflow': 'visible',
                        'z-index': '2',
                        'outline': '1px dashed rgba(0,0,0,0.5)',
                        '-webkit-box-shadow': '0px 0px 111px 1px rgba(0,0,0,0.8)',
                        '-moz-box-shadow': '0px 0px 111px 1px rgba(0,0,0,0.8)',
                        'box-shadow': '0px 0px 111px 1px rgba(0,0,0,0.8)',
                    });
                    $($elem).parent().css('overflow', 'visible');
                    $($elem).parent().parent().css('overflow', 'visible');
                    $($elem).parent().parent().parent().css('overflow', 'visible');
                    $($elem).parent().parent().parent().parent().css('z-index', '31');
                    $('#' + $elem.id + ' > ' + ' .ui-resizable-handle').css('visibility', 'visible');
                    $('#' + $elem.id + ' > ' + ' .el-size-viewer').css('visibility', 'visible');
                }
            }, function () {
                if (!Gallery.properties.elementIsResizing) {
                    $($elem).css({
                        'overflow': 'hidden',
                        'z-index': '',
                        'outline': 'none',
                        '-webkit-box-shadow': 'none',
                        '-moz-box-shadow': 'none',
                        'box-shadow': 'none',
                    });
                    $($elem).parent().css('overflow', 'hidden');
                    $($elem).parent().parent().css('overflow', 'hidden');
                    $($elem).parent().parent().parent().css('overflow', 'hidden');
                    $($elem).parent().parent().parent().parent().css('z-index', 'auto');
                    $('#' + $elem.id + ' > ' + ' .ui-resizable-handle').css('visibility', 'hidden');
                    $('#' + $elem.id + ' > ' + ' .el-size-viewer').css('visibility', 'hidden');
                }
            });

            for (var $i = 0; $i < 3; $i++) {
                $handles[$i].append($circles[$i]);
                $('#' + $elem.id).append($handles[$i]);
            }
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
                lseCircle = $($elem).outerWidth() * this.properties.percentFactorHandlers-5,
                tseCircle = $($elem).outerHeight() * this.properties.percentFactorHandlers-5;

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

        createResizePlaceHolder: function($elem){
            var block = $($elem)[0];
            var $placeholder = document.createElement('div');
            $($elem).parent().append($placeholder);
            $($placeholder).addClass('resizePlaceHolder');
            $($placeholder).addClass('w'+parseInt(block['attributes']['data-width'].value));
            var x = parseInt(block['attributes']['data-row'].value-1)*this.properties.singleWidth;
            var y = parseInt(block['attributes']['data-col'].value-1)*this.properties.singleWidth;
            $($placeholder).css('transform', 'translate('+y+'px, '+x+'px)');
            $($placeholder).css('position', 'absolute');
            return $placeholder;
        },
        
        updateResizePlaceHolder: function($resizePlaceHolder, $elem){
            var block = $($elem)[0];
            var width = this.properties.singleWidth;
            var w = parseInt(block['attributes']['data-width'].value);
            
            var nW = Math.round(parseInt($(block).outerWidth()) / width);
            if (nW <= 0) {
                nW = 1;
            }
            // updating element class
            $($resizePlaceHolder).removeClass();
            $($resizePlaceHolder).addClass('resizePlaceHolder '+'w' + nW);
            var nH = Math.round(parseInt($(block).outerHeight()) / width);
            if (nH <= 0) {
                nH = 1;
            }
            $($resizePlaceHolder).css('width', nW*width+"px");
            $($resizePlaceHolder).css('height', nH*width+"px");
        },

        // Launching Packery plugin
        _launchPackery: function () {

            this.$element.packery(this.packerySettings);
            var Gallery = this;
            var $items = this.$element.find('.perfect-grid-item');

            $items.each(function () {
                var $elem = this;
                var $resizePlaceHolder;
                Gallery._addHandles(this);
                Gallery._fixHandlesPosition(this);
                Gallery._addSizeViewer(this);
                $(this).resizable({
                    minWidth: Gallery.properties.singleWidth,
                    minHeight: Gallery.properties.singleWidth,
                    handles: {
                        'e': '.ui-resizable-e',
                        's': '.ui-resizable-s',
                        'se': '.ui-resizable-se'
                    },
                    start: function () {
                        var $textContent = $($elem).children('.text-content');
                        if ($textContent.hasClass('.rex-custom-scrollbar')) {
                            Gallery.properties.elementHasScrollBar = true;
                        }
                        Gallery.properties.elementIsResizing = true;
                        var width = Gallery.properties.singleWidth;
                        var block = $(this)[0];
                        var yStart = parseInt(block['attributes']['data-col'].value) - 1;
                        $(this).resizable("option", "maxWidth", (Gallery.settings.numberCol - yStart) * width);
                        $resizePlaceHolder = Gallery.createResizePlaceHolder(this);
                    },
                    resize: function (event, ui) {
                        Gallery.fixElementTextSize($elem, $(this).data('ui-resizable').axis);
                        Gallery._fixHandlesPosition(this);
                        Gallery.fitLayoutGrid(this);
                        Gallery.updateResizePlaceHolder($resizePlaceHolder, this);
                        Gallery.updateElementWHproperties(this);
                        Gallery.updateAllElementsXYproperties();
                    },
                    stop: function () {
                        Gallery.properties.elementIsResizing = false;
                        Gallery.updateAllElementsAllNewProperties();
                        if (!Gallery.properties.southHandleFlag) {
                            Gallery.fixElementTextSize($elem);
                            Gallery.updateAllElementsXYproperties();
                        }
                        Gallery._fixHeightAllElements();
                        Gallery.fitLayoutGrid(this);
                        Gallery.updateAllElementsXYproperties();
                        Gallery._fixHandlesPosition(this);
                        Gallery.properties.elementHasScrollBar = false;
                        $($resizePlaceHolder).remove();
                    }
                });
                $(this).draggable({
                    drag: function(){
                        ;
                    },
                    stop: function () {
                        Gallery.updateAllElementsXYproperties();
                    }
                });
            });

            // bind drag events to Packery
            this.$element.packery('bindUIDraggableEvents', $items);
            Gallery.updateAllElementsAllNewProperties();
            // packery is ready
            Gallery.properties.packeryReady = true;
            //Gallery.refreshGrid();
            Gallery._fixHeightAllElements();
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
