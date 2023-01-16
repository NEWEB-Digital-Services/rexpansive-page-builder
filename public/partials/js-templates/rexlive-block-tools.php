<?php
/**
 * Print the JS template for the block toolbox
 *
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/public/partials/js-templates
 */

defined('ABSPATH') or exit;
?>

<script type="text/x-tmpl" id="tmpl-toolbox-block-wrap">
<div class="ui-focused-element-highlight">
    <?php include "rexlive-block-tools-top.php"; ?>
    <?php include "rexlive-block-tools-bottom.php"; ?>
    <?php include "rexlive-block-tools-mobile.php"; ?>
    <?php // include "rexlive-block-tools-floating.php"; ?>
</div>
</script>