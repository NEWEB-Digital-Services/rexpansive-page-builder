var Rex_Save_Listeners = (function ($) {
    'use strict';
    $(function () {

        $(document).on("rexlive:saveDefaultLayout", function () {
            console.log("saving default layout");

            var idPost = parseInt($('#id-post').attr('data-post-id'));

            var postClean = createCleanPost();
            //console.log(postClean);

            var shortcodePage = '';

            Rexbuilder_Util.$rexContainer.find('.rexpansive_section').each(function () {
                var $section = $(this);
                if (!$section.hasClass("removing_section")) {
                    shortcodePage += createSectionProperties($section, "shortcode", null);
                }
            });
            console.log(shortcodePage);

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
                    console.log(response);
                    if (response.success) {
                        console.log('default layout aggiornato');
                    } else {
                        console.log(response.msg);
                        console.log("errore");
                    }
                    console.log('chiama effettuata con successo');
                },
                error: function (response) {
                    console.log(response);
                    console.log('errore chiama ajax');
                }
            });
        });

        $(document).on('rexlive:saveCustomizations', function (e) {
            var $layoutData = Rexbuilder_Util.$rexContainer.parent().children("#rexbuilder-layout-data");
            console.log($layoutData);
            var $layoutsCustomDiv = $layoutData.children(".layouts-customizations");
            var $layoutsAvaiableDiv = $layoutData.children(".available-layouts");


            var idPost = parseInt($('#id-post').attr('data-post-id'));

            var activeLayout = e.settings.selected;
            var activeLayoutName = activeLayout[0];
            var updatedLayouts = e.settings.updatedLayouts;

            console.log("saving customization " + activeLayoutName);

            var oldCustomizations;

            if ($layoutsCustomDiv.data("empty-customizations")) {
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

            customizationsArray.push(createCustomization(activeLayoutName));

            $layoutsCustomDiv.text(JSON.stringify(customizationsArray));
            $layoutsAvaiableDiv.text(JSON.stringify(updatedLayouts));

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
                    console.log(response);
                    if (response.success) {
                        console.log('nomi layout aggiornati');
                    }
                    console.log('chiama effettuata con successo');
                },
                error: function (response) {
                    console.log('errore chiama ajax');
                }
            });

            //saving layouts customizations
            $.each(customizationsArray, function (i, layout) {
                console.log(layout);
                if (layout.name == activeLayoutName) {
                    if (layout.sections != "") {
                        console.log(layout);
                        console.log(layout.sections);
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
                                console.log(response);
                                if (response.success) {
                                    console.log('layout custom aggiornato');
                                }
                                console.log('chiama effettuata con successo');
                            },
                            error: function (response) {
                                console.log('errore chiama ajax');
                            }
                        });
                    }
                }
            });
        });

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
            Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function () {
                var $section = $(this);
                if (!$section.hasClass("removing_section")) {
                    var sectionRexID = $section.attr("data-rexlive-section-id");

                    var section_props = {
                        section_rex_id: sectionRexID,
                        targets: [],
                    }
                    section_props.targets = createTargets($section, layoutName);
                    output.push(section_props);
                }
            });

            return output;
        }
        /*
        data-rexlive-section-edited="true"
        */
        var checkEditsSection = function ($section) {
            return $section.attr("data-rexlive-section-edited") == "true" ? true : false;
        }
        /*
        data-rexlive-layout-changed="true"
        */
        var checkEditsLayoutGrid = function ($gallery) {
            return $gallery.attr("data-rexlive-layout-changed") == "true" ? true : false;
        }
        /*
        data-rexlive-element-edited="true"
        */
        var checkEditsElement = function ($elem) {
            return $elem.attr("data-rexlive-element-edited") == "true" ? true : false;
        }

        var createTargets = function ($section, layoutName) {
            var targets = [];

            var section_props = {
                name: "self",
                props: {}
            }
            console.log(layoutName);
            if (layoutName == "default" || checkEditsSection($section)) {
                console.log("saving: " + "self");
                section_props.props = createSectionProperties($section, "customLayout", layoutName);
            }
            targets.push(section_props);

            var $gridGallery = $section.find('.grid-stack-row');
            var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;
            var elementsOrdered = galleryIstance.getElementTopBottom();

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
                        console.log("saving: " + blockRexID);
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
                image_bg_block = "",
                image_width = 0,
                image_height = 0,
                id_image_bg_block = "",
                video_mp4_url = "",
                video_bg_id = "",
                video_bg_url = "",
                video_bg_url_vimeo = "",
                type_bg_block = "",
                image_size = 'full',
                photoswipe = '',
                linkurl = '',
                block_custom_class = '',
                block_padding = '',
                overlay_block_color = '',
                zak_background = "",
                zak_side = "",
                zak_title = "",
                zak_icon = "",
                zak_foreground = "",
                block_animation = "fadeInUpBig",
                video_has_audio = '0',
                block_has_scrollbar = "false",
                block_live_edited = "";

            var content = "";
            var $textWrap;
            var output;
            var $itemContent = $elem.find('.grid-item-content');
            var $itemData = $elem.children(".rexbuilder-block-data");

            id = $elem.attr('id') === undefined ? "" : $elem.attr('id');
            rex_id = $elem.attr('data-rexbuilder-block-id');
            type = $itemData.attr('data-type');
            size_x = $elem.attr('data-width');
            size_y = $elem.attr('data-height');
            row = $elem.attr('data-row');
            col = $elem.attr('data-col');
            gs_start_h = $elem.attr('data-gs-height');
            gs_width = $elem.attr('data-gs-width');
            gs_height = $elem.attr('data-gs-height');
            gs_y = $elem.attr('data-gs-y');
            gs_x = $elem.attr('data-gs-x');
            color_bg_block = $itemContent.css('background-color') != '' ? $itemContent
                .css('background-color')
                : '#ffffff';
            image_bg_block = $itemData.attr('data-image_bg_block') === undefined ? ""
                : $itemData.attr('data-image_bg_block');
            image_width = $itemContent.attr('data-background_image_width') === undefined ? ""
                : parseInt($itemContent.attr('data-background_image_width'));
            image_height = $itemContent.attr('data-background_image_height') === undefined ? ""
                : parseInt($itemContent.attr('data-background_image_height'));
            id_image_bg_block = $itemData.attr('data-id_image_bg_block') === undefined ? ""
                : $itemData.attr('data-id_image_bg_block');
            video_bg_id = $itemData.attr('data-video_bg_id') === undefined ? ""
                : $itemData.attr('data-video_bg_id');
            video_mp4_url = $itemData.attr('data-video_mp4_url') === undefined ? ""
                : $itemData.attr('data-video_mp4_url');
            video_bg_url = $itemData.attr('data-video_bg_url') === undefined ? ""
                : $itemData.attr('data-video_bg_url');
            video_bg_url_vimeo = $itemData.attr('data-video_bg_url_vimeo') === undefined ? ""
                : $itemData.attr('data-video_bg_url_vimeo');
            type_bg_block = $itemData.attr('data-type_bg_block') === undefined ? "full"
                : $itemData.attr('data-type_bg_block');
            image_size = $itemData.attr('data-image_size') === undefined ? "full"
                : $itemData.attr('data-image_size');
            photoswipe = $itemData.attr('data-photoswipe') === undefined ? ""
                : $itemData.attr('data-photoswipe');
            linkurl = $itemData.attr('data-linkurl') === undefined ? ""
                : $itemData.attr('data-linkurl');
            block_custom_class = $itemData.attr('data-block_custom_class') === undefined ? ""
                : $itemData.attr('data-block_custom_class');
            block_padding = $itemData.attr('data-block_padding') === undefined ? ""
                : $itemData.attr('data-block_padding');
            overlay_block_color = $itemData.attr('data-overlay_block_color') === undefined ? ""
                : $itemData.attr('data-overlay_block_color');
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
            video_has_audio = $itemData.attr('data-video_has_audio') === undefined ? "0"
                : $itemData.attr('data-video_has_audio');
            block_has_scrollbar = $itemData.attr('data-block_has_scrollbar') === undefined ? "false"
                : $itemData.attr('data-block_has_scrollbar');
            block_live_edited = $itemData.attr('data-rexlive-edited') === undefined ? "" : "true";

            if (!$elem.hasClass('block-has-slider')) {
                $textWrap = $itemContent.find('.text-wrap');
                var $savingBlock = $textWrap.clone(false);
                $savingBlock.find('.medium-insert-buttons').remove();
                $savingBlock.find('.text-editor-span-fix').remove();
                if ($savingBlock.text().trim() == "") {
                    content = "";
                } else {
                    content = $savingBlock.html();
                }
            } else {
                content = '[RexSlider slider_id="' + parseInt($elem.find(".rex-slider-wrap").attr("data-slider-id")) + '"]';
            }


            if (mode == "shortcode") {
                output = '[RexpansiveBlock'
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
                    + '" image_bg_block="' + image_bg_block
                    + '" id_image_bg_block="' + id_image_bg_block
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
                    + '" zak_background="' + zak_background
                    + '" zak_side="' + zak_side
                    + '" zak_title="' + zak_title
                    + '" zak_icon="' + zak_icon
                    + '" zak_foreground="' + zak_foreground
                    + '" block_animation="' + block_animation
                    + '" video_has_audio="' + video_has_audio
                    + '" block_has_scrollbar="' + block_has_scrollbar
                    + '" block_live_edited="' + block_live_edited
                    + '"]' + content
                    + '[/RexpansiveBlock]';
                return output;
            } else if (mode == "customLayout") {

                var props = {};

                if (layoutName == "default") {
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
                    props["block_custom_class"] = block_custom_class;
                    props["block_padding"] = block_padding;
                    props["overlay_block_color"] = overlay_block_color;
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
                } else {
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
                    props["linkurl"] = linkurl;
                    props["block_custom_class"] = block_custom_class;
                    props["block_padding"] = block_padding;
                    props["overlay_block_color"] = overlay_block_color;
                    props["zak_background"] = zak_background;
                    props["zak_side"] = zak_side;
                    props["zak_title"] = zak_title;
                    props["zak_icon"] = zak_icon;
                    props["zak_foreground"] = zak_foreground;
                    props["block_animation"] = block_animation;
                    props["video_has_audio"] = video_has_audio;
                    props["block_has_scrollbar"] = block_has_scrollbar;
                    props["block_live_edited"] = block_live_edited;

                }

                return props;
            }
        };

        var createSectionProperties = function ($section, mode, layoutName) {
            var section_name = "",
                type = "perfect-grid",
                color_bg_section = "#ffffff",
                dimension = "full",
                margin = "",
                image_bg_section = "",
                image_width = 0,
                image_height = 0,
                id_image_bg_section = "",
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
                rexlive_section_id = '';

            var output = '';
            var $gridGallery = $section.find('.grid-stack-row');
            var $sectionData = $section.children('.section-data');
            var galleryIstance = $gridGallery.data().plugin_perfectGridGalleryEditor;
            section_name = $sectionData.attr('data-section_name') === undefined ? ""
                : $sectionData.attr('data-section_name');
            type = $sectionData.attr('data-type') === undefined ? "perfect-grid"
                : $sectionData.attr('data-type');
            color_bg_section = $sectionData.attr('data-color_bg_section') === undefined ? "#ffffff"
                : $sectionData.attr('data-color_bg_section');
            dimension = $sectionData.attr('data-dimension') === undefined ? "full"
                : $sectionData.attr('data-dimension');
            margin = $sectionData.attr('data-margin') === undefined ? ""
                : $sectionData.attr('data-margin');
            image_bg_section = $sectionData.attr('data-image_bg_section') === undefined ? ""
                : $sectionData.attr('data-image_bg_section');
            image_width = $section.attr('data-background_image_width') === undefined ? ""
                : parseInt($section.attr('data-background_image_width'));
            image_height = $section.attr('data-background_image_height') === undefined ? ""
                : parseInt($section.attr('data-background_image_height'));
            id_image_bg_section = $sectionData.attr('data-id_image_bg_section') === undefined ? ""
                : $sectionData.attr('data-id_image_bg_section');
            video_mp4_url = $sectionData.attr('data-video_mp4_url') === undefined ? ""
                : $sectionData.attr('data-video_mp4_url');
            video_bg_url_section = $sectionData.attr('data-video_bg_url_section') === undefined ? ""
                : $sectionData.attr('data-video_bg_url_section');
            video_bg_id_section = $sectionData.attr('data-video_bg_id_section') === undefined ? ""
                : $sectionData.attr('data-video_bg_id_section');
            video_bg_url_vimeo_section = $sectionData.attr('data-video_bg_url_vimeo_section') === undefined ? ""
                : $sectionData.attr('data-video_bg_url_vimeo_section');
            full_height = $sectionData.attr('data-full_height') === undefined ? ""
                : $sectionData.attr('data-full_height');
            block_distance = $sectionData.attr('data-block_distance') === undefined ? 20
                : parseInt($sectionData.attr('data-block_distance'));
            layout = $sectionData.attr('data-layout') === undefined ? ""
                : $sectionData.attr('data-layout');
            responsive_background = $sectionData.attr('data-responsive_background') === undefined ? "fixed"
                : $sectionData.attr('data-responsive_background');
            custom_classes = $sectionData.attr('data-custom_classes') === undefined ? ""
                : $sectionData.attr('data-custom_classes');
            section_width = $sectionData.attr('data-section_width') === undefined ? ""
                : $sectionData.attr('data-section_width');
            section_width = section_width == '%' ? "" : section_width;
            row_separator_top = $sectionData.attr('data-row_separator_top') === undefined ? ""
                : $sectionData.attr('data-row_separator_top');
            row_separator_bottom = $sectionData.attr('data-row_separator_bottom') === undefined ? ""
                : $sectionData.attr('data-row_separator_bottom');
            row_separator_right = $sectionData.attr('row_separator_right') === undefined ? ""
                : $sectionData.attr('data-row_separator_right');
            row_separator_left = $sectionData.attr('data-row_separator_left') === undefined ? ""
                : $sectionData.attr('data-row_separator_left');
            row_margin_top = $sectionData.attr('data-row_margin_top') === undefined ? ""
                : $sectionData.attr('data-row_margin_top');
            row_margin_bottom = $sectionData.attr('data-row_margin_bottom') === undefined ? ""
                : $sectionData.attr('data-row_margin_bottom');
            row_margin_right = $sectionData.attr('data-row_margin_right') === undefined ? ""
                : $sectionData.attr('data-row_margin_right');
            row_margin_left = $sectionData.attr('data-row_margin_left') === undefined ? ""
                : $sectionData.attr('data-row_margin_left');
            rexlive_section_id = $section.attr("data-rexlive-section-id");
            if (mode == "shortcode") {
                output = '[RexpansiveSection'
                    + ' section_name="' + section_name
                    + '" type="' + type
                    + '" color_bg_section="' + color_bg_section
                    + '" dimension="' + dimension
                    + '" margin="' + margin
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
                    + '" row_margin_top="' + row_margin_top
                    + '" row_margin_bottom="' + row_margin_bottom
                    + '" row_margin_right="' + row_margin_right
                    + '" row_margin_left="' + row_margin_left
                    + '" rexlive_section_id="' + rexlive_section_id
                    + '" row_edited_live="true"]';

                galleryIstance.fillEmptySpaces();
                galleryIstance.updateAllElementsProperties();

                var elementsOrdered = galleryIstance.getElementTopBottom();

                $(elementsOrdered).each(function () {
                    var $elem = $(this);
                    if (!$elem.hasClass("removing_block")) {
                        output += createBlockProperties($elem, "shortcode", null);
                    }
                });

                output += '[/RexpansiveSection]';
                return output;

            } else if (mode == "customLayout") {

                var props = {};

                if (layoutName == "default") {
                    props["hide"] = false;
                    props["section_name"] = section_name;
                    props["type"] = type;
                    props["color_bg_section"] = color_bg_section;
                    props["dimension"] = dimension;
                    props["margin"] = margin;
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

                } else {
                    props["hide"] = false;
                    props["section_name"] = section_name;
                    props["type"] = type;
                    props["color_bg_section"] = color_bg_section;
                    props["dimension"] = dimension;
                    props["margin"] = margin;
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
                }
                return props;
            }
        }
    })
})(jQuery);