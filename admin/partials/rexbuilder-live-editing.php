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
<?php
// global $post;

$post_id = 0;
if( isset($_GET['post']) && "" !== $_GET['post'] ) {
	$post_id = $_GET['post'];
}

$source = get_permalink($post_id);
if( get_post_status( $post_id ) == "auto-draft"){
//	$source .= "&preview=true&editor=true";
	$source= add_query_arg( array(
			'preview' => 'true',
			'editor' => 'true',
		), $source );
} else{
//	$source .= "&editor=true";
	$source= add_query_arg( array(
			'editor' => 'true',
		), $source );
}

global $layoutsAvaiable;

$mobile = array("id" => "mobile", "label" => "Mobile", "min" => "320", "max" => "767", "type" => "standard");
$tablet = array("id" => "tablet", "label" => "Tablet", "min" => "768", "max" => "1024", "type" => "standard");
$default = array("id" => "default", "label" => "My Desktop", "min" => "1025", "max" => "", "type" => "standard");
$defaultLayoutsAvaiable = array($mobile, $tablet, $default);

$layoutsAvaiable = get_option('_rex_responsive_layouts', $defaultLayoutsAvaiable);

$backendEditing = "true";
if(get_post_meta($post_id, '_save_from_backend', true) == "false"){
	$backendEditing = "false";
}

$defaultButtonsStyles = '[]';
$buttonsStylesJSON = get_option('_rex_buttons_styles', $defaultButtonsStyles);
$buttonsStylesJSON = stripslashes($buttonsStylesJSON);
$buttonsStylesArray = json_decode($buttonsStylesJSON, true);

$defaultButtonsIDs = '[]';
$buttonsIDsJSON = get_option('_rex_buttons_ids', $defaultButtonsIDs);
$buttonsIDsJSON = stripslashes($buttonsIDsJSON);
$buttonsIDsUsed = json_decode($buttonsIDsJSON, true);
?>
<div id="rexpansive-builder-backend-wrapper" class="top-fast-tools--hide" data-rex-edited-backend="<?php echo $backendEditing;?>">
	<div>
		<div id="rex-buttons-json-css" style="display: none;"><?php
			if ($buttonsStylesArray == null) {
                echo "[]";
            } else {
                echo json_encode($buttonsStylesArray);
            }
		?></div>
		<div id="rex-buttons-ids-used" style="display: none;"><?php 
		    if ($buttonsIDsUsed == null) {
                echo "[]";
            } else {
                echo json_encode($buttonsIDsUsed);
            }
		?></div>
	</div>
	<div id="rexbuilder-layout-data-backend" style="display: none;">
		<div class = "available-layouts"><?php echo json_encode($layoutsAvaiable);?></div>
	</div>
	<?php include_once "rexlive-page-settings.php"; ?>
	<?php include_once "toolbox/rexlive-toolbox-fixed.php"; ?>
	<div class="rexpansive-live-frame-container">
		<iframe id="rexpansive-live-frame" src="" data-src-iframe="<?php echo $source; ?>" allowfullscreen="1" style="width:100%;height:100%;border: 0px;"></iframe>
		<script>
;(function() {
	/**
	 * Loading the iframe only when the parent page has complete to load
	 * to prevent un-synch communication between them
	 * 
	 * @return {null}
	 * @since  2.0.0
	 */
	var handleWindowLoad = function() {
		var iframeEl = document.getElementById('rexpansive-live-frame');
		var iframeSrc = iframeEl.getAttribute('data-src-iframe');
		if ( iframeSrc ) {
			iframeEl.src = iframeSrc;
		}
	};
	window.addEventListener('load', handleWindowLoad);
}());
	</script>
	</div>
</div>
<?php
include_once("rexlive-js-templates.php");
include_once("rexlive-color-palette.php");
include_once("rexlive-overlay-palette.php");

