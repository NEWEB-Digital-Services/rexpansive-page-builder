var Rexbuilder_Dom_Util = (function ($) {
    'use strict';

    /**
     * 
     * @param {*} $section section to update
     * @param {*} $sectionData section data to update
     * @param {*} $galleryElement gallery element
     * @param {*} gutter distance between blocks
     * @param {*} separatorTop distance from top of section (px)
     * @param {*} separatorBottom distance from bottom of section (px)
     * @param {*} separatorRight distance from right of section (px)
     * @param {*} separatorLeft distance from left of section (px)
     * @param {*} fullHeight true if section has portrait height
     * @param {*} layout fixed or masonry
     * @param {*} sectionWidth width of grid (px or %)
     * @param {*} widthType full or boxed
     * @param {*} collapseElements true if elements have to collapse
     */
    var _updateRow = function ($section, $sectionData, $galleryElement, rowSettings) {

        console.log("data row received");
        console.log(rowSettings);
        console.log(rowSettings.gutter);
        console.log(typeof rowSettings.gutter === "undefined");

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
            collapseElements = typeof rowSettings.collapse_grid === "undefined" ? false : (rowSettings.collapse_grid == "true" ? true : false);

        var $galleryParent = $galleryElement.parent();

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

        switch (action.actionName) {
            case "updateSection":
                var galleryData = $galleryElement.data();
                if (galleryData !== undefined) {
                    var galleryEditorIstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
                    if (galleryEditorIstance !== undefined) {
                        console.log(flag ? "undoing" : "redoing");
                        galleryEditorIstance.updateGridSettingsModalUndoRedo(dataToUse);
                    }
                }
                break;
            case "updateSectionBlocksDisposition":

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
        performAction: _performAction
    };
})(jQuery);