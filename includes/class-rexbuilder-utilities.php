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
}