<?php
/**
 * Print the overlay color palette area
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
$saved_palette = get_option( '_rex_overlay_palette', array() );
?>
<div class="sp-rex-palette-wrap sp-rex-color-overlay-palette">
    <div class="bl_d-flex bl_jc-sb">
        <div class="bl_d-iflex palette-list">
            <?php
            foreach( $saved_palette as $ID => $overlay ) {
                ?>
                <div class="palette-item" data-overlay-id="<?php echo esc_attr($ID); ?>" data-overlay-value="<?php echo esc_attr($overlay); ?>" style="background-color:<?php echo $overlay; ?>">
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