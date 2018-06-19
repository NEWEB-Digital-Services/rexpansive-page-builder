
var Rexbuilder_Util_Editor = (function ($) {
    'use strict';

    var addBlockToolboxListeners = function () {

        $(document).on('click', '.builder-delete-block', function (e) {
            e.preventDefault();

            var $elem = $(e.currentTarget).parents('.grid-stack-item');
            var grid = $elem.parents('.grid-stack-row').data("gridstack");
            grid.removeWidget($elem, false);
            $elem.addClass("removing_block");
        });

        $(document).on('click', '.builder-copy-block', function (e) {
            e.preventDefault();

            var galleryEditorIstance = $(e.currentTarget).parents('.grid-stack-row').data().plugin_perfectGridGalleryEditor;

            Rexbuilder_Util_Editor.blockCopying = true;
            var $elem = $(e.currentTarget).parents('.grid-stack-item');
            var $newBlock;
            var $gallery = $elem.parents('.grid-stack-row');
            var $grid = $gallery.data("gridstack");
            var editor = galleryEditorIstance.properties.mediumEditorIstance;
            $newBlock = $elem.clone(false);

            $newBlock.appendTo($gallery.eq(0));

            var w = parseInt($newBlock.attr("data-gs-width"));
            var h = parseInt($newBlock.attr("data-gs-height"));

            Rexbuilder_Util_Editor.removeScrollBar($newBlock);
            Rexbuilder_Util_Editor.removeTextEditor($newBlock);

            galleryEditorIstance._prepareElement($newBlock.eq(0));

            $grid.addWidget($newBlock, 0, 0, w, h, true);
            var $textWrap = $newBlock.find(".text-wrap");
            var newBlock = $newBlock[0];

            galleryEditorIstance.fixElementTextSize(newBlock, null, null);

            if ($newBlock.find(".pswp-item").length == 0) {
                galleryEditorIstance.addElementToTextEditor(editor, $textWrap);
            }

            Rexbuilder_Util_Editor.blockCopying = false;
        });
    }

    var removeScrollBar = function ($elem) {
        var $elemContent = $elem.find(".grid-item-content");
        var $div = $(document.createElement("div"));
        var $divScrollbar = $elemContent.find(".rex-custom-scrollbar");
        var $textWrap = $elemContent.find('.text-wrap');

        $div.addClass("rex-custom-scrollbar");
        if ($elemContent.hasClass("rex-flexbox")) {
            $div.addClass("rex-custom-position");
        }
        $textWrap.detach().appendTo($div);
        $div.appendTo($divScrollbar.parent());
        $divScrollbar.remove();

        $elemContent = undefined;
        $div = undefined;
        $divScrollbar = undefined;
        $textWrap = undefined;
    }

    var removeTextEditor = function ($elem) {

        var $textWrap = $elem.find('.text-wrap');
        var textWrapContent;
        var $div;
        var css;

        if ($textWrap.length != 0) {
            textWrapContent = $textWrap.html();
            $div = $(document.createElement("div"));
            css = $textWrap.attr("style");
            $div.appendTo($textWrap.parent());
            $div.addClass("text-wrap");
            if ($textWrap.hasClass("rex-content-resizable")) {
                $div.addClass("rex-content-resizable");
            }
            $div.attr("style", css);
            $div.html(textWrapContent);
            $div.find(".text-editor-span-fix").eq(0).remove();
            $textWrap.remove();
        }

        $textWrap = undefined;
        textWrapContent = undefined;
        $div = undefined;
        css = undefined;
    }

    var removeDeletedBlocks = function ($gallery) {
        $gallery.children(".removing_block").each(function () {
            $(this).remove();
        });
    }

    var endEditingElement = function () {
        console.log("end editing element: " + Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id"));
        var galleryEditorIstance = Rexbuilder_Util_Editor.editedGallery;
        var gridstack = galleryEditorIstance.$element.data('gridstack');

        Rexbuilder_Util_Editor.elementIsDragging = false;
        Rexbuilder_Util_Editor.editedElement.blur();

        if (Rexbuilder_Util_Editor.activateElementFocus) {
            galleryEditorIstance._focusElement(Rexbuilder_Util_Editor.editedElement);
        } else {
            galleryEditorIstance._unFocusElement(Rexbuilder_Util_Editor.editedElement);
        }

        Rexbuilder_Util_Editor.editingGallery = false;
        Rexbuilder_Util_Editor.editedGallery = null;
        Rexbuilder_Util_Editor.editingElement = false;
        Rexbuilder_Util_Editor.editedElement = null;

        galleryEditorIstance.$element.addClass('gridActive');
        gridstack.enable();
    }

    var startEditingElement = function (event) {
        if (Rexbuilder_Util_Editor.editingElement && Rexbuilder_Util_Editor.editingGallery) {
            //event.preventDefault();
            //event.stopPropagation();
            var gallery = Rexbuilder_Util_Editor.editedGallery;
            var $elem = Rexbuilder_Util_Editor.editedElement;
            var gridstack = gallery.$element.data('gridstack');
            gridstack.disable();
            $(gallery.$element).removeClass('gridActive');

            console.log("focusing: " + $elem.data("rexbuilder-block-id"));

            gallery._unFocusElementEditing($elem);
            gallery.properties.elementStartingH = parseInt($elem.attr("data-gs-height"));

            var textWrap = $elem.find('.text-wrap')[0];
            //event.type = "click";
            //gallery.properties.mediumEditorIstance.trigger('focus', event, textWrap);

            /* if (!(textWrap.text().length) || textWrap.text() == '""') {
                $(textWrap)[0].focus();
            } */
            // $(textWrap.lastChild)[0].focus();
            /*
             * if()#mCSB_1_container > div > div $()[0].focus();
             */
        }
    }

    var addWindowListeners = function () {

        if (Rexbuilder_Util.editorMode) {
            Rexbuilder_Util.$window.click(function (e) {
                var $target = $(e.target);
                if (Rexbuilder_Util_Editor.editingElement && ($target.parents(".grid-stack-item").length == 0) && ($target.parents(".media-frame").length == 0) && !($target.hasClass("grid-stack-item"))) {
                    console.log(e);
                    console.log("CLICK OUTSIDE ELEMENTS");
                    Rexbuilder_Util_Editor.activateElementFocus = false;
                    Rexbuilder_Util_Editor.endEditingElement();
                    Rexbuilder_Util_Editor.activateElementFocus = true;
                }

            });

            Rexbuilder_Util.$window.on('keydown', function (event) {
                if (Rexbuilder_Util_Editor.editingGallery && event.keyCode == 27) {
                    Rexbuilder_Util_Editor.endEditingElement();
                }

            });

            Rexbuilder_Util.$window.on('mousedown', function (event) {

                console.log("mouse down window");

            });
        }
        Rexbuilder_Util.$window.on('resize', function (event) {
            Rexbuilder_Util.windowIsResizing = true;
            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                if (!Rexbuilder_Util_Editor.elementIsResizing) {
                    var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
                    var gridstack = galleryEditorIstance.$element.data('gridstack');
                    galleryEditorIstance._defineDynamicPrivateProperties();
                    if (galleryEditorIstance.settings.galleryLayout == 'masonry') {
                        // if there is masonry layout
                        galleryEditorIstance._calculateBlockHeightMasonry();
                        galleryEditorIstance.$element.children('.grid-stack-item').each(function () {
                            galleryEditorIstance.updateSizeViewerText(this);
                            galleryEditorIstance.fixElementTextSize(this, null, null);
                        });
                    } else {
                        gridstack.cellHeight(galleryEditorIstance.properties.singleHeight);
                        gridstack._initStyles();
                        gridstack._updateStyles(galleryEditorIstance.properties.singleHeight);
                        galleryEditorIstance.$element.children('.grid-stack-item').each(function () {
                            galleryEditorIstance.fixElementTextSize(this, null, null);
                        });
                    }
                    //G.properties.mediumEditorIstance.trigger("editableInput");
                }
            });
            Rexbuilder_Util.windowIsResizing = false;
        });

        Rexbuilder_Util.$window.on('load', function (e) {
            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
                galleryEditorIstance.updateGrid();
            });
        });
    }

    // init the utilities
    var init = function () {
        this.elementIsResizing = false;
        this.elementIsDragging = false;

        this.sectionCopying = false;
        this.blockCopying = false;

        this.editingGallery = false;
        this.editedGallery = null;

        this.editingElement = false;
        this.editedElement = null;

        this.activateElementFocus = false;

        this.mouseDownEvent = null;
        this.mouseUpEvent = null;
    }

    return {
        init: init,

        removeScrollBar: removeScrollBar,
        removeTextEditor: removeTextEditor,
        addBlockToolboxListeners: addBlockToolboxListeners,
        removeDeletedBlocks: removeDeletedBlocks,
        addWindowListeners: addWindowListeners,
        endEditingElement: endEditingElement,
        startEditingElement: startEditingElement,
    };

})(jQuery);