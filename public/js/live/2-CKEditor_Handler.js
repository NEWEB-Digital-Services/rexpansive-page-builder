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
	const SECTION_CLASSNAME = 'rexpansive_section'
	const MODEL_CLASSNAME = 'rex-model-section'

	const BLOCK_ID_ATTRIBUTE_NAME = 'data-rexbuilder-block-id'
	const SECTION_ID_ATTRIBUTE_NAME = 'data-rexlive-section-id'

	const ALIGNMENT = 'alignment';
	const LEFT_ALIGNMENT = 'left'

	const IconInlineEvents = {
		IconInlineInserted: 'iconInlineInserted'
	}
	const RESIZED_ICON_CLASS = 'icon_resized'

	const BUILDER_ICON_CLASS_PREFIX = 'builder-icon'
	const builderIconsWrap = document.getElementById('builder-icons')
	const builderIcons = Array.prototype.slice.call(builderIconsWrap.children)

	const RESIZED_MEDIA_EMBED_CLASS = 'media_resized'
	const RESIZABLE_MEDIA_EMBED_CSS_SELECTOR = 'figure.ck-widget iframe'
	const MEDIA_EMBED_WIDGETS_CLASSES_MATCH_REGEXP = /media/;

	/**
	 * Get icons inserted in the builder
	 * @returns Object[]
	 * @since 2.2.0
	 */
	function getIconInlineModels() {
		const response = []
		for (let i = 0; i < builderIcons.length; i++) {
			const iconId = builderIcons[i].id
			const iconModel = {
				withText: false,
				label: iconId,
				class: `${BUILDER_ICON_CLASS_PREFIX}-${iconId}`,
				icon: `<svg viewBox="${builderIcons[i].getAttribute('viewBox')}" xmlns="${builderIcons[i].getAttribute('xmlns')}">${builderIcons[i].innerHTML.trim()}</svg>`
			}
			response.push(iconModel)
		}
		return response
	}

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
		 * @param {StateMachine} stateMachine 
		 * @param {string} action 
		 */
		handleAction(stateMachine, action) {
			throw new Error('Method "handleAction" not implemented')
		}
	}

	/**
	 * @since 2.2.0
	 */
	class DeactiveState extends CKEditorState {
		/**
		 * Performs an action from deactive: state can only go to active
		 * @param {StateMachine} stateMachine 
		 * @param {string} action 
		 */
		handleAction(stateMachine, action) {
			if (!(stateMachine.currentState instanceof DeactiveState)) return
			switch (action) {
				case 'ACTIVATE':
					stateMachine.transitionTo(new ActiveState())
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
		 * @param {StateMachine} stateMachine 
		 * @param {string} action 
		 */
		handleAction(stateMachine, action) {
			if (!(stateMachine.currentState instanceof ActiveState)) return
			switch (action) {
				case 'DEACTIVATE':
					stateMachine.transitionTo(new DeactiveState())
					break;
				case 'OPEN_WP_IMAGE_UPLOAD':
					stateMachine.transitionTo(new WPImageUploadOpenState())
					break
				case 'OPEN_HTML_EDITOR':
					stateMachine.transitionTo(new HTMLEditorOpenState())
					break
				case 'OPEN_TEXT_GRADIENT':
					stateMachine.transitionTo(new TextGradientOpenState())
					break
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
		 * @param {StateMachine} stateMachine 
		 * @param {string} action 
		 */
		handleAction(stateMachine, action) {
			if (!(stateMachine.currentState instanceof WPImageUploadOpenState)) return
			switch (action) {
				case 'ACTIVATE':
					stateMachine.transitionTo(new ActiveState())
					break;

				default:
					break;
			}
		}
	}

	/**
	 * @since 2.2.0
	 */
	class HTMLEditorOpenState extends CKEditorState {
		handleAction(stateMachine, action) {
			if (!(stateMachine.currentState instanceof HTMLEditorOpenState)) return
			switch (action) {
				case 'ACTIVATE':
					stateMachine.transitionTo(new ActiveState())
					break;
			
				default:
					break;
			}
		}
	}

	/**
	 *  @since 2.2.0
	 */
	class TextGradientOpenState extends CKEditorState {
		handleAction(stateMachine, action) {
			if (!(stateMachine.currentState instanceof TextGradientOpenState)) return
			switch (action) {
				case 'ACTIVATE':
					stateMachine.transitionTo(new ActiveState())
					break;
			
				default:
					break;
			}
		}
	}

	/**
	 * @since 2.2.0
	 */
	class StateMachine {
		/**
		 * Initial state of the machine
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
		 * The current state
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
			this.stateMachine = new StateMachine(new DeactiveState())

			this.editorInstance = null
			this.isSectionModel = false
		}

		setEditorInstance(editor) {
			this.editorInstance = editor
		}

		clearEditorInstance() {
			this.editorInstance = null
		}

		setStateMachineContext(editor, isSectionModel) {
			this.setEditorInstance(editor)
			this.isSectionModel = isSectionModel
		}

		clearStateMachineContext() {
			this.clearEditorInstance()
			this.isSectionModel = false
		}

		/**
		 * The editor is active
		 * @returns {boolean}
		 */
		isEditorActive() {
			return this.stateMachine.getCurrentState() instanceof ActiveState
		}

		/**
		 * The editor is deactive
		 * @returns {boolean}
		 */
		isEditorDeactive() {
			return this.stateMachine.getCurrentState() instanceof DeactiveState
		}

		/**
		 * The Worpdress image uploader is open
		 * @returns {boolean}
		 */
		isWpImageUploadOpen() {
			return this.stateMachine.getCurrentState() instanceof WPImageUploadOpenState
		}

		/**
		 * The HTML editor is open
		 * @returns {boolean}
		 */
		isHTMLEditorOpen() {
			return this.stateMachine.getCurrentState() instanceof HTMLEditorOpenState
		}

		toActiveState() {
			this.stateMachine.performAction('ACTIVATE')
		}

		toDeactiveState() {
			this.stateMachine.performAction('DEACTIVATE')
		}

		toWpImageUploadOpen() {
			this.stateMachine.performAction('OPEN_WP_IMAGE_UPLOAD')
		}

		toWpImageUploadClose() {
			this.stateMachine.performAction('ACTIVATE')
		}

		toHTMLEditOpen() {
			this.stateMachine.performAction('OPEN_HTML_EDITOR')
		}

		toHTMLEditClose() {
			this.stateMachine.performAction('ACTIVATE')
		}

		toTextGradientOpen() {
			this.stateMachine.performAction('OPEN_TEXT_GRADIENT')
		}

		toTextGradientClose() {
			this.stateMachine.performAction('ACTIVATE')
		}
	}

	const ckeditorStateMachine = new CKEditorStateMachine()

	/**
	 * @since 2.2.0
	 */
	class EnableAlignmentLeft extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor;
			const model = editor.model;
			const doc = model.document;
			const alignmentCommand = editor.commands.get('alignment')

			this._defineConverters()

			alignmentCommand.on('execute', (evt, args) => {
				model.change(writer => {
					const blocks = Array.from(doc.selection.getSelectedBlocks()).filter(block => this._canBeAligned(block));
					const currentAlignment = blocks[0].getAttribute('alignment');

					for (let i = 0; i < args.length; i++) {
						const alignment = args[i].value
						if (alignment === currentAlignment) continue
						if (LEFT_ALIGNMENT !== alignment) continue

						setAlignmentOnSelection(blocks, writer, alignment);
					}
				})
			})
		}

		_defineConverters() {
			const editor = this.editor
			const viewDefinition = {}
			viewDefinition[LEFT_ALIGNMENT] = {
				key: 'style',
				value: {
					'text-align': LEFT_ALIGNMENT
				}
			}

			const downcastDefintion = {
				model: {
					key: ALIGNMENT,
					values: [LEFT_ALIGNMENT]
				},
				view: viewDefinition
			}

			editor.conversion.for('downcast').attributeToAttribute(downcastDefintion)

			const upcastDefintion = {
				view: {
					key: 'style',
					value: {
						'text-align': LEFT_ALIGNMENT
					}
				},
				model: {
					key: ALIGNMENT,
					value: LEFT_ALIGNMENT
				}
			}
			editor.conversion.for('upcast').attributeToAttribute(upcastDefintion)
		}

		_canBeAligned(block) {
			return this.editor.model.schema.checkAttribute(block, ALIGNMENT);
		}
	}

	/**
	 * @param {Element[]} blocks editor elements
	 * @param {Writer} writer editor writer
	 * @param {string} alignment possible text alignment
	 * @since 2.2.0
	 */
	function setAlignmentOnSelection(blocks, writer, alignment) {
		for (const block of blocks) {
			writer.setAttribute(ALIGNMENT, alignment, block);
		}
	}

	/**
	 * @since 2.2.0
	 */
	class WPImageUpload extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			editor.ui.componentFactory.add('wpImageUpload', () => {
				const button = new CKEDITOR.ButtonView()
				button.set({
					tooltip: 'WP Image Upload',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z"></path></svg>',
					class: 'ckeditor-wp-image-upload'
				})

				button.on('execute', () => {
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

	/**
	 * @since 2.2.0
	 */
	class WpImageEdit extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor;

			// Crea un nuovo pulsante nella toolbar dell'immagine
			editor.ui.componentFactory.add('wpImageEdit', locale => {
				const button = new CKEDITOR.ButtonView()
				button.set({
					tooltip: 'WP Image Edit',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z"></path></svg>'
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

	/**
	 * @since 2.2.0
	 */
	class InlineImagePhotoswipe extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const t = editor.t

			editor.ui.componentFactory.add('inlineImagePhotoswipe', (locale) => {
				const button = new CKEDITOR.ButtonView(locale)

				button.set({
					tooltip: t('Photoswipe'),
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 21 21"><path d="M14 12.586l7.014 7.014v1.385l-.03.03H19.6L12.586 14H0V0h14v12.586zM2 2v10h10V2H2zm6 4h2v2H8v2H6V8H4V6h2V4h2v2z" fill-rule="evenodd"></path></svg>'
				})

				const selection = editor.model.document.selection;
				const selectedElement = selection.getSelectedElement();

				if (isNil(selectedElement)) return

				if (!selectedElement.is('element', 'imageInline')) return

				const imageHtmlAttributes = selectedElement.getAttribute('htmlImgAttributes')
				const isInlinePhotoswipeActive = isNil(imageHtmlAttributes.attributes) ? false : imageHtmlAttributes.attributes['inline-photoswipe']
				button.set({
					isOn: 'true' === isInlinePhotoswipeActive,
				})

				editor.model.document.on('change', () => {
					const selection = editor.model.document.selection;
					const selectedElement = selection.getSelectedElement();

					if (isNil(selectedElement)) return

					if (!selectedElement.is('element', 'imageInline')) return

					const imageHtmlAttributes = selectedElement.getAttribute('htmlImgAttributes')
					const isInlinePhotoswipeActive = isNil(imageHtmlAttributes.attributes) ? false : imageHtmlAttributes.attributes['inline-photoswipe']
					button.set({
						isOn: 'true' === isInlinePhotoswipeActive,
					})
				})

				button.on('execute', () => {
					const selection = editor.model.document.selection;
					const selectedElement = selection.getSelectedElement();

					if (isNil(selectedElement)) return

					if (!selectedElement.is('element', 'imageInline')) return

					let isOn = false

					// note: changes on selected element happen inplace
					const imageHtmlAttributes = selectedElement.getAttribute('htmlImgAttributes')
					if (isNil(imageHtmlAttributes.attributes)) {
						imageHtmlAttributes.attributes = {}
						imageHtmlAttributes.attributes['inline-photoswipe'] = 'true'
						isOn = true
					} else {
						if (isNil(imageHtmlAttributes.attributes['inline-photoswipe'])) {
							imageHtmlAttributes.attributes['inline-photoswipe'] = 'true'
							isOn = true
						} else {
							if ('true' === imageHtmlAttributes.attributes['inline-photoswipe']) {
								delete imageHtmlAttributes.attributes['inline-photoswipe']
								isOn = false
							} else {
								imageHtmlAttributes.attributes['inline-photoswipe'] = 'true'
								isOn = false
							}
						}
					}

					button.set({
						isOn
					})
				})

				return button

			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class InsertIconInlineCommand extends CKEDITOR.Command {
		execute(opts) {
			const editor = this.editor
			const selection = editor.model.document.selection

			const selectedElement = selection.getSelectedElement();
			let size = ''
			let color = ''

			if (selectedElement) {
				size = selectedElement.getAttribute('size')
				color = selectedElement.getAttribute('color')
			}

			let iconInlineData = Object.assign({},
				{ name: `#${opts.iconId}` },
				!_.isEmpty(size) ? { size } : null,
				!_.isEmpty(color) ? { color } : null
			)

			editor.model.change(writer => {
				editor.model.insertContent(
					writer.createElement('iconInline', iconInlineData)
				)
			})
		}

		// todo: implement refresh to define where the command can be executed
		// refresh() {
		// 	const model = this.editor.model
		// 	const selection = model.document.selection

		// 	const isAllowed = model.schema.checkChild(selection.focus.parent, '')
		// }
	}

	/**
	 * @since 2.2.0
	 */
	class RemoveIconInlineCommand extends CKEDITOR.Command {
		execute() {
			const editor = this.editor
			const selection = editor.model.document.selection
			const selectedElement = selection.getSelectedElement()

			if (!selectedElement) return
			if (!selectedElement.is('element', 'iconInline')) return

			editor.model.change(writer => {
				writer.remove(selectedElement)
			})
		}

		// todo: implement refresh method
		// refresh() {}
	}

	/**
	 * @since 2.2.0
	 */
	class IconInlineEditing extends CKEDITOR.Plugin {
		static get requires() {
			return [CKEDITOR.Widget]
		}

		init() {
			this._defineSchema()

			// this.editor.editing.view.addObserver(IconInlineLoadObserver)

			this._defineConverters()

			this.editor.commands.add('insertIconInline', new InsertIconInlineCommand(this.editor))
			this.editor.commands.add('removeIconInline', new RemoveIconInlineCommand(this.editor))

			this.editor.editing.mapper.on('viewToModelPosition', CKEDITOR.viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('l-svg-icons')))
		}

		_defineSchema() {
			const schema = this.editor.model.schema

			schema.register('iconInline', {
				inheritAllFrom: '$inlineObject',
				allowAttributes: ['name', 'size', 'color'],
			})
		}

		_defineConverters() {
			const conversion = this.editor.conversion

			conversion.for('upcast').add(dispatcher => {
				dispatcher.on('element:i', (evt, data, conversionApi) => {
					const {
						consumable,
						writer,
						safeInsert,
						convertChildren,
						updateConversionResult
					} = conversionApi

					const { viewItem } = data
					const iElementConsumable = { name: 'i', classes: 'l-svg-icons', attributes: 'style' };
					const svgElementConsumable = { name: 'svg', attributes: 'style' };
					const useElementConsumable = { name: 'use', attributes: ['xlink:href'] }

					if (!consumable.test(viewItem, iElementConsumable)) return

					if (1 !== viewItem.childCount) return

					const iFirstChildViewItem = viewItem.getChild(0);
					if (!iFirstChildViewItem.is('element', 'svg')) return

					if (!consumable.test(iFirstChildViewItem, svgElementConsumable)) return

					const svgFirstChildViewItem = iFirstChildViewItem.getChild(0)
					if (!svgFirstChildViewItem.is('element', 'use')) return
					if (!consumable.test(svgFirstChildViewItem, useElementConsumable)) return

					const viewItemStyle = viewItem.getStyle()
					const size = !isNil(viewItemStyle) && !isNil(viewItemStyle['font-size']) ? viewItemStyle['font-size'] : ''

					const svgItemStyle = iFirstChildViewItem.getStyle()
					const color = !isNil(svgItemStyle) && !isNil(svgItemStyle['fill']) ? svgItemStyle['fill'] : ''

					const name = svgFirstChildViewItem.getAttribute('xlink:href')

					let iconInlineData = Object.assign({},
						{ name },
						!_.isEmpty(size) ? { size } : null,
						!_.isEmpty(color) ? { color } : null
					)
					const iconInlineElement = writer.createElement('iconInline', iconInlineData)
					if (!safeInsert(iconInlineElement, data.modelCursor)) return

					consumable.consume(viewItem, iElementConsumable)
					consumable.consume(iFirstChildViewItem, svgElementConsumable)
					consumable.consume(svgFirstChildViewItem, useElementConsumable)

					convertChildren(viewItem, iconInlineElement)
					updateConversionResult(iconInlineElement, data)
				})
			})

			conversion.for('editingDowncast').elementToStructure({
				model: 'iconInline',
				view: (modelElement, conversionApi) => {
					const { writer } = conversionApi
					const name = modelElement.getAttribute('name')
					const color = modelElement.getAttribute('color')

					const domIconWithSymbol = document.querySelector(name)

					let iViewElementAttributes = Object.assign({},
						{ class: 'l-svg-icons' },
					)
					let svgElementAttributes = Object.assign({},
						!_.isEmpty(color) ? { style: `fill:${color}` } : null,
						{ viewBox: domIconWithSymbol.getAttribute('viewBox') },
						{ xmlns: domIconWithSymbol.getAttribute('xmlns') }
					)

					const iViewElement = writer.createContainerElement('i', iViewElementAttributes)

					const svgRawElement = writer.createRawElement('svg', svgElementAttributes, function (domElement) {
						domElement.innerHTML = domIconWithSymbol.innerHTML
					})
					writer.insert(writer.createPositionAt(iViewElement, 0), svgRawElement)

					// return iViewElement
					return CKEDITOR.toWidget(iViewElement, writer)
				}
			})
				.attributeToAttribute({
					model: {
						name: 'iconInline',
						key: 'size'
					},
					view: (value) => {
						if ('' === value) return null
						return {
							name: 'i',
							key: 'style',
							value: {
								'font-size': value
							}
						}
					}
				})
				.add((dispatcher) => {
					dispatcher.on('attribute:color', (evt, data, conversionApi) => {
						const { item } = data

						if (!item.is('element', 'iconInline')) return

						const color = item.getAttribute('color')

						const viewElement = conversionApi.mapper.toViewElement(item)

						const maybeSvgElement = viewElement.getChild(0)
						if ('svg' !== maybeSvgElement.name) return

						maybeSvgElement._setStyle('fill', color)
					})
					dispatcher.on('insert:iconInline', (evt, data, conversionApi) => {
						const iconInlineElement = data.item;

						this.editor.editing.view.document.fire(IconInlineEvents.IconInlineInserted, {
							iconInlineElement,
							conversionApi
						})
					})
				})

			conversion.for('dataDowncast').elementToStructure({
				model: 'iconInline',
				view: (modelElement, conversionApi) => {
					const { writer } = conversionApi
					const name = modelElement.getAttribute('name')
					const size = modelElement.getAttribute('size')
					const color = modelElement.getAttribute('color')

					let iViewElementAttributes = Object.assign({},
						{ class: 'l-svg-icons' },
						!_.isEmpty(size) ? { style: `font-size:${size}` } : null
					)
					let svgElementAttributes = Object.assign({},
						!_.isEmpty(color) ? { style: `fill:${color}` } : null
					)

					const iViewElement = writer.createContainerElement('i', iViewElementAttributes)
					const svgElement = writer.createContainerElement('svg', svgElementAttributes)
					const useElement = writer.createContainerElement('use', { 'xlink:href': name })

					writer.insert(writer.createPositionAt(iViewElement, 0), svgElement)
					writer.insert(writer.createPositionAt(svgElement, 0), useElement)
					writer.insert(writer.createPositionAt(useElement, 0), writer.createSlot())

					return iViewElement
				}
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class IconInlineUI extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const t = editor.t

			editor.ui.componentFactory.add('iconInline', (locale) => {
				const dropdownView = CKEDITOR.createDropdown(locale)

				dropdownView.buttonView.set({
					withText: false,
					label: t('Add icon'),
					icon: '<svg viewBox="0 0 306 306" id="C008-Star" xmlns="http://www.w3.org/2000/svg"><path d="M153 230.775l94.35 68.85-35.7-112.2 94.35-66.3H191.25L153 6.375l-38.25 114.75H0l94.35 66.3-35.7 112.2z"></path></svg>',
					tooltip: true
				})

				const iconInlineModels = getIconInlineModels()

				const items = new CKEDITOR.Collection()
				for (let i = 0; i < iconInlineModels.length; i++) {
					items.add({
						type: 'button',
						model: new CKEDITOR.Model(iconInlineModels[i])
					})
				}
				CKEDITOR.addListToDropdown(dropdownView, items)

				dropdownView.on('execute', (event) => {
					const buttonViewClicked = event.source
					const classToCheck = buttonViewClicked.class
					if (-1 === classToCheck.indexOf(BUILDER_ICON_CLASS_PREFIX)) return

					const iconId = classToCheck.replace(`${BUILDER_ICON_CLASS_PREFIX}-`, '')

					editor.execute('insertIconInline', { iconId })
					editor.editing.view.focus()
				})

				return dropdownView
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class IconInline extends CKEDITOR.Plugin {
		static get requires() {
			return [IconInlineEditing, IconInlineUI]
		}
	}

	/**
	 * @since 2.2.0
	 */
	class InlineImageRemove extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			
			editor.ui.componentFactory.add('inlineImageRemove', () => {

				const button = new CKEDITOR.ButtonView()
				button.set({
					tooltip: 'Photoswipe',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 100 100"><path d="M85.355 77.157L58.198 50l27.156-27.155a5.8 5.8 0 00.001-8.2 5.8 5.8 0 00-8.199 0L50 41.802 22.843 14.645a5.802 5.802 0 00-8.199 0 5.795 5.795 0 000 8.199l27.157 27.157-27.156 27.155a5.792 5.792 0 000 8.2 5.795 5.795 0 008.199 0l27.155-27.157 27.157 27.157a5.794 5.794 0 008.199 0 5.8 5.8 0 000-8.2z" fill-rule="nonzero"/></svg>'
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
	 * @param {Object} config 
	 * @returns Object
	 * @since 2.2.0
	 */
	function normalizeDeclarativeConfig( config ) {
		return config.map( item => _.isObject( item ) ? item.name : item );
	}

	/**
	 * @since 2.2.0
	 */
	class IconInlineToolbar extends CKEDITOR.Plugin {
		static get requires() {
			return [ CKEDITOR.WidgetToolbarRepository ]
		}

		isIconInlineWidget( viewElement ) {
			return CKEDITOR.isWidget(viewElement) && viewElement.is('element', 'i') && viewElement.hasClass('l-svg-icons')
		}

		afterInit() {
			const editor = this.editor
			const t = editor.t
			const widgetToolbarRepository = editor.plugins.get(CKEDITOR.WidgetToolbarRepository)
			
			widgetToolbarRepository.register('iconInline', {
				ariaLabel: t('Icon toolbar'),
				items: normalizeDeclarativeConfig(editor.config.get('iconInline.toolbar') || []),
				getRelatedElement: selection => { 
					const selectionPosition = selection.getFirstPosition();

					if ( !selectionPosition ) {
						return null;
					}

					const viewElement = selection.getSelectedElement();

					if ( viewElement && this.isIconInlineWidget( viewElement ) ) {
						return viewElement;
					}

					let parent = selectionPosition.parent;

					while ( parent ) {
						if ( parent.is( 'element' ) && this.isIconInlineWidget( parent ) ) {
							return parent;
						}

						parent = parent.parent;
					}

					return null;
				}
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class RemoveIconInline extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const t = editor.t

			editor.ui.componentFactory.add('removeIconInline', (locale) => {
				const button = new CKEDITOR.ButtonView(locale)
				button.set({
					tooltip: t('Remove Icon'),
					withText: false,
					icon: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color"><path d="M85.355 77.157L58.198 50l27.156-27.155a5.8 5.8 0 00.001-8.2 5.8 5.8 0 00-8.199 0L50 41.802 22.843 14.645a5.802 5.802 0 00-8.199 0 5.795 5.795 0 000 8.199l27.157 27.157-27.156 27.155a5.792 5.792 0 000 8.2 5.795 5.795 0 008.199 0l27.155-27.157 27.157 27.157a5.794 5.794 0 008.199 0 5.8 5.8 0 000-8.2z" fill-rule="nonzero"></path></svg>'
				})

				button.on('execute', () => {
					editor.execute('removeIconInline')
				})

				return button
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class ResizeIconInlineCommand extends CKEDITOR.Command {
		execute(options) {
			const editor = this.editor
			const selection = editor.model.document.selection
			const selectedElement = selection.getSelectedElement()

			if (!selectedElement) return
			if (!selectedElement.is('element', 'iconInline')) return

			editor.model.change(writer => {
				writer.setAttribute('size', options.size, selectedElement)
			})
		}

		// todo: implement refresh method
		// refresh() {}
	}

	/**
	 * @since 2.2.0
	 */
	class IconInlineResizeEditing extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const resizeIconInlineCommand = new ResizeIconInlineCommand(editor)

			this._registerSchema()
			// this._registerConverters()

			this.editor.commands.add('resizeIconInline', resizeIconInlineCommand)
		}

		_registerSchema() {
			if (this.editor.plugins.has('IconInlineEditing')) {
				this.editor.model.schema.extend('iconInline', { allowAttributes: 'width' });
			}
		}

		_registerConverters() {
			const editor = this.editor

			editor.conversion.for('downcast').add(dispatcher => {
				dispatcher.on('attribute:width:iconInline', (evt, data, conversionApi) => {
					if (!conversionApi.consumable.consume(data.item, evt.name)) {
						return
					}


				})
			})
		}
	}

	class IconInlineResizeHandles extends CKEDITOR.Plugin {
		init() {
			const command = this.editor.commands.get('resizeIconInline')
			this.bind('isEnabled').to(command)

			this._setupResizerCreator()
		}

		_setupResizerCreator() {
			const editor = this.editor
			const editingView = editor.editing.view

			this.listenTo(editingView.document, IconInlineEvents.IconInlineInserted, (evt, data) => {
				const { iconInlineElement, conversionApi } = data

				const domConverter = editor.editing.view.domConverter
				const widgetView = conversionApi.mapper.toViewElement(iconInlineElement)
				let resizer = editor.plugins.get(CKEDITOR.WidgetResize).getResizerByViewElement(widgetView);
				if (resizer) {
					resizer.redraw()
					return
				}

				const mapper = editor.editing.mapper;
				const iconInlineModel = mapper.toModelElement(widgetView);

				resizer = editor.plugins
					.get(CKEDITOR.WidgetResize)
					.attachTo({
						unit: 'px',
						modelElement: iconInlineModel,
						viewElement: widgetView,
						editor,
						getHandleHost(domWidgetElement) {
							return domWidgetElement
						},
						getResizeHost() {
							return domConverter.mapViewToDom(mapper.toViewElement(iconInlineModel.parent))
						},
						isCentered: () => true,
						onCommit(newValue) {
							editingView.change(writer => {
								writer.removeClass(RESIZED_ICON_CLASS, widgetView)
							})
							editor.execute('resizeIconInline', { size: newValue })
						}
					})

				resizer.on('updateSize', () => {
					if (!isNil(resizer.state.proposedWidth)) {
						editor.execute('resizeIconInline', { size: `${resizer.state.proposedWidth}px` })
					}
					if (!widgetView.hasClass(RESIZED_ICON_CLASS)) {
						editingView.change(writer => {
							writer.addClass(RESIZED_ICON_CLASS, widgetView)
						})
					}
				})

				resizer.bind('isEnabled').to(this)
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class IconInlineResize extends CKEDITOR.Plugin {
		static get requires() {
			return [ IconInlineResizeEditing, IconInlineResizeHandles ]
		}
	}

	/**
	 * @since 2.2.0
	 */
	class ColorIconInlineCommand extends CKEDITOR.Command {
		execute(options) {
			const editor = this.editor
			const selection = editor.model.document.selection
			const selectedElement = selection.getSelectedElement()

			if (!selectedElement) return
			if (!selectedElement.is('element', 'iconInline')) return

			editor.model.change(writer => {
				if (isNil(options.color)) {
					writer.removeAttribute('color', selectedElement)
				} else {
					writer.setAttribute('color', options.color, selectedElement)
				}
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class IconInlineColor extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor

			this.editor.commands.add('colorIconInline', new ColorIconInlineCommand(this.editor))

			editor.commands.get('fontColor').on('execute', (event, data) => {
				if (isUndefined(data[0].value)) return
				const modelElement = editor.model.document.selection.getSelectedElement()
				if (!(modelElement && modelElement.is('element', 'iconInline'))) return

				editor.execute('colorIconInline', {
					color: data[0].value
				})
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class MediaEmbedResizeCommand extends CKEDITOR.Command {
		execute(options) {
			const editor = this.editor
			const selection = editor.model.document.selection
			const selectedElement = selection.getSelectedElement()

			if (!selectedElement) return
			if (!selectedElement.is('element', 'media')) return

			editor.model.change(writer => {
				writer.setAttribute('width', options.width, selectedElement)
			})
		}

		// todo: implement refresh method
		// refresh() {}
	}

	/**
	 * @since 2.2.0
	 */
	class MediaEmbedObserver extends CKEDITOR.Observer {
		observe(domRoot) {
			this.listenTo(domRoot, 'load', (event, domEvent) => {
				const domElement = domEvent.target

				if (this.checkShouldIgnoreEventFromTarget(domElement)) {
					return
				}

				if (domElement.tagName == 'IFRAME') {
					this._fireEvents(domEvent)
				}
			}, { useCapture: true })
		}

		_fireEvents(domEvent) {
			if (this.isEnabled) {
				this.document.fire('layoutChanged')
				this.document.fire('iframeLoaded', domEvent)
			}
		}

		stopObserving(domRoot) {
			this.stopListening(domRoot)
		}
	}

	/**
	 * @since 2.2.0
	 */
	class MediaEmbedResizeEditing extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const mediaEmbedResizeCommand = new MediaEmbedResizeCommand(editor)

			editor.editing.view.addObserver(MediaEmbedObserver)

			this._registerSchema()
			this._registerConverters()

			this.editor.commands.add('mediaEmbedResize', mediaEmbedResizeCommand)
		}

		_registerSchema() {
			if (this.editor.plugins.has('MediaEmbedEditing')) {
				this.editor.model.schema.extend('media', { allowAttributes: 'width' });
			}
		}

		_registerConverters() {
			const editor = this.editor

			editor.conversion.for('downcast').add(dispatcher => {
				dispatcher.on('attribute:width:media', (evt, data, conversionApi) => {
					if (!conversionApi.consumable.consume(data.item, evt.name)) {
						return;
					}

					const viewWriter = conversionApi.writer;
					const figure = conversionApi.mapper.toViewElement(data.item);

					if (data.attributeNewValue !== null) {
						viewWriter.setStyle('width', data.attributeNewValue, figure);
						viewWriter.addClass('media_resized', figure);
					} else {
						viewWriter.removeStyle('width', figure);
						viewWriter.removeClass('media_resized', figure);
					}
				})
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class MediaEmbedResizeHandles extends CKEDITOR.Plugin {
		init() {
			const command = this.editor.commands.get('mediaEmbedResize')
			this.bind('isEnabled').to(command)

			this._setupResizerCreator()
		}

		_setupResizerCreator() {
			const editor = this.editor
			const editingView = editor.editing.view
			// const editingModel = editor.editing.model

			this.listenTo(editingView.document, 'iframeLoaded', (evt, domEvent) => {
				if (!domEvent.target.matches(RESIZABLE_MEDIA_EMBED_CSS_SELECTOR)) return

				const domConverter = editor.editing.view.domConverter
				const iframeView = domConverter.domToView(domEvent.target)
				const widgetView = iframeView.findAncestor({ classes: MEDIA_EMBED_WIDGETS_CLASSES_MATCH_REGEXP })
				let resizer = editor.plugins.get(CKEDITOR.WidgetResize).getResizerByViewElement(widgetView);

				if (resizer) {
					resizer.redraw()
					return
				}

				const mapper = editor.editing.mapper;
				const mediaModel = mapper.toModelElement(widgetView)

				resizer = editor.plugins
					.get(CKEDITOR.WidgetResize)
					.attachTo({
						unit: 'px',
						modelElement: mediaModel,
						viewElement: widgetView,
						editor,
						getHandleHost(domWidgetElement) {
							return domWidgetElement.querySelector('iframe')
						},
						getResizeHost() {
							return domConverter.mapViewToDom(mapper.toViewElement(mediaModel.parent))
						},
						isCentered: () => true,
						onCommit(newValue) {
							editingView.change(writer => {
								writer.removeClass(RESIZED_MEDIA_EMBED_CLASS, widgetView)
							})
							editor.execute('mediaEmbedResize', { width: newValue })
						}
					})

				resizer.on('updateSize', () => {
					if (!widgetView.hasClass(RESIZED_MEDIA_EMBED_CLASS)) {
						editingView.change(writer => {
							writer.addClass(RESIZED_MEDIA_EMBED_CLASS, widgetView)
						})
					}
				})

				resizer.bind('isEnabled').to(this)
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class MediaEmbedResize extends CKEDITOR.Plugin {
		static get requires() {
			return [MediaEmbedResizeEditing, MediaEmbedResizeHandles]
		}
	}

	/**
	 * @since 2.2.0
	 */
	class MediaEmbedLegacy extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor

			editor.conversion.for('upcast').elementToElement({
				view: {
					name: 'iframe'
				},
				model: (viewElement, conversionApi) => {
					const src = viewElement.getAttribute('src')
					const { writer } = conversionApi

					return writer.createElement('media', {
						url: src
					})
				}
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class HTMLEditing extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const t = editor.t

			editor.ui.componentFactory.add('htmlEditing', (locale) => {
				const button = new CKEDITOR.ButtonView(locale)

				button.set({
					tooltip: 'Edit HTML',
					withText: false,
					icon: '<svg viewBox="0 0 20 20" id="A008-Code" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M14 5.846V4l6 5.94L14 16v-2.03l4-4.03zM6 14.154V16l-6-5.94L6 4v2.03l-4 4.03zM8.508 20H6.5l5.02-20h1.98z"/></g></svg>'
				})

				button.on('execute', () => {
					const data = {
						eventName: 'rexlive:openHTMLEditor',
						htmlContent: editor.data.get()
					}
					Rexbuilder_Util_Editor.sendParentIframeMessage(data);
					ckeditorStateMachine.toHTMLEditOpen()
				})

				return button
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class TextGradientCommand extends CKEDITOR.Command {
		attributeKey = 'textgradient'

		refresh() {
			const model = this.editor.model
			const doc = model.document

			// this.value = this._getValueFromFirstAllowedNode()
			this.value = doc.selection.getAttribute(this.attributeKey)
			this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, this.attributeKey)
		}

		execute(options) {
			const model = this.editor.model
			const doc = model.document
			const selection = doc.selection
			const value = options.gradient

			model.change(writer => {
				if ( selection.isCollapsed ) {
					if ( value ) {
						writer.setSelectionAttribute( this.attributeKey, value );
					} else {
						writer.removeSelectionAttribute( this.attributeKey );
					}
				} else {
					const ranges = model.schema.getValidRanges( selection.getRanges(), this.attributeKey );

					for ( const range of ranges ) {
						if ( value ) {
							writer.setAttribute( this.attributeKey, value, range );
						} else {
							writer.removeAttribute( this.attributeKey, range );
						}
					}
				}
			})
		}

		_getValueFromFirstAllowedNode() {
			const model = this.editor.model;
			const schema = model.schema;
			const selection = model.document.selection;

			if (selection.isCollapsed) {
				return selection.hasAttribute(this.attributeKey);
			}

			for (const range of selection.getRanges()) {
				for (const item of range.getItems()) {
					if (schema.checkAttribute(item, this.attributeKey)) {
						return item.hasAttribute(this.attributeKey);
					}
				}
			}

			return false;
		}
	}

	const TEXT_GRADIENT = 'textgradient'

	/**
	 * @since 2.2.0
	 */
	class TextGradientEditing extends CKEDITOR.Plugin {
		init() {
			this._defineSchema()
			this._defineConverters()
		}

		_defineSchema() {
			const schema = this.editor.model.schema

			schema.extend('$text', { allowAttributes: TEXT_GRADIENT })
			schema.setAttributeProperties(TEXT_GRADIENT, {
				isFormatting: true,
				copyOnEnter: true
			})
		}

		_defineConverters() {
			const editor = this.editor
			const conversion = editor.conversion

			conversion.for('upcast').elementToAttribute({
				view: {
					name: 'span',
					attributes: ['data-gradient'],
					classes: ['text-gradient'],
					styles: {
						'background': /.+/
					}
				},
				model: {
					key: TEXT_GRADIENT,
					value: (viewElement) => viewElement.getAttribute('data-gradient')
				}
			})

			conversion.for('downcast').attributeToElement({
				model: TEXT_GRADIENT,
				view: (modelAttributeValue, { writer }) => {
	  				const { gradientType, direction, handlers, inputSize } = Rexbuilder_Gradient_Utils.getGradientValues(modelAttributeValue)
					const style = Rexbuilder_Gradient_Utils.getMarkup(gradientType, direction, handlers, inputSize)
					const view = writer.createAttributeElement('span', {
						'data-gradient': modelAttributeValue,
						class: ['text-gradient'],
						style: style
					})
					return view
				}
			})

			editor.commands.add(TEXT_GRADIENT, new TextGradientCommand(editor))
		}
	}

	/**
	 * @since 2.2.0
	 */
	class TextGradientUI extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const t = editor.t
			editor.ui.componentFactory.add('textGradient', (locale) => {
				const command = editor.commands.get(TEXT_GRADIENT)
				const view = new CKEDITOR.ButtonView(locale)

				view.set({
					// label: 'TextGradient',
					tooltip: 'TextGradient',
					withText: false,
					icon: '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 384 384" viewBox="0 0 384 384"><path d="M213.333 170.667H256v42.667h-42.667zM256 128h42.667v42.667H256z"/><path d="M341.333 0H42.667C19.2 0 0 19.2 0 42.667v298.667C0 364.8 19.2 384 42.667 384h298.667C364.8 384 384 364.8 384 341.333V42.667C384 19.2 364.8 0 341.333 0zM128 320H85.333v-42.667H128V320zm85.333 0h-42.667v-42.667h42.667V320zm85.334 0H256v-42.667h42.667V320zm42.666-149.333h-42.667v42.667h42.667V256h-42.667v-42.667H256V256h-42.667v-42.667h-42.667V256H128v-42.667H85.333V256H42.667v-42.667h42.667v-42.667H42.667v-128h298.667v128.001z"/><path d="M170.667 128h42.667v42.667h-42.667zM128 170.667h42.667v42.667H128zM85.333 128H128v42.667H85.333z"/></svg>'
				})

				view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled')

				this.listenTo(view, 'execute', () => {
					const editorElement = ckeditorStateMachine.editorInstance.sourceElement
					const block = parents(editorElement, `.${GRID_STACK_ITEM_CLASSNAME}`).pop()
					const section = parents(editorElement, `.${SECTION_CLASSNAME}`).pop()
					const rex_block_id = block.getAttribute(BLOCK_ID_ATTRIBUTE_NAME);
					const sectionID = section.getAttribute(SECTION_ID_ATTRIBUTE_NAME);
					const modelNumber =
						typeof section.getAttribute('data-rexlive-model-number') != 'undefined'
							? section.getAttribute('data-rexlive-model-number')
							: '';
						
					const selection = editor.model.document.selection;
					const selectionTextGradientAttribute = selection.getAttribute('textgradient')
					const bgGradientCol = isUndefined(selectionTextGradientAttribute) ? "null" : selectionTextGradientAttribute

					const settings = {
						blockData: {
							gradient: bgGradientCol,
							target: {
								sectionID: sectionID,
								modelNumber: modelNumber,
								rexID: rex_block_id
							}
						}
					};

					const data = {
						eventName: 'rexlive:editTextGradient',
						activeBlockData: settings
					};

					Rexbuilder_Util_Editor.sendParentIframeMessage(data);
					ckeditorStateMachine.toTextGradientOpen()
				})

				return view
			})
		}
	}

	/**
	 * @since 2.2.0
	 */
	class TextGradient extends CKEDITOR.Plugin {
		static get requires() {
			return [ TextGradientEditing, TextGradientUI ]
		}
	}

	/**
	 * @since 2.2.0
	 */
	class CloseEditor extends CKEDITOR.Plugin {
		init() {
			const editor = this.editor
			const t = editor.t

			editor.ui.componentFactory.add('closeEditor', (locale) => {
				const button = new CKEDITOR.ButtonView(locale)

				button.set({
					tooltip: 'Close editor',
					withText: false,
					icon: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color"><path d="M85.355 77.157L58.198 50l27.156-27.155a5.8 5.8 0 00.001-8.2 5.8 5.8 0 00-8.199 0L50 41.802 22.843 14.645a5.802 5.802 0 00-8.199 0 5.795 5.795 0 000 8.199l27.157 27.157-27.156 27.155a5.792 5.792 0 000 8.2 5.795 5.795 0 008.199 0l27.155-27.157 27.157 27.157a5.794 5.794 0 008.199 0 5.8 5.8 0 000-8.2z" fill-rule="nonzero"></path></svg>'
				})

				button.on('execute', () => {
					if (!ckeditorStateMachine.isEditorActive()) return
					restoreBlockTools(ckeditorStateMachine.editorInstance.sourceElement)
					destroyEditorInstance(ckeditorStateMachine.editorInstance.sourceElement)
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
		const editor = CKEDITOR.InlineEditor
			.create(el, {
				plugins: [CKEDITOR.Essentials, CKEDITOR.Paragraph, CKEDITOR.Alignment, CKEDITOR.Bold, CKEDITOR.Italic, CKEDITOR.Underline, CKEDITOR.Heading, CKEDITOR.FontColor, CKEDITOR.GeneralHtmlSupport, CKEDITOR.HorizontalLine, CKEDITOR.Link, CKEDITOR.Image, CKEDITOR.ImageResize, CKEDITOR.ImageStyle, CKEDITOR.ImageToolbar, CKEDITOR.Undo, CKEDITOR.MediaEmbed, EnableAlignmentLeft, WPImageUpload, WpImageEdit, InlineImagePhotoswipe, InlineImageRemove, IconInline, IconInlineToolbar, RemoveIconInline, IconInlineResize, IconInlineColor, MediaEmbedResize, MediaEmbedLegacy, HTMLEditing, TextGradient, CloseEditor],
				toolbar: [
					'heading',
					'|',
					'alignment',
					'fontColor',
					'textGradient',
					'bold',
					'italic',
					'underline',
					'|',
					'link',
					'wpImageUpload',
					'iconInline',
					'mediaEmbed',
					'|',
					'htmlEditing',
					'|',
					'undo',
					'redo',
					'|',
					'horizontalLine',
					'|',
					'closeEditor'
				],
				heading: {
					options: [
						{ model: 'paragraph', title: 'P', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'H1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'H2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'H3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'H4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'H5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'H6', class: 'ck-heading_heading6' }
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
				iconInline: {
					toolbar: [
						'fontColor',
						'iconInline',
						'removeIconInline'
					]
				},
				mediaEmbed: {
					previewsInData: true
				},
				placeholder: 'Type your text here'
			})
			.then(editor => {
				console.log('Editor was initialized', editor);
				const section = parents(editor.sourceElement, `.${SECTION_CLASSNAME}`).pop()
				ckeditorStateMachine.setStateMachineContext(editor, section.classList.contains(MODEL_CLASSNAME))
				ckeditorStateMachine.toActiveState()

				ckeditorStateMachine.editorInstance.focus()

				ckeditorStateMachine.editorInstance.ui.focusTracker.on('change:isFocused', function (eventInfo, name, value, oldValue) {
					if (value) return
					if (ckeditorStateMachine.isEditorActive()) {
						restoreBlockTools(ckeditorStateMachine.editorInstance.sourceElement)
						destroyEditorInstance(ckeditorStateMachine.editorInstance.sourceElement)
					}
				})

				/**
				 * Listen to changes on the editor
				 */
				ckeditorStateMachine.editorInstance.model.document.on('change:data', () => {
					if (!ckeditorStateMachine.isEditorActive()) return
					triggerEditorContentChanged()
				})

				/**
				 * Hack to remove ckeditor class that adds some styles to contents that interfeer with theme styles
				 */
				ckeditorStateMachine.editorInstance.editing.view.change( writer => {
					const viewEditableRoot = editor.editing.view.document.getRoot();

					writer.removeClass('ck-editor__editable_inline', viewEditableRoot);
				});
			})
			.catch(error => {
				console.error(error.stack);
			});
	}

	/**
	 * Send event to parent iframe telling the contents are changed
	 * @since 2.2.0
	 */
	function triggerEditorContentChanged() {
		const data = {
			eventName: 'rexlive:edited',
			modelEdited: ckeditorStateMachine.isSectionModel
		}
		Rexbuilder_Util_Editor.sendParentIframeMessage(data);
	}

	/**
	 * @param {Element} editorElement element that contains the editor
	 * @returns void
	 * @since 2.2.0
	 */
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

	/**
	 * Destroy the editor instance and save the html on the block content
	 * @param {Element} editorContentElement element that contains the editor
	 * @since 2.2.0
	 */
	function destroyEditorInstance(editorContentElement) {
		const editorData = ckeditorStateMachine.editorInstance.data.get()
		ckeditorStateMachine.editorInstance.destroy().then(() => {
			ckeditorStateMachine.clearStateMachineContext()
			editorContentElement.innerHTML = editorData
			ckeditorStateMachine.toDeactiveState()
		})
	}

	function initListeners() {
		/**
		 * @since 2.2.0
		 */
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
					if (!isNil(ckeditorStateMachine.editorInstance)) {
						restoreBlockTools(ckeditorStateMachine.editorInstance.sourceElement)
						destroyEditorInstance(ckeditorStateMachine.editorInstance.sourceElement)
					}
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

	/**
	 * Handling data updated from ace editor modal
	 * @param {Object} data object with html content updated with editor
	 * @returns void
	 * @since 2.2.0
	 */
	function handleSaveHTMLContent(data) {
		if (ckeditorStateMachine.isEditorDeactive()) return
		ckeditorStateMachine.editorInstance.data.set(data.customHTML, {batchType: {isUndoable: true}})
		ckeditorStateMachine.editorInstance.focus()
		triggerEditorContentChanged()
	}

	/**
	 * 
	 * @param {Object} data 
	 * @since 2.2.0
	 */
	function handleSetTextGradient(data) {
		if (ckeditorStateMachine.isEditorDeactive()) return
		ckeditorStateMachine.editorInstance.focus()
		ckeditorStateMachine.editorInstance.model.change(() => {
			ckeditorStateMachine.editorInstance.execute('textgradient', {
				gradient: data.value
			})
			// ckeditorStateMachine.toTextGradientClose()
		})
	}

	/**
	 * Handling events concerning ckeditor
	 * @param {Object} event event data
	 * @since 2.2.0
	 */
	function handleEvent(event) {
		switch (event.name) {
			case 'rexlive:ckeditor:inlineImageEdit':
				handleInlineImageEdit(event.data)
				break
			case 'rexlive:ckeditor:inlineImageClose':
				ckeditorStateMachine.toWpImageUploadClose()
				break
			case 'rexlive:ckeditor:saveHTMLContent':
				handleSaveHTMLContent(event.data)
				break
			case 'rexlive:ckeditor:closeHTMLEditorModal':
				ckeditorStateMachine.toHTMLEditClose()
				break
			case 'rexlive:ckeditor:setTextGradient':
				handleSetTextGradient(event.data)
				break
			case 'rexlive:ckeditor:closeTextGradientModal':
				ckeditorStateMachine.toTextGradientClose()
				break
			case 'rexlive:ckeditor:closeModal':
				ckeditorStateMachine.toActiveState()
				break
			default:
				break;
		}
	}

	function init() {
		console.log('CKEditor_Handler 156')
		initListeners()
	}

	function load() { }

	return {
		init,
		load,
		handleEvent
	}
})(jQuery);