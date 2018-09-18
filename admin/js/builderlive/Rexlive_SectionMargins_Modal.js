var SectionMargins_Modal = (function ($) {
    'use strict';

    var section_margins_modal_properties;
    var defaultMargins;
    var sectionTarget;

    var _resetMargins = function () {
        section_margins_modal_properties.$row_margin_top.val(defaultMargins.top);
        section_margins_modal_properties.$row_margin_right.val(defaultMargins.right);
        section_margins_modal_properties.$row_margin_bottom.val(defaultMargins.bottom);
        section_margins_modal_properties.$row_margin_left.val(defaultMargins.left);
    }

    var _updateMargins = function (data) {
        sectionTarget = data.sectionTarget;
        var margins = data.marginsSection;
        var top = isNaN(margins.top) ? defaultMargins.top : margins.top;
        var right = isNaN(margins.right) ? defaultMargins.right : margins.right;
        var bottom = isNaN(margins.bottom) ? defaultMargins.bottom : margins.bottom;
        var left = isNaN(margins.left) ? defaultMargins.left : margins.left;

        section_margins_modal_properties.$row_margin_top.val(top);
        section_margins_modal_properties.$row_margin_right.val(right);
        section_margins_modal_properties.$row_margin_bottom.val(bottom);
        section_margins_modal_properties.$row_margin_left.val(left);
    }

    var _getData = function () {
        var top = parseInt(section_margins_modal_properties.$row_margin_top.val());
        var right = parseInt(section_margins_modal_properties.$row_margin_right.val());
        var bottom = parseInt(section_margins_modal_properties.$row_margin_bottom.val());
        var left = parseInt(section_margins_modal_properties.$row_margin_left.val());

        var margins = {
            top: isNaN(top) ? defaultMargins.top : top,
            right: isNaN(right) ? defaultMargins.right : right,
            bottom: isNaN(bottom) ? defaultMargins.bottom : bottom,
            left: isNaN(left) ? defaultMargins.left : left,
        }

        return margins;
    }

    var _applySectionMargins = function () {
        var data_section_margins = {
            eventName: "rexlive:set_section_margins",
            data_to_send: {
                margins: _getData(),
                sectionTarget: sectionTarget
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_section_margins);
    }
    
    var _linkKeyDownListener = function ($target) {
        $target.keydown(function (e) {
            var $input = $(e.target);
            // Allow: backspace, delete, tab, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 13, 110]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                if (e.keyCode == 38) { // up
                    e.preventDefault();
                    $input.val(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) + 1);
                }

                if (e.keyCode == 40) { //down
                    e.preventDefault();
                    $input.val(Math.max(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) - 1, 0));
                }
                return;
            }

            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }

            //escape
            if (e.keyCode == 27) {
                $input.blur();
            }
        });
    }

    var _linkKeyUpListener = function ($target) {
        $target.keyup(function (e) {
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == 38) || (e.keyCode == 40) || (e.keyCode == 8)) {
                e.preventDefault();
                _applySectionMargins();
            }
        });
    }

    var _linkMarginsListeners = function () {
        _linkKeyDownListener(section_margins_modal_properties.$row_margin_top);
        _linkKeyDownListener(section_margins_modal_properties.$row_margin_right);
        _linkKeyDownListener(section_margins_modal_properties.$row_margin_bottom);
        _linkKeyDownListener(section_margins_modal_properties.$row_margin_left);

        _linkKeyUpListener(section_margins_modal_properties.$row_margin_top);
        _linkKeyUpListener(section_margins_modal_properties.$row_margin_right);
        _linkKeyUpListener(section_margins_modal_properties.$row_margin_bottom);
        _linkKeyUpListener(section_margins_modal_properties.$row_margin_left);
    }

    var _init = function ($container) {
        section_margins_modal_properties = {
            // Row margin
            $row_margin_top: $container.find('#row-margin-top'),
            $row_margin_right: $container.find('#row-margin-right'),
            $row_margin_bottom: $container.find('#row-margin-bottom'),
            $row_margin_left: $container.find('#row-margin-left'),
        }

        defaultMargins = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        }

        _resetMargins();
        _linkMarginsListeners();
    }

    return {
        init: _init,
        updateMargins: _updateMargins,
        resetMargins: _resetMargins,
        getData: _getData
    };

})(jQuery);