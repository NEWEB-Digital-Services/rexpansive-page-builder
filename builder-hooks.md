# THIS IS A LIST OF HOOKS THAT CAN BE USED TO CUSTOMIZE THE BUILDER BEHAVIOUR

BUILDER
---

- `rexbuilder_animation_enabled( bool $activate )`
	- activate or deactivate the animations on all the blocks; the default value comes from the admin area on the settings
- `rexbuilder_js_settings( array $settings = ( ... ) )`
	- filter the global JS object with the settings used on client side
- `rexpansive_builder_remove_shortcodes_live( array $shortcode = ( 'RexTimelinePro', 'RexTimelineProEvent', 'RexliveIcon' ) )`
	- add shortcodes to the blacklist that prevents a shortcode to be renderd inside the builder

SECTION
---

- `rexpansive_builder_section_class( string class = '', array $parsed_atts = ( ... ) )`
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

- `rexpansive_slider_filter_active_video( bool $active = true )`
	- activate or deactivate videos on sliders