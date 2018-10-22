; (function ($) {
    'use strict';
    $(document).ready(function () {
        tippy('.tippy',{
            arrow: true,
            arrowType: 'round',
            size: 'small',
            theme: 'rexlive'
        });
        Rexbuilder_Util_Admin_Editor.init();
        Rexpansive_Builder_Admin_Config.init();
        Rexlive_Modals_Utils.init();
        Rexlive_Modals.init();
        Rexpansive_Builder_Admin_PaddingEditor.init();
        Rexpansive_Builder_Admin_PositionEditor.init();
        Rexpansive_Builder_Admin_TextEditor.init();
        Rexbuilder_RexSlider.init();
    });

})(jQuery);
