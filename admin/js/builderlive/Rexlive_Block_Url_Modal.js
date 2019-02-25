var Block_Url_Modal = (function ($) {
    'use strict';

    var block_url_modal_properties;
    var defaultUrl;
    var target;

    var _resetBlockUrl = function () {
        block_url_modal_properties.$urlInput.val(defaultUrl);
    }

    var _updateBlockUrl = function (data) {
        target = data.target;
        block_url_modal_properties.$urlInput.val(data.link);

        if(data.link == ""){
            block_url_modal_properties.$urlInput
                .siblings("label, .prefix")
                .removeClass("active");
        }else{
            block_url_modal_properties.$urlInput
                .siblings("label, .prefix")
                .addClass("active");
        }

    }

    var _applyBlockUrl = function () {
        var url = block_url_modal_properties.$urlInput.val();

        var data_blockUrl = {
            eventName: "rexlive:apply_block_link_url",
            data_to_send: {
                url: url,
                target: target
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_blockUrl);
    }

    var _linkDocumentListeners = function () {
        block_url_modal_properties.$urlInput.blur(function (e) {
            _applyBlockUrl();
        })
    }

    var _init = function ($container) {
        var $self = $container.find(".block-url-link-wrapper");
        block_url_modal_properties = {
            $urlInput: $self.find('#block_link_value'),
        }

        defaultUrl = "";

        _resetBlockUrl();
        _linkDocumentListeners();
    }

    return {
        init: _init,
        updateBlockUrl: _updateBlockUrl,
        resetBlockUrl: _resetBlockUrl
    };

})(jQuery);