var Rexlive_Block_Slideshow = (function($) {
  "use strict";

  var block_slideshow_properties;

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
      var new_slide_tmpl = tmpl('tmpl-slideshow-item', {
        slide_id: 0
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

  var _updateData = function(data)
  {
    if ( data.blockData.slideshow.slides.length > 0 )
    {
      for( var i=0; i<data.blockData.slideshow.slides.length; i++)
      {
        var new_slide_tmpl = tmpl('tmpl-slideshow-item', {
          slide_id: 0,
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
      html += '<div class="slide">' + $(el).find('textarea[name=rex-slideshow--slide-text]').val() + '</div>';
    });
    html += '</div>';

    var data_updateSlideshow = {
      eventName: "rexlive:updateSlideshow",
      data_to_send: {
        slideshow: html,
        target: target
      }
    };
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_updateSlideshow);
  }

  var _initList = function()
  {
    block_slideshow_properties.$slide_list.sortable({
      revert: true,
      handle: ".rex-slideshow__slide-edit[value=move]",
      update: function(e, ui) {
        // _update_slide_list_index(e, ui);
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
