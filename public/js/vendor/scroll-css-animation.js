/**
 * Activate animation on scroll and reveal of an element
 * @version 1.0.0
 */
;( function( window, factory ) {
  'use strict';
  window.ScrollCSSAnimation = factory( window );
} )( 'undefined' !== typeof window ? window : this, function() {
  var instances = [];

  function ScrollCSSAnimation() {
    this.element = null;
    this.launched = false;
    // get element as first argument
    if (arguments[0]) {
      this.element = arguments[0];
    }

    var defaults = {
      offset: 0,
      backAndForth: true,
      forwardAnimationClass: 'forward-animation',
      backwardAnimationClass: 'backward-animation',
    };

    // Create options by extending defaults with the passed in arugments
    // get options as second argument
    if (arguments[1] && typeof arguments[1] === 'object') {
      this.options = extendDefaults(defaults, arguments[1]);
    } else {
      this.options = defaults;
    }

    handleAnimation.call(this);
    window.addEventListener('scroll', handleAnimation.bind(this));

    instances.push( this );
  }

  function handleAnimation() {
    var windowScrollTop = scrollDocumentPositionTop();

    // element scroll information
    var elScrollTop = offsetTop(this.element, windowScrollTop);
    var elHeight = this.element.offsetHeight;
    var elScrollBottom = elScrollTop + elHeight;

    // eventually offset
    var offset = windowInnerHeight * this.options.offset;
    windowScrollTop = windowScrollTop + offset;

    if (windowScrollTop > elScrollTop && windowScrollTop < elScrollBottom) {
      if (!this.launched) {
        addClass(this.element, this.options.forwardAnimationClass);
        removeClass(this.element, this.options.backwardAnimationClass);
        this.launched = true;
      }
    } else {
      if (windowScrollTop < elScrollTop) {
        if (this.launched) {
          addClass(this.element, this.options.backwardAnimationClass);
          removeClass(this.element, this.options.forwardAnimationClass);
          this.launched = false;
        }
      }
    }
  }

  // private shared vars
  var windowInnerHeight = document.documentElement.clientHeight;
  window.addEventListener('resize', updateWindowInnerHeight);

  /**
   * Updating the window inner height only if occurs a window resize
   * @param {ResizeEvent} event resize event
   */
  function updateWindowInnerHeight(event) {
    windowInnerHeight = document.documentElement.clientHeight;
  }

  /**
   * Find the viewport scroll top value
   */
  function scrollDocumentPositionTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  ScrollCSSAnimation.prototype.launchForwardAnimation = function() {
    if (!this.launched) {
      addClass(this.element, this.options.forwardAnimationClass);
      removeClass(this.element, this.options.backwardAnimationClass);
      this.launched = true;
    }
  }

  ScrollCSSAnimation.data = function(el) {
    var i = 0,
    tot = instances.length;
    for (i = 0; i < tot; i++) {
      if (el === instances[i].element) {
        return instances[i];
      }
    }

    return null;
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

  return ScrollCSSAnimation;
} );