
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var addResponsiveListeners = function () {
        console.log("adding listeners");
        var $frameContainer = $(".rexpansive-live-frame-container");
        var $frameBuilder = $("#rexpansive-live-frame");
        var $responsiveToolbar = $(".rexlive-responsive-toolbox");
        console.log(source_url);
        $(document).on('click', '.builder-mobile-layout', function (e) {
            console.log("mobile layout");
            $frameBuilder.remove();
            $frameContainer.css("width", "320px");

            var frameDiv = document.createElement("iframe");
            var $frameDiv = $(frameDiv);

            $frameDiv.attr({
                src: source_url + "?layout=mobile&editor=true",
                allowfullscreen: "1"
            });
            $frameDiv.css({
                "width": "100%",
                "height": "100%",
            });

            $frameBuilder = $frameDiv;
            $frameContainer.append($frameDiv);
        });

        $(document).on('click', '.builder-tablet-layout', function (e) {
            console.log("tablet layout");
            $frameBuilder.remove();
            $frameContainer.css("width", "768px");

            var frameDiv = document.createElement("iframe");
            var $frameDiv = $(frameDiv);

            $frameDiv.attr({
                src: source_url + "?layout=tablet&editor=true",
                allowfullscreen: "1"
            });
            $frameDiv.css({
                "width": "100%",
                "height": "100%"
            });

            $frameBuilder = $frameDiv;
            $frameContainer.append($frameDiv);
        });

        $(document).on('click', '.builder-desktop-layout', function (e) {
            console.log("desktop layout");
            $frameBuilder.remove();
            $frameContainer.css("width", "1024px");

            var frameDiv = document.createElement("iframe");
            var $frameDiv = $(frameDiv);

            $frameDiv.attr({
                src: source_url + "?layout=desktop&editor=true",
                allowfullscreen: "1"
            });
            $frameDiv.css({
                "width": "100%",
                "height": "100%"
            });

            $frameBuilder = $frameDiv;
            $frameContainer.append($frameDiv);
        });

        $(document).on('click', '.builder-my-desktop-layout', function (e) {
            console.log("default layout");
            $frameBuilder.remove();
            $frameContainer.css("width", "100%");

            var frameDiv = document.createElement("iframe");
            var $frameDiv = $(frameDiv);

            $frameDiv.attr({
                src: source_url+"&editor=true",
                allowfullscreen: "1"
            });
            $frameDiv.css({
                "width": "100%",
                "height": "100%"
            });

            $frameBuilder = $frameDiv;
            $frameContainer.append($frameDiv);
        });


        $(document).on('click', '.builder-custom-layout', function (e) {
            console.log("tablet layout");
            $frameBuilder.remove();
            $frameContainer.css("width", "90%");

            var frameDiv = document.createElement("iframe");
            var $frameDiv = $(frameDiv);

            $frameDiv.attr({
                src: source_url + "?layout=custom&editor=true",
                allowfullscreen: "1"
            });
            $frameDiv.css({
                "width": "100%",
                "height": "100%"
            });

            $frameBuilder = $frameDiv;
            $frameContainer.append($frameDiv);
        });

        $(document).on('click', '.btn-save', function (e) {
            console.log("saving");
            var infos = {
                selected: [],
                trusted: true
            };
            $responsiveToolbar.find("input[name=device]:checked").each(function () {
                infos.selected.push(this.value);
            });
            console.log(infos);

            var frame = $frameBuilder[0].contentWindow;

            frame.postMessage(infos, '*');
        });

    }

    var addWindowListeners = function () {
        ;
    }

    // init the utilities
    var init = function () {

    }

    return {
        addResponsiveListeners: addResponsiveListeners
    };

})(jQuery);