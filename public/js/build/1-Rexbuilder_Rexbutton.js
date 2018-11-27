
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
        var $buttonContainer = Rexbuilder_Util.$rexContainer.find(".rex-loading-button .rex-button-container");
        var $textWrap = $buttonContainer.parents(".text-wrap");
        // fixing position of medium buttons
        var $insertButtons = $textWrap.find(".medium-insert-buttons");
        if ($insertButtons.length == 1 && !$insertButtons.is(':last-child')) {
            $insertButtons.detach().appendTo($textWrap);
        }

        $buttonContainer.unwrap();
        $buttonContainer.wrap("<p></p>");

        var buttonID = $buttonContainer.attr("data-rex-button-id");
        var flagButtonFound = false;
        for (var i = 0; i < buttonsInPage.length; i++) {
            if (buttonsInPage[i] == buttonID) {
                flagButtonFound = true;
                break;
            }
        }
        if (!flagButtonFound) {
            _addButtonStyle($buttonContainer);
            buttonsInPage.push(buttonID);
        }
        _linkHoverListeners($buttonContainer);
    }

    var _addHoverBackgroundColor = function (buttonID, newColor) {
        _addHoverRule(buttonID, "background-color: " + newColor);
    }

    var _addHoverRule = function (buttonID, property) {
        styleSheet.insertRule("." + buttonID + "-rex-button-container:hover{" + property + ";}", styleSheet.cssRules.length);
    }

    var _addStyleRule = function (buttonID, property) {
        styleSheet.insertRule("." + buttonID + "-rex-button-container{" + property + ";}", styleSheet.cssRules.length);
    }

    var _removeHoverBackgroundColor = function (buttonID) {
        _removeHoverStyle(buttonID, "background-color");
    }

    var _removeHoverStyle = function (buttonID, propertyName) {
        var index = 0;
        // rimuove tutte le regole che si applicano su property name
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == "." + buttonID + "-rex-button-container:hover"
                && styleSheet.cssRules[i].style[0] == propertyName) {
                index = i;
                styleSheet.deleteRule(index);
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

    /**
    <span class="rex-button-container" data-rex-button-id="qaz1">
        <a href="https://www.google.com" class="qaz1-rex-button-container rex-button">
            <span class="qaz1-rex-button-data" style="display:none;" data-text-color="white" data-text-size="24px" data-background-color="red" data-background-color-hover="rgb(120,0,255)" data-border-width="5px" data-border-color="rgba(0,120,255,0.5)" data-border-radius="30px" data-button-height="30px" data-margin-top="0px" data-margin-bottom="10px" data-link-target="https://www.google.com" data-link-type="" data-button-model-name="Bel pulsante"></span>
            <span class="qaz1-rex-button-text">LABEL</span>
        </a>
    </span>
    */
    var _addButtonStyle = function ($button) {
        var buttonID = $button.attr("data-rex-button-id");
        var $buttonData = $button.find("." + buttonID + "-rex-button-data").eq(0);
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
        _addStyleRule(buttonID, "font-size: " + buttonProperties.font_size);
        _addStyleRule(buttonID, "color: " + buttonProperties.text_color);
        _addStyleRule(buttonID, "background-color: " + buttonProperties.background_color);
        _addStyleRule(buttonID, "height: " + buttonProperties.button_height);
        _addStyleRule(buttonID, "border-width: " + buttonProperties.border_width);
        _addStyleRule(buttonID, "border-color: " + buttonProperties.border_color);
        _addStyleRule(buttonID, "border-radius: " + buttonProperties.border_radius);
        _addStyleRule(buttonID, "margin-top: " + buttonProperties.margin_top);
        _addStyleRule(buttonID, "margin-bottom: " + buttonProperties.margin_bottom);

        _addHoverRule(buttonID, "background-color: " + buttonProperties.hover_color);
    }

    var _removeButtonStyle = function () {

    }

    var _updateButtonsInPage = function () {
        var j;
        var flagButtonFound = false;
        Rexbuilder_Util.$rexContainer.find(".rex-button-container").each(function (i, button) {
            var $button = $(button);
            var buttonID = $button.attr("data-rex-button-id");
            flagButtonFound = false;
            for (j = 0; j < buttonsInPage.length; j++) {
                if (buttonsInPage[j] == buttonID) {
                    flagButtonFound = true;
                    break;
                }
            }
            flagButtonFound = false;
            if (!flagButtonFound) {
                _addButtonStyle($button);
                buttonsInPage.push(buttonID);
            }
        });
    }

    var _generateButtonData = function ($buttonContainer) {
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
            var $buttonContainer = $(this).parents(".rex-button-container");
            var data = {
                eventName: "rexlive:openRexButtonEditor",
                buttonData: _generateButtonData($buttonContainer)
            };
            $buttonContainer.parents(".text-wrap").blur();
            Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        });
    }

    var _fixButtonsInPage = function () {
        var flagButtonFound, j;
        Rexbuilder_Util.$rexContainer.find(".rex-button-container").each(function (i, button) {
            var $button = $(button);
            if (!$button.hasClass("rex-separate-button")) {
                var buttonID = $button.attr("data-rex-button-id");
                flagButtonFound = false;
                for (j = 0; j < buttonsInPage.length; j++) {
                    if (buttonsInPage[j] == buttonID) {
                        flagButtonFound = true;
                        break;
                    }
                }
                if (!flagButtonFound) {
                    buttonsInPage.push(buttonID);
                }
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

        _fixButtonsInPage();
        _fixCustomStyleElement();
        _updateButtonsInPage();
        _addToolsButton();
        _linkDocumentListeners();
    };

    return {
        init: init,
        getActiveStyleSheet: _getActiveStyleSheet,
        addHoverBackgroundColor: _addHoverBackgroundColor,
        removeHoverBackgroundColor: _removeHoverBackgroundColor,
        fixImportedButton: _fixImportedButton,
        getButtonsInPage: _getButtonsInPage
    };
})(jQuery);
