var RexSlider = (function($) {
  'use strict';

  var slider_class = '.rex-slider-wrap';
  var slider_element_class = '.rex-slider-element';
  var slider_element_title_wrap = '.rex-slider-element-title';
  var context = '.rexpansive_section';

  var box_slider_class = '.rex-box-slider-wrap';
  var box_slider_element_class = '.rex-box-slider-element';

  var _rexSliderInit = function() {
    if($(slider_class, context).length) {
      $(slider_class, context).each(function(i, el) {
        var settings = {
          cellAlign: 'left',
          // contain: true,
          prevNextButtons: false,
          pageDots: false,
          cellSelector: slider_element_class,
          selectedAttraction: 0.018,
          friction: 0.30,
          wrapAround: true,
          setGallerySize: false,
          adaptiveHeight: true,
          arrowShape: 'm 38.79662,40.087413 0,0 c -0.387529,0 -0.757576,-0.154429 -1.031468,-0.425408 L 1.2470862,3.1322842 c -0.56818177,-0.5681815 -0.56818177,-1.4918411 0,-2.060023 0.5681819,-0.56818197 1.4918415,-0.56818197 2.0600234,0 L 38.793706,36.570513 74.294872,1.0722612 c 0.568182,-0.56818197 1.491842,-0.56818197 2.060023,0 0.568182,0.5681819 0.568182,1.4918415 0,2.060023 L 39.825175,39.659091 c -0.273893,0.273893 -0.641026,0.428322 -1.028555,0.428322 l 0,0 0,0 z'
        };

        var auto_player = $(el).attr('data-rex-slider-animation');
        if('undefined' != typeof auto_player && 'true' == auto_player) {
          settings.autoPlay = true;
        }

        var prev_next = $(el).attr('data-rex-slider-prev-next');
        if('undefined' != typeof prev_next && '1' == prev_next) {
          settings.prevNextButtons = true;
        }

        var dots = $(el).attr('data-rex-slider-dots');
        if('undefined' != typeof dots && '1' == dots) {
          settings.pageDots = true;
        }

        $(el).flickity( settings );
        $(el).flickity('stopPlayer');

        // if( $(el).find('.rex-slider-element:not(:first-child) .youtube-player').length ) {
        //   // var video_state = $(el).find('.rex-slider-element:first-child .youtube-player')[0].state;
        //   // if(video_state != 1) {
        //     $(el).find('.rex-slider-element:not(first-child) .youtube-player').each(function() {
        //       $(this).YTPStop();
        //     })
        //   // }
        // }

        Util.$window.on('resize', function() {
          if( $(el).data('flickity') ) {
            $(el).flickity('resize');
          }
        });

        $(el).on( 'dragStart.flickity', function( ) {
          $(this).addClass('is-dragging');
        });

        $(el).on( 'dragEnd.flickity', function( ) {
          $(this).removeClass('is-dragging');
        });

        $(el).on( 'select.flickity', function() {
          var $videoSlide = $(this).find('.rex-slider-element.is-selected .rex-youtube-wrap');
          if( $videoSlide.length ) {
            var video_state = $videoSlide[0].state;
            if(video_state != 1) {
              $videoSlide.YTPPlay();
            }
          }
        });
      });
    }

    if($(box_slider_class, context).length) {
      $(box_slider_class, context).each(function(i, el) {
        var settings = {
          cellAlign: 'center',
          // contain: true,
          prevNextButtons: true,
          pageDots: true,
          cellSelector: box_slider_element_class,
          selectedAttraction: 0.018,
          friction: 0.30,
          initialIndex: ( 'undefined' !== typeof ( $(el).attr('data-rex-box-slider-initialIndex') ) ? parseInt( $(el).attr('data-rex-box-slider-initialIndex') ) : 0 ),
          // groupCells: 3,
          // wrapAround: true,
          setGallerySize: false,
          // adaptiveHeight: true,
          arrowShape: 'm 38.79662,40.087413 0,0 c -0.387529,0 -0.757576,-0.154429 -1.031468,-0.425408 L 1.2470862,3.1322842 c -0.56818177,-0.5681815 -0.56818177,-1.4918411 0,-2.060023 0.5681819,-0.56818197 1.4918415,-0.56818197 2.0600234,0 L 38.793706,36.570513 74.294872,1.0722612 c 0.568182,-0.56818197 1.491842,-0.56818197 2.060023,0 0.568182,0.5681819 0.568182,1.4918415 0,2.060023 L 39.825175,39.659091 c -0.273893,0.273893 -0.641026,0.428322 -1.028555,0.428322 l 0,0 0,0 z'
        };

        var auto_player = $(el).attr('data-rex-slider-animation');
        if('undefined' != typeof auto_player && 'true' == auto_player) {
          settings.autoPlay = true;
        }

        $(el).flickity( settings );
        $(el).flickity('stopPlayer');

        // if( $(el).find('.rex-slider-element:not(:first-child) .youtube-player').length ) {
        //   // var video_state = $(el).find('.rex-slider-element:first-child .youtube-player')[0].state;
        //   // if(video_state != 1) {
        //     $(el).find('.rex-slider-element:not(first-child) .youtube-player').each(function() {
        //       $(this).YTPStop();
        //     })
        //   // }
        // }

        Util.$window.on('resize', function() {
          $(el).flickity('resize');
        });

        $(el).on( 'dragStart.flickity', function( ) {
          $(this).addClass('is-dragging');
        });

        $(el).on( 'dragEnd.flickity', function( ) {
          $(this).removeClass('is-dragging');
        });

      });
    }
  };

  var _rexSliderDestroy = function() {
    if($(slider_class, context).length) {
      $(slider_class, context).each(function(i,el) {
        if( 'undefined' !== typeof $(el).data('flickity') ) {
          $(el).flickity('destroy');
        }
      });
    }

    if($(box_slider_class, context).length) {
      $(box_slider_class, context).each(function(i,el) {
        if( 'undefined' !== typeof $(el).data('flickity') ) {
          $(el).flickity('destroy');
        }
      });
    }
  };

  var init = function() {
    _rexSliderInit();
  };

  var _startSliders = function() {
    if($(slider_class, context).length) {
      $(slider_class, context).each(function(i,el) {
        var auto_player = $(el).attr('data-rex-slider-animation');
        if('undefined' != typeof auto_player && 'true' == auto_player) {
          $(el).flickity('playPlayer');
        }
      });
    }
  }

  return {
    init: init,
    startAutoPlay: _startSliders,
    destroy: _rexSliderDestroy,
  };

})(jQuery);
