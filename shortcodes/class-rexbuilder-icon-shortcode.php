<?php

/**
 * The class that register and render an icon.
 *
 * @link       htto://www.neweb.info
 * @since      2.0.3
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/shortcodes
 */

/**
 * Defines the characteristics of the icon
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/shortcodes
 * @author     Neweb <info@neweb.info>
 *
 */

if ( ! class_exists( 'Rexbuilder_Icon_Shortcode' ) ) {
	class Rexbuilder_Icon_Shortcode {
		public static function render( $atts, $content = null ) {
			extract( shortcode_atts( array(
				'id' => '',
				'size' => '',
				'color' => '',
				'class' => ''
			), $atts ) );

			ob_start();

			if( ! empty( $id ) ) {
				$i_style = '';
				if ( ! empty( $size ) ) {
					$i_style = ' style="font-size:' . $size . 'px;"';
				}

				$svg_style = '';
				if ( ! empty( $color ) ) {
					$svg_style = ' style="fill:' . $color . ';"';
				}

				$icon_class = array("l-svg-icons");
				if (!empty($class)) {
					$icon_class_arr = explode(' ', $class);
					$icon_class = array_merge($icon_class, $icon_class_arr);
				}

				?><i class="<?php echo implode(' ', $icon_class); ?>"<?php echo $i_style; ?>><svg<?php echo $svg_style; ?>><use xlink:href="#<?php echo $id; ?>"></use></svg></i><?php

			}

			return ob_get_clean();
		}
	}
}