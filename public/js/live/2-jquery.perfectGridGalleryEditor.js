/*
 *  Perfect Grid Gallery Editor
 *  @since 2.0.0
 */

;(function($, window, document, _, undefined) {
  "use strict";

  // Create the defaults once
  var pluginName = "perfectGridGalleryEditor",
    defaults = {
      itemSelector: ".perfect-grid-item",
      gridItemWidth: 0.0833333333,
      numberCol: 12,
      gridSizerSelector: ".perfect-grid-sizer",
      galleryLayout: "fixed",
      separator: 20,
      fullHeight: "false",
      gridParentWrap: ".rexpansive_section",
      mobilePadding: "false",
      cellHeightMasonry: 5,
      scrollbarWrapClass: ".rexlive-custom-scrollbar",
      editorMode: false
    };

  /**
   * UTILITIES
   */
  /**
   * Class manipulation methods
   */
  var hasClass, addClass, removeClass, toggleClass;

  if ('classList' in document.documentElement) {
    hasClass = function (el, className) { return el.classList.contains(className); };
    addClass = function (el, className) { el.classList.add(className); };
    removeClass = function (el, className) { el.classList.remove(className); };
  } else {
    hasClass = function (el, className) {
      return new RegExp('\\b' + className + '\\b').test(el.className);
    };
    addClass = function (el, className) {
      if (!hasClass(el, className)) { el.className += ' ' + className; }
    };
    removeClass = function (el, className) {
      el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
    };
  }

  toggleClass = function (el, className) {
    if (hasClass(el, className)) {
      removeClass(el, className);
    } else {
      addClass(el, className);
    }
  };

  /**
   * Get js animation end event name
   * @return {string} event animation end name, based on browser
   */
  var whichAnimationEvent = function() {
    var t, el = document.createElement("fakeelement");

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

  // Calculate the viewport of the window
  function viewport() {
    var e = window,
      a = "inner";
    if (!("innerWidth" in window)) {
      a = "client";
      e = document.documentElement || document.body;
    }
    return { width: e[a + "Width"], height: e[a + "Height"] };
  }

  // timing utilities
  /**
   * Set timeout function rewritten with requestanimation frame
   * @param  {Function} callback [description]
   * @param  {Number}   delay    delay time
   * @return {Object}
   */
  function rtimeOut( callback, delay ) {
    var dateNow = Date.now,
      requestAnimation = window.requestAnimationFrame,
      start = dateNow(),
      stop,
      timeoutFunc = function(){
        dateNow() - start < delay ? stop || requestAnimation(timeoutFunc) : callback();
      };
    requestAnimation(timeoutFunc);

    return {
      clear:function(){stop=1;}
    };
  }

  /**
   * Util function to print the blocks infos of this row
   * @since 2.0.0
   */
  function log_block_infos() {
    var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
    items.forEach(function(el,i) {
      console.table({
        id: el.getAttribute('id'),
        x: el.getAttribute('data-gs-x'),
        y: el.getAttribute('data-gs-y'),
        w: el.getAttribute('data-gs-width'),
        h: el.getAttribute('data-gs-height')
      });
    });
  }

  /**
   * Util function to get the blocks infos of this row
   * @since 2.0.0
   */
  function get_block_infos() {
    var nodes = [];
    var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
    items.forEach(function(el,i) {
      nodes.push({
        id: el.getAttribute('id'),
        rexId: el.getAttribute('data-rexbuilder-block-id'),
        x: parseInt( el.getAttribute('data-gs-x') ),
        y: parseInt( el.getAttribute('data-gs-y') ),
        w: parseInt( el.getAttribute('data-gs-width') ),
        h: parseInt( el.getAttribute('data-gs-height') )
      });
    });
    return nodes;
  }

  function isEven(number) {
    return number % 2 == 0;
  }

  /**
   * Calculate the height of the text content of the block
   * Add the padding of the parent blocks
   * @param {jQuery Object} $textWrap object that contains the text content of the block
   * @since 2.0.0
   * @todo To be fixed by putting a single return
   */
  function calculateTextWrapHeight( $textWrap ) {
    var textWrap = $textWrap[0];
    var textHeight = 0;
    if ( hasClass( textWrap, "medium-editor-element" ) ) {
      var $textWrapClone = $textWrap.clone(false);
      if ( $textWrapClone.text().trim().length != 0 || 0 !== $textWrapClone.find('img,iframe,i').length ) {
        if ( ( $textWrap.hasClass("medium-editor-element") && ( ! hasClass( textWrap, "medium-editor-placeholder" ) || textWrap.childElementCount > 1 ) ) || $textWrap.parents(".pswp-item").length != 0 ) {
          var gicwStyles = window.getComputedStyle( $textWrap.parents('.grid-item-content-wrap')[0] );
          textHeight = $textWrap.innerHeight() + Math.ceil(parseFloat(gicwStyles['padding-top'])) + Math.ceil(parseFloat(gicwStyles['padding-bottom']));
        }
      }
    } else {
      if ( !$textWrap.parents('.perfect-grid-item').hasClass('block-has-slider') && ( textWrap.textContent.trim().length != 0 || 0 !== $textWrap.find('img,iframe,i').length ) ) {
        var gicwStyles = window.getComputedStyle( $textWrap.parents('.grid-item-content-wrap')[0] );
        textHeight = $textWrap.innerHeight() + Math.ceil(parseFloat(gicwStyles['padding-top'])) + Math.ceil(parseFloat(gicwStyles['padding-bottom']));
      }
    }
    return textHeight;
  }

  /**
   * Calculate the height of the text content of a block
   * @param  {jQuery}  $textWrap text wrap element
   * @return {Integer}            necessary text height
   */
  function calculateTextWrapHeightNew( $textWrap ) {
    if ( 0 === $textWrap.length ) return 0;

    var textHeight = 0;
    var textWrap = $textWrap[0];
    var blockHasSlider = $textWrap.parents('.perfect-grid-item').hasClass('block-has-slider');

    var textWrapClone = textWrap.cloneNode(true);
    var meSpanFix = textWrapClone.querySelector('.text-editor-span-fix');
    if ( meSpanFix ) { meSpanFix.parentNode.removeChild( meSpanFix ); }

    if ( ! blockHasSlider && ( 0 !== textWrapClone.textContent.trim().length || 0 !== textWrapClone.childElementCount ) ) {
      if ( ( ! hasClass( textWrap, "medium-editor-placeholder" ) || textWrapClone.childElementCount > 0 ) || $textWrap.parents(".pswp-item").length != 0 ) {
        textHeight = textWrap.offsetHeight;
      }
		}

    return textHeight;
  }

  // add span elements that will be used as handles of the element
  function addHandles($elem, handles) {
    var elem = $elem[0];
    var span, $span;
    var div, $div;
    var stringID = elem.getAttribute("data-rexbuilder-block-id");
    var handlesA = handles.split(", ");
    var i, tot_handlesA = handlesA.length;

    for( i=0; i<tot_handlesA; i++ ) {
      span = document.createElement('span');
      addClass(span, "circle-handle");
      addClass(span, "circle-handle-" + handlesA[i]);
      span.setAttribute('data-axis', handlesA[i]);

      div = document.createElement('div');
      addClass(div, "ui-resizable-handle");
      addClass(div, "ui-resizable-" + handlesA[i]);
      div.setAttribute('data-axis', handlesA[i]);

      if( 'DIV' === elem.tagName.toUpperCase() ) {
        if ( '' !== stringID ) {
          div.setAttribute('id', '_handle_' + handlesA[i]);
        }
      }

      $span = $(span);
      $div = $(div);

      $span.appendTo($div);
      $div.appendTo($elem);
		}
  }

  /**
   * Timeout handlers
   * Put here to create only one function per handler
   */
  /**
   * Collapse first timeout handler
   * @param  {Object} reverseData
   * @return {void}
   */
  function handleCollapsFirstTimeout( reverseData ) {
		this.batchGridstack();
    this.updateCollapsedBlocksHeight();
		this.commitGridstack();

    // rtimeOut( handleCollapseSecondTimeout.bind( this, reverseData ), 500 );
    setTimeout( handleCollapseSecondTimeout.bind( this, reverseData ), 500 );

    this.properties.collapsingElements = false;
  }

  /**
   * Collapse second timeout handler
   * @param  {Object} reverseData
   * @return {void}
   */
  function handleCollapseSecondTimeout( reverseData ) {
    this._updateElementsSizeViewers();
    this._createFirstReverseStack();
    this._fixImagesDimension();
    var $section = this.$section;

    setTimeout( Rexbuilder_Util.fixYoutube.bind( null, $section[0] ), 1500 );

    if ( !Rexbuilder_Util.windowIsResizing && !Rexbuilder_Util.domUpdating ) {
      var event = jQuery.Event("rexlive:collapsingElementsEnded");
      event.settings = {
        galleryEditorInstance: this,
        $section: $section,
        reverseData: reverseData
      };
      $(document).trigger(event);
    }
  }

  /**
   * Global variables to share around the grid instances
   * @since  2.0.3
   */
  var animationEndEventName = whichAnimationEvent();

  /**
   * Global handling change of a grid. Prevent the multiple declaration
   * of the same function
   * @param  {Event} e    change event
   * @param  {Object} data gridsatck objects that change
   * @return {void}
   * @since  2.0.4
   */
  function handleChange(e, data) {
    if (
      this.element == e.target &&
      !Rexbuilder_Util_Editor.undoActive &&
      !Rexbuilder_Util_Editor.redoActive &&
      !Rexbuilder_Util_Editor.updatingRowDistances &&
      !Rexbuilder_Util_Editor.updatingSectionMargins &&
      !Rexbuilder_Util_Editor.updatingSectionLayout &&
      !Rexbuilder_Util.domUpdating &&
      !Rexbuilder_Util.windowIsResizing &&
      !this.properties.collapsingElements &&
      !Rexbuilder_Util_Editor.addingNewBlocks &&
      !Rexbuilder_Util_Editor.removingBlocks &&
      !Rexbuilder_Util_Editor.updatingImageBg &&
      !Rexbuilder_Util_Editor.updatingPaddingBlock &&
      !Rexbuilder_Util_Editor.updatingCollapsedGrid &&
      !Rexbuilder_Util_Editor.openingModel &&
      !Rexbuilder_Util_Editor.blockCopying &&
      !Rexbuilder_Util_Editor.savingPage &&
      !Rexbuilder_Util_Editor.savingModel &&
      Rexbuilder_Util_Editor.needToSave
    ) {
      var data = {
        eventName: 'rexlive:edited',
        modelEdited: this.$section.hasClass('rex-model-section'),
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);

      if (Rexbuilder_Util.activeLayout == 'default') {
        Rexbuilder_Util.updateDefaultLayoutStateSection(this.$section);
      }
      var actionData = this.createActionDataMoveBlocksGrid();
      this.$element.attr('data-rexlive-layout-changed', true);
      Rexbuilder_Util_Editor.pushAction(
        this.$section,
        'updateSectionBlocksDisposition',
        $.extend(true, {}, actionData),
        $.extend(true, {}, this.properties.reverseDataGridDisposition)
      );
      this.properties.reverseDataGridDisposition = actionData;
    }
  }

  /**
   * Global gridstack dragstart handler
   * @param  {Event} event drag event
   * @param  {Element} ui    drag element
   * @return {void}
   * @since  2.0.4
   */
  function handleGridstackDragstart(event, ui) {
    if (typeof ui === "undefined") return;

    Rexbuilder_Util_Editor.elementIsDragging = true;
    ui.helper
      .eq(0)
      .find(".text-wrap")
      .blur();

    // if (Rexbuilder_Util_Editor.editingElement) {
    //   Rexbuilder_Util_Editor.endEditingElement();
    // }
  }

  /**
   * Global gridstack dragstop handler
   * @param  {Event} event drag event
   * @param  {Element} ui    drag element
   * @return {void}
   * @since  2.0.4
   */
  function handleGridstackDragstop(event, ui) {
    if (typeof ui === "undefined") return;

    this.updateAllElementsProperties();
    Rexbuilder_Util_Editor.elementIsDragging = false;

    Rexbuilder_Util.editedDataInfo.setBlockData( this.$section.attr('data-rexlive-section-id'), ui.helper.attr('data-rexbuilder-block-id'), 'gs_x' );
    Rexbuilder_Util.editedDataInfo.setBlockData( this.$section.attr('data-rexlive-section-id'), ui.helper.attr('data-rexbuilder-block-id'), 'gs_y' );

    clearTimeout(this.doubleDownTimer);
  }

  /**
   * On Blur event on medium editor, check if there is text
   * @since 2.0.0
   * @version 2.0.4   moved outisde the class object
   * @deprecated 2.0.4
   */
  function handleBlur(e) {
    var $current_textWrap = $(e.currentTarget);
    var $top_tools = $current_textWrap.parents('.grid-stack-item').find('.block-toolBox__editor-tools');
    var $T_tool = $top_tools.find('.edit-block-content');
    var $content_position_tool = $top_tools.find('.edit-block-content-position');
    var temp = calculateTextWrapHeightNew($current_textWrap);
    if( 0 == temp ) {
      $T_tool.removeClass('tool-button--hide');
      $content_position_tool.addClass('tool-button--hide');
    } else {
      $T_tool.addClass('tool-button--hide');
      $content_position_tool.removeClass('tool-button--hide');
    }
  }

  /**
   * On double click event, place correctly the medium editor caret
   * @param  {Event} e dobule click event
   * @return {void}
   * @since  2.0.4    move the handler oustide the plugin declaration
   */
  function handleDbClick(e) {
    if ( 'default' !== Rexbuilder_Util.activeLayout ) return false;

    if (
      !(
        Rexbuilder_Util_Editor.editingElement ||
        Rexbuilder_Util_Editor.elementIsResizing ||
        Rexbuilder_Util_Editor.elementIsDragging
      ) ||
      (Rexbuilder_Util_Editor.editingElement &&
        Rexbuilder_Util_Editor.editedElement.data(
          "rexbuilder-block-id"
        ) != e.currentTarget.getAttribute('rexbuilder-block-id'))
    ) {
      var $elem = $(e.currentTarget);
      var $textWrap = $elem.find(".text-wrap");
      Rexbuilder_Util_Editor.editingElement = true;
      Rexbuilder_Util_Editor.editedElement = $elem;
      Rexbuilder_Util_Editor.editedTextWrap = $textWrap;
      Rexbuilder_Util_Editor.editingGallery = true;
      Rexbuilder_Util_Editor.editedGallery = this;

      if ( !$textWrap.is(":focus") ) {
        var caretPosition;
        if (hasClass(e.currentTarget,"rex-flex-top")) {
          caretPosition = "end";
        } else if (hasClass(e.currentTarget,"rex-flex-middle")) {
          var maxBlockHeight;
          if ( e.currentTarget.getAttribute('data-gs-height') ) {
            var maxBlockHeight = ( parseInt( e.currentTarget.getAttribute('data-gs-height') ) * this.properties.singleHeight ) - this.properties.gutter;
          } else {
            var maxBlockHeight = $elem.innerHeight();
          }

          var textHeight = $textWrap.innerHeight();

          if ( e.offsetY < maxBlockHeight / 2 - textHeight / 2 ) {
            caretPosition = "begin";
          } else {
            caretPosition = "end";
          }
        } else if (hasClass(e.currentTarget,"rex-flex-bottom")) {
          caretPosition = "begin";
        } else {
          caretPosition = "end";
        }

        if (caretPosition == "begin") {
          $textWrap.focus();
        } else {
          Rexbuilder_Live_Utilities.setEndOfContenteditable($textWrap[0]);
        }
      }
      Rexbuilder_Util_Editor.startEditingElement();
    }
  }

  /**
   * Handle click of a single element inside a row
   * @param  {Event} e click event
   * @return {void}
   * @since  2.0.4
   */
  function handleClick(event) {
    if (!Rexbuilder_Util_Editor.elementDraggingTriggered) {
      if (
        Rexbuilder_Util_Editor.editingElement &&
        Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id") !=
          event.currentTarget.getAttribute('data-rexbuilder-block-id')
      ) {
        Rexbuilder_Util_Editor.activateElementFocus = false;
        Rexbuilder_Util_Editor.endEditingElement();
        Rexbuilder_Util_Editor.activateElementFocus = true;
      }
    }
  }

  // The actual plugin constructor
  function perfectGridGalleryEditor(element, options) {
    this.element = element;
    this.$element = $(element);

    // attach data info to expose it
    // $(this.element).data('perfectGridGalleryEditor', this);

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first
    // object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.properties = {
      halfSeparator: 0,
      halfSeparatorTop: 0,
      halfSeparatorRight: 0,
      halfSeparatorBottom: 0,
      halfSeparatorLeft: 0,
      halfSeparatorElementTop: 0,
      halfSeparatorElementRight: 0,
      halfSeparatorElementBottom: 0,
      halfSeparatorElementLeft: 0,
      gridTopSeparator: null,
      gridRightSeparator: null,
      gridBottomSeparator: null,
      gridLeftSeparator: null,
      wrapWidth: 0,
      singleWidth: 0,
      singleHeight: 0,
      paddingTopBottom: false,
      setMobilePadding: false,
      setDesktopPadding: false,
      gutter: 0,
      elementStartingH: 0,
      resizeHandle: "",
      sectionNumber: null,
      gridstackInstance: null,
      gridstackInstanceID: null,
      serializedData: [],
      firstStartGrid: false,
      gridBlocksHeight: 0,
      editedFromBackend: false,
      oneColumModeActive: false,
      oldLayout: "",
      oldCellHeight: 0,
      blocksBottomTop: null,
      updatingSectionSameGrid: false,
      blocksDimensions: [],
      reverseDataGridDisposition: {},
      collapsingElements: false,
      lastIDBlock: 0,
      numberBlocksVisibileOnGrid: 0,
      beforeCollapseWasFixed: false,
      dispositionBeforeCollapsing: {},
      layoutBeforeCollapsing: {},
      initialStateGrid: null,
      mirrorStateGrid: null,
      fullWidthNaturalBackground: false,
      naturalBackground: false
    };

    this.$section = this.$element.parents(this._defaults.gridParentWrap);
    this.section = this.$section[0];

    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(perfectGridGalleryEditor.prototype, {
    init: function() {
      if ( this.$section.children(".section-data").attr("data-row_edited_live") != "true" ) {
        this.properties.editedFromBackend = true;
      }

      this.properties.firstStartGrid = true;

      this._setGridID();

      this._updateBlocksRexID();

      this._countBlocks();

      this.clearStateGrid();

      this._defineDataSettings();

      this._setGutter();

      this._defineHalfSeparatorProperties();

      this._defineRowSeparator();

      this._defineFullWidthNaturalBackground();

      this._defineNaturalBackground();

      this._setGridPadding();

      this._defineDynamicPrivateProperties();

      // this.setFullWidthNaturalBackground();

      this._prepareElements();

      this._launchGridStack();

      /**
       * Add listeners to the row
       */
      this.$element.on('change', handleChange.bind(this));

      // add double click listener to the row, it's useless on the single element
      this.$element.on('dblclick', '.perfect-grid-item', handleDbClick.bind(this));
      // add the click listener to the row, it's useless on the single element
      this.$element.on('click', '.perfect-grid-item', handleClick);
      // add the blur listener to the row, it's useless on the single element
      // this.$element.on('blur','.medium-editor-element', handleBlur.bind(this));

      this._updateElementsSizeViewers();
      this._linkResizeEvents();
      this._linkDragEvents();
      this._linkDnDEvents();

      this._createFirstReverseStack();

      this._updatePlaceholderPosition();

      this.saveStateGrid();

      // Creating layout before collapsing info for resize purpose
      var collapseGrid = this.section.getAttribute('data-rex-collapse-grid');

      this.properties.dispositionBeforeCollapsing = this.createActionDataMoveBlocksGrid();
      this.properties.layoutBeforeCollapsing = {
        layout: this.settings.galleryLayout,
        fullHeight: this.settings.fullHeight,
        singleHeight: this.properties.singleHeight
      };

      // we are under the collapse width and the grid hasn't set a layout
      // collaps all
      if ( Rexbuilder_Util.activeLayout == "default" && Rexbuilder_Util.globalViewport.width < _plugin_frontend_settings.defaultSettings.collapseWidth ) {
        if ( null === collapseGrid ) {
          this.collapseElements();
        } else {
          if ( collapseGrid.toString() == "true" ) {
            this.collapseElements();
          }
        }
      }

      this.fix_natural_image_blocks();

      this.save_grid_state();

      this.triggerGalleryReady();
      this.properties.firstStartGrid = false;
		},

    _launchGridStack: function() {
      this.$element.gridstack({
        auto: false,
        autoHide: false,
        animate: true,
        acceptWidgets: false,
        alwaysShowResizeHandle: true,
        disableOneColumnMode: true,
        cellHeight: this.properties.singleHeight,
        draggable: {
          containment: this.element,
          handle: ".rexlive-block-drag-handle",
          scroll: false
        },
        float: ( this.settings.galleryLayout == "masonry" ? false : true ),
        resizable: {
          minWidth: this.properties.singleWidth,
          minHeight: this.properties.singleHeight,
          handles: {
            e: ".ui-resizable-e",
            s: ".ui-resizable-s",
            w: ".ui-resizable-w",
            se: ".ui-resizable-se",
            sw: ".ui-resizable-sw"
          }
        },
        verticalMargin: 0,
        width: this.settings.numberCol
			});

      this.$element.addClass("gridActive");

      this.setGridstackIstanceNumber();
      this.properties.gridstackInstance = this.$element.data("gridstack");

      // does a batch and a commit
      this.makeWidgets();

      // Remove elements to hide
      var gridstack = this.properties.gridstackInstance;
      var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = items.length, i = 0;
      for( i=0; i<tot_items; i++ ) {
        if ( hasClass( items[i], 'rex-hide-element' ) ) {
          gridstack.removeWidget(items[i], false);
        }
      }

      // does a batch and a commit
      if ( !Rexbuilder_Util.domUpdating && ('undefined' === typeof Rexbuilder_Util_Editor.sectionCopying || false === Rexbuilder_Util_Editor.sectionCopying ) ) {
        this.updateBlocksHeight();
      }

      for( i=0; i < tot_items; i++ ) {
        var blockData = items[i].querySelector('.rexbuilder-block-data');
        this.updateElementDataHeightProperties( blockData, parseInt( items[i].getAttribute('data-gs-height') ) );
      }
    },

    makeWidgets: function() {
      var items = Array.prototype.slice.call(this.element.getElementsByClassName('grid-stack-item'));
      var tot_items = items.length, i = 0;
      if ( 0 === items ) return;

      this.properties.gridstackInstance.batchUpdate();
      for( i=0; i<tot_items; i++ ) {
        this.properties.gridstackInstance.makeWidget(items[i]);
      }
      this.properties.gridstackInstance.commit();
    },

    /**
     * Not accurate due to the time that gridstack takes to create the grid
     */
    triggerGalleryReady: function() {
      var event = jQuery.Event("rexlive:galleryReady");
      event.gallery = this;
      event.galleryID = this.properties.sectionNumber;
      $(document).trigger(event);
    },

    /**
     * Re launch the grid for the front end area
     * seems never used
     * @param {Object}  opts  optional parameters to set
     * @since 2.0.0
     */
    reInitGridFront: function( opts ) {
      opts = "undefined" !== typeof opts ? opts : {};
      this.settings.galleryLayout = opts.galleryLayout;
      this._prepareElements();

      this._launchGridStack();

      // Creating layout before collapsing info for resize purpose
      var collapseGrid = this.$section.attr("data-rex-collapse-grid");
      this.properties.dispositionBeforeCollapsing = this.createActionDataMoveBlocksGrid();
      this.properties.layoutBeforeCollapsing = {
        layout: opts.galleryLayout,
        fullHeight: opts.fullHeight,
        singleHeight: this.properties.singleHeight
      };

      if ( Rexbuilder_Util.activeLayout == "default" && Rexbuilder_Util.globalViewport.width < _plugin_frontend_settings.defaultSettings.collapseWidth ) {
        if (typeof collapseGrid == "undefined") {
          this.collapseElements();
        } else {
          if (collapseGrid.toString() == "true") {
            this.collapseElements();
          }
        }
      }

      this.fix_natural_image_blocks();

      this.save_grid_state();

      this.triggerGalleryReady();
    },

    /**
     * Create blocks data, optionally forcing the type of the layout
     * @param  {String} forcedLayout layout to force
     * @return {Object}              action data
     */
    createActionDataMoveBlocksGrid: function( forcedLayout, forcedCollapse ) {
      forcedLayout = 'undefined' !== typeof forcedLayout ? forcedLayout : null;
      forcedCollapse = 'undefined' !== typeof forcedCollapse ? forcedCollapse : false;

      var blocksDimensions = [];
      var rexID;
      var items = [].slice.call( this.element.querySelectorAll( '.grid-stack-item:not(.grid-stack-placeholder), .grid-stack-item:not(.removing_block)' ) );
      var tot_items = items.length, i = 0;

      for( i = 0; i < tot_items; i++ ) {
        rexID = items[i].getAttribute("data-rexbuilder-block-id");
        var x, y, w, h;

        x = parseInt( items[i].getAttribute("data-gs-x") );
        y = parseInt( items[i].getAttribute("data-gs-y") );
        w = parseInt( items[i].getAttribute("data-gs-width") );
        h = parseInt( items[i].getAttribute("data-gs-height") );
        var blockObj = {
          rexID: rexID,
          elem: items[i],
          x: x,
          y: y,
          w: w,
          h: h
        };

        switch( forcedLayout ) {
          case 'masonry':
            blockObj.h = Math.floor( blockObj.h * this.properties.singleWidth / 5 );
            blockObj.y = Math.floor( blockObj.y * this.properties.singleWidth / 5 );
            break;
          case 'fixed':
            blockObj.h = Math.floor( ( blockObj.h * 5 ) / this.properties.singleWidth );
            blockObj.y = Math.floor( ( blockObj.y * 5 ) / this.properties.singleWidth );
            break;
          case null:
          default:
            break;
        }

        if ( forcedCollapse ) {
          blockObj.w = 12;
          blockObj.x = 0;
        }

        blocksDimensions.push(blockObj);
      }

      var actionData = {
        gridstackInstance: this.properties.gridstackInstance,
        blocks: blocksDimensions,
        cellHeight: this.properties.singleHeight
      };
      return actionData;
    },

    _createFirstReverseStack: function() {
      this.properties.reverseDataGridDisposition = this.createActionDataMoveBlocksGrid();
    },

    clearStateGrid: function() {
      var rexID;
      var items = [].slice.call(this.element.getElementsByClassName('grid-stack-item'));
      var tot_items = items.length, i = 0;
      for( i=0; i<tot_items; i++ ) {
        rexID = items[i].getAttribute('data-rexbuilder-block-id');
        store.remove(rexID);
        store.remove(rexID + "_noEdits");
      }
    },

    saveStateGrid: function() {
      var rexID;
      var $elem;
      var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = items.length, i = 0;
      for( i = 0; i < tot_items; i++ ) {
        rexID = items[i].getAttribute("data-rexbuilder-block-id");
        var x, y, w, h;

        x = parseInt(items[i].getAttribute("data-gs-x"));
        y = parseInt(items[i].getAttribute("data-gs-y"));
        w = parseInt(items[i].getAttribute("data-gs-width"));
        h = parseInt(items[i].getAttribute("data-gs-height"));

        store.set(rexID, {
          properties: [{ x: x }, { y: y }, { w: w }, { h: h }]
        });
        store.set(rexID + "_noEdits", {
          properties: [{ x: x }, { y: y }, { w: w }, { h: h }]
        });
      }
    },

    updateGridSettingsChangeLayout: function(newSettings) {
      //i suppose gridstack in batchmode
      this.properties.firstStartGrid = true;

      this.$element.removeClass("grid-number-" + this.properties.sectionNumber);
      this.settings.fullHeight =
        typeof newSettings.full_height === "undefined" ? false : newSettings.full_height.toString();
      this.properties.elementStartingH = 0;
      this.properties.resizeHandle = "";
      this.properties.firstStartGrid = false;
      this.properties.editedFromBackend = false;
      this.properties.oneColumModeActive = false;
      this.properties.updatingSectionSameGrid = false;
      this.properties.blocksBottomTop = null;
      // if i comment this,
      // i resolve a bug on front,
      // but i create a bug on livebuilder
      this.settings.galleryLayout = newSettings.layout;

      var grid_gutter = parseInt(newSettings.gutter);
      var grid_separator_top = parseInt(newSettings.top);
      var grid_separator_right = parseInt(newSettings.right);
      var grid_separator_bottom = parseInt(newSettings.bottom);
      var grid_separator_left = parseInt(newSettings.left);

      var defaultGutter = 20;
      var row_distances = {
        gutter: isNaN(grid_gutter) ? defaultGutter : grid_gutter,
        top: isNaN(grid_separator_top) ? defaultGutter : grid_separator_top,
        right: isNaN(grid_separator_right) ? defaultGutter : grid_separator_right,
        bottom: isNaN(grid_separator_bottom) ? defaultGutter : grid_separator_bottom,
        left: isNaN(grid_separator_left) ? defaultGutter : grid_separator_left
      };

      this._setGridID();
      this.updateGridDistance(row_distances);
      this.updateFloatingElementsGridstack();
      this._defineDynamicPrivateProperties();
      this.updateGridstackStyles();
      this.clearStateGrid();

      this.properties.layoutBeforeCollapsing = {
        layout: this.settings.galleryLayout,
        fullHeight: this.settings.fullHeight,
        singleHeight: this.properties.singleHeight
      };

      this.removeCollapseElementsProperties();
    },

    // @todo compact blocks correctly
    updateGridLayout: function(layout, reverseData) {
      if ( this.settings.galleryLayout === layout ) return;

      this._saveBlocksPosition();
      this.removeCollapseElementsProperties();
      this.properties.oldCellHeight = this.properties.singleHeight;
      this.properties.oldLayout = this.settings.galleryLayout;
      this.settings.galleryLayout = layout;
      this.settings.fullHeight = "false";
      this._defineDynamicPrivateProperties();
      this.updateGridstackStyles();
      this.updateLayoutBlocksHeight();
      this.updateFloatingElementsGridstack();
      this.commitGridstack();
      if (typeof reverseData !== "undefined") {
        var that = this;
        setTimeout(
          function() {
            var galleryInstance = that;
            galleryInstance._updateElementsSizeViewers();
            var event = jQuery.Event("rexlive:galleryLayoutChanged");
            event.settings = {
              galleryEditorInstance: galleryInstance,
              $section: that.$section,
              reverseData: reverseData
            };

            // that.createScrollbars();
            that.properties.oldLayout = "";
            that.properties.oldCellHeight = that.properties.singleHeight;
            $(document).trigger(event);
          },
          300,
          reverseData,
          that
        );
      }
    },

    updateFloatingElementsGridstack: function() {
      // to call before commit
      var gridstack = this.properties.gridstackInstance;

      if ( gridstack ) {
        if (this.settings.galleryLayout == "masonry") {
          gridstack.grid._float = false;
          gridstack.grid.float = false;
        } else {
          gridstack.grid._float = true;
          gridstack.grid.float = true;
        }
      }
    },

    /**
     * Update the grid when
     * - the margin changes
     * - the padding changes
     * @return {void}
     * @since  2.0.4
     */
    updateGridstack: function( opts ) {
      this.batchGridstack();
      this._defineDynamicPrivateProperties();
      this.updateGridstackStyles();
      if ( !Rexbuilder_Util.domUpdating ) {
        this.updateBlocksHeight( );
      }
      this.commitGridstack();
    },

    /**
     * Update the grid:
     * - the width changes
     * @return {void}
     * @since  2.0.4
     */
    updateGridstackWidth: function() {
      this.batchGridstack();
      this._defineDynamicPrivateProperties();

      // temporary compact the blocks, to prevent empty spaces
      if ( 'fixed' === this.settings.galleryLayout ) {
        this.properties.gridstackInstance.grid._float = false;
        this.properties.gridstackInstance.grid.float = false;
      }

			this.updateGridstackStyles();

      if ( !Rexbuilder_Util.domUpdating ) {
				// update the heights, forcing the text blocks to cut empty space
        this.updateBlocksHeight( true );
      }

      // go back to previous state
      if ( 'fixed' === this.settings.galleryLayout ) {
        this.properties.gridstackInstance.grid._float = true;
        this.properties.gridstackInstance.grid.float = true;
      }
      this.commitGridstack();
    },

    updateSectionWidthWrap: function(newWidthParent, reverseData) {
      var $galleryParent = this.$element.parent();
      if (newWidthParent == "100%") {
        $galleryParent.removeClass("center-disposition");
        $galleryParent.addClass("full-disposition");
      } else {
        $galleryParent.removeClass("full-disposition");
        $galleryParent.addClass("center-disposition");
      }
      $galleryParent.css("max-width", newWidthParent);

      if (typeof reverseData !== "undefined") {
        this.updateGridstackWidth( );
        var that = this;
        setTimeout(
          function() {
            var galleryInstance = that;
            galleryInstance._updateElementsSizeViewers();
            var event = jQuery.Event("rexlive:sectionWidthApplyed");
            event.settings = {
              galleryEditorInstance: galleryInstance,
              $section: that.$section,
              reverseData: reverseData
            };
            $(document).trigger(event);
          },
          300,
          reverseData,
          that
        );
      }
    },

    updateRowDistances: function(newDistances, reverseData) {
      this.updateGridDistance(newDistances);
      if (typeof reverseData !== "undefined") {
        var that = this;
        this.updateGridstack();
        setTimeout(
          function() {
            var galleryInstance = that;
            galleryInstance._updateElementsSizeViewers();
            var event = jQuery.Event("rexlive:rowDistancesApplied");
            event.settings = {
              galleryEditorInstance: galleryInstance,
              $section: that.$section,
              newDistances: newDistances,
              reverseData: reverseData
            };
            $(document).trigger(event);
          },
          300,
          reverseData,
          that,
          newDistances
        );
      }
    },

    updateRowSectionMargins: function(newMargins, reverseData) {
      if (typeof reverseData !== "undefined") {
        var that = this;
        this.updateGridstack();
        setTimeout(
          function() {
            var galleryInstance = that;
            galleryInstance._updateElementsSizeViewers();
            var event = jQuery.Event("rexlive:sectionMarginsApplied");
            event.settings = {
              galleryEditorInstance: galleryInstance,
              $section: that.$section,
              newMargins: newMargins,
              reverseData: reverseData
            };
            $(document).trigger(event);
          },
          300,
          reverseData,
          that,
          newMargins
        );
      }
    },

    updateGridDistance: function(newSettings) {
      this.properties.gutter = parseInt(newSettings.gutter);
      this.properties.gridTopSeparator = parseInt(newSettings.top);
      this.properties.gridRightSeparator = parseInt(newSettings.right);
      this.properties.gridBottomSeparator = parseInt(newSettings.bottom);
      this.properties.gridLeftSeparator = parseInt(newSettings.left);

      this._setGutter();
      this._defineHalfSeparatorProperties();

      this.properties.setDesktopPadding = false;
      this._setGridPadding();

      var $el;
      var items = [].slice.call(this.element.getElementsByClassName('grid-stack-item'));
      var tot_items = items.length, i = 0;
      for( i=0; i < tot_items; i++ ) {
        $el = $(items[i]);
        this._updateElementPadding($el.find(".grid-stack-item-content"));
        this._updateHandlersPosition($el);
      }

      this._updatePlaceholderPosition();
    },

    /**
     * @deprecated
     * @version 2.0.0
     */
    refreshGrid: function() {
      this._defineDynamicPrivateProperties();

      this._setGridPadding();

      this._fixHeightAllElements();
    },

    /**
     * Count the number of blocks inside the grid
     * Necessary for the editing, to trace the correct number of blocks
     * @since 2.0.0
     */
    _countBlocks: function() {
      var number = 0;
      var numberBlock = 0;

      var gsItems = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = gsItems.length, i = 0;
      for( i=0; i < tot_items; i++ ) {
        number = i;
        var regex = /\d+$/gm;
        var str = gsItems[i].getAttribute("id");
        var m;
        while ((m = regex.exec(str)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.i === regex.lastIndex) {
            regex.lastIndex++;
          }

          // The result can be accessed through the `m`-variable.
          $.each(m, function(j, match) {
            numberBlock = parseInt(match);
          });
        }
        if (numberBlock > number) {
          number = numberBlock;
        }
      }

      // this.$element.find(".grid-stack-item").each(function(i, e) {
      //   number = i;
      //   var $el = $(e);
      //   var regex = /\d+$/gm;
      //   var str = $el.attr("id");
      //   var m;
      //   while ((m = regex.exec(str)) !== null) {
      //     // This is necessary to avoid infinite loops with zero-width matches
      //     if (m.index === regex.lastIndex) {
      //       regex.lastIndex++;
      //     }

      //     // The result can be accessed through the `m`-variable.
      //     $.each(m, function(i, match) {
      //       numberBlock = parseInt(match);
      //     });
      //   }
      //   if (numberBlock > number) {
      //     number = numberBlock;
      //   }
      // });

      this.properties.numberBlocksVisibileOnGrid = number;
      this.properties.lastIDBlock = number;
    },

    getLastID: function() {
      return this.properties.lastIDBlock;
    },

    getRowNumber: function() {
      return this.properties.sectionNumber;
    },

    /**
     * Get the section number ID from the data attribute on the section
     * and adds a class to it
     * @since 2.0.0
     */
    _setGridID: function() {
      this.properties.sectionNumber = parseInt( this.section.getAttribute("data-rexlive-section-number") );
      addClass( this.element, 'grid-number-' + this.properties.sectionNumber );
    },

    /**
     * If a block have not a RexID creates it
     * @since 2.0.0
     */
    _updateBlocksRexID: function() {
      var id;
      var $elem;
      var elem;
      var gsItems = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = gsItems.length, i = 0;
      for( i=0; i < tot_items; i++ ) {
        if ( gsItems[i].getAttribute("data-rexbuilder-block-id") === undefined || gsItems[i].getAttribute("data-rexbuilder-block-id") == "" ) {
          id = Rexbuilder_Util.createBlockID();
          gsItems[i].setAttribute("data-rexbuilder-block-id", id);
          var elBlockData = gsItems[i].querySelector('.rexbuilder-block-data');
          if ( elBlockData ) {
            elBlockData.setAttribute('data-rexbuilder_block_id', id);
          }
        }
      }
      // this.$element.find(".grid-stack-item").each(function(i, e) {
      //   $elem = $(e);
      //   if (
      //     e.getAttribute("data-rexbuilder-block-id") === undefined ||
      //     e.getAttribute("data-rexbuilder-block-id") == ""
      //   ) {
      //     id = Rexbuilder_Util.createBlockID();
      //     e.setAttribute("data-rexbuilder-block-id", id);
      //     $elem.children(".rexbuilder-block-data").attr("data-rexbuilder_block_id", id);
      //   }
      // });
    },

    /**
     * Function called for saving the grid
     * @deprecated
     */
    saveGrid: function() {
      var gallery = this;
      var singleHeight =
        gallery.settings.galleryLayout == "masonry" ? gallery.properties.singleHeight / gallery.properties.singleWidth : 1;
      this.serializedData = _.map(
        gallery.$element.children(".grid-stack-item"),
        function(el) {
          var $el = $(el);
          var node = $el.data("_gridstack_node");
          return {
            id: el.id,
            x: node.x,
            y: Math.round(node.y * singleHeight),
            width: node.width,
            height: Math.round(node.height * singleHeight)
          };
        },
        this
      );
    },

    getGridData: function() {
      return JSON.stringify(this.serializedData, null, "    ");
    },

    getGridstackNodes: function() {
      return this.properties.gridstackInstance.grid.nodes;
    },

    getElementBottomTop: function() {
      var nodes = [];
      var gs_items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = gs_items.length, i = 0;
      var el;

      for( i = 0; i < tot_items; i++ ) {
        if (! hasClass(gs_items[i], "removing_block") ) {
          el = gs_items[i];
          el.x = parseInt(gs_items[i]["attributes"]["data-gs-x"].value);
          el.y = parseInt(gs_items[i]["attributes"]["data-gs-y"].value);
          el.w = parseInt(gs_items[i]["attributes"]["data-gs-width"].value);
          el.h = parseInt(gs_items[i]["attributes"]["data-gs-height"].value);
          el.xw = el.x + el.w;
          el.yh = el.y + el.h;
          nodes.push(el);
        }
      }
      return _
        .sortBy(nodes, [
          function(o) {
            return o.yh;
          },
          function(o) {
            return o.xw;
          }
        ])
        .reverse();
    },

    getElementsTopBottom: function() {
      var nodes = [];
      var gs_items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = gs_items.length, i = 0;
      var el;

      for( i=0; i < tot_items; i++ ) {
        if (! hasClass(gs_items[i], "removing_block") ) {
          el = gs_items[i];
          el.x = parseInt( gs_items[i].getAttribute('data-gs-x') );
          el.y = parseInt( gs_items[i].getAttribute('data-gs-y') );
          nodes.push(el);
        }
      }
      return _.sortBy(nodes, [
        function(o) {
          return o.y;
        },
        function(o) {
          return o.x;
        }
      ]);
    },

    batchGridstack: function() {
      if (this.properties.gridstackInstance !== null) {
        this.properties.gridstackInstance.batchUpdate();
      }
    },

    commitGridstack: function() {
      if (!Rexbuilder_Util.domUpdating) {
        if (this.properties.gridstackInstance !== null) {
          this.properties.gridstackInstance.commit();
        }
      }
    },

    updateFullHeight: function(active) {
			active = typeof active == "undefined" ? true : active.toString() == "true";

      this.properties.gridBlocksHeight = parseInt( this.element.getAttribute( "data-gs-current-height" ) );
      this.properties.gridBlocksHeight = ( 0 === this.properties.gridBlocksHeight ? 1 : this.properties.gridBlocksHeight );

      var cellHeight;
      if ( active ) {
        if( this.settings.galleryLayout == "fixed" ) {
          cellHeight = Rexbuilder_Util.globalViewport.height / this.properties.gridBlocksHeight;
        }
      } else {
        if( this.settings.galleryLayout == "fixed" ) {
          cellHeight = this.properties.singleWidth;
        } else {
          cellHeight = this.properties.singleHeight;
        }
			}

      // force full height to happen only on fixed grid
      if ( 'masonry' !== this.settings.galleryLayout ) {
        this.updateGridstackStyles( cellHeight );
        this.$element.attr( "data-full-height", active );
      }
    },

    /**
     * Launching gridstack methods to update the generated css rules
     * to define blocks dimensions
     * @param  {int} newH new grid height
     * @return {null}
     */
    updateGridstackStyles: function(newH) {
      if ( typeof newH !== 'undefined' ) {
        this.properties.singleHeight = newH;
      }

      // prevent hide sections bugs
      if ( 0 !== this.properties.singleHeight && null !== this.element.offsetParent && null !== this.properties.gridstackInstance ) {
        var gridstack = this.properties.gridstackInstance;
        gridstack.cellHeight(this.properties.singleHeight);
        gridstack._initStyles();
        gridstack._updateStyles(this.properties.singleHeight);
      }
    },

    updateGridstackGridSizes: function(newCellWidth, newCellHeight) {
      this.properties.singleHeight = newCellHeight;
      this.properties.singleWidth = newCellWidth;
      var gridstack = this.properties.gridstackInstance;
      gridstack.cellHeight(newCellHeight);
      gridstack._initStyles();
      gridstack._updateStyles(this.properties.singleHeight);
    },

    restoreBackup: function() {
      var block;
      var G = this;
      var $block;
      G.$element.children(".grid-stack-item").each(function() {
        block = this;
        $block = $(this);
        $block.attr({
          "data-gs-x": block["attributes"]["data-col"].value - 1,
          "data-gs-y": block["attributes"]["data-row"].value - 1,
          "data-gs-width": block["attributes"]["data-width"].value,
          "data-gs-height": block["attributes"]["data-height"].value
        });
      });
    },

    /**
     * Function called for destroying gridstack-istance
     */
    destroyGridstack: function() {
      if ( this.properties.gridstackInstance !== null ) {
        var gridstack = this.properties.gridstackInstance;
        var $elem;
        gridstack.destroy(false);

        this.$element.children(".grid-stack-item").each(function() {
          $elem = $(this);
          $elem.draggable("destroy");
          $elem.resizable("destroy");
        });

        removeClass( this.element, 'grid-stack-instance-' + this.properties.gridstackInstanceID );
        if ( hasClass( this.element, 'grid-stack-one-column-mode' ) ) {
          removeClass( this.element, 'grid-stack-one-column-mode' );
        }
        this.properties.gridstackInstance = null;
      }
    },

    getGridWidth: function() {
      return this.properties.wrapWidth;
    },

    setGridWidth: function(width) {
      this.$element.outerWidth(width);
    },

    // Get methods
    getSingleWidth: function() {
      return this.properties.singleWidth;
    },

    getSeparator: function() {
      return this.properties.gutter;
    },

    getSectionNumber: function() {
      return this.properties.sectionNumber;
    },

    setProperty: function(definition) {
      this.properties[definition[0]] = definition[1];
    },

    fillEmptySpaces: function() {
      var cols = this.settings.numberCol,
        rows = this._calculateGridHeight(),
        i,
        j;
      var guard;
      var gridstack = this.properties.gridstackInstance;
      var w, h;
      var internal_i, internal_j;
      var emptyBlocks = [];
      for (j = 1; j <= rows; j++) {
        for (i = 1; i <= cols; i++) {
          if (gridstack.isAreaEmpty(i - 1, j - 1, 1, 1)) {
            guard = 0;
            w = h = 1;
            internal_i = i;
            internal_j = j;

            while (
              internal_i <= cols &&
              gridstack.isAreaEmpty(internal_i - 1, internal_j - 1, 1, 1)
            ) {
              guard = internal_i;
              internal_i++;
            }
            w = internal_i - i;
            internal_j++;
            internal_i = i;

            while (internal_j <= rows) {
              while (internal_i <= guard) {
                if (
                  gridstack.isAreaEmpty(internal_i - 1, internal_j - 1, 1, 1)
                ) {
                  internal_i++;
                } else {
                  break;
                }
              }
              if (internal_i - 1 == guard) {
                internal_j++;
                internal_i = i;
              } else {
                break;
              }
            }

            h = internal_j - j;
            var div = document.createElement("div");
            var blockObj = {
              el: div,
              x: i - 1,
              y: j - 1,
              w: w,
              h: h
            };
            gridstack.addWidget(
              blockObj.el,
              blockObj.x,
              blockObj.y,
              blockObj.w,
              blockObj.h,
              false
            );
            emptyBlocks.push(blockObj);
          }
        }
      }
      var width = this.properties.singleWidth;
      var tot_emptyBlocks = emptyBlocks.length;
      for (i = 0; i < tot_emptyBlocks; i++) {
        gridstack.removeWidget(emptyBlocks[i].el, true);
        if (this.settings.galleryLayout == "masonry") {
          emptyBlocks[i].y =
            Math.floor(
              (emptyBlocks[i].y * this.properties.singleHeight) / width
            ) + 1;
          emptyBlocks[i].h = Math.round(
            (emptyBlocks[i].h * this.properties.singleHeight) / width
          );
        }
      }
      return emptyBlocks;
    },

    removeBlock: function(elem) {
      this.properties.numberBlocksVisibileOnGrid--;

      this.properties.gridstackInstance.removeWidget(elem, false);
      if (Rexbuilder_Util.activeLayout == "default") {
        addClass( elem, 'removing_block' );
      }
      addClass( elem, 'rex-hide-element' );
    },

    reAddBlock: function($elem) {
      this.properties.numberBlocksVisibileOnGrid++;
      var x, y, w, h;
      x = parseInt($elem.attr("data-gs-x"));
      y = parseInt($elem.attr("data-gs-y"));
      w = parseInt($elem.attr("data-gs-width"));
      h = parseInt($elem.attr("data-gs-height"));

      if (Rexbuilder_Util.activeLayout == "default") {
        $elem.removeClass("removing_block");
      }
      $elem.removeClass("rex-hide-element");

      $elem.draggable("destroy");
      $elem.resizable("destroy");

      $elem.children(".ui-resizable-handle").remove();

			addHandles($elem, "e, s, w, se, sw");
			this._updateHandlersPosition($elem);

      this.properties.gridstackInstance.addWidget( $elem[0], x, y, w, h, false, 1, 500, 1 );
    },

    deleteBlock: function($elem) {
      var reverseData = {
        targetElement: $elem,
        hasToBeRemoved: false,
        galleryInstance: this,
        blocksDisposition: $.extend(
          true,
          {},
          this.properties.reverseDataGridDisposition
        )
      };

      this.removeBlock($elem.get(0));

      this._createFirstReverseStack();

      Rexbuilder_Util.stopBlockVideos($elem);

      if (this.properties.numberBlocksVisibileOnGrid == 0) {
        this.$section.addClass("empty-section");
      } else {
        this.$section.removeClass("empty-section").removeClass("activeRowTools");
        Rexbuilder_Util.$rexContainer.parent().removeClass('add-new-section--hide');
      }

      var actionData = {
        targetElement: $elem,
        hasToBeRemoved: true,
        galleryInstance: this,
        blocksDisposition: $.extend(
          true,
          {},
          this.properties.reverseDataGridDisposition
        )
      };
      Rexbuilder_Util_Editor.pushAction(
        this.$element,
        "updateBlockVisibility",
        actionData,
        reverseData
      );
    },

    createNewBlock: function(mode, w, h, block_type) {
      block_type = typeof block_type !== 'undefined' ? block_type : "";
      Rexbuilder_Util_Editor.addingNewBlocks = true;

      var defaultBlockWidthFixed = block_type == "text" ? 12 : 6;
      var defaultBlockHeightFixed = 4;

      typeof w == "undefined"
        ? (w = defaultBlockWidthFixed)
        : (w = parseInt(w));
      if (mode == "masonry") {
        typeof h == "undefined"
          ? (h = Math.round(
              (this.properties.singleWidth * defaultBlockHeightFixed) /
                this.settings.cellHeightMasonry
            ))
          : (h = parseInt(h));
      } else {
        typeof h == "undefined"
          ? (h = defaultBlockHeightFixed)
          : (h = parseInt(h));
      }

      w = parseInt(w);
      h = parseInt(h);
      var $newEL = this.createBlock(0, 0, w, h, block_type);

      var reverseData = {
        targetElement: $newEL,
        hasToBeRemoved: true,
        galleryInstance: this,
        blocksDisposition: $.extend(
          true,
          {},
          this.properties.reverseDataGridDisposition
        )
      };

      this.properties.gridstackInstance.addWidget( $newEL[0], 0, 0, w, h, true, 1, 500, 1 );
      $newEL.filter(".insert-block-animation").one(animationEndEventName, function(ev) {
        this.classList.remove("insert-block-animation");
      });

      var x = parseInt($newEL.attr("data-gs-x"));
      var y = parseInt($newEL.attr("data-gs-y"));

      this.properties.gridstackInstance.batchUpdate();
      this.properties.gridstackInstance.update($newEL[0], x, y, w, h);
      this.properties.gridstackInstance.commit();

      this._createFirstReverseStack();

      var actionData = {
        targetElement: $newEL,
        hasToBeRemoved: false,
        galleryInstance: this,
        blocksDisposition: $.extend(
          true,
          {},
          this.properties.reverseDataGridDisposition
        )
      };

      Rexbuilder_Util_Editor.pushAction(
        this.$element,
        "updateBlockVisibility",
        actionData,
        reverseData
      );
      Rexbuilder_Util_Editor.addingNewBlocks = false;
      $newEL.removeAttr("data-gs-auto-position");

      $newEL.data("gs-height", parseInt($newEL.attr("data-gs-height")));
      $newEL.data("gs-width", parseInt($newEL.attr("data-gs-width")));
      $newEL.data("gs-y", parseInt($newEL.attr("data-gs-y")));
      $newEL.data("gs-x", parseInt($newEL.attr("data-gs-x")));
      return $newEL;
    },

    /**
     * Add scrollbar to a block
     * @param {Object} $newEL element to add scrollbar
     * @deprecated
     */
    // addScrollbar: function($newEL) {
    //   var instanceScrollbar = $newEL
    //     .find(this.settings.scrollbarWrapClass)
    //     .overlayScrollbars(Rexbuilder_Util.scrollbarProperties)
    //     .overlayScrollbars();
    //   instanceScrollbar.sleep();
    // },

    // Function that creates a new empty block and returns it. The block is
    // added to gridstack and gallery
    createBlock: function(x, y, w, h, block_type) {
      block_type = typeof block_type !== 'undefined' ? block_type : "";
      this.properties.numberBlocksVisibileOnGrid++;
      this.$section.removeClass("empty-section").removeClass("activeRowTools");
      Rexbuilder_Util.$rexContainer.parent().removeClass('add-new-section--hide');
      this.properties.lastIDBlock = this.properties.lastIDBlock + 1;
      var idBlock = this.properties.lastIDBlock;
      var rexIdBlock = Rexbuilder_Util.createBlockID();
      tmpl.arg = "block";

      var newElement = tmpl("tmpl-new-block", {
        rexID: rexIdBlock,
        id: this.properties.sectionNumber + "_" + idBlock,
        gsWidth: w,
        gsHeight: h,
        gsX: x,
        gsY: y,
        backendHeight: h,
        backendWidth: w,
        backendX: x + 1,
        backendY: y + 1,
        block_type: block_type
      });

      var $newEl = $(newElement);
      var tools_info = {
        block_type: block_type
      };

      // $newEl.append(tmpl("tmpl-toolbox-block-wrap",tools_info));
      $newEl.append(Rexbuilder_Live_Templates.getTemplate( "tmpl-toolbox-block-wrap",tools_info ) );

      // $newEl.find(".grid-item-content").prepend('<div class="rexlive-block-drag-handle"></div>');

      var newEl = $newEl[0];

      this._prepareElement(newEl);

      this.updateSizeViewerText(newEl, w, h);

      return $newEl;
    },

    // Updating elements properties
    updateAllElementsProperties: function() {
      this.properties.editedFromBackend = false;
      var $elem;
      var items = [].slice.call( this.element.querySelectorAll('.grid-stack-item:not(.grid-stack-placeholder)') );
      var tot_items = items.length, i = 0;
      if (this.properties.updatingSectionSameGrid) {
        this.properties.updatingSectionSameGrid = false;
        for( i=0; i < tot_items; i++ ) {
          this.updateElementAllProperties(items[i]);
          if ( typeof store.get( items[i].getAttribute("data-rexbuilder-block-id") + "_noEdits" ) !== "undefined" ) {
            store.remove( items[i].getAttribute("data-rexbuilder-block-id") + "_noEdits" );
          }
        }
      }
      for( i=0; i < tot_items; i++ ) {
        this.updateElementAllProperties(items[i]);
      }
    },

    updateElementAllProperties: function(elem) {
      var block = elem;
      var width = this.properties.singleWidth;
      var x_size;
      var y_size;
      var dataBlock = block.querySelector( '.rexbuilder-block-data' );

      // col
      x_size = parseInt( block.getAttribute('data-gs-x') );

      // gridster works 1 to n not 0 to n-1
      x_size = x_size + 1;

      block.setAttribute( 'data-col', x_size );
      dataBlock.setAttribute( 'data-col', x_size );

      if (this.settings.galleryLayout == "masonry") {
        //var oldSize = block['attributes']['data-row'].value - 1;
        y_size = Math.floor( ( parseInt( block.getAttribute('data-gs-y') ) * this.properties.singleHeight) / width );
      } else {
        y_size = parseInt( block.getAttribute('data-gs-y') );
      }

      // row
      // gridster works 1 to n not 0 to n-1
      y_size = y_size + 1;
      block.setAttribute( 'data-row', y_size );
      dataBlock.setAttribute( 'data-row', y_size );

      // width
      var w = parseInt( block.getAttribute('data-gs-width') );
      var oldW = block.getAttribute( 'data-width' );
      block.setAttribute( 'data-width', w );
      // updating element class
      removeClass( block, 'w' + oldW );
      addClass( block, 'w' + w );
      dataBlock.setAttribute( 'data-size_x', w );

      // height
      var h;
      var oldH = block.getAttribute( 'data-height' );
      if (this.settings.galleryLayout == "masonry") {
        h = Math.round( ( parseInt( block.getAttribute('data-gs-height') ) * this.properties.singleHeight ) / width );
      } else {
        h = parseInt( block.getAttribute('data-gs-height') );
      }
      block.setAttribute( 'data-height', h );

      this.updateElementDataHeightProperties( dataBlock, parseInt( block.getAttribute('data-gs-height') ) );
      // updating element class
      removeClass( block, 'h' + oldH );
      addClass( block, 'h' + h );
      dataBlock.setAttribute( 'data-size_y', h );
    },

    // Override options set by the jquery call with the html data
    // attributes, if presents
    _defineDataSettings: function() {
      if (this.element.getAttribute("data-separator")) {
        this.properties.gutter = parseInt(this.element.getAttribute("data-separator"));
      }
      if (this.element.getAttribute("data-layout")) {
        this.settings.galleryLayout = this.element.getAttribute("data-layout").toString();
      }
      if (this.element.getAttribute("data-full-height")) {
        this.settings.fullHeight = this.element.getAttribute("data-full-height").toString();
      }
      if (this.element.getAttribute("data-mobile-padding")) {
        this.settings.mobilePadding = this.element.getAttribute("data-mobile-padding").toString();
      }
    },

    // Define usefull private properties
    _defineDynamicPrivateProperties: function() {
      var newWidth = this.element.offsetWidth;

      // var collapseGrid = this.$section.attr("data-rex-collapse-grid");
      var collapseGrid = this.section.getAttribute("data-rex-collapse-grid");

      // if ( collapseGrid ) {
      //   if ( Rexbuilder_Util.activeLayout == "default" && Rexbuilder_Util.globalViewport.width <= _plugin_frontend_settings.defaultSettings.collapseWidth ) {
      //     this.properties.oneColumModeActive = true;
      //   } else {
      //     this.properties.oneColumModeActive = false;
      //   }
      // } else
      if ( collapseGrid && ( ( Rexbuilder_Util.activeLayout == "default" && Rexbuilder_Util.globalViewport.width <= _plugin_frontend_settings.defaultSettings.collapseWidth && collapseGrid.toString() == "true") || collapseGrid.toString() == "true" ) ) {
        this.properties.oneColumModeActive = true;
      } else {
        this.properties.oneColumModeActive = false;
      }

      this.properties.wrapWidth = newWidth;
      this.properties.singleWidth = newWidth * this.settings.gridItemWidth;

      if( !this.settings.editorMode && this.properties.fullWidthNaturalBackground ) {
        this._setFullWidthNaturalBackground();
        this._setElementsToHeight("12");
      } else if( !this.settings.editorMode && this.properties.naturalBackground ) {
        this._setNaturalBackground();
        this._setElementsToHeight("12");
      } else if (this.settings.galleryLayout == "masonry") {
        this.properties.singleHeight = this.settings.cellHeightMasonry;
      } else {
        var oldSingleHeight = this.properties.singleHeight;
        var newSingleHeight;
        if (this.settings.fullHeight.toString() == "true") {
          this.properties.gridBlocksHeight = this._calculateGridHeight();     // single height in units
          newSingleHeight = Rexbuilder_Util.globalViewport.height / this.properties.gridBlocksHeight;   // single height in pixels
        } else {
          newSingleHeight = this.properties.singleWidth;
        }
        if (oldSingleHeight == newSingleHeight) {
          return false;
        }
        this.properties.singleHeight = newSingleHeight;
      }
      return true;
    },

    setFullWidthNaturalBackground: function() {
      if( !this.settings.editorMode && this.properties.fullWidthNaturalBackground ) {
        this._setFullWidthNaturalBackground();
        this._setElementsToHeight("12");
      }
    },

    _setFullWidthNaturalBackground: function() {
      var w = this.section.getAttribute('data-background_image_width');
      var h = this.section.getAttribute('data-background_image_height');
      if( null === w || null === h || '' === w || '' === h ) {
        return;
      }
      var pushH = Math.ceil( ( this.properties.gutter + this.properties.wrapWidth ) * parseInt(h) ) / parseInt(w);
      // var pushH = Math.ceil( this.section.offsetWidth * parseInt(h) ) / parseInt(w);
      this.section.style.minHeight = pushH + 'px';
      // this.settings.fullHeight = 'true';

      if (this.settings.galleryLayout == "masonry") {
        this.properties.singleHeight = ( pushH - this.properties.gutter ) / 5;
      } else {
        this.properties.singleHeight = ( pushH - this.properties.gutter ) / 12;
      }
    },

    setNaturalBackground: function() {
      if( !this.settings.editorMode && this.properties.naturalBackground ) {
        this._setNaturalBackground();
        this._setElementsToHeight("12");
      }
    },

    _setNaturalBackground: function() {
      var w = this.section.getAttribute('data-background_image_width');
      var h = this.section.getAttribute('data-background_image_height');
      if( null === w || null === h || '' === w || '' === h ) {
        return;
      }
      var pushH = Math.ceil( ( this.properties.gutter + this.properties.wrapWidth ) * parseInt(h) ) / parseInt(w);
      // var pushH = Math.ceil( this.section.offsetWidth * parseInt(h) ) / parseInt(w);
      if( pushH > h ) {
        pushH = h;
      }

      this.section.style.minHeight = pushH + 'px';
      // this.settings.fullHeight = 'true';

      if (this.settings.galleryLayout == "masonry") {
        this.properties.singleHeight = ( pushH - this.properties.gutter ) / 5;
      } else {
        this.properties.singleHeight = ( pushH - this.properties.gutter ) / 12;
      }
    },

    _setElementsToHeight: function(h) {
      var gs_items = [].slice.call( this.element.getElementsByClassName('perfect-grid-item') );
      var tot_items = gs_items.length, i = 0;
      for( i=0; i < tot_items; i++ ) {
        gs_items[i].setAttribute('data-gs-min-height', h);
      }
    },

    _calculateGridHeight: function() {
      var heightTot = 0;
      var hTemp;
      var $gridItem;
      var gsItems = [].slice.call( this.element.querySelectorAll('.grid-stack-item') );
      var tot_items = gsItems.length, i = 0;
      for( i=0; i < tot_items; i++ ) {
        if ( -1 === gsItems[i].className.indexOf('removing_block') ) {
          hTemp = parseInt( gsItems[i].getAttribute('data-gs-height') ) + parseInt( gsItems[i].getAttribute('data-gs-y') );
          if (hTemp > heightTot) {
            heightTot = hTemp;
          }
        }
      }
      return heightTot;
    },

    _defineHalfSeparatorProperties: function() {
      if (isEven(this.properties.gutter)) {
        this.properties.halfSeparatorTop = this.properties.gutter / 2;
        this.properties.halfSeparatorRight = this.properties.gutter / 2;
        this.properties.halfSeparatorBottom = this.properties.gutter / 2;
        this.properties.halfSeparatorLeft = this.properties.gutter / 2;
      } else {
        this.properties.halfSeparatorTop = Math.ceil(
          this.properties.gutter / 2
        );
        this.properties.halfSeparatorRight = Math.ceil(
          this.properties.gutter / 2
        );
        this.properties.halfSeparatorBottom = Math.floor(
          this.properties.gutter / 2
        );
        this.properties.halfSeparatorLeft = Math.floor(
          this.properties.gutter / 2
        );
      }

      // this.properties.paddingTopBottom = this.$section.hasClass("distance-block-top-bottom");
      this.properties.paddingTopBottom = -1 !== this.section.className.indexOf('distance-block-top-bottom');
    },

    _defineRowSeparator: function() {
      this.properties.gridTopSeparator =
        this.element.getAttribute("data-row-separator-top")
          ? parseInt(this.element.getAttribute("data-row-separator-top"))
          : null;
      this.properties.gridRightSeparator =
        this.element.getAttribute("data-row-separator-right")
          ? parseInt(this.element.getAttribute("data-row-separator-right"))
          : null;
      this.properties.gridBottomSeparator =
        this.element.getAttribute("data-row-separator-bottom")
          ? parseInt(this.element.getAttribute("data-row-separator-bottom"))
          : null;
      this.properties.gridLeftSeparator =
        this.element.getAttribute("data-row-separator-left")
          ? parseInt(this.element.getAttribute("data-row-separator-left"))
          : null;
    },

    _defineFullWidthNaturalBackground: function() {
      if( hasClass(this.section,'full-width-natural-background') ) {
        this.properties.fullWidthNaturalBackground = true;
      }
    },

    _defineNaturalBackground: function() {
      if( hasClass(this.section,'natural-background') ) {
        this.properties.naturalBackground = true;
      }
    },

    _setGutter: function() {
      if (isEven(this.properties.gutter)) {
        this.properties.halfSeparatorElementTop = this.properties.gutter / 2;
        this.properties.halfSeparatorElementRight = this.properties.gutter / 2;
        this.properties.halfSeparatorElementBottom = this.properties.gutter / 2;
        this.properties.halfSeparatorElementLeft = this.properties.gutter / 2;
      } else {
        this.properties.halfSeparatorElementTop = Math.floor(
          this.properties.gutter / 2
        );
        this.properties.halfSeparatorElementRight = Math.floor(
          this.properties.gutter / 2
        );
        this.properties.halfSeparatorElementBottom = Math.ceil(
          this.properties.gutter / 2
        );
        this.properties.halfSeparatorElementLeft = Math.ceil(
          this.properties.gutter / 2
        );
      }
    },

    _fixHeightGrid: function() {
      var grid = this.element;
      this.$element.outerHeight(
        grid["attributes"]["data-gs-current-height"].value *
          this.properties.singleWidth
      );
    },

    // fixes gutter if there is, this function is applied on the div used by
    // gridstack for the element
    _updateElementPadding: function($elemContent) {
      $elemContent.css({
        "padding-left": this.properties.halfSeparatorElementLeft,
        "padding-right": this.properties.halfSeparatorElementRight,
        "padding-top": this.properties.halfSeparatorElementTop,
        "padding-bottom": this.properties.halfSeparatorElementBottom
      });
    },

    _updateHandlersPosition: function($el) {
      $el.find('.ui-focused-element-highlight').css({
        "left": this.properties.halfSeparatorElementLeft,
        "right": this.properties.halfSeparatorElementRight,
        "top": this.properties.halfSeparatorElementTop,
        "bottom": this.properties.halfSeparatorElementBottom
      });

      $el.find('.ui-resizable-e').css({
        "top": this.properties.halfSeparatorElementTop,
        "right": this.properties.halfSeparatorElementRight,
        "bottom": this.properties.halfSeparatorElementBottom
      });

      $el.find('.ui-resizable-se').css({
        "right": this.properties.halfSeparatorElementRight,
        "bottom": this.properties.halfSeparatorElementBottom
      });

      $el.find('.ui-resizable-s').css({
        "right": this.properties.halfSeparatorElementRight,
        "bottom": this.properties.halfSeparatorElementBottom,
        "left": this.properties.halfSeparatorElementLeft
      });

      $el.find('.ui-resizable-sw').css({
        "bottom": this.properties.halfSeparatorElementBottom,
        "left": this.properties.halfSeparatorElementLeft
      });

      $el.find('.ui-resizable-w').css({
        "top": this.properties.halfSeparatorElementTop,
        "bottom": this.properties.halfSeparatorElementBottom,
        "left": this.properties.halfSeparatorElementLeft
      });
    },

    _updatePlaceholderPosition: function() {
      this.properties.gridstackInstance.placeholder.children('.placeholder-content').css({
        "left": this.properties.halfSeparatorElementLeft,
        "right": this.properties.halfSeparatorElementRight,
        "top": this.properties.halfSeparatorElementTop,
        "bottom": this.properties.halfSeparatorElementBottom
      });
    },

    _saveBlocksPosition: function() {
      var $elem;
      var x, y, w, h;
      var gallery = this;
      var rexID = "";
      this.$element.children(".grid-stack-item").each(function() {
        $elem = $(this);
        rexID = $elem.attr("data-rexbuilder-block-id");
        x = parseInt($elem.attr("data-gs-x"));
        y = parseInt($elem.attr("data-gs-y"));
        w = parseInt($elem.attr("data-gs-width"));
        h = parseInt($elem.attr("data-gs-height"));
        store.set(rexID, {
          properties: [{ x: x }, { y: y }, { w: w }, { h: h }]
        });
        if ( Rexbuilder_Util_Editor.updatingSectionLayout && !gallery.properties.updatingSectionSameGrid ) {
          store.set(rexID + "_noEdits", {
            properties: [{ x: x }, { y: y }, { w: w }, { h: h }]
          });
        }
      });
    },

    _restoreBlocksPosition: function() {
      var $elem;
      var gallery = this;
      var gridstackInstance = this.properties.gridstackInstance;
      this.$element.children(".grid-stack-item").each(function() {
        var x, y, w, h;
        var elDim;
        $elem = $(this);
        if (
          Rexbuilder_Util_Editor.updatingSectionLayout &&
          typeof store.get(
            $elem.attr("data-rexbuilder-block-id") + "_noEdits"
          ) !== "undefined"
        ) {
          elDim = store.get(
            $elem.attr("data-rexbuilder-block-id") + "_noEdits"
          );
        } else {
          elDim = store.get($elem.attr("data-rexbuilder-block-id"));
        }

        x = parseInt(elDim.properties[0].x);
        y = parseInt(elDim.properties[1].y);
        w = parseInt(elDim.properties[2].w);
        h = parseInt(elDim.properties[3].h);
        gridstackInstance.update(this, x, y, w, h);
      });
    },

    createResizePlaceHolder: function($elem) {
      var block = $elem[0];
      var placeholder = document.createElement("div");
      var $placeholder = $(placeholder);
      $elem.parent().append(placeholder);
      $placeholder.addClass("resizePlaceHolder");
      $placeholder.addClass(
        "w" + parseInt(block["attributes"]["data-width"].value)
      );
      var x =
        parseInt(block["attributes"]["data-row"].value - 1) *
        this.properties.singleWidth;
      var y =
        parseInt(block["attributes"]["data-col"].value - 1) *
        this.properties.singleWidth;
      $placeholder.css("transform", "translate(" + y + "px, " + x + "px)");
      $placeholder.css("position", "absolute");
      return $placeholder;
    },

    updateResizePlaceHolder: function($resizePlaceHolder, $elem) {
      var block = $elem[0];
      var width = this.properties.singleWidth;
      var w = parseInt(block["attributes"]["data-width"].value);

      var nW = Math.round(parseInt($elem.outerWidth()) / width);
      if (nW <= 0) {
        nW = 1;
      }
      // updating element class
      $resizePlaceHolder.removeClass();
      $resizePlaceHolder.addClass("resizePlaceHolder " + "w" + nW);
      var nH = Math.round(parseInt($elem.outerHeight()) / width);
      if (nH <= 0) {
        nH = 1;
      }
      $resizePlaceHolder.css("width", nW * width + "px");
      $resizePlaceHolder.css("height", nH * width + "px");
    },

    _prepareElements: function() {
      var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = items.length, i = 0;

      if (this.properties.editedFromBackend && ('undefined' === typeof Rexbuilder_Util_Editor.sectionCopying || false === Rexbuilder_Util_Editor.sectionCopying ) ) {
        for( i=0; i < tot_items; i++ ) {
          items[i].setAttribute('data-gs-x', parseInt( items[i].getAttribute('data-col') ) - 1);
          items[i].setAttribute('data-gs-y', parseInt( items[i].getAttribute('data-row') ) - 1);
          items[i].setAttribute('data-gs-width', items[i].getAttribute('data-width'));
          items[i].setAttribute('data-gs-height', items[i].getAttribute('data-height'));
          // items[i].setAttribute('data-gs-min-height', items[i].getAttribute('data-height'));
        }
      }

      var blockData;
      for( i=0; i < tot_items; i++ ) {
        this._prepareElement(items[i]);
        blockData = items[i].querySelector('.rexbuilder-block-data');
        if ( null === blockData.getAttribute('data-gs_start_h') ) {
          blockData.setAttribute( 'data-gs_start_h', parseInt( items[i].getAttribute('data-gs-height') ) );
        }
      }
    },

    /**
     * Receives the element to prepare, not jquery object
     */
    _prepareElement: function(elem) {
      var gallery = this;
      var $elem = $(elem);
      gallery._prepareElementEditing($elem);

      gallery._updateElementPadding($elem.find(".grid-stack-item-content"));
      gallery._updateHandlersPosition($elem);
      gallery._fixImageSize(elem);
    },

    updateElementDataHeightProperties: function(blockData, newH) {
      if (this.settings.galleryLayout == "masonry") {
        blockData.setAttribute("data-block_height_masonry", newH);
      } else {
        blockData.setAttribute("data-block_height_fixed", newH);
      }
      /*
      if (this.properties.firstStartGrid || Rexbuilder_Util_Editor.updatingImageBg) {
      }
      */

      blockData.setAttribute("data-gs_start_h", newH);
      // blockData.setAttribute("data-gs-height", newH);
      blockData.setAttribute("data-block_height_calculated", newH);
    },

    _prepareElementEditing: function($elem) {
      addHandles($elem, "e, s, w, se, sw");

      // add drag handler
      $elem.find('.grid-item-content').prepend('<div class="rexlive-block-drag-handle"></div>');

      $elem.attr({
        "data-gs-min-width": 1,
        "data-gs-min-height": 1,
        "data-gs-max-width": 500
      });

      // adding text wrap element if it's not there
      var hasSlider = $elem[0].querySelector('.rex-slider-wrap');
      if ( null === hasSlider ) {
        var $textWrap = $elem.find(".text-wrap");
        if ($textWrap.length == 0) {
          var textWrapEl;
          textWrapEl = document.createElement("div");
          addClass( textWrapEl, 'text-wrap' );
          // $(textWrapEl).addClass("text-wrap");
          $elem.find(".rex-custom-scrollbar").append(textWrapEl);
        } else if ($textWrap.children(".text-editor-span-fix").length == 0) {
          // if there is text wrap, adding a span element to fix the text
          // editor
          var spanEl = document.createElement("span");
          spanEl.style.display = 'none';
          addClass(spanEl, 'text-editor-span-fix');
          // $(spanEl).css("display", "none");
          // $(spanEl).addClass("text-editor-span-fix");
          $textWrap.append(spanEl);
        }
      }

      this.addElementListeners($elem);
    },

    _fixImagesDimension: function() {
      var gsItems = [].slice.call(this.element.getElementsByClassName('grid-stack-item'));
      var tot_items = gsItems.length, i=0;
      for( i = 0; i < tot_items; i++ ) {
        this._fixImageSize(gsItems[i]);
      }
    },

    _fixImageSize: function(elem) {
      var blockContent = elem.querySelector(".grid-item-content");
      if ( null === blockContent ) return;

      var imageDiv = blockContent.querySelector(".rex-image-wrapper");
      if ( null !== imageDiv && hasClass(imageDiv, "natural-image-background") ) {
        var imageWidth = isNaN( parseInt( blockContent.getAttribute("data-background_image_width") ) ) ? -1 : parseInt(blockContent.getAttribute("data-background_image_width"));
        if (imageWidth != -1) {
          if ( elem.offsetWidth < imageWidth) {
            addClass(imageDiv, "small-width");
          } else {
            removeClass(imageDiv,"small-width");
          }
        }
      }
    },

    _removeHandles: function($elem) {
      $elem.children(".ui-resizable-handle").each(function() {
        $(this).remove();
      });
    },

    addElementListeners: function($elem) {
      // adding element listeners

      var gallery = this;
      var $dragHandle = $elem.find(".rexlive-block-drag-handle");
      var $textWrap = $elem.find(".text-wrap");
      var dragHandle = $dragHandle[0];

      function handleMouseDown(e) {
        var $target = $(e.target);
        if (
          Rexbuilder_Util.activeLayout != "default" &&
          $target.parents(".tool-button").length == 0 &&
          !$target.hasClass("ui-resizable-handle") &&
          $target.parents(".ui-resizable-handle").length == 0
        ) {
          $dragHandle.addClass("drag-up");
          $elem.addClass("ui-draggable--drag-up");
          e.target = dragHandle;
          e.srcElement = dragHandle;
          e.toElement = dragHandle;
        } else {
          if ($target.parents(".tool-button").length == 0) {
            Rexbuilder_Util_Editor.mouseDownEvent = e;
            if (
              !(
                Rexbuilder_Util_Editor.editingElement ||
                Rexbuilder_Util_Editor.elementIsDragging ||
                Rexbuilder_Util_Editor.elementIsResizing
              ) ||
              (Rexbuilder_Util_Editor.editingElement &&
                Rexbuilder_Util_Editor.editedElement.data(
                  "rexbuilder-block-id"
                ) != $elem.data("rexbuilder-block-id"))
            ) {
              if (e.target != dragHandle) {
                clearTimeout(this.downTimer);
                this.downTimer = setTimeout(function() {
                  $dragHandle.addClass("drag-up");
                  $elem.addClass("ui-draggable--drag-up");

                  if ( Rexbuilder_Util_Editor.mouseDownEvent ) {
                    Rexbuilder_Util_Editor.mouseDownEvent.target = dragHandle;
                    Rexbuilder_Util_Editor.mouseDownEvent.srcElement = dragHandle;
                    Rexbuilder_Util_Editor.mouseDownEvent.toElement = dragHandle;
                    Rexbuilder_Util_Editor.elementDraggingTriggered = true;

                    $elem.trigger(Rexbuilder_Util_Editor.mouseDownEvent);
                  }

                }, 125);

                /**
                 * Power drag simulator
                 */
                clearTimeout(gallery.doubleDownTimer);
                gallery.doubleDownTimer = setTimeout(function() {
                  if( !( Rexbuilder_Util_Editor.elementIsDragging || Rexbuilder_Util_Editor.elementIsResizing || Rexbuilder_Util_Editor.editingElement || $elem.hasClass('ui-resizable-resizing') || $elem.hasClass('ui-draggable-dragging') || $target.hasClass('ui-resizable-handle') || $target.hasClass('circle-handle') ) && 1 === e.which ) {
                    $elem.trigger("mouseup");

                    var btn = tmpl("tmpl-tool-drag", {});
                    var $btn = $(btn);
                    $btn.css("position","absolute");
                    $btn.css("zIndex", 20);

                    $elem.append($btn);
                    var elemCoords = $elem[0].getBoundingClientRect();
                    $btn.css("left", e.clientX - elemCoords.left - ( $btn[0].offsetWidth / 2 ) );
                    $btn.css("top", e.clientY - elemCoords.top - ( $btn[0].offsetHeight / 2 ) );
                    $elem.addClass("grid-stack-item--drag-to-row");
                    gallery.$section.addClass("rexpansive-lock-section--overlay");
                  }
                }, 1500);
              }
            }
          }
        }
      }

      function handleMouseUp(e) {
        var $target = $(e.target);
        if (
          Rexbuilder_Util.activeLayout != "default" &&
          $target.parents(".tool-button").length == 0 &&
          !$target.hasClass("ui-resizable-handle") &&
          $target.parents(".ui-resizable-handle").length == 0
        ) {
          $dragHandle.removeClass("drag-up");
          $elem.removeClass("ui-draggable--drag-up");
        } else {
          if ($target.parents(".tool-button").length == 0) {
            if (Rexbuilder_Util_Editor.elementDraggingTriggered) {
              $dragHandle.removeClass("drag-up");
              $elem.removeClass("ui-draggable--drag-up");
              Rexbuilder_Util_Editor.elementDraggingTriggered = false;
            }
            clearTimeout(this.downTimer);
            clearTimeout(gallery.doubleDownTimer);
            Rexbuilder_Util_Editor.mouseDownEvent = null;
          }
        }
      }

      function handleHoverIn(e) {
        if (
          !(
            Rexbuilder_Util_Editor.editingElement ||
            Rexbuilder_Util_Editor.elementIsResizing ||
            Rexbuilder_Util_Editor.elementIsDragging ||
            Rexbuilder_Util_Editor.manageElement
          ) ||
          (Rexbuilder_Util_Editor.editingElement &&
            Rexbuilder_Util_Editor.editedElement.data(
              "rexbuilder-block-id"
            ) != $elem.data("rexbuilder-block-id"))
        ) {
          Rexbuilder_Util_Editor.focusedElement = $elem;
          gallery.focusElement(Rexbuilder_Util_Editor.focusedElement);
        }
      }

      function handlerHoverOut(e) {
        if (
          !(
            Rexbuilder_Util_Editor.editingElement ||
            Rexbuilder_Util_Editor.elementIsResizing ||
            Rexbuilder_Util_Editor.elementIsDragging ||
            Rexbuilder_Util_Editor.manageElement
          ) ||
          (Rexbuilder_Util_Editor.editingElement &&
            Rexbuilder_Util_Editor.editedElement.data(
              "rexbuilder-block-id"
            ) != $elem.data("rexbuilder-block-id"))
        ) {
          Rexbuilder_Util_Editor.focusedElement = $elem;
          gallery.unFocusElement(Rexbuilder_Util_Editor.focusedElement);
        }
      }

      // mouse down on another element
      $elem.on('mousedown', handleMouseDown);
      $elem.on('mouseup', handleMouseUp);

      /**
       * Listen double click on a block to edit the text content
       */
      // $elem.on('dblclick', handleDbClick.bind(this));

      // $elem.on('click', handleClick);

      $elem.on('mouseenter', handleHoverIn);
      $elem.on('mouseleave', handlerHoverOut);

      // $elem.on('blur','.medium-editor-element', handleBlur);
    },

    unFocusElementEditing: function($elem) {
      if ( $elem.length > 0 ) {
        $elem.removeClass("focused");
      }
    },

    focusElementEditing: function($elem) {
      var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = items.length, i=0;
      for( i=0; i < tot_items; i++ ) {
        removeClass( items[i], 'focused' );
      }

      if ( $elem.length > 0 ) {
        $elem.addClass("focused");
      }
    },

    focusElement: function($elem) {
      if ( $elem && $elem.length > 0 ) {
        $elem.addClass("focused");
      }
      this.$section.addClass("focusedRow");
    },

    unFocusElement: function($elem) {
      if ( $elem.length > 0 ) {
        $elem.removeClass("focused");
      }
      this.$section.removeClass("focusedRow");
    },

    /**
     * Update the size viewers for every block of this grid
     * and check if hide them or not
     *
     * @since 2.0.0
     */
    _updateElementsSizeViewers: function() {
      var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = items.length, i=0;

      for( i=0; i < tot_items; i++ ) {
        this.updateSizeViewerSizes( items[i] );
        this.checkBlockDimension( items[i] );
      }
    },

    /**
     * Update the live dimensions of a block inside the indicator
     *
     * @since 2.0.0
     * @date 11-07-2019 Rewrite for vanilla JS
     */
    updateSizeViewerText: function(elem, w, h, size_viewer, size_viewer_mobile) {
      size_viewer = 'undefined' !== typeof size_viewer ? size_viewer : elem.querySelector('.bottom-tools .el-size-viewer .el-size-viewer__val');
      size_viewer_mobile = 'undefined' !== typeof size_viewer_mobile ? size_viewer_mobile : elem.querySelector('.mobile-tools .el-size-viewer .el-size-viewer__val');
      if (w === undefined || h === undefined) {
        var w, h;
        w = parseInt( elem.getAttribute("data-gs-width") );
        h = parseInt( elem.getAttribute("data-gs-height") );
        if (this.settings.galleryLayout == "masonry") {
          h = Math.round(h * this.properties.singleHeight) - this.properties.gutter;
        }
      }
      var size_text = (w + " x " + h);
      var size_text_mobile = (w + "x" + h);

      if ( size_viewer ) {
        size_viewer.textContent = size_text;
      }

      if ( size_viewer_mobile ) {
        size_viewer_mobile.textContent = size_text_mobile;
      }
    },

    /**
     * Update (change) the sizes of the blocks inside the grid, searching them and passing their sizes
     * @param  {Array} data list of blocks and their size props
     * @return {void}
     */
    updateBlocksSizes: function( data ) {
      if ( 'undefined' === typeof data ) return;
      this.properties.gridstackInstance.batchUpdate();
      for( var i=0; i < data.length; i++ ) {
        var elem = this.element.querySelector( this.settings.itemSelector + '[data-rexbuilder-block-id="' + data[i].rexID + '"]' );
        this.properties.gridstackInstance.update(elem, data[i].x, data[i].y, data[i].w, data[i].h);
        this.updateSizeViewerText( elem, data[i].w, data[i].h );
      }
      this.properties.gridstackInstance.commit();
    },

    /**
     * Update (change) the size of a block inside the grid, searching it and passing its size
     * @param  {Object} block size props
     * @return {void}
     */
    updateBlockSize: function( data ) {
      this.properties.gridstackInstance.batchUpdate();
      var elem = this.element.querySelector( this.settings.itemSelector + '[data-rexbuilder-block-id="' + data.rexID + '"]' );
      this.properties.gridstackInstance.update(elem, data.x, data.y, data.w, data.h);
      this.updateSizeViewerText( elem, data.w, data.h );
      this.properties.gridstackInstance.commit();
    },

    updateSizeViewerSizes: function(block) {
      this.updateSizeViewerText(
        block,
        block.getAttribute('data-gs-width'),
        this.calculateHeightSizeViewer(block)
      );
    },

    calculateHeightSizeViewer: function(block) {
      var blockH = parseInt( block.getAttribute( 'data-gs-height' ) );
      if ( this.settings.galleryLayout == "masonry" ) {
        // height in pixel (of the content! not the block)
        return ( ( blockH * this.properties.singleHeight ) - this.properties.gutter );
      } else {
        // height in twelfths
        return blockH;
      }
    },

    /**
     * Check the width of a block element and decide if
     * hide or view the size viewer, cause it can overlaps
     * the other tools
     *
     * @param {Node} block DOM block element
     * @since 2.0.0
     * @date 11-04-2019
     */
    checkBlockDimension: function( block, block_width )
    {
      // checking block dimension to correctly display the tools
      block_width = 'undefined' !== typeof block_width ? block_width : ( parseInt( block.getAttribute('data-gs-width') ) * this.properties.singleWidth );

      if ( block_width < 190 ) {
        addClass( block, 'ui-tools--view-mobile' );
      }
      else {
        removeClass( block, 'ui-tools--view-mobile' );
      }

      if ( block_width < 100 ) {
        addClass( block, 'ui-hide-mobile-size-viewer' );
      }
      else {
        removeClass( block, 'ui-hide-mobile-size-viewer' );
      }
    },

    _linkResizeEvents: function() {
      var gallery = this;
      var block, xStart, wStart, xView, yView;
      var imageWidth;
      var imageHeight;

      var imageHeightNeed;
      var textWrapHeightNeed;
      var needH;
      var currentWidth;
      var heightFactor;

      var textWrap;
      var $textWrap;
      var blockContent;
      var blockContentWrap;
      var imageWrapper;
      var naturalImage;

      var size_viewer;
      var size_viewer_mobile;

			var blockHasSlider;

      function resizeStartHandler(event, ui) {
        if ( ui.element.is("span") ) return;
        // if (Rexbuilder_Util_Editor.editingElement) {
        //   Rexbuilder_Util_Editor.endEditingElement();
        // }
        gallery.properties.resizeHandle = $(event.toElement).attr( "data-axis" );
        block = event.target;
        blockContent = event.target.querySelector('.grid-item-content');
        blockContentWrap = event.target.querySelector('.grid-item-content-wrap');
        textWrap = event.target.querySelector('.text-wrap');
        $textWrap = $(textWrap);
        size_viewer = event.target.querySelector('.bottom-tools .el-size-viewer .el-size-viewer__val');
        size_viewer_mobile = event.target.querySelector('.mobile-tools .el-size-viewer .el-size-viewer__val');

        blockHasSlider = hasClass( event.target, 'block-has-slider' );

				imageWidth = isNaN( parseInt( blockContent.getAttribute("data-background_image_width")) ) ? 0 : parseInt( blockContent.getAttribute("data-background_image_width"));

        imageHeight = isNaN( parseInt( blockContent.getAttribute("data-background_image_height")) ) ? 0 : parseInt( blockContent.getAttribute("data-background_image_height"));

        imageWrapper = blockContent.querySelector(".rex-image-wrapper");
        naturalImage = null !== imageWrapper && hasClass( imageWrapper, "natural-image-background" );
        Rexbuilder_Util_Editor.elementIsResizing = true;
        xStart = parseInt(event.target.getAttribute("data-gs-x"));
        if ( gallery.properties.resizeHandle == "e" || gallery.properties.resizeHandle == "se" ) {
          event.target.setAttribute( "data-gs-max-width", gallery.settings.numberCol - xStart );
        } else if ( gallery.properties.resizeHandle == "w" || gallery.properties.resizeHandle == "sw" ) {
          wStart = parseInt(event.target.getAttribute("data-gs-width"));
        }
        textWrapHeightNeed = 0;
        imageHeightNeed = 0;
        heightFactor = gallery.settings.galleryLayout == "masonry" ? 1 : gallery.properties.singleWidth;
      }

      function resizeHandler(event, ui) {
				var $block = ui.element;

        if ( $block.is("span") ) return;

        if (naturalImage) {
          if (ui.size.width < imageWidth) {
            addClass( imageWrapper, "small-width" );
          } else {
            removeClass( imageWrapper, "small-width" );
          }
        }

        gallery.updateSizeViewerText( event.target, Math.round(ui.size.width / gallery.properties.singleWidth), Math.round(ui.size.height / heightFactor) - ( 'masonry' === gallery.settings.galleryLayout ? gallery.properties.gutter : 0 ), size_viewer, size_viewer_mobile );
        // removed due to slowing paint/repaint on safari (removed what?)
        if ( ui.originalSize.width !== ui.size.width ) {
          gallery.checkBlockDimension(event.target, ui.size.width);
				}

				var needToFit = $block.hasClass('fit-natural-bg-image');

        // In masonry all image have not to be cut
				if ( gallery.settings.galleryLayout == 'masonry' && naturalImage ) {
					currentWidth = event.target.offsetWidth;

					if (currentWidth < imageWidth || needToFit) {
						imageHeightNeed = (imageHeight * (currentWidth - gallery.properties.gutter)) / imageWidth;
					} else {
						imageHeightNeed = imageHeight;
					}

					imageHeightNeed = isNaN(imageHeightNeed) ? 0 : imageHeightNeed;
				}


        textWrapHeightNeed = calculateTextWrapHeightNew( $textWrap );

				needH = Math.max(textWrapHeightNeed, imageHeightNeed);

				// TODO Check calculations. Test: img natural masonry with 890px height when saved, at reload becomes 895px
				console.log( needH/* , Math.round((needH + gallery.properties.gutter) / gallery.properties.singleHeight)  */);

        if ( gallery.settings.galleryLayout == "masonry" ) {
          gallery.properties.gridstackInstance.minHeight(event.target, Math.round((needH + gallery.properties.gutter) / gallery.properties.singleHeight));
        } else {
          gallery.properties.gridstackInstance.minHeight(event.target, Math.ceil((needH + gallery.properties.gutter) / gallery.properties.singleWidth));
        }
      }

      function resizeStopHandler(event, elem) {
        if ( ! Rexbuilder_Util_Editor.elementIsResizing) return;

        if (gallery.settings.galleryLayout == "masonry") {

          elem.setAttribute( "data-height", Math.round( elem.getAttribute("data-gs-height") / gallery.properties.singleWidth ) );
          // @date 12-05-2019
          // Remove this proprerty set.
          // TODO Deeply check: is this correct?
          elem.querySelector('.rexbuilder-block-data').setAttribute("data-element_real_fluid", ( elem.getAttribute('data-gs-min-height') == elem.getAttribute('data-gs-height') ? 1 : 0 ));
        }

        gallery.updateAllElementsProperties();

        gallery.updateSizeViewerText(elem, undefined, undefined, size_viewer, size_viewer_mobile);
        gallery.checkBlockDimension(elem);

        elem.setAttribute("data-gs-max-width", 500);
        clearTimeout(gallery.doubleDownTimer);
        Rexbuilder_Util_Editor.elementIsDragging = false;
        Rexbuilder_Util_Editor.elementIsResizing = false;

        gallery.$element.attr('data-rexlive-layout-changed="true"');
        gallery.removeCollapseElementsProperties();
        var $section = gallery.$section;

        gallery.properties.gridstackInstance.minHeight( elem, 1 );

        gallery.properties.gridstackInstance.batchUpdate();
        gallery.properties.gridstackInstance.commit();

        // release resources
        textWrap = null;
        blockContent = null;
        blockContentWrap = null;
        size_viewer = null;
        size_viewer_mobile = null;

        Rexbuilder_Util.editedDataInfo.setBlockData( gallery.$section.attr('data-rexlive-section-id'), elem.getAttribute('data-rexbuilder-block-id'), 'gs_start_h' );
        Rexbuilder_Util.editedDataInfo.setBlockData( gallery.$section.attr('data-rexlive-section-id'), elem.getAttribute('data-rexbuilder-block-id'), 'gs_width' );
        Rexbuilder_Util.editedDataInfo.setBlockData( gallery.$section.attr('data-rexlive-section-id'), elem.getAttribute('data-rexbuilder-block-id'), 'gs_height' );
        Rexbuilder_Util.editedDataInfo.setBlockData( gallery.$section.attr('data-rexlive-section-id'), elem.getAttribute('data-rexbuilder-block-id'), 'gs_x' );
        Rexbuilder_Util.editedDataInfo.setBlockData( gallery.$section.attr('data-rexlive-section-id'), elem.getAttribute('data-rexbuilder-block-id'), 'gs_y' );

        //waiting for transition end
        rtimeOut( Rexbuilder_Util.fixYoutube.bind( null, $section[0] ), 1500 );
      }

      gallery.$element
        .on( 'resizestart', resizeStartHandler )
        .on( 'resize', resizeHandler )
        .on( 'gsresizestop', resizeStopHandler );
    },

    /**
     * Listen drag events
     */
    _linkDragEvents: function() {
      this.$element
        .on("dragstart", handleGridstackDragstart)
        .on("dragstop", handleGridstackDragstop.bind(this));
    },

    /**
     * Add Dragging from row to row
     * @since 2.0.0
     */
    _linkDnDEvents: function() {

      // Define the main vars
      var $pholder;
      var gallery = this;
      var locked = false;
      var stop = true;
      /*
       * Scrolling simulation
       */
      var scroll = function(step) {
        var scrollY = $(document).scrollTop();

        $(document).scrollTop( scrollY + step );
        if (!stop) {
          setTimeout(function() {
            scroll(step);         // steps are the direction of dragging (up or down)
          }, 20);
        }
      };

      /**
       * On dragstart on the power icon element, create the placholder for the block
       * and blocking the editing on the rows
       * @since 2.0.0
       */
      gallery.$element.on('dragstart', '.drag-to-section', function(e) {  // start the event that handles the drag
        if (Rexbuilder_Util_Editor.dragAndDropFromParent) {
          return;
        }
        if(!locked) {
          // Locking rows on drag to premit the drag itself
          setTimeout(function() {
            Rexbuilder_Util_Editor.lockRowsLight(gallery.$section);
            locked = true;
          },100);
        }

        e.originalEvent.dataTransfer.effectAllowed = "all";

        var $originalElement = $(this).parents('.grid-stack-item');         // get the original element to drag
        $pholder = $originalElement.clone(false);
        $pholder.find('.rexbuilder-block-data').remove();                   // remove the class
        $pholder.find('.ui-resizable-handle').remove();                     // "              "
        $pholder.find('.rexlive-block-toolbox').remove();                   // "              "
        $pholder.find('.grid-stack-item-content').css('height','100%');
        $('body').append($pholder);                                         // append to body the created element
        $pholder.css('position','fixed');                                   // position: fixes, i can move it everywhere
        $pholder.css('left',e.clientX);                                     // vertical coords
        $pholder.css('top',e.clientY);                                      // horizontal coords
        $pholder.css('width',$originalElement.width());                     // original element width
        $pholder.css('height',$originalElement.height());                   // original element height
        $pholder.css('transform','scale(0.5)');                             // scale the popup
        $pholder.css('transformOrigin','top left');                         // move the scale origin point

        var rex_block_id = $originalElement.attr("data-rexbuilder-block-id");
        var sectionID = gallery.$section.attr("data-rexlive-section-id");
        var modelNumber =
          typeof gallery.$section.attr("data-rexlive-model-number") != "undefined"
            ? gallery.$section.attr("data-rexlive-model-number")
            : "";
        var sectionTarget = {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        };

        e.originalEvent.dataTransfer.setData("text/plain", JSON.stringify(sectionTarget));
      });

      /**
       * During the dragging allow to scroll the page with a simulated scroll
       * @since 2.0.0
       */
      gallery.$element.on('drag', '.drag-to-section', function(e) {
        if (Rexbuilder_Util_Editor.dragAndDropFromParent) {
          return;
        }
        $pholder.css('left',e.clientX + 5);
        $pholder.css('top',e.clientY + 5);
        $pholder.css('zIndex',3000);

        stop = true;

        // handling scroll relative to popup position, negative case
        if ( event.clientY < 150 ) {
          stop = false;
          scroll(-1);       // scroll set to -1, the page scroll upwards
        }
        // handling scroll relative to popup position, positive case
        if ( event.clientY > Rexbuilder_Util_Editor.viewportMeasurement.height - 150 ) {
          stop = false;
          scroll(1);        // scroll set to -1, the page scroll upwards
        }
      });

      /**
       * On dragend release the rows and remove the placeholder
       * @since 2.0.0
       */

      gallery.$element.on('dragend', '.drag-to-section', function(e) {
        if (Rexbuilder_Util_Editor.dragAndDropFromParent) {
          return;
        }
        if(locked) {
          Rexbuilder_Util_Editor.releaseRowsLight();
          locked = false;
        }
        stop = true;

        $pholder.css('zIndex',-3000);
        $pholder.css('left',e.clientX + 5);
        $pholder.css('top',e.clientY + 5);
        $pholder.remove();
        $pholder = null;
      });
    },

    setGridstackIstanceNumber: function() {
      var gallery = this;
      var classList = this.$element.attr("class").split(/\s+/);
      var classNameParts;
      for (var i = 0, tot_classList = classList.length; i < tot_classList; i++) {
        classNameParts = classList[i].split("-");
        if (classNameParts[2] != undefined && classNameParts[2] == "instance") {
          gallery.properties.gridstackInstanceID = classNameParts[3];
        }
      }
    },

    /**
     * Re-calculate all blocks heights, based only on their height property
     * and the singleHeight values (old and new)
     * Doing this on editor mode, on layout change
     * @return {void}
     * @since  2.0.1
     */
    updateLayoutBlocksHeight: function() {
      var gridstack = this.properties.gridstackInstance;

      if ( typeof gridstack === "null" ) return;

      this.properties.blocksBottomTop = this.getElementBottomTop();
      if ( !this.properties.updatingSectionSameGrid || Rexbuilder_Util.windowIsResizing ) {
        this.batchGridstack();

        var items = [].slice.call( this.properties.blocksBottomTop );
        var tot_items = items.length, i = 0;
        for( i=0; i < tot_items; i++ ) {
          var elemData = items[i].querySelector('.rexbuilder-block-data');
          // get the size
          var size = this.getBlockSizeOnLayoutChange( items[i] );

          Rexbuilder_Util_Editor.elementIsResizing = true;

          // resize the block
          this.updateElementDataHeightProperties( elemData, size.height );
          this.resizeBlock( items[i], size.width, size.height );

          Rexbuilder_Util_Editor.elementIsResizing = false;
        }

        if ( !Rexbuilder_Util.windowIsResizing ) {
          this.commitGridstack();
        }
      }
    },

    /**
     * Check which element has to update the height
     * @return {null}
     * @since  2.0.0
     * @version 2.0.1   Height calc general review
     */
    updateBlocksHeight: function ( forceFixedText ) {
      var gridstack = this.properties.gridstackInstance;
      if ( typeof gridstack === "null" ) return;

      if ( !this.properties.updatingSectionSameGrid || Rexbuilder_Util.windowIsResizing ) {

        this.properties.blocksBottomTop = this.getElementBottomTop();
        var items = [].slice.call( this.properties.blocksBottomTop );
        var tot_items = items.length, i = 0;

        // this.batchGridstack();

        for( i=0; i < tot_items; i++ ) {
          if ( Rexbuilder_Util.backendEdited || Rexbuilder_Util_Editor.updatingSectionLayout || Rexbuilder_Util_Editor.updatingCollapsedGrid || this.properties.firstStartGrid ) {
            if ( ! ( hasClass( items[i], "rex-hide-element" ) || hasClass( items[i], "removing_block" ) || hasClass( items[i], "block-has-slider" ) ) ) {
              this.updateElementHeight( items[i] );
            }
          } else if ( ! this.properties.collapsingElements ) {
            this.updateElementHeight( items[i], false, forceFixedText );
          }
        }
        // end foreach of boxes

        // if ( !Rexbuilder_Util.windowIsResizing && !this.properties.updatingSection )

        if ( !Rexbuilder_Util.windowIsResizing ) {
          // this.commitGridstack();
        }
      }
    },

    /**
     * Calculate single block height, based on previous single cell height
     * This assumes that the function was called on layout change
     * @param  {Element} elem block element
     * @return {object} new width and height of the block (usually width is the same)
     */
    getBlockSizeOnLayoutChange: function(elem) {
      var elemData = elem.querySelector('.rexbuilder-block-data');
      var textWrap = elem.querySelector('.text-wrap');
      var imgWrap = elem.querySelector('.rex-image-wrapper');
      var itemContent = elem.querySelector('.grid-item-content');

      var elRealFluid = parseInt( elemData.getAttribute('data-element_real_fluid') );
      var backImgType = elemData.getAttribute('data-type_bg_block');
      var width = parseInt( elem.getAttribute('data-gs-width') );
      var height = parseInt( elem.getAttribute('data-gs-height') );
      var newH = 0;
      var hasText = false;
      var spaceNeeded;

      // calc the new height, based on the old height props
      var spaceAvailable = height * this.properties.oldCellHeight;
      var newH = Math.round( spaceAvailable / this.properties.singleHeight );

      // check height if the block has text
      if ( textWrap ) {
        if ( textWrap.innerText.trim().length > 0 && textWrap.childElementCount > 0 ) {
          hasText = true;
          spaceNeeded = textWrap.offsetHeight + this.properties.gutter;
        }
      }

      // check height if is a masonry grid, with a natural image, without text
      if ( ! hasText && imgWrap && 'masonry' === this.settings.galleryLayout && 'natural' === backImgType ) {
        var imgWidth = parseInt( itemContent.getAttribute("data-background_image_width") );
        var imgHeight = parseInt( itemContent.getAttribute("data-background_image_height") );
        if ( elem.offsetWidth < imgWidth ) {
          spaceNeeded = ( imgHeight * width * this.properties.singleWidth ) / imgWidth;
          addClass( imgWrap, "small-width" );
        } else {
          spaceNeeded = imgHeight + this.properties.gutter;
          removeClass( imgWrap, "small-width" );
        }
      }

      // if we need space, change the height
      if ( spaceNeeded > spaceAvailable ) {
        newH = Math.round( spaceNeeded / this.properties.singleHeight );
      }

      // resize sizes
      return {
        width: width,
        height: newH
      };
    },

    /**
     * Calculate single block height, based on the assume that is a collapse
     * and that the block properties are not defined for the collapse (no mobile layout saved)
     * @param  {Element} elem element to get the dimension
     * @return {Object}      width and height of a collapsed block
     */
    getBlockSizeOnCollapse: function(elem) {
      var elemData = elem.querySelector('.rexbuilder-block-data');
      var textWrap = elem.querySelector('.text-wrap');
      var imgWrap = elem.querySelector('.rex-image-wrapper');
      var itemContent = elem.querySelector('.grid-item-content');

      var blockHasSlider = -1 !== elem.className.indexOf('block-has-slider');
      var blockIsEmpty = -1 !== itemContent.className.indexOf('empty-content');
      var blockHasYoutube = -1 !== itemContent.className.indexOf('youtube-player');
      var blockHasVideo = ( 0 !== [].slice.call( elem.getElementsByClassName('rex-video-wrap') ).length ? true : false );
      // var blockHasVideo = -1 !== itemContent.className.indexOf('mp4-player');
			var blockHasVimeo = -1 !== itemContent.className.indexOf('vimeo-player');

			// The block background images needs to occupy the maximum space available
			// in the block, even if its dimensions become bigger than the original
			// size. The block can still be made fluid
			var blockImageNeedsToFit = -1 !== elem.className.indexOf('fit-natural-bg-image');

      var elRealFluid = parseInt( elemData.getAttribute('data-element_real_fluid') );
      var backImgType = elemData.getAttribute('data-type_bg_block');
      var width = parseInt( elem.getAttribute('data-gs-width') );     // i am always 12 for collapse
      var height = parseInt( elem.getAttribute('data-gs-height') );
      var newH = 0;
      var hasText = false;
      var spaceNeeded = null;

      // calc the new height, based on the old height props
      var spaceAvailable = height * this.properties.singleHeight;
      var newH = Math.round( spaceAvailable / this.properties.singleHeight );

      // check height if the block has text
      if ( textWrap ) {
        if ( textWrap.innerText.trim().length > 0 && textWrap.childElementCount > 0 ) {
          hasText = true;
          spaceNeeded = textWrap.offsetHeight + this.properties.gutter;
        }
			}


      // check height if is a masonry grid, with a natural image, without text
      if ( ! hasText && imgWrap ) {
        var imgWidth = parseInt( itemContent.getAttribute("data-background_image_width") );
				var imgHeight = parseInt( itemContent.getAttribute("data-background_image_height") );

        if ( elem.offsetWidth < imgWidth) {
					spaceNeeded = ( imgHeight * ( ( width * this.properties.singleWidth ) - this.properties.gutter ) ) / imgWidth;
					spaceNeeded += this.properties.gutter;
          addClass( imgWrap, "small-width" );
        } else {
          spaceNeeded = imgHeight + this.properties.gutter;
          removeClass( imgWrap, "small-width" );
        }
			}

      var defaultRatio = 3 / 4;

      if ( ! hasText && ( blockHasYoutube || blockHasVideo || blockHasVimeo ) ) {
        spaceNeeded = Math.round( width * this.properties.singleWidth * defaultRatio );
			}

      // calculate slider height
      var sliderRatio = parseFloat( elemData.getAttribute( 'data-slider_ratio' ) );
      if ( blockHasSlider && !isNaN( sliderRatio ) ) {
        if ( !isNaN( sliderRatio ) ) {
          spaceNeeded = width * this.properties.singleWidth * sliderRatio;
        } else {
          spaceNeeded = width * this.properties.singleWidth * defaultRatio;
        }
			}


      // on collapse the height need to reflect the contents height
			newH = Math.round( spaceNeeded / this.properties.singleHeight );

      return {
        width: width,
        height: newH
      }
    },

    /**
     * @param	{Object}	elem 						Element to update height
     * @param	{Boolean}	editingBlock 		Flag to consider also starting height
     * @param	{Number}	forceFixedText
     * @param	{Number}	blockRatio 			Ratio block has to maintain   @never used
     * @since	2.0.0
     */
    updateElementHeight: function(elem, editingBlock, forceFixedText, blockRatio) {
      editingBlock = typeof editingBlock !== "undefined" ? editingBlock : false;
      blockRatio = 'undefined' !== typeof blockRatio ? blockRatio : 0;
			forceFixedText = 'undefined' !== typeof forceFixedText ? forceFixedText : false;

      if (!this.properties.oneColumModeActive) {
        Rexbuilder_Util_Editor.elementIsResizing = true;
      }

      var blockData = elem.querySelector('.rexbuilder-block-data');
      var startH;
      // this.properties.updatingSection seems always false !
      startH = parseInt( blockData.getAttribute('data-gs_start_h') );
      var originalStartH = parseInt( blockData.getAttribute('data-gs_start_h') );

      var newH;
      var swGrid = this.properties.singleWidth;
      var sw;

      if (this.properties.oneColumModeActive) {
        sw = this.element.offsetWidth * this.settings.gridItemWidth;
      } else {
        sw = swGrid;
      }

      var gutter = this.properties.gutter;
      var textWrap = elem.querySelector('.text-wrap')
      var $textWrap = $( textWrap );

      var w = parseInt( elem.getAttribute('data-gs-width') );
      var originalH = parseInt( elem.getAttribute('data-gs-height') );
      var spaceAvailable = ( originalH * this.properties.singleHeight ) - gutter;
      var elRealFluid = parseInt( blockData.getAttribute('data-element_real_fluid') );

      var backgroundHeight = 0;
      var videoHeight = 0;
      var defaultHeight = 0;
      var sliderHeight = 0;
      var textHeight;
      var emptyBlockFlag = false;
      var backImgType = blockData.getAttribute('data-type_bg_block');

      var itemContent = elem.querySelector('.grid-item-content');
      var imageWrapper = null;
      var blockHasSlider = false;
      var blockIsEmpty = false;
      var blockHasYoutube = false;
      var blockHasVideo = false;
			var blockHasVimeo = false;

			// The block background images needs to occupy the maximum space available
			// in the block, even if its dimensions become bigger than the original
			// size. The block can still be made fluid
			var blockImageNeedsToFit = false;

      if ( itemContent ) {
				imageWrapper = itemContent.querySelector('.rex-image-wrapper');

        blockHasSlider = -1 !== elem.className.indexOf('block-has-slider');
				blockImageNeedsToFit = -1 !== elem.className.indexOf('fit-natural-bg-image');

        blockIsEmpty = -1 !== itemContent.className.indexOf('empty-content');

        blockHasYoutube = -1 !== itemContent.className.indexOf('youtube-player');
        blockHasVideo = -1 !== itemContent.className.indexOf('mp4-player');
        blockHasVimeo = -1 !== itemContent.className.indexOf('vimeo-player');
      }

      if ( blockHasSlider ) {
        Rexbuilder_Util_Editor.elementIsResizing = false;
      	return;
      }

      // calculate text content height
      textHeight = calculateTextWrapHeightNew( $textWrap );

      if (this.properties.oneColumModeActive) {
        w = 12;
			}

      if ( textHeight == 0 ) {
        // calculating background image height
				if (null !== imageWrapper) {
					var imageWidth = parseInt(itemContent.getAttribute('data-background_image_width'));
					var imageHeight = parseInt(itemContent.getAttribute('data-background_image_height'));

					if (this.properties.singleWidth * elem.getAttribute('data-gs-width') < imageWidth || blockImageNeedsToFit) {
						backgroundHeight = (imageHeight * (w * sw - gutter)) / imageWidth;
					} else {
						backgroundHeight = imageHeight;
					}
				}

        var defaultRatio = 3 / 4;

        // calculate video height
        // @todo check me to prevent video auto ratio-resize
        if ( blockHasYoutube || blockHasVideo || blockHasVimeo ) {
          videoHeight = originalH * this.properties.singleHeight;
        }

        // calculate slider height
        if ( blockHasSlider ) {
          sliderHeight = originalH * this.properties.singleHeight;
        }

        // calculate default height (in case of block without content that pushes)
        // or else update text height
        if ( videoHeight == 0 && backgroundHeight == 0 && sliderHeight == 0 && ( Rexbuilder_Util_Editor.updatingSectionLayout || blockIsEmpty || this.properties.firstStartGrid || blockHasSlider ) ) {
          if ( this.properties.editedFromBackend && this.settings.galleryLayout == "masonry" ) {
            defaultHeight = Math.round(sw * startH);
          } else if ( this.properties.oneColumModeActive && this.properties.beforeCollapseWasFixed ) {
            defaultHeight = startH * this.properties.singleWidth;
          } else {
            defaultHeight = startH * this.properties.singleHeight;
          }
        }
      }

      if ( !blockHasSlider && backgroundHeight == 0 && videoHeight == 0 && textHeight == 0 ) {
        emptyBlockFlag = true;
			}


      // if the block has a full image background, without text
      // maintain the old height
      if ( !blockHasSlider && !blockHasYoutube && !blockHasVimeo && !blockHasVideo && ( ( ( 'full' === backImgType && 0 === textHeight ) || ( '' === backImgType && 0 === textHeight ) ) && ! this.properties.oneColumModeActive ) ) {
        newH = ( startH * this.properties.singleHeight ) - gutter;
      } else {
        if ( editingBlock ) {
          startH *= this.properties.singleHeight;
        } else {
          startH = 0;
        }

        newH = Math.max(
          startH,
          backgroundHeight,
          videoHeight,
          defaultHeight,
          textHeight,
          sliderHeight
        );
      }

      // console.table({
      //   startH: startH,
      //   blockRatio: blockRatio,
      //   backImgType: backImgType,
      //   backgroundHeight:backgroundHeight,
      //   videoHeight:videoHeight,
      //   defaultHeight:defaultHeight,
      //   textHeight:textHeight,
      //   sliderHeight:sliderHeight,
      //   originalH:originalH,
      //   originalStartH:originalStartH,
      //   singleHeight: this.properties.singleHeight,
      //   spaceAvailable:spaceAvailable,
      //   newH:newH,
      //   gutter:gutter
			// });

      if ( this.properties.oneColumModeActive && ! Rexbuilder_Util.windowIsResizing ) {
        var collapsedHeight = newH;

        return {
          height: collapsedHeight,
          empty: emptyBlockFlag
        };
			}

      if( blockRatio !=0 ) {
        newH = w * sw * blockRatio;
      }

      var resizeNotNeeded = false;

      // check if resize really needed
      if ( textHeight !== 0 ) {
        if ( ( 'fixed' === this.settings.galleryLayout && ! forceFixedText ) || ( 1 !== elRealFluid && 'masonry' === this.settings.galleryLayout ) ) {
          if ( newH <= spaceAvailable ) {
            resizeNotNeeded = true;
          }
        }
      } else if ( backgroundHeight !== 0 ) {
        if ( 'fixed' === this.settings.galleryLayout ) {
          resizeNotNeeded = true;
        } else if ( 'masonry' === this.settings.galleryLayout ) {
          if( ( 'natural' === backImgType && 1 !== elRealFluid ) || 'full' === backImgType ) {
            if ( newH <= spaceAvailable ) {
              resizeNotNeeded = true;
            }
          }
        }
      } else if ( 0 !== videoHeight ) {
        if ( 'masonry' === this.settings.galleryLayout ) {
          resizeNotNeeded = true;
        }
      }

      if ( resizeNotNeeded ) {
				Rexbuilder_Util_Editor.elementIsResizing = false;
        return;
			}

      var newHeightUnits;

      if (this.settings.galleryLayout == "fixed") {
        if ( emptyBlockFlag || blockHasYoutube || blockHasVideo || blockHasVimeo ) {
          newHeightUnits = Math.round((newH+gutter) / this.properties.singleHeight);
        } else {
          newHeightUnits = Math.ceil((newH+gutter) / this.properties.singleHeight);
        }
      } else {
        newHeightUnits = Math.ceil((newH+gutter) / this.properties.singleHeight);
			}

			this.updateElementDataHeightProperties( blockData, newHeightUnits );

      this.resizeBlock( elem, w, newHeightUnits );

      Rexbuilder_Util_Editor.elementIsResizing = false;
    },

    /**
     * update height of a block with a new one
     * check previous valus to prevent bugs between different grid layouts
     * usually, occurs when a section is hidden (like for an accordion)
     * @param  {Node} el     element to resize
     * @param  {float} width width to set
     * @param  {float} height height to set
     * @return {void}
     * @since  2.0.1
     */
    resizeBlock: function( el, width, height ) {
      if( isNaN( height ) ) return;

      var gridstack = this.properties.gridstackInstance;
      if ( 'undefined' === typeof gridstack || null === gridstack ) return;

      if ( this.properties.oldCellHeight != 0 && this.properties.oldCellHeight != this.properties.singleHeight && this.properties.oldLayout == "masonry" ) {
        var x, y, w, h;
        var elDim;
        elDim = store.get( el.getAttribute("data-rexbuilder-block-id") );
        x = elDim.properties[0].x;
        y = Math.round( ( parseInt( elDim.properties[1].y ) * this.properties.oldCellHeight ) / this.properties.singleHeight );
        w = width;
        h = height;
        gridstack.update(el, x, y, w, h);
      } else {
        gridstack.resize(el, width, height);
      }
    },

    /**
     *  seems @deprecated
     *  @date 03-07-2019
     */
    _setParentGridPadding: function() {
      var $parent = this.$element.parent();
      if (
        (Rexbuilder_Util.globalViewport.width >=
          _plugin_frontend_settings.defaultSettings.collapseWidth &&
          !this.properties.setDesktopPadding) ||
        (!this.properties.setDesktopPadding &&
          !this.properties.setMobilePadding &&
          this.$section.attr("data-rex-collapse-grid") == "true")
      ) {
        this.properties.setDesktopPadding = true;
        if (this.$section.attr("data-rex-collapse-grid") == "true") {
          this.properties.setMobilePadding = true;
        } else {
          this.properties.setMobilePadding = false;
        }

        if (null !== this.properties.gridTopSeparator) {
          $parent.css(
            "padding-top",
            this.properties.gridTopSeparator - this.properties.halfSeparatorTop
          );
        } else {
          $parent.css("padding-top", this.properties.halfSeparatorTop);
        }

        if (null !== this.properties.gridBottomSeparator) {
          $parent.css(
            "padding-bottom",
            this.properties.gridBottomSeparator -
              this.properties.halfSeparatorBottom
          );
        } else {
          $parent.css("padding-bottom", this.properties.halfSeparatorBottom);
        }

        if (!this.properties.paddingTopBottom) {
          if (null !== this.properties.gridLeftSeparator) {
            $parent.css(
              "padding-left",
              this.properties.gridLeftSeparator -
                this.properties.halfSeparatorLeft
            );
          } else {
            $parent.css("padding-left", this.properties.halfSeparatorLeft);
          }

          if (null !== this.properties.gridRightSeparator) {
            $parent.css(
              "padding-right",
              this.properties.gridRightSeparator -
                this.properties.halfSeparatorRight
            );
          } else {
            $parent.css("padding-right", this.properties.halfSeparatorRight);
          }
        }
      }
    },
    // setting the blocks and wrap padding
    _setGridPadding: function() {
      if (
        !this.properties.setDesktopPadding ||
        (!this.properties.setDesktopPadding &&
          !this.properties.setMobilePadding &&
          this.section.getAttribute("data-rex-collapse-grid") == "true")
      ) {
        this.properties.setDesktopPadding = true;
        if (this.section.getAttribute("data-rex-collapse-grid") == "true") {
          this.properties.setMobilePadding = true;
        } else {
          this.properties.setMobilePadding = false;
        }

        if (null !== this.properties.gridTopSeparator) {
          this.element.style.marginTop = ( this.properties.gridTopSeparator - this.properties.halfSeparatorTop ) + 'px';
        } else {
          this.element.style.marginTop = this.properties.halfSeparatorTop + 'px';
        }

        if (null !== this.properties.gridBottomSeparator) {
          this.element.style.marginBottom = ( this.properties.gridBottomSeparator - this.properties.halfSeparatorBottom ) + 'px';
        } else {
          this.element.style.marginBottom = this.properties.halfSeparatorBottom + 'px';
        }

        if (!this.properties.paddingTopBottom) {
          if (null !== this.properties.gridLeftSeparator) {
            this.element.style.marginLeft = ( this.properties.gridLeftSeparator - this.properties.halfSeparatorLeft ) + 'px';
          } else {
            this.element.style.marginLeft = this.properties.halfSeparatorLeft + 'px';
          }

          if (null !== this.properties.gridRightSeparator) {
            this.element.style.marginRight = ( this.properties.gridRightSeparator - this.properties.halfSeparatorRight ) + 'px';
          } else {
            this.element.style.marginRight = this.properties.halfSeparatorRight + 'px';
          }
        }
      }
      /*
        * if
        * (this.$element.find(this.settings.itemSelector).hasClass('wrapper-expand-effect')) {
        * this.$element.find(this.settings.itemSelector).css('padding-bottom',
        * this.properties.halfSeparator);
        * this.$element.find(this.settings.itemSelector).css('padding-left',
        * this.properties.halfSeparator);
        * this.$element.find(this.settings.itemSelector).css('padding-right',
        * this.properties.halfSeparator); } else {
        *
        * if (this.properties.paddingTopBottom) {
        * this.$element.find(this.settings.itemSelector).css('padding-top',
        * this.properties.halfSeparator);
        * this.$element.find(this.settings.itemSelector).css('padding-bottom',
        * this.properties.halfSeparator); } else {
        * this.$element.find(this.settings.itemSelector).css('padding',
        * this.properties.halfSeparator); } } } else if
        * (Rexbuilder_Util.globalViewport.width < _plugin_frontend_settings.defaultSettings.collapseWidth &&
        * !this.properties.setMobilePadding &&
        * this.$section.attr("data-rex-collapse-grid") == "true") {
        * this.properties.setMobilePadding = true;
        * this.properties.setDesktopPadding = false;
        *
        * if ('false' == this.settings.mobilePadding) {
        * this.$element.find(this.settings.itemSelector).css('padding-top',
        * this.properties.halfSeparator);
        * this.$element.find(this.settings.itemSelector).css('padding-bottom',
        * this.properties.halfSeparator);
        * this.$element.find(this.settings.itemSelector).css('padding-left',
        * 0);
        * this.$element.find(this.settings.itemSelector).css('padding-right',
        * 0); } else if ('true' == this.settings.mobilePadding) {
        * this.$element.find(this.settings.itemSelector).css('padding',
        * this.properties.halfSeparator); } }
        */
    },

    collapseElementsProperties: function() {
      this.section.setAttribute("data-rex-collapse-grid", true);
      //adding class to button for collapse
      this.$section.find(".collapse-grid").addClass("grid-collapsed");
      this.properties.oneColumModeActive = true;
    },

    removeCollapseElementsProperties: function() {
      this.section.setAttribute("data-rex-collapse-grid", false);
      //removing class to button for collapse
      this.$section.find(".collapse-grid").removeClass("grid-collapsed");
      this.properties.oneColumModeActive = false;
    },

    updateGridLayoutCollapse: function(layoutData) {
      this.settings.galleryLayout = layoutData.layout;
      this.settings.fullHeight = layoutData.fullHeight;
      this.properties.singleHeight = layoutData.singleHeight;
      this.element.setAttribute("data-full-height", layoutData.fullHeight);
      this.element.setAttribute("data-layout", layoutData.layout);
      this.$section.children('.section-data').attr('data-full_height', layoutData.fullHeight);
      this.$section.children('.section-data').attr('data-layout', layoutData.layout);
      this.batchGridstack();
      this.updateGridstackStyles();
      this.updateFloatingElementsGridstack();
      this.commitGridstack();
    },

    changeGridToMasonry: function() {
      this.settings.galleryLayout = "masonry";
      this.settings.fullHeight = false;
      this.properties.singleHeight = this.settings.cellHeightMasonry;
      this.batchGridstack();
      this.updateGridstackStyles();
      this.updateFloatingElementsGridstack();
      this.commitGridstack();
      this.element.setAttribute('data-layout', 'masonry');
      this.element.setAttribute('data-full-height', 'false');
      this.$section.children('.section-data').attr('data-layout', 'masonry');
      this.$section.children('.section-data').attr('data-full_height', 'false');
    },

    /**
     * When commit event is added, have to change timeouts with listeners
     */
    collapseElements: function(reverseData) {
      reverseData = typeof reverseData == "undefined" ? {} : reverseData;
      this.properties.dispositionBeforeCollapsing = this.createActionDataMoveBlocksGrid();
      this.properties.layoutBeforeCollapsing = {
        layout: this.settings.galleryLayout,
        fullHeight: this.settings.fullHeight,
        singleHeight: this.properties.singleHeight
			};

      this.fixBlockDomOrder();
      this._saveBlocksPosition();
      this.collapseElementsProperties();
      this.properties.collapsingElements = true;
      if (this.settings.galleryLayout == "fixed") {
        this.properties.beforeCollapseWasFixed = true;
        this.changeGridToMasonry();
      }
      this.batchGridstack();
      this.updateBlocksWidth();
      this.commitGridstack();

      setTimeout( handleCollapsFirstTimeout.bind( this, reverseData ), 500 );
    },

    updateBlocksWidth: function() {
      var orderedElements = this.getElementsTopBottom();
      var currentY = 0;
      var i;
      var tot_orderedElements = orderedElements.length;
      for (i = 0; i < tot_orderedElements; i++) {
				this.properties.gridstackInstance.update( orderedElements[i], 0, currentY, 12, parseInt( orderedElements[i].getAttribute("data-gs-height") ) );
        currentY += parseInt( orderedElements[i].getAttribute("data-gs-height") );
			}
    },

    updateCollapsedBlocksHeight: function() {
      var items = [].slice.call( this.element.getElementsByClassName('grid-stack-item') );
      var tot_items = items.length, i = 0;
      var reverse_items = items.reverse();
      for( i=0; i < tot_items; i++ ) {
				var sizes = this.getBlockSizeOnCollapse( reverse_items[i] );
        this.properties.gridstackInstance.resize(reverse_items[i], sizes.width, sizes.height);
      }
    },

    fixBlockDomOrder: function() {
      var orderedElements = this.getElementsTopBottom();
      var rexIDS = [];
      var nodes = [];
      var elem;
      var i, j;
      var tot_orderedElements = orderedElements.length;
      var tot_rexIDS, tot_nodes;

      for (i = 0; i < tot_orderedElements; i++) {
        var block = {
          rexID: $(orderedElements[i]).attr("data-rexbuilder-block-id"),
          added: false
        };
        rexIDS.push(block);
      }

      var items = [].slice.call(this.element.getElementsByClassName('grid-stack-item'));
      var tot_items = items.length, i = 0;
      var elemObj;

      // this.$element.children(".grid-stack-item").each(function() {
      for( i = 0; i < tot_items; i++ ) {
        elemObj = {
          rexID: items[i].getAttribute("data-rexbuilder-block-id"),
          element: $(items[i]).detach()
        };
        nodes.push(elemObj);
      }

      for (i = 0, tot_rexIDS = rexIDS.length; i < tot_rexIDS; i++) {
        for (j = 0, tot_nodes = nodes.length; j < tot_nodes; j++) {
          if (nodes[j].rexID == rexIDS[i].rexID) {
            elem = nodes[j].element;
            break;
          }
        }
        this.$element.append(elem);
        nodes.splice(j, 1);
      }
    },

    /**
     * Filtering the blocks and animate them according to
     * Some filtering rule
     * @param {Object} options filtering information
     * @since 2.0.0
     * @todo remove velocity and add anime, or remove completely the method (we need it only in the front(?))
     */
    filter: function(options) {
      // get the initial state of the grid
      // to have the correct order of the blocks in the DOM
      var initialStateItems = [];
      var totNodes = this.properties.initialStateGrid.length;
      for ( var i=0; i < totNodes; i++ ) {
        initialStateItems.push(this.properties.initialStateGrid[i].el);
      }

      // var $items = this.$element.find(".grid-stack-item");
      var $items = $(initialStateItems).map( function() { return this.toArray(); });
      var $toMaintain = $items.filter(options.filter);
      var $toRemoves = $items.not(options.filter);
      var that = this;

      // Animate entering and exiting blocks
      $toMaintain.each(function(i,el) {
        if( "0" === el.style.opacity ) {
          var $item = $(el);
          $item.velocity({
            // transform: ["scale(1)","scale(0)"],
            scale: 1,
            opacity: 1
          }, {
            duration: 200,
            begin: function(el) {
              el[0].style.display = '';
            }
          });
        } else {
          el.style.opacity = 1;
          el.style.display = '';
        }
      });

      $toRemoves.each(function(i,el) {
        if( "0" !== el.style.opacity ) {
          var $toRemove = $(el);
          $toRemove.velocity({
            // transform: ["scale(0)","scale(1)"],
            scale: 0,
            opacity: 0
          }, {
            duration: 200,
            complete: function(el) {
              el[0].style.display = 'none';
            }
          });
        } else {
          el.style.opacity = 0;
          el.style.display = 'none';
        }
      });

      this.properties.gridstackInstance.batchUpdate();

      // Remove all blocks from gridstack instance
      this.properties.gridstackInstance.removeAll(false);

      // Remove position styling
      // $items.each(function(i,el) {
      //   el.style.left = "";
      //   el.style.top = "";
      // });

      // Check filter type: all (*) || other
      if("*" === options.filter ) {
        $items.each(function(i,el) {
          var node = {
            x: parseInt(el.getAttribute("data-gs-x")),
            y: parseInt(el.getAttribute("data-gs-y")),
            width: parseInt(el.getAttribute("data-gs-width")),
            height: parseInt(el.getAttribute("data-gs-height")),
            autoPosition: el.getAttribute("data-gs-auto-position"),
            minWidth: el.getAttribute("data-gs-min-width"),
            maxWidth: el.getAttribute("data-gs-max-width"),
            minHeight: el.getAttribute("data-gs-min-height"),
            maxHeight: el.getAttribute("data-gs-max-height"),
            id: el.getAttribute("data-gs-id"),
          };
          that.properties.gridstackInstance.addWidget(el, node.x, node.y, node.width, node.height, node.autoPosition, node.minWidth, node.maxWidth, node.minHeight, node.maxHeight, node.id);
        });

        for(var i=0, tot_initialStateGrid = this.properties.initialStateGrid.length; i<tot_initialStateGrid; i++) {
          var el = this.properties.initialStateGrid[i].el[0];
          // var pos = that.get_pixel_position({x:this.properties.initialStateGrid[i].x, y:this.properties.initialStateGrid[i].y});
          // el.style.left = pos.left;
          // el.style.top = pos.top;
          this.properties.gridstackInstance.update(el, this.properties.initialStateGrid[i].x, this.properties.initialStateGrid[i].y);
        }
      } else {
        this.properties.mirrorStateGrid = [];

        $toMaintain.each(function(i,el) {
          var node = {
            x: parseInt(el.getAttribute("data-gs-x")),
            y: parseInt(el.getAttribute("data-gs-y")),
            el: el,
            width: parseInt(el.getAttribute("data-gs-width")),
            height: parseInt(el.getAttribute("data-gs-height")),
          }
          var newCoords = that.placeElMirror(node);
          that.properties.mirrorStateGrid.push({
            x: newCoords.x,
            y: newCoords.y,
            el: el,
            width: parseInt(el.getAttribute("data-gs-width")),
            height: parseInt(el.getAttribute("data-gs-height")),
          });
        });

        $toMaintain.each(function(i,el) {
          var node = {
            x: parseInt(el.getAttribute("data-gs-x")),
            y: parseInt(el.getAttribute("data-gs-y")),
            width: parseInt(el.getAttribute("data-gs-width")),
            height: parseInt(el.getAttribute("data-gs-height")),
            el: el,
          };

          that.properties.gridstackInstance.addWidget(el, node.x, node.y);
        });

        $toMaintain.each(function(i,el) {
          // var pos = that.get_pixel_position({x:that.properties.mirrorStateGrid[i].x, y:that.properties.mirrorStateGrid[i].y});
          // el.style.left = pos.left;
          // el.style.top = pos.top;
          that.properties.gridstackInstance.update(el, that.properties.mirrorStateGrid[i].x, that.properties.mirrorStateGrid[i].y);
        });
      }

      this.properties.gridstackInstance.commit();

      var event = jQuery.Event("rexlive:galleryFiltered");
      event.settings = {
        galleryEditorInstance: this
      };
      $(document).trigger(event);
    },

    /**
     * Search the first avaiable position in gridstack for a node
     * searching a mirroring state grid object
     * @param {Object} node grid stack item
     * @since 2.0.0
     */
    placeElMirror: function(node) {
      // var thatMirrorStateGrid = this.properties.mirrorStateGrid;
      var response = {
        x: 0,
        y: 0,
      }
      for (var i = 0;; ++i) {
        var x = i % this.properties.gridstackInstance.grid.width;
        var y = Math.floor(i / this.properties.gridstackInstance.grid.width);
        if (x + node.width > this.properties.gridstackInstance.grid.width) {
          continue;
        }

        if (!_.find(this.properties.mirrorStateGrid, _.bind(GridStackUI.Utils._isAddNodeIntercepted, {x: x, y: y, node: node}))) {
          response.x = x;
          response.y = y;
          break;
        }
      }
      return response;
    },

    /**
     * Getting the pixel value for a x,y gridstack coordinate
     * @param {Object} coords x and y gridstack coordinate
     * @since 2.0.0
     */
    get_pixel_position: function( coords ) {
      var result = {
        left: "0",
        top: "0"
      };

      result.left = (this.properties.gridstackInstance.cellWidth() * coords.x) + "px";
      result.top = (this.properties.gridstackInstance.cellHeight() * coords.y + ( this.properties.gridstackInstance.opts.verticalMargin * coords.y ) ) + "px";

      return result;
    },

    /**
     * Saving the grid state, based on the gridsatck nodes positions
     * @since 2.0.0
     */
    save_grid_state: function() {
      this.properties.initialStateGrid = this.properties.gridstackInstance.grid.nodes;
    },

    /**
     * Fix natural image with a proper class to style correctly the image in background
     * as a natural image with IMG tag
     * @return {null}
     * @since 2.0.0
     */
    fix_natural_image_blocks: function() {
      var imageWrappers = [].slice.call( this.element.getElementsByClassName('rex-image-wrapper') );
      var tot_imageWrappers = imageWrappers.length, i = 0;
      var $el;
      for( i=0; i < tot_imageWrappers; i++ ) {
        if ( hasClass( imageWrappers[i], 'natural-image-background' ) ) {
          $el = $(imageWrappers[i]);
          var width = parseInt( $el.parents(".grid-item-content").attr("data-background_image_width") );
          var t = imageWrappers[i].offsetWidth;
          if ( width > imageWrappers[i].offsetWidth ) {
            addClass( imageWrappers[i], 'small-width' );
          }
        }
      }
    },

    /**
     * Setting the initialStateGrid property with an array of nodes infos
     * @param {Array} state array of nodes info
     * @since 2.0.0
     */
    set_grid_initial_state: function( state ) {
      this.properties.initialStateGrid = state;
    },

    /**
     * Concatenating existent initial state with other nodes
     * @param {Array} nodes array of Gridstack nodes
     * @since 2.0.0
     */
    merge_grid_initial_state: function( nodes ) {
      this.properties.initialStateGrid = this.properties.initialStateGrid.concat(nodes);
    },

    _getCoord: function( val, maxWidth ) {
      return {
        x: val % maxWidth,
        y: Math.floor( val / maxWidth )
      }
    },

    // _getIndex: function(coord, maxWidth) {
    //   return coord[0] + ( coord[1] * maxWidth );
    // },

    destroyGridGallery: function() {
      this.destroyGridstack();
      // this.removeScrollbars();
      this.clearStateGrid();
      this.$element.removeClass("grid-number-" + this.properties.sectionNumber);
    },

    // check if the parent wrap of the grd has a particular class
    _check_parent_class: function(c) {
      return hasClass( this.section, c );
    },
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    var args = arguments;

    if (options === undefined || typeof options === "object") {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          $.data(
            this,
            "plugin_" + pluginName,
            new perfectGridGalleryEditor(this, options)
          );
        }
      });
    } else if (
      typeof options === "string" &&
      options[0] !== "_" &&
      options !== "init"
    ) {
      var returns;

      this.each(function() {
        var instance = $.data(this, "plugin_" + pluginName);

        if ( instance instanceof perfectGridGalleryEditor && typeof instance[options] === "function" ) {
          returns = instance[options].apply(
            instance,
            Array.prototype.slice.call(args, 1)
          );
        }
        if (options === "destroy") {
          $.data(this, "plugin_" + pluginName, null);
        }
      });
      return returns !== undefined ? returns : this;
    }
  };
})(jQuery, window, document, _);
