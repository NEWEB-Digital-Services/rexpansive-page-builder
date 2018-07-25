<?php

defined( 'ABSPATH' ) or exit;

?>
<script type="text/x-tmpl" id="rexlive-tmpl-new-layout">
<li class="layout__item">
  <div class="layout">
    <div class="layout__setting">
      <input type="hidden" name="rexlive-layout-id" value="{%=o.l_id%}">
      <input type="text" name="rexlive-layout-label" placeholder="Name">
    </div>
    <div class="layout__setting">
      <input type="text" name="rexlive-layout-min" placeholder="From">
    </div>
    <div class="layout__setting">
      <input type="text" name="rexlive-layout-max" placeholder="To">
    </div>
    <div class="layout__setting">
      <input type="hidden" name="rexlive-layout-type" value="custom">
    </div>
    <div class="layout__setting">
      <button class="builder-button btn-floating btn light-blue darken-1 waves-effect waves-light tooltipped rexlive-remove-custom-layout" data-position="bottom" data-tooltip="Add Layout">
        <i class="rex-icon">n</i>
      </button>
    </div>
  </div>
</li>
</script>
<script type="text/x-tmpl" id="rexlive-tmpl-modal-add-block-video">
<div class="rex-modal-wrap rex-fade">
    <div id="rex-video-block" class="rex-modal rexbuilder-materialize-wrap rex-modal-draggable z-depth-4">
        <div class="modal-content">
            <div id="section-set-video-wrap" class="row valign-wrapper">
                <div class="rex-check rex-check-icon col">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="youtube" id="rex-choose-youtube">
                    <label for="rex-choose-youtube">
                        <i class="material-icons rex-icon">C</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col">
                    <input id="rex-mp4-id" type="hidden">
                    <input id="rex-youtube-url" type="text">
                    <label id="rex-youtube-url-label" for="rex-youtube-url">https://youtu.be/...</label>
                </div>
                <div class="rex-check rex-check-icon col">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="mp4" id="rex-choose-mp4">
                    <label id="rex-upload-mp4" for="rex-choose-mp4">
                        <i class="material-icons rex-icon">A</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
            </div>
            <div id="section-set-video-wrap-2" class="row valign-wrapper" style="padding-top:16px;">
                <div class="rex-check rex-check-icon col" style="margin-right:5px;">
                    <input type="radio" class="rex-choose-video with-gap" name="rex-choose-video" value="vimeo" id="rex-choose-vimeo">
                    <label for="rex-choose-vimeo">
                        <i class="material-icons rex-icon">Z</i>
                        <span class="rex-ripple"></span>
                    </label>
                </div>
                <div class="input-field col">
                    <input id="rex-vimeo-url" type="text">
                    <label id="rex-vimeo-url-label" for="rex-vimeo-url">https://player.vimeo.com/video/...</label>
                </div><!-- vimeo input -->
            </div>
        </div>
        <div class="rex-modal-footer">
            <button id="rex-video-block-cancel" class="waves-effect waves-light btn-flat grey rex-cancel-button" value="">
                <i class="rex-icon">n</i>
            </button>
            <button id="rex-video-block-save" class="waves-effect waves-light btn-flat blue darken-1 rex-save-button" value="">
                <i class="rex-icon">m</i>
            </button>
        </div>
    </div>
</div><!-- Block Video Editor -->
</script>