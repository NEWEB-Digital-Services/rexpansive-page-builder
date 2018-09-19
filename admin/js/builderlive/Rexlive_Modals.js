
var Rexlive_Modals = (function ($) {
    'use strict';

    var init = function () {
        // section
        Section_Modal.init();

        // new blocks video
        Insert_Video_Modal.init();

        // custom css
        CssEditor_Modal.init();

        // background row
        SectionBackground_Modal.init();

        // block options
        BlockOptions_Modal.init();

        // models
        Model_Modal.init();

        // models edit
        Model_Edit_Modal.init();

        // layouts
        CustomLayouts_Modal.init();

        // change active layout
        Change_Layout_Modal.init();

        // change active layout
        LockedOptionMask.init();

        // change active layout
        Model_Import_Modal.init();
    }

    return {
        init: init,
    };

})(jQuery);