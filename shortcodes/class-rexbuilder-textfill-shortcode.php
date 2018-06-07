<?php

/**
 * The class that register and render a textfill element.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 */

/**
 * Defines the characteristics of the TextFill
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 * @author     Neweb <info@neweb.info>
 *
 */
class Rexbuilder_TextFill {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 */
	public function __construct( ) {

	}

	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since    1.0.0
	 * @param      string    $a       			The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public function render_textfill( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'background' => '',
			'background_id'	=>	'',
			'backgroundcolor'	=>	'transparent',
			'textalignement'	=>	'center',
			'pad_top' => '0',
			'pad_right' => '0',
			'pad_bottom' => '0',
			'pad_left' => '0',
			'margin_top' => '0',
			'margin_right' => '0',
			'margin_bottom' => '0',
			'margin_left' => '0',
			'max_font_size' => ''
		), $atts ) );

		$custom_style = ' style="padding:' . $pad_top . 'px ' . $pad_right . 'px ' . $pad_bottom . 'px ' . $pad_left . 'px;';
		$custom_style .= 'margin:' . $margin_top . 'px ' . $margin_right . 'px ' . $margin_bottom . 'px ' . $margin_left . 'px;';
		$custom_style .= 'background-color:' . $backgroundcolor . ';"';

		if( empty( $background_id ) ) :
			$is_absolute = strpos($background, 'http://');
			
			if( $is_absolute === false ) {
				$background = site_url() . $background;
			}
		endif;

		ob_start();

		echo '<div class="text-fill-container-canvas" ' . $custom_style . ' data-max-font-size="' . $max_font_size . '">';
		echo '<canvas class="text-fill-canvas" width="" height="">' . $content . '</canvas>';
		echo '<div class="text-fill-canvas-background" data-back-src="' . ( !empty( $background_id ) ? wp_get_attachment_url( $background_id ) : $background ) . '" data-text-align="' . $textalignement . '"></div>';
		echo '</div>';

		return ob_get_clean();
	}
}