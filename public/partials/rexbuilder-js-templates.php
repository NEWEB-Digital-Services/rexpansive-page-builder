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

<?php include 'js-templates/rexlive-block-tools.php'; ?>

<script type="text/x-tmpl" id="tmpl-toolbox-block">
<div class="rexlive-block-toolbox top-tools">
    <div class="rexlive-top-block-tools">
        <div class="block-toolBox__placeholder">
            <div style="visibility:hidden;">
                <div class="el-size-viewer tool-indicator"></div>
            </div>
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
        <div id="block_{%=block.id%}-builder-data" class="rexbuilder-block-data" data-id="block_{%=block.id%}" data-rexbuilder_block_id="{%=block.rexID%}" data-type="" data-size_x="{%=block.backendWidth%}" data-size_y="{%=block.backendHeight%}" data-row="{%=block.backendY%}" data-col="{%=block.backendX%}" data-gs_start_h="{%=block.gsHeight%}" data-gs_width="{%=block.gsWidth%}" data-gs_height="{%=block.gsHeight%}" data-gs_y="{%=block.gsY%}" data-gs_x="{%=block.gsX%}" data-color_bg_block="" data-image_bg_block="" data-id_image_bg_block="" data-video_bg_id="" data-video_mp4_url="" data-video_bg_url="" data-video_bg_url_vimeo="" data-type_bg_block="" data-image_size="" data-photoswipe="" data-linkurl="" data-block_custom_class="" data-block_padding="{% if(block.block_type == 'rexslider') { %}0px;0px;0px;0px;{% } %}" data-overlay_block_color="" data-zak_background="" data-zak_side="" data-zak_title="" data-zak_icon="" data-zak_foreground="" data-block_animation="fadeInUpBig" data-video_has_audio="" data-block_has_scrollbar="false" data-block_dimensions_live_edited="" data-block_height_masonry="" data-block_height_fixed="" data-block_height_calculated="{%=block.gsHeight%}"></div>
        <div class="grid-stack-item-content">
            <div class="grid-item-content-wrap">
                <div class="grid-item-content rex-flexbox" style="background-color:rgba(0, 0, 0, 0);">
                    <div class="responsive-block-overlay" style="background-color:rgba(0, 0, 0, 0);">
                        <div class="rex-custom-position rex-custom-scrollbar">
                            <div class="text-wrap"{% if(block.block_type == 'rexslider') { %} style="padding:0px;"{% } %}>
                                {% if(block.block_type == 'text') { %}
                                <p><br></p>
                                {% } %}
                            </div>
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

<?php include 'js-templates/rexlive-section-tools.php'; ?>

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

<script type="text/x-tmpl" id="tmpl-tool-save">
<div class="rex-modal__outside-footer">
    <div id="rex-model__add-new-model" class="tool-button tool-button--inline tool-button--save tippy"
        data-tippy-content="Create Model" tabindex="0">
        <span class="btn-save--edited"> 
        <?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?>
        </span>
        <span class="btn-save--saved"> 
        <?php Rexbuilder_Utilities::get_icon('#A006-Save'); ?>
        </span>
    </div>
</div>
</script>

<script type="text/x-tmpl" id="tmpl-tool-drag">
<div class="tool-button tool-button--inline drag-to-section drag-to-section-simulator" draggable="true"></div>
</script>