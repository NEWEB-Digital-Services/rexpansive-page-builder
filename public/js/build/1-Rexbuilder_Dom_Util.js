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
    var _updateRow = function ($section, $sectionData, $galleryElement, gutter, separatorTop, separatorBottom, separatorRight, separatorLeft, fullHeight, layout, sectionWidth, widthType, collapseElements) {
        /* 
        console.log("data row received");
        console.log(gutter, separatorTop, separatorBottom, separatorRight, separatorLeft, fullHeight, layout, sectionWidth, collapseElements);
         */
        gutter = $.isEmptyObject(gutter) ? 20 : parseInt(gutter);
        separatorTop = $.isEmptyObject(separatorTop) ? gutter : parseInt(separatorTop);
        separatorBottom = $.isEmptyObject(separatorBottom) ? gutter : parseInt(separatorBottom);
        separatorRight = $.isEmptyObject(separatorRight) ? gutter : parseInt(separatorRight);
        separatorLeft = $.isEmptyObject(separatorLeft) ? gutter : parseInt(separatorLeft);
        layout = $.isEmptyObject(layout) ? "fixed" : layout;
        fullHeight = $.isEmptyObject(fullHeight) || fullHeight == "undefined" || layout == "masonry" ? false : fullHeight;
        sectionWidth = $.isEmptyObject(sectionWidth) ? "100%" : "" + sectionWidth;
        widthType = $.isEmptyObject(widthType) ? "full" : widthType;
        collapseElements = $.isEmptyObject(collapseElements) ? false : (collapseElements == "true" ? true : false);

        var newSettings = {
            gutter: gutter,
            separatorTop: separatorTop,
            separatorBottom: separatorBottom,
            separatorRight: separatorRight,
            separatorLeft: separatorLeft,
            fullHeight: fullHeight,
            layout: layout,
            collapseElements: collapseElements
        }

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

        var galleryData = $galleryElement.data();
        if (galleryData !== undefined) {
            var galleryEditorIstance = $galleryElement.data().plugin_perfectGridGalleryEditor;
            if (galleryEditorIstance !== undefined) {
                galleryEditorIstance.updateGridSettings(newSettings, "domEditing");
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

    return {
        updateRow: _updateRow,
        updateSectionMargins: _updateSectionMargins
    };
})(jQuery);