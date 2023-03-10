/*
 *  rexIndicator
 * @version 1.0.0
 *
 *  Made by NEWEB - Digital Agency
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
  var pluginName = "rexIndicator",
    defaults = {
      indicator: '.rex-indicator__wrap--absolute',
      block_parent: '.perfect-grid-item',
      after: '.rexpansive_section'
    };

  function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return { width: e[a + 'Width'], height: e[a + 'Height'] };
  }

  // The actual plugin constructor
  function rexIndicator(element, options) {
    this.element = element;

    this.$element = $(element);

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.settings.from = this.$element.find(this.settings.indicator).attr('data-ri-from') || this.settings.from;
    this.settings.to = this.$element.find(this.settings.indicator).attr('data-ri-to') || this.settings.to;

    this.$line_ref = this.$element.children(this.settings.indicator);
    this.$block_ref = this.$element.parents(this.settings.block_parent);
    this.$after_ref = this.$element.parents(this.settings.after);

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(rexIndicator.prototype, {
    init: function () {
      
      this.move_indicator();
      // this.fix_wrap_height();
      this.place_indicator();

      var that = this;

      this.$after_ref.on('rearrangeComplete', function() {
        // that.fix_wrap_height();
        that.place_indicator();
      });
    },

    /**
     * moving navigator outside its placeholder
     */
    move_indicator: function() {
      this.$after_ref.after(this.$line_ref);
    },

    /**
     * moving the indicator in the right place
     */
    place_indicator: function() {
      var p = {
        top: 0,
        left: 0
      };

      var b_offset = this.$block_ref.offset();

      if( this.settings.to == 'left' || this.settings.to == 'right' ) {
        p.top = b_offset.top + ( this.$block_ref.outerHeight() / 2 );
      } else {
        if( this.settings.to == 'top' ) {
          p.top = b_offset.top - (this.$line_ref.height() / 2);
        } else if ( this.settings.to == 'bottom' ) {
          p.top = b_offset.top + this.$block_ref.outerHeight() - (this.$line_ref.height() / 2);
        }
      }
      
      if( this.settings.to == 'top' || this.settings.to == 'bottom' ) {
        p.left = b_offset.left + ( this.$block_ref.outerWidth() / 2 );
      } else {
        if( this.settings.to == 'left' ) {
          p.left = b_offset.left - (this.$line_ref.width() / 2);
        } else if( this.settings.to == 'right' ) {
          p.left = b_offset.left + this.$block_ref.outerWidth() - (this.$line_ref.width() / 2);
        }
      }

      this.$line_ref.offset(p);
    },

    fix_wrap_height: function() {
      if(viewport().width < 767) {
        var w = this.$block_ref.find('.text-wrap')[0];
        w.style.minHeight = 'auto';
        var h = w.offsetHeight;
        if( h < 96 ) {
          w.style.minHeight = h + 50 + 'px';
        }
      }
    }
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new rexIndicator(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof rexIndicator && typeof instance[options] === 'function') {
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
