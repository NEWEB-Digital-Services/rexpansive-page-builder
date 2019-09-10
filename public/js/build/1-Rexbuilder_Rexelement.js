var Rexbuilder_Rexelement = (function ($) {
	"use strict";

    var styleSheet;
    var elementsInPage;
    var defaultElementValues;

    /////////////////////////////////////////////////////////////////////
    /// CSS RULES EDITING
    /////////////////////////////////////////////////////////////////////
    
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

    var _addElementBackgroundRule = function (elementID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container{" + property + "}", styleSheet.cssRules.length);
            //rex-element-container cambiarlo?
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container{" + property + "}", styleSheet.cssRules.length);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Updating rules
    
    var _updateElementBackgroundRule = function (elementID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-element-id='" + elementID + "'].rex-element-wrapper .rex-element-container"
            ) {
                switch (rule) {
                    case "border-width":
                        styleSheet.cssRules[i].style.borderWidth = value;

                        styleSheet.cssRules[i].style.borderTopWidth = value;
                        styleSheet.cssRules[i].style.borderLeftWidth = value;
                        styleSheet.cssRules[i].style.borderRightWidth = value;
                        styleSheet.cssRules[i].style.borderBottomWidth = value;

                        styleSheet.cssRules[i].style.borderTop = value + " " + styleSheet.cssRules[i].style.borderTopStyle + " " + styleSheet.cssRules[i].style.borderTopColor;
                        styleSheet.cssRules[i].style.borderLeft = value + " " + styleSheet.cssRules[i].style.borderLeftStyle + " " + styleSheet.cssRules[i].style.borderLeftColor;
                        styleSheet.cssRules[i].style.borderRight = value + " " + styleSheet.cssRules[i].style.borderRightStyle + " " + styleSheet.cssRules[i].style.borderRightColor;
                        styleSheet.cssRules[i].style.borderBottom = value + " " + styleSheet.cssRules[i].style.borderBottomStyle + " " + styleSheet.cssRules[i].style.borderBottomColor;
                        break;
                    case "border-color":
                        styleSheet.cssRules[i].style.borderColor = value;

                        styleSheet.cssRules[i].style.borderTopColor = value;
                        styleSheet.cssRules[i].style.borderLeftColor = value;
                        styleSheet.cssRules[i].style.borderRightColor = value;
                        styleSheet.cssRules[i].style.borderBottomColor = value;

                        break;
                    case "border-style":
                        styleSheet.cssRules[i].style.borderStyle = value;

                        styleSheet.cssRules[i].style.borderTopStyle = value;
                        styleSheet.cssRules[i].style.borderLeftStyle = value;
                        styleSheet.cssRules[i].style.borderRightStyle = value;
                        styleSheet.cssRules[i].style.borderBottomStyle = value;

                        styleSheet.cssRules[i].style.borderTop = styleSheet.cssRules[i].style.borderTopWidth + " " + value + " " + styleSheet.cssRules[i].style.borderTopColor;
                        styleSheet.cssRules[i].style.borderLeft = styleSheet.cssRules[i].style.borderLeftWidth + " " + value + " " + styleSheet.cssRules[i].style.borderLeftColor;
                        styleSheet.cssRules[i].style.borderRight = styleSheet.cssRules[i].style.borderRightWidth + " " + value + " " + styleSheet.cssRules[i].style.borderRightColor;
                        styleSheet.cssRules[i].style.borderBottom = styleSheet.cssRules[i].style.borderBottomWidth + " " + value + " " + styleSheet.cssRules[i].style.borderBottomColor;
                        break;
                    case "border-radius":
                        styleSheet.cssRules[i].style.borderRadius = value;

                        styleSheet.cssRules[i].style.borderTopLeftRadius = value;
                        styleSheet.cssRules[i].style.borderTopRightRadius = value;
                        styleSheet.cssRules[i].style.borderBottomLeftRadius = value;
                        styleSheet.cssRules[i].style.borderBottomRightRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderRadius = value;

                        styleSheet.cssRules[i].style.webkitBorderTopLeftRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderTopRightRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderBottomLeftRadius = value;
                        styleSheet.cssRules[i].style.webkitBorderBottomRightRadius = value;
                        break;
                    case "background-color":
                        styleSheet.cssRules[i].style.backgroundColor = value;
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
    
    var _removeElementBackgroundRule = function (elementID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"] .rex-element-container") {
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
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-element-wrapper");
        var elementID = $elementWrapper.attr("data-rex-element-id");
        var $elementsParagraph = $elementWrapper.parents(".rex-elements-paragraph").eq(0);
        var $textWrap = $elementWrapper.parents(".text-wrap").eq(0);
        var $gridGallery = $elementWrapper.parents(".grid-stack-row").eq(0);
        var $section = $elementWrapper.parents(".rexpansive_section").eq(0);

        // Removing element unnecessary data
        $elementWrapper.detach().appendTo($textWrap);
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
                $elementWrapper.append($divContainer);
                $divContainer.append($shortcodeTransformed);

                // Get the shortcode and insert it in a new block inside $elementListHTML
                var shortcode = response.data.shortcode;
                var $spanShortcode = $(document.createElement("span"));
                $spanShortcode.addClass("string-shortcode");
                $spanShortcode.attr("shortcode", shortcode);
                $elementWrapper.prepend($spanShortcode);

                var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
                $elementData.remove();
                $elementData = $.parseHTML(response.data.element_data_html[0]);
                $elementWrapper.prepend($elementData);

                switch (dropType) {
                    case "inside-block":
                        $elementWrapper.wrap("<span class=\"rex-elements-paragraph\"></span>");
                        _endFixingElementImported($elementWrapper);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-paragraph":
                        _endFixingElementImported($elementWrapper);
                        Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                        break;
                    case "inside-row":
                        var ev = jQuery.Event("rexlive:insert_new_text_block");
                        ev.settings = {
                            data_to_send: {
                                $elementWrapper: $elementWrapper,
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
            _addElementStyle($elementWrapper);
            elementsInPage.push({
                id: elementID,
                number: 1
            });
        }

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
        // var $element = $textWrap.parents(".grid-stack-item");
        // var $section = $element.parents(".rexpansive_section");
        // Rexbuilder_Util.getGalleryInstance($section).focusElement($element);
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
                    id: parseInt(elementID),
                    number: elementNumber
                });
                
                if ($elementWrapper.hasClass("rex-separate-element")) {
                    // We are not editing an element model, but a separate element
                    _addElementStyle($elementWrapper);
                } else {
                    // We are editing an element model. Add the style only if there's
                    // no existing style
                    if (i !== 0 && elementsInPage[i].id == elementsInPage[i-1].id) {
                        // Do nothing
                    } else {
                        _addElementStyle($elementWrapper);
                    }
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

    var _separateRexElement = function (data) {
        var elementData = data.elementData;
        var newID = data.newID;
        var elementID = elementData.elementTarget.element_id;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"][data-rex-element-number=\"" + elementData.elementTarget.element_number + "\"]");
        $elementWrapper.addClass("rex-separate-element");
        $elementWrapper.attr("data-rex-element-id", newID);
        $elementWrapper.attr("data-rex-element-number", 1);
        elementsInPage.push({
            id: newID,
            number: 1
        });

        console.log(elementsInPage);

        _updateElementsData($elementWrapper, elementData);
        
        // Removes the element style if no other element is present in page
        for (i = 0; i < elementsInPage.length; i++) {
            if(!elementsInPage[i].id == elementID){
                console.log("sdgdfgb");
                _removeElementStyle(elementID);
            }
        }

        //if element was last of that model in page, remove it form elementsInPage array
        if (Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]").length == 0) {
            var i;
            for (i = 0; i < elementsInPage.length; i++) {
                if (elementsInPage[i].id == elementID) {
                    break;
                }
            }
            if (i != elementsInPage.length) {
                elementsInPage.splice(i, 1);
            }
        }

        _addElementStyle($elementWrapper);
    }

    /**
     * Refreshes the element from the shortcode. This happens
     * when we are separating an element.
     * @param  data
     * @return {null}
     */
    var _refreshRexElement = function (data) {
        var elementID = data.elementID.toString();
        var oldElementModelID = data.oldElementModelID.toString();
        var elementData = data.elementData;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]");
        var $elementData = $elementWrapper.find(".rex-element-data");
        var $elementShortcode = $elementWrapper.find(".string-shortcode");
        var elementShortcode = $elementShortcode.attr("shortcode").toString();

        var newElementShortcode = elementShortcode.replace(oldElementModelID, elementID);
        $elementShortcode.attr("shortcode", newElementShortcode);

        // Deleting the old element
        var $elementContainer = $elementWrapper.find(".rex-element-container");
        $elementContainer.empty();

        // Deleting the style
        // _removeElementStyle(elementID);

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
                $elementContainer.append($shortcodeTransformed);

                // Updating element data
                $elementData.remove();
                $elementData = $.parseHTML(response.data.element_data_html[0]);
                $elementWrapper.prepend($elementData);

                _lockSynchronize(elementData);
            }
          },
          error: function(response) {}
        });
    }

    /**
     * Updates multiple elements data.
     * @param  {jQuery} $elementWrappers
     * @param  {Array} elementData Data to update
     * @return {null}
     */
    var _updateElementsData = function ($elementWrappers, elementData) {
        $elementWrappers.each(function() {
            var $elementData = $(this).find(".rex-element-data").eq(0);
            $elementData.attr("data-background-color", elementData.background_color);
        })
    }

    var _addSeparateAttributes = function ($elementWrapper, elementData) {
        var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
        // $elementData.attr("data-text-color", elementData.text_color);
        // $elementData.attr("data-text-size", elementData.font_size);
        $elementData.attr("data-background-color", elementData.background_color);
        // $elementData.attr("data-background-color-hover", elementData.hover_color);
        // $elementData.attr("data-border-color-hover", elementData.hover_border);
        // $elementData.attr("data-text-color-hover", elementData.hover_text);
        // $elementData.attr("data-border-width", elementData.border_width);
        // $elementData.attr("data-border-color", elementData.border_color);
        // $elementData.attr("data-border-radius", elementData.border_radius);
        // $elementData.attr("data-button-height", elementData.button_height);
        // $elementData.attr("data-button-width", elementData.button_width);
        // $elementData.attr("data-margin-top", elementData.margin_top);
        // $elementData.attr("data-margin-bottom", elementData.margin_bottom);
        // $elementData.attr("data-margin-right", elementData.margin_right);
        // $elementData.attr("data-margin-left", elementData.margin_left);
        // $elementData.attr("data-padding-top", elementData.padding_top);
        // $elementData.attr("data-padding-bottom", elementData.padding_bottom);
        // $elementData.attr("data-padding-right", elementData.padding_right);
        // $elementData.attr("data-padding-left", elementData.padding_left);
        // $elementData.attr("data-button-name", elementData.elementTarget.element_name);
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
        elementProperties.background_color = (elementDataEl.getAttribute("data-background-color") ? elementDataEl.getAttribute("data-background-color").toString() : '');

        elementProperties.synchronize = typeof $elementData.attr("data-synchronize") == "undefined" ? false : $elementData.attr("data-synchronize").toString();

        if ($elementContainer.hasClass("rex-separate-element") || getAllData) {
            separate = true;
        }

        var data = {
            separateElement: separate,
            elementInfo: elementProperties
        }

        return data;
    }

    var _removeModelData = function ($elementWrapper) {
        var $elementData = $elementWrapper.find(".rex-element-data").eq(0);
        // $elementData.removeAttr("data-text-color");
        // $elementData.removeAttr("data-text-size");
        $elementData.removeAttr("data-background-color");
        // $elementData.removeAttr("data-background-color-hover");
        // $elementData.removeAttr("data-border-color-hover");
        // $elementData.removeAttr("data-text-color-hover");
        // $elementData.removeAttr("data-border-width");
        // $elementData.removeAttr("data-border-color");
        // $elementData.removeAttr("data-border-radius");
        // $elementData.removeAttr("data-button-height");
        // $elementData.removeAttr("data-button-width");
        // $elementData.removeAttr("data-margin-top");
        // $elementData.removeAttr("data-margin-bottom");
        // $elementData.removeAttr("data-margin-left");
        // $elementData.removeAttr("data-margin-right");
        // $elementData.removeAttr("data-padding-top");
        // $elementData.removeAttr("data-padding-bottom");
        // $elementData.removeAttr("data-padding-left");
        // $elementData.removeAttr("data-padding-right");
        // $elementData.removeAttr("data-button-name");
    }

    var _addElementStyle = function ($elementWrapper) {
        if ($elementWrapper.find(".rex-element-data").eq(0).length != 0) {
            var elementProperties = _generateElementData($elementWrapper, true);
            var elementID = elementProperties.elementInfo.elementTarget.element_id;
            _addCSSRules(elementID, elementProperties.elementInfo);
        }
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
        // _addElementContainerRule(elementID, backgroundRule);
        _addElementBackgroundRule(elementID, backgroundRule);

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

    var _updateElement = function (data) {
        var elementProperties = data.elementProperties;
        var elementID = elementProperties.elementTarget.element_id;
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        _updateElementBackgroundRule(elementID, "background-color", elementProperties.background_color);

        // If editing a separate element, will always be length = 1
        // If editing a model element, will be length >= 1
        var $elementWrappers = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]");
        _updateElementsData($elementWrappers, elementProperties);
       
    }

    var _updateElementLive = function (data) {
        switch (data.propertyType) {
            // case "text":
            //     _updateButtonTextRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "container":
            //     _updateButtonContainerRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            case "background":
                _updateElementBackgroundRule(data.elementTarget.element_id, data.propertyName, data.newValue);
                break;
            // case "backgroundHover":
            // case "borderHover":
            //     _updateButtonBackgroundHoverRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "textHover":
            //     _updateContainerHoverRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
            //     break;
            // case "button":
            //     var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + data.buttonTarget.button_id + "\"][data-rex-button-number=\"" + data.buttonTarget.button_number + "\"]");
            //     switch (data.propertyName) {
            //         case "link_target":
            //             $elementWrapper.find("a.rex-button-container").eq(0).attr("href", data.newValue);
            //             break;
            //         case "link_type":
            //             $elementWrapper.find("a.rex-button-container").eq(0).attr("target", data.newValue);
            //             break;
            //         case "button_label":
            //             $elementWrapper.find(".rex-button-text").eq(0).text(data.newValue);
            //             break;
            //         case "button_name":
            //             $elementWrapper.find(".rex-button-data").eq(0).attr("data-button-name", data.newValue);
            //             break;
            //         default:
            //             break;
            //     }
            //     break;
            default:
                break;
        }
    }

    var _removeElementStyle = function (elementID) {
        // _removeElementContainerRule(elementID);
        _removeElementBackgroundRule(elementID);
        // _removeElementBackgroundHoverRule(elementID);
        // _removeElementTextRule(elementID);
        // _removeElementContainerHoverRule(elementID);
    }

    var _removeSeparateElement = function (data) {
        var elementID = data.elementTarget.element_id;
        var $elementWrapper = Rexbuilder_Util.$rexContainer.find(".rex-element-wrapper[data-rex-element-id=\"" + elementID + "\"]");
        $elementWrapper.removeClass("rex-separate-element");
        _removeModelData($elementWrapper);
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
	        var $elementWrapper = data.$elementWrapper;
	        $elementWrapper.detach().prependTo($newDOMElement.find(".text-wrap").eq(0));
	        $elementWrapper.wrap("<span class=\"rex-elements-paragraph\"></span>");
	        _endFixingElementImported($elementWrapper);
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
                    background_color: "",
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
        separateRexElement: _separateRexElement,
        refreshRexElement: _refreshRexElement,
        updateElement: _updateElement,
        updateElementLive: _updateElementLive,
        removeSeparateElement: _removeSeparateElement,

        // CSS Rules Editing
        generateElementData: _generateElementData
	}
})(jQuery);