/**
 * Object that contains the modals utilities
 */
var Rexpansive_Builder_Admin_Modals = (function($) {
  'use strict';

  /**
   * Open a modal dialog box	
   * @param {jQuery Object} $target modal to open  
   * @param {boolean} 	target_only active only the modal not the overlay
   * @param {Array} 		additional_class Array of additional classes
   */
  var OpenModal = function ($target, target_only, additional_class) {
    target_only = typeof target_only !== 'undefined' ? target_only : false;
    additional_class = typeof additional_class !== 'undefined' ? additional_class : [];

    if (!target_only) {
      $('body').addClass('rex-modal-open');
      Rexpansive_Builder_Admin_Config.$lean_overlay.show();
    } else {
      $target.addClass('rex-in--up');
    }
    console.log('ma sono io??');
    $target.addClass('rex-in');

    if (additional_class.length) {
      for (var i = 0; i < additional_class.length; i++) {
        $target.find('.rex-modal').addClass(additional_class[i]);
      }
    }

    Rexpansive_Builder_Admin_Utilities.resetModalDimensions($target.find('.rex-modal'));
  };

  /**
   * Close a modal dialog box
   * @param {jQuery Object}  $target modal to close
   */
  var CloseModal = function ($target, target_only, additional_class) {
    target_only = typeof target_only !== 'undefined' ? target_only : false;
    additional_class = typeof additional_class !== 'undefined' ? additional_class : [];

    if (!target_only && !$target.hasClass('rex-in--up')) {
      $('body').removeClass('rex-modal-open');
      Rexpansive_Builder_Admin_Config.$lean_overlay.hide();
    }
    $target.removeClass('rex-in').hide();
    if ($target.hasClass('rex-in--up')) {
      $target.removeClass('rex-in--up');
    }

    if (additional_class.length) {
      for (var i = 0; i < additional_class.length; i++) {
        $target.find('.rex-modal').removeClass(additional_class[i]);
      }
    }

    Rexpansive_Builder_Admin_Config.$actual_block_ref = null;
    Rexpansive_Builder_Admin_Utilities.resetModalDimensions($target.find('.rex-modal'));
  };
  
  return {
    OpenModal: OpenModal,
    CloseModal: CloseModal
  };
  
})(jQuery);