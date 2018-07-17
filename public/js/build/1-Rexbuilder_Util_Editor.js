
var Rexbuilder_Util_Editor = (function ($) {
    'use strict';

    var undoStackArray;
    var redoStackArray;

    var testIndex;

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
                //galleryEditorIstance.updateGrid();
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

        $(document).click(".test-save", function (e) {
            $(e.target).parents(".rexpansive_section").find(".grid-stack-row").attr("data-rexlive-layout-changed", "true");
            $(e.target).parents(".rexpansive_section").attr("data-rexlive-section-edited", "true");
        })

        $(document).on('rexlive:undo', function (e) {
            if (undoStackArray.length > 0) {
                var action = undoStackArray.pop();
                Rexbuilder_Dom_Util.performAction(action, false);
                redoStackArray.push(action);
            }
        });

        $(document).on('rexlive:redo', function (e) {
            if (redoStackArray.length > 0) {
                var action = redoStackArray.pop();
                Rexbuilder_Dom_Util.performAction(action, true);
                undoStackArray.push(action);
            }
        });
    }

    var _pushAction = function ($target, actionName, actionData, reverseData) {
        var ids = getIDs($target);
        var action = {
            sectionID: ids.sectionID,
            targetID: ids.targetID,
            actionName: actionName,
            performActionData: actionData,
            reverseActionData: reverseData
        }
        console.log(action);
        undoStackArray.push(action);
        redoStackArray = [];
    };

    var getIDs = function ($target) {
        var data = {
            sectionID: "",
            targetID: ""
        }

        data.sectionID = $target.is("section") ? $target.attr("data-rexlive-section-id") : $target.parents(".rexpansive_section").attr("data-rexlive-section-id");

        if ($target.parents(".grid-stack-item").length != 0) {
            data.targetID = $target.parents(".grid-stack-item").attr("data-rexbuilder-block-id");
        } else {
            data.targetID = "self";
        }

        return data;
    }

    var _getStacks = function () {
        var stacks = {
            undo: undoStackArray,
            redo: redoStackArray
        }
        return stacks;
    }

    var sendParentIframeMessage = function (data) {
        var infos = {
            rexliveEvent: true
        };
        jQuery.extend(infos, data);
        window.parent.postMessage(infos, '*');
    }

    var sendParentIframeMessage = function (data) {
        var infos = {
            rexliveEvent: true
        };
        jQuery.extend(infos, data);
        window.parent.postMessage(infos, '*');
    }

    var fixNavigatorItemOrder = function ($section) {
        if (!($section.attr("id") == undefined || $section.attr("id") == "")) {
            var id = $section.attr("id");
            var $navigatorWrap = $(document).find("nav[class=\"vertical-nav\"");
            var $navItem = $navigatorWrap.find('li a[href="#' + id + '"]').parent();
            var $nextSection = $section;
            var nextID = "";
            do {
                $nextSection = $nextSection.next();
                nextID = $nextSection.attr("id");
                if (nextID != "") {
                    break;
                }
            } while ($nextSection.length != 0);

            if (nextID == "" || nextID == undefined) {
                $navigatorWrap.children("ul").append($navItem[0]);
            } else {
                $navItem.insertBefore($navigatorWrap.find('li a[href="#' + nextID + '"]').parent());
            }
        }
    }

    /**
     * Used to change name, add or remove item from navigator
     * @param {*} $section section linked
     * @param {*} name name of the section, if name is "" the item will be removed
     */
    var updateNavigatorItem = function ($section, name) {
        console.log(name);
        var $navigatorWrap = $(document).find("nav[class=\"vertical-nav\"");
        if (name != "") {
            if ($section.attr("id") == undefined || $section.attr("id") == "") {
                var totalSectionNumber = Rexbuilder_Util.$rexContainer.children(".rexpansive_section").length
                var emptyIDs = Rexbuilder_Util.$rexContainer.children('.rexpansive_section[id=""]').length;
                var $nextSection = $section;
                var nextID = "";

                do {
                    $nextSection = $nextSection.next();
                    nextID = $nextSection.attr("id");
                    if (nextID != "") {
                        break;
                    }
                } while ($nextSection.length != 0);

                var n = totalSectionNumber - emptyIDs + 1;
                tmpl.arg = "navigator";

                var navItem = tmpl("tmpl-navigator-item", {
                    title: name,
                    number: n
                });

                if (nextID == "" || nextID == undefined) {
                    $navigatorWrap.children("ul").append(navItem);
                } else {
                    $(navItem).insertBefore($navigatorWrap.find('li a[href="#' + nextID + '"]').parent());
                }
            } else {
                var oldName = $section.attr("id");
                var $item = $navigatorWrap.find('li a[href="#' + oldName + '"]');
                $item.attr("href", "#" + name);
                $item.find(".label").text(name);
            }
            $section.attr("id", name);
            $section.attr("href", "#" + name);
        } else {
            if (!($section.attr("id") == undefined || $section.attr("id") == "")) {
                var oldName = $section.attr("id");
                var $item = $navigatorWrap.find('li a[href="#' + oldName + '"]').parent();
                $item.remove();
                $section.attr("id", name);
                $section.attr("href", "#" + name);
            }
        }

        Rex_Navigator.updateNavigator();
    };

    /**
     * 
     * @param {*} className class name to add
     * @param {*} $targetData data of target (section or block)
     */
    var _addCustomClass = function (className, $targetData) {
        if (className != '') {
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
    }

    /**
     * 
     * @param {*} className class name to remove
     * @param {*} $targetData data of target (section or block)
     */
    var _removeCustomClass = function (className, $targetData) {
        if (className != '') {
            var classes = "";
            if (!$targetData.parent().is("section")) {
                classes = $targetData.attr("data-block_custom_class");
            } else {
                classes = $targetData.attr("data-custom_classes");
            }

            className = _escapeRegExp(className);
            var expression = '(\\s' + className + '\\s|^' + className + '\\s|\\s' + className + '$)';
            var reg = new RegExp(expression, "g");
            classes = classes.replace(reg, " ");
            classes = classes.trim();

            if (!$targetData.parent().is("section")) {
                $targetData.attr("data-block_custom_class", classes);
            } else {
                $targetData.attr("data-custom_classes", classes);
            }
        }
    }

    var _escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    var _fixCustomStyleElement = function () {
        var styleElement = $("#rexpansive-builder-style-inline-css");
        if (styleElement.length == 0) {
            var css = '',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            style.id = 'rexpansive-builder-style-inline-css';
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }
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

        undoStackArray = [];
        redoStackArray = [];
        testIndex = 0;

        _fixCustomStyleElement();
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
        sendParentIframeMessage: sendParentIframeMessage,
        updateNavigatorItem: updateNavigatorItem,
        fixNavigatorItemOrder: fixNavigatorItemOrder,
        addCustomClass: _addCustomClass,
        removeCustomClass: _removeCustomClass,
        escapeRegExp: _escapeRegExp,
        pushAction: _pushAction,
        getIDs: getIDs,
        getStacks: _getStacks
    };

})(jQuery);