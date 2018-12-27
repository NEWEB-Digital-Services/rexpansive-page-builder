var RexSlider = (function ($) {
    'use strict';

    var slider_class = '.rex-slider-wrap';
    var slider_element_class = '.rex-slider-element';
    var slider_custom_nav_class = '.flickity-page-dots.rex-slider__custom-nav';
    var slider_element_title_wrap = '.rex-slider-element-title';
    var context = '.rexpansive_section';

    var box_slider_class = '.rex-box-slider-wrap';
    var box_slider_element_class = '.rex-box-slider-element';

    var _initSlider = function ($sliderWrap) {

        var settings = {
            cellAlign: 'left',
            // contain: true,
            prevNextButtons: false,
            pageDots: false,
            cellSelector: slider_element_class,
            selectedAttraction: 0.018,
            friction: 0.30,
            wrapAround: true,
            // adaptiveHeight: true,
            // setGallerySize: false,
            arrowShape: 'M 71.080084,1.034481 C 71.763642,0.34482599 72.61809,-1.250001e-8 73.557983,-1.250001e-8 c 0.939893,0 1.794341,0.34482600250001 2.477899,1.03448101250001 1.367117,1.37931 1.367117,3.620689 0,5 L 32.459031,49.999998 76.035882,93.965515 c 1.367117,1.379311 1.367117,3.62069 0,5 -1.367117,1.379315 -3.588681,1.379315 -4.955798,0 L 25.025333,52.499998 c -1.367117,-1.37931 -1.367117,-3.62069 0,-5 l 46.054751,-46.465517 0,0 z'
        };

        settings.setGallerySize = ('undefined' != typeof $sliderWrap.attr('data-set-gallery-size') ? JSON.parse($sliderWrap.attr('data-set-gallery-size')) : false);

        var auto_player = $sliderWrap.attr('data-rex-slider-animation');
        if ('undefined' != typeof auto_player && 'true' == auto_player.toString() ) {
            settings.autoPlay = true;
        } else {
            settings.autoPlay = false;
        }

        var prev_next = $sliderWrap.attr('data-rex-slider-prev-next');
        if ('undefined' != typeof prev_next && '1' == prev_next.toString()) {
            settings.prevNextButtons = true;
        }

        var dots = $sliderWrap.attr('data-rex-slider-dots');
        if ('undefined' != typeof dots && '1' == dots.toString()) {
            settings.pageDots = true;
        }

        if ($sliderWrap.hasClass('rex-slider--bottom-interface')) {
            $sliderWrap.parents('.block-has-slider').addClass('block-has-slider--navigator');
        }

        $sliderWrap.find(".rex-slider-element").each(function (i, slide) {
            var $video = $(slide).find(".rex-slider-video-wrapper");
            Rexbuilder_Util.startVideoPlugin($video);
        });

        $sliderWrap.flickity(settings);
        $sliderWrap.flickity('stopPlayer');

        //da fixare dopo per il resize
        Rexbuilder_Util.$window.on('resize', function () {
            if ($sliderWrap.data('flickity')) {
                $sliderWrap.flickity('resize');
            }
        });

        $sliderWrap.on('dragStart.flickity', function () {
            $(this).addClass('is-dragging');
        });

        $sliderWrap.on('dragEnd.flickity', function () {
            $(this).removeClass('is-dragging');
        });

        //play videos on focus slide
        $sliderWrap.on('select.flickity', function (event, index) {
            var $rexSlider = $(event.target)
            var $videoSlide = $rexSlider.find('.rex-slider-element.is-selected .rex-slider-video-wrapper');
            $rexSlider.find(".rex-slider-video-wrapper").each(function (i, videoEl) {
                if (videoEl != $videoSlide[0]) {
                    Rexbuilder_Util.pauseVideo($(videoEl));
                }
            });
            Rexbuilder_Util.playVideo($videoSlide);
        });

        if (settings.autoPlay) {
            $sliderWrap.flickity('playPlayer');
        }

        $sliderWrap.attr("data-rex-slider-active", true);

        /**
         * Custom navigator logic. Valid for a list of dots wrapped by a general class
         */
        $sliderWrap.find(slider_custom_nav_class).children().first().addClass('is-selected');

        $sliderWrap.find(slider_custom_nav_class).on('click', '.dot', function (e) {
            var $this = $(this);
            var index = $this.index();
            $this.addClass('is-selected').siblings('.dot').removeClass('is-selected');
            $sliderWrap.flickity('select', index);
        })
    }

    var _initSliderBox = function (el) {
        var settings = {
            cellAlign: 'center',
            // contain: true,
            prevNextButtons: true,
            pageDots: true,
            cellSelector: box_slider_element_class,
            selectedAttraction: 0.018,
            friction: 0.30,
            initialIndex: ('undefined' !== typeof ($(el).attr('data-rex-box-slider-initialIndex')) ? parseInt($(el).attr('data-rex-box-slider-initialIndex')) : 0),
            // groupCells: 3,
            // wrapAround: true,
            setGallerySize: false,
            // adaptiveHeight: true,
            arrowShape: 'm 38.79662,40.087413 0,0 c -0.387529,0 -0.757576,-0.154429 -1.031468,-0.425408 L 1.2470862,3.1322842 c -0.56818177,-0.5681815 -0.56818177,-1.4918411 0,-2.060023 0.5681819,-0.56818197 1.4918415,-0.56818197 2.0600234,0 L 38.793706,36.570513 74.294872,1.0722612 c 0.568182,-0.56818197 1.491842,-0.56818197 2.060023,0 0.568182,0.5681819 0.568182,1.4918415 0,2.060023 L 39.825175,39.659091 c -0.273893,0.273893 -0.641026,0.428322 -1.028555,0.428322 l 0,0 0,0 z'
        };

        var auto_player = $(el).attr('data-rex-slider-animation');
        if ('undefined' != typeof auto_player && 'true' == auto_player) {
            settings.autoPlay = true;
        }

        $(el).flickity(settings);
        $(el).flickity('stopPlayer');

        Rexbuilder_Util.$window.on('resize', function () {
            $(el).flickity('resize');
        });

        $(el).on('dragStart.flickity', function () {
            $(this).addClass('is-dragging');
        });

        $(el).on('dragEnd.flickity', function () {
            $(this).removeClass('is-dragging');
        });
    }

    var _rexSliderInitAllSliders = function () {
        if ($(slider_class, context).length > 0) {
            $(slider_class, context).each(function (i, el) {
                RexSlider.initSlider($(el));
                $(el).attr("data-rex-slider-number", i);
                Rexbuilder_Dom_Util.lastSliderNumber = i;
            });
        }

        if ($(box_slider_class, context).length > 0) {
            $(box_slider_class, context).each(function (i, el) {
                _initSliderBox(el);
            });
        }
    };

    var _destroySliderPlugins = function ($el) {
        if ('undefined' !== typeof $el.data('flickity')) {
            $el.flickity('destroy');
        }
        $el.find(".rex-slider-video-wrapper").each(function (i, videoEL) {
            Rexbuilder_Util.destroyVideo($(videoEL), false);
        });
    }

    var _rexSliderDestroyAllSlidersPlugins = function () {
        if ($(slider_class, context).length > 0) {
            $(slider_class, context).each(function (i, el) {
                _destroySliderPlugins($(el));
            });
        }

        if ($(box_slider_class, context).length > 0) {
            $(box_slider_class, context).each(function (i, el) {
                _destroySliderPlugins($(el));
            });
        }
    };

    var _startSliders = function () {
        if ($(slider_class, context).length) {
            $(slider_class, context).each(function (i, el) {
                var auto_player = $(el).attr('data-rex-slider-animation');
                if ('undefined' != typeof auto_player && 'true' == auto_player) {
                    $(el).flickity('playPlayer');
                }
            });
        }
    }

    var init = function () {
        _rexSliderInitAllSliders();
    };

    return {
        init: init,
        initSlider: _initSlider,
        startAutoPlay: _startSliders,
        destroy: _rexSliderDestroyAllSlidersPlugins,
        destroySliderPlugins: _destroySliderPlugins
    };

})(jQuery);
