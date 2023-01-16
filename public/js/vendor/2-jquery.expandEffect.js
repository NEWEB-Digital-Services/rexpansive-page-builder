/**
 *	Expand Effect v1.0
 *	Copyright Neweb
 *
 *	A plugin that adds a awesome effect on a big image 
 *	
 *	TODO: Add hover effect on images (via CSS)
 */
;(function( $, window, document, undefined ) {
	$.expandEffect = function(element, options) {
		this.options = {};

		element.data('expandEffect', this);

		this.init = function(element, options) {         
			this.options = $.extend({}, $.expandEffect.defaultOptions, options);

			// detect if IE : from http://stackoverflow.com/a/16657946		
			var ie = (function(){
				var undef,rv = -1; // Return value assumes failure.
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf('MSIE ');
				var trident = ua.indexOf('Trident/');

				if (msie > 0) {
					// IE 10 or older => return version number
					rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
				} else if (trident > 0) {
					// IE 11 (or newer) => return version number
					var rvNum = ua.indexOf('rv:');
					rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
				}

				return ((rv > -1) ? rv : undef);
			}());


			// disable/enable scroll (mousewheel and keys) from http://stackoverflow.com/a/4770179					
			// left: 37, up: 38, right: 39, down: 40,
			// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
			var keys = [32, 37, 38, 39, 40], wheelIter = 0;

			function preventDefault(e) {
				e = e || window.event;
				if (e.preventDefault)
				e.preventDefault();
				e.returnValue = false;  
			}

			function keydown(e) {
				for (var i = keys.length; i--;) {
					if (e.keyCode === keys[i]) {
						preventDefault(e);
						return;
					}
				}
			}

			function touchmove(e) {
				preventDefault(e);
			}

			function wheel(e) {
				// for IE 
				//if( ie ) {
					//preventDefault(e);
				//}
			}

			function disable_scroll() {
				window.onmousewheel = document.onmousewheel = wheel;
				document.onkeydown = keydown;
				document.body.ontouchmove = touchmove;
			}

			function enable_scroll() {
				window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;  
			}

			var docElem = window.document.documentElement,
				scrollVal,
				isRevealed, 
				noscroll, 
				isAnimating,
				sidewrap = element,
				foregroundImage = $(sidewrap).find('.zak-hovered-image'),
				visualInterval;

			function scrollY() {
				return window.pageYOffset || docElem.scrollTop;
			}

			// Create a function that detect if the containers to animate are inside or outside the viewport
			/*function scrollYMulti( el ) {
				if( ( el.offsetTop <= window.pageYOffset + window.innerHeight ) && ( el.offsetTop + el.offsetHeight >= window.pageYOffset ) ) {
				} else {
					classie.add(el, 'notrans');
				}
			}*/

			// Modify the original function to handle multiple containers
			/*function scrollPageMulti() {

				scrollVal = scrollY();
				
				if( noscroll && !ie ) {
					if( scrollVal < 0 ) return false;
					// keep it that way
					window.scrollTo( 0, 0 );
				}

				for( i=0;i<sidewrap.length;i++ ) {
					if( classie.has( sidewrap[i], 'notrans' ) ) {
						classie.remove( sidewrap[i], 'notrans' );
						return false;
					}
				}

				if( isAnimating ) {
					return false;
				}
				
				if( scrollVal <= 0 && isRevealed ) {
					toggleMulti(0);
				}
				else if( scrollVal > 0 && !isRevealed ){
					toggleMulti(1);
				}
			}*/

			// Modify the original function to handle multiple containers
			/*function toggleMulti( reveal ) {
				isAnimating = true;
				
				for( i=0; i<sidewrap.length; i++){
					if( reveal ) {
						classie.add( sidewrap[i], 'active' );
					}
					else {
						noscroll = true;
						//disable_scroll();
						classie.remove( sidewrap[i], 'active' );
					}
				}

				// simulating the end of the transition:
				setTimeout( function() {
					isRevealed = !isRevealed;
					isAnimating = false;
					if( reveal ) {
						noscroll = false;
						enable_scroll();
					}
				}, 600 );
			}*/

			// Create a function to detect the position of the containers among the viewport
			function detectPosition( e ) {
				//var h = window.innerHeight * 0.05;
				var topOffset = cumulativeOffset(e).top;
				//var h = 0;
				var h = $(e).find('.expanded-image').height() * -0.15;
				//var h = parseInt($(e).css('padding-top')) * -1;
				//h = -200;
				//console.log(sidewrap.find('.expanded-image').height());
				//console.log(h);

				//if( (e.offsetTop - h <= window.pageYOffset) && (e.offsetTop + e.offsetHeight - h >= window.pageYOffset) ) {
				if( (topOffset - h <= window.pageYOffset) && (topOffset + e.offsetHeight - h >= window.pageYOffset) ) {
					if( classie.has( e, 'notrans' ) ) {
						classie.remove( e, 'notrans' );
					}
					//visualInterval = setTimeout(function() {
						classie.add(e, 'active');
					//}, 5000);
				} else {
					classie.remove(e, 'active');
					//clearInterval(visualInterval);
				}

				//if( ( e.offsetTop > window.pageYOffset + window.innerHeight ) && ( e.offsetTop + e.offsetHeight < window.pageYOffset ) ) {
				if( ( topOffset > window.pageYOffset + window.innerHeight ) && ( topOffset + e.offsetHeight < window.pageYOffset ) ) {
					classie.add(e, 'notrans');
				}
			}

			// Create the new handler for the scroll effect
			function handleScroll() {
				if($(window).innerWidth() >= 768) {
					for(i=0;i<sidewrap.length;i++) {
						detectPosition(sidewrap[i]);
					}
				}
			}

			// refreshing the page...
			var pageScroll = scrollY();
			noscroll = pageScroll === 0;
	
			//disable_scroll();
			
			if( pageScroll ) {
				isRevealed = true;
				for( i=0; i<sidewrap.length; i++ ){
					classie.add( sidewrap[i], 'notrans' );
					classie.add( sidewrap[i], 'active' );
				}
			}

			if($(window).innerWidth() <= 767) {
				for( i=0; i<sidewrap.length; i++ ){
					classie.add( sidewrap[i], 'notrans' );
					classie.add( sidewrap[i], 'active' );
				}
			}

			//if($(window).innerWidth() > 700) {
				window.addEventListener( 'scroll', handleScroll );
			//}
			
			// Add the effect beaviour on the mouse click
			var $expandedImage = sidewrap.find('.expanded-image');

			$expandedImage.on('click', function() {
				if($(window).innerWidth() > 767) {
					sidewrap.toggleClass('active');
				}
			});

			$(window).load(function() {
				setExpansiveHeightSpace(sidewrap);
				if(foregroundImage.length > 0) {
					foregroundImage.calcForegroundMargin();
				}
			});

			$(window).resize(function(event) {
				setExpansiveHeightSpace(sidewrap);
				if(foregroundImage.length > 0) {
					foregroundImage.calcForegroundMargin();
				}
			});			
		};

		// Public functions

		this.init(element, options);
	};

	$.fn.expandEffect = function(options) {                   
		return this.each(function() {
			(new $.expandEffect($(this), options));              
		});
	};

	//Private functions

	$.expandEffect.defaultOptions = {
		
	}

	function setExpansiveHeightSpace(container) {
		var wrapBound = container.find('.expanded-description')[0].getBoundingClientRect();
		var iconBound = container.find('.expanded-icon')[0].getBoundingClientRect();
		var textBound = container.find('.expanded-text')[0].getBoundingClientRect();
		
		var titleBound = container.find('.expanded-title')[0].getBoundingClientRect();

		var newHeight = wrapBound.height + iconBound.height + textBound.height;

		if($(window).innerWidth() >= 768) {
			container.css('padding-top', wrapBound.height + 20);

			var pad = 0;
			// if(newHeight > container.height()) {
				//if($(window).innerWidth() >= 768) {
					if(iconBound.height != 0) {
						if($(window).innerWidth() > 1024) {
							pad = 160;
						} else {
							pad = 100;
						}
					} else {
						if($(window).innerWidth() > 1024) {
							pad = -160;
						} else {
							pad = -100;
						}
					}
					container.height(newHeight - pad);

				/*} else {
					pad = 50;
				}
				container.height(newHeight + pad);*/
			// }
		}
	}

	function getPosition(element) {
	    var xPosition = 0;
	    var yPosition = 0;
	  
	    while(element) {
	        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
	        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
	        element = element.offsetParent;
	    }
	    return { x: xPosition, y: yPosition };
	}

	/* Use this function to get the position, even in case the element is absolute positioned */
	var cumulativeOffset = function(element) {
	    var top = 0, left = 0;
	    do {
	        top += element.offsetTop  || 0;
	        left += element.offsetLeft || 0;
	        element = element.offsetParent;
	    } while(element);

	    return {
	        top: top,
	        left: left
	    };
	};

	/**
	 *	Jquery function for the correct position of the foreground image on responsive
	 */
	$.fn.calcForegroundMargin = function() {
		if($(window).innerWidth() >= 768) {
			this.css('margin-top', 0 );
		} else {
			var elementBounds = this[0].getBoundingClientRect();
			this.css('margin-top', Math.round( elementBounds.height / 2 ) * -1 );
		}
		
		return this;
	}
 
})( jQuery, window, document );