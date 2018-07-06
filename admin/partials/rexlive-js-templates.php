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