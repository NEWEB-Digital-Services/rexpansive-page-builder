<?php
/**
 * Print the color pallete area
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
$saved_palette = get_option( '_rex_color_palette', array() );
?>
<div class="sp-rex-palette-wrap sp-rex-color-palette">
    <div class="bl_d-flex bl_jc-sb">
        <div class="bl_d-iflex bl_ai-c palette-list">
            <?php
            foreach( $saved_palette as $ID => $color ) {
                ?>
                <div class="palette-item" data-color-id="<?php echo esc_attr($ID); ?>" data-color-value="<?php echo esc_attr($color); ?>" style="background-color:<?php echo $color; ?>">
                    <div class="tool-button tool-button--deactivate palette-item__delete">
                        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                    </div>
                </div>
                <?php
            }
            ?>
            <div class="palette__add-color" class="tool-button">
                <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
            </div>
        </div>
        <div class="bl_d-iflex">
            <div class="palette-item tool-button palette__open-gradient palette__gradient-default"></div>
        </div>
    </div>
</div>