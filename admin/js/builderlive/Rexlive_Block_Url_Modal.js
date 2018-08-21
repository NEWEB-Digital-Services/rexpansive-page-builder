var Block_Url_Modal = (function ($) {
    'use strict';

    var block_url_modal_properties;
    var defaultUrl;
    var rexID;

    var _resetBlockUrl = function () {
        block_url_modal_properties.$urlInput.val(defaultUrl);
    }

    var _updateBlockUrl = function (data) {
        rexID = data.rexID;
        block_url_modal_properties.$urlInput.val(data.link);
    }

    var _applyBlockUrl = function () {
        var url = block_url_modal_properties.$urlInput.val();

        var data_blockUrl = {
            eventName: "rexlive:apply_block_link_url",
            data_to_send: {
                url: url,
                rex_block_id: rexID
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