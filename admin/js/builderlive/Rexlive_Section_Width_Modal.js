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

	var isEditingWidthValue = false;

  var _resetOldWidthData = function() {
    oldSectionWidthData.dimension = "";
    oldSectionWidthData.sectionWidth = "";
    oldSectionWidthData.widthType = "";
  };

  var updateSectionWidth = function(data) {
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
    $sectionWidthWrap.find("input").prop("checked", true);

    var $sectionBoxedWidthTypeWrap = sectionWidthProperties.$section_boxed_width_wrap.children(
      '[data-rex-section-width-type="' + widthType + '"]'
    );
    $sectionBoxedWidthTypeWrap.addClass("selected");
    $sectionBoxedWidthTypeWrap.find("input").prop("checked", true);
  };

  var _clearSectionWidth = function() {
    sectionWidthProperties.$section_width_type_wrap.each(function(i, el) {
      $(el).removeClass("selected");
      $(el)
        .find("input")
        .prop("checked", false);
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
				.prop("checked", false);
			});
  };

  var _updateSectionBoxedWidthData = function(data) {
		_clearSectionBoxedWidthType();

		sectionWidthProperties.$section_boxed_width_input.val(data.sectionWidth);

    var $sectionBoxedWidthTypeWrap = sectionWidthProperties.$section_boxed_width_wrap.children(
      '[data-rex-section-width-type="' + data.dimension + '"]'
    );
		$sectionBoxedWidthTypeWrap.addClass("selected");
    $sectionBoxedWidthTypeWrap.find("input").prop("checked", true);
  };

  var getData = function() {
    var section_width = sectionWidthProperties.$section_boxed_width_input.val();
    var section_width_boxed_type = sectionWidthProperties.$section_boxed_width_wrap
      .children(".selected")
      .attr("data-rex-section-width-type");

    return {
      width: section_width,
      type: section_width_boxed_type
    };
  };

  var applySectionWidth = function() {
		var section_width = sectionWidthProperties.$section_boxed_width_input.val();
    var section_width_boxed_type = sectionWidthProperties.$section_boxed_width_wrap
			.children(".selected")
			.attr("data-rex-section-width-type");

		isEditingWidthValue = false;

    // Synch top toolbar tools
    Rexbuilder_Util_Admin_Editor.highlightRowSetData({
      'section_width': section_width + section_width_boxed_type,
      'dimension': ( "100%" === ( section_width + section_width_boxed_type ) ? 'full' : 'boxed' )
    });
		Rexbuilder_Util_Admin_Editor.updateWidthTool();

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

  function _linkDocumentListeners() {
		Rexlive_Base_Settings.$document.on(
			'click',
			'#modal-background-responsive-set .boxed-width-type-wrap',
			onEditWidthType
		);

		Rexlive_Base_Settings.$document.on(
			'click',
			'#modal-background-responsive-set .rexlive-section-width',
			onSectionWidthType
		);

		Rexlive_Base_Settings.$document.get(0).addEventListener('click', onInputBlur);
		sectionWidthProperties.$section_boxed_width_input.keyup(onKeyUp);
		sectionWidthProperties.$section_boxed_width_input.keydown(onKeyDown);
	}

	/**
	 * @param {MouseEvent}	clickEvent
	 */
	function onEditWidthType(clickEvent) {
		clickEvent.preventDefault();
		isEditingWidthValue = true;

		var wasFull =
			sectionWidthProperties.$section_width_type.children('.selected').attr('data-rex-section-width') == 'full';

		_clearSectionBoxedWidthType();

		var $sectionBoxedWidthTypeWrap = $(clickEvent.target).parents('.boxed-width-type-wrap');
		$sectionBoxedWidthTypeWrap.addClass('selected');
		$sectionBoxedWidthTypeWrap.find('input').prop('checked', true);

		if (wasFull && $sectionBoxedWidthTypeWrap.attr('data-rex-section-width-type') == 'px') {
			_clearSectionWidth();

			var $sectionWidthWrap = sectionWidthProperties.$section_width_type.children('[data-rex-section-width="boxed"]');
			$sectionWidthWrap.addClass('selected');
			$sectionWidthWrap.find('input').prop('checked', true);
			sectionWidthProperties.$section_boxed_width_input.val(defaultSectionWidthData.boxed.sectionWidth);
		}

		_castToMinValue()
		// applySectionWidth();
	}

	/**
	 * @param {MouseEvent}	clickEvent
	 */
	function onSectionWidthType(clickEvent) {
		clickEvent.preventDefault();
		_clearSectionWidth();

		isEditingWidthValue = true;

		var $sectionWidthTypeWrap = $(clickEvent.target).parents(
			".rexlive-section-width"
		);
		$sectionWidthTypeWrap.addClass("selected");
		$sectionWidthTypeWrap.find("input").prop("checked", true);

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
		applySectionWidth();
	}

	/**
	 * @param {MouseEvent}	clickEvent
	 * @since	2.0.9
	 */
	function onInputBlur(clickEvent) {
		clickEvent.stopPropagation();

		var element = clickEvent.target;
		var hasInputParent = $(element).parents('.section-set-width').length !== 0 || element.matches('.section-set-width');

		if (hasInputParent || !isEditingWidthValue) return;

		_castToMinValue();
		applySectionWidth();
	}

	function onKeyUp(e) {
		if (!((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 8)) return;
		e.preventDefault();
	}

	function onKeyDown(e) {
		var $input = $(e.target);
		isEditingWidthValue = true;

		if (
			// Allow: backspace, delete, tab, enter and .
			$.inArray(e.keyCode, [46, 8, 9, 13, 110]) !== -1 ||
			// Allow: Ctrl+A, Command+A
			(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
			// Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40)
		) {
			if (e.keyCode == 8) return

			if (e.keyCode == 38) {
				// up
				e.preventDefault();
				$input.val(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) + 1);
			}

			if (e.keyCode == 40) {
				// down
				e.preventDefault();
				$input.val(Math.max(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) - 1, 0));
			}

			if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 8) {
				_castToMinValue();
			}

			return;
		}

		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}

		//escape
		if (e.keyCode == 27) {
			$input.blur();
		}
	}

	var minPercentage = 20;
	var minPixels = 320;

	function _castToMinValue() {
		var widthData = getData();
		var minToCheck = widthData.type === 'px' ? minPixels : minPercentage;

		if (widthData.width < minToCheck) {
			sectionWidthProperties.$section_boxed_width_input.val(minToCheck);
		}
	}

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
    getData: getData,
    clearSectionWidth: _clearSectionWidth,
    updateSectionWidth: updateSectionWidth,
    applySectionWidth: applySectionWidth
  };
})(jQuery);
