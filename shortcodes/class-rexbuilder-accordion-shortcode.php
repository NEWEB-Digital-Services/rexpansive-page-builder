<?php
/**
 * Class that wraps the hooks to define accordion shortcode
 *
 * @since  2.0.0
 * @package rexpansive
 */
class Rexbuilder_Accordion {

    public function __construct() {
        // $this->attach_hooks();
    }

    public function attach_hooks() {
        add_shortcode( 'RexAccordion', array( $this, 'render_accordion' ) );
        add_shortcode( 'RexAccordionHeader', array( $this, 'render_accordion_header' ) );
        add_shortcode( 'RexAccordionContent', array( $this, 'render_accordion_content' ) );
        add_shortcode( 'RexAccordionFooter', array( $this, 'render_accordion_footer' ) );
    }

    /**
     * Rendering Rexpansive Accordion
     * 
     * @since 2.0.0
     */
    public function render_accordion( $atts, $content = null ) {
        extract( shortcode_atts( array(
            'custom_class' => '',
        ), $atts ) );

        ob_start();
    ?><div class="rexpansive-accordion<?php echo ( "" !== $custom_class ? ' ' . $custom_class : '' ); ?>">
        <?php 
        $strip_content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs( $content, 'RexAccordionHeader' );
        $strip_content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs( $strip_content, 'RexAccordionContent' );
        $strip_content = Rexbuilder_Utilities::remove_shortcode_wrap_paragraphs( $strip_content, 'RexAccordionFooter' );
        ?>
        <?php echo do_shortcode( $strip_content ); ?>
    </div><?php
        return ob_get_clean();
    }

    /**
     * Rendering Rexpansive Accordion Header
     * 
     * @since 2.0.0
     */
    public function render_accordion_header( $atts, $content = null ) {
        extract( shortcode_atts( array(
            'open' => 'false',
            'color' => '#000',
            'view_toggle' => 'true'
        ), $atts ) );

        ob_start();
    ?><div class="rexpansive-accordion__header<?php echo ( "true" == $open ? ' open' : '' ); ?>">
        <?php echo do_shortcode( $content ); ?>
        <?php if( "true" == $view_toggle ) { ?>
        <span class="rexpansive-accordion__toggle">
            <!-- <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?> -->
            <i class="rex-svg-icons" style="fill:<?php // echo $color; ?>">
                <svg style="fill:<?php // echo $color; ?>">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#plus"></use>
                </svg>
            </i>
        </span>
        <?php } ?>
    </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Rendering Rexpansive Accordion Footer
     * 
     * @since 2.0.0
     */
    public function render_accordion_footer( $atts, $content = null ) {
        extract( shortcode_atts( array(
            'open' => 'false',
            'background' => '#000',
            'color' => '#FFF',
            'label' => __( 'CONTINUE', 'rexpansive-builder' )
        ), $atts ) );

        $toggle = '';
        ob_start();
?>
<span class="rexpansive-accordion__toggle">
    <i class="rex-svg-icons" style="fill:<?php echo $color; ?>">
        <svg style="fill:<?php echo $color; ?>">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add"></use>
        </svg>
    </i>
</span>
<?php
        $toggle = ob_get_clean();

        ob_start();
    ?><div class="rexpansive-accordion__footer<?php echo ( "true" == $open ? ' open' : '' ); ?>">
        <?php
        if( !empty( $label ) ) {
            echo do_shortcode( '[RexButton background="transparent" background="' . $background . '" color="' . $color . '" border="' . $background . '" isinsidelink="true"]' . $label . $toggle . '[/RexButton]');
        } else {
            echo $toggle;
        }
        ?>
    </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Rendering Rexpansive Accordion Content
     * 
     * @since 2.0.0
     */
    public function render_accordion_content( $atts, $content = null ) {
        extract( shortcode_atts( array(
            
        ), $atts ) );

        ob_start();
    ?><div class="rexpansive-accordion__content"><?php echo do_shortcode( $content ); ?></div><?php
        return ob_get_clean();
    }
}