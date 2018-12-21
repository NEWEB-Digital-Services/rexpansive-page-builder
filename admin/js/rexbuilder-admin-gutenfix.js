/**
 * Dev fixes for WP 5.0 and Gutenberg
 * @since 2.0.0
 */
;(function($) {

  // DOMContent LOAD  
  $(function() {
    var $rexbuilder_active = $("#_rexbuilder_active");
    var $builder_switch_wrap = $(".builder-heading");
    var $rexbuilder_wrap = $builder_switch_wrap.nextAll(".rexbuilder-table");
		var $builder_switch = $builder_switch_wrap.find("#builder-switch");

    // Check WP version to use correctly Gutenberg editor
    if ( "true" == _plugin_backend_settings.activate_builder && "true" == $rexbuilder_active.val() ) {
      // Check this global variable to hide the default worpdress text editor
      $("body").addClass("hide-gutenberg");
      $rexbuilder_wrap.show();
    } else {
      $("body").removeClass("hide-gutenberg");
      $rexbuilder_wrap.hide();
      $builder_switch.prop("checked", false);
    }

    $builder_switch.on("change", function() {
      if ($(this).prop("checked")) {
        $("body").addClass("hide-gutenberg");
        $rexbuilder_wrap.show();
        $rexbuilder_active.val("true");
      } else {
        $("body").removeClass("hide-gutenberg");
        $rexbuilder_wrap.hide();
        $rexbuilder_active.val("false");
        $(window).resize();
      }
    });
  });
  
  // Window LOAD
  $(window).load(function () {
    $(window).trigger('resize');

    /**
     * Subscribe on core edit-post to check if sidebar is open
     * @since 2.0.0
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

    /**
     * Triggering save event on Publish button click
     * @since 2.0.0
     */
    $(document).on("click", '.editor-post-publish-button', function() {
      $(document).trigger("rexbuilder:save_content");
    });

    /**
     * Saving the builder activation on click
     * @since 2.0.0
     */
    $(document).on("change", "#builder-switch", function(e) {
      var activate = this.checked;
      const currentMeta = wp.data.select('core/editor').getEditedPostAttribute( 'meta' );
      const newMeta = {
        ...currentMeta,
        _rexbuilder_active: [activate.toString()]
      };

      // GUTENBERG save
      wp.data.dispatch('core/editor').editPost( { meta: newMeta } );
      wp.data.dispatch('core/editor').savePost();
    });
  });
})(jQuery);