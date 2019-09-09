/**
 Values to insert on "wp_options" to work with rexbuttons
 Data are in form
 "option_name"
 "option_value"

 
_rex_buttons_ids

[\"9UEc\"]


_rex_buttons_styles

[{\"rexID\":\"9UEc\",\"buttonName\":\"Rex Funny v23\",\"rules\":{\"element\":{\"text_color\":\"rgb(111, 115, 181)\",\"font_size\":\"px\",\"background_color\":\"rgb(0, 238, 255)\",\"button_height\":\"px\",\"button_width\":\"\",\"border_color\":\"rgb(165, 0, 255)\",\"border_width\":\"px\",\"border_radius\":\"px\",\"margin_top\":\"px\",\"margin_bottom\":\"px\",\"margin_right\":\"px\",\"margin_left\":\"px\",\"padding_top\":\"px\",\"padding_bottom\":\"px\",\"padding_right\":\"px\",\"padding_left\":\"px\"},\"hover\":{\"background_color\":\"rgb(165, 0, 146)\",\"text_color\":\"rgb(0, 60, 255)\",\"border_color\":\"rgb(0, 255, 15)\"}}}]


_rex_button_9UEc_css

.rex-button-wrapper[data-rex-button-id=\"9UEc\"] .rex-button-container{font-size: 12px;color: rgb(111, 115, 181);min-height: 70px;min-width: 100px;margin-top: 20px;margin-right: 20px;margin-bottom: 20px;margin-left: 20px;}.rex-button-wrapper[data-rex-button-id=\"9UEc\"] .rex-button-text{padding-top: 20px;padding-right: 20px;padding-bottom: 20px;padding-left: 20px;}.rex-button-wrapper[data-rex-button-id=\"9UEc\"] .rex-button-background{background-color: rgb(0, 238, 255);border-color: rgb(165, 0, 255);border-width: 5px;border-radius: 10px;border-style: solid;}.rex-button-wrapper[data-rex-button-id=\"9UEc\"] .rex-button-background:hover{background-color: rgb(165, 0, 146);border-color: rgb(0, 255, 15);}.rex-button-wrapper[data-rex-button-id=\"9UEc\"] .rex-button-container:hover{color: rgb(0, 60, 255);}

_rex_button_9UEc_html

<span class=\"rex-button-wrapper\" data-rex-button-id=\"9UEc\"><span class=\"rex-button-data\" style=\"display:none;\" data-text-color=\"rgb(111, 115, 181)\" data-text-size=\"px\" data-background-color=\"rgb(0, 238, 255)\" data-background-color-hover=\"rgb(165, 0, 146)\" data-border-color-hover=\"rgb(0, 255, 15)\" data-text-color-hover=\"rgb(0, 60, 255)\" data-border-width=\"px\" data-border-color=\"rgb(165, 0, 255)\" data-border-radius=\"px\" data-button-height=\"px\" data-button-width=\"\" data-margin-top=\"px\" data-margin-bottom=\"px\" data-margin-left=\"px\" data-margin-right=\"px\" data-padding-left=\"px\" data-padding-right=\"px\" data-padding-top=\"px\" data-padding-bottom=\"px\" data-link-target=\"#\" data-link-type=\"_blank\" data-button-name=\"Rex Funny v23\"></span><a href=\"#\" class=\"rex-button-container\" target=\"_blank\"><span class=\"rex-button-background\"><span class=\"rex-button-text\">Learn More</span></span></a></span>


 */
var Rexbuilder_Rexbutton = (function ($) {
    "use strict";
    var styleSheet;
    var buttonsInPage;
    var defaultButtonValues;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // CSS RULES EDITING
    //////////////////////////////////////////////////////////////////////////////////////////////

    var _fixCustomStyleElement = function () {
        if (Rexbuilder_Rexbutton.$buttonsStyle.length == 0) {
            var css = "",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            style.id = "rexpansive-builder-rexbutton-style-inline-css";
            style.dataset.rexName = "buttons-style";
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].ownerNode.id == "rexpansive-builder-rexbutton-style-inline-css") {
                styleSheet = document.styleSheets[i];
            }
        }
    };

    var _getActiveStyleSheet = function () {
        return styleSheet;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Adding rules
    var _addButtonContainerRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addButtonBackgroundRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addButtonTextRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-text{" + property + "}", styleSheet.cssRules.length);
        }

        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-text{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addButtonBackgroundHoverRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addButtonContainerHoverRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container:hover{" + property + "}", styleSheet.cssRules.length);
        }

        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container:hover{" + property + "}", styleSheet.cssRules.length);
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Updating rules

    var _updateButtonContainerRule = function (buttonID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-button-id='" + buttonID + "'].rex-button-wrapper .rex-button-container"
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

    var _updateButtonBackgroundRule = function (buttonID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-button-id='" + buttonID + "'].rex-button-wrapper .rex-button-background"
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

    var _updateButtonTextRule = function (buttonID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-text" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-button-id='" + buttonID + "'].rex-button-wrapper .rex-button-text"
            ) {
                switch (rule) {
                    case "padding-left":
                        styleSheet.cssRules[i].style.paddingLeft = value;
                        break;
                    case "padding-right":
                        styleSheet.cssRules[i].style.paddingRight = value;
                        break;
                    case "padding-top":
                        styleSheet.cssRules[i].style.paddingTop = value;
                        break;
                    case "padding-bottom":
                        styleSheet.cssRules[i].style.paddingBottom = value;
                        break;
                }
            }
        }
    }

    var _updateContainerHoverRule = function (buttonID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container:hover" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-button-id='" + buttonID + "'].rex-button-wrapper .rex-button-container:hover"
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

    var _updateButtonBackgroundHoverRule = function (buttonID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (
                //chrome firefox
                styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover" ||
                // edge
                styleSheet.cssRules[i].selectorText == "[data-rex-button-id='" + buttonID + "'].rex-button-wrapper .rex-button-background:hover"
            ) {
                switch (rule) {
                    case "background-color":
                        styleSheet.cssRules[i].style.backgroundColor = value;
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
                    default:
                        break;
                }
                break;
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////
    // Removing rules

    var _removeButtonContainerRule = function (buttonID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _removeButtonBackgroundRule = function (buttonID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _removeButtonTextRule = function (buttonID, property) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-text") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _removeButtonBackgroundHoverRule = function (buttonID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _removeButtonContainerHoverRule = function (buttonID, property) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container:hover") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////

    var _fixImportedButton = function (data) {
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-button-wrapper");

        $buttonWrapper.unwrap();

        var $buttonsParagraph = $buttonWrapper.parents(".rex-buttons-paragraph").eq(0);
        var $textWrap = $buttonWrapper.parents(".text-wrap").eq(0);
        var $gridGallery = $buttonWrapper.parents(".grid-stack-row").eq(0);
        var $section = $buttonWrapper.parents(".rexpansive_section").eq(0);
        var buttonDimensionCalculated = jQuery.extend(true, {}, data.buttonDimensions);

        // fix delete button bring back
        $gridGallery.find('.button__element--delete').remove();

        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);
        var margins = {
            top: parseInt($buttonData.attr("data-margin-top").replace("px", "")),
            bottom: parseInt($buttonData.attr("data-margin-bottom").replace("px", "")),
            left: parseInt($buttonData.attr("data-margin-left").replace("px", "")),
            right: parseInt($buttonData.attr("data-margin-right").replace("px", "")),
        }
        margins.top = isNaN(margins.top) ? 0 : margins.top;
        margins.bottom = isNaN(margins.bottom) ? 0 : margins.bottom;
        margins.left = isNaN(margins.left) ? 0 : margins.left;
        margins.right = isNaN(margins.right) ? 0 : margins.right;

        var paddings = {
            top: parseInt($buttonData.attr("data-padding-top").replace("px", "")),
            bottom: parseInt($buttonData.attr("data-padding-bottom").replace("px", "")),
            left: parseInt($buttonData.attr("data-padding-left").replace("px", "")),
            right: parseInt($buttonData.attr("data-padding-right").replace("px", "")),
        }
        paddings.top = isNaN(paddings.top) ? 0 : paddings.top;
        paddings.bottom = isNaN(paddings.bottom) ? 0 : paddings.bottom;
        paddings.left = isNaN(paddings.left) ? 0 : paddings.left;
        paddings.right = isNaN(paddings.right) ? 0 : paddings.right;

        buttonDimensionCalculated.height =
            buttonDimensionCalculated.height + margins.top + margins.bottom + paddings.top + paddings.bottom;
        buttonDimensionCalculated.width =
            buttonDimensionCalculated.width + margins.left + margins.right + paddings.left + paddings.right;


        var dropType;
        if ($textWrap.length == 0) {
            if ($gridGallery.length != 0) {
                dropType = "inside-row";
            } else {
                dropType = "inside-new-row";
            }
        } else if ($buttonsParagraph.length != 0) {
            dropType = "inside-paragraph";
        } else {
            dropType = "inside-block";
        }

        switch (dropType) {
            case "inside-block":
                $buttonWrapper.wrap("<p class=\"rex-buttons-paragraph\"></p>");
                _endFixingButtonImported($buttonWrapper);
                Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                break;
            case "inside-paragraph":
                _endFixingButtonImported($buttonWrapper);
                Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
                break;
            case "inside-row":
                var ev = jQuery.Event("rexlive:insert_new_text_block");
                ev.settings = {
                    data_to_send: {
                        $buttonWrapper: $buttonWrapper,
                        $section: $section,
                        addBlockButton: true,
                        mousePosition: data.mousePosition,
                        blockDimensions: {
                            w: buttonDimensionCalculated.width,
                            h: buttonDimensionCalculated.height
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

    var _endFixingButtonImported = function ($buttonWrapper) {
        var buttonID = $buttonWrapper.attr("data-rex-button-id");
        var flagButtonFound = false;
        $buttonWrapper.attr("data-rex-button-number", 1);
        for (var i = 0; i < buttonsInPage.length; i++) {
            if (buttonsInPage[i].id == buttonID) {
                buttonsInPage[i].number += 1;
                $buttonWrapper.attr("data-rex-button-number", buttonsInPage[i].number);
                flagButtonFound = true;
                break;
            }
        }
        if (!flagButtonFound) {
            _addButtonStyle($buttonWrapper);
            buttonsInPage.push({
                id: buttonID,
                number: 1
            });
        }
        _removeModelData($buttonWrapper);

        //removes medium editor placeholder if there
        var $textWrap = $buttonWrapper.parents(".text-wrap");
        if ($textWrap.length != 0) {
            TextEditor.removePlaceholder($textWrap.eq(0));
        }

        // locking grid to prevent errors on focus right text node
        var $element = $textWrap.parents(".grid-stack-item");
        var $section = $element.parents(".rexpansive_section");
        Rexbuilder_Util.getGalleryInstance($section).focusElement($element);
    }

    var _addButtonStyle = function ($buttonWrapper) {
        if ($buttonWrapper.find(".rex-button-data").eq(0).length != 0) {
            var buttonProperties = _generateButtonData($buttonWrapper, true);
            var buttonID = buttonProperties.buttonInfo.buttonTarget.button_id;
            _addCSSRules(buttonID, buttonProperties.buttonInfo);
        }
    }

    var _addCSSRules = function (buttonID, buttonProperties) {
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";

        var containerRule = "";
        containerRule += "color: " + buttonProperties.text_color + ";";

        // checking font size, if value is not valid default font size will be applied
        currentTextSize = isNaN(parseInt(buttonProperties.font_size.replace("px", ""))) ? defaultButtonValues.font_size : buttonProperties.font_size;
        containerRule += "font-size: " + currentTextSize + ";";

        // checking button dimensions, if value is not valid default dimensions will be applied
        currentDimension = isNaN(parseInt(buttonProperties.button_height.replace("px", ""))) ? defaultButtonValues.dimensions.height : buttonProperties.button_height;
        containerRule += "min-height: " + currentDimension + ";";
        currentDimension = isNaN(parseInt(buttonProperties.button_width.replace("px", ""))) ? defaultButtonValues.dimensions.width : buttonProperties.button_width;
        containerRule += "min-width: " + currentDimension + ";";

        // checking margins, if they are not valid default value will be applied
        currentMargin = isNaN(parseInt(buttonProperties.margin_top.replace("px", ""))) ? defaultButtonValues.margins.top : buttonProperties.margin_top;
        containerRule += "margin-top: " + currentMargin + ";";
        currentMargin = isNaN(parseInt(buttonProperties.margin_right.replace("px", ""))) ? defaultButtonValues.margins.right : buttonProperties.margin_right;
        containerRule += "margin-right: " + currentMargin + ";";
        currentMargin = isNaN(parseInt(buttonProperties.margin_bottom.replace("px", ""))) ? defaultButtonValues.margins.bottom : buttonProperties.margin_bottom;
        containerRule += "margin-bottom: " + currentMargin + ";";
        currentMargin = isNaN(parseInt(buttonProperties.margin_left.replace("px", ""))) ? defaultButtonValues.margins.left : buttonProperties.margin_left;
        containerRule += "margin-left: " + currentMargin + ";";

        _addButtonContainerRule(buttonID, containerRule);

        var backgroundRule = "";
        backgroundRule += "border-color: " + buttonProperties.border_color + ";";
        backgroundRule += "border-style: " + "solid" + ";";

        // checking border dimensions, if they are not valid default value will be applied
        currentBorderDimension = isNaN(parseInt(buttonProperties.border_width.replace("px", ""))) ? defaultButtonValues.border.width : buttonProperties.border_width;
        backgroundRule += "border-width: " + currentBorderDimension + ";";
        currentBorderDimension = isNaN(parseInt(buttonProperties.border_radius.replace("px", ""))) ? defaultButtonValues.border.radius : buttonProperties.border_radius;
        backgroundRule += "border-radius: " + currentBorderDimension + ";";

        backgroundRule += "background-color: " + buttonProperties.background_color + ";";
        _addButtonBackgroundRule(buttonID, backgroundRule);

        var textRule = "";

        // checking paddings, if they are not valid default value will be applied
        currentPadding = isNaN(parseInt(buttonProperties.padding_top.replace("px", ""))) ? defaultButtonValues.paddings.top : buttonProperties.padding_top;
        textRule += "padding-top: " + currentPadding + ";";
        currentPadding = isNaN(parseInt(buttonProperties.padding_right.replace("px", ""))) ? defaultButtonValues.paddings.right : buttonProperties.padding_right;
        textRule += "padding-right: " + currentPadding + ";";
        currentPadding = isNaN(parseInt(buttonProperties.padding_bottom.replace("px", ""))) ? defaultButtonValues.paddings.bottom : buttonProperties.padding_bottom;
        textRule += "padding-bottom: " + currentPadding + ";";
        currentPadding = isNaN(parseInt(buttonProperties.padding_left.replace("px", ""))) ? defaultButtonValues.paddings.left : buttonProperties.padding_left;
        textRule += "padding-left: " + currentPadding + ";";
        _addButtonTextRule(buttonID, textRule);

        var backgroundHoverRule = "";
        backgroundHoverRule += "background-color: " + buttonProperties.hover_color + ";";
        backgroundHoverRule += "border-color: " + buttonProperties.hover_border + ";";
        _addButtonBackgroundHoverRule(buttonID, backgroundHoverRule);

        var containerHoverRule = "";
        containerHoverRule += "color: " + buttonProperties.hover_text + ";";
        _addButtonContainerHoverRule(buttonID, containerHoverRule);
    }

    var _updateButtonLive = function (data) {
        switch (data.propertyType) {
            case "text":
                _updateButtonTextRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
                break;
            case "container":
                _updateButtonContainerRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
                break;
            case "background":
                _updateButtonBackgroundRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
                break;
            case "backgroundHover":
            case "borderHover":
                _updateButtonBackgroundHoverRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
                break;
            case "textHover":
                _updateContainerHoverRule(data.buttonTarget.button_id, data.propertyName, data.newValue);
                break;
            case "button":
                var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + data.buttonTarget.button_id + "\"][data-rex-button-number=\"" + data.buttonTarget.button_number + "\"]");
                switch (data.propertyName) {
                    case "link_target":
                        $buttonWrapper.find("a.rex-button-container").eq(0).attr("href", data.newValue);
                        break;
                    case "link_type":
                        $buttonWrapper.find("a.rex-button-container").eq(0).attr("target", data.newValue);
                        break;
                    case "button_label":
                        $buttonWrapper.find(".rex-button-text").eq(0).text(data.newValue);
                        break;
                    case "button_name":
                        $buttonWrapper.find(".rex-button-data").eq(0).attr("data-button-name", data.newValue);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    var _updateButton = function (data) {
        var buttonProperties = data.buttonProperties;
        var buttonID = buttonProperties.buttonTarget.button_id;
        var currentMargin = "";
        var currentPadding = "";
        var currentDimension = "";
        var currentBorderDimension = "";
        var currentTextSize = "";
        
        currentTextSize = isNaN(parseInt(buttonProperties.font_size.replace("px", ""))) ? defaultButtonValues.font_size : buttonProperties.font_size;
        _updateButtonContainerRule(buttonID, "font-size", currentTextSize);

        _updateButtonContainerRule(buttonID, "color", buttonProperties.text_color);
        currentDimension = isNaN(parseInt(buttonProperties.button_height.replace("px", ""))) ? defaultButtonValues.dimensions.height : buttonProperties.button_height;
        _updateButtonContainerRule(buttonID, "min-height", currentDimension);
        currentDimension = isNaN(parseInt(buttonProperties.button_width.replace("px", ""))) ? defaultButtonValues.dimensions.width : buttonProperties.button_width;
        _updateButtonContainerRule(buttonID, "min-width", currentDimension);

        currentMargin = isNaN(parseInt(buttonProperties.margin_top.replace("px", ""))) ? defaultButtonValues.margins.top : buttonProperties.margin_top;
        _updateButtonContainerRule(buttonID, "margin-top", currentMargin);
        currentMargin = isNaN(parseInt(buttonProperties.margin_right.replace("px", ""))) ? defaultButtonValues.margins.right : buttonProperties.margin_right;
        _updateButtonContainerRule(buttonID, "margin-right", currentMargin);
        currentMargin = isNaN(parseInt(buttonProperties.margin_bottom.replace("px", ""))) ? defaultButtonValues.margins.bottom : buttonProperties.margin_bottom;
        _updateButtonContainerRule(buttonID, "margin-bottom", currentMargin);
        currentMargin = isNaN(parseInt(buttonProperties.margin_left.replace("px", ""))) ? defaultButtonValues.margins.left : buttonProperties.margin_left;
        _updateButtonContainerRule(buttonID, "margin-left", currentMargin);

        _updateButtonBackgroundRule(buttonID, "border-color", buttonProperties.border_color);
        currentBorderDimension = isNaN(parseInt(buttonProperties.border_width.replace("px", ""))) ? defaultButtonValues.border.width : buttonProperties.border_width;
        _updateButtonBackgroundRule(buttonID, "border-width", currentBorderDimension);
        currentBorderDimension = isNaN(parseInt(buttonProperties.border_radius.replace("px", ""))) ? defaultButtonValues.border.radius : buttonProperties.border_radius;
        _updateButtonBackgroundRule(buttonID, "border-radius", currentBorderDimension);

        _updateButtonBackgroundRule(buttonID, "background-color", buttonProperties.background_color);

        currentPadding = isNaN(parseInt(buttonProperties.padding_top.replace("px", ""))) ? defaultButtonValues.paddings.top : buttonProperties.padding_top;
        _updateButtonTextRule(buttonID, "padding-top", currentPadding);
        currentPadding = isNaN(parseInt(buttonProperties.padding_right.replace("px", ""))) ? defaultButtonValues.paddings.right : buttonProperties.padding_right;
        _updateButtonTextRule(buttonID, "padding-right", currentPadding);
        currentPadding = isNaN(parseInt(buttonProperties.padding_bottom.replace("px", ""))) ? defaultButtonValues.paddings.bottom : buttonProperties.padding_bottom;
        _updateButtonTextRule(buttonID, "padding-bottom", currentPadding);
        currentPadding = isNaN(parseInt(buttonProperties.padding_left.replace("px", ""))) ? defaultButtonValues.paddings.left : buttonProperties.padding_left;
        _updateButtonTextRule(buttonID, "padding-left", currentPadding);

        _updateButtonBackgroundHoverRule(buttonID, "background-color", buttonProperties.hover_color);
        _updateButtonBackgroundHoverRule(buttonID, "border-color", buttonProperties.hover_border);

        _updateContainerHoverRule(buttonID, "color", buttonProperties.hover_text);

        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + buttonProperties.buttonTarget.button_number + "\"]");
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);

        $buttonWrapper.find(".rex-button-text").eq(0).text(buttonProperties.text);
        $buttonWrapper.find("a.rex-button-container").eq(0).attr("href", buttonProperties.link_target);
        $buttonWrapper.find("a.rex-button-container").eq(0).attr("target", buttonProperties.link_type);
        $buttonData.attr("data-link-target", buttonProperties.link_target);
        $buttonData.attr("data-link-type", buttonProperties.link_type);

        if ($buttonWrapper.hasClass("rex-separate-button")) {
            _addSeparateAttributes($buttonWrapper, buttonProperties);
        } else {
            _removeModelData($buttonWrapper);
        }
    }

    var _removeButtonStyle = function (buttonID) {
        _removeButtonContainerRule(buttonID);
        _removeButtonBackgroundRule(buttonID);
        _removeButtonBackgroundHoverRule(buttonID);
        _removeButtonTextRule(buttonID);
        _removeButtonContainerHoverRule(buttonID);
    }

    var _removeSeparateButton = function (data) {
        var buttonID = data.buttonTarget.button_id;
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]");
        $buttonWrapper.removeClass("rex-separate-button");
        _removeModelData($buttonWrapper);
    }

    var _separateRexButton = function (data) {
        var buttonData = data.buttonData;
        var newID = data.newID;
        var buttonID = buttonData.buttonTarget.button_id;
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + buttonData.buttonTarget.button_number + "\"]");
        $buttonWrapper.addClass("rex-separate-button");
        $buttonWrapper.attr("data-rex-button-id", newID);
        $buttonWrapper.attr("data-rex-button-number", 1);
        buttonsInPage.push({
            id: newID,
            number: 1
        });

        //if button was last of that model in page, remove it form buttonsInPage array
        if (Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]").length == 0) {
            var i;
            for (i = 0; i < buttonsInPage.length; i++) {
                if (buttonsInPage[i].id == buttonID) {
                    break;
                }
            }
            if (i != buttonsInPage.length) {
                buttonsInPage.splice(i, 1);
            }
        }

        _addSeparateAttributes($buttonWrapper, buttonData);
        _addButtonStyle($buttonWrapper);
    }

    var _removeModelData = function ($buttonWrapper) {
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);
        $buttonData.removeAttr("data-text-color");
        $buttonData.removeAttr("data-text-size");
        $buttonData.removeAttr("data-background-color");
        $buttonData.removeAttr("data-background-color-hover");
        $buttonData.removeAttr("data-border-color-hover");
        $buttonData.removeAttr("data-text-color-hover");
        $buttonData.removeAttr("data-border-width");
        $buttonData.removeAttr("data-border-color");
        $buttonData.removeAttr("data-border-radius");
        $buttonData.removeAttr("data-button-height");
        $buttonData.removeAttr("data-button-width");
        $buttonData.removeAttr("data-margin-top");
        $buttonData.removeAttr("data-margin-bottom");
        $buttonData.removeAttr("data-margin-left");
        $buttonData.removeAttr("data-margin-right");
        $buttonData.removeAttr("data-padding-top");
        $buttonData.removeAttr("data-padding-bottom");
        $buttonData.removeAttr("data-padding-left");
        $buttonData.removeAttr("data-padding-right");
        $buttonData.removeAttr("data-button-name");
    }

    var _addSeparateAttributes = function ($buttonWrapper, buttonData) {
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);
        $buttonData.attr("data-text-color", buttonData.text_color);
        $buttonData.attr("data-text-size", buttonData.font_size);
        $buttonData.attr("data-background-color", buttonData.background_color);
        $buttonData.attr("data-background-color-hover", buttonData.hover_color);
        $buttonData.attr("data-border-color-hover", buttonData.hover_border);
        $buttonData.attr("data-text-color-hover", buttonData.hover_text);
        $buttonData.attr("data-border-width", buttonData.border_width);
        $buttonData.attr("data-border-color", buttonData.border_color);
        $buttonData.attr("data-border-radius", buttonData.border_radius);
        $buttonData.attr("data-button-height", buttonData.button_height);
        $buttonData.attr("data-button-width", buttonData.button_width);
        $buttonData.attr("data-margin-top", buttonData.margin_top);
        $buttonData.attr("data-margin-bottom", buttonData.margin_bottom);
        $buttonData.attr("data-margin-right", buttonData.margin_right);
        $buttonData.attr("data-margin-left", buttonData.margin_left);
        $buttonData.attr("data-padding-top", buttonData.padding_top);
        $buttonData.attr("data-padding-bottom", buttonData.padding_bottom);
        $buttonData.attr("data-padding-right", buttonData.padding_right);
        $buttonData.attr("data-padding-left", buttonData.padding_left);
        $buttonData.attr("data-button-name", buttonData.buttonTarget.button_name);
    }

    /**
     * Generate button data from RexButton dom Element.
     * If getAllData is true, will get data from dom even if button is a model
     * 
     * The obtained object has 2 fields:
     * 
     * separateButton - true if button is separate, false if it is a model
     * 
     * buttonInfo - properties of the button
     * 
     * @param {*} $buttonContainer dom button container (with class "rex-button-wrapper")
     * @param {Boolean} getAllData flag to generate all data
     * @returns {Object} data
     */
    var _generateButtonData = function ($buttonContainer, getAllData) {
        getAllData = typeof getAllData === "undefined" ? false : getAllData.toString() == "true";
        var buttonProperties = {
            text_color: "",
            text: "",
            font_size: "",
            background_color: "",
            button_height: "",
            button_width: "",
            hover_color: "",
            hover_border: "",
            hover_text: "",
            border_color: "",
            border_width: "",
            border_radius: "",
            margin_top: "",
            margin_bottom: "",
            margin_right: "",
            margin_left: "",
            padding_top: "",
            padding_bottom: "",
            padding_right: "",
            padding_left: "",
            link_target: "",
            link_type: "",
            buttonTarget: {
                button_name: "",
                button_id: "",
                button_number: "",
            }
        };

        var $buttonData = $buttonContainer.find(".rex-button-data").eq(0);
        buttonProperties.buttonTarget.button_id = $buttonContainer.attr("data-rex-button-id");
        buttonProperties.buttonTarget.button_number = parseInt($buttonContainer.attr("data-rex-button-number"));
        var buttonDataEl = $buttonData[0];
        var separate = false;

        if ($buttonContainer.hasClass("rex-separate-button") || getAllData) {
            buttonProperties.font_size = (buttonDataEl.getAttribute("data-text-size") ? buttonDataEl.getAttribute("data-text-size").toString() : '');
            buttonProperties.text_color = (buttonDataEl.getAttribute("data-text-color") ? buttonDataEl.getAttribute("data-text-color").toString() : '');
            buttonProperties.button_height = (buttonDataEl.getAttribute("data-button-height") ? buttonDataEl.getAttribute("data-button-height").toString() : '');
            buttonProperties.button_width = (buttonDataEl.getAttribute("data-button-width") ? buttonDataEl.getAttribute("data-button-width").toString() : '');
            buttonProperties.margin_top = (buttonDataEl.getAttribute("data-margin-top") ? buttonDataEl.getAttribute("data-margin-top").toString() : '');
            buttonProperties.margin_bottom = (buttonDataEl.getAttribute("data-margin-bottom") ? buttonDataEl.getAttribute("data-margin-bottom").toString() : '');
            buttonProperties.margin_right = (buttonDataEl.getAttribute("data-margin-right") ? buttonDataEl.getAttribute("data-margin-right").toString() : '');
            buttonProperties.margin_left = (buttonDataEl.getAttribute("data-margin-left") ? buttonDataEl.getAttribute("data-margin-left").toString() : '');

            buttonProperties.border_color = (buttonDataEl.getAttribute("data-border-color") ? buttonDataEl.getAttribute("data-border-color").toString() : '');
            buttonProperties.border_width = (buttonDataEl.getAttribute("data-border-width") ? buttonDataEl.getAttribute("data-border-width").toString() : '');
            buttonProperties.border_radius = (buttonDataEl.getAttribute("data-border-radius") ? buttonDataEl.getAttribute("data-border-radius").toString() : '');
            buttonProperties.background_color = (buttonDataEl.getAttribute("data-background-color") ? buttonDataEl.getAttribute("data-background-color").toString() : '');

            buttonProperties.padding_top = (buttonDataEl.getAttribute("data-padding-top") ? buttonDataEl.getAttribute("data-padding-top").toString() : '');
            buttonProperties.padding_bottom = (buttonDataEl.getAttribute("data-padding-bottom") ? buttonDataEl.getAttribute("data-padding-bottom").toString() : '');
            buttonProperties.padding_right = (buttonDataEl.getAttribute("data-padding-right") ? buttonDataEl.getAttribute("data-padding-right").toString() : '');
            buttonProperties.padding_left = (buttonDataEl.getAttribute("data-padding-left") ? buttonDataEl.getAttribute("data-padding-left").toString() : '');

            buttonProperties.hover_color = (buttonDataEl.getAttribute("data-background-color-hover") ? buttonDataEl.getAttribute("data-background-color-hover").toString() : '');
            buttonProperties.hover_border = (buttonDataEl.getAttribute("data-border-color-hover") ? buttonDataEl.getAttribute("data-border-color-hover").toString() : '');
            buttonProperties.hover_text = (buttonDataEl.getAttribute("data-text-color-hover") ? buttonDataEl.getAttribute("data-text-color-hover").toString() : '');

            buttonProperties.buttonTarget.button_name = (buttonDataEl.getAttribute("data-button-name") ? buttonDataEl.getAttribute("data-button-name").toString() : '');
            separate = true;
        } else {
            buttonProperties.synchronize = typeof $buttonData.attr("data-synchronize") == "undefined" ? false : $buttonData.attr("data-synchronize").toString();
        }
        buttonProperties.text = $buttonContainer.find(".rex-button-text").eq(0).text();
        buttonProperties.link_target = $buttonData.attr("data-link-target");
        buttonProperties.link_type = $buttonData.attr("data-link-type");

        var data = {
            separateButton: separate,
            buttonInfo: buttonProperties
        }
        return data;
    }
    var _lockSynchronize = function (data) {
        var buttonID = data.buttonTarget.button_id;
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + data.buttonTarget.button_number + "\"]");
        $buttonWrapper.find(".rex-button-data").attr("data-synchronize", true);
    }

    var _linkDocumentListeners = function () {
        Rexbuilder_Util.$document.on("rexlive:completeImportButton", function (e) {
            var data = e.settings;
            var $newElement = data.$blockAdded;
            var $buttonWrapper = data.$buttonWrapper;
            $buttonWrapper.detach().prependTo($newElement.find(".text-wrap").eq(0));
            $buttonWrapper.wrap("<p class=\"rex-buttons-paragraph\"></p>");
            _endFixingButtonImported($buttonWrapper);
        });
    }

    var _updateButtonListInPage = function () {
        var j;
        var flagButtonFound = false;
        Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper").each(function (i, button) {
            var $buttonWrapper = $(button);
            var buttonID = $buttonWrapper.attr("data-rex-button-id");
            var buttonNumber = parseInt($buttonWrapper.attr("data-rex-button-number"));
            flagButtonFound = false;
            for (j = 0; j < buttonsInPage.length; j++) {
                if (buttonsInPage[j].id == buttonID) {
                    flagButtonFound = true;
                    break;
                }
            }
            flagButtonFound = false;
            if (!flagButtonFound) {
                buttonsInPage.push({
                    id: buttonID,
                    number: buttonNumber
                });

                if ($buttonWrapper.hasClass("rex-separate-button")) {
                    // We are not editing a button model, but a separate button
                    _addButtonStyle($buttonWrapper);
                }
            }
            if (buttonsInPage[j].number < buttonNumber) {
                buttonsInPage[j].number = buttonNumber;
            }
        });
    }

    var _getButtonsInPage = function () {
        return buttonsInPage;
    }

    var init = function () {
        styleSheet = null;
        buttonsInPage = [];
        defaultButtonValues = {
            margins: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
            paddings: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
            dimensions: {
                height: "70px",
                width: "100px",
            },
            border: {
                width: "5px",
                radius: "10px"
            },
            font_size: "12px",
        }

        this.$buttonsStyle = $("#rexpansive-builder-rexbutton-style-inline-css");
        _fixCustomStyleElement();

        _updateButtonListInPage();

        _linkDocumentListeners();
    };

    return {
        init: init,
        getActiveStyleSheet: _getActiveStyleSheet,
        fixImportedButton: _fixImportedButton,
        getButtonsInPage: _getButtonsInPage,
        updateButtonLive: _updateButtonLive,
        lockSynchronize: _lockSynchronize,
        updateButton: _updateButton,
        removeSeparateButton: _removeSeparateButton,
        separateRexButton: _separateRexButton,
        generateButtonData: _generateButtonData,

        updateButtonContainerRule: _updateButtonContainerRule,
        updateButtonBackgroundRule: _updateButtonBackgroundRule,
        updateButtonBackgroundHoverRule: _updateButtonBackgroundHoverRule,
        updateContainerHoverRule: _updateContainerHoverRule,
    };
})(jQuery);
