var GridSeparators_Modal = (function ($) {
    'use strict';

    var grid_paddings_modal_properties;
    var defaultSeparatos;

    var _resetDistances = function () {
        grid_paddings_modal_properties.$block_gutter.val(defaultSeparatos.gutter);
        grid_paddings_modal_properties.$row_separator_top.val(defaultSeparatos.top);
        grid_paddings_modal_properties.$row_separator_right.val(defaultSeparatos.right);
        grid_paddings_modal_properties.$row_separator_bottom.val(defaultSeparatos.bottom);
        grid_paddings_modal_properties.$row_separator_left.val(defaultSeparatos.left);
    }

    var _updateDistances = function (distances) {
        var gutter = isNaN(distances.gutter) ? defaultSeparatos.gutter : distances.gutter;
        var top = isNaN(distances.top) ? defaultSeparatos.top : distances.top;
        var right = isNaN(distances.right) ? defaultSeparatos.right : distances.right;
        var bottom = isNaN(distances.bottom) ? defaultSeparatos.bottom : distances.bottom;
        var left = isNaN(distances.left) ? defaultSeparatos.left : distances.left;

        grid_paddings_modal_properties.$block_gutter.val(gutter);
        grid_paddings_modal_properties.$row_separator_top.val(top);
        grid_paddings_modal_properties.$row_separator_right.val(right);
        grid_paddings_modal_properties.$row_separator_bottom.val(bottom);
        grid_paddings_modal_properties.$row_separator_left.val(left);
    }

    var _getData = function () {
        var gutter = parseInt(grid_paddings_modal_properties.$block_gutter.val());
        var top = parseInt(grid_paddings_modal_properties.$row_separator_top.val());
        var right = parseInt(grid_paddings_modal_properties.$row_separator_right.val());
        var bottom = parseInt(grid_paddings_modal_properties.$row_separator_bottom.val());
        var left = parseInt(grid_paddings_modal_properties.$row_separator_left.val());

        var distances = {
            gutter: isNaN(gutter) ? defaultSeparatos.gutter : gutter,
            top: isNaN(top) ? defaultSeparatos.top : top,
            right: isNaN(right) ? defaultSeparatos.right : right,
            bottom: isNaN(bottom) ? defaultSeparatos.bottom : bottom,
            left: isNaN(left) ? defaultSeparatos.left : left,
        }

        return distances;
    }

    var _init = function ($container) {
        grid_paddings_modal_properties = {
            // Row separators
            $block_gutter: $container.find('.section-set-block-gutter'),
            $row_separator_top: $container.find('#row-separator-top'),
            $row_separator_right: $container.find('#row-separator-right'),
            $row_separator_bottom: $container.find('#row-separator-bottom'),
            $row_separator_left: $container.find('#row-separator-left'),
        }

        defaultSeparatos = {
            gutter: 20,
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        }

        _resetDistances();
    }

    return {
        init: _init,
        updateDistances: _updateDistances,
        resetDistances: _resetDistances,
        getData: _getData
    };

})(jQuery);