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

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title><?php echo __( 'Rexpansive', 'Rexpansive' ) . ' | ' . get_the_title(); ?></title>
	<?php wp_head(); ?>
	<script>
		var ajaxurl = '<?php echo admin_url( 'admin-ajax.php', 'relative' ); ?>';
	</script>
</head>
<body class="rexpansive-editor" style="overflow:hidden;">
<?php
    /** This action is documented in wp-admin/admin-footer.php */
	global $post;
	$source = get_permalink($post->ID);
	//$source = substr($source, 0, -1);
	include_once("rexlive-toolbox-fixed.php");

	$layoutType = get_post_meta($post->ID,'_rex_responsive_layouts',true);
	$layoutGroups = get_post_meta($post->ID,'_rex_responsive_groups',true);

	?>
	<div id="rexbuilder-layout-data-backend" style="display: none;">
		<div class = "groups">
			<?php
				echo json_encode($layoutGroups); 
			?>
		</div>
		<div class = "available-layouts">
			<?php
				echo json_encode($layoutType); 
			?>
		</div>
	</div>
	<?php

	?>
	<div class="rexpansive-live-frame-container" style ="width:100%;height:100vh;margin: 0 auto;">
		<iframe id="rexpansive-live-frame" src="<?php echo $source .'?&editor=true'?>" allowfullscreen="1" style="width:100%;height:100%"></iframe>
	</div>
	<?php
	
	/*do_action("admin_footer");
	do_action( 'admin_print_footer_scripts' );*/
	 
//	do_action("rexlive_footer_scripts");
?>
<script src="<?php echo REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexbuilder_Util_Admin_Editor.js'; ?>"></script>
<script>
	var source_url = "<?php echo $source ?>";
$(document).ready(function () {
	Rexbuilder_Util_Admin_Editor.addResponsiveListeners();
	/*
	tables names:
	rexpansive_saved_devices

rexpansive_data_mobile
rexpansive_data_tablet
rexpansive_data_desktop
rexpansive_data_custom_0_200
rexpansive_data_custom_550_640


	*/
});
</script>
</body>
</html>