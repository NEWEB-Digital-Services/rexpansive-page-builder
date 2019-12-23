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
  // var dropDownListExtensionInstance;
  var rexWpcf7ExtensionInstance;

  var currentTextSelection;

  var toolbarActiveOnRexbutton;
  var toolbarActiveOnRexelement;

  /**
   * Add element to text editor instance
   * @param {Node} textWrap element that becomes editable
   */
  var _addElementToTextEditor = function ( textWrap ) {
    editorInstance.addElements( textWrap );
    // _addMediumInsertToElement($textWrap);
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
                // console.log($el);
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
   * Handling the text editing
   * @since x.x.x
   */
  var TextEditingExtension = MediumEditor.Extension.extend({
    name: 'textEditing',

    init: function () {
      this.keyCode = MediumEditor.util.keyCode;
      // this.subscribe("editableKeyup", this.handleEventKeyUp.bind(this));
      this.subscribe("editableInput", this.handleEditableInput.bind(this));
    },

    handleEditableInput: function (event, target) {
      // Not using keyup event.
      // Pros of keyup: it's called less times than input event.
      // Cons:  when pasting on a p, the text stays black for less than a second,
      //        but the user can see it.
      //        When pressing CTRL+V and releasing CTRL before, the if condition
      //        results false.
      // if (MediumEditor.util.isKey(event, this.keyCode.V) && MediumEditor.util.isMetaCtrlKey(event)) {
        var nodeToFix = MediumEditor.selection.getSelectionStart(this.base.options.ownerDocument);
        var $node = $(nodeToFix);


        Rexbuilder_Util_Editor.updateBlockContainerHeight($(target));

        if ($node[0].tagName.toLowerCase() == "span" || $node[0].tagName.toLowerCase() == "p") {
          if ($node.parent()[0].tagName.toLowerCase() != "h1" && 
            $node.parent()[0].tagName.toLowerCase() != "h2" &&
            $node.parent()[0].tagName.toLowerCase() != "h3" &&
            $node.parent()[0].tagName.toLowerCase() != "h4" &&
            $node.parent()[0].tagName.toLowerCase() != "h5" &&
            $node.parent()[0].tagName.toLowerCase() != "h6") {
            var prevNodeColor = $node.prev().css("color");
            setCurrentTextColor(prevNodeColor);
          }
        } else {
          var lastChildNodeColor = $node.children().last().css("color");
          setCurrentTextColor(lastChildNodeColor);
        }
      // }
    },
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
      // for(var i=0;i<this.all_actions.length;i++) {
      //   console.log(this.base.queryCommandState(this.all_actions[i]));
      //   if( this.base.queryCommandState(this.all_actions[i]) ) {
      //     this.action_active = this.all_actions[i];
      //     return true;
      //   }
      // }
      // return false;
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
        } /*else if (toolbarActiveOnRexelement) {
          this.action_active = action;
          this.clearListElements();//@todo
          this.activateListElements();//@todo
          var element = editorInstance.getSelectedParentElement();
          var $paragraphContainer = $(element).parents("p.rex-elements-paragraph");
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
          var rexelementToolbox = this.base.getExtensionByName('rexelement-input');

          if (toolbar) {
            toolbar.setToolbarPosition();
          }
          if (rexbuttonToolbox) {
            rexbuttonToolbox.placeRexelementToolbox();
          }
          event.preventDefault();
        }*/ else {
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
      if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.ESCAPE)) {
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

        if (Rexbuilder_Util_Editor.editedTextWrap) {
          Rexbuilder_Util_Editor.editedTextWrap.blur();
        }
        gallery.focusElement($elem);
        Rexbuilder_Util_Editor.editingGallery = false;
        Rexbuilder_Util_Editor.editedGallery = null;
        Rexbuilder_Util_Editor.editingElement = false;
        Rexbuilder_Util_Editor.editedElement = null;
        Rexbuilder_Util_Editor.editedTextWrap = null;
      }
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

      // this.base.pasteHTML(event.customHTML, {
      //   cleanPastedHTML: false,
      //   cleanAttrs: ['dir'],
      // });

      var index = this.base.exportSelection().editableElementIndex;
      this.base.setContent(event.customHTML, index);
      
    }
  });

  var HideRowToolsOnEditing = MediumEditor.Extension.extend({
    name: 'hide-row-tools-on-editing',
    init: function () {
      this.subscribe("blur", this.handleBlur.bind(this));
      this.subscribe("focus", this.handleFocus.bind(this));
    },

    handleBlur: function(event,editable) {
      $(editable).parents('.grid-stack-item').removeClass('item--me-focus');
      $(editable).parents(".rexpansive_section").removeClass("block-editing");
    },

    handleFocus: function(event,editable) {
      $(editable).parents('.grid-stack-item').addClass('item--me-focus');
      $(editable).parents(".rexpansive_section").addClass("block-editing");
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

      this.subscribe("editableInput", this.handleEventInput.bind(this));
      this.subscribe("editableKeydown", this.handleEventKeyDown.bind(this));
      this.subscribe("editableKeyup", this.handleEventKeyUp.bind(this));
      this.subscribe("keyup", this.handleEventKeyUp.bind(this));

      this.subscribe("positionToolbar", this.handlePositionToolbar.bind(this));
      this.subscribe("hideToolbar", this.handleHideToolbar.bind(this));

      this.rexbuttonTools = document.createElement("div");
      this.rexbuttonTools.contentEditable = false;
      this.rexbuttonTools.classList.add("rexbutton-tools");
      this.rexbuttonTools.style.display = "none";
      this.rexbuttonTools.innerHTML = tmpl("tmpl-rexbutton-tools", {});
      $(document.getElementsByTagName("body")[0]).append(this.rexbuttonTools);

      this.deleteRexbuttonBtn = $(this.rexbuttonTools).find(".rex-delete-button")[0];
      this.editRexbuttonBtn = $(this.rexbuttonTools).find(".rex-edit-button")[0];

      // Hiding anchor preview of text editor when mouse is over a rexbutton
      // Timeout is needed because anchor will stay under button for about 500-600 ms
      var showAnchorTimeout = null;
      var extensionIstance = this;
      Rexbuilder_Util.$document.on("mouseenter", ".rex-button-wrapper", function (e) {
        extensionIstance.hideAnchorPreview();
        if (showAnchorTimeout !== null) {
          clearTimeout(showAnchorTimeout);
          showAnchorTimeout = null;
        }
      });

      Rexbuilder_Util.$document.on("mouseleave", ".rex-button-wrapper", function (e) {
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
    
    hideAnchorPreview: function (event) {
      var anchorLinkPreview = document.getElementsByClassName("medium-editor-anchor-preview");
      for (var i = 0; i < anchorLinkPreview.length; i++) {
        anchorLinkPreview[i].style.display = "none";
      }
    },

    showAnchorPreview: function (event) {
      var anchorLinkPreview = document.getElementsByClassName("medium-editor-anchor-preview");
      for (var i = 0; i < anchorLinkPreview.length; i++) {
        anchorLinkPreview[i].style.display = "block";
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
      this.rexbuttonTools.style.display = "block";
      this.placeRexbuttonToolbox();
    },

    hideRexbuttonToolbox: function (event) {
      this.rexbuttonTools.style.display = "none";
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
      this.rexbuttonTools.style.width = targetCoords.width + "px";
      this.rexbuttonTools.style.left = (targetCoords.left + ((targetCoords.width - this.rexbuttonTools.offsetWidth) / 2)) + "px";
      this.rexbuttonTools.style.top = (window.scrollY + targetCoords.top - this.rexbuttonTools.offsetHeight) + "px";
      //this.rexbuttonTools.style.top = (window.scrollY + targetCoords.top - this.rexbuttonTools.offsetHeight + 8) + "px";
      //this.rexbuttonTools.style.top = (window.scrollY + targetCoords.top - this.rexbuttonTools.offsetHeight - 8) + "px";
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

    handleEventInput: function (eventObj, target) {},

    handleEventKeyUp: function (event, target) {
      // Check if has to update height always on update height of text-wrap

      var nodeToFix = MediumEditor.selection.getSelectionStart(this.base.options.ownerDocument);
      var $node = $(nodeToFix);

      // If text is pasted need to update block height
      if (MediumEditor.util.isKey(event, this.keyCode.V) && MediumEditor.util.isMetaCtrlKey(event)) {
        Rexbuilder_Util_Editor.updateBlockContainerHeight($(target));
      }

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

      // Create a mirror image to handling the resize of an inline image
      this.mirrorResize = document.createElement('img');
      this.mirrorResize.classList.add("me-resize-mirror");
      $(document.getElementsByTagName("body")[0]).append(this.mirrorResize);

      // Create a mirror span to handling the resize of an inline embed
      this.mirrorVideoResize = document.createElement('span');
      this.mirrorVideoResize.classList.add("me-resize-mirror");
      $(document.getElementsByTagName("body")[0]).append(this.mirrorVideoResize);

      // Create a mirror span to handling the resize of an inline svg
      this.mirrorSVGResize = document.createElement('span');
      this.mirrorSVGResize.classList.add("me-resize-mirror");
      $(document.getElementsByTagName("body")[0]).append(this.mirrorSVGResize);

      this.resizeSizes = document.createElement('span');
      this.resizeSizes.classList.add("me-resize-sizes");

      // Create the image inline edit toolbar
      this.imageEditToolbar = document.createElement("div");
      this.imageEditToolbar.id = "me-edit-inline-image-toolbar";
      this.imageEditToolbar.classList.add("medium-editor-toolbar");
      this.imageEditToolbar.classList.add("medium-toolbar-arrow-under");
      this.imageEditToolbar.innerHTML = tmpl("tmpl-me-image-edit", {});
      $(document.getElementsByTagName("body")[0]).append(this.imageEditToolbar);

      this.inlineSVGEditToolbar = document.createElement("div");
      this.inlineSVGEditToolbar.id = "me-edit-inline-svg-toolbar";
      this.inlineSVGEditToolbar.classList.add("medium-editor-toolbar");
      this.inlineSVGEditToolbar.classList.add("medium-toolbar-arrow-under");
      this.inlineSVGEditToolbar.innerHTML = tmpl("tmpl-me-inline-svg-edit",{});
      $(document.getElementsByTagName("body")[0]).append(this.inlineSVGEditToolbar);

      initPicker( $(this.inlineSVGEditToolbar).find('.me-svg-color')[0], this.applySVGColor );

      // Creation of the Inline Video Management Toolbar
      this.videoEditToolbar = document.createElement("div");
      this.videoEditToolbar.id = "me-edit-inline-image-toolbar";
      this.videoEditToolbar.classList.add("medium-editor-toolbar");
      this.videoEditToolbar.classList.add("medium-toolbar-arrow-under");
      this.videoEditToolbar.innerHTML = tmpl("tmpl-me-image-edit",{});
      document.getElementsByTagName("body")[0].append(this.videoEditToolbar);

      // Create insert media button, that stays at bottom-right of a text content
      // Append it to the body, to reuse it instead of multiple create id
      this.mediaBtn = document.createElement("div");
      this.mediaBtn.contentEditable = false;
      this.mediaBtn.classList.add("me-insert-media-button");
      this.mediaBtn.style.display = "none";
      this.mediaBtn.innerHTML = tmpl("tmpl-me-insert-media-button", {});
      $(document.getElementsByTagName("body")[0]).append(this.mediaBtn);
      //$(document.getElementsByTagName("body")[0]).append(this.mediaBtn);

      this.mediaLibraryBtn = $(this.mediaBtn).find(".me-insert-image")[0];
      this.mediaEmbedBtn = $(this.mediaBtn).find(".me-insert-embed")[0];
      this.mediaEmbedInput = $(this.mediaBtn).find(".me-insert-embed__value")[0];
      this.inlineSVGBtn = $(this.mediaBtn).find('.me-insert-inline-svg')[0];

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
        var editor = this.base.getFocusedElement();
        this.traceSelection = rangy.getSelection().saveCharacterRanges(editor);
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
      var $content_wrap = typeof $wrapper == "undefined" ? $(editor).parents(".grid-item-content-wrap") : $wrapper;
      var targetCoords = $content_wrap[0].getBoundingClientRect();
      this.mediaBtn.style.left = (window.scrollX + targetCoords.left + targetCoords.width - this.mediaBtn.offsetWidth - 15) + "px";
      this.mediaBtn.style.top = (window.scrollY + targetCoords.top + targetCoords.height - this.mediaBtn.offsetHeight - 15) + "px";
    },

    traceInput: function (event) {
      // If the event happens on the text editor, save the selection
      if (0 === $(event.target).parents('.me-insert-media-button').length) {
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
          if($(target).parents(".wpcf7-add-new-form-content").length != 0 || $(target).parents("#rex-wpcf7-tools").length != 0) {
            target = "";
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

      if( $el.hasClass("me-svg-color") ) {

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

      if( $el.hasClass("me-svg-delete") ) {
        $(this.traceSVG).parents('i').remove();
        this.hideEditInlineSVGToolbar();
      }
    },

    /*handleVideoEdit: function(event) {
      var $vdl = $(event.target);
      if( $vdl.hasClass("me-image-delete") ) {
          $(this.traceVideo).remove();
          this.hideEditVideoToolbar();
      }
    },*/

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
      this.inlineSVGEditToolbar.classList.add("medium-editor-toolbar-active");
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
          //console.log("START Resizing ||",ui.size.width,"||",ui.size.height,"|| px,w,h");
        },
        resize: function(event,ui) {
          that.placeMirrorVideo(event.target);
          that.resizeSizes.textContent = ui.size.width + ' x ' + ui.size.height;
          $resizable.find("iframe").height(ui.size.height);
          $resizable.find("iframe").width(ui.size.width);
        },
        stop: function(event, ui) {
          that.resizeSizes.style.display = "none";
          //console.log("STOP Resizing ||",ui.size.width,"||",ui.size.height,"|| px,w,h");
        },
      });
    },

    handleRemoveInlineElement: function(event){

      this.hideAllToolbars();
      
    // var baseElementsOneInnerHTML = this.base.elements[1].innerHTML;
    //   var baseElementsOneInnerTEXT = this.base.elements[1].innerText;    
    //   console.log(this.base.elements[1].innerHTML);
    //   console.log(this.base.elements[1].innerText);
    //   if (MediumEditor.util.isKey(event, MediumEditor.util.keyCode.BACKSPACE) || MediumEditor.util.isKey(event, MediumEditor.util.keyCode.DELETE)) {
    //     // MediumEditor.util.isKey == 8, 446
    //     if(baseElementsOneInnerTEXT != "" && baseElementsOneInnerHTML != "<p><br></p>") {
    //       this.hideEditImgToolbar();
    //       this.hideEditVideoToolbar();
    //       if(baseElementsOneInnerHTML != "<p><br></p>") {
    //         this.hideEditImgToolbar();
    //         this.hideEditVideoToolbar();
    //       }
    //     }
    //   }   

    },

    placeMirrorImg: function(el) {
      var imageCoords = this.traceImg.getBoundingClientRect();

      el.style.top = imageCoords.top + window.scrollY + "px";
      el.style.left = imageCoords.left + window.scrollX + "px";
      // console.log(el.style.top,"\n",el.style.left)
    },

    placeMirrorVideo: function(el) {
      var videoCoords = this.traceVideo.getBoundingClientRect();
      el.style.top = videoCoords.top + window.scrollY + "px";
      el.style.left = videoCoords.left + window.scrollX + "px";
      // console.log(el.style.top,"\n",el.style.left)
    },

    placeMirrorSVG: function(el) {
      var svgCoords = this.traceSVG.getBoundingClientRect();
      el.style.top = svgCoords.top + window.scrollY + "px";
      el.style.left = svgCoords.left + window.scrollX + "px";
      // console.log(el.style.top,"\n",el.style.left)
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
      // Get the icon HTML
      // var icon_html = tmpl('tmpl-insert-inline-svg',{
      //   class: event.svg_class,
      //   icon: event.svg_ID
      // });
      // Use html string due to tmpl bugs
      var icon_html = '<i class="' + event.svg_class + '"><svg><use xlink:href="#' + event.svg_ID + '"></use></svg></i>';

      // If cursor is valid
      if( this.traceSelection ) {
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

  ///////////////////////////////////////////////////////////////////////////////////////////////
  /// REXELEMENTS LOGICS
  ///////////////////////////////////////////////////////////////////////////////////////////////

  var RexElementExtension = MediumEditor.Extension.extend({
    name: 'rexelement-input',
    init: function () {
      toolbarActiveOnRexelement = false;

      this.traceELMNT = null;

      this.containsWpcf7;

      this.subscribe("positionToolbar", this.handlePositionToolbar.bind(this));
      this.subscribe("hideToolbar", this.handleHideToolbar.bind(this));

      // Create the tools displayed on an element
      this.rexelementTools = document.createElement("div");
      this.rexelementTools.contentEditable = false;
      this.rexelementTools.classList.add("rexelement-tools");
      this.rexelementTools.style.display = "none";
      this.rexelementTools.innerHTML = tmpl("tmpl-rexelement-tools", {});
      $(document.getElementsByTagName("body")[0]).append(this.rexelementTools);

      this.deleteRexelementBtn = $(this.rexelementTools).find(".rex-delete-element")[0];
      this.editRexelementBtn = $(this.rexelementTools).find(".rex-edit-element")[0];

      this.subscribe("blur", this.handleBlur.bind(this));

      // Trace the cursor position
      // this.subscribe("editableClick", this.traceInputRexElement.bind(this));
      this.subscribe("editableMouseover", this.handleMouseOver.bind(this));

      // Link click listeners
      this.on(this.deleteRexelementBtn, "click", this.handleClickDeleteRexelement.bind(this));
      this.on(this.editRexelementBtn, "click", this.handleClickEditRexelement.bind(this)); // Different for every kind of element?

      // Hiding anchor preview of text editor when mouse is over a rexelement
      // Timeout is needed because anchor will stay under element for about 500-600 ms
      var showAnchorTimeout = null;
      var extensionInstance = this;
      // Rexbuilder_Util.$document.on("mouseenter", ".rex-element-wrapper", function (e) {
      //   extensionInstance.hideAnchorPreview();
      //   if (showAnchorTimeout !== null) {
      //     clearTimeout(showAnchorTimeout);
      //     showAnchorTimeout = null;
      //   }
      // });

      // Rexbuilder_Util.$document.on("mouseleave", ".rex-element-wrapper", function (e) {
      //   showAnchorTimeout = setTimeout(extensionInstance.showAnchorPreview, 1000);
      // });
    },

    handleMouseOver: function (event) {
      var $target = $(event.target);
      if ("mouseover" == event.type && $target.parents(".grid-stack-item").hasClass("item--me-focus")) {
        if ($target.parents(".rex-element-container").length != 0) {
          this.traceELMNT = $target.parents(".rex-element-container")[0];
          this.containsWpcf7 = $(this.traceELMNT).find(".wpcf7").length != 0;
          this.viewRexelementToolbox();
        } else {
          this.handleBlur(event);
        }
      }
    },

    traceInputRexElement: function (event) {
      if ("click" == event.type) {
        // Check if cursor is inside rexelement
        var nodeToFix = MediumEditor.selection.getSelectionStart(this.base.options.ownerDocument);
        if ($(nodeToFix).parents(".rex-element-container").length != 0) {
          this.traceELMNT = $(nodeToFix).parents(".rex-element-container")[0];
          this.viewRexelementToolbox();
        } else {
          this.handleBlur(event);
        }
      }
    },

    handleClickDeleteRexelement: function (e) {
      this.hideRexelementToolbox();
      var $elementContainer = $(this.traceELMNT).parents(".rex-element-wrapper");
      var $paragraphContainer = $elementContainer.parents("p.rex-elements-paragraph");
      $elementContainer.remove();
      if ($paragraphContainer.find(".rex-element-wrapper").length == 0) {
        $paragraphContainer.remove();
      }
    },

    handleClickEditRexelement: function (e) {
      this.hideRexelementToolbox();
      var $elementWrapper = $(this.traceELMNT).parents(".rex-element-wrapper");

      if (this.containsWpcf7) {
        this.setOutline($(this.traceELMNT).find('.wpcf7-form'), '#00ACFF');
      }

      var blockID = $(this.traceELMNT).parents(".grid-stack-item").attr("id");

      var data = {
        eventName: "rexlive:openRexElementEditor",
        elementData: Rexbuilder_Rexelement.generateElementData($elementWrapper),
        blockID: blockID
      };
      $elementWrapper.parents(".text-wrap").blur();
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    },

    hideAnchorPreview: function (event) {
      var anchorLinkPreview = document.getElementsByClassName("medium-editor-anchor-preview");
      for (var i = 0; i < anchorLinkPreview.length; i++) {
        anchorLinkPreview[i].style.display = "none";
      }
    },

    showAnchorPreview: function (event) {
      var anchorLinkPreview = document.getElementsByClassName("medium-editor-anchor-preview");
      for (var i = 0; i < anchorLinkPreview.length; i++) {
        anchorLinkPreview[i].style.display = "block";
      }
    },

    /**
     * Sets the outline of a DOM element
     * @param {DOM Element} element Element which needs the outline
     * @param {String} color The color of the outline
     */
    setOutline: function ($element, color) {
      $element.css("outline", "2px solid " + color);
      $element.css("outline-offset", "-1px");
    },

    clearOutline: function ($element) {
      $element.css("outline", '').css("outline-offset", '');
    },

    /**
     * Place rexelement tools on top of rexelement
     */
    placeRexelementToolbox: function () {
      var targetCoords = this.traceELMNT.getBoundingClientRect();
      // this.rexelementTools.style.height = targetCoords.height + "px";
      this.rexelementTools.style.width = targetCoords.width + "px";
      this.rexelementTools.style.left = (targetCoords.left + ((targetCoords.width - this.rexelementTools.offsetWidth) / 2)) + "px";
      this.rexelementTools.style.top = (window.scrollY + targetCoords.top - this.rexelementTools.offsetHeight / 2 - 11) + "px";
    },

    hideRexelementToolbox: function (event) {
      this.rexelementTools.style.display = "none";
    },

    viewRexelementToolbox: function (event) {
      this.rexelementTools.style.display = "block";
      this.placeRexelementToolbox();
    },

    handlePositionToolbar: function (event) {
      var element = editorInstance.getSelectedParentElement();
      var toolbar = this.base.getExtensionByName('toolbar');
      var $toolbar = $(toolbar.toolbar);
      if (this.insideRexElement(element)) {
        $toolbar.addClass("medium-toolbar-hover-rexelement");
        $toolbar.find("button.medium-editor-action:not(.hide-tool-rexelement)").first().addClass("medium-editor-button-first");
        $toolbar.find("button.medium-editor-action:not(.hide-tool-rexelement)").last().addClass("medium-editor-button-last");
        toolbarActiveOnRexelement = true;
      } else {
        this.restoreElementClasses($toolbar);
        toolbarActiveOnRexelement = false;
      }
    },

    handleHideToolbar: function (event) {
      if (toolbarActiveOnRexelement) {
        var toolbar = this.base.getExtensionByName('toolbar');
        var $toolbar = $(toolbar.toolbar);
        this.restoreElementClasses($toolbar);
        toolbarActiveOnRexelement = false;
      }
    },

    restoreElementClasses: function ($toolbar) {
      $toolbar.removeClass("medium-toolbar-hover-rexelement");
      $toolbar.find("button.medium-editor-action:not(.hide-tool-rexelement)").first().removeClass("medium-editor-button-first");
      $toolbar.find("button.medium-editor-action:not(.hide-tool-rexelement)").last().removeClass("medium-editor-button-last");

      $toolbar.find("button.medium-editor-action").first().addClass("medium-editor-button-first");
      $toolbar.find("button.medium-editor-action").last().addClass("medium-editor-button-last");
    },

    handleBlur: function (event) {
      if (this.containsWpcf7) {
        this.clearOutline($(this.traceELMNT).find('.wpcf7-form'));
      }

      var $target = $(event.target);
      if ($target.parents(".rex-element-wrapper").length == 0 && $target.parents(".rexelement-tools").length == 0) {
        this.hideRexelementToolbox();
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
      /*if ($node.hasClass("rex-button-text")) {
        //siamo dentro un rexbutton
        safe = false;
      } else*/ if ($node.prev().hasClass("rex-element-wrapper") && !$node.parent().hasClass("medium-editor-element")) {
        //prima c'è un rexelement e non siamo nel contenitore dell'editor
        safe = false;
      } else if (this.isNodeBefore(node, mediumEditorOffset, "rex-element-wrapper")) {
        //il nodo prima è un rexelement
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

    isInsideRexelementParagraph: function (node) {
      var $node = $(node);
      // if is a rexelement paragraph
      if ($node.hasClass("rex-elements-paragraph")) {
        return true;
      }
      // if node is inside a rexelement paragraph
      if ($node.parents(".rex-elements-paragraph").length != 0) {
        return true;
      }
      return false;
    },

    /**
     * Checks if node is inside or a rexelement
     * @param {Object} node Node to check
     */
    insideRexElement: function (node) {
      var $node = $(node);
      // if is a rexelement
      if ($node.hasClass("rex-element-wrapper")) {
        return true;
      }
      // if node is inside a rexelement
      if ($node.parents(".rex-element-wrapper").length != 0) {
        return true;
      }
      return false;
    }
  });

  var RexWpcf7Extension = MediumEditor.Extension.extend({
    name: 'rexwpcf7-input',
    init: function () {
      this.traceForm = null;
      this.traceFormRow = null;
      this.traceFormColumn = null;
      this.traceColumnContent = null;

      this.columnsSelected;

      // Creating the form toolbox
      this.formTools = null;
      this.createFormTools();

      // Creating the tools displayed on a form row
      this.formRowTools = document.createElement("div");
      this.formRowTools.contentEditable = false;
      this.formRowTools.classList.add("rexwpcf7-row-tools");
      this.formRowTools.style.display = "none";
      this.formRowTools.innerHTML = tmpl("tmpl-rexwpcf7-row-tools", {});
      $(document.getElementsByTagName("body")[0]).append(this.formRowTools);

      // Creating the tools displayed on a form column
      this.formColumnTools = document.createElement("div");
      this.formColumnTools.contentEditable = false;
      this.formColumnTools.classList.add("rexwpcf7-column-tools");
      this.formColumnTools.style.display = "none";
      this.formColumnTools.innerHTML = tmpl("tmpl-rexwpcf7-column-tools", {});
      $(document.getElementsByTagName("body")[0]).append(this.formColumnTools);

      // Creating the columns selection toolbar
      this.formSelectColumnsToolbar = document.createElement("div");
      this.formSelectColumnsToolbar.id = "wpcf7-select-columns-number";
      this.formSelectColumnsToolbar.classList.add("medium-editor-toolbar");
      this.formSelectColumnsToolbar.classList.add("medium-toolbar-arrow-over");
      this.formSelectColumnsToolbar.innerHTML = tmpl("tmpl-wpcf7-select-columns", {});
      $(document.getElementsByTagName("body")[0]).append(this.formSelectColumnsToolbar);

      this.addRowBtn = $(this.formTools).find(".wpcf7-add-new-row")[0];

      this.cloneFormRowBtn = $(this.formRowTools).find(".rex-wpcf7-row-clone")[0];
      this.deleteFormRowBtn = $(this.formRowTools).find(".rex-wpcf7-row-delete")[0];
      
      this.settingsFormColumnBtn = $(this.formColumnTools).find(".rex-wpcf7-column-settings")[0];
      this.cloneFormColumnBtn = $(this.formColumnTools).find(".rex-wpcf7-column-clone")[0];
      this.deleteFormColumnBtn = $(this.formColumnTools).find(".rex-wpcf7-column-delete")[0];

      this.on(this.addRowBtn, "click", this.handleClickAddRow.bind(this));

      this.on(this.formSelectColumnsToolbar, "click", this.handleSelectColumns.bind(this));

      this.on(this.cloneFormRowBtn, "click", this.handleClickCloneFormRow.bind(this));
      this.on(this.deleteFormRowBtn, "click", this.handleClickDeleteFormRow.bind(this));

      this.on(this.settingsFormColumnBtn, "click", this.handleClickSettingsFormColumn.bind(this));
      this.on(this.cloneFormColumnBtn, "click", this.handleClickCloneFormColumn.bind(this));
      this.on(this.deleteFormColumnBtn, "click", this.handleClickDeleteFormColumn.bind(this));

      // Trace the cursor position
      this.subscribe("editableMouseover", this.handleMouseOver.bind(this));
      // this.subscribe("editableClick", this.traceInputForm.bind(this));

      this.subscribe("blur", this.handleBlur.bind(this));

      // this.removeMEPlaceholder();
    },

    createFormTools: function () {
      var $formTools = $(document.createElement("div"));

      $formTools.attr('contenteditable', false);
      $formTools.attr('id', 'rex-wpcf7-tools');
      $formTools.addClass("wpcf7-row wpcf7-row__1-column");
      var $columnToInsert = $(document.createElement("div"));
      $columnToInsert.addClass("wpcf7-column with-button");
      $columnToInsert.attr("wpcf7-column-number", 1);

      var plusButton = tmpl("tmpl-rexwpcf7-tools", {});
      $columnToInsert.append(plusButton);
      $formTools.append($columnToInsert);

      this.formTools = $formTools[0];
    },

    removeMEPlaceholder: function() {
      _removePlaceholder($(document.getElementsByTagName("body")[0]).find('.wpcf7-form').parents('.text-wrap'));
    },

    ///////////////
    /* HANDLERS */
    ///////////////
    
    handleMouseOver: function (event) {
      var $target = $(event.target);

      if ("mouseover" == event.type && $target.parents(".grid-stack-item").hasClass("item--me-focus")) {
        var needToAddPlusButtonsListener = ("undefined" == typeof this.addFormContentBtns);

        if ($target.is(".wpcf7-form")) {
          this.traceForm = $target[0];
          this.setOutline($(this.traceForm), "#00ACFF");
        }

        if ($target.parents(".wpcf7-form").length != 0) {
          this.traceForm = $target.parents(".wpcf7-form")[0];
          this.addFormContentBtns = $(this.traceForm).find(".wpcf7-add-new-form-content");

          if (needToAddPlusButtonsListener) {
            var noPlusButtonsInForm = ("undefined" == typeof this.addFormContentBtns);
            if (!noPlusButtonsInForm) {
              this.on(this.addFormContentBtns, "click", this.handleClickAddFormContent.bind(this));
            }
          } else {
            this.off(this.addFormContentBtns, "click", this.handleClickAddFormContent.bind(this));
          }
          this.placeFormToolbox();
          this.hideColumnToolbox();
          // this.clearOutlines("form");
          this.clearOutlines("rows");
          this.clearOutlines("columns");
          this.hidePlusButtons();
          this.setOutline($(this.traceForm), "#00ACFF");

          if ($target.parents(".wpcf7-row").length != 0) {
            // The pointer is inside a form row
            this.traceFormRow = $target.parents(".wpcf7-row")[0];
            
            this.setOutline($(this.traceFormRow), "#00ACFF");

            this.hideAllRowToolsInsideRow();
            this.putRowToolsInsideRow();

            if ($target.parents('#rex-wpcf7-tools').length == 0 && !$target.is('#rex-wpcf7-tools')) {
              this.viewRowToolbox();
              this.hideSelectColumnsToolbar();
            } else {
              this.hideRowToolbox();
            }

            if ($target.parents(".wpcf7-column").length != 0 && $target.parents(".wpcf7-column").find(".wpcf7-add-new-form-content").length != 0) {
              // The pointer is inside a form column (and obviously row)
              $target.parents(".wpcf7-column").find(".wpcf7-add-new-form-content").css("display", "block");
            } else if ($target.hasClass("wpcf7-column") && $target.find(".wpcf7-add-new-form-content").length != 0) {
              // The pointer is inside a form column (and obviously row)
              $target.find(".wpcf7-add-new-form-content").css("display", "block");
            }
            
            if ($target.parents(".wpcf7-column").length != 0 && $target.parents(".wpcf7-column").find(".wpcf7-add-new-form-content").length == 0 && $target.parents(".wpcf7-column").find(".wpcf7-add-new-row").length == 0) {
              // The pointer is inside a form column (and obviously row)
              this.traceFormColumn = $target.parents(".wpcf7-column")[0];
              this.traceColumnContent = this.findElementToOutline(this.traceFormColumn);

              if ($target[0] == this.traceColumnContent || $target.parents().filter(this.traceColumnContent).length != 0) {
                
                this.hideRowToolbox();
                this.viewColumnToolbox();
                this.setOutline($(this.traceColumnContent), "#FF0055");
              }
            } else if ($target.hasClass("wpcf7-column") && $target.find(".wpcf7-add-new-form-content").length == 0 && $target.find(".wpcf7-add-new-row").length == 0) {
              // The pointer is inside a form column (and obviously row)
              this.traceFormColumn = $target[0];
              this.traceColumnContent = this.findElementToOutline(this.traceFormColumn);
            }
          }
        } else {
          if (!$target.is(".wpcf7-form")) {
            this.handleBlur(event);
          }
        }
      }
    },

    traceInputForm: function (event) {},

    handleClickAddFormContent: function (event) {
      this.hideAllToolbars();
      var $elementWrapper = $(this.traceForm).parents(".rex-element-wrapper");
      var formID = $elementWrapper.attr("data-rex-element-id");
      var eventPath = event.path;
      var row_number;
      var column_number;

      for (var i = 0; i < eventPath.length - 2; i++) {
        if(eventPath[i].classList.contains("wpcf7-row")) {
          row_number = eventPath[i].getAttribute("wpcf7-row-number");
          break;
        }
      }

      for (var i = 0; i < eventPath.length - 2; i++) {
        if(eventPath[i].classList.contains("wpcf7-column")) {
          column_number = eventPath[i].getAttribute("wpcf7-column-number");
          break;
        }
      }

      var data = {
        eventName: "rexlive:openRexWpcf7AddContent",
        insertionPoint: {
          formID: formID,
          row_number: row_number,
          column_number: column_number
        }
      };
      $elementWrapper.parents(".text-wrap").blur();
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
      this.updateHeight();
    },

    handleClickAddRow: function (event) {
      this.viewSelectColumnsToolbar();

      this.hideRowToolbox();
      this.hideColumnToolbox();
    },

    handleClickFormSettings: function (event) {
      this.hideAllToolbars();
      var $elementWrapper = $(this.traceForm).parents(".rex-element-wrapper");
      var $form = $elementWrapper.find(".wpcf7");

      var data = {
        eventName: "rexlive:openRexWpcf7EditForm",
        formData: Rexbuilder_Rexwpcf7.generateFormData($form),
      };
      $elementWrapper.parents(".text-wrap").blur();
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    },

    handleSelectColumns: function (event) {
      this.hideSelectColumnsToolbar();
      this.hideRowToolbox();
      this.hideColumnToolbox();

      var formID = $(this.traceForm).parents(".rex-element-wrapper").attr("data-rex-element-id");

      var $el = $(event.target);
      if (!$el.hasClass("medium-editor-action")) {
        $el = $el.parents(".medium-editor-action");
      }

      if ($el.hasClass("select-1-column")) {
        this.columnsSelected = 1;
      } else if ($el.hasClass("select-2-columns")) {
        this.columnsSelected = 2;
      } else if ($el.hasClass("select-3-columns")) {
        this.columnsSelected = 3;
      } else if ($el.hasClass("select-4-columns")) {
        this.columnsSelected = 4;
      }

      Rexbuilder_Rexwpcf7.addNewRow(formID, this.columnsSelected);
      this.hideFormToolbox();

      this.updatePlusButtons();

      this.updateHeight();
      this.focusBlock();
    },

    handleClickCloneFormRow: function (event) {
      this.hideSelectColumnsToolbar();
      this.hideRowToolbox();
      this.hideColumnToolbox();

      var formID = $(this.traceForm).parents(".rex-element-wrapper").attr("data-rex-element-id");
      var $rowToClone = $(this.traceFormRow).clone();
      var numberRowBefore = parseInt($rowToClone.attr("wpcf7-row-number"));

      Rexbuilder_Rexwpcf7.addRow(formID, $rowToClone, numberRowBefore);

      this.updatePlusButtons();
      this.updateHeight();
      this.focusBlock();
    },

    handleClickDeleteFormRow: function (event) {
      this.hideColumnToolbox();
      this.hideRowToolbox();

      var formID = $(this.traceForm).parents(".rex-element-wrapper").attr("data-rex-element-id");
      var rowNumberToDelete = $(this.traceFormRow).attr("wpcf7-row-number");
      var blockIDToFocusAfterDelete = $(this.traceForm).parents(".grid-stack-item").attr("id");

      Rexbuilder_Rexwpcf7.deleteRow(formID, rowNumberToDelete, blockIDToFocusAfterDelete);

      this.updateHeight();
      this.focusBlock();
    },

    handleClickSettingsFormColumn: function (event) {
      this.setOutline($(this.traceColumnContent), "#FF0055");
      this.hideAllToolbars();
      var $elementWrapper = $(this.traceForm).parents(".rex-element-wrapper");
      var $thisColumn = $(this.traceFormColumn);
      var spanDataExists = $thisColumn.find(".rex-wpcf7-column-content-data").length != 0 ? true : false;
      var fileCaptionExists = $thisColumn.find(".rex-wpcf7-file-caption").length != 0 ? true : false;
      var blockID = $(this.traceForm).parents(".grid-stack-item").attr("id");

      var data = {
        eventName: "rexlive:openRexWpcf7EditContent",
        columnContentData: Rexbuilder_Rexwpcf7.generateColumnContentData($thisColumn, spanDataExists),
        spanDataExists: spanDataExists,
        fileCaptionExists: fileCaptionExists,
        blockID: blockID
      };
      $elementWrapper.parents(".text-wrap").blur();
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    },

    handleClickCloneFormColumn: function (event) {
      this.hideSelectColumnsToolbar();
      this.hideRowToolbox();
      this.hideColumnToolbox();

      var formID = $(this.traceForm).parents(".rex-element-wrapper").attr("data-rex-element-id");
      var clonedColumnNumber = $(this.traceFormColumn).attr("wpcf7-column-number");
      var numberRowBefore = parseInt($(this.traceFormRow).attr("wpcf7-row-number"));

      Rexbuilder_Rexwpcf7.addClonedColumnRow(formID, clonedColumnNumber, numberRowBefore);

      this.updatePlusButtons();
      this.updateHeight();
      this.focusBlock();
    },

    handleClickDeleteFormColumn: function (event) {
      this.hideColumnToolbox();

      var formID = $(this.traceForm).parents(".rex-element-wrapper").attr("data-rex-element-id");
      var $columnToDelete = $(this.traceFormColumn);
      var rowNumberToDelete = $(this.traceFormRow).attr("wpcf7-row-number");
      var columnNumberToDelete = $(this.traceFormColumn).attr("wpcf7-column-number");
      Rexbuilder_Rexwpcf7.deleteColumnContent(formID, rowNumberToDelete, columnNumberToDelete);

      this.updatePlusButtons();
      this.focusBlock();
    },

    handleBlur: function (event) {
      this.clearOutlines("form");
      this.clearOutlines("rows");
      this.clearOutlines("columns");
      this.hidePlusButtons();

      var $target = $(event.target);

      if ($target.parents(".wpcf7").length == 0 && $target.parents("#rex-wpcf7-tools").length == 0 && $target.parents(".rexwpcf7-row-tools").length == 0 && $target.parents(".rexwpcf7-column-tools").length == 0 && $target.parents("#wpcf7-select-columns-number").length == 0) {
        this.hideAllToolbars();
      }

      this.updateHeight();
    },

    //////////////////////////
    /* TOOLBOXES & TOOLBARS */
    //////////////////////////
    
    hideAllRowToolsInsideRow: function () {
      var $form = $(this.traceForm);
      $form.find(".rexwpcf7-row-tools").hide();
    },

    putRowToolsInsideRow: function () {
      var $formRow = $(this.traceFormRow);
      var $formRowTools = $(this.formRowTools);
      var $formRowToolsInsideRow = $formRow.find(".rexwpcf7-row-tools");

      if ($formRowToolsInsideRow.length == 0) {
        var $rowToolsCloned = $formRowTools.clone();
        $rowToolsCloned.hide();
        $rowToolsCloned.find(".rex-wpcf7-row-clone").remove();
        $rowToolsCloned.find(".rex-wpcf7-row-delete").remove();
        $formRow.prepend($rowToolsCloned);

        // $formRowToolsInsideRow = $formRow.find(".rexwpcf7-row-tools");
        // $formRowToolsInsideRow.show();
      } else {
        // $formRowToolsInsideRow.show();
      }

      // this.viewRowToolboxInsideRow();
    },

    placeFormToolbox: function (event) {
      var $traceForm = $(this.traceForm);
      var $formRows = $traceForm.find('.wpcf7-rows');

      if ($formRows.find('.wpcf7-row').length == 0) {
        var newRowNumber = 1;
      } else {
        var newRowNumber = parseInt($formRows.find('.wpcf7-row').not('#rex-wpcf7-tools').eq(-1).attr('wpcf7-row-number')) + 1;
      }

      $(this.formTools).attr('wpcf7-row-number', newRowNumber);
      $formRows.append(this.formTools);

      this.updateHeight();
    },

    hideFormToolbox: function (event) {
      $(this.formTools).detach();
    },
    
    viewRowToolbox: function (event) {
      this.formRowTools.style.display = "block";
      this.placeRowToolbox();
      this.viewRowToolboxInsideRow();
    },

    placeRowToolbox: function () {
      var formCoords = this.traceForm.getBoundingClientRect();
      var targetCoords = this.traceFormRow.getBoundingClientRect();
      var offsetFirstRow = (parseInt($(this.traceFormRow).attr("wpcf7-row-number")) == 1) ? 20 : 0;

      this.formRowTools.style.width = targetCoords.width/10 + "px";
      // this.formRowTools.style.left = (targetCoords.left + ((targetCoords.width - this.formRowTools.offsetWidth) / 2)) + "px";
      this.formRowTools.style.left = (targetCoords.left + targetCoords.width - targetCoords.width/10) + "px";
      this.formRowTools.style.top = (window.scrollY + targetCoords.top - this.formRowTools.offsetHeight / 2 + offsetFirstRow - 11) + "px";
    },

    hideRowToolbox: function (event) {
      this.formRowTools.style.display = "none";
      this.hideRowToolboxInsideRow();
    },

    viewRowToolboxInsideRow: function () {
      var $formRowToolsInsideRow = $(this.traceFormRow).find(".rexwpcf7-row-tools");

      $formRowToolsInsideRow.show();
      $formRowToolsInsideRow.find(".rex-wpcf7-row-drag").show();
      this.placeRowToolboxInsideRow();
    },

    placeRowToolboxInsideRow: function () {
      var $formRowToolsInsideRow = $(this.traceFormRow).find(".rexwpcf7-row-tools");
      var rowCoords = this.traceFormRow.getBoundingClientRect();
      var blockCoords = $(this.traceForm).parents(".grid-stack-item").find(".ui-focused-element-highlight")[0].getBoundingClientRect();

      var offsetFirstRow = (parseInt($(this.traceFormRow).attr("wpcf7-row-number")) == 1) ? 20 : 0;

      $formRowToolsInsideRow[0].style.width = rowCoords.width/10 + "px";
      $formRowToolsInsideRow[0].style.left = (rowCoords.left + rowCoords.width - rowCoords.width/10 - blockCoords.left) + "px";
      $formRowToolsInsideRow[0].style.top = rowCoords.top - blockCoords.top + offsetFirstRow - 11 + "px";
      
      Rexbuilder_Rexwpcf7.setRowsSortable();
    },

    hideRowToolboxInsideRow: function () {
      var $formRowToolsInsideRow = $(this.traceFormRow).find(".rexwpcf7-row-tools");

      $formRowToolsInsideRow.hide();
    },

    viewColumnToolbox: function (event) {
      var $column = $(this.traceFormColumn);
      if ($column.find(".wpcf7-add-new-form-content").length == 0) {
        this.formColumnTools.style.display = "block";
        this.placeColumnToolbox();
      } else {
        this.hideColumnToolbox();
      }
    },

    placeColumnToolbox: function () {
      var targetCoords = this.traceColumnContent.getBoundingClientRect();

      this.formColumnTools.style.width = targetCoords.width + "px";
      this.formColumnTools.style.left = (targetCoords.left + ((targetCoords.width - this.formColumnTools.offsetWidth) / 2)) + "px";
      this.formColumnTools.style.top = (window.scrollY + targetCoords.top - this.formColumnTools.offsetHeight / 2 - 11) + "px";
    },

    hideColumnToolbox: function (event) {
      this.formColumnTools.style.display = "none";
    },

    viewSelectColumnsToolbar: function(target) {
      this.placeSelectColumnsToolbar();
      this.formSelectColumnsToolbar.classList.add("medium-editor-toolbar-active");
    },

    placeSelectColumnsToolbar: function() {
      var targetCoords = this.addRowBtn.getBoundingClientRect();

      this.formSelectColumnsToolbar.style.left = (targetCoords.left + ((targetCoords.width - this.formSelectColumnsToolbar.offsetWidth) / 2)) + "px";
      this.formSelectColumnsToolbar.style.top = (window.scrollY + targetCoords.top - this.formSelectColumnsToolbar.offsetHeight + 75) + "px";
    },

    hideSelectColumnsToolbar: function() {
      this.formSelectColumnsToolbar.classList.remove("medium-editor-toolbar-active");
    },

    hideAllToolbars: function () {
      this.hideFormToolbox();
      this.hideRowToolbox();
      this.hideColumnToolbox();
      this.hideSelectColumnsToolbar();
    },

    /////////////////////
    /* OTHER FUNCTIONS */
    /////////////////////
    
    /**
     * Sets the outline of a DOM element
     * @param {DOM Element} element Element which needs the outline
     * @param {String} color The color of the outline
     */
    setOutline: function ($element, color) {
      $element.css("outline", "2px solid " + color);
      $element.css("outline-offset", "-1px");
    },

    /**
     * @param  {String} element Can be "form", "rows" or "columns"
     */
    clearOutlines: function (element) {
      switch (element) {
        case "form":
          $(this.traceForm)
            .css("outline", "")
            .css("outline-offset", "");
          break;
        case "rows":
          $(this.traceForm).find(".wpcf7-row")
            .css("outline", "")
            .css("outline-offset", "");
          break;
        case "columns":
          var that = this;
          var $formColumns = $(this.traceForm).find(".wpcf7-column").not('.wpcf7-add-new-form-content').not('.wpcf7-add-new-row');

          $(this.traceForm).find(".wpcf7-column").each(function () {
            if ($(this).find(".wpcf7-add-new-form-content").length == 0 && $(this).find(".wpcf7-add-new-row").length == 0) {
              $(that.findElementToOutline(this))
                .css("outline", "")
                .css("outline-offset", "");
            }
          });
          break;
        default:
          break;
      }
    },

    updateHeight: function() {
      var $textWrap = $(this.traceForm).parents('.text-wrap');
      Rexbuilder_Util_Editor.updateBlockContainerHeight($textWrap);
    },

    focusBlock: function() {
      var blockIDToFocus = $(this.traceForm).parents(".grid-stack-item").attr('id');

      setTimeout(function() { // Necessary!
        $(document.getElementById(blockIDToFocus))
          .dblclick()
          .addClass('item--me-focus');
        $(document.getElementById(blockIDToFocus)).parents('rexpansive_section')
          .addClass('block-editing')
          .addClass('focusedRow');
      }, 0);
    },

    // findElementToOutline: function (formColumn) {
    //   var $formColumn = $(formColumn);
    //   var elementToOutlineClass;
    //   var wrapToOultineClass = null;

    //   if ( $formColumn.find(".wpcf7-form-control").length != 0 ) {
    //     elementToOutlineClass = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control")[0].classList);
    //   }
    //   if ( $formColumn.find(".wpcf7-form-control-wrap").length != 0 ) {
    //     wrapToOultineClass = /[a-z]+\-[0-9]+/.exec($formColumn.find(".wpcf7-form-control-wrap")[0].classList);
    //   }
    //   if( null == elementToOutlineClass ) {
    //     if ( null !== wrapToOultineClass ) {
    //       elementToOutlineClass = wrapToOultineClass[0];
    //     }
    //   } else {
    //      elementToOutlineClass = elementToOutlineClass[0];
    //   }

    //   var elementToOutlineType = /[a-z]+/.exec(elementToOutlineClass)[0];
    //   elementToOutlineType = (elementToOutlineType == "menu") ? "select" : elementToOutlineType;

    //   switch (elementToOutlineType) {
    //     case "text":
    //     case "textarea":
    //     case "number":
    //     case "email":
    //     case "submit":
    //     case "select":
    //     console.log("type .wpcf7-" + elementToOutlineType)
    //       return $formColumn.find(".wpcf7-" + elementToOutlineType)[0];
    //       break;
    //     case "radio":
    //     case "acceptance":
    //     case "file":
    //     console.log("class ." + elementToOutlineClass)
    //       return $formColumn.find("." + elementToOutlineClass).eq(0)[0];
    //       break;
    //     default:
    //       break;
    //   }
    // },

    findElementToOutline: function (formColumn) {
        var $formColumn = $(formColumn);

        var possibleFields = {
            text: $formColumn.find('[type=text]').length != 0,
            email: $formColumn.find('.wpcf7-email').length != 0,
            number: $formColumn.find('.wpcf7-number').length != 0,
            textarea: $formColumn.find('.wpcf7-textarea').length != 0,
            select: $formColumn.find('.wpcf7-select').length != 0,
            radio: $formColumn.find('.wpcf7-radio').length != 0,
            acceptance:$formColumn.find('.wpcf7-acceptance').length != 0, 
            file: $formColumn.find('.wpcf7-file').length != 0,
            submit: $formColumn.find('.wpcf7-submit').length != 0
        }

        for (var type in possibleFields) {
            if (possibleFields[type] == true) {
                var elementToOutlineType = type;
                break;
            }
        }

        switch (elementToOutlineType) {
            case "text":
            case "textarea":
            case "number":
            case "email":
            case "submit":
            case "select":
                return $formColumn.find('.wpcf7-form-control')[0];
                break;
            case "radio":
            case "acceptance":
            case "file":
                return $formColumn.find('.wpcf7-form-control-wrap')[0];
                break;
            default:
                break;
        }
    },

    updatePlusButtons: function() {
      this.addFormContentBtns = $(this.traceForm).find(".wpcf7-add-new-form-content");
      this.off(this.addFormContentBtns, "click", this.handleClickAddFormContent.bind(this));
      this.on(this.addFormContentBtns, "click", this.handleClickAddFormContent.bind(this));
    },

    hidePlusButtons: function () {
      $(this.traceForm).find(".wpcf7-add-new-form-content").css("display", "none");
    },
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

    // Rexbuilder_Util.$document.on("mouseenter", ".medium-insert-buttons-show", function(e) {
    //   var $el = $(this);
    //   if ($el.find('.medium-insert-buttons').attr('data-active-addon') === 'images') {
    //     $el.find('.medium-insert-buttons').find('button[data-addon="images"]').click();
    //     return;
    //   }

    //   $el.find('.medium-insert-buttons-addons').fadeToggle();
    //   $el.find('.medium-insert-buttons-show').toggleClass('medium-insert-buttons-rotate');
    // });
  };

  var _addEditableInputEvents = function () {
    editorInstance.subscribe("editableInput", function (e, elem) {
      var $elem = $(elem).parents(".grid-stack-item");
      // var galleryInstance = $elem.parent().data()
      //   .plugin_perfectGridGalleryEditor;
      // galleryInstance.fixElementTextSize($elem[0], null, null);

      var data = {
        eventName: "rexlive:edited",
        modelEdited: $elem
          .parents(".rexpansive_section")
          .hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
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
    rexWpcf7ExtensionInstance = new RexWpcf7Extension();

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
        'rexelement-input': new RexElementExtension(),
        'rexwpcf7-input' : rexWpcf7ExtensionInstance,
        onlySVGFixExtension : new OnlySVGFixExtension(),
        textEditing: new TextEditingExtension(),
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
    rangy.init();
    _createToolbarContainer();
    _createEditor();
    _linkDocumentListeners();
  };

  return {
    init: init,
    addElementToTextEditor: _addElementToTextEditor,
    destroyMediumEditor: _destroyMediumEditor,
    getEditorInstance: _getEditorInstance,
    createEditor: _createEditor,
    triggerMEEvent: _triggerMEEvent,
    openTextGradientColor: _openTextGradientColor,
    removePlaceholder: _removePlaceholder
  };
})(jQuery);
