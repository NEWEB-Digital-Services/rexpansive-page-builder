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

	class Rexbuilder_Installation {

		/**
		 * Running all the installation functions
		 * @since  2.0.1
		 */
		public static function run_all() {
			self::import_buttons();
			self::import_icons();
			self::import_models();
		}

		/**
		 * Run a task by its name
		 * @param  string $action task to run
		 * @return void
		 * @since  2.0.1
		 */
		public static function run( $action, $args = array() ) {
			$task = 'Rexbuilder_Installation::' . $action;
			if ( is_callable( $task ) ) {
				call_user_func( $task, $args );
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
		 * Set models resources
		 * @return int number of models recources to import
		 * @since  2.0.1
		 */
		public static function import_models_resources() {
			$models_definition_url = 'http://demo.neweb.info/wp-content/uploads/rexpansive-builder-uploads/rex-models.xml';
			$xml_file = Rexbuilder_Import_Utilities::upload_media_file( $models_definition_url, 'xml' );

			$post_count = 0;

			if( file_exists( $xml_file['file'] ) ) {
				set_transient( 'rexpansive_models_xml', $xml_file, MINUTE_IN_SECONDS * 5 );

				// get xml basic information: number of posts
				$xml = simplexml_load_file( $xml_file['file'], 'SimpleXMLElement', LIBXML_NOCDATA );

				$posts = $xml->xpath('//item');
				$post_count = count( $posts );
			}

			return $post_count;
		}

		/**
		 * Start importing posts operation
		 * Pause defering term and comment counting
		 * Pause cache invalidation
		 * @return void
		 * @since  2.0.1
		 */
		private static function import_models_start() {
			wp_defer_term_counting( true );
			wp_defer_comment_counting( true );
	
			wp_suspend_cache_invalidation( true );
		}

		/**
		 * End importing posts operation
		 * Restart cache invalidation and defering terms and comments
		 * Remove the xml file
		 * @return void
		 * @since  2.0.1
		 */
		private static function impost_models_end() {
			$xml_file = get_transient( 'rexpansive_models_xml' );

			wp_suspend_cache_invalidation( false );
		
			wp_defer_term_counting( false );
			wp_defer_comment_counting( false );
			
			if( file_exists( $xml_file['file'] ) ) {
				Rexbuilder_Import_Utilities::remove_media_file( $xml_file['file'] );
			}

			// delete transient if already exists
			delete_transient( 'rexpansive_models_xml' );
		}

		/**
		 * Import posts by an interval
		 * @param  array $args start and end of interval
		 * @return void
		 * @since  2.0.1
		 */
		private static function import_models_interval( $args ) {
			$xml_file = get_transient( 'rexpansive_models_xml' );

			if( file_exists( $xml_file['file'] ) ) {
				$xml = simplexml_load_file( $xml_file['file'], 'SimpleXMLElement', LIBXML_NOCDATA );
				$namespaces = $xml->getNamespaces(true);
				$posts = $xml->xpath('//item');
				$index = $args['start'];

				while ( $index < $args['end'] ) {
					if ( ! isset( $posts[$index] ) ) {
						break;
					}
					Rexbuilder_Import_Utilities::import_post( $posts[$index], $namespaces );
					$index++;
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