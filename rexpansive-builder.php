<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.neweb.info/
 * @since             1.0.0
 * @package           Rexbuilder
 *
 * @wordpress-plugin
 * Plugin Name:       Rexpansive Builder
 * Plugin URI:        https://www.neweb.info/store/plugin/rexpansive-page-builder/
 * Description:       The new and awesome plugin to build a page in 1 minute! Expand your mind!
 * Version:           2.0.2
 * Author:            NEWEB - Digital Agency
 * Author URI:        https://www.neweb.info/      
 * Text Domain:       rexpansive-builder
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'REXPANSIVE_BUILDER_VERSION', '2.0.2' );

/**
 * Constant for the plugin main PATH
 */
define( 'REXPANSIVE_BUILDER_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Constant for the plugin main URL
 */
define( 'REXPANSIVE_BUILDER_URL', plugin_dir_url( __FILE__ ) );

/**
 * Constant with the name of the option that hold information about
 * installation process
 */
define( 'REXPANSIVE_BUILDER_INSTALL_OPTION', 'rexpansive-builder-content-installed' );

/**
 * Constant with the name of the template folder to search
 * in a WP THEME to customize the visualization
 */
define( 'REXPANSIVE_BUILDER_TMPL_FOLDER', 'rexpansive-builder' );

/**
 * Name of the folder in which save the custom sprite icons
 * that a user can upload
 */
define( 'REXPANSIVE_BUILDER_UPLOADS_FOLDER', 'rexpansive-builder' );

/**
 * Global variable to set the state of the release
 */
define( 'REXPANSIVE_BUILDER_PRODUCTION_STYLES', true );
define( 'REXPANSIVE_BUILDER_PRODUCTION_SCRIPTS', false );

/**
 * ACF inclusion definitions
 */
if( !defined( 'ACF_LITE' ) ) {
    define( 'ACF_LITE', true );
}

/**
 * Define path and URL to the ACF plugin.
 */
define( 'REXPANSIVE_BUILDER_ACF_PATH', REXPANSIVE_BUILDER_PATH . 'admin/lib/acf/advanced-custom-fields/' );
define( 'REXPANSIVE_BUILDER_ACF_URL', REXPANSIVE_BUILDER_URL . 'admin/lib/acf/advanced-custom-fields/' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-rexbuilder-activator.php
 */
function activate_rexbuilder() {
	require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-activator.php';
	Rexbuilder_Activator::activate( 'rexpansive-builder' );
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-rexbuilder-deactivator.php
 */
function deactivate_rexbuilder() {
	require_once REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder-deactivator.php';
	Rexbuilder_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_rexbuilder' );
register_deactivation_hook( __FILE__, 'deactivate_rexbuilder' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require REXPANSIVE_BUILDER_PATH . 'includes/class-rexbuilder.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_rexbuilder() {

	$plugin = new Rexbuilder();
	$plugin->run();

}
run_rexbuilder();
