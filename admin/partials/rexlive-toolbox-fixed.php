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
        <i class="l-svg-icons"><svg><use xlink:href="#A007-Close"></use></svg></i>
      </div>
      <div class="tool-option btn-custom-css" id="open-css-editor">
        <i class="l-svg-icons"><svg><use xlink:href="#A008-Code"></use></svg></i>
      </div>
    </div>
  </div>
  <div class="tools-container-middle">
    <div class="middle-tools rexlive-responsive-buttons-wrapper"><?php
            foreach( $layoutsAvaiable as $index => $layout ) {
              switch($index){
                case 0:
                ?>
                  <div class="layout-container">
                    <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>">
                      <i class="l-svg-icons"><svg><use xlink:href="#A010-Mobile"></use></svg></i>
                    </div>
                  </div>
                <?php
                  break;
                case 1:
                ?>
                  <div class="layout-container">
                    <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>">
                      <i class="l-svg-icons"><svg><use xlink:href="#A001-Tablet"></use></svg></i>
                    </div>
                  </div>
                <?php
                  break;
                case 2:
                  ?>
                  <div class="layout-container">
                    <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="" data-max-width="" data-name="<?php echo $layout['id'] ?>">
                      <i class="l-svg-icons"><svg><use xlink:href="#A011-Desktop"></use></svg></i>
                    </div>
                  </div>
                  <?php
                  break;
                default:
                  ?>
                  <div class="layout-container">
                    <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']; ?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-layout-type="custom">
                      <i class="l-svg-icons"><svg><use xlink:href="#A009-Range"></use></svg></i>
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
          <i class="l-svg-icons"><svg><use xlink:href="#A004-Plus"></use></svg></i>
        </div>
      </div>
    </div>
  </div>
  <div class="tools-container-right">
    <div class="right-tools rexlive-builder-actions">
      <!-- Pulsante per importare i modelli -->
      <!-- <div class="tool-option"><button class = "btn-models">Import</button></div> -->
      <div class="tool-option btn-undo">
        <i class="l-svg-icons"><svg><use xlink:href="#A003-Undo"></use></svg></i>
      </div>
      <div class="tool-option btn-redo">
        <i class="l-svg-icons"><svg><use xlink:href="#A002-Redo"></use></svg></i>
      </div>
      <div class="tool-option btn-save">
          <i class="l-svg-icons ico-white"><svg><use xlink:href="#A006-Save"></use></svg></i>
      </div>
    </div>
  </div>
</div>