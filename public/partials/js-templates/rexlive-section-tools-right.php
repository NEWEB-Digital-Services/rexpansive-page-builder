<?php
/**
 * Print the markup of the row toolbar buttons for JS template
 * Right Config Area, the fast config area and the settings button
 * are visible only for thelast row to prevent end of page bugs
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
?>

<div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side">
		
    <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration">

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Image','rexpansive'); ?>">
            <div class="<?php echo $tool_button_classes; ?> tool-button--inline edit-row-image-background tippy" data-tippy-content="" value="">
                <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
            </div>
            <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row background image -->

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Color','rexpansive'); ?>">
            <input class="spectrum-input-element" type="text" name="edit-row-color-background" value="">
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
            <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row background color -->

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="<?php _e('Overlay','rexpansive'); ?>">
            <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value="">
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
            <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row overlay color -->

        <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
            <div class="<?php echo $tool_button_classes; ?> tool-button--inline tool-button--flat edit-row-video-background">
                <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
            </div>
            <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
        <!-- // Add background video -->

        <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="<?php _e('Model','rexpansive'); ?>">
            <span class="unlocked-icon"><?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?></span>
            <span class="locked-icon"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
        </div>

    </div><!-- // fast configuration elements -->

    <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration">
        <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-copy-row tippy" data-tippy-content="<?php _e('Copy row', 'rexpansive');?>">
            <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
        </div>
        
        <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-move-row tippy" data-tippy-content="<?php _e('Move row', 'rexpansive');?>">
            <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
        </div>

        <div class="tool-button-floating tool-button--model-hide">
            <div class="<?php echo $tool_button_classes_right; ?> tool-button--flat--distance-fix" data-tippy-content="<?php _e('Row settings', 'rexpansive');?>">
                <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>					
            </div>
            <div class="tool-button_list">
                <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="<?php _e('Row settings','rexpansive'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
                </div>
                
                <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>

                <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="<?php _e('Background Image','rexpansive'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>

                <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Background Color','rexpansive'); ?>">
                    <input class="spectrum-input-element" type="text" name="edit-row-color-background">
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                </div><!-- // Change Row color background -->

                <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Overlay','rexpansive'); ?>">
                    <input class="spectrum-input-element" type="text" name="edit-row-overlay-color">
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                </div>
                <!-- // Change Row overlay color -->

                <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                </div>
                
                <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="<?php _e('Model','rexpansive'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#B005-RexModel'); ?>
                </div>
            </div>
        </div>

        <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-delete-row tippy" data-tippy-content="<?php _e('Delete row', 'rexspansive');?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>
        <!-- // remove section -->
    </div><!-- // clone, move, settings -->
</div>
<!-- // right area -->