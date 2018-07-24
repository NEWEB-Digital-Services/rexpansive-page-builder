var Rexbuilder_Dom_Util = (function ($) {
    'use strict';

    var _updateRow = function ($section, $sectionData, $galleryElement, rowSettings) {
        var
            gutter = typeof rowSettings.gutter === "undefined" ? 20 : parseInt(rowSettings.gutter),
            separatorTop = typeof rowSettings.row_separator_top === "undefined" ? gutter : parseInt(rowSettings.row_separator_top),
            separatorBottom = typeof rowSettings.row_separator_bottom === "undefined" ? gutter : parseInt(rowSettings.row_separator_bottom),
            separatorRight = typeof rowSettings.row_separator_right === "undefined" ? gutter : parseInt(rowSettings.row_separator_right),
            separatorLeft = typeof rowSettings.row_separator_left === "undefined" ? gutter : parseInt(rowSettings.row_separator_left),
            layout = typeof rowSettings.layout === "undefined" ? "fixed" : rowSettings.layout,
            fullHeight = typeof rowSettings.full_height === "undefined" || layout == "masonry" ? false : rowSettings.full_height,
            sectionWidth = typeof rowSettings.section_width === "undefined" ? "100%" : "" + rowSettings.section_width,
            widthType = typeof rowSettings.dimension === "undefined" ? "full" : rowSettings.dimension,
            collapseElements = typeof rowSettings.collapse_grid === "undefined" ? false : (rowSettings.collapse_grid.toString() == "true" ? true : false),
            $galleryParent = $galleryElement.parent();

        if (widthType == "full") {
            $galleryParent.removeClass("center-disposition");
            $galleryParent.addClass("full-disposition");
            $galleryParent.css("max-width", "100%");
        } else {
            $galleryParent.removeClass("full-disposition");
            $galleryParent.addClass("center-disposition");
            $galleryParent.css("max-width", sectionWidth);
        }

        $galleryElement.attr("data-separator", gutter);
        $galleryElement.attr("data-row-separator-top", separatorTop);
        $galleryElement.attr("data-row-separator-right", separatorRight);
        $galleryElement.attr("data-row-separator-bottom", separatorBottom);
        $galleryElement.attr("data-row-separator-left", separatorLeft);
        $galleryElement.attr("data-layout", layout);
        $galleryElement.attr("data-full-height", fullHeight);

        $sectionData.attr("data-section_width", sectionWidth);
        $sectionData.attr("data-dimension", widthType);
        $sectionData.attr("data-responsive_collapse", collapseElements);

        $section.attr("data-rex-collapse-grid", collapseElements);

        var galleryData = $galleryElement.data();
        if (galleryData !== undefined) {
            var galleryEditorIstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
            if (galleryEditorIstance !== undefined) {
                galleryEditorIstance.updateGridSettingsChangeLayout(rowSettings);
            }
        }

    }

    var _updateSectionMargins = function ($section, marginTop, marginBottom, marginRight, marginLeft) {
        var newMargins = "";
        newMargins += $.isEmptyObject(marginTop) ? 0 : marginTop;
        newMargins += "px ";
        newMargins += $.isEmptyObject(marginRight) ? 0 : marginRight;
        newMargins += "px ";
        newMargins += $.isEmptyObject(marginBottom) ? 0 : marginBottom;
        newMargins += "px ";
        newMargins += $.isEmptyObject(marginLeft) ? 0 : marginLeft;
        newMargins += "px";
        $section.css("margin", newMargins);
    }

    var _updateImageBG = function ($target, idImage, urlImage, w, h, type) {
        var $targetData = null;
        var targetType = "";
        if ($target.hasClass("rexpansive_section")) {
            $targetData = $target.children("section-data");
            targetType = "section";
            type = "";
        } else if ($target.hasClass("grid-item-content")) {
            $targetData = $target.parents(".grid-stack-item").children(".rexbuilder-block-data");
            targetType = "block";
        } else {
            $targetData = undefined;
            targetType = undefined;
            return;
        }
        if (idImage == "") {
            $targetData.attr('data-id_image_bg_' + targetType, "");
            $target.attr('data-background_image_width', "");
            $target.attr('data-background_image_height', "");

            $target.css("background-image", "");

            $target.removeClass("natural-image-background");
            $target.removeClass("full-image-background");
            $target.removeClass("small-width");

            $targetData.data("image_bg_" + targetType, "");
            $targetData.data("id_image_bg_" + targetType, "");
            $targetData.data("type_bg_" + targetType, "");
            $targetData.data("image_size", "");
        } else {
            if (idImage == parseInt($targetData.data("id_image_bg" + targetType))) {
                //same image
                return
            }
            $target.attr("style", "background-image: url('" + urlImage + "'); background-color: rgba(0, 0, 0, 0);");
            $target.attr('data-background_image_width', w);
            $target.attr('data-background_image_height', h);
            $targetData.attr('data-id_image_bg_' + targetType, idImage);
            $targetData.attr('data-type_bg_' + targetType, type);
            $targetData.attr('data-image_bg_' + targetType, urlImage);
            if (type == "natural") {
                $target.addClass("natural-image-background");
                $target.removeClass("full-image-background");
            } else {
                $target.addClass("full-image-background");
                $target.removeClass("natural-image-background");
            }
            $targetData.attr('data-image_size', type);
        }
    }

    var _updateBlocksLayout = function (dataToUse) {
        var blocksDimensions = dataToUse.blocks;
        var i;
        var x, y, w, h;
        var elem;
        var gridstack = dataToUse.gridstackInstance;
        if (!Rexbuilder_Util_Editor.updatingGridstack) {
            gridstack.batchUpdate();
        }
        for (i = 0; i < blocksDimensions.length; i++) {
            x = blocksDimensions[i].x;
            y = blocksDimensions[i].y;
            w = blocksDimensions[i].w;
            h = blocksDimensions[i].h;
            elem = blocksDimensions[i].elem;
            gridstack.update(elem, x, y, w, h);
        }
        if (!Rexbuilder_Util_Editor.updatingGridstack) {
            gridstack.commit();
        }
    }

    var _updateRemovingBlock = function ($elem, hasToBeRemoved, galleryEditorIstance) {
        if (hasToBeRemoved) {
            galleryEditorIstance.removeBlock($elem);
        } else {
            galleryEditorIstance.reAddBlock($elem);
        }
    };

    var _performAction = function (action, flag) {

        console.log("performing action");
        console.log(action);
        var dataToUse;

        if (flag) {
            dataToUse = action.performActionData;
            Rexbuilder_Util_Editor.redoActive = true;
        } else {
            dataToUse = action.reverseActionData;
            Rexbuilder_Util_Editor.undoActive = true;
        }

        var $galleryElement = Rexbuilder_Util.$rexContainer.children('.rexpansive_section[data-rexlive-section-id="' + action.sectionID + '"]').find(".grid-stack-row");
        var galleryData = $galleryElement.data();
        if (galleryData !== undefined) {
            var galleryEditorIstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
        }

        switch (action.actionName) {
            case "updateSection":
                if (galleryEditorIstance !== undefined) {
                    Rexbuilder_Util_Editor.updatingGridstack = true;
                    galleryEditorIstance.batchGridstack();

                    _updateBlocksLayout(dataToUse.blocksDisposition);
                    galleryEditorIstance.updateGridSettingsModalUndoRedo(dataToUse);
                    galleryEditorIstance.updateGridstackStyles(dataToUse.blocksDisposition.cellHeight);

                    galleryEditorIstance.commitGridstack();
                    Rexbuilder_Util_Editor.updatingGridstack = false;
                    galleryEditorIstance._updateElementsSizeViewers();
                }
                break;
            case "updateSectionBlocksDisposition":
                if (galleryEditorIstance !== undefined) {
                    _updateBlocksLayout(dataToUse);
                    galleryEditorIstance._updateElementsSizeViewers();
                }
                break;
            //Used to delete or recreate block
            case "updateBlockVisibility":
                if (galleryEditorIstance !== undefined) {
                    _updateRemovingBlock(dataToUse.targetElement, dataToUse.hasToBeRemoved, dataToUse.galleryInstance);
                }
                break;
            case "hideBlock":
                break;
            default:
                break;
        }

        Rexbuilder_Util_Editor.undoActive = false;
        Rexbuilder_Util_Editor.redoActive = false;
    }

    return {
        updateRow: _updateRow,
        updateSectionMargins: _updateSectionMargins,
        updateImageBG: _updateImageBG,
        performAction: _performAction
    };
})(jQuery);