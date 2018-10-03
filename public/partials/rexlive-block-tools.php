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
<div class="rexlive-block-toolbox">
    <div class="rexlive-top-block-tools">
        <div>
            <div class="tool-button--big">
                <span class="el-size-viewer"></span>
            </div>
        </div>
        <!-- // left area: size viewer -->

        <div>
            <div class="tool-button--double-icon--wrap">
                <div class="tool-button tool-button--inline edit-block-image tooltipped">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--double-icon deactivate-block-image-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block image background -->

            <div class="tool-button--double-icon--wrap">
                <input class="spectrum-input-element" type="text" name="edit-block-color-background" value="<?php echo esc_attr( $atts['color_bg_block'] ); ?>">
                <div class="tool-button tool-button--inline tool-button--double-icon deactivate-block-color-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block color background -->

            <div class="tool-button tool-button--inline edit-block-video-background">
                <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
            </div><!-- // Change Block Video background -->
        </div>

        <div>
            
            <div class="tool-button tool-button--inline btn-flat builder-copy-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
            </div>

            <div class="tool-button-floating">
				<div class="tool-button builder-edit-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
                </div>
                
				<div class="tool-button_list">

                    <button class="tool-button tool-button--inline builder-edit-slider tooltipped waves-effect waves-light">
                        <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
                    </button>

                </div>
            </div>
        </div>
    </div>
    <button class="tool-button tool-button--black builder-delete-block waves-effect tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexspansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </button>
</div>