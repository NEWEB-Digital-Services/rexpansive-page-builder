<?php
/**
 * Print the markup of the row toolbar buttons
 * Center Insert Area, visible only for the last row to prevent end of page bugs
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
?>
<div class="bl_d-flex bl_ai-c tools-area tool-area--center">
    <div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="<?php _e('Image','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
    </div>

    <div class="tool-button tool-button--flat add-new-block-text tool-button__text--flat tool-button--inline tippy" data-tippy-content="<?php _e('Text','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
    </div>

    <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video tippy" data-tippy-content="<?php _e('Video','rexpansive-builder'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
    </div>

    <div class="tool-button-floating">
        <!-- to add an empty block add this class: add-new-block-empty -->
        <div class="<?php echo $tool_button_classes_right; ?> active">
            <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>
        </div>

        <div class="tool-button_list">
            <div class="tool-button tool-button_list--item add-new-block-slider tippy" data-tippy-content="<?php _e('Slider','rexpansive-builder'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
            </div>

            <div class="tool-button tool-button_list--item add-new-section tippy" data-tippy-content="<?php _e('Insert Row','rexpansive-builder'); ?>" data-new-row-position="after">
                <?php Rexbuilder_Utilities::get_icon('#B016-New-Adjacent-Row'); ?>
            </div>
        </div>
    </div>
</div><!-- // insert element -->