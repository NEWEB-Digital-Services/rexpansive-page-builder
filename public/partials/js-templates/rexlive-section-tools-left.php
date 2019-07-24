<?php
/**
 * Print the markup of the row toolbar buttons for JS template
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

<div class="bl_d-flex bl_ai-c tools-area tool-area--side tool-area--left">
    <div class="switch-toggle switch-live">
        <input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-{%=section.rexID%}" name="row-dimension-{%=section.rexID%}" value="100%"{% if( 'full' == section.dimension ) { %} checked{% } %}>
        <label class="tippy" data-tippy-content="<?php _e('Full','rexpansive-builder'); ?>" for="row-dimension-full-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span></label>
        <input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-{%=section.rexID%}" name="row-dimension-{%=section.rexID%}" value="80%" {% if( 'boxed' == section.dimension ) { %} checked{% } %}>
        <label class="tippy" data-tippy-content="<?php _e('Boxed','rexpansive-builder'); ?>" for="row-dimension-boxed-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span></label>
    </div><!-- // Row dimension -->

    <div class="switch-toggle switch-live" style="display:none;">
        <input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-{%=section.rexID%}" name="row-layout-{%=section.rexID%}" value="fixed">
        <label class="tippy" data-tippy-content="<?php _e('Grid','rexpansive-builder'); ?>" for="row-layout-fixed-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span></label>
        <input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-{%=section.rexID%}" name="row-layout-{%=section.rexID%}" value="masonry">
        <label class="tippy" data-tippy-content="<?php _e('Masonry','rexpansive-builder'); ?>" for="row-layout-masonry-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span></label>
    </div><!-- // Row layout -->

    <div class="bl_switch tippy" data-tippy-content="<?php _e('Grid off/on','rexpansive-builder'); ?>">
        <label>
            <input class="edit-row-layout-checkbox" type="checkbox"{% if( 'fixed' == section.layout ) { %} checked{% } %}>
            <span class="lever"></span>
            <span class="bl_switch__icon"><?php Rexbuilder_Utilities::get_icon('#B017-Grid-Layout'); ?></span>
        </label>
    </div><!-- // Row grid on/off -->

    <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline collapse-grid tippy" data-tippy-content="<?php _e('Collapse','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#B006-Collapse'); ?>
    </div>
</div>
<!-- // right area: row dimension -->