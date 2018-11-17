
var Rexbuilder_Rexbutton = (function ($) {
    "use strict";
    var styleSheet;

    var _fixCustomStyleElement = function () {
        if (Rexbuilder_Rexbutton.$buttonsStyle.length == 0) {
            var css = "",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            style.id = "rexpansive-builder-rexbutton-style";
            style.dataset.rexName ="buttons-style";
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }
        for (var i = 0; i < document.styleSheets.length; i++){
            if (document.styleSheets[i].ownerNode.id == "rexpansive-builder-rexbutton-style"){
                styleSheet = document.styleSheets[i];
            }
        }
        _addHoverStyle("qaz1", "rgb(120,0,255)");
    };

    var _addHoverStyle = function (buttonID, newColor) {
        styleSheet.insertRule("." + buttonID + "-rex-button-container:hover{background-color: " + newColor + ";}", styleSheet.cssRules.length);
    }

    var _removeHoverStyle = function (buttonID) {
        console.log(styleSheet);
        var index = 0;
        for (var i = 0; i < styleSheet.cssRules.length; i++){
            if (styleSheet.cssRules[i].selectorText == "." + buttonID + "-rex-button-container:hover"){
                index = i;
                break;
            }
        }
        styleSheet.deleteRule(index);
    }
    var _getStyleSheets = function (){
        return document.styleSheets;
    }

    var init = function () {
        styleSheet = null;
        this.$buttonsStyle = $("#rexpansive-builder-rexbutton-style");
        _fixCustomStyleElement();
    };
    
    return {
        init: init,
        getStyleSheets: _getStyleSheets,
        addHoverStyle: _addHoverStyle,
        removeHoverStyle: _removeHoverStyle
    };
})(jQuery);
