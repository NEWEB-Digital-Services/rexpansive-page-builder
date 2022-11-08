<?php

/**
 * The class that register and render a indicator element.
 *
 * @link       htto://www.neweb.info
 * @since      2.1.0
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
class Rexbuilder_Indicator {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    2.1.0
	 */
	public function __construct( ) {

	}

	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since   	2.1.0
	 * @param      string    $atts       		The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public function render_indicator( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'color' => '#000',
			'color_dot' => '',
			'color_line' => '',
			'dot_size' => '', 		// measure in pixel
			'line_style' => '',		// solid|dotted|dashed|... (css border style prop)
			'from' => 'inside',		// inside|outside
			'to' => 'bottom',		// top|right|bottom|left
			'to_amount' => 'auto',	// auto|all
			'position' => 'absolute',	// static|absolute,
			'relative_to' => 'block', 		// block|start|parent
			'realtive_to_parent_position' => '50',	// precentage position from the top parent
			'classes' => '',
			'wrap_classes' => '',
			'mobile_rotate' => 'false'
		), $atts ) );

		$rules_arr = array();

		if( empty( $color_dot ) ) {
			$color_dot = $color;
		}

		if( empty( $color_line ) ) {
			$color_line = $color;
		}

		array_push($rules_arr, '--rex-indicator-dot-background-color:' . $color_dot);
		array_push($rules_arr, '--rex-indicator-line-background-color:' . $color_line);

		if (!empty($line_style)) {
			array_push($rules_arr, '--rex-indicator-line-style:' . $line_style);
		}

		if (!empty($dot_size)) {
			array_push($rules_arr, '--rex-indicator-dot-size:' . $dot_size);
		}

		$wrap_styles = '';
		if (!empty($rules_arr)) {
			$wrap_styles = ' style="' . implode(';', $rules_arr) . '"';
		}

		$direction = 'rex-indicator__wrap--';

		if( $to == 'left' || $to == 'right' ) {
			$direction .= 'horizontal';
		} else {
			$direction .= 'vertical';
		}

		$wrap = '';
		if( $position == 'absolute' ) {
			$wrap .= 'rex-indicator__placeholder';
		} else {
			$wrap .= 'rex-indicator__standard';
		}

		$wrap .= ' rex-indicator__' . $relative_to . '-relative';

		if( "" !== $wrap_classes ) {
			$wrap .= ' ' . $wrap_classes;
		}

		$inline_options = array();
		if (!empty($from)) {
			$inline_options['from'] = $from;
		}
		if (!empty($to)) {
			$inline_options['to'] = $to;
		}
		if (!empty($relative_to)) {
			$inline_options['relative_to'] = $relative_to;
		}
		if (!empty($relative_to_parent_position)) {
			$inline_options['relative_to_parent_position'] = $relative_to_parent_position;
		}
		if (!empty($to_amount)) {
			$inline_options['to_amount'] = $to_amount;
		}
		$inline_options_attr = '';
		if (!empty($inline_options)) {
			$inline_options_attr = " data-rex-indicator-options='" . json_encode($inline_options) . "'";
		}

		$indicator_classes = array();
		array_push($indicator_classes, 'rex-indicator__wrap');
		array_push($indicator_classes, 'rex-indicator__wrap--' . $position);
		if ('true' == $mobile_rotate) {
			array_push($indicator_classes, 'rex-indicator__wrap--mobile-rotate');
		}

		ob_start();

?><span class="<?php echo $wrap; ?>"<?php echo $inline_options_attr; ?>>
	<span class="<?php echo implode(' ', $indicator_classes); ?><?php echo ( "" != $classes ? ' ' . $classes : '' ); ?>" data-ri-from="<?php echo esc_attr( $from ); ?>" data-ri-to="<?php echo esc_attr( $to ); ?>" data-ri-relative-to="<?php echo esc_attr( $relative_to ); ?>" data-ri-relative-to-parent-position="<?php echo esc_attr( $realtive_to_parent_position ); ?>" data-ri-to-amount="<?php echo esc_attr($to_amount); ?>"<?php echo $wrap_styles; ?>>
		<span class="<?php echo esc_attr( $direction ); ?>">
		<?php if( ( ( $to == 'left' || $to == 'top' ) && ( $from == 'inside' ) ) || ( ( $to == 'right' || $to == 'bottom' ) && ( $from == 'outside' ) ) ) { ?>
			<span class="rex-indicator__dot"></span>
			<span class="rex-indicator__line"></span>
		<?php } else { ?>
			<span class="rex-indicator__line"></span>
			<span class="rex-indicator__dot"></span>
		<?php } ?>
		</span>
		</span>
	<?php if( $position == 'static' && "" != $content ) { ?><div><?php echo do_shortcode( $content ); ?></div><?php } ?>
</span>
<?php

		return ob_get_clean();
	}
}