/**
 * Object that contains the TextEditor definition
 */
var Rexpansive_Builder_Admin_TextEditor = (function($) {
  'use strict';

  var $text_editor;
  var $text_editor_modal_wrap;

  var $close_button;
  var $cancel_button;
  var $save_button;

  var openTextEditor = function (id, content, target_only, additional_classes) {
    target_only = typeof target_only !== 'undefined' ? target_only : false;
    additional_classes = typeof additional_classes !== 'undefined' ? additional_classes : [];
    // var searchTextFill = content.search(/\[(\[?)(TextFill)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*(?:\[(?!\/\2\])[^\[]*)*)\[\/\2\])?)(\]?)/g);
  
    // if( -1 == searchTextFill ) {
  
    var tinyMCE_editor = tinyMCE.get('rexbuilder_editor');
  
    if (typeof id != "undefined" && id !== null) {
      $save_button.val(id);
    }
  
    if (typeof tinyMCE_editor === "undefined" || tinyMCE_editor === null) { // text editor
      $('#rexbuilder_editor').val(content);
      $('#rexbuilder_editor').text(content);
    } else {
      tinyMCE_editor.setContent(content);
      tinyMCE_editor.save({ no_events: true });
    }
  
    Rexpansive_Builder_Admin_Modals.OpenModal($text_editor_modal_wrap, target_only, additional_classes);
  
    // } else {
  
    // openTextFillEditor(id, content);
  
    // }
  };

  var _listen_events = function() {
    $close_button.on('click', function (e) {
      e.preventDefault();
      $save_button.val('');
      Rexpansive_Builder_Admin_Modals.CloseModal($text_editor_modal_wrap, false, ['hide-padding-position']);
      tinyMCE.triggerSave();
    });

    $cancel_button.on('click', function (e) {
      e.preventDefault();
      $cancel_button.val('');
      $save_button.val('');
      Rexpansive_Builder_Admin_Modals.CloseModal(Rexpansive_Builder_Admin_PaddingEditor.$modal_wrap, true);
      Rexpansive_Builder_Admin_Modals.CloseModal(Rexpansive_Builder_Admin_PositionEditor.$modal_wrap, true);
      Rexpansive_Builder_Admin_Modals.CloseModal($text_editor_modal_wrap, false, ['hide-padding-position']);
    });

    $save_button.on('click', function (e) {
      e.preventDefault();

      if ($cancel_button.val() == 'new-block') {
        Rexpansive_Builder_Admin_Utilities.createNewTextBlock();
        Rexpansive_Builder_Admin_Utilities.launchTooltips();
      }

      tinyMCE.triggerSave();
      var tinyMCE_editor = tinyMCE.get('rexbuilder_editor');
      var editor = $('#rexbuilder_editor');
      var editor_value = editor.val();
      var $blockToSave = $($(this).val());
      var block_type = $blockToSave.attr('data-block_type');

      switch (block_type) {
        case 'image':
          $blockToSave.find('.element-preview .backend-image-preview').empty().append(editor_value.replace(/'/ig, "’"));
          break;
        case 'slide':
          $blockToSave.find('textarea[name=rex-slider--slide-text]').text(editor_value.replace(/'/ig, "’"));
          if ("" != editor_value) {
            $blockToSave.find('.rex-slider__slide-edit[value=text]').addClass('rex-slider__slide-edit__field-active-notice');
          } else {
            $blockToSave.find('.rex-slider__slide-edit[value=text]').removeClass('rex-slider__slide-edit__field-active-notice');
          }
          break;
        case "empty":
          $blockToSave
            .attr("data-block_type", "text")
            .removeClass('empty').addClass('text')
            .find(".element-preview")
            .empty()
            .append(editor_value.replace(/'/gi, "’"));
          break;
        default:
          $blockToSave.find('.element-preview').empty().append(editor_value.replace(/'/ig, "’"));
          break;
      }

      $blockToSave.find('.data-text-content').text(editor_value.replace(/'/ig, "’"));

      $cancel_button.val('');

      Rexpansive_Builder_Admin_Modals.CloseModal(Rexpansive_Builder_Admin_PaddingEditor.$modal_wrap, true);
      Rexpansive_Builder_Admin_Modals.CloseModal(Rexpansive_Builder_Admin_PositionEditor.$modal_wrap, true);

      Rexpansive_Builder_Admin_Modals.CloseModal($text_editor_modal_wrap, false, ['hide-padding-position']);

      $(document).trigger('rexbuilder:block_content_edit',$blockToSave);
    });
  }

  var _cache_variables = function() {
    $text_editor = $('#rexeditor-modal');
    $text_editor_modal_wrap = $text_editor.parent('.rex-modal-wrap');

    $close_button = $('#rexeditor-close');
    $cancel_button = $('#editor-cancel');
    $save_button = $('#editor-save');
  };

  var init = function() {
    _cache_variables();
    _listen_events();

    this.$text_editor = $text_editor;
    this.$text_editor_modal_wrap = $text_editor_modal_wrap;
  };
  
  return {
    init: init,
    openTextEditor: openTextEditor,
  };
  
})(jQuery);
