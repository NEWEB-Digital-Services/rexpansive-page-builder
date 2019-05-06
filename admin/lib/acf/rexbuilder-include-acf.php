<?php
if( !defined( 'ACF_LITE' ) ) {
    define( 'ACF_LITE', true );
}

// 4. Include ACF
include_once( REXPANSIVE_BUILDER_PATH . 'admin/lib/acf/advanced-custom-fields/acf.php' );

// Include ACF Repeater Add-on
include_once( REXPANSIVE_BUILDER_PATH . 'admin/lib/acf/acf-repeater/acf-repeater.php');

if(function_exists("register_field_group")) {
    register_field_group(array (
        'id' => 'acf_rexpansive-slider',
        'title' => 'Rexpansive Slider',
        'fields' => array (
            array (
                'key' => 'field_564f2373722c3',
                'label' => 'Slides',
                'name' => '_rex_banner_gallery',
                'type' => 'repeater',
                'sub_fields' => array (
                    array (
                        'key' => 'field_5675394f2fa0f',
                        'label' => 'Image',
                        'name' => '_rex_banner_gallery_image',
                        'type' => 'image',
                        'column_width' => '',
                        'save_format' => 'object',
                        'preview_size' => 'thumbnail',
                        'library' => 'all',
                    ),
                    array (
                        'key' => 'field_567539852fa11',
                        'label' => 'Title',
                        'name' => '_rex_banner_gallery_image_title',
                        'type' => 'wysiwyg',
                        'column_width' => '',
                        'default_value' => '',
                        'toolbar' => 'full',
                        'media_upload' => 'no',
                    ),
                    array (
                        'key' => 'field_580e08d79f9db',
                        'label' => 'Video',
                        'name' => '_rex_banner_gallery_video',
                        'type' => 'text',
                        'column_width' => '',
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'formatting' => 'html',
                        'maxlength' => '',
                    ),
                    array (
                        'key' => 'field_5948ca17a1bb8',
                        'label' => 'Mp4',
                        'name' => '_rex_banner_gallery_video_mp4',
                        'type' => 'file',
                        'column_width' => '',
                        'save_format' => 'object',
                        'library' => 'all',
                    ),
                    array (
                        'key' => 'field_5948eb01358e1',
                        'label' => 'Audio',
                        'name' => '_rex_banner_gallery_video_audio',
                        'type' => 'checkbox',
                        'column_width' => '',
                        'choices' => array (
                            'yes' => 'Enable',
                        ),
                        'default_value' => '',
                        'layout' => 'vertical',
                    ),
                    array (
                        'key' => 'field_594a186edc532',
                        'label' => 'Url',
                        'name' => '_rex_banner_gallery_url',
                        'type' => 'text',
                        'column_width' => '',
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'formatting' => 'html',
                        'maxlength' => '',
                    ),
                ),
                'row_min' => '',
                'row_limit' => '',
                'layout' => 'row',
                'button_label' => 'Add Slide',
            ),
            array (
                'key' => 'field_564f1f0c050bc',
                'label' => 'Enable Animation',
                'name' => '_rex_enable_banner_animation',
                'type' => 'checkbox',
                'instructions' => 'If check, enables animation on banner images',
                'choices' => array (
                    'yes' => 'Enable',
                ),
                'default_value' => 'yes',
                'layout' => 'horizontal',
            ),
            array (
                'key' => 'field_5948caf770b0e',
                'label' => 'View Prev Next Arrows',
                'name' => '_rex_enable_banner_prev_next',
                'type' => 'checkbox',
                'choices' => array (
                    'yes' => 'Enable',
                ),
                'default_value' => 'yes',
                'layout' => 'horizontal',
            ),
            array (
                'key' => 'field_5948cb2270b0f',
                'label' => 'View Dots',
                'name' => '_rex_enable_banner_dots',
                'type' => 'checkbox',
                'choices' => array (
                    'yes' => 'Enable',
                ),
                'default_value' => 'yes',
                'layout' => 'horizontal',
            ),
        ),
        'location' => array (
            array (
                array (
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'rex_slider',
                    'order_no' => 0,
                    'group_no' => 0,
                ),
            ),
        ),
        'options' => array (
            'position' => 'normal',
            'layout' => 'default',
            'hide_on_screen' => array (
            ),
        ),
        'menu_order' => 0,
    ));
}

$navigation_choices = array(
	'none'			=>	'None',
	// 'horizontal_points' => 'Horizontal Points',
	// 'horizontal_text' => 'Horizontal Text',
	'vertical_points' => 'Vertical Points',
);

// if( Rexpansive_Classic_Utilities::is_horizontal_dot_points_active() ) {
// 	$navigation_choices['horizontal_points'] = 'Horizontal Points';
// }

if(function_exists("register_field_group"))
{
	register_field_group(array (
		'id' => 'acf_internal-navigation',
		'title' => 'Internal Navigation',
		'fields' => array (
			array (
				'key' => 'field_56cb20b3f2432',
				'label' => 'Navigation Type',
				'name' => '_rex_navigation_type',
				'type' => 'select',
				'conditional_logic' => array (
					'status' => 1,
					'rules' => array (
						array (
							'field' => 'null',
							'operator' => '==',
						),
					),
					'allorany' => 'all',
				),
				'choices' => $navigation_choices,
				'default_value' => 'horizontal_points',
				'allow_null' => 0,
				'multiple' => 0,
			),
		),
		'location' => array (
			array (
				array (
					'param' => 'rexpansive_builder',
					'operator' => '==',
					'value' => 1,
					'order_no' => 0,
					'group_no' => 0,
				),
			),
		),
		'options' => array (
			'position' => 'normal',
			'layout' => 'default',
			'hide_on_screen' => array (
			),
		),
		'menu_order' => 0,
	));
}