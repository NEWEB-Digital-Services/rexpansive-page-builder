<div class="rexlive-block-toolbox bottom-tools" data-block_type="{%=block.block_type%}">
    <div class="rexlive-bottom-block-tools bl_d-flex bl_jc-c">
        <div class="bl_d-iflex bl_ai-c block-toolBox__fast-configuration">
            <div class="tool-button--double-icon--wrap{% if(block.block_type != 'image') { %} tool-button--hide{% } %}">
                <div class="tool-button tool-button--inline edit-block-image tippy">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-image-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block image background -->

            <div class="tool-button tool-button--inline tool-button--block-bottom--fix edit-block-image-position{% if(block.block_type != 'image') { %} tool-button--hide{% } %}">
                <?php Rexbuilder_Utilities::get_icon('#C005-Layout'); ?>
            </div>

            <div class="tool-button--double-icon--wrap tool-button--hide">
                <input class="spectrum-input-element" type="text" name="edit-block-color-background" value="">
                <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-color-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block color background -->

            <div class="tool-button--double-icon--wrap tool-button--hide">
                <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value="">
                <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-overlay-color">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block overlay color -->

            <div class="tool-button--double-icon--wrap{% if(block.block_type != 'video') { %} tool-button--hide{% } %}">
                <div class="tool-button tool-button--inline edit-block-video-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-block-video-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block Video background -->
        </div>
    </div>
</div>