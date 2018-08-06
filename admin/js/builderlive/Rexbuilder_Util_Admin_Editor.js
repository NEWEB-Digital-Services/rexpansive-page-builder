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

    var $custom_layout_modal;

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
        var $responsiveToolbar = $(".rexlive-responsive-toolbox");
        var $layoutData = $("#rexbuilder-layout-data-backend");

        $(document).on('click', '.btn-builder-layout', function (e) {
            var $btn = $(e.target);
            var btnName = $btn.data("name");

            if (activeLayoutPage != btnName) {
                //console.log("different layout selected");
                if (editedLive) {
                    if (confirm("Ehi, guarda che hai modificato qualcosa, vuoi matenere le modifiche?")) {
                        //console.log("salva");
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
                    eventName: "rexlive:changeLayout"
                };
                sendIframeBuilderMessage(layoutData);

                if ($btn.data("min-width") != "") {
                    $frameContainer.css("width", $btn.data("min-width"));
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

        window.addEventListener("message", receiveMessage, false);

        function receiveMessage(event) {
            if (event.data.rexliveEvent) {
                //console.log("rexlive event from iframe client");
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
                    Rexlive_MediaUploader.openMediaUploaderImage({});
                }

                if (event.data.eventName == "rexlive:addNewBlockVideo") {
                    Insert_Video_Modal.openVideoModal();
                }

                if (event.data.eventName == "rexlive:addNewSlider") {
                    Rexbuilder_RexSlider.openSliderModal();
                }

                if (event.data.eventName == "rexlive:editSlider") {
                    Rexbuilder_RexSlider.openSliderModal(event.data.blockID, event.data.shortCodeSlider, event.data.sliderID);
                }

                if (event.data.eventName == "rexlive:openSectionModal") {
                    Rexlive_Modals.openSectionModal(event.data.section_options_active);
                }

                if (event.data.eventName == "rexlive:uploadSliderFromLive") {
                    var dataSlider = event.data.sliderInfo;

                    var sliderData = dataSlider.slider;
                    var rex_slider_to_edit = dataSlider.slider.id.toString();
                    var newSliderFlag = dataSlider.newSlider;
                    var blockToEdit = dataSlider.blockID;

                    if (newSliderFlag) {
                        rex_slider_to_edit = "";
                    }

                    Rexbuilder_RexSlider.saveSlider(sliderData, blockToEdit, rex_slider_to_edit, newSliderFlag, true, dataSlider.slider.id.toString())

                }

                if (event.data.eventName == "rexlive:openCssEditor") {
                    CssEditor_Modal.openModal(event.data.currentStyle);
                }
            }
        };

        function updateResponsiveButtonFocus() {
            //console.log("updating layout focus");
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
        //console.log("sending message to iframe");
        frameBuilderWindow.postMessage(infos, '*');
    };

    /**
     * Function that handles the open and close of the Layouts modal
     * @since live
     */
    var add_custom_layout_listener = function () {
        $responsiveToolbar.find('.builder-config-layouts').on('click', function (e) {
            e.preventDefault();
            Rexpansive_Builder_Admin_Modals.OpenModal($custom_layout_modal.parent('.rex-modal-wrap'));
        });

        $custom_layout_modal.on('click', '.rex-cancel-button', function (e) {
            Rexpansive_Builder_Admin_Modals.CloseModal($custom_layout_modal.parent('.rex-modal-wrap'));
        });

        $custom_layout_modal.on('click', '.rex-save-button', function (e) {
            var layouts = [];
            $custom_layout_modal.find('.layout__item').each(function (i, e) {
                var $item = $(e);
                var layout = {
                    'id': $item.find('input[name=rexlive-layout-id]').val(),
                    'label': $item.find('input[name=rexlive-layout-label]').val(),
                    'min': $item.find('input[name=rexlive-layout-min]').val(),
                    'max': $item.find('input[name=rexlive-layout-max]').val(),
                    'type': $item.find('input[name=rexlive-layout-type]').val(),
                };
                layouts.push(layout);
            });
            //console.log(layouts);

            var data = {
                eventName: "",
                updatedLayouts: layouts,
            };

            data.eventName = "rexlive:updateLayouts";
            sendIframeBuilderMessage(data);

            Rexpansive_Builder_Admin_Modals.CloseModal($custom_layout_modal.parent('.rex-modal-wrap'));
        });

        $custom_layout_modal.on('click', '#rexlive-add-custom-layout', function () {
            $custom_layout_modal.find('.layout__list').append(tmpl('rexlive-tmpl-new-layout', { l_id: create_layout_id() }));
        });

        $custom_layout_modal.on('click', '.rexlive-layout--edit', function (e) {
            $(e.currentTarget).find('.dashicons-before').toggleClass('hide-icon');

            if ($(e.target).hasClass('dashicons-yes')) {
                $(this).parents('.layout__item').removeClass('editing').find('input[data-editable-field=true]').attr('type', 'hidden');
            } else if ($(e.target).hasClass('dashicons-edit')) {
                $(this).parents('.layout__item').addClass('editing').find('input[data-editable-field=true]').attr('type', 'input');
            }
        });

        $custom_layout_modal.on('click', '.rexlive-layout--delete', function () {
            $(this).parents('.layout__item').remove();
        });

        $custom_layout_modal.on('click', '.rexlive-remove-custom-layout', function () {
            $(this).parents('.layout__item').remove();
        });
    };

    /**
     * Creating the ID of a new layout. Checks if one exists
     * @return {string} id
     */
    var create_layout_id = function () {
        var id;
        var flag;
        var idLength = 4;
        do {
            flag = true;
            id = createRandomID(idLength);
            $custom_layout_modal.find('.layout__item').each(function () {
                if ($(this).find('input[name=rexlive-layout-id]').val() == id) {
                    flag = false;
                }
            });
        } while (!flag);
        return id;
    }

    var createRandomID = function (n) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < n; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    // init the utilities
    var init = function () {

        $frameContainer = $(".rexpansive-live-frame-container");
        $frameBuilder = $("#rexpansive-live-frame");
        frameBuilderWindow = $frameBuilder[0].contentWindow;

        $responsiveToolbar = $(".rexlive-responsive-toolbox");
        $custom_layout_modal = $('#rexlive-custom-layout-modal');

        activeLayoutPage = "default";
        editedLive = false;
    };

    return {
        init: init,
        addResponsiveListeners: addResponsiveListeners,
        sendIframeBuilderMessage: sendIframeBuilderMessage,
        add_custom_layout_listener: add_custom_layout_listener
    };

})(jQuery);