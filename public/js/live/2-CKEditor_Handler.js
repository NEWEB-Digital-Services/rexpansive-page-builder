/**
 * Object that handles the live text editor inside the blocks
 * upgraded using CKEditor5 plugin
 * 
 * The plugin is bundled in the CKEDITOR global object
 *
 * @since 2.2.0
 */
var CKEditor_Handler = (function ($) {
	const TEXT_WRAP_CLASSNAME = 'text-wrap'
	const PERFECT_GRID_GALLERY_CLASSNAME = 'perfect-grid-gallery'
	const GRID_STACK_ITEM_CLASSNAME = 'grid-stack-item'

	let editorInstance
	let EDITOR_STATE = 'deactive'

	function isUndefined(el) {
		return 'undefined' === typeof el
	}

	function isNull(el) {
		return null === el
	}

	function isNil(el) {
		return isUndefined(el) || isNull(el)
	}

	function isEmpty(el) {
		return '' !== el
	}

	function parents(el, selector) {
		const parents = [];
		while ((el = el.parentNode) && el !== document) {
			if (!selector || el.matches(selector)) parents.push(el);
		}
		return parents;
	}


	function createEditorInstance(el) {
		const editor = CKEDITOR.BalloonEditor
			.create(el, {
				plugins: [CKEDITOR.Essentials, CKEDITOR.Paragraph, CKEDITOR.Bold, CKEDITOR.Italic, CKEDITOR.Underline, CKEDITOR.Heading, CKEDITOR.FontColor, CKEDITOR.GeneralHtmlSupport, CKEDITOR.HorizontalLine, CKEDITOR.Link, CKEDITOR.Image, CKEDITOR.ImageResize, CKEDITOR.ImageStyle, CKEDITOR.ImageToolbar, CKEDITOR.Undo],
				toolbar: [
					'heading',
					'bold',
					'italic',
					'underline',
					'|',
					'fontColor',
					'horizontalLine',
					'link',
					'|',
					'undo',
					'redo'
				],
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				},
				htmlSupport: {
					allow: [
						{
							name: /.*/,
							attributes: true,
							classes: true,
							styles: true
						}
					]
				},
				link: {
					decorators: {
						openInNewTab: {
							mode: 'manual',
							label: 'Open in new tab',
							attributes: {
								target: '_blank',
								rel: 'noopener norefferer'
							}
						}
					}
				},
				image: {
					toolbar: [
						'imageStyle:block',
						'imageStyle:side',
						'|',
						'imageTextAlternative'
					]
				}
			})
			.then(editor => {
				console.log('Editor was initialized', editor);
				editorInstance = editor
				EDITOR_STATE = 'active'

				editorInstance.focus()

				editorInstance.ui.focusTracker.on('change:isFocused', function (eventInfo, name, value, oldValue) {
					if (value) return
					restoreBlockTools(editorInstance.sourceElement)
					destroyEditorInstance(editorInstance.sourceElement)
				})
			})
			.catch(error => {
				console.error(error.stack);
			});
	}

	function restoreBlockTools(editorElement) {
		const perfectGridGallery = parents(editorElement, `.${PERFECT_GRID_GALLERY_CLASSNAME}`)[0]
		const $perfectGridGallery = $(perfectGridGallery)
		const perfectGridGalleryInstance = $perfectGridGallery.data('plugin_perfectGridGalleryEditor');

		if (isNil(perfectGridGalleryInstance)) return;

		perfectGridGalleryInstance.section.classList.remove('block-editing')

		const block = parents(editorElement, `.${GRID_STACK_ITEM_CLASSNAME}`)[0]
		block.classList.remove('item--me-focus')

		// View or hide the little T icon
		Rexbuilder_Block_Editor.updateTextTool(editorElement);

		// Enable dragging on gristack
		perfectGridGalleryInstance.properties.gridstackInstance.enableMove(true);

		Rexbuilder_Util_Editor.activateElementFocus = false;
		Rexbuilder_Util_Editor.endEditingElement();
		Rexbuilder_Util_Editor.activateElementFocus = true;
	}

	function destroyEditorInstance(editorContentElement) {
		const editorData = editorInstance.data.get()
		editorInstance.destroy().then(() => {
			editorInstance = null
			editorContentElement.innerHTML = editorData
			EDITOR_STATE = 'deactive'
		})
	}

	function initListeners() {
		document.addEventListener('rexpansive:perfect-grid-gallery:block:dbclick', function (event) {
			if ('deactive' !== EDITOR_STATE) return

			const block = event.detail.block
			if (isNil(block)) {
				console.warn('[CKEditor_Handler/initListeners]: block element  is nil')
				return
			}
			const textWrap = block.querySelector(`.${TEXT_WRAP_CLASSNAME}`)

			if (isNil(textWrap)) {
				console.warn('[CKEditor_Handler/initListeners]: textWrap element is nil')
				return
			}

			createEditorInstance(textWrap)
		})

		document.addEventListener('rexpansive:perfect-grid-gallery:block:blur', function (event) {
			if ('active' !== EDITOR_STATE) return

			if (isNil(editorInstance)) {
				console.warn('[CKEditor_Handler/initListeners]: editorInstance is nil')
				return
			}

			const block = event.detail.block
			if (isNil(block)) {
				console.warn('[CKEditor_Handler/initListeners]: block element is nil')
				return
			}
			const textWrap = block.querySelector(`.${TEXT_WRAP_CLASSNAME}`)

			if (isNil(textWrap)) {
				console.warn('[CKEditor_Handler/initListeners]: textWrap element is nil')
				return
			}
		})
	}

	function init() {
		console.log('CKEditor_Handler 20')
		initListeners()
	}

	function load() { }

	return {
		init: init,
		load: load
	}
})(jQuery);