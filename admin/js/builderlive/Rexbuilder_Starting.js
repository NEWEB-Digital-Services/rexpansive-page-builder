; (function ($) {
    'use strict';
    $(document).ready(function () {
        Rexpansive_Builder_Admin_Config.init();
        Rexlive_Modals_Utils.init();
        Rexlive_Modals.init();
        Rexpansive_Builder_Admin_PaddingEditor.init();
        Rexpansive_Builder_Admin_PositionEditor.init();
        Rexpansive_Builder_Admin_TextEditor.init();
        Rexbuilder_RexSlider.init();
        Rexbuilder_Util_Admin_Editor.init();
        Rexbuilder_Util_Admin_Editor.addResponsiveListeners();
        Rexbuilder_Util_Admin_Editor.add_custom_layout_listener();
    });

})(jQuery);
