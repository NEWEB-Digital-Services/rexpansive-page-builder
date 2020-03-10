/*
 *  TextFill
 */

;( function( $, window, document, undefined ) {

  "use strict";

  // Create the defaults once
  var pluginName = "textFill",
    defaults = {
      maxFontSize: 100,
      textAlignment: 'center',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      relative: false,
      relativeWrap: '',
    };

  // The actual plugin constructor
  function textFill ( element, options ) {
    this.element = element;

    this.$element = $(element);
    // attach data info to expose it
    // $(this.element).data('perfectGridGallery', this);

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.properties = {
      canvas: null,
      text: '',
      ctx: null,
      img: null,
      background: null,
      lines: null,
      wrap: null,
    };

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend( textFill.prototype, {
    init: function() {
      this._defineSettings();
      this._defineProperties();

      this._attachImage();

      var TF = this;

      $(window).on('resize', function() {
        TF._resizeCanvas();
        TF._drawText();
      });
    },

    _defineSettings: function() {
      this.settings.maxFontSize = parseInt( this.element.dataset.maxFontSize || this.element.getAttribute('data-max-font-size') || this.settings.maxFontSize );

      this.settings.textAlignment = this.element.getElementsByClassName("text-fill-canvas-background")[0].dataset.textAlign ||
        this.element.getElementsByClassName("text-fill-canvas-background")[0].getAttribute('data-text-align') || this.settings.textAlignment;
    },

    _defineProperties: function() {
      this.properties.canvas = this.element.getElementsByClassName("text-fill-canvas")[0];
      this.properties.text = this.properties.canvas.textContent;
      this.properties.ctx = this.properties.canvas.getContext("2d");

      this.properties.img = document.createElement("img");
      this.properties.background = this.element.getElementsByClassName("text-fill-canvas-background")[0].dataset.backSrc ||
					this.element.getElementsByClassName("text-fill-canvas-background")[0].getAttribute('data-back-src');

      if(this.settings.relative && '' !== this.settings.relativeWrap) {
        this.properties.wrap = $(this.element).parents(this.settings.relativeWrap)[0];
      }

    },

    _attachImage: function() {
      this.properties.img.src = this.properties.background;

      var TF = this;

      this.properties.img.onload = function() {
        TF._resizeCanvas();
        TF._drawText();
        TF.$element.trigger('textfill-render-complete');
      }
    },

    _drawText: function() {
      var fontSize = this._calcFontSize(this.settings.maxFontSize);

      // this.properties.ctx.clearRect(0, 0, this.properties.canvas.width, this.properties.canvas.height);	// Clear the canvas
      // set the font in the canvas (to correctly calculate his occupeied space)
      this.properties.ctx.font = this.settings.fontWeight + " " + fontSize + "px " + this.settings.fontFamily;
      // this.properties.ctx.fillStyle = this.properties.ctx.createPattern(this.properties.img, 'repeat');
      // this.properties.ctx.textAlign = this.settings.textAlignment;
      // this.properties.ctx.textBaseline = 'middle';

      this.properties.rows = this._numRows(this.properties.ctx, this.properties.text, (this.properties.relative ? this.properties.wrap.offsetWidth : this.element.offsetWidth) - 20);

      this.properties.canvas.height = this.properties.ctx.height = ( this.properties.rows ) * fontSize;

      // Redraw the canvas
      this.properties.ctx.clearRect(0, 0, this.properties.canvas.width, this.properties.canvas.height);	// Clear the canvas
      this.properties.ctx.font = this.settings.fontWeight + " " + fontSize + "px " + this.settings.fontFamily;
      this.properties.ctx.fillStyle = this.properties.ctx.createPattern(this.properties.img, 'repeat');
      this.properties.ctx.textAlign = this.settings.textAlignment;
      this.properties.ctx.textBaseline = 'middle';

      var x;
      // if(window.innerWidth <= 767 && this.settings.textAlignment != 'center') {
      //   this.properties.ctx.textAlign = this.settings.textAlignment = 'center';
      // }

      switch(this.settings.textAlignment) {
        case 'left':
          x = 0;
          break;
        case 'right':
          x = this.properties.canvas.width;
          break;
        case 'center':
          x = this.properties.canvas.width / 2;
          break;
        default:
          x = this.properties.canvas.width / 2;
          break;
      }

      var y = fontSize/2;

      this._wrapText(this.properties.ctx, this.properties.text, x, y, (this.properties.relative ? this.properties.wrap.offsetWidth : this.element.offsetWidth) - 20, fontSize);
    },

    _calcFontSize: function(maxFont) {
      // var viewportWidth;
      //
  		// if(this.settings.relative) {
  		// 	viewportWidth = this.properties.wrap.offsetWidth;
  		// } else {
  		//  	viewportWidth = window.innerWidth;
  		// }
      //
  		// var q = 24.29,
  		// 	m = 0;
  		// if( maxFont == 0) {
  		// 	m = 0.05;
  		// } else {
  		// 	m = this._calcSlope( [0, 25], [1600, maxFont ] );
  		// }
      //
  		// var y = Math.floor(q + m * viewportWidth);
      var ratio = this.settings.maxFontSize / 1000;
      var size = this.properties.wrap.offsetWidth * ratio;
      var y = size;

  		return y;
    },

    _wrapText: function(context, text, x, y, maxWidth, lineHeight) {
  		var words = text.split(' ');
  		var wordsLenght = context.measureText(words).width;

    	var line = '';
  		// window.global_row_number += rows;

  		//y -= lineHeight/2 * (Math.floor(Math.floor(wordsLenght) / Math.floor(maxWidth)));
  		// y -= lineHeight/2 * this.properties.rows;

  		for(var n = 0; n < words.length; n++) {
  			var testLine = line + words[n] + ' ';
  			var metrics = context.measureText(testLine);
  			var testWidth = metrics.width;
  			if (testWidth > maxWidth && n > 0) {
  				context.fillText(line, x, y);
  				line = words[n] + ' ';
  				y += lineHeight;
  			}
  			else {
  				line = testLine;
  			}
  		}
  		line = line.trim();

  		context.fillText(line, x, y);
  	},

    _numRows: function(context, text, maxWidth) {
  		var coda = new Array();
  		var space = ' ';
  		var words = text.split(' ');
  		var lines = 1;
      var wordL;

  		for(var i = 0; i<words.length; i++) {

  			coda.unshift(space);
  			coda.unshift(words[i]);

  			wordL = this._partialTextLenght(context,coda);

  			if(wordL > maxWidth) {
  				coda.splice(1, coda.length);
  				lines++;
  			}

  		}
      if(lines <= words.length) {
  		  return lines;
      } else {
        // if here a text may be cut
        return words.length;
      }
  	},

    _partialTextLenght: function(context, text) {
  		var l = 0;
  		for(var i = 0;i<text.length; i++) {
  			l += context.measureText(text[i]).width;
  		}
  		return l;
  	},

    _resizeCanvas: function() {
      this.properties.canvas.width = this.properties.ctx.canvas.width = Math.floor( this.properties.relative ? this.properties.wrap.offsetWidth : this.element.offsetWidth );
      this.properties.canvas.height = this.properties.ctx.canvas.height = this._calcFontSize( this.settings.maxFontSize + 50);
    },

    // _canvasX: function(element) {
  	// 	return Math.floor(element.offsetWidth);
  	// },

    _calcSlope: function(A, B) {
      var m = ( B[1] - A[1] ) / ( B[0] - A[0] );
  		return m;
    },

  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
          if (!$.data(this, 'plugin_' + pluginName)) {
              $.data(this, 'plugin_' + pluginName, new textFill( this, options ));
          }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof textFill && typeof instance[options] === 'function') {
          returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }
        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });
      return returns !== undefined ? returns : this;
    }
  };
} )( jQuery, window, document );
