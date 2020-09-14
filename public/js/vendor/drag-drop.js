/**
 * @typedef 	{object}	MouseCoords
 * @property	{number}	xCoord				The x coordinate of the pointer.
 * @property	{number}	yCoord				The y coordinate of the pointer.
 */

/**
 * @typedef 	{object}	MousePercentage
 * @property	{number}	xPercentage		The x coordinate of the pointer.
 * @property	{number}	yPercentage		The y coordinate of the pointer.
 */

/**
 * @typedef 	{object}	ElementData
 * @property	{number}	x
 * @property	{number}	y
 * @property	{string}	position
 */

(function (window, factory) {
	'use strict';
	window.DragDrop = factory(window);
})('undefined' !== typeof window ? window : this, function () {
	/**
	 * @type		{MousePercentage}
	 * @private
	 */
	var mousePercents;

	/**
	 * Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
	 * @type		{{x: number, y: number}}
	 * @private
	 */
	var breakPointNumber = {
		x: 10,
		y: 10
	};

	/**
	 * @type		{{x: number, y: number}}
	 * @private
	 */
	var customBreakPoints = {
		x: 50,
		y: 50
	};

	/**
	 * @type		{boolean}
	 * @private
	 */
	var fixedBreakPoints = false;

	var voidElements = [
		'i',
		'area',
		'base',
		'br',
		'col',
		'command',
		'embed',
		'hr',
		'img',
		'input',
		'keygen',
		'link',
		'meta',
		'param',
		'video',
		'iframe',
		'source',
		'track',
		'wbr'
	];
	var voidElementsSelector = voidElements.join(',');

	/**
	 * Represent a Drag & Drop helper.
	 *
	 * @interface
	 */
	function DragDrop() {
		/**
		 * TODO Make this private
		 * @type		{[JQuery, DOMRect, MouseCoords][]}
		 * @public
		 */
		this.dragoverqueue = [];
	}

	/**
	 *
	 * @param		{JQuery}			$element
	 * @param		{DOMRect}			elementRect
	 * @param		{MouseCoords}	mousePos
	 * @returns	{MousePercentage}
	 */
	DragDrop.getMouseBearingsPercentage = function ($element, elementRect, mousePos) {
		if (!elementRect) {
			elementRect = $element.get(0).getBoundingClientRect();
		}

		return {
			xPercentage: ((mousePos.xCoord - elementRect.left) / (elementRect.right - elementRect.left)) * 100,
			yPercentage: ((mousePos.yCoord - elementRect.top) / (elementRect.bottom - elementRect.top)) * 100
		};
	};

	/**
	 * @param {JQuery}	$element
	 */
	DragDrop.checkVoidElement = function ($element) {
		return $element.is(voidElementsSelector);
	};

	/**
	 * @param 	{ElementData}	elementData
	 * @param 	{number} 			mouseX
	 * @param 	{number} 			mouseY
	 * @returns	{number}
	 */
	DragDrop.calculateDistance = function (elementData, mouseX, mouseY) {
		return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
	};

	/**
	 * @param {document}	context
	 */
	DragDrop.removeAllPlaceholders = function (context) {
		var placeholders = Array.prototype.slice.call(context.querySelectorAll('.drop-marker'));

		placeholders.forEach(function (placeholder) {
			placeholder.parentNode.removeChild(placeholder);
		});
	};

	/**
	 * @param {JQuery}		$element
	 * @param {string}		position
	 * @param {document}	context
	 */
	DragDrop.addContainerContextMarker = function ($element, position, context) {
		var $contextMarker = this.getContextMarker();

		this.clearContainerContextMarker(context);

		if ($element.is('html,body')) {
			position = 'inside';
			// $element = Rexbuilder_Util_Admin_Editor.$frameBuilder.contents();
			$element = $(Rexbuilder_Util_Admin_Editor.frameBuilder.contentDocument);
		}

		switch (position) {
			case 'inside':
				this.positionContextMarker($contextMarker, $element, context);

				if ($element.hasClass('stackhive-nodrop-zone')) {
					$contextMarker.addClass('invalid');
				}

				var name = this.getElementName($element);

				Array.prototype.slice
					.call($contextMarker.get(0).querySelectorAll('[data-dragcontext-marker-text]'))
					.forEach(function (text) {
						text.innerHTML = name;
					});

				if (0 !== context.querySelectorAll('[data-sh-parent-marker]').length) {
					// TODO
					Rexbuilder_Util_Admin_Editor.$frameBuilder
						.contents()
						.find('[data-sh-parent-marker]')
						.first()
						.before($contextMarker);
				}
				break;
			case 'sibling':
				this.positionContextMarker($contextMarker, $element.parent(), context);
				if ($element.parent().hasClass('stackhive-nodrop-zone')) {
					$contextMarker.addClass('invalid');
				}

				var name = this.getElementName($element.parent());

				Array.prototype.slice
					.call($contextMarker.get(0).querySelectorAll('[data-dragcontext-marker-text]'))
					.forEach(function (text) {
						text.innerHTML = name;
					});

				$contextMarker.get(0).setAttribute('data-dragcontext-marker', name.toLowerCase());

				if (0 !== context.querySelectorAll('[data-sh-parent-marker]').length) {
					// TODO
					Rexbuilder_Util_Admin_Editor.$frameBuilder
						.contents()
						.find('[data-sh-parent-marker]')
						.first()
						.before($contextMarker);
				}
				break;
			default:
				break;
		}
	};

	/**
	 * @returns	{JQuery}
	 */
	DragDrop.getContextMarker = function () {
		return $('<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>');
	};

	/**
	 * @param	{JQuery}		$contextMarker
	 * @param	{JQuery}		$element
	 * @param	{document}	context
	 */
	DragDrop.positionContextMarker = function ($contextMarker, $element, context) {
		var rect = $element.get(0).getBoundingClientRect();
		$contextMarker.css({
			height: rect.height + 4 + 'px',
			width: rect.width + 4 + 'px',
			// ! Vedere come fare
			// TODO Later
			top: rect.top + $frameContentWindow.scrollTop() - 2 + 'px',
			left: rect.left + $frameContentWindow.scrollLeft() - 2 + 'px'
		});

		// if (rect.top + Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find('body').scrollTop() < 24)
		if (rect.top + context.body.scrollTop < 24) {
			$contextMarker.find('[data-dragcontext-marker-text]').css('top', '0px');
		}
	};

	/**
	 * @param {document}	context
	 */
	DragDrop.clearContainerContextMarker = function (context) {
		// Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find('[data-dragcontext-marker]').remove();
		var contextMarkers = Array.prototype.slice.call(context.querySelectorAll('[data-dragcontext-marker]'));

		contextMarkers.forEach(function (contextMarker) {
			contextMarker.parentNode.removeChild(contextMarker);
		});
	};

	/**
	 * @param {JQuery}		$element
	 * @param {string}		position
	 * @param {JQuery}		$placeholder
	 * @param {document}	context
	 */
	DragDrop.addPlaceHolder = function ($element, position, $placeholder, context) {
		if (!$placeholder) {
			$placeholder = this.getPlaceHolder();
		}

		this.removeAllPlaceholders(context);

		var whereAddContainerText;

		switch (position) {
			case 'before':
				// Buttons have to be inside grid-stack-row
				if ($element.hasClass('grid-stack-row')) {
					$element.prepend($placeholder);
				} else {
					$element.before($placeholder);
				}

				whereAddContainerText = 'sibling';
				break;
			case 'after':
				// Buttons have to be inside grid-stack-row
				if ($element.hasClass('grid-stack-row')) {
					$element.append($placeholder);
				} else {
					$element.after($placeholder);
				}

				whereAddContainerText = 'sibling';
				break;
			case 'inside-prepend':
				$element.prepend($placeholder);

				whereAddContainerText = 'inside';
				break;
			case 'inside-append':
				$element.append($placeholder);

				whereAddContainerText = 'inside';
				break;
		}

		this.addContainerContextMarker($element, whereAddContainerText, context);
	};

	/**
	 * @param		{JQuery}	$element
	 * @param		{string}	direction
	 * @returns	{JQuery}
	 */
	DragDrop.findValidParent = function ($element, direction) {
		switch (direction) {
			case 'left':
				while (true) {
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();

					if (
						$element.is('body') ||
						$element.hasClass('grid-stack-row') ||
						$tempElement.hasClass('rex-buttons-paragraph')
					) {
						return $element;
					}

					if (Math.abs(tempelementRect.left - elementRect.left) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-button-wrapper').length != 0) {
							return $element.parents('.rex-button-wrapper').eq(0);
						}
						return $element;
					}
				}
				break;
			case 'right':
				while (true) {
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();
					if (
						$element.is('body') ||
						$element.hasClass('grid-stack-row') ||
						$tempElement.hasClass('rex-buttons-paragraph')
					) {
						return $element;
					}
					if (Math.abs(tempelementRect.right - elementRect.right) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-button-wrapper').length != 0) {
							return $element.parents('.rex-button-wrapper').eq(0);
						}
						return $element;
					}
				}
				break;
			case 'top':
				while (true) {
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();
					if (
						$element.is('body') ||
						$element.hasClass('grid-stack-row') ||
						$tempElement.hasClass('rex-buttons-paragraph')
					) {
						return $element;
					}
					if (Math.abs(tempelementRect.top - elementRect.top) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-button-wrapper').length != 0) {
							return $element.parents('.rex-button-wrapper').eq(0);
						}
						return $element;
					}
				}
				break;
			case 'bottom':
				while (true) {
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();
					if (
						$element.is('body') ||
						$element.hasClass('grid-stack-row') ||
						$tempElement.hasClass('rex-buttons-paragraph')
					)
						return $element;
					if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-button-wrapper').length != 0) {
							return $element.parents('.rex-button-wrapper').eq(0);
						}
						return $element;
					}
				}
				break;
			default:
				break;
		}
	};

	/**
	 *
	 * @param {JQuery}					$targetElement
	 * @param {MousePercentage}	mousePercents
	 * @param {MouseCoords}			mousePos
	 * @param {document}				context
	 */
	DragDrop.decideBeforeAfter = function ($targetElement, mousePercents, mousePos, context) {
		if (mousePos) {
			mousePercents = this.getMouseBearingsPercentage($targetElement, null, mousePos);
		}

		var targetElementDisplay = $targetElement.css('display');

		var isInline =
			targetElementDisplay === 'inline' ||
			targetElementDisplay === 'inline-block' ||
			targetElementDisplay === 'inline-flex';

		if ($targetElement.is('br')) {
			isInline = false;
		}

		if (isInline) {
			if (mousePercents.xPercentage < 50) {
				return this.placeBefore($targetElement, context);
			} else {
				return this.placeAfter($targetElement, context);
			}
		} else {
			if (mousePercents.yPercentage < 50) {
				return this.placeBefore($targetElement, context);
			} else {
				return this.placeAfter($targetElement, context);
			}
		}
	};

	/**
	 * @param {JQuery}		$element
	 * @param {document}	context
	 */
	DragDrop.placeInside = function ($element, context) {
		var $placeholder = this.getPlaceHolder();

		$placeholder.addClass('horizontal').css('width', $element.width() + 'px');
		this.addPlaceHolder($element, 'inside-append', $placeholder, context);
	};

	/**
	 * @param {JQuery}		$element
	 * @param {document}	context
	 */
	DragDrop.placeBefore = function ($element, context) {
		console.log('place before new', $element.get(0));
		var $placeholder = this.getPlaceHolder();
		var elementDisplay = $element.css('display');
		var inlinePlaceholder =
			elementDisplay == 'inline' || elementDisplay == 'inline-block' || elementDisplay == 'inline-flex';

		if ($element.is('br')) {
			inlinePlaceholder = false;
		} else if ($element.is('td,th')) {
			$placeholder.addClass('horizontal').css('width', $element.width() + 'px');
			return this.addPlaceHolder($element, 'inside-prepend', $placeholder, context);
		}

		if (inlinePlaceholder) {
			$placeholder.addClass('vertical').css('height', $element.innerHeight() + 'px');
		} else {
			$placeholder.addClass('horizontal').css('width', $element.parent().width() + 'px');
		}

		this.addPlaceHolder($element, 'before', $placeholder, context);
	};

	/**
	 * @param {JQuery}		$element
	 * @param {document}	context
	 */
	DragDrop.placeAfter = function ($element, context) {
		console.log('place after', $element.get(0));
		var $placeholder = this.getPlaceHolder();
		var elementDisplay = $element.css('display');
		var inlinePlaceholder =
			elementDisplay === 'inline' || elementDisplay === 'inline-block' || elementDisplay === 'inline-flex';

		if ($element.is('br')) {
			inlinePlaceholder = false;
		} else if ($element.is('td,th')) {
			$placeholder.addClass('horizontal').css('width', $element.width() + 'px');
			return this.addPlaceHolder($element, 'inside-append', $placeholder, context);
		}
		if (inlinePlaceholder) {
			$placeholder.addClass('vertical').css('height', $element.innerHeight() + 'px');
		} else {
			$placeholder.addClass('horizontal').css('width', $element.parent().width() + 'px');
		}
		this.addPlaceHolder($element, 'after', $placeholder, context);
	};

	/**
	 * @param {JQuery} $container
	 * @param {number} clientX
	 * @param {number} clientY
	 */
	DragDrop.findNearestElement = function ($container, clientX, clientY) {
		var that = this;
		var previousElData = null;
		var $childrenElement = $container.children(':not(.drop-marker,[data-dragcontext-marker])');

		if ($childrenElement.length > 0) {
			$childrenElement.each(function (index, child) {
				if ($(child).is('.drop-marker')) return;

				var offset = child.getBoundingClientRect();
				var distance = 0;
				var distance1,
					distance2 = null;
				var position = '';
				var xPosition1 = offset.left;
				var xPosition2 = offset.right;
				var yPosition1 = offset.top;
				var yPosition2 = offset.bottom;
				var corner1 = null;
				var corner2 = null;

				// Parellel to Yaxis and intersecting with x axis
				if (clientY > yPosition1 && clientY < yPosition2) {
					if (clientX < xPosition1 && clientY < xPosition2) {
						corner1 = { x: xPosition1, y: clientY, position: 'before' };
					} else {
						corner1 = { x: xPosition2, y: clientY, position: 'after' };
					}
				}
				// Parellel to xAxis and intersecting with Y axis
				else if (clientX > xPosition1 && clientX < xPosition2) {
					if (clientY < yPosition1 && clientY < yPosition2) {
						corner1 = { x: clientX, y: yPosition1, position: 'before' };
					} else {
						corner1 = { x: clientX, y: yPosition2, position: 'after' };
					}
				} else {
					// Runs if no element found!
					if (clientX < xPosition1 && clientX < xPosition2) {
						corner1 = { x: xPosition1, y: yPosition1, position: 'before' }; // Left top
						corner2 = { x: xPosition1, y: yPosition2, position: 'after' }; // Left bottom
					} else if (clientX > xPosition1 && clientX > xPosition2) {
						// 'I m on the right of the element
						corner1 = { x: xPosition2, y: yPosition1, position: 'before' }; // Right top
						corner2 = { x: xPosition2, y: yPosition2, position: 'after' }; // Right Bottom
					} else if (clientY < yPosition1 && clientY < yPosition2) {
						// 'I m on the top of the element
						corner1 = { x: xPosition1, y: yPosition1, position: 'before' }; // Top Left
						corner2 = { x: xPosition2, y: yPosition1, position: 'after' }; // Top Right
					} else if (clientY > yPosition1 && clientY > yPosition2) {
						// 'I m on the bottom of the element
						corner1 = { x: xPosition1, y: yPosition2, position: 'before' }; // Left bottom
						corner2 = { x: xPosition2, y: yPosition2, position: 'after' }; // Right Bottom
					}
				}

				distance1 = that.calculateDistance(corner1, clientX, clientY);

				if (corner2 !== null) distance2 = that.calculateDistance(corner2, clientX, clientY);

				if (distance1 < distance2 || distance2 === null) {
					distance = distance1;
					position = corner1.position;
				} else {
					distance = distance2;
					position = corner2.position;
				}

				if (previousElData !== null) {
					if (previousElData.distance < distance) {
						return true; // Continue statement
					}
				}
				previousElData = {
					el: this,
					distance: distance,
					xPosition1: xPosition1,
					xPosition2: xPosition2,
					yPosition1: yPosition1,
					yPosition2: yPosition2,
					position: position
				};
			});

			if (previousElData !== null) {
				var position = previousElData.position;
				return {
					el: $(previousElData.el),
					position: position
				};
			} else {
				return false;
			}
		}
	};

	/**
	 * @param		{JQuery}	$element
	 * @returns {string}
	 */
	DragDrop.getElementName = function ($element) {
		return $element.prop('tagName');
	};

	/**
	 * @param {JQuery}			$element
	 * @param {DOMRect}			elementRect
	 * @param {MouseCoords}	mousePos
	 */
	DragDrop.prototype.addEntryToDragOverQueue = function ($element, elementRect, mousePos) {
		var newEvent = [$element, elementRect, mousePos];

		this.dragoverqueue.push(newEvent);
	};

	DragDrop.prototype.processDragOverQueue = function () {
		// if (previousMouseX === mouseClientX && previousMouseY === mouseClientY) return;
		// if (this.cursorMoving) return;

		var processing = this.dragoverqueue.pop();

		this.dragoverqueue = [];

		if (processing && processing.length == 3) {
			var $el = processing[0];
			var elRect = processing[1];
			var mousePos = processing[2];
			//  ! To implement
			DragDrop.orchestrateDragDrop($el, elRect, mousePos);
		}
	};

	/**
	 * @abstract
	 * @returns		{JQuery<HTMLElement>}
	 */
	DragDrop.getPlaceHolder = function () {
		throw new Error('Must be implemented by subclass!');
		// return $('<div class="drop-marker drop-marker--rex-button"></div>');
	};

	/**
	 * @abstract
	 * @param {JQuery}			$element
	 * @param {DOMRect}			elementRect
	 * @param {MouseCoords}	mousePos
	 */
	DragDrop.orchestrateDragDrop = function ($element, elementRect, mousePos) {
		throw new Error('Must be implemented by subclass!');
	};

	return DragDrop;
});
