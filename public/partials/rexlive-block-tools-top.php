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
        <div style="visibility:hidden;">
            <div class="el-size-viewer tool-indicator"></div>
        </div>
        <div class="bl_d-iflex bl_ai-c">
        </div>

        <div class="bl_d-iflex bl_ai-c block-toolBox__config-tools">
            
            <div class="tool-button tool-button--inline btn-flat builder-copy-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
            </div>

            <div class="tool-button-floating">
				<div class="tool-button builder-edit-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
                </div>
                
				<div class="tool-button_list">
                    <div class="tool-button--double-icon--wrap<?php echo ( !$not_has_image ? ' tool-button--hide' : '' ); ?>">
                        <div class="tool-button tool-button--inline edit-block-image tooltipped">
                            <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                        </div>                        
                    </div><!-- // Change Block image background -->

                    <div class="tool-button--double-icon--wrap<?php echo ( !$not_has_color ? ' tool-button--hide' : '' ); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-block-color-background" value="<?php echo esc_attr( $atts['color_bg_block'] ); ?>">
                    </div><!-- // Change Block color background -->

                    <div class="tool-button--double-icon--wrap<?php echo ( !$not_has_overlay ? ' tool-button--hide' : '' ); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value="<?php echo esc_attr( $atts['overlay_block_color'] ); ?>">
                        
                    </div><!-- // Change Block overlay color -->

                    <div class="tool-button--double-icon--wrap <?php echo ( !$not_has_video ? ' tool-button--hide' : '' ); ?>">
                        <div class="tool-button tool-button--inline edit-block-video-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                        </div>
                    </div><!-- // Change Block Video background -->


                    <div class="tool-button tool-button--inline builder-edit-slider tooltipped waves-effect waves-light">
                        <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
                    </div><!-- // rexslider -->
                </div>
            </div>

            <div class="tool-button tool-button--inline builder-delete-block waves-effect tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexspansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
    </div>
    <div class="tool-button builder-delete-block waves-effect tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexspansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
</div>