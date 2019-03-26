/**
 * Live Editing
 */
var Rexbuilder_Util_Admin_Editor = (function($) {
  "use strict";

  var activeLayoutPage;
  var activeLayoutPageLabel;
  var modelSaved;
  var pageSaved;
  var $saveBtn;
  var $undoBtn;
  var $redoBtn;
  
  var $highlightSectionId;
  var $highlightModelId;
  var $highlightModelEditing;
  var hightlightRowInfo;
  var $highlightRowSetWidth;
  var $highlightRowSetLayout;
  var $highlightRowSetLayoutCheckbox;
  var $highlightRowSetCollapse;
  
  var $highlightRowSetBackgroundImg;
  var $highlightRowSetBackgroundColor;
  var $highlightRowSetOverlay;
  var $configRowSetBkgrImg;
  var $fastRowSetBkgImg;
  var $configRowSetBkgrCol;
  var $fastRowSetBkgrCol;
  var $configRowSetOverlay;
  var $fastRowSetOverlay;
  var $highlightRowSetVideo;
  var $configRowSetVideo;
  var $fastRowSetVideo;

  var open_models_list;

  var $frameContainer;
  var frameBuilderWindow;
  var $frameBuilderWindow;

  var updatedLayoutData;

  var input_selector;

  /**
   * Adds a class to Rexcontainer in the iframe
   * @param {string} class_name class name to add to rexContainer in the iframe
   */
  var _addClassToLiveFrameRexContainer = function(class_name){
    if(!Rexbuilder_Util_Admin_Editor.$liveFrameRexContainer.hasClass(class_name)){
      Rexbuilder_Util_Admin_Editor.$liveFrameRexContainer.addClass(class_name);
    }
  }
  /**
   * Removes a class to Rexcontainer in the iframe
   * @param {string} class_name class name to remove to rexContainer in the iframe
   */
  var _removeClassToLiveFrameRexContainer = function(class_name){
    if(Rexbuilder_Util_Admin_Editor.$liveFrameRexContainer.hasClass(class_name)){
      Rexbuilder_Util_Admin_Editor.$liveFrameRexContainer.removeClass(class_name);
    }
  }

  var _setScroll = function(stop){
    this.stopScrolling = stop;
  }
  
  var scrollY;

  var _scrollFrame = function (step) {
    scrollY = $frameBuilderWindow.scrollTop();
    $frameBuilderWindow.scrollTop(
      scrollY + step
    );
    if (!Rexbuilder_Util_Admin_Editor.stopScrolling) {
      setTimeout(function () {
        _scrollFrame(step);
      }, 20);
    }
  };

  var _findLayoutType = function(name) {
    if (name == "default" || name == "mobile" || name == "tablet") {
      return "standard";
    }
    return "custom";
  };

  var _receiveMessage = function(event) {
    if (event.data.rexliveEvent) {
      //fare come sul live, con lo switch sui nomi degli eventi
      var eventData = event.data;

      if (event.data.eventName == "rexlive:edited") {
        if (event.data.modelEdited) {
          modelSaved = false;
        } else {
          Rexbuilder_Util_Admin_Editor.pageSaved = false;
        }
        // get undo redo stack from iframe
        // console.log(event.data.undoRedoStacks);
        $saveBtn.addClass("page-edited");
        // Rexbuilder_Util_Admin_Editor.$body.addClass('page-edited');
      }

      /**
       * Highlighting undo/redo buttons if there are performable actions
       */
      if(event.data.eventName == "rexlive:undoRedoStackChange") {
        if(event.data.stacks.undo > 0) {
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.addClass('btn-undo--active');
        } else {
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass('btn-undo--active');
        }
        if(event.data.stacks.redo > 0) {
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.addClass('btn-redo--active');
        } else {
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass('btn-redo--active');
        }
      }

      if(event.data.eventName == "rexlive:traceVisibleRow" ) {
        $highlightSectionId.val(event.data.sectionTarget.sectionID);
        $highlightModelId.val(event.data.sectionTarget.modelNumber);
        $highlightModelEditing.val(event.data.sectionTarget.modelEditing);
        hightlightRowInfo = event.data.rowInfo;
        _updateTopToolbar();
      }

      if( event.data.eventName == "rexlive:viewTopFastTools" ) {
        Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass("top-fast-tools--hide");
      }
      
      if( event.data.eventName == "rexlive:hideTopFastTools" ) {
        Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.addClass("top-fast-tools--hide");
      }

      if(event.data.eventName == "rexlive:updateTopToolbar") {
        Rexbuilder_Util_Admin_Editor.highlightRowSetData(event.data.updateInfo);
        _updateTopToolbar();
      }

      if (event.data.eventName == "rexlive:openMediaUploader") {
        Rexlive_MediaUploader.openInsertImageBlocksMediaUploader(eventData);
      }

      if (event.data.eventName == "rexlive:addNewBlockVideo") {
        Insert_Video_Modal.openVideoModal(eventData);
      }

      if (event.data.eventName == "rexlive:addNewSlider") {
        Rexbuilder_RexSlider.openSliderModal("", "", "", eventData.target);
      }

      if (event.data.eventName == "rexlive:editSlider") {
        var data = event.data;
        Rexbuilder_RexSlider.openSliderModal(
          data.blockID,
          data.shortCodeSlider,
          data.sliderID,
          data.target
        );
      }

      if (event.data.eventName == "rexlive:openSectionModal") {
        Section_Modal.openSectionModal(event.data.section_options_active, event.data.mousePosition);
      }

      // EVENT MANAGER >>> rexlive:inlineVideoEditor -A
      if (event.data.eventName == "rexlive:inlineVideoEditor") {
        Change_UpdateVideoInline_Modal.openModal(event.data.modelData);
      }

      if (event.data.eventName == 'rexlive:inlineSVG' )
      {
        Rexlive_Inline_SVG.openModal( event.data.inlineSVGData );
      }

      // EVENT MANAGER >>> rexlive:mediumEditor:inlineVideoEditor -A
      /*  if (event.data.eventName == "rexlive:mediumEditor:inlineVideoEditor") {
        Change_UpdateVideoInline_Modal.openModal(event.data.modelData);
      } */

      if (event.data.eventName == "rexlive:openModalMenu") {
        Model_Modal.openModal(event.data.modelData);
      }

      if (event.data.eventName == "rexlive:updateModel") {
        Model_Modal.updateModel(event.data.modelData);
      }

      if (event.data.eventName == "rexlive:uploadSliderFromLive") {
        var dataSlider = event.data.sliderInfo;
        var sliderData = dataSlider.slider;
        var rex_slider_to_edit = dataSlider.slider.id.toString();
        var newSliderFlag = dataSlider.newSlider;
        var blockToEdit = dataSlider.blockID;
        var targetToEdit = dataSlider.target;

        Rexbuilder_RexSlider.saveSlider(
          sliderData,
          blockToEdit,
          rex_slider_to_edit,
          newSliderFlag,
          true,
          targetToEdit
        );
      }

      if (event.data.eventName == "rexlive:openCssEditor") {
        CssEditor_Modal.openModal(event.data.currentStyle);
      }

      if (event.data.eventName == "rexlive:openHTMLEditor") {
        HtmlEditor_Modal.openModal(event.data.htmlContent);
      }

      if (event.data.eventName == "rexlive:openLiveImageUploader") {
        Rexlive_MediaUploader.openImageLiveMediaUploader(
          event.data.live_uploader_data
        );
      }

      if (event.data.eventName == "rexlive:openMEImageUploader") {
        Rexlive_MediaUploader.openImageMEMediaUploader(event.data.img_data);
      }

      if (event.data.eventName == "rexlive:editBackgroundSection") {
        SectionBackground_Modal.openSectionBackgroundModal(event.data.activeBG);
      }

      if (event.data.eventName == "rexlive:editSectionBackgroundGradient") {
        Rexlive_Section_Background_Gradient.openModal(event.data.activeRowData);
      }

      if(event.data.eventName == "rexlive:editRowOverlayGradient" ) {
        Rexlive_Section_Overlay_Gradient.openModal(event.data.activeRowData);
      }

      if (event.data.eventName == "rexlive:editRowVideoBackground") {
        Section_Video_Background_Modal.openSectionVideoBackgroundModal( event.data.activeBG, event.data.mousePosition);
      }

      if (event.data.eventName == "rexlive:editBlockOptions") {
        BlockOptions_Modal.openBlockOptionsModal(event.data.activeBlockData );
      }

      if (event.data.eventName == "rexlive:editBlockContentPosition") {
        Block_Content_Positions_Modal.openBlockContentPositionModal(event.data.activeBlockData, event.data.mousePosition);
      }

      if (event.data.eventName == "rexlive:editBlockAccordion") {
        Rexlive_Block_Accordion.openModal(event.data.activeBlockData);
      }
      
      if (event.data.eventName == "rexlive:editBlockSlideshow") {
        Rexlive_Block_Slideshow.openModal(event.data.activeBlockData);
      }

      if (event.data.eventName == "rexlive:editBlockGradient") {
        Rexlive_Block_Background_Gradient.openModal(event.data.activeBlockData);
      }

      if (event.data.eventName == "rexlive:editTextGradient") {
        Rexlive_Text_Gradient.openModal(event.data.activeBlockData);
      }

      if (event.data.eventName == "rexlive:editBlockOverlayGradient") {
        Rexlive_Block_Overlay_Gradient.openModal(event.data.activeBlockData);
      }

      if (event.data.eventName == "rexlive:editBlockImageSettings") {
        Block_Image_Editor_Modal.openModal(event.data.activeBlockData, event.data.mousePosition);
      }

      if (event.data.eventName == "rexlive:editBlockVideoBackground") {
        Block_Video_Background_Modal.openBlockVideoBackgroundModal( event.data.activeBlockData, event.data.mousePosition );
      }

      if (event.data.eventName == "rexlive:openRexButtonEditor") {
        Button_Edit_Modal.openButtonEditorModal(event.data.buttonData);
      }
      
      if (event.data.eventName == "rexlive:editRemoveModal") {
        Model_Edit_Modal.openModal(event.data.modelData);
      }

      if (event.data.eventName == "rexlive:saveAndCloseModel") {
        _updateOpenModelsList('CLOSE',event.data.modelData);
        _updateModelEditing("false");
        _updateModelState();
      }

      if (event.data.eventName == "rexlive:savePageEnded") {
        switch (event.data.dataSaved) {
          case "model":
            modelSaved = true;
            break;
          case "page":
            Rexbuilder_Util_Admin_Editor.pageSaved = true;
            break;
          default:
            break;
        }
        if (modelSaved && Rexbuilder_Util_Admin_Editor.pageSaved) {
          NProgress.done();
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.attr( "data-rex-edited-backend", false );
          $saveBtn.removeClass("page-edited");
          // Rexbuilder_Util_Admin_Editor.$body.removeClass('page-edited');
          $saveBtn.removeClass("rex-saving");
          if ( typeof event.data.buttonData !== "undefined" && event.data.buttonData != "" ) {
            _updateLayoutPage(event.data.buttonData);
          }
        }
      }

      if (event.data.eventName == "rexlive:restoreStateEnded") {
        modelSaved = true;
        Rexbuilder_Util_Admin_Editor.pageSaved = true;
        if (
          typeof event.data.buttonData !== "undefined" &&
          typeof event.data.buttonData != ""
        ) {
          _updateLayoutPage(event.data.buttonData);
        }
      }

      if (event.data.eventName == "rexlive:animateContentsFadeOutEnd") {
        NProgress.inc(0.5);
      }

      if (event.data.eventName == "rexlive:animateContentsEnd") {
        NProgress.done();
      }

      if(event.data.eventName == "rexlive:esc_pressed" ) {
        Rexlive_Modals_Utils.close_focus_modal();
      }

      if( event.data.eventName == "rexlive:savePageWithButton" ) {
        $saveBtn.trigger('click');
      }

      if( event.data.eventName == "rexlive:undoWithButton" ) {
        $undoBtn.trigger('click');
      }

      if( event.data.eventName == "rexlive:redoWithButton" ) {
        $redoBtn.trigger('click');
      }

      if( event.data.eventName == "rexlive:savePaletteColor" ) {
        Rexlive_Ajax_Calls.savePaletteColor(event.data.color_data);
      }

      if( event.data.eventName == "rexlive:deletePaletteColor" ) {
        Rexlive_Ajax_Calls.deletePaletteColor(event.data.color_data);
      }

      if( event.data.eventName == "rexlive:savePaletteOverlayColor" ) {
        Rexlive_Ajax_Calls.savePaletteOverlayColor(event.data.overlay_data);
      }

      if( event.data.eventName == "rexlive:deletePaletteOverlayColor" ) {
        Rexlive_Ajax_Calls.deletePaletteOverlayColor(event.data.overlay_data);
      }
    }
  };

  var _addDocumentListeners = function() {
    Rexlive_Base_Settings.$document.on("click", ".btn-builder-layout", function(e) {
      var $btn = $(e.target).parents(".btn-builder-layout");
      // var $btn = $(this);
      var btnName = $btn.attr("data-name");
      if (activeLayoutPage != btnName) {
        var buttonData = {
          min: $btn.attr("data-min-width"),
          max: $btn.attr("data-max-width"),
          id: btnName,
          label: ( 'undefined' != typeof $btn.attr('data-label') ? $btn.attr('data-label') : btnName ),
          type: _findLayoutType(btnName)
        };
        var dataObj = {
          activeLayout: activeLayoutPage,
          activeLayoutLabel: activeLayoutPageLabel,
          buttonData: buttonData,
          modelSaved: modelSaved,
          pageSaved: Rexbuilder_Util_Admin_Editor.pageSaved
        };

        if ( Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.attr("data-rex-edited-backend").toString() == "true" ) {
          LockedOptionMask.openModal(dataObj);
        } else {
          if (!(modelSaved && Rexbuilder_Util_Admin_Editor.pageSaved)) {
            Change_Layout_Modal.openModal(dataObj);
            return;
          }
          NProgress.start();
          _sendIframeBuilderMessage({
            eventName: "rexlive:startChangeLayout"
          });
          _updateLayoutPage(buttonData);
        }
      }
    });

    $saveBtn.on("click", function(e) {
      var open_models = [];
      for(var i=0; i<open_models_list.length; i++) {
        if( 'open' == open_models_list[i].m_state ) {
          open_models.push(open_models_list[i]);
        }
      }

      if(0 === open_models.length) {
        _savingProcess();
      } else {
        Open_Models_Warning.openModal(open_models);
      }
    });

    // Save with keyboard
    Rexlive_Base_Settings.$document.on('keydown', function(e) {
      if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
        e.preventDefault();
        // Process the event here (such as click on submit button)
        // SAVE PAGE
        $saveBtn.trigger('click');
      }
    });

    // Undo with keyboard
    Rexlive_Base_Settings.$document.on('keydown', function(e) {
      if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && !e.shiftKey && e.keyCode == 90) {
        e.preventDefault();
        // Process the event here (such as click on submit button)
        // SAVE PAGE
        $undoBtn.trigger('click');
      }
    });

    // Redo with keyboard
    Rexlive_Base_Settings.$document.on('keydown', function(e) {
      if ( ( (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.shiftKey && e.keyCode == 90 ) || ( (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 89 ) ) {
        e.preventDefault();
        // Process the event here (such as click on submit button)
        // SAVE PAGE
        $redoBtn.trigger('click');
      }
    });

    Rexlive_Base_Settings.$document.on("click", ".btn-undo", function(e) {
      var data = {
        eventName: "rexlive:undo"
      };

      _sendIframeBuilderMessage(data);
    });

    Rexlive_Base_Settings.$document.on("click", ".btn-redo", function(e) {
      var data = {
        eventName: "rexlive:redo"
      };

      _sendIframeBuilderMessage(data);
    });

    Rexlive_Base_Settings.$document.on("click", ".btn-models", function(e) {
      Model_Lateral_Menu.openModal();
    });

    Rexlive_Base_Settings.$document.on("click", ".open-distancer-tool", function(e) {
      Rexlive_Modals_Utils.openModal($("#toolbox-distancer-panel").parent(".rex-modal-wrap"));
    });

    /**
     * Material design input field animation on focus
     * Slide up the label
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on("focus", input_selector, function(e) {
      if ($(e.target).is(input_selector)) {
        $(e.target)
          .siblings("label, .prefix")
          .addClass("active");
      }
    });

    /**
     * Material design input field animation on blur
     * Slide down the label
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on("blur", input_selector, function(e) {      
      if ($(e.target).is(input_selector)) {
        if("" == e.target.value) {
          $(e.target)
            .siblings("label, .prefix")
            .removeClass("active");
        }
      }
    });

    /**
     * Add image from top Toolbox inside the highlighted row
     * Send a message to the actual parent window to open the Wordpress Media Uploader
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on("click", '.toolbox-add-new-block-image', function(e) {
      e.preventDefault();

      var msg = {
        rexliveEvent: true,
        eventName: "rexlive:openMediaUploader",
        returnEventName: "rexlive:insert_image",
        sectionTarget: {
          sectionID: $highlightSectionId.val(),
          modelNumber: $highlightModelId.val()
        },
      };

      window.postMessage(msg, "*");
    });

    /**
     * Add text block from top Toolbox inside the highlighted row
     * Send a message to the iframe to insert directly a block on the row
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.toolbox-add-new-block-text', function(e) {
      e.preventDefault();

      Rexbuilder_Util_Admin_Editor.$frameBuilder.focus();

      var msg = {
        eventName: "rexlive:insert_new_text_block",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
        }
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Add Video from top Toolbox inside the highlighted row
     * Send a message to the actual parent window to open the Video Modal
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on("click", '.toolbox-add-new-block-video', function(e) {
      e.preventDefault();

      var msg = {
        rexliveEvent: true,
        eventName: "rexlive:addNewBlockVideo",
        sectionTarget: {
          sectionID: $highlightSectionId.val(),
          modelNumber: $highlightModelId.val()
        },
      };

      window.postMessage(msg, "*");
    });

    /**
     * Add Slider from top Toolbox inside the highlighted row
     * Send a message to the actual parent window to open the Slider Modal
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on("click", '.toolbox-add-new-block-slider', function(e) {
      e.preventDefault();

      var msg = {
        rexliveEvent: true,
        eventName: "rexlive:addNewSlider",
        target: {
          sectionID: $highlightSectionId.val(),
          modelNumber: $highlightModelId.val()
        },
      };

      window.postMessage(msg, "*");
    });

    /**
     * Add Row from top Toolbox after the highlighted row
     * Send a message to the iframe to insert directly the new row
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.toolbox-add-new-section', function(e) {
      e.preventDefault();

      var msg = {
        eventName: "rexlive:add_new_section_after",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          position: 'after'
        }
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Toggle collapse of the visible row
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.toolbox-collapse-grid', function(e) {
      e.preventDefault();

      if( 'true' == hightlightRowInfo.collapse ) {
        hightlightRowInfo.collapse = 'false';
      } else {
        hightlightRowInfo.collapse = 'true';
      }
      _updateCollapseTool();

      var msg = {
        eventName: "rexlive:collapse_row",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
        }
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Change the layout of the visibile row
     * @since 2.0.0
     * @deprecated Now we have the checkbox
     */
    Rexlive_Base_Settings.$document.on('change', '.edit-row-layout-toolbox', function(e) {
      Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        layout: e.target.value,
      });

      var msg = {
        eventName: "rexlive:set_gallery_layout",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          layout: e.target.value
        },
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Change the layout of the visibile row with the checkbox
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('change', '.edit-row-layout-toolbox-checkbox', function(e) {
      var layout = ( e.target.checked ? 'fixed' : 'masonry' );
      Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        layout: layout
      });

      var msg = {
        eventName: "rexlive:set_gallery_layout",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          layout: layout
        },
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Change the dimensions of the visible row
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('change', '.edit-row-width-toolbox', function(e) {
      var width = '';
      var type = '';
      var vals = e.target.value.trim().split(/(\d+)/);
      width = vals[1];
      type = vals[2];

      Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        section_width: e.target.value,
        dimension: e.target.getAttribute('data-section_width'),
      });

      var msg = {
        eventName: "rexlive:set_section_width",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          sectionWidth: {
            width: width,
            type: type
          },
          forged: true
        },
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Open the row settings modal window
     * Get the data from the hightlightRowInfo object
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.toolbox-builder-section-config', function(e) {
      e.preventDefault();

      var mousePosition = _getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );

      var msg = {
        rexliveEvent: true,
        eventName: "rexlive:openSectionModal",
        section_options_active: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          activeLayout: hightlightRowInfo.layout,
          fullHeight: hightlightRowInfo.full_height,
  
          section_width: hightlightRowInfo.section_width,
          dimension: hightlightRowInfo.dimension,
  
          rowDistances: {
            gutter: hightlightRowInfo.block_distance,
            top: hightlightRowInfo.row_separator_top,
            right: hightlightRowInfo.row_separator_right,
            bottom: hightlightRowInfo.row_separator_bottom,
            left: hightlightRowInfo.row_separator_left,
          },
  
          marginsSection: {
            top: hightlightRowInfo.row_margin_top,
            right: hightlightRowInfo.row_margin_right,
            bottom: hightlightRowInfo.row_margin_bottom,
            left: hightlightRowInfo.row_margin_left,
          },
          photoswipe: false,
  
          sectionName: hightlightRowInfo.section_name,
          customClasses: hightlightRowInfo.custom_classes
        },
        mousePosition: mousePosition
      };

      window.postMessage(msg, "*");
    });

    /**
     * Open the row settings modal window
     * Get the data from the hightlightRowInfo object
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.edit-row-image-background-toolbox', function(e) {
      e.preventDefault();

      var msg = {
        rexliveEvent: true,
        eventName: "rexlive:openLiveImageUploader",
        live_uploader_data: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          idImage: hightlightRowInfo.id_image_bg_section,
          returnEventName: 'rexlive:apply_background_image_section',
          data_to_send: {
            active: true
          }
        },
      };

      window.postMessage(msg, "*");
    });

    /**
     * Remove a row image background with one click
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.deactivate-row-image-background-toolbox', function(e) {
      e.preventDefault();

      Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        image_bg_section_active: "false",
        image_bg_section: "",
        id_image_bg_section: "",
      });
      _updateBkgrImgTool();

      var msg = {
        eventName: "rexlive:apply_background_image_section",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          active: false,
          idImage: '',
          urlImage: '',
          width: '',
          height: '',
        },
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Remove a row color background with one click
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.deactivate-row-color-background-toolbox', function(e) {
      e.preventDefault();

      Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        color_bg_section_active: "false",
        color_bg_section: "",
      });
      _updateBkgrColTool();

      var msg = {
        eventName: "rexlive:apply_background_color_section",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          active: false,
          color: '',
        },
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Remove a row overlay color with one click
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.deactivate-row-overlay-color-toolbox', function(e) {
      e.preventDefault();

      Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        row_overlay_color: "",
        row_overlay_active: "false"
      });
      _updateBkgrOverlayTool();

      var msg = {
        eventName: "rexlive:change_section_overlay",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          active: false,
          color: '',
        },
      };

      _sendIframeBuilderMessage(msg);
    });

    /**
     * Open the row background video modal window
     * Get the data from the hightlightRowInfo object
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.edit-row-video-background-toolbox', function(e) {
      e.preventDefault();

      var msg = {
        rexliveEvent: true,
        eventName: "rexlive:editRowVideoBackground",
        activeBG: {
          bgVideo: {
            sectionTarget: {
              sectionID: $highlightSectionId.val(),
              modelNumber: $highlightModelId.val()
            },
            youtubeVideo: hightlightRowInfo.video_bg_url_section,
            vimeoUrl: hightlightRowInfo.video_bg_url_vimeo_section,
            mp4Video: hightlightRowInfo.video_mp4_url,
            mp4VideoID: hightlightRowInfo.video_bg_id_section
          },
        }
      };

      window.postMessage(msg, "*");
    });

    /**
     * Remove a row video background with one click
     * Get the data from the hightlightRowInfo object
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('click', '.deactivate-row-video-background-toolbox', function(e) {
      e.preventDefault();

      Rexbuilder_Util_Admin_Editor.highlightRowSetData({
        video_bg_url_section: "",
        video_bg_id_section: "",
        video_bg_url_vimeo_section: "",
        video_mp4_url: "",
      });
      _updateBkgrVidTool();

      hightlightRowInfo.video_bg_url_section = "";
      hightlightRowInfo.video_bg_id_section = "";
      hightlightRowInfo.video_bg_url_vimeo_section = "";
      hightlightRowInfo.video_mp4_url = "";

      var msg = {
        eventName: "rexlive:update_section_background_video",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
          typeVideo: "",
          urlVimeo: "",
          urlYoutube: "",
          videoMp4: {
            idMp4: "",
            linkMp4: "",
          },
        }
      };

      _sendIframeBuilderMessage(msg);
    });

    Rexlive_Base_Settings.$document.on('click', '.open-model-toolbox', function(e) {
      e.preventDefault();

      var msg = {
        eventName: "rexlive:openCreateModelModal",
        data_to_send: {
          sectionTarget: {
            sectionID: $highlightSectionId.val(),
            modelNumber: $highlightModelId.val()
          },
        }
      };

      _sendIframeBuilderMessage(msg);
    });

    window.addEventListener("message", _receiveMessage, false);
  };

  var _updateLayoutPage = function(buttonData) {
    modelSaved = true;
    Rexbuilder_Util_Admin_Editor.pageSaved = true;
    activeLayoutPage = buttonData.id;
    activeLayoutPageLabel = buttonData.label;
    var $activeLayoutBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.btn-builder-layout[data-name="' + activeLayoutPage + '"]');
    Rexbuilder_Util_Admin_Editor.$responsiveToolbar
      .find(".btn-builder-layout.active-layout")
      .removeClass("active-layout");
    $activeLayoutBtn
      .addClass("active-layout");

    Rexbuilder_Util_Admin_Editor.$responsiveToolbar
      .find('.tool-option__choose-layout')
      .find('.active-layout__icon')
      .html(Rexbuilder_Util_Admin_Editor.$responsiveToolbar
        .find('.btn-builder-layout[data-name="' + activeLayoutPage + '"]').find('.layout__icon').html());

    updatedLayoutData = {
      selectedLayoutName: activeLayoutPage,
      eventName: "rexlive:changeLayout",
      layoutData: buttonData
    };

    _updateIframeWidth(buttonData.min);
  };

  var _updateLayoutActiveData = function(newData) {
    updatedLayoutData = newData;
  };

  var _updateOpenModelsList = function(action, data) {
    switch(action) {
      case 'OPEN':
        var index = null;
        for( var i=0; i < open_models_list.length; i++ ) {
          if( data.modelID == open_models_list[i].m_id ) {
            index = i;
            break;
          }
        }
        if( null !== index ) {
          open_models_list[i].m_state = 'open'
        } else {
          var model_info = {
            m_id: data.modelID,
            m_name: data.modelName,
            m_state: 'open'
          };
          open_models_list.push(model_info);
        }
        break;
      case 'CLOSE':
        var index = null;
        for( var i=0; i < open_models_list.length; i++ ) {
          if( data.modelID == open_models_list[i].m_id ) {
            index = i;
            break;
          }
        }
        if( null !== index ) {
          open_models_list[i].m_state = 'close'
        } else {
          var model_info = {
            m_id: data.modelID,
            m_name: data.modelName,
            m_state: 'close'
          };
          open_models_list.push(model_info);
        }
        break;
      case 'REMOVE':
        var index = null;
        for( var i=0; i < open_models_list.length; i++ ) {
          if( data.modelID == open_models_list[i].m_id ) {
            index = i;
            break;
          }
        }
        if( null !== index ) {
          open_models_list.splice(index,1);
        }
        break;
      default:
        break;
    }
  }

  var _savingProcess = function() {
    NProgress.start();
    $(this).addClass("rex-saving");
    var dataSave = {
      eventName: "rexlive:savePage",
      data_to_send: {
        activeLayout: activeLayoutPage
      }
    };
    _sendIframeBuilderMessage(dataSave);
  }

  var _updateIframeWidth = function(newWidth) {
    if (newWidth != Rexbuilder_Util_Admin_Editor.activeWidth) {
      if (newWidth == "") {
        $frameContainer.css("width", "100%");
        $frameContainer.css("min-width", "1024px");
      } else {
        $frameContainer.css("width", newWidth);
        $frameContainer.css("min-width", "");
      }
      Rexbuilder_Util_Admin_Editor.activeWidth = newWidth;
    } else {
      _sendIframeBuilderMessage(updatedLayoutData);
    }
  };

  /**
   * Send an event message to the children iframe
   * @param {Object} data Event information to send
   * @since 2.0.0
   */
  var _sendIframeBuilderMessage = function(data) {
    var infos = {
      rexliveEvent: true
    };
    jQuery.extend(infos, data);
    // console.log(infos);
    //console.log("sending message to iframe");
    frameBuilderWindow.postMessage(infos, "*");
  };

  var _createRandomID = function(n) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  var _getActiveLayout = function() {
    return activeLayoutPage;
  };

  var _setActiveLayout = function(layout) {
    activeLayoutPage = layout;
    this.$responsiveToolbar
      .find(".btn-builder-layout.active-layout")
      .removeClass("active-layout");
    this.$responsiveToolbar
      .find('.btn-builder-layout[data-name="' + activeLayoutPage + '"]')
      .addClass("active-layout");
  };

  var _whichTransitionEvent = function() {
    var t,
      el = document.createElement("fakeelement");

    var transitions = {
      transition: "transitionend",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd"
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  };

  var _whichAnimationEvent = function() {
    var t,
      el = document.createElement("fakeelement");

    var animations = {
      animation: "animationend",
      OAnimation: "oAnimationEnd",
      MozAnimation: "animationend",
      WebkitAnimation: "webkitAnimationEnd"
    };

    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  };

  var _updateModelId = function( val ) {
    $highlightModelId.val(val);
  };

  var _updateModelEditing = function( val ) {
    $highlightModelEditing.val(val);
  };

  var _updateModelState = function() {
    if( "" !== $highlightModelId.val() && "undefined" !== typeof $highlightModelId.val() && "false" === $highlightModelEditing.val() ) {
      Rexbuilder_Util_Admin_Editor.$responsiveToolbar.addClass('rexlive-toolbox--model');
    } else {
      Rexbuilder_Util_Admin_Editor.$responsiveToolbar.removeClass('rexlive-toolbox--model');
    }
  };

  var _updateCollapseTool = function() {
    if('true' == hightlightRowInfo.collapse) {
      $highlightRowSetCollapse.addClass('active');
    } else {
      $highlightRowSetCollapse.removeClass('active');
    }
  };

  var _updateWidthTool = function() {
    $highlightRowSetWidth.filter('[data-section_width=' + hightlightRowInfo.dimension + ']').attr('checked',true);
  };

  var _updateLayoutTool = function() {
    $highlightRowSetLayout.filter('[value=' + hightlightRowInfo.layout + ']').attr('checked',true);
  };

  var _updateLayoutCheckboxTool = function() {
    var checkState = ( hightlightRowInfo.layout == 'fixed' ? true : false );
    $highlightRowSetLayoutCheckbox.prop('checked', checkState);
  }

  var _updateBkgrImgTool = function() {
    if( '' !== hightlightRowInfo.id_image_bg_section && '' !== hightlightRowInfo.image_bg_section && 'undefined' !== typeof hightlightRowInfo.id_image_bg_section && 'undefined' !== typeof hightlightRowInfo.image_bg_section ) {
      $highlightRowSetBackgroundImg
        .addClass('tool-button--image-preview')
        .attr('value',hightlightRowInfo.id_image_bg_section)
        .css('background-image','url('+hightlightRowInfo.image_bg_section+')');
      $configRowSetBkgrImg.addClass('tool-button--hide');
      // $fastRowSetBkgImg.parent().removeClass('tool-button--hide');
      setTimeout(function() {
        $fastRowSetBkgImg.parent().fadeIn();
      },300);
    } else {
      $configRowSetBkgrImg.removeClass('tool-button--hide');
      // $fastRowSetBkgImg.parent().addClass('tool-button--hide');
      $fastRowSetBkgImg.parent().fadeOut({
        duration: 300,
        complete: function() {
          $highlightRowSetBackgroundImg
            .removeClass('tool-button--image-preview')
            .attr('value','')
            .css('background-image','none');
        }
      });
    }
  };
  
  var _updateBkgrColTool = function() {
    if( '' !== hightlightRowInfo.color_bg_section ) {
      $highlightRowSetBackgroundColor
        .val(hightlightRowInfo.color_bg_section)
        .spectrum('set',hightlightRowInfo.color_bg_section);
      $highlightRowSetBackgroundColor
        .parent()
        .addClass('tool-button--picker-preview')
      $highlightRowSetBackgroundColor
        .siblings('.tool-button--color-preview')
        .css('background-color',hightlightRowInfo.color_bg_section);
      $configRowSetBkgrCol.parent().addClass('tool-button--hide');
      // $fastRowSetBkgrCol.parent().removeClass('tool-button--hide');
      setTimeout(function() {
        $fastRowSetBkgrCol.parent().fadeIn();
      },300);
    } else {
      $highlightRowSetBackgroundColor
        .val('')
        .spectrum('set','');
      $configRowSetBkgrCol.parent().removeClass('tool-button--hide');
      // $fastRowSetBkgrCol.parent().addClass('tool-button--hide');
      $fastRowSetBkgrCol.parent().fadeOut({
        duration: 300,
        complete: function() {
          $highlightRowSetBackgroundColor
            .parent()
            .removeClass('tool-button--picker-preview')
          $highlightRowSetBackgroundColor
            .siblings('.tool-button--color-preview')
            .css('background-color','');
        }
      });
    }
  };

  var _updateBkgrOverlayTool = function() {
    if( '' !== hightlightRowInfo.row_overlay_color && 'undefined' !== typeof hightlightRowInfo.row_overlay_color ) {
      $highlightRowSetOverlay
        .val(hightlightRowInfo.row_overlay_color)
        .spectrum("set",hightlightRowInfo.row_overlay_color)
      $highlightRowSetOverlay
        .parent()
        .addClass('tool-button--picker-preview')
      $highlightRowSetOverlay
        .siblings('.tool-button--color-preview')
        .css('background-color',hightlightRowInfo.row_overlay_color);
      $configRowSetOverlay.parent().addClass('tool-button--hide');
      // $fastRowSetOverlay.parent().removeClass('tool-button--hide');
      setTimeout(function() {
        $fastRowSetOverlay.parent().fadeIn();
      }, 300);
    } else {
      $highlightRowSetOverlay
        .val('')
        .spectrum("set",'')
      $configRowSetOverlay.parent().removeClass('tool-button--hide');
      // $fastRowSetOverlay.parent().addClass('tool-button--hide');
      $fastRowSetOverlay.parent().fadeOut({
        duration: 300,
        complete: function() {
          $highlightRowSetOverlay
            .parent()
            .removeClass('tool-button--picker-preview')
          $highlightRowSetOverlay
            .siblings('.tool-button--color-preview')
            .css('background-color','');
        }
      })
    }
  };

  var _updateBkgrVidTool = function() {
    if( ( '' !== hightlightRowInfo.video_bg_url_section && 'undefined' !== typeof hightlightRowInfo.video_bg_url_section ) || ( '' !== hightlightRowInfo.video_bg_url_vimeo_section && 'undefined' !== typeof hightlightRowInfo.video_bg_url_vimeo_section ) || ( '' !== hightlightRowInfo.video_mp4_url && 'undefined' !== typeof hightlightRowInfo.video_mp4_url ) || ( '' !== hightlightRowInfo.video_bg_id_section && 'undefined' !== typeof hightlightRowInfo.video_bg_id_section ) ) {
      $configRowSetVideo.addClass('tool-button--hide');
      // $fastRowSetVideo.parent().removeClass('tool-button--hide');
      setTimeout(function() {
        $fastRowSetVideo.parent().fadeIn();
      });
    } else {
      $configRowSetVideo.removeClass('tool-button--hide');
      // $fastRowSetVideo.parent().addClass('tool-button--hide');
      $fastRowSetVideo.parent().fadeOut({
        duration: 300
      });
    }
  }

  /**
   * Live update of the top toolbar according to the visibile row
   * @since 2.0.0
   */
  var _updateTopToolbar = function() {
    // 0. Synch Model
    _updateModelState();

    // 1. Synch Collapse
    _updateCollapseTool();

    // 2. Synch width
    _updateWidthTool();

    // 3. Synch layout
    _updateLayoutTool();
    _updateLayoutCheckboxTool();

    // 4. Synch Background Image
    _updateBkgrImgTool();

    // 5. Synch Background Color
    _updateBkgrColTool();

    // 6. Synch Overlay
    _updateBkgrOverlayTool();

    // 7. Synch Video
    _updateBkgrVidTool();
  };

  var _blockIframeRows = function() {
    var data = {
      eventName: "rexlive:lockRows"
    };

    _sendIframeBuilderMessage(data);
  };

  var _releaseIframeRows = function() {
    var data = {
      eventName: "rexlive:unlockRows"
    };

    _sendIframeBuilderMessage(data);
  };

  var _editPageProperties = function() {

    // Rexbuilder_Util_Admin_Editor.$body.addClass('page-edited');
    $saveBtn.addClass("page-edited");
  };

  /**
   * Init the Top Toolbar tools
   * - row background color picker
   * - row overlay color picker
   * @since 2.0.0
   */
  var _initToolbar = function() {
    _initBackgroundColorPicker();
    _initOverlayColorPicker();
  };

  /**
   * Init the background row color picker
   * Listen to the events and change the color accordly
   * Get the data from the hightlightRowInfo object
   * @since 2.0.0
   */
  var _initBackgroundColorPicker = function() {
    var bgColorPickerUsed = false;
    var bgColorActive = false;
    var eventSettings = {
      eventName: null,
      data_to_send: {
        color: null,
        sectionTarget: {
          sectionID: null,
          modelNumber: null
        }
      },
    };

    $highlightRowSetBackgroundColor.spectrum({
      replacerClassName: 'tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum',
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      show: function() {
        bgColorPickerUsed = false;
        eventSettings.data_to_send.sectionTarget.sectionID = $highlightSectionId.val();
        eventSettings.data_to_send.sectionTarget.modelNumber = $highlightModelId.val();
        bgColorActive = JSON.parse( hightlightRowInfo.color_bg_section_active );
        Rexlive_Color_Palette.show({
          $target: $fastRowSetBkgrCol,
          object: "section",
          action: "background"
        });
      },
      change: function() {
        //
      },
      move: function(color) {
        eventSettings.data_to_send.active = true;
        eventSettings.data_to_send.color = color.toRgbString();
        if( bgColorActive ) {
          eventSettings.eventName = "rexlive:change_section_bg_color";
        } else {
          eventSettings.eventName = "rexlive:apply_background_color_section";
        }

        _sendIframeBuilderMessage(eventSettings);

        bgColorPickerUsed = true;
      },
      hide: function(color) {
        Rexlive_Color_Palette.hide();
        if(bgColorPickerUsed) {
          // Synch top toolbar tools
          Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            color_bg_section_active: "true",
            color_bg_section: color.toRgbString(),
          });
          Rexbuilder_Util_Admin_Editor.updateBkgrColTool();

          eventSettings.data_to_send.active = true;
          eventSettings.data_to_send.color = color.toRgbString();

          eventSettings.eventName = "rexlive:apply_background_color_section";
          _sendIframeBuilderMessage(eventSettings);
        }

        bgColorPickerUsed = false;
      },
    });
  };

  /**
   * Init the row overlay color picker
   * Listen to the events and change the color accordly
   * Get the data from the hightlightRowInfo object
   * @since 2.0.0
   */
  var _initOverlayColorPicker = function() {
    var overlayPickerUsed = false;
    var overlayColorActive = false;
    var eventSettings = {
      eventName: null,
      data_to_send: {
        color: null,
        sectionTarget: {
          sectionID: null,
          modelNumber: null
        }
      },
    };

    $highlightRowSetOverlay.spectrum({
      replacerClassName: 'tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum',
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      show: function() {
        overlayPickerUsed = false;
        eventSettings.data_to_send.sectionTarget.sectionID = $highlightSectionId.val();
        eventSettings.data_to_send.sectionTarget.modelNumber = $highlightModelId.val();
        overlayColorActive = JSON.parse( hightlightRowInfo.row_overlay_active );
        Rexlive_Overlay_Palette.show({
          $target: $fastRowSetOverlay,
          object: "section",
          action: "overlay"
        });
      },
      move: function(color) {
        eventSettings.data_to_send.active = true;
        eventSettings.data_to_send.color = color.toRgbString();
        if( overlayColorActive ) {
          eventSettings.eventName = "rexlive:change_section_overlay_color";
        } else {
          eventSettings.eventName = "rexlive:change_section_overlay";
        }

        _sendIframeBuilderMessage(eventSettings);

        overlayPickerUsed = true;
      },
      hide: function(color) {
        Rexlive_Overlay_Palette.hide();
        if(overlayPickerUsed) {
          // Synch top toolbar tools
          Rexbuilder_Util_Admin_Editor.highlightRowSetData({
            row_overlay_active: "true",
            row_overlay_color: color.toRgbString(),
          });
          Rexbuilder_Util_Admin_Editor.updateBkgrOverlayTool();

          eventSettings.data_to_send.active = true;
          eventSettings.data_to_send.color = color.toRgbString();

          eventSettings.eventName = "rexlive:change_section_overlay";
          _sendIframeBuilderMessage(eventSettings);
        }

        overlayPickerUsed = false;
      },
    });
  };

  /**
   * Gets the mouse event click and returns the x,y coordinates of the pointer
   * If no valid event is passed, get the middle of the screen
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
        y: pos.top + Rexbuilder_Util_Admin_Editor.mousePositionFrameYOffset,
      }
    } else {
      mousePosition = {
        x: Rexbuilder_Util_Admin_Editor.viewportMeasurement.width/2,
        y: Rexbuilder_Util_Admin_Editor.viewportMeasurement.height/2,
      };
    }
    return mousePosition;
  }

  /**
   * Setting the value of an attribute of the Highlighted row
   * @param {Object} attr attribute name
   */
  var _highlightRowSetData = function( data ) {
    if( "" !== data && "undefined" !== typeof data ) {
      for( var attr in data ) {
        hightlightRowInfo[attr] = data[attr];
      }
    }
  };

  var _openRowColorPaletteModal = function() {
    var rowData = {
      gradient: hightlightRowInfo.color_bg_section,
      sectionTarget: {
        sectionID: $highlightSectionId.val(),
        modelNumber: $highlightModelId.val()
      }
    };
    Rexlive_Section_Background_Gradient.openModal(rowData);
  };

  var _openRowOverlayPaletteModal = function() {
    var rowData = {
      gradient: hightlightRowInfo.row_overlay_color,
      sectionTarget: {
        sectionID: $highlightSectionId.val(),
        modelNumber: $highlightModelId.val()
      }
    };
    Rexlive_Section_Overlay_Gradient.openModal(rowData);
  };

  /**
   * Return the valid linear gradient CSS rule for the actual browser
   * @param {string} gradient Gradient to safe
   */
  var _getGradientSafeValue = function( gradient ) {
    var sandEl = document.createElement('div');

    var style = sandEl.style;
    var values = Rexbuilder_Util_Admin_Editor.getPrefixedValues( gradient );
    var val;

    for (var i = 0; i < values.length; i++) {
      val = values[i];
      style.backgroundImage = val;

      if (style.backgroundImage == val) {
          break;
      }
    }

    return style.backgroundImage;
  }

  /**
   * Add gradient prefix to a linear gradient
   * @param {string} value clean linear gradient
   */
  var _getPrefixedValues = function(value) {
    var prefs = ['-moz-', '-webkit-', '-o-', '-ms-'];
    var res = [];
    for(var i=0; i < prefs.length; i++) {
      res.push( prefs[i] + value );
    }
    return res;
  }

  var _addSpectrumCustomSaveButton = function( $picker ) {
    var choose = tmpl('tmpl-tool-simple-save', {});
    var $choose = $(choose);
    $picker.spectrum('container').append($choose);

    $choose.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $picker.spectrum('container').find('.sp-choose').trigger('click');
    });
  };

  var _addSpectrumCustomCloseButton = function( $picker ) {
    var close = tmpl('tmpl-tool-close', {});
    var $close = $(close);
    $picker.spectrum('container').append($close);

    $close.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $picker.attr("data-revert", true);
      $picker.spectrum('container').find('.sp-cancel').trigger('click');
    });
  };

  var _forceTriggerLoad = function () {
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if(isIE){
      if(!this.triggeredLoad){
        this.triggeredLoad = true;
        this.$frameBuilder.trigger("load");
      }
    }
  }

  // init the utilities
  var init = function() {
    this.$body = $('body');
    this.$rexpansiveContainer = $("#rexpansive-builder-backend-wrapper");
    $frameContainer = this.$rexpansiveContainer.find( ".rexpansive-live-frame-container" );
    this.$frameBuilder = this.$rexpansiveContainer.find( "#rexpansive-live-frame" );
    frameBuilderWindow = this.$frameBuilder[0].contentWindow;
    $frameBuilderWindow = $(frameBuilderWindow);

    this.triggeredLoad = false;
    this.$liveFrameRexContainer = {};
    this.dragImportType = "";
    this.stopScrolling = true;

    this.transitionEvent = _whichTransitionEvent();
    this.animationEvent = _whichAnimationEvent();

    this.mousePositionFrameYOffset = 50;
    this.viewportMeasurement = Rexlive_Base_Settings.viewport();

    this.$responsiveToolbar = this.$rexpansiveContainer.find( ".rexlive-toolbox" );
    $highlightSectionId = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('input[name=toolbox-insert-area--row-id]');
    $highlightModelId = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('input[name=toolbox-insert-area--row-model-id]');
    $highlightModelEditing = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('input[name=toolbox-insert-area--row-model-editing]');
    $highlightRowSetWidth = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.edit-row-width-toolbox');
    $highlightRowSetLayout = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.edit-row-layout-toolbox');
    $highlightRowSetLayoutCheckbox = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.edit-row-layout-toolbox-checkbox');
    $highlightRowSetCollapse = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.toolbox-collapse-grid');

    var $toolboxConfig = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.toolbox-right-config-area');
    var $toolboxFast = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.toolbox-right-fast-config-area');

    $configRowSetBkgrImg = $toolboxConfig.find('.edit-row-image-background-toolbox');
    $fastRowSetBkgImg = $toolboxFast.find('.edit-row-image-background-toolbox');
    $highlightRowSetBackgroundImg = $configRowSetBkgrImg.add($fastRowSetBkgImg);

    $configRowSetBkgrCol = $toolboxConfig.find('input[name=edit-row-color-background-toolbox]');
    $fastRowSetBkgrCol = $toolboxFast.find('input[name=edit-row-color-background-toolbox]');
    $highlightRowSetBackgroundColor = $configRowSetBkgrCol.add($fastRowSetBkgrCol);

    $configRowSetOverlay = $toolboxConfig.find('input[name=edit-row-overlay-color-toolbox]');
    $fastRowSetOverlay = $toolboxFast.find('input[name=edit-row-overlay-color-toolbox]');
    $highlightRowSetOverlay = $configRowSetOverlay.add($fastRowSetOverlay);

    $configRowSetVideo = $toolboxConfig.find('.edit-row-video-background-toolbox');
    $fastRowSetVideo = $toolboxFast.find('.edit-row-video-background-toolbox');
    $highlightRowSetVideo = $configRowSetVideo.add($fastRowSetVideo);
    
    $saveBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find( ".btn-save" );
    $undoBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find( ".btn-undo" );
    $redoBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find( ".btn-redo" );
    Rexbuilder_Util_Admin_Editor.pageSaved = true;
    modelSaved = true;
    open_models_list = [];
    activeLayoutPage = "default";
    activeLayoutPageLabel = "default";
    this.$responsiveToolbar
      .find(".builder-default-layout")
      .addClass("active-layout");
    this.activeWidth = 0;

    input_selector =
      "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea";

    NProgress.configure({
      template: '<div class="bar" role="bar"><div class="peg"></div></div>'
    });

    $frameContainer.on(
      Rexbuilder_Util_Admin_Editor.transitionEvent,
      function() {
        if (updatedLayoutData !== null && 'undefined' !== typeof updatedLayoutData) {
          _sendIframeBuilderMessage(updatedLayoutData);
        }
      }
    );
    
    this.$frameBuilder.load(function () {
      Rexbuilder_Util_Admin_Editor.$liveFrameRexContainer = $(Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow.document).find(".rex-container").eq(0);
    });

    _initToolbar();
    _addDocumentListeners();
  };

  return {
    init: init,
    pageSaved: pageSaved,
    createRandomID: _createRandomID,
    sendIframeBuilderMessage: _sendIframeBuilderMessage,
    updateLayoutPage: _updateLayoutPage,
    getActiveLayout: _getActiveLayout,
    setActiveLayout: _setActiveLayout,
    updateIframeWidth: _updateIframeWidth,
    updateLayoutActiveData: _updateLayoutActiveData,
    releaseIframeRows: _releaseIframeRows,
    blockIframeRows: _blockIframeRows,
    editPageProperties: _editPageProperties,
    updateOpenModelsList: _updateOpenModelsList,
    highlightRowSetData: _highlightRowSetData,
    updateTopToolbar: _updateTopToolbar,
    updateModelId: _updateModelId,
    updateModelEditing: _updateModelEditing,
    updateModelState: _updateModelState,
    updateWidthTool: _updateWidthTool,
    updateLayoutTool: _updateLayoutTool,
    updateLayoutCheckboxTool: _updateLayoutCheckboxTool,
    updateBkgrImgTool: _updateBkgrImgTool,
    updateBkgrColTool: _updateBkgrColTool,
    updateBkgrOverlayTool: _updateBkgrOverlayTool,
    updateBkgrVidTool: _updateBkgrVidTool,
    getGradientSafeValue: _getGradientSafeValue,
    getPrefixedValues: _getPrefixedValues,
    openRowColorPaletteModal: _openRowColorPaletteModal,
    openRowOverlayPaletteModal: _openRowOverlayPaletteModal,
    addSpectrumCustomSaveButton: _addSpectrumCustomSaveButton,
    addSpectrumCustomCloseButton: _addSpectrumCustomCloseButton,
    scrollFrame: _scrollFrame,
    setScroll: _setScroll,
    addClassToLiveFrameRexContainer: _addClassToLiveFrameRexContainer,
    removeClassToLiveFrameRexContainer: _removeClassToLiveFrameRexContainer,
    forceTriggerLoad: _forceTriggerLoad
  };
})(jQuery);
