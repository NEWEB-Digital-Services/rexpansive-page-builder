
var Rexbuilder_Rexbutton = (function ($) {
    "use strict";
    var styleSheet;
    var buttonsInPage;
    var buttonsIDsUsed;

    var _fixCustomStyleElement = function () {
        if (Rexbuilder_Rexbutton.$buttonsStyle.length == 0) {
            var css = "",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            style.id = "rexpansive-builder-rexbutton-style";
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
            if (document.styleSheets[i].ownerNode.id == "rexpansive-builder-rexbutton-style") {
                styleSheet = document.styleSheets[i];
            }
        }
    };

    var _fixImportedButton = function () {
        var $buttonWrapper = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-button-wrapper");
        // fixing position of medium buttons
        // inutile?
        /*
        var $textWrap = $buttonWrapper.parents(".text-wrap");
        var $insertButtons = $textWrap.find(".medium-insert-buttons");
        if ($insertButtons.length == 1 && !$insertButtons.is(':last-child')) {
            $insertButtons.detach().appendTo($textWrap);
        }
        */

        $buttonWrapper.unwrap();
        $buttonWrapper.wrap("<p></p>");

        var buttonID = $buttonWrapper.attr("data-rex-button-id");
        var flagButtonFound = false;
        for (var i = 0; i < buttonsInPage.length; i++) {
            if (buttonsInPage[i] == buttonID) {
                flagButtonFound = true;
                break;
            }
        }
        if (!flagButtonFound) {
            _addButtonStyle($buttonWrapper);
            buttonsInPage.push(buttonID);
        }
        _linkHoverListeners($buttonWrapper);
    }

    var _addButtonContainerRule = function (buttonID, property) {
        styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container{" + property + ";}", styleSheet.cssRules.length);
    }

    var _removeButtonContainerRule = function (buttonID, ruleName) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container"
                && styleSheet.cssRules[i].style[0] == ruleName) {
                styleSheet.deleteRule(i);
            }
        }
    }

    var _addButtonBackgroundRule = function (buttonID, property) {
        styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background{" + property + ";}", styleSheet.cssRules.length);
    }

    var _removeButtonBackgroundRule = function (buttonID, ruleName) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background"
                && styleSheet.cssRules[i].style[0] == ruleName) {
                styleSheet.deleteRule(i);
            }
        }
    }

    var _addButtonBackgroundRuleHover = function (buttonID, property) {
        styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover{" + property + ";}", styleSheet.cssRules.length);
    }

    var _removeButtonBackgroundRuleHover = function (buttonID, ruleName) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover"
                && styleSheet.cssRules[i].style[0] == ruleName) {
                styleSheet.deleteRule(i);
            }
        }
    }

    var _getActiveStyleSheet = function () {
        return styleSheet;
    }

    var _linkHoverListeners = function ($button) {
        $button.hover(function () {
            $button.find(".rex-edit-button").addClass("rex-show-buttons-tools");
        }, function () {
            $button.find(".rex-edit-button").removeClass("rex-show-buttons-tools");
        });
    }

    var _addToolsButton = function () {
        Rexbuilder_Util.$rexContainer.find(".rex-button-container").each(function (i, button) {
            var $button = $(button);
            if ($button.find(".rex-edit-button").length == 0) {
                var $spanEl = $(document.createElement("span"));
                $spanEl.addClass("rex-edit-button");
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
        _addButtonContainerRule(buttonID, "font-size: " + buttonProperties.font_size);
        _addButtonContainerRule(buttonID, "color: " + buttonProperties.text_color);
        _addButtonContainerRule(buttonID, "height: " + buttonProperties.button_height);
        _addButtonContainerRule(buttonID, "margin-top: " + buttonProperties.margin_top);
        _addButtonContainerRule(buttonID, "margin-bottom: " + buttonProperties.margin_bottom);

        _addButtonBackgroundRule(buttonID, "border-width: " + buttonProperties.border_width);
        _addButtonBackgroundRule(buttonID, "border-color: " + buttonProperties.border_color);
        _addButtonBackgroundRule(buttonID, "border-style: solid");
        _addButtonBackgroundRule(buttonID, "border-radius: " + buttonProperties.border_radius);
        _addButtonBackgroundRule(buttonID, "background-color: " + buttonProperties.background_color);

        _addButtonBackgroundRuleHover(buttonID, "background-color: " + buttonProperties.hover_color);
    }

    var _updateButtonStyleLive = function (data) {
        //per i gradienti
        /*
        if(data.propertyName == "gradient"){
            // do stuff
        }
        
        data type:
       
       {
        buttonID: "qaz1",
        propertyType: "container",
        propertyName: "height",
        newValue: "30px"
       }
       */

        switch (data.propertyType) {
            case "container":
                _removeButtonContainerRule(data.buttonID, data.propertyName);
                _addButtonContainerRule(data.buttonID, data.propertyName + ": " + data.newValue);
                break;
            case "background":
                _removeButtonBackgroundRule(data.buttonID, data.propertyName);
                _addButtonBackgroundRule(data.buttonID, data.propertyName + ": " + data.newValue);
                break;
            case "backgroundHover":
                _removeButtonBackgroundRuleHover(data.buttonID, data.propertyName);
                _addButtonBackgroundRuleHover(data.buttonID, data.propertyName + ": " + data.newValue);
                break;
            default:
                break;
        }
    }

    var _updateButton = function(data){      
        var buttonProperties = data;
        var buttonID =  buttonProperties.buttonTarget.buttonID;
        _removeButtonContainerRule(buttonID, "font-size");
        _addButtonContainerRule(buttonID, "font-size: " + buttonProperties.font_size);
        _removeButtonContainerRule(buttonID, "color");
        _addButtonContainerRule(buttonID, "color: " + buttonProperties.text_color);
        _removeButtonContainerRule(buttonID, "height");
        _addButtonContainerRule(buttonID, "height: " + buttonProperties.button_height);
        _removeButtonContainerRule(buttonID, "margin-top");
        _addButtonContainerRule(buttonID, "margin-top: " + buttonProperties.margin_top);
        _removeButtonContainerRule(buttonID, "margin-bottom");
        _addButtonContainerRule(buttonID, "margin-bottom: " + buttonProperties.margin_bottom);
        
        _removeButtonBackgroundRule(buttonID, "border-width");
        _addButtonBackgroundRule(buttonID, "border-width: " + buttonProperties.border_width);
        _removeButtonBackgroundRule(buttonID, "border-color");
        _addButtonBackgroundRule(buttonID, "border-color: " + buttonProperties.border_color);        
        _removeButtonBackgroundRule(buttonID, "border-radius");
        _addButtonBackgroundRule(buttonID, "border-radius: " + buttonProperties.border_radius);
        _removeButtonBackgroundRule(buttonID, "background-color");
        _addButtonBackgroundRule(buttonID, "background-color: " + buttonProperties.background_color);
        
        _removeButtonBackgroundRuleHover(buttonID, "background-color");
        _addButtonBackgroundRuleHover(buttonID, "background-color: " + buttonProperties.hover_color);

        $buttonContainer = Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"][data-rex-button-number=\"" + data.buttonTarget.button_number + "\"]");
        $buttonData = $buttonContainer.find(".rex-button-data").eq(0);
        $buttonData.attr("data-button-name", data.buttonTarget.buttonName);
        $buttonData.attr("data-text-size");
        $buttonData.attr("data-text-color");
        $buttonData.attr("data-background-color");
        $buttonData.attr("data-button-height");
        $buttonData.attr("data-background-color-hover");
        $buttonData.attr("data-border-color");
        $buttonData.attr("data-border-width");
        $buttonData.attr("data-border-radius");
        $buttonData.attr("data-margin-top");
        $buttonData.attr("data-margin-bottom");
    }

    var _removeButtonStyle = function (buttonID) {
        _removeButtonContainerRule(buttonID, "font-size");
        _removeButtonContainerRule(buttonID, "color");
        _removeButtonContainerRule(buttonID, "height");
        _removeButtonContainerRule(buttonID, "margin-top");
        _removeButtonContainerRule(buttonID, "margin-bottom");

        _removeButtonBackgroundRule(buttonID, "border-width");
        _removeButtonBackgroundRule(buttonID, "border-color");
        _removeButtonBackgroundRule(buttonID, "border-style");
        _removeButtonBackgroundRule(buttonID, "border-radius");
        _removeButtonBackgroundRule(buttonID, "background-color");

        _removeButtonBackgroundRuleHover(buttonID, "background-color");
    }

    var _generateButtonData = function ($buttonContainer) {
        //da fixare
        var buttonID = $buttonContainer.attr("data-rex-button-id");
        var buttonNumber = 0;
        var buttonName = "";
        var $button_element = $buttonContainer.find(".rex-button").eq(0);
        var separate = false;
        var buttonData = {
            text_color: "",
            text: $button_element.find(".rex-button-text").eq(0).text(),
            font_size: "",
            background_color: "",
            button_height: "",
            hover_color: "",
            border_color: "",
            border_width: "",
            border_radius: "",
            button_position: "",
            margin_top: "",
            margin_bottom: "",
            link_taget: $button_element.attr("href"),
            link_type: $button_element.attr("type"),
            buttonTarget: {
                button_name: buttonName,
                button_id: buttonID,
                button_number: buttonNumber,
            }
        };

        if ($buttonContainer.hasClass("rex-separate-button")) {
            separate = true;
            var $buttonData = $buttonContainer.find("." + buttonID + "-rex-button-data").eq(0);
            if ($buttonData.length != 0) {
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
            }
        }

        var data = {
            separateButton: separate,
            buttonInfo: buttonData
        }
        return data;
    }

    var _linkDocumentListeners = function () {
        Rexbuilder_Util.$document.on("click", ".rex-edit-button", function (e) {
            var $buttonWrapper = $(this).parents(".rex-button-wrapper");
            var data = {
                eventName: "rexlive:openRexButtonEditor",
                buttonData: _generateButtonData($buttonWrapper)
            };
            $buttonContainer.parents(".text-wrap").blur();
            Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        });
    }

    var _updateButtonListInPage = function () {
        var j;
        var flagButtonFound = false;
        Rexbuilder_Util.$rexContainer.find(".rex-button-wrapper").each(function (i, button) {
            var $buttonWrapper = $(button);
            var buttonID = $buttonWrapper.attr("data-rex-button-id");
            flagButtonFound = false;
            for (j = 0; j < buttonsInPage.length; j++) {
                if (buttonsInPage[j] == buttonID) {
                    flagButtonFound = true;
                    break;
                }
            }
            flagButtonFound = false;
            if (!flagButtonFound) {
                buttonsInPage.push(buttonID);
                if ($buttonWrapper.hasClass("rex-separate-button")) {
                }
                _addButtonStyle($buttonWrapper);
            }
        });
    }

    var _getButtonsInPage = function () {
        return buttonsInPage;
    }

    var init = function () {
        styleSheet = null;
        buttonsInPage = [];
        buttonsIDsUsed = JSON.parse($("#rex-buttons-ids-used").text());

        this.$buttonsStyle = $("#rexpansive-builder-rexbutton-style");
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
        updateButtonStyleLive: _updateButtonStyleLive
    };
})(jQuery);
