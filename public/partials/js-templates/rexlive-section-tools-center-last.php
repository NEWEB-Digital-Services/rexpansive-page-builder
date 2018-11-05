<?php
/**
 * Print the markup of the row toolbar buttons for JS template
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

<div class="bl_d-flex bl_ai-c tools-area tool-area--center row-toolBox__def-hide">
    <div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image tippy" data-tippy-content="<?php _e('Insert Image','rexpansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
    </div>

    <div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline">
        <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
    </div>

    <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video">
        <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
    </div>

    <div class="tool-button-floating">
        <div class="<?php echo $tool_button_classes_right; ?> active">
            <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>
        </div>

        <div class="tool-button_list">        
            <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="<?php _e('Slider','rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
            </div>

            <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="<?php _e('Slider','rexpansive'); ?>" data-new-row-position="after">
                <?php Rexbuilder_Utilities::get_icon('#B016-New-Adjacent-Row'); ?>
            </div>
        </div>
    </div>
</div><!-- // insert element -->