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
		return apply_filters( 'rexpansive_shortcode_black_list', array( 'RexFacebookGallery' ) );
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

	 /**
	 * Function to check if a post exists by id
	 *
	 *	@since 1.0.15
	 *	@version 1.1.3 Moved this function to the utilities class
	 */
	public static function check_post_exists( $id ) {
		if( !is_null( $id ) ) :
			return is_string( get_post_status( $id ) );
		else :
			return false;
		endif;
	}

	public static function write_log ( $log )  {
		if ( true === WP_DEBUG ) {
			if ( is_array( $log ) || is_object( $log ) ) {
				error_log( print_r( $log, true ) );
			} else {
				error_log( $log );
			}
		}
	}

	public static function get_icon( $id, $classes = "" ) {
		?>
		<i class="l-svg-icons<?php echo ( !empty( $classes ) ? ' ' . $classes : '' ); ?>"><svg><use xlink:href="<?php echo $id; ?>"></use></svg></i>
		<?php
	}

	public static function close_button( $tooltip = "Close" ) {
		ob_start();
?>
<div class="tool-button tool-button--black tool-button--close rex-modal__close-button tippy" data-tippy-content="<?php _e( $tooltip, 'rexspansive');?>">
<?php self::get_icon('#Z003-Close'); ?>
</div>
<?php
		echo ob_get_clean();
	}

	/**
	 * Is the page in editor mode (and the user logged)?
	 * @return bool
	 */
	public static function isBuilderLive() {
		return is_user_logged_in() && isset( $_GET['editor'] ) && $_GET['editor'] == "true";
	}

	/**
	 * If the post was never saved on live, returns true
	 * otherwise false
	 *
	 * @return bool
	 * @since 2.0.0
	 * @date 20-03-2019
	 */
	public static function postSavedFromBackend()
	{
		global $post;
		$savedFromBackend = get_post_meta( get_the_id(), '_save_from_backend', true);
		return ( isset( $savedFromBackend ) && $savedFromBackend == "false" ? false : true );
	}

	/**
	 * Checking thw wordpress version, usefull to handle Gutenberg compatibility
	 * @since 2.0.0
	 */
	public static function is_version( $operator = '>=', $version = '5.0' ) {
		global $wp_version;
		return version_compare( $wp_version, $version, $operator );
	}

	/**
	 * Checking if a plugin with a given name is active
	 *
	 * @param string $plugin_name
	 * @return bool
	 * @since 2.0.0
	 * @date 06-03-2019
	 */
	public static function check_plugin_active( $plugin_name )
	{
		include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		return is_plugin_active( $plugin_name );
	}
	
	/**
	 * Create a new Rexbuilder valid ID, checking if not already present on 
	 * a common pool of ids
	 *
	 * @param Array $pool
	 * @return string
	 * @since 2.0.0
	 */
	public static function createValidRexID( $pool )
	{
		$id;
		$flag;
		$idLength = 4;
		
		do
		{
			$flag = true;
			$id = self::createRandomID($idLength);
			if ($id == "self") {
				$flag = false;
			}
			else
			{
				if( false === array_search( $id, $pool ) )
				{
					$flag = true;
				}
				else
				{
					$flag = false;
				}
			}
		} while (!$flag);
	
		return $id;
	}
	
	/**
	 * Create a random string with a certain width
	 * with numbers and chars
	 *
	 * @param int $n
	 * @return string
	 * @since 2.0.0
	 */
	public static function createRandomID($n)
	{
		$text = "";
		$possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		$possibleLength = strlen($possible);
	
		for ($i = 0; $i < $n; $i++)
		{
			$rnum = mt_rand() / (mt_getrandmax() + 1);
			$temp = (int)(floor($rnum * $possibleLength));
			$text .= $possible{$temp};
		}
	
		return $text;
	}

	/**
	 * Get Icon list to insert inline
	 * List is overrisable in the active theme
	 *
	 * @return array
	 * @since 2.0.0
	 * @date 12-03-2019
	 */
	public static function get_icon_list()
	{
		if ( file_exists( get_stylesheet_directory() . '/assets/sprites/sprite-list.json' ) )
		{
			$sprite_list = file_get_contents( get_stylesheet_directory() . '/assets/sprites/sprite-list.json' );
		}
		else
		{
			$sprite_list = file_get_contents( REXPANSIVE_BUILDER_PATH . '/admin/sprite-list.json' );
		}
		$sprite_a = json_decode( $sprite_list, true );
		return $sprite_a;
	}

	/**
	 * Printing all scripts and styles enqueued at a certain moment
	 *
	 * @param boolean $scripts
	 * @param boolean $styles
	 * @return array
	 * @since 2.0.0
	 * @date 11-03-2019
	 */
	public static function get_registered_scripts_styles( $scripts = true, $styles = true ) {

		$result = [];
		$result['scripts'] = [];
		$result['styles'] = [];
	
		// Print all loaded Scripts
		if ( $scripts )
		{
			global $wp_scripts;
			foreach( $wp_scripts->queue as $script ) 
			{
				$result['scripts'][] =  array(
					'handle' => $wp_scripts->registered[$script]->handle,
					'script' => $wp_scripts->registered[$script]->src
				);
			}
		}
	
		// Print all loaded Styles (CSS)
		if ( $styles )
		{
			global $wp_styles;
			foreach( $wp_styles->queue as $style )
			{
				$result['styles'][] =  array(
					'handle' => $wp_styles->registered[$style]->handle,
					'style' => $wp_styles->registered[$style]->src
				);
			}
		}
	
		return $result;
	}
}