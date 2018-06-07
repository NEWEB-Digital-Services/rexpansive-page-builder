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

		// Reset check update option
		update_option( 'rexpansive-builder-premium-notifier-last-updated', null );
	}

}
