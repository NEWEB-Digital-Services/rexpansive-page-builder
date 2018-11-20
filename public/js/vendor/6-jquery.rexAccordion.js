/*
 *  rexAccordion - v1.0.0
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
  var pluginName = "rexAccordion",
    defaults = {
      selectors: {
        toggle: '.rex-accordion--toggle',
        content: '.rex-accordion--content'
      },
      duration: 150
    };

  // The actual plugin constructor
  function rexAccordion(element, options) {
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
      $toggle: this.$element.find(this.settings.selectors.toggle),
      $content: this.$element.find(this.settings.selectors.content)
    };

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(rexAccordion.prototype, {
    init: function () {

      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.settings
      // you can add more functions like the one below and
      // call them like the example bellow
      var that = this;

      console.log('plugin int');

      if(this.$element.hasClass('close')) {
        this.close_all();
      }

      if(this.$element.hasClass('open')) {
        this.open_all();
      }
      
      this.properties.$toggle.each(function(i,el) {
        $(el).on('click', function() {
          that._handle_click(i);
        });
      });
    },
    
    _handle_click: function(item) {
      var that = this;
      // If there is only a toggle and a content
      if(1 == this.properties.$toggle.length) {
        if( this.$element.hasClass('open') ) {
          this.$element.addClass('close').removeClass('open');
          this.properties.$content.slideUp({
            duration:this.settings.duration,
            complete: function() {
              that.$element.trigger('rex_accordion:close');
            }
          }).attr('data-item-status','close');
        } else if ( this.$element.hasClass('close' ) ) {
          this.$element.addClass('open').removeClass('close');
          this.properties.$content.slideDown({
            duration:this.settings.duration,
            complete:function(){
              that.$element.trigger('rex_accordion:open');
            }
          }).attr('data-item-status','open');
        }
      // else if there are more than one accordion, handle this opening one and closing the others
      } else if( 1 < this.properties.$toggle.length ) {
        if( this.$element.hasClass('open') ) {
          if("open" == this.properties.$content.eq(item).attr('data-item-status')) {
            this.$element.addClass('close').removeClass('open');
            this.properties.$content.eq(item).slideUp({
              duration:this.settings.duration,
              complete:function() {
                that.$element.trigger('rex_accordion:close');
              }  
            }).attr('data-item-status','close');
          } else {
            this.$element.addClass('close').removeClass('close');
            this.properties.$content.not(item).slideUp({
              duration:this.settings.duration,
              complete:function() {
                that.$element.trigger('rex_accordion:close');
              }
            }).attr('data-item-status','close');
            this.properties.$content.eq(item).slideDown({
              duration:this.settings.duration,
              complete:function() {
                that.$element.trigger('rex_accordion:open');
              }
            }).attr('data-item-status','open');
          }
        } else if ( this.$element.hasClass('close' ) ) {
          if("close" == this.properties.$content.eq(item).attr('data-item-status')) {
            this.$element.addClass('open').removeClass('close');
            this.properties.$content.eq(item).slideDown({
              duration:this.settings.duration,
              complete:function() {
                that.$element.trigger('rex_accordion:open');
              }
            }).attr('data-item-status','open');
          } else {
            this.$element.addClass('close').removeClass('open');
            this.properties.$content.eq(item).slideUp({
              duration:this.settings.duration,
              complete:function() {
                that.$element.trigger('rex_accordion:close');
              }
            }).attr('data-item-status','close');
            this.properties.$content.not(item).slideDown({
              duration:this.settings.duration,
              complete:function() {
                that.$element.trigger('rex_accordion:open');
              }
            }).attr('data-item-status','open');
          }
        }
      }
    },

    // _viewport: function () {
    //   var e = window, a = 'inner';
    //   if (!('innerWidth' in window)) {
    //     a = 'client';
    //     e = document.documentElement || document.body;
    //   }
    //   return { width: e[a + 'Width'], height: e[a + 'Height'] };
    // },

    open_all: function( ) {
      this.properties.$content.attr('data-item-status', 'open');
      this.properties.$content.css('display','block');
      if( this.$element.hasClass('close') ) {
        this.$element.addClass('open').removeClass('close');
      }
    },

    close_all: function( ) {
      this.properties.$content.attr('data-item-status', 'close');
      this.properties.$content.css('display','none');
      if( this.$element.hasClass('open') ) {
        this.$element.addClass('close').removeClass('open');
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
          $.data(this, 'plugin_' + pluginName, new rexAccordion(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof rexAccordion && typeof instance[options] === 'function') {
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
