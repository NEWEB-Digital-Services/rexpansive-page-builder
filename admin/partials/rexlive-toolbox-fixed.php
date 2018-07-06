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

defined('ABSPATH') or exit;
global $layouts;
?>
<div class="rexlive-toolbox">
    <div class="rexlive-responsive-toolbox">
    <?php
    foreach( $layouts as $index => $layout ) {
?>
<div>
    <button class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo ( "default" != $layout['id'] ? $layout['min'] : '' ); ?>" data-max-width="<?php echo ( "default" != $layout['id'] ? $layout['max'] : '' ); ?>" data-name="<?php echo $layout['id'] ?>"><?php echo $layout['label'] ?></button>
</div>
<?php
        if( 2 == $index ) {
?>
<div>
    <button class="builder-config-layouts builder-custom-layout">+</button>
</div>
<?php
        }
    }
    ?>
        <div class="rexlive-builder-actions">
            <button class = "btn-undo">Undo</button>
            <button class = "btn-redo">Redo</button>
            <button class = "btn-save">Save</button>
        </div>
    </div>
</div>
