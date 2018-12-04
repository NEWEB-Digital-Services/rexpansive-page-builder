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
      effect: {},
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
    this.settings.effect.settings = {};

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(rexEffect.prototype, {
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
      var that  =   this;
      var renderer = new PIXI.autoDetectRenderer( this.settings.effect.settings.stageWidth, this.settings.effect.settings.stageHeight, { transparent: true });
      var stage = new PIXI.Container();
      var effectContainer = new PIXI.Container();
      var displacementSprite = new PIXI.Sprite.fromImage( this.settings.effect.settings.displacementImage );
      var displacementFilter = new PIXI.filters.DisplacementFilter( displacementSprite );

      /**
       * Launch PIXI and prepare filter area
       */
      var initPixi = function() {

        if( "undefined" !== typeof that.settings.effect.settings.appendTo && "" !== that.settings.effect.settings.appendTo ) {
          that.settings.effect.settings.appendTo.appendChild( renderer.view );
        }

        // Add child container to the main container 
        stage.addChild( effectContainer );
  
        renderer.view.style.width = '100%';
        renderer.view.style.height    = '100%';
        renderer.view.style.objectFit = 'cover';
        renderer.view.style.top       = '0';
        renderer.view.style.left      = '0';
        renderer.view.style.position      = 'absolute';
        renderer.view.style.display      = 'block';
        renderer.view.style.zIndex      = '-1';

        renderer.autoResize = true;
 
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

        // Set the filter to stage and set some default values for the animation
        stage.filters = [displacementFilter];        

        if ( that.settings.effect.settings.autoPlay === false ) {
          displacementFilter.scale.x = 0;
          displacementFilter.scale.y = 0;
        }

        displacementSprite.scale.x = 2;
        displacementSprite.scale.y = 2;
  
        // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
        displacementFilter.autoFit = that.settings.effect.settings.displaceAutoFit;
        
        stage.addChild( displacementSprite );
      };

      /**
       * Add the image to apply the effect
       */
      var loadPixiSprites = function() {
        var rSprites = that.settings.effect.settings.sprites;
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
            var containerWidth = renderer.width;
            var containerHeight = renderer.height;

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
                image.x = renderer.width - finalWidth;
                break;
              case 'center':
              default:
                image.x = ( renderer.width - finalWidth ) / 2;
                break;
            }

            switch(that.settings.effect.settings.spritePosition[1]) {
              case 'top':
                image.y = 0;
                break;
              case 'bottom':
                image.y = renderer.height - finalHeight;
                break;
              case 'middle':
              default:
                image.y = ( renderer.height - finalHeight ) / 2;
                break;
            }

            effectContainer.addChild( image );
          }

          console.log(renderer.width);
          console.log(renderer.height);
        });
      };

      var animateEffect = function() {
        if ( that.settings.effect.settings.autoPlay === true ) {
            var ticker = new PIXI.ticker.Ticker(); 
          ticker.autoStart = that.settings.effect.settings.autoPlay;
  
          ticker.add(function( delta ) {
            displacementSprite.x += that.settings.effect.settings.autoPlaySpeed[0] * delta;
            displacementSprite.y += that.settings.effect.settings.autoPlaySpeed[1];
            renderer.render( stage );
          });
  
        }  else {
          var render = new PIXI.ticker.Ticker();
          render.autoStart = true;
  
          render.add(function( delta ) {
            renderer.render( stage );
          });
        }
      };
      
      if ( this.settings.effect.settings.displacementCenter === true ) {
        displacementSprite.anchor.set(0.5);
        displacementSprite.x = renderer.view.width / 2;
        displacementSprite.y = renderer.view.height / 2;
      }

      var launch = function() {
        initPixi();
        loadPixiSprites();
        animateEffect();
        that.element.getElementsByClassName("rex-image-wrapper")[0].style.backgroundImage = "";
      };
      
      launch();

      var hasResized = false;

      window.addEventListener("resize", function() {
        hasResized = true;
      });

      setInterval(function() {
        if( hasResized ) {
          var sizes = that.settings.effect.settings.appendTo.getBoundingClientRect();
          renderer.resize(sizes.width, sizes.height);

          var image = effectContainer.getChildAt(0);

          var imgWidth = image.texture.orig.width;
          var imgHeight = image.texture.orig.height;
          var containerWidth = renderer.width;
          var containerHeight = renderer.height;

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
              image.x = renderer.width - finalWidth;
              break;
            case 'center':
            default:
              image.x = ( renderer.width - finalWidth ) / 2;
              break;
          }

          switch(that.settings.effect.settings.spritePosition[1]) {
            case 'top':
              image.y = 0;
              break;
            case 'bottom':
              image.y = renderer.height - finalHeight;
              break;
            case 'middle':
            default:
              image.y = ( renderer.height - finalHeight ) / 2;
              break;
          }

          hasResized = false;
        }
      },250);
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
