
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
        ModelModal.init();
    }

    return {
        init: init,
    };

})(jQuery);