/**
 * Util functions on RexLive
 * @since 2.0.0
 */
var Rexbuilder_Util_Editor = (function($) {
  "use strict";

  var undoStackArray;
  var redoStackArray;

  var setEndOfContenteditable = function(contentEditableElement) {
    var range, selection;
    if (document.createRange) {
      //Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange(); //Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection(); //get the selection object (allows you to change selection)
      selection.removeAllRanges(); //remove any selections already made
      selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) {
      //IE 8 and lower
      range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
      range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
      range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
      range.select(); //Select the range (make it the visible selection
    }
  };

  var _updateLayoutsAvaiable = function(newLayout, oldLayouts) {
    var availableLayoutsData = [];

    var i;
    for (i = 0; i < oldLayouts.length; i++) {
      var layout = oldLayouts[i];

      //se è presente aggiorno i dati del layout
      if (layout.id == newLayout.id) {
        if (layout.min != newLayout.min) {
          layout.min = newLayout.min;
        }
        if (layout.max != newLayout.max) {
          layout.max = newLayout.max;
        }
        if (layout.label != newLayout.label) {
          layout.label = newLayout.label;
        }
        newLayout.presente = true;
      }
      availableLayoutsData.push(layout);
    }

    if (typeof newLayout.presente == "undefined") {
      availableLayoutsData.push(newLayout);
    }
    return availableLayoutsData;
  };

  var _createDefaultCustomLayouts = function() {
    var layouts = [];

    var mobile = {
      id: "mobile",
      label: "Mobile",
      min: 320,
      max: 767,
      type: "standard"
    };
    var tablet = {
      id: "tablet",
      label: "Tablet",
      min: 768,
      max: 1024,
      type: "standard"
    };

    var defaultLayout = {
      id: "default",
      label: "My Desktop",
      min: 1025,
      max: "",
      type: "standard"
    };

    layouts.push(mobile);
    layouts.push(tablet);
    layouts.push(defaultLayout);

    return layouts;
  };

  var _createSliderData = function($sliderWrapper) {
    var auto_start =
      $sliderWrapper.attr("data-rex-slider-animation").toString() == "true";
    var prev_next =
      $sliderWrapper.attr("data-rex-slider-prev-next").toString() == "1";
    var dots = $sliderWrapper.attr("data-rex-slider-dots").toString() == "1";

    var data = {
      id: parseInt($sliderWrapper.attr("data-slider-id")),
      settings: {
        auto_start: auto_start,
        prev_next: prev_next,
        dots: dots
      },
      slides: []
    };

    var slides = $sliderWrapper.find(".rex-slider-element");

    for (var i = 0; i < slides.length; i++) {
      var $slide = $(slides[i]);

      var slide = {
        slide_image_id: "",
        slide_image_url: "",
        slide_url: "",
        slide_text: "",
        slide_video: "",
        slide_videoMp4Url: "",
        slide_video_audio: "",
        slide_video_type: ""
      };

      slide.slide_image_id = isNaN(
        parseInt($slide.attr("data-rex-slide-image-id"))
      )
        ? ""
        : parseInt($slide.attr("data-rex-slide-image-id"));

      var backgroundImageUrl = Rexbuilder_Util.getBackgroundUrlFromCss(
        $slide.css("background-image")
      );
      if (backgroundImageUrl != "none") {
        slide.slide_image_url = backgroundImageUrl;
      }

      var $linkDiv = $slide.children("a");
      if ($linkDiv.length != 0) {
        slide.slide_url = $linkDiv.attr("href");
      }

      var $textContent = $slide.find(".rex-slider-element-title");
      if ($textContent.length != 0) {
        if ($textContent.html().trim().length != 0) {
          slide.slide_text = $textContent.html();
        }
      }

      var $videoMp4Wrap = $slide.find(".mp4-player");
      var $videoVimeoWrap = $slide.find(".vimeo-player");
      var $videoYoutubeWrap = $slide.find(".youtube-player");

      if ($videoMp4Wrap.length != 0) {
        slide.slide_video = parseInt(
          $videoMp4Wrap
            .children(".rex-video-wrap")
            .attr("data-rex-video-mp4-id")
        );
        slide.slide_videoMp4Url = $videoMp4Wrap.find("source").attr("src");
        slide.slide_video_audio =
          $videoMp4Wrap.children(".rex-video-toggle-audio").length != 0;
        slide.slide_video_type = "mp4";
      }

      if ($videoVimeoWrap.length != 0) {
        var $iframe = $videoVimeoWrap.find("iframe");
        slide.slide_video = $iframe.attr("src").split("?")[0];
        slide.slide_video_audio =
          $videoVimeoWrap.children(".rex-video-toggle-audio").length != 0;
        slide.slide_video_type = "vimeo";
      }

      if ($videoYoutubeWrap.length != 0) {
        var $ytpPlayer = $videoYoutubeWrap.find(".rex-youtube-wrap");
        var elemData = jQuery.extend(
          true,
          {},
          eval("(" + $ytpPlayer.attr("data-property") + ")")
        );
        slide.slide_video = elemData.videoURL;
        slide.slide_video_audio =
          $videoYoutubeWrap.children(".rex-video-toggle-audio").length != 0;
        slide.slide_video_type = "youtube";
      }

      data.slides.push(slide);
    }
    return data;
  };

  var _generateElementNewIDs = function($elem, blockNumber, sectionNumber) {
    var newBlockID = "block_" + sectionNumber + "_" + blockNumber;
    var $elData = $elem.children(".rexbuilder-block-data");
    var newRexID = Rexbuilder_Util.createBlockID();

    $elem.attr("data-rexbuilder-block-id", newRexID);
    $elData.attr("data-rexbuilder_block_id", newRexID);
    $elem.attr("id", newBlockID);
    $elData.attr("data-id", newBlockID);
    $elData.attr("id", newBlockID + "-builder-data");
  };

  var _fixCopiedElementSlider = function($elem) {
    if ($elem.hasClass("block-has-slider")) {
      var $textWrap = $elem.find(".text-wrap");
      var blockID = $elem.attr("data-rexbuilder-block-id");
      var $oldSlider = $textWrap.children(
        '.rex-slider-wrap[data-rex-slider-active="true"]'
      );
      $textWrap.children().remove();
      var sliderData = Rexbuilder_Util_Editor.createSliderData($oldSlider);
      Rexbuilder_Util_Editor.saveSliderOnDB(sliderData, true, blockID);
    }
  };

  var _removeHandles = function($elem) {
    $elem.children(".ui-resizable-handle").each(function(i, handle) {
      $(handle).remove();
    });
  };

  var _removeScrollBar = function($elem) {
    var $elemContent = $elem.find(".grid-item-content");
    var $div = $(document.createElement("div"));
    var $divScrollbar = $elemContent.find(".rex-custom-scrollbar");
    var $textWrap = $elemContent.find(".text-wrap");

    $div.addClass("rex-custom-scrollbar");
    if ($elemContent.hasClass("rex-flexbox")) {
      $div.addClass("rex-custom-position");
    }
    $textWrap.detach().appendTo($div);
    $div.appendTo($divScrollbar.parent());
    $divScrollbar.remove();

    $elemContent = undefined;
    $div = undefined;
    $divScrollbar = undefined;
    $textWrap = undefined;
  };

  var _removeTextEditor = function($elem) {
    var $textWrap = $elem.find(".text-wrap");
    var textWrapContent;
    var $div;
    var css;

    if ($textWrap.length != 0 && $textWrap.hasClass("medium-editor-element")) {
      textWrapContent = $textWrap.html();
      $div = $(document.createElement("div"));
      css = $textWrap.attr("style");
      $div.appendTo($textWrap.parent());
      $div.addClass("text-wrap");
      if ($textWrap.hasClass("rex-content-resizable")) {
        $div.addClass("rex-content-resizable");
      }

      $textWrap.remove();
      $div.attr("style", css);
      $div.html(textWrapContent);
      $div.find(".text-editor-span-fix").remove();
      $div.find(".medium-insert-buttons").remove();
    }

    $textWrap = undefined;
    textWrapContent = undefined;
    $div = undefined;
    css = undefined;
  };

  var _removeColorPicker = function($elem) {
    $elem.find(".tool-button--spectrum").remove();
    $elem.find("input.spectrum-input-element").spectrum("destroy");
  };

  var _getTextWrapLength = function($elem) {
    var $textWrap = $elem.find(".text-wrap");
    var length = 0;

    var textHeight = 0;
    if ($textWrap.hasClass("medium-editor-element")) {
      var textCalculate = $textWrap.clone(false);
      textCalculate.children(".medium-insert-buttons").remove();
      length = textCalculate.text().trim().length;
      if (length != 0) {
        if (
          ($textWrap.hasClass("medium-editor-element") &&
            !$textWrap.hasClass("medium-editor-placeholder")) ||
          $textWrap.parents(".pswp-item").length != 0
        ) {
          textHeight = $textWrap.innerHeight();
        }
      }
    } else {
      length = $textWrap.text().trim().length;
      if (length != 0) {
        textHeight = $textWrap.innerHeight();
      }
    }

    return textHeight == 0 ? 0 : length;
  };

  var removeDeletedBlocks = function($gallery) {
    $gallery.children(".removing_block").each(function() {
      $(this).remove();
    });
  };

  var endEditingElement = function() {
    var galleryEditorInstance = Rexbuilder_Util_Editor.editedGallery;

    Rexbuilder_Util_Editor.elementIsDragging = false;
    Rexbuilder_Util_Editor.editedTextWrap.blur();

    galleryEditorInstance.unFocusElement(Rexbuilder_Util_Editor.editedElement);

    Rexbuilder_Util_Editor.editingGallery = false;
    Rexbuilder_Util_Editor.editedGallery = null;
    Rexbuilder_Util_Editor.editingElement = false;
    Rexbuilder_Util_Editor.editedElement = null;
    Rexbuilder_Util_Editor.editedTextWrap = null;
  };

  var startEditingElement = function() {
    if (
      Rexbuilder_Util_Editor.editingElement &&
      Rexbuilder_Util_Editor.editingGallery
    ) {
      var gallery = Rexbuilder_Util_Editor.editedGallery;
      var $elem = Rexbuilder_Util_Editor.editedElement;
      gallery.unFocusElementEditing($elem);
      gallery.properties.elementStartingH = parseInt(
        $elem.attr("data-gs-height")
      );
    }
  };

  var addWindowListeners = function() {
    Rexbuilder_Util.$window.click(function(e) {
      var $target = $(e.target);
      if (
        Rexbuilder_Util_Editor.editingElement &&
        $target.parents(".grid-stack-item").length == 0 &&
        $target.parents(".media-frame").length == 0 &&
        !$target.hasClass("grid-stack-item")
      ) {
        Rexbuilder_Util_Editor.activateElementFocus = false;
        Rexbuilder_Util_Editor.endEditingElement();
        Rexbuilder_Util_Editor.activateElementFocus = true;
      }
    });

    // if "ESC" pressed end editing element
    Rexbuilder_Util.$window.on("keydown", function(event) {
      if (Rexbuilder_Util_Editor.editingGallery && event.keyCode == 27) {
        Rexbuilder_Util_Editor.endEditingElement();
      }
    });

    // if "ESC" pressed tell the parent to close a window
    Rexbuilder_Util.$document.on('keydown', function(e) {
      if( e.keyCode === 27 ) {
        var data = {
          eventName: "rexlive:esc_pressed",
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }
    });

    // Caputre save page
    Rexbuilder_Util.$document.on('keydown', function(e) {
      if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
        e.preventDefault();
        // Process the event here (such as click on submit button)
        // SAVE PAGE
        var data = {
          eventName: "rexlive:savePageWithButton",
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }
    });

    Rexbuilder_Util.$window.on("mousedown", function(event) {
      Rexbuilder_Util_Editor.mouseDown = true;
      Rexbuilder_Util_Editor.mouseUp = false;
    });

    Rexbuilder_Util.$window.on("mouseup", function(event) {
      Rexbuilder_Util_Editor.mouseDown = false;
      Rexbuilder_Util_Editor.mouseUp = true;
    });

    Rexbuilder_Util.$window.on("load", function(e) {});

    Rexbuilder_Util.$window[0].addEventListener(
      "message",
      receiveMessage,
      false
    );

    function receiveMessage(event) {
      if (event.data.rexliveEvent) {
        var e = jQuery.Event(event.data.eventName);
        e.settings = {};
        jQuery.extend(e.settings, event.data);
        Rexbuilder_Util.$document.trigger(e);
      }
    }
  };

  var addDocumentListeners = function() {
    Rexbuilder_Util.$document.on("rexlive:changeLayout", function(event) {
      var data = event.settings;
      undoStackArray = [];
      redoStackArray = [];
      _clearSectionsEdited();
      Rexbuilder_Util.chosenLayoutData = jQuery.extend(
        true,
        {},
        data.layoutData
      );
      Rexbuilder_Util_Editor.buttonResized = true;
      Rexbuilder_Util_Editor.clickedLayoutID = data.selectedLayoutName;
      _fixToolsVisibility(data.selectedLayoutName);
    });

    Rexbuilder_Util.$document.on("rexlive:startChangeLayout", function(event) {
      _startLoading();
    });

    Rexbuilder_Util.$document.on("rexlive:updateLayoutsDimensions", function(e) {
      var data = e.settings.data_to_send;
      $("#layout-avaiable-dimensions").text(JSON.stringify(data.layouts));
      if (data.updateHeights) {
        Rexbuilder_Util.windowIsResizing = true;
        Rexbuilder_Util.updateGridsHeights();
        Rexbuilder_Util.windowIsResizing = false;
      }
    });

    Rexbuilder_Util.$document.on("rexlive:undo", function(e) {
      if (undoStackArray.length > 0) {
        var data = {
          eventName: "rexlive:edited",
          modelEdited: false
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        var action = undoStackArray.pop();
        Rexbuilder_Dom_Util.performAction(action, false);
        redoStackArray.push(action);
        
      }
      _sendUndoRedoInformation();
    });

    Rexbuilder_Util.$document.on("rexlive:redo", function(e) {
      if (redoStackArray.length > 0) {
        var action = redoStackArray.pop();
        Rexbuilder_Dom_Util.performAction(action, true);
        undoStackArray.push(action);
      }
      _sendUndoRedoInformation();
    });

    Rexbuilder_Util.$document.on("rexlive:galleryReady", function(e) {
      // console.log("Gallery " + e.galleryID + " ready");
    });

    Rexbuilder_Util.$document.on("rexlive:updateSlider", function(e) {
      var data = e.settings;
      Rexbuilder_Dom_Util.updateSliderStack(data.data_to_send);
    });

    Rexbuilder_Util.$document.on("rexlive:change_section_bg_color", function(e) {
      var data = e.settings;
      Rexbuilder_Dom_Util.updateSectionBackgroundColorLive(
        data.data_to_send.sectionTarget,
        data.data_to_send.color
      );
    });

    Rexbuilder_Util.$document.on("rexlive:change_section_overlay_color", function(e) {
      var data = e.settings;
      Rexbuilder_Dom_Util.updateSectionOverlayColorLive(
        data.data_to_send.sectionTarget,
        data.data_to_send.color
      );
    });

    Rexbuilder_Util.$document.on("rexlive:change_block_bg_color", function(e) {
      var data = e.settings;
      Rexbuilder_Dom_Util.updateBlockBackgroundColorLive(
        data.data_to_send.target,
        data.data_to_send.color
      );
    });

    Rexbuilder_Util.$document.on("rexlive:change_block_overlay_color", function(e) {
      var data = e.settings;
      Rexbuilder_Dom_Util.updateBlockOverlayColorLive(
        data.data_to_send.target,
        data.data_to_send.color
      );
    });

    Rexbuilder_Util.$document.on("rexlive:newSliderSavedOnDB", function(e) {
      var data = e.settings;
      Rexbuilder_CreateBlocks.createSlider(data.data_to_send);
    });

    Rexbuilder_Util.$document.on("rexlive:dropChanges", function(e) {
      Rexbuilder_Util_Editor.startLoading();
      var eventData = e.settings.data_to_send;
      _restorePageStartingState(eventData);
    });

    Rexbuilder_Util.$document.on("rexlive:lockRows", function(e) {
      _lockRows();
    });

    Rexbuilder_Util.$document.on("rexlive:unlockRows", function(e) {
      _releaseRows();
    });

    Rexbuilder_Util.$document.on("rexlive:close_modal", function(e) {
      _hideAllTools();
    });

    Rexbuilder_Util.$document.on("rexlive:openCreateModelModal", function(e) {
      var eventData = e.settings.data_to_send;
      $('.rexpansive_section[data-rexlive-section-id=' + eventData.sectionTarget.sectionID + ']').find('.open-model').trigger('click');
    });
  };

  var _hideAllTools = function() {
    Rexbuilder_Util_Editor.manageElement = false;
    // Rexbuilder_Util.$rexContainer.find('.rexpansive_section').removeClass('focusedRow').removeClass('activeRowTools').removeClass('highLightRow');
    Rexbuilder_Util.$rexContainer.find('.rexpansive_section').removeClass('focusedRow').removeClass('activeRowTools');
    Rexbuilder_Util.$rexContainer.find('.grid-stack-item').removeClass('focused');
    Rexbuilder_Util.$rexContainer.find('.tool-button-floating--active').removeClass('tool-button-floating--active');
  };

  var _pushAction = function($target, actionName, actionData, reverseData) {
    if ($target !== "document") {
      var ids = getIDs($target);
    } else {
      var ids = {
        sectionID: "",
        targetID: "",
        modelNumber: -1
      };
    }

    var action = {
      sectionID: ids.sectionID,
      targetID: ids.targetID,
      modelNumber: ids.modelNumber,
      actionName: actionName,
      performActionData: actionData,
      reverseActionData: reverseData
    };

    undoStackArray.push(action);
    redoStackArray = [];

    _sendUndoRedoInformation();
  };

  var _sendUndoRedoInformation = function() {
    var ur_data = {
      eventName: "rexlive:undoRedoStackChange",
      stacks: {
        undo: undoStackArray.length,
        redo: redoStackArray.length
      }
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(ur_data);
  };

  var getIDs = function($target) {
    var data = {
      sectionID: "",
      targetID: "",
      modelNumber: ""
    };

    var $section = $target.is("section")
      ? $target
      : $target.parents(".rexpansive_section");
    var $elem = $target.parents(".grid-stack-item");
    data.sectionID = $section.attr("data-rexlive-section-id");

    if ($section.hasClass("rex-model-section")) {
      data.modelNumber = $section.attr("data-rexlive-model-number");
    }

    if ($elem.length != 0) {
      data.targetID = $elem.attr("data-rexbuilder-block-id");
    } else {
      data.targetID = "self";
    }

    return data;
  };

  var _getStacks = function() {
    var stacks = {
      undo: undoStackArray,
      redo: redoStackArray
    };
    return stacks;
  };

  var sendParentIframeMessage = function(data) {
    var infos = {
      rexliveEvent: true
    };
    jQuery.extend(infos, data);
    window.parent.postMessage(infos, "*");
  };

  /**
   *
   * @param {*} className class name to add
   * @param {*} $targetData data of target (section or block)
   */
  var _addCustomClass = function(className, $targetData) {
    if (className != "") {
      _removeCustomClass(className, $targetData);
      var classes = "";
      if (!$targetData.parent().is("section")) {
        classes = $targetData.attr("data-block_custom_class");
      } else {
        classes = $targetData.attr("data-custom_classes");
      }

      classes += " " + className;
      classes = classes.trim();

      if (!$targetData.parent().is("section")) {
        $targetData.attr("data-block_custom_class", classes);
      } else {
        $targetData.attr("data-custom_classes", classes);
      }
    }
  };

  /**
   *
   * @param {*} className class name to remove
   * @param {*} $targetData data of target (section or block)
   */
  var _removeCustomClass = function(className, $targetData) {
    if (className != "") {
      var classes = "";
      if (!$targetData.parent().is("section")) {
        classes = $targetData.attr("data-block_custom_class");
      } else {
        classes = $targetData.attr("data-custom_classes");
      }

      className = _escapeRegExp(className);
      var expression =
        "(\\s" +
        className +
        "\\s|^" +
        className +
        "\\s|\\s" +
        className +
        "$|^" +
        className +
        "$)";
      var reg = new RegExp(expression, "g");
      classes = classes.replace(reg, " ");
      classes = classes.trim();

      if (!$targetData.parent().is("section")) {
        $targetData.attr("data-block_custom_class", classes);
      } else {
        $targetData.attr("data-custom_classes", classes);
      }
    }
  };

  var _escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  var _fixCustomStyleElement = function() {
    if (Rexbuilder_Util_Editor.$styleElement.length == 0) {
      var css = "",
        head = document.head || document.getElementsByTagName("head")[0],
        style = document.createElement("style");

      style.type = "text/css";
      style.id = "rexpansive-builder-style-inline-css";
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    }
  };

  /**
   * @param {*} sliderData Data of the slider
   * @param {*} newSliderFlag true if save as new slider, false otherwise
   */
  var _saveSliderOnDB = function(
    sliderData,
    newSliderFlag,
    newBlockID,
    targetToEdit
  ) {
    var data = {
      eventName: "rexlive:uploadSliderFromLive",
      sliderInfo: {
        slider: sliderData,
        newSlider: newSliderFlag,
        blockID: newBlockID,
        target: targetToEdit
      }
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  var _getElementsPhotoswipe = function($gallery) {
    var elementsPhotoswipe = [];
    $gallery
      .children(".grid-stack-item:not(.removing_block)")
      .each(function(i, el) {
        var $el = $(el);
        var $elData = $el.children(".rexbuilder-block-data");

        var elPW = {
          $data: $elData,
          photoswipe: false
        };

        if ($elData.attr("data-photoswipe").toString() == "true") {
          elPW.photoswipe = true;
        }

        elementsPhotoswipe.push(elPW);
      });

    return elementsPhotoswipe;
  };

  var _fixToolsVisibility = function(activeLayout) {
    if (activeLayout == "default") {
      Rexbuilder_Util.$rexContainer.removeClass("rex-hide-responsive-tools");
      Rexbuilder_Util.$rexContainer
        .parent()
        .removeClass("rex-hide-responsive-tools");
    } else {
      Rexbuilder_Util.$rexContainer
        .parent()
        .addClass("rex-hide-responsive-tools");
      Rexbuilder_Util.$rexContainer.addClass("rex-hide-responsive-tools");
    }
  };

  /**
   * Launch loading animation on the editor
   * @since 2.0.0
   */
  var _startLoading = function(animate_contents) {
    animate_contents =
      typeof animate_contents !== "undefined" ? animate_contents : true;

    if (animate_contents) {
      Rexbuilder_Util.$rexContainer
        .parent()
        .addClass("rexbuilder-live-content--loading");
      // Rexbuilder_Util.$loader.addClass('active').addClass('fade-in');
      Rexbuilder_Util.$rexContainer
        .addClass("fade-out")
        .one(Rexbuilder_Util._animationEvent, function() {
          Rexbuilder_Util.$rexContainer
            .css("opacity", "0")
            .removeClass("fade-out");
          var data = {
            eventName: "rexlive:animateContentsFadeOutEnd",
          };
          Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        });
    }

    // if( animate_blocks ) {
    //     Rexbuilder_Util.$rexContainer.find('.grid-stack-item').addClass('fade-out');
    // }
  };

  /**
   * Ending loading animation on the editor
   * @since 2.0.0
   */
  var _endLoading = function(animate_contents) {
    animate_contents =
      typeof animate_contents !== "undefined" ? animate_contents : true;

    if (animate_contents) {
      // Rexbuilder_Util.$loader.addClass('fade-out').one(Rexbuilder_Util._animationEvent, function() {
      //     Rexbuilder_Util.$loader.removeClass('active fade-out fade-in');
      // });
      Rexbuilder_Util.$rexContainer
        .addClass("fade-in")
        .one(Rexbuilder_Util._animationEvent, function() {
          Rexbuilder_Util.$rexContainer
            .css("opacity", "")
            .removeClass("fade-in");
          Rexbuilder_Util.$rexContainer
            .parent()
            .removeClass("rexbuilder-live-content--loading");
          var data = {
            eventName: "rexlive:animateContentsEnd",
          };
          Rexbuilder_Util_Editor.sendParentIframeMessage(data);
        });
    }
  };

  var _clearSectionsEdited = function() {
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i, sec) {
        var $section = $(sec);
        $section.attr("data-rexlive-section-edited", false);
        $section
          .find(".grid-stack-row")
          .attr("data-rexlive-layout-changed", false);
        $section
          .find(".grid-stack-item")
          .attr("data-rexlive-element-edited", false);
      });
  };

  var _restorePageStartingState = function(eventData) {
    if (Rexbuilder_Util.$rexContainer.hasClass("editing-model")) {
      var $button = Rexbuilder_Util.$rexContainer
        .find(".rex-model-section .update-model-button.unlocked")
        .eq(0);
      Rexbuilder_Dom_Util.updateLockEditModel($button, true);
      Rexbuilder_Util.$rexContainer.removeClass("editing-model");
    }
    var data = {
      eventName: "rexlive:restoreStateEnded",
      buttonData: eventData.buttonData
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  var _lockRows = function() {
    Rexbuilder_Util.$rexContainer
      .children(".rexpansive_section")
      .each(function(i, sec) {
        var $sec = $(sec);
        $sec.wrap("<div></div>");
        $sec.parent().attr("style", "position:relative;");
        $sec.parent().append(tmpl("tmpl-div-lock-section", {}));
      });
  };
  var _releaseRows = function() {
    Rexbuilder_Util.$rexContainer
      .find(".rexpansive_section")
      .each(function(i, sec) {
        var $sec = $(sec);
        $sec.siblings().each(function(j, sib) {
          var $sib = $(sib);
          if ($sib.hasClass("rexpansive-lock-section")) {
            $sib.remove();
          }
        });
        $sec.unwrap();
      });
  };

  var _tooltips = function() {
    var collection = tippy(".tippy", {
      arrow: true,
      arrowType: "round",
      size: "small",
      // content: 'Shared content',
      // target: '.tippy',
      // livePlacement: false,
      theme: "rexlive"
    });
  };

  var _checkVisibleRow = function() {
    var ruleTop = document.createElement('div');
    var ruleBottom = document.createElement('div');

    ruleTop.className = 'ruleTop';
    ruleTop.style.width = '100%';
    ruleTop.style.backgroundColor = 'red';
    ruleTop.style.position = 'fixed';
    ruleTop.style.left = '0';
    ruleTop.style.height = '4px';
    ruleTop.style.zIndex = '2000';

    ruleTop.className = 'ruleBottom';
    ruleBottom.style.width = '100%';
    ruleBottom.style.backgroundColor = 'red';
    ruleBottom.style.position = 'fixed';
    ruleBottom.style.left = '0';
    ruleBottom.style.height = '4px';
    ruleBottom.style.zIndex = '2000';

    // document.getElementsByTagName('body')[0].append(ruleTop);
    // document.getElementsByTagName('body')[0].append(ruleBottom);

    Rexbuilder_Util_Editor.visibleRow = whichVisible();
    var visibleRowInfo = {};
    if( null !== Rexbuilder_Util_Editor.visibleRow ) {
      var sectionData = $(Rexbuilder_Util_Editor.visibleRow).find('.section-data')[0];   // corresponds to .section-data div
      visibleRowInfo = _rowAttrsObj( sectionData );
      visibleRowInfo.collapse = Rexbuilder_Util_Editor.visibleRow.getAttribute('data-rex-collapse-grid');
    }

    Rexbuilder_Util_Editor.visibleRowInfo = {
      sectionID: ( null !== Rexbuilder_Util_Editor.visibleRow ? Rexbuilder_Util_Editor.visibleRow.getAttribute('data-rexlive-section-id') : null ),
      modelNumber: ( null !== Rexbuilder_Util_Editor.visibleRow ? ( typeof Rexbuilder_Util_Editor.visibleRow.getAttribute("data-rexlive-model-number") != "undefined" ? Rexbuilder_Util_Editor.visibleRow.getAttribute("data-rexlive-model-number") : "" ) : null ),
      modelEditing: ( null !== Rexbuilder_Util_Editor.visibleRow ? ( typeof Rexbuilder_Util_Editor.visibleRow.getAttribute("data-rexlive-model-editing") != "undefined" ? Rexbuilder_Util_Editor.visibleRow.getAttribute("data-rexlive-model-editing") : "" ) : null ),
    };

    var data = {
      eventName: "rexlive:traceVisibleRow",
      sectionTarget: Rexbuilder_Util_Editor.visibleRowInfo,
      rowInfo: visibleRowInfo
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);

    // $(Rexbuilder_Util_Editor.visibleRow).addClass('activeRowTools');
    $(Rexbuilder_Util_Editor.visibleRow).addClass('highLightRow');

    var didScrollHighlightEvent = false;
    var didScrollViewTopToolsEvent = false;
    
    $(window).on("scroll", function(e) {
      didScrollHighlightEvent = true;
      didScrollViewTopToolsEvent = true;
    });

    /**
     * Setting interval to highlight the visible section
     */
    setInterval(function() {
      if(didScrollHighlightEvent) {
        var el = whichVisible();
        if( null !== el && Rexbuilder_Util_Editor.visibleRow !== el ) {
          _traceVisibileRow(el);
        }
        didScrollHighlightEvent = false;
      }
    },250);

    function whichVisible() {
      var win_height = $(window).height(),
        win_height_padded_bottom,
        win_height_padded_top;
      win_height_padded_bottom = win_height * 0.8;
      win_height_padded_top = win_height * 0.3;

      ruleTop.style.top = win_height_padded_top + 'px';
      ruleBottom.style.top = win_height_padded_bottom + 'px';
      
      var spotted = null;
      
      $(".rexpansive_section").each(function(i,el) {
        var $element = $(el);
        var elementPositionTop = $element.offset().top,
          elementHeight = $element.height(),
          scrolled = $(window).scrollTop();
      
        if ( ( elementPositionTop - win_height_padded_bottom < scrolled ) && ( ( elementPositionTop + elementHeight ) - win_height_padded_top > scrolled ) ) {
          spotted = el;
          return false;
        }
      });
      return spotted;
    }

    setInterval(function() {
      if( didScrollViewTopToolsEvent && !Rexbuilder_Util.$rexContainer.hasClass("forced-top-tools") ) {
        didScrollViewTopToolsEvent = false;
        var elementPositionTop = Rexbuilder_Util.$rexContainer.offset().top,
          elementHeight = Rexbuilder_Util.$rexContainer.height(),
          scrolled = $(window).scrollTop();
        if( elementPositionTop < scrolled && ( elementPositionTop + elementHeight ) > scrolled ) {
          var data = {
            eventName: "rexlive:viewTopFastTools",
          };
        } else {
          var data = {
            eventName: "rexlive:hideTopFastTools",
          };
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }
    }, 250);

    var $highlightedRow;

    Rexbuilder_Util.$rexContainer.on("mouseenter", ".rexpansive_section", function(e) {
      var $thisRow = $(this);
      if( $thisRow.hasClass("highLightRow") ) {
        
        // Rexbuilder_Util.$rexContainer.addClass("forced-top-tools");
        // var data = {
        //   eventName: "rexlive:hideTopFastTools",
        // };
        // Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      } else {
        $highlightedRow = Rexbuilder_Util.$rexContainer.find(".rexpansive_section.highLightRow");
        $highlightedRow.removeClass("highLightRow");
        Rexbuilder_Util.$rexContainer.addClass("forced-top-tools");
        var data = {
          eventName: "rexlive:hideTopFastTools",
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }
    });

    Rexbuilder_Util.$rexContainer.on("mouseleave", ".rexpansive_section", function(e) {
      var $thisRow = $(this);
      if( $thisRow.hasClass("highLightRow") ) {
        // var data = {
        //   eventName: "rexlive:viewTopFastTools",
        // };
        // Rexbuilder_Util_Editor.sendParentIframeMessage(data);

        // Rexbuilder_Util.$rexContainer.removeClass("forced-top-tools");
      } else {
        $highlightedRow.addClass("highLightRow");
        var data = {
          eventName: "rexlive:viewTopFastTools",
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);

        Rexbuilder_Util.$rexContainer.removeClass("forced-top-tools");
      }
    });
  };

  /**
   * Get all the usefull row data
   * @param {HTML Node} el row data
   * @since 2.0.0
   */
  var _rowAttrsObj = function(el) {
    var obj = {};
    var attrsMap = el.attributes;
    for( var i=0; i < attrsMap.length; i++ ) {
      if( 'class' !== attrsMap[i].name && 'style' !== attrsMap[i].name ) {
        obj[attrsMap[i].name.replace('data-','')] = attrsMap[i].value;
      }
    }
    return obj;
  };

  /**
   * Set a row to visibile: add highligthing, collect information, 
   * send information to parent and set top fast tools to visible
   * @param {NodeElement} el row to set visible
   * @since 2.0.0
   */
  var _traceVisibileRow = function(el) {
    // $(".rexpansive_section").removeClass('activeRowTools');
    // $(el).addClass('activeRowTools');
    $(".rexpansive_section").removeClass('highLightRow');
    $(el).addClass('highLightRow');

    Rexbuilder_Util_Editor.visibleRow = el;
    Rexbuilder_Util_Editor.visibleRowInfo = {
      sectionID: el.getAttribute('data-rexlive-section-id'),
      modelNumber: typeof el.getAttribute("data-rexlive-model-number") != "undefined" ? el.getAttribute("data-rexlive-model-number") : "",
      modelEditing: typeof el.getAttribute("data-rexlive-model-editing") != "undefined" ? el.getAttribute("data-rexlive-model-editing") : "",
    };

    var visibleRowInfo = {};
    var sectionData = $(el).find('.section-data')[0];   // corresponds to .section-data div
    visibleRowInfo = _rowAttrsObj( sectionData );
    visibleRowInfo.collapse = el.getAttribute('data-rex-collapse-grid');

    var data = {
      eventName: "rexlive:traceVisibleRow",
      sectionTarget: Rexbuilder_Util_Editor.visibleRowInfo,
      rowInfo: visibleRowInfo
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  var _isElVisible = function( $el ) {
    var elementPositionTop = $el.offset().top,
      elementHeight = $el.height(),
      scrolled = $(window).scrollTop();
    if( elementPositionTop < scrolled && ( elementPositionTop + elementHeight ) > scrolled ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Tell the parent that the user edit the builder
   * @param {bool} isModelEdited have we edited a model
   */
  var _builderEdited = function( isModelEdited ) {
    isModelEdited = 'undefined' !== typeof isModelEdited ? isModelEdited : false;
    var data = {
      eventName: "rexlive:edited",
      modelEdited: isModelEdited
    };
    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  /**
   * Gets the mouse event click and returns the x,y coordinates of the pointer
   * If no valid event is passed, get a global value set on editor click
   * else gets the middle of the screen
   * @param {MouseEvent} mEvent event of the click of the mouse
   * @param {Object} target_info dimensione information for the block clicked
   * @returns {Object} the x,y coordinates
   * @since 2.0.0
   */
  var _getMousePosition = function( mEvent, target_info ) {
    var mousePosition = {};
    if( "undefined" !== typeof mEvent.clientX && "undefined" !== typeof mEvent.clientY && "undefined" !== typeof mEvent.offsetX && "undefined" !== typeof mEvent.offsetY && "undefined" !== typeof target_info ) {
      var pos = mEvent.target.getBoundingClientRect();
      mousePosition = {
        x: pos.left + ( target_info.offset.w / 2 ),
        y: pos.top + Rexbuilder_Util_Editor.mousePositionFrameYOffset,
      }
    } else if( null !== Rexbuilder_Util_Editor.mousePosition && null !== Rexbuilder_Util_Editor.mouseClickObject ) {
      mousePosition = {
        x: Rexbuilder_Util_Editor.mousePosition.client.x - Rexbuilder_Util_Editor.mousePosition.offset.x + ( Rexbuilder_Util_Editor.mouseClickObject.offset.w / 2 ),
        y: Rexbuilder_Util_Editor.mousePosition.client.y - Rexbuilder_Util_Editor.mousePosition.offset.y + Rexbuilder_Util_Editor.mousePositionFrameYOffset,
      };

      Rexbuilder_Util_Editor.mousePosition = null;
      Rexbuilder_Util_Editor.mouseClickObject = null;
    } else {
      mousePosition = {
        x: Rexbuilder_Util_Editor.viewportMeasurement.width/2,
        y: Rexbuilder_Util_Editor.viewportMeasurement.height/2,
      };
    }
    return mousePosition;
  };

  var _checkNewEmptyPage = function() {
    var $rows = Rexbuilder_Util.$rexContainer.find(".rexpansive_section:not(removing_section)");
    if( "1" == $rows.length && $rows.hasClass('empty-section') ) {
      Rexbuilder_Util.$rexContainer.parent().addClass('add-new-section--hide');
    } else {
      Rexbuilder_Util.$rexContainer.parent().removeClass('add-new-section--hide');
    }
  };

  var init = function() {
    this.elementIsResizing = false;
    this.elementIsDragging = false;

    this.sectionCopying = false;

    this.blockCopying = false;

    this.editingGallery = false;
    this.editingElement = false;
    this.manageElement = false;

    this.editedGallery = null;
    this.editedElement = null;
    this.editedTextWrap = null;

    this.activateElementFocus = false;

    this.mouseDownEvent = null;
    this.mouseUpEvent = null;

    this.mouseDown = false;
    this.mouseUp = false;

    this.mousePosition = null;
    this.mouseClickObject = null;
    this.mousePositionFrameYOffset = 50;
    this.viewportMeasurement = Rexbuilder_Util.viewport();

    this.elementDraggingTriggered = false;

    this.focusedElement = null;

    this.hasResized = false;
    this.buttonResized = false;
    this.clickedLayoutID = "";
    this.undoActive = false;
    this.redoActive = false;

    this.updatingGridstack = false;

    this.addingNewBlocks = false;
    this.removingBlocks = false;

    this.updatingImageBg = false;
    this.updatingPaddingBlock = false;

    this.updatingCollapsedGrid = false;
    this.updatingSectionWidth = false;
    this.updatingSectionLayout = false;

    this.savingPage = false;
    this.savingModel = false;

    this.openingModel = false;
    this.insertingModel = false;

    this.visibleRow = null;
    this.visibleRowInfo = {};

    this.scrollbarsActive = false;

    undoStackArray = [];
    redoStackArray = [];

    _tooltips();
    _checkVisibleRow();
    _checkNewEmptyPage();

    this.$styleElement = $("#rexpansive-builder-style-inline-css");
    _fixCustomStyleElement();
  };
  _generateElementNewIDs;
  _fixCopiedElementSlider;

  return {
    init: init,
    removeScrollBar: _removeScrollBar,
    removeTextEditor: _removeTextEditor,
    removeColorPicker: _removeColorPicker,
    removeHandles: _removeHandles,
    generateElementNewIDs: _generateElementNewIDs,
    fixCopiedElementSlider: _fixCopiedElementSlider,
    removeDeletedBlocks: removeDeletedBlocks,
    addWindowListeners: addWindowListeners,
    addDocumentListeners: addDocumentListeners,
    endEditingElement: endEditingElement,
    startEditingElement: startEditingElement,
    setEndOfContenteditable: setEndOfContenteditable,
    sendParentIframeMessage: sendParentIframeMessage,
    addCustomClass: _addCustomClass,
    removeCustomClass: _removeCustomClass,
    escapeRegExp: _escapeRegExp,
    pushAction: _pushAction,
    getIDs: getIDs,
    getStacks: _getStacks,
    createSliderData: _createSliderData,
    saveSliderOnDB: _saveSliderOnDB,
    getTextWrapLength: _getTextWrapLength,
    getElementsPhotoswipe: _getElementsPhotoswipe,
    updateLayoutsAvaiable: _updateLayoutsAvaiable,
    createDefaultCustomLayouts: _createDefaultCustomLayouts,
    fixToolsVisibility: _fixToolsVisibility,
    clearSectionsEdited: _clearSectionsEdited,
    startLoading: _startLoading,
    endLoading: _endLoading,
    builderEdited: _builderEdited,
    launchTooltips: _tooltips,
    getMousePosition: _getMousePosition,
    hideAllTools: _hideAllTools
  };
})(jQuery);
