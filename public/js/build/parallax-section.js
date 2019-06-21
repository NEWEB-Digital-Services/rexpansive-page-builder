; (function () {
  this.ParallaxSection = function () {

    // @todo fix empty spaces on scroll 
    // @done

    // @todo check section initial position and add relative 
    // vtest-top or vtest-bottom class (to fix empty spaces)
    // @done

    // @todo border animation

    // @todo text transform opacity animation

    this.element = null;
    this.goingUp = false;
    this.goingDown = false;
    this.scrollLastPosition = null; 

    // get element as first argument
    if (arguments[0]) {
      this.element = arguments[0];
    }

    var defaults = {
      offset: 0
    };

    // Create options by extending defaults with the passed in arugments
    // get options as second argument
    if (arguments[1] && typeof arguments[1] === "object") {
      this.options = extendDefaults(defaults, arguments[1]);
    } else {
      this.options = defaults;
    }

    this.scrollLastPosition = scrollDocumentPositionTop();
    // this.element.style.maxHeight = '100vh';

    // first load check
    handleParallax.call(this);
    window.addEventListener('scroll', handleParallax.bind(this));
  }

  // private shared vars
  var windowInnerHeight = document.documentElement.clientHeight;
  window.addEventListener('resize', updateWindowInnerHeight);

  /**
   * Handling the scrolling of the viewport and the parallax logic
   * @param {ScrollEvent} event scroll event, if present
   */
  function handleParallax( event ) {
    // var windowInnerHeight = document.documentElement.clientHeight;

    var windowScrollTop = scrollDocumentPositionTop();
    var windowScrollBottom = windowScrollTop + windowInnerHeight;

    // check scroll direction
    if (this.scrollLastPosition < windowScrollTop ) {
      this.goingDown = true;
      this.goingUp = false;
    } else if (this.scrollLastPosition > windowScrollTop ) {
      this.goingDown = false;
      this.goingUp = true;
    }

    // calc scrolling step to add a correct offset to determinate the element
    // top or bottom pass away
    var step = Math.abs(this.scrollLastPosition - windowScrollTop);

    this.scrollLastPosition = windowScrollTop;

    // element scroll information
    var elScrollTop = offsetTop(this.element, windowScrollTop);
    var elScrollBottom = elScrollTop + this.element.offsetHeight;

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

    if ( !this.goingDown && !this.goingUp ) {
      if ( windowScrollTop < elScrollTop ) {
        addClass(this.element, 'vtest-top');
      } else if ( windowScrollBottom > elScrollBottom ) {
        addClass(this.element, 'vtest-bottom');
      }
    }

    // if the top element reaches the top view
    if ( elScrollTop >= (windowScrollTop - step) && elScrollTop <= (windowScrollTop + step) ) {
      if ( this.goingDown ) {
        addClass(this.element, 'sticky');
      } else if ( this.goingUp ) {
        // prevent empty spaces
        if ( elScrollTop >= windowScrollTop ) {
          removeClass(this.element, 'sticky');
          removeClass(this.element, 'vtest-bottom');
          addClass(this.element, 'vtest-top');
        }
      }
    } 
    // else if the bottom element reaches the bottom view
    else if ( elScrollBottom >= (windowScrollBottom - step) && elScrollBottom <= (windowScrollBottom + step) )
    {
      if ( this.goingDown ) {
        // prevent empty spaces
        if ( elScrollBottom <= windowScrollBottom ) {
          removeClass(this.element, 'sticky');
          removeClass(this.element, 'vtest-top');
          addClass(this.element, 'vtest-bottom');
        }
      } else if ( this.goingUp ) {
        addClass(this.element, 'sticky');
      }
    }
  };

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
  function offsetTop( el, scrollTop ) {
    scrollTop = 'undefined' !== typeof scrollTop ? scrollTop : ( window.pageYOffset || document.documentElement.scrollTop );
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

  var toggleClass = function( el, className ) {
    if ( hasClass( el, className ) ) {
      removeClass( el, className );
    } else {
      addClass( el, className );
    }
  }
}());

// ; (function () {
//   var launchParallaxVideo = function () {
//     var ParallaxSections = [].slice.call(document.querySelectorAll('.video-parallax'));
//     ParallaxSections.forEach(function (el, index) {
//       var test = new ParallaxSection(el);

//     });
//   };

//   //document.addEventListener('DOMContentLoaded', function(event) {}); // DOM Ready

//   window.addEventListener('load', launchParallaxVideo);  // Entire content loaded
// })();