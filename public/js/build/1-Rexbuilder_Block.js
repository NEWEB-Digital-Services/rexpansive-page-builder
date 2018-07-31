var Rexbuilder_Block = (function ($) {
    'use strict';

    var _addBlockToolboxListeners = function () {

        $(document).on('click', '.builder-delete-block', function (e) {
            e.preventDefault();
            e.stopPropagation();
            Rexbuilder_Util_Editor.removingBlocks = true;
            var $elem = $(e.target).parents(".grid-stack-item");
            var gridGalleryInstance = $elem.parent().data().plugin_perfectGridGalleryEditor;
            gridGalleryInstance.deleteBlock($elem);
            Rexbuilder_Util_Editor.removingBlocks = false;
        });

        $(document).on("click", ".builder-edit-slider", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $elem = $(e.target).parents(".grid-stack-item");
            Rexbuilder_Util_Editor.sectionEditingObj = $elem.parents(".rexpansive_section");
            Rexbuilder_Util_Editor.textWrapElementEditingObj = $elem.find(".text-wrap").eq(0);
            var $sliderWrap = $elem.find(".rex-slider-wrap");
            if ($sliderWrap.length > 0) {

                Rexbuilder_Util_Editor.sliderEditingObj = $sliderWrap;

                var sliderID = $sliderWrap.attr("data-slider-id");
                var blockID = $elem.attr("id");
                var shortCodeSlider = '[RexSlider slider_id="' + sliderID + '"]';

                var data = {
                    eventName: "rexlive:editSlider",
                    sliderID: sliderID,
                    blockID: blockID,
                    shortCodeSlider: shortCodeSlider,
                }

                Rexbuilder_Util_Editor.sendParentIframeMessage(data);
            }
        });

        $(document).on('click', '.builder-copy-block', function (e) {
            e.preventDefault();
            e.stopPropagation();

            Rexbuilder_Util_Editor.blockCopying = true;
            var $elem = $(e.currentTarget).parents('.grid-stack-item');

            Rexbuilder_CreateBlocks.createCopyBlock($elem);
            Rexbuilder_Util_Editor.blockCopying = false;
        });
    }
    var init = function () {
        _addBlockToolboxListeners();
    }

    return {
        init: init
    }

})(jQuery);