var Container_Margins = (function ($) {
    'use strict';

    var container_margins_modal_properties;
    var defaultSeparatos;

    var _resetDistances = function () {
        container_margins_modal_properties.$container_separator_top.val(defaultSeparatos.top);
    }

    var _updateDistances = function (data) {
        var distances = data.containerDistances;
        var top = isNaN(distances.top) ? defaultSeparatos.top : distances.top;

        container_margins_modal_properties.$container_separator_top.val(top);
    }

    var _getDataPanel = function () {
        var top = parseInt(container_margins_modal_properties.$container_separator_top.val());

        var distances = {
            top: isNaN(top) ? defaultSeparatos.top : top,
        }
        
        return distances;
    }
    
    var _applyContainerDistances = function () {

        var data_container_margins = {
            eventName: "rexlive:set_container_margins",
            data_to_send: {
                distances: _getDataPanel(),
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_container_margins);
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
                _applyContainerDistances();
            }
        });
    }

    var _linkDistancesListeners = function () {
        _linkKeyDownListener(container_margins_modal_properties.$container_separator_top);

        _linkKeyUpListener(container_margins_modal_properties.$container_separator_top);
    }
    var _saveGlobal = function(){
        container_margins_modal_properties.selected_margins = "global";
    }
    
    var _savePage = function(){
        container_margins_modal_properties.selected_margins = "page";
    }

    var _applyData = function(){
        var data_margins = _getDataPanel();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: live_editor_obj.ajaxurl,
            data: {
                action: "rex_update_container_margins",
                nonce_param: live_editor_obj.rexnonce,
                pageID: $("#post_ID").val(),
                container_margins: JSON.stringify(data_margins),
                selected_margins: container_margins_modal_properties.selected_margins,
            },
            success: function () {
                console.log("finito!");
            },
            error: function () { },
            complete: function () { }
        })

        _applyContainerDistances();
    }

    var _init = function ($container) {
        var $self = $container;
        container_margins_modal_properties = {
            // Row separators
            $self: $self,
            $container_separator_top: $self.find('#margin-rexlive-content'),
            $applyAllCheckBox: $self.find("margin-rexlive-all-pages"),
            selected_margins: ""
        }

        defaultSeparatos = {
            top: 0,
        }

        _resetDistances();
        _linkDistancesListeners();
    }

    return {
        init: _init,
        saveGlobal: _saveGlobal,
        savePage: _savePage,
        applyData: _applyData
    };

})(jQuery);