<?php

/**
 * The class that register and render a indicator element.
 *
 * @link       htto://www.neweb.info
 * @since      1.1.3
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/shortcodes
 */

/**
 * Defines the characteristics of the indicator
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/shortcodes
 * @author     Neweb <info@neweb.info>
 *
 */
class Rexbuilder_Model {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.1.3
	 */
	public function __construct( ) {

	}

	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since   	1.1.3
	 * @param      string    $atts       		The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public function render_model( $atts, $content = null) {
		extract( shortcode_atts( array(
			'id' => ''
		), $atts ) );
		
		if(isset($id) && $id != ""){
			ob_start();
			$post = get_post((int)$id, ARRAY_A);
			$content = $post["post_content"];
			echo do_shortcode($content);
			return ob_get_clean();
		} else {
			return "";
		}
	}
}