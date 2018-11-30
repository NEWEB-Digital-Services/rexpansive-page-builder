var Rexlive_Gradient_Utils = (function($) {
  var shape = "ellipse";

  function getNewLinearPos(inputPos) {
    inputPos = inputPos.toLowerCase().trim();
    if (inputPos == "top left") return "bottom right";
    if (inputPos == "top") return "bottom";
    if (inputPos == "top right") return "bottom left";
    if (inputPos == "left") return "right";
    if (inputPos == "right") return "left";
    if (inputPos == "bottom left") return "top right";
    if (inputPos == "bottom") return "top";
    if (inputPos == "bottom right") return "top left";
    return "top";
  }

  function radialgradient_findMaxDistanceToCorners(w, h, x, y) {
    var theX = Math.max(x, w - x);
    var theY = Math.max(y, h - y);
    return Math.pow(Math.pow(theY, 2) + Math.pow(theX, 2), 0.5);
  }
  function radialgradient_findMinDistanceToCorners(w, h, x, y) {
    var theX = Math.min(x, w - x);
    var theY = Math.min(y, h - y);
    return Math.pow(Math.pow(theY, 2) + Math.pow(theX, 2), 0.5);
  }
  function radialgradient_findMaxDistanceToSides(w, h, x, y) {
    var theX = Math.max(x, w - x);
    var theY = Math.max(y, h - y);
    return Math.max(theX, theY);
  }
  function radialgradient_findMinDistanceToSides(w, h, x, y) {
    var theX = Math.min(x, w - x);
    var theY = Math.min(y, h - y);
    return Math.min(theX, theY);
  }

  function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
  }

  function lineargradient_w3c(direction, handlers) {
    var angle, direction;
    direction = "to " + getNewLinearPos(direction) + ", ";

    var stops = "";
    for (var i = 0; i < handlers.length; i++) {
      stops += handlers[i].color + " " + handlers[i].position + "%, ";
    }

    var newSample = "linear-gradient(" + direction;
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
  }

  function lineargradient_gecko(inputPos, handlers) {
    var angle, directionmoz;
    if (inputPos == "top left") {
      directionmoz = "top left, ";
    }
    if (inputPos == "top") {
      directionmoz = "top, ";
    }
    if (inputPos == "center") {
      directionmoz = "top, ";
    }
    if (inputPos == "top right") {
      directionmoz = "top right, ";
    }
    if (inputPos == "left") {
      directionmoz = "left, ";
    }
    if (inputPos == "right") {
      directionmoz = "right, ";
    }
    if (inputPos == "bottom left") {
      directionmoz = "bottom left, ";
    }
    if (inputPos == "bottom") {
      directionmoz = "bottom, ";
    }
    if (inputPos == "bottom right") {
      directionmoz = "bottom right, ";
    }

    var stops = "";
    for (var i = 0; i < handlers.length; i++) {
      stops += handlers[i].color + " " + handlers[i].position + "%, ";
    }

    var newSample = "-moz-linear-gradient(" + directionmoz;
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
  }

  function lineargradient_webkit(inputPos, handlers) {
    var directionwebkit;
    if (inputPos == "top left") {
      directionwebkit = "left top, right bottom, ";
    }
    if (inputPos == "top") {
      directionwebkit = "left top, left bottom, ";
    }
    if (inputPos == "center") {
      directionwebkit = "left top, left bottom, ";
    }
    if (inputPos == "top right") {
      directionwebkit = "right top, left bottom, ";
    }
    if (inputPos == "left") {
      directionwebkit = "left top, right top, ";
    }
    if (inputPos == "right") {
      directionwebkit = "right top, left top, ";
    }
    if (inputPos == "bottom left") {
      directionwebkit = "left bottom, right top, ";
    }
    if (inputPos == "bottom") {
      directionwebkit = "left bottom, left top, ";
    }
    if (inputPos == "bottom right") {
      directionwebkit = "right bottom, left top, ";
    }

    var stops = "";
    for (var i = 0; i < handlers.length; i++) {
      stops += "color-stop(" + handlers[i].position + ", " + handlers[i].color + "), ";
    }

    var newSample = "-webkit-gradient(linear, " + directionwebkit;
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
  }

  function radialgradient_gecko(inputPos, handlers, inputSize) {
    var position, x, y;

    if (inputPos == "top left") {
      position = "left top";
    }
    if (inputPos == "top center") {
      position = "center top";
    }
    if (inputPos == "top right") {
      position = "right top";
    }
    if (inputPos == "middle left") {
      position = "left center";
    }
    if (inputPos == "middle center") {
      position = "center";
    }
    if (inputPos == "center") {
      position = "center";
    }
    if (inputPos == "middle right") {
      position = "right center";
    }
    if (inputPos == "bottom left") {
      position = "left bottom";
    }
    if (inputPos == "bottom center") {
      position = "center bottom";
    }
    if (inputPos == "bottom right") {
      position = "right bottom";
    }

    var stops = "";
    for (var i = 0; i < handlers.length; i++) {
      stops += handlers[i].color + " " + handlers[i].position + "%, ";
    }

    dispInputSize = inputSize.toString().toLowerCase();

    var newSample =
      "-moz-radial-gradient(" +
      position +
      ", " +
      shape +
      " " +
      dispInputSize +
      ", ";
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
  }

  function radialgradient_w3c(inputPos, handlers, inputSize) {
    var position, x, y;

    if (inputPos == "top left") {
      position = "at left top";
    }
    if (inputPos == "top center") {
      position = "at center top";
    }
    if (inputPos == "top right") {
      position = "at right top";
    }
    if (inputPos == "middle left") {
      position = "at left center";
    }
    if (inputPos == "middle center") {
      position = "at center";
    }
    if (inputPos == "center") {
      position = "at center";
    }
    if (inputPos == "middle right") {
      position = "at right center";
    }
    if (inputPos == "bottom left") {
      position = "at left bottom";
    }
    if (inputPos == "bottom center") {
      position = "at center bottom";
    }
    if (inputPos == "bottom right") {
      position = "at right bottom";
    }

    var stops = "";
    for (var i = 0; i < handlers.length; i++) {
      stops += handlers[i].color + " " + handlers[i].position + "%, ";
    }

    dispInputSize = inputSize.toString().toLowerCase();

    var newSample =
      "radial-gradient(" + shape + " " + dispInputSize + " " + position + ", ";
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
  }

  function radialgradient_webkit(inputPos, handlers) {
    var position, posx, posy;

    if (inputPos == "top left") {
      position = "left top";
    }
    if (inputPos == "top center") {
      position = "center top";
    }
    if (inputPos == "top right") {
      position = "right top";
    }
    if (inputPos == "middle left") {
      position = "left center";
    }
    if (inputPos == "middle center") {
      position = "center center";
    }
    if (inputPos == "center") {
      position = "center center";
    }
    if (inputPos == "middle right") {
      position = "right center";
    }
    if (inputPos == "bottom left") {
      position = "left bottom";
    }
    if (inputPos == "bottom center") {
      position = "center bottom";
    }
    if (inputPos == "bottom right") {
      position = "right bottom";
    }
    var stops = "";
    for (var i = 0; i < handlers.length; i++) {
      stops += "color-stop(" + handlers[i].position + ", " + handlers[i].color + "), ";
    }

    var newSample =
      "-webkit-gradient(radial, " +
      position +
      ", 0, " +
      position +
      ", " +
      100 +
      ", ";
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
  }

  function getMarkup(gradientType, inputPos, handlers, inputSize) {
    console.log(gradientType, inputPos, handlers, inputSize);
    if (gradientType == "linear") {
      w3c = lineargradient_w3c(inputPos, handlers);
      gecko = lineargradient_gecko(inputPos, handlers);
      oldwebkit = lineargradient_webkit(inputPos, handlers);
      newwebkit = gecko.replace("-moz-", "-webkit-");
      opera = gecko.replace("-moz-", "-o-");
      ms = gecko.replace("-moz-", "-ms-");
    } else if (gradientType == "radial") {
      gecko = radialgradient_gecko(inputPos, handlers, inputSize);
      w3c = radialgradient_w3c(inputPos, handlers, inputSize);
      oldwebkit = radialgradient_webkit(inputPos, handlers, inputSize);
      newwebkit = gecko.replace("-moz-", "-webkit-");
      opera = gecko.replace("-moz-", "-o-");
      ms = gecko.replace("-moz-", "-ms-");
    } else {
      return;
    }
    markup = "";

    markup += "background:" + ms + ";";
    markup += "background:" + gecko + ";";
    markup += "background:" + opera + ";";
    markup += "background:" + oldwebkit + ";";
    markup += "background:" + newwebkit + ";";
    markup += "background:" + w3c + ";";
    markup += _textGradientRuleset();

    return markup;
  }

  var _textGradientRuleset = function() {
    return "-webkit-background-clip:text;-webkit-text-fill-color:transparent;";
  }

  return {
    getMarkup: getMarkup,
  };
})(jQuery);
