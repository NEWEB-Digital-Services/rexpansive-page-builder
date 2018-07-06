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
	<!-- <link rel="stylesheet" href="<?php echo esc_url( REXPANSIVE_BUILDER_URL . 'admin/css/admin.css' ); ?>"> -->
	<script>
		var ajaxurl = '<?php echo admin_url( 'admin-ajax.php', 'relative' ); ?>';
	</script>
	<style>
	ul {
		list-style:none;
	}

	.layout__list {
	}

	.layout {
		display:flex;
		justify-content: space-around;
	}

	.layout__setting {
		padding: 10px;
	}

	.rexlive-layout--edit,
	.rexlive-layout--delete {
		cursor: pointer;
	}

	.hide-icon {
		display:none;
	}

	.layout__item.editing .layout-value {
		display:none;
	}

	.layout__item input {
		max-width: 75px;
	}

	.rexlive-responsive-toolbox {
		display:flex;
		justify-content: space-between;
		height: 100%;
    	align-items: center;
	}
	</style>
</head>
<body class="rexpansive-editor" style="overflow:hidden;background-color:grey;">
<?php
    /** This action is documented in wp-admin/admin-footer.php */
	global $post;
	$source = get_permalink($post->ID);
	
	global $layouts;
	$layouts = get_post_meta( $post->ID, '_rex_responsive_layouts', true );

	if( "" == $layouts ) {
		$layouts = array(
			array(
				'id' => 'mobile',
				'label' => 'Mobile',
				'min' => '320',
				'max' => '767',
				'type' => 'standard'
			),
			array(
				'id' => 'tablet',
				'label' => 'Tablet',
				'min' => '768',
				'max' => '1024',
				'type' => 'standard'
			),
			array(
				'id' => 'default',
				'label' => 'My Desktop',
				'min' => '1025',
				'max' => '',
				'type' => 'standard'
			),
		);
	}

	include_once("rexlive-toolbox-fixed.php");

	$layoutType = get_post_meta($post->ID,'_rex_responsive_layouts',true);

	?>
	<div id="rexbuilder-layout-data-backend" style="display: none;">
		<div class = "available-layouts">
			<?php
				echo json_encode($layoutType); 
			?>
		</div>
	</div>
	<div class="rexpansive-live-frame-container" style ="width:100%;height:100vh;margin: 0 auto;">
		<iframe id="rexpansive-live-frame" src="<?php echo $source .'?&editor=true'?>" allowfullscreen="1" style="width:100%;height:100%;border: 0px;"></iframe>
	</div>
	<?php
	
	/*do_action("admin_footer");
	do_action( 'admin_print_footer_scripts' );*/
	 
//	do_action("rexlive_footer_scripts");

	include_once("rexlive-js-templates.php");
	include_once("rexlive-modals-tools.php");
?>
<script src="<?php echo REXPANSIVE_BUILDER_URL . 'admin/js/0-Rexpansive_Builder_Admin_Config.js'; ?>"></script>
<script src="<?php echo REXPANSIVE_BUILDER_URL . 'admin/js/0-Rexpansive_Builder_Admin_Utilities.js'; ?>"></script>
<script src="<?php echo REXPANSIVE_BUILDER_URL . 'admin/js/1-Rexpansive_Builder_Admin_Modals.js'; ?>"></script>
<script src="<?php echo REXPANSIVE_BUILDER_URL . 'public/js/vendor/tmpl.min.js'; ?>"></script>
<script src="<?php echo REXPANSIVE_BUILDER_URL . 'admin/js/builderlive/Rexbuilder_Util_Admin_Editor.js'; ?>"></script>
<script>
	var source_url = "<?php echo $source ?>";
	$(document).ready(function () {
		Rexpansive_Builder_Admin_Config.init();

		Rexbuilder_Util_Admin_Editor.init();
		Rexbuilder_Util_Admin_Editor.addResponsiveListeners();
		Rexbuilder_Util_Admin_Editor.add_custom_layout_listener();
	});
</script>
</body>
</html>