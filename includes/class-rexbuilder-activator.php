<?php

/**
 * Fired during plugin activation
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 * @author     Neweb <info@neweb.info>
 */
class Rexbuilder_Activator {

	/**
	 * Activation static method
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 * @var 	 string 	$pname 		The name of the plugin
	 */
	public static function activate( $pname ) {
		self::check_options( $pname );
	}

	/**
	 * Static function that checks that sets the defaults options during the activation
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 * @var 	 string 	$n 		A string that represent the name of the plugin, for the correct retrieve
	 *								of the options
	 */
	private static function check_options( $n ) {
		// create uploads folder
		self::create_icons_folder();

		// Defaults values
		$defaults = array(
			'post_types'	=>	array(
				'post'	=>	1,
				'page'	=>	1,
				'rex_model' => 1
			),
			'animation'		=>	0
		);

		// If there aren't options, set the defaults
		// instead do nothing, let the plugin use the old values
		if( !get_option( $n . '_options' ) ) {
			add_option( $n . '_options', $defaults );
		}

		// Insert some button models on plugin activation
		// before, check if there isn't alreday
		if( !get_option( REXPANSIVE_BUILDER_INSTALL_OPTION ) ) {
			update_option( REXPANSIVE_BUILDER_INSTALL_OPTION, false );
		}

		// Reset check update option
		update_option( 'rexpansive-builder-premium-notifier-last-updated', null );
	}

	/**
	 * Create custom uploads folder, to save custom information
	 * 
	 * The folder tree would be
	 * \-rexpansive-builder
	 * \--assets
	 * \---symbol
	 * 
	 * @return null
	 * @since  2.0.0
	 */
	private static function create_icons_folder() {
		$upload_dir = wp_upload_dir();

		// main folder
		$uploads_dirname = $upload_dir['basedir'] . '/' . REXPANSIVE_BUILDER_UPLOADS_FOLDER;
		if( ! file_exists( $uploads_dirname ) ) {
			wp_mkdir_p( $uploads_dirname );
		}

		// assets folder
		$assets_dirname = $uploads_dirname . '/assets';
		if( ! file_exists( $assets_dirname ) ) {
			wp_mkdir_p( $assets_dirname );
		}

		// synbol folder
		$symbol_dirname = $assets_dirname . '/symbol';
		if( ! file_exists( $symbol_dirname ) ) {
			wp_mkdir_p( $symbol_dirname );
		}
	}
}
