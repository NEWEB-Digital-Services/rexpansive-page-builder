<?php

/**
 * The utilities for the plugin.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 */

/**
 * The utilities for the plugin.
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 * @author     Neweb <info@neweb.info>
 */
class Rexbuilder_Utilities {
    /**
	 * Function that searches in the main Child/Parent theme
	 * to find a rex-config-templates directory with the relative file to include.
	 * If not present, goes with the default
	 *
	 * @param string $filename
	 * @return void
	 */
	public static function get_plugin_templates_path( $filename, $subfolder = '' ) {
		if( file_exists( get_stylesheet_directory() . '/' . REXPANSIVE_BUILDER_TMPL_FOLDER . '/' . ( !empty( $subfolder ) ? '/' . $subfolder . '/' : '' ) . $filename ) ) {
			return get_stylesheet_directory() . '/' . REXPANSIVE_BUILDER_TMPL_FOLDER . '/' . ( !empty( $subfolder ) ? '/' . $subfolder . '/' : '' ) . $filename;
		} elseif( file_exists( REXPANSIVE_BUILDER_PATH . 'public/templates/' . ( !empty( $subfolder ) ? $subfolder . '/' : '' ) . $filename ) ) {
			return REXPANSIVE_BUILDER_PATH . 'public/templates/' . ( !empty( $subfolder ) ? $subfolder . '/' : '' ) . $filename;
		}
		return;
	}

	/**
	 *	return a list of shortcode to render directly in the grid, outside the blocks
	 *
	 *	@since 1.1.0
	 */
	public static function shortcode_black_list() {
		return array( 'RexFacebookGallery' );
	}

	/**
	 * Remove unused <p> tag that wraps a shortcode
	 *
	 * @param string $content
	 * @param string $shortcode
	 * @return string
	 */
	public static function remove_shortcode_wrap_paragraphs( $content, $shortcode ) {
		$array = array (
			'<p>[' . $shortcode => '[' .$shortcode,
			'<p>[/' . $shortcode => '[/' .$shortcode,
			$shortcode . ']</p>' => $shortcode . ']',
			$shortcode . ']<br />' => $shortcode . ']',
			']</p>' =>']',
			']<br />' =>']',
		);

		$content = strtr( $content, $array );

		return $content;
	}

	 /**
	 * Function to check if a post exists by id
	 *
	 *	@since 1.0.15
	 *	@version 1.1.3 Moved this function to the utilities class
	 */
	public static function check_post_exists( $id ) {
		if( !is_null( $id ) ) :
			return is_string( get_post_status( $id ) );
		else :
			return false;
		endif;
	}

	public static function write_log ( $log )  {
		if ( true === WP_DEBUG ) {
			if ( is_array( $log ) || is_object( $log ) ) {
				error_log( print_r( $log, true ) );
			} else {
				error_log( $log );
			}
		}
	}

	public static function get_icon( $id, $classes = "" ) {
		?>
		<i class="l-svg-icons<?php echo ( !empty( $classes ) ? ' ' . $classes : '' ); ?>"><svg><use xlink:href="<?php echo $id; ?>"></use></svg></i>
		<?php
	}

	public static function close_button( $tooltip = "Close" ) {
		ob_start();
?>
<div class="tool-button tool-button--black tool-button--close rex-modal__close-button tippy" data-tippy-content="<?php _e( $tooltip, 'rexspansive');?>">
<?php self::get_icon('#Z003-Close'); ?>
</div>
<?php
		echo ob_get_clean();
	}

	/**
	 * Is the page in editor mode (and the user logged)?
	 * @return bool
	 */
	public static function isBuilderLive() {
		return is_user_logged_in() && isset( $_GET['editor'] ) && $_GET['editor'] == "true";
	}

	/**
	 * Checking thw wordpress version, usefull to handle Gutenberg compatibility
	 * @since 2.0.0
	 */
	public static function is_version( $operator = '>=', $version = '5.0' ) {
		global $wp_version;
		return version_compare( $wp_version, $version, $operator );
	}
}