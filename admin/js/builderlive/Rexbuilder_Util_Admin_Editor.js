
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var activeLayoutPage;
    var editedLive;
    var $frameContainer;
    var $frameBuilder;
    var frameBuilderWindow;

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
                        var activeLayout = [];
                        activeLayout.push(activeLayoutPage);
                        //activeLayout.push(nameVisualizzato);
                        activeLayout.push($btn.data("min-width"));
                        activeLayout.push($btn.data("max-width"));

                        var availableLayouts = updateLayouts(activeLayout, JSON.parse($layoutData.children(".available-layouts").text()));

                        var updateData = {
                            selected: activeLayout,
                            eventName: "",
                            updatedLayouts: availableLayouts,
                        };

                        if (activeLayoutPage == "default") {
                            updateData.eventName = "rexlive:saveDefaultLayout";
                            sendIframeBuilderMessage(updateData);
                        }

                        updateData.eventName = "rexlive:saveCustomizations";
                        sendIframeBuilderMessage(updateData);
                        
                        console.log("saved");
                    } else {
                        console.log("non salvare");
                    }
                    editedLive = false;
                    console.log("saving ended");
                }
                //console.log("MADONNA"); 
                activeLayoutPage = btnName;
                updateResponsiveButtonFocus();
                
                if ($btn.data("min-width") != "") {
                    $frameContainer.css("width", $btn.data("min-width"));
                } else {
                    $frameContainer.css("width", "100%");
                }

                var layoutData = {
                    selectedLayoutName: activeLayoutPage,
                    eventName: "rexlive:changeLayout"
                };
                sendIframeBuilderMessage(layoutData);

            }
        });

        $(document).on('click', '.btn-save', function (e) {
            console.log("saving");
            var activeLayout = [];
            var layoutBtn = $responsiveToolbar.find("button[data-name=" + activeLayoutPage + "]");

            var activeLayout = [];
            activeLayout.push(activeLayoutPage);
            activeLayout.push(layoutBtn.data("min-width"));
            activeLayout.push(layoutBtn.data("max-width"));

            var availableLayouts = updateLayouts(activeLayout, JSON.parse($layoutData.children(".available-layouts").text()));

            $layoutData.children(".available-layouts").text(JSON.stringify(availableLayouts));

            var data = {
                selected: activeLayout,
                eventName: "",
                updatedLayouts: availableLayouts,
            };

            if (activeLayoutPage == "default") {
                data.eventName = "rexlive:saveDefaultLayout";
                sendIframeBuilderMessage(data);
            }

            data.eventName = "rexlive:saveCustomizations";
            sendIframeBuilderMessage(data);

        });

        $(document).on('click', '.btn-undo', function (e) {
            console.log("undo");
            var data = {
                eventName: "rexlive:undo",
            };

            sendIframeBuilderMessage(data);
        });

        $(document).on('click', '.btn-redo', function (e) {
            console.log("redo");
            var data = {
                eventName: "rexlive:redo",
            };

            sendIframeBuilderMessage(data);
        });

        window.addEventListener("message", receiveMessage, false);

        function receiveMessage(event) {
            if (event.data.rexliveEvent) {
                console.log("rexlive event from iframe client");
                if (event.data.eventName == "rexlive:edited") {
                    if (event.data.edited) {
                        editedLive = true;
                    }
                }
                if (event.data.eventName == "rexlive:layoutChanged") {
                    activeLayoutPage = event.data.activeLayoutName;
                    updateResponsiveButtonFocus();
                }
            }
        };

        function updateResponsiveButtonFocus() {
            console.log("updating layout focus");
            var $oldBtn = $responsiveToolbar.find(".active-layout-btn");
            var $layoutBtn = $responsiveToolbar.find("button[data-name=" + activeLayoutPage + "]");
            if ($oldBtn.length != 0) {
                $oldBtn.removeClass("active-layout-btn");
            }
            $layoutBtn.addClass("active-layout-btn");
        };
    }

    var sendIframeBuilderMessage = function (data) {
        var infos = {
            rexliveEvent: true
        };
        jQuery.extend(infos, data);

        frameBuilderWindow.postMessage(infos, '*');
    }

    // init the utilities
    var init = function () {

        $frameContainer = $(".rexpansive-live-frame-container");
        $frameBuilder = $("#rexpansive-live-frame");
        frameBuilderWindow = $frameBuilder[0].contentWindow;

        activeLayoutPage = "default";
        editedLive = false;
    }

    return {
        init: init,
        addResponsiveListeners: addResponsiveListeners,
        sendIframeBuilderMessage: sendIframeBuilderMessage
    };

})(jQuery);