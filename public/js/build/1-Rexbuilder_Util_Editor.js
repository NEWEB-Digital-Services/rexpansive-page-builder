
var Rexbuilder_Util_Editor = (function ($) {
  'use strict';

  var setEndOfContenteditable = function (contentEditableElement) {
    var range, selection;
    if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
      range = document.createRange();//Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
      range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection();//get the selection object (allows you to change selection)
      selection.removeAllRanges();//remove any selections already made
      selection.addRange(range);//make the range you have just created the visible selection
    }
    else if (document.selection)//IE 8 and lower
    {
      range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
      range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
      range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
      range.select();//Select the range (make it the visible selection
    }
  }

  var addBlockToolboxListeners = function () {

    $(document).on('click', '.builder-delete-block', function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log("stopPropagation");
      var $elem = $(e.currentTarget).parents('.grid-stack-item');
      var grid = $elem.parents('.grid-stack-row').data("gridstack");
      grid.removeWidget($elem, false);
      $elem.addClass("removing_block");
    });

    $(document).on('click', '.builder-copy-block', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var galleryEditorIstance = $(e.currentTarget).parents('.grid-stack-row').data().plugin_perfectGridGalleryEditor;

      Rexbuilder_Util_Editor.blockCopying = true;
      var $elem = $(e.currentTarget).parents('.grid-stack-item');
      var $newBlock;
      var $gallery = $elem.parents('.grid-stack-row');
      var $gridstack = $gallery.data("gridstack");
      var editor = galleryEditorIstance.properties.mediumEditorIstance;
      $newBlock = $elem.clone(false);

      $newBlock.appendTo($gallery.eq(0));

      var w = parseInt($newBlock.attr("data-gs-width"));
      var h = parseInt($newBlock.attr("data-gs-height"));

      Rexbuilder_Util_Editor.removeScrollBar($newBlock);
      Rexbuilder_Util_Editor.removeTextEditor($newBlock);

      galleryEditorIstance._prepareElement($newBlock.eq(0));

      galleryEditorIstance.unFocusElementEditing($newBlock);

      $gridstack.addWidget($newBlock, 0, 0, w, h, true);
      var $textWrap = $newBlock.find(".text-wrap");
      var newBlock = $newBlock[0];

      galleryEditorIstance.fixElementTextSize(newBlock, null, null);

      if ($newBlock.find(".pswp-item").length == 0) {
        galleryEditorIstance.addElementToTextEditor(editor, $textWrap);
      }

      Rexbuilder_Util_Editor.blockCopying = false;
    });
  }

  var removeScrollBar = function ($elem) {
    var $elemContent = $elem.find(".grid-item-content");
    var $div = $(document.createElement("div"));
    var $divScrollbar = $elemContent.find(".rex-custom-scrollbar");
    var $textWrap = $elemContent.find('.text-wrap');

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

  var removeTextEditor = function ($elem) {

    var $textWrap = $elem.find('.text-wrap');
    var textWrapContent;
    var $div;
    var css;

    if ($textWrap.length != 0) {
      textWrapContent = $textWrap.html();
      $div = $(document.createElement("div"));
      css = $textWrap.attr("style");
      $div.appendTo($textWrap.parent());
      $div.addClass("text-wrap");
      if ($textWrap.hasClass("rex-content-resizable")) {
        $div.addClass("rex-content-resizable");
      }
      $div.attr("style", css);
      $div.html(textWrapContent);
      $div.find(".text-editor-span-fix").eq(0).remove();
      $textWrap.remove();
    }

    $textWrap = undefined;
    textWrapContent = undefined;
    $div = undefined;
    css = undefined;
  }

  var removeDeletedBlocks = function ($gallery) {
    $gallery.children(".removing_block").each(function () {
      $(this).remove();
    });
  }

  var endEditingElement = function () {
    console.log("end editing element: " + Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id"));
    var galleryEditorIstance = Rexbuilder_Util_Editor.editedGallery;

    Rexbuilder_Util_Editor.elementIsDragging = false;
    Rexbuilder_Util_Editor.editedTextWrap.blur();

    galleryEditorIstance.unFocusElement(Rexbuilder_Util_Editor.editedElement);

    Rexbuilder_Util_Editor.editingGallery = false;
    Rexbuilder_Util_Editor.editedGallery = null;
    Rexbuilder_Util_Editor.editingElement = false;
    Rexbuilder_Util_Editor.editedElement = null;
    Rexbuilder_Util_Editor.editedTextWrap = null;
  }

  var startEditingElement = function () {
    if (Rexbuilder_Util_Editor.editingElement && Rexbuilder_Util_Editor.editingGallery) {
      var gallery = Rexbuilder_Util_Editor.editedGallery;
      var $elem = Rexbuilder_Util_Editor.editedElement;

      //$(gallery.$element).removeClass('gridActive');

      console.log("start editing " + $elem.attr("data-rexbuilder-block-id"));
      gallery.unFocusElementEditing($elem);
      gallery.properties.elementStartingH = parseInt($elem.attr("data-gs-height"));

      /*            
      var textWrap = $elem.find('.text-wrap')[0];
      if (!(textWrap.text().length) || textWrap.text() == '""') {
          $(textWrap)[0].focus();
      } 
      */
      // $(textWrap.lastChild)[0].focus();
    }
  }

  var addWindowListeners = function () {

    Rexbuilder_Util.$window.click(function (e) {
      var $target = $(e.target);
      if (Rexbuilder_Util_Editor.editingElement && ($target.parents(".grid-stack-item").length == 0) && ($target.parents(".media-frame").length == 0) && !($target.hasClass("grid-stack-item"))) {
        console.log(e);
        console.log("CLICK OUTSIDE ELEMENTS");
        Rexbuilder_Util_Editor.activateElementFocus = false;
        Rexbuilder_Util_Editor.endEditingElement();
        Rexbuilder_Util_Editor.activateElementFocus = true;
      }

    });

    Rexbuilder_Util.$window.on('keydown', function (event) {
      if (Rexbuilder_Util_Editor.editingGallery && event.keyCode == 27) {
        Rexbuilder_Util_Editor.endEditingElement();
      }

    });

    Rexbuilder_Util.$window.on('mousedown', function (event) {

      console.log("mouse down window");

    });


    Rexbuilder_Util.$window.on('load', function (e) {
      Rexbuilder_Util.$rexContainer.find(".grid-stack-row").each(function () {
        var galleryEditorIstance = $(this).data().plugin_perfectGridGalleryEditor;
        galleryEditorIstance.updateGrid();
      });
    });

    Rexbuilder_Util.$window[0].addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
      //console.log("event received");
      if (event.data.rexliveEvent) {
        console.log("rexlive event");
        var e = jQuery.Event(event.data.eventName);
        e.settings = {};

        jQuery.extend(e.settings, event.data);
        console.log(e);
        $(document).trigger(e);
      }
    }
  }

  var addDocumentListeners = function () {
    $(document).on("rexlive:changeLayout", function (event) {
      Rexbuilder_Util_Editor.buttonResized = true;
      Rexbuilder_Util_Editor.clickedLayoutID = event.settings.selectedLayoutName;
    });
    $(document).on('rexlive:updateLayouts', function (event) {
      _save_custom_layouts(event.settings.updatedLayouts);
    });
    $(document).on('rexlive:undo', function (e) {
      console.log(e);
      console.log('undo');
    });
    $(document).on('rexlive:redo', function (e) {
      console.log(e);
      console.log('redo');
    });
    $(document).click(".test-save", function (e) {
      console.log(e);
      $(e.target).parents(".rexpansive_section").find(".grid-stack-row").attr("data-rexlive-layout-changed", "true");
      $(e.target).parents(".rexpansive_section").attr("data-rexlive-section-edited", "true");
    })
  }

  var sendParentIframeMessage = function (data) {
    var infos = {
      rexliveEvent: true
    };
    jQuery.extend(infos, data);
    window.parent.postMessage(infos, '*');
  }

  /**
   * Saving the custom layouts
   * @param {Array} layouts Array of objects defining the custom layouts
   */
  var _save_custom_layouts = function (layouts) {
    var idPost = parseInt($('#id-post').attr('data-post-id'));
    console.log("saving custom");
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: _plugin_frontend_settings.rexajax.ajaxurl,
      data: {
        action: 'rexlive_save_custom_layouts',
        nonce_param: _plugin_frontend_settings.rexajax.rexnonce,
        post_id_to_update: idPost,
        custom_layouts: layouts
      },
      success: function (response) {
        console.log(response);
        if (response.success) {
          console.log('cusotm layouts aggiornati');
        }
        console.log('chiama effettuata con successo');
      },
      error: function (response) {
        console.log('errore chiama ajax');
      }
    });
  }

  var sendParentIframeMessage = function (data) {
    var infos = {
      rexliveEvent: true
    };
    jQuery.extend(infos, data);
    window.parent.postMessage(infos, '*');
  }

  var init = function () {

    this.elementIsResizing = false;
    this.elementIsDragging = false;

    this.sectionCopying = false;
    this.blockCopying = false;

    this.editingGallery = false;
    this.editingElement = false;

    this.editedGallery = null;
    this.editedElement = null;
    this.editedTextWrap = null;

    this.activateElementFocus = false;

    this.mouseDownEvent = null;
    this.mouseUpEvent = null;

    this.elementDraggingTriggered = false;

    this.focusedElement = null;

    this.hasResized = false;
    this.buttonResized = false;
    this.clickedLayoutID = "";

  }

  return {
    init: init,

    removeScrollBar: removeScrollBar,
    removeTextEditor: removeTextEditor,
    addBlockToolboxListeners: addBlockToolboxListeners,
    removeDeletedBlocks: removeDeletedBlocks,
    addWindowListeners: addWindowListeners,
    addDocumentListeners: addDocumentListeners,
    endEditingElement: endEditingElement,
    startEditingElement: startEditingElement,
    setEndOfContenteditable: setEndOfContenteditable,
    sendParentIframeMessage: sendParentIframeMessage
  };

})(jQuery);