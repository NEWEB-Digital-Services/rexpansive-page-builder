<?php
/**
 * Modal for RexButton editing
 *
 * @since x.x.x
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials/modals
 */

defined('ABSPATH') or exit;
?>
<div class="rex-modal-wrap">
	<div id="rex-wpcf7-content-adder" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable setting-edited">
		<!-- Closing button -->
        <div class="tool-button tool-button--black rex-cancel-button tool-button--close tippy" data-tippy-content="Cancel" value="" tabindex="0">
            <span class="rex-button"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></span>
        </div>
        <!-- General wrap -->
        <div class="modal-content">
        	<?php include 'rexlive-loader-modal.php'; ?>
        	<!-- Add text field -->
        	<div class="bl_modal-row">
        		<div class="rexelement-cont_row10"> <!-- Cambiare i nomi? -->
        			<div class="rexelement-count-colum_accord">
                        <span class="rex-accordion--toggle">                                
                            <div class="rexelement-upd-accord_button rex-add-text-field"><?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?></div>
                        </span>
                    </div>
                    <div class="rexelement-count-column_1">
                    	<!-- Text field -->
                    </div>
        		</div>
        	</div>
        </div>
	</div>
</div>
<!-- Add Form Content -->