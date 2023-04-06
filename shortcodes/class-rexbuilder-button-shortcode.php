<?php

/**
 * The class that register and render a indicator element.
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
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
class Rexbuilder_Button {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    2.0.0
	 */
	public function __construct( ) {

	}

	/**
	 * Function that render the shortcode, merging the attributes and displaying the template.
	 *
	 * @since   	2.0.0
	 * @param      string    $atts       		The attributest passed.
	 * @param      string    $content    		The content passed.
	 */
	public function render_button( $atts, $content = null ) {
		extract( shortcode_atts( array(
            // "border" => 'true',
            "link" => '#',
            'target' => '_self',
            'color' => '',
            'border' => '',
            'background' => '',
            'isinsidelink' => 'false',
            'classes' => '',
            'custom_style' => '',
            'default_message' => '',
            'default_message_field' => ''
        ), $atts ) );

        $default_message_field = apply_filters( 'rex_button_cta_message_field', $default_message_field );

        $additional_styles = '';
        if( !empty( $color ) ) {
            $additional_styles .= 'color:' . esc_attr( $color ) . '!important;';
        }

        if( !empty( $background ) ) {
            $additional_styles .= 'background-color:' . esc_attr( $background ) . ';';
        }

        if( !empty( $border ) ) {
            $additional_styles .= 'border-color:' . esc_attr( $border ) . ';';
        }

        if ( ! empty ( $custom_style ) ) {
            $additional_styles .= $custom_style;
        }
        
        if( !empty( $additional_styles ) ) {
            $additional_styles = ' style="' . $additional_styles . '"';
        }

        $additional_data_attrs = "";
        if( "" !== $default_message && "" !== $default_message_field ) {
            $additional_data_attrs = ' data-msg="' . $default_message . '" data-field="' . $default_message_field . '"';
        }

        $additional_button_content = '';
        $toggle_section_accordion = strpos( $classes, 'open-accordion-section' );
        if( false !== $toggle_section_accordion ) {
            $classes .= ' close';
            $additional_button_content .= '<span class="open-accordion-section__icon-wrap"><i class="rex-svg-icons"><svg style="fill:' . $color . ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#plus"></use></svg></i></span>';
        }

        $content = $additional_button_content . $content;

        ob_start();
        if( 'true' == $isinsidelink ) {
    ?>
    <span class="rex-theme-button<?php echo ( "" !== $classes ? ' ' . $classes : '' ); ?>" <?php echo $additional_styles; ?><?php echo $additional_data_attrs; ?>><?php echo do_shortcode( $content ); ?></span>
    <?php
        } else {
            ?>
    <a href="<?php echo esc_url( $link ); ?>" class="rex-theme-button<?php echo ( "" !== $classes ? ' ' . $classes : '' ); ?>" target="<?php echo esc_attr( $target ); ?>"<?php echo $additional_styles; ?><?php echo $additional_data_attrs; ?>><?php echo do_shortcode( $content ); ?></a>
    <?php
        }
        return ob_get_clean();
	}
}