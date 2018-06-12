var Rexbuilder_Section = (function ($)  {
    'use strict';
    var $rexContent;
    var sectionNumber;

    var init = function () {
        console.log("Launching section");
        
        $('.rexpansive_section').wrapAll("<div class=\"rex-container\"></div>");
        $rexContent = $(".rex-container");

        //Setting row number
        $rexContent.children('.rexpansive_section').each(function (i, e) {
            $(e).attr('data-rexlive-section-id', i);
        });
        
        if (Rexbuilder_Util.editorMode === true) {
            console.log("editor mode");
        } else {
            console.log("user mode");
        }

        if (Rexbuilder_Util.editorMode === true) {
            //launching sortable
            $rexContent.sortable({
                handle: ".builder-move-row"
                //            placeholder: "portlet-placeholder ui-corner-all"
            });

            $rexContent.find('.builder-delete-row').click(function(e){
                $(e.currentTarget).parents('.rexpansive_section').addClass("removing_section");
            });

        }

    }
    return {
        init: init,
    }
})(jQuery);