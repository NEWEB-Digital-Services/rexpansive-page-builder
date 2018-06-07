<?php
/**
 *	Classes required to aggregation
 */

if ( ! class_exists( 'Rexpansive_Classic_Import_Utilities' ) ) {
	class Rexpansive_Classic_Import_Utilities {
		/**
		 *	Function to handle the upload of the XML/JSON files to the import process
		 */
		public static function upload_media_file( $url, $media_type, $post_id = null, $post_data = null ) {
			$tmp = download_url( $url );
			if( is_wp_error( $tmp ) ){
				// download failed, handle error
			}

			$post_id = ( isset( $post_id ) ? $post_id : 1 );
			$file_array = array();

			// Set variables for storage
			// fix file filename for query strings
			switch($media_type) {
				case 'image':
					preg_match('/[^\?]+\.(jpg|jpe|jpeg|gif|png|ico)/i', $url, $matches);
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
			$file_info = wp_upload_bits( $file_array['name'], null, Rexpansive_Classic_Import_Utilities::read_file_content( $file_array['tmp_name'] ) );

			// If error storing permanently, unlink
			if ( $file_info['error'] ) {
				@unlink($file_array['tmp_name']);
				return $file_info;
			}

			return $file_info;
		}

		/**
		 *	Function to remove a file; usefull to maintain clean the upload directory after the import
		 */
		public static function remove_media_file( $url ) {
			unlink( $url );
		}

        /**
         *
         */
        public static function import_post( $args ) {
			// if( !post_exists( $args['post_title'], '', $args['post_date'] ) ) {
			if( false === get_post_status( $args['import_id'] ) ) {

				if( $args['post_type'] == 'attachment' && $args['post_status'] != 'trash') {

					$result = Rexpansive_Classic_Import_Utilities::upload_media_file( $args['guid'], 'image' );

					$attachment_mime_type = wp_check_filetype( $result['file'] );

					$args['guid'] = $result['url'];
					$args['post_mime_type'] = $attachment_mime_type['type'];

					$post_id = wp_insert_attachment( $args, $result['file'] );
					$data = wp_generate_attachment_metadata( $post_id, $result['file'] );
					wp_update_attachment_metadata( $post_id, $data );

				} elseif( $args['post_type'] == 'nav_menu_item' ) {
					$post_id = wp_insert_post( $args );
				} else {
					//$args['post_content'] = $this->replace_content_absolute_urls( $args['post_content'] );
					$post_id = wp_insert_post( $args );
				}

				// Handle categories
				if( $args['category_slugs'] ) {
				 	foreach( $args['category_slugs'] as $key => $cs ) {
				 		$tt_result = wp_set_object_terms( $post_id, $cs, $key );
				 	}
				}

				// Handle comments
				if( $args['comment_args'] ) {
				 	foreach ($args['comment_args'] as $comment_args) {
						$comment_args['comment_post_ID'] = $post_id;
						$comment_id = wp_insert_comment( $comment_args );
				 	}
				}

				return $post_id;

			} else {
				return 'post already exists!';
				// $this->import_response['posts'][] = 'post ' . $args['import_id'] . ' already exists!';
			}
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