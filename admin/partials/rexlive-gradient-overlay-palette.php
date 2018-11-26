<?php
/**
 * Print the gradient pallete area
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined('ABSPATH') or exit;
$saved_palette = get_option( '_rex_overlay_gradient_palette', array() );
?>
<div class="bl_modal__option-wrap palette-list">
    <?php
    foreach( $saved_palette as $ID => $gradient ) {
        ?>
        <div class="palette-item" data-gradient-id="<?php echo esc_attr($ID); ?>" data-gradient-value="<?php echo esc_attr($gradient); ?>">
            <div class="tool-button tool-button--deactivate palette-item__delete">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
        <?php
    }
    ?>
    <div class="palette__add-gradient" class="tool-button">
        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
    </div>
</div>