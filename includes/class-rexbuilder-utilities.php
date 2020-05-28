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

	/**
	 * Write information to wp-debug log
	 * @param  mixed $log information to log
	 * @return void
	 * @version  2.0.1
	 */
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
<div class="tool-button tool-button--black tool-button--close rex-modal__close-button tippy" data-tippy-content="<?php _e( $tooltip, 'rexpansive-builder');?>">
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
		// check post type rex_model ?
		$maybe_post_type = get_post_type();

		if ( '' !== $maybe_post_type && 'rex_model' === $maybe_post_type ) {
			return true;
		}

		return is_user_logged_in() && isset( $_GET['editor'] ) && 'true' === $_GET['editor'];
	}

	/**
	 * Enqueue scripts and styles for a certain resource
	 * @param  string $resource resource name
	 * @param  array  $args     additonal arguments
	 * @return void
	 * @since  2.0.4
	 */
	public static function enqueue_resource( $resource = '', $args = array() ) {
		$style_depths = ( isset( $args['style_depths'] ) ? : array() );
		$script_depths = ( isset( $args['script_depths'] ) ? : array() );

		switch ( $resource ) {
			case 'flickity':
				wp_enqueue_style( 'flickity-style', REXPANSIVE_BUILDER_URL . '/public/css/flickity.min.css', $style_depths, REXCLASSIC_VERSION );
				wp_enqueue_script( 'flickity-script', REXPANSIVE_BUILDER_URL . 'public/js/vendor/flickity.pkgd.min.js', $script_depths, REXCLASSIC_VERSION, true );
				break;
			case 'rex-accordion':
				wp_enqueue_script( 'rex-accordion', REXPANSIVE_BUILDER_URL . 'public/js/vendor/jquery.rexAccordion.min.js', $script_depths, REXCLASSIC_VERSION, true );
				break;
			case 'photoswipe':
				wp_enqueue_style( 'photoswipe-style', REXPANSIVE_BUILDER_URL . 'public/Photoswipe/photoswipe.css', $style_depths, REXCLASSIC_VERSION );
				wp_enqueue_style( 'photoswipe-skin', REXPANSIVE_BUILDER_URL . 'public/Photoswipe/default-skin/default-skin.css', $style_depths, REXCLASSIC_VERSION, 'all');
				wp_enqueue_script( 'photoswipe-script', REXPANSIVE_BUILDER_URL . 'public/Photoswipe/photoswipe.min.js', $script_depths, REXCLASSIC_VERSION, true );
				wp_enqueue_script( 'photoswipe-ui-script', REXPANSIVE_BUILDER_URL . 'public/Photoswipe/photoswipe-ui-default.min.js', $script_depths, REXCLASSIC_VERSION, true );
				break;
			case 'rxcf7':
				wp_enqueue_style( 'rxcf7', REXPANSIVE_BUILDER_URL . 'public/css/rxcf7.css', $style_depths, REXCLASSIC_VERSION );
				break;
			case 'velocity':
					wp_enqueue_script('velocity', REXPANSIVE_BUILDER_URL . 'public/js/vendor/3-velocity.min.js', array('jquery'), $ver, true);
					wp_enqueue_script('velocityui', REXPANSIVE_BUILDER_URL . 'public/js/vendor/3-velocity.ui.min.js', array('jquery'), $ver, true);
				break;
			default:
				break;
		}
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
			$id = self::createRandomID( $idLength );
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
		$upload_dir = wp_upload_dir();
		$uploads_dirname = $upload_dir['basedir'] . '/' . REXPANSIVE_BUILDER_UPLOADS_FOLDER;

		$sprite_list = '[]';
		if ( file_exists( get_stylesheet_directory() . '/assets/sprites/sprite-list.json' ) )
		{
			$sprite_list = file_get_contents( get_stylesheet_directory() . '/assets/sprites/sprite-list.json' );
		}
		else if ( file_exists( $uploads_dirname . '/assets/sprite-list.json' ) )
		{
			$sprite_list = file_get_contents( $uploads_dirname . '/assets/sprite-list.json' );
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

	/**
	 * Utility function to clone an array of objects
	 *
	 * @param array $array
	 * @return array
	 * @since 2.0.0
	 * @date 05-04-2019
	 */
	public static function array_clone( $array ) {
		return array_map( function( $element ) {
			return ( ( is_array( $element ) )
				? array_clone( $element )
				: ( ( is_object( $element ) )
					? clone $element
					: $element
				)
			);
		}, $array );
	}

	/**
	 * Checks if rexpansive builder is active on a specific post
	 * 
	 * @return Boolean
	 * @since  2.0.0
	 */
	public static function public_builder_active_on_this_post_type( ) {
		global $post;

		$plugin_options = get_option('rexpansive-builder_options');
		$this_post_type = get_post_type();
		$post_id = get_the_ID();
		$builder_active = get_post_meta( $post_id, '_rexbuilder_active', true );

		$condition = isset( $plugin_options['post_types'] ) && $this_post_type && array_key_exists( $this_post_type, $plugin_options['post_types'] ) && $post_id && 'true' == $builder_active;

		return ( apply_filters( 'rexbuilder_post_type_active', $condition ) );
	}

	/**
	 * Add a string of attribute=value to a shortcode
	 * The string can contain more than one attribute
	 * 
	 * @param String &$shortcode The string of the original shortcode, passed by reference
	 * @param array  $atts      Array of options
	 * @version 2.0.0
	 */
	public static function add_attribute_to_shortcode( &$shortcode, $atts = array() ) {
		if ( ! empty( $atts ) ) {
			$shortcode_pattern = "\[(\[?)({$atts['shortcode']})(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*+(?:\[(?!\/\2\])[^\[]*+)*+)\[\/\2\])?)(\]?)";
			preg_match_all( "/$shortcode_pattern/", $shortcode, $result_shortcode );
			$shortcode = '[' . $result_shortcode[2][0] . $result_shortcode[3][0] . ' ' . $atts['attribute'] . ']' . ( $result_shortcode[5][0] ? $result_shortcode[5][0] . '[\\' . $result_shortcode[2][0] . ']' : '' );
		}
	}

	/** 
	* Duplicates a post & its meta and it returns the new duplicated Post ID
	* (https://gist.github.com/eduwass/90c36565c41ac01cafe3)
	* @param  [int] $post_id The Post you want to clone
	* @return [int] The duplicated Post ID
	*/
	public static function duplicate($post_id) {
		self::write_log($post_id);
		$title   = get_the_title($post_id);
		$oldpost = get_post($post_id);
		$post    = array(
		  'post_title' => $title,
		  'post_status' => 'publish',
		  'post_type' => $oldpost->post_type,
		  'post_author' => 1
		);
		self::write_log($post);
		$new_post_id = wp_insert_post($post, true);
		self::write_log($new_post_id);
		// Copy post metadata
		$data = get_post_custom($post_id);
		foreach ( $data as $key => $values) {
		  foreach ($values as $value) {
		  	$temp = maybe_unserialize($value);
		    add_post_meta( $new_post_id, $key, $temp );
		  }
		}
		return $new_post_id;
	}

	/**
	 * Checking saved data of the page to know if a Vimeo video is present.
	 * @return	Boolean    Is there a Vimeo video in page?
	 * @since		2.0.4
	 */
	public static function check_vimeo_video_in_page()
	{
		global $post;
		$customizations_array = array();
		$customizations_names = get_post_meta($post->ID, '_rex_responsive_layouts_names', true);

		if ( empty( $customizations_names ) ) return false;

		$customizationsString = '';

		foreach ($customizations_names as $name) {
			$customizationSectionsJSON = get_post_meta($post->ID, '_rex_customization_' . $name, true);
			$customizationsString .= $customizationSectionsJSON;
		}

		$re = '/(video_bg_url_vimeo_section|video_bg_url_vimeo)\":\"\S[^\",]+\"/m';

		preg_match($re, $customizationsString, $matches, PREG_OFFSET_CAPTURE, 0);

		return ( ! empty( $matches ) );
	}
}
