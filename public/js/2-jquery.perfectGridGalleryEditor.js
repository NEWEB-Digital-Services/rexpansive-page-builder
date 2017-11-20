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
            gridHover: false,
            serializedData: [],
            firstStartGrid: false,
            lastIDBlock: null,
            textWrapEditing: null,
            gridEditable: true,
            mediumEditorIstance: null
        };

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(perfectGridGalleryEditor.prototype, {
        init: function () {

            this.properties.firstStartGrid = true;

            // getting section number
            this.properties.sectionNumber = ($(this.element).children('.grid-stack-item')[0].id).split('_')[1];
            this.$element.addClass('grid-number-' + this.properties.sectionNumber);

            this._saveStateElements();

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

            //this.creaBottone();

            var gallery = this;
            var $elem;
            Util.elementIsDragging = false;
            Util.elementIsResizing = false;
            Util.editingElement = null;

            $(gallery.element).children('.grid-stack-item').each(function () {
                $elem = $(this);
                gallery.updateSizeViewerText($elem);
                // we need gridstack launched to calculate block heights
                if (!$elem.hasClass('block-has-slider')) {
                    gallery.fixElementTextSize(this, null);
                }
            });

            if(this.properties.gridEditable){
                this._launchTextEditor();
            }

            (gallery.$element).parent().parent().hover(function (event) {
                if (gallery.properties.gridEditable) {
                    gallery.showToolBox();
                }
            }, function () {
                //gallery.hideToolBox();
            });

            $(window).on('keydown', { Gallery: this, Util: Util }, function (event) {
                if (event.data.Gallery.properties.gridEditable) {
                    if (event.keyCode == 27 && $(event.target).parents('.perfect-grid-item') != 0) {
                        console.log(event);
                        var G = event.data.Gallery;
                        var grid = G.$element.data('gridstack');
                        grid.enable();
                        $(G.$element).addClass('gridActive');
                        G.properties.elementEdited = null;
                        gallery.properties.textWrapEditing = null;
                        G._showSizeViewer($(event.target).parents('.perfect-grid-item'));
                        if (typeof (Util.editingElement) !== null) {
                            Util.editingElement.blur();
                            Util.editingElement = null;
                        }
                    }
                }
            });

            $(window).on('mousedown', { Gallery: this, Util: Util }, function (event) {
                if (event.data.Gallery.properties.gridEditable) {
                    var G = event.data.Gallery;
                    var target = event.target;
                    if (G.properties.elementEdited !== null && $(target).parents('.medium-editor-toolbar').length === 0 && $(target).parents('.sp-container').length === 0) {
                        var $items = $($(target).parents('.grid-stack-item'));
                        if (($items.length === 0) || $items[0].id !== G.properties.elementEdited.id) {
                            var grid = G.$element.data('gridstack');
                            grid.enable();
                            $(G.$element).addClass('gridActive');
                            G.properties.elementEdited = null;
                            gallery.properties.textWrapEditing = null;
                            if (typeof (Util.editingElement) !== null) {
                                Util.editingElement.blur();
                                Util.editingElement = null;
                            }
                        }
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

                $(gallery.element).on('change', { Gallery: gallery, Util: Util }, function (event, items) {
                    if (event.data.Gallery.properties.firstStartGrid) {
                        //event.data.Gallery.saveGrid();
                        console.log('First Start');
                        event.data.Gallery.properties.firstStartGrid = false;
                    } else {
                        if (!Util.elementIsDragging && !Util.elementIsResizing) {
                            event.data.Gallery.updateAllElementsProperties();
                            //event.data.Gallery.saveGrid();
                        }
                    }
                });
                gallery.$element.trigger('change');
            });


            if (!this.properties.gridEditable) {
                this.frontEndMode();
            }

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

        _findLastIDBlock: function () {
            var i = 0;
            var gallery = this;
            var max = -1;
            var temp;

            this.$element.find('.perfect-grid-item').each(function () {
                temp = parseInt(this.id.split('_')[2]);
                if (temp > max) {
                    max = temp;
                }
                i++;
            });
            this.properties.lastIDBlock = max
        },

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

        fixElementTextSize: function (block, $handler, event) {
            var $textWrap = $(block).find('.text-wrap');
            var $blockContent = $(block).find('.rex-custom-scrollbar');
            var maxBlockHeight, textHeight;
            maxBlockHeight = $blockContent.parents('.grid-item-content').innerHeight();
            textHeight = $textWrap.innerHeight();
            var dataBlockSelector = '#' + block.id + '-builder-data';
            if ($handler !== null) {
                //updating scrollbar
                $blockContent.mCustomScrollbar("update");

                // aggiornamento della scrollbar del blocco se il layout e' masonry
                if (this.settings.galleryLayout == 'masonry') {
                    if ($blockContent.hasClass('mCS_no_scrollbar') || $blockContent.hasClass('mCS_disabled')) {
                        if ($(dataBlockSelector).attr('data-block_has_scrollbar') != 'false') {
                            $(dataBlockSelector).attr('data-block_has_scrollbar', 'false');
                        }
                    } else {
                        if ($(dataBlockSelector).attr('data-block_has_scrollbar') != 'true') {
                            $(dataBlockSelector).attr('data-block_has_scrollbar', 'true');
                        }
                        $(dataBlockSelector).attr('data-block_height_masonry', block['attributes']['data-gs-height'].value);
                    }
                }

            } else {
                // primo start della barra
                if ($(block).find('.mCustomScrollBox').length === 0) {
                    if (this.settings.galleryLayout == 'masonry') {
                        console.log('setting ' + block.id + ' height');
                        var grid = this.$element.data('gridstack');
                        var w = parseInt(block['attributes']['data-gs-width'].value);
                        var h;
                        if ($(dataBlockSelector).attr('data-block_has_scrollbar') == 'true') {
                            h = parseInt($(dataBlockSelector).attr('data-block_height_masonry'));
                        } else {
                            $(dataBlockSelector).attr('data-block_has_scrollbar', 'false');
                            $(dataBlockSelector).attr('data-block_height_masonry', 0);
                            h = parseInt(block['attributes']['data-gs-height'].value);
                            var i = 0;
                            // differenza da ottenere per l'altezza giusta del blocco
                            var n;
                            if (textHeight >= maxBlockHeight) {
                                n = textHeight - maxBlockHeight;
                                while (i < n) {
                                    h = h + 1;
                                    i++;
                                }
                            } else {
                                n = maxBlockHeight - textHeight;
                                while (i < n) {
                                    h = h - 1;
                                    i++;
                                }
                            }
                        }
                        grid.update(block, null, null, w, h);
                        maxBlockHeight = h;
                    }
                    $blockContent.mCustomScrollbar();
                    //$blockContent.find('.mCustomScrollBox').css('max-height', maxBlockHeight);

                    if (textHeight < maxBlockHeight) {
                        $blockContent.mCustomScrollbar('disable');
                    }
                } else {
                    // successive modifiche dovute al cambiamento del contenuto
                    if ($blockContent.hasClass('mCS_no_scrollbar') || $blockContent.hasClass('mCS_disabled')) {
                        var w = parseInt(block['attributes']['data-gs-width'].value);
                        var h = parseInt(block['attributes']['data-gs-height'].value);
                        var grid = this.$element.data('gridstack');
                        var i = 0;
                        var n;
                        h = this.properties.elementStartingH;
                        console.log('textHeight', textHeight, 'maxBlockHeight', maxBlockHeight, 'Starting height', h);
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
                            //console.log(event.inputType);
                            //if(event.inputType == 'deleteContentBackward' || event.inputType == 'deleteByCut'){
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
                            //}
                        }
                        grid.update(block, null, null, w, h);
                        //$blockContent.find('.mCustomScrollBox').css('max-height', h*this.properties.singleHeight);
                    }

                    if (this.properties.firstStartGrid) {
                        $blockContent.mCustomScrollbar("update");
                    }
                }
            }
        },

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

        reLaunchGrid: function (data) {
            //console.log('selected layout: '+data['layout']);
            var G = this;
            var grid = G.$element.data('gridstack');
            var oldLayout = G.settings.galleryLayout;
            G.settings.galleryLayout = data['layout'];
            if (oldLayout != G.settings.galleryLayout) {
                G._defineDynamicPrivateProperties();
                $(G.element).parents('.rexpansive_section').find('.section-data').attr({
                    'data-layout': G.settings.galleryLayout
                });
                Util.elementIsResizing = true;
                Util.elementIsDragging = true;

                // destroying gridstack & jquery ui
                G.destroyGridstack();

                // adding back the handles for resizing
                $(G.element).children('.grid-stack-item').each(function () {
                    G._addHandles(this, 'e, s, w, se, sw');
                });

                // relaunching grid
                if (G.settings.galleryLayout == 'masonry') {
                    G._launchGridStack();
                    G._calculateBlockHeightMasonry();
                } else {
                    G.restoreBackup();
                    G._launchGridStack();
                }

                var $blockContent;
                var $elem;
                $(G.element).children('.grid-stack-item').each(function () {
                    $elem = $(this);
                    G.updateSizeViewerText($elem);
                    $blockContent = $elem.find('.grid-item-content');
                    if (!$elem.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        G.properties.elementStartingH = parseInt(this['attributes']['data-gs-height'].value);
                        G.fixElementTextSize(this, null, null);
                    }
                });
                Util.elementIsResizing = false;
                Util.elementIsDragging = false;
                this.properties.firstStartGrid = true;
                G.$element.trigger('change');
                this.properties.firstStartGrid = false;
            }
            return;
        },

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

        getSectionNumber: function () {
            return this.properties.sectionNumber;
        },
        setProperty: function (definition) {
            this.properties[definition[0]] = definition[1];
        },

        fillEmptySpaces: function () {
            var gridElementId,
                gridElement,
                cols = this.settings.numberCol,
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

        // Function that creates a new empty block and returns it. The block is added to gridstack and gallery
        createBlock: function (x, y, w, h) {
            var divGridItem = document.createElement('div');
            var divGridStackContent = document.createElement('div');
            var divGridItemContent = document.createElement('div');
            var divBlockOverlay = document.createElement('div');
            var divRexScrollbar = document.createElement('div');
            var divTextWrap = document.createElement('div');
            var gallery = this;
            var grid = this.$element.data('gridstack');
            var idNewBlock = "block_" + gallery.properties.sectionNumber + "_" + (gallery.properties.lastIDBlock + 1);
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
            
            this._prepareElement(divGridItem);
            this.createElementProperties(divGridItem);
            grid.addWidget(divGridItem, x, y, w, h, false);
            this.updateSizeViewerText($(divGridItem), w, h);

            return divGridItem;
        },

        createElementProperties: function (elem) {
            var divProperties = document.createElement('div');
            var $elem = $(elem);
            $(divProperties).attr({
                'id': elem.id + '-builder-data',
                'style': 'display: none;',
                'data-id': elem.id,
                'data-type': 'empty',
                'data-col': $elem.attr('data-col'),
                'data-row': $elem.attr('data-row'),
                'data-size_x': $elem.attr('data-width'),
                'data-size_y': $elem.attr('data-height'),
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
            });
            $(divProperties).prependTo(elem);
        },

        isEven: function (number) {
            return number % 2 == 0;
        },

        // Updating elements properties
        updateAllElementsProperties: function () {
            var Gallery = this;
            this.$element.find('.perfect-grid-item').each(function () {
                Gallery.updateElementAllProperties(this);
            });
        },

        creaBottone: function () {

            var bottone = document.createElement('button');

            var section = this.$element.parents('.rexpansive_section');
            $(bottone).appendTo(section[0]);
            $(bottone).attr({
                'id': 'frontend-button'
            });
            var file_frame; // variable for the wp.media file_frame

            // attach a click event (or whatever you want) to some element on your page
            $('#frontend-button').on('click', function (event) {
                event.preventDefault();

                // if the file_frame has already been created, just reuse it
                if (file_frame) {
                    file_frame.open();
                    return;
                }

                file_frame = wp.media.frames.file_frame = wp.media({
                    title: $(this).data('uploader_title'),
                    button: {
                        text: $(this).data('uploader_button_text'),
                    },
                    multiple: false // set this to true for multiple file selection
                });

                console.log(file_frame);

                file_frame.on('select', function () {
                    var attachment = file_frame.state().get('selection').first().toJSON();

                    // do something with the file here
                    $('#frontend-button').hide();
                    $('#frontend-image').attr('src', attachment.url);
                    console.log(attachment);
                });

                file_frame.open();
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
            var dataBlockSelector = '#' + block.id + '-builder-data';
            switch ($case) {
                case 'x': {
                    size = parseInt(block['attributes']['data-gs-x'].value);
                    
                    // gridster works 1 to n not 0 to n-1
                    size = size + 1;
                    
                    block['attributes']['data-col'].value = size
                    $(dataBlockSelector).attr({
                        'data-col': size
                    });
                    break;
                }
                case 'y': {
                    if (this.settings.galleryLayout == 'masonry') {
                        size = Math.round(parseInt(block['attributes']['data-gs-y'].value) * this.properties.singleHeight / width);
                    } else {
                        size = parseInt(block['attributes']['data-gs-y'].value);
                    }

                    // gridster works 1 to n not 0 to n-1
                    size = size + 1;

                    block['attributes']['data-row'].value = size;
                    $(dataBlockSelector).attr({
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
                    $(dataBlockSelector).attr({
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
                    $(dataBlockSelector).attr({
                        'data-size_y': h
                    });
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
                this.properties.singleHeight = 5;
            } else {
                // Layout is fixed
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

        // fixes gutter if there is, this function is applied on the div used by gridstack for the element
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
        _addHandles: function (elem, $handles) {
            var span;
            var div;
            var handle;
            var stringID = elem.id === undefined ? "" : elem.id;
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
                if ($(elem).is('div')) {
                    if (stringID != '') {
                        $(div).attr({
                            'id': stringID + '_handle_' + handle,
                        });
                    }
                }
                $(span).appendTo($(div));
                $(div).appendTo($(elem));
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
                var x, y;
                x = $($elem)[0]['attributes']['data-gs-width'].value;
                if (this.settings.galleryLayout == 'masonry') {
                    y = $($elem)[0]['attributes']['data-gs-height'].value * this.properties.singleHeight;
                    y = Math.round(y);
                } else {
                    y = $($elem)[0]['attributes']['data-gs-height'].value;
                }
            }
            var name = $elem.id === undefined ? $elem[0]['attributes']['id'].value : $elem.id;
            $('#' + name + ' > .el-size-viewer').text(x + ' x ' + y);
        },

        showToolBox: function () {
            this.$element.parents('.rexpansive_section').children('.toolBox').addClass('tool-box-active');
        },

        hideToolBox: function () {
            this.$element.parents('.rexpansive_section').children('.toolBox').removeClass('tool-box-active');
        },

        /**
         * Receives the element to prepare, not jquery object
         */
        _prepareElement: function (elem) {
            var gallery = this;
            var blockContent;
            var imageWidth = -1;
            var $elem = $(elem);

            gallery._updateElementPadding($elem.find('.grid-stack-item-content'));
            gallery._addHandles(elem, 'e, s, w, se, sw');
            gallery._addSizeViewer(elem);

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

            //$('#' + elem.id)
            
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
                //if there is text wrap, adding a span element to fix the text editor
                textWrapEl = $elem.find('.text-wrap');
                var spanEl = document.createElement('span');
                $(spanEl).css('display', 'none');
                textWrapEl.append(spanEl);
            }

            // adding element listeners
            $elem.click(function (event) {
                if (gallery.properties.gridEditable) {
                    gallery._focusElement($elem);
                }
            });

            $elem.mousedown(function (event) {
                if (gallery.properties.gridEditable) {
                    if ((gallery.properties.elementEdited === null) && !$elem.hasClass('focused')) {
                        gallery._focusElement($elem);
                    }
                }
            });

            $(document).mouseup(function (e) {
                if (gallery.properties.gridEditable) {
                    gallery._unFocusElement($elem);
                    // FIXARE
                    /* $($elem[0].id).trigger('hover'); */
                }
            });

            $elem.hover(function (event) {
                if (gallery.properties.gridEditable) {
                    if (!Util.elementIsResizing && Util.editingElement === null) {
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
                }
            }, function () {
                if (gallery.properties.gridEditable) {
                    if (!Util.elementIsResizing) {
                        gallery._unFocusElement($elem);
                    }
                }
            });

            $elem.dblclick(function () {
                if (gallery.properties.gridEditable) {
                    gallery._hideSizeViewer($elem);
                    Util.editingElement = $elem;
                    var grid = gallery.$element.data('gridstack');
                    grid.disable();
                    $(gallery.$element).removeClass('gridActive');
                    gallery.properties.elementEdited = elem;
                    gallery.properties.elementStartingH = parseInt($elem[0]['attributes']['data-gs-height'].value);
                    var textWrap = $elem.find('.text-wrap');
                    textWrap.trigger('externalInteraction');
                    gallery.properties.textWrapEditing = textWrap;
                    if (!(textWrap.text().length) || textWrap.text() == '""') {
                        $(textWrap)[0].focus();
                    }
                    //$(textWrap.lastChild)[0].focus();
                    /* if()#mCSB_1_container > div > div
                    $()[0].focus(); */
                }
            });
        },

        _prepareElements: function () {
            var gallery = this;
            $(gallery.$element).children('.grid-stack-item').each(function () {
                gallery._prepareElement(this);
            });
        },

        _hideSizeViewer: function ($elem) {
            $elem.children('.el-size-viewer').removeClass('focused');
            $elem.children('.el-size-viewer').addClass('size-viewer-hidden');
        },

        _showSizeViewer: function ($elem) {
            $elem.children('.el-size-viewer').addClass('focused');
            $elem.children('.el-size-viewer').removeClass('size-viewer-hidden');
        },

        _focusElement: function ($elem) {
            $elem.find('.el-size-viewer').addClass('focused');
            $elem.addClass('focused');
            $elem.parent().addClass('focused');
            $elem.parent().parent().addClass('focused');
            $elem.parent().parent().parent().addClass('focused');
            $elem.parent().parent().parent().parent().addClass('focused');
        },

        _unFocusElement: function ($elem) {
            $elem.find('.el-size-viewer').removeClass('focused');
            $elem.removeClass('focused');
            $elem.parent().removeClass('focused');
            $elem.parent().parent().removeClass('focused');
            $elem.parent().parent().parent().removeClass('focused');
            $elem.parent().parent().parent().parent().removeClass('focused');
        },

        frontEndMode: function () {
            this.properties.gridEditable = false;
            var grid = this.$element.data('gridstack');
            grid.disable();

            //per adesso è nascosta così ma è da cambiare
            $('.rexlive-toolbox-fixed').css('display', 'none');
            //finire di fixare per riattivare l'editor di testo
            //this.properties.mediumEditorIstance.destroy();
            console.log('griglia disabilitata');
        },

        editorMode: function () {
            this.properties.gridEditable = true;
            var grid = this.$element.data('gridstack');
            grid.enable();
            //this.properties.mediumEditorIstance.setup();
            console.log('griglia abilitata');
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
                    Util.elementIsResizing = true;
                    xStart = parseInt(block['attributes']['data-gs-x'].value);
                    if (gallery.properties.resizeHandle == 'e' || gallery.properties.resizeHandle == 'se') {
                        $('#' + block.id).attr("data-gs-max-width", (gallery.settings.numberCol - xStart));
                    } else {
                        wStart = parseInt(block['attributes']['data-gs-width'].value);
                        //$('#' + block.id).attr("data-gs-max-width", (xStart + wStart));
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

                    xView = Math.round($(block).outerWidth() / gallery.properties.singleWidth);

                    if (gallery.settings.galleryLayout == 'masonry') {
                        yView = $(block).outerHeight();
                    } else {
                        yView = Math.round($(block).outerHeight() / gallery.properties.singleHeight);
                    }

                    gallery.updateSizeViewerText(block, xView, yView);

                    if (!$(block).hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        gallery.fixElementTextSize(block, gallery.properties.resizeHandle, null);
                    }
                    /* if (gallery.properties.resizeHandle == 'w' || gallery.properties.resizeHandle == 'sw') {
                        ;
                    } */
                }
            }).on('gsresizestop', function (event, elem) {
                if (Util.elementIsResizing) {
                    gallery.updateSizeViewerText(elem);
                    if (gallery.settings.galleryLayout == 'masonry') {
                        $('#' + block.id).attr("data-height", Math.round(($('#' + block.id).attr("data-gs-height")) / gallery.properties.singleWidth));
                    }
                    $('#' + block.id).attr("data-gs-max-width", "500");
                    gallery.updateAllElementsProperties();
                    Util.elementIsResizing = false;
                    if (!$(block).hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        gallery.fixElementTextSize(block, gallery.properties.resizeHandle, null);
                    }
                    gallery.$element.trigger('change');
                }
            });
        },

        _linkDragEvents: function () {
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
            $editor.addElements($elem.find('.text-wrap'));
        },

        _launchTextEditor: function () {
            var gallery = this;
            var divToolbar = document.createElement('div');

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

                    //init spectrum color picker for this button
                    initPicker(this.button);

                    //use our own handleClick instead of the default one
                    this.on(this.button, 'click', this.handleClick.bind(this));
                },
                handleClick: function (event) {
                    //keeping record of the current text selection
                    currentTextSelection = editor.exportSelection();

                    //sets the color of the current selection on the color picker
                    $(this.button).spectrum("set", getCurrentTextColor());

                    //from here on, it was taken form the default handleClick
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
                    /* This example includes the default options for placeholder,
                       if nothing is passed this is what it used */
                    text: '',
                    hideOnClick: true
                }
            });

            $('.text-wrap').each(function () {
                $(this).mediumInsert({
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
                        //tables: {}
                    },
                });
            });

            editor.subscribe('editableInput', function (e) {
                console.log(e);
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
                            gallery._addHandles(spanEl, 'e, s, w, se, sw');
                            $(spanEl).resizable({
                                //containment: $textWrapper[0],
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
                gallery.fixElementTextSize(gallery.properties.elementEdited, null, e);
            });

            var $elem;
            var $blockContent;
            $(gallery.$element).find('.rex-text-editable').each(function () {
                $elem = $(this);
                gallery._addElementToTextEditor(editor, $elem);
            });

            this.properties.mediumEditorIstance = editor;
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
            var h, backgroundHeight, defaultHeight, textHeight;
            var $this;
            Util.elementIsResizing = true;
            this.$element.find('.grid-item-content').each(function () {
                h = 0;
                backgroundHeight = 0;
                defaultHeight = 0;
                textHeight = 0;
                $this = $(this);
                $elem = $this.parents('.grid-stack-item');
                w = $elem[0]['attributes']['data-width'].value;
                if ($this.hasClass('full-image-background')) {
                    backgroundHeight = (parseInt($this.attr('data-background-image-height')) * (w * sw)) / (parseInt($this.attr('data-background-image-width')));
                } else if ($this.hasClass('natural-image-background')) {
                    if ($this.hasClass('small-width')) {
                        backgroundHeight = (parseInt($this.attr('data-background-image-height')) * (w * sw)) / (parseInt($this.attr('data-background-image-width'))) - gutter;
                    } else {
                        backgroundHeight = parseInt($this.attr('data-background-image-height')) + gutter;
                    }
                }

                if ($($this.find('.text-wrap')[0]).text().length != 0) {
                    textHeight = $($this.find('.text-wrap')[0]).innerHeight() + gutter;
                }

                if ((backgroundHeight == 0 && textHeight == 0) || $this.hasClass('youtube-player') || ($this.hasClass('empty-content') && textHeight == 0) || $this.hasClass('block-has-slider') || $elem.hasClass('block-has-slider')) {
                    origH = $elem.attr('data-height');
                    defaultHeight = Math.round(sw * origH);
                };
                h = Math.max(backgroundHeight, defaultHeight, textHeight);
                h = Math.round(h / gallery.properties.singleHeight);
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
