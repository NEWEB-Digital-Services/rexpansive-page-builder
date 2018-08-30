var Rex_Save_Listeners = (function ($) {
    'use strict';
    $(function () {

        $(document).on("rexlive:saveDefaultLayout", function () {

            Rexbuilder_Util_Editor.savingGrid = true;

            var idPost = parseInt($('#id-post').attr('data-post-id'));

            var postClean = "";
            //createCleanPost();
            //console.log(postClean);

            var shortcodePage = '';

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

            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: _plugin_frontend_settings.rexajax.ajaxurl,
                data: {
                    action: 'rexlive_save_default_layout',
                    nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                    post_id_to_update: idPost,
                    clean_post: postClean,
                    rex_shortcode: shortcodePage,
                },
                success: function (response) {
                    if (response.success) {
                        console.log('shortcode pagina aggiornato!');
                    }
                },
                error: function (response) {
                }
            });
            Rexbuilder_Util_Editor.savingGrid = false;
        });

        $(document).on('rexlive:saveCustomizations', function (e) {
            var $layoutData = Rexbuilder_Util.$rexContainer.parent().children("#rexbuilder-layout-data");

            var $layoutsCustomDiv = $layoutData.children(".layouts-customizations");
            var customCSS = $("#rexpansive-builder-style-inline-css").text();
            customCSS = customCSS.trim();
            saveCustomCSS(customCSS);

            var idPost = parseInt($('#id-post').attr('data-post-id'));
            var i, j, k, l;

            var activeLayoutName = Rexbuilder_Util.activeLayout;

            var oldCustomizations;

            if ($layoutsCustomDiv.attr("data-empty-customizations")) {
                oldCustomizations = [];
            } else {
                oldCustomizations = JSON.parse($layoutsCustomDiv.text());
            }

            var customizationsArray = [];
            $.each(oldCustomizations, function (i, oldCustom) {
                var oldLay = oldCustom;
                if (oldLay.name != activeLayoutName) {
                    customizationsArray.push(oldLay);
                }
            });

            Rexbuilder_Dom_Util.fixModelNumbersSaving();

            var newCustomization = createCustomization(activeLayoutName);
            console.log("customizationsArray", jQuery.extend(true, [], customizationsArray));
            var flagSection;
            if (activeLayoutName == "default") {
                for (i = 0; i < customizationsArray.length; i++) {
                    var modelsNumbers = _countModels(customizationsArray[i].sections);
                    for (j = 0; j < newCustomization.sections.length; j++) {
                        flagSection = false;
                        for (k = 0; k < customizationsArray[i].sections.length; k++) {
                            if (newCustomization.sections[j].section_rex_id == customizationsArray[i].sections[k].section_rex_id) {
                                if (customizationsArray[i].sections[k].section_is_model.toString() == "true") {
                                    for (l = 0; l < modelsNumbers.length; l++) {
                                        if (modelsNumbers[l].id == customizationsArray[i].sections[k].section_model_id) {
                                            if (parseInt(newCustomization.sections[j].section_model_number) <= modelsNumbers[l].number) {
                                                flagSection = true;
                                            }
                                        }
                                    }
                                } else {
                                    flagSection = true;
                                }
                            }
                        }
                        if (!flagSection) {
                            var sectionObj = {
                                section_rex_id: newCustomization.sections[j].section_rex_id,
                                targets: [],
                                section_is_model: newCustomization.sections[j].section_is_model.toString(),
                                section_model_id: newCustomization.sections[j].section_model_id,
                                section_model_number: newCustomization.sections[j].section_model_number
                            }
                            customizationsArray[i].sections.push(sectionObj);
                        }
                    }
                }
            }
            customizationsArray.push(newCustomization);
            console.log("customizationsArray", customizationsArray);
            $layoutsCustomDiv.text(JSON.stringify(customizationsArray));
            $layoutsCustomDiv.removeAttr("data-empty-customizations");

            //ajax call for saving layouts type and names
            var layoutsNames = [];
            $.each(customizationsArray, function (i, layout) {
                layoutsNames.push(layout.name);
            });
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
            });

            //saving layouts customizations
            $.each(customizationsArray, function (i, layout) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: _plugin_frontend_settings.rexajax.ajaxurl,
                    data: {
                        action: 'rexlive_save_customization_layout',
                        nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                        post_id_to_update: idPost,
                        sections: layout.sections,
                        layout_name: layout.name
                    },
                    success: function (response) {
                        if (response.success) {
                            console.log('layout custom aggiornato!');
                        }
                    },
                    error: function (response) {
                    }
                });

            });
        });

        $(document).on('rexlive:saveCustomizationsModel', function (e) {
            var data = e.settings;
            var $section = data.$section;
            var idModel = parseInt(data.modelID);
            var modelEditedNumber = data.model_number;
            var activeLayout = data.layoutName;
            var modelName = data.modelName;

            var $modelData = Rexbuilder_Util.$rexContainer.parent().children("#rexbuilder-model-data");

            var $modelCustomDiv = $modelData.children(".models-customizations");
            var $modelsAvaiableNamesDiv = $modelData.children(".available-models-customizations-names");

            var oldModels;

            if ($modelCustomDiv.attr("data-empty-models-customizations")) {
                oldModels = [];
            } else {
                oldModels = JSON.parse($modelCustomDiv.text());
            }

            var modelsCustomizations = [];
            var i;

            var modelActive = {};
            for (i = 0; i < oldModels.length; i++) {
                var model = oldModels[i];
                if (model.id != idModel) {
                    modelsCustomizations.push(model);
                } else {
                    modelActive = model;
                }
            }

            if (jQuery.isEmptyObject(modelActive)) {
                modelActive.id = idModel;
                modelActive.name = modelName;
                modelActive.customizations = [];
            }

            var modelCustomLayoutData = updateModel(modelActive, $section, activeLayout);
            modelsCustomizations.push(modelCustomLayoutData);
            
            $modelCustomDiv.text(JSON.stringify(modelsCustomizations));
            console.log("modelCustomLayoutData", modelCustomLayoutData);
            console.log(activeLayout);
            if(activeLayout != "default"){
                for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
                    // have to update others model with same ID
                    if (modelCustomLayoutData.customizations[i].name == activeLayout) {
                        Rexbuilder_Util.updateModelsLive(idModel, modelCustomLayoutData.customizations[i].targets, modelEditedNumber);
                    }
                }
            }

            $modelCustomDiv.removeAttr("data-empty-models-customizations");

            for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
                // have to update only active layout
                if (modelCustomLayoutData.customizations[i].name == activeLayout) {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: _plugin_frontend_settings.rexajax.ajaxurl,
                        data: {
                            action: 'rexlive_save_customization_model',
                            nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                            model_id_to_update: modelCustomLayoutData.id,
                            model_name: modelCustomLayoutData.name,
                            targets: modelCustomLayoutData.customizations[i].targets,
                            layout_name: activeLayout
                        },
                        success: function (response) {
                            if (response.success) {
                                console.log('layout custom modello aggiornato!');
                            }
                        },
                        error: function (response) {
                        }
                    });
                }
            }

            //updaiting names of avaiable layouts
            //ajax call for saving layouts type and names
            var modelSavingCustomizationNames = [];
            for (i = 0; i < modelCustomLayoutData.customizations.length; i++) {
                modelSavingCustomizationNames.push(modelCustomLayoutData.customizations[i].name);
            }

            var names = JSON.parse($modelsAvaiableNamesDiv.text());
            var newNamesData = [];
            for (i = 0; i < names.length; i++) {
                var namesData = names[i];
                if (namesData.modelID != idModel) {
                    newNamesData.push(namesData);
                }
            }
            var savingModelNamesData = {
                modelID: idModel,
                names: modelSavingCustomizationNames
            };
            newNamesData.push(savingModelNamesData);

            $modelsAvaiableNamesDiv.text(JSON.stringify(newNamesData));

            //aggiornamento nomi layout
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: _plugin_frontend_settings.rexajax.ajaxurl,
                data: {
                    action: 'rexlive_save_avaiable_model_layouts_names',
                    nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                    post_id_to_update: modelActive.id,
                    names: modelSavingCustomizationNames
                },
                success: function (response) {
                    if (response.success) {
                        console.log('nomi layout modello aggiornati!');
                    }
                },
                error: function (response) {
                }
            });


        });

        $(document).on('rexlive:updateModelShortCode', function (event) {
            var dataModel = event.settings.modelData;
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: _plugin_frontend_settings.rexajax.ajaxurl,
                data: {
                    action: 'rexlive_edit_model_shortcode_builder',
                    nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                    model_data: dataModel.ajaxCallData
                },
                success: function (response) {
                    if (response.success) {
                        console.log("shortcode modello aggiornato!");
                        dataModel.pageData.html = response.data.model_html;
                        Rexbuilder_Section.updateModelsHtmlLive(dataModel.pageData);
                    }
                },
                error: function (response) {
                },
                complete: function (response) {
                }
            });

        });
    })

    var saveCustomCSS = function (styleToSave) {
        var idPost = parseInt($('#id-post').attr('data-post-id'));
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
                action: 'rexlive_save_custom_css',
                nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
                post_id_to_update: idPost,
                custom_css: styleToSave
            },
            success: function (response) {
                if (response.success) {
                    console.log('custom css aggiornato!');
                }
            },
            error: function (response) {
            }
        });
    }

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
                section_model_number: -1
            }

            if (!$section.hasClass("rex-model-section")) {
                section_props.targets = createTargets($section, layoutName);
            } else {
                section_props.section_is_model = true;
                section_props.section_model_id = $section.attr("data-rexlive-model-id");
                section_props.section_model_number = $section.attr("data-rexlive-saved-model-number");
            }
            output.push(section_props);
        });
        return output;
    }

    var updateModel = function (model, $section, activeLayout) {
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
        var newCustomization = {
            name: activeLayout,
            targets: createTargets($section, activeLayout)
        };

        if(activeLayout == "default"){
            for(i=0; i<customizations.length; i++){
                for(j=0; j<newCustomization.targets.length; j++){
                    flagBlock = false;
                    for(k=0; k<customizations[i].targets.length; k++){
                        if(newCustomization.targets[j].name == customizations[i].targets[k].name){
                            flagBlock = true;
                        }
                    }
                    if(!flagBlock){
                        var emptyTarget = {
                            name: newCustomization.targets[j].name,
                            props: {}
                        }
                        customizations[i].targets.push(emptyTarget);
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

        if (layoutName == "default" || checkEditsSection($section)) {
            section_props.props = createSectionProperties($section, "customLayout", null);
            Rexbuilder_Util.activeLayout = layoutName;
        } else {
            if (Rexbuilder_Util.viewport().width < 768) {
                section_props.props["collapse_grid"] = true;
            }
        }
        targets.push(section_props);

        var $gridGallery = $section.find('.grid-stack-row');
        var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;
        var elementsOrdered = galleryIstance.getElementsTopBottom();

        var saveAllBloks = checkEditsLayoutGrid($gridGallery);

        galleryIstance.updateAllElementsProperties();
        $(elementsOrdered).each(function () {
            var $elem = $(this);
            if (!$elem.hasClass("removing_block")) {
                var blockRexID = $elem.attr("data-rexbuilder-block-id");
                var block_props = {
                    name: blockRexID,
                    props: {}
                }
                if (layoutName == "default" || saveAllBloks || checkEditsElement($elem)) {
                    block_props.props = createBlockProperties($elem, "customLayout", layoutName);
                }
                targets.push(block_props);
            }
        });
        return targets;
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

    var createBlockProperties = function ($elem, mode, layoutName) {
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
            block_live_edited = "",
            block_flex_position = "";

        var content = "";
        var $textWrap;
        var $itemContent = $elem.find('.grid-item-content');
        var $itemData = $elem.children(".rexbuilder-block-data");

        id = $elem.attr('id') === undefined ? "" : $elem.attr('id');
        rex_id = $elem.attr('data-rexbuilder-block-id');
        type = $itemData.attr('data-type') == "" ? "empty" : $itemData.attr('data-type');
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
        video_has_audio = $itemData.attr('data-video_has_audio') === undefined ? "0"
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
        block_live_edited = $itemData.attr('data-rexlive-edited') === undefined ? "" : "true";

        block_flex_position = typeof $itemData.attr('data-block_flex_position') == "undefined" ? "" : $itemData.attr('data-block_flex_position');

        if (mode == "shortcode") {
            $textWrap = $itemContent.find('.text-wrap');
            if (!$elem.hasClass('block-has-slider')) {
                var $savingBlock = $textWrap.clone(false);
                $savingBlock.find('.medium-insert-buttons').remove();
                $savingBlock.find('.text-editor-span-fix').remove();
                if ($savingBlock.text().trim() == "") {
                    content = "";
                } else {
                    content = $savingBlock.html();
                }
            } else {
                var $sliderToSave = $textWrap.children(".rex-slider-wrap[data-rex-slider-active=\"true\"]");

                var sliderID = parseInt($sliderToSave.attr("data-slider-id"));
                var sliderData = Rexbuilder_Util_Editor.createSliderData($sliderToSave);
                if (!Rexbuilder_Util_Editor.openingModel) {
                    Rexbuilder_Util_Editor.saveSliderOnDB(sliderData, false);
                }

                content = '[RexSlider slider_id="' + sliderID + '"]';
            }

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
                + '" video_has_audio="' + video_has_audio
                + '" block_has_scrollbar="' + block_has_scrollbar
                + '" block_live_edited="' + block_live_edited
                + '" block_flex_position="' + block_flex_position
                + '"]'
                + content
                + '[/RexpansiveBlock]';
            return output;
        } else if (mode == "customLayout") {

            var props = {};

            props["hide"] = false;
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
            props["block_live_edited"] = block_live_edited;
            props["block_flex_position"] = block_flex_position;
            props["overwritten"] = false;

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
            rexlive_model_name = '';

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
        responsive_background = $sectionData.attr('data-responsive_background') === undefined ? "fixed"
            : $sectionData.attr('data-responsive_background');
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

        row_overlay_color = typeof $sectionData.attr("data-row_overlay_color") == "undefined" ? "" : $sectionData.attr("data-row_overlay_color");
        row_overlay_active = typeof $sectionData.attr("data-row_overlay_active") == "undefined" ? false : $sectionData.attr("data-row_overlay_active");

        if (typeof newID == "undefined" || newID === null) {
            rexlive_section_id = typeof $section.attr("data-rexlive-section-id") == "undefined" ? "" : $section.attr("data-rexlive-section-id");
        } else {
            rexlive_section_id = newID;
        }

        collapse_grid = typeof $section.attr("data-rex-collapse-grid") == "undefined" ? false : $section.attr("data-rex-collapse-grid");

        rexlive_model_id = typeof $section.attr("data-rexlive-model-id") == "undefined" ? "" : $section.attr("data-rexlive-model-id");
        rexlive_model_name = typeof $section.attr("data-rexlive-model-name") == "undefined" ? "" : $section.attr("data-rexlive-model-name");

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
                    output += createBlockProperties($elem, "shortcode", null);
                }
            });

            output += fillGridEmptySpaces(galleryIstance);

            output += '[/RexpansiveSection]';
            return output;

        } else if (mode == "customLayout") {

            var props = {};

            props["collapse_grid"] = collapse_grid;
            props["hide"] = false;
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
            props["responsive_background"] = responsive_background;
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
            props["overwritten"] = false;
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
        createTargets: createTargets
    }
})(jQuery);