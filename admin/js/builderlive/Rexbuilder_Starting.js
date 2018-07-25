; (function ($) {
    'use strict';
    $(document).ready(function () {
        // per adesso, aggiungo qua il modal per i video, non mi vanno gli altri, da capire percè
        $("#wpfooter").after(tmpl("rexlive-tmpl-modal-add-block-video"));
        Rexpansive_Builder_Admin_Config.init();
        Rexbuilder_Util_Admin_Editor.init();
        Rexbuilder_Util_Admin_Editor.addResponsiveListeners();
        Rexbuilder_Util_Admin_Editor.add_custom_layout_listener();
    });

})(jQuery);
