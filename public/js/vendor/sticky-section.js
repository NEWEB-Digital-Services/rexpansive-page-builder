/**
 * Stick a the content of a section to the top of the screen
 * 
 * @version 1.1.0
 */
;(function(window, factory) {
  'use strict';
  window.StickySection = factory(window);
})( 'undefined' !== typeof window ? window : this, function() {
  // instances of StickySection initializated
  var instances = [];

	var scrollCallbacksArray = [];
  var globalStickySectionIndex = 0;

  var windowScrollTop = scrollDocumentPositionTop();

  var isMobile = false; //initiate as false
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
  }

  var deviceOrientation;

  function detectOrientation() {
    var temp;
    if (window.matchMedia("(orientation: portrait)").matches) {
      // you're in PORTRAIT mode
      temp = 'portrait';
    }

    if (window.matchMedia("(orientation: landscape)").matches) {
      // you're in LANDSCAPE mode
      temp = 'landscape';
    }

    if ( temp != deviceOrientation ) {
      deviceOrientation = temp;
      return true;
    }

    return false;
  }

  detectOrientation();

  function StickySection() {
    this.element = null;
    this.stickyElement = null;
    this.borderAnimationEl = {};
    this.overlayAnimationEl = null;
    this.ticking = false;
    this.stickyId = null;

    // get element as first argument
    if (arguments[0]) {
      this.element = arguments[0];
    }

    var defaults = {
      offset: 0,
      stickyElementSelector: '.sticky-element',
      stickyJS: true,
      borderAnimation: false,
      overlayAnimation: false,
      originalOverlaySelector: '.responsive-overlay',
      borderCustomClass: '',
      requestAnimationFrame: false
    };

    // Create options by extending defaults with the passed in arugments
    // get options as second argument
    if (arguments[1] && typeof arguments[1] === "object") {
      this.options = extendDefaults(defaults, arguments[1]);
    } else {
      this.options = defaults;
    }

    // find element to stick
    this.stickyElement = ('' !== this.options.stickyElementSelector ? this.element.querySelector(this.options.stickyElementSelector) : null);

    if ( null === this.stickyElement ) {
      return;
		}
		
    this.stickyId = globalStickySectionIndex;
    globalStickySectionIndex++;

    // prepare border animation if prsents
    if (this.options.borderAnimation) {
      this.borderAnimationEl.el = document.createElement('div');
      addClass(this.borderAnimationEl.el, 'sticky__border-animation__wrap');
      this.borderAnimationEl.bt = document.createElement('div');
      addClass(this.borderAnimationEl.bt, 'sticky__border-animation__top');
      this.borderAnimationEl.br = document.createElement('div');
      addClass(this.borderAnimationEl.br, 'sticky__border-animation__right');
      this.borderAnimationEl.bb = document.createElement('div');
      addClass(this.borderAnimationEl.bb, 'sticky__border-animation__bottom');
      this.borderAnimationEl.bl = document.createElement('div');
      addClass(this.borderAnimationEl.bl, 'sticky__border-animation__left');

      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.bt);
      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.br);
      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.bb);
      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.bl);

      // customization
      if ( '' !== this.options.borderCustomClass ) 
      {
        addClass( this.borderAnimationEl.el, this.options.borderCustomClass );
      }
      
      this.element.insertBefore(this.borderAnimationEl.el, this.element.firstChild);
		}
		
    if ( this.options.overlayAnimation ) {

      var originaloverlayEl = this.element.querySelector(this.options.originalOverlaySelector);
      if ( originaloverlayEl ) {
        // generate overlay faker
        this.overlayAnimationEl = document.createElement('div');
        addClass( this.overlayAnimationEl, 'sticky__overlay' );

        this.overlayAnimationEl.style.backgroundColor = originaloverlayEl.style.backgroundColor;
        removeClass( originaloverlayEl, 'rex-active-overlay' )
        // this.element.insertBefore(this.overlayAnimationEl, this.element.firstChild);
        this.stickyElement.appendChild(this.overlayAnimationEl); 
      }
    }

    if ( this.options.stickyJS ) {
      addClass( this.element, 'sticky-js' );
    } else {
      addClass( this.element, 'sticky-css' );
		}
		
    // first load check
		handleSticky.call(this);
		scrollCallbacksArray.push(handleSticky.bind(this));

		instances.push( this );
	}
	
	/**
	 * Watching the browser scrolling, bouncing the event
	 * every 50 ms to prevent event polling
	 * @return	{void}
	 * @since		1.1.0
	 */
	function _watchScroll() {
		var userScrolled = false;

		function scrollHandler() {
			userScrolled = true;
		}

		window.addEventListener('scroll', scrollHandler);

		function handleInterval() {
			if (userScrolled) {
        windowScrollTop = scrollDocumentPositionTop();
				scrollCallbacksArray.forEach(function (cb) {
					cb.call();
				});
				userScrolled = false;
			}
		}

		setInterval(handleInterval.bind(this), 50);
	}

	/**
	 * Watching the browser resizing, bouncing the event
	 * every 150 ms to prevent event polling
	 * @return	{void}
	 * @since		1.1.0
	 */
	function _watchResize() {
		var userResized = false;

		function resizeHandler(ev) {
			userResized = true;
		}

		window.addEventListener('resize', resizeHandler);

		setInterval(function () {
			if (userResized) {
				updateWindowInnerHeight();
				userResized = false;
			}
		}, 150);
	}

  // private shared vars
  var windowInnerHeight = _viewport().height;
  var transformCrossbrowser = ['-webkit-transform','-ms-transform','transform'];
  var totTransform = transformCrossbrowser.length;

  /**
   * Handling the scrolling of the viewport and the parallax logic
   * @param {ScrollEvent} event scroll event, if present
   */
  function handleSticky(event) {
    this.ticking = false;
    // var windowInnerHeight = document.documentElement.clientHeight;

    // var windowScrollTop = scrollDocumentPositionTop();
    var windowScrollBottom = windowScrollTop + windowInnerHeight;

    // element scroll information
		var elScrollTop = offsetTop(this.element, windowScrollTop);
    var elHeight = this.element.offsetHeight;
		var elScrollBottom = elScrollTop + elHeight;

    // eventually offset
    var windowOffset = windowInnerHeight * this.options.offset;
    windowScrollTop = windowScrollTop + windowOffset;
    windowScrollBottom = windowScrollBottom - windowOffset;

    var topViewport = windowScrollTop >= elScrollTop;
    var bottomViewport = windowScrollBottom <= elScrollBottom;
    var beforeViewport = windowScrollTop <= elScrollTop;
		var afterViewport = windowScrollBottom >= elScrollBottom;
		
    if ( this.options.stickyJS ) {
      // stick section
      if ( topViewport && bottomViewport ) {
        // stick dynamic

        var val = windowScrollTop - elScrollTop;
        stickElementTransform.call( this, val );

        addClass(this.element, 'will-change-rule');
      } else {
        removeClass( this.element, 'will-change-rule' );
        if ( beforeViewport ) {
          // stick to top of the parent
          stickElementTransform.call( this, 0 );
        } else if ( afterViewport ) {
          // stick at the end of the parent
          stickElementTransform.call( this, elHeight - windowInnerHeight );
        }
      }      
    }


    // check if is visible
    var bottomInViewport = elScrollBottom > windowScrollTop;
    var topInViewport = elScrollTop < windowScrollBottom;

    if (bottomInViewport && topInViewport) {
      // element visibile
      addClass(this.element, 'visibile');
    } else {
      // element not in viewport
      removeClass(this.element, 'visibile');
    }

    // x = windowScrollTop - elScrollTop
    // m = 100 / ( elHeight - windowInnerHeight )
    // y = m * x + q
    // y' = 2 * m * x - 100
    // percentage of the section height reached during the scroll
    var percentage = ( windowScrollTop - elScrollTop ) * 100 / ( elHeight - windowInnerHeight );
    // var _percentage = 2 * 100 / ( elHeight - windowInnerHeight ) * ( windowScrollTop - elScrollTop ) - 100

    // animate border
    if ( this.options.borderAnimation ) {
      if ( topViewport && bottomViewport ) {
        // scale value, relative to the height reached
        // divide by 100 to make the animation last until the end of the section
        // otherwise play with the value (now its 10)
        var sv = 1 - (1 * percentage / 5);
        // console.log(this.element.id, percentage, sv);
        if ( sv <= 1 && sv > 0 ) {
          scaleBorder.call(this, sv);
        } else {
          scaleBorder.call(this, 0);
        }
      } else {
        if ( beforeViewport ) {
          if (this.options.borderAnimation) {
            scaleBorder.call(this, 1);
          }
        } else if ( afterViewport ) {
          if (this.options.borderAnimation) {
            scaleBorder.call(this, 0);
          }
        }
      }
    }

    var opY;

    // animate overlay
    if ( this.options.overlayAnimation ) {
      // animate overlay faker
      if ( topViewport && bottomViewport ) {
        // opacity = percentage of scoll
        // opY = 1 - Math.pow( 1 - percentage / 100, 1.75 );    // ease-out
        opY = 1 - Math.pow( 1 - percentage / 100, 3 );    // much steep ease-out
        this.overlayAnimationEl.style.opacity = opY;
        // this.overlayAnimationEl.style.opacity = Math.pow( percentage / 100, 1.75 );   // ease-in
      } else {
        if ( beforeViewport ) {
          // opacity = 0
          this.overlayAnimationEl.style.opacity = 0;
        } else if ( afterViewport ) {
          // opacity = 1
          this.overlayAnimationEl.style.opacity = 1;
        }
      }
    }
  };

  /**
   * Translate the element to stick, so it remains on 
   * the top viewport
   * @param {Float} topVale value in pixel
   */
  function stickElementTransform( topVal ) {
    for( var i=0; i < totTransform; i++ ) {
      this.stickyElement.style[transformCrossbrowser[i]] = 'translate(0px,' + topVal + 'px)';
    }
  }

  /**
   * Scale the borders to a certain value
   * @param {Float} val value between 0 and 1
   */
  function scaleBorder(val) {
    for( var i=0; i < totTransform; i++ ) {
      this.borderAnimationEl.bt.style[transformCrossbrowser[i]] = 'scale(1,' + val + ')';
      this.borderAnimationEl.bb.style[transformCrossbrowser[i]] = 'scale(1,' + val + ')';
      this.borderAnimationEl.br.style[transformCrossbrowser[i]] = 'scale(' + val + ',1)';
      this.borderAnimationEl.bl.style[transformCrossbrowser[i]] = 'scale(' + val + ',1)';
    }
	}
	
	/* ===== Utilities ===== */

	/**
	 * Calculate viewport window and height
	 * @return {Object} width, height of the viewport
	 */
	function _viewport() {
		var e = window, a = 'inner';
		if (!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return { width: e[a + 'Width'], height: e[a + 'Height'] };
	}

	/**
   * Updating the window inner height only if occurs a window resize
   * @param {ResizeEvent} event resize event
   */
  function updateWindowInnerHeight(event) {
    if ( isMobile && detectOrientation() || ! isMobile ) {
      windowInnerHeight = _viewport().height;
    }
	}
	
  /**
   * Find the viewport scroll top value
   */
  function scrollDocumentPositionTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  /**
   * Find the element offset top in the viewport
   * @param {Element} el element to analize
   * @param {Int} scrollTop window scroll top value
   */
  function offsetTop(el, scrollTop) {
    scrollTop = 'undefined' !== typeof scrollTop ? scrollTop : (window.pageYOffset || document.documentElement.scrollTop);
    var rect = el.getBoundingClientRect();
    return rect.top + scrollTop;
  }

  /**
   * Wrap an element inside another
   * @param {Node} el element to wrap
   * @param {Node} wrapper new element that will contain the old one
   */
  function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  // Utility method to extend defaults with user options
  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  /**
   * Class manipulation methods
   */
  var hasClass, addClass, removeClass, toggleClass;

  if ('classList' in document.documentElement) {
    hasClass = function (el, className) { return el.classList.contains(className); };
    addClass = function (el, className) { el.classList.add(className); };
    removeClass = function (el, className) { el.classList.remove(className); };
  } else {
    hasClass = function (el, className) {
      return new RegExp('\\b' + className + '\\b').test(el.className);
    };
    addClass = function (el, className) {
      if (!hasClass(el, className)) { el.className += ' ' + className; }
    };
    removeClass = function (el, className) {
      el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
    };
  }

  toggleClass = function (el, className) {
    if (hasClass(el, className)) {
      removeClass(el, className);
    } else {
      addClass(el, className);
    }
	}

	function removeElement(el) {
		if (el && el.parentNode) {
			el.parentNode.removeChild(el);
		}
	}
	
	/* ===== Exposed functions ===== */

  StickySection.prototype.hideBorder = function() {
    scaleBorder.call(this, 0);
	};
	
	/**
	 * Destroys the instance on which is called the function.
	 * @returns		{void}
	 * @since			1.1.0
	 */
  StickySection.prototype.destroy = function () {
		removeElement(this.overlayAnimationEl);
		removeElement(this.borderAnimationEl.el);
		
		if (!this.stickyElement.matches('.rex-video-wrap')) {
			// Videos should not be destroyed, beacuse they
			// are not re-inserted (as of 1.1.0, Rexpansive 2.0.4)
			removeElement(this.stickyElement);
		} else {
			// removeElement(this.element.querySelector('.sticky-video-controls'))
		}

    function removeInstance(instance) {
      return instance.element !== this.element;
    }
    
    instances = instances.filter( removeInstance.bind(this) );
	}

	StickySection.destroyHandlers = function (){
		scrollCallbacksArray = [];
	}
	
	/**
	 * Creates StickySection background simulators for images
	 * or just controls for videos.
	 * @param		{Element}		section		StickySection DOM Element
	 * @returns	{void}
	 * @since		1.1.0
	 */
	StickySection.prepare = function (section) {
		var sectionData = section.querySelector('.section-data');

		if (hasClass(section, 'mp4-player')) {
			// video controls fix
			var stickyVideoControls = section.querySelector('.sticky-video-controls');

			if (stickyVideoControls) {
				return;
			}

			var videoEl = section.querySelector('.rex-video-wrap');
			var videoControls = videoEl.querySelector('.rex-video__controls');

			if (videoControls) {
				stickyVideoControls = document.createElement('div');
				addClass(stickyVideoControls, 'sticky-video-controls');
				videoEl.insertAdjacentElement('afterend', stickyVideoControls);
			}
		} else if ('' !== section.style.backgroundImage || hasClass(section, 'section-w-image')) {
			var adjacent = section.querySelector('.responsive-overlay');
			adjacent.insertAdjacentHTML('beforebegin', '<div class="sticky-background-simulator"></div>');
			var backgroundSimulator = section.querySelector('.sticky-background-simulator');

			backgroundSimulator.style.backgroundImage = 'url(' + sectionData.getAttribute('data-image_bg_section') + ')';
		}
	};

	/**
   * Static function that retrieves the StickySection
   * instance of the DOM Element passed.
   * @param   {Element}       el  Element to retrieve the instance
   * @returns {Element|null}  StickySection instance
   * @since   1.1.0
   */
  StickySection.data = function(el) {
    var i = 0,
      tot = instances.length;
    for (i = 0; i < tot; i++) {
      if (el === instances[i].element) {
        return instances[i];
      }
    }

    return null;
	};

	// Invoking global Events watchers
	_watchScroll();
	_watchResize(); 

  return StickySection;
});