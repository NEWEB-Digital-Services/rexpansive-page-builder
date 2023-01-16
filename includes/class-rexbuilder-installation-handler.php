<?php
/**
 * The plugin base content installation handler.
 *
 * @link       htto://www.neweb.info
 * @since      2.0.1
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 */

/**
 * The plugin base content installation handler.
 *
 * Using wp-background-processing plugin to create a callable cron job
 * to install in background the plugin base contents
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 * @author     Neweb <info@neweb.info>
 */

if ( ! class_exists( 'Rexbuilder_Installation_Handler' ) ) {

	require_once REXPANSIVE_BUILDER_PATH . 'includes/wp-background-processing/wp-async-request.php';
	require_once REXPANSIVE_BUILDER_PATH . 'includes/wp-background-processing/wp-background-process.php';

	class Rexbuilder_Installation_Handler extends WP_Background_Process {
		protected $action = 'rexbuilder_installation_handler';

		/**
		 * Handling the installation request.
		 * Include the installation class, and launch it
		 * @return void
		 * @since  2.0.1
		 */
		// protected function handle() {
		// 	// exposed $_POST['data']
		// 	require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-installation.php';
		// 	Rexbuilder_Installation::run();
		// }

		/**
		 * Handling the installation request.
		 * Include the installation class, and launch it
		 * @return void
		 * @since  2.0.1
		 */
		protected function task( $item ) {
			// Actions to perform
			require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-installation.php';
			Rexbuilder_Installation::run( $item['task'], ( isset( $item['args'] ) ? $item['args'] : null ) );
			return false;
		}

		protected function complete() {
			parent::complete();

			// Show notice to user or perform some other arbitrary task...
		}
	}
}