<?php
/**
 * Panel that contains models for rows and buttons
 * and that slides from the left on a button click
 * The panel contains
 * - models
 * - buttons
 * - elements (in the future)
 *
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;

$elements = true;
?>
<div id="rexbuilder-lateral-panel" class="rex-lateral-panel">
	<div class="top-lateral-tools clearfix">
		<ul class="rex-lateral-tabs-list bl_d-flex" data-tabgroup="rex-lateral-tabs">
			<li><a href="#" data-rex-tab-target="rex-models-list" class="active"><?php _e( 'Models', 'rexpansive-builder' ); ?></a></li>
			<li><a href="#" data-rex-tab-target="rex-buttons-list"><?php _e( 'Buttons', 'rexpansive-builder' ); ?></a></li>
			<?php
			if ( $elements ) {
				?><li><a href="#" data-rex-tab-target="rex-elements-list"><?php _e( 'Forms', 'rexpansive-builder' ); ?></a></li><?php
			}
			?>
		</ul>
		<div class="tool-button tool-button--black tool-button--close rex-close-button rex-lateral-panel--close tippy" data-tippy-content="<?php _e('Close','rexpansive-builder'); ?>">
			<?php Rexbuilder_Utilities::get_icon('#A007-Close'); ?>
		</div>
	</div>
	<div id="rex-lateral-tabs" class="tabgroup">
		<?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/modals/lateral-panel/rexlive-lateral-panel-models.php'; ?>
		<?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/modals/lateral-panel/rexlive-lateral-panel-buttons.php'; ?>
		<?php 
		if ( $elements ) {
			include REXPANSIVE_BUILDER_PATH . 'admin/partials/modals/lateral-panel/rexlive-lateral-panel-elements.php';
		}
		?>
	</div>
</div>