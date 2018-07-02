
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var activeLayoutPage;
    var editedLive;

    var updateLayouts = function (selectedLayout, oldLayouts) {
        var availableLayouts = [];

        var oldLayout;

        $.each(oldLayouts, function (i, ol) {
            oldLayout = ol;
            if (selectedLayout[0] == oldLayout[0]) {
                if (selectedLayout[1] != oldLayout[1]) {
                    oldLayout[1] = selectedLayout[1];
                }
                if (selectedLayout[2] != oldLayout[2]) {
                    oldLayout[2] = selectedLayout[2];
                }
                selectedLayout.presente = true;
            }
        });

        $.each(oldLayouts, function (i, l) {
            availableLayouts.push(l);
        });

        if (selectedLayout.presente === undefined) {
            availableLayouts.push(selectedLayout);
        }

        return availableLayouts;
    }

    var addResponsiveListeners = function () {
        console.log("adding listeners");
        var $frameContainer = $(".rexpansive-live-frame-container");
        var $frameBuilder = $("#rexpansive-live-frame");
        var $responsiveToolbar = $(".rexlive-responsive-toolbox");
        var $layoutData = $("#rexbuilder-layout-data-backend");

        $(document).on('click', '.btn-new-layout', function (e) {
            console.log("creating new layout");
        });

        $(document).on('click', '.btn-builder-layout', function (e) {
            var $btn = $(e.target);
            var btnName = $btn.data("name");

            if (activeLayoutPage != btnName) {
                console.log("different layout selected");
                if (editedLive) {
                    if (confirm("Ehi, guarda che hai modificato qualcosa, vuoi matenere le modifiche?")) {
                        console.log("salva");
                        var eventName;
                        var activeLayout = [];
                        activeLayout.push(activeLayoutPage);
                        activeLayout.push($btn.data("min-width"));
                        activeLayout.push($btn.data("max-width"));

                        var availableLayouts = updateLayouts(activeLayout, JSON.parse($layoutData.children(".available-layouts").text()));

                        var frame = $frameBuilder[0].contentWindow;

                        var infos = {
                            selected: activeLayout,
                            eventName: "",
                            updatedLayouts: availableLayouts,
                            rexliveEvent: true
                        };
            
                        if (activeLayoutPage == "default") {
            
                            eventName = "rexlive:saveDefaultLayout";
                            infos.eventName = eventName;
                            frame.postMessage(infos, '*');
            
                            eventName = "rexlive:saveCustomizations";
                            infos.eventName = eventName;
                            frame.postMessage(infos, '*');
                        } else {
                            eventName = "rexlive:saveCustomizations";
                            infos.eventName = eventName;
                            frame.postMessage(infos, '*');
                        }
                        console.log("saved");
                    } else {
                        console.log("non salvare");
                    }
                    editedLive = false;
                }

                activeLayoutPage = btnName;

                if ($btn.data("min-width") != "") {
                    $frameContainer.css("max-width", $btn.data("min-width"));
                } else {
                    $frameContainer.css("max-width", "100%");
                }
            }
        });

        $(document).on('click', '.btn-save', function (e) {
            console.log("saving");
            var activeLayout = [];
            var layoutBtn = $responsiveToolbar.find("button[data-name=" + activeLayoutPage + "]");
            var eventName;

            var activeLayout = [];
            activeLayout.push(activeLayoutPage);
            activeLayout.push(layoutBtn.data("min-width"));
            activeLayout.push(layoutBtn.data("max-width"));
            
            var availableLayouts = updateLayouts(activeLayout, JSON.parse($layoutData.children(".available-layouts").text()));

            $layoutData.children(".available-layouts").text(JSON.stringify(availableLayouts));

            var frame = $frameBuilder[0].contentWindow;

            var infos = {
                selected: activeLayout,
                eventName: "",
                updatedLayouts: availableLayouts,
                rexliveEvent: true
            };

            if (activeLayoutPage == "default") {

                eventName = "rexlive:saveDefaultLayout";
                infos.eventName = eventName;
                frame.postMessage(infos, '*');

                eventName = "rexlive:saveCustomizations";
                infos.eventName = eventName;
                frame.postMessage(infos, '*');
            } else {
                eventName = "rexlive:saveCustomizations";
                infos.eventName = eventName;
                frame.postMessage(infos, '*');
            }

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

        window.addEventListener("message", receiveMessage, false);

        function receiveMessage(event) {
            if (event.data.rexliveEvent) {
                console.log("rexlive event");
                if (event.data.eventName == "rexlive:edited") {
                    if (event.data.edited) {
                        editedLive = true;
                    }
                }
            }
        }
    }

    // init the utilities
    var init = function () {
        activeLayoutPage = "default";
        editedLive = false;
    }

    return {
        init: init,
        addResponsiveListeners: addResponsiveListeners
    };

})(jQuery);