var Rexbuilder_Section = (function ($) {
    'use strict';
    var lastSectionNumber;

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
        var oldSectionID = parseInt($section.attr("data-rexlive-section-id"));
        lastSectionNumber = lastSectionNumber + 1;
        var $gallery = $section.find(".grid-stack-row");

        $gallery.removeClass("grid-number-" + oldSectionID);
        $gallery.removeClass(function (index, className) {
            return (className.match(/grid-stack-instance-\d+/g) || []).join(' ');
        });

        Rexbuilder_Util_Editor.removeDeletedBlocks($gallery);

        // removing scrollbars and text editor
        $gallery.find(".grid-stack-item").each(function () {
            Rexbuilder_Util_Editor.removeScrollBar($(this));
            Rexbuilder_Util_Editor.removeTextEditor($(this));
        });

        $section.attr("data-rexlive-section-id", lastSectionNumber);
        Rexbuilder_Section.linkHoverSection($section);

        Rexbuilder_Section.hideSectionToolBox($section);
    }

    var init = function () {
        //Setting row number
        Rexbuilder_Util.$rexContainer.children('.rexpansive_section').each(function (i, e) {
            $(e).attr('data-rexlive-section-id', i);
            lastSectionNumber = i;
        });

        if (Rexbuilder_Util.editorMode === true) {
            Rexbuilder_Util.$rexContainer.children(".rexpansive_section").each(function () {
                var $this = $(this);
                Rexbuilder_Section.linkHoverSection($this);
            });

            //launching sortable
            Rexbuilder_Util.$rexContainer.sortable({
                handle: ".builder-move-row"
                //            placeholder: "portlet-placeholder ui-corner-all"
            });

            // linking listeners to row setting buttons
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
        }

    }
    return {
        init: init,
        prepareSection: _prepareSection,
        showSectionToolBox: _showSectionToolBox,
        hideSectionToolBox: _hideSectionToolBox,
        linkHoverSection: _linkHoverSection
    }
})(jQuery);