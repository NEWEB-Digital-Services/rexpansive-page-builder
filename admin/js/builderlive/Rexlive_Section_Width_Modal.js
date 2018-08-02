var Section_Width_Modal = (function ($) {
    'use strict';

    var sectionWidthProperties;

    var oldSectionWidthData;
    var defaultSectionWidthData;

    var _resetOldWidthData = function () {
        oldSectionWidthData.dimension = "";
        oldSectionWidthData.sectionWidth = "";
        oldSectionWidthData.widthType = "";
    }

    var _updateSectionWidth = function (dimension, sectionWidth) {
        _clearSectionWidth();

        var widthType = "%";
        var width = "100";

        if (dimension != "full") {
            width = parseInt(sectionWidth);
            if (sectionWidth.indexOf("%") == -1) {
                widthType = "px";
            }
        }

        oldSectionWidthData.type = dimension;
        oldSectionWidthData.sectionWidth = width;
        oldSectionWidthData.dimension = widthType;

        sectionWidthProperties.$section_boxed_width.val(width);

        var $sectionWidthWrap = sectionWidthProperties.$section_width_type.children("[data-rex-section-width=\"" + dimension + "\"]");
        $sectionWidthWrap.addClass("selected");
        $sectionWidthWrap.find("input").attr("checked", true);

        var $sectionBoxedWidthTypeWrap = sectionWidthProperties.$section_boxed_width_wrap.children("[data-rex-section-width-type=\"" + widthType + "\"]");
        $sectionBoxedWidthTypeWrap.addClass("selected");
        $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);
    }

    var _clearSectionWidth = function () {
        sectionWidthProperties.$section_width_type_wrap.each(function (i, el) {
            $(el).removeClass("selected");
            $(el).find("input").attr("checked", false);
        });
        sectionWidthProperties.$section_boxed_width.val("");
    }

    var _clearSectionBoxedWidthType = function () {
        sectionWidthProperties.$section_boxed_width_wrap.children().each(function (i, el) {
            $(el).removeClass("selected");
            $(el).find("input").attr("checked", false);
        });
    }

    var _updateSectionBoxedWidthData = function (data) {
        _clearSectionBoxedWidthType();
        sectionWidthProperties.$section_boxed_width.val(data.sectionWidth);
        var $sectionBoxedWidthTypeWrap = sectionWidthProperties.$section_boxed_width_wrap.children("[data-rex-section-width-type=\"" + data.dimension + "\"]");
        $sectionBoxedWidthTypeWrap.addClass("selected");
        $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);
    }

    var _getData = function () {

        var section_width = sectionWidthProperties.$section_boxed_width.val();
        var section_width_boxed_type = sectionWidthProperties.$section_boxed_width_wrap.children(".selected").attr("data-rex-section-width-type");

        return {
            width: section_width,
            type: section_width_boxed_type
        }
    }

    var _linkDocumentListeners = function () {
        $(document).on("click", "#modal-background-responsive-set .boxed-width-type-wrap", function (e) {
            e.preventDefault();
            var wasFull = sectionWidthProperties.$section_width_type.children(".selected").attr("data-rex-section-width") == "full";
            _clearSectionBoxedWidthType();
            var $sectionBoxedWidthTypeWrap = $(e.target).parents(".boxed-width-type-wrap");
            $sectionBoxedWidthTypeWrap.addClass("selected");
            $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);

            if (wasFull && $sectionBoxedWidthTypeWrap.attr("data-rex-section-width-type") == "px") {
                _clearSectionWidth();
                var $sectionWidthWrap = sectionWidthProperties.$section_width_type.children("[data-rex-section-width=\"boxed\"]");
                $sectionWidthWrap.addClass("selected");
                $sectionWidthWrap.find("input").attr("checked", true);
                sectionWidthProperties.$section_boxed_width.val(defaultSectionWidthData.boxed.sectionWidth);
            }

        });

        $(document).on("click", "#modal-background-responsive-set .rexlive-section-width", function (e) {
            e.preventDefault();
            _clearSectionWidth();
            var $sectionWidthTypeWrap = $(e.target).parents(".rexlive-section-width");
            $sectionWidthTypeWrap.addClass("selected");
            $sectionWidthTypeWrap.find("input").attr("checked", true);
            var selectedType = $sectionWidthTypeWrap.attr("data-rex-section-width");
            if (selectedType != oldSectionWidthData.type) {
                if (selectedType == "boxed") {
                    _updateSectionBoxedWidthData(defaultSectionWidthData.boxed);
                } else {
                    _updateSectionBoxedWidthData(defaultSectionWidthData.full);
                }
            } else {
                _updateSectionBoxedWidthData(oldSectionWidthData);
            }
        });
    }

    var _init = function ($container) {
        sectionWidthProperties = {
            $section_width_type_wrap: $container.find(".rexlive-section-width"),
            $section_width_type: $container.find(".rex-edit-section-width"),
            $section_full: $container.find('#section-full-modal'),
            $section_boxed: $container.find('#section-boxed-modal'),
            $section_boxed_width: $container.find('.section-set-boxed-width'),
            $section_boxed_width_type: $container.find('.section-width-type'),
            $section_boxed_width_wrap: $container.find('.section-set-boxed-width-wrap'),
        }

        defaultSectionWidthData = {
            boxed: {
                type: "boxed",
                dimension: "%",
                sectionWidth: "80"
            },
            full: {
                type: "full",
                dimension: "%",
                sectionWidth: "100"
            }
        }

        oldSectionWidthData = {
            dimension: "",
            sectionWidth: "",
            widthType: ""
        };
        
        _linkDocumentListeners();
    }

    return {
        init: _init,
        resetOldWidthData: _resetOldWidthData,
        getData: _getData,
        clearSectionWidth: _clearSectionWidth,
        updateSectionWidth: _updateSectionWidth
    };

})(jQuery);