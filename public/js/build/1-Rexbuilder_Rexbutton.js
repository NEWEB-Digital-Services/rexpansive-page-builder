
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
        if ($insertButtons.length == 1 && !$insertButtons.is(':last-child')){
            $insertButtons.detach().appendTo($textWrap);
        }

        $buttonContainer.unwrap();
        $buttonContainer.wrap("<p></p>");
    }

    var _addHoverBackgroundColor = function (buttonID, newColor) {
        _addHoverStyle(buttonID, "background-color: " + newColor);
    }

    var _addHoverStyle = function (buttonID, property) {
        styleSheet.insertRule("." + buttonID + "-rex-button-container:hover{" + property + ";}", styleSheet.cssRules.length);
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
        console.log("linking hover");
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
            //aggiornare lista dei pulsanti nella pagina, fixare lo stile dei pulsanti solo nella pagina
            _linkHoverListeners($button);
        });
    }
    
    var init = function () {
        styleSheet = null;
        buttonsInPage = [];
        this.$buttonsStyle = $("#rexpansive-builder-rexbutton-style");
        _addToolsButton();

        Rexbuilder_Util.$document.on("click", ".rex-edit-button", function (e) {
            var $buttonContainer = $(this).parents(".rex-button-container");
            var buttonID = $buttonContainer.attr("data-rex-button-id");
            var buttonNumber = 0;
            var data = {
                eventName: "rexlive:openRexButtonEditor"
            };
            $buttonContainer.parents(".text-wrap").blur();
            Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        });
        _fixCustomStyleElement();
    };

    return {
        init: init,
        getActiveStyleSheet: _getActiveStyleSheet,
        addHoverBackgroundColor: _addHoverBackgroundColor,
        removeHoverBackgroundColor: _removeHoverBackgroundColor,
        fixImportedButton: _fixImportedButton
    };
})(jQuery);
