var Rexlive_Modals_Utils = (function($) {
  "use strict";

  var $lean_overlay;
  var $modals;
  var postionedModalOffset;

  /**
   * Open a modal dialog box
   *
   * @param {jQuery Object} $target modal to open
   *
   * @param {boolean}
   *            target_only active only the modal not the overlay
   * @param {Array}
   *            additional_class Array of additional classes
   */
  var _openModal = function($target, target_only, additional_class, set_position) {
    target_only = typeof target_only !== "undefined" ? target_only : false;
    additional_class = typeof additional_class !== "undefined" ? additional_class : [];
    set_position = typeof set_position !== "undefined" ? set_position : false;

    if (!target_only) {
      $("body").addClass("rex-modal-open");
      $lean_overlay.show();
    } else {
      $target.addClass("rex-in--up");
    }

    // $target.show().addClass('rex-in');
    $target.addClass('rex-modal--active').fadeIn({
      duration: 300
    });

    if (additional_class.length) {
      for (var i = 0; i < additional_class.length; i++) {
        $target.find(".rex-modal").addClass(additional_class[i]);
      }
    }

    if( set_position ) {
      _positionModal($target.find(".rex-modal"), {x:100,y:0});
    }

    _resetModalDimensions($target.find(".rex-modal"));
  };

  /**
   * Close a modal dialog box
   *
   * @param {jQuery Object} $target modal to close
   */
  var _closeModal = function($target, target_only, additional_class) {
    target_only = typeof target_only !== "undefined" ? target_only : false;
    additional_class =
      typeof additional_class !== "undefined" ? additional_class : [];

    if (!target_only && !$target.hasClass("rex-in--up")) {
      $("body").removeClass("rex-modal-open");
      $lean_overlay.hide();
    }
    // $target.removeClass('rex-in').hide();
    $target.removeClass('rex-modal--active').fadeOut({
      duration: 300
    });

    if ($target.hasClass("rex-in--up")) {
      $target.removeClass("rex-in--up");
    }

    $target.children().removeClass('rex-modal__bottom-arrow--active').removeClass('rex-modal__top-arrow--active');

    if (additional_class.length) {
      for (var i = 0; i < additional_class.length; i++) {
        $target.find(".rex-modal").removeClass(additional_class[i]);
      }
    }

    var closeEvent = {
      eventName: "rexlive:close_modal",
    };
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(closeEvent);

    _resetModalDimensions($target.find(".rex-modal"));
  };

  /**
   * reset a modal height to prevent dynamic content bugs
   *
   * @param {jQuery Object} $target
   */
  var _resetModalDimensions = function($target) {
    $target.css("height", "auto");
    $target.css("width", "auto");
  };

  /**
   * Position a modal window in the screen
   * @param {jQuery Obejct} $target Window to move
   * @param {JS Object} coord Object with the x,y coordinates of the mouse
   * @since 2.0.0
   */
  var _positionModal = function($target,coord) {
    if( 'undefined' !== typeof coord && null !== coord ) {
      var t_height = $target.actual('height');
      
      $target.css( "left", coord.x - ( Rexlive_Base_Settings.viewport().width / 2 ) + "px" );
      if( t_height < coord.y ) {
        $target.addClass('rex-modal__bottom-arrow--active');
        $target.css( "top", coord.y - ( t_height ) + postionedModalOffset.y + "px" );
      } else {
        $target.addClass('rex-modal__top-arrow--active');
        $target.css( "top", coord.y + postionedModalOffset.y + "px" );
      }
    } else {
      $target.css( "left", "0px" );
      $target.css( "top", "50px" );
    }
  }

  var _listen_events = function() {
    /**
     * Listen on click outside an open modal
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click','.rex-modal-wrap', function(e) {
      if(e.target===this) {
        _closeModal($(this));
      }
    });

    /**
     * Listen on ESC on parent document
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('keydown', function(e) {
      if( e.keyCode === 27 ) {
        _close_focus_modal();
      }
    });
  };

  /**
   * Search if there is a modal open, and in case close it
   * @since 2.0.0
   */
  var _close_focus_modal = function() {
    if( Rexbuilder_Util_Admin_Editor.$body.hasClass('rex-modal-open') ) {
      // Rexbuilder_Util_Admin_Editor.$body.find('.lean-overlay')
      var $focus_modal = Rexbuilder_Util_Admin_Editor.$body.find('.rex-modal--active');
      if( 0 < $focus_modal.length ) {
        $focus_modal.each(function(i,el){
          _closeModal($(el));
        });
      }
    }
  }

  var init = function() {
    $lean_overlay = $(".lean-overlay");
    $modals = $(".rex-modal-draggable");
    $modals.each(function(i, modal) {
      var $modal = $(modal);
      $modal.draggable({
        cancel:
          "input,textarea,button,select,option,.rex-check-icon, .input-field, .rex-slider__slide-edit, #rex-css-ace-editor, #rex-html-ace-editor, label, .no-draggable",
        stop: function(event, ui) {
          _resetModalDimensions($(this));
        }
      });
    });

    postionedModalOffset = {
      x: 0,
      y: -20
    };

    _listen_events();
  };

  return {
    init: init,
    openModal: _openModal,
    closeModal: _closeModal,
    resetModalDimensions: _resetModalDimensions,
    close_focus_modal: _close_focus_modal,
    positionModal: _positionModal
  };
})(jQuery);
