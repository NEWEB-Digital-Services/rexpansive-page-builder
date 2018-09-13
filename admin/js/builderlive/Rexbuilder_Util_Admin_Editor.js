/**
 * Live Editing
 */
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var activeLayoutPage;
    var modelSaved;
    var pageSaved;

    var $frameContainer;
    var $frameBuilder;
    var frameBuilderWindow;

    var updateResponsiveButtonFocus = function () {
        var $oldBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find(".active-layout-btn");
        var $layoutBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find("button[data-name=" + activeLayoutPage + "]");
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

            if (event.data.eventName == "rexlive:edited") {
                if(event.data.modelEdited){
                    modelSaved = false;
                } else{
                    pageSaved = false;
                }
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

            if (event.data.eventName == "rexlive:savePageEnded") {
                switch (event.data.dataSaved) {
                    case 'model':
                        modelSaved = true;
                        break;
                    case 'page':
                        pageSaved = true;
                        break;
                    default: 
                        break;
                }
                if(typeof event.data.buttonData !== "undefined" && event.data.buttonData != ""){
                    if (modelSaved && pageSaved){
                        Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find(".btn-save").removeClass("rex-saving");
                        _updateLayoutPage(event.data.buttonData);
                    }
                }
            }

            if (event.data.eventName == "rexlive:restoreStateEnded") {
                modelSaved = true;
                pageSaved = true;
                if(typeof event.data.buttonData !== "undefined" && typeof event.data.buttonData != ""){
                    _updateLayoutPage(event.data.buttonData);
                }
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

                if (!(modelSaved && pageSaved)) {
                    Change_Layout_Modal.openModal({
                        activeLayout: activeLayoutPage,
                        buttonData: buttonData,
                        modelSaved: modelSaved,
                        pageSaved: pageSaved
                    });
                    return;
                }
                _updateLayoutPage(buttonData);
            }
        });

        $(document).on('click', '.btn-save', function (e) {
            //console.log("saving");
            $(e.target).addClass("rex-saving");
            var dataSave = {
                eventName: "rexlive:savePage",
                data_to_send: {
                    activeLayout: activeLayoutPage
                }
            }
            _sendIframeBuilderMessage(dataSave);
        });

        $(document).on('click', '.btn-undo', function (e) {
            //console.log("undo");
            var data = {
                eventName: "rexlive:undo",
            };

            _sendIframeBuilderMessage(data);
        });

        $(document).on('click', '.btn-redo', function (e) {
            //console.log("redo");
            var data = {
                eventName: "rexlive:redo",
            };

            _sendIframeBuilderMessage(data);
        });

        window.addEventListener("message", _receiveMessage, false);
    }
    
    var _updateLayoutPage = function(buttonData){
        modelSaved = true;
        pageSaved = true;
        activeLayoutPage = buttonData.id;
        updateResponsiveButtonFocus();

        var layoutData = {
            selectedLayoutName: activeLayoutPage,
            eventName: "rexlive:changeLayout",
            layoutData: buttonData
        };

        _sendIframeBuilderMessage(layoutData);

        if (buttonData.min != "") {
            $frameContainer.css("width", buttonData.min);
            $frameContainer.css("min-width", "");
        } else {
            $frameContainer.css("width", "100%");
            if (activeLayoutPage == "default") {
                $frameContainer.css("min-width", "1024px");
            }
        }
    }

    var _sendIframeBuilderMessage = function (data) {
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

        this.$responsiveToolbar = this.$rexpansiveContainer.find(".rexlive-responsive-toolbox");
        pageSaved = true;
        modelSaved = true;
        activeLayoutPage = "default";
        _addDocumentListeners();
    };

    return {
        init: init,
        createRandomID: _createRandomID,
        sendIframeBuilderMessage: _sendIframeBuilderMessage,
        updateLayoutPage: _updateLayoutPage,
    };

})(jQuery);