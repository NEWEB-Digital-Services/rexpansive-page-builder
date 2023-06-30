/**
 * Object that handles the live text editor inside the blocks
 * upgraded using CKEditor5 plugin
 * 
 * The plugin is bundled in the CKEDITOR global object
 *
 * @since 2.2.0
 */

/**
 * @typedef {Object} WPImageUploadImgData
 * @property {number} idImage
 * @property {string} urlImage
 * @property {number} width
 * @property {number} height
 * @property {string} align
 */

/**
 * @typedef {Object} WpImageUploadDisplayData
 * @property {string} align
 * @property {string} size
 * @property {string} link
 * @property {boolean} canEmbed
 * @property {string} string
 * @property {string} url
 * @property {string[]} classes
 * @property {string} title
 * @property {string} linkUrl
 * @property {string} caption
 * @property {string} alt
 * @property {number} width
 * @property {number} height
 * @property {string} src
 * @property {string} captionId
 * @property {string} previousLink
 */

/**
 * @typedef {Object} WPImageUploadData
 * @property {WPImageUploadImgData} imgData
 * @property {WpImageUploadDisplayData} displayData
 */

var CKEditor_Handler = (function ($) {
	const TEXT_WRAP_CLASSNAME = 'text-wrap'
	const PERFECT_GRID_GALLERY_CLASSNAME = 'perfect-grid-gallery'
	const GRID_STACK_ITEM_CLASSNAME = 'grid-stack-item'

	/**
	 * Check if an element is undefined
	 * @param {Element} el 
	 * @returns boolean
	 * @since 2.2.0
	 */
	function isUndefined(el) {
		return 'undefined' === typeof el
	}

	/**
	 * Check if an element is null
	 * @param {Element} el 
	 * @returns boolean
	 * @since 2.2.0
	 */
	function isNull(el) {
		return null === el
	}

	/**
	 * Check if element is undefined or null
	 * @param {Element} el 
	 * @returns boolean
	 * @since 2.2.0
	 */
	function isNil(el) {
		return isUndefined(el) || isNull(el)
	}

	/**
	 * Check if a string is empty
	 * @param {string} el 
	 * @returns bool
	 * @since 2.2.0
	 */
	function isEmpty(el) {
		return '' !== el
	}

	/**
	 * Get the parents
	 * @param {Element} el 
	 * @param {string} selector 
	 * @returns Element[]
	 * @since 2.2.0
	 */
	function parents(el, selector) {
		const parents = [];
		while ((el = el.parentNode) && el !== document) {
			if (!selector || el.matches(selector)) parents.push(el);
		}
		return parents;
	}

	/**
	 * Generic Editor State
	 * @since 2.2.0
	 */
	class CKEditorState {
		/**
		 * Handle a state machine action
		 * @param {Context} context 
		 * @param {string} action 
		 */
		handleAction(context, action) {
			throw new Error('Method "handleAction" not implemented')
		}
	}

	/**
	 * @since 2.2.0
	 */
	class DeactiveState extends CKEditorState {
		/**
		 * Performs an action from deactive: state can only go to active
		 * @param {Context} context 
		 * @param {string} action 
		 */
		handleAction(context, action) {
			if (!(context.currentState instanceof DeactiveState)) return
			switch (action) {
				case 'ACTIVE':
					context.transitionTo(new ActiveState())
					break
				default:
					break
			}
		}
	}

	/**
	 * @since 2.2.0
	 */
	class ActiveState extends CKEditorState {
		/**
		 * Performs an action from active: state can go to other tools open
		 * or to deactive
		 * @param {Context} context 
		 * @param {string} action 
		 */
		handleAction(context, action) {
			if (!(context.currentState instanceof ActiveState)) return
			switch (action) {
				case 'DEACTIVE':
					context.transitionTo(new DeactiveState())
					break;
				case 'OPEN_WP_IMAGE_UPLOAD':
					context.transitionTo(new WPImageUploadOpenState())
				default:
					break;
			}
		}
	}

	/**
	 * @since 2.2.0
	 */
	class WPImageUploadOpenState extends CKEditorState {
		/**
		 * Performs an action from active: state can go to other tools open
		 * or to deactive
		 * @param {Context} context 
		 * @param {string} action 
		 */
		handleAction(context, action) {
			if (!(context.currentState instanceof WPImageUploadOpenState)) return
			switch (action) {
				case 'CLOSE_WP_IMAGE_UPLOAD':
					context.transitionTo(new ActiveState())
					break;

				default:
					break;
			}
		}
	}

	/**
	 * @since 2.2.0
	 */
	class Context {
		/**
		 * Initial state of the context
		 * @param {CKEditorState} initialState 
		 */
		constructor(initialState) {
			this.currentState = initialState
		}

		/**
		 * Performing an action on a state
		 * @param {string} action 
		 */
		performAction(action) {
			this.currentState.handleAction(this, action)
		}

		/**
		 * Changing state
		 * @param {CKEditorState} newState 
		 */
		transitionTo(newState) {
			console.log(`Transition to ${newState.constructor.name}`)
			this.currentState = newState
		}

		/**
		 * The current context state
		 * @returns {CKEditorState} The current state machine state
		 */
		getCurrentState() {
			return this.currentState
		}
	}

	/**
	 * @since 2.2.0
	 */
	class CKEditorStateMachine {
		constructor() {
			this.context = new Context(new DeactiveState())
			this.editorInstance = null
		}

		setEditorInstance(editor) {
			this.editorInstance = editor
		}

		clearEditorInstance() {
			this.editorInstance = null
		}

		/**
		 * The editor is active
		 * @returns {boolean}
		 */
		isEditorActive() {
			return this.context.getCurrentState() instanceof ActiveState
		}

		/**
		 * The editor is deactive
		 * @returns {boolean}
		 */
		isEditorDeactive() {
			return this.context.getCurrentState() instanceof DeactiveState
		}

		/**
		 * The Worpdress image uploader is open
		 * @returns {boolean}
		 */
		isWpImageUploadOpen() {
			return this.context.getCurrentState() instanceof WPImageUploadOpenState
		}

		toActiveState() {
			this.context.performAction('ACTIVE')
		}

		toDeactiveState() {
			this.context.performAction('DEACTIVE')
		}

		toWpImageUploadOpen() {
			this.context.performAction('OPEN_WP_IMAGE_UPLOAD')
		}

		toWpImageUploadClose() {
			this.context.performAction('CLOSE_WP_IMAGE_UPLOAD')
		}
	}

	const ckeditorStateMachine = new CKEditorStateMachine()

	class WPImageUpload extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			editor.ui.componentFactory.add('wpImageUpload', () => {
				const button = new CKEDITOR.ButtonView()
				button.set({
					tooltip: 'WP Image Upload',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20" fill="#000"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z" fill="#000"></path></svg>',
					class: 'ckeditor-wp-image-upload'
				})

				button.on('execute', () => {
					console.log('upload wp media')
					const data = {
						eventName: 'rexlive:openMEImageUploader',
						img_data: {}
					};

					Rexbuilder_Util_Editor.sendParentIframeMessage(data);
					ckeditorStateMachine.toWpImageUploadOpen()
				})

				return button
			})
		}
	}

	class WpImageEdit extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor;

			// Crea un nuovo pulsante nella toolbar dell'immagine
			editor.ui.componentFactory.add('wpImageEdit', locale => {
				const button = new CKEDITOR.ButtonView()
				button.set({
					tooltip: 'WP Image Edit',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20" fill="#000"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z" fill="#000"></path></svg>'
				})

				button.on('execute', () => {
					const selection = editor.model.document.selection;
					const selectedElement = selection.getSelectedElement();

					if (isNil(selectedElement)) return

					if (!selectedElement.is('element', 'imageInline')) return

					const imageHtmlAttributes = selectedElement.getAttribute('htmlAttributes')

					let image_id = null
					let align = ''

					for (let i = 0; i < imageHtmlAttributes.classes.length; i++) {
						// todo: regexp to track precisely align possibilities
						if (-1 !== imageHtmlAttributes.classes[i].indexOf('align')) {
							align = imageHtmlAttributes.classes[i]
							continue
						}

						// todo: regexp to track precisely wp-image-X class, and extract the id
						if (-1 !== imageHtmlAttributes.classes[i].indexOf('wp-image')) {
							const temp = imageHtmlAttributes.classes[i].split('-')
							image_id = parseInt(temp[2])
							continue
						}
					}

					let imgInsideLink = false

					// create object to pass to media editor
					const img_data = {
						image_id,
						width: parseInt(imageHtmlAttributes.attributes.width),
						height: parseInt(imageHtmlAttributes.attributes.height),
						align,
						imgInsideLink
					}

					const data = {
						eventName: 'rexlive:openMEImageUploader',
						img_data 
					};

					Rexbuilder_Util_Editor.sendParentIframeMessage(data);
					ckeditorStateMachine.toWpImageUploadOpen()
				})
				
				return button
			});
		}
	}

	class InlineImagePhotoswipe extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			
			editor.ui.componentFactory.add('inlineImagePhotoswipe', () => {

				const button = new CKEDITOR.ButtonView()
				button.set({
					tooltip: 'Photoswipe',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 21 21" fill="#000"><path d="M14 12.586l7.014 7.014v1.385l-.03.03H19.6L12.586 14H0V0h14v12.586zM2 2v10h10V2H2zm6 4h2v2H8v2H6V8H4V6h2V4h2v2z" fill-rule="evenodd"></path></svg>'
				})

				// todo: execute

				return button
			})
		}
	}

	class InlineImageRemove extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			
			editor.ui.componentFactory.add('inlineImageRemove', () => {

				const button = new CKEDITOR.ButtonView()
				button.set({
					tooltip: 'Photoswipe',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 100 100" fill="#000"><path d="M85.355 77.157L58.198 50l27.156-27.155a5.8 5.8 0 00.001-8.2 5.8 5.8 0 00-8.199 0L50 41.802 22.843 14.645a5.802 5.802 0 00-8.199 0 5.795 5.795 0 000 8.199l27.157 27.157-27.156 27.155a5.792 5.792 0 000 8.2 5.795 5.795 0 008.199 0l27.155-27.157 27.157 27.157a5.794 5.794 0 008.199 0 5.8 5.8 0 000-8.2z" fill-rule="nonzero"/></svg>'
				})

				// todo: execute
				button.on('execute', () => {
					const selection = editor.model.document.selection;
					const selectedElement = selection.getSelectedElement();

					if (isNil(selectedElement)) return

					if (!selectedElement.is('element', 'imageInline')) return

					editor.model.change(writer => {
						writer.remove(selectedElement)
					})
				})

				return button
			})
		}
	}

	/**
	 * Creating the editor instance
	 * @param {Element} el 
	 * @since 2.2.0
	 */
	function createEditorInstance(el) {
		const editor = CKEDITOR.BalloonEditor
			.create(el, {
				plugins: [CKEDITOR.Essentials, CKEDITOR.Paragraph, CKEDITOR.Bold, CKEDITOR.Italic, CKEDITOR.Underline, CKEDITOR.Heading, CKEDITOR.FontColor, CKEDITOR.GeneralHtmlSupport, CKEDITOR.HorizontalLine, CKEDITOR.Link, CKEDITOR.Image, CKEDITOR.ImageResize, CKEDITOR.ImageStyle, CKEDITOR.ImageToolbar, CKEDITOR.Undo, WPImageUpload, WpImageEdit, InlineImagePhotoswipe, InlineImageRemove],
				toolbar: [
					'undo',
					'redo',
					'|',
					'heading',
					'bold',
					'italic',
					'underline',
					'|',
					'fontColor',
					'horizontalLine',
					'link',
					'wpImageUpload',
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
						'imageTextAlternative',
						'|',
						'wpImageEdit',
						'inlineImagePhotoswipe',
						'|',
						'inlineImageRemove'
					]
				},
				placeholder: 'Type your text here'
			})
			.then(editor => {
				console.log('Editor was initialized', editor);
				ckeditorStateMachine.setEditorInstance(editor)
				ckeditorStateMachine.toActiveState()

				ckeditorStateMachine.editorInstance.focus()

				ckeditorStateMachine.editorInstance.ui.focusTracker.on('change:isFocused', function (eventInfo, name, value, oldValue) {
					if (value) return
					if (ckeditorStateMachine.isEditorActive()) {
						restoreBlockTools(ckeditorStateMachine.editorInstance.sourceElement)
						destroyEditorInstance(ckeditorStateMachine.editorInstance.sourceElement)
					}
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
		const editorData = ckeditorStateMachine.editorInstance.data.get()
		ckeditorStateMachine.editorInstance.destroy().then(() => {
			ckeditorStateMachine.clearEditorInstance()
			editorContentElement.innerHTML = editorData
			ckeditorStateMachine.toDeactiveState()
		})
	}

	function initListeners() {
		document.addEventListener('rexpansive:perfect-grid-gallery:block:dbclick', function (event) {
			if (!ckeditorStateMachine.isEditorDeactive()) return

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

		/**
		 * @since 2.2.0
		 */
		document.addEventListener('keydown', function(event) {
			if (event.key === 'Escape') {
				if (ckeditorStateMachine.isEditorActive()) {
					restoreBlockTools(ckeditorStateMachine.editorInstance.sourceElement)
					destroyEditorInstance(ckeditorStateMachine.editorInstance.sourceElement)
				}
			}
		})
	}

	/**
	 * Handling inserting of the image on closing the WP Media Editor
	 * @param {WPImageUploadData} data 
	 * @returns void
	 * @since 2.2.0
	 */
	function handleInlineImageEdit(data) {
		if (ckeditorStateMachine.isEditorDeactive()) return

		ckeditorStateMachine.editorInstance.focus()

		ckeditorStateMachine.editorInstance.model.change((writer) => {
			const imgClasses = data.displayData.classes
			imgClasses.push(data.imgData.align)

			const insertImageData = {
				src: data.imgData.urlImage,
				alt: data.displayData.alt,
				htmlAttributes: {
					'data-image-id': data.imgData.idImage.toString(),
					width: data.imgData.width,
					height: data.imgData.height,
					classes: imgClasses,
					title: data.displayData.title,
				}
			}

			ckeditorStateMachine.editorInstance.execute('insertImage', {
				source: [
					insertImageData
				]
			})

			ckeditorStateMachine.toWpImageUploadClose()
		})
	}

	function handleEvent(event) {
		switch (event.name) {
			case 'rexlive:ckeditor:inlineImageEdit':
				handleInlineImageEdit(event.data)
				break
			case 'rexlive:ckeditor:inlineImageClose':
				console.log('attiva o chiodi')
				ckeditorStateMachine.toWpImageUploadClose()
				break
			default:
				break;
		}
	}

	function init() {
		console.log('CKEditor_Handler 80')
		initListeners()
	}

	function load() { }

	return {
		init,
		load,
		handleEvent
	}
})(jQuery);