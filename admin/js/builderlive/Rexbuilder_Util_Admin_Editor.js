
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var addResponsiveListeners = function () {
        console.log("adding listeners");
        var $frameContainer = $(".rexpansive-live-frame-container");
        var $frameBuilder = $("#rexpansive-live-frame");
        var $responsiveToolbar = $(".rexlive-responsive-toolbox");
        
        $(document).on('click', '.btn-builder-layout', function(e){
            var $btn = $(e.target);

            $frameBuilder.remove();
            if($btn.data("min-width") != ""){
                $frameContainer.css("width", $btn.data("min-width"));
            } else {
                $frameContainer.css("width", "100%");
            }

            var frameDiv = document.createElement("iframe");
            var $frameDiv = $(frameDiv);

            $frameDiv.attr({
                src: source_url + "?layout="+$btn.data("name")+"&editor=true",
                allowfullscreen: "1"
            });

            $frameDiv.css({
                "width": "100%",
                "height": "100%",
            });

            $frameBuilder = $frameDiv;
            $frameContainer.append($frameDiv);
        });

        $(document).on('click', '.btn-save', function (e) {
            console.log("saving");
            var infos = {
                selected: [],
                eventName: "rexlive:save",
                rexliveEvent: true
            };
            $responsiveToolbar.find("input[name=device]:checked").each(function (i, checkbox) {
                var $checkbox = $(checkbox);
                infos.selected.push({
                    name: checkbox.value,
                    minWidth: $checkbox.data("min-width"),
                    maxWidth: $checkbox.data("max-width")
                });
            });
            console.log(infos);

            var frame = $frameBuilder[0].contentWindow;

            frame.postMessage(infos, '*');
        });

        $(document).on('click', '.btn-undo', function (e) {
            console.log("undo");
            var infos = {
                eventName: "rexlive:undo",
                rexliveEvent: true
            };
            
            var frame = $frameBuilder[0].contentWindow;

            frame.postMessage(infos, '*');
        });

        $(document).on('click', '.btn-redo', function (e) {
            console.log("redo");
            var infos = {
                eventName: "rexlive:redo",
                rexliveEvent: true
            };
            
            var frame = $frameBuilder[0].contentWindow;

            frame.postMessage(infos, '*');
        });
    }

    // init the utilities
    var init = function () {

    }

    return {
        addResponsiveListeners: addResponsiveListeners
    };

})(jQuery);