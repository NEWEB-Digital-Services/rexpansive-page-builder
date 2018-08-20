
var Rexbuilder_Util_Editor = (function ($) {
    'use strict';

    var undoStackArray;
    var redoStackArray;

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

    var _createSliderData = function ($sliderWrapper) {
        var auto_start = $sliderWrapper.attr("data-rex-slider-animation").toString() == "true";
        var prev_next = $sliderWrapper.attr("data-rex-slider-prev-next").toString() == "1";
        var dots = $sliderWrapper.attr("data-rex-slider-dots").toString() == "1";

        var data = {
            id: parseInt($sliderWrapper.attr("data-slider-id")),
            settings: {
                auto_start: auto_start,
                prev_next: prev_next,
                dots: dots,
            },
            slides: []
        };

        var slides = $sliderWrapper.find(".rex-slider-element");

        for (var i = 0; i < slides.length; i++) {
            var $slide = $(slides[i]);

            var slide = {
                slide_image_id: "",
                slide_image_url: "",
                slide_url: "",
                slide_text: "",
                slide_video: "",
                slide_videoMp4Url: "",
                slide_video_audio: "",
                slide_video_type: ""
            }

            slide.slide_image_id = isNaN(parseInt($slide.attr("data-rex-slide-image-id"))) ? "" : parseInt($slide.attr("data-rex-slide-image-id"));

            var backgroundImageUrl = Rexbuilder_Util.getBackgroundUrlFromCss($slide.css("background-image"));
            if (backgroundImageUrl != "none") {
                slide.slide_image_url = backgroundImageUrl;
            }

            var $linkDiv = $slide.children("a");
            if ($linkDiv.length != 0) {
                slide.slide_url = $linkDiv.attr("href");
            }

            var $textContent = $slide.find(".rex-slider-element-title");
            if ($textContent.length != 0) {
                if ($textContent.html().trim().length != 0) {
                    slide.slide_text = $textContent.html();
                }
            }

            var $videoMp4Wrap = $slide.find(".mp4-player");
            var $videoVimeoWrap = $slide.find(".vimeo-player");
            var $videoYoutubeWrap = $slide.find(".youtube-player");

            if ($videoMp4Wrap.length != 0) {
                slide.slide_video = parseInt($videoMp4Wrap.children(".rex-video-wrap").attr("data-rex-video-mp4-id"));
                slide.slide_videoMp4Url = $videoMp4Wrap.find("source").attr("src");
                slide.slide_video_audio = $videoMp4Wrap.children(".rex-video-toggle-audio").length != 0;
                slide.slide_video_type = "mp4";
            }

            if ($videoVimeoWrap.length != 0) {
                var $iframe = $videoVimeoWrap.find("iframe");
                slide.slide_video = $iframe.attr("src").split('?')[0];
                slide.slide_video_audio = $videoVimeoWrap.children(".rex-video-toggle-audio").length != 0;
                slide.slide_video_type = "vimeo";
            }

            if ($videoYoutubeWrap.length != 0) {
                var $ytpPlayer = $videoYoutubeWrap.find(".rex-youtube-wrap");
                var elemData = jQuery.extend(true, {}, eval('(' + $ytpPlayer.attr("data-property") + ')'));
                slide.slide_video = elemData.videoURL;
                slide.slide_video_audio = $videoYoutubeWrap.children(".rex-video-toggle-audio").length != 0;
                slide.slide_video_type = "youtube";
            }

            data.slides.push(slide);
        }
        return data;
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

    var _getTextWrapLength = function ($elem) {
        var $textWrap = $elem.find(".text-wrap");
        var length = 0;

        var textHeight = 0;
        if ($textWrap.hasClass("medium-editor-element")) {
            var textCalculate = $textWrap.clone(false);
            textCalculate.children(".medium-insert-buttons").remove();
            length = textCalculate.text().trim().length;
            if (length != 0) {
                if (($textWrap.hasClass("medium-editor-element") && !$textWrap.hasClass("medium-editor-placeholder")) || ($textWrap.parents(".pswp-item").length != 0)) {
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
    }

    var removeDeletedBlocks = function ($gallery) {
        $gallery.children(".removing_block").each(function () {
            $(this).remove();
        });
    }

    var endEditingElement = function () {
        console.log("end editing element: " + Rexbuilder_Util_Editor.editedElement.data("rexbuilder-block-id"));
        var galleryEditorInstance = Rexbuilder_Util_Editor.editedGallery;

        Rexbuilder_Util_Editor.elementIsDragging = false;
        Rexbuilder_Util_Editor.editedTextWrap.blur();

        galleryEditorInstance.unFocusElement(Rexbuilder_Util_Editor.editedElement);

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
            console.log("start editing " + $elem.attr("data-rexbuilder-block-id"));
            gallery.unFocusElementEditing($elem);
            gallery.properties.elementStartingH = parseInt($elem.attr("data-gs-height"));
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

        // if "ESC" pressed end editing element
        Rexbuilder_Util.$window.on('keydown', function (event) {
            if (Rexbuilder_Util_Editor.editingGallery && event.keyCode == 27) {
                Rexbuilder_Util_Editor.endEditingElement();
            }
        });

        Rexbuilder_Util.$window.on('mousedown', function (event) {
            Rexbuilder_Util_Editor.mouseDown = true;
            Rexbuilder_Util_Editor.mouseUp = false;
        });

        Rexbuilder_Util.$window.on('mouseup', function (event) {
            Rexbuilder_Util_Editor.mouseDown = false;
            Rexbuilder_Util_Editor.mouseUp = true;
        });

        Rexbuilder_Util.$window.on('load', function (e) {
            ;
        });

        Rexbuilder_Util.$window[0].addEventListener("message", receiveMessage, false);

        function receiveMessage(event) {
            if (event.data.rexliveEvent) {
                var e = jQuery.Event(event.data.eventName);
                e.settings = {};
                jQuery.extend(e.settings, event.data);
                $(document).trigger(e);
            }
        }
    }

    var addDocumentListeners = function () {
        $(document).on("rexlive:changeLayout", function (event) {
            undoStackArray = [];
            redoStackArray = [];
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

        $(document).on("rexlive:galleryReady", function (e) {
            console.log("Gallery " + e.galleryID + " ready");
        });

        $(document).on("rexlive:updateSlider", function (e) {
            var data = e.settings;
            Rexbuilder_Dom_Util.updateSliderStack(data.data_to_send);
        });

        $(document).on("rexlive:change_section_bg_color", function (e) {
            var data = e.settings;
            Rexbuilder_Dom_Util.updateSectionBackgroundColorLive(Rexbuilder_Util_Editor.sectionEditingBackgroundObj, data.data_to_send.color);
        });

        $(document).on("rexlive:change_section_overlay_color", function (e) {
            var data = e.settings;
            Rexbuilder_Dom_Util.updateSectionOverlayColorLive(Rexbuilder_Util_Editor.sectionEditingBackgroundObj, data.data_to_send.color);
        });

        $(document).on("rexlive:change_block_bg_color", function (e) {
            var data = e.settings;
            Rexbuilder_Dom_Util.updateBlockBackgroundColorLive(data.data_to_send);
        });

        $(document).on("rexlive:change_block_overlay_color", function (e) {
            var data = e.settings;
            Rexbuilder_Dom_Util.updateBlockOverlayColorLive(data.data_to_send);
        });

    }

    var _pushAction = function ($target, actionName, actionData, reverseData) {
        if ($target !== "document") {
            var ids = getIDs($target);
        } else {
            var ids = {
                sectionID: "",
                targetID: ""
            }
        }

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
            var expression = '(\\s' + className + '\\s|^' + className + '\\s|\\s' + className + '$|^' + className + '$)';
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
        if (Rexbuilder_Util_Editor.$styleElement.length == 0) {
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

    /**
     * 
     * @param {*} sliderData Data of the slider
     * @param {*} newSliderFlag true if save as new slider, false otherwise
     */
    var _saveSliderOnDB = function (sliderData, newSliderFlag, newBlockID) {
        console.log("saving slider on db");

        var data = {
            eventName: "rexlive:uploadSliderFromLive",
            sliderInfo: {
                slider: sliderData,
                newSlider: newSliderFlag,
                blockID: newBlockID
            }
        };

        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    }

    var _getElementsPhotoswipe = function ($gallery) {
        var elementsPhotoswipe = [];
        $gallery.children(".grid-stack-item:not(.removing_block)").each(function (i, el) {
            var $el = $(el);
            var $elData = $el.children(".rexbuilder-block-data");

            var elPW = {
                $data: $elData,
                photoswipe: false
            }

            if ($elData.attr("data-photoswipe").toString() == "true") {
                elPW.photoswipe = true;
            }

            elementsPhotoswipe.push(elPW);
        });

        return elementsPhotoswipe;
    }

    var init = function () {

        this.elementIsResizing = false;
        this.elementIsDragging = false;

        this.sectionCopying = false;
        this.blockCopying = false;
        this.blockCopyingObj = null;

        this.editingGallery = false;
        this.editingElement = false;

        this.editedGallery = null;
        this.editedElement = null;
        this.editedTextWrap = null;

        this.activateElementFocus = false;

        this.mouseDownEvent = null;
        this.mouseUpEvent = null;

        this.mouseDown = false;
        this.mouseUp = false;

        this.elementDraggingTriggered = false;

        this.focusedElement = null;

        this.hasResized = false;
        this.buttonResized = false;
        this.clickedLayoutID = "";
        this.undoActive = false;
        this.redoActive = false;

        this.updatingGridstack = false;

        this.addingNewBlocks = false;
        this.removingBlocks = false;

        this.sectionChangingOptionsRexID = null;
        this.sectionChangingOptionsObj = null;

        this.sectionAddingElementRexID = null;
        this.sectionAddingElementObj = null;

        this.sliderEditingObj = null;

        this.sectionEditingObj = null;
        this.elementEditingObj = null;

        this.sectionEditingBackgroundID = null;
        this.sectionEditingBackgroundObj = null;

        this.blockEditingOptsID = null;
        this.blockEditingOptsObj = null;

        this.updatingImageBg = false;
        this.updatingPaddingBlock = false;

        undoStackArray = [];
        redoStackArray = [];

        this.$styleElement = $("#rexpansive-builder-style-inline-css");
        _fixCustomStyleElement();
    }

    return {
        init: init,
        removeScrollBar: removeScrollBar,
        removeTextEditor: removeTextEditor,
        removeDeletedBlocks: removeDeletedBlocks,
        addWindowListeners: addWindowListeners,
        addDocumentListeners: addDocumentListeners,
        endEditingElement: endEditingElement,
        startEditingElement: startEditingElement,
        setEndOfContenteditable: setEndOfContenteditable,
        sendParentIframeMessage: sendParentIframeMessage,
        addCustomClass: _addCustomClass,
        removeCustomClass: _removeCustomClass,
        escapeRegExp: _escapeRegExp,
        pushAction: _pushAction,
        getIDs: getIDs,
        getStacks: _getStacks,
        createSliderData: _createSliderData,
        saveSliderOnDB: _saveSliderOnDB,
        getTextWrapLength: _getTextWrapLength,
        getElementsPhotoswipe: _getElementsPhotoswipe
    };

})(jQuery);