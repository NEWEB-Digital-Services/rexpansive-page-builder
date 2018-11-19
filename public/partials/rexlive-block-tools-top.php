<?php
/**
 * Print the markup of the modals of the builder
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined( 'ABSPATH' ) or exit;
?>
<div class="rexlive-block-toolbox top-tools">
    <div class="rexlive-top-block-tools">
        <div class="block-toolBox__placeholder">
            <div style="visibility:hidden;display:inline-block;">
                <div class="el-size-viewer tool-indicator"></div>
            </div>
            <!-- <div class="tool-button tool-button--inline drag-to-section tippy" draggable="true" data-tippy-content="<?php // _e('Power Drag','rexpansive'); ?>">
                <?php // Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>
            </div> -->
        </div>

        <div class="bl_d-iflex bl_ai-c block-toolBox__editor-tools">
            <div class="tool-button tool-button--inline edit-block-content<?php echo ( "" !== trim( $content ) ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Text','rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
            </div>
            <div class="tool-button tool-button--inline builder-edit-slider<?php echo ( !$block_has_slider ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('RexSlider','rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
            </div><!-- // rexslider -->
            <div class="tool-button tool-button--inline edit-block-content-position<?php echo ( "" === trim( $content ) ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Content Position','rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#C005-Layout'); ?>
            </div>
        </div>

        <div class="bl_d-iflex bl_ai-c block-toolBox__config-tools">
            
            <div class="tool-button tool-button--inline builder-copy-block tippy" data-tippy-content="<?php _e('Copy block', 'rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
            </div>

            <div class="tool-button-floating block-toolBox__config-list">
				<div class="tool-button" data-tippy-content="<?php _e('Block settings', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>					
                </div>
                
				<div class="tool-button_list">
                    <div class="tool-button tool-button--inline tool-button_list--item builder-edit-block tippy" data-tippy-content="<?php _e('Block settings','rexpansive'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
                    </div><!-- // settings -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item<?php echo ( !$not_has_image ? ' tool-button--hide' : '' ); ?>">
                        <div class="tool-button tool-button--inline edit-block-image tippy" data-tippy-content="<?php _e('Background Image','rexpansive'); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                        </div>                        
                    </div><!-- // Change Block image background -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Background Color','rexpansive'); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-block-color-background" value="">
                    </div><!-- // Change Block color background -->

                    <div class="tool-button--double-icon--wrap tool-button--opacity-preview tool-button_list--item<?php echo ( !$not_has_overlay ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Overlay','rexpansive'); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value="<?php echo esc_attr( $atts['overlay_block_color'] ); ?>">
                        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                    </div><!-- // Change Block overlay color -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item<?php echo ( !$not_has_video ? ' tool-button--hide' : '' ); ?> tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
                        <div class="tool-button tool-button--inline edit-block-video-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                        </div>
                    </div><!-- // Change Block Video background -->


                    <div class="tool-button tool-button--inline tool-button_list--item builder-edit-slider tippy" data-tippy-content="<?php _e('RexSlider','rexpansive'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
                    </div><!-- // rexslider -->
                </div>
            </div>

            <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="<?php _e('Delete block', 'rexspansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
    </div>
    <div class="tool-button builder-delete-block waves-effect tippy" data-tippy-content="<?php _e('Delete block', 'rexspansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
</div>