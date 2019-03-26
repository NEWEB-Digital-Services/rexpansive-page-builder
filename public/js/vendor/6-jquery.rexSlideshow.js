/**
 * rexSlideshow - 1.0.0
 * Made by NEWEB di Simone Forgiarini
 */
;(function ($, window, document, undefined) {
  "use strict";

  // Create the defaults once
  var pluginName = "rexSlideshow",
    defaults = {
      enterAnimation: 'fadeIn',
      exitAnimation: 'fadeOut',
      enterSettings: {
        duration: 1000,
        delay: 0
      },
      exitSettings: {
        duration: 1000,
        delay: 500
      }
    };

  // The actual plugin constructor
  function rexSlideshow(element, options) {
    this.element = element;

    this.$element = $(element);

    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.properties = {
      launched: false,
      $slides: this.$element.find('.slide'),
      slideCount: 0,
    };

    this.properties.totalSlides = this.properties.$slides.length;

    this.settings.enterAnimation = this.getEnterAnimation();
    this.settings.exitAnimation = this.getExitAnimation();
    this.settings.enterSettings.duration = this.element.getAttribute('data-enter-animation-duration') || this.settings.enterSettings.duration;
    this.settings.enterSettings.delay = this.element.getAttribute('data-enter-animation-delay') || this.settings.enterSettings.delay;
    this.settings.exitSettings.duration = this.element.getAttribute('data-exit-animation-duration') || this.settings.exitSettings.duration;
    this.settings.exitSettings.delay = this.element.getAttribute('data-exit-animation-delay') || this.settings.exitSettings.delay;
    var that = this;
    this.settings.exitSettings.complete = function () {
      that.settings.slideCount < that.settings.totalSlides - 1 ? that.settings.slideCount++ : that.settings.slideCount = 0;
      that.slideShow();
    }

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(rexSlideshow.prototype, {
    init: function () {
      this.slideShow();
    },
    slideShow: function () {
      this.properties.$slides.eq(this.properties.slideCount).velocity(this.settings.enterAnimation, this.settings.enterSettings).velocity(this.settings.exitAnimation, this.settings.exitSettings);
    },
    getEnterAnimation: function () {
      var prop = this.$element.attr('data-enter-animation');
      switch (prop) {
        case 'fadeIn':
          return "fadeIn";
        default:
          return this.settings.enterAnimation;
      }
    },
    getExitAnimation: function () {
      var prop = this.$element.attr('data-exit-animation');
      switch (prop) {
        case 'fadeOut':
          return "fadeOut";
        default:
          return this.settings.exitAnimation;
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
          $.data(this, 'plugin_' + pluginName, new rexSlideshow(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof rexSlideshow && typeof instance[options] === 'function') {
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