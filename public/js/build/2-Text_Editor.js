/**
 * Object that handles the live text editor inside the blocks
 * 
 * @since 2.0.0
 */
var TextEditor = (function($) {
  "use strict";

  var editorInstance;

  var pickerExtensionInstance;
  var htmlExtensionInstance;
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
      addons: {
        images: false,
        embeds: {
          oembedProxy: "https://medium.iframe.ly/api/oembed?iframe=1"
        },
        wordpressImages: {
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
    $(element).spectrum({
      allowEmpty: true,
      color: "#f00",
      showInput: true,
      showAlpha: true,
      showPalette: true,
      showInitial: true,
      hideAfterPaletteSelect: true,
      preferredFormat: "hex3",
      change: function(color) {
        setColor(color);
      },
      hide: function(color) {
        setColor(color);
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
      this.button.innerHTML = "<span class='meditor-color-picker'><span class='meditor-color-picker__placeholder'>P</span></span>";

      // init spectrum color picker for this button
      initPicker(this.button);

      // use our own handleClick instead of the default one
      this.on(this.button, "click", this.handleClick.bind(this));
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
      // this.classApplier = rangy.createClassApplier('highlight', {
      //   elementTagName: 'mark',
      //   normalize: true
      // });

      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action-list");
      this.button.innerHTML = "<div class='me__heading-list-parent'><i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>H1</div><div class='me__action-list'><div class='medium-editor-action' data-tag-action='append-h1'>h1</div><div class='medium-editor-action' data-tag-action='append-h2'>h2</div><div class='medium-editor-action' data-tag-action='append-h3'>h3</div><div class='medium-editor-action' data-tag-action='append-h4'>h4</div><div class='medium-editor-action' data-tag-action='append-h5'>h5</div><div class='medium-editor-action' data-tag-action='append-h6'>h6</div></div>";
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
   * Custom extension for display list of formatting tags for text: bold, italic and underline
   * @since 2.0.0
   */
  var FormattingTagExtension = MediumEditor.extensions.button.extend({
    name: "formattingTags",
    action: "",
    contentDefault: "TAGS",
    init: function() {   
      this.button = this.document.createElement("button");
      this.button.classList.add("medium-editor-action");
      this.button.classList.add("medium-editor-action-list");
      this.button.innerHTML = "<div class='me__heading-list-parent'><i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>b</div><div class='me__action-list'><div class='medium-editor-action' data-tag-action='bold'>b</div><div class='medium-editor-action' data-tag-action='italic'>i</div><div class='medium-editor-action' data-tag-action='underline'>u</div></div>";
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
      this.button.innerHTML = "<div class='me__heading-list-parent'><i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>j</div><div class='me__action-list'><div class='medium-editor-action' data-tag-action='justifyLeft'><i class='fa fa-align-left'></i></div><div class='medium-editor-action' data-tag-action='justifyCenter'><i class='fa fa-align-center'></i></div><div class='medium-editor-action' data-tag-action='justifyRight'><i class='fa fa-align-right'></i></div><div class='medium-editor-action' data-tag-action='justifyFull'><i class='fa fa-align-justify'></i></div></div>";
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
        // action applied already?
        console.log(editorInstance.queryCommandState(action));
        editorInstance.execAction(action);
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
      this.button.innerHTML = "<div class='me__heading-list-parent'><i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>l</div><div class='me__action-list'><div class='medium-editor-action' data-tag-action='insertorderedlist'><i class='fa fa-list-ol'></i></div><div class='medium-editor-action' data-tag-action='insertunorderedlist'><i class='fa fa-list-ul'></i></div></div>";
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

  var DropDownExtension = MediumEditor.Extension.extend({
    name: "dropDownButtonList",
    action: "",

    init: function() {
      console.log(this.contentDefault);
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

  var _linkDocumentListeners = function() {
    //function for removing textarea html editor
    $(document).on("click", ".rex-close-html-editor", function(e) {
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
    htmlExtensionInstance = new TextHtmlExtension();
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
            contentDefault: '<i class="l-svg-icons"><svg><use xlink:href="#C001-Link"></use></svg></i>',
          },
          "headingTags",
          {
            name: 'quote',
            contentDefault: '"',
          },
          // {
          //   name: 'orderedlist',
          //   contentDefault: '1.',
          // },
          // {
          //   name: 'unorderedlist',
          //   contentDefault: '&#183',
          // },
          "listDropdown",
          // "table",
          "textHtml",
          // "justifyLeft",
          // "justifyCenter",
          // "justifyRight",
          // "justifyFull",
          "justifyDropdown",
          "removeFormat",
          {
            name: 'dropDownButtonList',
            contentDefault: "<div class='me__heading-list-parent'><i class='l-svg-icons drop-down-icon'><svg><use xlink:href='#A007-Close'></use></svg></i>l</div><div class='me__action-list'><div class='medium-editor-action' data-tag-action='insertorderedlist'><i class='fa fa-list-ol'></i></div><div class='medium-editor-action' data-tag-action='insertunorderedlist'><i class='fa fa-list-ul'></i></div></div>"
          }
        ]
      },
      imageDragging: false,
      extensions: {
        colorPicker: pickerExtensionInstance,
        textHtml: htmlExtensionInstance,
        headingTags: headingTagsExtensionInstance,
        formattingTags: formattingTagsExtensionInstance,
        justifyDropdown: justifyExtensionIntance,
        listDropdown: listExtensionInstance,
        dropDownButtonList: new DropDownExtension(),
      },
      placeholder: {
        /*
         * This example includes the default options for
         * placeholder, if nothing is passed this is what it used
        */
        text: "Type here your text",
        hideOnClick: true
      }
    });
    _addEditableInputEvents();
  };

  var init = function() {
    _createToolbarContainer();
    _createEditor();
    _linkDocumentListeners();
  };

  return {
    init: init,
    addElementToTextEditor: _addElementToTextEditor,
    destroyMediumEditor: _destroyMediumEditor,
    createEditor: _createEditor
  };
})(jQuery);
