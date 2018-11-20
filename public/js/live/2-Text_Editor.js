/**
 * Object that handles the live text editor inside the blocks
 * 
 * @since 2.0.0
 */
var TextEditor = (function($) {
  "use strict";

  var editorInstance;

  var pickerExtensionInstance;
  // var htmlExtensionInstance;
  var headingTagsExtensionInstance;
  var formattingTagsExtensionInstance;
  var justifyExtensionIntance;
  var listExtensionInstance;
  // var dropDownListExtensionInstance;

  var currentTextSelection;

  var _addElementToTextEditor = function($textWrap) {
    editorInstance.addElements($textWrap);
    _addMediumInsertToElement($textWrap);
  };

  var _addMediumInsertToElement = function($textWrap) {
    $textWrap.mediumInsert({
      editor: editorInstance,
      label: "<i class='l-svg-icons'><svg><use xlink:href='#Z001-Plus'></use></svg></i>",
      addons: {
        images: false,
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
          actions: null,
          preview: false
        }
        // tables: {}
      }
    });
  };

  /**
   * //Color picker extension
   * Gets the color of the current text selection
   */
  var getCurrentTextColor = function() {  
    return $(editorInstance.getSelectedParentElement()).css("color");
  };

  var setColor = function(color) {
    var finalColor = color ? color.toRgbString() : "rgba(0,0,0,0)";
    pickerExtensionInstance.base.importSelection(currentTextSelection);
    pickerExtensionInstance.document.execCommand("styleWithCSS", false, true);
    pickerExtensionInstance.document.execCommand(
      "foreColor",
      false,
      finalColor
    );
  };

  var initPicker = function(element) {
    var $picker = $(element);
    var $picker_preview = $picker.find('.meditor-color-picker--preview');
    $picker.spectrum({
      allowEmpty: true,
      color: "#000",
      showInput: true,
      showAlpha: true,
      showPalette: true,
      showInitial: true,
      hideAfterPaletteSelect: true,
      containerClassName: 'meditor-spectrum-color-picker',
      preferredFormat: "hex3",
      change: function(color) {
        setColor(color);
        $picker_preview.css('background-color',color.toRgbString());
      },
      move: function(color) {
        setColor(color);
      },
      hide: function(color) {
        setColor(color);
        $picker_preview.css('background-color',color.toRgbString());
      },
      palette: [
        ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
        ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
        [
          "#f4cccc",
          "#fce5cd",
          "#fff2cc",
          "#d9ead3",
          "#d0e0e3",
          "#cfe2f3",
          "#d9d2e9",
          "#ead1dc"
        ],
        [
          "#ea9999",
          "#f9cb9c",
          "#ffe599",
          "#b6d7a8",
          "#a2c4c9",
          "#9fc5e8",
          "#b4a7d6",
          "#d5a6bd"
        ],
        [
          "#e06666",
          "#f6b26b",
          "#ffd966",
          "#93c47d",
          "#76a5af",
          "#6fa8dc",
          "#8e7cc3",
          "#c27ba0"
        ],
        [
          "#c00",
          "#e69138",
          "#f1c232",
          "#6aa84f",
          "#45818e",
          "#3d85c6",
          "#674ea7",
          "#a64d79"
        ],
        [
          "#900",
          "#b45f06",
          "#bf9000",
          "#38761d",
          "#134f5c",
          "#0b5394",
          "#351c75",
          "#741b47"
        ],
        [
          "#600",
          "#783f04",
          "#7f6000",
          "#274e13",
          "#0c343d",
          "#073763",
          "#20124d",
          "#4c1130"
        ]
      ]
    });

    var close = tmpl('tmpl-tool-close', {});
    var $close = $(close);
    $picker.spectrum('container').append($close);

    var choose = tmpl('tmpl-tool-save', {});
    var $choose = $(choose);
    $picker.spectrum('container').append($choose);

    $close.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $picker.spectrum('container').find('.sp-cancel').trigger('click');
    });

    $choose.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $picker.spectrum('container').find('.sp-choose').trigger('click');
    });
  };

  /**
   * Custom `color picker` extension
   */
  var ColorPickerExtension = MediumEditor.extensions.button.extend({
    name: "colorPicker",
    action: "applyForeColor",
    aria: "color picker",
    contentDefault: "<span class='editor-color-picker'>Text Color<span>",

    init: function() {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action--color-picker");
      this.button.innerHTML = "<span class='meditor-color-picker'><span class='meditor-color-picker__placeholder'>P</span></span><span class='meditor-color-picker--preview'></span>";

      // init spectrum color picker for this button
      initPicker(this.button);

      // use our own handleClick instead of the default one
      this.on(this.button, "click", this.handleClick.bind(this));
      this.subscribe("showToolbar", this.handleShowToolbar.bind(this));
    },
    handleClick: function(event) {
      // keeping record of the current text selection
      var toolbar = editorInstance.getExtensionByName("toolbar");
      if (toolbar) {
        toolbar.hideToolbar();
      }

      currentTextSelection = editorInstance.exportSelection();

      // sets the color of the current selection on the color
      // picker
      $(this.button).spectrum("set", getCurrentTextColor());

      // from here on, it was taken form the default handleClick
      event.preventDefault();
      event.stopPropagation();

      var action = this.getAction();

      if (action) {
        this.execAction(action);
      }
    },

    handleShowToolbar: function(event) {
      var $element = $(editorInstance.getSelectedParentElement());
      var inline_color = $element.prop('style')['color'];
      if( "" !== inline_color ) {
        $(this.button).find('.meditor-color-picker--preview').css('background-color', getCurrentTextColor());
      } else {
        $(this.button).find('.meditor-color-picker--preview').css('background-color', '');
      }
    }
  });

  /**
   * Custom text tag extension
   */
  var TextTagExtension = MediumEditor.extensions.button.extend({
    name: "headingTags",
    action: "",
    contentDefault: "TAGS",
    init: function() {
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
      this.list_active_action.innerHTML = "h1";
      this.list_parent.append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");
      
      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='append-h1'>h1</div><div class='medium-editor-action' data-tag-action='append-h2'>h2</div><div class='medium-editor-action' data-tag-action='append-h3'>h3</div><div class='medium-editor-action' data-tag-action='append-h4'>h4</div><div class='medium-editor-action' data-tag-action='append-h5'>h5</div><div class='medium-editor-action' data-tag-action='append-h6'>h6</div><div class='medium-editor-action' data-tag-action='append-p'>p</div>";

      this.list_actions = this.list_element.querySelectorAll('.medium-editor-action');

      this.button.append(this.list_parent);
      this.button.append(this.list_element);

      this.action_active = "";
      this.all_actions = ['append-h1','append-h2','append-h3','append-h4','append-h5','append-h6'];

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.resetEnv.bind(this));
    },

    isAlreadyApplied: function (node) {
      // this.action_active = '';
      switch( node.nodeName.toLowerCase() ) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
        case 'p':
          this.action_active = 'append-' + node.nodeName.toLowerCase();
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

    setActionListState: function() {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function() {
      this.list_active_action.innerHTML = "h1";
      for(var i=0; i<this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function() {
      if( "" != this.action_active ) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="'+this.action_active+'"]').classList.add('medium-editor-button-active');
        this.list_active_action.innerHTML = this.action_active.replace('append-','');
      }
    },

    resetEnv: function() {
      this.action_active = "";
    },
  
    handleClick: function (event) { 
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized

      var action = undefined;
      if( event.target.hasAttribute('data-tag-action') ) {
        action = event.target.getAttribute('data-tag-action');
      } else if( event.target.parentNode.hasAttribute('data-tag-action') ) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if( 'undefined' != typeof action ) {
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
    init: function() {
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
      this.list_active_action.innerHTML = "<i class='fa fa-bold'></i>";
      this.list_parent.append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");
      
      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='bold'><i class='fa fa-bold'></i></div><div class='medium-editor-action' data-tag-action='italic'><i class='fa fa-italic'></i></div><div class='medium-editor-action' data-tag-action='underline'><i class='fa fa-underline'></i></div>";

      this.list_actions = this.list_element.querySelectorAll('.medium-editor-action');

      this.button.append(this.list_parent);
      this.button.append(this.list_element);

      this.action_active = [];

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.clearListButtons.bind(this));
    },

    checkState: function(node) {
      switch( node.nodeName.toLowerCase() ) {
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
          if( this.mark_active ) {
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
      if( event.target.hasAttribute('data-tag-action') ) {
        action = event.target.getAttribute('data-tag-action');
      } else if( event.target.parentNode.hasAttribute('data-tag-action') ) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if( 'undefined' != typeof action ) {
        editorInstance.execAction(action);
      }
    },

    setActionListState: function() {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function() {
      this.list_active_action.innerHTML = "<i class='fa fa-bold'></i>";
      for(var i=0; i<this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function() {
      for(var i=0; i<this.action_active.length; i++) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="'+this.action_active[i]+'"]').classList.add('medium-editor-button-active');
        if( 0 == i ) {
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
    init: function() {   
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
      this.list_active_action.innerHTML = "<i class='fa fa-list-alt'></i>";
      this.list_parent.append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");
      
      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='insertorderedlist'><i class='fa fa-list-ol'></i></div><div class='medium-editor-action' data-tag-action='insertunorderedlist'><i class='fa fa-list-ul'></i></div>";

      this.list_actions = this.list_element.querySelectorAll('.medium-editor-action');

      this.button.append(this.list_parent);
      this.button.append(this.list_element);

      this.action_active = "";
      this.all_actions = ['insertorderedlist','insertunorderedlist'];

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.resetEnv.bind(this));
    },

    isAlreadyApplied: function (node) {
      for(var i=0;i<this.all_actions.length;i++) {
        if( this.base.queryCommandState(this.all_actions[i]) ) {
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

    setActionListState: function() {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function() {
      this.list_active_action.innerHTML = "<i class='fa fa-list-alt'></i>";
      for(var i=0; i<this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function() {
      if( "" != this.action_active ) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="'+this.action_active+'"]').classList.add('medium-editor-button-active');
        switch( this.action_active ) {
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

    resetEnv: function() {
      this.action_active = "";
    },
  
    handleClick: function (event) { 
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized

      var action = undefined;
      if( event.target.hasAttribute('data-tag-action') ) {
        action = event.target.getAttribute('data-tag-action');
      } else if( event.target.parentNode.hasAttribute('data-tag-action') ) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if( 'undefined' != typeof action ) {
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
    init: function() {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.innerHTML = "<i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#C005-Layout'></use></svg></i>";

      this.on(this.button, 'click', this.handleClick.bind(this));
    },

    handleClick: function(event) {
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
    init: function() {   
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
      this.list_parent.append(this.list_active_action);
      // list element
      this.list_element = this.document.createElement("div");
      this.list_element.classList.add("me__action-list");
      
      this.list_element.innerHTML = "<div class='medium-editor-action' data-tag-action='justifyLeft'><i class='fa fa-align-left'></i></div><div class='medium-editor-action' data-tag-action='justifyCenter'><i class='fa fa-align-center'></i></div><div class='medium-editor-action' data-tag-action='justifyRight'><i class='fa fa-align-right'></i></div><div class='medium-editor-action' data-tag-action='justifyFull'><i class='fa fa-align-justify'></i></div>";

      this.list_actions = this.list_element.querySelectorAll('.medium-editor-action');

      this.action_active = '';
      this.all_actions = ['justifyLeft','justifyCenter','justifyRight','justifyFull'];

      this.button.append(this.list_parent);
      this.button.append(this.list_element);

      this.on(this.button, 'click', this.handleClick.bind(this));
      this.subscribe("showToolbar", this.resetEnv.bind(this));
    },

    isAlreadyApplied: function() {
      for(var i=0;i<this.all_actions.length;i++) {
        if( this.base.queryCommandState(this.all_actions[i]) ) {
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

    setActionListState: function() {
      this.clearListButtons();
      this.activateListButtons();
    },

    clearListButtons: function() {
      this.list_active_action.innerHTML = "<i class='fa fa-align-left'></i>";
      for(var i=0; i<this.list_actions.length; i++) {
        this.list_actions[i].classList.remove('medium-editor-button-active');
      }
    },

    activateListButtons: function() {
      if( "" != this.action_active ) {
        this.list_element.querySelector('.medium-editor-action[data-tag-action="'+this.action_active+'"]').classList.add('medium-editor-button-active');
        switch( this.action_active ) {
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

    resetEnv: function() {
      this.action_active = "";
    },
  
    handleClick: function (event) { 
      // Ensure the editor knows about an html change so watchers are notified
      // ie: <textarea> elements depend on the editableInput event to stay synchronized

      var action = undefined;
      if( event.target.hasAttribute('data-tag-action') ) {
        action = event.target.getAttribute('data-tag-action');
      } else if( event.target.parentNode.hasAttribute('data-tag-action') ) {
        action = event.target.parentNode.getAttribute('data-tag-action');
      }

      if( 'undefined' != typeof action ) {
        // action applied already?
        editorInstance.execAction(action);
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
        Rexbuilder_Util_Editor.editedTextWrap.blur();
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

    init: function() {
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
      if( 'undefined' != typeof action ) {
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

    init: function() {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.innerHTML = "<i class='l-svg-icons'><svg><use xlink:href='#A008-Code'></use></svg></i>";

      // use our own handleClick instead of the default one
      this.on(this.button, "click", this.handleClick.bind(this));
    },

    handleClick: function(event) {
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

    init: function() {
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.innerHTML = "<i class='l-svg-icons'><svg><use xlink:href='#A008-Code'></use></svg></i>";

      // use our own handleClick instead of the default one
      this.on(this.button, "click", this.handleClick.bind(this));
      this.subscribe("rexlive:mediumEditor:saveHTMLContent", this.handleHtmlEditorSave.bind(this));
    },

    handleClick: function(event) {
      event.preventDefault();
      event.stopPropagation();

      this.base.selectAllContents();
      var index = this.base.exportSelection().editableElementIndex;

      var meContents = this.base.serialize();
      var htmlSelected = meContents['element-'+index].value;
      htmlSelected = htmlSelected.replace('<span class="text-editor-span-fix" style="display: none;"></span>','').trim();

      var data = {
        eventName: "rexlive:openHTMLEditor",
        htmlContent: htmlSelected
      };
  
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    },

    handleHtmlEditorSave: function(event) {
      this.base.pasteHTML(event.customHTML, {
        cleanPastedHTML: false,
        cleanAttrs: ['dir'],
      });
    }
  });

  var _linkDocumentListeners = function() {
    //function for removing textarea html editor
    Rexbuilder_Util.$document.on("click", ".rex-close-html-editor", function(e) {
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

  var _addEditableInputEvents = function() {
    editorInstance.subscribe("editableInput", function(e, elem) {
      var $elem = $(elem).parents(".grid-stack-item");
      var galleryInstance = $elem.parent().data()
        .plugin_perfectGridGalleryEditor;
      galleryInstance.fixElementTextSize($elem[0], null, null);

      var data = {
        eventName: "rexlive:edited",
        modelEdited: $elem
          .parents(".rexpansive_section")
          .hasClass("rex-model-section")
      };
      Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });
  };

  var _createToolbarContainer = function() {
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

  var _destroyMediumEditor = function() {
    editorInstance.destroy();
  };

  /**
   * Launching the medium editor
   */
  var _createEditor = function() {
    // htmlExtensionInstance = new TextHtmlExtension();
    pickerExtensionInstance = new ColorPickerExtension();
    headingTagsExtensionInstance = new TextTagExtension();
    formattingTagsExtensionInstance = new FormattingTagExtension();
    justifyExtensionIntance = new JustifyExtension();
    listExtensionInstance = new ListExtension();

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
        colorPicker: pickerExtensionInstance,
        // textHtml: htmlExtensionInstance,
        textEditorHtml: new TextHtmlEditorExtension(),
        headingTags: headingTagsExtensionInstance,
        formattingTags: formattingTagsExtensionInstance,
        justifyDropdown: justifyExtensionIntance,
        listDropdown: listExtensionInstance,
        contentBlockPosition: new ContentBlockPositionExtension(),
        'close-editor-escape': new CloseEditorEscapeExtension()
      },
      placeholder: {
        /*
         * This example includes the default options for
         * placeholder, if nothing is passed this is what it used
        */
        text: "Type here your text",
        hideOnClick: false
      }
    });
    _addEditableInputEvents();
  };

  var _triggerMEEvent = function( event_info ) {
    editorInstance.trigger( event_info.name, event_info.data, event_info.editable );
  }

  var init = function() {
    _createToolbarContainer();
    _createEditor();
    _linkDocumentListeners();
  };

  return {
    init: init,
    addElementToTextEditor: _addElementToTextEditor,
    destroyMediumEditor: _destroyMediumEditor,
    createEditor: _createEditor,
    triggerMEEvent: _triggerMEEvent
  };
})(jQuery);
