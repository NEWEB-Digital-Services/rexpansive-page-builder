var Rexbuilder_Section = (function ($) {
    'use strict';
    var lastSectionNumber;

    var _prepareSection = function ($section) {
        var oldSectionID = parseInt($section.attr("data-rexlive-section-id"));
        lastSectionNumber = lastSectionNumber + 1;
        var $gallery = $section.find(".grid-stack-row");

        $gallery.removeClass("grid-number-" + oldSectionID);
        $gallery.removeClass(function (index, className) {
            return (className.match(/grid-stack-instance-\d+/g) || []).join(' ');
        });

        // removing scrollbars
        $gallery.find(".grid-item-content").each(function () {
            var $this = $(this);
            var $div = $(document.createElement("div"));
            var $divScrollbar = $this.find(".rex-custom-scrollbar");
            var $textWrap = $this.find('.text-wrap');

            $div.addClass("rex-custom-scrollbar");
            if ($this.hasClass("rex-flexbox")) {
                $div.addClass("rex-custom-position");
            }
            $textWrap.detach().appendTo($div);
            $div.appendTo($divScrollbar.parent());
            $divScrollbar.remove();

            $this = undefined;
            $div = undefined;
            $divScrollbar = undefined;
            $textWrap = undefined;
        });

        //removing text-editor
        $gallery.find(".grid-item-content").each(function () {
            var $this = $(this);
            var $textWrap = $this.find('.text-wrap');
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
                $textWrap.find(".text-editor-span-fix").eq(0).remove();
                $textWrap.remove();
            }

            $this = undefined;
            $textWrap = undefined;
            textWrapContent = undefined;
            $div = undefined;
            css = undefined;
        });

        $section.attr("data-rexlive-section-id", lastSectionNumber);
    }

    var init = function () {
        //Setting row number
        Rexbuilder_Util["$rexContainer"].children('.rexpansive_section').each(function (i, e) {
            $(e).attr('data-rexlive-section-id', i);
            lastSectionNumber = i;
        });
        
        if (Rexbuilder_Util.editorMode === true) {
            //launching sortable
            Rexbuilder_Util["$rexContainer"].sortable({
                handle: ".builder-move-row"
                //            placeholder: "portlet-placeholder ui-corner-all"
            });

            // linking listeners to row setting buttons
            $(document).on('click', '.builder-delete-row', function (e) {
                $(e.currentTarget).parents('.rexpansive_section').addClass("removing_section");
            });

            $(document).on('click', '.builder-copy-row', function (e) {
                Rexbuilder_Util.sectionCopying = true;
                var section = $(e.currentTarget).parents('.rexpansive_section');
                var $newSection;

                $newSection = $(section).clone(false);

                $(section).after($newSection);

                Rexbuilder_Section.prepareSection($newSection);

                $newSection.find('.grid-stack-row').perfectGridGalleryEditor();

                $newSection.find('.builder-delete-row').click(function (e) {
                    $(e.currentTarget).parents('.rexpansive_section').addClass("removing_section");
                });

                Rexbuilder_Util["$rexContainer"].sortable("refresh");

                Rexbuilder_Util.sectionCopying = false;
            });
        }

    }
    return {
        init: init,
        prepareSection: _prepareSection
    }
})(jQuery);