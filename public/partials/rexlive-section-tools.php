<?php
/**
 * Print the markup of the row toolbar buttons
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 * @deprecated	2.0.3
 */

defined('ABSPATH') or exit;

$tool_button_classes_right = 'tool-button tool-button--flat';
$tool_button_classes = 'tool-button';

?>
<div class="section-toolBox">
	<div class="tools">
		<?php include 'rexlive-section-tools-left.php'; ?>
		<?php // include 'rexlive-section-tools-center.php'; ?>
		<?php include 'rexlive-section-tools-center-last.php'; ?>
		<?php include 'rexlive-section-tools-right.php'; ?>
	</div>
	<!-- // remove section -->
</div>
<div class="section-toolBoox__highlight"></div>
<div class="section-block-noediting-ui">
	<div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c">
		<span class="call-update-model-button tippy" data-tippy-content="<?php _e('Edit Template','rexpansive-builder'); ?>"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
	</div>
</div>