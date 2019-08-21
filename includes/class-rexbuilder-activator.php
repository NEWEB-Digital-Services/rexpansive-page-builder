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
			'animation'		=>	0,
			'fast_load'		=>  0
		);

		// If there aren't options, set the defaults
		// instead do nothing, let the plugin use the old values
		if( !get_option( $n . '_options' ) ) {
			add_option( $n . '_options', $defaults );
		}

		// Insert some button models on plugin activation
		// before, check if there isn't alreday
		if( !get_option( 'rexpansive-builder-content-installed' ) ) {
			self::import_buttons();
			self::import_models();
			self::import_icons();

			update_option( 'rexpansive-builder-content-installed', true );
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

	/**
	 * Import default button models
	 *
	 * @since 2.0.0
	 */
	private static function import_buttons() {
		$buttons_definition_file = REXPANSIVE_BUILDER_PATH . 'admin/default-models/rexbuttons.json';
		$buttons_definition_list = file_get_contents( $buttons_definition_file );
		$buttons_definition_array = json_decode( $buttons_definition_list, true );

		foreach ($buttons_definition_array as $option => $value) {
			add_option( $option, $value );
		}
	}

	/**
	 * Import default models
	 *
	 * @since 2.0.0
	 */
	private static function import_models() {
		// import eventually media from the model
		// beware of the ids

		$models_definition_url = 'http://demo.neweb.info/wp-content/uploads/rexpansive-builder-uploads/rex-models.xml';
		$xml_file = Rexbuilder_Import_Utilities::upload_media_file( $models_definition_url, 'xml' );

		if( file_exists( $xml_file['file'] ) ) {

			$Xml = new Rexbuilder_Import_Xml_Content( $xml_file['file'] );
	
			wp_defer_term_counting( true );
			wp_defer_comment_counting( true );
	
			wp_suspend_cache_invalidation( true );
	
			$Xml->run_import_all();
	
			wp_suspend_cache_invalidation( false );
	
			wp_defer_term_counting( false );
			wp_defer_comment_counting( false );
			
			Rexbuilder_Import_Utilities::remove_media_file( $xml_file['file'] );
		}

		// $model_args = array(
		// 	'post_content' => '',	// @todo
		// 	'post_title' => '',		// @todo
		// 	'post_status' => 'private',
		// 	'comment_status' => 'closed',
		// 	'ping_status' => 'closed',
		// 	'post_name' => '',		// @todo
		// 	'post_type' => 'rex_model'
		// );

		// insert model
		// $model_ID = wp_insert_post( $model_args );

		// import thumbnail
		// to import on media folder and create relative media post

		// insert model postadata
		// _rexbuilder_active
		// _save_from_backend
		// _rex_model_customization_names
		// _rex_model_customization_default
		// _thumbnail_id
	}

	/**
	 * Import default SVG Icons
	 * @return null
	 * @since  2.0.0
	 */
	private static function import_icons() {
		Rexbuilder_Utilities::install_icons();
	}

}
