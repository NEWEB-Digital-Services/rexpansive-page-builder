var GridSeparators_Modal = (function ($) {
    'use strict';

    var grid_paddings_modal_properties;
    var defaultSeparatos;
    var sectionTarget;

    var _resetDistances = function () {
        grid_paddings_modal_properties.$block_gutter.val(defaultSeparatos.gutter);
        grid_paddings_modal_properties.$row_separator_top.val(defaultSeparatos.top);
        grid_paddings_modal_properties.$row_separator_right.val(defaultSeparatos.right);
        grid_paddings_modal_properties.$row_separator_bottom.val(defaultSeparatos.bottom);
        grid_paddings_modal_properties.$row_separator_left.val(defaultSeparatos.left);
    }

    var _updateDistances = function (data) {
        sectionTarget = data.sectionTarget;
        var distances = data.rowDistances;
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
    
    var _applyRowDistances = function () {
        var rowDistances = _getData();

        Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            'block_distance': rowDistances.gutter,
            'row_separator_top': rowDistances.top,
            'row_separator_right': rowDistances.right,
            'row_separator_bottom': rowDistances.bottom,
            'row_separator_left': rowDistances.left,
        });

        var data_grid_distances = {
            eventName: "rexlive:set_row_separatos",
            data_to_send: {
                distances: _getData(),
                sectionTarget: sectionTarget
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_grid_distances);
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
                _applyRowDistances();
            }
        });
    }

    var _linkDistancesListeners = function () {
        _linkKeyDownListener(grid_paddings_modal_properties.$block_gutter);
        _linkKeyDownListener(grid_paddings_modal_properties.$row_separator_top);
        _linkKeyDownListener(grid_paddings_modal_properties.$row_separator_right);
        _linkKeyDownListener(grid_paddings_modal_properties.$row_separator_bottom);
        _linkKeyDownListener(grid_paddings_modal_properties.$row_separator_left);

        _linkKeyUpListener(grid_paddings_modal_properties.$block_gutter);
        _linkKeyUpListener(grid_paddings_modal_properties.$row_separator_top);
        _linkKeyUpListener(grid_paddings_modal_properties.$row_separator_right);
        _linkKeyUpListener(grid_paddings_modal_properties.$row_separator_bottom);
        _linkKeyUpListener(grid_paddings_modal_properties.$row_separator_left);
    }

    var _init = function ($container) {
        var $self = $container;
        grid_paddings_modal_properties = {
            // Row separators
            $self: $self,
            $block_gutter: $self.find('.section-set-block-gutter'),
            $row_separator_top: $self.find('#row-separator-top'),
            $row_separator_right: $self.find('#row-separator-right'),
            $row_separator_bottom: $self.find('#row-separator-bottom'),
            $row_separator_left: $self.find('#row-separator-left'),
        }

        defaultSeparatos = {
            gutter: 20,
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        }

        _resetDistances();
        _linkDistancesListeners();
    }

    return {
        init: _init,
        updateDistances: _updateDistances,
        applyRowDistances: _applyRowDistances,
        resetDistances: _resetDistances,
        getData: _getData
    };

})(jQuery);