var Block_Content_Positions_Modal = (function ($) {
    'use strict';

    var block_content_position_properties;
    var defaultPositionCoordinates;
    var target;

    var _updatePosition = function (data) {
        target = data.target;
        _resetPosition();
        var position = data.position == "" ? defaultPositionCoordinates : data.position;
        block_content_position_properties.$positions.filter("[value=\"" + position + "\"]").prop('checked', true);
    }

    var _resetPosition = function () {
        block_content_position_properties.$positions.prop('checked', false);
    }

    var _applyBlockPosition = function(){
        var flex_content_position = block_content_position_properties.$positions.filter(':checked').val();
        var y = flex_content_position.split("-")[0];
        var x = flex_content_position.split("-")[1];

        var data_position = {
            eventName: "rexlive:apply_flex_position_block",
            data_to_send: {
                position:{
                    x: x,
                    y: y
                },
                target: target
            }
        }

        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_position);
    }
    
    var _init = function ($container) {
        var $self = $container.find("#block-content-positions-wrapper");
        block_content_position_properties = {
            $self: $self,
            // block padding
            $positions: $self.find(".content-position"),
        }

        defaultPositionCoordinates = "";

        block_content_position_properties.$self.find(".rex-block-position").on("click", function (e) { 
            //waiting for ending animation
            setTimeout(function(){
                _applyBlockPosition();
            }, 50)
        }); 
    }

    return {
        init: _init,
        updatePosition: _updatePosition,
        resetPosition: _resetPosition,
    };

})(jQuery);