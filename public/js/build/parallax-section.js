; (function () {
  this.ParallaxSection = function () {

    // @todo check section initial position and add relative
    // vtest-top or vtest-bottom class (to fix empty spaces)
    // @todo border animation
    // @todo text transform opacity animation

    this.element = null;
    this.debugLabel = '';
    this.goingUp = false;
    this.goingDown = false;
    this.scrollLastPosition = null;
    this.originalHeight = null;

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

    this.scrollLastPosition = scrollDocumentPosition().top;
    this.debugLabel = this.element.getAttribute('data-section-id');
    this.originalHeight = this.element.scrollHeight;
    // this.element.style.maxHeight = '100vh';

    // first load check
    handleScroll.call(this);
    window.addEventListener('scroll', handleScroll.bind(this));
  }

  function handleScroll(event) {
    var windowInnerHeight = document.documentElement.clientHeight;

    var windowScrollTop = scrollDocumentPosition().top;
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
    var step = Math.abs(this.scrollLastPosition-windowScrollTop);
    console.log(step);

    this.scrollLastPosition = windowScrollTop;

    // eventually offset
    var windowOffset = windowInnerHeight * this.options.offset;
    windowScrollTop = windowScrollTop + windowOffset;
    windowScrollBottom = windowScrollBottom - windowOffset;

    // element scroll information
    var elScrollTop = offset(this.element).top;
    var elScrollBottom = elScrollTop + this.element.offsetHeight;

    // check if is visible
    var bottomInViewport = elScrollBottom > windowScrollTop;
    var topInViewport = elScrollTop < windowScrollBottom;

    // console.log(windowScrollTop, windowScrollBottom);
    // console.log(elScrollTop, elScrollBottom)

    if (bottomInViewport && topInViewport) {
      // element visibile
      addClass(this.element, 'visibile');
    } else {
      // element not in viewport
      removeClass(this.element, 'visibile');
    }

    if ( elScrollTop >= (windowScrollTop - step) && elScrollTop <= (windowScrollTop + step) ) {
      if ( this.goingDown ) {
        addClass(this.element, 'sticky');
      } else if ( this.goingUp ) {
        removeClass(this.element, 'sticky');
        removeClass(this.element, 'vtest-bottom');
        addClass(this.element, 'vtest-top');
      }
    } else if ( elScrollBottom >= (windowScrollBottom - step) && elScrollBottom <= (windowScrollBottom + step) ) {
      if ( this.goingDown ) {
        removeClass(this.element, 'sticky');
        removeClass(this.element, 'vtest-top');
        addClass(this.element, 'vtest-bottom');
      } else if (this.goingUp ) {
        addClass(this.element, 'sticky');
      }
    }
  };

  // window scroll value
  function scrollDocumentPosition() {
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: scrollTop, left: scrollLeft };
  }

  function offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
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