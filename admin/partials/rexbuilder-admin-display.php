<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       htto://www.neweb.info
 * @since      1.0.0
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">
	<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
	<h2 class="nav-tab-wrapper"><?php _e( 'Settings', $this->plugin_name ); ?></h2>
	<form action="options.php" method="post" name="rexbuilder_options">
		<?php
			$options = get_option( $this->plugin_name . '_options' );

			if( isset( $options['post_types'] ) ) :
				$post_to_activate = $options['post_types'];
			endif;
			$animation = $options['animation'];

			settings_fields( $this->plugin_name . '_options' );
			do_settings_sections( $this->plugin_name . '_options' );
		?>
		<table class="form-table">
			<tr>
				<th><?php _e( 'Type of content', $this->plugin_name ); ?></th>
				<td>
				<?php
					$args = array(
						'public'	=>	true,
					);

					$post_types = get_post_types($args);
					unset( $post_types['attachment'], $post_types['revision'], $post_types['nav_menu_item'], $post_types['mediapage'] );

					foreach( $post_types as $post_type ) :
					?>
						<label for="rex-post-type-<?php echo $post_type; ?>">
							<input type="checkbox" id="rex-post-type-<?php echo $post_type; ?>" 
								name="<?php echo $this->plugin_name; ?>_options[post_types][<?php echo $post_type; ?>]" 
								value="1"
								<?php if( isset( $post_to_activate[$post_type] ) ) : 	// NB: isset don't intercept an index with a null value
									checked( $post_to_activate[$post_type], 1 ); 
									endif;
								?> />
							<span><?php echo $post_type; ?></span>
						</label><br />
					<?php
					endforeach;
				?>
					<p class="description indicator-hint">
						<?php _e( 'Select for which types of content enable Rexpansive Builder' , $this->plugin_name ); ?>
					</p>
				</td>
			</tr>
			<tr>
				<th><?php _e( 'Animations ON/OFF', $this->plugin_name ); ?></th>
				<td>
					<label for="rex-enable-animation">
						<input type="checkbox" id="rex-enable-animation" 
							name="<?php echo $this->plugin_name; ?>_options[animation]" value="1" 
							<?php checked( $animation, 1 ); ?> />
						<span><?php _e( 'ON / OFF', $this->plugin_name ); ?></span>
					</label>
				</td>
			</tr>
		</table>
	<?php submit_button( 'Save', 'primary', 'submit', TRUE ); ?>
	</form>
</div>