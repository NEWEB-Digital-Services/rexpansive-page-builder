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
class Rexbuilder_Indicator {
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
	public function render_indicator( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'color' => '#000',
			'color_dot' => '',
			'color_line' => '',
			'from' => 'inside',		// inside|outside
			'to' => 'bottom',		// top|right|bottom|left
			'to_amount' => 'auto',	// auto|all
			'position' => 'absolute',	// static|absolute,
			'relative_to' => 'block', 		// block|start|parent
			'realtive_to_parent_position' => '50',	// precentage position from the top parent
			'classes' => '',
			'wrap_classes' => ''
		), $atts ) );

		if( empty( $color_dot ) ) {
			$color_dot = $color;
		}

		if( empty( $color_line ) ) {
			$color_line = $color;
		}

		$color_dot_style = ' style="background-color:' . $color_dot . ';"';
		$color_line_style = ' style="background-color:' . $color_line . ';"';

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

		ob_start();

?><span class="<?php echo $wrap; ?>">
	<span class="rex-indicator__wrap rex-indicator__wrap--<?php echo $position; ?><?php echo ( "" != $classes ? ' ' . $classes : '' ); ?>" data-ri-from="<?php echo esc_attr( $from ); ?>" data-ri-to="<?php echo esc_attr( $to ); ?>" data-ri-relative-to="<?php echo esc_attr( $relative_to ); ?>" data-ri-relative-to-parent-position="<?php echo esc_attr( $realtive_to_parent_position ); ?>" data-ri-to-amount="<?php echo esc_attr($to_amount); ?>">
		<span class="<?php echo esc_attr( $direction ); ?>">
		<?php if( ( ( $to == 'left' || $to == 'top' ) && ( $from == 'inside' ) ) || ( ( $to == 'right' || $to == 'bottom' ) && ( $from == 'outside' ) ) ) { ?>
			<span class="rex-indicator__dot"<?php echo $color_dot_style ?>></span>
			<span class="rex-indicator__line"<?php echo $color_line_style ?>></span>
		<?php } else { ?>
			<span class="rex-indicator__line"<?php echo $color_line_style ?>></span>
			<span class="rex-indicator__dot"<?php echo $color_dot_style ?>></span>
		<?php } ?>
		</span>
		</span>
	<?php if( $position == 'static' && "" != $content ) { ?><div><?php echo do_shortcode( $content ); ?></div><?php } ?>
</span>
<?php

		return ob_get_clean();
	}
}