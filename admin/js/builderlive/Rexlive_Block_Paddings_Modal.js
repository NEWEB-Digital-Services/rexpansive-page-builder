var BlockPaddings_Modal = (function ($) {
    'use strict';

    var block_paddings_modal_properties;
    var defaultPaddings;
    var target;

    var _resetPaddings = function () {
        block_paddings_modal_properties.$block_padding_top.val(defaultPaddings.top);
        block_paddings_modal_properties.$block_padding_right.val(defaultPaddings.right);
        block_paddings_modal_properties.$block_padding_bottom.val(defaultPaddings.bottom);
        block_paddings_modal_properties.$block_padding_left.val(defaultPaddings.left);
    };

    var _updatePaddings = function (data) {
        target = data.target;
        var top = isNaN(parseInt(data.paddings.top)) ? defaultPaddings.top : data.paddings.top;
        var right = isNaN(parseInt(data.paddings.right)) ? defaultPaddings.right : data.paddings.right;
        var bottom = isNaN(parseInt(data.paddings.bottom)) ? defaultPaddings.bottom : data.paddings.bottom;
        var left = isNaN(parseInt(data.paddings.left)) ? defaultPaddings.left : data.paddings.left;

        _clearPaddingTypeSelection();
        _focusPaddingType(data.paddings.type == "" ? defaultPaddings.type : data.paddings.type);

        block_paddings_modal_properties.$block_padding_top.val(top);
        block_paddings_modal_properties.$block_padding_right.val(right);
        block_paddings_modal_properties.$block_padding_bottom.val(bottom);
        block_paddings_modal_properties.$block_padding_left.val(left);
    };

    var _focusPaddingType = function (paddingType) {
        var $wrapPaddingType = block_paddings_modal_properties.$padding_type_types_wrap.children("[data-rex-type-padding=\"" + paddingType + "\"]");
        $wrapPaddingType.addClass("selected");
        $wrapPaddingType.find("input").prop("checked", true);
    };

    var _clearPaddingTypeSelection = function () {
        block_paddings_modal_properties.$padding_type_typeWrap.each(function (i, el) {
            $(el).removeClass("selected");
            $(el).find("input").prop("checked", false);
        });
    };

    var _applyBlocksPaddings = function () {
        var top = parseInt(block_paddings_modal_properties.$block_padding_top.val());
        var right = parseInt(block_paddings_modal_properties.$block_padding_right.val());
        var bottom = parseInt(block_paddings_modal_properties.$block_padding_bottom.val());
        var left = parseInt(block_paddings_modal_properties.$block_padding_left.val());

        var $wrapPaddingType = block_paddings_modal_properties.$padding_type_types_wrap;
        var typePadding = $wrapPaddingType.children(".selected").attr("data-rex-type-padding");
        var data_padding = {
            eventName: "rexlive:apply_paddings_block",
            data_to_send: {
                target: target,
                paddings: {
                    top: isNaN(top) ? defaultPaddings.top : top,
                    right: isNaN(right) ? defaultPaddings.right : right,
                    bottom: isNaN(bottom) ? defaultPaddings.bottom : bottom,
                    left: isNaN(left) ? defaultPaddings.left : left,
                    type: typePadding
                }
            }
        };

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_padding);
    };

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
    };

    var _linkKeyUpListener = function ($target) {
        $target.keyup(function (e) {
            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 38) || (e.keyCode == 40) || (e.keyCode == 8)) {
                e.preventDefault();
                _applyBlocksPaddings();
            }
        });
    };

    var _linkPaddingsListeners = function () {
        _linkKeyDownListener(block_paddings_modal_properties.$block_padding_top);
        _linkKeyDownListener(block_paddings_modal_properties.$block_padding_right);
        _linkKeyDownListener(block_paddings_modal_properties.$block_padding_bottom);
        _linkKeyDownListener(block_paddings_modal_properties.$block_padding_left);

        _linkKeyUpListener(block_paddings_modal_properties.$block_padding_top);
        _linkKeyUpListener(block_paddings_modal_properties.$block_padding_right);
        _linkKeyUpListener(block_paddings_modal_properties.$block_padding_bottom);
        _linkKeyUpListener(block_paddings_modal_properties.$block_padding_left);

        block_paddings_modal_properties.$padding_type_typeWrap.click(function (e) {
            e.preventDefault();
            var $wrapPaddingType = $(e.target).parents(".rex-block-padding-type-wrap");
            if (!$wrapPaddingType.hasClass("selected")) {
                _clearPaddingTypeSelection();
                $wrapPaddingType.addClass("selected");
                $wrapPaddingType.find("input").prop("checked", true);
                _applyBlocksPaddings();
            }
        });
    };

    var _init = function ($container) {
        var $self = $container.find("#block-paddings-wrapper");
        block_paddings_modal_properties = {
            // block padding
            $block_padding_top: $self.find('#bm-block-padding-top'),
            $block_padding_right: $self.find('#bm-block-padding-right'),
            $block_padding_bottom: $self.find('#bm-block-padding-bottom'),
            $block_padding_left: $self.find('#bm-block-padding-left'),

            // Pixel or Percentage
            $padding_type_typeWrap: $self.find(".rex-block-padding-type-wrap"),
            $padding_type_types_wrap: $self.find('#block-padding-type-select'),

        };

        defaultPaddings = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
            type: "px"
        };

        _resetPaddings();
        _linkPaddingsListeners();
    };

    return {
        init: _init,
        updatePaddings: _updatePaddings,
        resetPaddings: _resetPaddings,
        applyBlocksPaddings: _applyBlocksPaddings
    };

})(jQuery);