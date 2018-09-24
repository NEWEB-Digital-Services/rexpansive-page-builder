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

defined( 'ABSPATH' ) or exit;
?>
<div class="rexlive-block-toolbox">
    <div class="rexlive-top-block-tools">
        <span class="el-size-viewer"></span>
        <button class="tool-button tool-button--inline builder-delete-block waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexspansive'); ?>">
		    <i class="material-icons white-text">&#xE5CD;</i>
    	</button>
        <button class="tool-button tool-button--inline builder-edit-block tooltipped waves-effect waves-light">
	    	O
        </button>
        <button class="tool-button tool-button--inline builder-edit-slider tooltipped waves-effect waves-light">
            S
        </button>
	    <div class="tool-button tool-button--inline btn-flat builder-copy-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
		    <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
        </div>
    </div>
</div>