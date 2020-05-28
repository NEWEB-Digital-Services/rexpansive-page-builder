<?php
/**
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 */
/**
 * Class to handle the import of an XML file
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 * @author     Neweb <info@neweb.info>
 */
if ( ! class_exists( 'Rexbuilder_Import_Xml_Content' ) ) {
	class Rexbuilder_Import_Xml_Content {

		/**
		 *	SimpleXMLElement Object
		 */
		protected $xml;

		/**
		 *	Array of namespaces in the XML
		 */
		protected $namespaces;

		/**
		 *	Array of SimpleXMLElement Objects with all the posts
		 */
		protected $posts;

		/**
		 *	Array Of post arrays
		 */
		protected $parsed_posts;

		/**
		 *	Array of SimpleXMLElement Objects with all the categories
		 */
		protected $categories;

		/**
		 *	Array of SimpleXMLElement Objects with all the taxonomies
		 */
		protected $taxonomies;

		/**
		 * Int number of total posts in the XML
		 */
		public $total_posts;

		/**
		 *	Array of source site info
		 */
		protected $source_content_info;

		/**
		 *	Array of response
		 */
		protected $import_response;

		/**
		 *	Array to synchronize navigation menu
		 *
		 */
		protected $synch_nav_menu;

		/**
		 *	Constructor
		 */
		public function __construct( $url ) {
			$this->xml = simplexml_load_file( $url, 'SimpleXMLElement', LIBXML_NOCDATA );

			$this->namespaces = $this->xml->getNamespaces(true);

			$this->posts = $this->xml->xpath('//item');

			$this->categories = $this->xml->xpath('/rss/channel/wp:category');

			$this->taxonomies = $this->xml->xpath('/rss/channel/wp:term');

			$this->total_posts = count( $this->posts );

			$this->source_content_info = $this->get_site_origin_info();

			$this->parse_all_xml_to_array();

			$this->import_response = array(
				'posts'	=>	array(),
				'categories'	=>	array(),
				'terms'	=>	array(),
				'session_response'	=>	array(),
			);

			$this->synch_nav_menu = array();
		}

		/**
		 *	Retrieve and save info from the original site
		 */
		public function get_site_origin_info() {
			return $this->xml->channel->children( $this->namespaces['wp'] );
		}

		/**
		 *	Function that sets the arguments for create a post based on the XML stored
		 */
		public function import_post( $item, $createNewIfAlreadyExists ) {
			$temp_wp_namespace = $item->children( $this->namespaces['wp'] );
			$temp_content_namespace = $item->children( $this->namespaces['content'] );
			$temp_excerpt_namespace = $item->children( $this->namespaces['excerpt'] );

			$temp_category = $item->category;
			$temp_comments = $temp_wp_namespace->comment;

			foreach( $temp_wp_namespace->postmeta as $postmeta ) {
				if( is_serialized( (string)$postmeta->meta_value ) ) {
					$meta_input[(string) $postmeta->meta_key] = maybe_unserialize((string)$postmeta->meta_value);				
				} else {
					$meta_input[(string) $postmeta->meta_key] = (string)$postmeta->meta_value;
				}
			}

			$args = array(
				//'ID'				=>	(int)$temp_wp_namespace->post_id,
				'post_author'		=>	1,
				'post_date'			=>	(string)$temp_wp_namespace->post_date,
				'post_date_gmt'		=>	(string)$temp_wp_namespace->post_date_gmt,
				'post_content'		=>	(string)$temp_content_namespace->encoded,
				'post_title'		=>	(string)$item->title,
				'post_excerpt'		=>	(string)$temp_excerpt_namespace->encoded,
				'post_status'		=>	(string)$temp_wp_namespace->status,
				'post_type'			=>	(string)$temp_wp_namespace->post_type,
				'comment_status'	=>	(string)$temp_wp_namespace->comment_status,
				'ping_status'		=>	(string)$temp_wp_namespace->ping_status,
				'post_name'			=>	(string)$temp_wp_namespace->post_name,
				'post_parent'		=>	(int)$temp_wp_namespace->post_parent,
				'menu_order'		=>	(int)$temp_wp_namespace->menu_order,
				'guid'				=>	(string)$item->guid,
				'import_id'			=>	(int)$temp_wp_namespace->post_id,
				'tax_input'			=>	array(),
				'meta_input'		=>	$meta_input,
			);

			// if( !post_exists( $args['post_title'], '', $args['post_date'] ) ) {
			if( false === get_post_status( $args['import_id'] ) ) {

				if( $args['post_type'] == 'attachment' && $args['post_status'] != 'trash' ) {
					$result = $this->upload_media_file( $args['guid'], 'image' );

					if ( ! is_wp_error( $result ) ) {
						$attachment_mime_type = wp_check_filetype( $result['file'] );

						$args['guid'] = $result['url'];
						$args['post_mime_type'] = $attachment_mime_type['type'];

						$post_id = wp_insert_attachment( $args, $result['file'] );
						$data = wp_generate_attachment_metadata( $post_id, $result['file'] );
						wp_update_attachment_metadata( $post_id, $data );
					} else {
						// log error
						if ( true === WP_DEBUG ) {
							error_log( print_r( $result, true ) );
						}
					}
				} else {
					$post_id = wp_insert_post( $args, true );
				}

				// Handle categories
				if( $temp_category ) {
					$category_slugs = array();

					foreach( $item[0]->category as $tt ) {
						$category_slugs[(string)$tt->attributes()->domain][] = (string)$tt->attributes()->nicename;
					}

					foreach( $category_slugs as $key => $cs ) {
						$tt_result = wp_set_object_terms( $post_id, $cs, $key );
					}
				}

				// Handle comments
				if( $temp_comments ) {
					foreach ($temp_comments as $comment) {
						$args = array(
							'comment_approved'		=>	(int) $comment->comment_approved,
							'comment_author'		=>	(string) $comment->comment_author,
							'comment_author_email'	=>	(string) $comment->comment_author_email,
							'comment_author_IP'		=>	(string) $comment->comment_author_IP,
							'comment_author_url'	=>	(string) $comment->comment_author_url,
							'comment_content'		=>	(string) $comment->comment_content,
							'comment_date'			=>	(string) $comment->comment_date,
							'comment_date_gmt'		=>	(string) $comment->comment_date_gmt,
							'comment_parent'		=>	(int) $comment->comment_parent,
							'comment_post_ID'		=>	$post_id,
							'comment_type'			=>	(string) $comment->comment_type,
							'user_id'				=>	(int) $comment->comment_user_id,
						);

						$comment_id = wp_insert_comment( $args );
					}
				}

			} else {
				if ($createNewIfAlreadyExists) {
					unset($args['import_id']);
					$post_id = wp_insert_post( $args, true );
				} else {
					// echo 'post already exists!';
					$this->import_response['posts'][] = 'post ' . $args['import_id'] . ' already exists!';
				}
			}
		}

		/**
		 *
		 */
		public function parse_all_xml_to_array() {
			foreach( $this->posts as $post ) {
				$this->parse_xml_to_array( $post );
			}
		}


		public function parse_xml_to_array( $item ) {
			$temp_wp_namespace = $item->children( $this->namespaces['wp'] );
			$temp_content_namespace = $item->children( $this->namespaces['content'] );
			$temp_excerpt_namespace = $item->children( $this->namespaces['excerpt'] );

			$temp_category = $item->category;
			$temp_comments = $temp_wp_namespace->comment;

			$meta_input = array();

			foreach( $temp_wp_namespace->postmeta as $postmeta ) :
				if(is_serialized((string)$postmeta->meta_value)) {
					$meta_input[(string) $postmeta->meta_key] = maybe_unserialize((string)$postmeta->meta_value);				
				} else {
					$meta_input[(string) $postmeta->meta_key] = (string)$postmeta->meta_value;
				}
			endforeach;

			$args = array(
				//'ID'				=>	(int)$temp_wp_namespace->post_id,
				'post_author'		=>	1,
				'post_date'			=>	(string)$temp_wp_namespace->post_date,
				'post_date_gmt'		=>	(string)$temp_wp_namespace->post_date_gmt,
				'post_content'		=>	(string)$temp_content_namespace->encoded,
				'post_title'		=>	(string)$item->title,
				'post_excerpt'		=>	(string)$temp_excerpt_namespace->encoded,
				'post_status'		=>	(string)$temp_wp_namespace->status,
				'post_type'			=>	(string)$temp_wp_namespace->post_type,
				'comment_status'	=>	(string)$temp_wp_namespace->comment_status,
				'ping_status'		=>	(string)$temp_wp_namespace->ping_status,
				'post_name'			=>	(string)$temp_wp_namespace->post_name,
				'post_parent'		=>	(int)$temp_wp_namespace->post_parent,
				'menu_order'		=>	(int)$temp_wp_namespace->menu_order,
				'guid'				=>	(string)$item->guid,
				'import_id'			=>	(int)$temp_wp_namespace->post_id,
				'tax_input'			=>	array(),
				'meta_input'		=>	$meta_input,
				'category_slugs'	=>	null,
				'comment_args'		=>	null,
			);

			// Handle categories
			if( $temp_category ) {
				$category_slugs = array();

				foreach( $item[0]->category as $tt ) {
					$category_slugs[(string)$tt->attributes()->domain][] = (string)$tt->attributes()->nicename;
				}

				$args['category_slugs'] = $category_slugs;
			}

			if( $temp_comments ) {
				foreach ($temp_comments as $comment) {
					$comment_args = array(
						'comment_approved'		=>	(int) $comment->comment_approved,
						'comment_author'		=>	(string) $comment->comment_author,
						'comment_author_email'	=>	(string) $comment->comment_author_email,
						'comment_author_IP'		=>	(string) $comment->comment_author_IP,
						'comment_author_url'	=>	(string) $comment->comment_author_url,
						'comment_content'		=>	(string) $comment->comment_content,
						'comment_date'			=>	(string) $comment->comment_date,
						'comment_date_gmt'		=>	(string) $comment->comment_date_gmt,
						'comment_parent'		=>	(int) $comment->comment_parent,
						// 'comment_post_ID'		=>	$post_id,
						'comment_type'			=>	(string) $comment->comment_type,
						'user_id'				=>	(int) $comment->comment_user_id,
					);
					$args['comment_args'][] = $comment_args;
				}
			}

			$this->parsed_posts[] = $args;
		}

		/**
		 *	Importing categories
		 */
		public function import_category( $category ) {
			$cat_info = $category->children($this->namespaces['wp']);
			$cat_original_id = (int) $cat_info->term_id;
			$cat_parent = (string) $cat_info->category_parent;

			if( term_exists( (int) $cat_info->term_id, 'category' ) ) {
				if( !$cat_original_id == 1 ) {	// Trying to rename Uncategorized category
					// echo 'category already exists!';
					$this->import_response['categories'][] = 'category ' . $cat_original_id . ' already exists!';
					return;
				}
			}

			// searching category parent
			if ( empty( $cat_parent ) ) {
				$parent = 0;
			} else {
				$parent = category_exists( $cat_parent );
			}

			$args = array(
				'cat_name'				=>	(string) $cat_info->cat_name,
				'category_description'	=>	(string) $cat_info->category_description,
				'category_nicename'		=>	(string) $cat_info->category_nicename,
				'category_parent'		=>	$parent,
			);

			if( $cat_original_id == 1 ) {
				$args['cat_ID'] = $cat_original_id;
			}

			$cat_temp_ID = wp_insert_category( $args );
			$this->import_response['categories'][] = $cat_temp_ID;

			if( !is_wp_error( $cat_temp_ID ) ) { /* error */ }
		}

		/**
		 * Importing single term
		 *
		 * @param Object $term
		 * @return void
		 */
		public function import_term( $term ) {
			$term_info = $term->children($this->namespaces['wp']);
			$term_original_id = (int) $term_info->term_id;
			$term_name = (string) $term_info->term_name;
			$term_taxonomy = (string) $term_info->term_taxonomy;
			$term_parent = (string) $term_info->term_parent;

			if( term_exists( $term_name, $term_taxonomy ) ) {
				// echo 'term already exists!';
				$this->import_response['terms'][] = 'term ' . $term_name . ' already exists!';
				return;
			}

			// searching term parent
			if ( empty( $term_parent ) ) {
				$parent = 0;
			} else {
				$parent = term_exists( $term_parent, $term_taxonomy );
				if ( is_array( $parent ) ) {
					$parent = $parent['term_id'];
				}
			}

			$args = array(
				'description'	=>	(string) $term_info->term_description,
				'parent'		=>	(int) $parent,
				'slug'			=>	(string) $term_info->term_slug,
			);

			$term_result = wp_insert_term( $term_name , $term_taxonomy, $args );
			$this->import_response['terms'][] = $term_result;

			if( !is_wp_error( $term_result ) ) {

				// Importing term meta
				$this->import_termmeta( $term_result['term_id'], $term_info->termmeta );

				if( 'nav_menu' == $term_taxonomy ) {
					$temp_term_id = $term_result['term_id'];
					$this->synch_nav_menu[$term_original_id] = $temp_term_id;
				}
			}
		}

		public function run_import() {
			add_filter( 'http_request_timeout', array( &$this, 'increase_request_timeout' ) );

			wp_defer_term_counting( true );
			wp_defer_comment_counting( true );

			// do_action( 'rexpansive_importheme_start' );
			$this->check_woocommerce_taxonomies();

			wp_suspend_cache_invalidation( true );

			$this->run_import_all_categories();
			$this->run_import_all_taxonomies();
			$this->run_import_all();

			wp_suspend_cache_invalidation( false );

			wp_defer_term_counting( false );
			wp_defer_comment_counting( false );
		}


		/**
		 * Perform some checks before running the import
		 * to fix import problems with the attributes taxonomies of WooCommerce
		 *
		 * @return void
		 */
		public function check_woocommerce_taxonomies() {
			// first of all, check if some specific WooCommerce functions exists
			if( function_exists( 'wc_get_attribute_taxonomies' ) && function_exists( 'wc_sanitize_taxonomy_name' ) ) {
				global $wpdb;
				foreach( $this->taxonomies as $term ) {
					$term_info = $term->children($this->namespaces['wp']);
					$term_taxonomy = (string) $term_info->term_taxonomy;

					if ( strstr( $term_taxonomy, 'pa_' ) ) {
						if ( ! taxonomy_exists( $term_taxonomy ) ) {
							$attribute_name = wc_sanitize_taxonomy_name( str_replace( 'pa_', '', $term_taxonomy ) );

							// Create the taxonomy
							if ( ! in_array( $attribute_name, wc_get_attribute_taxonomies() ) ) {
								$attribute = array(
									'attribute_label'   => $attribute_name,
									'attribute_name'    => $attribute_name,
									'attribute_type'    => 'select',
									'attribute_orderby' => 'menu_order',
									'attribute_public'  => 0,
								);
								$wpdb->insert( $wpdb->prefix . 'woocommerce_attribute_taxonomies', $attribute );
								delete_transient( 'wc_attribute_taxonomies' );
							}

							// Register the taxonomy now so that the import works!
							register_taxonomy(
								$term_taxonomy,
								apply_filters( 'woocommerce_taxonomy_objects_' . $term_taxonomy, array( 'product' ) ),
								apply_filters( 'woocommerce_taxonomy_args_' . $term_taxonomy, array(
									'hierarchical' => true,
									'show_ui'      => false,
									'query_var'    => true,
									'rewrite'      => false,
								) )
							);
						}
					}
				}
			}
		}

		/**
		 *	Launching the import on all items
		 */
		public function run_import_all($createNewIfAlreadyExists = false) {
			foreach($this->posts as $post) {
				$result = $this->import_post( $post, $createNewIfAlreadyExists );
			}
		}

		/**
		 *	Import only categories and taxonomies
		 */
		public function run_categories_and_taxonomies_import() {
			add_filter( 'http_request_timeout', array( &$this, 'increase_request_timeout' ) );

			wp_defer_term_counting( true );
			wp_defer_comment_counting( true );

			$this->check_woocommerce_taxonomies();

			wp_suspend_cache_invalidation( true );

			$this->run_import_all_categories();
			$this->run_import_all_taxonomies();
			// $this->run_check_all_taxonomies_parents();

			// regenerate hierarchy
			foreach ( get_taxonomies() as $tax ) {
				delete_option( "{$tax}_children" );
				_get_term_hierarchy( $tax );
			}

			wp_suspend_cache_invalidation( false );

			wp_defer_term_counting( false );
			wp_defer_comment_counting( false );
		}

		/**
		 *	Import only categories and taxonomies
		 */
		public function run_taxonomies_import() {
			add_filter( 'http_request_timeout', array( &$this, 'increase_request_timeout' ) );

			wp_defer_term_counting( true );
			wp_defer_comment_counting( true );

			wp_suspend_cache_invalidation( true );

			$this->run_import_all_taxonomies();

			wp_suspend_cache_invalidation( false );

			wp_defer_term_counting( false );
			wp_defer_comment_counting( false );
		}

		/**
		 *	Launching the import specified for an item
		 */
		public function run_single_import( $id ) {	
			$this->import_post( $this->posts[$id] );
		}

		/**
		 *	Single category import (development purpose)
		 */
		public function run_single_import_category( $id ) {
			$this->import_category( $this->categories[$id] );
		}

		/**
		 *	All categories import
		 */
		public function run_import_all_categories() {
			foreach( $this->categories as $category ) {
				$this->import_category( $category );
			}
		}

		/**
		 *	Import the taxonomies
		 */	
		public function run_import_all_taxonomies() {
			foreach( $this->taxonomies as $taxonomy ) {
				$this->import_term( $taxonomy );	
			}
		}

		/**
		 *	Import a single taxonomy (development purpose)
		 */
		public function run_single_import_term( $id ) {
			$this->import_term( $this->taxonomies[$id] );
		}

		/**
		 * Checking terms parents and update them if needed
		 *
		 * @return null
		 */
		public function run_check_all_taxonomies_parents() {
			foreach( $this->taxonomies as $taxonomy ) {
				$this->check_term_parent( $taxonomy );	
			}
		}

		/**
		 * Checking the term and add the parent if needed
		 *
		 * @param Object $term
		 * @return null
		 */
		public function check_term_parent( $term ) {
			$term_info = $term->children($this->namespaces['wp']);
			$term_original_id = (int) $term_info->term_id;
			$term_name = (string) $term_info->term_name;
			$term_taxonomy = (string) $term_info->term_taxonomy;
			$term_parent = (string) $term_info->term_parent;

			// check if the term exists and retrieve the new ID
			if( $term_actual_info = term_exists( $term_name, $term_taxonomy ) ) {
				
				// searching term parent
				if ( empty( $term_parent ) ) {
					$parent = 0;
				} else {
					$parent = term_exists( $term_parent, $term_taxonomy );
					if ( is_array( $parent ) ) {
						$parent = $parent['term_id'];
					}
				}

				if( 0 != $parent ) {

					$args = array(
						'parent'		=>	(int) $parent
					);

					$term_update_result = wp_update_term( $term_actual_info['term_id'], $term_taxonomy, $args );

					if( !is_wp_error( $term_update_result ) ) { }

				}
			}

		}

		/**
		 * Import TermMeta for a term
		 *
		 * @param int $term_id
		 * @param Object $termmetas
		 * @return array
		 */
		public function import_termmeta( $term_id, $termmetas ) {
			foreach( $termmetas as $term_meta ) {
                $term_meta_info = $term_meta->children($this->namespaces['wp']);
                $term_meta_key = (string) $term_meta_info->meta_key;
                $term_meta_value = (string) $term_meta_info->meta_value;

				$result = update_term_meta( (int)$term_id, $term_meta_key, $term_meta_value );
            }
		}

		/**
		 *	Get posts
		 */
		public function get_posts_lists() {
			return $this->posts;
		}

		public function get_parsed_posts_list() {
			return $this->parsed_posts;
		}

		public function get_categories_list_count() {
			return count( $this->categories );
		}

		public function get_taxonomies_list_count() {
			return count( $this->taxonomies );
		}

		/**
		 *	Response function
		 */
		public function get_import_response() {
			return $this->import_response;
		}

		/**
		 *	Get synchronized menu info
		 *
		 */
		public function get_synchronize_menu_info() {
			return $this->synch_nav_menu;
		}

		/**
		 *	Increase request timeout to prevent timeout
		 *
		 */
		function increase_request_timeout( $val ) {
			return 60;
		}

		/**
		 *	Function that imports a media, based on url passed and type
		 */
		private function upload_media_file( $url, $media_type, $post_id = null, $post_data = null ) {
			$tmp = download_url( $url );
			if( is_wp_error( $tmp ) ){
				// download failed, handle error
				return new WP_Error( 'import_file_error', __('Download failed. Remote server did not respond.', 'rexpansive-builder') );
			}

			$post_id = ( isset( $post_id ) ? $post_id : 1 );
			$file_array = array();

			// Set variables for storage
			// fix file filename for query strings
			switch($media_type) {
				case 'image':
					preg_match('/[^\?]+\.(jpg|jpe|jpeg|gif|png|mp4)/i', $url, $matches);

					$file_array['name'] = basename($matches[0]);
					$file_array['tmp_name'] = $tmp;

					$desc = preg_replace('/\.(jpg|jpe|jpeg|gif|png|mp4)/i', '', $file_array['name']);
					break;
				case 'json':
					preg_match('/[^\?]+\.json/i', $url, $matches);
					$file_array['name'] = basename($matches[0]);
					$file_array['tmp_name'] = $tmp;

					$desc = preg_replace('/\.json/i', '', $file_array['name']);
					break;
				default:
					break;
			}

			// If error storing temporarily, unlink
			if ( is_wp_error( $tmp ) ) {
				@unlink($file_array['tmp_name']);
				$file_array['tmp_name'] = '';
			}

			// do the validation and storage stuff
			//$id = media_handle_sideload( $file_array, $post_id, $desc, $post_data );
			$upload_date = $this->get_year_month_media_info( $url );

			$id = wp_upload_bits( basename( $url ), 0, '', $upload_date );

			//$headers = wp_get_http( $url, $id['file'] );
			$response = wp_remote_get($url, array(
				'stream' => true,
				'filename' => $id['file']
			));

			if ( is_wp_error( $response ) ) {
				@unlink( $upload['file'] );
				return new WP_Error( 'import_file_error', __('Remote server did not respond', 'rexpansive-builder') );
			}

			$code = (int) wp_remote_retrieve_response_code( $response );

			if ( $code !== 200 ) {
				@unlink( $upload['file'] );
				return new WP_Error( 'import_file_error', sprintf(__('Remote server returned %1$d %2$s for %3$s', 'rexpansive-builder'),$code,get_status_header_desc( $code ),$url));
			}

			// If error storing permanently, unlink
			if ( is_wp_error($id) ) {
				@unlink($file_array['tmp_name']);
				return $id;
			}

			return $id;
		}

		private function get_year_month_media_info( $url ) {
			preg_match('/\d{4}\/\d{2}/', $url, $matches);
			return $matches[0];
		}

		private function replace_content_absolute_urls( $data = null ) {
			$pattern = '/' . preg_quote( $this->source_content_info->base_site_url, '/' ) . '\(\D+\/)*/wp-content\/uploads\/' . '/';
			$replacement = content_url() . '/uploads/';
			return preg_replace( $pattern, $replacement, $data );
		}

	}
}