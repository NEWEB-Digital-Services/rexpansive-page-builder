var SectionMargins_Modal = (function ($) {
    'use strict';

    var section_margins_modal_properties;
    var defaultMargins;

    var _resetMargins = function () {
        section_margins_modal_properties.$row_margin_top.val(defaultMargins.top);
        section_margins_modal_properties.$row_margin_right.val(defaultMargins.right);
        section_margins_modal_properties.$row_margin_bottom.val(defaultMargins.bottom);
        section_margins_modal_properties.$row_margin_left.val(defaultMargins.left);
    }

    var _updateMargins = function (margins) {
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
    }

    return {
        init: _init,
        updateMargins: _updateMargins,
        resetMargins: _resetMargins,
        getData: _getData
    };

})(jQuery);