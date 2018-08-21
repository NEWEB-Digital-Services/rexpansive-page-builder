var LayoutGrid_Modal = (function ($) {
    'use strict';
    var section_layout_modal_properties;

    var _updateLayoutModal = function (layout, fullHeight) {
        _focusLayout(layout);
        _updateFullHeight(fullHeight);
    }

    var _clearLayoutModal = function () {
        _clearLayoutTypeSelection();
        _clearFullHeight();
    }

    var _clearLayoutTypeSelection = function () {
        section_layout_modal_properties.$section_layout_typeWrap.each(function (i, el) {
            $(el).removeClass("selected");
            $(el).find("input").attr("checked", false);
        });
    }

    var _focusLayout = function (layoutName) {
        var $layoutWrap = section_layout_modal_properties.$section_layout_types_wrap.children("[data-rex-layout=\"" + layoutName + "\"]");
        $layoutWrap.addClass("selected");
        $layoutWrap.find("input").attr("checked", true);
    }

    var _clearFullHeight = function () {
        section_layout_modal_properties.$is_full.prop('checked', false);
    }

    var _updateFullHeight = function (active) {
        section_layout_modal_properties.$is_full.prop('checked', active == "true");
    }
    
    var _getData = function () {
        var $wrapLayoutType = section_layout_modal_properties.$section_layout_types_wrap;
        var newLayout = $wrapLayoutType.children(".selected").attr("data-rex-layout");
        var fullHeight = (true === section_layout_modal_properties.$is_full.prop('checked') ? 'true' : 'false');
        var data = {
            layout: newLayout,
            fullHeight: fullHeight
        };
        return data;
    }

    var _linkDocumentListeners = function () {
        $(document).on("click", "#modal-background-responsive-set .rexlive-layout-type", function (e) {
            e.preventDefault();
            _clearLayoutTypeSelection();
            var $layoutWrap = $(e.target).parents(".rexlive-layout-type");
            $layoutWrap.addClass("selected");
            $layoutWrap.find("input").attr("checked", true);
            Section_Modal.applySectionLayout();
        });
        
        section_layout_modal_properties.$is_full.click(function(){
            Section_Modal.applySectionLayout();
        });
    }

    var _init = function ($container) {
        section_layout_modal_properties = {

            // Layout Grid Masonry
            $section_layout_typeWrap: $container.find(".rexlive-layout-type"),
            $section_layout_types_wrap: $container.find('.rex-edit-layout-wrap'),
            $section_fixed: $container.find('#section-fixed'),
            $section_masonry: $container.find('#section-masonry'),

            // FULL height configuration
            $is_full: $container.find('#section-is-full'),
        }
        _linkDocumentListeners();
    }

    return {
        init: _init,
        getData: _getData,
        updateLayoutModal: _updateLayoutModal,
        clearLayoutModal: _clearLayoutModal
    };

})(jQuery);