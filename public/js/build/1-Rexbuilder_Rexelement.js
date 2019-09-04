var Rexbuilder_Rexelement = (function ($) {
	"use strict";

    var styleSheet;
    var elementsInPage;
    var defaultElementValues;

    /////////////////////////////////////////////////////////////////////
    /// CSS RULES EDITING
    /////////////////////////////////////////////////////////////////////
    
    // da capire bene a cosa serva, forse per il salvataggio nel db?
    // ok per Rexelement
    var _fixCustomStyleElement = function () {
        if (Rexbuilder_Rexelement.$rexelementsStyle.length == 0) {
            var css = "",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            style.id = "rexpansive-builder-rexelement-style-inline-css";
            style.dataset.rexName = "rexelements-style";
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].ownerNode.id == "rexpansive-builder-rexelement-style-inline-css") {
                styleSheet = document.styleSheets[i];
            }
        }
    };

    var _getActiveStyleSheet = function () {
        return styleSheet;
    };

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Adding rules
    
    // Cosa applico al container?
    var _addElementContainerRule = function (elementID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container{" + property + "}", styleSheet.cssRules.length);
        }
    }

    // Serve l'hover?
    var _addElementContainerHoverRule = function (elementID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container:hover{" + property + "}", styleSheet.cssRules.length);
        }

        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container:hover{" + property + "}", styleSheet.cssRules.length);
        }
    }

    // //////////////////////////////////////////////////////////////////////////////////////////////
    // // Updating rules

    // Cosa applico al container?
    var _updateElementContainerRule = function (elementID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id='" + elementID + "'].rex-element-wrapper .rex-element-container"
            ) {

                switch (rule) {
                    case "font-size":
                        styleSheet.cssRules[i].style.fontSize = value;
                        break;
                    case "color":
                        styleSheet.cssRules[i].style.color = value;
                        break;
                    case "min-height":
                        styleSheet.cssRules[i].style.minHeight = value;
                        break;
                    case "min-width":
                        styleSheet.cssRules[i].style.minWidth = value;
                        break;
                    case "margin-top":
                        styleSheet.cssRules[i].style.marginTop = value;
                        break;
                    case "margin-bottom":
                        styleSheet.cssRules[i].style.marginBottom = value;
                        break;
                    case "margin-left":
                        styleSheet.cssRules[i].style.marginLeft = value;
                        break;
                    case "margin-right":
                        styleSheet.cssRules[i].style.marginRight = value;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
    }

    // Serve l'hover?
    var _updateElementContainerHoverRule = function (elementID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container:hover" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id='" + elementID + "'].rex-element-wrapper .rex-element-container:hover"
            ) {
                switch (rule) {
                    case "color":
                        styleSheet.cssRules[i].style.color = value;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // Removing rules

    // Cosa applico al container?
    var _removeElementContainerRule = function (elementID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    // Serve l'hover?
    var _removeElementContainerHoverRule = function (elementID, property) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container:hover") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    /////////////////////////////////////////////////////////////////////
    /// REXELEMENT FUNCTIONS
    /////////////////////////////////////////////////////////////////////

    /**
     * Fixes the dragged element in the DOM.
     * @param  data
     * @since x.x.x
     */
	var _fixImportedElement = function (data) {
        var $elementListContainer = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-element-wrapper");
        var elementID = $elementListContainer.attr("data-rex-element-id");
        var $elementsParagraph = $elementListContainer.parents(".rex-elements-paragraph").eq(0);
        var $textWrap = $elementListContainer.parents(".text-wrap").eq(0);
        var $gridGallery = $elementListContainer.parents(".grid-stack-row").eq(0);
        var $section = $elementListContainer.parents(".rexpansive_section").eq(0);
        var elementDimensionCalculated = jQuery.extend(true, {}, data.elementDimensions);//servono?

        // Removing element unnecessary data
        $elementListContainer.detach().appendTo($textWrap);
        // $gridGallery.find('.tool-button--edit-thumbnail').remove();
        // $gridGallery.find('.element-list__element--delete').remove();
        $gridGallery.find('.element-list-preview').remove();

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
                var $divContainer = $(document.createElement("div"));
                $divContainer.addClass("rex-element-container");
                $elementListContainer.append($divContainer);
                $divContainer.append($shortcodeTransformed);

                // Get the shortcode and insert it in a new block inside $elementListHTML
                var shortcode = response.data.shortcode;
                var $divShortcode = $(document.createElement("div"));
                $divShortcode.addClass("string-shortcode");
                $divShortcode.attr("shortcode", shortcode);
                $elementListContainer.prepend($divShortcode);

                switch (dropType) {
                    case "inside-block":
                        $elementListContainer.wrap("<p class=\"rex-elements-paragraph\"></p>");
                        _endFixingElementImported($elementListContainer);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-paragraph":
                        _endFixingElementImported($elementListContainer);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-row":
                        var ev = jQuery.Event("rexlive:insert_new_text_block");
                        ev.settings = {
                            data_to_send: {
                                $elementListContainer: $elementListContainer,
                                $section: $section,
                                addBlockElement: true,
                                mousePosition: data.mousePosition
                            }
                        };
                        Rexbuilder_Util.$document.trigger(ev);
                        break;
                    case "inside-new-row":
                            // @todo
                        break;
                    default:
                        break;
                }
            }
          },
          error: function(response) {}
        });
    };

    var _endFixingElementImported = function ($elementWrapper) {
        var elementID = $elementWrapper.attr("data-rex-element-id");
        var flagElementFound = false;
        $elementWrapper.attr("data-rex-element-number", 1);
        for (var i = 0; i < elementsInPage.length; i++) {
            if (elementsInPage[i].id == elementID) {
                elementsInPage[i].number += 1;
                $elementWrapper.attr("data-rex-element-number", elementsInPage[i].number);
                flagElementFound = true;
                break;
            }
        }
        if (!flagElementFound) {
            // _addElementStyle($elementWrapper);
            elementsInPage.push({
                id: elementID,
                number: 1
            });
        }
        // Vedere se e quando serve
        // _removeModelData($buttonWrapper);

        // Setting the block height
        var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
		var galleryData = $gridGallery.data();
        var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
        var $block = $elementWrapper.parents(".grid-stack-item");
        galleryEditorInstance.updateElementHeight($block);

        //removes medium editor placeholder if there
        var $textWrap = $elementWrapper.parents(".text-wrap");
        if ($textWrap.length != 0) {
            TextEditor.removePlaceholder($textWrap.eq(0));
        }

        // locking grid to prevent errors on focus right text node
        var $element = $textWrap.parents(".grid-stack-item");
        var $section = $element.parents(".rexpansive_section");
        Rexbuilder_Util.getGalleryInstance($section).focusElement($element);
    }

    var _updateElementListInPage = function () {
        var j;
        var flagElementFound = false;
        Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper").each(function (i, element) {
            var $elementWrapper = $(element);
            var elementID = $elementWrapper.attr("data-rex-element-id");
            var elementNumber = parseInt($elementWrapper.attr("data-rex-element-number"));
            flagElementFound = false;
            for (j = 0; j < elementsInPage.length; j++) {
                if (elementsInPage[j].id == elementID) {
                    flagElementFound = true;
                    break;
                }
            }
            flagElementFound = false;
            if (!flagElementFound) {
                elementsInPage.push({
                    id: elementID,
                    number: elementNumber
                });
                if ($elementWrapper.hasClass("rex-separate-element")) {
                    // We are not editing an element model, but a separate element
                    // _addElementStyle($elementWrapper);
                    console.log("separa");
                }
            }
            if (elementsInPage[j].number < elementNumber) {
                elementsInPage[j].number = elementNumber;
            }
        });
    }

    var _getElementsInPage = function () {
        return elementsInPage;
    }

    var _addElementStyle = function ($elementWrapper) {
        if ($elementWrapper.find(".rex-button-data").eq(0).length != 0) {
            var elementProperties = _generateElementData($elementWrapper, true);
            var elementID = elementProperties.elementInfo.elementTarget.element_id;
            _addCSSRules(elementID, elementProperties.elementInfo);
        }
    }

    /**
     * Generate element data from RexElement dom Element.
     * If getAllData is true, will get data from dom even if element is a model
     * 
     * The obtained object has 2 fields:
     * 
     * separateElement - true if element is separate, false if it is a model
     * 
     * elementInfo - properties of the element
     * 
     * @param {*} $elementContainer dom element container (with class "rex-element-wrapper")
     * @param {Boolean} getAllData flag to generate all data
     * @returns {Object} data
     */
    var _generateElementData = function ($elementContainer, getAllData) {
        getAllData = typeof getAllData === "undefined" ? false : getAllData.toString() == "true";
        var elementProperties = {
            // Da aggiornare
            // text_color: "",
            // text: "",
            // font_size: "",
            background_color: "",
            // button_height: "",
            // button_width: "",
            // hover_color: "",
            // hover_border: "",
            // hover_text: "",
            // border_color: "",
            // border_width: "",
            // border_radius: "",
            // margin_top: "",
            // margin_bottom: "",
            // margin_right: "",
            // margin_left: "",
            // padding_top: "",
            // padding_bottom: "",
            // padding_right: "",
            // padding_left: "",
            // link_target: "",
            // link_type: "",
            elementTarget: {
                element_name: "",
                element_id: "",
                element_number: "",
            }
        };

        var $elementData = $elementContainer.find(".rex-element-data").eq(0);
        elementProperties.elementTarget.element_id = $elementContainer.attr("data-rex-element-id");
        elementProperties.elementTarget.element_number = parseInt($elementContainer.attr("data-rex-element-number"));
        var elementDataEl = $elementData[0];
        var separate = false;

        // Da aggiornare quando si sapranno le proprietà

        if ($buttonContainer.hasClass("rex-separate-button") || getAllData) {
            // elementProperties.font_size = (elementDataEl.getAttribute("data-text-size") ? elementDataEl.getAttribute("data-text-size").toString() : '');
            // elementProperties.text_color = (elementDataEl.getAttribute("data-text-color") ? elementDataEl.getAttribute("data-text-color").toString() : '');
            // elementProperties.button_height = (elementDataEl.getAttribute("data-button-height") ? elementDataEl.getAttribute("data-button-height").toString() : '');
            // elementProperties.button_width = (elementDataEl.getAttribute("data-button-width") ? elementDataEl.getAttribute("data-button-width").toString() : '');
            // elementProperties.margin_top = (elementDataEl.getAttribute("data-margin-top") ? elementDataEl.getAttribute("data-margin-top").toString() : '');
            // elementProperties.margin_bottom = (elementDataEl.getAttribute("data-margin-bottom") ? elementDataEl.getAttribute("data-margin-bottom").toString() : '');
            // elementProperties.margin_right = (elementDataEl.getAttribute("data-margin-right") ? elementDataEl.getAttribute("data-margin-right").toString() : '');
            // elementProperties.margin_left = (elementDataEl.getAttribute("data-margin-left") ? elementDataEl.getAttribute("data-margin-left").toString() : '');

            // elementProperties.border_color = (elementDataEl.getAttribute("data-border-color") ? elementDataEl.getAttribute("data-border-color").toString() : '');
            // elementProperties.border_width = (elementDataEl.getAttribute("data-border-width") ? elementDataEl.getAttribute("data-border-width").toString() : '');
            // elementProperties.border_radius = (elementDataEl.getAttribute("data-border-radius") ? elementDataEl.getAttribute("data-border-radius").toString() : '');
            elementProperties.background_color = (elementDataEl.getAttribute("data-background-color") ? elementDataEl.getAttribute("data-background-color").toString() : '');

            // elementProperties.padding_top = (elementDataEl.getAttribute("data-padding-top") ? elementDataEl.getAttribute("data-padding-top").toString() : '');
            // elementProperties.padding_bottom = (elementDataEl.getAttribute("data-padding-bottom") ? elementDataEl.getAttribute("data-padding-bottom").toString() : '');
            // elementProperties.padding_right = (elementDataEl.getAttribute("data-padding-right") ? elementDataEl.getAttribute("data-padding-right").toString() : '');
            // elementProperties.padding_left = (elementDataEl.getAttribute("data-padding-left") ? elementDataEl.getAttribute("data-padding-left").toString() : '');

            // elementProperties.hover_color = (elementDataEl.getAttribute("data-background-color-hover") ? elementDataEl.getAttribute("data-background-color-hover").toString() : '');
            // elementProperties.hover_border = (elementDataEl.getAttribute("data-border-color-hover") ? elementDataEl.getAttribute("data-border-color-hover").toString() : '');
            // elementProperties.hover_text = (elementDataEl.getAttribute("data-text-color-hover") ? elementDataEl.getAttribute("data-text-color-hover").toString() : '');

            // elementProperties.buttonTarget.button_name = (elementDataEl.getAttribute("data-button-name") ? elementDataEl.getAttribute("data-button-name").toString() : '');
            separate = true;
        } else {
            elementProperties.synchronize = typeof $buttonData.attr("data-synchronize") == "undefined" ? false : $buttonData.attr("data-synchronize").toString();
        }
        // elementProperties.text = $buttonContainer.find(".rex-button-text").eq(0).text();
        // elementProperties.link_target = $elementData.attr("data-link-target");
        // elementProperties.link_type = $elementData.attr("data-link-type");

        var data = {
            separateElement: separate,
            elementInfo: elementProperties
        }
        return data;
    }

    // Da aggiornare quando si sapranno le proprietà
    var _addCSSRules = function (elementID, elementProperties) {
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        var containerRule = "";
        // containerRule += "color: " + elementProperties.text_color + ";";

        // checking font size, if value is not valid default font size will be applied
        // currentTextSize = isNaN(parseInt(elementProperties.font_size.replace("px", ""))) ? defaultButtonValues.font_size : elementProperties.font_size;
        // containerRule += "font-size: " + currentTextSize + ";";

        // checking button dimensions, if value is not valid default dimensions will be applied
        // currentDimension = isNaN(parseInt(elementProperties.button_height.replace("px", ""))) ? defaultButtonValues.dimensions.height : elementProperties.button_height;
        // containerRule += "min-height: " + currentDimension + ";";
        // currentDimension = isNaN(parseInt(elementProperties.button_width.replace("px", ""))) ? defaultButtonValues.dimensions.width : elementProperties.button_width;
        // containerRule += "min-width: " + currentDimension + ";";

        // checking margins, if they are not valid default value will be applied
        // currentMargin = isNaN(parseInt(elementProperties.margin_top.replace("px", ""))) ? defaultButtonValues.margins.top : elementProperties.margin_top;
        // containerRule += "margin-top: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(elementProperties.margin_right.replace("px", ""))) ? defaultButtonValues.margins.right : elementProperties.margin_right;
        // containerRule += "margin-right: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(elementProperties.margin_bottom.replace("px", ""))) ? defaultButtonValues.margins.bottom : elementProperties.margin_bottom;
        // containerRule += "margin-bottom: " + currentMargin + ";";
        // currentMargin = isNaN(parseInt(elementProperties.margin_left.replace("px", ""))) ? defaultButtonValues.margins.left : elementProperties.margin_left;
        // containerRule += "margin-left: " + currentMargin + ";";

        // _addElementContainerRule(elementID, containerRule);

        var backgroundRule = "";
        // backgroundRule += "border-color: " + elementProperties.border_color + ";";
        // backgroundRule += "border-style: " + "solid" + ";";

        // checking border dimensions, if they are not valid default value will be applied
        // currentBorderDimension = isNaN(parseInt(elementProperties.border_width.replace("px", ""))) ? defaultButtonValues.border.width : elementProperties.border_width;
        // backgroundRule += "border-width: " + currentBorderDimension + ";";
        // currentBorderDimension = isNaN(parseInt(elementProperties.border_radius.replace("px", ""))) ? defaultButtonValues.border.radius : elementProperties.border_radius;
        // backgroundRule += "border-radius: " + currentBorderDimension + ";";

        backgroundRule += "background-color: " + elementProperties.background_color + ";";
        _addElementContainerRule(elementID, backgroundRule);
        // _addElementBackgroundRule(elementID, backgroundRule);

        var textRule = "";

        // checking paddings, if they are not valid default value will be applied
        // currentPadding = isNaN(parseInt(elementProperties.padding_top.replace("px", ""))) ? defaultButtonValues.paddings.top : elementProperties.padding_top;
        // textRule += "padding-top: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(elementProperties.padding_right.replace("px", ""))) ? defaultButtonValues.paddings.right : elementProperties.padding_right;
        // textRule += "padding-right: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(elementProperties.padding_bottom.replace("px", ""))) ? defaultButtonValues.paddings.bottom : elementProperties.padding_bottom;
        // textRule += "padding-bottom: " + currentPadding + ";";
        // currentPadding = isNaN(parseInt(elementProperties.padding_left.replace("px", ""))) ? defaultButtonValues.paddings.left : elementProperties.padding_left;
        // textRule += "padding-left: " + currentPadding + ";";
        // _addElementTextRule(elementID, textRule);

        var backgroundHoverRule = "";
        // backgroundHoverRule += "background-color: " + elementProperties.hover_color + ";";
        // backgroundHoverRule += "border-color: " + elementProperties.hover_border + ";";
        // _addElementBackgroundHoverRule(elementID, backgroundHoverRule);

        var containerHoverRule = "";
        // containerHoverRule += "color: " + elementProperties.hover_text + ";";
        // _addElementContainerHoverRule(elementID, containerHoverRule);
    }

    var _removeElementStyle = function (elementID) {
        // _removeElementContainerRule(elementID);
        // _removeElementBackgroundRule(elementID);
        // _removeElementBackgroundHoverRule(elementID);
        // _removeElementTextRule(elementID);
        // _removeElementContainerHoverRule(elementID);
    }

    var _lockSynchronize = function (data) {
        var elementID = data.elementTarget.element_id;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"][data-rex-element-number=\"" + data.elementTarget.element_number + "\"]");
        $elementWrapper.find(".rex-element-data").attr("data-synchronize", true);
    }

    var _linkDocumentListeners = function () {
	    Rexbuilder_Util.$document.on("rexlive:completeImportElement", function (e) {
	        var data = e.settings;
	        var $newDOMElement = data.$elementAdded;
	        var $elementListContainer = data.$elementListContainer;
	        $elementListContainer.detach().prependTo($newDOMElement.find(".text-wrap").eq(0));
	        $elementListContainer.wrap("<p class=\"rex-elements-paragraph\"></p>");
	        _endFixingElementImported($elementListContainer);
	    });
    }

	var init = function() {
        styleSheet = null;
        elementsInPage = [];
        // Qua ci andranno i valori di default degli stili che verranno scelti
        defaultElementValues = {
            // Prova
            input: {
                text: {
                    background_color: "#c935bd",
                }
            }
        };
        this.$rexelementsStyle = $("#rexpansive-builder-rexelement-style-inline-css");

        _fixCustomStyleElement();
        _updateElementListInPage();
		_linkDocumentListeners();
	}

	return {
		init: init,

        // Rexelement functions
		fixImportedElement: _fixImportedElement,
        getElementsInPage: _getElementsInPage,
        lockSynchronize: _lockSynchronize,

        // CSS Rules Editing
        updateElementContainerRule: _updateElementContainerRule,
        updateElementContainerHoverRule: _updateElementContainerHoverRule
	}
})(jQuery);