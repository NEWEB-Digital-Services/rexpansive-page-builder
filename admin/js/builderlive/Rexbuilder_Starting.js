; (function ($) {
    'use strict';
    $(document).ready(function () {
        Rexpansive_Builder_Admin_Config.init();
        Rexbuilder_Util_Admin_Editor.init();
        Rexbuilder_Util_Admin_Editor.addResponsiveListeners();
        Rexbuilder_Util_Admin_Editor.add_custom_layout_listener();
    });

})(jQuery);
