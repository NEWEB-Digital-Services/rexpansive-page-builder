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
		// Defaults values
		$defaults = array(
			'post_types'	=>	array(
				'post'	=>	1,
				'page'	=>	1,
				'rex_model' => 1
			),
			'animation'		=>	0,
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

			update_option( 'rexpansive-builder-content-installed', true );
		}

		// Reset check update option
		update_option( 'rexpansive-builder-premium-notifier-last-updated', null );
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

		$models_definition_file = REXPANSIVE_BUILDER_PATH . 'admin/default-models/rexmodels.xml';

		$XmlImporter = new Rexbuilder_Import_Xml_Content( $models_definition_file );
		$XmlImporter->run_import();

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

}
