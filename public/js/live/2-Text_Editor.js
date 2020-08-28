/**
 * Object that handles the live text editor inside the blocks
 *
 * @since 2.0.0
 */
var TextEditor = (function ($) {
  "use strict";

  var editorInstance;

  var pickerExtensionInstance;
  // var htmlExtensionInstance;
  var headingTagsExtensionInstance;
  var formattingTagsExtensionInstance;
  var justifyExtensionIntance;
  var listExtensionInstance;
	var insertMediaExtensionInstance;
	var rexElementInstance;
  var testDeleteExtensionInstance;

  var currentTextSelection;

  var toolbarActiveOnRexbutton;

  /**
   *  Launching MediumEditor inside the blocks that can have it
   */
  function launchTextEditors( grid ) {
    var editors = [].slice.call( grid.getElementsByClassName('rex-text-editable') );
    var tot_editors = editors.length, i = 0;
    var hasPswp, hasSlider, textWrap;
    for( i=0; i < tot_editors; i++ ) {
      hasPswp = editors[i].getElementsByClassName('pswp-figure');
      hasSlider = editors[i].getElementsByClassName('rex-slider-wrap');
      if ( 0 === hasPswp.length && 0 === hasSlider.length ) {
        textWrap = editors[i].querySelector('.text-wrap');
        TextEditor.addElementToTextEditor( textWrap );
      }
    }
  }

  /**
   * Add element to text editor instance
   * @param {Node} textWrap element that becomes editable
   */
  var _addElementToTextEditor = function ( textWrap ) {
    editorInstance.addElements( textWrap );
  };

  /**
   * @deprecated
   * @param {jQuery Element} $textWrap
   */
  var _addMediumInsertToElement = function ($textWrap) {
    $textWrap.mediumInsert({
      editor: editorInstance,
      beginning: true,
      label: "<i class='l-svg-icons'><svg><use xlink:href='#Z001-Plus'></use></svg></i>",
      addons: {
        images: {
          useDragAndDrop: false,
          actions: {
            replace: {},
          }
        },
        embeds: {
          oembedProxy: "https://medium.iframe.ly/api/oembed?iframe=1",
          label: "<i class='l-svg-icons'><svg><use xlink:href='#Z006-Video'></use></svg></i>"
        },
        wordpressImages: {
          label: "<i class='l-svg-icons'><svg><use xlink:href='#Z002-Image-Full'></use></svg></i>",
          uploadScript: null,
          deleteScript: null,
          captions: false,
          captionPlaceholder: false,
          actions: {
            replace: {
              label: '<span class="fa fa-pencil"></span>',
              clicked: function ($el) {
              }
            },
          },
          preview: false
        },
        // tables: {}
        // CustomAddon: {}
      }
    });
  };

  /**
   * //Color picker extension
   * Sets the color of the current text selection
   */
  var setCurrentTextColor = function (color) {
    $(editorInstance.getSelectedParentElement()).css("color", color);
  };


  /**
   * Color picker extension
   * Gets the color of the current text selection
   */
  var getCurrentTextColor = function () {
    return $(editorInstance.getSelectedParentElement()).css("color");
  };

  var getCurrentGradientValue = function () {
    return editorInstance.getSelectedParentElement().getAttribute("data-gradient");
  };

  var getCurrentStyle = function () {
    return editorInstance.getSelectedParentElement().getAttribute("style");
  }

  var setColor = function (color) {
    // var finalColor = color ? color.toRgbString() : "rgba(0,0,0,0)";
    var finalColor = color ? color : "rgba(0,0,0,0)";
    _triggerMEEvent({
      name: 'rexlive:mediumeditor:removeGradient',
      data: {},
      editable: null
    });
    pickerExtensionInstance.base.importSelection(currentTextSelection);
    pickerExtensionInstance.document.execCommand("styleWithCSS", false, true);
    pickerExtensionInstance.document.execCommand("foreColor", false, finalColor);
  };

  var _openTextGradientColor = function ($elem) {
    var $section = $elem.parents(".rexpansive_section");
    var rex_block_id = $elem.attr("data-rexbuilder-block-id");
    var $elemData = $elem.children(".rexbuilder-block-data");
    var sectionID = $section.attr("data-rexlive-section-id");
    var modelNumber =
      typeof $section.attr("data-rexlive-model-number") != "undefined"
        ? $section.attr("data-rexlive-model-number")
        : "";

    // var bgGradientCol = $elemData.attr('data-color_bg_block');
    var bgGradientCol = $elem.attr("data-selection-gradient");

    var settings = {
      blockData: {
        gradient: bgGradientCol,
        target: {
          sectionID: sectionID,
          modelNumber: modelNumber,
          rexID: rex_block_id
        },
      }
    };

    Rexbuilder_Util_Editor.manageElement = true;
    // var mousePosition = Rexbuilder_Util_Editor.getMousePosition( e, { offset: { w: this.offsetWidth, h: this.offsetHeight } } );

    var data = {
      eventName: "rexlive:editTextGradient",
      activeBlockData: settings,
      // mousePosition: mousePosition
    };

    Rexbuilder_Util_Editor.sendParentIframeMessage(data);
  };

  /**
   * Setting a color picker button for a generic medium editor toolbar
   *
   * @param {Node} element DOM element to apply spectrum color picker
   * @param {Function} setFunction call back function to invoce on color change
   * @since 2.0.0
   */
  var initPicker = function(element, setFunction) {
    var $picker = $(element);
    var $picker_preview = $picker.find('.meditor-color-picker--preview');
    $picker.spectrum({
      // allowEmpty: true,
      // color: "#000",
      preferredFormat: "hex",
      showPalette: false,
      showAlpha: true,
      showInput: true,
      showButtons: false,
      // containerClassName: 'meditor-spectrum-color-picker',
      containerClassName: "sp-draggable sp-meditor",
      show: function () {
        this.setAttribute("data-revert", false);
        // this.setAttribute("data-color-on-show", $picker.spectrum("get").toRgbString());
        Rexbuilder_Color_Palette.show({
          $target: $picker,
          action: "color",
          object: "text",
          textSelection: editorInstance.exportSelection()
        });
      },
      change: function(color) {
        // setColor(color.toRgbString());
        setFunction.call(this, color.toRgbString());
        $picker_preview.css('background-color', color.toRgbString());
      },
      move: function(color) {
        // setColor(color.toRgbString());
        setFunction.call(this, color.toRgbString());
      },
      hide: function (color) {
        var currentGradient = $picker.attr("data-selection-gradient");
        var revertData = this.getAttribute("data-revert");
        if ("null" == currentGradient) {
          var to_set = "true" == revertData ? this.getAttribute("data-color-on-show") : color.toRgbString();
          // setColor(to_set);
          setFunction.call(this, color.toRgbString());
          $picker_preview.css('background-color',to_set);
        }
        Rexbuilder_Color_Palette.hide();
        editorInstance.getExtensionByName('insert-media').hideAllToolbars();
      },
    });

    Rexbuilder_Live_Utilities.addSpectrumCustomSaveButton($picker);
    Rexbuilder_Live_Utilities.addSpectrumCustomCloseButton($picker);

    $picker.spectrum("container").draggable();
  };

  /**
   * Custom `color picker` extension
   */
  var ColorPickerExtension = MediumEditor.extensions.button.extend({
    name: "colorPicker",
    action: "applyForeColor",
    aria: "color picker",
    contentDefault: "<span class='editor-color-picker'>Text Color<span>",

    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("hide-tool-rexbutton");
      this.button.classList.add("hide-tool-rexelement");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action--color-picker");
      this.button.innerHTML = "<span class='meditor-color-picker'><span class='meditor-color-picker__placeholder'>P</span></span><span class='meditor-color-picker--preview'></span>";

      // init spectrum color picker for this button
      initPicker(this.button, setColor);

      // use our own handleClick instead of the default one
      this.on(this.button, "click", this.handleClick.bind(this));
      this.subscribe("showToolbar", this.handleShowToolbar.bind(this));
    },
    handleClick: function (event) {
      // keeping record of the current text selection
      var toolbar = editorInstance.getExtensionByName("toolbar");
      if (toolbar) {
        toolbar.hideToolbar();
      }

      currentTextSelection = editorInstance.exportSelection();

      // sets the color of the current selection on the color
      // picker
      var textCurrentColor = getCurrentTextColor();
      $(this.button).spectrum("set", textCurrentColor);
      this.button.setAttribute("data-color-on-show", textCurrentColor);

      var currentGradient = getCurrentGradientValue();
      var currentStyle = getCurrentStyle();
      this.button.setAttribute("data-selection-gradient", currentGradient);
      _triggerMEEvent({
        name: "rexlive:mediumeditor:traceTextGradient",
        data: {
          gradient: currentGradient,
          style: currentStyle
        },
        editable: null
      })

      // from here on, it was taken form the default handleClick
      event.preventDefault();
      event.stopPropagation();

      var action = this.getAction();

      if (action) {
        this.execAction(action);
      }
    },

    handleShowToolbar: function (event) {
      var $element = $(editorInstance.getSelectedParentElement());
      var inline_color = $element.prop('style')['color'];
      if ("" !== inline_color) {
        $(this.button).find('.meditor-color-picker--preview').css('background-color', getCurrentTextColor());
      } else {
        $(this.button).find('.meditor-color-picker--preview').css('background-color', '');
      }
    }
  });

  /**
   * Handling the set of a gradient text
   * @since 2.0.0
   */
  var TextGradientExtension = MediumEditor.Extension.extend({
    name: "textGradient",

    init: function () {
      this.gradientClassApplier = rangy.createClassApplier('text-gradient', {
        elementTagName: 'span',
        normalize: true,
        elementAttributes: {
          "data-gradient": "",
          "style": "",
        }
      });
      this.subscribe('rexlive:mediumeditor:setTextGradient', this.handleGradient.bind(this));
      this.subscribe('rexlive:mediumeditor:traceTextGradient', this.traceGradient.bind(this));
      this.subscribe('rexlive:mediumeditor:removeGradient', this.removeGradient.bind(this));
    },

    handleGradient: function (event, editable) {
      // var toolbar = editorInstance.getExtensionByName("textGradient");
      // currentTextSelection = editorInstance.exportSelection();

      // 1) with pasteHTML
      // var index = this.base.exportSelection().editableElementIndex;
      // var meContents = this.base.serialize();
      // var htmlSelected = meContents['element-'+index].value;
      // htmlSelected = htmlSelected.replace('<span class="text-editor-span-fix" style="display: none;"></span>','').trim();
      // console.log("<span class='text-gradient'>"+ htmlSelected +"</span>");
      // console.log(document.getSelection());

      // this.base.pasteHTML("<span class='text-gradient'>"+ htmlSelected +"</span>", {
      //   cleanPastedHTML: false,
      //   cleanAttrs: ['dir'],
      // });

      // 2) width insertHTML
      // console.log("<span class='text-gradient'>"+ document.getSelection()+"</span>");
      // this.document.execCommand("styleWithCSS", false, false);
      // this.document.execCommand("insertHTML", false, "<span class='text-gradient'>"+ document.getSelection()+"</span>");

      // 3) RANGY
      // console.log(this.gradientClassApplier.isAppliedToSelection());
      // if( this.gradientClassApplier.isAppliedToSelection() ) {
      //   if( this.gradientClassApplier.elementAttributes["data-gradient"] !== event.color ) {
      //     // var sel = rangy.getSelection();
      //     // console.log(sel.toHtml());

      //   }
      // }

      this.gradientClassApplier.undoToSelection();

      this.gradientClassApplier.elementAttributes["data-gradient"] = event.color;
      this.gradientClassApplier.elementAttributes["style"] = event.style;
      this.gradientClassApplier.applyToSelection();
      // if( this.gradientClassApplier.elementAttributes["data-gradient"] !== event.color ) {
      //   this.gradientClassApplier.undoToSelection();
      //   this.gradientClassApplier.elementAttributes["data-gradient"] = event.color;
      //   this.gradientClassApplier.applyToSelection();
      //   Rexbuilder_Util_Editor.synchGradient();
      // }
    },

    traceGradient: function (event, editable) {
      this.gradientClassApplier.elementAttributes["data-gradient"] = event.gradient;
      this.gradientClassApplier.elementAttributes["style"] = event.style;
    },

    removeGradient: function (event, editable) {
      this.gradientClassApplier.undoToSelection();
    }
  });

  /**
   * Custom text tag extension
   */
  var TextTagExtension = MediumEditor.extensions.button.extend({
    name: "headingTags",
    action: "",
    contentDefault: "TAGS",
    init: function () {
      this.button = this.document.createElement("button");

      this.button.classList.add("hide-tool-rexbutton");
      this.button.classList.add("hide-tool-rexelement");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action-list");
      // list parent element
      this.list_parent = this.document.createElement("div");
      this.list_parent.classList.add("me__heading-list-parent");
      this.list_parent.innerHTML = "<i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>";
      // list parent element: active action container
      this.list_active_action = this.document.createElement("span");
      this.list_active_action.classList.add("me__action-active");
      this.list_active_action.innerHTML = "h1";
      $(this.list_parent).append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");

      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='append-h1'>h1</div><div class='medium-editor-action' data-tag-action='append-h2'>h2</div><div class='medium-editor-action' data-tag-action='append-h3'>h3</div><div class='medium-editor-action' data-tag-action='append-h4'>h4</div><div class='medium-editor-action' data-tag-action='append-h5'>h5</div><div class='medium-editor-action' data-tag-action='append-h6'>h6</div><div class='medium-editor-action' data-tag-action='append-p'>p</div>";

      this.list_actions = this.list_element.getElementsByClassName('medium-editor-action');

      $(this.button).append(this.list_parent);
      $(this.button).append(this.list_element);

      this.action_active = "";
      this.all_actions = ['append-h1', 'append-h2', 'append-h3', 'append-h4', 'append-h5', 'append-h6'];

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.resetEnv.bind(this));
    },

    isAlreadyApplied: function (node) {
      // this.action_active = '';
      switch (node.nodeName.toLowerCase()) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'p':
          this.action_active = 'append-' + node.nodeName.toLowerCase();
          this.setActionListState();
          return true;
        default:
          return false;
      }
    },

    setInactive: function () {
      this.setActionListState();
    },

    setActive: function () {
      this.setActionListState();
    },

    setActionListState: function () {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function () {
      this.list_active_action.innerHTML = "h1";
      for (var i = 0; i < this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function () {
      if ("" != this.action_active) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="' + this.action_active + '"]').classList.add('medium-editor-button-active');
        this.list_active_action.innerHTML = this.action_active.replace('append-', '');
      }
    },

    resetEnv: function () {
      this.action_active = "";
    },

    handleClick: function (event) {
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized

      var action = undefined;
      if (event.target.hasAttribute('data-tag-action')) {
        action = event.target.getAttribute('data-tag-action');
      } else if (event.target.parentNode.hasAttribute('data-tag-action')) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if ('undefined' != typeof action) {
        editorInstance.execAction(action);
      }
    }

  });

  /**
   * Custom extension for display list of formatting tags for text: bold, italic and underline
   * @since 2.0.0
   */
  var FormattingTagExtension = MediumEditor.extensions.button.extend({
    name: "formattingTags",
    // action: "bold",
    contentDefault: "TAGS",
    useQueryState: false,
    aria: 'Format text',
    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("hide-tool-rexbutton");
      this.button.classList.add("hide-tool-rexelement");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action-list");
      // list parent element
      this.list_parent = this.document.createElement("div");
      this.list_parent.classList.add("me__heading-list-parent");
      this.list_parent.innerHTML = "<i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>";
      // list parent element: active action container
      this.list_active_action = this.document.createElement("span");
      this.list_active_action.classList.add("me__action-active");
      this.list_active_action.innerHTML = "<i class='fa fa-bold'></i>";
      $(this.list_parent).append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");

      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='bold'><i class='fa fa-bold'></i></div><div class='medium-editor-action' data-tag-action='italic'><i class='fa fa-italic'></i></div><div class='medium-editor-action' data-tag-action='underline'><i class='fa fa-underline'></i></div>";

      this.list_actions = this.list_element.getElementsByClassName('medium-editor-action');

      $(this.button).append(this.list_parent);
      $(this.button).append(this.list_element);

      this.action_active = [];

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.clearListButtons.bind(this));
    },

    checkState: function (node) {
      switch (node.nodeName.toLowerCase()) {
        case 'b':
        case 'strong':
          this.action_active.push('bold');
          this.mark_active = true;
          break;
        case 'i':
          this.action_active.push('italic');
          this.mark_active = true;
          break;
        case 'u':
          this.action_active.push('underline');
          this.mark_active = true;
          break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'p':
        case 'li':
        case 'ol':
        case 'ul':
          if (this.mark_active) {
            this.setActionListState();
            this.action_active = [];
            delete this.mark_active;
          }
          break;
        default:
          break;
      }
    },

    handleClick: function (event) {
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized
      var action = undefined;
      if (event.target.hasAttribute('data-tag-action')) {
        action = event.target.getAttribute('data-tag-action');
      } else if (event.target.parentNode.hasAttribute('data-tag-action')) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if ('undefined' != typeof action) {
        editorInstance.execAction(action);
      }
    },

    setActionListState: function () {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function () {
      this.list_active_action.innerHTML = "<i class='fa fa-bold'></i>";
      for (var i = 0; i < this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function () {
      for (var i = 0; i < this.action_active.length; i++) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="' + this.action_active[i] + '"]').classList.add('medium-editor-button-active');
        if (0 == i) {
          this.list_active_action.innerHTML = "<i class='fa fa-" + this.action_active[i] + "'></i>";
        }
      }
    },
  });

  /**
   * Custom Button for display ordered and unordered list buttons
   * @since 2.0.0
   */
  var ListExtension = MediumEditor.extensions.button.extend({
    name: "listDropdown",
    action: "",
    contentDefault: "TAGS",
    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("hide-tool-rexbutton");
      this.button.classList.add("hide-tool-rexelement");

      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action-list");
      // list parent element
      this.list_parent = this.document.createElement("div");
      this.list_parent.classList.add("me__heading-list-parent");
      this.list_parent.innerHTML = "<i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>";
      // list parent element: active action container
      this.list_active_action = this.document.createElement("span");
      this.list_active_action.classList.add("me__action-active");
      this.list_active_action.innerHTML = "<i class='fa fa-list-alt'></i>";
      $(this.list_parent).append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");

      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='insertorderedlist'><i class='fa fa-list-ol'></i></div><div class='medium-editor-action' data-tag-action='insertunorderedlist'><i class='fa fa-list-ul'></i></div>";

      this.list_actions = this.list_element.getElementsByClassName('medium-editor-action');

      $(this.button).append(this.list_parent);
      $(this.button).append(this.list_element);

      this.action_active = "";
      this.all_actions = ['insertorderedlist', 'insertunorderedlist'];

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.resetEnv.bind(this));
    },

    isAlreadyApplied: function (node) {
      for (var i = 0; i < this.all_actions.length; i++) {
        if (this.base.queryCommandState(this.all_actions[i])) {
          this.action_active = this.all_actions[i];
          return true;
        }
      }
      return false;
    },

    setInactive: function () {
      this.setActionListState();
    },

    setActive: function () {
      this.setActionListState();
    },

    setActionListState: function () {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function () {
      this.list_active_action.innerHTML = "<i class='fa fa-list-alt'></i>";
      for (var i = 0; i < this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function () {
      if ("" != this.action_active) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="' + this.action_active + '"]').classList.add('medium-editor-button-active');
        switch (this.action_active) {
          case 'insertorderedlist':
            this.list_active_action.innerHTML = "<i class='fa fa-list-ol'></i>";
            break;
          case 'insertunorderedlist':
            this.list_active_action.innerHTML = "<i class='fa fa-list-ul'></i>";
            break;
          default:
            this.list_active_action.innerHTML = "<i class='fa fa-list-alt'></i>";
            break;
        }
      }
    },

    resetEnv: function () {
      this.action_active = "";
    },

    handleClick: function (event) {
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized

      var action = undefined;
      if (event.target.hasAttribute('data-tag-action')) {
        action = event.target.getAttribute('data-tag-action');
      } else if (event.target.parentNode.hasAttribute('data-tag-action')) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if ('undefined' != typeof action) {
        editorInstance.execAction(action);
      }
    }
  });

  /**
   * Custom extension that opens the builder modal to set the content position of a block
   * @since 2.0.0
   */
  var ContentBlockPositionExtension = MediumEditor.extensions.button.extend({
    name: "contentBlockPosition",
    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("hide-tool-rexbutton");
      this.button.classList.add("hide-tool-rexelement");
      this.button.classList.add("medium-editor-action");

      this.button.innerHTML = "<i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#C005-Layout'></use></svg></i>";

      this.on(this.button, 'click', this.handleClick.bind(this));
    },

    handleClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var pos = this.button.getBoundingClientRect();
      Rexbuilder_Util_Editor.mousePosition = {
        client: {
          x: event.clientX,
          y: event.clientY,
        },
        offset: {
          x: event.clientX - pos.left,
          y: event.clientY - pos.top,
        }
      };

      Rexbuilder_Util_Editor.mouseClickObject = {
        offset: {
          w: this.button.offsetWidth,
          h: this.button.offsetHeight
        }
      };
      $(this.base.getFocusedElement()).parents('.grid-stack-item').find('.edit-block-content-position').trigger('click');
    }
  });

  /**
   * Custom extension for display justifing text options: left, right, center, justify
   * @since 2.0.0
   */
  var JustifyExtension = MediumEditor.extensions.button.extend({
    name: "justifyDropdown",
    action: "",
    contentDefault: "TAGS",
    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action-list");
      // list parent element
      this.list_parent = this.document.createElement("div");
      this.list_parent.classList.add("me__heading-list-parent");
      this.list_parent.innerHTML = "<i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>";
      // list parent element: active action container
      this.list_active_action = this.document.createElement("span");
      this.list_active_action.classList.add("me__action-active");
      this.list_active_action.innerHTML = "<i class='fa fa-align-left'></i>";
      $(this.list_parent).append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");

      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='justifyLeft'><i class='fa fa-align-left'></i></div><div class='medium-editor-action' data-tag-action='justifyCenter'><i class='fa fa-align-center'></i></div><div class='medium-editor-action' data-tag-action='justifyRight'><i class='fa fa-align-right'></i></div><div class='medium-editor-action hide-tool-rexbutton hide-tool-rexelement' data-tag-action='justifyFull'><i class='fa fa-align-justify'></i></div>";

      this.list_actions = this.list_element.getElementsByClassName('medium-editor-action');

      this.action_active = '';
      this.all_actions = ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'];

      $(this.button).append(this.list_parent);
      $(this.button).append(this.list_element);

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.resetEnv.bind(this));
    },

    isAlreadyApplied: function () {
      for (var i = 0; i < this.all_actions.length; i++) {
        if (this.base.queryCommandState(this.all_actions[i])) {
          this.action_active = this.all_actions[i];
          return true;
        }
      }
      return false;
    },

    setInactive: function () {
      this.setActionListState();
    },

    setActive: function () {
      this.setActionListState();
    },

    setActionListState: function () {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function () {
      this.list_active_action.innerHTML = "<i class='fa fa-align-left'></i>";
      for (var i = 0; i < this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function () {
      if ("" != this.action_active) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="' + this.action_active + '"]').classList.add('medium-editor-button-active');
        switch (this.action_active) {
          case 'justifyLeft':
            this.list_active_action.innerHTML = "<i class='fa fa-align-left'></i>";
            break;
          case 'justifyCenter':
            this.list_active_action.innerHTML = "<i class='fa fa-align-center'></i>";
            break;
          case 'justifyRight':
            this.list_active_action.innerHTML = "<i class='fa fa-align-right'></i>";
            break;
          case 'justifyFull':
            this.list_active_action.innerHTML = "<i class='fa fa-align-justify'></i>";
            break;
          default:

            this.list_active_action.innerHTML = "<i class='fa fa-align-left'></i>";
            break;
        }
      }
    },

    resetEnv: function () {
      this.action_active = "";
    },

    handleClick: function (event) {
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized

      var action = undefined;
      if (event.target.hasAttribute('data-tag-action')) {
        action = event.target.getAttribute('data-tag-action');
      } else if (event.target.parentNode.hasAttribute('data-tag-action')) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if ('undefined' != typeof action) {
        // action applied already?
        if (toolbarActiveOnRexbutton) {
          this.action_active = action;
          this.clearListButtons();
          this.activateListButtons();
          var element = editorInstance.getSelectedParentElement();
          var $paragraphContainer = $(element).parents("p.rex-buttons-paragraph");
          switch (action) {
            case "justifyRight":
              $paragraphContainer.css("text-align", "right");
              break;
            case "justifyCenter":
              $paragraphContainer.css("text-align", "center");
              break;
            case "justifyLeft":
              $paragraphContainer.css("text-align", "left");
              break;
            default:
              break;
          }
          //updating toolbar and toolbox positions
          var toolbar = this.base.getExtensionByName('toolbar');
          var rexbuttonToolbox = this.base.getExtensionByName('rexbutton-input');

          if (toolbar) {
            toolbar.setToolbarPosition();
          }
          if (rexbuttonToolbox) {
            rexbuttonToolbox.placeRexbuttonToolbox();
          }
          event.preventDefault();
        } else {
          editorInstance.execAction(action);
        }
      }
    },
  });

  var CloseEditorEscapeExtension = MediumEditor.Extension.extend({
    name: 'close-editor-escape',

    init: function () {
      this.subscribe('editableKeydown', this.handleKeydown.bind(this));
    },

    handleKeydown: function (event, editable) {
      // If the user hits escape, toggle the data-allow-context-menu attribute
      if ( !MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ESCAPE)) return false;

      editable.removeAttribute('data-medium-focused');

      var $elem = $(editable).parents('.grid-stack-item');
      var $gallery = $elem.parents('.perfect-grid-gallery');
      var gallery = $gallery.data('plugin_perfectGridGalleryEditor');

      Rexbuilder_Util_Editor.focusedElement = $elem;
      Rexbuilder_Util_Editor.elementIsDragging = false;

      TextEditor.triggerMEEvent({
        "name": "blur",
        "data": event,
        editable: editable
      });
    }
  });

  /**
   * @deprecated
   */
  var DropDownExtension = MediumEditor.Extension.extend({
    name: "dropDownButtonList",
    action: "",

    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action-list");
      this.button.innerHTML = this.contentDefault;
      this.on(this.button, 'click', this.handleClick.bind(this));
    },

    getButton: function () {
      return this.button;
    },

    handleClick: function (event) {
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized

      var action = event.target.getAttribute('data-tag-action');
      if ('undefined' != typeof action) {
        editorInstance.execAction(action);
      }
    }
  });

  /**
   * Custom Text HTML extension
   * @deprecated
   */
  var TextHtmlExtension = MediumEditor.extensions.button.extend({
    name: "textHtml",
    action: "changeText",
    aria: "text to html",
    contentDefault: "<span class='editor-text-html'>Text Html<span>",

    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.innerHTML = "<i class='l-svg-icons'><svg><use xlink:href='#A008-Code'></use></svg></i>";

      // use our own handleClick instead of the default one
      this.on(this.button, "click", this.handleClick.bind(this));
    },

    handleClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var selection = editorInstance.exportSelection();

      var newSelection = jQuery.extend(true, {}, selection);
      newSelection.end = newSelection.start + 1;
      editorInstance.importSelection(newSelection, true);

      var $beginEl = $(editorInstance.getSelectedParentElement());
      if ($beginEl.hasClass("text-wrap")) {
        $beginEl = $beginEl.children().eq(0);
      }

      var $beginCopy = $(editorInstance.getSelectedParentElement());
      if ($beginCopy.hasClass("text-wrap")) {
        $beginCopy = $beginCopy.children().eq(0);
      }

      newSelection = jQuery.extend(true, {}, selection);
      newSelection.start = newSelection.end - 1;
      editorInstance.importSelection(newSelection, true);
      var $endEl = $(editorInstance.getSelectedParentElement());
      var nodes = [];
      var elementsNumber = $beginEl
        .parents(".text-wrap")
        .eq(0)
        .children().length;
      var i = 0;
      var flagStop = false;

      while ($beginCopy.get(0) !== $endEl.get(0) && i < elementsNumber) {
        if ($beginCopy.hasClass("medium-insert-buttons")) {
          flagStop = true;
          break;
        }
        nodes.push($beginCopy);
        $beginCopy = $beginCopy.next();
        i++;
      }
      nodes.push($beginCopy);

      var toolbar = editorInstance.getExtensionByName("toolbar");
      if (toolbar) {
        toolbar.hideToolbar();
      }

      var htmlSelected = "";
      for (i = 0; i < nodes.length; i++) {
        nodes[i].wrap("<div></div>");
        var $tempContainer = nodes[i].parent();
        var stringHtml = $tempContainer.html();
        if (typeof stringHtml === "undefined") {
          flagStop = true;
          break;
        }
        htmlSelected += stringHtml;
        nodes[i].unwrap();
      }

      if (flagStop) {
        return;
      }

      $beginEl.wrap("<textarea></textarea");

      var $textArea = $beginEl.parent();
      for (i = 0; i < nodes.length; i++) {
        nodes[i].remove();
      }
      $textArea.text(htmlSelected);
      $textArea.wrap('<div class="editing-html"></div>');

      var $container = $textArea.parent();
      var $closeButton = $(document.createElement("button"));
      $closeButton.addClass("rex-close-html-editor");
      $closeButton.text("applica");
      $container.prepend($closeButton[0]);
    }
  });

  /**
   * Custom Text HTML extension
   */
  var TextHtmlEditorExtension = MediumEditor.extensions.button.extend({
    name: "textEditorHtml",
    action: "changeText",
    aria: "text to html",
    contentDefault: "<span class='editor-text-html'>Text Html<span>",

    init: function () {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.innerHTML = "<i class='l-svg-icons'><svg><use xlink:href='#A008-Code'></use></svg></i>";

      // use our own handleClick instead of the default one
      this.on(this.button, "click", this.handleClick.bind(this));
      this.subscribe("rexlive:mediumEditor:saveHTMLContent", this.handleHtmlEditorSave.bind(this));
    },

    handleClick: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.traceEditor = this.base.getFocusedElement();
      this.base.selectAllContents();
      var index = this.base.exportSelection().editableElementIndex;

      var meContents = this.base.serialize();
      var htmlSelected = meContents['element-' + index].value;
      htmlSelected = htmlSelected.replace('<span class="text-editor-span-fix" style="display: none;"></span>', '').trim();

      var data = {
        eventName: "rexlive:openHTMLEditor",
        htmlContent: htmlSelected
      };

      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    },

    handleHtmlEditorSave: function(event) {
      var index = this.base.exportSelection().editableElementIndex;
      this.base.setContent(event.customHTML, index);
    }
  });

  var HideRowToolsOnEditing = MediumEditor.Extension.extend({
    name: 'hide-row-tools-on-editing',
    init: function () {
      this.subscribe("focus", this.handleFocus.bind(this));
      this.subscribe("blur", this.handleBlur.bind(this));
    },

    handleFocus: function(event, editable) {
      $(editable).parents('.grid-stack-item').addClass('item--me-focus');
      $(editable).parents('.rexpansive_section').addClass('block-editing');
    },

    handleBlur: function(event,editable) {
      $(editable).parents('.grid-stack-item').removeClass('item--me-focus');
      $(editable).parents('.rexpansive_section').removeClass('block-editing');
    }
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // Rexpansive buttons logics
  ///////////////////////////////////////////////////////////////////////////////////////////////

  var RexButtonExtension = MediumEditor.Extension.extend({
    name: 'rexbutton-input',
    init: function () {
      toolbarActiveOnRexbutton = false;

      this.keyCode = MediumEditor.util.keyCode;
      this.arrowKeys = [37, 38, 39, 40];

      this.traceBTN = null;
      this.traceEditor = null;

      // this.subscribe("editableInput", this.handleEventInput.bind(this));
      this.subscribe("editableKeydown", this.handleEventKeyDown.bind(this));
      this.subscribe("editableKeyup", this.handleEventKeyUp.bind(this));
      this.subscribe("keyup", this.handleEventKeyUp.bind(this));

      this.subscribe("positionToolbar", this.handlePositionToolbar.bind(this));
      this.subscribe("hideToolbar", this.handleHideToolbar.bind(this));

      this.rexbuttonToolsTop = document.createElement('div');
      this.rexbuttonToolsTop.contentEditable = false;
      this.rexbuttonToolsTop.classList.add("rexbutton-tools");
      this.rexbuttonToolsTop.style.display = "none";
      this.rexbuttonToolsTop.innerHTML = Rexbuilder_Live_Templates.getTemplate("tmpl-rexbutton-tools-top");
      document.body.appendChild( this.rexbuttonToolsTop );

      this.rexbuttonToolsBottom = document.createElement("div");
      this.rexbuttonToolsBottom.contentEditable = false;
      this.rexbuttonToolsBottom.classList.add("rexbutton-tools");
      this.rexbuttonToolsBottom.style.display = "none";
      this.rexbuttonToolsBottom.innerHTML = Rexbuilder_Live_Templates.getTemplate("tmpl-rexbutton-tools-bottom");
      document.body.appendChild( this.rexbuttonToolsBottom );

      this.deleteRexbuttonBtn = this.rexbuttonToolsTop.querySelector(".rex-delete-button");
      this.editRexbuttonBtn = this.rexbuttonToolsBottom.querySelector(".rex-edit-button");

      // Hiding anchor preview of text editor when mouse is over a rexbutton
      // Timeout is needed because anchor will stay under button for about 500-600 ms
      var showAnchorTimeout = null;
      var extensionIstance = this;
      Rexbuilder_Util.$rexContainer.on("mouseenter", ".rex-button-wrapper", function (e) {
        extensionIstance.hideAnchorPreview();
        if (showAnchorTimeout !== null) {
          clearTimeout(showAnchorTimeout);
          showAnchorTimeout = null;
        }
      });

      Rexbuilder_Util.$rexContainer.on("mouseleave", ".rex-button-wrapper", function (e) {
        showAnchorTimeout = setTimeout(extensionIstance.showAnchorPreview, 1000);
      });

      // View/Hide the Media Insert button
      this.subscribe("blur", this.handleBlur.bind(this));

      // Trace the cursor position
      this.subscribe("editableClick", this.traceInputRexButton.bind(this));

      // Link click listeners
      this.on(this.deleteRexbuttonBtn, "click", this.handleClickDeleteRexbutton.bind(this));
      this.on(this.editRexbuttonBtn, "click", this.handleClickEditRexbutton.bind(this));
    },


    showAnchorPreview: function (event) {
      var anchorLinkPreview = document.getElementsByClassName("medium-editor-anchor-preview");
      for (var i = 0; i < anchorLinkPreview.length; i++) {
        anchorLinkPreview[i].style.display = "block";
      }
		},

		hideAnchorPreview: function (event) {
      var anchorLinkPreview = document.getElementsByClassName("medium-editor-anchor-preview");
      for (var i = 0; i < anchorLinkPreview.length; i++) {
        anchorLinkPreview[i].style.display = "none";
      }
    },

    handlePositionToolbar: function (event) {
      var element = editorInstance.getSelectedParentElement();
      var toolbar = this.base.getExtensionByName('toolbar');
      var $toolbar = $(toolbar.toolbar);
      if (this.insideRexButton(element)) {
        $toolbar.addClass("medium-toolbar-hover-rexbutton");
        $toolbar.find("button.medium-editor-action:not(.hide-tool-rexbutton)").first().addClass("medium-editor-button-first");
        $toolbar.find("button.medium-editor-action:not(.hide-tool-rexbutton)").last().addClass("medium-editor-button-last");
        toolbarActiveOnRexbutton = true;
      } else {
        this.restoreButtonClasses($toolbar);
        toolbarActiveOnRexbutton = false;
      }
    },

    handleHideToolbar: function (event) {
      if (toolbarActiveOnRexbutton) {
        var toolbar = this.base.getExtensionByName('toolbar');
        var $toolbar = $(toolbar.toolbar);
        this.restoreButtonClasses($toolbar);
        toolbarActiveOnRexbutton = false;
      }
    },

    restoreButtonClasses: function ($toolbar) {
      $toolbar.removeClass("medium-toolbar-hover-rexbutton");
      $toolbar.find("button.medium-editor-action:not(.hide-tool-rexbutton)").first().removeClass("medium-editor-button-first");
      $toolbar.find("button.medium-editor-action:not(.hide-tool-rexbutton)").last().removeClass("medium-editor-button-last");

      $toolbar.find("button.medium-editor-action").first().addClass("medium-editor-button-first");
      $toolbar.find("button.medium-editor-action").last().addClass("medium-editor-button-last");
    },

    viewRexbuttonToolbox: function (event) {
      this.rexbuttonToolsTop.style.display = "block";
      this.rexbuttonToolsBottom.style.display = "block";
      this.placeRexbuttonToolbox();
    },

    hideRexbuttonToolbox: function (event) {
      this.rexbuttonToolsTop.style.display = "none";
      this.rexbuttonToolsBottom.style.display = "none";
    },

    traceInputRexButton: function (event) {
      if ("click" == event.type) {
        // check if cursor is inside rexbutton
        var nodeToFix = MediumEditor.selection.getSelectionStart(this.base.options.ownerDocument);
        if ($(event.target).hasClass("rex-button-text")) {
          this.traceBTN = $(event.target).parents(".rex-button-container")[0];
          this.viewRexbuttonToolbox();
        } else if ($(nodeToFix).parents(".rex-button-container").length != 0) {
          this.traceBTN = $(nodeToFix).parents(".rex-button-container")[0];
          this.viewRexbuttonToolbox();
        } else {
          this.handleBlur(event);
        }
      }
    },

    handleBlur: function (event) {
      if ($(event.target).parents(".rex-button-wrapper").length == 0 && $(event.target).parents(".rexbutton-tools").length == 0) {
        this.hideRexbuttonToolbox();
      }
    },

    /**
     * Place rexbutton tools on top of rexbutton
     */
    placeRexbuttonToolbox: function () {
      var targetCoords = this.traceBTN.getBoundingClientRect();
      this.rexbuttonToolsTop.style.width = targetCoords.width + "px";
      this.rexbuttonToolsTop.style.left = (targetCoords.left + ((targetCoords.width - this.rexbuttonToolsTop.offsetWidth) / 2)) + "px";
      this.rexbuttonToolsTop.style.top = (window.scrollY + targetCoords.top - this.rexbuttonToolsTop.offsetHeight) + "px";

      this.rexbuttonToolsBottom.style.width = targetCoords.width + "px";
      this.rexbuttonToolsBottom.style.left = (targetCoords.left + ((targetCoords.width - this.rexbuttonToolsBottom.offsetWidth) / 2)) + "px";
      // this.rexbuttonToolsBottom.style.top = (window.scrollY + targetCoords.top - this.rexbuttonToolsBottom.offsetHeight) + "px";
      this.rexbuttonToolsBottom.style.top = (window.scrollY + targetCoords.top + targetCoords.height) + "px";
    },

    handleClickDeleteRexbutton: function (e) {
      this.hideRexbuttonToolbox();
      var $buttonContainer = $(this.traceBTN).parents(".rex-button-wrapper");
      var $paragraphContainer = $buttonContainer.parents("p.rex-buttons-paragraph");
      $buttonContainer.remove();
      if ($paragraphContainer.find(".rex-button-wrapper").length == 0) {
        $paragraphContainer.remove();
      }
    },

    handleClickEditRexbutton: function (e) {
      this.hideRexbuttonToolbox();
      var $buttonWrapper = $(this.traceBTN).parents(".rex-button-wrapper");
      var data = {
        eventName: "rexlive:openRexButtonEditor",
        buttonData: Rexbuilder_Rexbutton.generateButtonData($buttonWrapper)
      };
      $buttonWrapper.parents(".text-wrap").blur();
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    },

    // handleEventInput: function (eventObj, target) {},

    handleEventKeyUp: function (event, target) {
      // Check if has to update height always on update height of text-wrap

      var nodeToFix = MediumEditor.selection.getSelectionStart(this.base.options.ownerDocument);
      var $node = $(nodeToFix);

      // If text is pasted need to update block height
      // if (MediumEditor.util.isKey(event, this.keyCode.V) && MediumEditor.util.isMetaCtrlKey(event)) {
      //   Rexbuilder_Util_Editor.updateBlockContainerHeight($(target));
      // }

      if (MediumEditor.util.isKey(event, this.keyCode.ENTER) && this.insideRexButton(nodeToFix)) {
        var mediumEditorOffsetRight = MediumEditor.selection.getCaretOffsets(nodeToFix).right;
        var mediumEditorOffsetLeft = MediumEditor.selection.getCaretOffsets(nodeToFix).left;

        if (mediumEditorOffsetRight === 0 && $node.parents(".rex-button-wrapper").eq(0).is(':last-child')) {
          var $newParagraph = $("<p><br></p>");
          $node.parents(".rex-buttons-paragraph").after($newParagraph);
          this.customMoveCursor($newParagraph[0], 0);
          //Rexbuilder_Util_Editor.updateBlockContainerHeight($(target));
        } else {
          if (mediumEditorOffsetLeft === 0 && $node.parents(".rex-button-wrapper").eq(0).is(':first-child')) {
            var $newParagraph = $("<p><br></p>");
            $node.parents(".rex-buttons-paragraph").before($newParagraph);
            this.customMoveCursor($newParagraph[0], 0);
            //Rexbuilder_Util_Editor.updateBlockContainerHeight($(target));
          }
        }
        event.preventDefault();
      }
    },

    handleEventKeyDown: function (event, target) {
      var nodeToFix = MediumEditor.selection.getSelectionStart(this.base.options.ownerDocument);
      var mediumEditorOffsetLeft = null;
      var mediumEditorOffsetRight

      if ( nodeToFix ) {
        mediumEditorOffsetLeft = MediumEditor.selection.getCaretOffsets(nodeToFix).left;
        mediumEditorOffsetRight = MediumEditor.selection.getCaretOffsets(nodeToFix).right;
      }

      if (MediumEditor.util.isKey(event, this.keyCode.BACKSPACE) &&
        (window.getSelection().focusOffset == 0 || window.getSelection().focusOffset == 1)) {
        if (//cursor is at the beginning of the element
          mediumEditorOffsetLeft === 0) {
          var isEmpty = /^(\s+|<br\/?>)?$/i;
          if (this.isElementBefore(nodeToFix, "rex-buttons-paragraph")) {
            if (!isEmpty.test(nodeToFix.innerHTML)) {
              event.preventDefault();
            }
          } else {
            if (this.insideRexButton(nodeToFix)){
              var $node = $(nodeToFix);
              if ($node.parents(".rex-button-wrapper").eq(0).is(':first-child')) {
                var $buttonsParagraph = $node.parents(".rex-buttons-paragraph").eq(0);
                var $prevBrother = $buttonsParagraph.prev();
                if (!isEmpty.test($prevBrother[0].innerHTML)) {
                  event.preventDefault();
                  return;
                }
              } else {
                event.preventDefault();
                return;
              }
            }
          }
        } else {
          //check inside an element (assumes offeset different from 0)
          if (this.isNodeBefore(nodeToFix, mediumEditorOffsetLeft, "rex-button-wrapper")) {
            event.preventDefault();
          }
        }
      }

      if (MediumEditor.util.isKey(event, this.keyCode.ENTER)) {
        if (this.insideRexButton(nodeToFix)) {
          event.preventDefault();
          return;
        }
      }

      if (MediumEditor.util.isKey(event, this.keyCode.DELETE)) {
        if (mediumEditorOffsetRight === 0) {
          var isEmpty = /^(\s+|<br\/?>)?$/i;
          if (this.insideRexButton(nodeToFix)) {
            var $node = $(nodeToFix);
            if ($node.parents(".rex-button-wrapper").eq(0).is(':last-child')) {
              var $buttonsParagraph = $node.parents(".rex-buttons-paragraph").eq(0);
              var $nextBrother = $buttonsParagraph.next();
              if (!isEmpty.test($nextBrother[0].innerHTML)) {
                event.preventDefault();
                return;
              }
            } else{
              event.preventDefault();
              return;
            }
          }
          if (!isEmpty.test(nodeToFix.innerHTML) && this.isElementAfter(nodeToFix, "rex-buttons-paragraph")) {
            event.preventDefault();
          }
        }
      }

      //if cursor is inside rexbutton paragraph and key is not an arrow we are preventin all actions
      if (this.isInsideRexbuttonParagraph(nodeToFix) && !this.insideRexButton(nodeToFix)) {
        if(! MediumEditor.util.isKey(event, this.arrowKeys)){
          event.preventDefault();
        }
      }
    },

    replaceClasses: function ($wrapper, previousClass, newClass) {
      $wrapper.find("." + previousClass).removeClass(previousClass).addClass(newClass);
    },

    /**
     *
     * @param {Object} el element to move caret
     * @param {integer} offset caret position
     */
    customMoveCursor: function (el, offset) {
      offset = "undefined" !== typeof offset ? offset : 0;
      var range = document.createRange();
      var sel = window.getSelection();
      range.setStart(el, offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    },

    /**
     * Checks if there is rexbutton after or before cursor
     * @param {*} node
     */
    isSafeInsert: function (node) {
      var $node = $(node);
      var mediumEditorOffset = MediumEditor.selection.getCaretOffsets(node).left;
      var safe = true;
      if ($node.hasClass("rex-button-text")) {
        //siamo dentro un rexbutton
        safe = false;
      } else if ($node.prev().hasClass("rex-button-wrapper") && !$node.parent().hasClass("medium-editor-element")) {
        //prima c'è un rexbutton e non siamo nel contenitore dell'editor
        safe = false;
      } else if (this.isNodeBefore(node, mediumEditorOffset, "rex-button-wrapper")) {
        //il nodo prima è un rexbutton
        safe = false;
      }
      return safe;
    },

    //check inside an element if node before caret has given class
    isNodeBefore: function (node, offset, class_name) {
      // if caret is at beginning of node
      var pos = 0;
      var nodes = node.childNodes;
      var nCharacters;
      //get in which node is
      while (true) {
        nCharacters = parseInt(nodes[pos].length);
        if (isNaN(nCharacters)) {
          nCharacters = $(nodes[pos]).text().length;
        }
        if (nCharacters > offset) {
          break;
        }
        offset -= nCharacters;
        pos = pos + 1;
        if (pos == nodes.length) {
          break;
        }
      }
      if (pos > 0) {
        var nodeLength = parseInt(nodes[pos - 1].length);
        // if is not text node
        if (isNaN(nodeLength)) {
          // if is rex button
          if ($(nodes[pos - 1]).hasClass(class_name)) {
            return true;
          }
        }
      }
      return false;
    },

    isElementBefore: function (node, class_name) {
      var $node = $(node);
      if ($node.prev().hasClass(class_name)) {
        return true;
      }
      while (!$node.is("body") && !$node.parent().hasClass("medium-editor-element")) {
        $node = $node.parent();
      };
      return $node.prev().hasClass(class_name);
    },

    isElementAfter: function (node, class_name) {
      var $node = $(node);
      if ($node.next().hasClass(class_name)) {
        return true;
      }
      while (!$node.is("body") && !$node.parent().hasClass("medium-editor-element")) {
        $node = $node.parent();
      };
      return $node.next().hasClass(class_name);
    },

    isInsideRexbuttonParagraph: function (node) {
      var $node = $(node);
      // if is a rexbutton paragraph
      if ($node.hasClass("rex-buttons-paragraph")) {
        return true;
      }
      // if node is inside a rexbutton paragraph
      if ($node.parents(".rex-buttons-paragraph").length != 0) {
        return true;
      }
      return false;
    },
    /**
     * Checks if node is inside or a rexbutton
     * @param {Object} node Node to check
     */
    insideRexButton: function (node) {
      var $node = $(node);
      // if is a rexbutton
      if ($node.hasClass("rex-button-wrapper")) {
        return true;
      }
      // if node is inside a rexbutton
      if ($node.parents(".rex-button-wrapper").length != 0) {
        return true;
      }
      return false;
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Custom MediumEditor extension to handle Wordpress Media Library insert
   * and embed iframes
   *
   * Insert Media from Library, 4 dev methods
   * 1) Insert HTML command form Medium Editor
   * 2) Paste HTML from Medium Editor
   * 3) Save/Restore selection from Rangy (cons: creates a lot of spans to memorize selection ranges)
   * 4) TextRange from Rangy
   *
   * Insert Embed from input text
   * @since 2.0.0
   */
  var InsertMediaExtension = MediumEditor.Extension.extend({
    name: 'insert-media',

    init: function () {
      this.insertionPoint = null;
      this.traceImg = null;
      this.traceVideo = null;
      this.traceSVG = null;
      this.traceSelection = null;
      this.traceEditor = null;
      this.method = 4;
      this.submethod = 3;
      this.toolbarWrapClass = 'me-insert-media-button';

      // Create a mirror image to handling the resize of an inline image
      this.mirrorResize = document.createElement('img');
      this.mirrorResize.classList.add("me-resize-mirror");
      document.body.appendChild(this.mirrorResize);
      // $(document.getElementsByTagName("body")[0]).append(this.mirrorResize);

      // Create a mirror span to handling the resize of an inline embed
      this.mirrorVideoResize = document.createElement('span');
      this.mirrorVideoResize.classList.add("me-resize-mirror");
      document.body.appendChild(this.mirrorVideoResize);
      // $(document.getElementsByTagName("body")[0]).append(this.mirrorVideoResize);

      // Create a mirror span to handling the resize of an inline svg
      this.mirrorSVGResize = document.createElement('span');
      this.mirrorSVGResize.classList.add("me-resize-mirror");
      document.body.appendChild(this.mirrorSVGResize);
      // $(document.getElementsByTagName("body")[0]).append(this.mirrorSVGResize);

      this.resizeSizes = document.createElement('span');
      this.resizeSizes.classList.add("me-resize-sizes");

      // Create the image inline edit toolbar
      this.imageEditToolbar = document.createElement("div");
      this.imageEditToolbar.id = "me-edit-inline-image-toolbar";
      this.imageEditToolbar.classList.add("medium-editor-toolbar");
      this.imageEditToolbar.classList.add("medium-toolbar-arrow-under");
      // this.imageEditToolbar.innerHTML = tmpl("tmpl-me-image-edit", {});
      this.imageEditToolbar.innerHTML = Rexbuilder_Live_Templates.getTemplate("tmpl-me-image-edit");
      document.body.appendChild(this.imageEditToolbar);
      // $(document.getElementsByTagName("body")[0]).append(this.imageEditToolbar);

      this.inlineSVGEditToolbar = document.createElement("div");
      this.inlineSVGEditToolbar.id = "me-edit-inline-svg-toolbar";
      this.inlineSVGEditToolbar.classList.add("medium-editor-toolbar");
      this.inlineSVGEditToolbar.classList.add("medium-toolbar-arrow-under");
      // this.inlineSVGEditToolbar.innerHTML = tmpl("tmpl-me-inline-svg-edit",{});
      this.inlineSVGEditToolbar.innerHTML = Rexbuilder_Live_Templates.getTemplate("tmpl-me-inline-svg-edit");
      document.body.appendChild(this.inlineSVGEditToolbar);
      // $(document.getElementsByTagName("body")[0]).append(this.inlineSVGEditToolbar);

      initPicker( this.inlineSVGEditToolbar.querySelector('.me-svg-color'), this.applySVGColor );

      // Creation of the Inline Video Management Toolbar
      this.videoEditToolbar = document.createElement("div");
      this.videoEditToolbar.id = "me-edit-inline-image-toolbar";
      this.videoEditToolbar.classList.add("medium-editor-toolbar");
      this.videoEditToolbar.classList.add("medium-toolbar-arrow-under");
      // this.videoEditToolbar.innerHTML = tmpl("tmpl-me-image-edit",{});
      this.videoEditToolbar.innerHTML = Rexbuilder_Live_Templates.getTemplate("tmpl-me-image-edit");
      document.body.appendChild(this.videoEditToolbar);

      // Create insert media button, that stays at bottom-right of a text content
      // Append it to the body, to reuse it instead of multiple create id
      this.mediaBtn = document.createElement("div");
      this.mediaBtn.contentEditable = false;
      this.mediaBtn.classList.add( this.toolbarWrapClass );
      this.mediaBtn.style.display = "none";
      // this.mediaBtn.innerHTML = tmpl("tmpl-me-insert-media-button", {});
      this.mediaBtn.innerHTML = Rexbuilder_Live_Templates.getTemplate("tmpl-me-insert-media-button");
      document.body.appendChild(this.mediaBtn);
      // $(document.getElementsByTagName("body")[0]).append(this.mediaBtn);
      //$(document.getElementsByTagName("body")[0]).append(this.mediaBtn);

      this.mediaLibraryBtn = this.mediaBtn.querySelector(".me-insert-image");
      this.mediaEmbedBtn = this.mediaBtn.querySelector(".me-insert-embed");
      this.mediaEmbedInput = this.mediaBtn.querySelector(".me-insert-embed__value");
      this.inlineSVGBtn = this.mediaBtn.querySelector('.me-insert-inline-svg');

      // View/Hide the Media Insert button
      this.subscribe("blur", this.handleBlur.bind(this));
      this.subscribe("focus", this.handleFocus.bind(this));

      // Trace the cursor position
      this.subscribe("editableClick", this.traceInput.bind(this));
      this.subscribe("editableKeydown", this.traceInput.bind(this));

      // Insert the IMG html tag
      this.subscribe("rexlive:mediumEditor:inlineImageEdit", this.handleImageInsertReplace.bind(this));

      // Insert the VIDEO html tag -A
      this.subscribe("rexlive:mediumEditor:inlineVideoEditor:Transfer", this.getEmbedCode.bind(this));

      // insert the SVG html tag
      this.subscribe("rexlive:mediumEditor:inlineSVG:transfer", this.handleInlineSVGInsertReplace.bind(this));

      // Function that verifies the deletion of images and inline videos. -A
      this.subscribe("editableKeydown", this.handleRemoveInlineElement.bind(this));

      // Add image and video with Wordpress Media Library
      this.on(this.mediaLibraryBtn, "click", this.handleClickImage.bind(this));
      this.on(this.imageEditToolbar, "click", this.handleImageEdit.bind(this));

      //this.on(this.videoEditToolbar, "click", this.handleVideoEdit.bind(this));
      this.on(this.mediaEmbedBtn, "click", this.handleClickEmbed.bind(this));
      if ("undefined" !== typeof this.mediaEmbedInput) {
        this.on(this.mediaEmbedInput, "keydown", this.getEmbedCode.bind(this));
        this.on(this.mediaEmbedInput, "blur", this.mediaEmbedInputBlur.bind(this));
      }

      // Add inline icon
      this.on(this.inlineSVGBtn, 'click', this.handleClickInlineSVG.bind(this));
      this.on(this.inlineSVGEditToolbar, 'click', this.handleInlineSVGEdit.bind(this));
    },

    /**
     * @param {EVENT} event
     */
    handleBlur: function(event) {
      if( $(event.target).parents("#me-edit-inline-image-toolbar").length == 0 && $(event.target).parents("#me-edit-inline-svg-toolbar").length == 0 && !$(event.target).is(".me-insert-embed__value") && 0 == $(event.target).parents(".me-insert-embed").length ) {
        this.mediaBtn.style.display = "none";
        this.mediaBtn.classList.remove("embed-value-visibile");

        this.hideAllToolbars();
      }
    },

    handleFocus: function (event, editable) {
      // editor.append(this.mediaBtn);
      this.mediaBtn.style.display = "block";
      if (4 == this.method) {
        // Method 4)
        this.traceEditor = this.base.getFocusedElement();
        // This function draws the cursor once it has interacted with the editor. -A
        // var editor = this.base.getFocusedElement();
        this.traceSelection = rangy.getSelection().saveCharacterRanges(this.traceEditor);
      }
      this.placeMediaBtn();
    },

    /**
     * Place the media button on the bottom of the TextEditor
     * @deprecated
     */
    placeMediaBtnBottomTextEditor: function () {
      var editor = this.base.getFocusedElement();
      var targetCoords = editor.getBoundingClientRect();
      this.mediaBtn.style.left = (targetCoords.left + ((targetCoords.width - this.mediaBtn.offsetWidth) / 2)) + "px";
      this.mediaBtn.style.top = (window.scrollY + targetCoords.top + targetCoords.height - this.mediaBtn.offsetHeight) + "px";
    },

    /**
     * Place the media button on top of the block
     */
    placeMediaBtnTopCenterTextEditor: function () {
      var editor = this.base.getFocusedElement();
      var $content_wrap = $(editor).parents(".grid-item-content-wrap");
      var targetCoords = $content_wrap[0].getBoundingClientRect();
      this.mediaBtn.style.left = (targetCoords.left + ((targetCoords.width - this.mediaBtn.offsetWidth) / 2)) + "px";
      this.mediaBtn.style.top = (window.scrollY + targetCoords.top + 15) + "px";
    },

    /**
     * Place the media button on top of the block
     */
    placeMediaBtn: function ($wrapper) {
			var editor = this.base.getFocusedElement();

			if(!editor) return;

      var $content_wrap = typeof $wrapper == "undefined" ? $(editor).parents(".grid-item-content-wrap") : $wrapper;
      var targetCoords = $content_wrap[0].getBoundingClientRect();
      this.mediaBtn.style.left = (window.scrollX + targetCoords.left + targetCoords.width - this.mediaBtn.offsetWidth - 15) + "px";
      this.mediaBtn.style.top = (window.scrollY + targetCoords.top + targetCoords.height - this.mediaBtn.offsetHeight - 15) + "px";
    },

    traceInput: function (event) {
      // If the event happens on the text editor, save the selection
      if (0 === $(event.target).parents('.me-insert-media-button').length) {
        if ( !MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ESCAPE) ) {
          switch (this.method) {
            case 1:
            case 2:
              // Method 1) and 2)
              this.base.saveSelection();
              break;
            case 3:
              // Method 3)
              if (this.traceSelection) {
                rangy.removeMarkers(this.traceSelection);
              }
              this.traceSelection = rangy.saveSelection();
              break;
            case 4:
              // Method 4)
							var editor = this.base.getFocusedElement();
              this.traceSelection = rangy.getSelection().saveCharacterRanges(editor);
              break;
            default:
              break;
          }
        }
      }

      // RESIZING TOOLS - LAUNCH/INITIALIT
      if( "click" == event.type ) {
        // Check if the clicked object is an <img>.
        if( "IMG" == event.target.nodeName ) {
          // if a mirror already exists but doesn't have handles, destroy it
          if($(this.mirrorResize).find(".ui-resizable-handle").length != 0) {
            $(this.mirrorResize).resizable("destroy");
          }
          this.viewEditImgToolbar(event.target);
          this.imageResizableEnable();

          this.hideEditVideoToolbar();
          this.hideEditInlineSVGToolbar();
        } else if( "SPAN" == event.target.nodeName && "overlay-status-for-video-inline" == event.target.className) { // Check if the clicked object is an <span> with the class "overlay-status-set-active". -A
          // if a mirror already exists but doesn't have handles, destroy it
          if($(this.mirrorVideoResize).find(".ui-resizable-handle").length != 0) {
            $(this.mirrorVideoResize).resizable("destroy");
          }
          this.viewEditVideoToolbar(event.target);
          this.videoResizableEnable();

          this.hideEditImgToolbar();
          this.hideEditInlineSVGToolbar();
        } else if( ( 'USE' == event.target.nodeName.toUpperCase() && '' !== event.target.getAttribute('xlink:href') ) || ( 'SVG' === event.target.nodeName.toUpperCase() && 'I' === event.target.parentNode.nodeName.toUpperCase() ) ) {
          var target;
          if ( 'SVG' === event.target.nodeName.toUpperCase() )
          {
            target = event.target.children[0];
          }
          else
          {
            target = event.target;
          }

          // if a mirror already exists but doesn't have handles, destroy it
          if($(this.mirrorSVGResize).find(".ui-resizable-handle").length != 0) {
            $(this.mirrorSVGResize).resizable("destroy");
          }

          // If the SVG clicked is the form button for adding new content
          if ($(target).parents('.wpcf7-form:not(.no-builder-form)').length !== 0) {
						this.hideAllToolbars();
					} else {
						this.viewEditInlineSVGToolbar(target);
						this.inlineSVGResizableEnable();
					}

          this.hideEditVideoToolbar();
          this.hideEditImgToolbar();
        } else { // If no positive results is received.
          this.hideAllToolbars();
        }
      }
    },

    handleClickImage: function (event) {
      var data = {
        eventName: "rexlive:openMEImageUploader",
        img_data: {}
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    },

    handleImageInsertReplace: function (event) {
      var imgHTML = '<img class="wp-image-' + event.imgData.idImage + ' ' + event.imgData.align + '" data-image-id="' + event.imgData.idImage + '" src="' + event.imgData.urlImage + '" alt="" width="' + event.imgData.width + '" height="' + event.imgData.height + '">';

      // handling image with external link inside
      if( '' !== event.displayData.linkUrl )
      {
        imgHTML = '<a href="' + event.displayData.linkUrl + '">' + imgHTML + '</a>';
      }

      // restore the selection
      switch( this.method ) {
        case 1:
        case 2:
          // Method 1) and 2)
          this.base.restoreSelection();
          break;
        case 3:
          // Method 3)
          if (this.traceSelection) {
            rangy.restoreSelection(this.traceSelection);
            var range = this.getFirstRange();
          }
          break;
        case 4:
          // Method 4)
          if (this.traceSelection) {
            rangy.getSelection().restoreCharacterRanges(this.traceEditor, this.traceSelection);
            var range = this.getFirstRange();
            range.refresh();
          }
          break;
        default:
          break;
      }

      // If the user wants to replace the acutal inline image
      if (this.traceImg) {
        switch (this.method) {
          case 1:
          case 2:
          case 3:
            this.base.selectElement(this.traceImg);
            break;
          case 4:
            // Change the range selection
            // And the insert method
            var restoreRange = rangy.createRange();
            // select the wrapping link if present
            if ( event.displayData.previousLink )
            {
              restoreRange.selectNode(this.traceImg.parentElement);
            }
            else
            {
              restoreRange.selectNode(this.traceImg);
            }
            range = restoreRange;
            this.submethod = 1;
            break;
          default:
            break;
        }
        rangy.dom.removeNode(this.traceImg);
      }

      switch (this.method) {
        case 1:
          // 1) Method insertHTMLCommand
          MediumEditor.util.insertHTMLCommand(document, imgHTML);
          break;
        case 2:
          // 2) Method pasteHTML
          this.base.pasteHTML(imgHTML, {
            cleanPastedHTML: false,
            cleanAttrs: ['dir']
          });
          break;
        case 3:
          // 3) Method save/restore selection with rangy
          if (range) {
            var imgNode = Rexbuilder_Dom_Util.htmlToElement(imgHTML);
            range.insertNode(imgNode);
          }
          break;
        case 4:
          // 4) Method text-range with rangy
          if (range) {
            switch (this.submethod) {
              case 1:
                // Insert HTML method
                range.pasteHtml(imgHTML);
                break;
              case 2:
                // Insert Node method
                var imgNode = Rexbuilder_Dom_Util.htmlToElement(imgHTML);
                break;
              case 3:
                // Insert Node Cool Method
                var imgNode = Rexbuilder_Dom_Util.htmlToElement(imgHTML);
                range.insertNode(imgNode);
                if (imgNode.parentElement === this.traceEditor) {
                  var prevEl = imgNode.previousElementSibling;
                  var nextEl = imgNode.nextElementSibling;
                  var wrapTagName = "";

                  if (nextEl) {
                    wrapTagName = nextEl.tagName.toLowerCase();
                  } else if (prevEl) {
                    wrapTagName = prevEl.tagName.toLowerCase();
                  }

                  if (this.emptyLine(nextEl)) {
                    rangy.dom.removeNode(nextEl);
                  }

                  if (this.emptyLine(prevEl)) {
                    rangy.dom.removeNode(prevEl);
                  }

                  if ("div" === wrapTagName || "span" === wrapTagName || "" === wrapTagName) {
                    wrapTagName = "p";
                  }

                  this.wrap( imgNode, document.createElement(wrapTagName) );
                }
              default:
                break;
            }
          }
          break;
        default:
          break;
      }

      this.hideAllToolbars();

      this.mediaBtn.style.display = "none";
    },

    getFirstRange: function () {
      var sel = rangy.getSelection();
      return sel.rangeCount ? sel.getRangeAt(0) : null;
    },

    wrap: function (el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    },

    /**
     * Check if a node is an empty line, usually a header or a p with a br or &nbsp
     * @param {HTML node} node node to check
     * @since 2.0.0
     */
    emptyLine: function (node) {
      if (node &&
        1 === node.childNodes.length &&
        ((1 === node.childNodes[0].nodeType && "br" === node.childNodes[0].tagName.toLowerCase()) ||
          (3 === node.childNodes[0].nodeType && 0 === node.childNodes[0].textContent.trim().length))
      ) {
        return true;
      }
      return false;
    },

    handleImageEdit: function (event) {
      var $el = $(event.target);
      if (!$el.hasClass("medium-editor-action")) {
        $el = $el.parents(".medium-editor-action");
      }

      if ($el.hasClass("me-image-align-left")) {
        this.traceImg.classList.remove("alignleft");
        this.traceImg.classList.remove("aligncenter");
        this.traceImg.classList.remove("alignright");
        this.traceImg.classList.remove("alignnone");

        this.traceImg.classList.add("alignleft");

        if (this.mirrorResize.classList.contains("ui-resizable") && this.mirrorResize.parentElement.classList.contains("ui-wrapper")) {
          this.placeMirrorImg(this.mirrorResize.parentElement);
        } else {
          this.placeMirrorImg(this.mirrorResize);
        }
        this.viewEditImgToolbar(this.traceImg);
      }

      if ($el.hasClass("me-image-align-center")) {
        this.traceImg.classList.remove("alignleft");
        this.traceImg.classList.remove("aligncenter");
        this.traceImg.classList.remove("alignright");
        this.traceImg.classList.remove("alignnone");

        this.traceImg.classList.add("aligncenter");

        if (this.mirrorResize.classList.contains("ui-resizable") && this.mirrorResize.parentElement.classList.contains("ui-wrapper")) {
          this.placeMirrorImg(this.mirrorResize.parentElement);
        } else {
          this.placeMirrorImg(this.mirrorResize);
        }
        this.viewEditImgToolbar(this.traceImg);
      }

      if ($el.hasClass("me-image-align-right")) {
        this.traceImg.classList.remove("alignleft");
        this.traceImg.classList.remove("aligncenter");
        this.traceImg.classList.remove("alignright");
        this.traceImg.classList.remove("alignnone");

        this.traceImg.classList.add("alignright");

        if (this.mirrorResize.classList.contains("ui-resizable") && this.mirrorResize.parentElement.classList.contains("ui-wrapper")) {
          this.placeMirrorImg(this.mirrorResize.parentElement);
        } else {
          this.placeMirrorImg(this.mirrorResize);
        }
        this.viewEditImgToolbar(this.traceImg);
      }

      if ($el.hasClass("me-image-align-none")) {
        this.traceImg.classList.remove("alignleft");
        this.traceImg.classList.remove("aligncenter");
        this.traceImg.classList.remove("alignright");
        this.traceImg.classList.remove("alignnone");

        this.traceImg.classList.add("alignnone");
        if (this.mirrorResize.classList.contains("ui-resizable") && this.mirrorResize.parentElement.classList.contains("ui-wrapper")) {
          this.placeMirrorImg(this.mirrorResize.parentElement);
        } else {
          this.placeMirrorImg(this.mirrorResize);
        }

        this.viewEditImgToolbar(this.traceImg);
      }

      if ($el.hasClass("me-image-inline-photoswipe")) {
        if("undefined" === typeof this.traceImg.getAttribute("inline-photoswipe")) {
          this.traceImg.setAttribute("inline-photoswipe", true);
        } else {
          this.traceImg.setAttribute("inline-photoswipe",
            this.traceImg.getAttribute("inline-photoswipe") == "true" ? false : true
          );
        }

        this.viewEditImgToolbar(this.traceImg);
      }

      if ($el.hasClass("me-image-replace")) {
        var align = "";
        if (this.traceImg.classList.contains("alignleft")) {
          align = "alignleft";
        }
        if (this.traceImg.classList.contains("aligncenter")) {
          align = "aligncenter";
        }
        if (this.traceImg.classList.contains("alignright")) {
          align = "alignright";
        }
        if (this.traceImg.classList.contains("alignnone")) {
          align = "alignnone";
        }

        var imgInsideLink = false;
        if ( 'A' === this.traceImg.parentElement.tagName )
        {
          imgInsideLink = true;
        }

        var data = {
          eventName: "rexlive:openMEImageUploader",
          img_data: {
            image_id: this.traceImg.getAttribute("data-image-id"),
            width: this.traceImg.width,
            height: this.traceImg.height,
            align: align,
            imgInsideLink: imgInsideLink
          }
        };

        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }

      if ($el.hasClass("me-image-delete")) {
        $(this.traceImg).remove();
        this.hideEditImgToolbar();
      }
    },

    setActiveButtonsImgEditToolbar: function(imageTarget) {
      var $el = $(this.imageEditToolbar).find("button");

      $el.each(function(){
        if($(this).hasClass("me-image-align-left")) {
          if ($(imageTarget).hasClass("alignleft")) {
            this.classList.add("medium-editor-button-active");
          } else {
            this.classList.remove("medium-editor-button-active");
          }
        }

        if($(this).hasClass("me-image-align-center")) {
          if ($(imageTarget).hasClass("aligncenter")) {
            this.classList.add("medium-editor-button-active");
          } else {
            this.classList.remove("medium-editor-button-active");
          }
        }

        if($(this).hasClass("me-image-align-right")) {

          if ($(imageTarget).hasClass("alignright")) {
            this.classList.add("medium-editor-button-active");
          } else {
            this.classList.remove("medium-editor-button-active");
          }
        }

        if($(this).hasClass("me-image-align-none")) {
          if ($(imageTarget).hasClass("alignnone")) {
            this.classList.add("medium-editor-button-active");
          } else {
            this.classList.remove("medium-editor-button-active");
          }
        }

        if($(this).hasClass("me-image-inline-photoswipe")) {
          if("undefined" !== typeof imageTarget.getAttribute("inline-photoswipe") && imageTarget.getAttribute("inline-photoswipe") == "true") {
            this.classList.add("medium-editor-button-active");
          } else {
            this.classList.remove("medium-editor-button-active");
          }
        }
      })

    },

    /**
     * Apply a fill color to the traced inline SVG
     * @param {string} color string color to apply
     */
    applySVGColor: function( color )
    {
      // at this point, this is the media button, I must use the global instance of the media extension
      // to correctly get the traced SVG
      $(insertMediaExtensionInstance.traceSVG).parent('svg').css('fill',color);
    },

    handleInlineSVGEdit: function(event)
    {
			var $el = $(event.target);

      if( !$el.hasClass("medium-editor-action") ) {
        $el = $el.parents(".medium-editor-action");
      }

      if( $el.hasClass("me-svg-replace") ) {
        var svg_ID = this.traceSVG.getAttribute('xlink:href').replace('#','');
        var data = {
          eventName: "rexlive:inlineSVG",
          inlineSVGData: {
            id: svg_ID,
          }
        };
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      }

      if ( $el.hasClass("me-svg-inline") ) {
        $(this.traceSVG).parents('i').toggleClass('inline-icon');
        $(this.inlineSVGEditToolbar.querySelector('.me-svg-inline')).toggleClass('medium-editor-button-active');
      };

      if( $el.hasClass("me-svg-delete") ) {
        $(this.traceSVG).parents('i').remove();
        this.hideEditInlineSVGToolbar();
      }
    },

    viewEditImgToolbar: function(target) {
      this.traceImg = target;
      // var editor = this.base.getFocusedElement();
      // editor.append(this.imageEditToolbar);
      this.setActiveButtonsImgEditToolbar(this.traceImg);
      this.placeEditImgToolbar();
      this.imageEditToolbar.classList.add("medium-editor-toolbar-active");
    },

    viewEditVideoToolbar: function(target) {
      this.traceVideo = target;
      //this.traceVideo = target.parentElement;
      // These strings change the display status of the Inline Video Management Toolbar. -A
      //this.placeEditVideoToolbar();
      //this.videoEditToolbar.classList.add("medium-editor-toolbar-active");
    },

    viewEditInlineSVGToolbar: function( target )
    {
			this.traceSVG = target;

      this.placeEditInlineSVGToolbar();
      this.checkToolbarTools();
      this.inlineSVGEditToolbar.classList.add("medium-editor-toolbar-active");
    },

    checkToolbarTools: function() {
      var isInline = $(this.traceSVG).parents('i').hasClass('inline-icon');
      var inlineTool = this.inlineSVGEditToolbar.querySelector('.me-svg-inline');
      if ( isInline ) {
        inlineTool.classList.add('medium-editor-button-active');
      } else {
        inlineTool.classList.remove('medium-editor-button-active');
      }
    },

    imageResizableEnable: function() {
      var that = this;
      var imageCoords = this.traceImg.getBoundingClientRect();

      this.mirrorResize.style.width = imageCoords.width + "px";
      this.mirrorResize.style.height = imageCoords.height + "px";
      this.mirrorResize.style.top = imageCoords.top + window.scrollY + "px";
      this.mirrorResize.style.left = imageCoords.left + window.scrollX + "px";
      this.mirrorResize.style.display = "block";

      var $mirrorResize = $(this.mirrorResize);
      var $resizable = $(this.traceImg);

      $mirrorResize.resizable({
        aspectRatio: true,
        handles: "e, s, se",
        alsoResize: $resizable,
        create: function( event, ui ) {
          var $wrapper = $(event.target);
          $wrapper.addClass("me-ui-custom-wrapper");
          $wrapper.append(that.resizeSizes);

          $wrapper.find(".ui-resizable-e").append('<span class="img-resize-handle img-resize-handle-e" data-axis="e"></span>');
          $wrapper.find(".ui-resizable-se").append('<span class="img-resize-handle img-resize-handle-se" data-axis="se"></span>');
          $wrapper.find(".ui-resizable-s").append('<span class="img-resize-handle img-resize-handle-s" data-axis="s"></span>');
          // $wrapper.find(".ui-resizable-w").append('<span class="img-resize-handle img-resize-handle-w" data-axis="w"></span>');
          // $wrapper.find(".ui-resizable-sw").append('<span class="img-resize-handle img-resize-handle-sw" data-axis="sw"></span>');
        },
        start: function (event, ui) {
          that.resizeSizes.style.display = "block";
        },
        resize: function (event, ui) {
          that.placeMirrorImg(event.target);
          that.placeEditImgToolbar();
          that.resizeSizes.textContent = ui.size.width + ' x ' + ui.size.height;
        },
        stop: function (event, ui) {
          that.resizeSizes.style.display = "none";
        },
      });
    },

    inlineSVGResizableEnable: function()
    {
      var that = this;
      var inlineSVGCoords = this.traceSVG.getBoundingClientRect();

      this.mirrorSVGResize.style.width = inlineSVGCoords.width + "px";
      this.mirrorSVGResize.style.height = inlineSVGCoords.height + "px";
      this.mirrorSVGResize.style.top = inlineSVGCoords.top + window.scrollY + "px";
      this.mirrorSVGResize.style.left = inlineSVGCoords.left + window.scrollX + "px";
      this.mirrorSVGResize.style.display = "block";

      var $mirrorSVGResize = $(this.mirrorSVGResize);
      var $resizable = $(this.traceSVG).parents('i');

      $mirrorSVGResize.resizable({
        aspectRatio: true,
        handles: "e, s, se",
        // alsoResize: $resizable,
        create: function( event, ui ) {
          var $wrapper = $(event.target);
          $wrapper.addClass("me-ui-custom-wrapper");
          $wrapper.append(that.resizeSizes);

          $wrapper.find(".ui-resizable-e").append('<span class="img-resize-handle img-resize-handle-e" data-axis="e"></span>');
          $wrapper.find(".ui-resizable-se").append('<span class="img-resize-handle img-resize-handle-se" data-axis="se"></span>');
          $wrapper.find(".ui-resizable-s").append('<span class="img-resize-handle img-resize-handle-s" data-axis="s"></span>');
          // $wrapper.find(".ui-resizable-w").append('<span class="img-resize-handle img-resize-handle-w" data-axis="w"></span>');
          // $wrapper.find(".ui-resizable-sw").append('<span class="img-resize-handle img-resize-handle-sw" data-axis="sw"></span>');
        },
        start: function(event, ui) {
          that.resizeSizes.style.display = "block";
        },
        resize: function(event,ui) {
          that.placeMirrorSVG(event.target);
          that.placeEditInlineSVGToolbar();
          $resizable.css('fontSize',ui.size.width + 'px');
          that.resizeSizes.textContent = ui.size.width + ' x ' + ui.size.height;
        },
        stop: function(event, ui) {
          that.resizeSizes.style.display = "none";
        },
      });
    },

    videoResizableEnable: function() {
      var that = this;
      var videoCoords = this.traceVideo.getBoundingClientRect();

      this.mirrorVideoResize.style.width = videoCoords.width + "px";
      this.mirrorVideoResize.style.height = videoCoords.height + "px";
      this.mirrorVideoResize.style.top = videoCoords.top + window.scrollY + "px";
      this.mirrorVideoResize.style.left = videoCoords.left + window.scrollX + "px";
      this.mirrorVideoResize.style.display = "block";

      var $mirrorVideoResize = $(this.mirrorVideoResize);
      var $resizable = $(this.traceVideo);

      $mirrorVideoResize.resizable({
        aspectRatio: true,
        handles: "e, s, se",
        alsoResize: $resizable,
        create: function(event, ui) {
          var $wrapper = $(event.target);
          $wrapper.addClass("me-ui-custom-wrapper");
          $wrapper.append(that.resizeSizes);
          $wrapper.find(".ui-resizable-e").append('<span class="img-resize-handle img-resize-handle-e" data-axis="e"></span>');
          $wrapper.find(".ui-resizable-se").append('<span class="img-resize-handle img-resize-handle-se" data-axis="se"></span>');
          $wrapper.find(".ui-resizable-s").append('<span class="img-resize-handle img-resize-handle-s" data-axis="s"></span>');
          // $wrapper.find(".ui-resizable-w").append('<span class="img-resize-handle img-resize-handle-w" data-axis="w"></span>');
          // $wrapper.find(".ui-resizable-sw").append('<span class="img-resize-handle img-resize-handle-sw" data-axis="sw"></span>');
        },
        start: function(event, ui) {
          that.resizeSizes.style.display = "block";
        },
        resize: function(event,ui) {
          that.placeMirrorVideo(event.target);
          that.resizeSizes.textContent = ui.size.width + ' x ' + ui.size.height;
          $resizable.find("iframe").height(ui.size.height);
          $resizable.find("iframe").width(ui.size.width);
        },
        stop: function(event, ui) {
          that.resizeSizes.style.display = "none";
        },
      });
    },

    handleRemoveInlineElement: function(event){
      this.hideAllToolbars();
    },

    placeMirrorImg: function(el) {
      var imageCoords = this.traceImg.getBoundingClientRect();

      el.style.top = imageCoords.top + window.scrollY + "px";
      el.style.left = imageCoords.left + window.scrollX + "px";
    },

    placeMirrorVideo: function(el) {
      var videoCoords = this.traceVideo.getBoundingClientRect();
      el.style.top = videoCoords.top + window.scrollY + "px";
      el.style.left = videoCoords.left + window.scrollX + "px";
    },

    placeMirrorSVG: function(el) {
      var svgCoords = this.traceSVG.getBoundingClientRect();
      el.style.top = svgCoords.top + window.scrollY + "px";
      el.style.left = svgCoords.left + window.scrollX + "px";
    },

    placeEditImgToolbar: function () {
      var targetCoords = this.traceImg.getBoundingClientRect();
      this.imageEditToolbar.style.left = (targetCoords.left + ((targetCoords.width - this.imageEditToolbar.offsetWidth) / 2)) + "px";
      this.imageEditToolbar.style.top = (window.scrollY + targetCoords.top - this.imageEditToolbar.offsetHeight - 8) + "px";
    },

    placeEditInlineSVGToolbar: function()
    {
      var targetCoords = this.traceSVG.getBoundingClientRect();
      this.inlineSVGEditToolbar.style.left = ( targetCoords.left + ( ( targetCoords.width - this.inlineSVGEditToolbar.offsetWidth ) / 2 ) ) + "px";
      this.inlineSVGEditToolbar.style.top = ( window.scrollY + targetCoords.top - this.inlineSVGEditToolbar.offsetHeight - 8 ) + "px";
    },

    // This function set the position of the Inline Video Management Toolbar. -A
    /*
    placeEditVideoToolbar: function() {
      var targetCoords = this.traceVideo.getBoundingClientRect();
      this.videoEditToolbar.style.left = ( targetCoords.left + ( ( targetCoords.width - this.videoEditToolbar.offsetWidth ) / 2 ) ) + "px";
      this.videoEditToolbar.style.top = ( window.scrollY + targetCoords.top - this.videoEditToolbar.offsetHeight - 8 ) + "px";
    },
    */

    hideEditImgToolbar: function() {
      if( this.traceImg ) {
        if( 'undefined' !== typeof $(this.mirrorResize).data('uiResizable') ) {
          $(this.mirrorResize).resizable("destroy");
        }
        this.mirrorResize.style.display = "";
        this.mirrorResize.style.margin = "";
        this.mirrorResize.style.position = "";
        this.mirrorResize.style.top = "";
        this.mirrorResize.style.left = "";
      }
      this.traceImg = null;
      this.imageEditToolbar.classList.remove("medium-editor-toolbar-active");
    },

    hideEditVideoToolbar: function() {
      if( this.traceVideo ) {
        if( 'undefined' !== typeof $(this.mirrorVideoResize).data('uiResizable') ) {
          $(this.mirrorVideoResize).resizable("destroy");
        }
        this.mirrorVideoResize.style.display = "";
        this.mirrorVideoResize.style.margin = "";
        this.mirrorVideoResize.style.position = "";
        this.mirrorVideoResize.style.top = "";
        this.mirrorVideoResize.style.left = "";
      }
      this.traceVideo = null;
      //this.videoEditToolbar.classList.remove("medium-editor-toolbar-active");
    },

    hideEditInlineSVGToolbar: function() {
      if( this.traceSVG ) {
        if( 'undefined' !== typeof $(this.mirrorSVGResize).data('uiResizable') ) {
          $(this.mirrorSVGResize).resizable("destroy");
        }
        this.mirrorSVGResize.style.display = "";
        this.mirrorSVGResize.style.margin = "";
        this.mirrorSVGResize.style.position = "";
        this.mirrorSVGResize.style.top = "";
        this.mirrorSVGResize.style.left = "";
      }
      this.traceSVG = null;
      this.inlineSVGEditToolbar.classList.remove("medium-editor-toolbar-active");
    },

    /**
     * Hiding all medium toolbars
     * @since 2.0.0
     * @date 27-02-2019
     */
    hideAllToolbars: function()
    {
      this.hideEditImgToolbar();
      this.hideEditVideoToolbar();
      this.hideEditInlineSVGToolbar();
    },

    pasteMediaHTML: function(html) {
      this.base.restoreSelection();
      html = '<div class="media-embed-wrap">' + html + '</div>';
      this.base.pasteHTML(html, {
        cleanPastedHTML: false,
        cleanAttrs: ['dir']
      });
      this.hideAllToolbars();
      this.mediaBtn.classList.remove("embed-value-visibile");
      this.mediaBtn.style.display = "none";
    },

    handleClickEmbed: function(ev) {
      // This is the code of the old system for uploading inline videos. -A
      //this.mediaBtn.classList.add("embed-value-visibile");
      //this.mediaEmbedInput.value = "";
      //this.mediaEmbedInput.focus();

      var data = {
        eventName: "rexlive:inlineVideoEditor",
        lastCursorPosition: this.traceSelection,
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      this.clientLastCursorPosition = data.lastCursorPosition;
    },

    // This is the code of a test for data transfer for the inline videos. -A
    /*handleVideoInsertReplace: function(eve){
      var TransferVideoUrl = eve.valueUrl;
      console.log("OUTPUT:", TransferVideoUrl);
    },*/

    getEmbedCode: function(event) {
      var that = this;
      var TransferVideoUrl = event.valueUrl;

      // This code was used to start loading the inline video using the keyboard [ENTER]. -A
      //if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ENTER)) {

        if( TransferVideoUrl !== "" ) {
          this.mediaEmbedInput.classList.remove("embed-loading");
          $.ajax({
            type: "GET",
            dataType: "json",
            url: _plugin_frontend_settings.rexajax.ajaxurl,
            data: {
              action: "rexlive_get_embed_code",
              nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
              url_to_embed: TransferVideoUrl,
            },
            // This code loads the inline video into the editor. -A
            success: function(response, elem) {
              TransferVideoUrl = "";
              if (response.success) {
                if(response.data.embed !== "") {
                  if(that.traceSelection) {
                    rangy.getSelection().restoreCharacterRanges(that.traceEditor, that.clientLastCursorPosition);
                    var range = that.getFirstRange();
                    range.refresh();
                    // This is the type of tag that must contain the uploaded video. -A
                    var wrapTagName = "span";
                  }
                  var videoNode = Rexbuilder_Dom_Util.htmlToElement(response.data.embed);
                  range.insertNode(videoNode);
                  var wrapElement = document.createElement(wrapTagName);
                  wrapElement.className = "overlay-status-for-video-inline";
                  //var wrapSetAsActive = document.createElement("span");
                  //wrapSetAsActive.className = "overlay-status-set-active";
                  //wrapElement.appendChild(wrapSetAsActive);
                  that.wrap( videoNode, wrapElement );
                  var $elem = $(that.traceEditor).parents(".grid-stack-item");

                  var galleryInstance = $elem.parent().data().plugin_perfectGridGalleryEditor;
                  galleryInstance.updateElementHeight( $elem[0] );

                  var data = {
                    eventName: "rexlive:edited",
                    modelEdited: $elem
                      .parents(".rexpansive_section")
                      .hasClass("rex-model-section")
                  };
                  Rexbuilder_Util_Editor.sendParentIframeMessage(data);
                }
              }
            },
            error: function (response) { },
            complete: function () {
              that.mediaEmbedInput.classList.remove("embed-loading");
              that.traceEditor.focus();
            }
          });
        }
      // This brace closes the "IF" element on line 1613. -A
      // }
    },

    mediaEmbedInputBlur: function(event) {
      this.mediaBtn.classList.remove("embed-value-visibile");
    },

    /**
     * Handling click on the insert inline SVG icon
     * @param {Object} event js object with info data
     * @since 2.0.0
     * @date 27-02-2019
     */
    handleClickInlineSVG: function(event)
    {
      var data = {
        eventName: "rexlive:inlineSVG",
        // lastCursorPosition: this.traceSelection,
        inlineSVGData: {}
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      // this.clientLastCursorPosition = data.lastCursorPosition;
    },

    /**
     * Listen to insert inline SVG event
     * @param {Object} event event data
     * @since 2.0.0
     * @date 27-02-2019
     */
    handleInlineSVGInsertReplace: function(event) {
      // Use html string due to tmpl bugs
      var icon_html = '<i class="' + event.svg_class + '"><svg><use xlink:href="#' + event.svg_ID + '"></use></svg></i>';

      // If cursor is valid
      if( this.traceSelection.length > 0 ) {
        rangy.getSelection().restoreCharacterRanges(this.traceEditor, this.traceSelection);
        var range = this.getFirstRange();
        range.refresh();
      }

      var replacing = false;
      if( this.traceSVG ) {
        this.traceSVG.setAttribute('xlink:href', '#' + event.svg_ID);
        // var restoreRange = rangy.createRange();
        // restoreRange.selectNode(this.traceSVG);
        // range = restoreRange;
        replacing = true;
        // rangy.dom.removeNode(this.traceSVG);
      }

      // If valid range retrieved
      if( range ) {
        if ( replacing )
        {
          // range.pasteHtml(icon_html);
        }
        else
        {
          // Generate DOM node from HTML
          var iconNode = Rexbuilder_Dom_Util.htmlToElement(icon_html);
          range.insertNode(iconNode);
          if( iconNode.parentElement === this.traceEditor ) {
            var prevEl = iconNode.previousElementSibling;
            var nextEl = iconNode.nextElementSibling;
            var wrapTagName = "";

            if( nextEl ) {
              wrapTagName = nextEl.tagName.toLowerCase();
            } else if ( prevEl ) {
              wrapTagName = prevEl.tagName.toLowerCase();
            }

            if( this.emptyLine(nextEl) ) {
              rangy.dom.removeNode(nextEl);
            }

            if( this.emptyLine(prevEl) ) {
              rangy.dom.removeNode(prevEl);
            }

            if( "div" === wrapTagName || "span" === wrapTagName || "" === wrapTagName ) {
              wrapTagName = "p";
            }

            this.wrap( iconNode, document.createElement(wrapTagName) );
          }
        }
      }

      this.hideAllToolbars();
      this.mediaBtn.style.display = "none";

      Rexbuilder_Util_Editor.builderEdited(false);
    }
  });

  /**
   * Extension to check blocks of text that have only a inline svg icon inside
   * In this case the blocks is no longer editable. Fix that with this extension
   *
   * @since 2.0.0
   * @date 03-07-2019
   */
  var OnlySVGFixExtension = MediumEditor.Extension.extend({
    name: 'onlySVGFixExtension',

    init: function () {
      this.subscribe("editableClick", this.checkContent.bind(this));
    },

    checkContent: function(event) {
      if ("click" == event.type) {
				var editor = this.base.getFocusedElement();

        if ( this.checkOnlyIcons(editor) ) {
					var svg = event.currentTarget;

          // go deep until the element has no childs
          while( svg.childElementCount !== 0 ) {
            svg = svg.children[svg.childElementCount-1];
          }

          // going up until the parent I tag
          if ( svg.tagName.toUpperCase() === 'USE' ) {
            svg = svg.parentNode;
          }

          if ( svg.tagName.toUpperCase() === 'SVG' ) {
            svg = svg.parentNode;
          }

          // create a space to allow the editing
          var fix = document.createElement('span');
          fix.innerHTML = '&nbsp;';

          svg.parentNode.append(fix);

          // place the cursor after the space created
          var range = document.createRange();
          var sel = window.getSelection();
          range.setStart(fix, 1);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    },

    checkOnlyIcons: function( el ) {
      var svgs = el.getElementsByTagName('svg');
      return ( svgs.length !== 0 && el.innerText == "" );
    }
  });

  var testDeleteExtension = MediumEditor.Extension.extend({
    name: 'testDeleteExtension',
    init: function() {
      this.subscribe('editableKeydownDelete', this.handleEditableKeydownDelete.bind(this));
    },
    handleEditableKeydownDelete: function(keyDownEvent, editableElement) {
      // var sps = Array.prototype.slice.call( editableElement.querySelectorAll('.data-test') );
      // var i, tot = sps.length;
      // for( i=0; i<tot; i++ ) {
      //   sps[i].setAttribute('contenteditable', false);
      // }
    }
  });

	var RexElementExtension = MediumEditor.Extension.extend({
		name: 'rexelement',
		init: function () {
			this.traceElement = null;
			this.traceElementId = '';
			this.containsWpcf7;

			// Trace the cursor position
			this.subscribe('editableMouseover', this.handleMouseOver.bind(this));

			this.subscribe('positionToolbar', this.handlePositionToolbar.bind(this));
			this.subscribe('hideToolbar', this.handleHideToolbar.bind(this));
		},

		handleMouseOver: function (mouseEvent, editableElement) {
			var target = mouseEvent.target;

			var gsItemFocused = Rexbuilder_Util.hasClass(
				$(editableElement).parents('.grid-stack-item').get(0),
				'item--me-focus'
			);
			var section = $(editableElement).parents('.rexpansive_section').get(0);
			// var sectionFocused = Rexbuilder_Util.hasClass(section, 'focusedRow');
			var sectionEditing = Rexbuilder_Util.hasClass(section, 'block-editing');

			if (gsItemFocused && /* sectionFocused && */ sectionEditing) {
				var elementWrapper = target.matches('.rex-element-wrapper')
					? target
					: $(target).parents('.rex-element-wrapper').get(0);

				if (elementWrapper) {
					this.traceElement = elementWrapper;
					this.traceElementId = elementWrapper.dataset.rexElementId;
					this.containsWpcf7 = !!this.traceElement.querySelector('.wpcf7');
				}
			}
		},

		editRexelement: function (e) {
			var $elementWrapper = $(this.traceElement);

			if (this.containsWpcf7) {
				this.setOutline(this.traceElement.querySelector('.wpcf7-form'), '#00ACFF');
			}

			var data = {
				eventName: 'rexlive:openRexElementChoose',
				elementData: Rexbuilder_Rexelement.generateElementData($elementWrapper)
			};
			Rexbuilder_Util_Editor.sendParentIframeMessage(data);

			$elementWrapper.parents('.text-wrap').blur();
		},

		deleteRexelement: function (e) {
			var $elementWrapper = $(this.traceElement);
			var $paragraphContainer = $elementWrapper.parents('p.rex-elements-paragraph');

			if (this.containsWpcf7) {
				Rexbuilder_Rexwpcf7_Editor.removeFormInPage(this.traceElementId);
			}

			$elementWrapper.remove();
			if ($paragraphContainer.find('.rex-element-wrapper').length == 0) {
				$paragraphContainer.remove();
			}

			Rexbuilder_Util_Editor.builderEdited(false);
		},

		/**
		 * Sets the outline of a DOM element with the given color.
		 * @param		{Element}	element	Element which needs the outline
		 * @param		{String}	color		The color of the outline
		 * @returns	{void}
		 * @since		2.0.2
		 */
		setOutline: function (element, color) {
			element.style.outline = '2px solid ' + color;
			element.style.outlineOffset = '-1px';
		},

		handlePositionToolbar: function (event) {
			var element = editorInstance.getSelectedParentElement();
			var toolbarExtension = this.base.getExtensionByName('toolbar');

			if (this.insideRexElement(element)) {
				// Hiding toolbar if a RexElement is present
				toolbarExtension.toolbar.style.display = 'none';
			}
		},

		handleHideToolbar: function (event) {
			var toolbarExtension = this.base.getExtensionByName('toolbar');
			toolbarExtension.toolbar.style.display = '';
		},

		/**
		 * Checks if node is inside or a rexelement
		 * @param {Object} node Node to check
		 */
		insideRexElement: function (node) {
			var $node = $(node);
			// if is a rexelement
			if ($node.hasClass('rex-element-wrapper')) {
				return true;
			}
			// if node is inside a rexelement
			if ($node.parents('.rex-element-wrapper').length != 0) {
				return true;
			}
			return false;
		},

		hideAnchorPreview: function (event) {
			var anchorLinkPreview = document.getElementsByClassName('medium-editor-anchor-preview');
			for (var i = 0; i < anchorLinkPreview.length; i++) {
				anchorLinkPreview[i].style.display = 'none';
			}
		}
	});

	var RexWpcf7Extension = MediumEditor.Extension.extend({
		name: 'rexwpcf7',
		init: function () {
			this.traceGsItem = null;
			this.traceForm = null;
			this.traceRow = null;
			this.traceColumn = null;
			this.traceColumnContent = null;

			// Delegated listener for toolboxes click
			Rexbuilder_Util.$rexContainer.on('click', '.wpcf7-form-button', this.delegateClickContainer.bind(this));

			// Trace the cursor position
			this.subscribe('editableMouseover', this.handleMouseOver.bind(this));

			this.subscribe('blur', this.handleBlur.bind(this));

			// Listener used to clear outlines after closing modals
			Rexbuilder_Util.$document.on('rexlive:clearFormOutlines', this.clearOutlines.bind(this));

			Rexbuilder_Rexwpcf7_Editor.setCf7EditorInstance(this);
		},

		delegateClickContainer: function (clickEvent) {
			clickEvent.preventDefault();

			var operation = clickEvent.currentTarget.getAttribute('data-operation');

			if ('' === operation) return;

			switch (operation) {
				case 'addRow':
					// Show the 'select number of columns' toolbox
					Rexbuilder_Util.addClass(this.traceForm.querySelector('.wpcf7-select-columns--bottom'), 'active');
					break;
				case 'addRowTop':
					// Show the 'select number of columns' toolbox
					Rexbuilder_Util.addClass(this.traceForm.querySelector('.wpcf7-select-columns--top'), 'active');
					break;
				case 'addSelectedColumns':
					// Add the selected columns
					this.addSelectedColumns(clickEvent.currentTarget);
					break;
				case 'cloneRow':
					// Clone the row
					this.cloneRow();
					break;
				case 'deleteRow':
					// Delete the row
					this.deleteRow();
					break;
				case 'columnSettings':
					// Open the settings modal for the column
					this.openColumnSettings();
					break;
				case 'cloneColumn':
					// Clone the column
					this.cloneColumn();
					break;
				case 'deleteColumnContent':
					// Delete the column content
					this.deleteColumnContent();
					break;
				case 'addColumnContent':
					// Add new column content
					this.addColumnContent();
					break;
				case 'editElement':
					// Edit the element
					rexElementInstance.editRexelement();
					break;
				case 'deleteElement':
					// Delete the element
					rexElementInstance.deleteRexelement();
					break;

				default:
					break;
			}
		},

		/**
		 * Handles mouse over.
		 * @param		{Event}			mouseEvent
		 * @param		{Element}		editableElement		Contenteditable DOM Element
		 * @returns	{void}
		 * @since		2.0.2
		 */
		handleMouseOver: function (mouseEvent, editableElement) {
			this.traceTextWrap = editableElement;
			this.$traceTextWrap = $(editableElement);

			this.traceGsItem = $(this.traceTextWrap).parents('.grid-stack-item').get(0);
			var section = $(this.traceTextWrap).parents('.rexpansive_section').get(0);
			var target = mouseEvent.target;

			if (
				Rexbuilder_Util.hasClass(this.traceGsItem, 'item--me-focus') &&
				// Rexbuilder_Util.hasClass(section, 'focusedRow') &&
				Rexbuilder_Util.hasClass(section, 'block-editing')
			) {
				var contactForm = target.matches('.wpcf7-form:not(.no-builder-form)')
					? target
					: $(target).parents('.wpcf7-form:not(.no-builder-form)').get(0);

				if (contactForm) {
					// The pointer is inside a form
					this.traceForm = contactForm;
					var contactFormRow = target.matches('.wpcf7-row') ? target : $(target).parents('.wpcf7-row').get(0);

					this.updateHeight(true);

					if (contactFormRow) {
						// The pointer is inside a form row
						this.traceRow = contactFormRow;

						Rexbuilder_Util.removeClass(this.traceForm.querySelector('.wpcf7-select-columns--top'), 'active');
						Rexbuilder_Util.removeClass(this.traceForm.querySelector('.wpcf7-select-columns--bottom'), 'active');

						var contactFormColumn = target.matches('.wpcf7-column')
							? target
							: $(target).parents('.wpcf7-column').get(0);

						if (contactFormColumn) {
							this.traceColumn = contactFormColumn;

							if (!Rexbuilder_Util.hasClass(contactFormColumn, 'with-button')) {
								// The pointer is inside a form column
								this.traceColumnContent = contactFormColumn.querySelector('.wpcf7-form-control-wrap');
							}
						}
					}
				} else {
					this.handleBlur();
				}
			}
		},

		addColumnContent: function () {
			Rexbuilder_Util_Editor.builderEdited(false);

			var data = {
				eventName: 'rexlive:openRexWpcf7AddContent',
				insertionPoint: {
					formID: rexElementInstance.traceElementId,
					row_number: this.traceRow.getAttribute('wpcf7-row-number'),
					column_number: this.traceColumn.getAttribute('wpcf7-column-number')
				}
			};
			Rexbuilder_Util_Editor.sendParentIframeMessage(data);

			Rexbuilder_Rexelement_Editor.focusRexElement(this.$traceTextWrap);
		},

		addSelectedColumns: function (target) {
			Rexbuilder_Util_Editor.builderEdited(false);

			var columnsSelected = parseInt(target.className.match(/select-(\d)-columns?/)[1]);

			Rexbuilder_Rexwpcf7_Editor.addNewRow(rexElementInstance.traceElementId, columnsSelected);
			this.updateHeight();
		},

		cloneRow: function () {
			Rexbuilder_Util_Editor.builderEdited(false);

			var $rowToClone = $(this.traceRow).clone();
			var numberRowBefore = parseInt($rowToClone.attr('wpcf7-row-number'));

			Rexbuilder_Rexwpcf7_Editor.addRow(rexElementInstance.traceElementId, $rowToClone, numberRowBefore);

			Rexbuilder_Live_Utilities.launchTooltips();
			this.updateHeight();
		},

		deleteRow: function () {
			Rexbuilder_Util_Editor.builderEdited(false);

			var rowNumberToDelete = $(this.traceRow).attr('wpcf7-row-number');

			Rexbuilder_Rexwpcf7_Editor.deleteRow(rexElementInstance.traceElementId, rowNumberToDelete);

			this.updateHeight();
		},

		openColumnSettings: function () {
			this.setOutline(this.traceColumnContent, '#FF0055');

			var spanDataExists = !!this.traceColumn.querySelector('.rex-wpcf7-column-content-data');
			var fileCaptionExists = !!this.traceColumn.querySelector('.rex-wpcf7-file-caption');

			var data = {
				eventName: 'rexlive:openRexWpcf7EditContent',
				columnContentData: Rexbuilder_Rexwpcf7.generateColumnContentData($(this.traceColumn), spanDataExists),
				spanDataExists: spanDataExists,
				fileCaptionExists: fileCaptionExists
			};
			Rexbuilder_Util_Editor.sendParentIframeMessage(data);
		},

		cloneColumn: function () {
			Rexbuilder_Util_Editor.builderEdited(false);

			var clonedColumnNumber = parseInt(this.traceColumn.getAttribute('wpcf7-column-number'));
			var numberRowBefore = parseInt(this.traceRow.getAttribute('wpcf7-row-number'));

			Rexbuilder_Rexwpcf7_Editor.addClonedColumnRow(
				rexElementInstance.traceElementId,
				clonedColumnNumber,
				numberRowBefore
			);

			Rexbuilder_Live_Utilities.launchTooltips();
			this.updateHeight();
		},

		deleteColumnContent: function () {
			Rexbuilder_Util_Editor.builderEdited(false);

			var rowNumberToDelete = this.traceRow.getAttribute('wpcf7-row-number');
			var columnNumberToDelete = this.traceColumn.getAttribute('wpcf7-column-number');

			Rexbuilder_Rexwpcf7_Editor.deleteColumnContent(
				rexElementInstance.traceElementId,
				rowNumberToDelete,
				columnNumberToDelete
			);

			this.updateHeight();
		},

		handleBlur: function () {
			this.updateHeight();
		},

		/**
		 * Sets the outline of of the given element.
		 * @param		{Element}	element	Element which needs the outline
		 * @param		{String}	color		The color of the outline
		 * @returns	{void}
		 * @since		2.0.2
		 */
		setOutline: function (element, color) {
			element.style.outline = '2px solid ' + color;
			element.style.outlineOffset = '-1px';
		},

		/**
		 * Removes inline style outlines of the given element.
		 * @returns		{void}
		 * @since			2.0.2
		 * @version		2.0.5		Now it removes form and column content
		 * 										outlines with no conditions.
		 */
		clearOutlines: function () {
			if (!this.traceForm) {
				return;
			}

			this.traceForm.style.outline = '';
			this.traceForm.style.outlineOffset = '';

			this.traceColumnContent.style.outline = '';
			this.traceColumnContent.style.outlineOffset = '';
		},

		/**
		 * Updates height of the block that contains the form.
		 * @returns		{void}
		 * @since			2.0.2
		 * @version		2.0.5		Added updating of all form instances
		 */
		updateHeight: function (updateOnlyCurrent) {
			updateOnlyCurrent = updateOnlyCurrent || false;

			var $textWrap;

			function setTextWrapHeight(form) {
				$textWrap = $(form).parents('.text-wrap');

				if (0 === $textWrap.length) return;

				Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap, false, true);
			}

			if (updateOnlyCurrent) {
				if (!this.traceForm) return;

				setTextWrapHeight(this.traceForm);
			} else {
				var formsInPage = Array.prototype.slice.call(
					Rexbuilder_Util.rexContainer.querySelectorAll(
						'.rex-element-wrapper[data-rex-element-id="' + rexElementInstance.traceElementId + '"] .wpcf7-form'
					)
				);

				if (0 === formsInPage.length) return;

				formsInPage.forEach(setTextWrapHeight);
			}
		},

		/**
		 * Simulates focusing of the block that contains the form.
		 * @returns	{void}
		 * @since		2.0.2
		 * @version	2.0.5		Used Rexbuilder_Rexelement_Editor.focusRexElement function
		 */
		focusBlock: function () {
			Rexbuilder_Rexelement_Editor.focusRexElement(this.$traceTextWrap);
		}
	});

  var _linkDocumentListeners = function () {
    //function for removing textarea html editor
    Rexbuilder_Util.$document.on("click", ".rex-close-html-editor", function (e) {
      var $wrapper = $(e.target).parents(".editing-html");
      var $textArea = $wrapper.find("textarea");
      var $html = $.parseHTML($textArea.val());
      $wrapper.children().remove();
      $wrapper.append($html);
      $wrapper
        .children()
        .eq(0)
        .unwrap();
    });
  };

  /**
   * Add handlers to text editor events
   * @since			2.0.0
   * @version		2.0.4  Listen on focus and blur events, to handling the
   *                   draggability of the parent grid
   */
  var _addEditableInputEvents = function () {
    editorInstance.subscribe("editableInput", function (event, elem) {
			var $elem = $(elem).parents(".grid-stack-item");

      var data = {
        eventName: "rexlive:edited",
        modelEdited: $elem
          .parents(".rexpansive_section")
          .hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * On text editor focus, disable the drag of the blocks
     * @param  {Event} event focus event
     * @param  {Node} elem    html element of the text editor
     * @return {void}
     * @since  2.0.4
     */
    editorInstance.subscribe("focus", function (event, elem) {
			if (!elem) return;

			var pgge = $(elem).parents('.perfect-grid-gallery').data().plugin_perfectGridGalleryEditor;

			if (!pgge) return;

			// disable dragging on gristack
			pgge.properties.gridstackInstance.enableMove(false);
    });

    /**
     * On text editor blur, enable the drag of the blocks
     * @param  {Event} event blur event
     * @param  {Node} elem    html element of the text editor
     * @return {void}
     * @since  2.0.4
     */
    editorInstance.subscribe("blur", function (event, elem) {
      // if user click on a media btn, do not blur
      if ( 'click' == event.type && 'undefined' !== typeof editorInstance.getExtensionByName('insert-media') && 0 !== $(event.target).parents('.' + editorInstance.getExtensionByName('insert-media').toolbarWrapClass).length ) return false;

      // view or hide the little T icon
      Rexbuilder_Block_Editor.updateTextTool( elem );

      // get perfect grid gallery instance
      var pgge = $(elem).parents('.perfect-grid-gallery').data().plugin_perfectGridGalleryEditor;
      if ( ! pgge ) return;

      // enable dragging on gristack
      pgge.properties.gridstackInstance.enableMove(true);

      Rexbuilder_Util_Editor.activateElementFocus = false;
      Rexbuilder_Util_Editor.endEditingElement();
      Rexbuilder_Util_Editor.activateElementFocus = true;
    });

		editorInstance.subscribe('editablePaste', function (event, target) {
			/** @todo Remove timeout */
			setTimeout(function () {
				Rexbuilder_Util_Editor.updateBlockContainerHeight($(target));
			}, 0);

			var nodeToFix = MediumEditor.selection.getSelectionStart(editorInstance.options.ownerDocument);
			var $node = $(nodeToFix);
			var nodeTag = nodeToFix.tagName.toLowerCase();

			if (nodeTag === 'span' || nodeTag === 'p') {
				var parentNodeTag = nodeToFix.parentNode.tagName.toLowerCase();

				if (
					parentNodeTag !== 'h1' &&
					parentNodeTag !== 'h2' &&
					parentNodeTag !== 'h3' &&
					parentNodeTag !== 'h4' &&
					parentNodeTag !== 'h5' &&
					parentNodeTag !== 'h6'
				) {
					var prevNodeColor = $node.prev().css('color');
					setCurrentTextColor(prevNodeColor);
				}
			} else {
				var lastChildNodeColor = $node.children().last().css('color');
				setCurrentTextColor(lastChildNodeColor);
			}
		});
  };

  var _createToolbarContainer = function () {
    var id = "textEditorToolbar";
    if (
      Rexbuilder_Util.$rexContainer.children('.editable[id="' + id + '"]')
        .length == 0
    ) {
      var divToolbar = document.createElement("div");
      $(divToolbar).attr({
        id: id,
        class: "editable",
        style: "display: none"
      });
      Rexbuilder_Util.$rexContainer.prepend(divToolbar);
    }
  };

  var _destroyMediumEditor = function () {
    editorInstance.destroy();
  };

  /**
   * Launching the medium editor
   */
  var _createEditor = function () {
    // htmlExtensionInstance = new TextHtmlExtension();
    pickerExtensionInstance = new ColorPickerExtension();
    headingTagsExtensionInstance = new TextTagExtension();
    formattingTagsExtensionInstance = new FormattingTagExtension();
    justifyExtensionIntance = new JustifyExtension();
    listExtensionInstance = new ListExtension();
		insertMediaExtensionInstance = new InsertMediaExtension();
		rexElementInstance = new RexElementExtension();
    testDeleteExtensionInstance = new testDeleteExtension();

    editorInstance = new MediumEditor(".editable", {
      toolbar: {
        buttons: [
          "colorPicker",
          "formattingTags",
          {
            name: 'anchor',
            // targetCheckbox: true,
            contentDefault: '<i class="l-svg-icons"><svg><use xlink:href="#C001-Link"></use></svg></i>',
            formSaveLabel: '<span class="tool-button tool-button--inline"><i class="l-svg-icons"><svg><use xlink:href="#A006-Save"></use></svg></i></span>',
            formCloseLabel: '<span class="tool-button tool-button--inline tool-button--black"><i class="l-svg-icons"><svg><use xlink:href="#Z003-Close"></use></svg></i></span>'
          },
          "headingTags",
          "justifyDropdown",
          // {
          //   name: 'quote',
          //   contentDefault: '"',
          // },
          "listDropdown",
          // "table",
          "contentBlockPosition",
          // "textHtml",
          "textEditorHtml"
          // "removeFormat",
        ]
      },
      imageDragging: false,
      extensions: {
        'imageDragging': {}, // fix for disable drag extension of medium editor
        colorPicker: pickerExtensionInstance,
        textEditorHtml: new TextHtmlEditorExtension(),
        headingTags: headingTagsExtensionInstance,
        formattingTags: formattingTagsExtensionInstance,
        justifyDropdown: justifyExtensionIntance,
        listDropdown: listExtensionInstance,
        contentBlockPosition: new ContentBlockPositionExtension(),
        'close-editor-escape': new CloseEditorEscapeExtension(),
        'insert-media': insertMediaExtensionInstance,
        textGradient: new TextGradientExtension(),
        'hide-row-tools-on-editing': new HideRowToolsOnEditing(),
        'rexbutton-input': new RexButtonExtension(),
        'rexelement': rexElementInstance,
        'rexwpcf7' : new RexWpcf7Extension(),
        'testDeleteExtension': testDeleteExtensionInstance,
        onlySVGFixExtension : new OnlySVGFixExtension()
      },
      paste: {
        forcePlainText: false,
      },
      placeholder: {
        text: "Type here your text",
        hideOnClick: false
      },
		});

    _addEditableInputEvents();
  };

  var _triggerMEEvent = function (event_info) {
    editorInstance.trigger(event_info.name, event_info.data, event_info.editable);
  }

  /**
   * Removes medium editor placeholder of the $textWrap passed via parameter
   * @param {JQuery} $textWrap
   */
  var _removePlaceholder = function ($textWrap) {
    editorInstance.getExtensionByName("placeholder").hidePlaceholder($textWrap[0]);
  }

  var _getEditorInstance = function () {
    return editorInstance;
  };

  var init = function () {
    toolbarActiveOnRexbutton = false;
    _createToolbarContainer();
    _createEditor();
    _linkDocumentListeners();
  };

  function load() {
    rangy.init();
  }

  return {
    init: init,
    load: load,
    launchTextEditors: launchTextEditors,
    addElementToTextEditor: _addElementToTextEditor,
    destroyMediumEditor: _destroyMediumEditor,
    getEditorInstance: _getEditorInstance,
    createEditor: _createEditor,
    triggerMEEvent: _triggerMEEvent,
    openTextGradientColor: _openTextGradientColor,
    removePlaceholder: _removePlaceholder
  };
})(jQuery);
