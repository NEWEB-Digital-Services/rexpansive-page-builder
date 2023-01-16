var Rexlive_Block_Slideshow = (function($) {
  "use strict";

  var block_slideshow_properties;
  var target;

  var _openModal = function(data) {
    _updateData(data);
    Rexlive_Modals_Utils.openModal(
      block_slideshow_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeBlockOptionsModal = function() {
    Rexlive_Modals_Utils.closeModal(
      block_slideshow_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _linkDocumentListeners = function() {
    block_slideshow_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      _closeBlockOptionsModal();
    });

    block_slideshow_properties.$save_button.on('click', function(e) {
      e.preventDefault();
      _saveData();
      _closeBlockOptionsModal();
    });

    block_slideshow_properties.$add_slide.on('click', function() {
      var count = block_slideshow_properties.$slide_list.find('.rex-slideshow__slide').length;
      var new_slide_tmpl = tmpl('tmpl-slideshow-item', {
        slide_id: count,
        slide_id_label: count + 1,
      });
      block_slideshow_properties.$slide_list.append(new_slide_tmpl);
      block_slideshow_properties.$slide_list.sortable("refresh");
    });

    block_slideshow_properties.$self.on('click', '.rex-slideshow__slide-edit', function(e) {
      var $button = $(this);
      var $slide = $button.parents(".rex-slideshow__slide");
      var action = this.getAttribute('value');
      switch(action)
      {
        case 'delete':
          $slide.remove();
          break;
        case 'copy':
          break;
        default:
          break;
      }
    });

  };

  /**
   * Tracing block data, and creating slidshow items in the modal, if present
   * @param {Object} data slideshow data present, if present
   */
  var _updateData = function(data)
  {
    target = data.blockData.target;
    block_slideshow_properties.$slide_list.empty();
    if ( data.blockData.slideshow.slides.length > 0 )
    {
      for( var i=0; i<data.blockData.slideshow.slides.length; i++)
      {
        var new_slide_tmpl = tmpl('tmpl-slideshow-item', {
          slide_id: i,
          slide_id_label: i+1,
          slide_content: data.blockData.slideshow.slides[i]
        });
        block_slideshow_properties.$slide_list.append(new_slide_tmpl);
        block_slideshow_properties.$slide_list.sortable("refresh");
      }
    }
    else
    {
      var new_slide_tmpl = tmpl('tmpl-slideshow-item', {
        slide_id: 0,
        slide_id_label: 1,
        slide_content: ''
      });
      block_slideshow_properties.$slide_list.append(new_slide_tmpl);
      block_slideshow_properties.$slide_list.sortable("refresh");
    }
  }

  var _saveData = function()
  {
    var html = '<div class="rex-slideshow">';
    block_slideshow_properties.$slide_list.find('.rex-slideshow__slide').each(function(i,el){
      html += '<div class="rex-slideshow__slide">' + $(el).find('textarea[name=rex-slideshow--slide-text]').val() + '</div>';
    });
    html += '</div>';

    var data_updateSlideshow = {
      eventName: "rexlive:updateSlideshow",
      data_to_send: {
        slideshow: {
          slides: html
        },
        target: target
      }
    };
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_updateSlideshow);
  }

  /**
   * Update the index of the slides at every sort
   * @param {Event} event slider update event
   * @param {Object} ui jQueryUI Object
   */
  var _update_slide_list_index = function(event, ui) {
    var $this_slides = $(ui.item)
      .siblings()
      .add($(ui.item));
    $this_slides.each(function(i, e) {
      $(e)
        .attr("data-slideshow-slide-id", i)
        .find(".rex-slideshow__slide-index")
        .text(i + 1);
    });
  };

  var _initList = function()
  {
    block_slideshow_properties.$slide_list.sortable({
      revert: true,
      handle: ".rex-slideshow__slide-edit[value=move]",
      update: function(e, ui) {
        _update_slide_list_index(e, ui);
      }
    });
  }

  var _init = function() {
    var $slideshowModal = $("#rex-block-slideshow-editor");
    block_slideshow_properties = {
      $self: $slideshowModal,

      $add_slide: $slideshowModal.find('#rex-slideshow__add-new-slide'),
      $slide_list: $slideshowModal.find('.rex-slideshow__slide-list'),

      $close_button: $slideshowModal.find('.rex-modal__close-button'),
      $save_button: $slideshowModal.find('.rex-modal__save-button')
    };

    _initList();
    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal
  };
})(jQuery);
