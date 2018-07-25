var Rexbuilder_Section = (function ($) {
    'use strict';
    var _showSectionToolBox = function ($section) {
        $section.children('.section-toolBox').addClass('tool-box-active');
    }

    var _hideSectionToolBox = function ($section) {
        $section.children('.section-toolBox').removeClass('tool-box-active');
    }

    var _linkHoverSection = function ($section) {
        $section.hover(function (event) {
            Rexbuilder_Section.showSectionToolBox($section);
        }, function (event) {
            if ($(event.toElement).parents(".medium-editor-toolbar").length == 0) {
                Rexbuilder_Section.hideSectionToolBox($section);
            }
        });
    }

    var _prepareSection = function ($section) {
        var oldSectionNumber = parseInt($section.attr("data-rexlive-section-number"));
        Rexbuilder_Util.lastSectionNumber = Rexbuilder_Util.lastSectionNumber + 1;


        var $gallery = $section.find(".grid-stack-row");

        $gallery.removeClass("grid-number-" + oldSectionNumber);
        $gallery.removeClass(function (index, className) {
            return (className.match(/grid-stack-instance-\d+/g) || []).join(' ');
        });

        Rexbuilder_Util_Editor.removeDeletedBlocks($gallery);

        // TODO 
        // AGGIORNARE GLI ID DEI BLOCCHI COPIATI
        // removing scrollbars and text editor
        $gallery.find(".grid-stack-item").each(function () {
            Rexbuilder_Util_Editor.removeScrollBar($(this));
            Rexbuilder_Util_Editor.removeTextEditor($(this));
        });

        $section.attr("data-rexlive-section-id", Rexbuilder_Util.createSectionID());

        Rexbuilder_Section.linkHoverSection($section);

        Rexbuilder_Section.hideSectionToolBox($section);
    }

    var _addSectionToolboxListeners = function () {
        $(document).on('click', '.builder-delete-row', function (e) {
            $(e.currentTarget).parents('.rexpansive_section').addClass("removing_section");
        });

        $(document).on('click', '.builder-copy-row', function (e) {
            console.log("copying row");
            Rexbuilder_Util_Editor.sectionCopying = true;
            var section = $(e.currentTarget).parents('.rexpansive_section');
            var $newSection;

            $newSection = $(section).clone(false);

            $(section).after($newSection);

            Rexbuilder_Section.prepareSection($newSection);

            $newSection.find('.grid-stack-row').perfectGridGalleryEditor();

            $newSection.find('.grid-stack-row').perfectGridGalleryEditor("updateGrid");

            Rexbuilder_Util.$rexContainer.sortable("refresh");

            Rexbuilder_Util_Editor.sectionCopying = false;
        });

        $(document).on("click", ".collapse-grid", function (e) {
            console.log("collapse");
            var $section = $(e.target).parents(".rexpansive_section");
            var $grid = $section.find(".grid-stack-row");
            var galleryEditorIstance = $grid.data().plugin_perfectGridGalleryEditor;
            if (galleryEditorIstance.properties.oneColumModeActive) {
                galleryEditorIstance.removeCollapseGrid();
            } else {
                galleryEditorIstance.collapseElements();
            }
        });

        $(document).on("click", ".set-section-name", function (e) {
            console.log("adding section name");
            /* 
            var newID = Math.floor(Math.random() * 1000000);
            Rexbuilder_Util_Editor.updateNavigatorItem($section, "");  */
        });

        $(document).on("click", ".add-new-block-empty", function (e) {
            event.preventDefault();
            var galleryEditorIstance = $(e.target).parents(".rexpansive_section").find(".grid-stack-row").data().plugin_perfectGridGalleryEditor;
            galleryEditorIstance.createNewBlock(galleryEditorIstance.settings.galleryLayout);
        });

        $(document).on("click", ".add-new-block-text", function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            var galleryEditorIstance = $(e.target).parents(".rexpansive_section").find(".grid-stack-row").data().plugin_perfectGridGalleryEditor;
            var $elem = galleryEditorIstance.createNewBlock(galleryEditorIstance.settings.galleryLayout);
            var event = jQuery.Event("mouseup");
            event.target = $elem.find(".rexlive-block-drag-handle");
            event.offsetY = 0;
            $elem.trigger(event);
        });
    }

    var init = function () {
        //Setting row number
        Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function () {
            var $this = $(this);
            Rexbuilder_Section.linkHoverSection($this);
            if ($.isEmptyObject($this.attr("id"))) {
                console.log("no id");
                $this.attr("id", "");
            } else {
                console.log($this.attr("id"));
            }
        });

        //launching sortable
        Rexbuilder_Util.$rexContainer.sortable({
            handle: ".builder-move-row",
            stop: function (event, ui) {
                Rexbuilder_Util_Editor.fixNavigatorItemOrder($(event.srcElement).parents(".rexpansive_section"));
            }
        });

        // linking listeners to row setting buttons
        _addSectionToolboxListeners();

    }

    return {
        init: init,
        prepareSection: _prepareSection,
        showSectionToolBox: _showSectionToolBox,
        hideSectionToolBox: _hideSectionToolBox,
        linkHoverSection: _linkHoverSection
    }
})(jQuery);