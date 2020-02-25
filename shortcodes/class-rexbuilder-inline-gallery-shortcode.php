<?php

/**
 * The class that register and render an inline photoswipe gallery
 *
 * @link       htto://www.neweb.info
 * @since      1.1.4
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
if ( ! class_exists( 'Rexbuilder_Inline_Gallery' ) ) {
	class Rexbuilder_Inline_Gallery {
		/**
		 * Function that render the shortcode, merging the attributes and displaying the template.
		 *
		 * @since   	1.1.4
		 * @param      string    $atts       		The attributest passed.
		 * @param      string    $content    		The content passed.
		 */
		public static function render( $atts, $content = null ) {
			extract( shortcode_atts( array(
				'label' => '',
				'custom_class' => '',
				'background_color' => '',
				'border_width' => '',
				'border_style' => 'solid',
				'border_color' => '',
				'border_radius' => '',
				'color' => '',
				'padding' => ''
			), $atts ) );

			$re = '/wp-image-(\d+)/m';

			preg_match_all($re, $content, $matches, PREG_SET_ORDER, 0);

			$style = '';

			if( "" !== $background_color ) {
				$style .= 'background-color:' . $background_color . ';';
			}

			if( "" !== $border_width ) {
				$style .= 'border-width:' . $border_width . ';';
			}
			
			if( "" !== $border_style ) {
				$style .= 'border-style:' . $border_style . ';';
			}

			if( "" !== $border_color ) {
				$style .= 'border-color:' . $border_color . ';';
			}

			if( "" !== $color ) {
				$style .= 'color:' . $color . ';';
			}

			if( "" !== $padding ) {
				$style .= 'padding:' . $padding . ';';
			}

			if( "" !== $style ) {
				$style = ' style="' . $style . '"';
			}

			ob_start();

			$items = array();

			if( count( $matches) > 0 ) {
				foreach( $matches as $media ) {
					$media_attrs = wp_get_attachment_image_src( (int)$media[1], 'full' );
					array_push( $items, array( "src" => $media_attrs[0], "w" => $media_attrs[1], "h" => $media_attrs[2] ) );
				}
?>
<span class="inline-pswp-gallery<?php echo ( '' !== $custom_class ? ' ' . $custom_class : '' ); ?>" data-pswp-uid="inline-gallery-<?php echo rand(); ?>" data-inline-pswp-info='<?php echo json_encode( $items ); ?>'<?php echo $style; ?>><?php echo $label; ?></span>
<?php
			}
			return ob_get_clean();
		}
	}
}