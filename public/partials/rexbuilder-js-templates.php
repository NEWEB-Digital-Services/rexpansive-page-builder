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
?>

<script type="text/x-tmpl" id="tmpl-toolbox-block">
<div class="rexlive-block-toolbox">
    <div class="rexlive-top-block-tools">
        <div>
            <div class="tool-button--big">
                <span class="el-size-viewer"></span>
            </div>
        </div>
        <!-- // left area: size viewer -->

        <div>
            <div class="tool-button--double-icon--wrap">
                <div class="tool-button tool-button--inline edit-block-image tooltipped">
                    <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                </div>
                <div class="tool-button tool-button--inline tool-button--double-icon deactivate-block-image-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block image background -->

            <div class="tool-button--double-icon--wrap">
                <input class="spectrum-input-element" type="text" name="edit-block-color-background" value="">
                <div class="tool-button tool-button--inline tool-button--double-icon deactivate-block-color-background">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block color background -->

            <div class="tool-button--double-icon--wrap">
                <input class="spectrum-input-element" type="text" name="edit-block-overlay-color" value="">
                <div class="tool-button tool-button--inline tool-button--double-icon deactivate-block-overlay-color">
                    <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                </div>
            </div><!-- // Change Block overlay color -->

            <div class="tool-button tool-button--inline edit-block-video-background">
                <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
            </div><!-- // Change Block Video background -->
        </div>

        <div>
            
            <div class="tool-button tool-button--inline btn-flat builder-copy-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive'); ?>">
                <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
            </div>

            <div class="tool-button-floating">
				<div class="tool-button builder-edit-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Block settings', 'rexpansive');?>">
					<?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
                </div>
                
				<div class="tool-button_list">

                    <button class="tool-button tool-button--inline builder-edit-slider tooltipped waves-effect waves-light">
                        <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
                    </button>

                </div>
            </div>
        </div>
    </div>
    <button class="tool-button tool-button--black builder-delete-block waves-effect tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexspansive'); ?>">
        <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
    </button>
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
    <button class="add-new-section">
	    	ADD
    </button>
</script>

<script type="text/x-tmpl" id="tmpl-toolbox-section">
    <div class="section-toolBox">
        <div class="tools">
            
            <div class="bl_col-6">
                <div class="tool-button--big tool-button--inline">
                    <label>
                        <input type="radio" class="edit-row-width" data-section_width="full" name="row-dimension-{%=section.rexID%}" value="100%" checked>
                        <span><?php Rexbuilder_Utilities::get_icon('#B001-Full'); ?></span>
                    </label>
                    <label>
                        <input type="radio" class="edit-row-width" data-section_width="boxed" name="row-dimension-{%=section.rexID%}" value="80%">
                        <span><?php Rexbuilder_Utilities::get_icon('#B002-Boxed'); ?></span>
                    </label>
                </div><!-- // row dimension -->

                <div class="tool-button--big tool-button--inline">
                    <label>
                        <input type="radio" class="edit-row-layout" data-section_layout="fixed" name="row-layout-{%=section.rexID%}" value="fixed" checked>
                        <span>F</span>
                    </label>
                    <label>
                        <input type="radio" class="edit-row-layout" data-section_layout="masonry" name="row-layout-{%=section.rexID%}" value="masonry">
                        <span>M</span>
                    </label>
                </div><!-- // row layout -->

                <div class="tool-button tool-button--inline collapse-grid tooltipped">
                    <?php Rexbuilder_Utilities::get_icon('#B006-Colapse'); ?>
                </div>
            </div>
            <!-- // right area: row dimension -->

            <div class="bl_col-6 bl_d-flex bl_jc-sb">

                <div>
                    <div class="tool-button-floating">
                        <div class="tool-button add-new-block-empty tooltipped active">
                            <?php Rexbuilder_Utilities::get_icon('#Z001-Plus'); ?>
                        </div>
            
                        <div class="tool-button_list">
                            <div class="tool-button add-new-block-image tooltipped">
                                <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                            </div>
            
                            <div class="tool-button add-new-block-text tooltipped">
                                <?php Rexbuilder_Utilities::get_icon('#B003-Text'); ?>
                            </div>
                            
                            <div class="tool-button add-new-block-video tooltipped">
                                <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                            </div>
            
                            <div class="tool-button add-new-block-slider tooltipped">
                                <?php Rexbuilder_Utilities::get_icon('#Z003-RexSlider'); ?>
                            </div>
                        </div>
                    </div>
                </div><!-- // insert element -->

                <div>
                    <div class="tool-button--double-icon--wrap">
                        <div class="tool-button tool-button--inline edit-row-image-background tooltipped" data-position="bottom" data-tooltip="" value="">
                            <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                        </div>
                        <div class="tool-button tool-button--inline tool-button--double-icon deactivate-row-image-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                        </div>
                    </div>

                    <div class="tool-button--double-icon--wrap">
                        <input class="spectrum-input-element" type="text" name="edit-row-color-background" value="">
                        <div class="tool-button tool-button--inline tool-button--double-icon deactivate-row-color-background">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                        </div>
                    </div>

                    <div class="tool-button--double-icon--wrap">
                        <input class="spectrum-input-element" type="text" name="edit-row-overlay-color" value="">
                        <div class="tool-button tool-button--inline tool-button--double-icon deactivate-row-overlay-color">
                            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
                        </div>
                    </div><!-- // Change Row overlay color -->

                    <div class="tool-button tool-button--inline edit-row-video-background">
                        <?php Rexbuilder_Utilities::get_icon('#Z006-Video'); ?>
                    </div>
                    <!-- // Add background video -->

                </div><!-- // fast configuration elements -->

                <div>
                    <div class="tool-button tool-button--inline builder-copy-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy row', 'rexpansive');?>">
                        <?php Rexbuilder_Utilities::get_icon('#Z004-Copy'); ?>
                    </div>
                    
                    <div class="tool-button tool-button--inline builder-move-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Move row', 'rexpansive');?>">
                        <?php Rexbuilder_Utilities::get_icon('#B007-Move'); ?>
                    </div>

                    <div class="tool-button-floating">
                        <div class="tool-button builder-section-config tooltipped" data-position="bottom" data-tooltip="<?php _e('Row settings', 'rexpansive');?>">
                            <?php Rexbuilder_Utilities::get_icon('#Z005-Setting'); ?>					
                        </div>
                        <div class="tool-button_list">
                            
                            <div class="tool-button edit-background-section tooltipped">
                                <?php Rexbuilder_Utilities::get_icon('#Z002-Image-Full'); ?>
                            </div>
                            
                            <div class="tool-button open-model tooltipped">
                                <?php Rexbuilder_Utilities::get_icon('#B005-RexModel'); ?>
                            </div>
                            
                            <div class="tool-button update-model-button tooltipped locked">
                                <span class="unlocked-icon"><?php Rexbuilder_Utilities::get_icon('#B009-Lock-Open'); ?></span>
                                <span class="locked-icon"><?php Rexbuilder_Utilities::get_icon('#B008-Lock-Close'); ?></span>
                            </div>
                        </div>
                    </div>
                </div><!-- // clone, move, settings -->
            </div>
            <!-- // right area -->
        </div>

        <div class="tool-button tool-button--black builder-delete-row tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete row', 'rexspansive');?>">
            <?php Rexbuilder_Utilities::get_icon('#Z003-Close'); ?>
        </div>
        <!-- // remove section -->
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
            <div class="{%=section.dimensionClass%}">
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