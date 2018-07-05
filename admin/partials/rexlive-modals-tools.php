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

global $post;
$layouts = get_post_meta( $post->ID, '_rex_responsive_layouts_test', true );

$layouts = array(
  array(
    'id' => 'mobile',
    'label' => 'Mobile',
    'min' => '320',
    'max' => '767'
  ),
  array(
    'id' => 'tablet',
    'label' => 'Tablet',
    'min' => '768',
    'max' => '1024'
  ),
  array(
    'id' => 'default',
    'label' => 'My Deskyot',
    'min' => '1024',
    'max' => ''
  ),
);

?>
<div class="rex-modal-wrap rex-fade">
  <div id="rexlive-custom-layout-modal" class="rexbuilder-materialize-wrap rex-modal rex-modal-draggable z-depth-4">
    <div class="modal-content">
      <div class="b-row align-items-center">
        <div class="b-col">
          <ul class="layout__list">
            <?php 
            foreach( $layouts as $layout ) {
              ?>
              <li class="layout__item">
                <div class="layout">
                  <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-id" value="<?php echo esc_attr( $layout['id'] ); ?>">
                    <input type="hidden" name="rexlive-layout-label" value="<?php echo esc_attr( $layout['label'] ); ?>">
                    <?php echo $layout['label']; ?>
                  </div>
                  <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-min" value="<?php echo esc_attr( $layout['min'] ); ?>">
                    <?php echo $layout['min']; ?>px
                  </div>
                  <div class="layout__setting">
                    <input type="hidden" name="rexlive-layout-max" value="<?php echo esc_attr( $layout['max'] ); ?>">
                    <?php echo ( "" != $layout['max'] ? $layout['max'] . 'px' : '&infin;' ); ?>
                  </div>
                  <div class="layout__setting"></div>
                  <div class="layout__setting"></div>
                </div>
              </li>
              <?php
            }
            ?>
          </ul>
        </div>
        <div class="b-row">
          <div class="b-col" style="text-align:center;">
            <button id="rexlive-add-custom-layout" class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="Add Layout">
              <i class="material-icons text-white">&#xE145;</i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="rex-modal-footer">
      <button class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
        <i class="rex-icon">n</i>
      </button>
      <button class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
        <i class="rex-icon">m</i>
      </button>
    </div>
  </div>
</div>

<div class="lean-overlay" style="display:none;"></div>