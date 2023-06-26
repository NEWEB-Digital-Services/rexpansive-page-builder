/**
 * Object that handles the live text editor inside the blocks
 * upgraded using CKEditor5 plugin
 * 
 * The plugin is bundled in the CKEDITOR global object
 *
 * @since 2.2.0
 */
var CKEditor_Handler = (function ($) {
	let editorInstance
	const TEXT_WRAP_CLASSNAME = 'text-wrap'
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

	function createEditorInstance(el) {
		if ('deactive' !== EDITOR_STATE) return

		editorInstance = CKEDITOR.BalloonEditor
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
				EDITOR_STATE = 'active'
			})
			.catch(error => {
				console.error(error.stack);
			});
	}

	function initListeners() {
		document.addEventListener('rexpansive:perfect-grid-gallery:block:dbclick', function(event) {
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
	}

	function init() {
		initListeners()
		// createEditorInstance()
	}

	function load() { }

	return {
		init: init,
		load: load
	}
}) (jQuery);