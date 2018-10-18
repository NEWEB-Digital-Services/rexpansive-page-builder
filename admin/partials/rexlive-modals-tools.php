<?php
/**
 * Print the markup of the modals for the toolbox
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined( 'ABSPATH' ) or exit;

global $layoutsAvaiable;

?>
<div class="rex-modal-wrap rex-fade">
  <div id="rexlive-custom-layout-modal" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable">
    <div class="tool-button tool-button--inline tool-button--black tool-button--close rex-cancel-button" data-rex-option="continue">
      <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
    <div class="modal-content">
      <!-- <div class="b-row align-items-center">
        <div class="b-col"> -->
          <ul class="layout__list">
            <?php 
            foreach( $layoutsAvaiable as $layout ) {
              ?>
              <li class="layout__item layout">
                <!-- <div class="layout"> -->
                  <div class="layout__setting">
                    <?php 
                    switch($layout['id']) {
                      case 'mobile':
                        Rexbuilder_Utilities::get_icon('#A010-Mobile');
                        break;
                      case 'tablet':
                        Rexbuilder_Utilities::get_icon('#A001-Tablet');
                        break;
                      case 'default':
                        Rexbuilder_Utilities::get_icon('#A011-Desktop');
                        break;
                      default:
                        break;
                    }
                    ?>
                  </div>
                  <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-id" value="<?php echo esc_attr( $layout['id'] ); ?>">
                    <input class="layout-label-input" type="hidden" name="rexlive-layout-label" data-editable-field="true" value="<?php echo esc_attr( $layout['label'] ); ?>">
                    <span class="layout-value"><?php echo $layout['label']; ?></span>
                  </div>
                  <div class="layout__setting">
                    <input class="layout-min-input" type="hidden" name="rexlive-layout-min" data-editable-field="true" value="<?php echo esc_attr( $layout['min'] ); ?>">
                    <span class="layout-value"><?php echo $layout['min']; ?>px</span>
                  </div>
                  <div class="layout__setting">
                    <input class="layout-max-input" type="hidden" name="rexlive-layout-max" data-editable-field="true" value="<?php echo esc_attr( $layout['max'] ); ?>">
                    <span class="layout-value"><?php echo ( "" != $layout['max'] ? $layout['max'] . 'px' : '&infin;' ); ?></span>
                  </div>
                  <?php if( 'standard' == $layout['type'] ) { ?>
                  <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-type" value="<?php echo esc_attr( $layout['type'] ); ?>">
                  </div>
                  <div class="layout__setting"></div>
                  <div class="layout__setting"></div>
                  <?php } else { ?>
                    <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-type" value="<?php echo esc_attr( $layout['type'] ); ?>">
                    <span class="rexlive-layout--edit">
                      <span class="dashicons-edit dashicons-before"></span>
                      <span class="dashicons-yes dashicons-before hide-icon"></span>
                    </span>
                  </div>
                  <div class="layout__setting">
                    <span class="rexlive-layout--delete">
                      <span class="dashicons-trash dashicons-before"></span>
                    </span>
                  </div>
                  <?php } ?>
                <!-- </div> -->
              </li>
              <?php
            }
            ?>
          </ul>
        </div>
      </div>
      <div class="b-row">
        <div class="b-col" style="text-align:center;">
          <div id="rexlive-add-custom-layout" class="tool-button tool-button--inline tool-button--flat tool-button--add-big">
            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
          </div>
          <!-- <button class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="Add Layout">
            <i class="material-icons text-white">&#xE145;</i>
          </button> -->
        </div>
      <!-- </div>
    </div> -->
  </div>
</div>

<div class="lean-overlay" style="display:none;"></div>