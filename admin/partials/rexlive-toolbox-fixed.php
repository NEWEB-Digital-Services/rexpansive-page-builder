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
<div class="rexlive-toolbox">
    <div class="rexlive-responsive-toolbox">
        <div style="position:absolute;bottom:0px;left:0%;">
            <button class="btn-builder-layout builder-mobile-layout" data-min-width="320" data-max-width="768" data-name="mobile">Mobile</button>
        </div>
        <div style="position:absolute;bottom:0px;left:15%;">
            <button class="btn-builder-layout builder-tablet-layout" data-min-width="768" data-max-width="1024" data-name="tablet">Tablet</button>
        </div>
        <div style="position:absolute;bottom:0px;left:45%;">
            <button class="btn-builder-layout builder-default-layout" data-min-width="" data-max-width="" data-name="default">MyDesktop</button>
        </div>
        <div style="position:absolute;bottom:0px;left:60%;">
            <button class="btn-builder-layout builder-custom-layout" data-min-width="1440" data-max-width="1600" data-name="custom">+</button>
        </div>
    </div>
    <div class="rexlive-builder-actions">
        <button class = "btn-undo" style="position:absolute;bottom:0px;right:20%">Undo</button>
        <button class = "btn-redo" style="position:absolute;bottom:0px;right:10%">Redo</button>
        <button class = "btn-save" style="position:absolute;bottom:0px;right:0%;">Save</button>
    </div>
</div>
