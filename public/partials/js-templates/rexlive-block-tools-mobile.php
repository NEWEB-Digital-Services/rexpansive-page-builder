<?php
/**
 * Print the block top tools
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined( 'ABSPATH' ) or exit;
?>
<div class="rexlive-block-toolbox mobile-tools">
    <div class="rexlive-mobile-block-tools bl_d-flex bl_jc-sb bl_ai-c">
        <div class="el-size-viewer tool-indicator"><span class="el-size-viewer__val"></span> <span class="el-size-viewer__um">PX</span></div>
        <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="<?php _e('Delete block', 'rexspansive'); ?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>
    </div>
</div>