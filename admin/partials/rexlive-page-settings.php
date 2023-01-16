<?php
/**
 * Print
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

$post_id = 0;
if( isset( $_GET['post'] ) && "" !== $_GET['post'] ) {
	$post_id = $_GET['post'];
}

$global_settings = stripslashes( get_option( '_rex_global_page_settings', '[]' ) );
$custom_settings = stripslashes( get_post_meta( $post_id, '_rex_custom_page_settings', true ) );

?>
<div id="rexlive-page-settings" style="display: none;">
<div id="rexlive-page-settings--global"><?php echo $global_settings; ?></div>
<div id="rexlive-page-settings--custom"><?php echo $custom_settings; ?></div>
</div>