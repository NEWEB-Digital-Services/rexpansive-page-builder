var Rexlive_PostEdit_MediaList = (function($) {
  'use strict';

  var $modal_wrap;
  var media_list_properties;

  /**
   * Private method to cache some values
   */
  var _cache_variables = function() {
    media_list_properties = {
      $modal: $('#rex-live-media-list'),
      $listWrap: null,
      $close_button: null,
    };

    media_list_properties.$close_button = media_list_properties.$modal.find('.rex-modal__close-button');
    media_list_properties.$listWrap = media_list_properties.$modal.find('#rex-live-media-list__wrap');

    $modal_wrap = media_list_properties.$modal.parent('.rex-modal-wrap');
  };

  var generateMediaList = function( list ) {
    for( var i=0, tot = list.length; i < tot; i++) {
      var l = document.createElement('li');
      var t = document.createElement('span');

      l.style.padding = '10px';

      t.style.cursor = 'pointer';
      t.style.display = 'inline-block';
      t.style.width = '30px';
      t.style.height = '30px';
      t.style.backgroundImage = 'url(' + list[i].src + ')';
      t.style.backgroundSize = 'cover';
      t.style.backgroundRepeat = 'no-repeat';
      t.style.backgroundPosition = 'center center';
      
      l.appendChild(t);
      media_list_properties.$listWrap.append(l);
    }
    media_list_properties.$listWrap.sortable();
    media_list_properties.$listWrap.disableSelection();
  };

  var _openModal = function( data ) {
    media_list_properties.$listWrap.html('');
    generateMediaList( data );
    Rexlive_Modals_Utils.openModal($modal_wrap);
  };

  var _listen_events = function() {
    media_list_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      Rexlive_Modals_Utils.closeModal( $modal_wrap );
    })
  };

  var init = function() {
    _cache_variables();
    _listen_events();
  };

  return {
    init: init,
    openModal: _openModal
  };
})(jQuery);