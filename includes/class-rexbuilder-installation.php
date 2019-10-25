<?php
/**
 * The plugin base content installation process.
 *
 * @link       htto://www.neweb.info
 * @since      2.0.1
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 */

/**
 * The plugin base content installation process.
 *
 * Expose a run function to install
 * - buttons
 * - models
 * - icons
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 * @author     Neweb <info@neweb.info>
 */

if ( ! class_exists( 'Rexbuilder_Installation' ) ) {

	require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-import-utilities.php';
	require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-import-xml-content.php';
	require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-utilities.php';

	class Rexbuilder_Installation {

		/**
		 * Running all the installation functions
		 * @since  2.0.1
		 */
		public static function run_all() {
			self::import_buttons();
			self::import_icons();
			self::import_models();

			if ( true === WP_DEBUG ) {
				error_log( 'Installation content complete' );
			}
		}

		public static function run( $action ) {
			$task = 'Rexbuilder_Installation::' . $action;
			if ( is_callable( $task ) ) {
				call_user_func( $task );
			}
		}

		/**
		 * Import default button models
		 *
		 * @since 2.0.0
		 * @version  2.0.1
		 */
		private static function import_buttons() {
			$buttons_definition_file = REXPANSIVE_BUILDER_PATH . '/shared/assets/rexbuttons.json';
			if ( file_exists( $buttons_definition_file ) ) {
				$buttons_definition_list = file_get_contents( $buttons_definition_file );
				if ( ! empty( $buttons_definition_list ) ) {
					$buttons_definition_array = json_decode( $buttons_definition_list, true );

					foreach ($buttons_definition_array as $option => $value) {
						update_option( $option, $value );
					}
				}
			}
		}

		/**
		 * Import default models
		 *
		 * @since 2.0.0
		 * @version  2.0.1
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
		}

		/**
		 * Install the icons, copying the packed default sprites to the upload folder
		 * @return bool 	operation has succeeded
		 * @since  2.0.0
		 * @version  2.0.1
		 */
		private static function import_icons() {
			$upload_dir = wp_upload_dir();
			$uploads_dirname = $upload_dir['basedir'] . '/' . REXPANSIVE_BUILDER_UPLOADS_FOLDER;

			$list_path = '/assets/sprite-list.json';
			if ( file_exists( REXPANSIVE_BUILDER_PATH . '/shared' . $list_path ) ) {
				$list_response = copy( REXPANSIVE_BUILDER_PATH . '/shared' . $list_path, $uploads_dirname . $list_path );
			}

			$sprite_path = '/assets/symbol/sprite.symbol.svg';
			if ( file_exists( REXPANSIVE_BUILDER_PATH . '/shared' . $sprite_path ) ) {
				$path_response = copy( REXPANSIVE_BUILDER_PATH . '/shared' . $sprite_path, $uploads_dirname . $sprite_path );
			}

			return $list_response * $path_response;
		}
	}
}