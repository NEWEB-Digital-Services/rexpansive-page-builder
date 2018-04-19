<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://rexpansive.neweb.info/
 * @since             1.0.0
 * @package           Rexbuilder
 *
 * @wordpress-plugin
 * Plugin Name:       Rexpansive Builder
 * Plugin URI:        http://rexpansive.neweb.info/
 * Description:       The new and awesome plugin to build a page in 1 minute! Expand your mind!
 * Version:           1.0.15
 * Author:            NEWEB di Simone Forgiarini
 * Author URI:        http://www.neweb.info/      
 * Text Domain:       rexpansive-builder
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-rexbuilder-activator.php
 */
function activate_rexbuilder() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-rexbuilder-activator.php';
	Rexbuilder_Activator::activate( 'rexpansive-builder' );
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-rexbuilder-deactivator.php
 */
function deactivate_rexbuilder() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-rexbuilder-deactivator.php';
	Rexbuilder_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_rexbuilder' );
register_deactivation_hook( __FILE__, 'deactivate_rexbuilder' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-rexbuilder.php';

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

echo 'prova';
