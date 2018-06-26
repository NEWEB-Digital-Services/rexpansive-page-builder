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
<div class="rexlive-toolbox">
    <div class="rexlive-responsive-toolbox">
        <div style="position:absolute;bottom:0px;left:0%;">
            <button class="btn-builder-layout builder-mobile-layout" data-min-width="320" data-name="mobile">Mobile</button>
            <input type="checkbox" name="device" value="mobile" data-min-width="320" data-max-width="768">
        </div>
        <div style="position:absolute;bottom:0px;left:15%;">
            <button class="btn-builder-layout builder-tablet-layout" data-min-width="768" data-name="tablet">Tablet</button>
            <input type="checkbox" name="device" value="tablet" data-min-width="768" data-max-width="1024">
        </div>
        <div style="position:absolute;bottom:0px;left:30%;">
            <button class="btn-builder-layout builder-desktop-layout" data-min-width="1024" data-name="desktop">Desktop</button>
            <input type="checkbox" name="device" value="desktop" data-min-width="1024" data-max-width="">
        </div>
        <div style="position:absolute;bottom:0px;left:45%;">
            <button class="btn-builder-layout builder-my-desktop-layout" data-min-width="" data-name="mydesktop">My Desktop</button>
            <input type="checkbox" name="device" value="mydesktop" data-min-width="" data-max-width="">
        </div>
        <div style="position:absolute;bottom:0px;left:60%;">
            <button class="btn-builder-layout builder-custom-layout" data-min-width="1440" data-name="custom">+</button>
            <input type="checkbox" name="device" value="custom" data-min-width="1440" data-max-width="1600">
        </div>
    </div>
    <div class="rexlive-builder-actions">
        <button class = "btn-undo" style="position:absolute;bottom:0px;right:20%">Undo</button>
        <button class = "btn-redo" style="position:absolute;bottom:0px;right:10%">Redo</button>
        <button class = "btn-save" style="position:absolute;bottom:0px;right:0%;">Save</button>
    </div>
</div>