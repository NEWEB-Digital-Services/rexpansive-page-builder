
var Rexlive_Modals_Utils = (function ($) {
    'use strict';

    var $lean_overlay;
    var $modals;

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
    var _openModal = function ($target, target_only, additional_class) {
        target_only = typeof target_only !== 'undefined' ? target_only
            : false;
        additional_class = typeof additional_class !== 'undefined' ? additional_class
            : [];

        if (!target_only) {
            $('body').addClass('rex-modal-open');
            $lean_overlay.show();
        } else {
            $target.addClass('rex-in--up');
        }
        $target.addClass('rex-in').show();

        if (additional_class.length) {
            for (var i = 0; i < additional_class.length; i++) {
                $target.find('.rex-modal').addClass(additional_class[i]);
            }
        }

        _resetModalDimensions($target.find('.rex-modal'));
    };

    /**
     * Close a modal dialog box
     * 
     * @param {jQuery Object} $target modal to close
     */
    var _closeModal = function ($target, target_only, additional_class) {
        target_only = typeof target_only !== 'undefined' ? target_only
            : false;
        additional_class = typeof additional_class !== 'undefined' ? additional_class
            : [];

        if (!target_only && !$target.hasClass('rex-in--up')) {
            $('body').removeClass('rex-modal-open');
            $lean_overlay.hide();
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

        _resetModalDimensions($target.find('.rex-modal'));
    };

    /**
     * reset a modal height to prevent dynamic content bugs
     * 
     * @param {jQuery Object} $target
     */
    var _resetModalDimensions = function ($target) {
        $target.css('height', 'auto');
        $target.css('width', 'auto');
    };

    var init = function () {
        $lean_overlay = $('.lean-overlay');
        $modals = $('.rex-modal-draggable');
        $modals.each(function (i, modal) {
            var $modal = $(modal);
            $modal.draggable({
                cancel: "input,textarea,button,select,option,.rex-check-icon, .input-field, .rex-slider__slide-edit, #rex-css-ace-editor, label"
            });
        });
    }
    return {
        init: init,
        openModal: _openModal,
        closeModal: _closeModal,
        resetModalDimensions: _resetModalDimensions
    };

})(jQuery);