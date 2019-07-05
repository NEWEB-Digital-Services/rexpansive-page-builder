/**
 * valori da inserire nel db per il primo pulsante. Vanno tutti nella "wp_options"
 * I dati sono nella forma
 * "option_name"
 * "option_value"



_rex_buttons_ids

[\"PtAh\"]



_rex_buttons_styles

[{\"rexID\":\"PtAh\",\"buttonName\":\"Rex Purple\",\"rules\":{\"element\":{\"text_color\":\"rgb(242, 175, 255)\",\"font_size\":\"22px\",\"background_color\":\"rgb(224, 108, 246)\",\"button_height\":\"70px\",\"border_color\":\"rgb(216, 74, 74)\",\"border_width\":\"7px\",\"border_radius\":\"15px\",\"margin_top\":\"25px\",\"margin_bottom\":\"15px\",\"margin_right\":\"5px\",\"margin_left\":\"10px\"},\"hover\":{\"background_color\":\"rgb(156, 0, 255)\"}}}]



_rex_button_PtAh_css

.rex-button-wrapper[data-rex-button-id=\"PtAh\"] .rex-button-container{font-size: 22px;color: rgb(242, 175, 255);height: 70px;margin-top: 25px;margin-bottom: 15px;margin-left: 10px;margin-right: 5px;}.rex-button-wrapper[data-rex-button-id=\"PtAh\"] .rex-button-background{background-color: rgb(224, 108, 246);border-width: 7px;border-color: rgb(216, 74, 74);border-radius: 15px;border-style: solid;}.rex-button-wrapper[data-rex-button-id=\"PtAh\"] .rex-button-background:hover{background-color: rgb(156, 0, 255);}



_rex_button_PtAh_html

<span class=\"rex-button-wrapper\" data-rex-button-id=\"PtAh\">
    <span class=\"rex-button-data\" style=\"display:none;\" data-text-color=\"rgb(242, 175, 255)\" data-text-size=\"22px\" data-background-color=\"rgb(224, 108, 246)\" data-background-color-hover=\"rgb(156, 0, 255)\" data-border-width=\"7px\" data-border-color=\"rgb(216, 74, 74)\" data-border-radius=\"15px\" data-button-height=\"70px\" data-margin-top=\"25px\" data-margin-bottom=\"15px\" data-margin-left=\"10px\" data-margin-right=\"5px\" data-link-target=\"#\" data-link-type=\"_blank\" data-button-name=\"Rex Purple\"></span>
    <a href=\"#\" class=\"rex-button-container\" type=\"_blank\">
        <span class=\"rex-button-background\">
            <span class=\"rex-button-text\">Learn More</span>
        </span>
    </a>
</span>

 */
var Rexbuilder_Rexbutton = (function ($) {
    "use strict";
    var styleSheet;
    var buttonsInPage;

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

    var _fixImportedButton = function (data) {
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-button-wrapper");
        $buttonWrapper.unwrap();

        var $buttonsParagraph = $buttonWrapper.parents(".rex-buttons-paragraph").eq(0);
        var $textWrap = $buttonWrapper.parents(".text-wrap").eq(0);
        var $gridGallery = $buttonWrapper.parents(".grid-stack-row").eq(0);
        var $section = $buttonWrapper.parents(".rexpansive_section").eq(0);
        var buttonDimensionCalculated = jQuery.extend(true, {}, data.buttonDimensions);

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

        buttonDimensionCalculated.height = buttonDimensionCalculated.height + margins.top + margins.bottom;
        buttonDimensionCalculated.width = buttonDimensionCalculated.width + margins.left + margins.right;

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
    
    var _endFixingButtonImported = function($buttonWrapper){
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
        if($textWrap.length != 0){
            TextEditor.removePlaceholder($textWrap.eq(0));
        }
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
        $buttonData.removeAttr("data-margin-top");
        $buttonData.removeAttr("data-margin-bottom"); 
        $buttonData.removeAttr("data-margin-left"); 
        $buttonData.removeAttr("data-margin-right"); 
        $buttonData.removeAttr("data-button-name");
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // CSS RULES EDITING
    //////////////////////////////////////////////////////////////////////////////////////////////
    
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
        console.log("updating background hover rule");
        console.log(buttonID, rule, value);
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
    
    //////////////////////////////////////////////////////////////////////////////////////////////

    var _getActiveStyleSheet = function () {
        return styleSheet;
    }

    var _addButtonStyle = function ($buttonWrapper) {
        var buttonID = $buttonWrapper.attr("data-rex-button-id");
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);
        var buttonData = $buttonData[0];

        if ($buttonData.length != 0) {
            var buttonProperties = {
                font_size: ( buttonData.getAttribute('data-text-size') ? buttonData.getAttribute('data-text-size').toString() : '' ),
                text_color: ( buttonData.getAttribute('data-text-color') ? buttonData.getAttribute('data-text-color').toString() : '' ),
                background_color: ( buttonData.getAttribute("data-background-color") ? buttonData.getAttribute("data-background-color").toString() : '' ),
                button_height: ( buttonData.getAttribute("data-button-height") ? buttonData.getAttribute("data-button-height").toString() : '' ),

                hover_color: ( buttonData.getAttribute("data-background-color-hover") ? buttonData.getAttribute("data-background-color-hover").toString() : '' ),
                hover_text: ( buttonData.getAttribute("data-text-color-hover") ? buttonData.getAttribute("data-text-color-hover").toString() : '' ),
                hover_border: ( buttonData.getAttribute("data-border-color-hover") ? buttonData.getAttribute("data-border-color-hover").toString() : '' ),

                border_color: ( buttonData.getAttribute("data-border-color") ? buttonData.getAttribute("data-border-color").toString() : '' ),
                border_width: ( buttonData.getAttribute("data-border-width") ? buttonData.getAttribute("data-border-width").toString() : '' ),
                border_radius: ( buttonData.getAttribute("data-border-radius") ? buttonData.getAttribute("data-border-radius").toString() : '' ),
                margin_top: ( buttonData.getAttribute("data-margin-top") ? buttonData.getAttribute("data-margin-top").toString() : '' ),
                margin_bottom: ( buttonData.getAttribute("data-margin-bottom") ? buttonData.getAttribute("data-margin-bottom").toString() : '' ),
                margin_left: ( buttonData.getAttribute("data-margin-left") ? buttonData.getAttribute("data-margin-left").toString() : '' ),
                margin_right: ( buttonData.getAttribute("data-margin-right") ? buttonData.getAttribute("data-margin-right").toString() : '' )
            };
            _addCSSRules(buttonID, buttonProperties);
        }
    }

    var _addCSSRules = function (buttonID, buttonProperties) {
        var containerRule = "";
        containerRule += "font-size: " + buttonProperties.font_size + ";";
        containerRule += "color: " + buttonProperties.text_color + ";";
        containerRule += "min-height: " + buttonProperties.button_height + ";";
        containerRule += "margin-top: " + buttonProperties.margin_top + ";";
        containerRule += "margin-bottom: " + buttonProperties.margin_bottom + ";";
        containerRule += "margin-left: " + buttonProperties.margin_left + ";";
        containerRule += "margin-right: " + buttonProperties.margin_right + ";";
        _addButtonContainerRule(buttonID, containerRule);

        var backgroundRule = "";
        backgroundRule += "border-width: " + buttonProperties.border_width + ";";
        backgroundRule += "border-color: " + buttonProperties.border_color + ";";
        backgroundRule += "border-style: " + "solid" + ";";
        backgroundRule += "border-radius: " + buttonProperties.border_radius + ";";
        backgroundRule += "background-color: " + buttonProperties.background_color + ";";
        _addButtonBackgroundRule(buttonID, backgroundRule);
        
        var backgroundHoverRule = "";
        backgroundHoverRule += "background-color: " + buttonProperties.hover_color + ";";
        backgroundHoverRule += "border-color: " + buttonProperties.hover_border + ";";
        _addButtonBackgroundHoverRule(buttonID, backgroundHoverRule);

        var containerHoverRule = "";
        containerHoverRule += "color: " + buttonProperties.hover_text + ";";
        _addButtonContainerHoverRule(buttonID, containerHoverRule);
    }

    var _updateButtonLive = function (data) {
        console.log(data);
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
                        $buttonWrapper.find("a.rex-button-container").eq(0).attr("type", data.newValue);
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

    var _getDataFromButtonDom = function($buttonWrapper){
        var buttonProperties = {
            text_color: "",
            text: "",
            font_size: "",
            background_color: "",
            button_height: "",
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
        
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);
        buttonProperties.buttonTarget.button_name = $buttonData.attr("data-button-name");
        buttonProperties.buttonTarget.button_id = $buttonWrapper.attr("data-rex-button-id");
        buttonProperties.buttonTarget.button_number = parseInt($buttonWrapper.attr("data-rex-button-number"));

        buttonProperties.font_size = $buttonData.attr("data-text-size");
        buttonProperties.text_color = $buttonData.attr("data-text-color");
        buttonProperties.button_height = $buttonData.attr("data-button-height");
        buttonProperties.margin_top = $buttonData.attr("data-margin-top");
        buttonProperties.margin_bottom = $buttonData.attr("data-margin-bottom");
        buttonProperties.margin_left = $buttonData.attr("data-margin-left");
        buttonProperties.margin_right = $buttonData.attr("data-margin-right");
        buttonProperties.padding_top = $buttonData.attr("data-padding-top");
        buttonProperties.padding_bottom = $buttonData.attr("data-padding-bottom");
        buttonProperties.padding_left = $buttonData.attr("data-padding-left");
        buttonProperties.padding_right = $buttonData.attr("data-padding-right");
        buttonProperties.background_color = $buttonData.attr("data-background-color");
        buttonProperties.border_color = $buttonData.attr("data-border-color");
        buttonProperties.border_width = $buttonData.attr("data-border-width");
        buttonProperties.border_radius = $buttonData.attr("data-border-radius");

        buttonProperties.hover_color = $buttonData.attr("data-background-color-hover");
        buttonProperties.hover_border = $buttonData.attr("data-border-color-hover");
        buttonProperties.hover_text = $buttonData.attr("data-text-color-hover");

        buttonProperties.border_radius = $buttonData.attr("data-border-radius");
        buttonProperties.border_radius = $buttonData.attr("data-border-radius");
        buttonProperties.border_radius = $buttonData.attr("data-border-radius");

        buttonProperties.text = $buttonData.parents(".rex-button-wrapper").eq(0).find(".rex-button-text").eq(0).text();
        buttonProperties.link_target= $buttonData.attr("data-link-target");
        buttonProperties.link_type = $buttonData.attr("data-link-type");

        return buttonProperties;
    }

    var _updateButton = function (data) {
        var buttonProperties = data.buttonProperties;
        var buttonID = buttonProperties.buttonTarget.button_id;

        _updateButtonContainerRule(buttonID, "font-size", buttonProperties.font_size);
        _updateButtonContainerRule(buttonID, "color", buttonProperties.text_color);
        _updateButtonContainerRule(buttonID, "min-height", buttonProperties.button_height);
        _updateButtonContainerRule(buttonID, "margin-top", buttonProperties.margin_top);
        _updateButtonContainerRule(buttonID, "margin-bottom", buttonProperties.margin_bottom);
        _updateButtonContainerRule(buttonID, "margin-right", buttonProperties.margin_right);
        _updateButtonContainerRule(buttonID, "margin-left", buttonProperties.margin_left);
        _updateButtonContainerRule(buttonID, "padding-top", buttonProperties.padding_top);
        _updateButtonContainerRule(buttonID, "padding-bottom", buttonProperties.padding_bottom);
        _updateButtonContainerRule(buttonID, "padding-right", buttonProperties.padding_right);
        _updateButtonContainerRule(buttonID, "padding-left", buttonProperties.padding_left);
        _updateButtonContainerRule(buttonID, "border-width", buttonProperties.border_width);
        _updateButtonContainerRule(buttonID, "border-color", buttonProperties.border_color);
        _updateButtonContainerRule(buttonID, "border-radius", buttonProperties.border_radius);
        _updateButtonContainerRule(buttonID, "background-color", buttonProperties.background_color);

        _updateButtonBackgroundHoverRule(buttonID, "background-color", buttonProperties.hover_color);
        _updateButtonBackgroundHoverRule(buttonID, "border-color", buttonProperties.hover_border);
        _updateContainerHoverRule(buttonID, "color", buttonProperties.hover_text);

        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + buttonProperties.buttonTarget.button_number + "\"]");
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);

        $buttonWrapper.find(".rex-button-text").eq(0).text(buttonProperties.text);
        $buttonWrapper.find("a.rex-button-container").eq(0).attr("href", buttonProperties.link_target);
        $buttonWrapper.find("a.rex-button-container").eq(0).attr("type", buttonProperties.link_type);
        $buttonData.attr("data-link-target", buttonProperties.link_target);
        $buttonData.attr("data-link-type", buttonProperties.link_type);

        if ($buttonWrapper.hasClass("rex-separate-button")) {

            $buttonData.attr("data-button-name", buttonProperties.buttonTarget.button_name);
            $buttonData.attr("data-text-size", buttonProperties.font_size);
            $buttonData.attr("data-text-color", buttonProperties.text_color);
            $buttonData.attr("data-button-height", buttonProperties.button_height);
            $buttonData.attr("data-margin-top", buttonProperties.margin_top);
            $buttonData.attr("data-margin-bottom", buttonProperties.margin_bottom);
            $buttonData.attr("data-margin-left", buttonProperties.margin_left);
            $buttonData.attr("data-margin-right", buttonProperties.margin_right);
            $buttonData.attr("data-padding-top", buttonProperties.padding_top);
            $buttonData.attr("data-padding-bottom", buttonProperties.padding_bottom);
            $buttonData.attr("data-padding-left", buttonProperties.padding_left);
            $buttonData.attr("data-padding-right", buttonProperties.padding_right);

            $buttonData.attr("data-background-color", buttonProperties.background_color);
            $buttonData.attr("data-border-color", buttonProperties.border_color);
            $buttonData.attr("data-border-width", buttonProperties.border_width);
            $buttonData.attr("data-border-radius", buttonProperties.border_radius);

            $buttonData.attr("data-background-color-hover", buttonProperties.hover_color);
            $buttonData.attr("data-border-color-hover", buttonProperties.hover_border);
            $buttonData.attr("data-text-color-hover", buttonProperties.hover_text);

        } else {
            _removeModelData($buttonWrapper);
        }
    }

    var _removeButtonStyle = function (buttonID) {
        _updateButtonContainerRule(buttonID, "font-size", "");
        _updateButtonContainerRule(buttonID, "color", "");
        _updateButtonContainerRule(buttonID, "min-height", "");
        _updateButtonContainerRule(buttonID, "margin-top", "");
        _updateButtonContainerRule(buttonID, "margin-bottom", "");
        _updateButtonContainerRule(buttonID, "margin-right", "");
        _updateButtonContainerRule(buttonID, "margin-left", "");
        _updateButtonContainerRule(buttonID, "padding-top", "");
        _updateButtonContainerRule(buttonID, "padding-bottom", "");
        _updateButtonContainerRule(buttonID, "padding-right", "");
        _updateButtonContainerRule(buttonID, "padding-left", "");
        _updateButtonContainerRule(buttonID, "border-width", "");
        _updateButtonContainerRule(buttonID, "border-color", "");
        _updateButtonContainerRule(buttonID, "border-radius", "");
        _updateButtonContainerRule(buttonID, "border-style", "");
        _updateButtonContainerRule(buttonID, "background-color", "");

        _updateButtonBackgroundHoverRule(buttonID, "background-color", "");
        _updateButtonBackgroundHoverRule(buttonID, "border-color", "");
        _updateContainerHoverRule(buttonID, "color", "");
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

        //se era l'ultimo pulsante di quel modello, lo tolgo dalla lista degli id dei pulsanti nella pagina
        if (Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]").length == 0){
            var i;
            for (i = 0; i < buttonsInPage.length; i++){
                if (buttonsInPage[i].id == buttonID){
                    break;
                }
            }
            if (i != buttonsInPage.length){
                buttonsInPage.splice(i, 1);
            }
        }

        _addSeparateAttributes($buttonWrapper, buttonData);
        _addButtonStyle($buttonWrapper);
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

    var _generateButtonData = function ($buttonContainer) {
        var $buttonData = $buttonContainer.find(".rex-button-data").eq(0);
        var buttonID = $buttonContainer.attr("data-rex-button-id");
        var buttonNumber = $buttonContainer.attr("data-rex-button-number");
        var separate = false;
        var buttonName = "";
        var buttonDataEl = $buttonData[0];
        
        var buttonData = {
            text_color: "",
            text: $buttonContainer.find(".rex-button-text").eq(0).text(),
            font_size: "",
            background_color: "",
            button_height: "",
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
            link_target: $buttonData.attr("data-link-target"),
            link_type: $buttonData.attr("data-link-type"),
            buttonTarget: {
                button_name: buttonName,
                button_id: buttonID,
                button_number: buttonNumber,
            }
        };

        if ($buttonContainer.hasClass("rex-separate-button")) {
            separate = true;
            buttonData.font_size = ( buttonDataEl.getAttribute("data-text-size") ? buttonDataEl.getAttribute("data-text-size").toString() : '' );
            buttonData.text_color = ( buttonDataEl.getAttribute("data-text-color") ? buttonDataEl.getAttribute("data-text-color").toString() : '' );
            buttonData.background_color = ( buttonDataEl.getAttribute("data-background-color") ? buttonDataEl.getAttribute("data-background-color").toString() : '' );
            buttonData.button_height = ( buttonDataEl.getAttribute("data-button-height") ? buttonDataEl.getAttribute("data-button-height").toString() : '' );
            buttonData.hover_color = ( buttonDataEl.getAttribute("data-background-color-hover") ? buttonDataEl.getAttribute("data-background-color-hover").toString() : '' );
            buttonData.hover_border = ( buttonDataEl.getAttribute("data-border-color-hover") ? buttonDataEl.getAttribute("data-border-color-hover").toString() : '' );
            buttonData.hover_text = ( buttonDataEl.getAttribute("data-text-color-hover") ? buttonDataEl.getAttribute("data-text-color-hover").toString() : '' );
            buttonData.border_color = ( buttonDataEl.getAttribute("data-border-color") ? buttonDataEl.getAttribute("data-border-color").toString() : '' );
            buttonData.border_width = ( buttonDataEl.getAttribute("data-border-width") ? buttonDataEl.getAttribute("data-border-width").toString() : '' );
            buttonData.border_radius = ( buttonDataEl.getAttribute("data-border-radius") ? buttonDataEl.getAttribute("data-border-radius").toString() : '' );
            buttonData.margin_top = ( buttonDataEl.getAttribute("data-margin-top") ? buttonDataEl.getAttribute("data-margin-top").toString() : '' );
            buttonData.margin_bottom = ( buttonDataEl.getAttribute("data-margin-bottom") ? buttonDataEl.getAttribute("data-margin-bottom").toString() : '' );
            buttonData.margin_right = ( buttonDataEl.getAttribute("data-margin-right") ? buttonDataEl.getAttribute("data-margin-right").toString() : '' );
            buttonData.margin_left = ( buttonDataEl.getAttribute("data-margin-left") ? buttonDataEl.getAttribute("data-margin-left").toString() : '' );
            buttonData.padding_top = ( buttonDataEl.getAttribute("data-padding-top") ? buttonDataEl.getAttribute("data-padding-top").toString() : '' );
            buttonData.padding_bottom = ( buttonDataEl.getAttribute("data-padding-bottom") ? buttonDataEl.getAttribute("data-padding-bottom").toString() : '' );
            buttonData.padding_right = ( buttonDataEl.getAttribute("data-padding-right") ? buttonDataEl.getAttribute("data-padding-right").toString() : '' );
            buttonData.padding_left = ( buttonDataEl.getAttribute("data-padding-left") ? buttonDataEl.getAttribute("data-padding-left").toString() : '' );
            buttonData.buttonTarget.button_name = ( buttonDataEl.getAttribute("data-button-name") ? buttonDataEl.getAttribute("data-button-name").toString() : '' );
        } else{
            buttonData.synchronize = typeof $buttonData.attr("data-synchronize") == "undefined" ? false : $buttonData.attr("data-synchronize").toString();
        }

        var data = {
            separateButton: separate,
            buttonInfo: buttonData
        }
        return data;
    }

    var _lockSynchronize = function(data){
        var buttonID = data.buttonTarget.button_id;
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + data.buttonTarget.button_number + "\"]");
        $buttonWrapper.find(".rex-button-data").attr("data-synchronize", true);
    }

    var _linkDocumentListeners = function () {

        Rexbuilder_Util.$document.on("rexlive:completeImportButton", function(e){
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

        this.$buttonsStyle = $("#rexpansive-builder-rexbutton-style-inline-css");
        _fixCustomStyleElement();

        _updateButtonListInPage();

        _linkDocumentListeners();
        //$("#secondary").remove();
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

        updateButtonContainerRule: _updateButtonContainerRule,
        updateButtonBackgroundRule: _updateButtonBackgroundRule,
        updateButtonBackgroundHoverRule: _updateButtonBackgroundHoverRule,
        updateContainerHoverRule: _updateContainerHoverRule,

        getDataFromButtonDom: _getDataFromButtonDom,
        generateButtonData: _generateButtonData,
    };
})(jQuery);
