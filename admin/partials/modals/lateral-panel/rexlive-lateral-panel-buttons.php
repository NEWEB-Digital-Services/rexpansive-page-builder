<?php
/**
 * Buttons panel
 * 
 * @since 2.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div id="rex-buttons-list" class="rex-lateral-panel__content">
	<?php include REXPANSIVE_BUILDER_PATH . 'admin/partials/modals/rexlive-loader-modal.php'; ?>
	<div class="buttons-list-wrapper rex-lateral-panel__list">
		<ul class="button-list button-list--pswp">
			<?php 
				// it's possibile to query like '_rex_button_%%_html0'?
				$defaultButtonsIDs = '[]';
				$buttonsIDsJSON = get_option('_rex_buttons_ids', $defaultButtonsIDs);
				$buttonsIDsJSON = stripslashes($buttonsIDsJSON);
				$buttonsIDsUsed = json_decode($buttonsIDsJSON, true);
				foreach ($buttonsIDsUsed as $index => $id_button) {
					$buttonHTML = get_option('_rex_button_'.$id_button.'_html', "");
					if($buttonHTML != ""){
						$buttonHTML = stripslashes($buttonHTML);
					?>
					<li class="button-list__element" draggable="true">
						<div class="rex-container"><?php echo $buttonHTML ?></div>
						<div class="button-list__element__tools">
							<div class="tool-button tool-button--black rex-close-button button__element--delete tippy" data-tippy-content="<?php _e('Delete','rexpansive-builder'); ?>">
								<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
							</div>
						</div>
					</li>
					<?php
					}
				}
			?>
		</ul>
	</div>
</div>