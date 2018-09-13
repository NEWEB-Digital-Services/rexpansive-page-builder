<?php

defined('ABSPATH') or exit;

?>
<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-button">
<div>
    <button class="btn-builder-layout builder-{%=customLayout.id%}-layout" data-min-width="{%=customLayout.minWidth%}" data-max-width="{%=customLayout.maxWidth%}" data-name="{%=customLayout.id%}">
        {%=customLayout.label%}
    </button>
</div>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-modal">
<li class="layout__item">
    <div class="layout">
        <div class="layout__setting">
            <input type="hidden" name="rexlive-layout-id" value="{%=customLayout.id%}">
            <input class="layout-label-input" type="hidden" name="rexlive-layout-label" data-editable-field="true" value="{%=customLayout.label%}">
            <span class="layout-value">{%=customLayout.label%}</span>
        </div>
        <div class="layout__setting">
            <input class="layout-min-input" type="hidden" name="rexlive-layout-min" data-editable-field="true" value="{%=customLayout.minWidth%}">
            <span class="layout-value">{%=customLayout.minWidth%}px</span>
        </div>
        <div class="layout__setting">
            <input class="layout-max-input" type="hidden" name="rexlive-layout-max" data-editable-field="true" value="{%=customLayout.maxWidth%}">
            <span class="layout-value">&infin;</span>
        </div>
        <div class="layout__setting">
            <input type="hidden" name="rexlive-layout-type" value="{%=customLayout.type%}">
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