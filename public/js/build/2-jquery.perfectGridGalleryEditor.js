/*
 *  Perfect Grid Gallery Editor
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
        // more objects, storing the result in the first object. The first
        // object
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
            gutter: 0,
            elementStartingH: 0,
            percentFactorHandlers: 0.15,
            lostPixels: 0,
            elemHasFocus: false,
            resizeHandle: '',
            sectionNumber: null,
            elementEdited: null,
            gridstackInstanceID: null,
            serializedData: [],
            firstStartGrid: false,
            lastIDBlock: null,
            mediumEditorIstance: null
        };

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(perfectGridGalleryEditor.prototype, {
        init: function () {

            this.properties.firstStartGrid = true;

            this._setGridID();

            console.log('First Start grid: ' + this.properties.sectionNumber);

            this._updateBlocksID();

            this._findLastIDBlock();

            this._defineDataSettings();

            this._setGutter();

            this._defineSeparatorProperties();

            this._setParentGridPadding();

            this._defineDynamicPrivateProperties();

            this._prepareElements();

            this._launchGridStack();

            this._linkResizeEvents();

            this._linkDragEvents();

            var gallery = this;

            if (Rexbuilder_Util_Editor.sectionCopying) {
                gallery.hideSectionToolBox();
                gallery._removeScrollbars();
            }

            Rexbuilder_Util_Editor.elementIsDragging = false;
            Rexbuilder_Util_Editor.elementIsResizing = false;
            Rexbuilder_Util_Editor.editingElement = null;


            //a che cazzo serve?
            this.$element.on('change', { Gallery: gallery}, function (event, items) {
                if (event.data.Gallery.properties.firstStartGrid) {
                    // event.data.Gallery.saveGrid();
                    console.log('Grid ' + event.data.Gallery.properties.sectionNumber + " changed");
                    event.data.Gallery.properties.firstStartGrid = false;
                } else {
                    if (!Rexbuilder_Util_Editor.elementIsDragging && !Rexbuilder_Util_Editor.elementIsResizing) {
                        event.data.Gallery.updateAllElementsProperties();
                        // event.data.Gallery.saveGrid();
                    }
                }
            });

            if (!Rexbuilder_Util.editorMode) {
                this.frontEndMode();
            } else {
                (gallery.$element).parents(".rexpansive_section").hover(function (event) {
                    gallery.showSectionToolBox();
                }, function () {
                    gallery.hideSectionToolBox();
                });
            }

            /*   
            // launching event 'editor is ready'
            var gridReadyEvent = jQuery.Event("gridGalleryEditorReady");
            gridReadyEvent.gallery = this;
            $(document).trigger(gridReadyEvent); 
            */
        },


        updateGrid: function () {
            var gallery = this;

            // if there is masonry layout               
            if (Rexbuilder_Util.editorMode) {
                gallery._launchTextEditor();
            }
            console.log("text editor launched");
            if (gallery.settings.galleryLayout == 'masonry') {
                gallery._calculateBlockHeightMasonry();
                gallery.updateAllElementsProperties();
            }

            gallery.$element.children('.grid-stack-item').each(function () {
                var $elem = $(this);
                gallery.updateSizeViewerText($elem);
                // we need gridstack launched to calculate block heights
                if (!$elem.hasClass('block-has-slider')) {
                    gallery.fixElementTextSize(this, null, null);
                }
            });

            //gallery.$element.trigger('change');
            console.log('Grid ' + gallery.properties.sectionNumber + " launched");
        },

        refreshGrid: function () {

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._fixHeightAllElements();

            // this._launchGridStack();

            /*
			 * setTimeout(function () { //console.log('refreshing grid'); //
			 * G.$element.Packery('layout'); G.relayoutGrid();
			 * G.$element.trigger('rearrangeComplete');
			 * G.$element.trigger('refreshComplete'); }, 400);
			 */
        },

        _findLastIDBlock: function () {
            var max = -1;
            var temp;
            this.$element.find('.grid-stack-item').each(function () {
                temp = parseInt($(this).attr("data-rexbuilder-block-id").split('_')[1]);
                if (temp > max) {
                    max = temp;
                }
            });
            this.properties.lastIDBlock = max;
        },

        _setGridID: function () {
            this.properties.sectionNumber = parseInt(($(this.element).parents('.rexpansive_section')).attr('data-rexlive-section-id'));
            this.$element.addClass('grid-number-' + this.properties.sectionNumber);
        },

        _updateBlocksID: function () {
            var $gallery = this;
            this.$element.find('.grid-stack-item').each(function (i, e) {
                $(e).attr("data-rexbuilder-block-id", $gallery.properties.sectionNumber + "_" + i);
                $(e).children(".rexbuilder-block-data").attr("data-rexbuilder-block-data-id", $gallery.properties.sectionNumber + "_" + i);
            });
        },

        /**
		 * Funzione chiamata per il salvataggio della griglia
		 */
        saveGrid: function () {
            var gallery = this;
            var singleHeight = gallery.settings.galleryLayout == 'masonry' ? gallery.properties.singleHeight / gallery.properties.singleWidth : 1;
            this.serializedData = _.map(gallery.$element.children('.grid-stack-item'), function (el) {
                var $el = $(el);
                var node = $el.data('_gridstack_node');
                return {
                    id: el.id,
                    x: node.x,
                    y: Math.round(node.y * singleHeight),
                    width: node.width,
                    height: Math.round(node.height * singleHeight)
                };
            }, this);
        },

        getGridData: function () {
            return JSON.stringify(this.serializedData, null, '    ');
        },

        /**
		 * Funzione che aggiorna la scollbar all'interno del blocco
		 */
        fixElementTextSize: function (block, $handler, event) {
            if (!$(block).hasClass('block-has-slider')) {
                var $textWrap = $(block).find('.text-wrap');
                var $blockContent = $(block).find('.rex-custom-scrollbar');
                var maxBlockHeight = $blockContent.parents('.grid-item-content').innerHeight();
                var textHeight = $textWrap.innerHeight();
                var dataBlock = $(block).children('.rexbuilder-block-data');
                
                // se il resize del blocco viene fatto tramite una maniglia
                if ($handler !== null) {
                    // updating scrollbar
                    $blockContent.mCustomScrollbar("update");
                    // aggiornamento della scrollbar del blocco se il layout e'
                    // masonry
                    if (this.settings.galleryLayout == 'masonry') {
                        if ($blockContent.hasClass('mCS_no_scrollbar') || $blockContent.hasClass('mCS_disabled')) {
                            if ($(dataBlock).attr('data-block_has_scrollbar') != 'false') {
                                $(dataBlock).attr('data-block_has_scrollbar', 'false');
                            }
                        } else {
                            if ($(dataBlock).attr('data-block_has_scrollbar') != 'true') {
                                $(dataBlock).attr('data-block_has_scrollbar', 'true');
                            }
                            $(dataBlock).attr('data-block_height_masonry', block['attributes']['data-gs-height'].value);
                        }
                    }
                } else {
                    
                    // TODO aggiungere il caso in cui il blocco e' nuovo
                    // Il blocco non ha la barra
                    if ($(block).find('.mCustomScrollBox').length === 0) {
                        // Primo avvio del blocco
                        //console.log(dataBlock + " senza barra");
                        // se il layout e' di tipo masonry
                        if (this.settings.galleryLayout == 'masonry') {
                            //console.log('setting ' + block.id + ' height');
                            var grid = this.$element.data('gridstack');
                            var w = parseInt(block['attributes']['data-gs-width'].value);
                            var h = parseInt(block['attributes']['data-gs-width'].value);
                            
                            if ($(dataBlock).attr('data-block_has_scrollbar') == 'true') {
                                h = parseInt($(dataBlock).attr('data-block_height_masonry'));
                            } else {
                                $(dataBlock).attr('data-block_has_scrollbar', 'false');
                                h = parseInt(block['attributes']['data-gs-height'].value);
                                // differenza da ottenere per l'altezza giusta del
                                // blocco
                                
                                if (textHeight >= maxBlockHeight) {
                                    h = h + Math.ceil((textHeight - maxBlockHeight) / 5);
                                }
                                $(dataBlock).attr('data-block_height_masonry', h);
                            }
                            grid.update(block, null, null, w, h);
                            maxBlockHeight = h;
                            $blockContent.mCustomScrollbar();
                            $blockContent.mCustomScrollbar("update");
                            $blockContent.mCustomScrollbar("disable");
                        } else {
                            $blockContent.mCustomScrollbar();
                            $blockContent.mCustomScrollbar({ "setHeight": "50%" });
                            // $blockContent.mCustomScrollbar("update");
                        }
                        
                        if (textHeight < maxBlockHeight) {
                            $blockContent.mCustomScrollbar("disable");
                        }
                        
                    } else if (Rexbuilder_Util.windowIsResizing) {
                        $blockContent.mCustomScrollbar("update");
                    } else {
                        // successive modifiche dovute al cambiamento del contenuto
                        if ($blockContent.hasClass('mCS_no_scrollbar') || $blockContent.hasClass('mCS_disabled')) {
                            // se il layout della griglia e' masonry
                            if (this.settings.galleryLayout == 'masonry') {
                                var w = parseInt(block['attributes']['data-gs-width'].value);
                                var h = this.properties.elementStartingH;
                                var grid = this.$element.data('gridstack');
                                
                                if (textHeight >= maxBlockHeight) {
                                    h = h + Math.ceil((textHeight - maxBlockHeight) / this.properties.singleHeight);
                                } else {
                                    h = Math.max(h - Math.floor((maxBlockHeight - textHeight) / this.properties.singleHeight), parseInt($(dataBlock).attr('data-block_height_masonry')));
                                }
                                if(this.properties.elementStartingH !=  h) {
                                    grid.update(block, null, null, w, h);
                                    this.properties.elementStartingH = h;
                                }
                            }
                            
                            $blockContent.mCustomScrollbar({ "setHeight": "50%" });
                            $blockContent.mCustomScrollbar("update");
                        } else {
                            $blockContent.mCustomScrollbar("scrollTo", "100%", {
                                scrollInertia: 50
                            });
                        }
                    }
                }

                // updating sizeViewer Text
                this.updateSizeViewerSizes(this, block);
            }
        },

        _fixBlocksPosition: function () {
            var grid = this.$element.data('gridstack');
            $(this.element).children('.grid-stack-item').reverse().each(function () {
                grid.move(this, (parseInt($(this).attr('data-col')) - 1), (parseInt($(this).attr('data-row')) - 1));
            });
        },

        /**
         * Funzione che rimuove le scrollbar dai blocchi
         */
        _removeScrollbars: function () {
            var $elem;
            var $blockContent;
            $(this.element).children('.grid-stack-item').each(function () {
                $elem = $(this);
                $blockContent = $($elem.find('.grid-item-content')[0]);
                if (!$elem.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                    $blockContent.find('.rex-custom-scrollbar').mCustomScrollbar('destroy');
                }
            });
        },

        restoreBackup: function () {
            var block;
            var G = this;
            $(G.element).children('.grid-stack-item').each(function () {
                block = $(this)[0];
                $(this).attr({
                    'data-gs-x': block['attributes']['data-col'].value - 1,
                    'data-gs-y': block['attributes']['data-row'].value - 1,
                    'data-gs-width': block['attributes']['data-width'].value,
                    'data-gs-height': block['attributes']['data-height'].value
                });
                G.updateSizeViewerText($(this));
            });
        },

        updateSection: function (data) {
            var G = this;
            var oldLayout = G.settings.galleryLayout;

            G.settings.galleryLayout = data['layout'];
            console.log("Updating Section");
            if (oldLayout != G.settings.galleryLayout) {
                
                G.$element.attr("data-layout", G.settings.galleryLayout);
                $(G.element).parents('.rexpansive_section').find('.section-data').attr({
                    'data-layout': G.settings.galleryLayout
                });
                
                Rexbuilder_Util_Editor.elementIsResizing = true;
                Rexbuilder_Util_Editor.elementIsDragging = true;
                
                // destroying gridstack & jquery ui
                G.destroyGridstack();
                
                // destroy scrollbars
                G._removeScrollbars();
                
                // adding back the handles for resizing
                if (!Rexbuilder_Util_Editor.sectionCopying) {
                    $(G.element).children('.grid-stack-item').each(function () {
                        G._addHandles(this, 'e, s, w, se, sw');
                    });
                }
                
                G._defineDynamicPrivateProperties();
                
                // relaunching grid
                if (G.settings.galleryLayout == 'masonry') {
                    G._launchGridStack();
                    G._calculateBlockHeightMasonry();
                } else {
                    G.restoreBackup();
                    G._launchGridStack();
                    G._fixBlocksPosition();
                }

                $(G.element).children('.grid-stack-item').each(function () {
                    var $elem = $(this);
                    var $blockContent = $elem.find('.grid-item-content');
                    G.updateSizeViewerText($elem);
                    if (!$elem.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        G.properties.elementStartingH = parseInt(this['attributes']['data-gs-height'].value);
                        G.fixElementTextSize(this, null, null);
                    }
                });

                Rexbuilder_Util_Editor.elementIsResizing = false;
                Rexbuilder_Util_Editor.elementIsDragging = false;
                this.properties.firstStartGrid = true;
                G.$element.trigger('change');
                this.properties.firstStartGrid = false;
            }
            return;
        },

        /**
         * Function called for destroying gridstack-istance
		 */
        destroyGridstack: function () {
            var G = this;
            var grid = this.$element.data('gridstack');
            var $elem;
            grid.destroy(false);

            $(G.element).children('.grid-stack-item').each(function () {
                $elem = $(this);
                $elem.draggable("destroy");
                $elem.resizable("destroy");
            });

            G.$element.removeClass('grid-stack-instance-' + this.properties.gridstackInstanceID);
        },

        getGridWidth: function () {
            return this.properties.wrapWidth;
        },

        setGridWidth: function (width) {
            $(this.$element).outerWidth(width);
        },

        // insert elements in the Packery grid and reload the items according to
        // perfectGridGalleryEditor
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

        getSectionNumber: function () {
            return this.properties.sectionNumber;
        },
        setProperty: function (definition) {
            this.properties[definition[0]] = definition[1];
        },

        fillEmptySpaces: function () {
            var cols = this.settings.numberCol,
                rows = this._calculateGridHeight(),
                i,
                j;
            var guard;
            var grid = this.$element.data('gridstack');
            var w, h;
            var internal_i, internal_j;
            for (j = 1; j <= rows; j++) {
                for (i = 1; i <= cols; i++) {
                    if (grid.isAreaEmpty(i - 1, j - 1, 1, 1)) {
                        guard = 0;
                        w = h = 1;
                        internal_i = i;
                        internal_j = j;

                        while (internal_i <= cols && grid.isAreaEmpty(internal_i - 1, internal_j - 1, 1, 1)) {
                            guard = internal_i;
                            internal_i++;
                        }
                        w = internal_i - i;
                        internal_j++;
                        internal_i = i;

                        while (internal_j <= rows) {
                            while (internal_i <= guard) {
                                if (grid.isAreaEmpty(internal_i - 1, internal_j - 1, 1, 1)) {
                                    internal_i++;
                                } else {
                                    break;
                                }
                            }
                            if (internal_i - 1 == guard) {
                                internal_j++;
                                internal_i = i;
                            } else {
                                break;
                            }
                        }

                        h = internal_j - j;
                        this.createBlock(i - 1, j - 1, w, h);
                    }
                }
            }
        },

        // Function that creates a new empty block and returns it. The block is
        // added to gridstack and gallery
        createBlock: function (x, y, w, h) {

            if (this.settings.galleryLayout == 'masonry' && h * 5 < this.properties.singleWidth) {
                return;
            }
            var divGridItem = document.createElement('div');
            var divDragHandle = document.createElement('div');
            var divGridStackContent = document.createElement('div');
            var divGridItemContent = document.createElement('div');
            var divBlockOverlay = document.createElement('div');
            var divRexScrollbar = document.createElement('div');
            var divTextWrap = document.createElement('div');
            var gallery = this;
            var grid = this.$element.data('gridstack');
            var idBlock = gallery.properties.sectionNumber + "_" + (gallery.properties.lastIDBlock + 1);
            var idNewBlock = "block_" + idBlock;

            gallery.properties.lastIDBlock = gallery.properties.lastIDBlock + 1;

            $(divGridItem).attr({
                'id': idNewBlock,
                'class': 'perfect-grid-item grid-stack-item empty-block',
                'data-height': h,
                'data-width': w,
                'data-row': y + 1,
                'data-col': x + 1,
                'data-gs-height': h,
                'data-gs-width': w,
                'data-gs-y': y,
                'data-gs-x': x,
                'data-rexbuilder-block-id': idBlock
            });
            
            $(divDragHandle).attr({
                'class': 'rexlive-block-drag-handle'
            });

            $(divGridStackContent).attr({
                'class': 'grid-stack-item-content'
            });

            $(divGridItemContent).attr({
                'class': 'grid-item-content'
            });
            $(divBlockOverlay).attr({
                'class': 'responsive-block-overlay'
            });
            $(divRexScrollbar).attr({
                'class': 'rex-custom-scrollbar'
            });
            $(divTextWrap).attr({
                'class': 'text-wrap'
            });

            $(divTextWrap).appendTo(divRexScrollbar);
            $(divRexScrollbar).appendTo(divBlockOverlay);
            $(divBlockOverlay).appendTo(divGridItemContent);
            $(divGridItemContent).appendTo(divGridStackContent);
            $(divGridStackContent).appendTo(divGridItem);
            $(divDragHandle).appendTo(divGridItem);

            this._prepareElement(divGridItem);
            this.createElementProperties(divGridItem);
            grid.addWidget(divGridItem, x, y, w, h, false);
            this.updateSizeViewerText($(divGridItem), w, h);

            return divGridItem;
        },

        createElementProperties: function (elem) {
            var divProperties = document.createElement('div');
            var $elem = $(elem);
            var pos_y = this.settings.galleryLayout == 'masonry' ? Math.round(parseInt($elem.attr('data-row')) / this.properties.singleHeight) : parseInt($elem.attr('data-row'));
            var y = this.settings.galleryLayout == 'masonry' ? Math.round(parseInt($elem.attr('data-height')) / this.properties.singleHeight) : parseInt($elem.attr('data-height'));

            $(divProperties).attr({
                'id': elem.id + '-builder-data',
                'style': 'display: none;',
                'data-id': elem.id,
                'data-type': 'empty',
                'data-col': $elem.attr('data-col'),
                'data-row': pos_y,
                'data-size_x': $elem.attr('data-width'),
                'data-size_y': y,
                'data-color_bg_block': '',
                'data-image_bg_block': '',
                'data-id_image_bg_block': '',
                'data-type_bg_block': '',
                'data-video_bg_id': '',
                'data-video_bg_url': '',
                'data-video_bg_url_vimeo': '',
                'data-photoswipe': '',
                'data-linkurl': '',
                'data-image_size': 'full',
                'data-overlay_block_color': '',
                'data-rexbuilder-block-data-id': $elem.attr('data-rexbuilder-block-id')
            });
            $(divProperties).prependTo(elem);
        },

        isEven: function (number) {
            return number % 2 == 0;
        },

        // Updating elements properties
        updateAllElementsProperties: function () {
            var Gallery = this;
            console.log("Updating element properties grid " + Gallery.properties.sectionNumber);
            this.$element.find('.perfect-grid-item').each(function () {
                Gallery.updateElementAllProperties(this);
            });
        },

        updateElementAllProperties: function (elem) {
            this._updateElementSize(elem, 'x');
            this._updateElementSize(elem, 'y');
            this._updateElementSize(elem, 'w');
            this._updateElementSize(elem, 'h');
        },

        _updateElementSize: function (elem, $case) {
            var block = elem;
            var width = this.properties.singleWidth;
            var size;
            var dataBlock = $(block).children('.rexbuilder-block-data');
            switch ($case) {
                case 'x': {
                    size = parseInt(block['attributes']['data-gs-x'].value);

                    // gridster works 1 to n not 0 to n-1
                    size = size + 1;

                    block['attributes']['data-col'].value = size
                    $(dataBlock).attr({
                        'data-col': size
                    });
                    break;
                }
                case 'y': {
                    if (this.settings.galleryLayout == 'masonry') {
                        var oldSize = block['attributes']['data-row'].value - 1;
                        size = Math.floor(parseInt(block['attributes']['data-gs-y'].value) * this.properties.singleHeight / width);
                    } else {
                        size = parseInt(block['attributes']['data-gs-y'].value);
                    }

                    // gridster works 1 to n not 0 to n-1
                    size = size + 1;
                    block['attributes']['data-row'].value = size;
                    $(dataBlock).attr({
                        'data-row': size
                    });
                    break;
                }
                case 'w': {
                    var w = parseInt(block['attributes']['data-gs-width'].value);
                    var oldW = block['attributes']['data-width'].value;
                    block['attributes']['data-width'].value = w;
                    // updating element class
                    $(block).removeClass("w" + oldW);
                    $(block).addClass("w" + w);
                    $(dataBlock).attr({
                        'data-size_x': w
                    });
                    break;
                }
                case 'h': {
                    var h;
                    var oldH = block['attributes']['data-height'].value;
                    if (this.settings.galleryLayout == 'masonry') {
                        h = Math.round(parseInt(block['attributes']['data-gs-height'].value) * this.properties.singleHeight / width);
                    } else {
                        h = parseInt(block['attributes']['data-gs-height'].value);
                    }

                    block['attributes']['data-height'].value = h;
                    // updating element class
                    $(block).removeClass("h" + oldH);
                    $(block).addClass("h" + h);
                    $(dataBlock).attr({
                        'data-size_y': h
                    });
                    break;
                }
                default: {
                    break;
                }
            }
        },

        // Override options set by the jquery call with the html data
        // attributes, if presents
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
                this.properties.singleHeight = 5;
            } else {
                // Layout is grid-layout
                if (this.settings.fullHeight == 'true') {
                    this.properties.singleHeight = this._viewport().height / this._calculateGridHeight();
                } else {
                    this.properties.singleHeight = $(this.$element).outerWidth() * this.settings.gridItemWidth;
                }
            }
        },

        _calculateGridHeight: function () {
            var heightTot = 0;
            var hTemp;
            var $gridItem;
            this.$element.find('.grid-stack-item').each(function () {
                $gridItem = $(this);
                hTemp = parseInt($gridItem.attr('data-gs-height')) + parseInt($gridItem.attr('data-gs-y'));
                if (hTemp > heightTot) {
                    heightTot = hTemp;
                }
            });
            return heightTot;
        },

        _defineSeparatorProperties: function () {
            // console.log('defininfg private properties');
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
            var $grid = $(this.$element)[0];
            $(this.element).outerHeight($grid['attributes']['data-gs-current-height'].value * this.properties.singleWidth);
        },

        // fixes gutter if there is, this function is applied on the div used by
        // gridstack for the element
        _updateElementPadding: function ($elem) {
            $elem.css({
                'padding-left': this.properties.halfSeparatorElementLeft,
                'padding-right': this.properties.halfSeparatorElementRight,
                'padding-top': this.properties.halfSeparatorElementTop,
                'padding-bottom': this.properties.halfSeparatorElementBottom,
            });
        },

        // Calculate fixed blocks height
        _calculateBlockHeightFixed: function () {
            // console.log('calculating block height');
            var Gallery = this;
            this.$element.find(this.settings.itemSelector + ':not(.horizontal-carousel):not(.wrapper-expand-effect)')
                .add(this.$element.find(this.settings.itemSelector + '.only-gallery'))
                .each(function () {
                    // console.log($(this).attr('id'), '->',
                    // $(this).attr('data-height'));
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

        _removeHandles: function (elem) {
            $(elem).children('.ui-resizable-handle').each(function () {
                $(this).remove();
            });
        },

        // add span elements that will be used as handles of the element
        _addHandles: function (elem, $handles) {
            var $elem = $(elem);
            var span;
            var div;
            var handle;
            var stringID = $elem.attr("data-rexbuilder-block-id");
            $($handles.split(', ')).each(function () {
                handle = this;
                span = $(document.createElement('span')).attr({
                    'class': 'circle-handle circle-handle-' + handle,
                    'data-axis': handle
                });
                div = $(document.createElement('div')).attr({
                    'class': 'ui-resizable-handle ui-resizable-' + handle,
                    'data-axis': handle
                });
                if ($elem.is('div')) {
                    if (stringID != '') {
                        $(div).attr({
                            'id': stringID + '_handle_' + handle,
                        });
                    }
                }
                $(span).appendTo($(div));
                $(div).appendTo($elem);
            });
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

        updateSizeViewerText: function (elem, x, y) {
            var $elem = $(elem);
            if (x === undefined || y === undefined) {
                var x, y;
                x = parseInt($elem.attr("data-gs-width"));
                y = parseInt($elem.attr("data-gs-height"));
                if (this.settings.galleryLayout == 'masonry') {
                    y = y * this.properties.singleHeight;
                    y = Math.round(y);
                }
            }
            $elem.find(".el-size-viewer").text(x + ' x ' + y);
            $elem = undefined;
        },

        showSectionToolBox: function () {
            this.$element.parents('.rexpansive_section').children('.section-toolBox').addClass('tool-box-active');
        },

        hideSectionToolBox: function () {
            this.$element.parents('.rexpansive_section').children('.section-toolBox').removeClass('tool-box-active');
        },

        /**
		 * Receives the element to prepare, not jquery object
		 */
        _prepareElement: function (elem) {
            var gallery = this;
            var blockContent;
            var imageWidth = -1;
            var $elem = $(elem);

            if (Rexbuilder_Util.editorMode) {
                if (Rexbuilder_Util_Editor.blockCopying) {
                    gallery.properties.lastIDBlock = gallery.properties.lastIDBlock + 1;
                    var numberBlock = gallery.properties.lastIDBlock;
                    var rowNumber = gallery.properties.sectionNumber;
                    var $elemData = $elem.children(".rexbuilder-block-data");
                    $elem.attr({
                        "id": "block_" + rowNumber + "_" + numberBlock,
                        "data-rexbuilder-block-id": rowNumber + "_" + numberBlock,
                    });
                    $elemData.attr({
                        "id": "block_" + rowNumber + "_" + numberBlock + "-builder-data",
                        "data-id": "block_" + rowNumber + "_" + numberBlock,
                        "data-rexbuilder-block-data-id": rowNumber + "_" + numberBlock,
                    });
                }

                if (Rexbuilder_Util_Editor.sectionCopying || Rexbuilder_Util_Editor.blockCopying) {
                    gallery._removeHandles(elem);
                }

                gallery._addHandles(elem, 'e, s, w, se, sw');

                
                $elem.attr({
                    "data-gs-min-width": 1,
                    "data-gs-min-height": 1,
                    "data-gs-max-width": 500
                });
                
                // adding text wrap element if it's not there
                var textWrapEl;
                if (($elem.find('.text-wrap')).length == 0) {
                    textWrapEl = document.createElement('div');
                    $(textWrapEl).addClass('text-wrap');
                    $($elem.find('.rex-custom-scrollbar')).append(textWrapEl);
                } else {
                    // if there is text wrap, adding a span element to fix the text
                    // editor
                    textWrapEl = $elem.find('.text-wrap');
                    var spanEl = document.createElement('span');
                    $(spanEl).css('display', 'none');
                    $(spanEl).addClass('text-editor-span-fix');
                    textWrapEl.append(spanEl);
                }
                
                gallery.addElementListeners($elem);
            }
            
            gallery._updateElementPadding($elem.find('.grid-stack-item-content'));
            blockContent = $elem.find('.grid-item-content');
            imageWidth = blockContent.attr('data-background-image-width');
            if (imageWidth != -1) {
                if ($elem.outerWidth() < imageWidth) {
                    if (!blockContent.hasClass('small-width')) {
                        blockContent.addClass('small-width');
                    }
                } else {
                    blockContent.removeClass('small-width');
                }
            }
        },

        addElementListeners: function ($elem) {
            // adding element listeners
            var gallery = this;

            $elem.click(function (e) {
                console.log(e); 
                console.log("click: " + $elem.data("rexbuilder-block-id"));
                console.log(Rexbuilder_Util_Editor); 
                if (Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id"))) {
                    console.log("ending editing");
                    Rexbuilder_Util_Editor.activateElementFocus = false;
                    Rexbuilder_Util_Editor.endEditingElement();
                    Rexbuilder_Util_Editor.activateElementFocus = true;
                    gallery._focusElement($elem);
                }
            });

            // mouse down on another element
            $elem.mousedown(function (e) {
                console.log("mouse down: " + $elem.data("rexbuilder-block-id"));
                
            });

            $elem.mouseup(function (e) {
                console.log("mouse up: " + $elem.data("rexbuilder-block-id"));
                console.log(e); 
                if(!(Rexbuilder_Util_Editor.editingElement || Rexbuilder_Util_Editor.elementIsResizing || Rexbuilder_Util_Editor.elementIsDragging)){
                    console.log("FOCUSING ELEMENT: "+ $elem.data("rexbuilder-block-id")); 
                    Rexbuilder_Util_Editor.editingElement = true;
                    Rexbuilder_Util_Editor.editedElement = $elem;
                    Rexbuilder_Util_Editor.editingGallery = true;
                    Rexbuilder_Util_Editor.editedGallery = gallery;
                    
                    Rexbuilder_Util_Editor.startEditingElement();
                }
            });

            $elem.hover(function (e) {
                console.log("hover: " + $elem.data("rexbuilder-block-id"));
                if (!(Rexbuilder_Util_Editor.editingElement || Rexbuilder_Util_Editor.elementIsResizing || Rexbuilder_Util_Editor.elementIsDragging)) {
                    gallery._focusElement($elem);             
                }
            }, function () {
                console.log("out hover: " + $elem.data("rexbuilder-block-id"));
                if (!(Rexbuilder_Util_Editor.editingElement || Rexbuilder_Util_Editor.elementIsResizing || Rexbuilder_Util_Editor.elementIsDragging)) {
                    gallery._unFocusElement($elem);
                }
            });

            $elem.dblclick(function (e) {
                console.log("dbclick: " + $elem.data("rexbuilder-block-id"));
                if (Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id"))) {
                    Rexbuilder_Util_Editor.activateElementFocus = false;
                    Rexbuilder_Util_Editor.endEditingElement();
                    Rexbuilder_Util_Editor.activateElementFocus = true;
                }

                Rexbuilder_Util_Editor.editingElement = true;
                Rexbuilder_Util_Editor.editedElement = $elem;
                Rexbuilder_Util_Editor.editingGallery = true;
                Rexbuilder_Util_Editor.editedGallery = gallery;

                Rexbuilder_Util_Editor.startEditingElement();
            });
        },

        showBlockToolBox: function ($elem) {
            $elem.children(".rexlive-block-toolbox").addClass("focused");
        },

        hideBlockToolBox: function ($elem) {
            $elem.children(".rexlive-block-toolbox").removeClass("focused");
        },

        disableDragHandle: function ($elem) {
            $elem.children(".rexlive-block-drag-handle").addClass("hide-drag");
        },

        enableDragHandle: function ($elem) {
            console.log("enabling "+$elem.data("rexbuilder-block-id")+" drag handle"); 
            $elem.children(".rexlive-block-drag-handle").removeClass("hide-drag");
        },

        _prepareElements: function () {
            var gallery = this;
            $(gallery.$element).children('.grid-stack-item').each(function () {
                var elem = this;
                gallery._prepareElement(elem);
            });
        },

        _focusElement: function ($elem) {
            $elem.children(".rexlive-block-toolbox").addClass("focused");
            $elem.addClass('focused');
            $elem.parent().addClass('focused');
            $elem.parent().parent().addClass('focused');
            $elem.parent().parent().parent().addClass('focused');
            $elem.parent().parent().parent().parent().addClass('focused');
        },

        _unFocusElementEditing: function($elem){
            this.hideBlockToolBox($elem);
            this.disableDragHandle($elem);
            $elem.children(".rexlive-block-toolbox").removeClass("focused");
            $elem.removeClass('focused');
        },

        _unFocusElement: function ($elem) {
            $elem.children(".rexlive-block-toolbox").removeClass("focused");
            $elem.removeClass('focused');
            $elem.parent().removeClass('focused');
            $elem.parent().parent().removeClass('focused');
            $elem.parent().parent().parent().removeClass('focused');
            $elem.parent().parent().parent().parent().removeClass('focused');
        },

        frontEndMode: function () {
            var grid = this.$element.data('gridstack');
            grid.disable();

            // per adesso è nascosta così ma è da cambiare
            $('.rexlive-toolbox-fixed').css('display', 'none');
            // finire di fixare per riattivare l'editor di testo
            // this.properties.mediumEditorIstance.destroy();
            console.log('griglia disabilitata');
        },

        editorMode: function () {
            var grid = this.$element.data('gridstack');
            grid.enable();
            // this.properties.mediumEditorIstance.setup();
            console.log('griglia abilitata');
        },


        updateSizeViewerSizes: function (gallery, block) {
            gallery.updateSizeViewerText(block,
                Math.round($(block).outerWidth() / gallery.properties.singleWidth),
                gallery.calculateHeightSizeViewer(block, gallery));
        },



        calculateHeightSizeViewer: function (block, gallery) {
            if (gallery.settings.galleryLayout == 'masonry') {
                return $(block).outerHeight();
            } else {
                return Math.round($(block).outerHeight() / gallery.properties.singleHeight);
            }
        },

        _linkResizeEvents: function () {
            var gallery = this;
            var block, xStart, wStart, xView, yView;
            var imageWidth;
            var $blockContent;
            $(gallery.$element).on('resizestart', function (event, ui) {
                if (!$(ui.element).is('span')) {
                    gallery.properties.resizeHandle = $(event.toElement).attr('data-axis');
                    block = $(event.target)[0];
                    $blockContent = $(block).find('.grid-item-content');
                    imageWidth = $blockContent.attr('data-background-image-width');
                    Rexbuilder_Util_Editor.elementIsResizing = true;
                    xStart = parseInt(block['attributes']['data-gs-x'].value);
                    if (gallery.properties.resizeHandle == 'e' || gallery.properties.resizeHandle == 'se') {
                        $(block).attr("data-gs-max-width", (gallery.settings.numberCol - xStart));
                    } else {
                        wStart = parseInt(block['attributes']['data-gs-width'].value);
                        // $('#' + block.id).attr("data-gs-max-width", (xStart +
                        // wStart));
                    }
                }
            }).on('resize', function (event, ui) {
                if (!$(ui.element).is('span')) {
                    if ($(block).outerWidth() < imageWidth) {
                        if (!$blockContent.hasClass('small-width')) {
                            $blockContent.addClass('small-width');
                        }
                    } else {
                        $blockContent.removeClass('small-width');
                    }

                    gallery.updateSizeViewerSizes(gallery, block);

                    if (!$(block).hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        gallery.fixElementTextSize(block, gallery.properties.resizeHandle, null);
                    }
                    /*
					 * if (gallery.properties.resizeHandle == 'w' ||
					 * gallery.properties.resizeHandle == 'sw') { ; }
					 */
                }
            }).on('gsresizestop', function (event, elem) {
                if (Rexbuilder_Util_Editor.elementIsResizing) {
                    gallery.updateSizeViewerText(elem);
                    if (gallery.settings.galleryLayout == 'masonry') {
                        $(block).attr("data-height", Math.round(($(block).attr("data-gs-height")) / gallery.properties.singleWidth));
                    }
                    $(block).attr("data-gs-max-width", "500");
                    gallery.updateAllElementsProperties();
                    if (!$(block).hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        gallery.fixElementTextSize(block, gallery.properties.resizeHandle, null);
                    }
                    Rexbuilder_Util_Editor.elementIsResizing = false;
                    //                    gallery.$element.trigger('change');
                }
            });
        },

        _linkDragEvents: function () {
            var gallery = this;

            // eventi per il drag
            $(gallery.$element).on('dragstart', function (event, ui) {
                Rexbuilder_Util_Editor.elementIsDragging = true;
                console.log('drag start');
            }).on('drag', function (event, ui) {
                // console.log('dragging');
            }).on('dragstop', function (event, ui) {
                console.log('drag end');
                Rexbuilder_Util_Editor.elementIsDragging = false;
            })
        },

        /**
		 * Launching Gridstack plugin
		 */
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
                    handle: '.rexlive-block-drag-handle',
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
            // console.log(gallery.$element.data('gridstack'));
            // console.log('gridstack ready');
            $(gallery.$element).addClass('gridActive');
        },

        addElementToTextEditor: function (editor, $textWrap) {
            editor.addElements($textWrap);
            this.addMediumInsertToElement($textWrap, editor);
        },

        addMediumInsertToElement: function ($textWrap, editor) {
            $textWrap.mediumInsert({
                editor: editor,
                addons: {
                    images: {
                        uploadScript: null,
                        deleteScript: null,
                        captions: false,
                        captionPlaceholder: false,
                        actions: null
                    },
                    embeds: {
                        oembedProxy: 'https://medium.iframe.ly/api/oembed?iframe=1'
                    },
                    // tables: {}
                },
            });
        },

        _launchTextEditor: function () {
            console.log("launching text editor");
            var divToolbar = document.createElement('div');
            var gallery = this;

            $(divToolbar).attr({
                'id': this.properties.sectionNumber + '-SectionTextEditor',
                'class': 'editable',
                'style': 'display: none'
            });
            $('.rexpansive_section').parent().prepend(divToolbar);

            var currentTextSelection;

            /**
			 * Gets the color of the current text selection
			 */
            function getCurrentTextColor() {
                return $(editor.getSelectedParentElement()).css('color');
            }

            /**
			 * Custom `color picker` extension
			 */
            var ColorPickerExtension = MediumEditor.extensions.button.extend({
                name: "colorPicker",
                action: "applyForeColor",
                aria: "color picker",
                contentDefault: "<span class='editor-color-picker'>Text Color<span>",

                init: function () {
                    this.button = this.document.createElement('button');
                    this.button.classList.add('medium-editor-action');
                    this.button.innerHTML = '<b>Text color</b>';

                    // init spectrum color picker for this button
                    initPicker(this.button);

                    // use our own handleClick instead of the default one
                    this.on(this.button, 'click', this.handleClick.bind(this));
                },
                handleClick: function (event) {
                    // keeping record of the current text selection
                    currentTextSelection = editor.exportSelection();

                    // sets the color of the current selection on the color
                    // picker
                    $(this.button).spectrum("set", getCurrentTextColor());

                    // from here on, it was taken form the default handleClick
                    event.preventDefault();
                    event.stopPropagation();

                    var action = this.getAction();

                    if (action) {
                        this.execAction(action);
                    }
                }
            });

            var pickerExtension = new ColorPickerExtension();

            function setColor(color) {
                var finalColor = color ? color.toRgbString() : 'rgba(0,0,0,0)';

                pickerExtension.base.importSelection(currentTextSelection);
                pickerExtension.document.execCommand("styleWithCSS", false, true);
                pickerExtension.document.execCommand("foreColor", false, finalColor);
            }

            function initPicker(element) {
                $(element).spectrum({
                    allowEmpty: true,
                    color: "#f00",
                    showInput: true,
                    showAlpha: true,
                    showPalette: true,
                    showInitial: true,
                    hideAfterPaletteSelect: true,
                    preferredFormat: "hex3",
                    change: function (color) {
                        setColor(color);
                    },
                    hide: function (color) {
                        setColor(color);
                    },
                    palette: [
                        ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                        ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                        ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                        ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                        ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                        ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                        ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                        ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                    ]
                });
            }

            var editor = new MediumEditor('.editable', {
                toolbar: {
                    buttons: [
                        'colorPicker',
                        'bold',
                        'italic',
                        'underline',
                        'anchor',
                        'h2',
                        'h3',
                        'quote',
                        'orderedlist',
                        'unorderedlist',
                        'table'
                    ]
                },
                imageDragging: false,
                extensions: {
                    colorPicker: pickerExtension,
                },
                placeholder: {
                    /*
					 * This example includes the default options for
					 * placeholder, if nothing is passed this is what it used
					 */
                    text: "wwww",
                    hideOnClick: true
                }
            });

           

            editor.subscribe('editableInput', function (e) {
                if ($('.medium-insert-images figure img, .mediumInsert figure img').length > 0) {
                    $('.medium-insert-images figure img, .mediumInsert figure img').each(function () {
                        if (!$(this).hasClass('image-text-wrap')) {
                            var $figura = $(this).parents('figure');
                            var $textWrapper = $(this).parents('.medium-insert-images');
                            console.log($figura);
                            $(this).addClass('image-text-wrap');
                            $(this).wrap('<span></span>');
                            var spanEl = $(this).parent()[0];
                            $(spanEl).addClass('image-span-wrap');
                            if (!Rexbuilder_Util_Editor.sectionCopying) {
                                gallery._addHandles(spanEl, 'e, s, w, se, sw');
                            }
                            $(spanEl).resizable({
                                // containment: $textWrapper[0],
                                handles: {
                                    'e': '.ui-resizable-e',
                                    's': '.ui-resizable-s',
                                    'w': '.ui-resizable-w',
                                    'se': '.ui-resizable-se',
                                    'sw': '.ui-resizable-sw'
                                },
                                start: function (event, ui) {
                                    if ($(ui.element).is('span')) {
                                        console.log('startResize image');
                                    }
                                },
                                resize: function (event, ui) {
                                    if ($(ui.element).is('span')) {
                                        console.log('resizing image');
                                    }
                                },
                                stop: function (event, ui) {
                                    if ($(ui.element).is('span')) {
                                        console.log($(ui.element).innerWidth(), $(ui.element).innerHeight());
                                        console.log('stopResize image');
                                    }
                                }
                            });
                        }
                    });
                }

                gallery.fixElementTextSize($(e.srcElement).parents(".grid-stack-item")[0], null, e);
            });

            $(gallery.$element).find('.rex-text-editable').each(function () {
                var $elem = $(this);
                if ($elem.find('.pswp-figure').length === 0) {
                    gallery.addElementToTextEditor(editor, $elem.find(".text-wrap"));
                }
            });

            this.properties.mediumEditorIstance = editor;
        },

        _setParentGridPadding: function () {
            var $parent = $(this.$element.parent());
            // console.log('setting grid padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                // console.log('setting grid padding');
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
            // console.log('setting grid padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                // console.log('setting grid padding');
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
			 * if
			 * (this.$element.find(this.settings.itemSelector).hasClass('wrapper-expand-effect')) {
			 * this.$element.find(this.settings.itemSelector).css('padding-bottom',
			 * this.properties.halfSeparator);
			 * this.$element.find(this.settings.itemSelector).css('padding-left',
			 * this.properties.halfSeparator);
			 * this.$element.find(this.settings.itemSelector).css('padding-right',
			 * this.properties.halfSeparator); } else {
			 * 
			 * if (this.properties.paddingTopBottom) {
			 * this.$element.find(this.settings.itemSelector).css('padding-top',
			 * this.properties.halfSeparator);
			 * this.$element.find(this.settings.itemSelector).css('padding-bottom',
			 * this.properties.halfSeparator); } else {
			 * this.$element.find(this.settings.itemSelector).css('padding',
			 * this.properties.halfSeparator); } } } else if
			 * (this._viewport().width < 768 &&
			 * !this.properties.setMobilePadding &&
			 * !this._check_parent_class("rex-block-grid")) {
			 * this.properties.setMobilePadding = true;
			 * this.properties.setDesktopPadding = false;
			 * 
			 * if ('false' == this.settings.mobilePadding) {
			 * this.$element.find(this.settings.itemSelector).css('padding-top',
			 * this.properties.halfSeparator);
			 * this.$element.find(this.settings.itemSelector).css('padding-bottom',
			 * this.properties.halfSeparator);
			 * this.$element.find(this.settings.itemSelector).css('padding-left',
			 * 0);
			 * this.$element.find(this.settings.itemSelector).css('padding-right',
			 * 0); } else if ('true' == this.settings.mobilePadding) {
			 * this.$element.find(this.settings.itemSelector).css('padding',
			 * this.properties.halfSeparator); } }
			 */
        },

        // Calculate the height of the blocks, depending on viewport size, and
        // gallery type
        _calculateBlockHeight: function () {
            // console.log('calculating height');
            if (this.settings.galleryLayout == 'fixed') {
                if (this._viewport().width >= 768 || this._check_parent_class("rex-block-grid")) {
                    if (this.settings.fullHeight == 'true') {
                        // console.log('bbb');
                        var wrap_height = this._viewport().height;
                        // this.properties.singleWidth = wrap_height /
                        // (this.properties.gridTotalArea /
                        // this.properties.numberCol);
                        this.properties.singleWidth = (this.properties.gridTotalArea / wrap_height) / this.properties.numberCol;
                    }
                    this._calculateBlockHeightFixed();
                } else {
                    console.log("Non farlo, torna a width >= 768");
                }
            } else if (this.settings.galleryLayout == 'masonry') {
                this._calculateBlockHeightMasonry();
            }
        },

        // Calculate fixed blocks height
        _calculateBlockHeightFixed: function () {
            // console.log('calculating block height');
            var Gallery = this;
            this.$element.find(this.settings.itemSelector + ':not(.horizontal-carousel):not(.wrapper-expand-effect)')
                .add(this.$element.find(this.settings.itemSelector + '.only-gallery'))
                .each(function () {
                    $(this).height((Gallery.properties.singleWidth * $(this).attr('data-height')) - (Gallery.properties.halfSeparator * 2));
                });
        },

        calculateTextWrapHeight: function(textWrap){
            var textCalculate = $(textWrap).clone(false);
            textCalculate.children(".medium-insert-buttons").remove();
            var textHeight = 0;
            if(textCalculate.text().trim().length != 0){
                if (($(textWrap).hasClass("medium-editor-element") && !$(textWrap).hasClass("medium-editor-placeholder")) || ($(textWrap).parents(".pswp-item").length != 0 )) {
                    textHeight = $(textWrap).innerHeight();
                }
            }
            return textHeight;
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
            var h, backgroundHeight, defaultHeight, textHeight;
            var $this;
            var blockData;
            var textWrap;
            Rexbuilder_Util_Editor.elementIsResizing = true;
            this.$element.find('.grid-item-content').each(function () {
                h = 0;
                backgroundHeight = 0;
                defaultHeight = 0;
                $this = $(this);
                $elem = $this.parents('.grid-stack-item');
                blockData = $elem.children('.rexbuilder-block-data');
                w = parseInt($elem.attr("data-width"));
                textWrap = $this.find('.text-wrap').eq(0);
                textHeight = gallery.calculateTextWrapHeight(textWrap);

                if (textHeight == 0) {

                    if ($this.hasClass('full-image-background')) {
                        backgroundHeight = (parseInt($this.attr('data-background-image-height')) * (w * sw)) / (parseInt($this.attr('data-background-image-width')));
                    } else if ($this.hasClass('natural-image-background')) {
                        if ($this.hasClass('small-width')) {
                            backgroundHeight = (parseInt($this.attr('data-background-image-height')) * (w * sw)) / (parseInt($this.attr('data-background-image-width'))) - gutter;
                        } else {
                            backgroundHeight = parseInt($this.attr('data-background-image-height')) + gutter;
                        }
                    }
                    if ((backgroundHeight == 0) || $this.hasClass('youtube-player') || ($this.hasClass('empty-content') && textHeight == 0) || $this.hasClass('block-has-slider') || $elem.hasClass('block-has-slider')) {
                        origH = $elem.attr('data-height');
                        defaultHeight = Math.round(sw * origH);
                    }
                } else{
                    textHeight = textHeight + gutter;
                }

                h = Math.max(backgroundHeight, defaultHeight, textHeight);
                h = Math.ceil(h / gallery.properties.singleHeight);

                $elem.attr('data-gs-height', h);

                $(blockData).attr("data-block_height_masonry", h);
                grid.update($elem, null, null, w, h);

            });

            gallery._fixBlocksPosition();

            Rexbuilder_Util_Editor.elementIsResizing = false;

            // gallery.updateAllElementsProperties();
            /*
			 * else if($elem.hasClass('natural-fluid-image') ||
			 * $elem.find('.natural-image-content').length != 0){ h =
			 * $($elem.find('.natural-image-content')[0]).innerHeight(); h+=
			 * gallery.properties.halfSeparatorElementBottom; } /*
			 * this.$element.find(this.settings.itemSelector + '
			 * .empty-content')
			 * .add(this.$element.find(this.settings.itemSelector + '
			 * .image-content :not(.text-wrap)'))
			 * .add(this.$element.find(this.settings.itemSelector +
			 * '.only-background').children())
			 * .add(this.$element.find(this.settings.itemSelector +
			 * '.block-has-slider').children()) .each(function () { var $this =
			 * $(this); if ($this.css('background-image') != 'none' ||
			 * $this.hasClass('empty-content') || ($this.css('background-color') !=
			 * 'none' && $this.find('img').length === 0) ||
			 * $this.parent().hasClass('block-has-slider')) { var gridHeight =
			 * Gallery.properties.singleWidth *
			 * $this.parents(Gallery.settings.itemSelector).attr('data-gs-height');
			 * $this.parents(Gallery.settings.itemSelector).attr('data-gs-height') =
			 * gridHeight; } });
			 */
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
