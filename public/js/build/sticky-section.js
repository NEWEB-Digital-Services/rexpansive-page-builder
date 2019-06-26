; (function () {
  this.StickySection = function () { 
    this.element = null;
    this.stickyElement = null;
    this.borderAnimationEl = {};

    // get element as first argument
    if (arguments[0]) {
      this.element = arguments[0];
    }

    var defaults = {
      offset: 0,
      stickyElementSelector: '.sticky-element',
      borderAnimation: false,
      borderCustomClass: '',
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

    // prepare animations if prsents
    if (this.options.borderAnimation) {
      this.borderAnimationEl.el = document.createElement('div');
      addClass(this.borderAnimationEl.el, 'sticky__border-animation__wrap');
      this.borderAnimationEl.bt = document.createElement('div');
      addClass(this.borderAnimationEl.bt, 'sticky__border-animation__top');
      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.bt);
      this.borderAnimationEl.br = document.createElement('div');
      addClass(this.borderAnimationEl.br, 'sticky__border-animation__right');
      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.br);
      this.borderAnimationEl.bb = document.createElement('div');
      addClass(this.borderAnimationEl.bb, 'sticky__border-animation__bottom');
      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.bb);
      this.borderAnimationEl.bl = document.createElement('div');
      addClass(this.borderAnimationEl.bl, 'sticky__border-animation__left');
      this.borderAnimationEl.el.appendChild(this.borderAnimationEl.bl);

      // customization
      if ( '' !== this.options.borderCustomClass ) 
      {
        addClass( this.borderAnimationEl.el, this.options.borderCustomClass );
      }
      
      this.element.appendChild(this.borderAnimationEl.el);
    }

    // first load check
    handleSticky.call(this);
    window.addEventListener('scroll', handleSticky.bind(this));
  }

  // private shared vars
  var windowInnerHeight = document.documentElement.clientHeight;
  window.addEventListener('resize', updateWindowInnerHeight);

  var transformCrossbrowser = ['-webkit-transform','-ms-transform','transform'];
  var totTransform = transformCrossbrowser.length;

  /**
   * Handling the scrolling of the viewport and the parallax logic
   * @param {ScrollEvent} event scroll event, if present
   */
  function handleSticky(event) {
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

    // stick section
    if ( windowScrollTop > elScrollTop && windowScrollBottom < elScrollBottom ) {
      var percentage = ( windowScrollTop - elScrollTop) * 100 / ( elHeight - windowInnerHeight );
      stickElement.call( this, windowScrollTop - elScrollTop);
    } else {
      if ( windowScrollTop < elScrollTop) {
        stickElement.call( this, 0 );
      } else if (windowScrollBottom > elScrollBottom ) {
        stickElement.call( this, elHeight - windowInnerHeight );
      }
    }

    // animate border
    if ( this.options.borderAnimation ) {
      if ( windowScrollTop > elScrollTop && windowScrollBottom < elScrollBottom ) {
        var percentage = ( windowScrollTop - elScrollTop) * 100 / ( elHeight - windowInnerHeight );
        // var sv = 1 - (1 * percentage / 100);
        var sv = ( ( -1 * percentage ) / 10 ) + 1;
        console.log(percentage, sv);
        if ( sv <= 1 && sv > 0 ) {
          scaleBorder.call(this, sv);
        } else {
          scaleBorder.call(this, 0);
        }
      } else {
        if ( windowScrollTop < elScrollTop) {
          if (this.options.borderAnimation) {
            scaleBorder.call(this, 1);
          }
        } else if (windowScrollBottom > elScrollBottom ) {
          if (this.options.borderAnimation) {
            scaleBorder.call(this, 0);
          }
        }
      }
    }
  };

  /**
   * Set the top value of an element to sticky it to the top
   * @param {Integer} val value in pixel
   */
  function stickElement(val) {
    this.stickyElement.style.top = val + 'px';
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
  var hasClass, addClass, removeClass;

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

  var toggleClass = function (el, className) {
    if (hasClass(el, className)) {
      removeClass(el, className);
    } else {
      addClass(el, className);
    }
  }
}());