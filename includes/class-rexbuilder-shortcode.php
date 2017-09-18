<?php

/**
 * The class that register and render a shortcode.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 */

/**
 * Defines the characteristics of the shortcode
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin
 * @author     Neweb <info@neweb.info>
 *
 */
class Rexbuilder_Shortcode {
	/**
	 * The name of the shortcode.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $Rexbuilder    The name of the shortcode.
	 */
	private $name;

	/**
	 * The attributes of the shortcode.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $Rexbuilder    The attributes of the shortcode.
	 */
	private $attributes;

	/**
	 * The name of the template file that renders the shortcode.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $Rexbuilder    The name of the template file that renders the shortcode.
	 */
	private $template;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $n       		The name of the shortcode.
	 * @param      string    $atts    		The attributes of the shortcode.
	 * @param      string    $temp    		The template file of the shortcode.
	 */
	public function __construct( $n, $atts, $temp ) {
		$this->name = $n;
		$this->attributes = $atts;
		$this->template = $temp;

		//add_shortcode( $this->name, array( $this, 'render_shortcode' ) );
	}

	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since    1.0.0
	 * @param      string    $a       			The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public function render_shortcode( $a, $content = null ) {
		$defaults = $this->attributes;
		extract( shortcode_atts( $defaults, $a ) );
		include plugin_dir_path( __FILE__ ) . '/templates/' . $this->template;
	}
}