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
    });
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

    var tinyMCE_contentEditor = tinyMCE.get('rex-accordion-content-val');
    if (typeof tinyMCE_contentEditor === "undefined" || tinyMCE_contentEditor === null) { // text editor
      block_accordion_properties.$accordion_content.val(data.blockData.accordion.content);
      block_accordion_properties.$accordion_content.text(data.blockData.accordion.content);
    } else {
      tinyMCE_contentEditor.setContent(data.blockData.accordion.content);
      tinyMCE_contentEditor.save({ no_events: true });
    }
  }

  var _saveData = function() {
    var tinyMCE_headerEditor = tinyMCE.get('rex-accordion-header-val');
    var tinyMCE_contentEditor = tinyMCE.get('rex-accordion-content-val');
    var state = block_accordion_properties.$accordion_state.prop('checked');

    tinyMCE_headerEditor.save({ no_events: true });
    tinyMCE_contentEditor.save({ no_events: true });

    var html = {
      header: block_accordion_properties.$accordion_header.val(),
      content: block_accordion_properties.$accordion_content.val(),
      icon: "",
      complete: '<div class="rex-accordion' + ( true === state ? ' open' : ' close' ) + '"><div class="rex-accordion--toggle">' + tinyMCE_headerEditor.getContent() + '<span class="rex-accordion--toggle-icon"><i class="rex-accordion--close-icon l-svg-icons"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#Z001-Plus"></use></svg></i></span></div><div class="rex-accordion--content">' + tinyMCE_contentEditor.getContent() + '</div></div>',
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
