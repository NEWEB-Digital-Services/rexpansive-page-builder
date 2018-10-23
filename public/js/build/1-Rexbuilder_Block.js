var Rexbuilder_Block = (function ($) {
    'use strict';

    var _addBlockToolboxListeners = function () {

        Rexbuilder_Util.$document.on('click', '.builder-delete-block', function (e) {
            e.preventDefault();
            e.stopPropagation();
            Rexbuilder_Util_Editor.removingBlocks = true;
            var $elem = $(e.target).parents(".grid-stack-item");
            var gridGalleryInstance = $elem.parent().data().plugin_perfectGridGalleryEditor;
            var $section = gridGalleryInstance.$section;
            gridGalleryInstance.deleteBlock($elem);
            $elem.attr("data-rexlive-element-edited", true);
            Rexbuilder_Util_Editor.removingBlocks = false;

            var data = {
                eventName: "rexlive:edited",
                modelEdited: $section.hasClass("rex-model-section"),
            }
            Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        });

        Rexbuilder_Util.$document.on("click", ".builder-edit-slider", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $elem = $(e.target).parents(".grid-stack-item");
            var $section = $elem.parents(".rexpansive_section");
            
            var rex_block_id = $elem.attr('data-rexbuilder-block-id');
			var sectionID = $section.attr("data-rexlive-section-id");
			var modelNumber = typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";
            
            var targetToEdit= {
                sectionID: sectionID,
                modelNumber: modelNumber,
                rexID: rex_block_id,
                sliderNumber: 0
            }

            var $sliderWrap = $elem.find(".rex-slider-wrap[data-rex-slider-active=\"true\"]");
            if ($sliderWrap.length > 0) {
                targetToEdit.sliderNumber = $sliderWrap.attr("data-rex-slider-number");
                
                var sliderID = $sliderWrap.attr("data-slider-id");
                var blockID = $elem.attr("id");
                var shortCodeSlider = '[RexSlider slider_id="' + sliderID + '"]';

                var data = {
                    eventName: "rexlive:editSlider",
                    sliderID: sliderID,
                    blockID: blockID,
                    shortCodeSlider: shortCodeSlider,
                    target: targetToEdit
                }

                Rexbuilder_Util_Editor.sendParentIframeMessage(data);
            }
        });

        Rexbuilder_Util.$document.on('click', '.builder-copy-block', function (e) {
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