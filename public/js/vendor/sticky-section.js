/**
 * Stick a the content of a section to the top of the screen
 * 
 * @version 1.0.0
 */
;(function(window, factory) {
  'use strict';
  window.StickySection = factory(window);
})( 'undefined' !== typeof window ? window : this, function() {
  // instances of StickySection initializated
  var instances = [];

  var stickySectionsDidScroll = [];
  var stickySectionsHandlers = [];
  var globalStickySectionIndex = 0;

  var wInterval = true;
  var wCallbacks = false;

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
    stickySectionsDidScroll[this.stickyId] = false;

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
		
		console.log( this.stickyElement.offsetHeight );

    // first load check
    handleSticky.call(this);
    if ( this.options.requestAnimationFrame ) {
      // debounce method
      window.addEventListener('scroll', handleScroll.bind(this));
    } else if ( wInterval ) {
      // debounce classic method
      var that = this;
      setInterval(function() {
        if( stickySectionsDidScroll[that.stickyId] ) {
          stickySectionsDidScroll[that.stickyId] = false;
          handleSticky.call(that);
        }
      }, 50);
    } else if ( wCallbacks ) {
      stickySectionsHandlers[this.stickyId] = handleSticky.bind(this);
    } else {
      // no debounce method
      window.addEventListener('scroll', handleSticky.bind(this));
    }

    instances.push( this );
  }

  if ( wInterval ) {
    window.addEventListener('scroll', debounceHandleScroll);
  } else if ( wCallbacks ) {
    window.addEventListener('scroll', callStickyHandlers);
  }

  // private shared vars
  var windowInnerHeight = document.documentElement.clientHeight;
  window.addEventListener('resize', updateWindowInnerHeight);

  var transformCrossbrowser = ['-webkit-transform','-ms-transform','transform'];
  var totTransform = transformCrossbrowser.length;

  /**
   * On scroll call the callbacks of stickies
   * registered inside an array
   * @return {void}
   */
  function callStickyHandlers() {
    var i, tot_sticky = stickySectionsHandlers.length;
    for( i=0; i < tot_sticky; i++ ) {
      stickySectionsHandlers[i].call();
    }
  }

  /**
   * On scroll set a true the scrolling for all the sticky sections
   * instantiated
   * @return {void}
   */
  function debounceHandleScroll() {
    var i, tot_sticky = stickySectionsDidScroll.length;
    for( i=0; i < tot_sticky; i++ ) {
      stickySectionsDidScroll[i] = true;
    }
  }

  /**
   * Handling the scrolling with the aid of the request animation frame
   * Performance controversial
   */
  function handleScroll(event) {
    requestTicking.call(this);
  }

  /**
   * If not ticketing, request the animation frame to handle the sticky section
   * Performance controversial
   */
  function requestTicking() {
    if ( !this.ticking ) {
      requestAnimationFrame( handleSticky.bind(this) );
    }
    this.ticking = true;
  }

  /**
   * Handling the scrolling of the viewport and the parallax logic
   * @param {ScrollEvent} event scroll event, if present
   */
  function handleSticky(event) {
    this.ticking = false;
    // var windowInnerHeight = document.documentElement.clientHeight;

    var windowScrollTop = scrollDocumentPositionTop();
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
        // stickElement.call( this, val );
        stickElementTransform.call( this, val );

        addClass(this.element, 'will-change-rule');
      } else {
        removeClass( this.element, 'will-change-rule' );
        if ( beforeViewport ) {
          // stick to top of the parent
          // stickElement.call( this, 0 );
          stickElementTransform.call( this, 0 );
        } else if ( afterViewport ) {
          // stick at the end of the parent
          // stickElement.call( this, elHeight - windowInnerHeight );
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

  // public methods
  StickySection.prototype.hideBorder = function() {
    scaleBorder.call(this, 0);
  };

  /**
   * Set the top value of an element to sticky it to the top
   * Optionally set also the bottom value
   * @param {Integer} topVal value in pixel
   * @param {Integer} bottomVal value in pixel
   */
  function stickElement(topVal, bottomVal) {
    // console.log(topVal);
    this.stickyElement.style.top = topVal + 'px';
    if ( 'undefined' !== typeof bottomVal ) {
      this.stickyElement.style.bottom = bottomVal + 'px';
    }
  }

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

  /**
   * Updating the window inner height only if occurs a window resize
   * @param {ResizeEvent} event resize event
   */
  function updateWindowInnerHeight(event) {
    windowInnerHeight = document.documentElement.clientHeight;
  }

  /**
   * Find the viewport scroll values
   */
  function scrollDocumentPosition() {
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: scrollTop, left: scrollLeft };
  }

  /**
   * Find the viewport scroll top value
   */
  function scrollDocumentPositionTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  /**
   * Find the element offsets in the viewport
   * @param {Element} el element to analize
   */
  function offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
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
	
	/* ===== Exposed functions ===== */
	/**
	 * Destroys the instance on which is called the function.
	 * @returns		{void}
	 * @since			1.1.0
	 */
  StickySection.prototype.destroy = function () {
    function removeInstance(instance) {
      return instance.element !== this.element;
    }
    
    instances = instances.filter( removeInstance.bind(this) );
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
			videoEl = section.querySelector('.rex-video-wrap');
			videoControls = videoEl.querySelector('.rex-video__controls');
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

  return StickySection;
});