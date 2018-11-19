var Rex_Save_Listeners = (function ($) {
    'use strict';
    $(function () {

        $(document).on("rexlive:savePage", function (e) {
            var eventData = e.settings.data_to_send;
            var i, j, k, m, p, q;

            // Rexbuilder_Util_Editor.startLoading();
            Rexbuilder_Util_Editor.savingPage = true;
            var idPost = parseInt($('#id-post').attr('data-post-id'));
            var activeLayoutName = Rexbuilder_Util.activeLayout;

            //getting custom css set in page
            var customCSS = $("#rexpansive-builder-style-inline-css").text().trim();

            //creating customization of page
            Rexbuilder_Dom_Util.fixModelNumbers();
            var newCustomization = createCustomization(activeLayoutName);

            //updating customizations avaiable names
            var layoutsNames = Rexbuilder_Util.getPageAvaiableLayoutsNames();
            var flagNames = false;
            for (i = 0; i < layoutsNames.length; i++) {
                if (layoutsNames[i] == newCustomization.name) {
                    flagNames = true;
                    break;
                }
            }
            if (!flagNames) {
                layoutsNames.push(newCustomization.name);
            }

            Rexbuilder_Util.updatePageAvaiableLayoutsNames(layoutsNames);
            Rexbuilder_Util.updatePageCustomizationsData(newCustomization);

            var ajaxCalls = [];

            //avaiable custom layouts
            ajaxCalls.push(
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: _plugin_frontend_settings.rexajax.ajaxurl,
                    data: {
                        action: 'rexlive_save_avaiable_layouts',
                        nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                        post_id_to_update: idPost,
                        names: layoutsNames
                    },
                    success: function (response) {
                        if (response.success) {
                            console.log('nomi layout aggiornati!');
                        }
                    },
                    error: function (response) {
                    }
                })
            );

            //custom css
            ajaxCalls.push($.ajax({
                type: 'POST',
                dataType: 'json',
                url: _plugin_frontend_settings.rexajax.ajaxurl,
                data: {
                    action: 'rexlive_save_custom_css',
                    nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                    post_id_to_update: idPost,
                    custom_css: customCSS
                },
                success: function (response) {
                    if (response.success) {
                        console.log('custom css aggiornato!');
                    }
                },
                error: function (response) {
                }
            }));

            if (activeLayoutName == "default") {
                var postClean = "";
                var shortcodePage = '';

                Rexbuilder_Util.updateDefaultLayoutState({
                    pageData: newCustomization.sections,
                    modelsData: Rexbuilder_Util.getModelsCustomizations()
                });

                // shortcode of page
                Rexbuilder_Util.$rexContainer.find('.rexpansive_section').each(function () {
                    var $section = $(this);
                    if (!$section.hasClass("removing_section")) {
                        if (!$section.hasClass("rex-model-section")) {
                            shortcodePage += createSectionProperties($section, "shortcode", null);
                        } else {
                            shortcodePage += "[RexModel id=" + $section.attr("data-rexlive-model-id") + "][/RexModel]";
                        }
                    }
                });

                //fixing customizations in page
                var customizationsArray = [];
                // var flagSection;
                var flagTarget;
                customizationsArray = Rexbuilder_Util.getPageCustomizationsDom();
                for (i = 0; i < customizationsArray.length; i++) {
                    var modelsNumbers = _countModels(customizationsArray[i].sections);
                    for (j = 0; j < newCustomization.sections.length; j++) {
                        //flagSection = false;
                        for (k = 0; k < customizationsArray[i].sections.length; k++) {
                            if (newCustomization.sections[j].section_rex_id == customizationsArray[i].sections[k].section_rex_id) {
                                if (customizationsArray[i].sections[k].section_is_model.toString() == "true") {
                                    for (m = 0; m < modelsNumbers.length; m++) {
                                        if (modelsNumbers[m].id == customizationsArray[i].sections[k].section_model_id) {
                                            if (parseInt(newCustomization.sections[j].section_model_number) <= modelsNumbers[m].number) {
                                                //flagSection = true;
                                            }
                                        }
                                    }
                                } else {
                                    //flagSection = true;
                                }

                                //adding new blocks to custom layouts
                                //if (flagSection && customizationsArray[i].sections[k].section_is_model.toString() != "true") {
                                if (customizationsArray[i].sections[k].section_is_model.toString() != "true") {
                                    if (typeof customizationsArray[i].sections[k].targets == "undefined" || customizationsArray[i].sections[k].targets.length == 0) {
                                        customizationsArray[i].sections[k].targets = [];
                                        customizationsArray[i].sections[k].targets.push({
                                            name: "self",
                                            props: {}
                                        });
                                    }
                                    for (p = 1; p < newCustomization.sections[j].targets.length; p++) {
                                        flagTarget = false;
                                        for (q = 1; q < customizationsArray[i].sections[k].targets.length; q++) {
                                            if (newCustomization.sections[j].targets[p].name == customizationsArray[i].sections[k].targets[q].name) {
                                                flagTarget = true;
                                            }
                                        }
                                        if (!flagTarget) {
                                            var emptyTarget = {
                                                name: newCustomization.sections[j].targets[p].name,
                                                props: {}
                                            }
                                            customizationsArray[i].sections[k].targets.splice(1, 0, emptyTarget);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                customizationsArray.push(newCustomization);

                for (var i = 0; i < customizationsArray.length; i++) {
                    Rexbuilder_Util.updatePageCustomizationsData(customizationsArray[i]);
                    Rexbuilder_Util.updatePageCustomizationsDomOrder(customizationsArray[i]);
                    ajaxCalls.push(
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: _plugin_frontend_settings.rexajax.ajaxurl,
                            data: {
                                action: 'rexlive_save_customization_layout',
                                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                                post_id_to_update: idPost,
                                sections: JSON.stringify(customizationsArray[i].sections),
                                layout_name: customizationsArray[i].name
                            },
                            success: function (response) {
                                if (response.success) {
                                    console.log('layout ' + response.data.layoutName + ' aggiornato!');
                                }
                            },
                            error: function (response) {
                            }
                        })
                    );
                }

                //save shortcode page
                ajaxCalls.push(
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: _plugin_frontend_settings.rexajax.ajaxurl,
                        data: {
                            action: 'rexlive_save_shortcode',
                            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                            post_id_to_update: idPost,
                            clean_post: postClean,
                            rex_shortcode: shortcodePage,
                        },
                        success: function (response) {
                            if (response.success) {
                                console.log('shortcode pagina aggiornato!');
                                Rexbuilder_Util.$rexContainer.removeClass("backend-edited");
                                Rexbuilder_Util.backendEdited = false;
                            }
                        },
                        error: function (response) {
                        }
                    })
                );

                //save sections ids used
                var idsUsed = Rexbuilder_Util.getSectionNamesUsed();
                Rexbuilder_Util.saveSectionNamesUsed();
                ajaxCalls.push(
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: _plugin_frontend_settings.rexajax.ajaxurl,
                        data: {
                            action: 'rexlive_save_sections_rexids',
                            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                            ids_used: JSON.stringify(idsUsed),
                        },
                        success: function (response) {
                            if (response.success) {
                                console.log('nomi delle section utilizzati salvati!');
                            }
                        },
                        error: function (response) {
                        }
                    })
                );
            } else {
                //ajax calls 
                ajaxCalls.push(
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: _plugin_frontend_settings.rexajax.ajaxurl,
                        data: {
                            action: 'rexlive_save_customization_layout',
                            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                            post_id_to_update: idPost,
                            sections: JSON.stringify(newCustomization.sections),
                            layout_name: newCustomization.name
                        },
                        success: function (response) {
                            if (response.success) {
                                console.log('layout ' + response.data.layoutName + ' aggiornato!');
                                console.log(newCustomization.sections);
                            }
                        },
                        error: function (response) {
                        }
                    })
                );
            }

            // Can't pass a literal array, so use apply.
            $.when.apply($, ajaxCalls).then(function () {
                // Do your success stuff
                Rexbuilder_Util_Editor.savingPage = false;
                var data = {
                    eventName: "rexlive:savePageEnded",
                    buttonData: eventData.buttonData,
                    dataSaved: "page"
                }
                Rexbuilder_Util_Editor.sendParentIframeMessage(data);
            }).fail(function () {
                // Probably want to catch failure
            }).always(function () {
                // Rexbuilder_Util_Editor.endLoading();
                // Or use always if you want to do the same thing
                // whether the call succeeds or fails
            });
        });

        $(document).on("rexlive:saveModel", function (e) {
            if (!Rexbuilder_Util.$rexContainer.hasClass("editing-model")) {
                return;
            }
            var ajaxCalls = [];
            Rexbuilder_Util_Editor.savingModel = true;
            var $section = Rexbuilder_Util.$rexContainer.find(".rex-model-section .update-model-button.unlocked").eq(0).parents(".rexpansive_section");
            var activeLayout = Rexbuilder_Util.activeLayout;
            var i;
            var modelID = typeof $section.attr("data-rexlive-model-id") != "undefined" ? $section.attr("data-rexlive-model-id") : "";
            var modelName = typeof $section.attr("data-rexlive-model-name") != "undefined" ? $section.attr("data-rexlive-model-name") : "";
            var modelEditedNumber = typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";

            var oldModels = Rexbuilder_Util.getModelsCustomizations();
            var modelActive = {};
            for (i = 0; i < oldModels.length; i++) {
                var model = oldModels[i];
                if (model.id == modelID) {
                    modelActive = model;
                }
            }
            if (jQuery.isEmptyObject(modelActive)) {
                modelActive.id = modelID;
                modelActive.name = modelName;
                modelActive.customizations = [];
            }
            var modelCustomLayoutData = updateModel(modelActive, $section, activeLayout);

            Rexbuilder_Util.updateModelsCustomizationsData(modelCustomLayoutData);

            //updaiting names of avaiable layouts
            //ajax call for saving layouts type and names

            var modelSavingCustomizationNames = [];
            for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
                modelSavingCustomizationNames.push(modelCustomLayoutData.customizations[i].name);
            }
            var savingModelNamesData = {
                modelID: modelID,
                names: modelSavingCustomizationNames
            };
            Rexbuilder_Util.updateDivModelCustomizationsNames(savingModelNamesData);
            ajaxCalls.push(
                //aggiornamento nomi layout
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: _plugin_frontend_settings.rexajax.ajaxurl,
                    data: {
                        action: 'rexlive_save_avaiable_model_layouts_names',
                        nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                        post_id_to_update: modelID,
                        names: modelSavingCustomizationNames
                    },
                    success: function (response) {
                        if (response.success) {
                            console.log('nomi layout modello aggiornati!');
                        }
                    },
                    error: function (response) {
                    }
                })
            );

            if (activeLayout != "default") {
                for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
                    // have to update others model with same ID
                    if (modelCustomLayoutData.customizations[i].name == activeLayout) {
                        Rexbuilder_Util.updateModelsLive(modelID, createTargets($section, "default"), modelEditedNumber);
                        ajaxCalls.push(
                            $.ajax({
                                type: 'POST',
                                dataType: 'json',
                                url: _plugin_frontend_settings.rexajax.ajaxurl,
                                data: {
                                    action: 'rexlive_save_customization_model',
                                    nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                                    model_id_to_update: modelCustomLayoutData.id,
                                    model_name: modelCustomLayoutData.customizations.name,
                                    targets: JSON.stringify(modelCustomLayoutData.customizations[i].targets),
                                    layout_name: modelCustomLayoutData.customizations[i].name
                                },
                                success: function (response) {
                                    if (response.success) {
                                        console.log('layout custom modello aggiornato!');
                                    }
                                },
                                error: function (response) {
                                }
                            })
                        );
                        break;
                    }
                }
            } else {
                var shortcode = createSectionProperties($section, "shortcode");

                var modelDataSaveShortcode = {
                    model_id: modelID,
                    post_title: modelName,
                    post_content: shortcode,
                };

                var dataModel = {
                    modelName: modelName,
                    model_number: $section.attr("data-rexlive-model-number"),
                    html: "",
                    modelID: modelID,
                }
                ajaxCalls.push(
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: _plugin_frontend_settings.rexajax.ajaxurl,
                        data: {
                            action: 'rexlive_edit_model_shortcode_builder',
                            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                            model_data: modelDataSaveShortcode
                        },
                        success: function (response) {
                            if (response.success) {
                                console.log("shortcode modello aggiornato!");
                                dataModel.html = response.data.model_html;
                                Rexbuilder_Section.updateModelsHtmlLive(dataModel);
                            }
                        },
                        error: function (response) {
                        },
                        complete: function (response) {
                        }
                    })
                );

                for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
                    // have to update only active layout
                    // if active is default, update all with new blocks
                    ajaxCalls.push(
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: _plugin_frontend_settings.rexajax.ajaxurl,
                            data: {
                                action: 'rexlive_save_customization_model',
                                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                                model_id_to_update: modelCustomLayoutData.id,
                                model_name: modelCustomLayoutData.customizations.name,
                                targets: JSON.stringify(modelCustomLayoutData.customizations[i].targets),
                                layout_name: modelCustomLayoutData.customizations[i].name
                            },
                            success: function (response) {
                                if (response.success) {
                                    console.log('layout ' + response.data.layoutName + ' aggiornato!');
                                }
                            },
                            error: function (response) {
                            }
                        })
                    );
                }
            }

            // Can't pass a literal array, so use apply.
            $.when.apply($, ajaxCalls).then(function () {
                // Do your success stuff
                var $button = Rexbuilder_Util.$rexContainer.find(".rex-model-section .update-model-button.unlocked").eq(0);
                Rexbuilder_Dom_Util.updateLockEditModel($button, true);
                Rexbuilder_Util.$rexContainer.removeClass("editing-model");
                Rexbuilder_Util_Editor.savingModel = false;
                var data = {
                    eventName: "rexlive:savePageEnded",
                    dataSaved: "model",
                    buttonData: typeof e.settings != "undefined" ? e.settings.data_to_send.buttonData : ""
                }
                Rexbuilder_Util_Editor.sendParentIframeMessage(data);
                console.log("salvataggio modello finito!");
            }).fail(function () {
                // Probably want to catch failure
            }).always(function () {
                // Or use always if you want to do the same thing
                // whether the call succeeds or fails
            });
        });
    })

    var createCustomization = function (layoutName) {
        var data =
        {
            name: layoutName,
            sections: []
        }
        data.sections = createSectionsCustomizations(layoutName);
        return data;
    }

    var createSectionsCustomizations = function (layoutName) {
        var output = [];
        Rexbuilder_Util.$rexContainer.children('.rexpansive_section:not(.removing_section)').each(function (i, sec) {
            var $section = $(sec);
            var sectionRexID = $section.attr("data-rexlive-section-id");

            var section_props = {
                section_rex_id: sectionRexID,
                targets: [],
                section_is_model: false,
                section_model_id: "",
                section_model_number: -1,
                section_hide: false,
                section_created_live: false
            }

            section_props.section_hide = $section.hasClass("rex-hide-section");

            if (!$section.hasClass("rex-model-section")) {
                section_props.targets = createTargets($section, layoutName);
            } else {
                section_props.section_is_model = true;
                section_props.section_model_id = $section.attr("data-rexlive-model-id");
                section_props.section_model_number = $section.attr("data-rexlive-model-number");
            }

            output.push(section_props);
        });
        return output;
    }

    var updateModel = function (model, $section, activeLayout, targets) {
        var customizations = [];
        var i, j, k;
        var flagBlock;
        //finding others customizations
        for (i = 0; i < model.customizations.length; i++) {
            if (model.customizations[i].name != activeLayout) {
                var customization = model.customizations[i];
                customizations.push(customization);
            }
        }

        targets = typeof targets !== "undefined" ? targets : createTargets($section, activeLayout);
        var newCustomization = {
            name: activeLayout,
            targets: targets
        };

        //if active layout is default, have to update custom layouts with new blocks
        if (activeLayout == "default") {
            for (i = 0; i < customizations.length; i++) {
                if (typeof customizations[i].targets == "undefined" || customizations[i].targets == null || customizations[i].targets.length == 0) {
                    customizations[i].targets = [];
                    customizations[i].targets.push({
                        name: "self",
                        props: {}
                    });
                }

                for (j = 1; j < newCustomization.targets.length; j++) {
                    flagBlock = false;
                    for (k = 1; k < customizations[i].targets.length; k++) {
                        if (newCustomization.targets[j].name == customizations[i].targets[k].name) {
                            flagBlock = true;
                            break;
                        }
                    }
                    if (!flagBlock) {
                        var emptyTarget = {
                            name: newCustomization.targets[j].name,
                            props: {}
                        }
                        customizations[i].targets.splice(1, 0, emptyTarget);
                    }
                }
            }
        }

        customizations.push(newCustomization);

        model.customizations = customizations;

        return model;
    }

    /*
    data-rexlive-section-edited="true"
    */
    var checkEditsSection = function ($section) {
        return $section.attr("data-rexlive-section-edited") == "true";
    }

    /*
    data-rexlive-layout-changed="true"
    */
    var checkEditsLayoutGrid = function ($gallery) {
        return $gallery.attr("data-rexlive-layout-changed") == "true";
    }

    /*
    data-rexlive-element-edited="true"
    */
    var checkEditsElement = function ($elem) {
        return $elem.attr("data-rexlive-element-edited") == "true";
    }

    var createTargets = function ($section, layoutName) {
        var targets = [];

        var section_props = {
            name: "self",
            props: {}
        }

        var $gridGallery = $section.find('.grid-stack-row');
        var saveBlockDisposition = checkEditsLayoutGrid($gridGallery);
        if ($section.attr("data-rex-collapse-grid") == "true") {
            saveBlockDisposition = true;
            section_props.props.collapse_grid = true;
        }

        if (layoutName == "default" || checkEditsSection($section)) {
            section_props.props = createSectionProperties($section, "customLayout", null);
        }

        if (saveBlockDisposition) {
            section_props.props.gridEdited = true;
            section_props.props.full_height = $gridGallery.attr("data-full-height");
            section_props.props.layout = $gridGallery.attr("data-layout");
        } else {
            section_props.props.gridEdited = false;
        }

        targets.push(section_props);

        var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;
        var elementsOrdered = galleryIstance.getElementsTopBottom();

        galleryIstance.updateAllElementsProperties();
        $(elementsOrdered).each(function (i, el) {
            var $elem = $(el);
            if (!$elem.hasClass("removing_block")) {
                var blockRexID = $elem.attr("data-rexbuilder-block-id");
                var block_props = {
                    name: blockRexID,
                    props: {}
                }
                
                if (layoutName == "default" || saveBlockDisposition || checkEditsElement($elem)) {
                    block_props.props = createBlockProperties($elem, "customLayout", $gridGallery);
                }
                if (layoutName != "default" && saveBlockDisposition && !checkEditsElement($elem)) {
                    clearPropsElem(block_props.props);
                }
                targets.push(block_props);
            }
        });
        return targets;
    }

    var clearPropsElem = function (props) {
        for (var propName in props) {
            switch (propName) {
                case "rex_id":
                case "size_x":
                case "size_y":
                case "row":
                case "col":
                case "gs_start_h":
                case "gs_width":
                case "gs_height":
                case "gs_y":
                case "gs_x":
                case "block_dimensions_live_edited":
                    break;
                case "element_edited":
                    props["element_edited"] = false;
                    break;
                default:
                    props[propName] = undefined;
                    break;
            }
        }
    }

    var createCleanPost = function () {
        var post = "";
        console.log("creating clean post");
        Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
            $(this).children(".grid-stack-item").each(function () {
                var $textWrap = $(this).find(".text-wrap");
                if ($textWrap.hasClass("medium-editor-element")) {
                    var $textWrapNoEditor = $textWrap.clone(false);
                    $textWrapNoEditor.children(".medium-insert-buttons").remove();
                    $textWrapNoEditor.children(".text-editor-span-fix").remove();
                    if ($textWrapNoEditor.text().trim().length != 0) {
                        post += $textWrapNoEditor.html();
                        post += "<br>";
                    }
                } else {
                    if ($textWrap.text().trim().length != 0) {
                        post += $textWrap.html();
                        post += "<br>";
                    }
                }
            });
        });
        return post;
    }

    var createBlockProperties = function ($elem, mode, $gridGallery) {
        var id = "",
            rex_id = "",
            type = "text",
            size_x = 1,
            size_y = 1,
            row = '',
            col = '',
            gs_start_h = 1,
            gs_width = 1,
            gs_height = 1,
            gs_y = '',
            gs_x = '',
            color_bg_block = "#ffffff",
            color_bg_block_active = "#ffffff",
            image_bg_block = "",
            image_width = 0,
            image_height = 0,
            id_image_bg_block = "",
            type_bg_block = "",
            image_size = 'full',
            photoswipe = '',
            image_bg_elem_active = true,
            video_mp4_url = "",
            video_bg_id = "",
            video_bg_url = "",
            video_bg_url_vimeo = "",
            linkurl = '',
            block_custom_class = '',
            block_padding = '',
            overlay_block_color = '',
            overlay_block_color_active = false,
            zak_background = "",
            zak_side = "",
            zak_title = "",
            zak_icon = "",
            zak_foreground = "",
            block_animation = "fadeInUpBig",
            video_has_audio = '0',
            block_has_scrollbar = "false",
            block_dimensions_live_edited = "",
            block_flex_position = "",
            block_flex_img_position = "",
            slider_dimension_ratio = 1,
            hide_block = false;

        var content = "";
        var $textWrap;
        var $itemContent = $elem.find('.grid-item-content');
        var $itemData = $elem.children(".rexbuilder-block-data");

        id = $elem.attr('id') === undefined ? "" : $elem.attr('id');
        rex_id = $elem.attr('data-rexbuilder-block-id');
        // type = $itemData.attr('data-type') == "" ? "empty" : $itemData.attr('data-type');
        type = $itemData.attr('data-type') == "" ? "text" : $itemData.attr('data-type');
        size_x = $elem.attr('data-width');
        size_y = $elem.attr('data-height');
        row = $elem.attr('data-row');
        col = $elem.attr('data-col');
        gs_start_h = $elem.attr('data-gs-height');
        gs_width = $elem.attr('data-gs-width');
        gs_height = $elem.attr('data-gs-height');
        gs_y = $elem.attr('data-gs-y');
        gs_x = $elem.attr('data-gs-x');

        color_bg_block = typeof $itemData.attr("data-color_bg_block") == "undefined" ? "" : $itemData.attr("data-color_bg_block");
        color_bg_block_active = typeof $itemData.attr("data-color_bg_elem_active") != "undefined" ? $itemData.attr("data-color_bg_elem_active") : true;

        id_image_bg_block = $itemData.attr('data-id_image_bg_block') === undefined ? "" : $itemData.attr('data-id_image_bg_block');
        image_bg_block = $itemData.attr('data-image_bg_block') === undefined ? "" : $itemData.attr('data-image_bg_block');
        image_width = $itemContent.attr('data-background_image_width') === undefined ? "" : (isNaN(parseInt($itemContent.attr('data-background_image_width'))) ? "" : parseInt($itemContent.attr('data-background_image_width')));
        image_height = $itemContent.attr('data-background_image_height') === undefined ? "" : (isNaN(parseInt($itemContent.attr('data-background_image_height'))) ? "" : parseInt($itemContent.attr('data-background_image_height')));
        var defaultTypeImage = $elem.parents(".grid-stack-row").attr("data-layout") == "fixed" ? "full" : "natural";
        type_bg_block = typeof $itemData.attr('data-type_bg_block') == "undefined" ? defaultTypeImage : $itemData.attr('data-type_bg_block');
        image_size = typeof $itemData.attr('data-image_size') == "undefined" ? "full" : $itemData.attr('data-image_size');
        photoswipe = $itemData.attr('data-photoswipe') === undefined ? "" : $itemData.attr('data-photoswipe');
        image_bg_elem_active = typeof $itemData.attr("data-image_bg_elem_active") != "undefined" ? $itemData.attr("data-image_bg_elem_active") : true;

        video_bg_id = $itemData.attr('data-video_bg_id') === undefined ? ""
            : $itemData.attr('data-video_bg_id');
        video_mp4_url = $itemData.attr('data-video_mp4_url') === undefined ? ""
            : $itemData.attr('data-video_mp4_url');
        video_bg_url = $itemData.attr('data-video_bg_url') === undefined ? ""
            : $itemData.attr('data-video_bg_url');
        video_bg_url_vimeo = $itemData.attr('data-video_bg_url_vimeo') === undefined ? ""
            : $itemData.attr('data-video_bg_url_vimeo');
        video_has_audio = $itemData.attr('data-video_has_audio') === undefined ? false
            : $itemData.attr('data-video_has_audio');

        linkurl = $itemData.attr('data-linkurl') === undefined ? ""
            : $itemData.attr('data-linkurl');

        block_custom_class = $itemData.attr('data-block_custom_class') === undefined ? ""
            : $itemData.attr('data-block_custom_class');

        block_padding = $itemData.attr('data-block_padding') === undefined ? ""
            : $itemData.attr('data-block_padding');

        overlay_block_color = typeof $itemData.attr("data-overlay_block_color") == "undefined" ? "" : $itemData.attr('data-overlay_block_color');
        overlay_block_color_active = typeof $itemData.attr("data-overlay_block_color_active") != "undefined" ? $itemData.attr("data-overlay_block_color_active") : false;

        zak_background = $itemData.attr('data-zak_background') === undefined ? ""
            : $itemData.attr('data-zak_background');
        zak_side = $itemData.attr('data-zak_side') === undefined ? ""
            : $itemData.attr('data-zak_side');
        zak_title = $itemData.attr('data-zak_title') === undefined ? ""
            : $itemData.attr('data-zak_title');
        zak_icon = $itemData.attr('data-zak_icon') === undefined ? ""
            : $itemData.attr('data-zak_icon');
        zak_foreground = $itemData.attr('data-zak_foreground') === undefined ? ""
            : $itemData.attr('data-zak_foreground');
        block_animation = $itemData.attr('data-block_animation') === undefined ? "fadeInUpBig"
            : $itemData.attr('data-block_animation');

        block_has_scrollbar = $itemData.attr('data-block_has_scrollbar') === undefined ? "false"
            : $itemData.attr('data-block_has_scrollbar');

        if ($gridGallery.attr("data-layout") == "masonry") {
            block_dimensions_live_edited = typeof $itemData.attr('data-block_dimensions_live_edited') === "undefined" ? "" : $itemData.attr('data-block_dimensions_live_edited');
        } else {
            block_dimensions_live_edited = "";
        }

        block_flex_position = typeof $itemData.attr('data-block_flex_position') == "undefined" ? "" : $itemData.attr('data-block_flex_position');

        block_flex_img_position = typeof $itemData.attr('data-block_flex_img_position') == "undefined" ? "" : $itemData.attr('data-block_flex_img_position');

        if ($elem.hasClass("block-has-slider")) {
            $itemData.attr('data-slider_ratio', ($elem.outerHeight() / $elem.outerWidth()).toFixed(3))
        } else {
            $itemData.attr('data-slider_ratio', "");
        }

        slider_dimension_ratio = typeof $itemData.attr('data-slider_ratio') == "undefined" ? "" : $itemData.attr('data-slider_ratio');

        hide_block = $elem.hasClass("rex-hide-element");

        if (mode == "shortcode") {
            $textWrap = $itemContent.find('.text-wrap');
            if (!$elem.hasClass('block-has-slider')) {
                var $savingBlock = $textWrap.clone(false);
                $savingBlock.find('.medium-insert-buttons').remove();
                $savingBlock.find('.text-editor-span-fix').remove();
                $savingBlock.find(".ui-sortable").removeClass("ui-sortable");
                $savingBlock.find(".ui-sortable-handle").removeClass("ui-sortable-handle");
                $savingBlock.find("figure").removeAttr("style");
                $savingBlock.find("figure").removeAttr("class");
                
                if ($savingBlock.text().trim() == "") {
                    content = "";
                } else {
                    content = $savingBlock.html();
                }
                // console.log(content);
            } else {
                var $sliderToSave = $textWrap.children(".rex-slider-wrap[data-rex-slider-active=\"true\"]");

                var sliderID = parseInt($sliderToSave.attr("data-slider-id"));
                var sliderData = Rexbuilder_Util_Editor.createSliderData($sliderToSave);
                if (!Rexbuilder_Util_Editor.openingModel) {
                    Rexbuilder_Util_Editor.saveSliderOnDB(sliderData, false);
                }

                content = '[RexSlider slider_id="' + sliderID + '"]';
            }

            console.log('passo da qua?');

            var output = '[RexpansiveBlock'
                + ' id="' + id
                + '" rexbuilder_block_id="' + rex_id
                + '" type="' + type
                + '" size_x="' + size_x
                + '" size_y="' + size_y
                + '" row="' + row
                + '" col="' + col
                + '" gs_start_h="' + gs_start_h
                + '" gs_width="' + gs_width
                + '" gs_height="' + gs_height
                + '" gs_y="' + gs_y
                + '" gs_x="' + gs_x
                + '" color_bg_block="' + color_bg_block
                + '" color_bg_block_active="' + color_bg_block_active
                + '" image_bg_block="' + image_bg_block
                + '" id_image_bg_block="' + id_image_bg_block
                + '" image_bg_elem_active="' + image_bg_elem_active
                + '" video_bg_id="' + video_bg_id
                + '" video_mp4_url="' + video_mp4_url
                + '" video_bg_url="' + video_bg_url
                + '" video_bg_url_vimeo="' + video_bg_url_vimeo
                + '" type_bg_block="' + type_bg_block
                + '" image_size="' + image_size
                + '" photoswipe="' + photoswipe
                + '" linkurl="' + linkurl
                + '" block_custom_class="' + block_custom_class
                + '" block_padding="' + block_padding
                + '" overlay_block_color="' + overlay_block_color
                + '" overlay_block_color_active="' + overlay_block_color_active
                + '" zak_background="' + zak_background
                + '" zak_side="' + zak_side
                + '" zak_title="' + zak_title
                + '" zak_icon="' + zak_icon
                + '" zak_foreground="' + zak_foreground
                + '" block_animation="' + block_animation
                + '" video_has_audio="' + (video_has_audio.toString() == "true" ? "1" : "0")
                + '" block_has_scrollbar="' + block_has_scrollbar
                + '" block_dimensions_live_edited="' + block_dimensions_live_edited
                + '" block_flex_position="' + block_flex_position
                + '" block_flex_img_position="' + block_flex_img_position
                + '"]'
                + content
                + '[/RexpansiveBlock]';
            return output;
        } else if (mode == "customLayout") {

            var props = {};
            
            props["hide"] = hide_block;
            if (Rexbuilder_Util.activeLayout == "default") {
                props["element_edited"] = false;
            } else {
                props["element_edited"] = true;
            }
            props["rexbuilder_block_id"] = rex_id;
            props["type"] = type;
            props["size_x"] = size_x;
            props["size_y"] = size_y;
            props["row"] = row;
            props["col"] = col;
            props["gs_start_h"] = gs_start_h;
            props["gs_width"] = gs_width;
            props["gs_height"] = gs_height;
            props["gs_y"] = gs_y;
            props["gs_x"] = gs_x;
            props["color_bg_block"] = color_bg_block;
            props["color_bg_block_active"] = color_bg_block_active;
            props["image_bg_url"] = image_bg_block;
            props["image_width"] = image_width;
            props["image_height"] = image_height;
            props["id_image_bg"] = id_image_bg_block;
            props["video_bg_id"] = video_bg_id;
            props["video_mp4_url"] = video_mp4_url;
            props["video_bg_url_youtube"] = video_bg_url;
            props["video_bg_url_vimeo"] = video_bg_url_vimeo;
            props["type_bg_image"] = type_bg_block;
            props["image_size"] = image_size;
            props["photoswipe"] = photoswipe;
            props["image_bg_elem_active"] = image_bg_elem_active;
            props["block_custom_class"] = block_custom_class;
            props["block_padding"] = block_padding;
            props["overlay_block_color"] = overlay_block_color;
            props["overlay_block_color_active"] = overlay_block_color_active;
            props["linkurl"] = linkurl;
            props["zak_background"] = zak_background;
            props["zak_side"] = zak_side;
            props["zak_title"] = zak_title;
            props["zak_icon"] = zak_icon;
            props["zak_foreground"] = zak_foreground;
            props["block_animation"] = block_animation;
            props["video_has_audio"] = video_has_audio;
            props["block_has_scrollbar"] = block_has_scrollbar;
            props["block_dimensions_live_edited"] = block_dimensions_live_edited;
            props["block_flex_position"] = block_flex_position;
            props["block_flex_img_position"] = block_flex_img_position;
            props["slider_dimension_ratio"] = slider_dimension_ratio;
            return props;
        }
    };

    var createSectionProperties = function ($section, mode, newID) {
        var section_name = "",
            type = "perfect-grid",
            color_bg_section = "#ffffff",
            color_bg_section_active = "true",
            dimension = "full",
            margin = "",
            image_bg_section = "",
            image_width = 0,
            image_height = 0,
            id_image_bg_section = "",
            image_bg_section_active = "",
            video_bg_url_section = '',
            video_bg_id_section = '',
            video_mp4_url = '',
            video_bg_url_vimeo_section = '',
            full_height = '',
            block_distance = 20,
            layout = "fixed",
            responsive_background = '',
            custom_classes = '',
            section_width = '',
            row_separator_top = '',
            row_separator_bottom = '',
            row_separator_right = '',
            row_separator_left = '',
            row_margin_top = '',
            row_margin_bottom = '',
            row_margin_right = '',
            row_margin_left = '',
            row_active_photoswipe = '',
            row_overlay_color = '',
            row_overlay_active = '',
            rexlive_section_id = '',
            collapse_grid = false,
            rexlive_model_id = '',
            rexlive_model_name = '',
            grid_cell_width = 1;

        var output = '';
        var $gridGallery = $section.find('.grid-stack-row');
        var $sectionData = $section.children('.section-data');

        var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;

        section_name = $section.attr('data-rexlive-section-name');

        type = $sectionData.attr('data-type') === undefined ? "perfect-grid"
            : $sectionData.attr('data-type');

        color_bg_section = typeof $sectionData.attr("data-color_bg_section") == "undefined" ? "" : $sectionData.attr("data-color_bg_section");
        color_bg_section_active = typeof $sectionData.attr("data-color_bg_section_active") == "undefined" ? true : $sectionData.attr("data-color_bg_section_active");

        margin = $sectionData.attr('data-margin') === undefined ? ""
            : $sectionData.attr('data-margin');

        image_bg_section = $sectionData.attr('data-image_bg_section') === undefined ? ""
            : $sectionData.attr('data-image_bg_section');
        image_width = $section.attr('data-background_image_width') === undefined ? ""
            : (isNaN(parseInt($section.attr('data-background_image_width'))) ? "" : parseInt($section.attr('data-background_image_width')));
        image_height = $section.attr('data-background_image_height') === undefined ? ""
            : (isNaN(parseInt($section.attr('data-background_image_height'))) ? "" : parseInt($section.attr('data-background_image_height')));
        id_image_bg_section = $sectionData.attr('data-id_image_bg_section') === undefined ? ""
            : $sectionData.attr('data-id_image_bg_section');
        image_bg_section_active = typeof $sectionData.attr("data-image_bg_section_active") == "undefined" ? true : $sectionData.attr("data-image_bg_section_active");

        video_mp4_url = $sectionData.attr('data-video_mp4_url') === undefined ? ""
            : $sectionData.attr('data-video_mp4_url');
        video_bg_url_section = $sectionData.attr('data-video_bg_url_section') === undefined ? ""
            : $sectionData.attr('data-video_bg_url_section');
        video_bg_id_section = $sectionData.attr('data-video_bg_id_section') === undefined ? ""
            : $sectionData.attr('data-video_bg_id_section');
        video_bg_url_vimeo_section = $sectionData.attr('data-video_bg_url_vimeo_section') === undefined ? ""
            : $sectionData.attr('data-video_bg_url_vimeo_section');

        full_height = $gridGallery.attr('data-full-height') === undefined ? ""
            : $gridGallery.attr('data-full-height');
        layout = $gridGallery.attr('data-layout') === undefined ? ""
            : $gridGallery.attr('data-layout');
        custom_classes = $sectionData.attr('data-custom_classes') === undefined ? ""
            : $sectionData.attr('data-custom_classes');

        section_width = $gridGallery.parent().css("max-width");
        dimension = section_width === "100%" || section_width == "none" ? "full" : "boxed";

        var grid_gutter = parseInt($gridGallery.attr('data-separator'));
        var grid_separator_top = parseInt($gridGallery.attr('data-row-separator-top'));
        var grid_separator_right = parseInt($gridGallery.attr('data-row-separator-right'));
        var grid_separator_bottom = parseInt($gridGallery.attr('data-row-separator-bottom'));
        var grid_separator_left = parseInt($gridGallery.attr('data-row-separator-left'));

        var row_distances = {
            gutter: isNaN(grid_gutter) ? "" : grid_gutter,
            top: isNaN(grid_separator_top) ? "" : grid_separator_top,
            right: isNaN(grid_separator_right) ? "" : grid_separator_right,
            bottom: isNaN(grid_separator_bottom) ? "" : grid_separator_bottom,
            left: isNaN(grid_separator_left) ? "" : grid_separator_left,
        }

        block_distance = row_distances.gutter;
        row_separator_top = row_distances.top;
        row_separator_right = row_distances.right;
        row_separator_bottom = row_distances.bottom;
        row_separator_left = row_distances.left;

        var section_margin_top = parseInt($section.css("margin-top").split("px")[0]);
        var section_margin_right = parseInt($section.css("margin-right").split("px")[0]);
        var section_margin_bottom = parseInt($section.css("margin-bottom").split("px")[0]);
        var section_margin_left = parseInt($section.css("margin-left").split("px")[0]);

        var rowMargins = {
            top: isNaN(section_margin_top) ? "" : section_margin_top,
            right: isNaN(section_margin_right) ? "" : section_margin_right,
            bottom: isNaN(section_margin_bottom) ? "" : section_margin_bottom,
            left: isNaN(section_margin_left) ? "" : section_margin_left,
        }

        row_margin_top = rowMargins.top;
        row_margin_right = rowMargins.right;
        row_margin_bottom = rowMargins.bottom;
        row_margin_left = rowMargins.left;

        row_active_photoswipe = typeof $sectionData.attr('data-row_active_photoswipe') == "undefined" ? "0"
            : $sectionData.attr('data-row_active_photoswipe');

        responsive_background = $sectionData.attr('data-responsive_background') === undefined ? "" : $sectionData.attr('data-responsive_background');
        row_overlay_color = typeof $sectionData.attr("data-row_overlay_color") == "undefined" ? "" : $sectionData.attr("data-row_overlay_color");
        if(row_overlay_color == ""){
            row_overlay_color = responsive_background;
        }
        row_overlay_active = typeof $sectionData.attr("data-row_overlay_active") == "undefined" ? false : $sectionData.attr("data-row_overlay_active");

        if (typeof newID == "undefined" || newID === null) {
            rexlive_section_id = typeof $section.attr("data-rexlive-section-id") == "undefined" ? "" : $section.attr("data-rexlive-section-id");
        } else {
            rexlive_section_id = newID;
        }

        collapse_grid = typeof $section.attr("data-rex-collapse-grid") == "undefined" ? false : $section.attr("data-rex-collapse-grid").toString() == "true";

        rexlive_model_id = typeof $section.attr("data-rexlive-model-id") == "undefined" ? "" : $section.attr("data-rexlive-model-id");
        rexlive_model_name = typeof $section.attr("data-rexlive-model-name") == "undefined" ? "" : $section.attr("data-rexlive-model-name");
        grid_cell_width = Rexbuilder_Util.getGalleryInstance($section).properties.singleWidth;

        if (mode == "shortcode") {
            output = '[RexpansiveSection'
                + ' section_name="' + section_name
                + '" type="' + type
                + '" color_bg_section="' + color_bg_section
                + '" color_bg_section_active="' + color_bg_section_active
                + '" dimension="' + dimension
                + '" image_bg_section_active="' + image_bg_section_active
                + '" image_bg_section="' + image_bg_section
                + '" id_image_bg_section="' + id_image_bg_section
                + '" video_bg_url_section="' + video_bg_url_section
                + '" video_bg_id_section="' + video_bg_id_section
                + '" video_bg_url_vimeo_section="' + video_bg_url_vimeo_section
                + '" full_height="' + full_height
                + '" block_distance="' + block_distance
                + '" layout="' + layout
                + '" responsive_background="' + responsive_background
                + '" custom_classes="' + custom_classes
                + '" section_width="' + section_width
                + '" row_separator_top="' + row_separator_top
                + '" row_separator_bottom="' + row_separator_bottom
                + '" row_separator_right="' + row_separator_right
                + '" row_separator_left="' + row_separator_left
                + '" margin="' + margin
                + '" row_margin_top="' + row_margin_top
                + '" row_margin_bottom="' + row_margin_bottom
                + '" row_margin_right="' + row_margin_right
                + '" row_margin_left="' + row_margin_left
                + '" row_active_photoswipe="' + row_active_photoswipe
                + '" row_overlay_color="' + row_overlay_color
                + '" row_overlay_active="' + row_overlay_active
                + '" rexlive_section_id="' + rexlive_section_id
                + '" rexlive_model_id="' + rexlive_model_id
                + '" rexlive_model_name="' + rexlive_model_name
                + '" row_edited_live="true"]';

            galleryIstance.updateAllElementsProperties();

            var elementsOrdered = galleryIstance.getElementsTopBottom();

            $(elementsOrdered).each(function () {
                var $elem = $(this);
                if (!$elem.hasClass("removing_block")) {
                    output += createBlockProperties($elem, "shortcode", $gridGallery);
                }
            });

            output += fillGridEmptySpaces(galleryIstance);

            output += '[/RexpansiveSection]';
            return output;

        } else if (mode == "customLayout") {

            var props = {};

            props["collapse_grid"] = collapse_grid;
            props["grid_cell_width"] = grid_cell_width;
            props["section_name"] = section_name;
            props["type"] = type;
            props["color_bg_section"] = color_bg_section;
            props["color_bg_section_active"] = color_bg_section_active;
            props["dimension"] = dimension;
            props["margin"] = margin;
            props["image_bg_section_active"] = image_bg_section_active;
            props["image_bg_section"] = image_bg_section;
            props["image_width"] = image_width;
            props["image_height"] = image_height;
            props["id_image_bg_section"] = id_image_bg_section;
            props["video_bg_id"] = video_bg_id_section;
            props["video_mp4_url"] = video_mp4_url;
            props["video_bg_url_section"] = video_bg_url_section;
            props["video_bg_url_vimeo_section"] = video_bg_url_vimeo_section;
            props["full_height"] = full_height;
            props["block_distance"] = block_distance;
            props["layout"] = layout;
            props["custom_classes"] = custom_classes;
            props["section_width"] = section_width;
            props["row_separator_top"] = row_separator_top;
            props["row_separator_bottom"] = row_separator_bottom;
            props["row_separator_right"] = row_separator_right;
            props["row_separator_left"] = row_separator_left;
            props["row_margin_top"] = row_margin_top;
            props["row_margin_bottom"] = row_margin_bottom;
            props["row_margin_right"] = row_margin_right;
            props["row_margin_left"] = row_margin_left;
            props["row_overlay_color"] = row_overlay_color;
            props["row_overlay_active"] = row_overlay_active;
            props["rexlive_model_id"] = rexlive_model_id;
            props["rexlive_model_name"] = rexlive_model_name;
            props["section_edited"] = true;
            return props;
        }
    }

    var fillGridEmptySpaces = function (galleryIstance) {

        var output = "";
        var i;
        var id = galleryIstance.getLastID();
        var rowNumber = galleryIstance.getRowNumber();
        var emptyBlocks = galleryIstance.fillEmptySpaces();

        for (i = 0; i < emptyBlocks.length; i++) {
            id = id + 1;
            output += createEmptyBlockBackendFixShortcode(rowNumber, id, emptyBlocks[i]);
        }

        return output;
    }

    var createEmptyBlockBackendFixShortcode = function (rowNumber, id, blockObj) {
        var output = "[RexpansiveBlock"
            + ' id="block_' + rowNumber + "_" + id
            + '" type="empty"'
            + ' col="' + (blockObj.x + 1)
            + '" row="' + (blockObj.y + 1)
            + '" size_x="' + blockObj.w
            + '" size_y="' + blockObj.h
            + '" color_bg_block=""'
            + ' image_bg_block=""'
            + ' id_image_bg_block=""'
            + ' type_bg_block=""'
            + ' photoswipe=""'
            + ' linkurl=""'
            + ' empty_block_backend_fix="' + true
            + '"][/RexpansiveBlock]';
        return output;
    }

    var _countModels = function (sections) {
        var models = [];
        var i, j;

        for (i = 0; i < sections.length; i++) {
            if (sections[i].section_is_model.toString() == "true") {
                var modelID = sections[i].section_model_id;
                for (j = 0; j < models.length; j++) {
                    if (models[j].id == modelID) {
                        models[j].number = models[j].number + 1;
                        break;
                    }
                }
                if (j == models.length) {
                    var model = {
                        id: modelID,
                        number: 1,
                    }
                    models.push(model);
                }
            }
        }

        return models;
    }

    return {
        createSectionProperties: createSectionProperties,
        createTargets: createTargets,
        updateModel: updateModel,
    }
})(jQuery);