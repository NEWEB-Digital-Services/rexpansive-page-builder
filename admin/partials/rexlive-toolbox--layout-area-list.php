<?php
/**
 * Area list of avaiable layouts
 * @since 2.0.0
 */
defined('ABSPATH') or exit;
?>
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
        <div class="layout-container tool-option tippy" data-tippy-content="<?php echo ( "" != $layout['label'] ? esc_attr( $layout['label'] ) : 'Custom-' . $layout['id'] ); ?>">
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
  <div class="layout-container tool-option tippy" data-tippy-content="<?php esc_attr_e( 'Ranges', 'rexpansive' ); ?>">
    <div class="builder-config-layouts builder-add-custom-layout bl_d-iflex">
      <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
    </div>
  </div>
  <?php echo $custom_layouts; ?>
</div>