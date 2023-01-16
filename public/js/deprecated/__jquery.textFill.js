/**
 *	Text Fill v1.0
 *	Copyright Neweb
 * 
 *	Creates a Canvas with a perforated text, filled with a background
 */
;(function( $, window, document, undefined ) {
	$.textFill = function(element, options) {
		this.options = {};

		element.data('textFill', this);

		this.init = function(element, options) {
			this.options = $.extend({}, $.textFill.defaultOptions, options); 

			var canvasContainer = element[0],
				canvas = canvasContainer.getElementsByClassName("text-fill-canvas")[0],
				text = canvas.textContent,
				ctx = canvas.getContext("2d"),
				img = document.createElement("img"),
				maxFontSize = canvasContainer.dataset.maxFontSize ||
					canvasContainer.getAttribute('data-max-font-size') || 100,
				textAlignment = canvasContainer.getElementsByClassName("text-fill-canvas-background")[0].dataset.textAlign ||
					canvasContainer.getElementsByClassName("text-fill-canvas-background")[0].getAttribute('data-text-align') || 'center';

			window.global_row_number = 0;

			maxFontSize = parseInt( maxFontSize );

			img.src = canvasContainer.getElementsByClassName("text-fill-canvas-background")[0].dataset.backSrc ||
					canvasContainer.getElementsByClassName("text-fill-canvas-background")[0].getAttribute('data-back-src'); //Cross browser solution

			img.onload= function(){
				resizeCanvas();
				drawText();
				$(canvasContainer).trigger('textfill-render-complete');
			};

			// Drawing the test
			function drawText() {
				var fontSize = calcFontSize(maxFontSize);
				ctx.clearRect(0, 0, canvas.width, canvas.height);	// Clear the canvas
				ctx.font = "bold " + fontSize + "px sans-serif";
				ctx.fillStyle = ctx.createPattern(img, 'repeat');
				ctx.textAlign = textAlignment;
				ctx.textBaseline = 'middle';
				var x;
				if(window.innerWidth <= 767 && textAlignment != 'center') {
					ctx.textAlign = textAlignment = 'center';
				}
				switch(textAlignment) {
					case 'left':
						x = 0;
						break;
					case 'right':
						x = canvas.width;
						break;
					case 'center':
						x = canvas.width / 2;
						break;
					default:
						x = canvas.width / 2;
						break;
				}
				var y = canvas.height / 2;
				wrapText(ctx, text, x, y, canvasX(canvasContainer) - 20, fontSize);
			}

			// HARD resize of the canvas element
			function resizeCanvas() {
				canvas.width = ctx.canvas.width = canvasX(canvasContainer);
				//canvas.height = ctx.canvas.height = canvasY(canvasContainer);
				canvas.height = ctx.canvas.height = canvasY( maxFontSize + 50);
			}

			// Handlers of the resize event for redrawing the text in the canvas
			window.addEventListener('resize', resizeCanvas);
			window.addEventListener('resize', drawText);
			
			$(window).resize();
		};

		// Public functions

		this.init(element, options);

	};

	$.fn.textFill = function(options) {                   
		return this.each(function() {
			(new $.textFill($(this), options));              
		});
	};

	//Private functions

	// Calculate the font size we want, based on the coefficients of a linear function
	function calcFontSize( maxFont ) {
		var viewportWidth = window.innerWidth,
			q = 24.29,
			m = 0;
		if( maxFont === 0) {
			m = 0.05;
		} else {
			m = calcSlope( [0, 25], [1600, maxFont ] );
		}
		
		var y = Math.floor(q + m * viewportWidth);
		return y;
	}

	function calcSlope(A, B) {
		var m = ( B[1] - A[1] ) / ( B[0] - A[0] );
		return m;
	}

	// Return the dimensions of the canvas container
	function canvasX(element) {
		return Math.floor(element.offsetWidth);
	}

	function canvasY(element) {
		//return Math.floor(element.offsetHeight);
		return calcFontSize( element );
	}

	// Draws a wrapped text
	function wrapText(context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var wordsLenght = context.measureText(words).width;
		
		var line = '';
		var rows = numRows(context, text, maxWidth);

		window.global_row_number += rows;

		//y -= lineHeight/2 * (Math.floor(Math.floor(wordsLenght) / Math.floor(maxWidth)));
		y -= lineHeight/2 * rows;

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
	}

	// Calculate the number of the rows for a determinate text in the canvas, based on a Max Width
	function numRows(context, text, maxWidth) {
		var coda = [];
		var space = ' ';
		var words = text.split(' ');
		var lines = 0;

		for(var i = 0; i<words.length; i++) {
			coda.unshift(space);
			coda.unshift(words[i]);
			wordL = partialTextLenght(context,coda);
			if(wordL > maxWidth) {
				coda.splice(1, coda.length);
				lines++;
			}
		}
		return lines;
	}

	// Calculate the lenght of a partial text in a canvas
	function partialTextLenght(context, text) {
		var l = 0;
		for(var i = 0;i<text.length; i++) {
			l += context.measureText(text[i]).width;
		}
		return l;
	}

	$.textFill.defaultOptions = {};
 
})( jQuery, window, document );