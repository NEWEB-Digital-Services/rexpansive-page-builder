<?php
/**
 * Print the markup of the row toolbar buttons
 * Left Config Area, visible only for the last row to prevent end of page bugs
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
$section_rex_id = "";
if( isset( $atts['rexlive_section_id'] ) ) {
    $section_rex_id = $atts['rexlive_section_id'];
}

$dimension = ( isset( $atts['dimension'] ) && ! empty( $atts['dimension'] ) ? $atts['dimension'] : 'full' );
$layout = ( isset( $atts['layout'] ) && ! empty( $atts['layout'] ) ? $atts['layout'] : 'fixed' );
?>

<div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left">

    <div class="switch-toggle switch-live switch-dimension">
        <input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-<?php echo $section_rex_id; ?>" name="row-dimension-<?php echo $section_rex_id; ?>" value="100%" <?php checked( 'full', $dimension, true ); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Full','rexpansive-builder'); ?>" for="row-dimension-full-<?php echo $section_rex_id; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span></label>
        <input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-<?php echo $section_rex_id; ?>" name="row-dimension-<?php echo $section_rex_id; ?>" value="<?php echo ( 'boxed' == $dimension ? esc_attr( $atts['section_width'] ) : '80%' ); ?>" <?php checked( 'boxed', $dimension, true ); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Boxed','rexpansive-builder'); ?>" for="row-dimension-boxed-<?php echo $section_rex_id; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span></label>
        <a></a>
    </div><!-- // Row dimension -->

    <div class="switch-toggle switch-live" style="display:none;">
        <input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-<?php echo $section_rex_id; ?>" name="row-layout-<?php echo $section_rex_id; ?>" value="fixed" <?php checked( 'fixed', $layout, true ); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Grid','rexpansive-builder'); ?>" for="row-layout-fixed-<?php echo $section_rex_id; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span></label>
        <input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-<?php echo $section_rex_id; ?>" name="row-layout-<?php echo $section_rex_id; ?>" value="masonry" <?php checked( 'masonry', $layout, true ); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Masonry','rexpansive-builder'); ?>" for="row-layout-masonry-<?php echo $section_rex_id; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span></label>
    </div><!-- // Row layout -->

    <div class="bl_switch tippy" data-tippy-content="<?php _e('Grid off/on','rexpansive-builder'); ?>">
        <label>
            <input class="edit-row-layout-checkbox" type="checkbox" <?php checked( 'fixed', $layout, true ); ?>>
            <span class="lever"></span>
            <span class="bl_switch__icon"><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span>
        </label>
    </div><!-- // Row grid on/off -->

    <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline collapse-grid tippy" data-tippy-content="<?php _e('Collapse','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#B006-Collapse'); ?>
    </div><!-- // collapse -->
</div>
<!-- // left area: row dimension, layout, collapse -->