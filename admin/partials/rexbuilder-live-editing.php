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
global $post;
global $pagenow;

$source = get_permalink($post->ID);
if( get_post_status( $post->ID ) == "auto-draft"){
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
if(get_post_meta($post->ID, '_save_from_backend', true) == "false"){
	$backendEditing = "false";
}

?>
<div id="rexpansive-builder-backend-wrapper" data-rex-edited-backend="<?php echo $backendEditing;?>">
	<div id="rexbuilder-layout-data-backend" style="display: none;">
		<div class = "available-layouts"><?php echo json_encode($layoutsAvaiable);?></div>
	</div>
	<?php
	include_once "rexlive-toolbox-fixed.php";
	?>
	<div class="rexpansive-live-frame-container">
		<iframe id="rexpansive-live-frame" src="<?php echo $source; ?>" allowfullscreen="1" style="width:100%;height:100%;border: 0px;"></iframe>
	</div>
</div>
<?php
include_once("rexlive-js-templates.php");
include_once("rexlive-modals-tools.php");
