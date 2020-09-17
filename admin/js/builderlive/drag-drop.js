/**
 * The purpose of this file is to provide a basic DragDrop class with some features.
 * This class is intended to be used only for its implementations (abstract).
 * The implementations of this class will contain some specific methods different
 * for every of them and will be exported to the global scope.
 *
 * @since	2.0.9
 */

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

var dragDropInstances = (function ($) {
	/**
	 * Represent a Drag & Drop helper.
	 * TODO Make properties private.
	 * @constructor
	 */
	function DragDrop(context) {
		/**
		 * @type		{(JQuery<HTMLElement> | DOMRect | MouseCoords)[][]}
		 * @public
		 */
		this.dragoverqueue = [];

		/**
		 * @type		{document}
		 * @public
		 */
		this.context = context;

		/**
		 * @type		{boolean}
		 * @public
		 */
		this.cursorMoving = null;
	}

	/**
	 * @type		{MousePercentage}
	 * @private
	 * @static
	 */
	var mousePercents;

	/**
	 * Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
	 * @type		{{x: number, y: number}}
	 * @private
	 * @static
	 */
	var breakPointNumber = {
		x: 10,
		y: 10
	};

	/**
	 * @type		{{x: number, y: number}}
	 * @private
	 * @static
	 */
	var customBreakPoints = {
		x: 50,
		y: 50
	};

	/**
	 * @type		{boolean}
	 * @private
	 * @static
	 */
	var fixedBreakPoints = false;

	/**
	 * @type		{string[]}
	 * @private
	 * @static
	 */
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

	/**
	 * CSS selector containing all the elements that are considered void.
	 *
	 * @type		{string}
	 * @private
	 * @static
	 */
	var voidElementsSelector = voidElements.join(',');

	/**
	 * @static
	 * @param		{JQuery}					$element
	 * @param		{DOMRect}					elementRect
	 * @param		{MouseCoords}			mousePos
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
	 * @static
	 * @param		{JQuery}	$element
	 * @returns	{boolean}
	 */
	DragDrop.checkVoidElement = function ($element) {
		return $element.is(voidElementsSelector);
	};

	/**
	 * @static
	 * @param 	{ElementData}	elementData
	 * @param 	{number} 			mouseX
	 * @param 	{number} 			mouseY
	 * @returns	{number}			Distance
	 */
	DragDrop.calculateDistance = function (elementData, mouseX, mouseY) {
		return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
	};

	/**
	 * @static
	 * @param		{JQuery} $container
	 * @param		{number} clientX
	 * @param		{number} clientY
	 * @returns	{{$el: JQuery, position: string}|boolean}
	 */
	DragDrop.findNearestElement = function ($container, clientX, clientY) {
		var previousElData = null;
		var $childrenElement = $container.children(':not(.drop-marker,[data-dragcontext-marker])');

		if ($childrenElement.length <= 0) return;

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

			distance1 = DragDrop.calculateDistance(corner1, clientX, clientY);

			if (corner2 !== null) distance2 = DragDrop.calculateDistance(corner2, clientX, clientY);

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
				$el: $(previousElData.el),
				position: position
			};
		} else {
			return false;
		}
	};

	/**
	 * @static
	 * @param		{JQuery}	$element
	 * @returns {string}
	 */
	DragDrop.getElementName = function ($element) {
		return $element.prop('tagName');
	};

	/**
	 * @static
	 * @param		{JQuery}	$targetElement
	 * @returns {boolean}
	 */
	DragDrop.checkIfInline = function ($targetElement) {
		var targetElementDisplay = $targetElement.css('display');

		// A <br> element has display: inline; but we want to take it as not inline element
		var isInline =
			['inline', 'inline-block', 'inline-flex'].indexOf(targetElementDisplay) !== -1 && !$targetElement.is('br');

		return isInline;
	};

	/**
	 * @deprecated
	 * @static
	 * @returns	{JQuery}
	 */
	DragDrop.getContextMarker = function () {
		return $('<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>');
	};

	/**
	 * @public
	 */
	DragDrop.prototype.removeAllPlaceholders = function () {
		var placeholders = Array.prototype.slice.call(this.context.querySelectorAll('.drop-marker'));

		placeholders.forEach(function (placeholder) {
			placeholder.parentNode.removeChild(placeholder);
		});
	};

	/**
	 * @deprecated
	 * @param {JQuery}		$element
	 * @param {string}		position
	 */
	DragDrop.prototype.addContainerContextMarker = function ($element, position) {
		var $contextMarker = DragDrop.getContextMarker();

		this.clearContainerContextMarker();

		if ($element.is('html,body')) {
			position = 'inside';
			// ! May not work
			$element = $(this.context.body);
		}

		switch (position) {
			case 'inside':
				this.positionContextMarker($contextMarker, $element);

				if ($element.hasClass('stackhive-nodrop-zone')) {
					$contextMarker.addClass('invalid');
				}

				var name = DragDrop.getElementName($element);

				Array.prototype.slice
					.call($contextMarker.get(0).querySelectorAll('[data-dragcontext-marker-text]'))
					.forEach(function (text) {
						text.innerHTML = name;
					});

				if (0 !== this.context.querySelectorAll('[data-sh-parent-marker]').length) {
					// TODO
					$(this.context.body).find('[data-sh-parent-marker]').first().before($contextMarker);
				} // else break; ?
				break;
			case 'sibling':
				this.positionContextMarker($contextMarker, $element.parent());
				if ($element.parent().hasClass('stackhive-nodrop-zone')) {
					$contextMarker.addClass('invalid');
				}

				var name = DragDrop.getElementName($element.parent());

				Array.prototype.slice
					.call($contextMarker.get(0).querySelectorAll('[data-dragcontext-marker-text]'))
					.forEach(function (text) {
						text.innerHTML = name;
					});

				$contextMarker.get(0).setAttribute('data-dragcontext-marker', name.toLowerCase());

				if (0 !== this.context.querySelectorAll('[data-sh-parent-marker]').length) {
					// TODO
					$(this.context.body).find('[data-sh-parent-marker]').first().before($contextMarker);
				} // else break; ?
				break;
			default:
				break;
		}
	};

	/**
	 * @deprecated
	 * @param	{JQuery}		$contextMarker
	 * @param	{JQuery}		$element
	 */
	DragDrop.prototype.positionContextMarker = function ($contextMarker, $element) {
		var rect = $element.get(0).getBoundingClientRect();

		$contextMarker.css({
			height: rect.height + 4 + 'px',
			width: rect.width + 4 + 'px',
			// * Maybe use this.context.defaultView, but need to test in different browsers
			top: rect.top + $(Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow).scrollTop() - 2 + 'px',
			left: rect.left + $(Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow).scrollLeft() - 2 + 'px'
		});

		if (rect.top + this.context.body.scrollTop < 24) {
			$contextMarker.find('[data-dragcontext-marker-text]').css('top', '0px');
		}
	};

	/**
	 * @deprecated
	 */
	DragDrop.prototype.clearContainerContextMarker = function () {
		var contextMarkers = Array.prototype.slice.call(this.context.querySelectorAll('[data-dragcontext-marker]'));

		contextMarkers.forEach(function (contextMarker) {
			contextMarker.parentNode.removeChild(contextMarker);
		});
	};

	/**
	 * @param {JQuery}					$targetElement	Element where the placeholder will be placed
	 * @param {MousePercentage}	mousePercents
	 * @param {MouseCoords}			mousePos
	 */
	DragDrop.prototype.decideBeforeAfter = function ($targetElement, mousePercents, mousePos) {
		var elementIsInline = DragDrop.checkIfInline($targetElement);
		var elementIsTableCell = $targetElement.is('td,th');

		if (mousePos) {
			// ? Why retrieve again mouse percentages?
			mousePercents = DragDrop.getMouseBearingsPercentage($targetElement, null, mousePos);
		}

		var percentageToTest = mousePercents.yPercentage;

		if (elementIsInline) {
			percentageToTest = mousePercents.xPercentage;
		}

		if (percentageToTest < 50) {
			if (elementIsTableCell) {
				this.prependPlaceholder($targetElement);
			} else {
				this.placeBefore($targetElement);
			}
		} else {
			if (elementIsTableCell) {
				this.appendPlaceholder($targetElement);
			} else {
				this.placeAfter($targetElement);
			}
		}
	};

	/**
	 * @param {JQuery}		$element
	 */
	DragDrop.prototype.appendPlaceholder = function ($element) {
		var $placeholder = this.getPlaceHolder();

		$placeholder.addClass('horizontal').css('width', $element.width() + 'px');
		this.addPlaceHolder($element, 'inside-append', $placeholder);
	};

	/**
	 * @param {JQuery}		$element
	 */
	DragDrop.prototype.prependPlaceholder = function ($element) {
		var $placeholder = this.getPlaceHolder();

		$placeholder.addClass('horizontal').css('width', $element.width() + 'px');
		this.addPlaceHolder($element, 'inside-prepend', $placeholder);
	};

	/**
	 * @param {JQuery}		$element	Element where the placeholder will be placed
	 */
	DragDrop.prototype.placeBefore = function ($element) {
		var inlinePlaceholder = DragDrop.checkIfInline($element);
		var $placeholder = this.getPlaceHolder();

		if (inlinePlaceholder) {
			$placeholder.addClass('vertical').css('height', $element.innerHeight() + 'px');
		} else {
			$placeholder.addClass('horizontal').css('width', $element.parent().width() + 'px');
		}

		this.addPlaceHolder($element, 'before', $placeholder);
	};

	/**
	 * @param {JQuery}		$element	Element where the placeholder will be placed
	 */
	DragDrop.prototype.placeAfter = function ($element) {
		var $placeholder = this.getPlaceHolder();
		var inlinePlaceholder = DragDrop.checkIfInline($element);

		if (inlinePlaceholder) {
			$placeholder.addClass('vertical').css('height', $element.innerHeight() + 'px');
		} else {
			$placeholder.addClass('horizontal').css('width', $element.parent().width() + 'px');
		}

		this.addPlaceHolder($element, 'after', $placeholder);
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
		if (!this.cursorMoving) return;

		var processing = this.dragoverqueue.pop();

		this.dragoverqueue = [];

		if (processing && processing.length === 3) {
			var $el = processing[0];
			var elRect = processing[1];
			var mousePos = processing[2];
			this.orchestrateDragDrop($el, elRect, mousePos);
		}
	};

	/**
	 *
	 * @param {number}	previousX
	 * @param {number}	previousY
	 * @param {number}	currentX
	 * @param {number}	currentY
	 */
	DragDrop.prototype.checkIfCursorMoves = function (previousX, previousY, currentX, currentY) {
		this.cursorMoving = !(previousX === currentX && previousY === currentY);
	};

	/**
	 * @param {JQuery}		$element
	 * @param {string}		position
	 * @param {JQuery}		$placeholder
	 */
	DragDrop.prototype.addPlaceHolder = function ($element, position, $placeholder) {
		throw new Error('Must be implemented by subclass!');
	};

	/**
	 * @param		{JQuery}	$element
	 * @param		{string}	direction
	 * @returns	{JQuery}
	 */
	DragDrop.prototype.findValidParent = function ($element, direction) {
		throw new Error('Must be implemented by subclass!');
	};

	/**
	 * @abstract
	 * @returns		{JQuery}
	 */
	DragDrop.prototype.getPlaceHolder = function () {
		throw new Error('Must be implemented by subclass!');
	};

	/**
	 * @abstract
	 * @public
	 * @param {JQuery}			$element
	 * @param {DOMRect}			elementRect
	 * @param {MouseCoords}	mousePos
	 */
	DragDrop.prototype.orchestrateDragDrop = function ($element, elementRect, mousePos) {
		throw new Error('Must be implemented by subclass!');
	};

	/**
	 * Used for re-orchestrating elements inside blocks.
	 *
	 * @public
	 * @param 	{JQuery}			$element
	 * @param 	{DOMRect}			elementRect
	 * @param 	{MouseCoords}	mousePos
	 */
	DragDrop.prototype.reOrchestrate = function ($element, elementRect, mousePos) {
		var $gridItem = $element.parents('.grid-stack-item');
		var $textWrap = $gridItem.find('.text-wrap');

		if ($textWrap.length !== 0) {
			this.removeAllPlaceholders();

			this.orchestrateDragDrop($textWrap, elementRect, mousePos);
		}
	};

	/* ===== REX BUTTON ===== */

	/**
	 * @param				{document}	context
	 * @public
	 * @extends			{DragDrop}
	 * @constructor
	 */
	function RexButtonDragDrop(context) {
		DragDrop.call(this, context);
	}

	RexButtonDragDrop.prototype = Object.create(DragDrop.prototype);
	// Keeping the constructor the right one, needed after redefining the prototype
	// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance#Setting_Teachers_prototype_and_constructor_reference
	Object.defineProperty(RexButtonDragDrop.prototype, 'constructor', {
		value: RexButtonDragDrop,
		enumerable: false, // so that it does not appear in 'for in' loop
		writable: true
	});

	/**
	 * @param {JQuery}		$element
	 * @param {string}		position
	 * @param {JQuery}		$placeholder
	 */
	RexButtonDragDrop.prototype.addPlaceHolder = function ($element, position, $placeholder) {
		if (!$placeholder) {
			$placeholder = this.getPlaceHolder();
		}

		this.removeAllPlaceholders();

		// var whereAddContainerText;

		switch (position) {
			case 'before':
				// Buttons have to be inside grid-stack-row
				if ($element.hasClass('grid-stack-row')) {
					$element.prepend($placeholder);
				} else {
					$element.before($placeholder);
				}

				// whereAddContainerText = 'sibling';
				break;
			case 'after':
				// Buttons have to be inside grid-stack-row
				if ($element.hasClass('grid-stack-row')) {
					$element.append($placeholder);
				} else {
					$element.after($placeholder);
				}

				// whereAddContainerText = 'sibling';
				break;
			case 'inside-prepend':
				$element.prepend($placeholder);

				// whereAddContainerText = 'inside';
				break;
			case 'inside-append':
				$element.append($placeholder);

				// whereAddContainerText = 'inside';
				break;
		}

		// this.addContainerContextMarker($element, whereAddContainerText);
	};

	RexButtonDragDrop.prototype.getPlaceHolder = function () {
		return $('<div class="drop-marker drop-marker--rex-button"></div>');
	};

	/**
	 * @param		{JQuery}	$element
	 * @param		{string}	direction
	 * @returns	{JQuery}
	 */
	RexButtonDragDrop.prototype.findValidParent = function ($element, direction) {
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

	RexButtonDragDrop.prototype.orchestrateDragDrop = function ($element, elementRect, mousePos) {
		// If no element is hovered or element hovered is the placeholder -> not valid -> return false;
		if (!$element || $element.length == 0 || !elementRect || !mousePos) return false;

		if ($element.is('html')) {
			$element = $element.find('body');
		}

		var isButtonWrapper = $element.hasClass('rex-button-wrapper');
		mousePercents = DragDrop.getMouseBearingsPercentage($element, elementRect, mousePos);

		// If I need to get inside the element
		if (isButtonWrapper || $element.parents('.rex-button-wrapper').length != 0) {
			$element = isButtonWrapper ? $element : $element.parents('.rex-button-wrapper').eq(0);
			customBreakPoints = $.extend(true, {}, breakPointNumber);
			fixedBreakPoints = true;
			breakPointNumber.x = 50;
			breakPointNumber.y = 50;
		}

		if (
			mousePercents.xPercentage > breakPointNumber.x &&
			mousePercents.xPercentage < 100 - breakPointNumber.x &&
			mousePercents.yPercentage > breakPointNumber.y &&
			mousePercents.yPercentage < 100 - breakPointNumber.y
		) {
			// Case 1
			// Decide whether to prepend or append the marker depending on the mouse position relative to the hovered element.
			var $tempElement = $element.clone();
			var tempElement = $tempElement.get(0);

			var dropMarker = tempElement.querySelector('.drop-marker');

			if (dropMarker) {
				dropMarker.parentNode.removeChild(dropMarker);
			}

			if ('' === tempElement.innerHTML && !DragDrop.checkVoidElement($tempElement)) {
				if (mousePercents.yPercentage < 90) {
					this.appendPlaceholder($element);
					return;
				}
			} else if (0 === tempElement.children.length) {
				// Text element detected
				this.decideBeforeAfter($element, mousePercents);
			} else if (1 === tempElement.children.length) {
				// Only 1 child element detected
				if ($tempElement.hasClass('rex-buttons-paragraph')) {
					var positionAndElement = DragDrop.findNearestElement($element, mousePos.xCoord, mousePos.yCoord);

					this.decideBeforeAfter(positionAndElement.$el, mousePercents, mousePos);
				} else {
					var $firstChild = $element.children(':not(.drop-marker,[data-dragcontext-marker])').first();

					this.decideBeforeAfter($firstChild, mousePercents);
				}
			} else {
				// Mote than 1 child element detected
				var positionAndElement = DragDrop.findNearestElement($element, mousePos.xCoord, mousePos.yCoord);

				this.decideBeforeAfter(positionAndElement.$el, mousePercents, mousePos);
			}
		} else if (mousePercents.xPercentage <= breakPointNumber.x || mousePercents.yPercentage <= breakPointNumber.y) {
			var $validElement = null;

			if (mousePercents.yPercentage <= mousePercents.xPercentage) {
				$validElement = this.findValidParent($element, 'top');
			} else {
				$validElement = this.findValidParent($element, 'left');
			}

			if ($validElement.is('body,html')) {
				var frameBody = this.context.body;
				$validElement = $(frameBody).children(':not(.drop-marker,[data-dragcontext-marker])').first();
			}

			this.decideBeforeAfter($validElement, mousePercents, mousePos);
		} else if (
			mousePercents.xPercentage >= 100 - breakPointNumber.x ||
			mousePercents.yPercentage >= 100 - breakPointNumber.y
		) {
			var $validElement = null;

			if (mousePercents.yPercentage >= mousePercents.xPercentage) {
				$validElement = this.findValidParent($element, 'bottom');
			} else {
				$validElement = this.findValidParent($element, 'right');
			}

			if ($validElement.is('body,html')) {
				var frameBody = this.context.body;
				$validElement = $(frameBody).children(':not(.drop-marker,[data-dragcontext-marker])').last();
			}

			this.decideBeforeAfter($validElement, mousePercents, mousePos);
		}

		if (fixedBreakPoints) {
			breakPointNumber.x = customBreakPoints.x;
			breakPointNumber.y = customBreakPoints.y;
			fixedBreakPoints = false;
		}

		// Checks if current element, where placeholder is, is a valid element
		var needToReOrchestrate =
			!$element.hasClass('rex-buttons-paragraph') &&
			!$element.hasClass('text-wrap') &&
			!$element.hasClass('rex-button-wrapper') &&
			// if it's not a text-wrap child
			!$element.is($element.parents('.text-wrap').children());

		if (needToReOrchestrate) {
			this.reOrchestrate($element, elementRect, mousePos);
		}
	};

	/* ===== REX MODEL ===== */

	/**
	 * @param				{document}	context
	 * @public
	 * @extends			{DragDrop}
	 * @constructor
	 */
	function RexModelDragDrop(context) {
		DragDrop.call(this, context);
	}

	RexModelDragDrop.prototype = Object.create(DragDrop.prototype);
	// Keeping the constructor the right one, needed after redefining the prototype
	// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance#Setting_Teachers_prototype_and_constructor_reference
	Object.defineProperty(RexModelDragDrop.prototype, 'constructor', {
		value: RexModelDragDrop,
		enumerable: false, // so that it does not appear in 'for in' loop
		writable: true
	});

	/**
	 * @param {JQuery}		$element
	 * @param {string}		position
	 * @param {JQuery}		$placeholder
	 */
	RexModelDragDrop.prototype.addPlaceHolder = function ($element, position, $placeholder) {
		if ($element.hasClass('rex-container')) {
			if (position == 'before') {
				position = 'inside-prepend';
			} else {
				position = 'inside-append';
			}
		}
		if (!$placeholder) {
			$placeholder = this.getPlaceHolder();
		}

		var whereAddContainerText = null;

		this.removeAllPlaceholders();
		switch (position) {
			case 'before':
				$element.before($placeholder);
				whereAddContainerText = 'sibling';
				break;
			case 'after':
				$element.after($placeholder);
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

		// this.addContainerContextMarker($element, whereAddContainerText);
	};

	RexModelDragDrop.prototype.getPlaceHolder = function () {
		return $('<div class="drop-marker drop-marker--view"><div class="drop-marker--ruler"></div></div>');
	};

	/**
	 * @param		{JQuery}	$element
	 * @param		{string}	direction
	 * @returns	{JQuery}
	 */
	RexModelDragDrop.prototype.findValidParent = function ($element, direction) {
		switch (direction) {
			case 'left':
				while (true) {
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();

					if ($element.is('body') || $element.hasClass('rex-container')) {
						return $element;
					}

					if (Math.abs(tempelementRect.left - elementRect.left) == 0) {
						$element = $element.parent();
					} else {
						return $element;
					}
				}
				break;
			case 'right':
				while (true) {
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();

					if ($element.is('body') || $element.hasClass('rex-container')) {
						return $element;
					}

					if (Math.abs(tempelementRect.right - elementRect.right) == 0) {
						$element = $element.parent();
					} else {
						return $element;
					}
				}
				break;
			case 'top':
				console.countReset('while top');
				var validParent = null;
				for (var i = 0; i < $element.parents().length; i++) {
					console.count('while top');
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();

					if ($element.is('body') /* || $element.hasClass('rex-container') */) {
						// return $element;
						// return null;
						break;
					}

					if ($element.hasClass('rex-container')) {
						validParent = $element;
						break;
					}

					if (Math.abs(tempelementRect.top - elementRect.top) == 0) {
						$element = $element.parent();
					} else {
						validParent = $element;
						break;
					}
				}
				return validParent;
				break;
			case 'bottom':
				console.countReset('while bottom');
				var validParent = null;
				for (var i = 0; i < $element.parents().length; i++) {
					console.count('while bottom');
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();

					if ($element.is('body') /* || $element.hasClass('rex-container') */) {
						break;
					}

					if ($element.hasClass('rex-container')) {
						validParent = $element;
						break;
					}

					if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0) {
						$element = $element.parent();
					} else {
						validParent = $element;
						break;
					}
				}

				return validParent;
				break;
			default:
				break;
		}
	};

	RexModelDragDrop.prototype.orchestrateDragDrop = function ($element, elementRect, mousePos) {
		// If no element is hovered or element hovered is the placeholder -> not valid -> return false;
		if (!$element || $element.length == 0 || !elementRect || !mousePos) {
			console.log('esco da orchestrate senza far nulla');
			return false;
		}

		if ($element.is('html')) {
			$element = $element.find('body');
		}

		// Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
		var breakPointNumber = {
			// x: 50,
			y: 50
		};
		// var breakPointNumber = JSON.parse(JSON.stringify(customBreakPoints));
		mousePercents = DragDrop.getMouseBearingsPercentage($element, elementRect, mousePos);

		if (/* mousePercents.xPercentage <= breakPointNumber.x || */ mousePercents.yPercentage <= breakPointNumber.y) {
			var $validElement = this.findValidParent($element, 'top');
			console.log('case 1: y più piccolo di %s', breakPointNumber.y);
			if (!$validElement) {
				return;
			}

			if ($validElement.hasClass('rex-container')) {
				console.log('is container', $validElement);
			}

			if ($validElement.is('body,html')) {
				$validElement = $(this.context.body).children(':not(.drop-marker,[data-dragcontext-marker])').first();
			}

			this.decideBeforeAfter($validElement, mousePercents, mousePos);
		} else if (
			/* mousePercents.xPercentage >= 100 - breakPointNumber.x || */
			mousePercents.yPercentage >=
			100 - breakPointNumber.y
		) {
			console.log('case 2: y più grande di %s', breakPointNumber.y);
			var $validElement = this.findValidParent($element, 'bottom');

			if (!$validElement) {
				return;
			}

			if ($validElement.hasClass('rex-container')) {
				console.log('is container');
			}

			if ($validElement.is('body,html')) {
				$validElement = $(this.context.body).children(':not(.drop-marker,[data-dragcontext-marker])').last();
			}

			this.decideBeforeAfter($validElement, mousePercents, mousePos);
		}

		console.log('==========');
	};

	/* ===== REX WPCF7 ===== */

	/**
	 * @param				{document}	context
	 * @public
	 * @extends			{DragDrop}
	 * @constructor
	 */
	function RexWpcf7DragDrop(context) {
		DragDrop.call(this, context);
	}

	RexWpcf7DragDrop.prototype = Object.create(DragDrop.prototype);
	// Keeping the constructor the right one, needed after redefining the prototype
	// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance#Setting_Teachers_prototype_and_constructor_reference
	Object.defineProperty(RexWpcf7DragDrop.prototype, 'constructor', {
		value: RexWpcf7DragDrop,
		enumerable: false, // so that it does not appear in 'for in' loop
		writable: true
	});

	RexWpcf7DragDrop.prototype.addPlaceHolder = RexButtonDragDrop.prototype.addPlaceHolder;

	/**
	 * @public
	 * @returns		{JQuery}
	 */
	RexWpcf7DragDrop.prototype.getPlaceHolder = function () {
		return $('<div class="drop-marker drop-marker--rex-wpcf7"></div>');
	};

	/**
	 * @param		{JQuery}	$element
	 * @param		{string}	direction
	 * @returns	{JQuery}
	 */
	RexWpcf7DragDrop.prototype.findValidParent = function ($element, direction) {
		switch (direction) {
			case 'left':
				while (true) {
					var elementRect = $element.get(0).getBoundingClientRect();
					var $tempElement = $element.parent();
					var tempelementRect = $tempElement.get(0).getBoundingClientRect();
					if (
						$element.is('body') ||
						$element.hasClass('grid-stack-row') ||
						$tempElement.hasClass('rex-elements-paragraph')
					) {
						return $element;
					}
					if (Math.abs(tempelementRect.left - elementRect.left) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-element-wrapper').length != 0) {
							return $element.parents('.rex-element-wrapper').eq(0);
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
						$tempElement.hasClass('rex-elements-paragraph')
					) {
						return $element;
					}
					if (Math.abs(tempelementRect.right - elementRect.right) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-element-wrapper').length != 0) {
							return $element.parents('.rex-element-wrapper').eq(0);
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
						$tempElement.hasClass('rex-elements-paragraph')
					) {
						return $element;
					}
					if (Math.abs(tempelementRect.top - elementRect.top) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-element-wrapper').length != 0) {
							return $element.parents('.rex-element-wrapper').eq(0);
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
						$tempElement.hasClass('rex-elements-paragraph')
					)
						return $element;
					if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0) {
						$element = $element.parent();
					} else {
						if ($element.parents('.rex-element-wrapper').length != 0) {
							return $element.parents('.rex-element-wrapper').eq(0);
						}
						return $element;
					}
				}
				break;
			default:
				break;
		}
	};

	RexWpcf7DragDrop.prototype.orchestrateDragDrop = function ($element, elementRect, mousePos) {
		//If no element is hovered or element hovered is the placeholder -> not valid -> return false;
		if (!$element || $element.length == 0 || !elementRect || !mousePos) {
			return false;
		}

		if ($element.is('html')) {
			$element = $element.find('body');
		}

		// Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
		mousePercents = DragDrop.getMouseBearingsPercentage($element, elementRect, mousePos);

		// If I have to go inside the element
		if ($element.hasClass('rex-element-wrapper') || $element.parents('.rex-element-wrapper').length != 0) {
			$element = $element.hasClass('rex-element-wrapper') ? $element : $element.parents('.rex-element-wrapper').eq(0);
			customBreakPoints = jQuery.extend(true, {}, breakPointNumber);
			fixedBreakPoints = true;
			breakPointNumber.x = 50;
			breakPointNumber.y = 50;
		}
		if (
			mousePercents.xPercentage > breakPointNumber.x &&
			mousePercents.xPercentage < 100 - breakPointNumber.x &&
			mousePercents.yPercentage > breakPointNumber.y &&
			mousePercents.yPercentage < 100 - breakPointNumber.y
		) {
			// Case 1 -
			var $tempelement = $element.clone();
			$tempelement.find('.drop-marker').remove();
			if ($tempelement.html() == '' && !DragDrop.checkVoidElement($tempelement)) {
				if (mousePercents.yPercentage < 90) {
					return this.appendPlaceholder($element);
				}
			} else if ($tempelement.children().length == 0) {
				// text element detected
				this.decideBeforeAfter($element, mousePercents);
			} else if ($tempelement.children().length == 1) {
				// only 1 child element detected
				if ($tempelement.hasClass('rex-elements-paragraph')) {
					var positionAndElement = DragDrop.findNearestElement($element, mousePos.xCoord, mousePos.yCoord);
					this.decideBeforeAfter(positionAndElement.$el, mousePercents, mousePos);
				} else {
					this.decideBeforeAfter(
						$element.children(':not(.drop-marker,[data-dragcontext-marker])').first(),
						mousePercents
					);
				}
			} else {
				var positionAndElement = DragDrop.findNearestElement($element, mousePos.xCoord, mousePos.yCoord);
				this.decideBeforeAfter(positionAndElement.$el, mousePercents, mousePos);
			}
		} else if (mousePercents.xPercentage <= breakPointNumber.x || mousePercents.yPercentage <= breakPointNumber.y) {
			if (mousePercents.yPercentage <= mousePercents.xPercentage) {
				validElement = this.findValidParent($element, 'top');
			} else {
				validElement = this.findValidParent($element, 'left');
			}

			if (validElement.is('body,html')) {
				validElement = $(this.context.body).children(':not(.drop-marker,[data-dragcontext-marker])').first();
			}
			this.decideBeforeAfter(validElement, mousePercents, mousePos);
		} else if (
			mousePercents.xPercentage >= 100 - breakPointNumber.x ||
			mousePercents.yPercentage >= 100 - breakPointNumber.y
		) {
			var validElement = null;
			if (mousePercents.yPercentage >= mousePercents.xPercentage) {
				validElement = this.findValidParent($element, 'bottom');
			} else {
				validElement = this.findValidParent($element, 'right');
			}

			if (validElement.is('body,html')) {
				validElement = $(this.context.body).children(':not(.drop-marker,[data-dragcontext-marker])').last();
			}
			this.decideBeforeAfter(validElement, mousePercents, mousePos);
		}
		if (fixedBreakPoints) {
			breakPointNumber.x = customBreakPoints.x;
			breakPointNumber.y = customBreakPoints.y;
			fixedBreakPoints = false;
		}

		// Checks if current element, where placeholder is, is a valid element
		var needToReOrchestrate =
			!$element.hasClass('rex-elements-paragraph') &&
			!$element.hasClass('text-wrap') &&
			!$element.hasClass('rex-element-wrapper') &&
			!$element.is($element.parents('.text-wrap').children());

		if (needToReOrchestrate) {
			this.reOrchestrate($element, elementRect, mousePos);
		}
	};

	return {
		RexButtonDragDrop: RexButtonDragDrop,
		RexModelDragDrop: RexModelDragDrop,
		RexWpcf7DragDrop: RexWpcf7DragDrop
	};
})(jQuery);

var RexButtonDragDrop = dragDropInstances.RexButtonDragDrop;
var RexModelDragDrop = dragDropInstances.RexModelDragDrop;
var RexWpcf7DragDrop = dragDropInstances.RexWpcf7DragDrop;

dragDropInstances = null;
