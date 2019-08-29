var Rexbuilder_Rexelement = (function ($) {
	"use strict";

	var _fixImportedElement = function (data) {
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".element-shortcode");
        
        console.log($elementWrapper);

        $elementWrapper.unwrap();

        var $elementsParagraph = $elementWrapper.parents(".rex-elements-paragraph").eq(0);
        var $textWrap = $elementWrapper.parents(".text-wrap").eq(0);
        var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
        var $section = $elementWrapper.parents(".rexpansive_section").eq(0);
        var elementDimensionCalculated = jQuery.extend(true, {}, data.elementDimensions);

        // fix delete button bring back
        $gridGallery.find('.element-list__element--edit-thumbnail').remove();
        $gridGallery.find('.element-list__element--reset-thumbnail').remove();
        $gridGallery.find('.element-list__element--delete').remove();

        // var $buttonData = $elementWrapper.find(".rex-button-data").eq(0);
        // var margins = {
        //     top: parseInt($buttonData.attr("data-margin-top").replace("px", "")),
        //     bottom: parseInt($buttonData.attr("data-margin-bottom").replace("px", "")),
        //     left: parseInt($buttonData.attr("data-margin-left").replace("px", "")),
        //     right: parseInt($buttonData.attr("data-margin-right").replace("px", "")),
        // }
        // margins.top = isNaN(margins.top) ? 0 : margins.top;
        // margins.bottom = isNaN(margins.bottom) ? 0 : margins.bottom;
        // margins.left = isNaN(margins.left) ? 0 : margins.left;
        // margins.right = isNaN(margins.right) ? 0 : margins.right;

        // var paddings = {
        //     top: parseInt($buttonData.attr("data-padding-top").replace("px", "")),
        //     bottom: parseInt($buttonData.attr("data-padding-bottom").replace("px", "")),
        //     left: parseInt($buttonData.attr("data-padding-left").replace("px", "")),
        //     right: parseInt($buttonData.attr("data-padding-right").replace("px", "")),
        // }
        // paddings.top = isNaN(paddings.top) ? 0 : paddings.top;
        // paddings.bottom = isNaN(paddings.bottom) ? 0 : paddings.bottom;
        // paddings.left = isNaN(paddings.left) ? 0 : paddings.left;
        // paddings.right = isNaN(paddings.right) ? 0 : paddings.right;

        // elementDimensionCalculated.height =
        //     elementDimensionCalculated.height + margins.top + margins.bottom + paddings.top + paddings.bottom;
        // elementDimensionCalculated.width =
        //     elementDimensionCalculated.width + margins.left + margins.right + paddings.left + paddings.right;
        
        elementDimensionCalculated.height = "100px";
        elementDimensionCalculated.width = "50px";

        var dropType;
        if ($textWrap.length == 0) {
            if ($gridGallery.length != 0) {
                dropType = "inside-row";
            } else {
                dropType = "inside-new-row";
            }
        } else if ($elementsParagraph.length != 0) {
            dropType = "inside-paragraph";
        } else {
            dropType = "inside-block";
        }

        switch (dropType) {
            case "inside-block":
                $elementWrapper.wrap("<p class=\"rex-elements-paragraph\"></p>");
                _endFixingButtonImported($elementWrapper);
                Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                break;
            case "inside-paragraph":
                _endFixingButtonImported($elementWrapper);
                Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                break;
            case "inside-row":
                var ev = jQuery.Event("rexlive:insert_new_text_block");
                ev.settings = {
                    data_to_send: {
                        $elementWrapper: $elementWrapper,
                        $section: $section,
                        addBlockButton: true,
                        mousePosition: data.mousePosition,
                        blockDimensions: {
                            w: elementDimensionCalculated.width,
                            h: elementDimensionCalculated.height
                        }
                    }
                };
                Rexbuilder_Util.$document.trigger(ev);
                break;
            case "inside-new-row":
                	// @todo
                ;
                break;
            default:
                break;
        }
    }

    var _linkDocumentListeners = function () {

        Rexbuilder_Util.$document.on("rexlive:completeImportElement", function (e) {
            var data = e.settings;
            var $newElement = data.$blockAdded;
            var $elements = data.$elements;
            $buttonWrapper.detach().prependTo($newElement.find(".text-wrap").eq(0));
            $buttonWrapper.wrap("<p class=\"rex-elements-paragraph\"></p>");
            _endFixingButtonImported($buttonWrapper);
        });
    }

	var _init = function() {}

	return {
		init: _init,
		fixImportedElement: _fixImportedElement
	}
})(jQuery);