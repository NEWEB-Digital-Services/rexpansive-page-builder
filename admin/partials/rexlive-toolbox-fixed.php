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
            <button class="builder-mobile-layout">Mobile</button>
            <input type="checkbox" name="device" value="mobile">
        </div>
        <div style="position:absolute;bottom:0px;left:15%;">
            <button class = "builder-tablet-layout">Tablet</button>
            <input type="checkbox" name="device" value="tablet">
        </div>
        <div style="position:absolute;bottom:0px;left:30%;">
            <button class = "builder-desktop-layout">Desktop</button>
            <input type="checkbox" name="device" value="desktop">
        </div>
        <div style="position:absolute;bottom:0px;left:45%;">
            <button class = "builder-my-desktop-layout">My Desktop</button>
            <input type="checkbox" name="device" value="mydesktop">
        </div>
        <div style="position:absolute;bottom:0px;left:60%;">
            <button class = "builder-custom-layout">+</button>
            <input type="checkbox" name="device" value="custom">
        </div>
    </div>
    <div class="rexlive-builder-actions">
        <button class = "btn-undo" style="position:absolute;bottom:0px;right:20%">Undo</button>
        <button class = "btn-redo" style="position:absolute;bottom:0px;right:10%">Redo</button>
        <button class = "btn-save" style="position:absolute;bottom:0px;right:0%;">Save</button>
    </div>
</div>