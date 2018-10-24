/**
 * Row Full/Boxed logic
 * 
 * @since 2.0.0
 */
var Section_Width_Modal = (function($) {
  "use strict";

  var sectionWidthProperties;

  var oldSectionWidthData;
  var defaultSectionWidthData;
  var sectionTarget;

  var _resetOldWidthData = function() {
    oldSectionWidthData.dimension = "";
    oldSectionWidthData.sectionWidth = "";
    oldSectionWidthData.widthType = "";
  };

  var _updateSectionWidth = function(data) {
    _clearSectionWidth();

    sectionTarget = data.sectionTarget;
    var dimension = data.dimension;
    var sectionWidth = data.section_width;
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

    sectionWidthProperties.$section_boxed_width_input.val(width);

    var $sectionWidthWrap = sectionWidthProperties.$section_width_type.children(
      '[data-rex-section-width="' + dimension + '"]'
    );
    $sectionWidthWrap.addClass("selected");
    $sectionWidthWrap.find("input").attr("checked", true);

    var $sectionBoxedWidthTypeWrap = sectionWidthProperties.$section_boxed_width_wrap.children(
      '[data-rex-section-width-type="' + widthType + '"]'
    );
    $sectionBoxedWidthTypeWrap.addClass("selected");
    $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);

    console.log(data);
  };

  var _clearSectionWidth = function() {
    sectionWidthProperties.$section_width_type_wrap.each(function(i, el) {
      $(el).removeClass("selected");
      $(el)
        .find("input")
        .attr("checked", false);
    });
    sectionWidthProperties.$section_boxed_width_input.val("");
  };

  var _clearSectionBoxedWidthType = function() {
    sectionWidthProperties.$section_boxed_width_wrap
      .children()
      .each(function(i, el) {
        $(el).removeClass("selected");
        $(el)
          .find("input")
          .attr("checked", false);
      });
  };

  var _updateSectionBoxedWidthData = function(data) {
    _clearSectionBoxedWidthType();
    sectionWidthProperties.$section_boxed_width_input.val(data.sectionWidth);
    var $sectionBoxedWidthTypeWrap = sectionWidthProperties.$section_boxed_width_wrap.children(
      '[data-rex-section-width-type="' + data.dimension + '"]'
    );
    $sectionBoxedWidthTypeWrap.addClass("selected");
    $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);
  };

  var _getData = function() {
    var section_width = sectionWidthProperties.$section_boxed_width_input.val();
    var section_width_boxed_type = sectionWidthProperties.$section_boxed_width_wrap
      .children(".selected")
      .attr("data-rex-section-width-type");

    return {
      width: section_width,
      type: section_width_boxed_type
    };
  };

  var _applySectionWidth = function() {
    var section_width = sectionWidthProperties.$section_boxed_width_input.val();
    var section_width_boxed_type = sectionWidthProperties.$section_boxed_width_wrap
      .children(".selected")
      .attr("data-rex-section-width-type");
    var data_image = {
      eventName: "rexlive:set_section_width",
      data_to_send: {
        sectionWidth: {
          width: section_width,
          type: section_width_boxed_type
        },
        sectionTarget: sectionTarget
      }
    };

    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_image);
  };

  var _linkKeyDownListener = function($target) {
    $target.keydown(function(e) {
      var $input = $(e.target);
      // Allow: backspace, delete, tab, enter and .
      if (
        $.inArray(e.keyCode, [46, 8, 9, 13, 110]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)
      ) {
        // let it happen, don't do anything
        if (e.keyCode == 38) {
          // up
          e.preventDefault();
          $input.val(
            isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) + 1
          );
        }

        if (e.keyCode == 40) {
          //down
          e.preventDefault();
          $input.val(
            Math.max(
              isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) - 1,
              0
            )
          );
        }
        return;
      }

      // Ensure that it is a number and stop the keypress
      if (
        (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }

      //escape
      if (e.keyCode == 27) {
        $input.blur();
      }
    });
  };

  var _linkKeyUpListener = function($target) {
    $target.keyup(function(e) {
      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        e.keyCode == 38 ||
        e.keyCode == 40 ||
        e.keyCode == 8
      ) {
        e.preventDefault();
        _applySectionWidth();
      }
    });
  };

  var _linkDocumentListeners = function() {
    Rexlive_Base_Settings.$document.on(
      "click",
      "#modal-background-responsive-set .boxed-width-type-wrap",
      function(e) {
        e.preventDefault();
        var wasFull =
          sectionWidthProperties.$section_width_type
            .children(".selected")
            .attr("data-rex-section-width") == "full";
        _clearSectionBoxedWidthType();
        var $sectionBoxedWidthTypeWrap = $(e.target).parents(
          ".boxed-width-type-wrap"
        );
        $sectionBoxedWidthTypeWrap.addClass("selected");
        $sectionBoxedWidthTypeWrap.find("input").attr("checked", true);

        if (
          wasFull &&
          $sectionBoxedWidthTypeWrap.attr("data-rex-section-width-type") == "px"
        ) {
          _clearSectionWidth();
          var $sectionWidthWrap = sectionWidthProperties.$section_width_type.children(
            '[data-rex-section-width="boxed"]'
          );
          $sectionWidthWrap.addClass("selected");
          $sectionWidthWrap.find("input").attr("checked", true);
          sectionWidthProperties.$section_boxed_width_input.val(
            defaultSectionWidthData.boxed.sectionWidth
          );
        }
        //            Section_Modal.applySectionLayout();
        _applySectionWidth();
      }
    );

    Rexlive_Base_Settings.$document.on(
      "click",
      "#modal-background-responsive-set .rexlive-section-width",
      function(e) {
        e.preventDefault();
        _clearSectionWidth();
        var $sectionWidthTypeWrap = $(e.target).parents(
          ".rexlive-section-width"
        );
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
        //Section_Modal.applySectionLayout();
        _applySectionWidth();
      }
    );

    _linkKeyUpListener(sectionWidthProperties.$section_boxed_width_input);
    _linkKeyDownListener(sectionWidthProperties.$section_boxed_width_input);
  };

  var _init = function($container) {
    var $self = $container.find(".section-width-wrapper");
    sectionWidthProperties = {
      $self: $self,
      $section_width_type_wrap: $self.find(".rexlive-section-width"),
      $section_width_type: $self.find(".rex-edit-row-width"),
      $section_full: $self.find("#section-full-modal"),
      $section_boxed: $self.find("#section-boxed-modal"),
      $section_boxed_width_input: $self.find(".section-set-boxed-width"),
      $section_boxed_width_type: $self.find(".section-width-type"),
      $section_boxed_width_wrap: $self.find(".section-set-boxed-width-wrap")
    };

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
    };

    oldSectionWidthData = {
      dimension: "",
      sectionWidth: "",
      widthType: ""
    };

    _linkDocumentListeners();
  };

  return {
    init: _init,
    resetOldWidthData: _resetOldWidthData,
    getData: _getData,
    clearSectionWidth: _clearSectionWidth,
    updateSectionWidth: _updateSectionWidth,
    applySectionWidth: _applySectionWidth
  };
})(jQuery);
