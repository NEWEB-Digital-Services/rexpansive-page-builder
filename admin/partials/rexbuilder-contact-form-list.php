<?php

/**
 * Provide a contact form list
 *
 * This file is used to view a contact form list with the ready shortcodes
 *
 * @link       htto://www.neweb.info
 * @since      1.1.3
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">
	<h2><?php _e( 'Contact forms', 'rexpansive-builder' ); ?></h2>
    <h2 class="nav-tab-wrapper"><?php _e( 'List', $this->plugin_name ); ?></h2>

    <?php
    if ( Rexbuilder_Utilities::check_plugin_active( 'contact-form-7/wp-contact-form-7.php' ) ) {
        // WP_Query arguments
        $args = array(
            'post_type'              => array( 'wpcf7_contact_form' ),
            'post_status'            => array( 'publish' ),
            'posts_per_page'         => '-1',
        );

        // The Query
        $query = new WP_Query( $args );
        if ( $query->have_posts() ) {
            ?><table class="wp-list-table widefat fixed striped pages"><?php
            while ( $query->have_posts() ) {
                $query->the_post();
                $edit_url = add_query_arg(
                    array(
                        'page' => 'wpcf7',
                        'post' => get_the_ID(),
                        'action' => 'edit'
                    ), admin_url()
                );
                ?><tr>
                    <td>
                        <a class="row-title" href="<?php echo $edit_url; ?>" title="<?php _e( 'Edit', 'rexpansive-builder' ); ?> “<?php the_title(); ?>”"><?php the_title(); ?></a>
                    </td>
                    <td>
                        <a class="rxcf7-get_shortcode" href="#" data-cfid="<?php echo get_the_ID(); ?>"><?php _e( 'Get shortcode', 'rexpansive-builder' ); ?></a>
                    </td>
                </tr><?php
            }
            ?></table><?php
        } else {
            ?><p><?php _e( 'Insert or import some CF7 forms.', 'rexpansive-builder' ); ?></p><?php
        }

        wp_reset_postdata();
    } else {
        ?>
        <p class="description"><?php _e( 'Contact Form 7 plugin is deactivated. Please active it to view the forms.', 'rexpansive-builder' ); ?></p>
        <?php
    }
    ?>
</div>
<script>
(function( $ ) {
    'use strict';
    $(document).ready(function () {
        $(document).on('click', '.rxcf7-get_shortcode', function(e) {
            e.preventDefault();
            var cfid = $(this).attr('data-cfid');
        });
    });
})( jQuery );
</script>