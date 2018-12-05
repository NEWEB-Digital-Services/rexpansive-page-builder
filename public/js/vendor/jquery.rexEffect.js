/*
 *  rexEffect
 *  @version 1.0.0
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
  var pluginName = "rexEffect",
    defaults = {
      block_parent: '.perfect-grid-item',
      effect: {
        name: "",
        options: {}
      },
    };

  // The actual plugin constructor
  function rexEffect(element, options) {
    this.element = element;

    this.$element = $(element);

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    // this.settings.effect.name = "";
    // this.settings.effect.settings = {};
    this.$window = $(window);
    this.settings.animationClasses = {
      fadeIn: 'fadeIn',
      fadeOut: 'fadeOut'
    };

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend( rexEffect.prototype, {
    init: function () {
      this.initEffect();
      this.runEffect();
    },

    initEffect: function() {
      switch( this.settings.effect.name ) {
        case 'distortion':
          var spriteImagesSrc = [];
          var appendTo = this.element.getElementsByClassName("grid-item-content")[0];
          var elementSizes = appendTo.getBoundingClientRect();
  
          var block_data = this.element.children[0];
          spriteImagesSrc.push(block_data.getAttribute("data-image_bg_block"));

          var spritePosition = block_data.getAttribute("data-block_flex_img_position").split(" ");
          var spriteDimension = block_data.getAttribute("data-type_bg_block");

          this.settings.effect.settings = {
            stageWidth: elementSizes.width,
            stageHeight: elementSizes.height,
            sprites: spriteImagesSrc,
            spritePosition: spritePosition,
            spriteDimension: spriteDimension,
            displacementImage: "wp-content/plugins/rexpansive-builder/public/img/clouds.jpg",
            autoPlay: true,
            autoPlaySpeed: [10, 3],
            displacementCenter: true,
            displaceAutoFit: false,
            appendTo: appendTo,
          };

          // this.settings.effect.properties = {
            this.settings.effect.properties.$imageWrapper = this.$element.find(".rex-image-wrapper");
            this.settings.effect.properties.alreadyVisible = false;
            this.settings.effect.properties.launched = false;
            this.settings.effect.properties.fadingIn = false;
            this.settings.effect.properties.fadingOut = false;
            this.settings.effect.properties.stopTimeout = 3000;
            this.settings.effect.properties.effectMode = "scrollVisible"; // oneTime | scrollAll | scrollVisible
          // };

          break;
        default:
          break;
      }
    },

    runEffect: function() {
      switch( this.settings.effect.name ) {
        case 'distortion':
          this.distortion();
          break;
        default:
          break;
      }
    },

    distortion: function() {
      var that = this;
      this.settings.effect.properties.renderer = new PIXI.autoDetectRenderer( this.settings.effect.settings.stageWidth, this.settings.effect.settings.stageHeight, { transparent: true });
      this.settings.effect.properties.stage = new PIXI.Container();
      this.settings.effect.properties.effectContainer = new PIXI.Container();
      this.settings.effect.properties.displacementSprite = new PIXI.Sprite.fromImage( this.settings.effect.settings.displacementImage );
      this.settings.effect.properties.displacementFilter = new PIXI.filters.DisplacementFilter( this.settings.effect.properties.displacementSprite );
      
      if ( this.settings.effect.settings.displacementCenter === true ) {
        this.settings.effect.properties.displacementSprite.anchor.set(0.5);
        this.settings.effect.properties.displacementSprite.x = this.settings.effect.properties.renderer.view.width / 2;
        this.settings.effect.properties.displacementSprite.y = this.settings.effect.properties.renderer.view.height / 2;
      }
      
      this._launchDistortion();

      window.addEventListener("resize", function() {
        that.settings.effect.properties.hasResized = true;
      });

      window.addEventListener("scroll", function() {
        that.settings.effect.properties.hasScrolled = true;
      });

      setInterval(function() {
        if( that.settings.effect.properties.hasResized ) {
          var sizes = that.settings.effect.settings.appendTo.getBoundingClientRect();
          that.settings.effect.properties.renderer.resize(sizes.width, sizes.height);

          var image = that.settings.effect.properties.effectContainer.getChildAt(0);

          var imgWidth = image.texture.orig.width;
          var imgHeight = image.texture.orig.height;
          var containerWidth = that.settings.effect.properties.renderer.width;
          var containerHeight = that.settings.effect.properties.renderer.height;

          var imgRatio = (imgHeight / imgWidth);
          var containerRatio = (containerHeight / containerWidth);

          switch(that.settings.effect.settings.spriteDimension) {
            case 'natural':
              if (containerRatio > imgRatio) {
                var finalWidth = containerWidth;
                var finalHeight = (containerWidth * imgRatio);
              } else {
                var finalHeight = containerHeight;
                var finalWidth = (containerHeight / imgRatio);
              }
              break;
            case 'full':
            default:
              if (containerRatio > imgRatio) {
                var finalHeight = containerHeight;
                var finalWidth = (containerHeight / imgRatio);
              } else {
                var finalWidth = containerWidth;
                var finalHeight = (containerWidth * imgRatio);
              }
              break;
          }
          image.transform.scale.x = finalWidth / imgWidth;
          image.transform.scale.y = finalHeight / imgHeight;

          switch(that.settings.effect.settings.spritePosition[0]) {
            case 'left':
              image.x = 0;
              break;
            case 'right':
              image.x = that.settings.effect.properties.renderer.width - finalWidth;
              break;
            case 'center':
            default:
              image.x = ( that.settings.effect.properties.renderer.width - finalWidth ) / 2;
              break;
          }

          switch(that.settings.effect.settings.spritePosition[1]) {
            case 'top':
              image.y = 0;
              break;
            case 'bottom':
              image.y = that.settings.effect.properties.renderer.height - finalHeight;
              break;
            case 'middle':
            default:
              image.y = ( that.settings.effect.properties.renderer.height - finalHeight ) / 2;
              break;
          }

          that.settings.effect.properties.hasResized = false;
        }
      },250);

      switch( this.settings.effect.properties.effectMode ) {
        case "oneTime":
          setInterval(function() {
            if( that.settings.effect.properties.hasScrolled && !that.settings.effect.properties.launched ) {
              if(that.isVisibile()) {
                if( !that.settings.effect.properties.ticker.started ) {
                  that._fadeInDistortion();
                  that._timeoutDistortionTicker();
                  that.settings.effect.properties.launched = true;
                  that.settings.effect.properties.alreadyVisible = true;
                }
              } else {
                if( that.settings.effect.properties.ticker.started ) {
                  that._fadeOutDistortion();
                }
                that.settings.effect.properties.alreadyVisible = false;
              }
            }
            that.settings.effect.properties.hasScrolled = false;
          },250);
          break;
        case "scrollAll":
          setInterval(function() {
            if( that.settings.effect.properties.hasScrolled ) {
              if(that.isVisibile()) {
                if( !that.settings.effect.properties.ticker.started ) {
                  that._fadeInDistortion();
                  that._timeoutDistortionTicker();
                  that.settings.effect.properties.launched = true;
                  that.settings.effect.properties.alreadyVisible = true;
                }
              } else {
                if( that.settings.effect.properties.ticker.started ) {
                  that._fadeOutDistortion();
                }
                that.settings.effect.properties.alreadyVisible = false;
              }
            }
            that.settings.effect.properties.hasScrolled = false;
          },250);
          break;
        case "scrollVisible":
          setInterval(function() {
            if( that.settings.effect.properties.hasScrolled ) {
              if(that.isVisibile()) {
                if( !that.settings.effect.properties.ticker.started && !that.settings.effect.properties.alreadyVisible ) {
                  that._fadeInDistortion();
                  that._timeoutDistortionTicker();
                  that.settings.effect.properties.launched = true;
                  that.settings.effect.properties.alreadyVisible = true;
                }
              } else {
                if( that.settings.effect.properties.ticker.started ) {
                  that._fadeOutDistortion();
                }
                that.settings.effect.properties.alreadyVisible = false;
              }
            }
            that.settings.effect.properties.hasScrolled = false;
          },250);
          break;
        default:
          break;
      }
    },

    _simpleFadeIn: function() {
      that.settings.effect.properties.ticker.start();
      that.settings.effect.properties.renderer.view.style.opacity = "1";
      that.settings.effect.properties.$imageWrapper[0].style.opacity = "0";
    },

    _simpleFadeOut: function() {
      that.settings.effect.properties.ticker.stop();
      that.settings.effect.properties.renderer.view.style.opacity = "0";
      that.settings.effect.properties.$imageWrapper[0].style.opacity = "1";
    },

    _fadeInDistortion: function() {
      if( !this.settings.effect.properties.fadingIn ) {
        var that = this;
        this.settings.effect.properties.fadingIn = true;
        this.settings.effect.properties.ticker.start();
        $(this.settings.effect.properties.renderer.view).addClass(this.settings.animationClasses.fadeIn).one("animationend", function() {
          this.style.opacity = "1";
          $(this).removeClass(that.settings.animationClasses.fadeIn);
          that.settings.effect.properties.fadingIn = false;
        });
        this.settings.effect.properties.$imageWrapper.addClass(this.settings.animationClasses.fadeOut).one("animationend", function() {
          this.style.opacity = "0";
          $(this).removeClass(that.settings.animationClasses.fadeOut);
        });
      }
    },

    _fadeOutDistortion: function() {
      if( !this.settings.effect.properties.fadingOut ) {
        this.settings.effect.properties.fadingOut = true;
        var that = this;
        $(this.settings.effect.properties.renderer.view).addClass(this.settings.animationClasses.fadeOut).one("animationend", function() {
          this.style.opacity = "0";
          $(this).removeClass(that.settings.animationClasses.fadeOut);
          that.settings.effect.properties.fadingOut = false;
          that.settings.effect.properties.ticker.stop();
        });
        this.settings.effect.properties.$imageWrapper.addClass(this.settings.animationClasses.fadeIn).one("animationend", function() {
          this.style.opacity = "1";
          $(this).removeClass(that.settings.animationClasses.fadeIn);
        });
      }
    },

    _timeoutDistortionTicker: function() {
      var that = this;
      setTimeout(function() {
        that._fadeOutDistortion();
      },this.settings.effect.properties.stopTimeout);
    },

    /**
     * Launch PIXI and prepare filter area
     */
    _initDistortionPixi: function() {

      if( "undefined" !== typeof this.settings.effect.settings.appendTo && "" !== this.settings.effect.settings.appendTo ) {
        this.settings.effect.settings.appendTo.appendChild( this.settings.effect.properties.renderer.view );
      }

      // Add child container to the main container 
      this.settings.effect.properties.stage.addChild( this.settings.effect.properties.effectContainer );

      this.settings.effect.properties.renderer.view.style.width = '100%';
      this.settings.effect.properties.renderer.view.style.height    = '100%';
      this.settings.effect.properties.renderer.view.style.objectFit = 'cover';
      this.settings.effect.properties.renderer.view.style.top       = '0';
      this.settings.effect.properties.renderer.view.style.left      = '0';
      this.settings.effect.properties.renderer.view.style.position      = 'absolute';
      this.settings.effect.properties.renderer.view.style.display      = 'block';
      this.settings.effect.properties.renderer.view.style.zIndex      = '-1';

      this.settings.effect.properties.renderer.autoResize = true;

      this.settings.effect.properties.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

      // Set the filter to stage and set some default values for the animation
      this.settings.effect.properties.stage.filters = [this.settings.effect.properties.displacementFilter];  

      if ( this.settings.effect.settings.autoPlay === false ) {
        this.settings.effect.properties.displacementFilter.scale.x = 0;
        this.settings.effect.properties.displacementFilter.scale.y = 0;
      }

      this.settings.effect.properties.displacementSprite.scale.x = 2;
      this.settings.effect.properties.displacementSprite.scale.y = 2;

      // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
      this.settings.effect.properties.displacementFilter.autoFit = this.settings.effect.settings.displaceAutoFit;
      
      this.settings.effect.properties.stage.addChild( this.settings.effect.properties.displacementSprite );
    },

    /**
     * Add the image to apply the effect
     */
    _loadPixiSprites: function() {
      var rSprites = this.settings.effect.settings.sprites;
      var that = this;
      var loader = new PIXI.loaders.Loader();
      for( var i = 0; i < rSprites.length; i++ ) {
        loader.add(i.toString(), rSprites[i]);
      }

      loader.load((loader, resources) => {
        for( var res in resources ) {
          var image = new PIXI.Sprite( resources[res].texture );
          // image.anchor.set(0.5);

          var imgWidth = resources[res].texture.orig.width;
          var imgHeight = resources[res].texture.orig.height;
          var containerWidth = that.settings.effect.properties.renderer.width;
          var containerHeight = that.settings.effect.properties.renderer.height;

          var imgRatio = (imgHeight / imgWidth);
          var containerRatio = (containerHeight / containerWidth);

          switch(that.settings.effect.settings.spriteDimension) {
            case 'natural':
              if (containerRatio > imgRatio) {
                var finalWidth = containerWidth;
                var finalHeight = (containerWidth * imgRatio);
              } else {
                var finalHeight = containerHeight;
                var finalWidth = (containerHeight / imgRatio);
              }
              break;
            case 'full':
            default:
              if (containerRatio > imgRatio) {
                var finalHeight = containerHeight;
                var finalWidth = (containerHeight / imgRatio);
              } else {
                var finalWidth = containerWidth;
                var finalHeight = (containerWidth * imgRatio);
              }
              break;
          }
          image.transform.scale.x = finalWidth / imgWidth;
          image.transform.scale.y = finalHeight / imgHeight;

          switch(that.settings.effect.settings.spritePosition[0]) {
            case 'left':
              image.x = 0;
              break;
            case 'right':
              image.x = that.settings.effect.properties.renderer.width - finalWidth;
              break;
            case 'center':
            default:
              image.x = ( that.settings.effect.properties.renderer.width - finalWidth ) / 2;
              break;
          }

          switch(that.settings.effect.settings.spritePosition[1]) {
            case 'top':
              image.y = 0;
              break;
            case 'bottom':
              image.y = that.settings.effect.properties.renderer.height - finalHeight;
              break;
            case 'middle':
            default:
              image.y = ( that.settings.effect.properties.renderer.height - finalHeight ) / 2;
              break;
          }

          that.settings.effect.properties.effectContainer.addChild( image );
        }
      });
    },

    _initDistortionEffect: function() {
      var that = this;
      this.settings.effect.properties.ticker = new PIXI.ticker.Ticker();

      this.settings.effect.properties.ticker.add(function( delta ) {
        that.settings.effect.properties.displacementSprite.x += that.settings.effect.settings.autoPlaySpeed[0] * delta;
        that.settings.effect.properties.displacementSprite.y += that.settings.effect.settings.autoPlaySpeed[1];  
        that.settings.effect.properties.renderer.render( that.settings.effect.properties.stage );
      });

      // this.settings.effect.properties.ticker.start();
      if( 0 === this.settings.effect.properties.startDelay ) {
        this._distortionStart();
      } else {
        setTimeout(function() {
          that._distortionStart();
        }, this.settings.effect.properties.startDelay);
      }
    },

    _distortionStart: function() {
      if ( this.isVisibile() ) {
        // this.settings.effect.properties.$imageWrapper[0].style.opacity = "0";
        // this.settings.effect.properties.ticker.start();
        this._fadeInDistortion();
        this._timeoutDistortionTicker();
        this.settings.effect.properties.launched = true;
        this.settings.effect.properties.alreadyVisible = true;
      } else {
        this.settings.effect.properties.renderer.view.style.opacity = "0";
      }
    },

    _launchDistortion: function() {
      this._initDistortionPixi();
      this._loadPixiSprites();
      this._initDistortionEffect();
    },

    isVisibile: function() {
      var win_height = this.$window.height(),
        win_height_padded_bottom,
        win_height_padded_top;
      win_height_padded_bottom = win_height * 0.8;
      win_height_padded_top = win_height * 0.3;

      var elementPositionTop = this.$element.offset().top,
        elementHeight = this.$element.height(),
        scrolled = $(window).scrollTop();

      if ( ( elementPositionTop - win_height_padded_bottom < scrolled ) && ( ( elementPositionTop + elementHeight ) - win_height_padded_top > scrolled ) ) {
        return true;
      } else {
        return false;
      }
    },
    
    _viewport: function () {
      var e = window, a = 'inner';
      if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
      }
      return { width: e[a + 'Width'], height: e[a + 'Height'] };
    },
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new rexEffect(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);
        if (instance instanceof rexEffect && typeof instance[options] === 'function') {
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
