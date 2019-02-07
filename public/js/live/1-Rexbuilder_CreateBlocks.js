var Rexbuilder_CreateBlocks = (function ($) {
    'use strict';

    $(document).on("click", ".add-new-block-empty", function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var $section = $(e.target).parents(".rexpansive_section");
        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var $el = galleryInstance.createNewBlock(galleryInstance.settings.galleryLayout);
        $el.find(".grid-item-content").addClass("empty-content");
        TextEditor.addElementToTextEditor($el.find(".text-wrap"));
        // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
        //     galleryInstance.addScrollbar($el);
        // }
        // Rexbuilder_Block_Editor.launchSpectrumPickerBackgorundColorBlock($el.find('input[name=edit-block-color-background]')[0]);
        // Rexbuilder_Block_Editor.launchSpectrumPickerOverlayColorBlock($el.find('input[name=edit-block-overlay-color]')[0]);
        Rexbuilder_Block_Editor.updateBlockTools($el);

        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }

        var data = {
            eventName: "rexlive:edited",
            modelEdited: $section.hasClass("rex-model-section")
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("click", ".add-new-block-text", function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var $section = $(e.target).parents(".rexpansive_section");
        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var $el = galleryInstance.createNewBlock(galleryInstance.settings.galleryLayout, undefined, undefined, "text");

        // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
        //     galleryInstance.addScrollbar($el);
        // }
        TextEditor.addElementToTextEditor($el.find(".text-wrap"));

        Rexbuilder_Block_Editor.updateBlockTools($el);
        Rexbuilder_Util_Editor.launchTooltips();

        var event = jQuery.Event("dblclick");
        event.target = $el.find(".rexlive-block-drag-handle");
        event.offsetY = 0;
        $el.trigger(event);
        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }
        var data = {
            eventName: "rexlive:edited",
            modelEdited: $section.hasClass("rex-model-section")
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    /**
     * Listen to insert block event coming from the parent window
     * @since 2.0.0
     */
    $(document).on("rexlive:insert_new_text_block", function (e) {
        var data = e.settings.data_to_send;

        var $section;
        if (data.sectionTarget.modelNumber != "") {
            $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"][data-rexlive-model-number="' + data.sectionTarget.modelNumber + '"]');
        } else {
            $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"]');
        }

        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var $el = galleryInstance.createNewBlock(galleryInstance.settings.galleryLayout, undefined, undefined, "text");

        // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
        //     galleryInstance.addScrollbar($el);
        // }
        TextEditor.addElementToTextEditor($el.find(".text-wrap"));

        Rexbuilder_Block_Editor.updateBlockTools($el);
        Rexbuilder_Util_Editor.launchTooltips();

        var event = jQuery.Event("dblclick");
        event.target = $el.find(".rexlive-block-drag-handle");
        event.offsetY = 0;
        $el.trigger(event);

        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }
        var data = {
            eventName: "rexlive:edited",
            modelEdited: $section.hasClass("rex-model-section")
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("rexlive:insert_image", function (e) {
        var data = e.settings.data_to_send;
        
        var $section;
        if (data.sectionTarget.modelNumber != "") {
            $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"][data-rexlive-model-number="' + data.sectionTarget.modelNumber + '"]');
        } else {
            $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"]');
        }

        var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
        var i;

        var media = data.media;

        var gridWidth = galleryInstance.properties.wrapWidth;
        var singleWidth = galleryInstance.properties.singleWidth;
        var masonryHeight = galleryInstance.settings.cellHeightMasonry;

        for (i = 0; i < media.length; i++) {
            var $el,
                idImage = media[i].media_info.id,
                urlImage = media[i].display_info.src,
                w = media[i].display_info.width,
                h = media[i].display_info.height,
                type = "",
                blockW = 1,
                blockH = 1;

            if (w > gridWidth) {
                blockW = 6;
            } else {
                blockW = Math.max(Math.round(w * 6 / gridWidth), 1);
            }
            blockH = Math.max(Math.round(h * blockW / w), 1);

            if (galleryInstance.settings.galleryLayout == "fixed") {
                $el = galleryInstance.createNewBlock("fixed", blockW, blockH, "image");
                type = "full";
            } else {
                var gutter = galleryInstance.properties.gutter;
                if (blockW * singleWidth < w) {
                    blockH = ((h * blockW * singleWidth) / w);
                } else {
                    blockH = h + gutter;
                }
                blockH = Math.max(Math.round(blockH / masonryHeight), 1);
                $el = galleryInstance.createNewBlock("masonry", blockW, blockH, "image");
                type = "natural";
            }

            var dataImage = {
                idImage: idImage,
                urlImage: urlImage,
                width: w,
                height: h,
                typeBGimage: type,
                active: "true"
            };

            Rexbuilder_Dom_Util.updateImageBG( $el.find(".grid-item-content" ), dataImage );

            // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
            //     galleryInstance.addScrollbar($el);
            // }
            TextEditor.addElementToTextEditor( $el.find(".text-wrap") );

            Rexbuilder_Block_Editor.updateBlockTools($el);
            Rexbuilder_Util_Editor.launchTooltips();
        }
        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }
        var data = {
            eventName: "rexlive:edited",
            modelEdited: $section.hasClass("rex-model-section")
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("rexlive:insert_video", function (e) {
        var data = e.settings.data_to_send;
        if (!(typeof data.typeVideo == "undefined")) {
            var $section;

            if (data.sectionTarget.modelNumber != "") {
                $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"][data-rexlive-model-number="' + data.sectionTarget.modelNumber + '"]');
            } else {
                $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.sectionTarget.sectionID + '"]');
            }

            var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
            var audio = typeof data.hasAudio == "undefined" ? "" : data.hasAudio;
            var urlYoutube = typeof data.urlYoutube == "undefined" ? "" : data.urlYoutube;
            var urlVimeo = typeof data.urlVimeo == "undefined" ? "" : data.urlVimeo;
            var videoMp4 = typeof data.videoMp4 == "undefined" ? "" : data.videoMp4;

            var type = "";

            if (videoMp4.length != 0) {
                type = "mp4";
            } else if (urlVimeo != "") {
                type = "vimeo";
            } else if (urlYoutube != "") {
                type = "youtube";
            }

            if (videoMp4.length == 0) {
                var $el = _createBlockGrid(galleryInstance, 3, 3, 'video');
                var $itemContent = $el.find(".grid-item-content");
                var videoOptions = {
                    mp4Data: {
                        idMp4: "",
                        linkMp4: "",
                        width: "",
                        height: "",
                    },
                    vimeoUrl: urlVimeo,
                    youtubeUrl: urlYoutube,
                    audio: audio,
                    typeVideo: type
                }
                Rexbuilder_Dom_Util.updateVideos($itemContent, videoOptions);
                // galleryInstance.addScrollbar($el);
                TextEditor.addElementToTextEditor($el.find(".text-wrap"));
            } else {
                for (var i = 0; i < videoMp4.length; i++) {
                    var $el = _createBlockGrid(galleryInstance, 3, 3, 'video');
                    var $itemContent = $el.find(".grid-item-content");
                    var mp4Url = videoMp4[i].videoUrl;
                    var mp4ID = videoMp4[i].videoID;
                    var mp4width = videoMp4[i].width;
                    var mp4height = videoMp4[i].height;

                    var videoOptions = {
                        mp4Data: {
                            idMp4: mp4ID,
                            linkMp4: mp4Url,
                            width: mp4width,
                            height: mp4height,
                        },
                        vimeoUrl: "",
                        youtubeUrl: "",
                        audio: audio,
                        typeVideo: type
                    }
                    Rexbuilder_Dom_Util.updateVideos($itemContent, videoOptions);
                    // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
                    //     galleryInstance.addScrollbar($el);
                    // }
                    TextEditor.addElementToTextEditor($el.find(".text-wrap"));
                }
            }
        }
        Rexbuilder_Block_Editor.updateBlockTools($el);
        Rexbuilder_Util_Editor.launchTooltips();
        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }
        var data = {
            eventName: "rexlive:edited",
            modelEdited: $section.hasClass("rex-model-section")
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    $(document).on("rexlive:insert_new_slider", function (e) {
        var $el = _createSlider(e.settings.data_to_send);
        var $section;
        if (e.settings.data_to_send.target.modelNumber != "") {
            $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + e.settings.data_to_send.target.sectionID + '"][data-rexlive-model-number="' + e.settings.data_to_send.target.modelNumber + '"]');
        } else {
            $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + e.settings.data_to_send.target.sectionID + '"]');
        }
        Rexbuilder_Block_Editor.updateBlockTools($el);
        Rexbuilder_Util_Editor.launchTooltips();
        
        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }
        var data = {
            eventName: "rexlive:edited",
            modelEdited: $section.hasClass("rex-model-section")
        }
        Rexbuilder_Util_Editor.sendParentIframeMessage(data);
    });

    var _createSlider = function (data, $elem, numberSlider) {
        var sliderNumber;

        if (typeof numberSlider == "undefined") {
            Rexbuilder_Dom_Util.lastSliderNumber = Rexbuilder_Dom_Util.lastSliderNumber + 1;
            sliderNumber = Rexbuilder_Dom_Util.lastSliderNumber;
        } else {
            sliderNumber = numberSlider;
        }

        var slides = data.slides;
        var sliderData = {
            id: data.id,
            settings: data.settings,
            numberSlides: slides.length
        }

        var $el;
        var $textWrap;
        if (typeof $elem == "undefined") {
            var $section;
            if (data.target.modelNumber != "") {
                $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.target.sectionID + '"][data-rexlive-model-number="' + data.target.modelNumber + '"]');
            } else {
                $section = Rexbuilder_Util.$rexContainer.find('section[data-rexlive-section-id="' + data.target.sectionID + '"]');
            }

            var galleryInstance = Rexbuilder_Util.getGalleryInstance($section);
            if (typeof data.target.rexID == "undefined") {
                $el = _createBlockGrid(galleryInstance, 12, 4, "rexslider");
            } else {
                $el = $section.find("div [data-rexbuilder-block-id=\"" + data.target.rexID + "\"]");
            }
            $textWrap = $el.find(".text-wrap");
            $textWrap.children().remove();
        } else {
            $el = $elem;
            $textWrap = $el.find(".text-wrap");
        }

        $el.addClass("block-has-slider");
        $el.find('.block-toolBox__editor-tools').find('.edit-block-content').addClass('tool-button--hide');
        $el.find('.block-toolBox__config-tools').find('.builder-edit-slider').addClass('tool-button--hide');
        $el.children(".rexbuilder-block-data").attr("data-type", "rexslider");

        var $sliderWrap = _createSliderWrap($textWrap, sliderData);

        for (var i = 0; i < slides.length; i++) {
            tmpl.arg = "slide";

            var $slide = $(tmpl("tmpl-new-slider-element", {}));

            if (slides[i].slide_image_url != "none") {
                $slide.css("background-image", "url(" + slides[i].slide_image_url + ")");
                $slide.attr("data-rex-slide-image-id", slides[i].slide_image_id);
            }

            if (slides[i].slide_text.trim().length != 0) {
                $slide.children(".rex-slider-element-title").html(slides[i].slide_text);
            }

            $slide.appendTo($sliderWrap[0]);
            //url over slide text
            if (slides[i].slide_url != "") {
                tmpl.arg = "link";

                var $linkEl = $(tmpl("tmpl-new-slider-element-link", {
                    url: slides[i].slide_url
                }));

                $slide.children(".rex-slider-element-title").detach().appendTo($linkEl[0]);
                $slide.append($linkEl[0]);
            }

            if (slides[i].slide_video_type != "") {

                tmpl.arg = "video";
                var $videoElement = $slide.children(".rex-slider-video-wrapper");

                switch (slides[i].slide_video_type) {
                    case "mp4":
                        $videoElement.prepend(tmpl("tmpl-video-mp4", {
                            url: slides[i].slide_videoMp4Url
                        }));
                        $videoElement.addClass("mp4-player");
                        $videoElement.children(".rex-video-wrap").attr("data-rex-video-mp4-id", slides[i].slide_video);
                        break;

                    case "vimeo":
                        $videoElement.prepend(tmpl("tmpl-video-vimeo", {
                            url: slides[i].slide_video
                        }));
                        $videoElement.addClass("vimeo-player");
                        break;
                    case "youtube":
                        $videoElement.prepend(tmpl("tmpl-video-youtube", {
                            url: slides[i].slide_video,
                            audio: false
                        }));
                        $videoElement.addClass("youtube-player");
                        break;
                    default:
                        break;
                }

                if (slides[i].slide_video_audio.toString() == "true") {
                    $videoElement.append(tmpl("tmpl-video-toggle-audio"));
                }
            }
        }

        $sliderWrap.attr("data-rex-slider-number", sliderNumber);

        RexSlider.initSlider($sliderWrap);

        return $el;
    }

    var _createSliderWrap = function ($textWrap, data) {
        tmpl.arg = "slider";
        var $sliderWrap = $(tmpl("tmpl-new-slider-wrap", {
            id: data.id,
            animation: data.settings.auto_start ? true : 0,
            dots: data.settings.dots ? 1 : 0,
            prevnext: data.settings.prev_next ? 1 : 0,
            numberSlides: data.numberSlides
        }));

        $textWrap.append($sliderWrap[0]);
        return $sliderWrap;
    }

    var _createBlockGrid = function (galleryInstance, w, h, block_type) {
        block_type = typeof block_type !== 'undefined' ? block_type : '';
        var $el;
        var singleWidth = galleryInstance.properties.singleWidth,
            blockW = w,
            blockH = h;
        if (galleryInstance.settings.galleryLayout == "fixed") {
            $el = galleryInstance.createNewBlock("fixed", blockW, blockH, block_type);
        } else {
            blockH = Math.max(Math.round(blockH * singleWidth / galleryInstance.settings.cellHeightMasonry), 1);
            $el = galleryInstance.createNewBlock("masonry", blockW, blockH, block_type);
        }
        return $el;
    }

    var _createCopyBlock = function ($elem) {
        var $gallery = $elem.parents('.grid-stack-row');
        var galleryEditorInstance = $gallery.data().plugin_perfectGridGalleryEditor;
        var gridstack = $gallery.data("gridstack");
        var $section = $elem.parents(".rexpansive_section");
        var $newBlock;

        $newBlock = $elem.clone(false);
        var $newBlockData = $newBlock.children(".rexbuilder-block-data");

        galleryEditorInstance._removeHandles($newBlock);

        var newRexID = Rexbuilder_Util.createBlockID();

        galleryEditorInstance.properties.lastIDBlock = galleryEditorInstance.properties.lastIDBlock + 1;

        var newBlockID = "block_" + galleryEditorInstance.properties.sectionNumber + "_" + galleryEditorInstance.properties.lastIDBlock;

        $newBlock.attr("data-rexbuilder-block-id", newRexID);
        $newBlockData.attr("data-rexbuilder_block_id", newRexID);
        $newBlock.attr("id", newBlockID);
        $newBlockData.attr("data-id", newBlockID);
        $newBlockData.attr("id", newBlockID + "-builder-data");

        $newBlock.appendTo($gallery.eq(0));

        var w = parseInt($newBlock.attr("data-gs-width"));
        var h = parseInt($newBlock.attr("data-gs-height"));
        var $itemContent = $newBlock.find(".grid-item-content");
        var videoTypeActive = Rexbuilder_Util.destroyVideo($itemContent, false);

        // Rexbuilder_Util_Editor.removeScrollBar($newBlock);
        Rexbuilder_Util_Editor.removeTextEditor($newBlock);
        Rexbuilder_Util_Editor_Utilities.removeColorPicker($newBlock);
        galleryEditorInstance._prepareElement($newBlock.eq(0));
        galleryEditorInstance.unFocusElementEditing($newBlock);

        var reverseData = {
            targetElement: $newBlock,
            hasToBeRemoved: true,
            galleryInstance: galleryEditorInstance,
            blocksDisposition: $.extend(true, {}, galleryEditorInstance.properties.reverseDataGridDisposition)
        };

        gridstack.addWidget($newBlock[0], 0, 0, w, h, true, 1, 500, 1);

        var x = parseInt($newBlock.attr("data-gs-x"));
        var y = parseInt($newBlock.attr("data-gs-y"));

        gridstack.batchUpdate();
        gridstack.update($newBlock[0], x, y, w, h);
        gridstack.commit();

        galleryEditorInstance._createFirstReverseStack();
        galleryEditorInstance.properties.numberBlocksVisibileOnGrid = galleryEditorInstance.properties.numberBlocksVisibileOnGrid + 1;
        var actionData = {
            targetElement: $newBlock,
            hasToBeRemoved: false,
            galleryInstance: galleryEditorInstance,
            blocksDisposition: $.extend(true, {}, galleryEditorInstance.properties.reverseDataGridDisposition)
        };

        Rexbuilder_Util_Editor.pushAction(galleryEditorInstance.$element, "updateBlockVisibility", actionData, reverseData);
        $newBlock.removeAttr("data-gs-auto-position");
        if (videoTypeActive != "") {
            $itemContent.addClass(videoTypeActive + "-player");
        }
        Rexbuilder_Util.startVideoPlugin($itemContent);

        var $textWrap = $newBlock.find(".text-wrap");

        if ($elem.hasClass("block-has-slider")) {
            var $oldSlider = $elem.find(".text-wrap").children(".rex-slider-wrap[data-rex-slider-active=\"true\"]");
            $textWrap.children().remove();
            var sectionID = $section.attr("data-rexlive-section-id");
            var modelNumber = typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";
            var rex_block_id = newRexID;

            var target = {
                sectionID: sectionID,
                modelNumber: modelNumber,
                rexID: rex_block_id
            }

            var sliderData = Rexbuilder_Util_Editor.createSliderData($oldSlider);
            Rexbuilder_Util_Editor.saveSliderOnDB(sliderData, true, newBlockID, target);
        } else {
            // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
            //     galleryEditorInstance.addScrollbar($newBlock);
            // }
            TextEditor.addElementToTextEditor($newBlock.find(".text-wrap"));
        }
        // Rexbuilder_Block_Editor.launchSpectrumPickerBackgorundColorBlock($newBlock.find('input[name=edit-block-color-background]')[0]);
        // Rexbuilder_Block_Editor.launchSpectrumPickerOverlayColorBlock($newBlock.find('input[name=edit-block-overlay-color]')[0]);
        Rexbuilder_Block_Editor.updateBlockTools($newBlock);
        Rexbuilder_Util_Editor.launchTooltips();
        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }
    }

    /**
     * Insert a new block in gridstack starting from an html element
     * @param {jQuery Object} $elem element to insert
     * @param {jQuery Object} $gallery gallery where insert
     * @since 2.0.0
     */
    var _insertHTMLBlock = function ($elem, $gallery) {
        if( $gallery.length > 0 ) {
            var galleryEditorInstance = $gallery.data().plugin_perfectGridGalleryEditor;
            var gridstack = $gallery.data("gridstack");
            var $section = $gallery.parents(".rexpansive_section");
            var $newBlock;

            $newBlock = $elem;
            var $newBlockData = $newBlock.children(".rexbuilder-block-data");

            galleryEditorInstance._removeHandles($newBlock);

            var newRexID = Rexbuilder_Util.createBlockID();

            galleryEditorInstance.properties.lastIDBlock = galleryEditorInstance.properties.lastIDBlock + 1;

            var newBlockID = "block_" + galleryEditorInstance.properties.sectionNumber + "_" + galleryEditorInstance.properties.lastIDBlock;

            $newBlock.attr("data-rexbuilder-block-id", newRexID);
            $newBlockData.attr("data-rexbuilder_block_id", newRexID);
            if( "" === $newBlock.attr("id") ) {
                $newBlock.attr("id", newBlockID);
                $newBlockData.attr("data-id", newBlockID);
                $newBlockData.attr("id", newBlockID + "-builder-data");
            }

            $newBlock.appendTo($gallery.eq(0));

            var x = parseInt($newBlock.attr("data-gs-x"));
            var y = parseInt($newBlock.attr("data-gs-y"));
            var w = parseInt($newBlock.attr("data-gs-width"));
            var h = parseInt($newBlock.attr("data-gs-height"));
            var $itemContent = $newBlock.find(".grid-item-content");
            var videoTypeActive = Rexbuilder_Util.destroyVideo($itemContent, false);

            // Rexbuilder_Util_Editor.removeScrollBar($newBlock);
            Rexbuilder_Util_Editor.removeTextEditor($newBlock);
            Rexbuilder_Util_Editor_Utilities.removeColorPicker($newBlock);
            galleryEditorInstance._prepareElement($newBlock.eq(0));
            galleryEditorInstance.unFocusElementEditing($newBlock);

            var reverseData = {
                targetElement: $newBlock,
                hasToBeRemoved: true,
                galleryInstance: galleryEditorInstance,
                blocksDisposition: $.extend(true, {}, galleryEditorInstance.properties.reverseDataGridDisposition)
            };

            if('masonry' === galleryEditorInstance.settings.galleryLayout) {
                h = Math.floor( h * galleryEditorInstance.properties.singleWidth / galleryEditorInstance.properties.singleHeight );
            }

            gridstack.addWidget($newBlock[0], 0, 0, w, h, true, 1, 500, 1);

            gridstack.batchUpdate();
            gridstack.update($newBlock[0], x, y, w, h);
            gridstack.commit();

            galleryEditorInstance._updateElementsSizeViewers();

            galleryEditorInstance._createFirstReverseStack();
            galleryEditorInstance.properties.numberBlocksVisibileOnGrid = galleryEditorInstance.properties.numberBlocksVisibileOnGrid + 1;
            var actionData = {
                targetElement: $newBlock,
                hasToBeRemoved: false,
                galleryInstance: galleryEditorInstance,
                blocksDisposition: $.extend(true, {}, galleryEditorInstance.properties.reverseDataGridDisposition)
            };

            Rexbuilder_Util_Editor.pushAction(galleryEditorInstance.$element, "updateBlockVisibility", actionData, reverseData);
            $newBlock.removeAttr("data-gs-auto-position");
            if (videoTypeActive != "") {
                $itemContent.addClass(videoTypeActive + "-player");
            }
            Rexbuilder_Util.startVideoPlugin($itemContent);

            var $textWrap = $newBlock.find(".text-wrap");

            if ($elem.hasClass("block-has-slider")) {
                var $oldSlider = $elem.find(".text-wrap").children(".rex-slider-wrap[data-rex-slider-active=\"true\"]");
                $textWrap.children().remove();
                var sectionID = $section.attr("data-rexlive-section-id");
                var modelNumber = typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";
                var rex_block_id = newRexID;

                var target = {
                    sectionID: sectionID,
                    modelNumber: modelNumber,
                    rexID: rex_block_id
                }

                var sliderData = Rexbuilder_Util_Editor.createSliderData($oldSlider);
                Rexbuilder_Util_Editor.saveSliderOnDB(sliderData, true, newBlockID, target);
            } else {
                // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
                //     galleryEditorInstance.addScrollbar($newBlock);
                // }
                TextEditor.addElementToTextEditor($newBlock.find(".text-wrap"));
            }
            // Rexbuilder_Block_Editor.launchSpectrumPickerBackgorundColorBlock($newBlock.find('input[name=edit-block-color-background]')[0]);
            // Rexbuilder_Block_Editor.launchSpectrumPickerOverlayColorBlock($newBlock.find('input[name=edit-block-overlay-color]')[0]);
            Rexbuilder_Block_Editor.updateBlockTools($newBlock);
            Rexbuilder_Util_Editor.launchTooltips();
            
            Rexbuilder_Util.updateSectionStateLive($section);
            if(Rexbuilder_Util.activeLayout == "default"){
                Rexbuilder_Util.updateDefaultLayoutStateSection($section);
            }
        }
    }

    var _moveBlockToOtherSection = function ($elem, $targetSection) {
        // var $gallery = $elem.parents('.grid-stack-row');
        var galleryEditorInstance = $targetSection.data().plugin_perfectGridGalleryEditor;
        var gridstack = $targetSection.data("gridstack");
        var $section = $elem.parents(".rexpansive_section");
        var $newBlock;

        $newBlock = $elem.clone(false);
        var $newBlockData = $newBlock.children(".rexbuilder-block-data");

        galleryEditorInstance._removeHandles($newBlock);

        var newRexID = Rexbuilder_Util.createBlockID();

        galleryEditorInstance.properties.lastIDBlock = galleryEditorInstance.properties.lastIDBlock + 1;

        var newBlockID = "block_" + galleryEditorInstance.properties.sectionNumber + "_" + galleryEditorInstance.properties.lastIDBlock;

        $newBlock.attr("data-rexbuilder-block-id", newRexID);
        $newBlockData.attr("data-rexbuilder_block_id", newRexID);
        $newBlock.attr("id", newBlockID);
        $newBlockData.attr("data-id", newBlockID);
        $newBlockData.attr("id", newBlockID + "-builder-data");

        $newBlock.appendTo($targetSection.eq(0));

        var w = parseInt($newBlock.attr("data-gs-width"));
        var h = parseInt($newBlock.attr("data-gs-height"));
        var $itemContent = $newBlock.find(".grid-item-content");
        var videoTypeActive = Rexbuilder_Util.destroyVideo($itemContent, false);

        // Rexbuilder_Util_Editor.removeScrollBar($newBlock);
        Rexbuilder_Util_Editor.removeTextEditor($newBlock);
        Rexbuilder_Util_Editor_Utilities.removeColorPicker($newBlock);
        galleryEditorInstance._prepareElement($newBlock.eq(0));
        galleryEditorInstance.unFocusElementEditing($newBlock);

        var reverseData = {
            targetElement: $newBlock,
            hasToBeRemoved: true,
            galleryInstance: galleryEditorInstance,
            blocksDisposition: $.extend(true, {}, galleryEditorInstance.properties.reverseDataGridDisposition)
        };

        gridstack.addWidget($newBlock[0], 0, 0, w, h, true, 1, 500, 1);

        var x = parseInt($newBlock.attr("data-gs-x"));
        var y = parseInt($newBlock.attr("data-gs-y"));

        gridstack.batchUpdate();
        gridstack.update($newBlock[0], x, y, w, h);
        gridstack.commit();

        galleryEditorInstance._createFirstReverseStack();
        galleryEditorInstance.properties.numberBlocksVisibileOnGrid = galleryEditorInstance.properties.numberBlocksVisibileOnGrid + 1;
        var actionData = {
            targetElement: $newBlock,
            hasToBeRemoved: false,
            galleryInstance: galleryEditorInstance,
            blocksDisposition: $.extend(true, {}, galleryEditorInstance.properties.reverseDataGridDisposition)
        };

        Rexbuilder_Util_Editor.pushAction(galleryEditorInstance.$element, "updateBlockVisibility", actionData, reverseData);
        $newBlock.removeAttr("data-gs-auto-position");
        if (videoTypeActive != "") {
            $itemContent.addClass(videoTypeActive + "-player");
        }
        Rexbuilder_Util.startVideoPlugin($itemContent);

        var $textWrap = $newBlock.find(".text-wrap");

        if ($elem.hasClass("block-has-slider")) {
            var $oldSlider = $elem.find(".text-wrap").children(".rex-slider-wrap[data-rex-slider-active=\"true\"]");
            $textWrap.children().remove();
            var sectionID = $section.attr("data-rexlive-section-id");
            var modelNumber = typeof $section.attr("data-rexlive-model-number") != "undefined" ? $section.attr("data-rexlive-model-number") : "";
            var rex_block_id = newRexID;

            var target = {
                sectionID: sectionID,
                modelNumber: modelNumber,
                rexID: rex_block_id
            }

            var sliderData = Rexbuilder_Util_Editor.createSliderData($oldSlider);
            Rexbuilder_Util_Editor.saveSliderOnDB(sliderData, true, newBlockID, target);
        } else {
            // if( Rexbuilder_Util_Editor.scrollbarsActive ) {
            //     galleryEditorInstance.addScrollbar($newBlock);
            // }
            TextEditor.addElementToTextEditor($newBlock.find(".text-wrap"));
        }
        // Rexbuilder_Block_Editor.launchSpectrumPickerBackgorundColorBlock($newBlock.find('input[name=edit-block-color-background]')[0]);
        // Rexbuilder_Block_Editor.launchSpectrumPickerOverlayColorBlock($newBlock.find('input[name=edit-block-overlay-color]')[0]);
        Rexbuilder_Block_Editor.updateBlockTools($newBlock);
        Rexbuilder_Util_Editor.launchTooltips();
        Rexbuilder_Util.updateSectionStateLive($section);
        if(Rexbuilder_Util.activeLayout == "default"){
            Rexbuilder_Util.updateDefaultLayoutStateSection($section);
        }
    }

    return {
        createSlider: _createSlider,
        createCopyBlock: _createCopyBlock,
        insertHTMLBlock: _insertHTMLBlock,
        moveBlockToOtherSection: _moveBlockToOtherSection
    };

})(jQuery);