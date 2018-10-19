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
<div class="rexlive-toolbox__toggle-wrap">
  <div class="tools-container">
    <div class="tool-option close-toolbox tippy" data-tippy-content="<?php esc_attr_e( 'Hide', 'rexpansive' ); ?>">
      <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
    </div>
  </div>
</div>
<div class="rexlive-toolbox__wrap">
  <div class="rexlive-toolbox">
    <div class="tools-container-left">
      <div class="left-tools">
        <div class="tool-option tool-option--placeholder">
          <?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
        </div>
        <div class="tool-option btn-custom-css tippy" id="open-css-editor" data-tippy-content="<?php esc_attr_e( 'Css', 'rexpansive' ); ?>">
          <?php Rexbuilder_Utilities::get_icon('#A008-Code'); ?>
        </div>
      </div>
    </div>
    <div class="tools-container-middle">
      <div class="middle-tools rexlive-responsive-buttons-wrapper">
      <?php
        $default_layouts = "";
        $custom_layouts = "";
        foreach( $layoutsAvaiable as $index => $layout ) {
          switch($index){
            case 0:
              ob_start();
            ?>
              <div class="layout-container tool-option tippy" data-tippy-content="<?php echo esc_attr( $layout['label'] ); ?>">
                <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>">
                  <?php Rexbuilder_Utilities::get_icon('#A010-Mobile'); ?>
                </div>
              </div>
            <?php
              $default_layouts .= ob_get_clean();
              break;
            case 1:
              ob_start();
            ?>
              <div class="layout-container tool-option tippy" data-tippy-content="<?php echo esc_attr( $layout['label'] ); ?>">
                <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>">
                  <?php Rexbuilder_Utilities::get_icon('#A001-Tablet'); ?>
                </div>
              </div>
            <?php
              $default_layouts .= ob_get_clean();
              break;
            case 2:
              ob_start();
              ?>
              <div class="layout-container tool-option tippy" data-tippy-content="<?php echo esc_attr( $layout['label'] ); ?>">
                <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="" data-max-width="" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>">
                  <?php Rexbuilder_Utilities::get_icon('#A011-Desktop'); ?>
                </div>
              </div>
              <?php
                $default_layouts .= ob_get_clean();
              break;
            default:
              ob_start();
              ?>
              <div class="layout-container tool-option tippy" data-tippy-content="<?php echo esc_attr( $layout['label'] ); ?>">
                <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']; ?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>" data-layout-type="custom">
                  <?php Rexbuilder_Utilities::get_icon('#A009-Range'); ?>
                  <div class="layout-custom-number">
                    <div class="rex-number"><?php echo ($index-2);?></div>
                  </div>
                </div>
              </div>
              <?php
              $custom_layouts .= ob_get_clean();
              break;
          }
        }
        ?>
        <?php echo $default_layouts; ?>
        <div class="layout-container tool-option tippy" data-tippy-content="<?php esc_attr_e( 'Layouts', 'rexpansive' ); ?>">
          <div class="builder-config-layouts builder-add-custom-layout bl_d-iflex">
            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
          </div>
        </div>
        <?php echo $custom_layouts; ?>
      </div>
    </div>
    <div class="tools-container-right">
      <div class="right-tools rexlive-builder-actions">
        <!-- Pulsante per importare i modelli -->
        <div class="tool-option btn-models tippy" data-tippy-content="<?php esc_attr_e( 'Models', 'rexpansive' ); ?>">
          <?php Rexbuilder_Utilities::get_icon('#A012-Models-List'); ?>
        </div>
        <div class="tool-option btn-undo tippy" data-tippy-content="<?php esc_attr_e( 'Undo', 'rexpansive' ); ?>">
          <?php Rexbuilder_Utilities::get_icon('#A003-Undo'); ?>
        </div>
        <div class="tool-option btn-redo tippy" data-tippy-content="<?php esc_attr_e( 'Redo', 'rexpansive' ); ?>">
          <?php Rexbuilder_Utilities::get_icon('#A002-Redo'); ?>
        </div>
        <div class="tool-option btn-save tippy" data-tippy-content="<?php esc_attr_e( 'Save', 'rexpansive' ); ?>">
          <span class="btn-save--edited"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
          <span class="btn-save--saved"><?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?></span>
        </div>
      </div>
    </div>
  </div>
</div>