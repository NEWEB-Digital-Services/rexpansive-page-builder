<?php
/**
 * Print the modal for the custom layout handling
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined( 'ABSPATH' ) or exit;

global $layoutsAvaiable;
$layout_list_type = "dropdown";
?>
<div class="rex-modal-wrap">
  <div id="rexlive-custom-layout-modal" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable" data-layout-list-type="<?php echo $layout_list_type; ?>">
    <div class="tool-button tool-button--inline tool-button--black tool-button--close rex-cancel-button tippy" data-rex-option="continue" data-tippy-content="<?php _e( 'Close', 'rexpansive-builder' ); ?>">
      <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
    <div class="modal-content">
      <!-- <div class="b-row align-items-center">
        <div class="b-col"> -->
          <ul class="layout__list">
            <?php 
            foreach( $layoutsAvaiable as $layout ) {
              ?>
              <li class="layout__item layout layout__item--<?php echo $layout['type']; ?>">
                <!-- <div class="layout"> -->
                  <div class="layout__setting layout__icon">
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
                        Rexbuilder_Utilities::get_icon('#A009-Range');
                        break;
                    }
                    ?>
                  </div>
                  <?php
                  if( "standard" == $layout['type'] ) {
                  ?>
                  <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-id" value="<?php echo esc_attr( $layout['id'] ); ?>">
                    <input class="layout-label-input" type="hidden" name="rexlive-layout-label" data-editable-field="true" value="<?php echo esc_attr( $layout['label'] ); ?>">
                    <span class="layout-value"><?php echo $layout['label']; ?></span>
                  </div>
                  <div class="layout__setting">
                    <input class="layout-min-input" type="hidden" name="rexlive-layout-min" data-editable-field="true" value="<?php echo esc_attr( $layout['min'] ); ?>" placeholder="<?php _e( 'From', 'rexpansive-builder' ); ?>">
                    <span class="layout-value"><?php echo $layout['min']; ?>px</span>
                  </div>
                  <div class="layout__setting">
                    <input class="layout-max-input" type="hidden" name="rexlive-layout-max" data-editable-field="true" value="<?php echo esc_attr( $layout['max'] ); ?>" placeholder="<?php _e( 'To', 'rexpansive-builder' ); ?>">
                    <span class="layout-value"><?php echo ( "" != $layout['max'] ? $layout['max'] . 'px' : '&infin;' ); ?></span>
                  </div>
                  <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-type" value="<?php echo esc_attr( $layout['type'] ); ?>">
                  </div>
                  <div class="layout__setting layout-value--hide"></div>
                  <div class="layout__setting"></div>
                  <?php
                  } else {
                  ?>
                  <div class="layout__setting">
                    <div class="input-field">
                      <input type="hidden" name="rexlive-layout-id" value="<?php echo esc_attr( $layout['id'] ); ?>">
                      <input id="rexlive-layout-label-<?php echo $layout['id']; ?>" class="layout-label-input" type="text" name="rexlive-layout-label" data-editable-field="true" value="<?php echo esc_attr( $layout['label'] ); ?>">
                      <label for="rexlive-layout-label-<?php echo $layout['id']; ?>" class="<?php echo ( "" != $layout['label'] ? 'active' : '' ); ?>"><?php _e('Label','rexpansive-builder'); ?></label>
                      <span class="rex-material-bar"></span>
                      <span class="layout-value layout-value--hide"><?php echo $layout['label']; ?></span>
                    </div>
                  </div>
                  <div class="layout__setting">
                    <div class="input-field">
                      <input id="rexlive-layout-min-<?php echo $layout['id']; ?>" class="layout-min-input" type="<?php echo ( 'standard' == $layout['type'] ? 'hidden' : 'text'); ?>" name="rexlive-layout-min" data-editable-field="true" value="<?php echo esc_attr( $layout['min'] ); ?>">
                      <label for="rexlive-layout-min-<?php echo $layout['id']; ?>" class="<?php echo ( "" != $layout['min'] ? 'active' : '' ); ?>"><?php _e( 'From', 'rexpansive-builder' ); ?></label>
                      <span class="rex-material-bar"></span>
                    </div>
                    <span class="layout-value layout-value--hide"><?php echo $layout['min']; ?>px</span>
                  </div>
                  <div class="layout__setting">
                    <div class="input-field">
                      <input id="rexlive-layout-max-<?php echo $layout['id']; ?>" class="layout-max-input" type="<?php echo ( 'standard' == $layout['type'] ? 'hidden' : 'text'); ?>" name="rexlive-layout-max" data-editable-field="true" value="<?php echo ( "" != $layout['max'] ? esc_attr( $layout['max'] ) : '&infin;' ); ?>">
                      <label for="rexlive-layout-max-<?php echo $layout['id']; ?>" class="<?php echo ( "" != $layout['max'] ? 'active' : '' ); ?>"><?php _e( 'To', 'rexpansive-builder' ); ?></label>
                      <span class="rex-material-bar"></span>
                    </div>
                    <span class="layout-value layout-value--hide"><?php echo ( "" != $layout['max'] ? $layout['max'] . 'px' : '&infin;' ); ?></span>
                  </div>
                  <div class="layout__setting layout-value--hide">
                    <input type="hidden" name="rexlive-layout-type" value="<?php echo esc_attr( $layout['type'] ); ?>">
                    <span class="rexlive-layout--edit">
                      <span class="dashicons-edit dashicons-before"></span>
                      <span class="dashicons-yes dashicons-before hide-icon"></span>
                    </span>
                  </div>
                  <div class="layout__setting">
                    <span class="rexlive-layout--move">
                    <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
                    </span>
                  </div>
                  <div class="layout__setting">
                    <span class="rexlive-layout--delete">
                      <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                    </span>
                  </div>
                  <?php
                  }
                  ?>
                <!-- </div> -->
              </li>
              <?php
            }
            ?>
          </ul>
        <!-- </div>
      </div> -->
      <div class="add-custom-layout__wrap">
        <div id="rexlive-add-custom-layout" class="tool-button tool-button--inline tool-button--flat tool-button--add-mdm tippy" data-tippy-content="<?php _e( 'Add Layout', 'rexpansive-builder' ); ?>">
          <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
        </div>
      </div>
      <div class="bl_modal-row"><div class="bl_modal__option-wrap"></div></div>
    </div>
    <div class="rex-modal__outside-footer">
      <div class="tool-button tool-button--inline tool-button--confirm tool-button--modal rex-modal-option tippy" data-tippy-content="<?php _e('Save','rexpansive-builder'); ?>" data-rex-option="save">
          <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z016-Checked'); ?></span>
      </div>
      <div class="tool-button tool-button--inline tool-button--modal rex-modal-option tippy" data-rex-option="reset" data-tippy-content="<?php _e('Reset','rexpansive-builder'); ?>">
          <span class="rex-button btn-save--wrap"><?php Rexbuilder_Utilities::get_icon('#Z014-Refresh'); ?></span>
      </div>
    </div>
  </div>
</div>

<!-- <div class="lean-overlay" style="display:none;"></div> -->