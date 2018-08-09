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

global $layouts;
$layouts = get_post_meta($post->ID, '_rex_responsive_layouts', true);

if ("" == $layouts) {
    $layouts = array(
        array(
            'id' => 'mobile',
            'label' => 'Mobile',
            'min' => '320',
            'max' => '767',
            'type' => 'standard',
        ),
        array(
            'id' => 'tablet',
            'label' => 'Tablet',
            'min' => '768',
            'max' => '1024',
            'type' => 'standard',
        ),
        array(
            'id' => 'default',
            'label' => 'My Desktop',
            'min' => '1025',
            'max' => '',
            'type' => 'standard',
        ),
    );
}

include_once "rexlive-toolbox-fixed.php";

$layoutType = get_post_meta($post->ID, '_rex_responsive_layouts', true);

?>
	<div id="rexbuilder-layout-data-backend" style="display: none;">
		<div class = "available-layouts">
			<?php
echo json_encode($layoutType);
?>
		</div>
	</div>
	<div class="rexpansive-live-frame-container">
		<iframe id="rexpansive-live-frame" src="<?php echo $source . '?&editor=true' ?>" allowfullscreen="1" style="width:100%;height:100%;border: 0px;"></iframe>
	</div>

<?php
include_once("rexlive-js-templates.php");
include_once("rexlive-modals-tools.php");