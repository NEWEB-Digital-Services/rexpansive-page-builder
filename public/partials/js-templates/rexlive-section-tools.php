<?php
/**
 * Print the markup of the row js template
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials
 */

defined('ABSPATH') or exit;
?>
<script type="text/x-tmpl" id="tmpl-toolbox-section">
    <div class="section-toolBox">
        <div class="tools">
            <?php include 'rexlive-section-tools-left.php'; ?>
            <?php include 'rexlive-section-tools-center.php'; ?>
            <?php include 'rexlive-section-tools-center-last.php'; ?>
            <?php include 'rexlive-section-tools-right.php'; ?>
        </div>
    </div>
    <div class="section-toolBoox__highlight"></div>
    <div class="section-block-noediting-ui">
        <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c">
            <span class="call-update-model-button"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
        </div>
    </div>
</script>