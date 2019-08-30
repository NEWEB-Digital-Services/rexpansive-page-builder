var Rexbuilder_Rexelement = (function ($) {
	"use strict";

    /////////////////////////////////////////////////////////////////////
    /// REXELEMENT FUNCTIONS
    /////////////////////////////////////////////////////////////////////

    /**
     * Fixes the dragged element in the DOM.
     * @param  data
     * @since x.x.x
     */
	var _fixImportedElement = function (data) {
        var $elementListData = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .element-list__data");

        $elementListData.unwrap();

        var elementID = $elementListData.attr("data-rex-element-id");
        var $elementsParagraph = $elementListData.parents(".rex-elements-paragraph").eq(0);
        var $textWrap = $elementListData.parents(".text-wrap").eq(0);
        var $gridGallery = $elementListData.parents(".grid-stack-row").eq(0);
        var $section = $elementListData.parents(".rexpansive_section").eq(0);
        var elementDimensionCalculated = jQuery.extend(true, {}, data.elementDimensions);

        // fix delete element bring back
        // $gridGallery.find('.tool-button--edit-thumbnail').remove();
        // $gridGallery.find('.element-list__element--delete').remove();
        $gridGallery.find('.element-list-preview').remove();

        // var $buttonData = $elementListData.find(".rex-button-data").eq(0);
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
        
        // Valori random. Servono?
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

        // Ajax call to get the html of the element
        $.ajax({
          type: "POST",
          dataType: "json",
          url: _plugin_frontend_settings.rexajax.ajaxurl,
          data: {
            action: "rex_transform_shortcode",
            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
            elementID: elementID
          },
          success: function(response) {
            if (response.success) {
                // If success get the element HTML and append it to the right div
                var $shortcodeTransformed = $.parseHTML(response.data.shortcode_transformed);
                $elementListData.append($shortcodeTransformed);

                switch (dropType) {
                    case "inside-block":
                        $elementListData.wrap("<p class=\"rex-elements-paragraph\"></p>");
                        _endFixingElementImported($elementListData);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-paragraph":
                        _endFixingElementImported($elementListData);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-row":
                        var ev = jQuery.Event("rexlive:insert_new_text_block");
                        ev.settings = {
                            data_to_send: {
                                $elementListData: $elementListData,
                                $section: $section,
                                addBlockElement: true,
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
          },
          error: function(response) {
            // console.log(response);
          }
        });
    }

    var _endFixingElementImported = function ($elementListData) {
        // var buttonID = $buttonWrapper.attr("data-rex-button-id");
        // var flagButtonFound = false;
        // $elementListData.attr("data-rex-button-number", 1);
        // for (var i = 0; i < buttonsInPage.length; i++) {
        //     if (buttonsInPage[i].id == buttonID) {
        //         buttonsInPage[i].number += 1;
        //         $buttonWrapper.attr("data-rex-button-number", buttonsInPage[i].number);
        //         flagButtonFound = true;
        //         break;
        //     }
        // }
        // if (!flagButtonFound) {
        //     _addButtonStyle($elementListData);
        //     buttonsInPage.push({
        //         id: buttonID,
        //         number: 1
        //     });
        // }
        // _removeModelData($buttonWrapper);//non dovrebbe servire

        //removes medium editor placeholder if there
        var $textWrap = $elementListData.parents(".text-wrap");
        if ($textWrap.length != 0) {
            TextEditor.removePlaceholder($textWrap.eq(0));
        }

        // locking grid to prevent errors on focus right text node
        var $element = $textWrap.parents(".grid-stack-item");
        var $section = $element.parents(".rexpansive_section");
        Rexbuilder_Util.getGalleryInstance($section).focusElement($element);
    }

    var _linkDocumentListeners = function () {
	    Rexbuilder_Util.$document.on("rexlive:completeImportElement", function (e) {
	        var data = e.settings;
	        var $newElement = data.$elementAdded;
	        var $elementListData = data.$elementListData;
	        $elementListData.detach().prependTo($newElement.find(".text-wrap").eq(0));
	        $elementListData.wrap("<p class=\"rex-elements-paragraph\"></p>");
	        _endFixingElementImported($elementListData);
	    });
    }

	var init = function() {
		_linkDocumentListeners();
	}

	return {
		init: init,
		fixImportedElement: _fixImportedElement
	}
})(jQuery);