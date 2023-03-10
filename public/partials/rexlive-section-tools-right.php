<?php
/**
 * Print the markup of the row toolbar buttons
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

$id_image_bg_section = ( isset( $atts['id_image_bg_section'] ) && ! empty( $atts['id_image_bg_section'] ) ? $atts['id_image_bg_section'] : '' );
$image_bg_section = ( isset( $atts['image_bg_section'] ) && ! empty( $atts['image_bg_section'] ) ? $atts['image_bg_section'] : '' );
?>

<div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side">

    <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration">
        <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="<?php _e('Template','rexpansive-builder'); ?>">
            <span class="unlocked-icon"><?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?></span>
            <span class="locked-icon"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
        </div>

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Image','rexpansive-builder'); ?>">
            <div class="<?php echo $tool_button_classes; ?> tool-button--inline edit-row-image-background<?php echo ( "" != $id_image_bg_section ? ' tool-button--image-preview' : '' ); ?>" value="<?php echo esc_attr( $id_image_bg_section ); ?>"<?php echo ( "" != $id_image_bg_section ? ' style="background-image:url(' . $image_bg_section . ');"' : '' ); ?>>
                <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
            </div>
            <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-image-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row image background -->

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Color','rexpansive-builder'); ?>">
            <input class="spectrum-input-element" type="text" name="edit-row-color-background">
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
            <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-color-background">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div><!-- // Change Row color background -->

        <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="<?php _e('Overlay','rexpansive-builder'); ?>">
            <input class="spectrum-input-element" type="text" name="edit-row-overlay-color">
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
            <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
            <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-overlay-color">
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

    <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration">
        <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-copy-row tippy" data-tippy-content="<?php _e('Copy row', 'rexpansive-builder');?>">
            <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
        </div>
        
        <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-move-row tippy" data-tippy-content="<?php _e('Move row', 'rexpansive-builder');?>">
            <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
        </div>

        <div class="tool-button-floating tool-button--model-hide">
            <div class="<?php echo $tool_button_classes_right; ?> tool-button--flat--distance-fix" data-tippy-content="<?php _e('Row settings', 'rexpansive-builder');?>">
                <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>					
            </div>
            <div class="tool-button_list">
                <div class="tool-button builder-section-config tool-button_list--item tippy" data-tippy-content="<?php _e('Row settings','rexpansive-builder'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
                </div>

                <div class="tool-button tool-button_list--item tool-button--full edit-background-section tippy tool-button--hide">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>

                <div class="tool-button tool-button_list--item tool-button--full edit-row-image-background tippy <?php echo ( "" != $id_image_bg_section ? ' tool-button--hide' : '' ); ?>" data-tippy-content="<?php _e('Background Image','rexpansive-builder'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>

                <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Background Color','rexpansive-builder'); ?>">
                    <input class="spectrum-input-element" type="text" name="edit-row-color-background">
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                </div><!-- // Change Row color background -->

                <div class="tool-button--double-icon--wrap tool-button_list--item tool-button--opacity-preview tippy" data-tippy-content="<?php _e('Overlay','rexpansive-builder'); ?>">
                    <input class="spectrum-input-element" type="text" name="edit-row-overlay-color">
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                    <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                </div>
                <!-- // Change Row overlay color -->

                <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="<?php _e('Background Video','rexpansive-builder'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                </div>
                
                <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="<?php _e('Template','rexpansive-builder'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#B005-RexModel'); ?>
                </div>
            </div>
        </div>

        <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-delete-row tippy" data-tippy-content="<?php _e('Delete row', 'rexpansive-builder');?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>

    </div><!-- clone, move, settings -->
</div>
<!-- // right area -->		