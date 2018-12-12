
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

    var _fixImportedButton = function () {
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-button-wrapper");

        $buttonWrapper.unwrap();
        $buttonWrapper.wrap("<p></p>");

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

        _linkHoverListeners($buttonWrapper);
    }
    
    var _removeModelData = function ($buttonWrapper) {
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0); 
        $buttonData.removeAttr("data-text-color");
        $buttonData.removeAttr("data-text-size");
        $buttonData.removeAttr("data-background-color");
        $buttonData.removeAttr("data-background-color-hover");
        $buttonData.removeAttr("data-border-width");
        $buttonData.removeAttr("data-border-color");
        $buttonData.removeAttr("data-border-radius");
        $buttonData.removeAttr("data-button-height");
        $buttonData.removeAttr("data-margin-top");
        $buttonData.removeAttr("data-margin-bottom"); 
        $buttonData.removeAttr("data-button-name");
    }

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

    var _updateButtonContainerRule = function (buttonID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container") {
                switch (rule) {
                    case "font-size":
                        styleSheet.cssRules[i].style.fontSize = value;
                        break;
                    case "color":
                        styleSheet.cssRules[i].style.color = value;
                        break;
                    case "height":
                        styleSheet.cssRules[i].style.height = value;
                        break;
                    case "margin-top":
                        styleSheet.cssRules[i].style.marginTop = value;
                        break;
                    case "margin-bottom":
                        styleSheet.cssRules[i].style.marginBottom = value;
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
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background") {
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

                        styleSheet.cssRules[i].style.borderTop = styleSheet.cssRules[i].style.borderTopWidth + " " + styleSheet.cssRules[i].style.borderTopStyle + " " + value;
                        styleSheet.cssRules[i].style.borderLeft = styleSheet.cssRules[i].style.borderLeftWidth + " " + styleSheet.cssRules[i].style.borderLeftStyle + " " + value;
                        styleSheet.cssRules[i].style.borderRight = styleSheet.cssRules[i].style.borderRightWidth + " " + styleSheet.cssRules[i].style.borderRightStyle + " " + value;
                        styleSheet.cssRules[i].style.borderBottom = styleSheet.cssRules[i].style.borderBottomWidth + " " + styleSheet.cssRules[i].style.borderBottomStyle + " " + value;
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

    var _updateButtonBackgroundHoverRule = function (buttonID, rule, value) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover") {
                switch (rule) {
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

    var _getActiveStyleSheet = function () {
        return styleSheet;
    }

    var _linkHoverListeners = function ($button) {
        $button.hover(function () {
            $button.find(".rex-edit-button-tools").addClass("rex-show-buttons-tools");
        }, function () {
            $button.find(".rex-edit-button-tools").removeClass("rex-show-buttons-tools");
        });
    }

    var _addToolsButton = function () {
        Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper").each(function (i, button) {
            var $button = $(button);
            if ($button.find(".rex-edit-button-tools").length == 0) {
                var $spanEl = $(document.createElement("span"));
                $spanEl.addClass("rex-edit-button-tools");
                $button.prepend($spanEl);
            }
            _linkHoverListeners($button);
        });
    }

    var _addButtonStyle = function ($buttonWrapper) {
        var buttonID = $buttonWrapper.attr("data-rex-button-id");
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);
        if ($buttonData.length != 0) {
            var buttonProperties = {
                font_size: $buttonData.attr("data-text-size").toString(),
                text_color: $buttonData.attr("data-text-color").toString(),
                background_color: $buttonData.attr("data-background-color").toString(),
                button_height: $buttonData.attr("data-button-height").toString(),
                hover_color: $buttonData.attr("data-background-color-hover").toString(),
                border_color: $buttonData.attr("data-border-color").toString(),
                border_width: $buttonData.attr("data-border-width").toString(),
                border_radius: $buttonData.attr("data-border-radius").toString(),
                margin_top: $buttonData.attr("data-margin-top").toString(),
                margin_bottom: $buttonData.attr("data-margin-bottom").toString()
            };
            _addCSSRules(buttonID, buttonProperties);
        }
    }

    var _addCSSRules = function (buttonID, buttonProperties) {
        var containerRule = "";
        containerRule += "font-size: " + buttonProperties.font_size + ";";
        containerRule += "color: " + buttonProperties.text_color + ";";
        containerRule += "height: " + buttonProperties.button_height + ";";
        containerRule += "margin-top: " + buttonProperties.margin_top + ";";
        containerRule += "margin-bottom: " + buttonProperties.margin_bottom + ";";
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
        _addButtonBackgroundHoverRule(buttonID, backgroundHoverRule);
    }

    var _updateButtonLive = function (data) {
        //per i gradienti
        /*
       {
        buttonTarget: {
            buttonID: "qaz1",
            buttonNumber: "",
            buttonName: ""
        },
        propertyType: "container",
        propertyName: "height",
        newValue: "30px"
       }
       */

        switch (data.propertyType) {
            case "container":
                _updateButtonContainerRule(data.buttonTarget.buttonID, data.propertyName, data.newValue);
                break;
            case "background":
                _updateButtonBackgroundRule(data.buttonTarget.buttonID, data.propertyName, data.newValue);
                break;
            case "backgroundHover":
                _updateButtonBackgroundHoverRule(data.buttonTarget.buttonID, data.propertyName, data.newValue);
                break;
            case "button":
                var $buttonContainer = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + data.buttonTarget.button_number + "\"]");
                switch (data.propertyName) {
                    case "link_target":
                        $buttonContainer.find("a.rex-button-container").eq(0).attr("href", data.newValue);
                        break;
                    case "link_type":
                        $buttonContainer.find("a.rex-button-container").eq(0).attr("type", data.newValue);
                        break;
                    case "button_label":
                        $buttonContainer.find(".rex-button-text").eq(0).text(data.newValue);
                        break;
                    case "button_name":
                        $buttonContainer.find(".rex-button-data").eq(0).attr("data-button-name", data.newValue);
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

        _updateButtonContainerRule(buttonID, "font-size", buttonProperties.font_size);
        _updateButtonContainerRule(buttonID, "color", buttonProperties.text_color);
        _updateButtonContainerRule(buttonID, "height", buttonProperties.button_height);
        _updateButtonContainerRule(buttonID, "margin-top", buttonProperties.margin_top);
        _updateButtonContainerRule(buttonID, "margin-bottom", buttonProperties.margin_bottom);

        _updateButtonContainerRule(buttonID, "border-width", buttonProperties.border_width);
        _updateButtonContainerRule(buttonID, "border-color", buttonProperties.border_color);
        _updateButtonContainerRule(buttonID, "border-radius", buttonProperties.border_radius);
        _updateButtonContainerRule(buttonID, "background-color", buttonProperties.background_color);

        _updateButtonBackgroundHoverRule(buttonID, "background-color", buttonProperties.hover_color);

        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + buttonProperties.buttonTarget.button_number + "\"]");
        var $buttonData = $buttonWrapper.find(".rex-button-data").eq(0);

        $buttonWrapper.find(".rex-button-text").eq(0).text(buttonProperties.text);
        $buttonWrapper.find("a.rex-button-container").eq(0).attr("href", buttonProperties.link_taget);
        $buttonWrapper.find("a.rex-button-container").eq(0).attr("type", buttonProperties.link_type);
        $buttonData.attr("data-link-target", buttonProperties.link_taget);
        $buttonData.attr("data-link-type", buttonProperties.link_type);

        if ($buttonWrapper.hasClass("rex-separate-button")) {
            $buttonData.attr("data-button-name", buttonProperties.buttonTarget.button_name);
            $buttonData.attr("data-text-size", buttonProperties.font_size);
            $buttonData.attr("data-text-color", buttonProperties.text_color);
            $buttonData.attr("data-button-height", buttonProperties.button_height);
            $buttonData.attr("data-margin-top", buttonProperties.margin_top);
            $buttonData.attr("data-margin-bottom", buttonProperties.margin_bottom);

            $buttonData.attr("data-background-color", buttonProperties.background_color);
            $buttonData.attr("data-border-color", buttonProperties.border_color);
            $buttonData.attr("data-border-width", buttonProperties.border_width);
            $buttonData.attr("data-border-radius", buttonProperties.border_radius);

            $buttonData.attr("data-background-color-hover", buttonProperties.hover_color);
        } else {
            _removeModelData($buttonWrapper);
        }
    }

    var _removeButtonStyle = function (buttonID) {
        _updateButtonContainerRule(buttonID, "font-size", "");
        _updateButtonContainerRule(buttonID, "color", "");
        _updateButtonContainerRule(buttonID, "height", "");
        _updateButtonContainerRule(buttonID, "margin-top", "");
        _updateButtonContainerRule(buttonID, "margin-bottom", "");

        _updateButtonContainerRule(buttonID, "border-width", "");
        _updateButtonContainerRule(buttonID, "border-color", "");
        _updateButtonContainerRule(buttonID, "border-radius", "");
        _updateButtonContainerRule(buttonID, "border-style", "");
        _updateButtonContainerRule(buttonID, "background-color", "");

        _updateButtonBackgroundHoverRule(buttonID, "background-color", "");
    }

    var _removeSeparateButton = function (data) {
        var buttonID = data.buttonTarget.buttonID;
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]");
        $buttonWrapper.removeClass("rex-separate-button");
        _removeModelData($buttonWrapper);
    }

    var _separateRexButton = function (data) {
        var buttonData = data.buttonData;
        var newID = data.newID;
        var buttonID = buttonData.buttonTarget.button_id;
        console.log(data);
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
        $buttonData.attr("data-border-width", buttonData.border_width);
        $buttonData.attr("data-border-color", buttonData.border_color);
        $buttonData.attr("data-border-radius", buttonData.border_radius);
        $buttonData.attr("data-button-height", buttonData.button_height);
        $buttonData.attr("data-margin-top", buttonData.margin_top);
        $buttonData.attr("data-margin-bottom", buttonData.margin_bottom);
        $buttonData.attr("data-button-name", buttonData.buttonTarget.button_name);
    }

    var _generateButtonData = function ($buttonContainer) {
        var $buttonData = $buttonContainer.find(".rex-button-data").eq(0);
        var buttonID = $buttonContainer.attr("data-rex-button-id");
        var buttonNumber = $buttonContainer.attr("data-rex-button-number");
        var separate = false;
        var buttonName = "";
        
        var buttonData = {
            text_color: "",
            text: $buttonContainer.find(".rex-button-text").eq(0).text(),
            font_size: "",
            background_color: "",
            button_height: "",
            hover_color: "",
            border_color: "",
            border_width: "",
            border_radius: "",
            margin_top: "",
            margin_bottom: "",
            link_taget: $buttonData.attr("data-link-target"),
            link_type: $buttonData.attr("data-link-type"),
            buttonTarget: {
                button_name: buttonName,
                button_id: buttonID,
                button_number: buttonNumber,
            }
        };

        if ($buttonContainer.hasClass("rex-separate-button")) {
            separate = true;
            buttonData.font_size = $buttonData.attr("data-text-size").toString();
            buttonData.text_color = $buttonData.attr("data-text-color").toString();
            buttonData.background_color = $buttonData.attr("data-background-color").toString();
            buttonData.button_height = $buttonData.attr("data-button-height").toString();
            buttonData.hover_color = $buttonData.attr("data-background-color-hover").toString();
            buttonData.border_color = $buttonData.attr("data-border-color").toString();
            buttonData.border_width = $buttonData.attr("data-border-width").toString();
            buttonData.border_radius = $buttonData.attr("data-border-radius").toString();
            buttonData.margin_top = $buttonData.attr("data-margin-top").toString();
            buttonData.margin_bottom = $buttonData.attr("data-margin-bottom").toString();
            buttonData.buttonTarget.button_name = $buttonData.attr("data-button-name").toString();
        }

        var data = {
            separateButton: separate,
            buttonInfo: buttonData
        }
        return data;
    }

    var _linkDocumentListeners = function () {
        Rexbuilder_Util.$document.on("click", ".rex-edit-button-tools", function (e) {
            var $buttonWrapper = $(this).parents(".rex-button-wrapper");
            var data = {
                eventName: "rexlive:openRexButtonEditor",
                buttonData: _generateButtonData($buttonWrapper)
            };
            $buttonWrapper.parents(".text-wrap").blur();
            Rexbuilder_Util_Editor.sendParentIframeMessage(data);
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
        _addToolsButton();
        _linkDocumentListeners();
    };

    return {
        init: init,
        getActiveStyleSheet: _getActiveStyleSheet,
        fixImportedButton: _fixImportedButton,
        getButtonsInPage: _getButtonsInPage,
        updateButtonLive: _updateButtonLive,
        updateButton: _updateButton,
        removeSeparateButton: _removeSeparateButton,
        separateRexButton: _separateRexButton,

        updateButtonContainerRule: _updateButtonContainerRule,
        updateButtonBackgroundRule: _updateButtonBackgroundRule,
        updateButtonBackgroundHoverRule: _updateButtonBackgroundHoverRule
    };
})(jQuery);
