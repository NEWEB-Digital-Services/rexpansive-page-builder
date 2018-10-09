/**
 * Live Editing
 */
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var activeLayoutPage;
    var modelSaved;
    var pageSaved;
    var $saveBtn;

    var $frameContainer;
    var frameBuilderWindow;

    var updatedLayoutData;

    var input_selector;

    var _findLayoutType = function (name) {
        if (name == "default" || name == "mobile" || name == "tablet") {
            return "standard";
        }
        return "custom";
    }

    var _receiveMessage = function (event) {

        if (event.data.rexliveEvent) {
            //fare come sul live, con lo switch sui nomi degli eventi
            var eventData = event.data;

            if (event.data.eventName == "rexlive:edited") {
                if (event.data.modelEdited) {
                    modelSaved = false;
                } else {
                    pageSaved = false;
                }
                $saveBtn.addClass("page-edited");
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

            if (event.data.eventName == "rexlive:openLiveImageUploader") {
                Rexlive_MediaUploader.openImageLiveMediaUploader(event.data.live_uploader_data);
            }

            if (event.data.eventName == "rexlive:editBackgroundSection") {
                SectionBackground_Modal.openSectionBackgroundModal(event.data.activeBG);
            }

            if( event.data.eventName == "rexlive:editRowVideoBackground" ) {
                Section_Video_Background_Modal.openSectionVideoBackgroundModal(event.data.activeBG);
            }

            if (event.data.eventName == "rexlive:editBlockOptions") {
                BlockOptions_Modal.openBlockOptionsModal(event.data.activeBlockData);
            }

            if (event.data.eventName == "rexlive:editBlockVideoBackground") {
                Block_Video_Background_Modal.openBlockVideoBackgroundModal(event.data.activeBlockData);
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
                if (modelSaved && pageSaved) {
                    Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.attr("data-rex-edited-backend", false);
                    $saveBtn.removeClass("page-edited");
                    $saveBtn.removeClass("rex-saving");
                    if (typeof event.data.buttonData !== "undefined" && event.data.buttonData != "") {
                        _updateLayoutPage(event.data.buttonData);
                    }
                }
            }

            if (event.data.eventName == "rexlive:restoreStateEnded") {
                modelSaved = true;
                pageSaved = true;
                if (typeof event.data.buttonData !== "undefined" && typeof event.data.buttonData != "") {
                    _updateLayoutPage(event.data.buttonData);
                }
            }
        }
    };

    var _addDocumentListeners = function () {
        $(document).on('click', '.btn-builder-layout', function (e) {
            var $btn = $(e.target).parents(".btn-builder-layout");
            var btnName = $btn.attr("data-name");

            if (activeLayoutPage != btnName) {
            
                var buttonData = {
                    min: $btn.attr("data-min-width"),
                    max: $btn.attr("data-max-width"),
                    id: btnName,
                    label: $btn.text(),
                    type: _findLayoutType(btnName)
                };
                var dataObj = {
                    activeLayout: activeLayoutPage,
                    buttonData: buttonData,
                    modelSaved: modelSaved,
                    pageSaved: pageSaved
                }
                
                if (Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.attr("data-rex-edited-backend").toString() == "true") {
                    LockedOptionMask.openModal(dataObj);
                } else {
                    if (!(modelSaved && pageSaved)) {
                        Change_Layout_Modal.openModal(dataObj);
                        return;
                    }
                    _sendIframeBuilderMessage({
                        eventName: "rexlive:startChangeLayout",
                    });
                    _updateLayoutPage(buttonData);
                }
            }
        });

        $saveBtn.on('click', function (e) {
            $(this).addClass("rex-saving");
            var dataSave = {
                eventName: "rexlive:savePage",
                data_to_send: {
                    activeLayout: activeLayoutPage
                }
            }
            _sendIframeBuilderMessage(dataSave);
        });

        $(document).on('click', '.btn-undo', function (e) {
            var data = {
                eventName: "rexlive:undo",
            };

            _sendIframeBuilderMessage(data);
        });

        $(document).on('click', '.btn-redo', function (e) {
            var data = {
                eventName: "rexlive:redo",
            };

            _sendIframeBuilderMessage(data);
        });

        $(document).on('click', '.btn-models', function (e) {
            Model_Import_Modal.openModal();
        });

        /**
         * Material design input field animation on focus
         * Slide up the label
         * @since 2.0.0
         */
        $(document).on('focus', input_selector, function(e) {
            if ($(e.target).is(input_selector)) {
                $(e.target)
                    .siblings('label, .prefix')
                    .addClass('active');
                }
            }
        );

        /**
         * Material design input field animation on blur
         * Slide down the label
         * @since 2.0.0
         */
        $(document).on('blur', input_selector, function(e) {
            if ($(e.target).is(input_selector)) {
                $(e.target)
                    .siblings('label, .prefix')
                    .removeClass('active');
                }
            }
        );

        window.addEventListener("message", _receiveMessage, false);
    }

    var _updateLayoutPage = function (buttonData) {
        modelSaved = true;
        pageSaved = true;
        activeLayoutPage = buttonData.id;
        Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find(".btn-builder-layout.active-layout").removeClass("active-layout");
        Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find(".btn-builder-layout[data-name=\""+activeLayoutPage+"\"]").addClass("active-layout");

        updatedLayoutData = {
            selectedLayoutName: activeLayoutPage,
            eventName: "rexlive:changeLayout",
            layoutData: buttonData
        };

        _updateIframeWidth(buttonData.min);
    }

    var _updateLayoutActiveData = function (newData) {
        updatedLayoutData = newData;
    }

    var _updateIframeWidth = function (newWidth) {
        if (newWidth != Rexbuilder_Util_Admin_Editor.activeWidth) {
            if (newWidth == "") {
                $frameContainer.css("width", "100%");
                $frameContainer.css("min-width", "1024px");
            } else {
                $frameContainer.css("width", newWidth);
                $frameContainer.css("min-width", "");
            }
            Rexbuilder_Util_Admin_Editor.activeWidth = newWidth;
        } else {
            _sendIframeBuilderMessage(updatedLayoutData);
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

    var _getActiveLayout = function () {
        return activeLayoutPage;
    }

    var _setActiveLayout = function (layout) {
        activeLayoutPage = layout;
        this.$responsiveToolbar.find(".btn-builder-layout.active-layout").removeClass("active-layout");
        this.$responsiveToolbar.find(".btn-builder-layout[data-name=\""+activeLayoutPage+"\"]").addClass("active-layout");
    }

    var _whichTransitionEvent = function () {
        var t,
            el = document.createElement("fakeelement");

        var transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    };

    var _whichAnimationEvent = function () {
        var t,
            el = document.createElement("fakeelement");

        var animations = {
            "animation": "animationend",
            "OAnimation": "oAnimationEnd",
            "MozAnimation": "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        }

        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }
    };
    
    var _blockIframeRows = function(){
        var data = {
            eventName: "rexlive:lockRows",
        };

        _sendIframeBuilderMessage(data);
    };

    var _releaseIframeRows = function(){
        var data = {
            eventName: "rexlive:unlockRows",
        };

        _sendIframeBuilderMessage(data);
    };

    var _editPageProperties = function(){
        pageSaved = false;
        $saveBtn.addClass("page-edited");
    }

    // init the utilities
    var init = function () {

        this.$rexpansiveContainer = $("#rexpansive-builder-backend-wrapper");
        $frameContainer = this.$rexpansiveContainer.find(".rexpansive-live-frame-container");
        this.$frameBuilder = this.$rexpansiveContainer.find("#rexpansive-live-frame");
        frameBuilderWindow = this.$frameBuilder[0].contentWindow;

        this.transitionEvent = _whichTransitionEvent();
        this.animationEvent = _whichAnimationEvent();

        this.$responsiveToolbar = this.$rexpansiveContainer.find(".rexlive-toolbox");
        $saveBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find(".btn-save");
        pageSaved = true;
        modelSaved = true;
        activeLayoutPage = "default";
        this.$responsiveToolbar.find(".builder-default-layout").addClass("active-layout");
        this.activeWidth = 0;
        
        input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea';

        $frameContainer.on(Rexbuilder_Util_Admin_Editor.transitionEvent, function () {
            if (updatedLayoutData !== null) {
                console.log('animazion stop');
                _sendIframeBuilderMessage(updatedLayoutData);
            }
        });

        _addDocumentListeners();
    };

    return {
        init: init,
        createRandomID: _createRandomID,
        sendIframeBuilderMessage: _sendIframeBuilderMessage,
        updateLayoutPage: _updateLayoutPage,
        getActiveLayout: _getActiveLayout,
        setActiveLayout: _setActiveLayout,
        updateIframeWidth: _updateIframeWidth,
        updateLayoutActiveData: _updateLayoutActiveData,
        releaseIframeRows: _releaseIframeRows,
        blockIframeRows: _blockIframeRows,
        editPageProperties: _editPageProperties
    };

})(jQuery);