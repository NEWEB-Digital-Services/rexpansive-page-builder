/**
 * Live Editing
 */
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var activeLayoutPage;
    var editedLive;

    var $frameContainer;
    var $frameBuilder;
    var frameBuilderWindow;
    var $responsiveToolbar;

    var updateResponsiveButtonFocus = function () {
        var $oldBtn = $responsiveToolbar.find(".active-layout-btn");
        var $layoutBtn = $responsiveToolbar.find("button[data-name=" + activeLayoutPage + "]");
        if ($oldBtn.length != 0) {
            $oldBtn.removeClass("active-layout-btn");
        }
        $layoutBtn.addClass("active-layout-btn");
    }

    var _findLayoutType = function (name) {
        if (name == "default" || name == "mobile" || name == "tablet") {
            return "standard";
        }
        return "custom";
    }
    
    var _receiveMessage = function (event) {
        
        if (event.data.rexliveEvent) {
            var eventData = event.data;
            //console.log("rexlive event from iframe client");
            // da finire con lo switch per una maggiore chiarezza
            switch(eventData.eventName){
                case "":
                    break;
                default: break;
            }

            if (event.data.eventName == "rexlive:edited") {
                if (event.data.edited) {
                    editedLive = true;
                }
            }

            if (event.data.eventName == "rexlive:layoutChanged") {
                activeLayoutPage = event.data.activeLayoutName;
                updateResponsiveButtonFocus();
            }

            if (event.data.eventName == "rexlive:openMediaUploader") {
                Rexlive_MediaUploader.openInsertImageBlocksMediaUploader(eventData);
            }

            if (event.data.eventName == "rexlive:addNewBlockVideo") {
                Insert_Video_Modal.openVideoModal(eventData);
            }

            if (event.data.eventName == "rexlive:addNewSlider") {
                Rexbuilder_RexSlider.openSliderModal("", "", "", eventData.target);
            }

            if (event.data.eventName == "rexlive:editSlider") {
                var data = event.data;
                Rexbuilder_RexSlider.openSliderModal(data.blockID, data.shortCodeSlider, data.sliderID, data.target);
            }

            if (event.data.eventName == "rexlive:openSectionModal") {
                Section_Modal.openSectionModal(event.data.section_options_active);
            }

            if (event.data.eventName == "rexlive:openModalMenu") {
                Model_Modal.openModal(event.data.modelData);
            }

            if (event.data.eventName == "rexlive:updateModel") {
                Model_Modal.updateModel(event.data.modelData);
            }

            if (event.data.eventName == "rexlive:uploadSliderFromLive") {
                var dataSlider = event.data.sliderInfo;
                console.log(dataSlider);
                var sliderData = dataSlider.slider;
                var rex_slider_to_edit = dataSlider.slider.id.toString();
                var newSliderFlag = dataSlider.newSlider;
                var blockToEdit = dataSlider.blockID;
                var targetToEdit = dataSlider.target;

                Rexbuilder_RexSlider.saveSlider(sliderData, blockToEdit, rex_slider_to_edit, newSliderFlag, true, targetToEdit)
            }

            if (event.data.eventName == "rexlive:openCssEditor") {
                CssEditor_Modal.openModal(event.data.currentStyle);
            }

            if (event.data.eventName == "rexlive:editBackgroundSection") {
                SectionBackground_Modal.openSectionBackgroundModal(event.data.activeBG);
            }

            if (event.data.eventName == "rexlive:editBlockOptions") {
                BlockOptions_Modal.openBlockOptionsModal(event.data.activeBlockData);
            }
            
            if (event.data.eventName == "rexlive:editRemoveModal") {
                Model_Edit_Modal.openModal(event.data.modelData);
            }
        }
    };

    var _addDocumentListeners = function () {
        $(document).on('click', '.btn-builder-layout', function (e) {
            var $btn = $(e.target);
            var btnName = $btn.attr("data-name");

            if (activeLayoutPage != btnName) {

                var buttonData = {
                    min: $btn.attr("data-min-width"),
                    max: $btn.attr("data-max-width"),
                    id: btnName,
                    label: $btn.text(),
                    type: _findLayoutType(btnName)
                };

                if (editedLive) {
                    if (confirm("Ehi, guarda che hai modificato qualcosa, vuoi matenere le modifiche?")) {
                        //console.log("salva");

                        var updateData = {
                            selected: activeLayoutPage,
                            eventName: ""
                        };

                        if (activeLayoutPage == "default") {
                            updateData.eventName = "rexlive:saveDefaultLayout";
                            sendIframeBuilderMessage(updateData);
                        }

                        updateData.eventName = "rexlive:saveCustomizations";
                        sendIframeBuilderMessage(updateData);

                        //console.log("saved");
                    } else {
                        //console.log("non salvare");
                    }
                    editedLive = false;
                    //console.log("saving ended");
                }

                activeLayoutPage = btnName;
                updateResponsiveButtonFocus();

                var layoutData = {
                    selectedLayoutName: activeLayoutPage,
                    eventName: "rexlive:changeLayout",
                    layoutData: buttonData
                };

                sendIframeBuilderMessage(layoutData);

                if ($btn.attr("data-min-width") != "") {
                    $frameContainer.css("width", $btn.attr("data-min-width"));
                    $frameContainer.css("min-width", "");
                } else {
                    $frameContainer.css("width", "100%");
                    if (activeLayoutPage == "default") {
                        $frameContainer.css("min-width", "1024px");
                    }
                }
            }
        });

        $(document).on('click', '.btn-save', function (e) {
            //console.log("saving");

            var data = {
                selected: activeLayoutPage,
                eventName: ""
            };

            if (activeLayoutPage == "default") {
                data.eventName = "rexlive:saveDefaultLayout";
                sendIframeBuilderMessage(data);
            }

            data.eventName = "rexlive:saveCustomizations";
            sendIframeBuilderMessage(data);

        });

        $(document).on('click', '.btn-undo', function (e) {
            //console.log("undo");
            var data = {
                eventName: "rexlive:undo",
            };

            sendIframeBuilderMessage(data);
        });

        $(document).on('click', '.btn-redo', function (e) {
            //console.log("redo");
            var data = {
                eventName: "rexlive:redo",
            };

            sendIframeBuilderMessage(data);
        });

        window.addEventListener("message", _receiveMessage, false);
    }

    var sendIframeBuilderMessage = function (data) {
        var infos = {
            rexliveEvent: true
        };
        jQuery.extend(infos, data);
        //console.log("sending message to iframe");
        frameBuilderWindow.postMessage(infos, '*');
    };

    var _createRandomID = function (n) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < n; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    // init the utilities
    var init = function () {

        this.$rexpansiveContainer = $("#rexpansive-builder-backend-wrapper");

        $frameContainer = this.$rexpansiveContainer.find(".rexpansive-live-frame-container");
        $frameBuilder = this.$rexpansiveContainer.find("#rexpansive-live-frame");
        frameBuilderWindow = $frameBuilder[0].contentWindow;

        $responsiveToolbar = this.$rexpansiveContainer.find(".rexlive-responsive-toolbox");

        activeLayoutPage = "default";
        editedLive = false;
        _addDocumentListeners();
    };

    return {
        init: init,
        createRandomID: _createRandomID,
        sendIframeBuilderMessage: sendIframeBuilderMessage
    };

})(jQuery);