/**
 * Object that wrap all the page settings tools
 * @since 2.0.0
 * @date  27-03-2019
 */
var Rexlive_Page_Settings_Modal = (function ($) {
  'use strict';

  var page_settings_props;

  /**
   * Opening the settings modal
   * @since 2.0.0
   */
  var _openModal = function() {
    Rexlive_Modals_Utils.openModal( page_settings_props.$modal );
    _getSettings();
  };

  /**
   * Close the settings modal
   * @since 2.0.0
   */
  var _closeModal = function() {
    Rexlive_Modals_Utils.closeModal( page_settings_props.$modal );    
  };

  var _resetModal = function() {
    Rexlive_Page_Margins.resetData();
  };

  /**
   * Add the general listeners for the modal
   * @since 2.0.0
   */
  var _linkDocumentListeners = function() {
    page_settings_props.$close_button.on('click', function(e) {
      e.preventDefault();
      _resetModal();
      _closeModal();
    });

    /**
     * On modal closing (from button, from keyboard esc, from screen click)
     * Save the settings
     *
     */
    page_settings_props.$modal.on('rexlive:this_modal_closed', function(e) {
      _saveSettings();
    });

    // confirm-refresh options
    page_settings_props.$options_buttons.on('click', function(event) {
      event.preventDefault();
      switch( this.getAttribute('data-rex-option' ) ) {
        case 'save':
          _closeModal( false );
          _saveSettings();
          break;
        case 'reset':
          _resetModal();
          break;
        default:
          break;
      }
    });
  };

  /**
   * Init the setting of this modal
   * @since 2.0.0
   */
  var _initSettings = function( ) {
    Rexlive_Page_Margins.init( page_settings_props.$self );
  };

  /**
   * Save the settings data of this modal
   * @since 2.0.0
   */
  var _saveSettings = function() {
    Rexlive_Page_Margins.applyData();
  };

  var _getSettings = function() {
    Rexlive_Page_Margins.getData();
  };

  /**
   * Init the modal
   * @since 2.0.0
   */
  var init = function () {
    var $settingsModal = $("#rex-page-settings-modal");
    page_settings_props = {
      $self: $settingsModal,
      $modal: $settingsModal.parent(".rex-modal-wrap"),

      $options_buttons: $settingsModal.find('.rex-modal-option'),
      $close_button: $settingsModal.find('.rex-modal__close-button'),
      // $save_button: $settingsModal.find('.rex-modal__save-button')
    };

    _initSettings();
    _linkDocumentListeners();
  };

  return {
    init: init,
    open: _openModal
  };
})(jQuery);