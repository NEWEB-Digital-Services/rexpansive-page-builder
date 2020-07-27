/**
 * Accordion at distance plugin
 */
;(function($) {
  this.DistanceAccordion = function() {
    this.element = null;
    this.$element = null;
    this.hashTarget = '';
    this.classTarget = '';
    this.targets = [];
    this.$targets = null;
    this.open = true;
    this.close = false;
    this.wrapper = null;
    this.$wrapToggler = [];
    // this.wrapContent = null;
    this.targetsChildAccordions = null;
    this.context = document;

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
      accordionElementClassName: 'da-element',
      accordionTogglerClass: 'distance-accordion-toggle',
      scrollTo: false,
      closeChilds: true,
      context: null
    };

    // Create options by extending defaults with the passed in arugments
    if (arguments[1] && typeof arguments[1] === "object") {
      this.options = extendDefaults(defaults, arguments[1]);
    } else {
      this.options = defaults;
    }

    // get eventually data attributes
    this.options.wrapObjects = ( this.element.getAttribute('data-wrap-objects' ) ? Boolean( this.element.getAttribute('data-wrap-objects' ) ) : this.options.wrapObjects );
    this.options.wrapperCustomClass = ( this.element.getAttribute('data-wrapper-cc' ) ? this.element.getAttribute('data-wrapper-cc' ) : this.options.wrapperCustomClass );
    this.options.scrollTo = ( this.element.getAttribute('data-scroll-to' ) ? ( 'true' === this.element.getAttribute('data-scroll-to' ) ) : this.options.scrollTo );
    this.options.closeChilds = ( this.element.getAttribute('data-close-childs' ) ? ( 'true' === this.element.getAttribute('data-close-childs' ) ) : this.options.closeChilds );

    this.context = ( this.options.context ? this.options.context : this.context );

    if ( this.element ) {
      this.hashTarget = this.element.hash.substr(1);
      if ( '' !== this.hashTarget ) {
        var target = this.context.getElementById( this.hashTarget );
        if ( target ) {
          this.targets.push( target );
        }
      } else {
        this.classTarget = this.element.getAttribute('data-target');
        this.targets = [].slice.call( this.context.getElementsByClassName( this.classTarget ) );
      }

      if ( this.targets.length > 0 ) {
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

        this.$targets = $(this.targets);
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

        // add class to identify accordion items
        this.$targets.addClass( this.options.accordionElementClassName );

        // if close, hide target
        if ( this.close ) {
          this.targets.forEach(function( el ) {
            el.style.display = 'none';
          });
        }

        // if there is a big toggler, listen to its click and remove the other
        if ( this.$wrapToggler.length > 0 ) {
          this.$wrapToggler[0].addEventListener('click', handleClick.bind(this));
        } else {
          this.element.addEventListener('click', handleClick.bind(this));
        }

        this.$targets.on('click', '.da-target__button', handleClick.bind(this));
      }

      // attach the plugin instance to the dom element
      this.element.DistanceAccordionInstance = this;
    }
  };

  // declaring plugin prototypes
  DistanceAccordion.prototype.openAccordion = function() {
    openAccordion.call(this);
  };

  DistanceAccordion.prototype.closeAccordion = function() {
    closeAccordion.call(this);
  };  

  function handleClick(event) {
    event.preventDefault();
    // if option to close eventually childs is active
    // and the childs aren't cached ->
    // found theme
    if ( this.options.closeChilds && ! this.targetsChildAccordions ) {
      this.targetsChildAccordions = [];
      this.targets.forEach(function(t) {
        this.targetsChildAccordions.push( [].slice.call( t.getElementsByClassName(this.options.accordionTogglerClass ) ) );
      },this);
      // flat childs array
      this.targetsChildAccordions = [].concat.apply([], this.targetsChildAccordions);
    }

    if ( this.open ) {
      closeAccordion.call(this);
    } else {
      openAccordion.call(this);
    }
  }

  function closeAccordion() {
    this.$targets.slideUp({
      duration: 150
    });
    this.$element.addClass('close').removeClass('open');
    if ( this.$wrapToggler.length > 0 ) {
      this.$wrapToggler.addClass('close').removeClass('open');
    }

    // propagate the close accordion to childs
    if( this.options.closeChilds ) {
      this.targetsChildAccordions.forEach(function(child) {
        if( child.DistanceAccordionInstance.open ) {
          child.DistanceAccordionInstance.closeAccordion();
        }
      });
    }

    this.open = false;
    this.close = true;
  }

  function openAccordion() {
    if ( this.options.scrollTo ) {
      var scrollVal = this.$targets.eq(0).offset().top;
      var that = this;

      $('html, body').animate({ 
          scrollTop: scrollVal
        },
        function() {
          that.$targets.slideDown({
            duration: 150
          });
        } 
      );
    } else {
      this.$targets.slideDown({
        duration: 150,
        complete:function() {
          $(this).trigger('da:open_complete');
        }
      });
    }
    this.$element.addClass('open').removeClass('close');
    if ( this.$wrapToggler.length > 0 ) {
      this.$wrapToggler.addClass('open').removeClass('close');
    }
    this.open = true;
    this.close = false;
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