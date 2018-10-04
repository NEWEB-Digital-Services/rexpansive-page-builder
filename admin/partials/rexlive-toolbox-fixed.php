<?php
/**
 * Print the top toolbox
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
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
      <div class="tool-option close-toolbox">
        <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
      </div>
      <div class="tool-option btn-custom-css" id="open-css-editor">
        <?php Rexbuilder_Utilities::get_icon('#A008-Code'); ?>
      </div>
    </div>
  </div>
  <div class="tools-container-middle">
    <div class="middle-tools rexlive-responsive-buttons-wrapper">
    <?php
      foreach( $layoutsAvaiable as $index => $layout ) {
        switch($index){
          case 0:
          ?>
            <div class="layout-container">
              <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>">
                <?php Rexbuilder_Utilities::get_icon('#A010-Mobile'); ?>
              </div>
            </div>
          <?php
            break;
          case 1:
          ?>
            <div class="layout-container">
              <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>">
                <?php Rexbuilder_Utilities::get_icon('#A001-Tablet'); ?>
              </div>
            </div>
          <?php
            break;
          case 2:
            ?>
            <div class="layout-container">
              <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="" data-max-width="" data-name="<?php echo $layout['id'] ?>">
                <?php Rexbuilder_Utilities::get_icon('#A011-Desktop'); ?>
              </div>
            </div>
            <?php
            break;
          default:
            ?>
            <div class="layout-container">
              <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']; ?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-layout-type="custom">
                <?php Rexbuilder_Utilities::get_icon('#A009-Range'); ?>
                <div class="layout-custom-number">
                  <div class="rex-number"><?php echo ($index-2);?></div>
                </div>
              </div>
            </div>
            <?php
            break;
        }
      }
      ?>
      <div class="layout-container">
        <div class="builder-config-layouts builder-add-custom-layout">
        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
        </div>
      </div>
    </div>
  </div>
  <div class="tools-container-right">
    <div class="right-tools rexlive-builder-actions">
      <!-- Pulsante per importare i modelli -->
      <div class="tool-option btn-models">
        <?php Rexbuilder_Utilities::get_icon('#A012-Models-List'); ?>
      </div>
      <div class="tool-option btn-undo">
        <?php Rexbuilder_Utilities::get_icon('#A003-Undo'); ?>
      </div>
      <div class="tool-option btn-redo">
        <?php Rexbuilder_Utilities::get_icon('#A002-Redo'); ?>
      </div>
      <div class="tool-option btn-save">
        <?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?>
      </div>
    </div>
  </div>
</div>