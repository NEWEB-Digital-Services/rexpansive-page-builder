/**
 * Accordion at distance plugin
 */
;(function($) {
  this.DistanceAccordion = function() {
    this.element = null;
    this.$element = null;
    this.hashTarget = '';
    this.target = null;
    this.$target = null;
    this.open = true;
    this.close = false;
    this.wrapper = null;
    this.$wrapToggler = [];
    // this.wrapContent = null;

    if (arguments[0]) {
      this.element = arguments[0];
      this.$element = $(this.element);
    }

    // Define option defaults
    var defaults = {
      openClassName: 'open',
      closeClassName: 'close',
      wrapObjects: false,
      wrapperClassName: 'da-wrapper',
      wrapperCustomClass: '',
      scrollTo: false
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[1] && typeof arguments[1] === "object") {
      this.options = extendDefaults(defaults, arguments[1]);
    } else {
      this.options = defaults;
    }

    // get eventually data attributes
    this.options.wrapObjects = ( this.element.getAttribute('data-wrap-objects' ) ? Boolean( this.element.getAttribute('data-wrap-objects' ) ) : this.options.wrapObjects );
    this.options.wrapperCustomClass = ( this.element.getAttribute('data-wrapper-cc' ) ? this.element.getAttribute('data-wrapper-cc' ) : this.options.wrapperCustomClass );
    this.options.scrollTo = ( this.element.getAttribute('data-scroll-to' ) ? ( 'true' === this.element.getAttribute('data-scroll-to' ) ) : this.options.wrapperCustomClass );

    if ( this.element )
    {
      this.hashTarget = this.element.hash.substr(1);
      this.target = document.getElementById( this.hashTarget );

      if ( this.target ) {
        // set the wrap, if true
        if ( this.options.wrapObjects ) {
          // find toggler wrap
          if ( -1 !== this.element.className.indexOf('da-toggle-wrap') ) 
          {
            this.$wrapToggler = this.$element;
          } else {
            this.$wrapToggler = this.$element.parents('.da-toggle-wrap');
          }
        }

        this.$target = $(this.target);
        // set accordion initial state
        if ( -1 !== this.element.className.indexOf(this.options.openClassName ) ) {
          this.open = true;
          this.close = false;
        } else if ( -1 !== this.element.className.indexOf(this.options.closeClassName ) ) {
          this.open = false;
          this.close = true;
        } else {
          this.element.className += this.options.openClassName;
        }

        // if close, hide target
        if ( this.close ) {
          this.target.style.display = 'none';
        }

        // if there is a big toggler, listen to its click and remove the other
        if ( this.$wrapToggler.length > 0 ) {
          this.$wrapToggler[0].addEventListener('click', handleClick.bind(this));
        } else {
          this.element.addEventListener('click', handleClick.bind(this));
        }
      }
    }
  }

  function handleClick(event) {
    event.preventDefault();
    if ( this.open ) {
      this.$target.slideUp();
      this.$element.addClass('close').removeClass('open');
      if ( this.$wrapToggler.length > 0 ) {
        this.$wrapToggler.addClass('close').removeClass('open');
      }
      this.open = false;
      this.close = true;
    } else {
      if ( this.options.scrollTo ) {
        var scrollVal = this.$target.offset().top;
        var that = this;

        $('html, body').animate({ 
            scrollTop: scrollVal
          }, 
          function() {
            that.$target.slideDown();    
          } 
        );
      } else {
        this.$target.slideDown();
      }
      this.$element.addClass('open').removeClass('close');
      if ( this.$wrapToggler.length > 0 ) {
        this.$wrapToggler.addClass('open').removeClass('close');
      }
      this.open = true;
      this.close = false;
    }
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
}(jQuery));