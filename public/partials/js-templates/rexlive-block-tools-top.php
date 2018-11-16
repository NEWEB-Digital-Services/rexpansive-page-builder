<div class="rexlive-block-toolbox top-tools">
    <div class="rexlive-top-block-tools">
        <div class="block-toolBox__placeholder">
            <div style="visibility:hidden;display:inline-block;">
                <div class="el-size-viewer tool-indicator"></div>
            </div>
            <!-- <div class="tool-button tool-button--inline drag-to-section tippy" data-tippy-content="<?php //_e('Power Drag','rexpansive'); ?>">
                <?php //Rexbuilder_Utilities::get_icon('#B012-Full-Height'); ?>
            </div> -->
        </div>

        <div class="bl_d-iflex bl_ai-c block-toolBox__editor-tools">
            <div class="tool-button tool-button--inline edit-block-content">
                <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
            </div>
            <div class="tool-button tool-button--inline builder-edit-slider">
                <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
            </div>
            <div class="tool-button tool-button--inline edit-block-content-position tool-button--hide">
                <?php Rexbuilder_Utilities::get_icon('#C005-Layout'); ?>
            </div>
        </div>

        <div class="bl_d-iflex bl_ai-c block-toolBox__config-tools">
            
            <div class="tool-button tool-button--inline btn-flat builder-copy-block tippy" data-tippy-content="<?php _e('Copy block', 'rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
            </div>

            <div class="tool-button-floating block-toolBox__config-list">
				<div class="tool-button" data-tippy-content="<?php _e('Block settings', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>					
                </div>
                
				<div class="tool-button_list">
                    <div class="tool-button tool-button--inline tool-button_list--item builder-edit-block tippy" data-tippy-content="<?php _e('Block settings','rexpansive'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>
                    </div><!-- // settings -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item{% if(block.block_type == 'image') { %} tool-button--hide{% } %} tippy" data-tippy-content="<?php _e('Background Image','rexpansive'); ?>">
                        <div class="tool-button tool-button--inline edit-block-image tippy">
                            <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                        </div>
                    </div><!-- // Change Block image background -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Background Color','rexpansive'); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-block-color-background" value="">
                    </div><!-- // Change Block color background -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Overlay','rexpansive'); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value="">
                    </div><!-- // Change Block overlay color -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item{% if(block.block_type == 'video') { %} tool-button--hide{% } %} tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
                        <div class="tool-button tool-button--inline edit-block-video-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                        </div>
                    </div><!-- // Change Block Video background -->

                    <div class="tool-button tool-button--inline tool-button_list--item builder-edit-slider tippy" data-tippy-content="<?php _e('RexSlider','rexpansive'); ?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
                    </div>

                </div>
            </div>

            <div class="tool-button tool-button--inline builder-delete-block waves-effect tippy" data-tippy-content="<?php _e('Delete block', 'rexspansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
            </div>
        </div>
    </div>
    <div class="tool-button tool-button--black builder-delete-block waves-effect tippy" data-tippy-content="<?php _e('Delete block', 'rexspansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </div>
</div>