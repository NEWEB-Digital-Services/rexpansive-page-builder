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
    this.borderAnimationEl = {};

    // get element as first argument
    if (arguments[0]) {
      this.element = arguments[0];
    }

    var defaults = {
      offset: 0,
      borderAnimation: false
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

    // prepare animations if prsents
    if ( this.options.borderAnimation ) {
      this.borderAnimationEl.el = document.createElement('div');
      addClass( this.borderAnimationEl.el, 'parallax__border-animation__wrap' );
      this.borderAnimationEl.bt = document.createElement('div');
      addClass( this.borderAnimationEl.bt, 'parallax__border-animation__top' );
      this.borderAnimationEl.el.appendChild( this.borderAnimationEl.bt );
      this.borderAnimationEl.br = document.createElement('div');
      addClass( this.borderAnimationEl.br, 'parallax__border-animation__right' );
      this.borderAnimationEl.el.appendChild( this.borderAnimationEl.br );
      this.borderAnimationEl.bb = document.createElement('div');
      addClass( this.borderAnimationEl.bb, 'parallax__border-animation__bottom' );
      this.borderAnimationEl.el.appendChild( this.borderAnimationEl.bb );
      this.borderAnimationEl.bl = document.createElement('div');
      addClass( this.borderAnimationEl.bl, 'parallax__border-animation__left' );
      this.borderAnimationEl.el.appendChild( this.borderAnimationEl.bl );

      this.element.appendChild( this.borderAnimationEl.el );
    }

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

    // initial classes based on element position
    // relative to the viewport
    if ( !this.goingDown && !this.goingUp ) {
      if ( windowScrollTop < elScrollTop ) {
        addClass(this.element, 'vtest-top');
      } else if ( windowScrollBottom > elScrollBottom ) {
        addClass(this.element, 'vtest-bottom');
      } else if ( windowScrollTop > elScrollTop && windowScrollBottom < elScrollBottom ) {
        addClass(this.element, 'sticky');
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

    if ( this.options.borderAnimation ) {
      var spt = windowScrollTop+( windowInnerHeight / 2 );
      if ( hasClass( this.element, 'sticky' ) ) {
        var v = 1 - ( spt - elScrollTop ) / elHeight;
        scaleBorder.call(this, v );
        // console.log('A[' + elScrollTop + ',' + 90 + ']', 'B[' + elScrollBottom + ',' + 0 + ']');
        // if ( this.goingDown ) {
        //   var easeV = linearValue( elScrollTop, elScrollBottom, 90, 0, windowScrollBottom );
        //   var easeVmap = easeV / 90;
        //   scaleBorder.call(this, easeVmap );
        // } else if (this.goingUp ) {
        //   var easeV = linearValue( elScrollTop, elScrollBottom, 90, 0, windowScrollTop );
        //   var easeVmap = easeV / 90;
        //   scaleBorder.call(this, easeVmap );
        // }        
      } else {
        if ( spt < elScrollTop ) {
          scaleBorder.call(this, 1 );
        } else if ( spt > elScrollBottom ) {
          scaleBorder.call(this, 0 );
        }
      }
    }
  };

  function scaleBorder( val ) {
    this.borderAnimationEl.bt.style.transform = 'scale(1,' + val + ')';
    this.borderAnimationEl.bb.style.transform = 'scale(1,' + val + ')';
    this.borderAnimationEl.br.style.transform = 'scale(' + val + ',1)';
    this.borderAnimationEl.bl.style.transform = 'scale(' + val + ',1)';
  }

  function linearValue( x1, x2, y1, y2, x ) {
    var m = ( y1 - y2 ) / ( x1 - x2 );
    var q = ( x1*y2 - x2*y1 ) / ( x1 - x2 );
    return m * x + q;
  }

  function mapVal( min, max, a, b, x ) {
    return ( ( ( b - a ) * ( x - min ) ) / ( max - min ) ) + a;
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
  function offsetTop( el, scrollTop ) {
    scrollTop = 'undefined' !== typeof scrollTop ? scrollTop : ( window.pageYOffset || document.documentElement.scrollTop );
    var rect = el.getBoundingClientRect();
    return rect.top + scrollTop;
  }

  // bezier testing
  var beizerPoints = [
    { x: 0, y: 0 },
    { x: 0.250, y: 0.100 }, 
    { x: 0.250, y: 1 }, 
    { x: 1, y: 1 }
  ];
  var coefficients = {
    cx: 0,
    bx: 0,
    ax: 0,
    cy: 0,
    by: 0,
    ay: 0
  };

  calcCoefficients(beizerPoints);
  // for ( var i = 0; i <= 1; i = i+0.01 )  {
  //   console.log(applyBeizier(i));
  // }

  function calcCoefficients( points ) {
    coefficients.cx = 3.0 * (points[1].x - points[0].x);
    coefficients.bx = 3.0 * (points[2].x - points[1].x) - coefficients.cx;
    coefficients.ax = points[3].x - points[0].x - coefficients.cx -coefficients. bx;
    
    coefficients.cy = 3.0 * (points[1].y - points[0].y);
    coefficients.by = 3.0 * (points[2].y - points[1].y) - coefficients.cy;
    coefficients.ay = points[3].y - points[0].y - coefficients.cy - coefficients.by;
  }

  function applyBeizier( t, points ) {
    points = 'undefined' !== typeof points ? points : [{ x: 0, y: 0 }];
    var result = {};
    tSquared = t * t;
    tCubed = tSquared * t;
    
    result.x = (coefficients.ax * tCubed) + (coefficients.bx * tSquared) + (coefficients.cx * t) + points[0].x;
    result.y = (coefficients.ay * tCubed) + (coefficients.by * tSquared) + (coefficients.cy * t) + points[0].y;
    
    return result;
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