<?php
/**
 * Print the markup of the modals of the builder
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined('ABSPATH') or exit;

?>
<div class="section-toolBox">
	<div class="tool-button btn-flat builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexpansive');?>">
		<i class="material-icons grey-text text-darken-2">&#xE8D5;</i>
	</div>

	<div class="tool-button btn-flat builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexpansive');?>">
		<i class="material-icons grey-text text-darken-2">&#xE14D;</i>
    </div>

    <button class="tool-button btn-floating builder-section-config tooltipped waves-effect waves-light" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexpansive');?>">
		<i class="material-icons">&#xE8B8;</i>
	</button>

	<button class="tool-button btn-floating test-save tooltipped waves-effect waves-light">
		S
	</button>

	<button class="tool-button btn-floating collapse-grid tooltipped waves-effect waves-light">
		C
	</button>

	<button class="tool-button btn-floating set-section-name tooltipped waves-effect waves-light">
		N
	</button>

	<button class="tool-button btn-floating add-new-block-empty tooltipped waves-effect waves-light">
		+
	</button>

	<button class="tool-button btn-floating add-new-block-image tooltipped waves-effect waves-light">
		i
	</button>

	<button class="tool-button btn-floating add-new-block-text tooltipped waves-effect waves-light">
		t
	</button>

	<button class="tool-button btn-floating add-new-block-video tooltipped waves-effect waves-light">
		v
	</button>
	
	<button class="tool-button btn-floating builder-delete-row waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexspansive');?>">
		<i class="material-icons white-text">&#xE5CD;</i>
	</button>

</div>