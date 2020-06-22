/**
 * Util functions on RexLive
 * @since 2.0.0
 */
var Rexbuilder_Util_Editor = (function($) {
  "use strict";

  /**
   * Make visibile the plus button under the container
   * @param  {Object} $s section
   * @return {void}
   */
  var _activeAddSection = function( $s ) {
    $s = 'undefined' !== typeof $s ? $s : null;
    Rexbuilder_Util.$rexContainer.parent().removeClass('add-new-section--hide');
    if ( $s ) {
      $s.removeClass("activeRowTools");
    }
  }

	/**
	 * @param {jQuery} $textWrap Text-wrap whose container block height has to be update
	 * @param	{Boolean}		needToSave
	 */
	var _updateBlockContainerHeight = function ($textWrap, needToSave, forceFixedText) {
		needToSave = undefined === needToSave ? true : needToSave;
		this.needToSave = needToSave;

		var galleryInstance = Rexbuilder_Util.getGalleryInstance($textWrap.parents('.rexpansive_section').eq(0));
		galleryInstance.updateElementHeight($textWrap.parents('.grid-stack-item').get(0), undefined, forceFixedText);

		// updating insertButton position
		var insertButton = TextEditor.getEditorInstance().getExtensionByName('insert-media');
		if (insertButton) {
			var $wrapper = $textWrap.parents('.grid-item-content-wrap');
			insertButton.placeMediaBtn($wrapper);
		}
		this.needToSave = true;
	};

  /**
   * Remove scrollbars from element
   * @param {object} $elem element to remove scrollbars
   * @deprecated
   */
  var _removeScrollBar = function($elem) {
    if( true == Rexbuilder_Util_Editor.scrollbarsActive ) {
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
    }
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

  var endEditingElement = function() {
    var galleryEditorInstance = Rexbuilder_Util_Editor.editedGallery;

    if ( galleryEditorInstance ) clearTimeout(galleryEditorInstance.doubleDownTimer);
    Rexbuilder_Util_Editor.elementIsDragging = false;
    if ( Rexbuilder_Util_Editor.editedTextWrap ) Rexbuilder_Util_Editor.editedTextWrap.blur();

    if ( galleryEditorInstance ) galleryEditorInstance.focusElementEditing( Rexbuilder_Util_Editor.editedElement );

    // galleryEditorInstance.unFocusElement(Rexbuilder_Util_Editor.editedElement);

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

  var _updateContainerMargins = function(data){
    var $parentContainer = Rexbuilder_Util.$rexContainer.parents(".rexbuilder-live-content").eq(0);
    if(data.distances.vals.top > 0){
      $parentContainer.addClass("fix-tools-first-row");
    } else{
      $parentContainer.removeClass("fix-tools-first-row");
    }
    $parentContainer.css("margin-top", data.distances.vals.top);
    // @todo add margin to container
  }

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

    Rexbuilder_Util_Editor.undoStackArray.push(action);
    Rexbuilder_Util_Editor.redoStackArray = [];

    _sendUndoRedoInformation();
  };

  var _sendUndoRedoInformation = function() {
    var ur_data = {
      eventName: "rexlive:undoRedoStackChange",
      stacks: {
        undo: Rexbuilder_Util_Editor.undoStackArray.length,
        redo: Rexbuilder_Util_Editor.redoStackArray.length
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

  /**
   * @deprecated ??
   */
  var _getStacks = function() {
    var stacks = {
      undo: Rexbuilder_Util_Editor.undoStackArray,
      redo: Rexbuilder_Util_Editor.redoStackArray
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
   * Launch loading animation on the editor
   * @since 2.0.0
   */
  var _startLoading = function(animate_contents) {
    animate_contents =
      typeof animate_contents !== "undefined" ? animate_contents : true;

    if ( animate_contents ) {
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
        $sec.parent().append('<div class="rexpansive-lock-section"></div>');
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

  /**
   * Lock rows to prevent tools visibility on hover
   * @param {jQuery Object} $exclude row to exclude from beign locked
   */
  var _lockRowsLight = function( $exclude ) {
    $exclude = undefined !== typeof $exclude ? $exclude : null;
    var $tempTargets = Rexbuilder_Util.$rexContainer.children(".rexpansive_section");
    if( null !== $exclude ) {
      $tempTargets.not($exclude);
    }

    $tempTargets.addClass("rexpansive-lock-section--light");
  }

  /**
   * Remove the lock from the rows
   * Remove the drag button
   * @since 2.0.0
   */
  var _releaseRowsLight = function() {
    Rexbuilder_Util.$rexContainer.children(".rexpansive_section").removeClass("rexpansive-lock-section--light").removeClass("rexpansive-lock-section--overlay");
    Rexbuilder_Util.$rexContainer.find(".grid-stack-item--drag-to-row").removeClass("grid-stack-item--drag-to-row");
    Rexbuilder_Util.$rexContainer.find(".drag-to-section-simulator").remove();
  }

  /**
   * Return the valid linear gradient CSS rule for the actual browser
   * @param {string} gradient Gradient to safe
   */
  var _getGradientSafeValue = function( gradient ) {
    var sandEl = document.createElement('div');

    var style = sandEl.style;
    var values = Rexbuilder_Util_Editor.getPrefixedValues( gradient );
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

  var _synchGradient = function() {
    $(".text-gradient").each(function(i,el) {
      var gradient = el.getAttribute("data-gradient");
      gradient = _getGradientSafeValue( gradient );
      var $el = $(el);
      $el.css("background",gradient);
      $el.css("-webkit-background-clip", "text");
      $el.css("-webkit-text-fill-color", "transparent"); 
    });
  }

  var _checkVisibleRow = function() {
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
    
    Rexbuilder_Util.$window.on("scroll", function(e) {
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

    /**
     * Find the visibile Row
     * @since 2.0.0
     */
    function whichVisible() {
      var win_height = $(window).height(),
        win_height_padded_bottom,
        win_height_padded_top;
      win_height_padded_bottom = win_height * 0.8;
      win_height_padded_top = win_height * 0.3;

      // ruleTop.style.top = win_height_padded_top + 'px';
      // ruleBottom.style.top = win_height_padded_bottom + 'px';
      
      var spotted = null;
      
      Rexbuilder_Util.$rexContainer.find(".rexpansive_section").each(function(i,el) {
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

    /**
     * Setting interval to activate or not the top fast row tools
     * @since 2.0.0
     */
    setInterval(function() {
      // if( didScrollViewTopToolsEvent && !Rexbuilder_Util.$rexContainer.hasClass("forced-top-tools") ) {
      if( didScrollViewTopToolsEvent ) {
        didScrollViewTopToolsEvent = false;

        var $highlighted = Rexbuilder_Util.$rexContainer.find(".rexpansive_section.highLightRow");
        var $hovered = Rexbuilder_Util.$rexContainer.find(".rexpansive_section.focusedRow");
        var $first = Rexbuilder_Util.$rexContainer.find(".rexpansive_section").first();
        var data;

        if( $highlighted.length > 0 ) {
          if( _isElVisible( $highlighted ) ) {
            if( $highlighted.is($first) ) {
              data = { eventName: "rexlive:hideTopFastTools" };
            } else {
              if( $hovered.length > 0 ) {
                if( $highlighted.is($hovered) ) {
                  data = { eventName: "rexlive:hideTopFastTools" };
                }
              } else {
                data = { eventName: "rexlive:viewTopFastTools" };
              }
            }
          } else {
            if( $hovered.length > 0 ) {
              if( $highlighted.is($hovered) ) {
                data = { eventName: "rexlive:viewTopFastTools" };
              }
              // else {
              //   data = { eventName: "rexlive:hideTopFastTools" };
              // }
            } else {
              data = { eventName: "rexlive:viewTopFastTools" };
            }
          }
        } else {
          data = { eventName: "rexlive:hideTopFastTools" };
        }

        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }
    }, 250);

		var $tracedHighlightRow;

    /**
     * Check hover in on a row
     * @since 2.0.0
     */
    Rexbuilder_Util.$rexContainer.on("mouseenter", ".rexpansive_section", function(e) {
      var $thisRow = $(this);
      var data;
      if( $thisRow.hasClass("highLightRow") ) {
        if( _isElVisible( $thisRow ) ) {
          // Rexbuilder_Util.$rexContainer.addClass("forced-top-tools");
          data = { eventName: "rexlive:hideTopFastTools" };
        } else {
          data = { eventName: "rexlive:viewTopFastTools" };
        }
      } else {
        $tracedHighlightRow = Rexbuilder_Util.$rexContainer.find(".rexpansive_section.highLightRow");
        _traceVisibileRow( this );

        if( _isElVisible( $thisRow ) ) {
          data = { eventName: "rexlive:hideTopFastTools" };
        } else {
          data = { eventName: "rexlive:viewTopFastTools" };
        }
      }
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  
    /**
     * Check hover out from a row
     * @since 2.0.0
     */
    Rexbuilder_Util.$rexContainer.on("mouseleave", ".rexpansive_section", function(e) {
      var $thisRow = $(this);
      var $first = Rexbuilder_Util.$rexContainer.find(".rexpansive_section").first();
      if( !$thisRow.is($first) ) {
        var data;
        data = { eventName: "rexlive:viewTopFastTools" };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
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
    if ( 'undefined' !== typeof el )
    {
      var attrsMap = el.attributes;
      for( var i=0; i < attrsMap.length; i++ ) {
        if( 'class' !== attrsMap[i].name && 'style' !== attrsMap[i].name ) {
          obj[attrsMap[i].name.replace('data-','')] = attrsMap[i].value;
        }
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
    var $rows = Rexbuilder_Util.$rexContainer.find(".rexpansive_section").removeClass('highLightRow');
    var $hovered = $rows.filter(".focusedRow");
    var $thisRow = $(el);
    if( $hovered.length == 0 || $thisRow.is($hovered) ) {
      $thisRow.addClass('highLightRow');

      Rexbuilder_Util_Editor.visibleRow = el;
      Rexbuilder_Util_Editor.visibleRowInfo = {
        sectionID: el.getAttribute('data-rexlive-section-id'),
        modelNumber: typeof el.getAttribute("data-rexlive-model-number") != "undefined" ? el.getAttribute("data-rexlive-model-number") : "",
        modelEditing: typeof el.getAttribute("data-rexlive-model-editing") != "undefined" ? el.getAttribute("data-rexlive-model-editing") : "",
      };

      var visibleRowInfo = {};
      var sectionData = $thisRow.find('.section-data')[0];   // corresponds to .section-data div
      visibleRowInfo = _rowAttrsObj( sectionData );
      visibleRowInfo.collapse = el.getAttribute('data-rex-collapse-grid');

      var data = {
        eventName: "rexlive:traceVisibleRow",
        sectionTarget: Rexbuilder_Util_Editor.visibleRowInfo,
        rowInfo: visibleRowInfo
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    }
  };

  var _isElVisible = function( $el, offsetTop, offsetBottom ) {
    offsetTop = undefined === typeof offsetTop ? offsetTop : 0;
    offsetBottom = undefined === typeof offsetBottom ? offsetBottom : 0;

    var elementPositionTop = $el.offset().top,
      elementHeight = $el.height(),
      scrolled = $(window).scrollTop();
    if( ( elementPositionTop + offsetTop ) < scrolled && ( elementPositionTop + elementHeight + offsetBottom ) > scrolled ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Tell the parent that the user edited the builder
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

  /**
   * Check if display or not the add new row button
   * If there is only an empty row, do not show the button,
   * otherwise yes
   * @return {void}
   */
  var _checkNewEmptyPage = function() {
    var $rows = Rexbuilder_Util.$rexContainer.find(".rexpansive_section:not(removing_section)");
    if( "1" == $rows.length && $rows.hasClass('empty-section') ) {
      Rexbuilder_Util.$rexContainer.parent().addClass('add-new-section--hide');
      $rows.addClass("activeRowTools");
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
    this.viewportMeasurement = Rexbuilder_Util.globalViewport;

    this.elementDraggingTriggered = false;

    this.focusedElement = null;

    this.hasResized = false;
    this.changedLayout = false;
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

    this.dragAndDropFromParent = false;
    this.undoStackArray = [];
    this.redoStackArray = [];

    this.needToSave = true;

    this.$styleElement = $("#rexpansive-builder-style-inline-css");
    // _synchGradient();
  };

  var load = function() {
    _checkVisibleRow();
    _checkNewEmptyPage();

    _fixCustomStyleElement();
  };

  return {
    init: init,
    load: load,
    // removeScrollBar: _removeScrollBar,
    activeAddSection: _activeAddSection,
    endEditingElement: endEditingElement,
    startEditingElement: startEditingElement,
    sendParentIframeMessage: sendParentIframeMessage,
    addCustomClass: _addCustomClass,
    removeCustomClass: _removeCustomClass,
    escapeRegExp: _escapeRegExp,
    pushAction: _pushAction,
    getIDs: getIDs,
    getStacks: _getStacks,
    getTextWrapLength: _getTextWrapLength,
    rowAttrsObj: _rowAttrsObj,
    blockAttrsObj: _rowAttrsObj,
    startLoading: _startLoading,
    endLoading: _endLoading,
    builderEdited: _builderEdited,
    getMousePosition: _getMousePosition,
    lockRows: _lockRows,
    lockRowsLight: _lockRowsLight,
    releaseRows: _releaseRows,
    releaseRowsLight: _releaseRowsLight,
    getGradientSafeValue: _getGradientSafeValue,
    getPrefixedValues: _getPrefixedValues,
    synchGradient: _synchGradient,
    updateBlockContainerHeight: _updateBlockContainerHeight,
    updateContainerMargins: _updateContainerMargins,
    sendUndoRedoInformation: _sendUndoRedoInformation,
    restorePageStartingState: _restorePageStartingState
  };
})(jQuery);
