<?php
/**
 * @link       htto://www.neweb.info
 * @since      2.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 */
/**
 * Class with some utilities the import of an XML file
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/includes
 * @author     Neweb <info@neweb.info>
 */

if ( ! class_exists( 'Rexbuilder_Import_Utilities' ) ) {
	class Rexbuilder_Import_Utilities {
		/**
		 *	Function to handle the upload of the XML/JSON files to the import process
		 */
		public static function upload_media_file( $url, $media_type, $post_id = null, $post_data = null ) {
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
					preg_match('/[^\?]+\.(jpg|jpe|jpeg|gif|png|ico|mp4)/i', $url, $matches);
					$file_array['name'] = basename($matches[0]);
					$file_array['tmp_name'] = $tmp;

					$desc = preg_replace('/\.(jpg|jpe|jpeg|gif|png|ico)/i', '', $file_array['name']);
					break;
				case 'json':
					preg_match('/[^\?]+\.json/i', $url, $matches);
					$file_array['name'] = basename($matches[0]);
					$file_array['tmp_name'] = $tmp;

					$desc = preg_replace('/\.json/i', '', $file_array['name']);
					break;
				case 'xml':
					preg_match('/[^\?]+\.xml/i', $url, $matches);
					$file_array['name'] = basename($matches[0]);
					$file_array['tmp_name'] = $tmp;

					$desc = preg_replace('/\.xml/i', '', $file_array['name']);
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
			$file_info = wp_upload_bits( $file_array['name'], null, self::read_file_content( $file_array['tmp_name'] ) );

			// If error storing permanently, unlink
			if ( $file_info['error'] ) {
				@unlink($file_array['tmp_name']);
				return $file_info;
			}

			return $file_info;
		}

		/**
		 *	Function that imports a media, based on url passed and type
		 */
		public static function upload_media_file_from_url( $url, $media_type, $post_id = null, $post_data = null ) {
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
			$upload_date = self::get_year_month_media_info( $url );

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

		/**
		 * Get media month and year from media url
		 * @param  string $url file url
		 * @return string      media year and month
		 * @since 2.0.1
		 */
		private static function get_year_month_media_info( $url ) {
			preg_match('/\d{4}\/\d{2}/', $url, $matches);
			return $matches[0];
		}

		/**
		 *	Function to remove a file; usefull to maintain clean the upload directory after the import
		 */
		public static function remove_media_file( $url ) {
			unlink( $url );
		}

        /**
		 *	Function that sets the arguments for create a post based on the XML stored
		 */
		public static function import_post( $item, $namespaces ) {
			$temp_wp_namespace = $item->children( $namespaces['wp'] );
			$temp_content_namespace = $item->children( $namespaces['content'] );
			$temp_excerpt_namespace = $item->children( $namespaces['excerpt'] );

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
					$result = self::upload_media_file_from_url( $args['guid'], 'image' );

					if ( ! is_wp_error( $result ) ) {
						$attachment_mime_type = wp_check_filetype( $result['file'] );

						$args['guid'] = $result['url'];
						$args['post_mime_type'] = $attachment_mime_type['type'];

						$post_id = wp_insert_attachment( $args, $result['file'] );
						$data = wp_generate_attachment_metadata( $post_id, $result['file'] );
						wp_update_attachment_metadata( $post_id, $data );

						$response = array(
							'msg' => 'media ' . $post_id . ' correctly imported',
							'post_id' => $post_id, 
							'args' => $args 
						);
					} else {
						// log error
						if ( true === WP_DEBUG ) {
							error_log( print_r( $result, true ) );
						}

						$response = array(
							'msg' => 'media ' . $post_id . ' upload error',
							'post_id' => null, 
							'args' => $args 
						);
					}
				} else {
					$post_id = wp_insert_post( $args );
					$response = array( 
						'msg' => 'post ' . $post_id . ' correctly imported', 
						'post_id' => $post_id, 
						'args' => $args 
					);
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
				// echo 'post already exists!';
				$response = array(
					'msg' => 'post ' . $args['import_id'] . ' already exists',
					'post_id' => null, 
					'args' => $args 
				);
			}

			return $response;
		}

		/**
		*	read a file with correct WP method
		*
		*	@param str $file - url of the file to read
		*/
		public static function read_file_content( $file ) {
			global $wp_filesystem;

			if (empty($wp_filesystem)) {
				require_once ABSPATH . '/wp-includes/pluggable.php';
				require_once (ABSPATH . '/wp-admin/includes/file.php');
				WP_Filesystem();
			}

			$content = $wp_filesystem->get_contents( $file );
			return $content;
		}
	}
}