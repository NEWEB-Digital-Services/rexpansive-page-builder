<?php
/**
 * Print the markup of the row toolbar buttons for JS template
 * Center Fast Config area, visible for the rows execpt the last one
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
?>

<div class="bl_d-flex bl_ai-c tools-area tool-area--center row-toolBox__def-view">
    <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration">
        <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="<?php _e('Template','rexpansive-builder'); ?>">
            <span class="unlocked-icon"><?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?></span>
            <span class="locked-icon"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
        </div>

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Image','rexpansive-builder'); ?>">
            <div class="<?php echo $tool_button_classes; ?> tool-button--inline edit-row-image-background tippy" data-tippy-content="" value="">
                <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
            </div>
            <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row background image -->

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Color','rexpansive-builder'); ?>">
            <input class="spectrum-input-element" type="text" name="edit-row-color-background" value="">
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
            <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row background color -->

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="<?php _e('Overlay','rexpansive-builder'); ?>">
            <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value="">
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
            <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row overlay color -->

        <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Video','rexpansive-builder'); ?>">
            <div class="<?php echo $tool_button_classes; ?> tool-button--inline tool-button--flat edit-row-video-background">
                <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
            </div>
            <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
        <!-- // Add background video -->     

    </div><!-- // fast configuration elements -->
</div>