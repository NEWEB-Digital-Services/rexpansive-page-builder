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
class Rexbuilder_Marker {
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
	public function render( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'x' => '',
			'y' => '',
			'color_1' => '',
			'color_2' => '',
			'label' => '',
			'link' => '',
			'classes' => ''
		), $atts ) );

		$wrap_classes = 'rex-marker';
		if (!empty($classes)) {
			
		}

		ob_start();
?>
<span class="rex-marker">
	<span class="rex-marker__header">
		<?php echo $label; ?>
	</span>
	<span class="rex-marker__content">
		
	</span>
</span>
<?php
		return ob_get_clean();
	}
}