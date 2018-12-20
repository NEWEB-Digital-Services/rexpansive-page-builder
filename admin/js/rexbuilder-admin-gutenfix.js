/**
 * Dev fixes for WP 5.0 and Gutenberg
 * @since 1.1.4
 */
;(function($) {
  $(function() {
    // DOMContent LOAD
  });
  
  $(window).load(function () {
    // Window LOAD
    $(window).trigger('resize');

    /**
     * Subscribe on core edit-post to check if sidebar is open
     * @since 1.1.4
     */
    var editPost = wp.data.select( 'core/edit-post' ),
      lastSidebarState = editPost.isEditorSidebarOpened();

    wp.data.subscribe( function() {
      var sidebarState = editPost.isEditorSidebarOpened();

      if ( sidebarState !== lastSidebarState ) {
        lastSidebarState = sidebarState;
        setTimeout(function() {
          $(window).trigger('resize');
        },500);
      }

      lastSidebarState = sidebarState;
    } );

    /**
     * Test for tracing change page template
     */
    var editorCore = wp.data.select('core/editor');
    var lastPageTemplate = editorCore.getCurrentPostAttribute("template");

    wp.data.subscribe( function() {
      var pageTemplateState = editorCore.getEditedPostAttribute("template");
      if( pageTemplateState !== lastPageTemplate ) {
        $(document).trigger("rexbuilder:change_page_template");
      }
      lastPageTemplate = pageTemplateState;
    });

    $(document).on("click", '.editor-post-publish-button', function() {
      $(document).trigger("rexbuilder:save_content");
    });
  });
})(jQuery);