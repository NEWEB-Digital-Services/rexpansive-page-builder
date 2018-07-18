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
            mobilePadding: 'false',
            cellHeightMasonry: 5
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
            singleHeight: 0,
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
            gridstackInstance: null,
            gridstackInstanceID: null,
            serializedData: [],
            firstStartGrid: false,
            numberBlocks: null,
            mediumEditorIstance: null,
            gridBlocksHeight: 0,
            editedFromBackend: false,
            oneColumMode: false,
            oneColumModeActive: false,
            gridstackBatchMode: false,
            layoutChanged: false,
            updatingSection: false,
            oldLayout: "",
            oldCellHeight: 0,
            blocksBottomTop: null,
            updatingSectionSameGrid: false,
            startingLayout: "",
            oldFullHeight: ""
        };

        this.$section = this.$element.parents(this._defaults.gridParentWrap);
        this.section = this.$section[0];

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(perfectGridGalleryEditor.prototype, {
        init: function () {
            console.log('First Start');

            if (this.$section.children(".section-data").attr("data-row_edited_live") != "true") {
                this.properties.editedFromBackend = true;
            }

            this.properties.firstStartGrid = true;

            this._setGridID();

            console.log('First Start grid: ' + this.properties.sectionNumber);

            this._updateBlocksRexID();


            this._countBlocks();

            this.clearStateGrid();

            this._defineDataSettings();
            this._setGutter();
            this._defineHalfSeparatorProperties();
            this._defineRowSeparator();

            this._setGridPadding();

            this.properties.gridBlocksHeight = this._calculateGridHeight();
            this._defineDynamicPrivateProperties();

            this._prepareElements();

            if (Rexbuilder_Util_Editor.sectionCopying) {
                this.removeScrollbars();
            }

            this._launchGridStack();

            this.createScrollbars();

            if (Rexbuilder_Util.editorMode) {
                this._updateElementsSizeViewers();
                this._linkResizeEvents();
                this._linkDragEvents();
                this._launchTextEditor();
            } else {
                this.frontEndMode();
            }

            if (this.$section.attr("data-rex-collapse-grid") == "true" && !this.$section.hasClass("rex-block-grid")) {
                this.collapseElements();
            }
            /* 
            console.log(this.getElementBottomTop());
            console.log(this.getElementsTopBottom()); 
            */
            this.saveStateGrid();

            this.properties.startingLayout = this.settings.galleryLayout;

            this.properties.firstStartGrid = false;
        },

        clearStateGrid: function () {
            var rexID;
            this.$element.children(".grid-stack-item").each(function (i, el) {
                rexID = $(el).attr("data-rexbuilder-block-id");
                store.remove(rexID);
                store.remove(rexID + "_noEdits");
            });
        },

        saveStateGrid: function () {
            var rexID;
            var $elem;
            this.$element.children(".grid-stack-item").each(function (i, el) {
                $elem = $(el);
                rexID = $elem.attr("data-rexbuilder-block-id");
                var x, y, w, h;

                x = parseInt($elem.attr("data-gs-x"));
                y = parseInt($elem.attr("data-gs-y"));
                w = parseInt($elem.attr("data-gs-width"));
                h = parseInt($elem.attr("data-gs-height"));

                store.set(rexID, {
                    "properties": [
                        { "x": x },
                        { "y": y },
                        { "w": w },
                        { "h": h },
                    ]
                });
                store.set(rexID + "_noEdits", {
                    "properties": [
                        { "x": x },
                        { "y": y },
                        { "w": w },
                        { "h": h },
                    ]
                });
            });
        },

        updateGridSettingsModalUndoRedo: function (newSettings) {
            // o undo redo
            // funzione a parte per salvare stato
            console.log(newSettings);
            //updateGridDistance: function (newSettings);
            if (this.settings.galleryLayout != newSettings.layout && newSettings.layout == "fixed" && newSettings.fullHeight == "true") {
                this.updateLayout("fixed", "false");
                this.updateLayout("fixed", "true");
            } else if (this.settings.galleryLayout != newSettings.layout && newSettings.layout == "masonry" && this.settings.fullHeight.toString() == "true") {
                this.updateLayout("fixed", "false");
                this.updateLayout("masonry", "false");
            } else {
                console.log("default update layout");
                this.updateLayout(newSettings.layout, newSettings.fullHeight);
            }

        },

        updateLayout: function (newLayout, fullHeight) {
            console.log("changing layout, data active:", this.settings.galleryLayout, this.settings.fullHeight);
            console.log("changing layout, data received:", newLayout, fullHeight);

            Rexbuilder_Util_Editor.elementIsResizing = true;
            Rexbuilder_Util_Editor.elementIsDragging = true;
            this.properties.updatingSection = true;
            this.properties.oldCellHeight = this.properties.singleHeight;
            this.properties.oldLayout = this.settings.galleryLayout;
            this.properties.oldFullHeight = this.settings.fullHeight;

            this._saveBlocksPosition();
            this.removeScrollbars();

            this.settings.fullHeight = fullHeight.toString();

            var that = this;

            if (newLayout != this.settings.galleryLayout) {
                this.settings.galleryLayout = newLayout;
                this.settings.fullHeight = "";
                console.log("changing layout");
                console.log(newLayout);

                // destroying gridstack & jquery ui
                this.destroyGridstack();

                this._restoreBlocksPosition();

                // adding back the handles for resizing
                this.$element.children('.grid-stack-item').each(function () {
                    that._addHandles($(this), 'e, s, w, se, sw');
                });

                this._defineDynamicPrivateProperties();

                // relaunching grid
                console.log(this.properties.updatingSectionSameGrid);

                if (this.properties.startingLayout != this.settings.galleryLayout) {
                    this.properties.updatingSectionSameGrid = false;
                }

                this._launchGridStack();
                //have to wait animation to update sizeViewers
                //setTimeout(function () {
                that._updateElementsSizeViewers();
                //}, 1000);
            } else if (newLayout == "fixed") {
                if (this.properties.oldFullHeight.toString() != fullHeight.toString()) {
                    //this.saveStateGrid();

                    console.log("fullH?");

                    // destroying gridstack & jquery ui
                    this.destroyGridstack();

                    //                    this.properties.updatingSectionSameGrid = true;
                    this.properties.updatingSection = false;
                    this._restoreBlocksPosition();
                    this.properties.updatingSection = true;

                    // adding back the handles for resizing
                    this.$element.children('.grid-stack-item').each(function () {
                        that._addHandles($(this), 'e, s, w, se, sw');
                    });

                    this._defineDynamicPrivateProperties();
                    console.log(this.properties.singleHeight);
                    this._launchGridStack();

                }
            }

            this.createScrollbars();

            this.properties.updatingSection = false;
            this.properties.oldLayout = "";
            this.properties.oldCellHeight = this.properties.singleHeight;
            this.properties.updatingSectionSameGrid = true;
            Rexbuilder_Util_Editor.elementIsResizing = false;
            Rexbuilder_Util_Editor.elementIsDragging = false;
        },

        updateGridDistance: function (newSettings) {
            this.properties.gutter = newSettings.gutter;
            this.properties.gridTopSeparator = newSettings.separatorTop;
            this.properties.gridRightSeparator = newSettings.separatorRight;
            this.properties.gridBottomSeparator = newSettings.separatorBottom;
            this.properties.gridLeftSeparator = newSettings.separatorLeft;


            this._setGutter();
            this._defineHalfSeparatorProperties();

            this.properties.setDesktopPadding = false;
            this._setGridPadding();

            var that = this;
            var $el;
            this.$element.find(".grid-stack-item-content").each(function (i, el) {
                $el = $(el);
                that._updateElementPadding($el);
            });

        },

        updateGrid: function () {
            console.log("update grid");
        },

        refreshGrid: function () {

            this._defineDynamicPrivateProperties();

            this._setGridPadding();

            this._fixHeightAllElements();

        },

        _countBlocks: function () {
            var number = 0;
            this.$element.find('.grid-stack-item').each(function (i, e) {
                number = i;
            });
            this.properties.lastIDBlock = number + 1;
        },

        getLastID: function () {
            return this.properties.lastIDBlock;
        },

        getRowNumber: function () {
            return this.properties.sectionNumber;
        },

        _setGridID: function () {
            this.properties.sectionNumber = parseInt(this.$section.attr('data-rexlive-section-number'));
            this.$element.addClass('grid-number-' + this.properties.sectionNumber);
        },

        _updateBlocksRexID: function () {
            var id;
            var $elem;
            this.$element.find('.grid-stack-item').each(function (i, e) {
                $elem = $(e);
                if ($elem.attr('data-rexbuilder-block-id') === undefined || $elem.attr('data-rexbuilder-block-id') == "") {
                    id = Rexbuilder_Util.createBlockID();
                    $elem.attr('data-rexbuilder-block-id', id);
                    $elem.children(".rexbuilder-block-data").attr("data-rexbuilder_block_id", id);
                }
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

        getElementBottomTop: function () {
            var nodes = [];
            this.$element.children('.grid-stack-item').each(function (i, e) {
                var el = e;
                el.x = parseInt(e['attributes']['data-gs-x'].value);
                el.y = parseInt(e['attributes']['data-gs-y'].value);
                el.w = parseInt(e['attributes']['data-gs-width'].value);
                el.h = parseInt(e['attributes']['data-gs-height'].value);
                el.xw = el.x + el.w;
                el.yh = el.y + el.h;
                nodes.push(el);
            });
            return (lodash.sortBy(nodes, [function (o) { return o.yh; }, function (o) { return o.xw; }])).reverse();
        },

        getElementsTopBottom: function () {
            var nodes = [];
            this.$element.children('.grid-stack-item').each(function (i, e) {
                if (!$(el).hasClass("removing_block")) {
                    var el = e;
                    el.x = parseInt(e['attributes']['data-gs-x'].value);
                    el.y = parseInt(e['attributes']['data-gs-y'].value);
                    nodes.push(el);
                }
            });
            return lodash.sortBy(nodes, [function (o) { return o.y; }, function (o) { return o.x; }]);
        },

        fixElementTextSize: function (block, $handler, event) {
            var $block = $(block);
            if (!$block.hasClass('block-has-slider')) {
                var $rexScrollbar = $block.find('.rex-custom-scrollbar');
                if ($rexScrollbar.length == 0) {
                    return;
                }
                if ($handler !== null) {
                    var scrollbarIstance = $rexScrollbar.overlayScrollbars();
                    if (typeof scrollbarIstance !== "undefined") {
                        var textHeight = 0;
                        var $blockContent = $block.find('.grid-item-content');
                        var maxBlockHeight = $blockContent.height();
                        var $textWrap = $blockContent.find('.text-wrap');
                        if ($textWrap.length != 0) {
                            textHeight = this.calculateTextWrapHeight($textWrap);
                        }
                        if (textHeight < maxBlockHeight) {
                            scrollbarIstance.sleep();
                        } else {
                            scrollbarIstance.update();
                        }
                    }
                } else {
                    if ($block.find("." + Rexbuilder_Util.scrollbarProperties.className).length === 0) {
                        ;
                    } else {
                        // successive modifiche dovute al cambiamento del contenuto
                        var scrollbarIstance = $rexScrollbar.overlayScrollbars();

                        if (!$rexScrollbar.hasClass(Rexbuilder_Util.scrollbarProperties.className) || $rexScrollbar.hasClass('os-host-scrollbar-vertical-hidden')) {
                            var maxBlockHeight = $rexScrollbar.parents('.grid-item-content').height();
                            var textHeight = $block.find('.text-wrap').innerHeight();
                            var w = parseInt($block.attr("data-gs-width"));
                            var h = this.properties.elementStartingH;
                            var $dataBlock = $block.children('.rexbuilder-block-data');

                            if (this.settings.galleryLayout == 'masonry') {
                                if (textHeight >= maxBlockHeight) {
                                    h = h + Math.ceil((textHeight - maxBlockHeight) / this.properties.singleHeight);
                                } else {
                                    h = Math.max(h - Math.floor((maxBlockHeight - textHeight) / this.properties.singleHeight),
                                        isNaN(parseInt($dataBlock.attr('data-block_height_calculated'))) ? 0 : parseInt($dataBlock.attr('data-block_height_calculated')));
                                }
                            } else {
                                if (textHeight >= maxBlockHeight) {
                                    h = h + Math.ceil((textHeight - maxBlockHeight) / this.properties.singleHeight);
                                } else {
                                    h = Math.max(h - Math.floor((maxBlockHeight - textHeight) / this.properties.singleHeight),
                                        isNaN(parseInt($dataBlock.attr('data-block_height_calculated'))) ? 0 : parseInt($dataBlock.attr('data-block_height_calculated')));

                                }
                                console.log("new block fixed h: " + h);
                            }

                            if (this.properties.elementStartingH != h) {
                                var gridstack = this.properties.gridstackInstance;
                                gridstack.update(block, null, null, w, h);
                                this.updateSizeViewerSizes($block);
                                this.properties.elementStartingH = h;
                            }
                            scrollbarIstance.scroll({ y: "50%" }, 100);
                            scrollbarIstance.update();
                        } else {
                            scrollbarIstance.scroll({ y: "100%" }, 100);
                            scrollbarIstance.update();
                        }
                    }
                }

            }
            $block = undefined;
        },

        disableTextScrollbars: function () {
            this.$element.children('.grid-stack-item').each(function () {
                var $block = $(this);
                if (!$block.hasClass('block-has-slider')) {
                    var scrollbarIstance = $block.find('.rex-custom-scrollbar').overlayScrollbars();
                    if (scrollbarIstance !== undefined) {
                        console.log("sleeping " + $block.data("rexbuilder-block-id"));
                        scrollbarIstance.sleep();
                    }
                }
            });
        },

        enableTextScrollbars: function () {
            this.$element.children('.grid-stack-item').each(function () {
                var $block = $(this);
                if (!$block.hasClass('block-has-slider')) {
                    var scrollbarIstance = $block.find('.rex-custom-scrollbar').overlayScrollbars();
                    if (scrollbarIstance !== undefined) {
                        console.log("waking " + $block.data("rexbuilder-block-id"));
                        scrollbarIstance.update();
                    }
                }
            });
        },


        /**
         * Funzione che rimuove le scrollbar dai blocchi
         */
        removeScrollbars: function () {
            var $elem;
            this.$element.children('.grid-stack-item').each(function () {
                $elem = $(this);
                var $blockContent = $elem.find('.grid-item-content');
                if (!$elem.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                    var scrollbarIstance = $elem.find('.rex-custom-scrollbar').overlayScrollbars();
                    if (scrollbarIstance !== undefined) {
                        //console.log("destroy " + $elem.data("rexbuilder-block-id")); 
                        scrollbarIstance.destroy();
                    }
                }
            });
        },

        createScrollbars: function () {
            console.log("lancio scrollbar grid: " + this.properties.sectionNumber);
            var $elem;
            var gallery = this;
            this.$element.children('.grid-stack-item').each(function () {
                $elem = $(this);
                var $rexScrollbar = $elem.find('.rex-custom-scrollbar');
                if ($rexScrollbar.length == 0) {
                    return;
                }
                var $blockContent = $elem.find('.grid-item-content');
                if ($elem.find(".rex-slider-wrap").length === 0 && !$blockContent.hasClass('youtube-player')) {
                    var maxBlockHeight = $blockContent.height();
                    var textHeight = 0;
                    var $textWrap = $elem.find('.text-wrap');
                    if ($textWrap.length != 0) {
                        textHeight = gallery.calculateTextWrapHeight($textWrap);
                    }
                    if (Rexbuilder_Util.editorMode) {
                        var istanceScrollbar = $rexScrollbar.overlayScrollbars(Rexbuilder_Util.scrollbarProperties).overlayScrollbars();
                        if (textHeight < maxBlockHeight) {
                            istanceScrollbar.sleep();
                        }
                    } else {
                        if (textHeight > maxBlockHeight) {
                            $rexScrollbar.overlayScrollbars(Rexbuilder_Util.scrollbarProperties);
                        }
                    }
                }
            });
        },

        batchGridstack: function () {
            if (!this.properties.gridstackBatchMode) {
                if (this.properties.gridstackInstance !== null) {
                    console.log("enter batch mode");
                    this.properties.gridstackInstance.batchUpdate();
                }
                this.properties.gridstackBatchMode = true;
            }
        },

        commitGridstack: function () {
            if (this.properties.gridstackBatchMode) {
                if (this.properties.gridstackInstance !== null) {
                    console.log("exit batch mode");
                    this.properties.gridstackInstance.commit();
                }
                this.properties.gridstackBatchMode = false;
            }
        },

        updateGridstackFixedMode: function () {
            console.log("updating gridstackstyles");
            var gridstack = this.properties.gridstackInstance;
            gridstack.cellHeight(this.properties.singleHeight);
            gridstack._initStyles();
            gridstack._updateStyles(this.properties.singleHeight);
        },

        _fixBlocksPosition: function () {
            var gridstack = this.properties.gridstackInstance;
            var elDim;
            var i;
            var el;
            for (i = 0; i < this.properties.blocksBottomTop.length; i++) {
                el = this.properties.blocksBottomTop[i];
                elDim = store.get(el["attributes"]["data-rexbuilder-block-id"].value);
                gridstack.move(el, elDim.properties[0].x, elDim.properties[1].y);
            }
            /*  $(this.properties.blocksBottomTop).each(function (i, e) {
                 elDim = store.get(e["attributes"]["data-rexbuilder-block-id"].value);
                 gridstack.move(e, elDim.properties[0].x, elDim.properties[1].y);
             }); */
        },

        restoreBackup: function () {
            var block;
            var G = this;
            var $block;
            G.$element.children('.grid-stack-item').each(function () {
                block = this;
                $block = $(this);
                $block.attr({
                    'data-gs-x': block['attributes']['data-col'].value - 1,
                    'data-gs-y': block['attributes']['data-row'].value - 1,
                    'data-gs-width': block['attributes']['data-width'].value,
                    'data-gs-height': block['attributes']['data-height'].value
                });
                // G.updateSizeViewerText($block);
            });
        },


        /**
         * Function called for destroying gridstack-istance
        */
        destroyGridstack: function () {
            console.log("destroy gridstack");
            if (this.properties.gridstackInstance !== null) {
                var gridstack = this.properties.gridstackInstance;
                var $elem;
                gridstack.destroy(false);

                this.$element.children('.grid-stack-item').each(function () {
                    $elem = $(this);
                    $elem.draggable("destroy");
                    $elem.resizable("destroy");
                });

                this.$element.removeClass('grid-stack-instance-' + this.properties.gridstackInstanceID);
                if (this.$element.hasClass("grid-stack-one-column-mode")) {
                    this.$element.removeClass("grid-stack-one-column-mode");
                }
                this.properties.gridstackInstance = null;
                console.log("gridstack destroyed");
            }
        },

        getGridWidth: function () {
            return this.properties.wrapWidth;
        },

        setGridWidth: function (width) {
            this.$element.outerWidth(width);
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
            console.log("creating empty blocks");
            var guard;
            var gridstack = this.properties.gridstackInstance;
            var w, h;
            var internal_i, internal_j;
            var emptyBlocks = [];
            for (j = 1; j <= rows; j++) {
                for (i = 1; i <= cols; i++) {
                    if (gridstack.isAreaEmpty(i - 1, j - 1, 1, 1)) {
                        guard = 0;
                        w = h = 1;
                        internal_i = i;
                        internal_j = j;

                        while (internal_i <= cols && gridstack.isAreaEmpty(internal_i - 1, internal_j - 1, 1, 1)) {
                            guard = internal_i;
                            internal_i++;
                        }
                        w = internal_i - i;
                        internal_j++;
                        internal_i = i;

                        while (internal_j <= rows) {
                            while (internal_i <= guard) {
                                if (gridstack.isAreaEmpty(internal_i - 1, internal_j - 1, 1, 1)) {
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
                        var div = document.createElement("div");
                        var blockObj = {
                            el: div,
                            x: i - 1,
                            y: j - 1,
                            w: w,
                            h: h
                        };
                        console.log(blockObj);
                        gridstack.addWidget(blockObj.el, blockObj.x, blockObj.y, blockObj.w, blockObj.h, false);
                        emptyBlocks.push(blockObj);
                    }
                }
            }
            var width = this.properties.singleWidth;
            for (i = 0; i < emptyBlocks.length; i++) {
                gridstack.removeWidget(emptyBlocks[i].el, true);
                if (this.settings.galleryLayout == "masonry") {
                    emptyBlocks[i].y = Math.floor(emptyBlocks[i].y * this.properties.singleHeight / width) + 1;
                    emptyBlocks[i].h = Math.round(emptyBlocks[i].h * this.properties.singleHeight / width);
                }
            }
            return emptyBlocks;
        },

        // Function that creates a new empty block and returns it. The block is
        // added to gridstack and gallery
        createBlock: function (x, y, w, h) {

            if (this.settings.galleryLayout == 'masonry' && h * this.settings.cellHeightMasonry < this.properties.singleWidth) {
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
            var gridstack = this.properties.gridstackInstance;
            var rexIdBlock = Rexbuilder_Util.createBlockID();
            this.properties.numberBlocks = this.properties.numberBlocks + 1;
            var idBlock = this.properties.numberBlocks;

            gallery.properties.numberBlocks = gallery.properties.numberBlocks + 1;

            $(divGridItem).attr({
                'id': "block_" + idBlock,
                'class': 'perfect-grid-item grid-stack-item empty-block',
                'data-height': h,
                'data-width': w,
                'data-row': y + 1,
                'data-col': x + 1,
                'data-gs-height': h,
                'data-gs-width': w,
                'data-gs-y': y,
                'data-gs-x': x,
                'data-rexbuilder-block-id': rexIdBlock
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
            $(divDragHandle).appendTo(divBlockOverlay);
            $(divRexScrollbar).appendTo(divBlockOverlay);
            $(divBlockOverlay).appendTo(divGridItemContent);
            $(divGridItemContent).appendTo(divGridStackContent);
            $(divGridStackContent).appendTo(divGridItem);
            $(divGridItem).append(tmpl("tmpl-tool-block"));

            this._prepareElement(divGridItem);
            this.createElementProperties(divGridItem);
            gridstack.addWidget(divGridItem, x, y, w, h, false);
            this.updateSizeViewerText($(divGridItem), w, h);

            return divGridItem;
        },

        createElementProperties: function (elem) {
            var divProperties = document.createElement('div');
            var $elem = $(elem);
            var pos_y = this.settings.galleryLayout == 'masonry' ? Math.round(parseInt($elem.attr('data-row')) / this.properties.singleHeight) : parseInt($elem.attr('data-row'));
            var y = this.settings.galleryLayout == 'masonry' ? Math.round(parseInt($elem.attr('data-height')) / this.properties.singleHeight) : parseInt($elem.attr('data-height'));
            $(divProperties).attr({
                'style': 'display: none;',
                'data-id': $elem.attr('id'),
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
            console.log("updating elements properties");
            // andrebbe anche all'aggiunta di testo nel blocco se masonry, vediamo dopo
            var gallery = this;
            this.properties.editedFromBackend = false;
            this.properties.startingLayout = this.settings.galleryLayout;
            var $elem;
            if (this.properties.updatingSectionSameGrid) {
                this.properties.updatingSectionSameGrid = false;
                this.$element.children('.grid-stack-item:not(.grid-stack-placeholder)').each(function () {
                    $elem = $(this);
                    gallery.updateElementAllProperties(this);
                    if (typeof store.get($elem.attr("data-rexbuilder-block-id") + "_noEdits") !== "undefined") {
                        store.remove($elem.attr("data-rexbuilder-block-id") + "_noEdits");
                    }
                });
            }
            this.$element.children('.grid-stack-item:not(.grid-stack-placeholder)').each(function () {
                gallery.updateElementAllProperties(this);
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
            var $block = $(elem);
            var width = this.properties.singleWidth;
            var size;
            var $dataBlock = $block.children('.rexbuilder-block-data');
            switch ($case) {
                case 'x': {
                    size = parseInt(block['attributes']['data-gs-x'].value);

                    // gridster works 1 to n not 0 to n-1
                    size = size + 1;

                    block['attributes']['data-col'].value = size
                    $dataBlock.attr({
                        'data-col': size
                    });
                    break;
                }
                case 'y': {
                    if (this.settings.galleryLayout == 'masonry') {
                        //var oldSize = block['attributes']['data-row'].value - 1;
                        size = Math.floor(parseInt(block['attributes']['data-gs-y'].value) * this.properties.singleHeight / width);
                    } else {
                        size = parseInt(block['attributes']['data-gs-y'].value);
                    }

                    // gridster works 1 to n not 0 to n-1
                    size = size + 1;
                    block['attributes']['data-row'].value = size;
                    $dataBlock.attr({
                        'data-row': size
                    });
                    break;
                }
                case 'w': {
                    var w = parseInt(block['attributes']['data-gs-width'].value);
                    var oldW = block['attributes']['data-width'].value;
                    block['attributes']['data-width'].value = w;
                    // updating element class
                    $block.removeClass("w" + oldW);
                    $block.addClass("w" + w);
                    $dataBlock.attr({
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

                    this.updateElementDataHeightProperties($dataBlock, parseInt(block['attributes']['data-gs-height'].value));
                    // updating element class
                    $block.removeClass("h" + oldH);
                    $block.addClass("h" + h);
                    $dataBlock.attr({
                        'data-size_y': h
                    });
                    if ($block.find("." + Rexbuilder_Util.scrollbarProperties.className).hasClass("os-host-overflow-y")) {
                        $dataBlock.attr("data-block_has_scrollbar", "true");
                    } else {
                        $dataBlock.attr("data-block_has_scrollbar", "false");
                    }
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
            var oldWidth = this.properties.wrapWidth;
            var newWidth = this.$element.outerWidth();
            //method with jquery 
            //this.element.offsetWidth; 
            //this.$element.outerWidth();
            if (this.$section.hasClass("rex-block-grid")) {
                this.properties.oneColumMode = false;
            } else {
                this.properties.oneColumMode = true;
            }

            if (!Rexbuilder_Util.windowIsResizing) {
                if (this.properties.oneColumMode && this._viewport().width <= 768) {
                    /* this.properties.oneColumModeActive = true;
                    this.$element.addClass("grid-stack-one-column-mode"); */
                } else {
                    this.properties.oneColumModeActive = false;
                }
            }
            //if (oldWidth != newWidth || this.properties.updatingSection) {
            console.log(this.settings.galleryLayout);
            console.log(this.settings.fullHeight);
            this.properties.wrapWidth = newWidth;
            this.properties.singleWidth = newWidth * this.settings.gridItemWidth;

            if (this.settings.galleryLayout == 'masonry') {
                this.properties.singleHeight = this.settings.cellHeightMasonry;
            } else {
                var oldSingleHeight = this.properties.singleHeight;
                var newSingleHeight;
                console.log("GRID LAYOUTS");
                if (this.settings.fullHeight.toString() == 'true') {
                    console.log("&&&fullheight&&&");
                    newSingleHeight = this._viewport().height / this._calculateGridHeight();
                } else {
                    newSingleHeight = this.properties.singleWidth;
                }
                console.log(newSingleHeight, oldSingleHeight);
                if (oldSingleHeight == newSingleHeight) {
                    return false;
                }
                this.properties.singleHeight = newSingleHeight;
                console.log(this.properties.singleHeight);
            }
            return true;
            /* }
            return false; */
        },

        _calculateGridHeight: function () {
            var heightTot = 0;
            var hTemp;
            var $gridItem;
            this.$element.children('.grid-stack-item').each(function () {
                $gridItem = $(this);
                if (!$gridItem.hasClass("removing_block")) {
                    hTemp = parseInt($gridItem.attr('data-gs-height')) + parseInt($gridItem.attr('data-gs-y'));
                    if (hTemp > heightTot) {
                        heightTot = hTemp;
                    }
                }
            });
            return heightTot;
        },

        _defineHalfSeparatorProperties: function () {
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

            this.properties.paddingTopBottom = this.$section.hasClass('distance-block-top-bottom');
        },

        _defineRowSeparator: function () {
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
            var grid = this.element;
            this.$element.outerHeight(grid['attributes']['data-gs-current-height'].value * this.properties.singleWidth);
        },

        // fixes gutter if there is, this function is applied on the div used by
        // gridstack for the element
        _updateElementPadding: function ($elemContent) {
            $elemContent.css({
                'padding-left': this.properties.halfSeparatorElementLeft,
                'padding-right': this.properties.halfSeparatorElementRight,
                'padding-top': this.properties.halfSeparatorElementTop,
                'padding-bottom': this.properties.halfSeparatorElementBottom,
            });
        },

        _saveBlocksPosition: function () {
            var $elem;
            var x, y, w, h;
            var gallery = this;
            this.$element.children('.grid-stack-item').each(function () {
                $elem = $(this);
                console.log("saving: " + $elem.attr("data-rexbuilder-block-id"));
                x = parseInt($elem.attr("data-gs-x"));
                y = parseInt($elem.attr("data-gs-y"));
                w = parseInt($elem.attr("data-gs-width"));
                h = parseInt($elem.attr("data-gs-height"));
                console.log(x, y, w, h);
                store.set($elem.attr("data-rexbuilder-block-id"), {
                    "properties": [
                        { "x": x },
                        { "y": y },
                        { "w": w },
                        { "h": h },
                    ]
                });
                if (gallery.properties.updatingSection && !gallery.properties.updatingSectionSameGrid) {
                    store.set($elem.attr("data-rexbuilder-block-id") + "_noEdits", {
                        "properties": [
                            { "x": x },
                            { "y": y },
                            { "w": w },
                            { "h": h },
                        ]
                    });
                }
            });
        },

        _restoreBlocksPosition: function () {
            var $elem;
            var gallery = this;

            this.$element.children('.grid-stack-item').each(function () {
                var x, y, w, h;
                var elDim;
                $elem = $(this);
                if (gallery.properties.updatingSection && typeof (store.get($elem.attr("data-rexbuilder-block-id") + "_noEdits")) !== "undefined") {
                    elDim = store.get($elem.attr("data-rexbuilder-block-id") + "_noEdits");
                    console.log("%%%%%%%%%% picking old dim %%%%%%%%%%%%%%");
                } else {
                    elDim = store.get($elem.attr("data-rexbuilder-block-id"));
                }

                x = elDim.properties[0].x;
                y = elDim.properties[1].y;
                w = elDim.properties[2].w;
                h = elDim.properties[3].h;
                console.log(x, y, w, h);
                $elem.attr("data-gs-x", x);
                $elem.attr("data-gs-y", y);
                $elem.attr("data-gs-width", w);
                $elem.attr("data-gs-height", h);
            });
        },

        createResizePlaceHolder: function ($elem) {
            var block = $elem[0];
            var placeholder = document.createElement('div');
            var $placeholder = $(placeholder);
            $elem.parent().append(placeholder);
            $placeholder.addClass('resizePlaceHolder');
            $placeholder.addClass('w' + parseInt(block['attributes']['data-width'].value));
            var x = parseInt(block['attributes']['data-row'].value - 1) * this.properties.singleWidth;
            var y = parseInt(block['attributes']['data-col'].value - 1) * this.properties.singleWidth;
            $placeholder.css('transform', 'translate(' + y + 'px, ' + x + 'px)');
            $placeholder.css('position', 'absolute');
            return $placeholder;
        },

        updateResizePlaceHolder: function ($resizePlaceHolder, $elem) {
            var block = $elem[0];
            var width = this.properties.singleWidth;
            var w = parseInt(block['attributes']['data-width'].value);

            var nW = Math.round(parseInt($elem.outerWidth()) / width);
            if (nW <= 0) {
                nW = 1;
            }
            // updating element class
            $resizePlaceHolder.removeClass();
            $resizePlaceHolder.addClass('resizePlaceHolder ' + 'w' + nW);
            var nH = Math.round(parseInt($elem.outerHeight()) / width);
            if (nH <= 0) {
                nH = 1;
            }
            $resizePlaceHolder.css('width', nW * width + "px");
            $resizePlaceHolder.css('height', nH * width + "px");
        },


        _prepareElements: function () {
            var gallery = this;

            if (this.properties.editedFromBackend) {
                var $elem;
                gallery.$element.children('.grid-stack-item').each(function () {
                    $elem = $(this);
                    $elem.attr("data-gs-x", $elem.data("col") - 1);
                    $elem.attr("data-gs-y", $elem.data("row") - 1);
                    $elem.attr("data-gs-width", $elem.data("width"));
                    $elem.attr("data-gs-height", $elem.data("height"));
                });
            }

            gallery.$element.children('.grid-stack-item').each(function () {
                var $elem = $(this);
                gallery._prepareElement(this);
                if ($elem.children(".rexbuilder-block-data").attr("data-gs_start_h") === undefined) {

                    $elem.children(".rexbuilder-block-data").attr("data-gs_start_h", parseInt($elem.attr("data-gs-height")));
                }
            });
        },

        /**
         * Receives the element to prepare, not jquery object
     */
        _prepareElement: function (elem) {
            var gallery = this;
            var $elem = $(elem);
            if (Rexbuilder_Util.editorMode) {
                gallery._prepareElementEditing($elem);
            }

            gallery._updateElementPadding($elem.find('.grid-stack-item-content'));
            gallery._fixImageSize($elem);

        },

        updateElementDataHeightProperties: function ($blockData, newH) {
            //            console.log(); 
            if (this.settings.galleryLayout == "masonry") {
                $blockData.attr("data-block_height_masonry", newH);
            } else {
                $blockData.attr('data-block_height_fixed', newH);
            }
            if (this.properties.firstStartGrid) {
                $blockData.attr('data-gs_start_h', newH);
            }
            $blockData.attr("data-block_height_calculated", newH);
        },

        _prepareElementEditing: function ($elem) {
            if (Rexbuilder_Util_Editor.blockCopying) {
                this.properties.numberBlocks = this.properties.numberBlocks + 1;
                var $elemData = $elem.children(".rexbuilder-block-data");
                var rexId = Rexbuilder_Util.createBlockID();
                var id = this.properties.numberBlocks;
                $elem.attr({
                    "id": "block_" + id,
                    "data-rexbuilder-block-id": rexId,
                });
                $elemData.attr({
                    "id": "block_" + id + "-builder-data",
                    "data-id": "block_" + id,
                    "data-data_rexbuilder_block_id": rexId,
                });
            }

            if (Rexbuilder_Util_Editor.sectionCopying || Rexbuilder_Util_Editor.blockCopying) {
                this._removeHandles($elem);
            }

            this._addHandles($elem, 'e, s, w, se, sw');

            $elem.attr({
                "data-gs-min-width": 1,
                "data-gs-min-height": 1,
                "data-gs-max-width": 500
            });

            // adding text wrap element if it's not there
            if ($elem.find(".rex-slider-wrap").length === 0) {
                var $textWrap = $elem.find('.text-wrap');
                if ($textWrap.length == 0) {
                    var textWrapEl;
                    textWrapEl = document.createElement('div');
                    $(textWrapEl).addClass('text-wrap');
                    $elem.find('.rex-custom-scrollbar').append(textWrapEl);
                } else if ($textWrap.children(".text-editor-span-fix").length == 0) {
                    // if there is text wrap, adding a span element to fix the text
                    // editor
                    var spanEl = document.createElement('span');
                    $(spanEl).css('display', 'none');
                    $(spanEl).addClass('text-editor-span-fix');
                    $textWrap.append(spanEl);
                }
            }

            this.addElementListeners($elem);

        },

        _fixImageSize: function ($elem) {
            var $blockContent;
            var imageWidth = -1;
            $blockContent = $elem.find('.grid-item-content');
            imageWidth = $blockContent.attr('data-background-image-width');
            if (imageWidth != -1) {
                if ($elem.outerWidth() < imageWidth) {
                    if (!$blockContent.hasClass('small-width')) {
                        $blockContent.addClass('small-width');
                    }
                } else {
                    $blockContent.removeClass('small-width');
                }
            }
        },

        _removeHandles: function ($elem) {
            $elem.children('.ui-resizable-handle').each(function () {
                $(this).remove();
            });
        },

        // add span elements that will be used as handles of the element
        _addHandles: function ($elem, handles) {
            var span;
            var div;
            var handle;
            var stringID = $elem.attr("data-rexbuilder-block-id");
            $(handles.split(', ')).each(function () {
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

        addElementListeners: function ($elem) {
            // adding element listeners

            var gallery = this;
            var $dragHandle = $elem.find(".rexlive-block-drag-handle");
            var $textWrap = $elem.find(".text-wrap");
            var dragHandle = $dragHandle[0];
            var useDBclick = false;

            // mouse down on another element
            $elem.mousedown(function (e) {
                console.log("mouse down: " + $elem.data("rexbuilder-block-id"));
                if ($(e.target).parents(".rexlive-block-toolbox").length == 0) {
                    useDBclick = false;
                    /* 
                    if (Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id"))) {
                        console.log("%c stopping propagation ", "color: purple");
                        //$textWrap.blur();
                        Rexbuilder_Util_Editor.elementIsResizing = false;
                        Rexbuilder_Util_Editor.elementIsDragging = false;
                        //e.stopPropagation();
                        //e.preventDefault();
                    } 
                    */
                    Rexbuilder_Util_Editor.mouseDownEvent = e;
                    if (!(Rexbuilder_Util_Editor.editingElement || Rexbuilder_Util_Editor.elementIsDragging || Rexbuilder_Util_Editor.elementIsResizing) || (Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id")))) {
                        if (e.target != dragHandle) {
                            clearTimeout(this.downTimer);
                            this.downTimer = setTimeout(function () {
                                console.log("%c we have to drag ", "color: green");
                                $dragHandle.addClass("drag-up");

                                Rexbuilder_Util_Editor.mouseDownEvent.target = dragHandle;
                                Rexbuilder_Util_Editor.mouseDownEvent.srcElement = dragHandle;
                                Rexbuilder_Util_Editor.mouseDownEvent.toElement = dragHandle;

                                Rexbuilder_Util_Editor.elementDraggingTriggered = true;

                                $elem.trigger(Rexbuilder_Util_Editor.mouseDownEvent);
                            }, 125);
                        }
                    }

                }
            });

            $elem.mouseup(function (e) {
                console.log("mouse up: " + $elem.data("rexbuilder-block-id"));
                console.log(e.target);

                if ($(e.target).parents(".rexlive-block-toolbox").length == 0) {
                    if (Rexbuilder_Util_Editor.elementDraggingTriggered) {
                        $dragHandle.removeClass("drag-up");
                        Rexbuilder_Util_Editor.elementDraggingTriggered = false;
                    }
                    clearTimeout(this.downTimer);
                    Rexbuilder_Util_Editor.mouseDownEvent = null;

                    if (!(Rexbuilder_Util_Editor.editingElement || Rexbuilder_Util_Editor.elementIsResizing || Rexbuilder_Util_Editor.elementIsDragging) || (Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id")))) {
                        /* setTimeout(function () {
                            console.log("now u can dbclick");
                            useDBclick = true;
                        }, 3000); */
                        Rexbuilder_Util_Editor.editingElement = true;
                        Rexbuilder_Util_Editor.editedElement = $elem;
                        Rexbuilder_Util_Editor.editedTextWrap = $textWrap;
                        Rexbuilder_Util_Editor.editingGallery = true;
                        Rexbuilder_Util_Editor.editedGallery = gallery;
                        if (!$textWrap.is(":focus")) {
                            var caretPosition;
                            if ($elem.hasClass("rex-flex-top")) {
                                caretPosition = "end";
                            } else if ($elem.hasClass("rex-flex-middle")) {
                                var textHeight = $textWrap.innerHeight();
                                var maxBlockHeight = $elem.innerHeight();
                                if (e.offsetY < maxBlockHeight / 2 - textHeight / 2) {
                                    caretPosition = "begin";
                                } else {
                                    caretPosition = "end";
                                }
                            } else if ($elem.hasClass("rex-flex-bottom")) {
                                caretPosition = "begin";
                            } else {
                                caretPosition = "end";
                            }

                            if (caretPosition == "begin") {
                                $textWrap.focus();
                            } else {
                                Rexbuilder_Util_Editor.setEndOfContenteditable($textWrap[0]);
                            }
                        }
                        Rexbuilder_Util_Editor.startEditingElement();
                    }
                }
            });

            $elem.click(function (e) {
                if (!Rexbuilder_Util_Editor.elementDraggingTriggered) {
                    if (Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id"))) {

                        //$textWrap.blur();
                        Rexbuilder_Util_Editor.activateElementFocus = false;
                        Rexbuilder_Util_Editor.endEditingElement();
                        Rexbuilder_Util_Editor.activateElementFocus = true;
                        //gallery.focusElement($elem);
                    }
                }
            });

            $elem.hover(function (e) {
                if (!(Rexbuilder_Util_Editor.editingElement || Rexbuilder_Util_Editor.elementIsResizing || Rexbuilder_Util_Editor.elementIsDragging) || Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id"))) {
                    Rexbuilder_Util_Editor.focusedElement = $elem;
                    gallery.focusElement(Rexbuilder_Util_Editor.focusedElement);
                }
            }, function () {
                if (!(Rexbuilder_Util_Editor.editingElement || Rexbuilder_Util_Editor.elementIsResizing || Rexbuilder_Util_Editor.elementIsDragging) || Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id"))) {
                    Rexbuilder_Util_Editor.focusedElement;
                    gallery.unFocusElement(Rexbuilder_Util_Editor.focusedElement);
                }
            });

            $elem.dblclick(function (e) {
                /* console.log(useDBclick);
                if (!useDBclick) {
                    e.preventDefault();
                    e.stopPropagation();
                } */
                /* console.log("dbclick: " + $elem.data("rexbuilder-block-id"));
                if (Rexbuilder_Util_Editor.editingElement && (Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") != $elem.data("rexbuilder-block-id"))) {
                    Rexbuilder_Util_Editor.activateElementFocus = false;
                    Rexbuilder_Util_Editor.endEditingElement();
                    Rexbuilder_Util_Editor.activateElementFocus = true;
                }
                Rexbuilder_Util_Editor.elementIsResizing = false;
                Rexbuilder_Util_Editor.elementIsDragging = false;
        
                Rexbuilder_Util_Editor.editingElement = true;
                Rexbuilder_Util_Editor.editedElement = $elem;
                Rexbuilder_Util_Editor.editedTextWrap = $textWrap;
                Rexbuilder_Util_Editor.editingGallery = true;
                Rexbuilder_Util_Editor.editedGallery = gallery;
                console.log(e);
                Rexbuilder_Util_Editor.startEditingElement(e); */
            });

        },

        showBlockToolBox: function ($elem) {
            $elem.children(".rexlive-block-toolbox").addClass("focused");
        },

        hideBlockToolBox: function ($elem) {
            $elem.children(".rexlive-block-toolbox").removeClass("focused");
        },

        disableDragHandle: function ($elem) {
            console.log("disabling " + $elem.data("rexbuilder-block-id") + " drag handle");
            //$elem.children(".rexlive-block-drag-handle").addClass("hide-drag");
        },

        enableDragHandle: function ($elem) {
            console.log("enabling " + $elem.data("rexbuilder-block-id") + " drag handle");
            //$elem.children(".rexlive-block-drag-handle").removeClass("hide-drag");
        },

        unFocusElementEditing: function ($elem) {
            this.hideBlockToolBox($elem);
            $elem.removeClass('focused');
        },

        focusElement: function ($elem) {
            this.showBlockToolBox($elem);
            $elem.addClass('focused');
            $elem.parent().addClass('focused');
            $elem.parent().parent().addClass('focused');
            $elem.parent().parent().parent().addClass('focused');
            $elem.parent().parent().parent().parent().addClass('focused');
        },

        unFocusElement: function ($elem) {
            this.hideBlockToolBox($elem);
            $elem.removeClass('focused');
            $elem.parent().removeClass('focused');
            $elem.parent().parent().removeClass('focused');
            $elem.parent().parent().parent().removeClass('focused');
            $elem.parent().parent().parent().parent().removeClass('focused');
        },

        frontEndMode: function () {
            //          var gridstack = this.properties.gridstackInstance;
            //            gridstack.disable();
            console.log('griglia disabilitata');
        },

        editorMode: function () {
            var gridstack = this.properties.gridstackInstance;
            gridstack.enable();
            // this.properties.mediumEditorIstance.setup();
            console.log('griglia abilitata');
        },

        _updateElementsSizeViewers: function () {
            var gallery = this;
            this.$element.children(".grid-stack-item").each(function () {
                gallery.updateSizeViewerSizes($(this));
            });
        },

        updateSizeViewerText: function ($elem, x, y) {
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

        updateSizeViewerSizes: function ($block) {
            this.updateSizeViewerText($block,
                Math.round($block.outerWidth() / this.properties.singleWidth),
                this.calculateHeightSizeViewer($block));
        },

        calculateHeightSizeViewer: function ($block) {
            if (this.settings.galleryLayout == 'masonry') {
                return $block.outerHeight();
            } else {
                return Math.round($block.outerHeight() / this.properties.singleHeight);
            }
        },

        _linkResizeEvents: function () {
            var gallery = this;
            var block, xStart, wStart, xView, yView;
            var $block;
            var imageWidth;
            var $blockContent;
            var $uiElement;
            gallery.$element.on('resizestart', function (event, ui) {
                $uiElement = $(ui.element);
                if (!$uiElement.is('span')) {
                    if (Rexbuilder_Util_Editor.editingElement) {
                        Rexbuilder_Util_Editor.endEditingElement();
                    }
                    gallery.properties.resizeHandle = $(event.toElement).attr('data-axis');
                    block = event.target;
                    $block = $(block);
                    $blockContent = $block.find('.grid-item-content');
                    imageWidth = $blockContent.attr('data-background-image-width');
                    Rexbuilder_Util_Editor.elementIsResizing = true;
                    xStart = parseInt(block['attributes']['data-gs-x'].value);
                    if (gallery.properties.resizeHandle == 'e' || gallery.properties.resizeHandle == 'se') {
                        $block.attr("data-gs-max-width", (gallery.settings.numberCol - xStart));
                    } else if (gallery.properties.resizeHandle == 'w' || gallery.properties.resizeHandle == 'sw') {
                        wStart = parseInt(block['attributes']['data-gs-width'].value);
                        // $('#' + block.id).attr("data-gs-max-width", (xStart +
                        // wStart));
                    }
                }
            }).on('resize', function (event, ui) {
                if (!$uiElement.is('span')) {
                    if ($block.outerWidth() < imageWidth) {
                        if (!$blockContent.hasClass('small-width')) {
                            $blockContent.addClass('small-width');
                        }
                    } else {
                        $blockContent.removeClass('small-width');
                    }

                    gallery.updateSizeViewerSizes($block);

                    /* if (!$block.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        gallery.fixElementTextSize(block, gallery.properties.resizeHandle, null);
                    } */
                    /*
           * if (gallery.properties.resizeHandle == 'w' ||
           * gallery.properties.resizeHandle == 'sw') { ; }
           */
                }
            }).on('gsresizestop', function (event, elem) {
                if (Rexbuilder_Util_Editor.elementIsResizing) {
                    gallery.updateSizeViewerText($block);
                    if (gallery.settings.galleryLayout == 'masonry') {
                        $block.attr("data-height", Math.round(($block.attr("data-gs-height")) / gallery.properties.singleWidth));
                    }
                    $block.children(".rexbuilder-block-data").attr("data-rexlive-edited", "true");
                    gallery.updateAllElementsProperties();
                    if (!$block.hasClass('block-has-slider') && !$blockContent.hasClass('block-has-slider') && !$blockContent.hasClass('youtube-player')) {
                        gallery.fixElementTextSize(block, gallery.properties.resizeHandle, null);
                    }
                    Rexbuilder_Util_Editor.elementIsResizing = false;
                    Rexbuilder_Util_Editor.elementIsDragging = false;
                    gallery.$element.attr("data-rexlive-layout-changed=\"true\"");
                }
            });
        },

        _linkDragEvents: function () {
            // eventi per il drag
            var gallery = this;
            this.$element.on('dragstart', function (event, ui) {
                Rexbuilder_Util_Editor.elementIsDragging = true;
                ui.helper.eq(0).find(".text-wrap").blur();
                if (Rexbuilder_Util_Editor.editingElement) {
                    Rexbuilder_Util_Editor.endEditingElement();
                }
                console.log('drag start');
            }).on('drag', function (event, ui) {
                // console.log('dragging');
            }).on('dragstop', function (event, ui) {
                console.log('drag end');
                gallery.updateAllElementsProperties();
                Rexbuilder_Util_Editor.elementIsDragging = false;
            })
        },

        _launchGridStack: function () {

            var gallery = this;
            console.log("----------------------------------------------------------");
            console.log("BEFORE GRIDSTACK");
            console.log("----------------------------------------------------------");
            this.$element.children(".grid-stack-item").each(function (i, elem) {
                $elem = $(this);
                console.log(parseInt($elem.attr("data-gs-x")), parseInt($elem.attr("data-gs-y")), parseInt($elem.attr("data-gs-width")), parseInt($elem.attr("data-gs-height")));
            });

            if (Rexbuilder_Util.editorMode) {
                var floating;
                if (gallery.settings.galleryLayout == 'masonry') {
                    floating = false;
                } else {
                    floating = true;
                }
                console.log("launching gridstack backend");

                gallery.$element.gridstack({
                    auto: true,
                    animate: true,
                    acceptWidgets: false,
                    alwaysShowResizeHandle: true,
                    disableOneColumnMode: true,
                    cellHeight: gallery.properties.singleHeight,
                    draggable: {
                        containment: gallery.element,
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

                gallery.$element.addClass('gridActive');
            } else {
                console.log("launching gridstack frontend");
                gallery.$element.gridstack({
                    auto: true,
                    disableOneColumnMode: true,
                    cellHeight: gallery.properties.singleHeight,
                    disableDrag: true,
                    disableResize: true,
                    float: false,
                    verticalMargin: 0,
                    staticGrid: true,
                    width: gallery.settings.numberCol
                });
            }

            this.setGridstackIstanceNumber();
            this.properties.gridstackInstance = this.$element.data("gridstack");
            var $elem;

            /*             this.$element.children(".grid-stack-item").each(function (i, elem) {
                            $elem = $(this);
                            console.log(parseInt($elem.attr("data-gs-x")), parseInt($elem.attr("data-gs-y")), parseInt($elem.attr("data-gs-width")), parseInt($elem.attr("data-gs-height")));
                        }); */

            /* Rimozione elementi da nascondere
            var gridstack = this.properties.gridstackInstance;

            this.$element.children(".grid-stack-item").each(function () {
                if ($(this).hasClass("rex-hide-element-live")) {
                    gridstack.removeWidget(this, false);
                }
            }); */

            this.updateBlocksHeight();
        },

        setGridstackIstanceNumber: function () {
            var gallery = this;
            var classList = this.$element.attr('class').split(/\s+/);
            var classNameParts;

            $.each(classList, function (index, item) {
                classNameParts = item.split('-');
                if (classNameParts[2] != undefined && classNameParts[2] == 'instance') {
                    gallery.properties.gridstackInstanceID = classNameParts[3];
                }
            });
        },

        updateBlocksHeight: function () {
            var gallery = this;
            var $elem;
            var $elemData;
            var gridstack = this.properties.gridstackInstance;
            if (typeof gridstack !== "null") {
                console.log("GRIDSTACK ACTIVE");
                this.properties.blocksBottomTop = this.getElementBottomTop();

                if (!this.properties.updatingSectionSameGrid) {
                    console.log("----------------------------------------------------------");
                    console.log("UPDATING HEIGHTS");
                    console.log("----------------------------------------------------------");
                    this.$element.children(".grid-stack-item").each(function (i, elem) {
                        $elem = $(this);
                        console.log(parseInt($elem.attr("data-gs-x")), parseInt($elem.attr("data-gs-y")), parseInt($elem.attr("data-gs-width")), parseInt($elem.attr("data-gs-height")));
                    });
                    gridstack.batchUpdate();
                    $(this.properties.blocksBottomTop).each(function (i, e) {
                        $elem = $(this);
                        $elemData = $elem.children(".rexbuilder-block-data");
                        if (((gallery.settings.galleryLayout == "masonry") && ($elemData.attr("data-block_has_scrollbar") != "true") && ($elemData.attr("data-block_live_edited") != "true")) || gallery.properties.updatingSection) {
                            gallery.updateElementHeight($elem);
                        }
                    });
                    gridstack.commit();
                }

            }
            console.log("UPDATING DATA BLOCK HEIGHT");
            //setTimeout(function () {
            this.$element.children(".grid-stack-item").each(function () {
                var $blockData = $(this).children(".rexbuilder-block-data");
                var newH = parseInt($(this).attr("data-gs-height"));
                gallery.updateElementDataHeightProperties($blockData, newH);
            });
            //}, 1000);
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
            var id = this.properties.sectionNumber + '-SectionTextEditor';
            if (Rexbuilder_Util.$rexContainer.children('.editable[id="' + id + '"]').length == 0) {
                $(divToolbar).attr({
                    'id': id,
                    'class': 'editable',
                    'style': 'display: none'
                });
                Rexbuilder_Util.$rexContainer.prepend(divToolbar);
            }

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
                    text: "Insert Text Here",
                    hideOnClick: true
                }
            });

            editor.subscribe('editableInput', function (e) {
                if ($('.medium-insert-images figure img, .mediumInsert figure img').length > 0) {
                    $('.medium-insert-images figure img, .mediumInsert figure img').each(function () {
                        var $imageTextWrap;
                        $imageTextWrap = $(this);
                        if (!$imageTextWrap.hasClass('image-text-wrap')) {
                            var $figura = $imageTextWrap.parents('figure');
                            var $textWrapper = $imageTextWrap.parents('.medium-insert-images');
                            console.log($figura);
                            $imageTextWrap.addClass('image-text-wrap');
                            $imageTextWrap.wrap('<span></span>');
                            var spanEl = $imageTextWrap.parent()[0];
                            var $spanEl = $(spanEl);
                            var $uiElement;
                            $spanEl.addClass('image-span-wrap');
                            if (!Rexbuilder_Util_Editor.sectionCopying) {
                                gallery._addHandles($spanEl, 'e, s, w, se, sw');
                            }
                            $spanEl.resizable({
                                // containment: $textWrapper[0],
                                handles: {
                                    'e': '.ui-resizable-e',
                                    's': '.ui-resizable-s',
                                    'w': '.ui-resizable-w',
                                    'se': '.ui-resizable-se',
                                    'sw': '.ui-resizable-sw'
                                },
                                start: function (event, ui) {
                                    $uiElement = $(ui.element);
                                    if ($uiElement.is('span')) {
                                        console.log('startResize image');
                                    }
                                },
                                resize: function (event, ui) {
                                    if ($uiElement.is('span')) {
                                        console.log('resizing image');
                                    }
                                },
                                stop: function (event, ui) {
                                    if ($uiElement.is('span')) {
                                        console.log($uiElement.innerWidth(), $uiElement.innerHeight());
                                        console.log('stopResize image');
                                    }
                                }
                            });
                        }
                    });
                }
                gallery.fixElementTextSize($(e.srcElement).parents(".grid-stack-item")[0], null, e);
            });

            gallery.$element.find('.rex-text-editable').each(function () {
                var $elem = $(this);
                if ($elem.find('.pswp-figure').length === 0 && $elem.find('.rex-slider-wrap').length === 0) {
                    gallery.addElementToTextEditor(editor, $elem.find(".text-wrap"));
                }
            });

            this.properties.mediumEditorIstance = editor;
        },

        destroyMediumEditor: function () {
            this.properties.mediumEditorIstance.destroy();
            this.$element.find(".medium-insert-buttons").remove();
        },

        _setParentGridPadding: function () {
            var $parent = this.$element.parent();
            console.log('setting parent padding');
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
                console.log('setting parent padding');
                this.properties.setDesktopPadding = true;
                if (this.$section.hasClass("rex-block-grid")) {
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
            if (this._viewport().width >= 768 && !this.properties.setDesktopPadding || (!this.properties.setDesktopPadding && !this.properties.setMobilePadding && this._check_parent_class("rex-block-grid"))) {
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

        updateElementHeight: function ($elem) {
            console.log("calculating " + $elem.attr("data-rexbuilder-block-id") + " height");
            if (Rexbuilder_Util.editorMode && !this.properties.oneColumModeActive) {
                Rexbuilder_Util_Editor.elementIsResizing = true;
            }
            var elem = $elem[0];
            var $blockData = $elem.children('.rexbuilder-block-data');
            var startH;
            if (this.properties.updatingSection) {
                if (this.settings.galleryLayout == "fixed" && this.properties.oldLayout == "masonry") {
                    startH = parseInt($blockData.attr("data-block_height_masonry"));
                    //console.log("masonry", startH);
                } else {
                    startH = parseInt($blockData.attr("data-block_height_fixed"));
                    //console.log("fixed", startH);
                }
            } else {
                startH = parseInt($blockData.attr("data-gs_start_h"));
            }
            var newH;
            var sw = this.properties.singleWidth;
            var gutter = this.properties.gutter;
            var $textWrap = $elem.find('.text-wrap');
            var $itemContent = $elem.find(".grid-item-content");
            var w = parseInt($elem.attr("data-width"));
            var backgroundHeight = 0;
            var defaultHeight = 0;
            var textHeight;

            if ($textWrap.length != 0) {
                textHeight = this.calculateTextWrapHeight($textWrap);
            } else {
                textHeight = 0;
            }
            console.log(textHeight);
            if (this.properties.oneColumModeActive) {
                w = 12;
            }

            if (textHeight == 0) {
                if ($itemContent.hasClass('full-image-background')) {
                    backgroundHeight = (parseInt($itemContent.attr('data-background_image_height')) * (w * sw)) / (parseInt($itemContent.attr('data-background_image_width')));
                } else if ($itemContent.hasClass('natural_image_background')) {
                    if ($itemContent.hasClass('small-width')) {
                        backgroundHeight = (parseInt($itemContent.attr('data-background_image_height')) * (w * sw)) / (parseInt($itemContent.attr('data-data-background_image_width'))) - gutter;
                    } else {
                        backgroundHeight = parseInt($itemContent.attr('data-background_image_height')) + gutter;
                    }
                }
                //console.log(this.properties.updatingSection);
                if (this.properties.updatingSection || (backgroundHeight == 0) || $itemContent.hasClass('youtube-player') || $itemContent.hasClass('empty-content') || $itemContent.hasClass('block-has-slider') || $elem.hasClass('block-has-slider')) {
                    if (this.properties.editedFromBackend && this.settings.galleryLayout == "masonry") {
                        console.log("backend + masonry");
                        defaultHeight = Math.round(sw * startH);
                    } else if ((this.properties.oldCellHeight != 0) && (this.properties.oldCellHeight != this.properties.singleHeight) && !this.properties.layoutChanged) {
                        //console.log("cellHeight changed");
                        //console.log(this.properties.oldCellHeight, this.properties.singleHeight);
                        //console.log(startH);
                        defaultHeight = startH * this.properties.oldCellHeight;
                        //console.log(defaultHeight);
                    } else {
                        defaultHeight = startH * this.properties.singleHeight;
                    }
                }
            } else {
                textHeight = textHeight + gutter;
            }

            //console.log(startH); 

            newH = Math.max(startH, backgroundHeight, defaultHeight, textHeight);
            if (this.properties.oneColumModeActive) {
                return newH;
            }
            console.log(startH, backgroundHeight, defaultHeight, textHeight);
            if (this.settings.galleryLayout == "fixed") {
                newH = Math.round(newH / this.properties.singleHeight);
            } else {
                newH = Math.ceil(newH / this.properties.singleHeight);
            }
            //console.log(newH);
            /*             if (this.properties.oldLayout == this.settings.galleryLayout) {
                            newH = startH;
                        } */

            console.log(newH);
            var gridstack = this.properties.gridstackInstance;
            if (gridstack !== undefined) {
                if ((this.properties.oldCellHeight != 0) && this.properties.oldCellHeight != this.properties.singleHeight && this.properties.oldLayout == "masonry") {
                    //console.log("old dimensions");
                    //console.log(parseInt($elem.attr("data-gs-x")), parseInt($elem.attr("data-gs-y")), parseInt($elem.attr("data-gs-width")), parseInt($elem.attr("data-gs-height")));
                    var x, y, w, h;
                    var elDim;
                    elDim = store.get(elem["attributes"]["data-rexbuilder-block-id"].value);
                    x = elDim.properties[0].x;
                    y = Math.round(parseInt(elDim.properties[1].y) * this.properties.oldCellHeight / this.properties.singleHeight);
                    w = w;
                    h = newH;
                    //console.log("new dimensions");
                    //console.log(x, y, w, h);
                    gridstack.update(elem, x, y, w, h);
                } else {
                    if ($blockData.attr("data-custom_layout") == "true" && !this.properties.updatingSection) {
                        newH = startH;
                        gridstack.resize(elem, w, newH);
                    } else if (startH != newH) {
                        gridstack.resize(elem, w, newH);
                    }
                }
            }


            if (Rexbuilder_Util.editorMode) {
                Rexbuilder_Util_Editor.elementIsResizing = false;
            }
        },

        //Da sistemare mettendo un unico return
        calculateTextWrapHeight: function ($textWrap) {
            console.log($textWrap.text().trim().length);
            if ($textWrap.hasClass("medium-editor-element")) {
                var textHeight = 0;
                var textCalculate = $textWrap.clone(false);
                textCalculate.children(".medium-insert-buttons").remove();
                if (textCalculate.text().trim().length != 0) {
                    if (($textWrap.hasClass("medium-editor-element") && !$textWrap.hasClass("medium-editor-placeholder")) || ($textWrap.parents(".pswp-item").length != 0)) {
                        textHeight = $textWrap.innerHeight();
                    }
                }
                return textHeight;
            } else {
                if ($textWrap.text().trim().length != 0) {
                    return $textWrap.innerHeight();
                } else {
                    return 0;
                }
            }
        },

        collapseElements: function () {
            console.log("collapsing element");
            this._saveBlocksPosition();
            this.fixBlockDomOrder();
            this.$element.addClass("grid-stack-one-column-mode");
            this.$section.attr("data-rex-collapse-grid", true);
            this.properties.oneColumModeActive = true;
            this.fixCollapsedHeights();
        },

        fixBlockDomOrder: function () {
            var orderedElements = this.getElementsTopBottom();
            var rexIDS = [];
            var nodes = [];
            var elem;
            var i, j;

            for (i = 0; i < orderedElements.length; i++) {
                var block = {
                    rexID: $(orderedElements[i]).attr("data-rexbuilder-block-id"),
                    added: false
                }
                rexIDS.push(block);
            }

            this.$element.children(".grid-stack-item").each(function () {
                var elemObj = {
                    rexID: $(this).attr("data-rexbuilder-block-id"),
                    element: $(this).detach()
                }
                nodes.push(elemObj);
            });

            for (i = 0; i < rexIDS.length; i++) {
                for (j = 0; j < nodes.length; j++) {
                    if (nodes[j].rexID == rexIDS[i].rexID) {
                        elem = nodes[j].element;
                        break;
                    }
                }
                this.$element.append(elem);
                nodes.splice(j, 1);
            }
        },

        fixCollapsedHeights: function () {
            var $elem;
            var h;
            var that = this;
            this.$element.children(".grid-stack-item").each(function () {
                $elem = $(this);
                h = that.updateElementHeight($elem);
                $elem.css("height", h + "px")
            });
        },

        /**
         * Removes One Column mode and restores default layout of elements
         */
        removeCollapseGrid: function () {
            console.log("remove Collapse");

            if (this.properties.oneColumModeActive) {
                var gallery = this;
                var $elem;
                var $elemData;
                var gridstack = this.properties.gridstackInstance;
                var elDim;

                //removing fixed height
                this.$element.children(".grid-stack-item").each(function () {
                    $(this).css("height", "");
                });

                gridstack.batchUpdate();
                this.$element.children(".grid-stack-item").each(function () {
                    $elem = $(this);
                    $elemData = $elem.children(".rexbuilder-block-data");
                    elDim = store.get($elem.attr("data-rexbuilder-block-id"));
                    gridstack.update(this, elDim.properties[0].x, elDim.properties[1].y, elDim.properties[2].w, elDim.properties[3].h);
                });
                this.$element.removeClass("grid-stack-one-column-mode");
                gridstack.commit();
                this.$element.children(".grid-stack-item").each(function () {
                    $elem = $(this);
                    $elemData = $elem.children(".rexbuilder-block-data");
                    elDim = store.get($elem.attr("data-rexbuilder-block-id"));
                    gallery.updateElementDataHeightProperties($elemData, elDim.properties[3].h);
                });
            }
            this.$section.attr("data-rex-collapse-grid", false);
            this.$element.removeClass("grid-stack-one-column-mode");
            this.properties.oneColumModeActive = false;
        },

        destroyGridGallery: function () {
            this.destroyGridstack();
            this.removeScrollbars();
            // DA SISTEMARE LA DISTRUZIONE DEL PLUGIN
            //this.destroyMediumEditor();
            this.clearStateGrid();
            this.$element.removeClass('grid-number-' + this.properties.sectionNumber);
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
