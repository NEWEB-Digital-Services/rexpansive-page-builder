<?php
/**
 * Dropdown list of avaiable layouts
 * @since 2.0.0
 */
defined('ABSPATH') or exit;
?>
<div class="tool-button-floating rexlive-responsive-buttons-wrapper">
  <div class="tool-option tool-option--full tool-option__choose-layout active-layout">
    <span class="active-layout__icon"><?php Rexbuilder_Utilities::get_icon('#A011-Desktop'); ?></span>
    <?php Rexbuilder_Utilities::get_icon('#A007-Close', 'tool-dropdown-arrow-icon'); ?>
  </div>
  <div class="tool-button_list tool-button_list--dropdown">
<?php
  $default_layouts = "";
  $custom_layouts = "";
  foreach( $layoutsAvaiable as $index => $layout ) {
    switch($index){
      case 0:
        ob_start();
      ?>
        <div class="layout-container tool-option tool-button_list--item tippy" data-tippy-content="<?php echo esc_attr( $layout['label'] ); ?>" data-tippy-placement="left">
          <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>">
            <span class="layout__icon"><?php Rexbuilder_Utilities::get_icon('#A010-Mobile'); ?></span>
          </div>
        </div>
      <?php
        $default_layouts .= ob_get_clean();
        break;
      case 1:
        ob_start();
      ?>
        <div class="layout-container tool-option tool-button_list--item tippy" data-tippy-content="<?php echo esc_attr( $layout['label'] ); ?>" data-tippy-placement="left">
          <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>">
            <span class="layout__icon"><?php Rexbuilder_Utilities::get_icon('#A001-Tablet'); ?></span>
          </div>
        </div>
      <?php
        $default_layouts .= ob_get_clean();
        break;
      case 2:
        ob_start();
        ?>
        <div class="layout-container tool-option tool-button_list--item tippy" data-tippy-content="<?php echo esc_attr( $layout['label'] ); ?>" data-tippy-placement="left">
          <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="" data-max-width="" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>">
            <span class="layout__icon"><?php Rexbuilder_Utilities::get_icon('#A011-Desktop'); ?></span>
          </div>
        </div>
        <?php
          $default_layouts .= ob_get_clean();
        break;
      default:
        ob_start();
        ?>
        <div class="layout-container tool-option tool-button_list--item tool-button_list--item--custom tippy" data-tippy-content="<?php echo ( "" != $layout['label'] ? esc_attr( $layout['label'] ) : 'Custom-' . $layout['id'] ); ?>" data-tippy-placement="left">
          <div class="btn-builder-layout builder-<?php echo $layout['id'] ?>-layout" data-min-width="<?php echo $layout['min']; ?>" data-max-width="<?php echo $layout['max']; ?>" data-name="<?php echo $layout['id'] ?>" data-label="<?php echo esc_attr( $layout['label'] ); ?>" data-layout-type="custom">
            <span class="layout__icon"><?php Rexbuilder_Utilities::get_icon('#A009-Range'); ?></span>
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
  <?php echo $custom_layouts; ?>
  <div class="layout-container tool-option tool-button_list--item tool-option__layout-settings tippy" data-tippy-content="<?php esc_attr_e( 'Ranges', 'rexpansive' ); ?>" data-tippy-placement="left">
    <div class="builder-config-layouts builder-add-custom-layout bl_d-iflex">
      <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
    </div>
  </div>
  </div>
</div>