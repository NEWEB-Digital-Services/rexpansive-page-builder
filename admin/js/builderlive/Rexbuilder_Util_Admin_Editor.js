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

  var $highlightSectionId;
  var $highlightModelId;
  var hightlightRowInfo;
  var $highlightRowSetWidth;
  var $highlightRowSetLayout;
  var $highlightRowSetCollapse;

  var open_models_list;

  var $frameContainer;
  var frameBuilderWindow;

  var updatedLayoutData;

  var input_selector;

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
          pageSaved = false;
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
        hightlightRowInfo = event.data.rowInfo;
        _updateToolsInfo();
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

      if (event.data.eventName == "rexlive:editBackgroundSection") {
        SectionBackground_Modal.openSectionBackgroundModal(event.data.activeBG);
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

      if (event.data.eventName == "rexlive:editBlockImageSettings") {
        Block_Image_Editor_Modal.openModal(event.data.activeBlockData, event.data.mousePosition);
      }

      if (event.data.eventName == "rexlive:editBlockVideoBackground") {
        Block_Video_Background_Modal.openBlockVideoBackgroundModal( event.data.activeBlockData, event.data.mousePosition );
      }

      if (event.data.eventName == "rexlive:editRemoveModal") {
        Model_Edit_Modal.openModal(event.data.modelData);
      }

      if (event.data.eventName == "rexlive:saveAndCloseModel") {
        _updateOpenModelsList('CLOSE',event.data.modelData);
      }

      if (event.data.eventName == "rexlive:savePageEnded") {
        switch (event.data.dataSaved) {
          case "model":
            modelSaved = true;
            break;
          case "page":
            pageSaved = true;
            break;
          default:
            break;
        }
        if (modelSaved && pageSaved) {
          NProgress.done();
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.attr( "data-rex-edited-backend", false );
          $saveBtn.removeClass("page-edited");
          // Rexbuilder_Util_Admin_Editor.$body.removeClass('page-edited');
          $saveBtn.removeClass("rex-saving");
          if (
            typeof event.data.buttonData !== "undefined" &&
            event.data.buttonData != ""
          ) {
            _updateLayoutPage(event.data.buttonData);
          }
        }
      }

      if (event.data.eventName == "rexlive:restoreStateEnded") {
        modelSaved = true;
        pageSaved = true;
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
    }
  };

  var _addDocumentListeners = function() {
    Rexlive_Base_Settings.$document.on("click", ".btn-builder-layout", function(e) {
      var $btn = $(e.target).parents(".btn-builder-layout");
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
          pageSaved: pageSaved
        };

        if (
          Rexbuilder_Util_Admin_Editor.$rexpansiveContainer
            .attr("data-rex-edited-backend")
            .toString() == "true"
        ) {
          LockedOptionMask.openModal(dataObj);
        } else {
          if (!(modelSaved && pageSaved)) {
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
      Model_Import_Modal.openModal();
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
     */
    Rexlive_Base_Settings.$document.on('change', '.edit-row-layout-toolbox', function(e) {
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
     * Change the dimensions of the visible row
     * @since 2.0.0
     */
    Rexlive_Base_Settings.$document.on('change', '.edit-row-width-toolbox', function(e) {
      var width = '';
      var type = '';
      var vals = e.target.value.trim().split(/(\d+)/);
      width = vals[1];
      type = vals[2];

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

    window.addEventListener("message", _receiveMessage, false);
  };

  var _updateLayoutPage = function(buttonData) {
    modelSaved = true;
    pageSaved = true;
    activeLayoutPage = buttonData.id;
    activeLayoutPageLabel = buttonData.label;
    Rexbuilder_Util_Admin_Editor.$responsiveToolbar
      .find(".btn-builder-layout.active-layout")
      .removeClass("active-layout");
    Rexbuilder_Util_Admin_Editor.$responsiveToolbar
      .find('.btn-builder-layout[data-name="' + activeLayoutPage + '"]')
      .addClass("active-layout");

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
      console.log(updatedLayoutData);
      _sendIframeBuilderMessage(updatedLayoutData);
    }
  };

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

  /**
   * Live update of the top toolbar according to the visibile row
   * @since 2.0.0
   */
  var _updateToolsInfo = function() {
    if('true' == hightlightRowInfo.collapse) {
      $highlightRowSetCollapse.addClass('active');
    } else {
      $highlightRowSetCollapse.removeClass('active');
    }
    $highlightRowSetWidth.filter('[data-section_width=' + hightlightRowInfo.dimension + ']').attr('checked',true);
    $highlightRowSetLayout.filter('[value=' + hightlightRowInfo.layout + ']').attr('checked',true);
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
    pageSaved = false;
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
    var $backgroundPicker = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('input[name=edit-row-color-background-toolbox]');
    $backgroundPicker.spectrum({
      replacerClassName: 'tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum',
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
    });

    var $overlayPicker = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('input[name=edit-row-overlay-color-toolbox]');
    $overlayPicker.spectrum({
      replacerClassName: 'tool-button tool-button--inline tool-button--empty tool-button--color tool-button--spectrum',
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
    });
  }

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
      console.log(pos);
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

  // init the utilities
  var init = function() {
    this.$body = $('body');
    this.$rexpansiveContainer = $("#rexpansive-builder-backend-wrapper");
    $frameContainer = this.$rexpansiveContainer.find( ".rexpansive-live-frame-container" );
    this.$frameBuilder = this.$rexpansiveContainer.find( "#rexpansive-live-frame" );
    frameBuilderWindow = this.$frameBuilder[0].contentWindow;

    this.transitionEvent = _whichTransitionEvent();
    this.animationEvent = _whichAnimationEvent();

    this.mousePositionFrameYOffset = 50;
    this.viewportMeasurement = Rexlive_Base_Settings.viewport();

    this.$responsiveToolbar = this.$rexpansiveContainer.find( ".rexlive-toolbox" );
    $highlightSectionId = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('input[name=toolbox-insert-area--row-id]');
    $highlightModelId = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('input[name=toolbox-insert-area--row-model-id]');
    $highlightRowSetWidth = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.edit-row-width-toolbox');
    $highlightRowSetLayout = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.edit-row-layout-toolbox');
    $highlightRowSetCollapse = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find('.toolbox-collapse-grid');

    $saveBtn = Rexbuilder_Util_Admin_Editor.$responsiveToolbar.find( ".btn-save" );
    pageSaved = true;
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

    _initToolbar();
    _addDocumentListeners();
  };

  return {
    init: init,
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
    updateOpenModelsList: _updateOpenModelsList
  };
})(jQuery);
