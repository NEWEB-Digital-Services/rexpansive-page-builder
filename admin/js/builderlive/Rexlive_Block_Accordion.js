var Rexlive_Block_Accordion = (function($) {
  "use strict";

  var block_accordion_properties;
  var target;

  var _openModal = function(data) {
    _updateData(data);
    Rexlive_Modals_Utils.openModal(
      block_accordion_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeBlockOptionsModal = function() {
    Rexlive_Modals_Utils.closeModal(
      block_accordion_properties.$self.parent(".rex-modal-wrap")
    );
  };

  var _linkDocumentListeners = function() {
    block_accordion_properties.$close_button.on('click', function(e) {
      e.preventDefault();
      _closeBlockOptionsModal();
    });

    block_accordion_properties.$save_button.on('click', function(e) {
      e.preventDefault();
      _saveData();
      _closeBlockOptionsModal();
    });

    block_accordion_properties.$accordion_insert_gallery.on("click", function(e) {
      e.preventDefault();
      // open media uploader
      var data = {
        modal_info: block_accordion_properties,
        image_info: _getImagesList()
      }
      Rexlive_MediaUploader.openMediaUploaderAccordionGallery( data );
    });

    block_accordion_properties.$self.on("click", ".rex-accordion-gallery__item__remove", function(e) {
      e.preventDefault();
      $(this).parents(".rex-accordion-gallery__item").remove();
    });
  };

  /**
   * Getting the list of image ids
   * @return {Array}  result
   */
  var _getImagesList = function() {
    var result = [];
    block_accordion_properties.$accordion_preview_gallery.find(".rex-accordion-gallery__item").each(function(i,el) {
      result.push({
        id: el.getAttribute("data-gallery-item-id"),
        url: el.getAttribute("data-gallery-item-url"),
        size: el.getAttribute("data-gallery-item-size"),
      });
    });
    return result;
  };

  /**
   * Get image ids list from the accordion html
   * @param {string} html gallery content
   * @return {Array} result
   */
  var _getImagesListFromHTML = function( html ) {
    var result = [];
    var $tmp = $(html);
    $tmp.each(function(i,el) {
      result.push({
        id: el.getAttribute("data-gallery-item-id"),
        url: el.getAttribute("src"),
        size: el.getAttribute("data-gallery-item-size"),
      });
    });
    return result;
  };

  var _updateData = function(data) {
    target = data.blockData.target;
    // block_accordion_properties.$accordion_header.val(data.blockData.accordion.header);
    // block_accordion_properties.$accordion_content.val(data.blockData.accordion.content);
    switch(data.blockData.accordion.state) {
      case 'open':
        block_accordion_properties.$accordion_state.prop('checked',true);
        break;
      case 'close':
      default:
        block_accordion_properties.$accordion_state.prop('checked',false);
        break;
    };

    var tinyMCE_headerEditor = tinyMCE.get('rex-accordion-header-val');  
    if (typeof tinyMCE_headerEditor === "undefined" || tinyMCE_headerEditor === null) { // text editor
      block_accordion_properties.$accordion_header.val(data.blockData.accordion.header);
      block_accordion_properties.$accordion_header.text(data.blockData.accordion.header);
    } else {
      tinyMCE_headerEditor.setContent(data.blockData.accordion.header);
      tinyMCE_headerEditor.save({ no_events: true });
    }

    block_accordion_properties.$accordion_preview_gallery.empty();

    if( data.blockData.accordion.is_gallery ) {
      var img_list = _getImagesListFromHTML(data.blockData.accordion.content);

      // @todo use wp.media fetch to get the current media info
      // by id
      for(var z=0; z < img_list.length; z++) {
        block_accordion_properties.$accordion_preview_gallery.append( tmpl("tmpl-accordion-gallery-item", {
          id: img_list[z].id,
          preview: img_list[z].url,
          url: img_list[z].url,
          size: img_list[z].size
        }));
      }

      // fetching synch image data by ids
      /*wp.media.attachment(img_list).fetch({
        success: function(foo) {
          console.log(foo);
        },
        error: function(err) {
          console.log(err);
        }
      });*/
    } else {
      var tinyMCE_contentEditor = tinyMCE.get('rex-accordion-content-val');
      if (typeof tinyMCE_contentEditor === "undefined" || tinyMCE_contentEditor === null) { // text editor
        block_accordion_properties.$accordion_content.val(data.blockData.accordion.content);
        block_accordion_properties.$accordion_content.text(data.blockData.accordion.content);
      } else {
        tinyMCE_contentEditor.setContent(data.blockData.accordion.content);
        tinyMCE_contentEditor.save({ no_events: true });
      }
    }

  }

  var _saveData = function() {
    var tinyMCE_headerEditor = tinyMCE.get('rex-accordion-header-val');
    var tinyMCE_contentEditor = tinyMCE.get('rex-accordion-content-val');
    var state = block_accordion_properties.$accordion_state.prop('checked');
    
    var gallery_content = "";
    var gallery_info = _getImagesList();
    if( gallery_info.length > 0 ) {
      for( var i=0; i < gallery_info.length; i++ ) {
        gallery_content += tmpl( "tmpl-accordion-gallery-item-live", {
          id: gallery_info[i].id,
          url: gallery_info[i].url,
          size: gallery_info[i].size
        }).trim();
      }

      // gallery_content = '<div class="rex-accordion--gallery">' + gallery_content + '</div>';
    }

    //   tinyMCE_headerEditor.save({ no_events: true });
    //   tinyMCE_contentEditor.save({ no_events: true });

    tinyMCE.triggerSave();

    var html = {
      header: block_accordion_properties.$accordion_header.val(),
      content: block_accordion_properties.$accordion_content.val(),
      icon: "",
      complete: '<div class="rex-accordion' + ( true === state ? ' open' : ' close' ) + '"><div class="rex-accordion--toggle">' + block_accordion_properties.$accordion_header.val() + '<span class="rex-accordion--toggle-icon"><i class="rex-accordion--close-icon l-svg-icons"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Z001-Plus"></use></svg></i></span></div><div class="rex-accordion--content' + ( "" !== gallery_content ? " rex-accordion--gallery" : "" ) + '"' + ( true !== state ? ' style="display:none;"' : '' ) + '>' + ( "" !== gallery_content ? gallery_content : block_accordion_properties.$accordion_content() ) + '</div></div>',
    };
    
    var data_updateAccordion = {
      eventName: "rexlive:updateAccordion",
      data_to_send: {
        accordion: html,
        target: target
      }
    };
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_updateAccordion);
  };

  var _init = function() {
    var $accordionModal = $("#rex-block-accordion-editor");
    block_accordion_properties = {
      $self: $accordionModal,

      $accordion_header: $accordionModal.find('[name=rex-accordion-header-val]'),
      $accordion_content: $accordionModal.find('[name=rex-accordion-content-val]'),
      $accordion_state: $accordionModal.find('[name=rex-accordion-open-close-val]'),
      $accordion_insert_gallery: $accordionModal.find('.rex-accordion-content-gallery'),
      $accordion_preview_gallery: $accordionModal.find('.rex-accordion-content-gallery__preview'),

      $close_button: $accordionModal.find('.rex-modal__close-button'),
      $save_button: $accordionModal.find('.rex-modal__save-button')
    };

    _linkDocumentListeners();
  };

  return {
    init: _init,
    openModal: _openModal
  };
})(jQuery);
