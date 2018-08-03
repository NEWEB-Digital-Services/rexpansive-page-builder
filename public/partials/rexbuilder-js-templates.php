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
            <span class="el-size-viewer"></span>
            <button class="tool-button btn-floating builder-delete-block waves-effect waves-light grey darken-2 tooltipped" data-position="bottom" data-tooltip="<?php _e('Delete block', 'rexspansive');?>">
                <i class="material-icons white-text">&#xE5CD;</i>
            </button>
            <button class="tool-button btn-floating builder-change-background tooltipped waves-effect waves-light">
                I
            </button>
            <button class="tool-button btn-floating builder-edit-slider tooltipped waves-effect waves-light">
                S
            </button>
            <div class="tool-button btn-flat builder-copy-block tooltipped" data-position="bottom" data-tooltip="<?php _e('Copy block', 'rexpansive');?>">
                <i class="material-icons grey-text text-darken-2">&#xE14D;</i>
            </div>
        </div>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-video-vimeo">
    <div class="rex-video-vimeo-wrap rex-video-vimeo-wrap--block">
        <iframe src="{%=video.url%}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>
        </iframe>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-video-mp4">
    <div class="rex-video-wrap">
        <video class="rex-video-container" preload autoplay loop muted>
            <source type="video/mp4" src="{%=video.url%}">
        </video>
    </div>
</script>

<script type="text/x-tmpl" id="tmpl-video-toggle-audio">
    <div class="rex-video-toggle-audio user-has-muted">
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
        <div id="block_{%=block.id%}-builder-data" class="rexbuilder-block-data" data-id="block_{%=block.id%}" data-rexbuilder_block_id="{%=block.rexID%}" data-type="" data-size_x="{%=block.backendWidth%}" data-size_y="{%=block.backendHeight%}" data-row="{%=block.backendY%}" data-col="{%=block.backendX%}" data-gs_start_h="{%=block.gsHeight%}" data-gs_width="{%=block.gsWidth%}" data-gs_height="{%=block.gsHeight%}" data-gs_y="{%=block.gsY%}" data-gs_x="{%=block.gsX%}" data-color_bg_block="" data-image_bg_block="" data-id_image_bg_block="" data-video_bg_id="" data-video_mp4_url="" data-video_bg_url="" data-video_bg_url_vimeo="" data-type_bg_block="" data-image_size="" data-photoswipe="" data-linkurl="" data-block_custom_class="" data-block_padding="" data-overlay_block_color="" data-zak_background="" data-zak_side="" data-zak_title="" data-zak_icon="" data-zak_foreground="" data-block_animation="fadeInUpBig" data-video_has_audio="" data-block_has_scrollbar="false" data-block_live_edited="" data-block_height_masonry="" data-block_height_fixed="" data-block_height_calculated="{%=block.gsHeight%}"></div>
        <div class="grid-stack-item-content">
            <div class="grid-item-content" style="background-color:rgba(0, 0, 0, 0);">
                <div class="rex-custom-scrollbar">
                    <div class="text-wrap">
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
