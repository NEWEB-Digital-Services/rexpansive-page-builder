<?php

defined('ABSPATH') or exit;

?>
<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-button">
<div class="layout-container tool-option">
    <div class="btn-builder-layout builder-{%=customLayout.id%}-layout" data-min-width="{%=customLayout.minWidth%}" data-max-width="{%=customLayout.maxWidth%}" data-name="{%=customLayout.id%}" data-layout-type="custom">
        <i class="l-svg-icons"><svg><use xlink:href="#A009-Range"></use></svg></i>
        <div class="layout-custom-number">
            <div class="rex-number"></div>
        </div>
    </div>
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
        <div class="layout__setting">
            <span class="rexlive-layout--move">
                <span class="dashicons-move dashicons-before"></span>
            </span>
        </div>
    </div>
</li>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-custom-layout-handle">
<div class="layout__setting">
    <span class="rexlive-layout--move">
        <span class="dashicons-move dashicons-before"></span>
    </span>
</div>
</script>

<script type="text/x-tmpl" id="rexlive-tmpl-model-item-list">
<li class="model__element bl_d-flex bl_ai-c" draggable="true" data-rex-model-id="{%=model.id%}">
    <div class="model-preview" style="background-image:url({%=model.preview%})"></div>
    <div class="model-name">{%=model.name%}</div>
</li>
</script>