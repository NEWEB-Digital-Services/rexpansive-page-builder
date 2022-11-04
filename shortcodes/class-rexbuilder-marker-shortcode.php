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
			'link_label' => __('Learn more', 'rexpansive-builder'),
			'title' => '',
			'link' => '',
			'classes' => ''
		), $atts ) );

		$styles_arr = array();

		if (!empty($x)) {
			array_push($styles_arr, '--rex-marker-left:' . $x . '%');
		}

		if (!empty($y)) {
			array_push($styles_arr, '--rex-marker-top:' . $y . '%');
		}

		if (!empty($color_1)) {
			array_push($styles_arr, '--rex-marker-color-1:' . $color_1);
		}

		if (!empty($color_2)) {
			array_push($styles_arr, '--rex-marker-color-2:' . $color_2);
		}

		$style = '';
		if (!empty($styles_arr)) {
			$style = ' style="' . implode(';', $styles_arr) . '"';
		}

		$wrap_classes = 'rex-marker';
		if (!empty($classes)) {
			
		}

		ob_start();
?>
<span class="rex-marker"<?php echo $style; ?>>
	<span class="rex-marker__header">
		<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?><?php echo $title; ?>
	</span>
	<span class="rex-marker__content">
		<?php echo do_shortcode($content); ?>
		<?php 
		if (!empty($link)) {
			?><a class="rex-marker__link" href="<?php echo esc_url($link); ?>"><?php echo $link_label; ?></a><?php
		} 
		?>
	</span>
</span>
<?php
		return ob_get_clean();
	}
}