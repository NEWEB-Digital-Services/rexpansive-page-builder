<?php

defined('ABSPATH') or exit;

?>
<script type="text/x-tmpl" id="rexlive-tmpl-new-layout">
<li class="layout__item new-layout">
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

<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-button">
<button class="btn-builder-layout builder-{%=button.id%}-layout" data-min-width="{%=button.minWidth%}" data-max-width="{%=button.maxWidth%}" data-name="{%=button.id%}">
    {%=button.label%}
</button>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-modal">
<li class="layout__item">
    <div class="layout">
        <div class="layout__setting">
            <input type="hidden" name="rexlive-layout-id" value="{%=button.id%}">
            <input type="hidden" name="rexlive-layout-label" data-editable-field="true" value="{%=button.label%}">
            <span class="layout-value">{%=button.label%}</span>
        </div>
        <div class="layout__setting">
            <input type="hidden" name="rexlive-layout-min" data-editable-field="true" value="{%=button.minWidth%}">
            <span class="layout-value">{%=button.minWidth%}px</span>
        </div>
        <div class="layout__setting">
            <input type="hidden" name="rexlive-layout-max" data-editable-field="true" value="{%=button.maxWidth%}">
            <span class="layout-value">{%=button.maxWidth%}</span>
        </div>
        <div class="layout__setting">
            <input type="hidden" name="rexlive-layout-type" value="{%=button.type%}">
            <span class="rexlive-layout--edit">
                <span class="dashicons-edit dashicons-before"></span>
                <span class="dashicons-yes dashicons-before hide-icon"></span>
            </span>
        </div>
        <div class="layout__setting">
            <span class="rexlive-layout--delete">
                <span class="dashicons-trash dashicons-before"></span>
            </span>
        </div>
    </div>
</li>
</script>