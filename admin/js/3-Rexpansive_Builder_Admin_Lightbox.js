/**
 * Object that contains the modals utilities
 */
var Rexpansive_Builder_Admin_Lightbox = (function($) {
  'use strict';

  var $lightbox;
  var $lbx_bg;
  var $lbx_container;
  var $lbx_item;

  var _cache_variables = function() {
    $lightbox = $('.rex-lightbox');
    $lbx_bg = $lightbox.find('.rex-lightbox__bg');
    $lbx_container = $lightbox.find('.rex-lightbox__container');
    $lbx_item = $lightbox.find('.rex-lightbox__item');
  };

  var _listen_events = function() {
    $lightbox.on('rex_lightbox:open', function(e,item) {
      $lightbox
        .addClass('rex-lightbox--open rex-lightbox--animate_opacity rex-lightbox--animated-in rex-lightbox--visible')
        .css('position','fixed')
        .css('opacity',1);
      $lbx_bg.css('opacity',1);
      $lbx_container.css('transform','translate3d(0px, 0px, 0px)');
      console.log(item);
      $lbx_item.empty().append(item);
    });

    $lightbox.on('rex_lightbox:close', function() {
      $lightbox
        .removeClass('rex-lightbox--open rex-lightbox--animate_opacity rex-lightbox--animated-in rex-lightbox--visible')
        .css('position','')
        .css('opacity','');
        $lbx_bg.css('opacity','');
        $lbx_container.css('transform','');
        $lbx_item.empty();
    });

    $lightbox.on('click', function(e) {
      close();
    });
  };

  var open = function(item) {
    $lightbox.trigger('rex_lightbox:open',item);
  };

  var close = function() {
    $lightbox.trigger('rex_lightbox:close');
  };

  var init = function() {
    _cache_variables();
    _listen_events();
  };
  
  return {
    init: init,
    open: open,
    close: close,
  };
  
})(jQuery);