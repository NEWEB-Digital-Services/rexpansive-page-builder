var Rexbuilder_Util = (function ($) {
    'use strict';

    var $window = $(window);

    var fixSectionWidth = 0;
    var editorMode = false;
    var windowIsResizing = false;
    var responsiveLayouts;
    var defaultLayoutSections;

    var createRandomID = function (n) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < n; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    var _createSectionID = function () {
        var id;
        var flag;
        var idLength = 4;
        do {
            flag = true;
            id = createRandomID(idLength);
            if (id == "self") {
                flag = false;
            } else {
                Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function () {
                    if ($(this).attr('data-rexlive-section-id') !== undefined && $(this).attr('data-rexlive-section-id') == id) {
                        flag = false;
                    }
                });
            }
        } while (!flag);
        return id;
    }

    var createBlockID = function () {
        console.log("creating new block ID");
        var id;
        var flag;
        var idLength = 4;
        var $this;

        do {
            flag = true;
            id = createRandomID(idLength);
            if (id == "self") {
                flag = false;
            } else {
                Rexbuilder_Util.$rexContainer.find('.grid-stack-item').each(function () {
                    $this = $(this);
                    if ($this.attr('data-rexbuilder-block-id') !== undefined && $this.attr('data-rexbuilder-block-id') == id) {
                        flag = false;
                    }
                });
            }
        } while (!flag);
        return id;
    }

    var _updateSectionsID = function () {
        var id;
        var $sec;
        Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function (i, e) {
            $sec = $(e);
            if ($sec.attr('data-rexlive-section-id') === undefined) {
                id = _createSectionID();
                $sec.attr('data-rexlive-section-id', id);
            }
        });
    }

    var _updateSectionsNumber = function () {
        var last = -1;
        var $sec;
        Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function (i, e) {
            $sec = $(e);
            $sec.attr('data-rexlive-section-number', i);
            last = i;
        });
        Rexbuilder_Util.lastSectionNumber = last;
    }

    var _findLayoutType = function (name) {
        if (name == "default" || name == "tablet" || name == "mobile") {
            return "standard";
        }
        return "custom";
    }

    var chooseLayout = function () {
        var $responsiveData = $("#rexbuilder-layout-data");
        var $modelData = $("#rexbuilder-model-data");

        Rexbuilder_Util.chosenLayoutData = {
            min: 0,
            max: "",
            id: "default",
            label: "My Desktop",
            type: "standard"
        }

        if (($responsiveData.children(".layouts-data").attr("data-empty-customizations") == "true" && $modelData.children(".models-customizations").attr("data-empty-models-customizations") == "true") || (Rexbuilder_Util.editorMode && Rexbuilder_Util.firstStart)) {
            return "default";
        }

        var windowWidth = _viewport().width;
        var i, j, k;
        var allLayoutsDimensions = JSON.parse($("#layout-avaiable-dimensions").text());
        var allModelsCustomizationsNames = JSON.parse($modelData.children(".available-models-customizations-names").text());
        var avaiableNames = JSON.parse($responsiveData.children(".available-layouts-names").text());

        var layoutsPageNames = [];
        var flag_insert;

        for (i = 0; i < allLayoutsDimensions.length; i++) {
            flag_insert = false;
            //modelli
            for (j = 0; j < allModelsCustomizationsNames.length; j++) {
                for (k = 0; k < allModelsCustomizationsNames[j].names.length; k++) {
                    if (allLayoutsDimensions[i].id == allModelsCustomizationsNames[j].names[k]) {
                        var dim = allLayoutsDimensions[i];
                        dim.model = true;
                        flag_insert = true;
                        layoutsPageNames.push(dim);
                    }
                }
            }
            if (!flag_insert) {
                for (k = 0; k < avaiableNames.length; k++) {
                    if (allLayoutsDimensions[i].id == avaiableNames[k]) {
                        var dim = allLayoutsDimensions[i];
                        dim.model = false;
                        flag_insert = true;
                        layoutsPageNames.push(dim);
                    }
                }
            }
        }

        for (i = 0; i < layoutsPageNames.length; i++) {
            if (layoutsPageNames[i].min == "") {
                layoutsPageNames[i].min = 0;
            }
        }

        var selectedLayoutName = "";
        var ordered = lodash.sortBy(layoutsPageNames, [function (o) { return parseInt(o.min); }]);

        console.log(ordered);

        for (i = 0; i < ordered.length; i++) {
            if (windowWidth >= ordered[i].min) {
                if (ordered[i].max != "") {
                    if (windowWidth < ordered[i].max) {
                        selectedLayoutName = ordered[i].id;
                        Rexbuilder_Util.chosenLayoutData = ordered[i];
                    }
                } else {
                    selectedLayoutName = ordered[i].id;
                    Rexbuilder_Util.chosenLayoutData = ordered[i];
                }
            }
        }

        if (selectedLayoutName === "") {
            selectedLayoutName = "default";
        }

        return selectedLayoutName;
    }

    var _createEmptyTargets = function (targetsToEmpty) {
        var emptyTargets = [];
        var i;
        for (i = 0; i < targetsToEmpty.length; i++) {
            var emptyTarget = {
                name: targetsToEmpty[i].name,
                props: {}
            };
            if (targetsToEmpty[i].name == "self" && _viewport().width < 768) {
                emptyTarget.props.collapse_grid = true;
            }
            emptyTargets.push(emptyTarget);
        }
        return emptyTargets;
    }

    var _edit_dom_layout = function (chosenLayoutName) {
        if (Rexbuilder_Util.editorMode) {
            if (chosenLayoutName == "default") {
                Rexbuilder_Util.$rexContainer.removeClass("rex-hide-responsive-tools");
                Rexbuilder_Util.$rexContainer.parent().removeClass("rex-hide-responsive-tools");
            } else {
                Rexbuilder_Util.$rexContainer.parent().addClass("rex-hide-responsive-tools");
                Rexbuilder_Util.$rexContainer.addClass("rex-hide-responsive-tools");
            }
        }
        if (chosenLayoutName == Rexbuilder_Util.activeLayout) {
            if (chosenLayoutName == "default") {
                if (_viewport().width > 767) {
                    Rexbuilder_Util.removeCollapsedGrids();
                } else {
                    if (!Rexbuilder_Util.blockGridUnder768) {
                        Rexbuilder_Util.collapseAllGrids();
                    }
                }
                return;
            }
        }

        Rexbuilder_Util.$rexContainer.attr("data-rex-layout-selected", chosenLayoutName);
        Rexbuilder_Util.activeLayout = chosenLayoutName;

        //updaiting selected layout on buttons
        var data = {
            eventName: "rexlive:layoutChanged",
            activeLayoutName: chosenLayoutName
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);

        var $resposiveData = $("#rexbuilder-layout-data");
        var $modelData = $("#rexbuilder-model-data");

        if (($resposiveData.children(".layouts-customizations").attr("data-empty-customizations") == "true") && $modelData.children(".models-customizations").attr("data-empty-models-customizations") == "true") {
            if (_viewport().width > 767) {
                removeCollapsedGrids();
            } else {
                if (!Rexbuilder_Util.blockGridUnder768) {
                    Rexbuilder_Util.collapseAllGrids();
                }
            }
            return;
        }

        var layoutDataPage = [];
        if ($resposiveData.children(".layouts-customizations").text() != "") {
            layoutDataPage = JSON.parse($resposiveData.children(".layouts-customizations").text());
        }

        console.log("layoutDataPage", layoutDataPage);

        var layoutDataModels = [];
        if ($modelData.children(".models-customizations").text() != "") {
            layoutDataModels = JSON.parse($modelData.children(".models-customizations").text());
        }

        console.log("layoutDataModels", layoutDataModels);

        var modelsIDInPage = [];

        Rexbuilder_Util.$rexContainer.children(".rexpansive_section:not(.removing_section)").each(function (i, el) {
            var $section = $(el);
            if ($section.hasClass("rex-model-section")) {
                modelsIDInPage.push(parseInt($section.attr("data-rexlive-model-id")));
            }
        });

        var sectionsPage = [];

        Rexbuilder_Util.$rexContainer.children(".rexpansive_section:not(.removing_section)").each(function (i, el) {
            var $section = $(el);
            var secObj = {
                rexID: $section.attr("data-rexlive-section-id"),
                modelID: isNaN(parseInt($section.attr("data-rexlive-model-id"))) ? "" : parseInt($section.attr("data-rexlive-model-id")),
            }
            sectionsPage.push(secObj);
        });

        console.log("sectionsPage", sectionsPage);

        var i, j, p, q;
        var defaultLayoutSections = [];
        for (i = 0; i < layoutDataPage.length; i++) {
            if (layoutDataPage[i].name == "default") {
                for (j = 0; j < layoutDataPage[i].sections.length; j++) {
                    var sectionDefaultData = jQuery.extend(true, {}, layoutDataPage[i].sections[j]);
                    if (layoutDataPage[i].sections[j].section_is_model.toString() == "true") {
                        for (p = 0; p < layoutDataModels.length; p++) {
                            if (layoutDataModels[p].id == sectionDefaultData.section_model_id) {
                                for (q = 0; q < layoutDataModels[p].customizations.length; q++) {
                                    if (layoutDataModels[p].customizations[q].name == "default") {
                                        sectionDefaultData.targets = jQuery.extend(true, [], layoutDataModels[p].customizations[q].targets);
                                    }
                                }
                            }
                        }
                    }
                    defaultLayoutSections.push(sectionDefaultData);
                }
            }
        }

        var layoutSelectedSections = [];
        for (i = 0; i < layoutDataPage.length; i++) {
            if (layoutDataPage[i].name == chosenLayoutName) {
                for (j = 0; j < layoutDataPage[i].sections.length; j++) {
                    var sectionCustomData = jQuery.extend(true, {}, layoutDataPage[i].sections[j]);
                    if (layoutDataPage[i].sections[j].section_is_model.toString() == "true") {
                        for (p = 0; p < layoutDataModels.length; p++) {
                            if (layoutDataModels[p].id == sectionCustomData.section_model_id) {
                                for (q = 0; q < layoutDataModels[p].customizations.length; q++) {
                                    if (layoutDataModels[p].customizations[q].name == chosenLayoutName) {
                                        sectionCustomData.targets = jQuery.extend(true, [], layoutDataModels[p].customizations[q].targets);
                                    }
                                }
                            }
                        }
                        if (typeof sectionCustomData.targets == "undefined") {
                            var modelActiveDefault = [];
                            for (p = 0; p < layoutDataModels.length; p++) {
                                if (layoutDataModels[p].id == sectionCustomData.section_model_id) {
                                    for (q = 0; q < layoutDataModels[p].customizations.length; q++) {
                                        if (layoutDataModels[p].customizations[q].name == "default") {
                                            modelActiveDefault = layoutDataModels[p].customizations[q].targets;
                                        }
                                    }
                                }
                            }
                            sectionCustomData.targets = _createEmptyTargets(modelActiveDefault);
                        }
                    }
                    layoutSelectedSections.push(sectionCustomData);
                }
                break;
            }
        }

        // no layout custom for page, checking models
        if (i == layoutDataPage.length) {
            for (i = 0; i < layoutDataPage.length; i++) {
                if (layoutDataPage[i].name == "default") {
                    for (j = 0; j < layoutDataPage[i].sections.length; j++) {
                        var sectionPage = jQuery.extend(true, {}, layoutDataPage[i].sections[j]);
                        if (sectionPage.section_is_model.toString() == "true") {
                            for (p = 0; p < layoutDataModels.length; p++) {
                                if (layoutDataModels[p].id == sectionPage.section_model_id) {
                                    for (q = 0; q < layoutDataModels[p].customizations.length; q++) {
                                        if (layoutDataModels[p].customizations[q].name == chosenLayoutName) {
                                            sectionPage.targets = jQuery.extend(true, [], layoutDataModels[p].customizations[q].targets);
                                        }
                                    }
                                }
                            }
                            if (typeof sectionPage.targets == "undefined") {
                                var modelActiveDefault = [];
                                for (p = 0; p < layoutDataModels.length; p++) {
                                    if (layoutDataModels[p].id == sectionPage.section_model_id) {
                                        for (q = 0; q < layoutDataModels[p].customizations.length; q++) {
                                            if (layoutDataModels[p].customizations[q].name == "default") {
                                                modelActiveDefault = layoutDataModels[p].customizations[q].targets;
                                            }
                                        }
                                    }
                                }
                                sectionPage.targets = _createEmptyTargets(modelActiveDefault);
                            }
                        } else {
                            sectionPage.targets = _createEmptyTargets(sectionPage.targets);
                        }
                        layoutSelectedSections.push(sectionPage);
                    }
                    break;
                }
            }
        }

        var customSections = layoutSelectedSections;
        var forceCollapseElementsGrid = false;
        /*         if (i == layoutDataPage.length || chosenLayoutName == "default") {
                    if (_viewport().width < 768) {
                        forceCollapseElementsGrid = true;
                    }
                } else {
                    customSections = layoutSelectedSections;
                } */

        console.log("customSections", customSections);
        console.log("defaultLayoutSections", defaultLayoutSections);
        var mergedEdits = $.extend(true, {}, customSections);
        var pushingEdits = $.extend(true, {}, defaultLayoutSections);

        var modelsNumbers = [];
        var flagModel;
        //fixing empty models numbers
        $.each(mergedEdits, function (i, sectionCustom) {
            if (sectionCustom.section_is_model.toString() == "true") {
                if (typeof sectionCustom.section_model_number == "undefined") {
                    flagModel = false;
                    for (i = 0; i < modelsNumbers.length; i++) {
                        if (modelsNumbers[i].id == sectionCustom.section_model_id) {
                            modelsNumbers[i].number = modelsNumbers[i].number + 1;
                            sectionCustom.section_model_number = modelsNumbers[i].number;
                            flagModel = true;
                        }
                    }
                    if (!flagModel) {
                        var modelObj = {
                            id: sectionCustom.section_model_id,
                            number: 1
                        }
                        sectionCustom.section_model_number = 1;
                        modelsNumbers.push(modelObj);
                    }
                }
            }
            if (typeof sectionCustom.targets == "undefined") {
                sectionCustom.targets = [];
            }
        });

        // removing collapsed from grid
        Rexbuilder_Util.removeCollapsedGrids();
        var m, n;
        var sectionFounded;
        var targetFounded;
        var newBlocksLayout = [];
        var newSectionsLayout = [];
        if (!jQuery.isEmptyObject(mergedEdits)) {
            $.each(mergedEdits, function (i, sectionCustom) {
                sectionFounded = false;
                $.each(pushingEdits, function (i, sectionDefault) {
                    if (sectionDefault.section_rex_id == sectionCustom.section_rex_id) {
                        sectionDefault.founded = true;
                        sectionCustom.notInSection = false;
                        sectionFounded = true;
                        for (m = 0; m < sectionCustom.targets.length; m++) {
                            targetFounded = false;
                            for (n = 0; n < sectionDefault.targets.length; n++) {
                                if (sectionCustom.targets[m].name == sectionDefault.targets[n].name) {
                                    sectionCustom.targets[m].notDisplay = false;
                                    sectionDefault.targets[n].founded = true;
                                    targetFounded = true;
                                    sectionCustom.targets[m].props = lodash.merge({}, sectionDefault.targets[n].props, sectionCustom.targets[m].props);
                                }
                            }
                            if (!targetFounded) {
                                sectionCustom.targets[m].notDisplay = true;
                            }
                        }
                        for (n = 0; n < sectionDefault.targets.length; n++) {
                            if (typeof sectionDefault.targets[n].founded == "undefined") {
                                newBlocksLayout.push(sectionDefault.targets[n]);
                            }
                        }
                        if (m == 0) {
                            sectionCustom.targets = sectionDefault.targets;
                        }
                    }
                });
                if (!sectionFounded) {
                    sectionCustom.notInSection = true;
                }
            });
            $.each(pushingEdits, function (i, sectionDefault) {
                if (typeof sectionDefault.founded == "undefined") {
                    newSectionsLayout.push(sectionDefault);
                }
            });
        } else {
            mergedEdits = pushingEdits;
        }
        console.log("newBlocksLayout", newBlocksLayout);
        console.log("newSectionsLayout", newSectionsLayout);

        console.log("applying");
        console.log("mergedEdits", mergedEdits);

        Rexbuilder_Util.domUpdaiting = true;
        var sectionDomOrder = [];

        $.each(mergedEdits, function (q, section) {
            if (!section.notInSection || chosenLayoutName == "default") {
                var sectionObj = {
                    rexID: section.section_rex_id,
                    modelID: -1,
                    modelNumber: -1,
                }

                var $section;
                if (section.section_is_model.toString() == "true") {
                    sectionObj.modelID = section.model_id;
                    sectionObj.modelNumber = section.section_model_number;
                    $section = Rexbuilder_Util.$rexContainer.children('section[data-rexlive-section-id="' + section.section_rex_id + '"][data-rexlive-saved-model-number="' + sectionObj.modelNumber + '"]');
                } else {
                    $section = Rexbuilder_Util.$rexContainer.children('section[data-rexlive-section-id="' + section.section_rex_id + '"]');
                }
                if($section.length != 0){
                    sectionDomOrder.push(sectionObj);   
                    _updateDOMelements($section, section.targets, forceCollapseElementsGrid);
                }
            }
        });

        Rexbuilder_Dom_Util.fixSectionDomOrder(sectionDomOrder);

        Rexbuilder_Util.domUpdaiting = false;

        if (!Rexbuilder_Util.editorMode) {
            initPhotoSwipe(".photoswipe-gallery");
        }
    }

    var _updateDOMelements = function ($section, targets, forceCollapseElementsGrid) {
        var $gallery = $section.find(".grid-stack-row");
        var galleryData = $gallery.data();
        if (galleryData !== undefined) {
            var galleryEditorInstance = galleryData.plugin_perfectGridGalleryEditor;
            if (galleryEditorInstance !== undefined) {
                var gridstackInstance = galleryEditorInstance.properties.gridstackInstance;
                galleryEditorInstance.batchGridstack();
            }
        }

        for (var i = 1; i < targets.length; i++) {
            if (!targets[i].notDisplay || Rexbuilder_Util.activeLayout == "default") {

                var targetName = targets[i].name;
                var targetProps = targets[i].props;
                var $elem = $gallery.children('div[data-rexbuilder-block-id="' + targetName + '"]');
                var $itemData = $elem.children(".rexbuilder-block-data");
                var $itemContent = $elem.find(".grid-item-content");

                var postionData = {
                    x: targetProps["gs_x"],
                    y: targetProps["gs_y"],
                    w: targetProps["gs_width"],
                    h: targetProps["gs_height"],
                    startH: targetProps["gs_start_h"],
                    gridstackInstance: gridstackInstance,
                };

                _updateElementDimensions($elem, $itemData, postionData);
                
                var mp4ID = !isNaN(parseInt(targetProps["video_bg_id"])) ? parseInt(targetProps["video_bg_id"]) : "";
                var youtubeUrl = typeof targetProps["video_bg_url_youtube"] == "undefined" ? "" : targetProps["video_bg_url_youtube"];
                var vimeoUrl = typeof targetProps["video_bg_url_vimeo"] == "undefined" ? "" : targetProps["video_bg_url_vimeo"];
                var type = "";

                if (mp4ID != "") {
                    type = "mp4";
                } else if (vimeoUrl != "") {
                    type = "vimeo";
                } else if (youtubeUrl != "") {
                    type = "youtube";
                }

                var videoOptions = {
                    mp4Data: {
                        idMp4: mp4ID,
                        linkMp4: typeof targetProps["video_mp4_url"] == "undefined" ? "" : targetProps["video_mp4_url"],
                        width: isNaN(parseInt(targetProps["video_bg_width"])) ? parseInt(targetProps["video_bg_width"]) : "",
                        height: isNaN(parseInt(targetProps["video_bg_height"])) ? parseInt(targetProps["video_bg_height"]) : ""
                    },
                    vimeoUrl: vimeoUrl,
                    youtubeUrl: youtubeUrl,
                    audio: targetProps['video_has_audio'] == "1" || targetProps['video_has_audio'].toString() == "true" ? true : false,
                    typeVideo: type
                };

                Rexbuilder_Dom_Util.updateVideos($itemContent, videoOptions);

                var activeImage = typeof targetProps["image_bg_elem_active"] == "undefined" ? true : (targetProps["color_bg_block_active"].toString() == "true");

                var imageOptions = {
                    active: activeImage,
                    idImage: activeImage ? (!isNaN(parseInt(targetProps["id_image_bg"])) ? parseInt(targetProps["id_image_bg"]) : "") : "",
                    urlImage: activeImage ? targetProps["image_bg_url"] : "",
                    width: activeImage ? (!isNaN(parseInt(targetProps["image_width"])) ? parseInt(targetProps["image_width"]) : "") : "",
                    height: activeImage ? (!isNaN(parseInt(targetProps["image_height"])) ? parseInt(targetProps["image_height"]) : "") : "",
                    typeBGimage: activeImage ? targetProps["type_bg_image"] : "",
                    photoswipe: activeImage ? targetProps["photoswipe"] : "",
                }

                Rexbuilder_Dom_Util.updateImageBG($itemContent, imageOptions);

                var bgColorOpt = {
                    $elem: $elem,
                    color: targetProps["color_bg_block"],
                    active: typeof targetProps["color_bg_block_active"] == "undefined" ? true : targetProps["color_bg_block_active"].toString()
                }

                Rexbuilder_Dom_Util.updateBlockBackgroundColor(bgColorOpt);

                var overlayBlockOpt = {
                    $elem: $elem,
                    color: targetProps["overlay_block_color"],
                    active: typeof targetProps["overlay_block_color_active"] == "undefined" ? false : targetProps["overlay_block_color_active"].toString()
                }

                Rexbuilder_Dom_Util.updateBlockOverlay(overlayBlockOpt);

                Rexbuilder_Dom_Util.updateBlockPaddings($elem, _getPaddingsDataString(targetProps["block_padding"]));

                var newClasses = targetProps["block_custom_class"];
                var classList = [];
                if (newClasses != "") {
                    newClasses = newClasses.trim();
                    classList = newClasses.split(/\s+/);
                }
                Rexbuilder_Dom_Util.updateCustomClasses($elem, classList);

                var pos = targetProps["block_flex_position"].split(" ");

                var flexPosition = {
                    x: pos[0],
                    y: pos[1]
                }

                Rexbuilder_Dom_Util.updateFlexPostition($elem, flexPosition);

                for (var propName in targetProps) {
                    switch (propName) {
                        case "hide":
                            if (targetProps[propName].toString() == "true") {
                                $elem.addClass("rex-hide-element");
                            } else {
                                $elem.removeClass("rex-hide-element");
                            }
                            break;
                        case "type":
                            $itemData.attr('data-type', targetProps["type"]);
                            break;

                        case "size_x":
                            $elem.attr('data-width', targetProps["size_x"]);
                            break;

                        case "size_y":
                            $elem.attr('data-height', targetProps["size_y"]);
                            break;

                        case "row":
                            $elem.attr('data-row', targetProps["row"]);
                            break;

                        case "col":
                            $elem.attr('data-col', targetProps["col"]);
                            break;
                        case "photoswipe":
                            if (!Rexbuilder_Util.editorMode) {
                                if (targetProps["photoswipe"] == "true") {
                                    addPhotoSwipeElement($itemContent, targetProps['image_bg_block'], parseInt(targetProps['image_width']), parseInt(targetProps['image_height']), targetProps['image_size']);
                                    $section.addClass("photoswipe-gallery");
                                } else {
                                    removePhotoSwipeElement($itemContent);
                                }
                                $itemData.attr("data-photoswipe", targetProps["photoswipe"]);
                            }
                            break;
                        case "linkurl":
                            if (!Rexbuilder_Util.editorMode) {
                                var $linkEl = $itemContent.parents(".element-link");
                                if (targetProps["linkurl"] != "") {
                                    if ($linkEl.length != 0) {
                                        //console.log("already a link");
                                        $linkEl.attr("href", targetProps["linkurl"]);
                                        $linkEl.attr("title", targetProps["linkurl"]);
                                    } else {
                                        //console.log("not a block link");
                                        var $itemContentParent = $itemContent.parent();
                                        tmpl.arg = "link";
                                        $itemContentParent.append(tmpl("tmpl-link-block", {
                                            url: targetProps["linkurl"]
                                        }));
                                        var $link = $itemContentParent.children(".element-link");
                                        $itemContent.detach().appendTo($link);
                                    }
                                } else {
                                    if ($linkEl.length != 0) {
                                        $linkEl.children().unwrap();
                                    }
                                }
                            }
                            Rexbuilder_Dom_Util.updateBlockUrl($elem, targetProps["linkurl"]);
                            break;
                        case "zak_background":
                        case "zak_side":
                        case "zak_title":
                        case "zak_icon":
                        case "zak_foreground":
                            break;
                        case "block_animation":
                            break;
                        case "block_has_scrollbar":
                            break;
                        case "block_live_edited":
                            break;
                        case "overwritten":
                            $itemData.attr("data-custom_layout", targetProps["overwritten"].toString());
                            break;
                        default:
                            break;
                    }
                }
            } else{
                var $el =$gallery.children('div[data-rexbuilder-block-id="' + targetName + '"]');
                if($el.length !=0){
                    console.log("che me ne facico di lui");
//                    $el.remove();
                }
            }
        }

        updateSection($section, $gallery, targets[0].props, forceCollapseElementsGrid);

        if (galleryData !== undefined) {
            var galleryEditorInstance = $gallery.data().plugin_perfectGridGalleryEditor;
            if (galleryEditorInstance !== undefined) {
                galleryEditorInstance.commitGridstack();
                //brutto, ma per ora funziona, aspettiamo implementino un evento per il commit di gridstack
                setTimeout(function () {
                    galleryEditorInstance.properties.dispositionBeforeCollapsing = galleryEditorInstance.createActionDataMoveBlocksGrid();
                    galleryEditorInstance._createFirstReverseStack();
                    galleryEditorInstance._updateElementsSizeViewers();
                }, 400);
            }
        }
    }

    var _updateModelsLive = function (idModel, targets, editedModelNumber) {
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function (i, sec) {
            var $section = $(sec);
            if ($section.attr("data-rexlive-model-id") == idModel && $section.attr("data-rexlive-model-number") != editedModelNumber) {
                _updateDOMelements($section, targets, false);
            }
        });
    }

    var updateSection = function ($section, $gallery, targetProps, forceCollapseElementsGrid) {
        var $sectionData = $section.children(".section-data");

        var mp4ID = !isNaN(parseInt(targetProps["video_bg_id"])) ? parseInt(targetProps["video_bg_id"]) : "";
        var youtubeUrl = typeof targetProps["video_bg_url_section"] == "undefined" ? "" : targetProps["video_bg_url_section"];
        var vimeoUrl = typeof targetProps["video_bg_url_vimeo_section"] == "undefined" ? "" : targetProps["video_bg_url_vimeo_section"];
        var type = "";

        if (mp4ID != "") {
            type = "mp4";
        } else if (vimeoUrl != "") {
            type = "vimeo";
        } else if (youtubeUrl != "") {
            type = "youtube";
        }

        var videoOptions = {
            mp4Data: {
                idMp4: mp4ID,
                linkMp4: typeof targetProps["video_mp4_url"] == "undefined" ? "" : targetProps["video_mp4_url"],
                width: "",
                height: ""
            },
            vimeoUrl: vimeoUrl,
            youtubeUrl: youtubeUrl,
            audio: false,
            typeVideo: type
        };

        Rexbuilder_Dom_Util.updateSectionVideoBackground($section, videoOptions);

        var imageOptions = {
            active: typeof targetProps["image_bg_section_active"] == "undefined" ? true : targetProps["image_bg_section_active"].toString(),
            idImage: isNaN(parseInt(targetProps['id_image_bg_section'])) ? "" : parseInt(targetProps['id_image_bg_section']),
            urlImage: targetProps['image_bg_section'],
            width: parseInt(targetProps['image_width']),
            height: parseInt(targetProps['image_height'])
        }

        var sectionOverlay = {
            color: targetProps["row_overlay_color"],
            active: typeof targetProps["row_overlay_active"] == "undefined" ? false : targetProps["row_overlay_active"].toString()
        }

        Rexbuilder_Dom_Util.updateImageBG($section, imageOptions);

        var backgroundColorOpt = {
            color: targetProps["color_bg_section"],
            active: typeof targetProps["color_bg_section_active"] == "undefined" ? true : targetProps["color_bg_section_active"].toString()
        };

        Rexbuilder_Dom_Util.updateSectionBackgroundColor($section, backgroundColorOpt);

        Rexbuilder_Dom_Util.updateSectionOverlay($section, sectionOverlay);

        var margins = {
            top: isNaN(parseInt(targetProps["row_margin_top"])) ? 0 : parseInt(targetProps["row_margin_top"]),
            right: isNaN(parseInt(targetProps["row_margin_right"])) ? 0 : parseInt(targetProps["row_margin_right"]),
            bottom: isNaN(parseInt(targetProps["row_margin_bottom"])) ? 0 : parseInt(targetProps["row_margin_bottom"]),
            left: isNaN(parseInt(targetProps["row_margin_left"])) ? 0 : parseInt(targetProps["row_margin_left"])
        }

        Rexbuilder_Dom_Util.updateSectionMargins($section, margins);

        var rowSettings = {
            gutter: targetProps['block_distance'],
            row_separator_top: targetProps['row_separator_top'],
            row_separator_bottom: targetProps['row_separator_bottom'],
            row_separator_right: targetProps['row_separator_right'],
            row_separator_left: targetProps['row_separator_left'],
            full_height: targetProps['full_height'],
            layout: targetProps['layout'],
            section_width: targetProps['section_width'],
            dimension: targetProps['dimension'],
            collapse_grid: targetProps['collapse_grid'].toString() == "true" || forceCollapseElementsGrid,
        }

        Rexbuilder_Dom_Util.updateRow($section, $sectionData, $gallery, rowSettings);

        var newName = typeof targetProps['section_name'] == "undefined" ? "" : targetProps['section_name'];
        Rexbuilder_Dom_Util.updateSectionName($section, newName);
        $section.attr('data-type', targetProps['type']);

        var newClasses = targetProps["custom_classes"];
        var classList = [];
        if (newClasses != "") {
            newClasses = newClasses.trim();
            classList = newClasses.split(/\s+/);
        }
        Rexbuilder_Dom_Util.updateCustomClasses($section, classList);
    }

    var _updateElementDimensions = function ($elem, $elemData, posData) {
        console.log("dimensionsApplyed", posData);
        var x = parseInt(posData.x);
        var y = parseInt(posData.y);
        var w = parseInt(posData.w);
        var h = parseInt(posData.h);
        var startH = parseInt(posData.startH);
        if (typeof posData.gridstackInstance != "undefined") {
            posData.gridstackInstance.update($elem[0], x, y, w, h);
        } else {
            $elem.attr("data-gs-height", h);
            $elem.attr("data-gs-width", w);
            $elem.attr("data-gs-y", y);
            $elem.attr("data-gs-x", x);
        }
        $elemData.attr("data-gs_start_h", startH);
        $elemData.attr("data-gs_width", w);
        $elemData.attr("data-gs_height", h);
        $elemData.attr("data-gs_y", y);
        $elemData.attr("data-gs_x", x);
    }

    var addPhotoSwipeElement = function ($itemContent, url, w, h, t) {
        tmpl.arg = "image";
        var $gridstackItemContent = $itemContent.parents(".grid-stack-item-content");
        //console.log("checking if is already photoswipe");
        console.log("have to add photoswipe?");
        if ($itemContent.parents(".pswp-figure").length == 0) {
            console.log("yes?");

            //console.log("not");
            $itemContent.parent().prepend(tmpl("tmpl-photoswipe-block", {
                link: url,
                width: w,
                height: h,
                type: t
            }));
            var $pspwItem = $gridstackItemContent.find(".pswp-item");
            $itemContent.detach().appendTo($pspwItem)
        }
    }

    var removePhotoSwipeElement = function ($itemContent) {
        //console.log("removing photoswipe");
        //console.log($itemContent);
        var $pswpFigure = $itemContent.parents(".pswp-figure");
        //console.log($pswpFigure);
        if ($pswpFigure.length != 0) {
            //console.log("removing ps");
            var $pspwParent = $pswpFigure.parent();
            $itemContent.detach().appendTo($pspwParent);
            $pswpFigure.remove();
        }
    }

    var initPhotoSwipe = function (gallerySelector) {

        // parse slide data (url, title, size ...) from DOM elements 
        // (children of gallerySelector)
        var parseThumbnailElements = function (el) {
            //var thumbElements = el.childNodes,

            var thumbElements = $(el).find('.pswp-figure').get(),
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for (var i = 0; i < numNodes; i++) {

                figureEl = thumbElements[i]; // <figure> element

                // include only element nodes 
                if (figureEl.nodeType !== 1) {
                    continue;
                }

                linkEl = figureEl.children[0]; // <a> element

                size = linkEl.getAttribute('data-size').split('x');

                // create slide object
                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                if (figureEl.children.length > 1) {
                    // <figcaption> content
                    item.title = figureEl.children[1].innerHTML;
                }

                if (linkEl.children.length > 0) {
                    // <img> thumbnail element, retrieving thumbnail url
                    item.msrc = linkEl.children[0].getAttribute('data-thumburl');
                }

                item.el = figureEl; // save link to element for getThumbBoundsFn
                items.push(item);
            }

            return items;
        };

        // find nearest parent element
        var closest = function closest(el, fn) {
            return el && (fn(el) ? el : closest(el.parentNode, fn));
        };

        var collectionHas = function (a, b) { //helper function (see below)
            for (var i = 0, len = a.length; i < len; i++) {
                if (a[i] == b) return true;
            }
            return false;
        };

        var findParentBySelector = function (elm, selector) {
            var all = document.querySelectorAll(selector);
            var cur = elm.parentNode;
            while (cur && !collectionHas(all, cur)) { //keep going up until you find a match
                cur = cur.parentNode; //go up
            }
            return cur; //will return null if not found
        };

        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function (e) {
            e = e || window.event;

            // Bug fix for Block links and links inside blocks
            if ($(e.target).parents('.perfect-grid-item').find('.element-link').length > 0 || $(e.target).is('a')) {
                return;
            }

            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            var eTarget = e.target || e.srcElement;

            // find root element of slide
            var clickedListItem = closest(eTarget, function (el) {
                return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
            });

            if (!clickedListItem) {
                return;
            }

            // find index of clicked item by looping through all child nodes
            // alternatively, you may define index via data- attribute
            // var clickedGallery = clickedListItem.parentNode,
            //var clickedGallery = findParentBySelector(clickedListItem, '.my-gallery'),
            var clickedGallery = $(clickedListItem).parents(gallerySelector)[0],
                //childNodes = clickedListItem.parentNode.childNodes,
                childNodes = $(clickedGallery).find('.pswp-figure').get(),
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

            for (var i = 0; i < numChildNodes; i++) {
                if (childNodes[i].nodeType !== 1) {
                    continue;
                }

                if (childNodes[i] === clickedListItem) {
                    index = nodeIndex;
                    break;
                }
                nodeIndex++;
            }

            if (index >= 0) {
                // open PhotoSwipe if valid index found
                openPhotoSwipe(index, clickedGallery);
            }
            return false;
        };

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function () {
            var hash = window.location.hash.substring(1),
                params = {};

            if (hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if (!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if (pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if (params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        };

        var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

            items = parseThumbnailElements(galleryElement);

            // define options (if needed)
            options = {

                // define gallery index (for URL)
                galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                getThumbBoundsFn: function (index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    var thumbnail = items[index].el.getElementsByClassName('pswp-item-thumb')[0], // find thumbnail
                        image_content = items[index].el.getElementsByClassName('rex-custom-scrollbar')[0],
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = image_content.getBoundingClientRect(),
                        image_type = thumbnail.getAttribute('data-thumb-image-type');

                    if (image_type == 'natural') {

                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                    } else {
                        // var full_rect = items[index].el.getBoundingClientRect();
                        // return {x:full_rect.left, y:full_rect.top + pageYScroll, w:full_rect.width};;
                        return null
                    }
                },

                closeOnScroll: false,
                showHideOpacity: true
            };

            // PhotoSwipe opened from URL
            if (fromURL) {
                if (options.galleryPIDs) {
                    // parse real index when custom PIDs are used 
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if (isNaN(options.index)) {
                return;
            }

            if (disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it

            gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll(gallerySelector);

        for (var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i + 1);
            galleryElements[i].onclick = onThumbnailsClick;
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if (hashData.pid && hashData.gid) {
            openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
        }
    };

    // function to detect if we are on a mobile device
    var _detect_mobile = function () {
        if (!("ontouchstart" in document.documentElement)) {
            document.documentElement.className += " no-touch";
        } else {
            document.documentElement.className += " touch";
        }
    }

    // function to detect the viewport size
    var _viewport = function () {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width: e[a + 'Width'], height: e[a + 'Height'] };
    };

    // function to find the youtube id based on an url
    var getYoutubeID = function (url) {
        var ID;
        if (url.indexOf("youtu.be") > 0) {
            ID = url.substr(url.lastIndexOf("/") + 1, url.length);
        } else if (url.indexOf("http") > -1) {
            ID = url.match(/[\\?&]v=([^&#]*)/)[1];
        } else {
            ID = url.length > 15 ? null : url;
        }
        return ID;
    };

    // Get the value of a query variable from the actual url
    var _getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    };

    var _checkPresentationPage = function () {
        if (0 !== $('.rexpansive_portfolio_presentation').length) {
            return true;
        }
        return false;
    }

    var _checkStaticPresentationPage = function () {
        if (0 !== $('.rexpansive-static-portfolio').length) {
            return true;
        }
        return false;
    }

    var _checkPost = function () {
        if (0 !== $('#rex-article').length) {
            return true;
        }
        return false;
    }

    // find the animation/transition event names
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

    var addWindowListeners = function () {
        var firstResize = true;
        var timeout;
        Rexbuilder_Util.$window.on('resize', function (event) {
            if (!Rexbuilder_Util_Editor.elementIsResizing) {

                event.preventDefault();
                event.stopImmediatePropagation();
                event.stopPropagation();

                Rexbuilder_Util.windowIsResizing = true;
                if (firstResize) {
                    Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                        var galleryEditorInstance = $(this).data().plugin_perfectGridGalleryEditor;
                        if (galleryEditorInstance !== undefined) {
                            galleryEditorInstance.removeScrollbars();
                        }
                    });
                    firstResize = false;
                }

                clearTimeout(timeout);
                timeout = setTimeout(doneResizing, 1000);
            }
        });

        function doneResizing() {
            Rexbuilder_Util.windowIsResizing = true;
            if (Rexbuilder_Util.editorMode && !Rexbuilder_Util_Editor.buttonResized) {
                Rexbuilder_Util.windowIsResizing = false;
                return;
            }

            if (Rexbuilder_Util.editorMode) {
                Rexbuilder_Util_Editor.buttonResized = false;
                _edit_dom_layout(Rexbuilder_Util_Editor.clickedLayoutID);
            } else {
                _edit_dom_layout(chooseLayout());
            }

            if (Rexbuilder_Util.activeLayout != Rexbuilder_Util.oldLayout) {
                Rexbuilder_Util.oldLayout = Rexbuilder_Util.activeLayout;
            }

            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                var galleryEditorInstance = $(this).data().plugin_perfectGridGalleryEditor;
                if (galleryEditorInstance !== undefined) {
                    galleryEditorInstance.batchGridstack();
                }
            });

            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                var galleryEditorInstance = $(this).data().plugin_perfectGridGalleryEditor;
                if (galleryEditorInstance !== undefined) {
                    galleryEditorInstance._defineDynamicPrivateProperties();
                    galleryEditorInstance.updateGridstackStyles();
                    galleryEditorInstance.updateBlocksHeight();
                    galleryEditorInstance = undefined;
                }
            });

            Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
                var galleryEditorInstance = $(this).data().plugin_perfectGridGalleryEditor;
                if (galleryEditorInstance !== undefined) {
                    galleryEditorInstance.commitGridstack();
                    galleryEditorInstance.createScrollbars();
                }
            });

            Rexbuilder_Util.windowIsResizing = false;
            firstResize = true;
        }

    }

    var _stopBlockVideos = function ($elem) {
        _stopVideo($elem.find(".grid-item-content"));
    }
    var _playBlockVideos = function ($elem) {
        _playVideoFromBegin($elem.find(".grid-item-content"));
    }

    var _stopPluginsSection = function ($section) {
        console.log("have to stop videos");
        var $mp4Videos = $section.find(".mp4-player");
        var $vimeoVideos = $section.find(".vimeo-player");
        var $youtubeVideos = $section.find(".youtube-player");

        $.each($mp4Videos, function (i, video) {
            Rexbuilder_Util.stopVideo($(video));
        });

        $.each($vimeoVideos, function (i, video) {
            Rexbuilder_Util.stopVideo($(video));
        });

        $.each($youtubeVideos, function (i, video) {
            Rexbuilder_Util.stopVideo($(video));
        });
    }

    var _playPluginsSection = function ($section) {
        console.log("have to restrart videos");
        var $mp4Videos = $section.find(".mp4-player");
        var $vimeoVideos = $section.find(".vimeo-player");
        var $youtubeVideos = $section.find(".youtube-player");

        $.each($mp4Videos, function (i, video) {
            Rexbuilder_Util.playVideoFromBegin($(video));
        });

        $.each($vimeoVideos, function (i, video) {
            Rexbuilder_Util.playVideoFromBegin($(video));
        });

        $.each($youtubeVideos, function (i, video) {
            Rexbuilder_Util.playVideoFromBegin($(video));
        });
    }

    var _stopVideo = function ($target) {
        if ($target.hasClass("mp4-player")) {
            var mp4video = $target.children(".rex-video-wrap").find("video")[0];
            mp4video.currentTime = 0;
            mp4video.pause();
        } else if ($target.hasClass("vimeo-player")) {
            VimeoVideo.findVideo($target.children(".rex-video-vimeo-wrap").find("iframe")[0]).unload();
        } else if ($target.hasClass("youtube-player")) {
            if ($target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined) {
                return;
            }
            $target.children(".rex-youtube-wrap").YTPStop();
        }
    }

    var _playVideoFromBegin = function ($target) {
        if ($target.hasClass("mp4-player")) {
            var mp4video = $target.children(".rex-video-wrap").find("video")[0];
            mp4video.currentTime = 0;
            mp4video.play();
            var $toggle = $target.children("rex-video-toggle-audio");
            if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
                $(mp4video).prop('muted', false);
            } else {
                $(mp4video).prop('muted', true);
            }
        } else if ($target.hasClass("vimeo-player")) {
            var vimPlayer = VimeoVideo.findVideo($target.children(".rex-video-vimeo-wrap").find("iframe")[0]);
            vimPlayer.play();
            var $toggle = $target.children("rex-video-toggle-audio");
            if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
                // have to wait vimeo to be lunched
                setTimeout(function () {
                    vimPlayer.getVolume().then(function (volume) {
                        if (0 == volume) {
                            vimPlayer.setVolume(1);
                        }
                    });
                }, 500, vimPlayer);
            }
        } else if ($target.hasClass("youtube-player")) {
            var ytpObj = $target.children(".rex-youtube-wrap");
            var ytpPlayer = ytpObj.YTPGetPlayer();
            if (ytpPlayer === undefined) {
                return;
            }
            ytpObj.YTPPlay();
            var $toggle = $target.children("rex-video-toggle-audio");
            if ($toggle.length != 0 && !$toggle.hasClass("user-has-muted")) {
                ytpObj.YTPUnmute();
            } else {
                ytpObj.YTPMute();
            }
        }
    }

    var _destroyVideoPlugins = function () {
        //console.log(Rexbuilder_Util.$rexContainer.find(".youtube-player"));
    }

    var _launchVideoPlugins = function () {
        /* -- Launching YouTube Video -- */
        // declare object for video
        if (!jQuery.browser.mobile) {
            Rexbuilder_Util.$rexContainer.find(".rex-youtube-wrap").each(function (i, el) {
                var $this = $(el);
                if ($this.YTPGetPlayer() === undefined && !$this.hasClass("youtube-player-launching")) {
                    $this.YTPlayer();
                    return;
                }
                $this.removeClass("youtube-player-launching");
            });
        } else {
            Rexbuilder_Util.$rexContainer.find('.rex-youtube-wrap').each(function (i, el) {
                var $this = $(el),
                    data_yt = eval('(' + $this.attr('data-property') + ')'),
                    url = data_yt.videoURL,
                    id = getYoutubeID(url);

                $this.css('background-image', 'url(http://img.youtube.com/vi/' + id + '/0.jpg)');
                $this.click(function (e) {
                    e.preventDefault();
                    window.location.href = url;
                });

            });
            // $('.rex-video-wrap').getVideoThumbnail();
        }

        VimeoVideo.init();
    }

    var setContainer = function ($container) {
        this.$rexContainer = $container;
    }

	/**
	 * Javascript crossbrowser class search
	 * @param {node} el js element
	 * @param {string} c class name to find
	 * @since 1.1.3
	 */
    var _has_class = function (el, c) {
        if (el.classList) {
            return el.classList.contains(c);
        } else {
            return new RegExp('(^| )' + c + '( |$)', 'gi').test(el.className);
        }
    }
    var _transitionEvent = '';
    var _animationEvent = '';

    var _scroll_timing = 600;

    function _smoothScroll($target) {
        $('body,html').animate(
            { 'scrollTop': $target.offset().top + _plugin_frontend_settings.scroll_animation_offset },
            600
        );
    }

    var _getGalleryInstance = function ($section) {
        return $section.find(".grid-stack-row").data().plugin_perfectGridGalleryEditor;
    }

    var removeCollapsedGrids = function () {
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function () {
            if (Rexbuilder_Util.galleryPluginActive) {
                var galleryInstance = _getGalleryInstance($(this));
                Rexbuilder_Dom_Util.collapseGrid(galleryInstance, false, galleryInstance.properties.dispositionBeforeCollapsing, galleryInstance.properties.layoutBeforeCollapsing);
            }
        });
    }

    var collapseAllGrids = function () {
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function () {
            if (Rexbuilder_Util.galleryPluginActive) {
                var galleryInstance = _getGalleryInstance($(this));
                galleryInstance._defineDynamicPrivateProperties();
                galleryInstance.collapseElements();
            }
        });
    }

    var _startVideoPlugin = function ($target) {
        if ($target.hasClass("mp4-player")) {
            ;
        } else if ($target.hasClass("vimeo-player")) {
            var vimeoFrame = $target.children(".rex-video-vimeo-wrap").find("iframe")[0];
            var opt = {
                autoplay: true,
                background: true,
                loop: true
            };
            VimeoVideo.addPlayer("1", vimeoFrame, opt);
        } else if ($target.hasClass("youtube-player")) {
            if ($target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined) {
                $target.children(".rex-youtube-wrap").YTPlayer();
            }
        }
    }

    var _destroyVideo = function ($target, targetType, detachDom) {
        if ($target.hasClass("mp4-player")) {
            Rexbuilder_Dom_Util.removeMp4Video($target, targetType, detachDom);
        } else if ($target.hasClass("vimeo-player")) {
            Rexbuilder_Dom_Util.removeVimeoVideo($target, targetType, detachDom);
        } else if ($target.hasClass("youtube-player")) {
            Rexbuilder_Dom_Util.removeYoutubeVideo($target, targetType, detachDom);
        }
    }

    var _pauseVideo = function ($target) {
        if ($target.hasClass("mp4-player")) {
            $target.children(".rex-video-wrap").find("video")[0].pause();
        } else if ($target.hasClass("vimeo-player")) {
            var vimeoPlugin = VimeoVideo.findVideo($target.children(".rex-video-vimeo-wrap").find("iframe")[0]);
            vimeoPlugin.pause();
        } else if ($target.hasClass("youtube-player")) {
            if ($target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined) {
                return;
            }
            $target.children(".rex-youtube-wrap").YTPPause();
        }
    }

    //todo da finire ( non far partire video nascosti )
    var _playAllVideos = function () {
        console.log("playing all videos");
        return;
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function (i, section) {
            var $section = $(section);
            var $mp4Videos = $section.find(".mp4-player");
            var $vimeoVideos = $section.find(".vimeo-player");
            var $youtubeVideos = $section.find(".youtube-player");

            $.each($mp4Videos, function (i, video) {
                Rexbuilder_Util.playVideo($(video));
            });

            $.each($vimeoVideos, function (i, video) {
                Rexbuilder_Util.playVideo($(video));
            });

            $.each($youtubeVideos, function (i, video) {
                Rexbuilder_Util.playVideo($(video));
            });
        });
    }

    var _playVideo = function ($target) {
        if ($target.hasClass("mp4-player")) {
            $target.find("video")[0].play();
        } else if ($target.hasClass("vimeo-player")) {
            var vimeoPlugin = VimeoVideo.findVideo($target.find("iframe")[0]);
            vimeoPlugin.play();
        } else if ($target.hasClass("youtube-player")) {
            if ($target.children(".rex-youtube-wrap").YTPGetPlayer() === undefined) {
                return;
            }
            $target.children(".youtube-player").YTPPlay();
        }
    }

    var _getBackgroundUrlFromCss = function (styleBackground) {
        return styleBackground.replace('url(', '').replace(')', '').replace(/\"/gi, "");
    }

    var _getPaddingsDataString = function (paddingString) {
        var paddingsData = {
            top: "5",
            right: "5",
            bottom: "5",
            left: "5",
            type: "px",
        }
        if (paddingString != "") {
            var paddings = paddingString.split(/;/gm);
            paddingsData.top = parseInt(paddings[0].split(/\D+/gm)[0]);
            paddingsData.right = parseInt(paddings[1].split(/\D+/gm)[0]);
            paddingsData.bottom = parseInt(paddings[2].split(/\D+/gm)[0]);
            paddingsData.left = parseInt(paddings[3].split(/\D+/gm)[0]);

            var typePaddingActive = "";
            if (paddings[0].indexOf("%") != -1) {
                typePaddingActive = "%";
            } else {
                typePaddingActive = "px";
            }
            paddingsData.type = typePaddingActive;
        }
        return paddingsData;
    }

    var _paddingsToString = function (paddings) {
        var output = "";
        output += "" + paddings.top + paddings.type + ";";
        output += "" + paddings.right + paddings.type + ";";
        output += "" + paddings.bottom + paddings.type + ";";
        output += "" + paddings.left + paddings.type + ";";
        return output;
    }

    // init the utilities
    var init = function () {
        this.firstStart = true;
        _plugin_frontend_settings.scroll_animation_offset = 0;

        if (_plugin_frontend_settings.user.logged && _plugin_frontend_settings.user.editing) {
            this.editorMode = true;
        } else {
            this.editorMode = false;
        }

        this.$window = $(window);
        this.$body = $("body");

        this.$rexContainer = $(".rex-container");

        this.lastSectionNumber = -1;

        this.activeLayout = "";
        this.domUpdaiting = false;

        var oldResposiveBlockGrid = this.$rexContainer.children(".rexpansive_section").eq(0).attr("data-rex-collapse-grid");

        this.blockGridUnder768 = typeof oldResposiveBlockGrid != "undefined" ? oldResposiveBlockGrid.toString() == "false" : false;

        _updateSectionsID();

        this.chosenLayoutData = null;

        Rexbuilder_Dom_Util.fixModelNumbers();
        Rexbuilder_Dom_Util.fixModelNumbersSaving();
        var l = chooseLayout();
        _edit_dom_layout(l);
        this.oldLayout = l;

        _updateSectionsNumber();

        _detect_mobile();

        this._transitionEvent = _whichTransitionEvent();
        this._animationEvent = _whichAnimationEvent();

        this.scrollbarProperties = {
            //className: "rex-overlay-scrollbar", per quando dobbiamo stilare usiamo questa classe
            className: "os-theme-dark",
            overflowBehavior: { x: "hidden" },
            autoUpdate: false
        };
        this.galleryPluginActive = false;
        this.firstStart = false;
    }

    return {
        init: init,
        viewport: _viewport,
        getYoutubeID: getYoutubeID,
        transitionEvent: _transitionEvent,
        animationEvent: _animationEvent,
        getQueryVariable: _getQueryVariable,
        checkPresentationPage: _checkPresentationPage,
        checkStaticPresentationPage: _checkStaticPresentationPage,
        checkPost: _checkPost,
        $window: $window,
        scroll_timing: _scroll_timing,
        fixSectionWidth: fixSectionWidth,
        editorMode: editorMode,
        windowIsResizing: windowIsResizing,
        addWindowListeners: addWindowListeners,
        launchVideoPlugins: _launchVideoPlugins,
        destroyVideoPlugins: _destroyVideoPlugins,
        stopPluginsSection: _stopPluginsSection,
        playPluginsSection: _playPluginsSection,
        stopBlockVideos: _stopBlockVideos,
        playBlockVideos: _playBlockVideos,
        chooseLayout: chooseLayout,
        setContainer: setContainer,
        createSectionID: _createSectionID,
        createBlockID: createBlockID,
        has_class: _has_class,
        responsiveLayouts: responsiveLayouts,
        defaultLayoutSections: defaultLayoutSections,
        edit_dom_layout: _edit_dom_layout,
        smoothScroll: _smoothScroll,
        getGalleryInstance: _getGalleryInstance,
        removeCollapsedGrids: removeCollapsedGrids,
        collapseAllGrids: collapseAllGrids,
        stopVideo: _stopVideo,
        playVideoFromBegin: _playVideoFromBegin,
        pauseVideo: _pauseVideo,
        playVideo: _playVideo,
        destroyVideo: _destroyVideo,
        startVideoPlugin: _startVideoPlugin,
        getBackgroundUrlFromCss: _getBackgroundUrlFromCss,
        getPaddingsDataString: _getPaddingsDataString,
        paddingsToString: _paddingsToString,
        playAllVideos: _playAllVideos,
        findLayoutType: _findLayoutType,
        updateModelsLive: _updateModelsLive,
    };

})(jQuery);