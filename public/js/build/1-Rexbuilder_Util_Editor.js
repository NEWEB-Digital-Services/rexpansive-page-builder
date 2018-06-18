
var Rexbuilder_Util_Editor = (function ($) {
    'use strict';

    var elementIsResizing;
    var elementIsDragging;
    var sectionCopying;
    var blockCopying;
    var editingElement;

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

            Rexbuilder_Util.blockCopying = true;
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

            Rexbuilder_Util.blockCopying = false;
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

    var removeDeletedBlocks = function($gallery){
        $gallery.children(".removing_block").each(function(){
            $(this).remove();
        });
    }

    // init the utilities
    var init = function () {
        elementIsResizing = false;
        elementIsDragging = false;
        sectionCopying = false;
        blockCopying = false;
        editingElement = null;
    }

    return {
        init: init,
        elementIsResizing: elementIsResizing,
        elementIsResizing: elementIsDragging,
        sectionCopying: sectionCopying,
        blockCopying: blockCopying,
        editingElement: editingElement,
        removeScrollBar: removeScrollBar,
        removeTextEditor: removeTextEditor,
        addBlockToolboxListeners: addBlockToolboxListeners,
        removeDeletedBlocks: removeDeletedBlocks
    };

})(jQuery);