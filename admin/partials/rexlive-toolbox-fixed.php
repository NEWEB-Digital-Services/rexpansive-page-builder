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
global $layoutsAvaiable;

?>
<div class="rexlive-toolbox">
  <div class="tools-container-left">
    <div class="left-tools">
      <div class="tool-option"><button>chiudi</button></div>
      <div class="tool-option"><button>css</button></div>
    </div>
  </div>
  <div class="tools-container-middle">
    <div class="middle-tools rexlive-responsive-buttons-wrapper">
      <?php
            foreach( $layoutsAvaiable as $index => $layout ) {
            ?>
            <div class="layout-container"><button class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo ( "default" != $layout['id'] ? $layout['min'] : '' ); ?>" data-max-width="<?php echo ( "default" != $layout['id'] ? $layout['max'] : '' ); ?>" data-name="<?php echo $layout['id'] ?>"><?php echo $layout['label'] ?></button>
            </div>
            <?php
                if( 2 == $index ) {
            ?>
            <div class="layout-container"><button class="builder-config-layouts builder-custom-layout">+</button></div>
            <?php
                }
            }
        ?>
    </div>
  </div>
  <div class="tools-container-right">
    <div class="right-tools rexlive-builder-actions">
      <!-- Pulsante per importare i modelli -->
      <!-- <div class="tool-option"><button class = "btn-models">Import</button></div> -->
      <div class="tool-option"><button class = "btn-undo">Undo</button></div>
      <div class="tool-option"><button class = "btn-redo">Redo</button></div>
      <div class="tool-option"><button class = "btn-save">Save</button></div>
    </div>
  </div>
</div>