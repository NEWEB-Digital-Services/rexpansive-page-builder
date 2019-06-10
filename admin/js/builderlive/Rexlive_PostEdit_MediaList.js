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
      $addMedia: null,
      $close_button: null,
      mediaListAggregateSelector: null,
      completeReorderCallback: null,
      completeRemoveCallback: null,
      destinationSelector: null,
      addTmplId: null,
      tmplDataGeneration: null,
      completeAddCallback: null
    };

    media_list_properties.$close_button = media_list_properties.$modal.find('.rex-modal__close-button');
    media_list_properties.$listWrap = media_list_properties.$modal.find('#rex-live-media-list__wrap');
    media_list_properties.$addMedia = media_list_properties.$modal.find('#media-gallery__add-new-item');

    $modal_wrap = media_list_properties.$modal.parent('.rex-modal-wrap');
  };

  /**
   * Update the index of the slides at every sort
   * @param {Event} event slider update event
   * @param {Object} ui jQueryUI Object
   */
  var _update_media_list_index = function(event, ui) {
    var $this_slides = $(ui.item)
      .siblings()
      .add($(ui.item));
    $this_slides.each(function(i, e) {
      $(e)
        .attr("data-media-gallery-item-index", i)
        .find(".media-gallery__item-index")
        .text(i + 1);
    });
  };

  /**
   * Launch event to public side to reorder the media gallery
   * @param {Event} event 
   * @param {Element} ui 
   */
  var _update_media_list_order = function(event, ui) {
    var list = [];
    media_list_properties.$listWrap.find('.media-gallery__item').each(function(i, el) {
      list.push( el.getAttribute( 'data-media-gallery-item-element-id' ) );
    });

    var data = {
      eventName: "rexlive:liveMediaReorder",
      data_to_send: {
        mediaList: list,
        mediaListAggregateSelector: media_list_properties.mediaListAggregateSelector,
        completeReorderCallback: media_list_properties.completeReorderCallback,
      }
    };
    
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
  };

  /**
   * Generate the media list to insert in the modal
   * @param {Array} list array of media images
   */
  var generateMediaList = function( list ) {
    for( var i=0, tot = list.length; i < tot; i++) {
      var media = tmpl('tmpl-editable-media-gallery-list-item', {
        index: i+1,
        id: list[i].id,
        src: list[i].src
      });

      media_list_properties.$listWrap.append(media);
    }

    // make list sortable
    media_list_properties.$listWrap.sortable({
      revert: true,
      handle: '.media-gallery__item-edit[value="move"]',
      update: function(e, ui) {
        _update_media_list_index(e, ui);
        _update_media_list_order(e, ui);
      }
    });
    media_list_properties.$listWrap.disableSelection();
  };

  var _openModal = function( data ) {
    media_list_properties.$listWrap.html('');
    generateMediaList( data.mediaList );
    media_list_properties.mediaListAggregateSelector = data.mediaListAggregateSelector;
    media_list_properties.completeReorderCallback = data.completeReorderCallback;
    media_list_properties.completeRemoveCallback = data.completeRemoveCallback;
    media_list_properties.destinationSelector = data.destinationSelector;
    media_list_properties.addTmplId = data.addTmplId;
    media_list_properties.tmplDataGeneration = data.tmplDataGeneration;
    media_list_properties.completeAddCallback = data.completeAddCallback;

    Rexlive_Modals_Utils.openModal($modal_wrap);
  };

  var _listen_events = function() {
    // close modal
    media_list_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      media_list_properties.mediaListAggregateSelector = null;
      media_list_properties.completeReorderCallback = null;
      media_list_properties.completeRemoveCallback = null;
      media_list_properties.destinationSelector = null;
      media_list_properties.addTmplId = null;
      media_list_properties.tmplDataGeneration = null;
      media_list_properties.completeAddCallback = null;

      Rexlive_Modals_Utils.closeModal( $modal_wrap );
    });

    // add media gallery item
    // open media uploader, and only if select an image, add the item
    media_list_properties.$addMedia.on('click', function(e) {
      e.preventDefault();

      Rexlive_PostEdit.openMediaUploader( {
        action: 'add',
        fromMediaListModal: true,
        destinationSelector: media_list_properties.destinationSelector,
        addTmplId: media_list_properties.addTmplId,
        tmplDataGeneration: media_list_properties.tmplDataGeneration,
        completeAddCallback: media_list_properties.completeAddCallback
      } );
    });

    // edit media gallery item
    media_list_properties.$listWrap.on('click', '.media-gallery__item-edit', function(e) {
      e.preventDefault();
      var $btn = $(e.currentTarget);
      var $item = $btn.parents('.media-gallery__item');
      var index = $item.attr('data-media-gallery-item-index');
      var elId = $item.attr('data-media-gallery-item-element-id');
      var action = e.currentTarget.getAttribute('value');

      switch( action ) {
        case 'edit-media':
          var data = {
            eventName: "rexlive:liveMediaOpenEdit",
            data_to_send: {
              elId: elId,
              fromMediaListModal: true
            }
          };
          
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
          break;
        case 'add-media':
          break;
        case 'copy':
          break;
        case 'delete':
          $item.remove();
          media_list_properties.$listWrap
            .find(".media-gallery__item")
            .each(function(i, e) {
              $(e)
                .attr("data-media-gallery-item-index", i)
                .find(".media-gallery__item-index")
                .text(i + 1);
            });

          var data = {
            eventName: "rexlive:liveMediaDelete",
            data_to_send: {
              elId: elId,
              mediaListAggregateSelector: media_list_properties.mediaListAggregateSelector,
              completeRemoveCallback: media_list_properties.completeRemoveCallback,
            }
          };
          
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data);
          break;
        case 'move':
          break;
        default:
          break;
      }
    });
  };

  /**
   * Add a media list item
   * @param {Object} data 
   */
  var _addMediaItem = function( data ) {
    var newIndex = media_list_properties.$listWrap.find('.media-gallery__item').length;

    var media = tmpl('tmpl-editable-media-gallery-list-item', {
      index: newIndex + 1,
      src: data.src,
      fieldId: data.fieldId,
    });

    media_list_properties.$listWrap.append(media);
  };

  /**
   * Edit a media list item
   * @param {Object} data 
   */
  var _editMediaItem = function( data ) {
    var $item = media_list_properties.$listWrap.find('.media-gallery__item[data-media-gallery-item-element-id="' + data.fieldId + '"]');
    if ( $item.length > 0 ) {
      $item.find('.media-gallery__item__image-preview').css('backgroundImage', 'url(' + data.src + ')');
    }
  }

  var init = function() {
    _cache_variables();
    _listen_events();
  };

  return {
    init: init,
    openModal: _openModal,
    addMediaItem: _addMediaItem,
    editMediaItem: _editMediaItem
  };
})(jQuery);