/**
 * Row Fixed/Masonry Logic
 * 
 * @since 2.0.0
 */
var LayoutGrid_Modal = (function($) {
  "use strict";
  var section_layout_modal_properties;
  var sectionTarget;

  var _updateLayoutModal = function(data) {
    sectionTarget = data.sectionTarget;
    // _focusLayout(data.activeLayout);
    _setLayout(data.activeLayout);
  };

  var _clearLayoutModal = function() {
    _clearLayoutTypeSelection();
  };

  var _clearLayoutTypeSelection = function() {
    section_layout_modal_properties.$section_layout_typeWrap.each(function( i, el ) {
      $(el).removeClass("selected");
      $(el)
        .find("input")
        .attr("checked", false);
    });
  };

  var _focusLayout = function(layoutName) {
    var $layoutWrap = section_layout_modal_properties.$section_layout_types_wrap.children(
      '[data-rex-layout="' + layoutName + '"]'
    );
    $layoutWrap.addClass("selected");
    $layoutWrap.find("input").attr("checked", true);
  };

  var _setLayout = function(layoutName) {
    section_layout_modal_properties.$choose_layout.prop("checked", ( "fixed" == layoutName ? true : false ) );
  }

  /**
   * Get the choosed layout. Used with the radio buttons
   */
  var _getDataRadio = function() {
    var $wrapLayoutType =
      section_layout_modal_properties.$section_layout_types_wrap;
    var newLayout = $wrapLayoutType
      .children(".selected")
      .attr("data-rex-layout");
    var data = {
      layout: newLayout
    };
    return data;
  };

  var _getData = function() {
    var gridChecked = section_layout_modal_properties.$choose_layout.prop("checked");
    var data = {
      layout: ( true == gridChecked ? 'fixed' : 'masonry' )
    };
    return data;
  };

  var _applySectionLayout = function() {
    var layoutData = _getData();
    
    // Synch top toolbar tools
    Rexbuilder_Util_Admin_Editor.highlightRowSetData({
      'layout': layoutData.layout,
    });
    Rexbuilder_Util_Admin_Editor.updateLayoutTool();
    Rexbuilder_Util_Admin_Editor.updateLayoutCheckboxTool();

    var data_gallery = {
      eventName: "rexlive:set_gallery_layout",
      data_to_send: {
        sectionTarget: sectionTarget,
        layout: layoutData.layout
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_gallery);
  };

  var _linkDocumentListeners = function() {
    Rexlive_Base_Settings.$document.on(
      "click",
      "#modal-background-responsive-set .rexlive-layout-type",
      function(e) {
        e.preventDefault();
        _clearLayoutTypeSelection();
        var $layoutWrap = $(e.target).parents(".rexlive-layout-type");
        $layoutWrap.addClass("selected");
        $layoutWrap.find("input").attr("checked", true);
        _applySectionLayout();
      }
    );

    section_layout_modal_properties.$choose_layout.on("change", function(e) {
      // _clearLayoutTypeSelection();
      _applySectionLayout();
    });
  };

  var _init = function($container) {
    section_layout_modal_properties = {
      // Layout Grid Masonry
      $section_layout_typeWrap: $container.find(".rexlive-layout-type"),
      $section_layout_types_wrap: $container.find(".rex-edit-layout-wrap"),
      $choose_layout: $container.find(".builder-edit-row-layout-checkbox"),
      // $section_fixed: $container.find("#section-fixed"),
      // $section_masonry: $container.find("#section-masonry")
    };
    _linkDocumentListeners();
  };

  return {
    init: _init,
    getData: _getData,
    updateLayoutModal: _updateLayoutModal,
    applySectionLayout: _applySectionLayout,
    clearLayoutModal: _clearLayoutModal
  };
})(jQuery);
