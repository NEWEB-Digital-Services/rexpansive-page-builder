<?php
/**
 * Print the markup of the modals of the builder
 *
 * @link       htto://www.neweb.info
 * @since      1.0.10
 *
 * @package    Rexbuilder
 * @subpackage Rexbuilder/admin/partials
 */

defined('ABSPATH') or exit;

$tool_button_classes_right = 'tool-button tool-button--flat';
$tool_button_classes = 'tool-button';
?>

<script type="text/x-tmpl" id="tmpl-toolbox-block">
<div class="rexlive-block-toolbox top-tools">
    <div class="rexlive-top-block-tools">
        <div style="visibility:hidden;">
            <div class="el-size-viewer tool-indicator"></div>
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

            <div class="tool-button-floating">
				<div class="tool-button builder-edit-block tippy" data-tippy-content="<?php _e('Block settings', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
                </div>
                
				<div class="tool-button_list">

                    <div class="tool-button--double-icon--wrap tool-button_list--item{% if(block.block_type == 'image') { %} tool-button--hide{% } %}">
                        <div class="tool-button tool-button--inline edit-block-image tippy">
                            <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                        </div>
                    </div><!-- // Change Block image background -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item">
                        <input class="spectrum-input-element" type="text" name="edit-block-color-background" value="">
                    </div><!-- // Change Block color background -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item">
                        <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value="">
                    </div><!-- // Change Block overlay color -->

                    <div class="tool-button--double-icon--wrap tool-button_list--item{% if(block.block_type == 'video') { %} tool-button--hide{% } %}">
                        <div class="tool-button tool-button--inline edit-block-video-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                        </div>
                    </div><!-- // Change Block Video background -->

                    <div class="tool-button tool-button--inline tool-button_list--item builder-edit-slider">
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
</script>

<script type="text/x-tmpl" id="tmpl-toolbox-block-bottom">
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
</script>

<script type="text/x-tmpl" id="tmpl-toolbox-block-floating">
<div class="rexlive-block-toolbox floating-tools">
    <div class="rexlive-floating-block-tools">
        <div class="el-size-viewer tool-indicator"></div>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-video-vimeo">
    <div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block">
        <iframe src="{%=video.url%}" width="640" height="360" frameborder="0" allow="autoplay"  webkitallowfullscreen mozallowfullscreen allowfullscreen>
        </iframe>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-video-mp4">
    <div class="rex-video-wrap" data-rex-video-width="{%=video.width%}" data-rex-video-height="{%=video.height%}">
        <video class="rex-video-container" preload autoplay loop muted>
            <source type="video/mp4" src="{%=video.url%}">
        </video>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-video-youtube">
    <div class="rex-youtube-wrap" data-property="{videoURL:'{%=video.url%}',containment:'self',startAt:0,mute:'{%=video.audio%}',autoPlay:true,loop:true,opacity:1,showControls:false, showYTLogo:false}">
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-video-toggle-audio">
    <div class="rex-video-toggle-audio">
        <div class="rex-video-toggle-audio-shadow">
        </div>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-overlay-block-div">
    <div class="responsive-block-overlay" style="background-color:{%=overlay.color%}">
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-overlay-section-div">
    <div class="responsive-section-overlay" style="background-color:{%=overlay.color%}">
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-photoswipe-block">
    <figure class="pswp-figure" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
        <a class="pswp-item" href="{%=image.link%}" itemprop="contentUrl" data-size="{%=image.width%}x{%=image.height%}">
            <div class="pswp-item-thumb" data-thumb-image-type="{%=image.type%}" data-thumburl="{%=image.link%}" itemprop="thumbnail">
            </div>

        </a>
        <figcaption class="pswp-item-caption" itemprop="caption description">
        </figcaption>
    </figure>
</script>

<script type="text/x-tmpl" id="tmpl-link-block">
    <a class="element-link hovered" href="{%=link.url%}" title="{%=link.url%}">
    </a>
</script>

<script type="text/x-tmpl" id="tmpl-navigator-item">
    <li>
        <a href="#{%=navigator.sectionID%}" class="vertical-nav-link not-smooth-anchor-scroll" data-number="{%=navigator.number%}">
            <span class="dot-cont">
                <span class="dot"></span>
            </span>
            <p class="label white-black">{%=navigator.sectionName%}</p>
        </a>
	</li>
</script>

<script type="text/x-tmpl" id="tmpl-block-resize-handles">
    <div class="ui-resizable-handle ui-resizable-e" data-axis="e" id="{%=block.rexID%}_handle_e">
        <span class="circle-handle circle-handle-e" data-axis="e">
        </span>
    </div>
    <div class="ui-resizable-handle ui-resizable-s" data-axis="s" id="{%=block.rexID%}_handle_s">
        <span class="circle-handle circle-handle-s" data-axis="s">
        </span>
    </div>
    <div class="ui-resizable-handle ui-resizable-w" data-axis="w" id="{%=block.rexID%}_handle_w">
        <span class="circle-handle circle-handle-w" data-axis="w">
        </span>
    </div>
    <div class="ui-resizable-handle ui-resizable-se" data-axis="se" id="{%=block.rexID%}_handle_se">
        <span class="circle-handle circle-handle-se" data-axis="se">
        </span>
    </div>
    <div class="ui-resizable-handle ui-resizable-sw" data-axis="sw" id="{%=block.rexID%}_handle_sw">
        <span class="circle-handle circle-handle-sw" data-axis="sw">
        </span>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-block-drag-handle">
    <div class="rexlive-block-drag-handle"></div>
</script>

<script type="text/x-tmpl" id="tmpl-new-block">
    <div id="block_{%=block.id%}" class="perfect-grid-item grid-stack-item w{%=block.gsWidth%} rex-text-editable" data-height="{%=block.backendHeight%}" data-width="{%=block.backendWidth%}" data-row="{%=block.backendY%}" data-col="{%=block.backendX%}" data-gs-height="{%=block.gsHeight%}" data-gs-width="{%=block.gsWidth%}" data-gs-y="{%=block.gsY%}" data-gs-x="{%=block.gsX%}" data-rexbuilder-block-id="{%=block.rexID%}">
        <div id="block_{%=block.id%}-builder-data" class="rexbuilder-block-data" data-id="block_{%=block.id%}" data-rexbuilder_block_id="{%=block.rexID%}" data-type="" data-size_x="{%=block.backendWidth%}" data-size_y="{%=block.backendHeight%}" data-row="{%=block.backendY%}" data-col="{%=block.backendX%}" data-gs_start_h="{%=block.gsHeight%}" data-gs_width="{%=block.gsWidth%}" data-gs_height="{%=block.gsHeight%}" data-gs_y="{%=block.gsY%}" data-gs_x="{%=block.gsX%}" data-color_bg_block="" data-image_bg_block="" data-id_image_bg_block="" data-video_bg_id="" data-video_mp4_url="" data-video_bg_url="" data-video_bg_url_vimeo="" data-type_bg_block="" data-image_size="" data-photoswipe="" data-linkurl="" data-block_custom_class="" data-block_padding="" data-overlay_block_color="" data-zak_background="" data-zak_side="" data-zak_title="" data-zak_icon="" data-zak_foreground="" data-block_animation="fadeInUpBig" data-video_has_audio="" data-block_has_scrollbar="false" data-block_dimensions_live_edited="" data-block_height_masonry="" data-block_height_fixed="" data-block_height_calculated="{%=block.gsHeight%}"></div>
        <div class="grid-stack-item-content">
            <div class="grid-item-content rex-flexbox" style="background-color:rgba(0, 0, 0, 0);">
                <div class="responsive-block-overlay" style="background-color:rgba(0, 0, 0, 0);">
                    <div class="rex-custom-scrollbar rex-custom-position">
                        <div class="text-wrap">
                            <p><br></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-new-slider-wrap">
    <div class="rex-slider-wrap rex-slider--{%=slider.numberSlides%}-slides" data-slider-id="{%=slider.id%}" data-rex-slider-animation="{%=slider.animation%}" data-rex-slider-prev-next="{%=slider.prevnext%}" data-rex-slider-dots="{%=slider.dots%}">
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-new-slider-element">
    <div class="rex-slider-element">
        <div class="rex-slider-video-wrapper"></div>
        <div class="rex-slider-element-title"></div>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-new-slider-element-link">
    <a class="rex-slider-element-link" href="{%=link.url%}">
    </a>
</script>

<script type="text/x-tmpl" id="tmpl-add-new-section-button">
<div class="bl_d-flex bl_jc-c add-new-section__wrap">
    <div class="tool-button tool-button--inline tool-button--flat tool-button--add-big add-new-section" data-new-row-position="bottom">
        <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-toolbox-section">
    <div class="section-toolBox">
        <div class="tools">
            
            <div class="bl_d-flex bl_ai-c tools-area tool-area--side">
                <div class="switch-toggle switch-live">
                    <input type="radio" class="edit-row-width" data-section_width="full" id="row-dimension-full-{%=section.rexID%}" name="row-dimension-{%=section.rexID%}" value="100%">
                    <label class="tippy" data-tippy-content="<?php _e('Full','rexpansive'); ?>" for="row-dimension-full-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span></label>
                    <input type="radio" class="edit-row-width" data-section_width="boxed" id="row-dimension-boxed-{%=section.rexID%}" name="row-dimension-{%=section.rexID%}" value="80%" checked>
                    <label class="tippy" data-tippy-content="<?php _e('Boxed','rexpansive'); ?>" for="row-dimension-boxed-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span></label>
                </div><!-- // Row dimension -->

                <div class="switch-toggle switch-live">
                    <input type="radio" class="edit-row-layout" data-section_layout="masonry" id="row-layout-masonry-{%=section.rexID%}" name="row-layout-{%=section.rexID%}" value="masonry">
                    <label class="tippy" data-tippy-content="<?php _e('Masonry','rexpansive'); ?>" for="row-layout-masonry-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B010-Masonry'); ?></span></label>
                    <input type="radio" class="edit-row-layout" data-section_layout="fixed" id="row-layout-fixed-{%=section.rexID%}" name="row-layout-{%=section.rexID%}" value="fixed" checked>
                    <label class="tippy" data-tippy-content="<?php _e('Grid','rexpansive'); ?>" for="row-layout-fixed-{%=section.rexID%}"><span><?php Rexbuilder_Utilities::get_icon('#B011-Grid'); ?></span></label>
                </div><!-- // Row layout -->

                <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline collapse-grid tippy" data-tippy-content="<?php _e('Collapse','rexpansive'); ?>">
                    <?php Rexbuilder_Utilities::get_icon('#B006-Collapse'); ?>
                </div>
            </div>
            <!-- // right area: row dimension -->

            <div class="bl_d-flex bl_ai-c tools-area tool-area--center tippy" data-tippy-content="<?php _e('Insert Image','rexpansive'); ?>">
                <div class="tool-button tool-button--flat tool-button--inline tool-button__image--flat add-new-block-image">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>

                <div class="tool-button tool-button--flat tool-button__text--flat add-new-block-text tool-button--inline">
                    <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
                </div>

                <div class="tool-button tool-button--flat tool-button--inline tool-button__video--flat add-new-block-video">
                    <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                </div>

                <div class="tool-button-floating">
                    <div class="<?php echo $tool_button_classes_right; ?> active">
                        <?php Rexbuilder_Utilities::get_icon('#Z009-More'); ?>
                    </div>
        
                    <div class="tool-button_list">        
                        <div class="tool-button add-new-block-slider tool-button_list--item tippy" data-tippy-content="<?php _e('Slider','rexpansive'); ?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
                        </div>

                        <div class="tool-button tippy add-new-section tool-button_list--item" data-tippy-content="<?php _e('Slider','rexpansive'); ?>" data-new-row-position="after">
                            <?php Rexbuilder_Utilities::get_icon('#B016-New-Adjacent-Row'); ?>
                        </div>
                    </div>
                </div>
            </div><!-- // insert element -->

            <div class="bl_d-flex bl_ai-c bl_jc-fe tools-area tool-area--side">
		
                <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__fast-configuration">

                    <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Image','rexpansive'); ?>">
                        <div class="<?php echo $tool_button_classes; ?> tool-button--inline edit-row-image-background tippy" data-tippy-content="" value="">
                            <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                        </div>
                        <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-image-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                        </div>
                    </div><!-- // Change Row background image -->

                    <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Color','rexpansive'); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-row-color-background" value="">
                        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                        <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-color-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                        </div>
                    </div><!-- // Change Row background color -->

                    <div class="tool-button--double-icon--wrap tool-button--distance-fix tool-button--hide tool-button--opacity-preview tool-button--model-hide tippy" data-tippy-content="<?php _e('Overlay','rexpansive'); ?>">
                        <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value="">
                        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                        <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                        <div class="tool-button tool-button--inline tool-button--double-icon tool-button--deactivate deactivate-row-overlay-color">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                        </div>
                    </div><!-- // Change Row overlay color -->

                    <div class="tool-button--double-icon--wrap tool-button__video-fast tool-button--hide tool-button--distance-fix tool-button--model-hide tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
                        <div class="<?php echo $tool_button_classes; ?> tool-button--inline tool-button--flat edit-row-video-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                        </div>
                        <div class="tool-button tool-button--inline tool-button--deactivate tool-button--double-icon deactivate-row-video-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                        </div>
                    </div>
                    <!-- // Add background video -->

                    <div class="tool-button tool-button--flat update-model-button tool-button--distance-fix--small locked tippy" data-tippy-content="<?php _e('Model','rexpansive'); ?>">
                        <span class="unlocked-icon"><?php Rexbuilder_Utilities::get_icon('#B015-UnClosed'); ?></span>
                        <span class="locked-icon"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
                    </div>

                </div><!-- // fast configuration elements -->

                <div class="bl_d-iflex bl_ai-c row-toolBox__tools row-toolBox__standard-configuration">
                    <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-copy-row tippy" data-tippy-content="<?php _e('Copy row', 'rexpansive');?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
                    </div>
                    
                    <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-move-row tippy" data-tippy-content="<?php _e('Move row', 'rexpansive');?>">
                        <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
                    </div>

                    <div class="tool-button-floating tool-button--model-hide">
                        <div class="<?php echo $tool_button_classes_right; ?> builder-section-config tool-button--flat--distance-fix tippy" data-tippy-content="<?php _e('Row settings', 'rexpansive');?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
                        </div>
                        <div class="tool-button_list">
                            
                            <div class="tool-button tool-button--full tool-button_list--item edit-background-section tippy tool-button--hide">
                                <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                            </div>

                            <div class="tool-button tool-button--full tool-button_list--item edit-row-image-background tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
                                <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                            </div>

                            <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Background Color','rexpansive'); ?>">
                                <input class="spectrum-input-element" type="text" name="edit-row-color-background">
                                <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                                <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                            </div><!-- // Change Row color background -->

                            <div class="tool-button--double-icon--wrap tool-button_list--item tippy" data-tippy-content="<?php _e('Overlay','rexpansive'); ?>">
                                <input class="spectrum-input-element" type="text" name="edit-row-overlay-color">
                                <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview"></div>
                                <div class="tool-button tool-button--inline tool-button--empty tool-button--color-preview-texture"></div>
                            </div>
                            <!-- // Change Row overlay color -->

                            <div class="tool-button edit-row-video-background tool-button_list--item tippy" data-tippy-content="<?php _e('Background Video','rexpansive'); ?>">
                                <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                            </div>
                            
                            <div class="tool-button open-model tool-button_list--item tippy" data-tippy-content="<?php _e('Model','rexpansive'); ?>">
                                <?php Rexbuilder_Utilities::get_icon('#B005-RexModel'); ?>
                            </div>
                        </div>
                    </div>

                    <div class="<?php echo $tool_button_classes_right; ?> tool-button--inline builder-delete-row tippy" data-tippy-content="<?php _e('Delete row', 'rexspansive');?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                    </div>
                    <!-- // remove section -->
                </div><!-- // clone, move, settings -->
            </div>
            <!-- // right area -->
        </div>
    </div>
    <div class="section-toolBoox__highlight"></div>
    <div class="section-block-noediting-ui">
        <div class="no-editing--indicator bl_d-flex bl_jc-c bl_ai-c">
            <span class="call-update-model-button"><?php Rexbuilder_Utilities::get_icon('#B014-Closed'); ?></span>
        </div>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-new-section">
    <section class="rexpansive_section empty-section" data-rexlive-section-id="{%=section.rexID%}" data-rexlive-section-name="">
        <div class="section-data" style="display: none;" data-section_name="" data-type="perfect-grid" data-color_bg_section="" data-color_bg_section_active="true"
            data-dimension="{%=section.dimension%}" data-image_bg_section_active="true" data-image_bg_section="" data-id_image_bg_section=""
            data-video_bg_url_section="" data-video_bg_id_section="" data-video_bg_url_vimeo_section="" data-full_height="{%=section.fullHeight%}"
            data-block_distance="{%=section.blockDistance%}" data-layout="{%=section.layout%}" data-responsive_background="" data-custom_classes=""
            data-section_width="{%=section.sectionWidth%}" data-row_separator_top="{%=section.rowSeparatorTop%}" data-row_separator_bottom="{%=section.rowSeparatorBottom%}"
            data-row_separator_right="{%=section.rowSeparatorRight%}" data-row_separator_left="{%=section.rowSeparatorLeft%}" data-margin=""
            data-row_margin_top="" data-row_margin_bottom="" data-row_margin_right="" data-row_margin_left="" data-row_active_photoswipe=""
            data-row_overlay_color="" data-row_overlay_active="false" data-rexlive_section_id="{%=section.rexID%}" data-row_edited_live="true"></div>
        <div class="responsive-overlay">
            <div class="rex-row__dimension {%=section.dimensionClass%}">
                <div class="perfect-grid-gallery grid-stack grid-stack-row" data-separator="{%=section.blockDistance%}" data-layout="{%=section.layout%}"
                    data-full-height="{%=section.fullHeight%}" data-row-separator-top="{%=section.rowSeparatorTop%}" data-row-separator-right="{%=section.rowSeparatorRight%}"
                    data-row-separator-bottom="{%=section.rowSeparatorBottom%}" data-row-separator-left="{%=section.rowSeparatorLeft%}">
                    <div class="perfect-grid-sizer"></div>
                </div>
            </div>
        </div>
    </section>
</script>

<script type="text/x-tmpl" id="tmpl-div-block-grid">
    <div class="rexpansive-block-grid"></div>
</script>

<script type="text/x-tmpl" id="tmpl-div-block-section-toolbox">
    <div class="rexpansive-block-section-toolbox"></div>
</script>

<script type="text/x-tmpl" id="tmpl-div-lock-section">
    <div class="rexpansive-lock-section"></div>
</script>

<script type="text/x-tmpl" id="tmpl-tool-close">
<div class="tool-button tool-button--black tool-button--close rex-modal__close-button">
<?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
</div>
</script>
