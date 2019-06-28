/*
 *  rexScrolled - v0.1
 *
 *  Made by NEWEB di Simone Forgiarini
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

  "use strict";

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "rexScrolled",
    defaults = {
      offset: 0,
      mobile: true,
      force_launch: false,
      callback: null,
    };

  // window height shared var
  // the window height do not depends on the elements to scroll position
  // its the same for everyone
  // so I can share it between the plugin instances and update it on the page resize
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

  /**
   * Calculate viewport window and height
   */
  function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return { width: e[a + 'Width'], height: e[a + 'Height'] };
  };

  // The actual plugin constructor
  function rexScrolled(element, options) {
    this.element = element;

    this.$element = $(element);

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.properties = {
      launched: false
    };

    this.settings.offset = parseInt(this.$element.attr('data-rs-animation-offset') || this.settings.offset);
    this.settings.force_launch = this.$element.attr('data-rs-animation-force-launch') || this.settings.force_launch;

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(rexScrolled.prototype, {
    init: function () {

      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.settings
      // you can add more functions like the one below and
      // call them like the example bellow
      this.has_scrolled();

      // vanilla binding
      window.addEventListener('scroll', this.has_scrolled.bind(this));
    },
    has_scrolled: function () {
      if (viewport().width <= 767 && !this.settings.mobile) {

        this.properties.launched = true;

      } else {
        var that = this;
        if (!that.properties.launched) {
          var win_height = windowInnerHeight,
            win_height_padded_bottom,
            win_height_padded_top,
            blockPosition = this.$element.offset().top,
            blockHeight = this.$element.height(),
            scrolled = scrollDocumentPositionTop();

          if (this.settings.offset === 0) {
            win_height_padded_bottom = win_height * 0.7;
            win_height_padded_top = win_height * 0.2;
          } else if (this.settings.offset > 0) {
            win_height_padded_bottom = win_height - this.settings.offset;
            win_height_padded_top = win_height * 0.2;
          } else if (this.settings.offset < 0) {
            win_height_padded_bottom = win_height * 0.7;
            win_height_padded_top = win_height + this.settings.offset;
          }

          if (((blockPosition - win_height_padded_bottom < scrolled) && ((blockPosition + blockHeight) - win_height_padded_top > scrolled)) || that.settings.force_launch) {
            that.properties.launched = true;
            that.$element.trigger('rs-scrolled-complete');
            if( this.settings.callback && 'function' === typeof this.settings.callback ) {
              this.settings.callback( this.element );
            }
          }
        }
      }
    },
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new rexScrolled(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof rexScrolled && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }
        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });
      return returns !== undefined ? returns : this;
    }
  };

})(jQuery, window, document);
