# THIS IS A LIST OF HOOKS THAT CAN BE USED TO CUSTOMIZE THE BUILDER BEHAVIOUR

BUILDER
---

- `apply_filters( rexbuilder_animation_enabled, bool $activate )`
	- activate or deactivate the animations on all the blocks; the default value comes from the admin area on the settings
- `apply_filters( rexbuilder_js_settings, array $settings = ( ... ) )`
	- filter the global JS object with the settings used on client side
- `apply_filters( rexpansive_builder_remove_shortcodes_live, array $shortcode = ( 'RexTimelinePro', 'RexTimelineProEvent', 'RexliveIcon' ) )`
	- add shortcodes to the blacklist that prevents a shortcode to be renderd inside the builder

SECTION
---

- `apply_filters( rexpansive_builder_section_class, string class = '', array $parsed_atts = ( ... ) )`
	- add a custom class to the sections

BLOCK
---
- `rexbuilder_animation_enabled`($options['animation'])
- `rexpansive_block_element_link_custom_class`( string class = '' )
	- add custom class to link tag of a block with link
- `rexpansive_block_grid_item_content_custom_class`('')
- `rexpansive_block_text_wrap_custom_class`('')
- `rexpansive_block_custom_class`(trim($block_custom_class), $id)

SLIDER
---

- `apply_filters( rexpansive_slider_filter_active_video, bool $active = true )`
	- activate or deactivate videos on sliders

`apply_filters( 'rexpansive_builder_live_inline_icon_list', Rexbuilder_Utilities::get_icon_list() )`

`do_action('rexpansive_builder_after_contacts_settings')`

`do_action('rexpansive_builder_after_settings')`

`apply_filters( 'rexbuilder_iframe_src', get_permalink( $post_id ), $post_id )`

`do_action( 'rexbuilder_block_pswp_item_caption' )`

`apply_filters( 'rex_button_cta_message_field', $default_message_field )`

`apply_filters( 'rexpansive_shortcode_black_list', array( 'RexFacebookGallery' ) )`

`apply_filters( 'rexbuilder_post_type_active', $condition ) )`

`do_action('rexpansive_builder_live_after_page_information', Rexbuilder_Utilities::isBuilderLive() )`

`do_action( 'rexbuilder_slider_pswp_item_caption' )`

`do_action( 'rex_slider_after_gallery_inside', $slider_id )`

`do_action( 'rexbuilder_block_pswp_item_caption' )`

`do_action( 'rex_slider_after_gallery_render', $slider_id )`

`apply_filters( 'rexpansive_slider_filter_active_video', true )`

`apply_filters( 'rexpansive_slider_filter_element_title', $slide['_rex_banner_gallery_image_title'], $slide ) )`

`apply_filters( 'rexpansive_slider_filter_active_video', true )`

`apply_filters( 'rexpansive_slider_filter_element_title', $slide['_rex_banner_gallery_image_title'], $slide ) )`

`do_action('rexpansive_section_before_grid', array(&$parsed_atts))`

`apply_filters('rexpansive_filter_section', $content, array(&$parsed_atts))`

`apply_filters('rexpansive_section_grid_custom_class', $grid_custom_classes, array(&$parsed_atts) )`

`do_action( 'rexpansive_importheme_start' )`

`do_action( 'rexbuilder_block_pswp_item_caption' )`

`apply_filters('rexbuilder_animation_enabled', $options['animation'])`

`apply_filters('rexpansive_block_element_link_custom_class', '')`

`apply_filters('rexpansive_block_grid_item_content_custom_class', '')`

`apply_filters('rexpansive_block_text_wrap_custom_class', '')`

`apply_filters('rexpansive_block_custom_class', trim($block_custom_class), $id)`

`do_action( 'rexpansive_builder_before_rexbuilder_header', $post->ID )`

`do_action( 'rexpansive_builder_add_builder_customization' )`

`apply_filters( 'rexpansive_builder_customize_builder', false )`

`do_action( 'rexpansive_builder_live_after_save_editable_fields', $postID, $response )`

`do_action( 'rexpansive_builder_before_rexbuilder_live_content' )`

`do_action( 'rexbuilder_builder_after_live_content' )`

`apply_filters( 'rexbuilder_live_experimental_tools', $ex_tools )`

`apply_filters( 'rexbuilder_live_experimental_tools', $ex_tools )`

`apply_filters( 'rexbuilder_js_settings', $settings )`

`apply_filters( 'rexpansive_builder_remove_shortcodes_live', array( 'RexTimelinePro', 'RexTimelineProEvent', 'RexliveIcon' ) )`

`apply_filters('rexbuilder_post_active', get_post_meta($post->ID, '_rexbuilder_active', true))`

`apply_filters('rexbuilder_dots_active', true)`

`apply_filters( 'rexbuilder_post_type_active', $condition ) )`

`apply_filters( 'the_title', $query->post->post_title, $query->post->ID )`

`apply_filters( 'rexbuilder_admin_post_type_active', $active )`

