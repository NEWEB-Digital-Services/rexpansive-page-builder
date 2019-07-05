/**
 * Dev fixes for WP 5.0 and Gutenberg
 * @since 2.0.0
 */
;(function($) {

  $(function() {
    var $rexbuilder_active = $("#_rexbuilder_active");
    var $builder_switch_wrap = $(".builder-heading");
    var $rexbuilder_wrap = $builder_switch_wrap.nextAll(".rexbuilder-table");
		var $builder_switch = $builder_switch_wrap.find("#builder-switch");

    if ( "true" == _plugin_backend_settings.activate_builder && "true" == $rexbuilder_active.val() ) {
      //console.log("Rexpansive- wpVersion-\npbs.avb ==", _plugin_backend_settings.activate_builder,"&& rb_a.v ==",$rexbuilder_active.val())
      $("body").addClass("hide-gutenberg");
      if( 'true' === _plugin_backend_settings.saved_from_backend )
      {
        $rexbuilder_wrap.show();
      }
    } else {
      //console.log("Rexpansive- wpVersion-\npbs.avb !=", _plugin_backend_settings.activate_builder,"|| rb_a.v !=",$rexbuilder_active.val())
      $("body").removeClass("hide-gutenberg");
      $rexbuilder_wrap.hide();
      $builder_switch.prop("checked", false);
    }

    $builder_switch.on("change", function() {
      if ($(this).prop("checked")) {
        //console.log("Rexpansive- switch- status- true");
        $("body").addClass("hide-gutenberg");
        if( 'true' === _plugin_backend_settings.saved_from_backend )
        {
          $rexbuilder_wrap.show();
        }
        $rexbuilder_active.val("true");
      } else {
        //console.log("Rexpansive- switch- status- false");
        $("body").removeClass("hide-gutenberg");
        $rexbuilder_wrap.hide();
        $rexbuilder_active.val("false");
        $(window).resize();
      }
    });
  });


  // Window LOAD
  $(window).load(function () {

    // Updates the status of the "LIVE" button when the page loads.
    var pageName_LoadPage = $("#post-title-0").val();
    var pageName_LoadPage_Trim = pageName_LoadPage.trim();
    if( pageName_LoadPage_Trim == "" ){
      //console.log('pageName_LoadPage_Trim == ""');
      $(".go-live-advice-overlay-status").css("display","block");
      $("#go-live-client-button").addClass("glaCC-false").removeClass("glaCC-true");
    } else {
      //console.log('pageName_LoadPage_Trim != "'+pageName_LoadPage+'"');
      $(".go-live-advice-overlay-status").css("display","none");
      $("#go-live-client-button").addClass("glaCC-true").removeClass("glaCC-false");
    }

    $(window).trigger('resize');

    /**
     * Subscribe on core edit-post to check if sidebar is open
     * Launch a resize window, to correctly refresh the builder
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
     * Subscribe on core editor to tracing change page template
     * @since 2.0.0
     */
    var editorCore = wp.data.select('core/editor');
    var lastPageTemplate = editorCore.getCurrentPostAttribute("template");
    var lastPostTitle = editorCore.getCurrentPostAttribute("title");

    wp.data.subscribe( function() {
      var pageTemplateState = editorCore.getEditedPostAttribute("template");
      if( pageTemplateState !== lastPageTemplate ) {
        $(document).trigger("rexbuilder:change_page_template");
      }
      lastPageTemplate = pageTemplateState;
    });

    // Changes the status of the "LIVE" button according to the WordPress NamePage Textbox value.
    var $go_live_button = $("#go-live-client-button");
    wp.data.subscribe( function() {
      var postTitle = editorCore.getEditedPostAttribute("title");
      if( postTitle !== lastPostTitle ) {
        var pageName_KeyPress = $("#post-title-0").val();
        var pageName_KeyPress_Trim = pageName_KeyPress.trim();
        if ( pageName_KeyPress_Trim !== "" && !$go_live_button.hasClass('draft') )
        {
          $(".go-live-advice-overlay-status").css("display","none");
          $go_live_button.addClass("glaCC-true").removeClass("glaCC-false");
        }
        else
        {
          $(".go-live-advice-overlay-status").css("display","block");
          $go_live_button.addClass("glaCC-false").removeClass("glaCC-true");
        }
        
        // if( pageName_KeyPress_Trim == "" ) {
        //   $(".go-live-advice-overlay-status").css("display","block");
        //   $go_live_button.addClass("glaCC-false").removeClass("glaCC-true");
        // } else {
        //   console.log(!$go_live_button.hasClass('draft'));
        //   if ( !$go_live_button.hasClass('draft') )
        //   {
        //     $(".go-live-advice-overlay-status").css("display","none");
        //     $go_live_button.addClass("glaCC-true").removeClass("glaCC-false");
        //   }
        // }
      }
      lastPostTitle = postTitle;
    });

    /**
     * Triggering save event on Publish button click
     * @since 2.0.0
     */

    $(document).on("click", '.editor-post-publish-button', function() {
      $(document).trigger("rexbuilder:save_content");
      $go_live_button.removeClass('draft').addClass("glaCC-true").removeClass("glaCC-false");
      // console.log("WordPress- launch- rexbuilder:save_content");
    });

    /**
     * Saving the builder activation on click
     * @since 2.0.0
     */
    $(document).on("change", "#builder-switch", function(e) {
      var activate = this.checked;

      // GUTENBERG APIs (gives error)
      /*
      const currentMeta = wp.data.select('core/editor').getEditedPostAttribute( 'meta' );
      const newMeta = {
        ...currentMeta,
        _rexbuilder_active: [activate.toString()]
      };

      // GUTENBERG save
      wp.data.dispatch('core/editor').editPost( { meta: newMeta } );
      wp.data.dispatch('core/editor').savePost();
      */

      // STANDARD AJAX
      $.ajax({
        type: "POST",
        url: rexajax.ajaxurl,
        data: {
          action: "rex_change_builder_activation_status",
          nonce_param: rexajax.rexnonce,
          post_id: wp.data.select('core/editor').getCurrentPostId(),
          status: activate
        },
        success: function(response) {
          //console.log("Rexpansive- switch- ajax- success");
        },
        error: function(response) {    
          //console.log("Rexpansive- switch- ajax- error");
        }
      });
    });
  });
})(jQuery);