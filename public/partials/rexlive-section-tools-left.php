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
?>

<div class="bl_d-flex bl_ai-c tools-area tool-area--side row-toolBox__def-hide">

    <div class="switch-toggle switch-live">
        <input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-<?php echo $atts['rexlive_section_id']; ?>" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="100%" <?php checked('full',$atts['dimension'],true); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Full','rexpansive'); ?>" for="row-dimension-full-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span></label>
        <input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-<?php echo $atts['rexlive_section_id']; ?>" name="row-dimension-<?php echo $atts['rexlive_section_id']; ?>" value="<?php echo ( 'boxed' == $atts['dimension'] ? esc_attr( $atts['section_width'] ) : '80%' ); ?>" <?php checked('boxed',$atts['dimension'],true); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Boxed','rexpansive'); ?>" for="row-dimension-boxed-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span></label>
        <a></a>
    </div><!-- // Row dimension -->

    <div class="switch-toggle switch-live">
        <input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-<?php echo $atts['rexlive_section_id']; ?>" name="row-layout-<?php echo $atts['rexlive_section_id']; ?>" value="fixed" <?php checked('fixed',$atts['layout'],true); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Grid','rexpansive'); ?>" for="row-layout-fixed-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B011-Grid'); ?></span></label>
        <input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-<?php echo $atts['rexlive_section_id']; ?>" name="row-layout-<?php echo $atts['rexlive_section_id']; ?>" value="masonry" <?php checked('masonry',$atts['layout'],true); ?>>
        <label class="tippy" data-tippy-content="<?php _e('Masonry','rexpansive'); ?>" for="row-layout-masonry-<?php echo $atts['rexlive_section_id']; ?>"><span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span></label>
    </div><!-- // Row layout -->

    <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline collapse-grid tippy" data-tippy-content="<?php _e('Collapse','rexpansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#B006-Collapse'); ?>
    </div><!-- // collapse -->
</div>
<!-- // left area: row dimension, layout, collapse -->