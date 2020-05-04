var Rexbuilder_Rexwpcf7 = (function ($) {
	'use strict';

	var styleSheet;
	var columnContentDataDefaults;

	/* ===== CSS Rules Functions ===== */

	function _fixFormCustomStyle() {
		if (0 === Rexbuilder_Rexwpcf7.$rexFormsStyle.length) {
			var css = '';
			var head = document.head || document.getElementsByTagName('head')[0];
			var style = document.createElement('style');

			style.type = 'text/css';
			style.id = 'rexpansive-builder-rexwpcf7-style-inline-css';
			style.dataset.rexName = 'rexwpcf7-style';

			if (style.styleSheet) {
				// This is required for IE8 and below.
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}
			head.appendChild(style);
		}

		for (var i = 0; i < document.styleSheets.length; i++) {
			if (document.styleSheets[i].ownerNode.id == 'rexpansive-builder-rexwpcf7-style-inline-css') {
				styleSheet = document.styleSheets[i];
			}
		}
	}

	/**
	 * Checks if rule defined by passed selector
	 * is already in the current CSS styles list
	 * @param  {String} selector  Selector of the rule to check
	 * @return {Boolean}          Rule is already in the CSS styles list
	 */
	function _ruleAlreadyExists(selector) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (styleSheet.cssRules[i].selectorText == selector) {
				return true;
			}
		}
		return false;
	}

	function _getRulesObj(propertyString) {
		var propertiesObj = {};
		var propertiesArray = propertyString.split(';');

		propertiesArray.forEach(function (prop) {
			var rule = prop.split(':');

			if (2 === rule.length) {
				propertiesObj[rule[0]] = rule[1].trim();
			}
		});

		return propertiesObj;
	}

	// Adding Rules

	function addFormRule(formID, property) {
		var formSelector = '.rex-element-wrapper[data-rex-element-id="' + formID + '"] .wpcf7-form';
		var formRule = formSelector + '{' + property + '}';

		if (!_ruleAlreadyExists(formSelector)) {
			if ('insertRule' in styleSheet) {
				styleSheet.insertRule(formRule, styleSheet.cssRules.length);
			} else if ('addRule' in styleSheet) {
				styleSheet.addRule(formRule, styleSheet.cssRules.length);
			}
		} else {
			var rules = _getRulesObj(property);

			for (var prop in rules) {
				if (rules.hasOwnProperty(prop)) {
					updateFormRule(formID, prop, rules[prop]);
				}
			}
		}
	}

	function addFormMessageRule(formID, messageClass, property) {
		var formMessageSelector = '.rex-element-wrapper[data-rex-element-id="' + formID + '"] .wpcf7-form .' + messageClass;
		var formMessageRule = formMessageSelector + '{' + property + '}';

		if (!_ruleAlreadyExists(formMessageSelector)) {
			if ('insertRule' in styleSheet) {
				styleSheet.insertRule(formMessageRule, styleSheet.cssRules.length);
			} else if ('addRule' in styleSheet) {
				styleSheet.addRule(formMessageRule, styleSheet.cssRules.length);
			}
		} else {
			var rules = _getRulesObj(property);

			for (var prop in rules) {
				if (rules.hasOwnProperty(prop)) {
					updateFormMessageRule(formID, prop, rules[prop]);
				}
			}
		}
	}

	function addFormColumnsRule(formID, property) {
		var formColumnsSelector = '.rex-element-wrapper[data-rex-element-id="' + formID + '"] .wpcf7-form .wpcf7-column';
		var formColumnsRule = formColumnsSelector + '{' + property + '}';

		if (!_ruleAlreadyExists(formColumnsSelector)) {
			if ('insertRule' in styleSheet) {
				styleSheet.insertRule(formColumnsRule, styleSheet.cssRules.length);
			} else if ('addRule' in styleSheet) {
				styleSheet.addRule(formColumnsRule, styleSheet.cssRules.length);
			}
		} else {
			var rules = _getRulesObj(property);

			for (var prop in rules) {
				if (rules.hasOwnProperty(prop)) {
					updateFormColumnsRule(formID, prop, rules[prop]);
				}
			}
		}
	}

	function addColumnContentRule(formID, row, column, fieldClass, property) {
		// Style is changed to the column content, not to the whole column
		var columnContentSelector =
			'.rex-element-wrapper[data-rex-element-id="' +
			formID +
			'"] .wpcf7-row[wpcf7-row-number="' +
			row +
			'"] .wpcf7-column[wpcf7-column-number="' +
			column +
			'"] .' +
			fieldClass;
		var columnContentRule = columnContentSelector + '{' + property + '}';

		if (/acceptance/.test(columnContentSelector)) {
			console.log(columnContentSelector);
		}

		if (!_ruleAlreadyExists(columnContentSelector)) {
			if ('insertRule' in styleSheet) {
				styleSheet.insertRule(columnContentRule, styleSheet.cssRules.length);
			} else if ('addRule' in styleSheet) {
				styleSheet.addRule(columnContentRule, styleSheet.cssRules.length);
			}
		} else {
			var rules = _getRulesObj(property);

			for (var prop in rules) {
				if (rules.hasOwnProperty(prop)) {
					updateColumnContentRule(formID, prop, rules[prop]);
				}
			}
		}
	}

	function addColumnContentFocusRule(formID, row, column, selector, property) {
		// Style is changed to the column content, not to the whole column
		var columnContentFocusSelector =
			'.rex-element-wrapper[data-rex-element-id="' +
			formID +
			'"] .wpcf7-row[wpcf7-row-number="' +
			row +
			'"] .wpcf7-column[wpcf7-column-number="' +
			column +
			'"] .' +
			selector +
			':focus';
		var columnContentFocusRule = columnContentFocusSelector + '{' + property + '}';

		if (!_ruleAlreadyExists(columnContentFocusSelector)) {
			if ('insertRule' in styleSheet) {
				styleSheet.insertRule(columnContentFocusRule, styleSheet.cssRules.length);
			} else if ('addRule' in styleSheet) {
				styleSheet.addRule(columnContentFocusRule, styleSheet.cssRules.length);
			}
		} else {
			var rules = _getRulesObj(property);

			for (var prop in rules) {
				if (rules.hasOwnProperty(prop)) {
					updateColumnContentFocusRule(formID, prop, rules[prop]);
				}
			}
		}
	}

	function addColumnContentHoverRule(formID, row, column, fieldClass, property) {
		// Style is changed to the column content, not to the whole column
		var columnContentHoverSelector =
			'.rex-element-wrapper[data-rex-element-id="' +
			formID +
			'"] .wpcf7-row[wpcf7-row-number="' +
			row +
			'"] .wpcf7-column[wpcf7-column-number="' +
			column +
			'"] .' +
			fieldClass +
			':hover';
		var columnContentHoverRule = columnContentHoverSelector + '{' + property + '}';

		if (!_ruleAlreadyExists(columnContentHoverSelector)) {
			if ('insertRule' in styleSheet) {
				styleSheet.insertRule(columnContentHoverRule, styleSheet.cssRules.length);
			} else if ('addRule' in styleSheet) {
				styleSheet.addRule(columnContentHoverRule, styleSheet.cssRules.length);
			}
		} else {
			var rules = _getRulesObj(property);

			for (var prop in rules) {
				if (rules.hasOwnProperty(prop)) {
					updateColumnContentHoverRule(formID, prop, rules[prop]);
				}
			}
		}
	}

	function addColumnContentPlaceholderHoverRule(formID, row, column, fieldClass, property) {
		// Style is changed to the column content, not to the whole column
		var columnContentPlaceholderHoverSelector =
			'.rex-element-wrapper[data-rex-element-id="' +
			formID +
			'"] .wpcf7-row[wpcf7-row-number="' +
			row +
			'"] .wpcf7-column[wpcf7-column-number="' +
			column +
			'"] .' +
			fieldClass +
			':hover::placeholder';
		var columnContentPlaceholderHoverRule = columnContentPlaceholderHoverSelector + '{' + property + '}';

		if (!_ruleAlreadyExists(columnContentPlaceholderHoverSelector)) {
			if ('insertRule' in styleSheet) {
				styleSheet.insertRule(columnContentPlaceholderHoverRule, styleSheet.cssRules.length);
			} else if ('addRule' in styleSheet) {
				styleSheet.addRule(columnContentPlaceholderHoverRule, styleSheet.cssRules.length);
			}
		} else {
			var rules = _getRulesObj(property);

			for (var prop in rules) {
				if (rules.hasOwnProperty(prop)) {
					updateColumnContentPlaceholderHoverRule(formID, prop, rules[prop]);
				}
			}
		}
	}

	// Updating Rules

	function updateFormRule(formID, rule, value) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				//chrome firefox
				styleSheet.cssRules[i].selectorText ==
					'.rex-element-wrapper[data-rex-element-id="' + formID + '"] .wpcf7-form' ||
				// edge
				styleSheet.cssRules[i].selectorText == '[data-rex-element-id="' + formID + '"].rex-element-wrapper .wpcf7-form'
			) {
				switch (rule) {
					case 'margin-top':
						styleSheet.cssRules[i].style.marginTop = value;
						break;
					case 'margin-bottom':
						styleSheet.cssRules[i].style.marginBottom = value;
						break;
					case 'margin-left':
						styleSheet.cssRules[i].style.marginLeft = value;
						break;
					case 'margin-right':
						styleSheet.cssRules[i].style.marginRight = value;
						break;
					case 'border-width':
						styleSheet.cssRules[i].style.borderWidth = value;

						styleSheet.cssRules[i].style.borderTopWidth = value;
						styleSheet.cssRules[i].style.borderLeftWidth = value;
						styleSheet.cssRules[i].style.borderRightWidth = value;
						styleSheet.cssRules[i].style.borderBottomWidth = value;

						styleSheet.cssRules[i].style.borderTop =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderTopStyle +
							' ' +
							styleSheet.cssRules[i].style.borderTopColor;
						styleSheet.cssRules[i].style.borderLeft =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderLeftStyle +
							' ' +
							styleSheet.cssRules[i].style.borderLeftColor;
						styleSheet.cssRules[i].style.borderRight =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderRightStyle +
							' ' +
							styleSheet.cssRules[i].style.borderRightColor;
						styleSheet.cssRules[i].style.borderBottom =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderBottomStyle +
							' ' +
							styleSheet.cssRules[i].style.borderBottomColor;
						break;
					case 'border-color':
						styleSheet.cssRules[i].style.borderColor = value;

						styleSheet.cssRules[i].style.borderTopColor = value;
						styleSheet.cssRules[i].style.borderLeftColor = value;
						styleSheet.cssRules[i].style.borderRightColor = value;
						styleSheet.cssRules[i].style.borderBottomColor = value;

						break;
					case 'border-style':
						styleSheet.cssRules[i].style.borderStyle = value;

						styleSheet.cssRules[i].style.borderTopStyle = value;
						styleSheet.cssRules[i].style.borderLeftStyle = value;
						styleSheet.cssRules[i].style.borderRightStyle = value;
						styleSheet.cssRules[i].style.borderBottomStyle = value;

						styleSheet.cssRules[i].style.borderTop =
							styleSheet.cssRules[i].style.borderTopWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderTopColor;
						styleSheet.cssRules[i].style.borderLeft =
							styleSheet.cssRules[i].style.borderLeftWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderLeftColor;
						styleSheet.cssRules[i].style.borderRight =
							styleSheet.cssRules[i].style.borderRightWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderRightColor;
						styleSheet.cssRules[i].style.borderBottom =
							styleSheet.cssRules[i].style.borderBottomWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderBottomColor;
						break;
					case 'border-radius':
						styleSheet.cssRules[i].style.borderRadius = value;

						styleSheet.cssRules[i].style.borderTopLeftRadius = value;
						styleSheet.cssRules[i].style.borderTopRightRadius = value;
						styleSheet.cssRules[i].style.borderBottomLeftRadius = value;
						styleSheet.cssRules[i].style.borderBottomRightRadius = value;
						styleSheet.cssRules[i].style.webkitBorderRadius = value;

						styleSheet.cssRules[i].style.webkitBorderTopLeftRadius = value;
						styleSheet.cssRules[i].style.webkitBorderTopRightRadius = value;
						styleSheet.cssRules[i].style.webkitBorderBottomLeftRadius = value;
						styleSheet.cssRules[i].style.webkitBorderBottomRightRadius = value;
						break;
					case 'background-color':
						styleSheet.cssRules[i].style.backgroundColor = value;
						break;
					default:
						break;
				}
				break;
			}
		}
	}

	function updateFormMessageRule(formID, messageClass, rule, value) {
		var formMessageSelector = '.rex-element-wrapper[data-rex-element-id="' + formID + '"] .wpcf7-form .' + messageClass;
		var formMessageEdgeSelector = '[data-rex-element-id="' + formID + '"].rex-element-wrapper .wpcf7-form';

		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				// Chrome, Firefox
				styleSheet.cssRules[i].selectorText == formMessageSelector ||
				// Edge
				styleSheet.cssRules[i].selectorText == formMessageEdgeSelector
			) {
				switch (rule) {
					case 'text-color':
						styleSheet.cssRules[i].style.color = value;
						break;
					case 'font-size':
						styleSheet.cssRules[i].style.fontSize = value;
						break;
					default:
						break;
				}
				break;
			}
		}
	}

	function updateFormColumnsRule(formID, rule, value) {
		var formColumnsSelector = '.rex-element-wrapper[data-rex-element-id="' + formID + '"] .wpcf7-form .wpcf7-column';
		var formColumnsEdgeSelector =
			'[data-rex-element-id="' + formID + '"].rex-element-wrapper .wpcf7-form .wpcf7-column';

		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				//chrome firefox
				styleSheet.cssRules[i].selectorText == formColumnsSelector ||
				// edge
				styleSheet.cssRules[i].selectorText == formColumnsEdgeSelector
			) {
				switch (rule) {
					case 'padding-top':
						styleSheet.cssRules[i].style.paddingTop = value;
						break;
					case 'padding-left':
						styleSheet.cssRules[i].style.paddingLeft = value;
						break;
					case 'padding-right':
						styleSheet.cssRules[i].style.paddingRight = value;
						break;
					case 'padding-bottom':
						styleSheet.cssRules[i].style.paddingBottom = value;
						break;
					default:
						break;
				}
				break;
			}
		}
	}

	function updateColumnContentRule(formID, row, column, selector, rule, value) {
		// Style is changed to the column content, not to the whole column
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			// if (
			//     //chrome firefox
			//     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + selector ||
			//     // edge
			//     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + selector
			// ) {
			if (
				//chrome firefox
				styleSheet.cssRules[i].selectorText ==
					'.rex-element-wrapper[data-rex-element-id="' +
						formID +
						'"] .wpcf7-row[wpcf7-row-number="' +
						row +
						'"] .wpcf7-column[wpcf7-column-number="' +
						column +
						'"] .' +
						selector ||
				// edge
				styleSheet.cssRules[i].selectorText ==
					'.rex-element-wrapper[data-rex-element-id="' +
						formID +
						'"] .wpcf7-row[wpcf7-row-number="' +
						row +
						'"] .wpcf7-column[wpcf7-column-number="' +
						column +
						'"] .' +
						selector
			) {
				switch (rule) {
					case 'float':
						styleSheet.cssRules[i].style.float = value;
						break;
					case 'width':
						styleSheet.cssRules[i].style.width = value;
						break;
					case 'height':
						styleSheet.cssRules[i].style.height = value;
						break;
					case 'text-color':
						styleSheet.cssRules[i].style.color = value;
						break;
					case 'font-size':
						styleSheet.cssRules[i].style.fontSize = value;
						break;
					case 'margin-top':
						styleSheet.cssRules[i].style.marginTop = value;
						break;
					case 'margin-bottom':
						styleSheet.cssRules[i].style.marginBottom = value;
						break;
					case 'margin-left':
						styleSheet.cssRules[i].style.marginLeft = value;
						break;
					case 'margin-right':
						styleSheet.cssRules[i].style.marginRight = value;
						break;
					case 'padding-top':
						styleSheet.cssRules[i].style.paddingTop = value;
						break;
					case 'padding-bottom':
						styleSheet.cssRules[i].style.paddingBottom = value;
						break;
					case 'padding-left':
						styleSheet.cssRules[i].style.paddingLeft = value;
						break;
					case 'padding-right':
						styleSheet.cssRules[i].style.paddingRight = value;
						break;
					case 'border-width':
						styleSheet.cssRules[i].style.borderWidth = value;

						styleSheet.cssRules[i].style.borderTopWidth = value;
						styleSheet.cssRules[i].style.borderLeftWidth = value;
						styleSheet.cssRules[i].style.borderRightWidth = value;
						styleSheet.cssRules[i].style.borderBottomWidth = value;

						styleSheet.cssRules[i].style.borderTop =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderTopStyle +
							' ' +
							styleSheet.cssRules[i].style.borderTopColor;
						styleSheet.cssRules[i].style.borderLeft =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderLeftStyle +
							' ' +
							styleSheet.cssRules[i].style.borderLeftColor;
						styleSheet.cssRules[i].style.borderRight =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderRightStyle +
							' ' +
							styleSheet.cssRules[i].style.borderRightColor;
						styleSheet.cssRules[i].style.borderBottom =
							value +
							' ' +
							styleSheet.cssRules[i].style.borderBottomStyle +
							' ' +
							styleSheet.cssRules[i].style.borderBottomColor;
						break;
					case 'border-color':
						styleSheet.cssRules[i].style.borderColor = value;

						styleSheet.cssRules[i].style.borderTopColor = value;
						styleSheet.cssRules[i].style.borderLeftColor = value;
						styleSheet.cssRules[i].style.borderRightColor = value;
						styleSheet.cssRules[i].style.borderBottomColor = value;

						break;
					case 'border-style':
						styleSheet.cssRules[i].style.borderStyle = value;

						styleSheet.cssRules[i].style.borderTopStyle = value;
						styleSheet.cssRules[i].style.borderLeftStyle = value;
						styleSheet.cssRules[i].style.borderRightStyle = value;
						styleSheet.cssRules[i].style.borderBottomStyle = value;

						styleSheet.cssRules[i].style.borderTop =
							styleSheet.cssRules[i].style.borderTopWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderTopColor;
						styleSheet.cssRules[i].style.borderLeft =
							styleSheet.cssRules[i].style.borderLeftWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderLeftColor;
						styleSheet.cssRules[i].style.borderRight =
							styleSheet.cssRules[i].style.borderRightWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderRightColor;
						styleSheet.cssRules[i].style.borderBottom =
							styleSheet.cssRules[i].style.borderBottomWidth +
							' ' +
							value +
							' ' +
							styleSheet.cssRules[i].style.borderBottomColor;
						break;
					case 'border-radius':
						styleSheet.cssRules[i].style.borderRadius = value;

						styleSheet.cssRules[i].style.borderTopLeftRadius = value;
						styleSheet.cssRules[i].style.borderTopRightRadius = value;
						styleSheet.cssRules[i].style.borderBottomLeftRadius = value;
						styleSheet.cssRules[i].style.borderBottomRightRadius = value;
						styleSheet.cssRules[i].style.webkitBorderRadius = value;

						styleSheet.cssRules[i].style.webkitBorderTopLeftRadius = value;
						styleSheet.cssRules[i].style.webkitBorderTopRightRadius = value;
						styleSheet.cssRules[i].style.webkitBorderBottomLeftRadius = value;
						styleSheet.cssRules[i].style.webkitBorderBottomRightRadius = value;
						break;
					case 'background-color':
						styleSheet.cssRules[i].style.backgroundColor = value;
						break;
					default:
						break;
				}
				break;
			}
		}
	}

	function updateColumnContentFocusRule(formID, row, column, selector, rule, value) {
		// Style is changed to the column content, not to the whole column
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			// if (
			//     //chrome firefox
			//     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + selector + ":focus" ||
			//     // edge
			//     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + selector + ":focus"
			// ) {
			if (
				// chrome firefox
				styleSheet.cssRules[i].selectorText ==
					'.rex-element-wrapper[data-rex-element-id="' +
						formID +
						'"] .wpcf7-row[wpcf7-row-number="' +
						row +
						'"] .wpcf7-column[wpcf7-column-number="' +
						column +
						'"] .' +
						selector +
						':focus' ||
				// edge
				styleSheet.cssRules[i].selectorText ==
					'[data-rex-element-id="' + formID + '"].rex-element-wrapper .' + selector + ':focus'
			) {
				switch (rule) {
					case 'text-color':
						styleSheet.cssRules[i].style.color = value;
						break;
					default:
						break;
				}
				break;
			}
		}
	}

	function updateColumnContentHoverRule(formID, row, column, selector, rule, value) {
		// Style is changed to the column content, not to the whole column
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			// if (
			//     //chrome firefox
			//     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + selector + ":focus" ||
			//     // edge
			//     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + selector + ":focus"
			// ) {
			if (
				// chrome firefox
				styleSheet.cssRules[i].selectorText ==
					'.rex-element-wrapper[data-rex-element-id="' +
						formID +
						'"] .wpcf7-row[wpcf7-row-number="' +
						row +
						'"] .wpcf7-column[wpcf7-column-number="' +
						column +
						'"] .' +
						selector +
						':hover' ||
				// edge
				styleSheet.cssRules[i].selectorText ==
					'[data-rex-element-id="' + formID + '"].rex-element-wrapper .' + selector + ':hover'
			) {
				switch (rule) {
					case 'text-color':
						styleSheet.cssRules[i].style.color = value;
						break;
					case 'background-color':
						styleSheet.cssRules[i].style.backgroundColor = value;
						break;
					case 'border-color':
						styleSheet.cssRules[i].style.borderColor = value;
						break;
					default:
						break;
				}
				break;
			}
		}
	}

	function updateColumnContentPlaceholderHoverRule(formID, row, column, selector, rule, value) {
		// Style is changed to the column content, not to the whole column
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			// if (
			//     //chrome firefox
			//     styleSheet.cssRules[i].selectorText == ".rex-element-wrapper[data-rex-element-id=\"" + formID + "\"] .wpcf7-row[wpcf7-row-number=\"" + row + "\"] .wpcf7-column[wpcf7-column-number=\"" + column + "\"] " + selector + ":focus" ||
			//     // edge
			//     styleSheet.cssRules[i].selectorText == "[data-rex-element-id=\"" + formID + "\"].rex-element-wrapper [wpcf7-row-number=\"" + row + "\"].wpcf7-row [wpcf7-column-number=\"" + column + "\"].wpcf7-column" + selector + ":focus"
			// ) {
			if (
				// chrome firefox
				styleSheet.cssRules[i].selectorText ==
					'.rex-element-wrapper[data-rex-element-id="' +
						formID +
						'"] .wpcf7-row[wpcf7-row-number="' +
						row +
						'"] .wpcf7-column[wpcf7-column-number="' +
						column +
						'"] .' +
						selector +
						':hover::placeholder' ||
				// edge
				styleSheet.cssRules[i].selectorText ==
					'[data-rex-element-id="' + formID + '"].rex-element-wrapper .' + selector + ':hover::placeholder'
			) {
				switch (rule) {
					case 'text-color':
						styleSheet.cssRules[i].style.color = value;
						break;
					case 'background-color':
						styleSheet.cssRules[i].style.backgroundColor = value;
						break;
					case 'border-color':
						styleSheet.cssRules[i].style.borderColor = value;
						break;
					default:
						break;
				}
				break;
			}
		}
	}

	// Removing Rules

	function removeFormRule(formID) {
		var formSelector = '.rex-element-wrapper[data-rex-element-id="' + formID + '"] .wpcf7-form';

		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (styleSheet.cssRules[i].selectorText == formSelector) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	}

	function removeColumnContentRule(formID, row, column, selector) {
		var columnSelector =
			'.rex-element-wrapper[data-rex-element-id="' +
			formID +
			'"] .wpcf7-row[wpcf7-row-number="' +
			row +
			'"] .wpcf7-column[wpcf7-column-number="' +
			column +
			'"] .' +
			selector;

		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (styleSheet.cssRules[i].selectorText == columnSelector) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	}

	function removeColumnContentHoverRule(formID, row, column, selector) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				styleSheet.cssRules[i].selectorText ==
				'.rex-element-wrapper[data-rex-element-id="' +
					formID +
					'"] .wpcf7-row[wpcf7-row-number="' +
					row +
					'"] .wpcf7-column[wpcf7-column-number="' +
					column +
					'"] .' +
					selector +
					':hover'
			) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	}

	function removeColumnContentFocusRule(formID, row, column, selector) {
		for (var i = 0; i < styleSheet.cssRules.length; i++) {
			if (
				styleSheet.cssRules[i].selectorText ==
				'.rex-element-wrapper[data-rex-element-id="' +
					formID +
					'"] .wpcf7-row[wpcf7-row-number="' +
					row +
					'"] .wpcf7-column[wpcf7-column-number="' +
					column +
					'"] .' +
					selector +
					':focus'
			) {
				styleSheet.deleteRule(i);
				break;
			}
		}
	}

	/* ===== CSS Rules Functions End ===== */

	/* ===== PUBLIC METHODS ===== */

	function updateForm(data) {
		var formData = data.elementData.wpcf7_data;
		var formID = data.elementData.element_target.element_id;

		updateFormRule(formID, 'background-color', formData.background_color);
		updateFormRule(formID, 'border-color', formData.border_color);
		updateFormRule(formID, 'border-width', formData.border_width);
		updateFormRule(formID, 'margin-top', formData.margin_top);
		updateFormRule(formID, 'margin-left', formData.margin_left);
		updateFormRule(formID, 'margin-right', formData.margin_right);
		updateFormRule(formID, 'margin-bottom', formData.margin_bottom);

		updateFormMessageRule(formID, 'wpcf7-validation-errors', 'text-color', formData.error_message_color);
		updateFormMessageRule(formID, 'wpcf7-validation-errors', 'font-size', formData.error_message_font_size);
		updateFormMessageRule(formID, 'wpcf7-mail-sent-ok ', 'text-color', formData.send_message_color);
		updateFormMessageRule(formID, 'wpcf7-mail-sent-ok ', 'font-size', formData.send_message_font_size);

		updateFormColumnsRule(formID, 'padding-top', formData.columns.padding_top);
		updateFormColumnsRule(formID, 'padding-left', formData.columns.padding_left);
		updateFormColumnsRule(formID, 'padding-right', formData.columns.padding_right);
		updateFormColumnsRule(formID, 'padding-bottom', formData.columns.padding_bottom);

		updateFormContent(data.elementData);

		var $elementWrappers = Rexbuilder_Util.$rexContainer.find(
			'.rex-element-wrapper[data-rex-element-id="' + formID + '"]'
		);
		_updateFormsData($elementWrappers, formData);
	}

	function updateFormContent(data) {
		var formData = data;
		var elementID = formData.element_target.element_id;
		var optionsDifferent = formData.wpcf7_data.options_different;
		var $formColumns = Rexbuilder_Util.$rexContainer
			.find('.rex-element-wrapper[data-rex-element-id="' + elementID + '"] .wpcf7-column')
			.not('.with-button');

		$formColumns.each(function (index, element) {
			var $currentColumn = $(element);
			var spanDataExists = 0 !== $currentColumn.find('.rex-wpcf7-column-content-data').length;
			var currentColumnData = generateColumnContentData($currentColumn, spanDataExists);
			var inputType = currentColumnData.input_type;

			if (inputType != 'file' && inputType != 'radio' && inputType != 'acceptance') {
				currentColumnData.background_color = formData.wpcf7_data.content.background_color;
				currentColumnData.background_color_hover = formData.wpcf7_data.content.background_color_hover;
				currentColumnData.border_color = formData.wpcf7_data.content.border_color;
				currentColumnData.border_color_hover = formData.wpcf7_data.content.border_color_hover;
				currentColumnData.border_width = formData.wpcf7_data.content.border_width;
				currentColumnData.border_radius = formData.wpcf7_data.content.border_radius;
			}

			if (!optionsDifferent.width) {
				currentColumnData.input_width = formData.wpcf7_data.content.width;
			}

			if (!optionsDifferent.height) {
				currentColumnData.input_height = formData.wpcf7_data.content.height;
			}

			if (!optionsDifferent.font_size) {
				currentColumnData.font_size = formData.wpcf7_data.content.font_size;
			}

			if (!optionsDifferent.text_color) {
				currentColumnData.text_color = formData.wpcf7_data.content.text_color;
			}

			currentColumnData.text_color_hover = formData.wpcf7_data.content.text_color_hover;

			var updateData = {
				columnContentData: currentColumnData
			};
			updateColumnContent(updateData);
		});
	}

	function refreshFormStyle($form, needToUpdateForm) {
		_removeFormStyle($form);
		addFormStyle($form, needToUpdateForm);
	}

	function addFormStyle($form, needToUpdateForm) {
		needToUpdateForm = 'undefined' === typeof needToUpdateForm ? false : needToUpdateForm;

		var $elementWrapper = $form.parents('.rex-element-wrapper');
		var hasElementData = 0 !== $elementWrapper.find('.rex-element-data').length;

		if (hasElementData) {
			var elementData = Rexbuilder_Rexelement.generateElementData($elementWrapper);
			var formID = elementData.elementInfo.element_target.element_id;
			var formData = elementData.elementInfo.wpcf7_data;
			_addFormCSSRules(formID, formData);

			if (needToUpdateForm) {
				updateForm({
					elementData: {
						element_target: elementData.elementInfo.element_target,
						synchronize: elementData.elementInfo.synchronize,
						wpcf7_data: elementData.elementInfo.wpcf7_data
					},
					separateElement: elementData.separateElement
				});
			}
		}
	}

	/**
	 * Removes and re-adds style to the column passed.
	 * In this way the style reflects the data in the
	 * column data.
	 * @param  {jQuery} $formColumn the column to refresh the style
	 */
	function refreshColumnContentStyle($formColumn) {
		_removeColumnContentStyle($formColumn);
		addColumnContentStyle($formColumn);
	}

	function addColumnContentStyle($formColumn) {
		if ($formColumn.get(0).querySelector('.rex-wpcf7-column-content-data')) {
			var columnContentData = generateColumnContentData($formColumn, true);
			var formID = columnContentData.target.element_id;
			_addColumnContentCSSRules(formID, columnContentData);
		}
	}

	function updateColumnContent(data) {
		var columnContentData = data.columnContentData;
		var formID = columnContentData.target.element_id;
		var row = columnContentData.target.row_number;
		var column = columnContentData.target.column_number;
		var inputType = columnContentData.input_type;
		var fieldClass = columnContentData.field_class;

		// var buttonText = columnContentData.wpcf7_button.text;
		var buttonHeight = columnContentData.wpcf7_button.height;
		var buttonWidth = columnContentData.wpcf7_button.width;
		var buttonBorderWidth = columnContentData.wpcf7_button.border_width;
		var buttonBorderRadius = columnContentData.wpcf7_button.border_radius;
		var buttonMarginTop = columnContentData.wpcf7_button.margin_top;
		var buttonMarginRight = columnContentData.wpcf7_button.margin_right;
		var buttonMarginBottom = columnContentData.wpcf7_button.margin_bottom;
		var buttonMarginLeft = columnContentData.wpcf7_button.margin_left;
		var buttonPaddingTop = columnContentData.wpcf7_button.padding_top;
		var buttonPaddingRight = columnContentData.wpcf7_button.padding_right;
		var buttonPaddingBottom = columnContentData.wpcf7_button.padding_bottom;
		var buttonPaddingLeft = columnContentData.wpcf7_button.padding_left;
		var buttonFontSize = columnContentData.wpcf7_button.font_size;

		var backgroundColor = columnContentData.background_color;
		var backgroundColorHover = columnContentData.background_color_hover;
		var textColor = columnContentData.text_color;
		var textColorHover = columnContentData.text_color_hover;
		var textColorFocus = columnContentData.text_color_focus;
		var placeholderColor = columnContentData.palceholder_color;
		var placeholderColorHover = columnContentData.palceholder_color_hover;
		var borderColor = columnContentData.border_color;
		var borderColorHover = columnContentData.border_color_hover;
		var buttonTextColor = columnContentData.wpcf7_button.text_color;
		var buttonTextColorHover = columnContentData.wpcf7_button.text_color_hover;
		var buttonBackgroundColor = columnContentData.wpcf7_button.background_color;
		var buttonBackgroundColorHover = columnContentData.wpcf7_button.background_color_hover;
		var buttonBorderColor = columnContentData.wpcf7_button.border_color;
		var buttonBorderColorHover = columnContentData.wpcf7_button.border_color_hover;

		var cssSelector;
		switch (inputType) {
			case 'text':
			case 'email':
			case 'number':
			case 'textarea':
			case 'select':
				cssSelector = 'wpcf7-' + inputType;
				break;
			case 'acceptance':
				cssSelector = 'wpcf7-form-control-wrap';
				break;
			case 'submit':
			case 'file':
				cssSelector = fieldClass;
				break;
			case 'radio':
				cssSelector = 'wpcf7-form-control-wrap.' + fieldClass;
				break;
			default:
				break;
		}

		if (inputType == 'acceptance' || inputType == 'radio') {
			updateColumnContentRule(formID, row, column, cssSelector, 'display', 'inline-flex');
		}

		if ('radio' === inputType) {
			updateColumnContentRule(
				formID,
				row,
				column,
				cssSelector + ' .wpcf7-radio-label',
				'font-size',
				columnContentData.font_size
			);
		}

		if ('acceptance' === inputType) {
			updateColumnContentRule(
				formID,
				row,
				column,
				cssSelector + ' .wpcf7-list-item-label',
				'font-size',
				columnContentData.font_size
			);
		}

		if (inputType == 'text' || inputType == 'email' || inputType == 'number' || inputType == 'textarea') {
			updateColumnContentRule(formID, row, column, cssSelector + '::placeholder', 'text-color', placeholderColor);
			updateColumnContentPlaceholderHoverRule(formID, row, column, cssSelector, 'text-color', placeholderColorHover);
		}

		if (inputType != 'submit') {
			updateColumnContentHoverRule(formID, row, column, cssSelector, 'color', textColorHover);
			updateColumnContentHoverRule(formID, row, column, cssSelector, 'background-color', backgroundColorHover);
			updateColumnContentHoverRule(formID, row, column, cssSelector, 'border-color', borderColorHover);

			updateColumnContentRule(formID, row, column, cssSelector, 'width', columnContentData.input_width);
			updateColumnContentRule(formID, row, column, cssSelector, 'height', columnContentData.input_height);
			updateColumnContentRule(formID, row, column, cssSelector, 'font-size', columnContentData.font_size);
			updateColumnContentRule(formID, row, column, cssSelector, 'border-width', columnContentData.border_width);
			updateColumnContentRule(formID, row, column, cssSelector, 'border-radius', columnContentData.border_radius);

			updateColumnContentRule(formID, row, column, cssSelector, 'text-color', textColor);
			updateColumnContentRule(formID, row, column, cssSelector, 'background-color', backgroundColor);
			updateColumnContentRule(formID, row, column, cssSelector, 'border-color', borderColor);

			if (inputType == 'file') {
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'height', buttonHeight);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'width', buttonWidth);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'border-width', buttonBorderWidth);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'border-radius', buttonBorderRadius);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'margin-top', buttonMarginTop);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'margin-right', buttonMarginRight);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'margin-bottom', buttonMarginBottom);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'margin-left', buttonMarginLeft);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'padding-top', buttonPaddingTop);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'padding-right', buttonPaddingRight);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'padding-bottom', buttonPaddingBottom);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'padding-left', buttonPaddingLeft);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'font-size', buttonFontSize);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'text-color', buttonTextColor);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'background-color', buttonBackgroundColor);
				updateColumnContentRule(formID, row, column, cssSelector + ' label', 'border-color', buttonBorderColor);

				updateColumnContentHoverRule(formID, row, column, cssSelector + ' label', 'text-color', buttonTextColorHover);
				updateColumnContentHoverRule(
					formID,
					row,
					column,
					cssSelector + ' label',
					'background-color',
					buttonBackgroundColorHover
				);
				updateColumnContentHoverRule(
					formID,
					row,
					column,
					cssSelector + ' label',
					'border-color',
					buttonBorderColorHover
				);
			}
		} else {
			// Field is submit
			updateColumnContentRule(formID, row, column, cssSelector, 'height', buttonHeight);
			updateColumnContentRule(formID, row, column, cssSelector, 'width', buttonWidth);
			updateColumnContentRule(formID, row, column, cssSelector, 'border-width', buttonBorderWidth);
			updateColumnContentRule(formID, row, column, cssSelector, 'border-radius', buttonBorderRadius);
			updateColumnContentRule(formID, row, column, cssSelector, 'margin-top', buttonMarginTop);
			updateColumnContentRule(formID, row, column, cssSelector, 'margin-right', buttonMarginRight);
			updateColumnContentRule(formID, row, column, cssSelector, 'margin-bottom', buttonMarginBottom);
			updateColumnContentRule(formID, row, column, cssSelector, 'margin-left', buttonMarginLeft);
			updateColumnContentRule(formID, row, column, cssSelector, 'padding-top', buttonPaddingTop);
			updateColumnContentRule(formID, row, column, cssSelector, 'padding-right', buttonPaddingRight);
			updateColumnContentRule(formID, row, column, cssSelector, 'padding-bottom', buttonPaddingBottom);
			updateColumnContentRule(formID, row, column, cssSelector, 'padding-left', buttonPaddingLeft);
			updateColumnContentRule(formID, row, column, cssSelector, 'font-size', buttonFontSize);
			updateColumnContentRule(formID, row, column, cssSelector, 'text-color', buttonTextColor);
			updateColumnContentRule(formID, row, column, cssSelector, 'background-color', buttonBackgroundColor);
			updateColumnContentRule(formID, row, column, cssSelector, 'border-color', buttonBorderColor);

			updateColumnContentHoverRule(formID, row, column, cssSelector, 'text-color', buttonTextColorHover);
			updateColumnContentHoverRule(formID, row, column, cssSelector, 'background-color', buttonBackgroundColorHover);
			updateColumnContentHoverRule(formID, row, column, cssSelector, 'border-color', buttonBorderColorHover);
		}

		updateColumnContentFocusRule(formID, row, column, cssSelector, 'text-color', textColorFocus);

		_updateSpanData(formID, columnContentData);
	}

	/**
	 * Generate column content data from the DOM and from the span
	 * element in the DOM.
	 *
	 * The obtained object has 1 field:
	 * columnContentData - properties of the column content
	 *
	 * @param {jQuery} $formColumn Column of the form we are editing
	 * @param {boolean} spanDataExists Does the span containing the data exist?
	 * @returns {Object} data
	 */
	function generateColumnContentData($formColumn, spanDataExists) {
		var columnContentData = {
			wpcf7_required_field: '',
			wpcf7_email: '',
			wpcf7_only_numbers: '',
			wpcf7_default_check: '',
			wpcf7_placeholder: '',
			wpcf7_list_fields: [],
			wpcf7_file_max_dimensions: '',
			wpcf7_button: {
				text: '',
				font_size: '',
				height: '',
				width: '',
				border_width: '',
				border_radius: '',
				margin_top: '',
				margin_right: '',
				margin_bottom: '',
				margin_left: '',
				padding_top: '',
				padding_right: '',
				padding_bottom: '',
				padding_left: '',
				text_color: '',
				text_color_hover: '',
				background_color: '',
				background_color_hover: '',
				border_color: '',
				border_color_hover: ''
			},
			input_width: '',
			input_height: '',
			font_size: '',
			border_width: '',
			border_radius: '',
			background_color: '',
			background_color_hover: '',
			border_color: '',
			border_color_hover: '',
			placeholder_color: '',
			placeholder_hover_color: '',
			select_color_after_selection: '',
			text_color: '',
			text_color_hover: '',
			text_color_focus: '',
			text: '',
			type: '',
			field_class: '',
			input_type: '',
			target: {
				element_id: '',
				row_number: '',
				column_number: ''
			}
		};

		// Element ID
		columnContentData.target.element_id = $formColumn.parents('.rex-element-wrapper').attr('data-rex-element-id');

		// Row number
		columnContentData.target.row_number = $formColumn.parents('.wpcf7-row').attr('wpcf7-row-number');

		// Column number
		columnContentData.target.column_number = $formColumn.attr('wpcf7-column-number');

		// Field class
		// If needed, it's possible to get:
		// -	-rexclone-{number} in the 2nd group match
		// -	only the rexclone number in the 3nd group match
		var classRegExp = /([a-z]+\-[\d]+)(-rexclone-([\d]+))?/;
		var partialMatch;

		var $formControl = $formColumn.find('.wpcf7-form-control');
		columnContentData.field_class = null;

		if (0 !== $formControl.length) {
			partialMatch = $formControl.get(0).className.match(classRegExp);

			if (!partialMatch) {
				var formControlWrapClass = $formColumn.find('.wpcf7-form-control-wrap').get(0).className;
				partialMatch = formControlWrapClass.match(classRegExp);

				if (!partialMatch) {
					var checkboxClass = $formColumn.find('[type=checkbox]').get(0).className;
					partialMatch = checkboxClass.match(classRegExp);
				}
			}

			columnContentData.field_class = partialMatch[0];
		}

		// Input type
		columnContentData.input_type = /[a-z]+/.exec(columnContentData.field_class)[0];
		columnContentData.input_type = columnContentData.input_type == 'menu' ? 'select' : columnContentData.input_type;

		var inputType = columnContentData.input_type;
		var cssSelector;
		switch (inputType) {
			case 'text':
			case 'email':
			case 'number':
			case 'textarea':
			case 'select':
				cssSelector = 'wpcf7-' + inputType;
				break;
			case 'acceptance':
				cssSelector = 'wpcf7-form-control-wrap';
				break;
			case 'submit':
			case 'file':
				cssSelector = columnContentData.field_class;
				break;
			case 'radio':
				cssSelector = 'wpcf7-form-control-wrap.' + columnContentData.field_class;
				break;
			default:
				break;
		}

		// Checkbox text editor
		if (columnContentData.input_type == 'acceptance') {
			columnContentData.text = $formColumn.find('.wpcf7-list-item-label').html();
		}

		// File text editor
		if (columnContentData.input_type == 'file') {
			columnContentData.text = $formColumn.find('.wpcf7-file-caption').html();
		}

		// Menu fields
		var $listFields = $formColumn.find('.wpcf7-select').eq(0).find('option');
		if ($listFields.length != 0) {
			$listFields.each(function (i, el) {
				if ('' !== el.value && !el.getAttribute('disabled')) {
					columnContentData.wpcf7_list_fields.push(el.textContent);
				}
			});
		}

		// Radio fields
		if (0 !== $formColumn.find('.wpcf7-radio').length) {
			var $listFields2 = $formColumn.find('.wpcf7-radio').eq(0).find('.wpcf7-radio-label');
			if (0 === $listFields2.length) {
				$listFields2 = $formColumn.find('.wpcf7-radio').eq(0).find('.wpcf7-list-item-label');
			}

			$listFields2.each(function (i, el) {
				columnContentData.wpcf7_list_fields.push(el.textContent);
			});
		}

		if (spanDataExists) {
			/* Extracting data from span in the DOM */
			var $columnContentData = $formColumn.find('.rex-wpcf7-column-content-data').eq(0);
			var columnContentDataEl = $columnContentData[0];

			// Required field
			var isRequiredField = $formColumn.find('.wpcf7-validates-as-required').length !== 0;
			if (!isRequiredField) {
				var isAcceptance = $formColumn.find('.wpcf7-acceptance').length !== 0;
				if (isAcceptance) {
					isRequiredField = $formColumn.find('.wpcf7-acceptance.optional') === 0;
				}
			}
			columnContentData.wpcf7_required_field = columnContentDataEl.getAttribute('data-wpcf7-required-field')
				? 'true' === columnContentDataEl.getAttribute('data-wpcf7-required-field')
				: isRequiredField;

			// E-Mail
			var isEmail = $formColumn.find('.wpcf7-validates-as-email').length !== 0;
			columnContentData.wpcf7_email = columnContentDataEl.getAttribute('data-wpcf7-email')
				? 'true' === columnContentDataEl.getAttribute('data-wpcf7-email').toString()
				: isEmail;

			// Only numbers
			var isNumberInput = $formColumn.find('.wpcf7-validates-as-number').length !== 0;
			columnContentData.wpcf7_only_numbers = columnContentDataEl.getAttribute('data-wpcf7-only-numbers')
				? 'true' === columnContentDataEl.getAttribute('data-wpcf7-only-numbers').toString()
				: isNumberInput;

			// Default check
			var isDefaultChecked = $formColumn.find('.wpcf7-acceptance [type=checkbox]').prop('checked') !== undefined;
			columnContentData.wpcf7_default_check = columnContentDataEl.getAttribute('data-wpcf7-default-check')
				? 'true' === columnContentDataEl.getAttribute('data-wpcf7-default-check').toString()
				: isDefaultChecked;

			// Placeholder
			columnContentData.wpcf7_placeholder = columnContentDataEl.getAttribute('data-wpcf7-placeholder')
				? columnContentDataEl.getAttribute('data-wpcf7-placeholder').toString()
				: '';

			// File max dimensions
			columnContentData.wpcf7_file_max_dimensions = columnContentDataEl.getAttribute('data-wpcf7-file-max-dimensions')
				? columnContentDataEl.getAttribute('data-wpcf7-file-max-dimensions').toString()
				: columnContentDataDefaults.wpcf7_file_max_dimensions;

			// File types
			if ('file' === columnContentData.input_type) {
				if (columnContentDataEl.getAttribute('data-wpcf7-file-types')) {
					columnContentData.wpcf7_list_fields = columnContentDataEl
						.getAttribute('data-wpcf7-file-types')
						.toString()
						.split(',');
				} else {
					var customFileTypes = $formColumn.find('[type=file]').attr('accept').toString().split(',');
					for (var i = 0; i < customFileTypes.length; i++) {
						customFileTypes[i] = customFileTypes[i].replace('.', '');
					}
					columnContentData.wpcf7_list_fields = customFileTypes;
				}
			}

			// Width & height
			columnContentData.input_width = columnContentDataEl.getAttribute('data-wpcf7-input-width')
				? columnContentDataEl.getAttribute('data-wpcf7-input-width').toString()
				: $formColumn.find('.' + cssSelector).css('width');

			columnContentData.input_height = columnContentDataEl.getAttribute('data-wpcf7-input-height')
				? columnContentDataEl.getAttribute('data-wpcf7-input-height').toString()
				: $formColumn.find('.' + cssSelector).css('height'); // @toedit

			// Font size
			columnContentData.font_size = columnContentDataEl.getAttribute('data-wpcf7-font-size')
				? columnContentDataEl.getAttribute('data-wpcf7-font-size').toString()
				: $formColumn.find('.' + cssSelector).css('font-size');

			// Background color
			columnContentData.background_color = columnContentDataEl.getAttribute('data-background-color')
				? columnContentDataEl.getAttribute('data-background-color').toString()
				: $formColumn.find('.' + cssSelector).css('background-color');

			// Text color
			columnContentData.text_color = columnContentDataEl.getAttribute('data-text-color')
				? columnContentDataEl.getAttribute('data-text-color').toString()
				: $formColumn.find('.' + cssSelector).css('color');

			// Text color focus
			columnContentData.text_color_focus = columnContentDataEl.getAttribute('data-text-color-focus')
				? columnContentDataEl.getAttribute('data-text-color-focus').toString()
				: columnContentDataDefaults.text_color_focus;

			// Select color after selection
			columnContentData.select_color_after_selection = columnContentDataEl.getAttribute(
				'data-select-color-after-selection'
			)
				? columnContentDataEl.getAttribute('data-select-color-after-selection').toString()
				: '';

			// Placeholder color
			columnContentData.placeholder_color = columnContentDataEl.getAttribute('data-placeholder-color')
				? columnContentDataEl.getAttribute('data-placeholder-color').toString()
				: columnContentDataDefaults.placeholder_color; // @toedit

			// Placeholder hover color
			columnContentData.placeholder_hover_color = columnContentDataEl.getAttribute('data-placeholder-hover-color')
				? columnContentDataEl.getAttribute('data-placeholder-hover-color').toString()
				: columnContentDataDefaults.placeholder_hover_color;

			/* ONLY GENERAL MODAL OPTIONS */
			// Border width
			columnContentData.border_width = columnContentDataEl.getAttribute('data-wpcf7-border-width')
				? columnContentDataEl.getAttribute('data-wpcf7-border-width').toString()
				: $formColumn.find('.' + cssSelector).css('border-width');

			// Border radius
			columnContentData.border_radius = columnContentDataEl.getAttribute('data-wpcf7-border-radius')
				? columnContentDataEl.getAttribute('data-wpcf7-border-radius').toString()
				: $formColumn.find('.' + cssSelector).css('border-radius');

			// Background color hover
			columnContentData.background_color_hover = columnContentDataEl.getAttribute('data-background-color-hover')
				? columnContentDataEl.getAttribute('data-background-color-hover').toString()
				: '';

			// Text color hover
			columnContentData.text_color_hover = columnContentDataEl.getAttribute('data-text-color-hover')
				? columnContentDataEl.getAttribute('data-text-color-hover').toString()
				: '';

			// Border color
			columnContentData.border_color = columnContentDataEl.getAttribute('data-border-color')
				? columnContentDataEl.getAttribute('data-border-color').toString()
				: $formColumn.find('.' + cssSelector).css('border-color');

			// Border color hover
			columnContentData.border_color_hover = columnContentDataEl.getAttribute('data-border-color-hover')
				? columnContentDataEl.getAttribute('data-border-color-hover').toString()
				: '';

			/* BUTTON */
			// Button Text
			if (columnContentDataEl.getAttribute('data-button-text')) {
				columnContentData.wpcf7_button.text = columnContentDataEl.getAttribute('data-button-text').toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.text = 'Choose a file';
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.text = $formColumn.find('[type=submit]').val();
				}
			}

			// Button font size
			if (columnContentDataEl.getAttribute('data-button-text-font-size')) {
				columnContentData.wpcf7_button.font_size = columnContentDataEl
					.getAttribute('data-button-text-font-size')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.font_size = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('font-size');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.font_size = $formColumn.find('.' + cssSelector).css('font-size');
				}
			}

			if (/\d+\.\d+/.test(columnContentData.wpcf7_button.font_size)) {
				columnContentData.wpcf7_button.font_size = /\d+/.exec(columnContentData.wpcf7_button.font_size)[0] + 'px';
			}

			// Button height
			if (columnContentDataEl.getAttribute('data-button-height')) {
				columnContentData.wpcf7_button.height = columnContentDataEl.getAttribute('data-button-height').toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.height = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('height');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.height = $formColumn.find('.' + cssSelector).css('height');
				}
			}

			// Button width
			if (columnContentDataEl.getAttribute('data-button-width')) {
				columnContentData.wpcf7_button.width = columnContentDataEl.getAttribute('data-button-width').toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.width = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('width');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.width = $formColumn.find('.' + cssSelector).css('width');
				}
			}

			// Button border width
			if (columnContentDataEl.getAttribute('data-button-border-width')) {
				columnContentData.wpcf7_button.border_width = columnContentDataEl
					.getAttribute('data-button-border-width')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.border_width = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('border-width');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.border_width = $formColumn.find('.' + cssSelector).css('border-width');
				}
			}

			// Button border radius
			if (columnContentDataEl.getAttribute('data-button-border-radius')) {
				columnContentData.wpcf7_button.border_radius = columnContentDataEl
					.getAttribute('data-button-border-radius')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.border_radius = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('border-radius');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.border_radius = $formColumn.find('.' + cssSelector).css('border-radius');
				}
			}

			// Button margin
			if (columnContentDataEl.getAttribute('data-button-margin-top')) {
				columnContentData.wpcf7_button.margin_top = columnContentDataEl
					.getAttribute('data-button-margin-top')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.margin_top = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('margin-top');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.margin_top = $formColumn.find('.' + cssSelector).css('margin-top');
				}
			}

			if (columnContentDataEl.getAttribute('data-button-margin-right')) {
				columnContentData.wpcf7_button.margin_right = columnContentDataEl
					.getAttribute('data-button-margin-right')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.margin_right = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('margin-right');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.margin_right = $formColumn.find('.' + cssSelector).css('margin-right');
				}
			}

			if (columnContentDataEl.getAttribute('data-button-margin-bottom')) {
				columnContentData.wpcf7_button.margin_bottom = columnContentDataEl
					.getAttribute('data-button-margin-bottom')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.margin_bottom = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('margin-bottom');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.margin_bottom = $formColumn.find('.' + cssSelector).css('margin-bottom');
				}
			}

			if (columnContentDataEl.getAttribute('data-button-margin-left')) {
				columnContentData.wpcf7_button.margin_left = columnContentDataEl
					.getAttribute('data-button-margin-left')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.margin_left = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('margin-left');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.margin_left = $formColumn.find('.' + cssSelector).css('margin-left');
				}
			}

			// Button padding
			if (columnContentDataEl.getAttribute('data-button-padding-top')) {
				columnContentData.wpcf7_button.padding_top = columnContentDataEl
					.getAttribute('data-button-padding-top')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.padding_top = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('padding-top');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.padding_top = $formColumn.find('.' + cssSelector).css('padding-top');
				}
			}

			if (columnContentDataEl.getAttribute('data-button-padding-right')) {
				columnContentData.wpcf7_button.padding_right = columnContentDataEl
					.getAttribute('data-button-padding-right')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.padding_right = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('padding-right');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.padding_right = $formColumn.find('.' + cssSelector).css('padding-right');
				}
			}

			if (columnContentDataEl.getAttribute('data-button-padding-bottom')) {
				columnContentData.wpcf7_button.padding_bottom = columnContentDataEl
					.getAttribute('data-button-padding-bottom')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.padding_bottom = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('padding-bottom');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.padding_bottom = $formColumn.find('.' + cssSelector).css('padding-bottom');
				}
			}

			if (columnContentDataEl.getAttribute('data-button-padding-left')) {
				columnContentData.wpcf7_button.padding_left = columnContentDataEl
					.getAttribute('data-button-padding-left')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.padding_left = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('padding-left');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.padding_left = $formColumn.find('.' + cssSelector).css('padding-left');
				}
			}

			// Button text color
			if (columnContentDataEl.getAttribute('data-button-text-color')) {
				columnContentData.wpcf7_button.text_color = columnContentDataEl
					.getAttribute('data-button-text-color')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.text_color = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('color');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.text_color = $formColumn.find('.' + cssSelector).css('color');
				}
			}

			// Button text color hover
			columnContentData.wpcf7_button.text_color_hover = columnContentDataEl.getAttribute('data-button-text-color-hover')
				? columnContentDataEl.getAttribute('data-button-text-color-hover').toString()
				: columnContentDataDefaults.wpcf7_button.text_color_hover;

			// Button background color
			if (columnContentDataEl.getAttribute('data-button-background-color')) {
				columnContentData.wpcf7_button.background_color = columnContentDataEl
					.getAttribute('data-button-background-color')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.background_color = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('background-color');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.background_color = $formColumn.find('.' + cssSelector).css('background-color');
				}
			}

			// Button background color hover
			columnContentData.wpcf7_button.background_color_hover = columnContentDataEl.getAttribute(
				'data-button-background-color-hover'
			)
				? columnContentDataEl.getAttribute('data-button-background-color-hover').toString()
				: columnContentDataDefaults.wpcf7_button.background_color_hover;

			// Button border color
			if (columnContentDataEl.getAttribute('data-button-border-color')) {
				columnContentData.wpcf7_button.border_color = columnContentDataEl
					.getAttribute('data-button-border-color')
					.toString();
			} else {
				if (columnContentData.input_type == 'file') {
					columnContentData.wpcf7_button.border_color = $formColumn
						.find('.' + columnContentData.field_class + ' label')
						.eq(0)
						.css('border-color');
				} else if (columnContentData.input_type == 'submit') {
					columnContentData.wpcf7_button.border_color = $formColumn.find('.' + cssSelector).css('border-color');
				}
			}

			// Button border color hover
			columnContentData.wpcf7_button.border_color_hover = columnContentDataEl.getAttribute(
				'data-button-border-color-hover'
			)
				? columnContentDataEl.getAttribute('data-button-border-color-hover').toString()
				: columnContentDataDefaults.wpcf7_button.border_color_hover;
		} else {
			// Required field
			columnContentData.wpcf7_required_field = columnContentDataDefaults.wpcf7_required_field;

			// Only numbers
			columnContentData.wpcf7_only_numbers = columnContentDataDefaults.wpcf7_only_numbers;

			// Default check
			columnContentData.wpcf7_default_check = columnContentDataDefaults.wpcf7_default_check;

			// Placeholder
			columnContentData.wpcf7_placeholder = columnContentDataDefaults.wpcf7_placeholder;

			// File max dimensions
			columnContentData.wpcf7_file_max_dimensions = columnContentDataDefaults.wpcf7_file_max_dimensions;

			// File types
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_list_fields = ['png', 'jpg', 'jpeg', 'pdf'];
			}

			// Width & height
			columnContentData.input_width = $formColumn.find('.' + cssSelector).css('width'); // @toedit
			columnContentData.input_height = $formColumn.find('.' + cssSelector).css('height'); // @toedit

			// Font size
			columnContentData.font_size = columnContentDataDefaults.font_size;

			// Background color
			columnContentData.background_color = $formColumn.find('.' + cssSelector).css('background-color');

			// Text color
			columnContentData.text_color = $formColumn.find('.' + cssSelector).css('color');

			// Text color focus
			columnContentData.text_color_focus = columnContentDataDefaults.text_color_focus;

			/* BUTTON */
			// Button text
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.text = 'Choose a file';
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.text = 'Send';
			}

			// Button font size
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.font_size = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('font-size');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.font_size = $formColumn.find('.' + cssSelector).css('font-size');
			}

			// Button height
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.height = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('height');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.height = $formColumn.find('.' + cssSelector).css('height');
			}

			// Button width
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.width = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('width');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.width = $formColumn.find('.' + cssSelector).css('width');
			}

			// Button border width
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.border_width = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('border-width');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.border_width = $formColumn.find('.' + cssSelector).css('border-width');
			}

			// Button border radius
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.border_radius = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('border-radius');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.border_radius = $formColumn.find('.' + cssSelector).css('border-radius');
			}

			// Button margin
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.margin_top = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('margin-top');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.margin_top = $formColumn.find('.' + cssSelector).css('margin-top');
			}

			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.margin_right = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('margin-right');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.margin_right = $formColumn.find('.' + cssSelector).css('margin-right');
			}

			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.margin_bottom = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('margin-bottom');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.margin_bottom = $formColumn.find('.' + cssSelector).css('margin-bottom');
			}

			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.margin_left = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('margin-left');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.margin_left = $formColumn.find('.' + cssSelector).css('margin-left');
			}

			// Button padding
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.padding_top = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('padding-top');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.padding_top = $formColumn.find('.' + cssSelector).css('padding-top');
			}

			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.padding_right = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('padding-right');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.padding_right = $formColumn.find('.' + cssSelector).css('padding-right');
			}

			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.padding_bottom = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('padding-bottom');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.padding_bottom = $formColumn.find('.' + cssSelector).css('padding-bottom');
			}

			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.padding_left = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('padding-left');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.padding_left = $formColumn.find('.' + cssSelector).css('padding-left');
			}

			// Button text color
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.text_color = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('color');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.text_color = $formColumn.find('.' + cssSelector).css('color');
			}

			// Button text color hover
			columnContentData.wpcf7_button.text_color_hover = columnContentDataDefaults.wpcf7_button.text_color_hover;

			// Button background color
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.background_color = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('background-color');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.background_color = $formColumn.find('.' + cssSelector).css('background-color');
			}

			// Button background color hover
			columnContentData.wpcf7_button.background_color_hover =
				columnContentDataDefaults.wpcf7_button.background_color_hover;

			// Button border color
			if (columnContentData.input_type == 'file') {
				columnContentData.wpcf7_button.border_color = $formColumn
					.find('.' + columnContentData.field_class + ' label')
					.eq(0)
					.css('border-color');
			} else if (columnContentData.input_type == 'submit') {
				columnContentData.wpcf7_button.border_color = $formColumn.find('.' + cssSelector).css('border-color');
			}

			// Button border color hover
			columnContentData.wpcf7_button.border_color_hover = columnContentDataDefaults.wpcf7_button.border_color_hover;
		}

		return columnContentData;
	}

	/* === Fixing Methods === */

	function fixInputs() {
		Rexbuilder_Util.$rexContainer.find('.wpcf7-column').each(function (i, el) {
			var $formColumn = $(el);

			var possibleFields = {
				text: $formColumn.find('[type=text]').length != 0,
				email: $formColumn.find('.wpcf7-email').length != 0,
				number: $formColumn.find('.wpcf7-number').length != 0,
				textarea: $formColumn.find('.wpcf7-textarea').length != 0,
				select: $formColumn.find('.wpcf7-select').length != 0,
				radio: $formColumn.find('.wpcf7-radio').length != 0,
				acceptance: $formColumn.find('.wpcf7-acceptance').length != 0,
				file: $formColumn.find('.wpcf7-file').length != 0,
				submit: $formColumn.find('.wpcf7-submit').length != 0
			};

			var elementToFix = '';
			for (var type in possibleFields) {
				if (possibleFields[type] == true) {
					elementToFix = type;
					break;
				}
			}

			var $input = null;
			switch (elementToFix) {
				case 'text':
					$input = $formColumn.find('.wpcf7-text');
					$input.attr('size', '');
					break;
				case 'email':
					$input = $formColumn.find('.wpcf7-email');
					$input.attr('size', '');
					break;
				case 'number':
					$input = $formColumn.find('.wpcf7-number');
					$input.attr('size', '');
					break;
				case 'textarea':
					$input = $formColumn.find('.wpcf7-textarea');
					$input.attr('size', '');
					break;
				case 'select':
					$input = $formColumn.find('.wpcf7-select');
					var placeholder = '';

					if ($input.find('option').eq(0).val() == '') {
						var $option = $input.find('option').eq(0);
						$option.attr('disabled', '');
						$option.attr('selected', '');

						placeholder = $option
							.parents('.wpcf7-column')
							.find('.rex-wpcf7-column-content-data')
							.attr('data-wpcf7-placeholder');
						$option.text(placeholder);

						if ('' === $option.text()) {
							$option.text('Select something');
							$input
								.parents('.wpcf7-column')
								.find('.rex-wpcf7-column-content-data')
								.attr('data-wpcf7-placeholder', 'Select something');
						}
					} else {
						var $disabledOption = $('<option value disabled selected></option>');

						$input.prepend($disabledOption);
						placeholder = $input
							.parents('.wpcf7-column')
							.find('.rex-wpcf7-column-content-data')
							.attr('data-wpcf7-placeholder');
						$disabledOption.text(placeholder);

						if ('' === $disabledOption.text()) {
							$disabledOption.text('Select something');
							$input
								.parents('.wpcf7-column')
								.find('.rex-wpcf7-column-content-data')
								.attr('data-wpcf7-placeholder', 'Select something');
						}
					}

					$input.on('change', function () {
						var color = $input
							.parents('.wpcf7-column')
							.find('.rex-wpcf7-column-content-data')
							.attr('data-select-color-after-selection');
						$input.css('color', color);
					});
					break;
				case 'radio':
				case 'acceptance':
				case 'file':
				case 'submit':
				default:
					break;
			}
		});

		fixWpcf7RadioButtons();
		fixWpcf7Files();
	}

	/**
	 * Fixes radio buttons to make them clickable.
	 * @returns		{void}
	 * @since			2.0.2
	 */
	function fixWpcf7RadioButtons() {
		// Has wpcf7-form-control class too
		var radiosInPage = Rexbuilder_Util.rexContainer.querySelectorAll('.wpcf7-radio');
		var tot_radiosInPage = radiosInPage.length;
		var radioEl;

		var radioClass;

		var i = 0;

		for (; i < tot_radiosInPage; i++) {
			// Fixing the radio-xxx class because at page reload it is in the .wpcf7-form-control element
			radioEl = radiosInPage[i];
			radioClass = radioEl.className.match(/radio-\d+/);

			if (radioClass) {
				radioClass = radioClass[0];
				Rexbuilder_Util.removeClass(radioEl, radioClass);
				var fieldName = radioEl.querySelector('[type=radio]').name;

				var fieldParent = radioEl.parentNode; // .wpcf7-form-control-wrap Element
				Rexbuilder_Util.addClass(fieldParent, radioClass);
				Rexbuilder_Util.removeClass(fieldParent, fieldName);
			}
		}

		Rexbuilder_Util.$rexContainer.find('.wpcf7 input[type="radio"]').each(function (i, element) {
			var $element = $(element);

			$element.addClass('with-gap');
			$element.attr('id', 'wpcf7-radio-' + (i + 1));
			var $spanLabel = $element.siblings('.wpcf7-list-item-label');

			if (0 !== $spanLabel.length) {
				var text = $spanLabel.text();
				$spanLabel.empty();

				var $label = $(document.createElement('label'));
				$label.addClass('wpcf7-radio-label');
				$label.attr('for', $element.attr('id'));
				$label.text(text);
				$label.insertAfter($spanLabel);
				$spanLabel.removeClass('wpcf7-list-item-label');
			} else {
				$element.siblings('.wpcf7-radio-label').attr('for', 'wpcf7-radio-' + (i + 1));
			}
		});
	}

	function fixWpcf7Files() {
		Rexbuilder_Util.$rexContainer
			.find('.wpcf7 .wpcf7-form-control-wrap')
			.has('.wpcf7-file')
			.each(function (index, el) {
				if (0 === $(this).find('.wpcf7-file-caption').length) {
					$(this).siblings('.wpcf7-file-caption').detach().appendTo($(this));
				}
				var $element = $(this).find('[type=file]');

				var regexpToMove = /file-\w+/gm;
				var elementClasses = $element[0].classList.toString();
				var classToMove = regexpToMove.exec(elementClasses);

				if (null !== classToMove) {
					classToMove = classToMove[0];
					$element.removeClass(classToMove);
					$element.parents('.wpcf7-form-control-wrap').addClass(classToMove);
				}

				$element.attr('id', 'wpcf7-file-' + (index + 1));
				$element.siblings('label').remove();
				var $fileLabel = $('<label for="' + $element.attr('id') + '"></label>');
				$fileLabel.insertAfter($element);

				if (
					'undefined' !=
					typeof $(this).parents('.wpcf7-column').find('.rex-wpcf7-column-content-data').attr('data-button-text')
				) {
					var buttonText = $(this)
						.parents('.wpcf7-column')
						.find('.rex-wpcf7-column-content-data')
						.attr('data-button-text');
					$fileLabel.text(buttonText);
				} else {
					$fileLabel.text('Choose a file');
					$(this)
						.parents('.wpcf7-column')
						.find('.rex-wpcf7-column-content-data')
						.attr('data-button-text', 'Choose a file');
				}

				var $formColumn = $element.parents('.wpcf7-column');
				var columnContentData = generateColumnContentData($formColumn, true);

				_updateSpanData(columnContentData.target.element_id, columnContentData);
				refreshColumnContentStyle($formColumn);
			});
	}

	/* === Fixing Methods End === */
	/* ===== PUBLIC METHODS END ===== */

	/* ===== PRIVATE METHODS ===== */

	function _addFormCSSRules(formID, formData) {
		var formRule = '';

		formRule += 'background-color: ' + formData.background_color + ';';
		formRule += 'border-style: solid;';
		formRule += 'border-color: ' + formData.border_color + ';';
		formRule += 'border-width: ' + formData.border_width + ';';
		formRule += 'margin-top: ' + formData.margin_top + ';';
		formRule += 'margin-left: ' + formData.margin_left + ';';
		formRule += 'margin-right: ' + formData.margin_right + ';';
		formRule += 'margin-bottom: ' + formData.margin_bottom + ';';
		addFormRule(formID, formRule);

		var formValidationErrorRule = '';

		formValidationErrorRule += 'color:' + formData.error_message_color + ';';
		formValidationErrorRule += 'font-size:' + formData.error_message_font_size + ';';

		addFormMessageRule(formID, 'wpcf7-validation-errors', formValidationErrorRule);

		var formSendMessageRule = '';

		formSendMessageRule += 'color:' + formData.send_message_color + ';';
		formSendMessageRule += 'font-size:' + formData.send_message_font_size + ';';

		addFormMessageRule(formID, 'wpcf7-mail-sent-ok', formSendMessageRule);

		var formColumnsRule = '';

		formColumnsRule += 'padding-top: ' + formData.columns.padding_top + ';';
		formColumnsRule += 'padding-left: ' + formData.columns.padding_left + ';';
		formColumnsRule += 'padding-right: ' + formData.columns.padding_right + ';';
		formColumnsRule += 'padding-bottom: ' + formData.columns.padding_bottom + ';';

		addFormColumnsRule(formID, formColumnsRule);
	}

	function _addColumnContentCSSRules(formID, columnContentData) {
		var row = columnContentData.target.row_number;
		var column = columnContentData.target.column_number;
		var fieldClass = columnContentData.field_class;
		var inputType = columnContentData.input_type;
		var cssSelector;

		switch (inputType) {
			case 'text':
			case 'email':
			case 'number':
			case 'textarea':
			case 'select':
				cssSelector = 'wpcf7-' + inputType;
				break;
			case 'acceptance':
				cssSelector = 'wpcf7-form-control-wrap';
				break;
			case 'file':
			case 'submit':
				cssSelector = fieldClass;
				break;
			case 'radio':
				cssSelector = 'wpcf7-form-control-wrap.' + fieldClass;
				break;
			default:
				break;
		}

		var columnContentFocusRule = '';

		if (inputType != 'select') {
			columnContentFocusRule += 'color: ' + columnContentData.text_color_focus + ';';
			addColumnContentFocusRule(formID, row, column, cssSelector, columnContentFocusRule);
		}

		if (inputType == 'file') {
			var columnContentFileButtonRule = '';

			columnContentFileButtonRule += 'font-size: ' + columnContentData.wpcf7_button.font_size + ';';
			columnContentFileButtonRule += 'height: ' + columnContentData.wpcf7_button.height + ';';
			columnContentFileButtonRule += 'width: ' + columnContentData.wpcf7_button.width + ';';
			columnContentFileButtonRule += 'border-width: ' + columnContentData.wpcf7_button.border_width + ';';
			columnContentFileButtonRule += 'border-radius: ' + columnContentData.wpcf7_button.border_radius + ';';
			columnContentFileButtonRule += 'border-style: solid;';
			columnContentFileButtonRule += 'margin-top: ' + columnContentData.wpcf7_button.margin_top + ';';
			columnContentFileButtonRule += 'margin-right: ' + columnContentData.wpcf7_button.margin_right + ';';
			columnContentFileButtonRule += 'margin-bottom: ' + columnContentData.wpcf7_button.margin_bottom + ';';
			columnContentFileButtonRule += 'margin-left: ' + columnContentData.wpcf7_button.margin_left + ';';
			columnContentFileButtonRule += 'padding-top: ' + columnContentData.wpcf7_button.padding_top + ';';
			columnContentFileButtonRule += 'padding-right: ' + columnContentData.wpcf7_button.padding_right + ';';
			columnContentFileButtonRule += 'padding-bottom: ' + columnContentData.wpcf7_button.padding_bottom + ';';
			columnContentFileButtonRule += 'padding-left: ' + columnContentData.wpcf7_button.padding_left + ';';
			columnContentFileButtonRule += 'color: ' + columnContentData.wpcf7_button.text_color + ';';
			columnContentFileButtonRule += 'background-color: ' + columnContentData.wpcf7_button.background_color + ';';
			columnContentFileButtonRule += 'border-color: ' + columnContentData.wpcf7_button.border_color + ';';

			var columnContentFileButtonHoverRule = '';

			columnContentFileButtonHoverRule += 'color: ' + columnContentData.wpcf7_button.text_color_hover + ';';
			columnContentFileButtonHoverRule +=
				'background-color: ' + columnContentData.wpcf7_button.background_color_hover + ';';
			columnContentFileButtonHoverRule += 'border-color: ' + columnContentData.wpcf7_button.border_color_hover + ';';

			addColumnContentRule(formID, row, column, cssSelector + ' label', columnContentFileButtonRule);
			addColumnContentHoverRule(formID, row, column, cssSelector + ' label', columnContentFileButtonHoverRule);
		}

		if (inputType == 'submit') {
			var columnContentButtonRule = '';

			columnContentButtonRule += 'font-size: ' + columnContentData.wpcf7_button.font_size + ';';
			columnContentButtonRule += 'height: ' + columnContentData.wpcf7_button.height + ';';
			columnContentButtonRule += 'width: ' + columnContentData.wpcf7_button.width + ';';
			columnContentButtonRule += 'border-width: ' + columnContentData.wpcf7_button.border_width + ';';
			columnContentButtonRule += 'border-radius: ' + columnContentData.wpcf7_button.border_radius + ';';
			columnContentButtonRule += 'border-style: solid;';
			columnContentButtonRule += 'margin-top: ' + columnContentData.wpcf7_button.margin_top + ';';
			columnContentButtonRule += 'margin-right: ' + columnContentData.wpcf7_button.margin_right + ';';
			columnContentButtonRule += 'margin-bottom: ' + columnContentData.wpcf7_button.margin_bottom + ';';
			columnContentButtonRule += 'margin-left: ' + columnContentData.wpcf7_button.margin_left + ';';
			columnContentButtonRule += 'padding-top: ' + columnContentData.wpcf7_button.padding_top + ';';
			columnContentButtonRule += 'padding-right: ' + columnContentData.wpcf7_button.padding_right + ';';
			columnContentButtonRule += 'padding-bottom: ' + columnContentData.wpcf7_button.padding_bottom + ';';
			columnContentButtonRule += 'padding-left: ' + columnContentData.wpcf7_button.padding_left + ';';
			columnContentButtonRule += 'color: ' + columnContentData.wpcf7_button.text_color + ';';
			columnContentButtonRule += 'background-color: ' + columnContentData.wpcf7_button.background_color + ';';
			columnContentButtonRule += 'border-color: ' + columnContentData.wpcf7_button.border_color + ';';

			var columnContentButtonHoverRule = '';

			columnContentButtonHoverRule += 'color: ' + columnContentData.wpcf7_button.text_color_hover + ';';
			columnContentButtonHoverRule +=
				'background-color: ' + columnContentData.wpcf7_button.background_color_hover + ';';
			columnContentButtonHoverRule += 'border-color: ' + columnContentData.wpcf7_button.border_color_hover + ';';

			addColumnContentRule(formID, row, column, cssSelector, columnContentButtonRule);
			addColumnContentHoverRule(formID, row, column, cssSelector, columnContentButtonHoverRule);
		} else {
			// Other fields
			var columnContentRule = '';
			var columnContentHoverRule = '';

			if ('acceptance' === inputType || 'radio' === inputType) {
				columnContentRule += 'display: inline-flex;';
			} else if ('file' === inputType) {
				columnContentRule += 'display: block;';
				// columnContentRule += 'overflow: hidden;';
			} else {
				// Text, Number, Email, Textarea, Select
				columnContentRule += 'background-color: ' + columnContentData.background_color + ';';
				columnContentRule += 'border-color: ' + columnContentData.border_color + ';';
				columnContentRule += 'border-style: solid;';
				columnContentRule += 'border-width: ' + columnContentData.border_width + ';';
				columnContentRule += 'border-radius: ' + columnContentData.border_radius + ';';

				columnContentHoverRule += 'background-color: ' + columnContentData.background_color_hover + ';';
				columnContentHoverRule += 'border-color: ' + columnContentData.border_color_hover + ';';
			}

			var labelRule = '';
			if ('radio' === inputType) {
				labelRule += 'font-size: ' + columnContentData.font_size + ';';
				labelRule += 'cursor:pointer;';

				addColumnContentRule(formID, row, column, cssSelector + ' .wpcf7-radio-label', labelRule);
			}

			if ('acceptance' === inputType) {
				labelRule += 'font-size: ' + columnContentData.font_size + ';';
				labelRule += 'cursor:pointer;';

				addColumnContentRule(formID, row, column, cssSelector + ' .wpcf7-list-item-label', labelRule);
			}

			columnContentRule += 'color: ' + columnContentData.text_color + ';';
			columnContentRule += 'width: ' + columnContentData.input_width + ';';
			columnContentRule += 'height: ' + columnContentData.input_height + ';';
			columnContentRule += 'font-size: ' + columnContentData.font_size + ';';
			addColumnContentRule(formID, row, column, cssSelector, columnContentRule);

			columnContentHoverRule += 'color: ' + columnContentData.text_color_hover + ';';
			addColumnContentHoverRule(formID, row, column, cssSelector, columnContentHoverRule);

			if (inputType == 'text' || inputType == 'email' || inputType == 'number' || inputType == 'textarea') {
				var columnContentPlaceholderRule = '';

				columnContentPlaceholderRule += 'color:' + columnContentData.placeholder_color + ';';
				addColumnContentRule(formID, row, column, cssSelector + '::placeholder', columnContentPlaceholderRule);

				var columnContentPlaceholderHoverRule = '';

				columnContentPlaceholderHoverRule += 'color:' + columnContentData.placeholder_hover_color + ';';
				addColumnContentPlaceholderHoverRule(formID, row, column, cssSelector, columnContentPlaceholderHoverRule);
			}
		}
	}

	function _removeFormStyle($form) {
		// var formID = $form.parents('.rex-element-wrapper').attr('data-rex-element-id');
	}

	function _removeColumnContentStyle($formColumn) {
		var formID = $formColumn.parents('.rex-element-wrapper').attr('data-rex-element-id');
		var rowNumber = $formColumn.parents('.wpcf7-row').attr('wpcf7-row-number');
		var columnNumber = $formColumn.attr('wpcf7-column-number');

		var noPlusButtonsInside =
			0 === $formColumn.find('.wpcf7-add-new-form-content').length &&
			0 == $formColumn.parents('#rex-wpcf7-tools').length;

		if (noPlusButtonsInside) {
			var fieldClass = /[a-z]+\-[0-9]+/.exec($formColumn.find('.wpcf7-form-control').get(0).classList);

			if (null === fieldClass) {
				fieldClass = /[a-z]+\-[0-9]+/.exec($formColumn.find('.wpcf7-form-control-wrap').get(0).classList);

				if (null === fieldClass) {
					fieldClass = /[a-z]+\-[0-9]+/.exec($formColumn.find('[type=checkbox]').get(0).classList)[0];
				} else {
					fieldClass = fieldClass[0];
				}
			} else {
				fieldClass = fieldClass[0];
			}

			var inputType = /[a-z]+/.exec(fieldClass)[0];
			inputType = inputType == 'menu' ? 'select' : inputType;

			var cssSelector;
			switch (inputType) {
				case 'text':
				case 'email':
				case 'number':
				case 'textarea':
				case 'select':
					cssSelector = 'wpcf7-' + inputType;
					break;
				case 'acceptance':
					cssSelector = 'wpcf7-form-control-wrap';
					break;
				case 'submit':
					cssSelector = fieldClass;
					break;
				case 'file':
					cssSelector = fieldClass;
					removeColumnContentRule(formID, rowNumber, columnNumber, cssSelector + ' label');
					removeColumnContentHoverRule(formID, rowNumber, columnNumber, cssSelector + ' label');
					break;
				case 'radio':
					cssSelector = 'wpcf7-form-control-wrap.' + fieldClass;
					// _removeColumnContentRule(formID, rowNumber, columnNumber, cssSelector + ' label');
					break;
				default:
					break;
			}

			removeColumnContentRule(formID, rowNumber, columnNumber, cssSelector);
			removeColumnContentHoverRule(formID, rowNumber, columnNumber, cssSelector);
			removeColumnContentFocusRule(formID, rowNumber, columnNumber, cssSelector);
		}
	}

	/**
	 * Updates multiple forms data.
	 * @param  {jQuery} $elementWrappers
	 * @param  {Array} formData Data to update
	 */
	function _updateFormsData($elementWrappers, formData) {
		$elementWrappers.each(function () {
			var $formData = $(this).find('.rex-element-data').eq(0);

			$formData.attr('data-wpcf7-background-color', formData.background_color);
			$formData.attr('data-wpcf7-border-color', formData.border_color);
			$formData.attr('data-wpcf7-border-width', formData.border_width);
			$formData.attr('data-wpcf7-margin-top', formData.margin_top);
			$formData.attr('data-wpcf7-margin-left', formData.margin_left);
			$formData.attr('data-wpcf7-margin-right', formData.margin_right);
			$formData.attr('data-wpcf7-margin-bottom', formData.margin_bottom);
			$formData.attr('data-wpcf7-error-message-color', formData.error_message_color);
			$formData.attr('data-wpcf7-error-message-font-size', formData.error_message_font_size);
			$formData.attr('data-wpcf7-send-message-color', formData.send_message_color);
			$formData.attr('data-wpcf7-send-message-font-size', formData.send_message_font_size);
			$formData.attr('data-wpcf7-columns-padding-top', formData.columns.padding_top);
			$formData.attr('data-wpcf7-columns-padding-left', formData.columns.padding_left);
			$formData.attr('data-wpcf7-columns-padding-right', formData.columns.padding_right);
			$formData.attr('data-wpcf7-columns-padding-bottom', formData.columns.padding_bottom);
			$formData.attr('data-wpcf7-content-width', formData.content.width);
			$formData.attr('data-wpcf7-content-height', formData.content.height);
			$formData.attr('data-wpcf7-content-font-size', formData.content.font_size);
			$formData.attr('data-wpcf7-content-border-width', formData.content.border_width);
			$formData.attr('data-wpcf7-content-border-radius', formData.content.border_radius);
			$formData.attr('data-wpcf7-content-text-color', formData.content.text_color);
			$formData.attr('data-wpcf7-content-text-color-hover', formData.content.text_color_hover);
			$formData.attr('data-wpcf7-content-background-color', formData.content.background_color);
			$formData.attr('data-wpcf7-content-background-color-hover', formData.content.background_color_hover);
			$formData.attr('data-wpcf7-content-border-color', formData.content.border_color);
			$formData.attr('data-wpcf7-content-border-color-hover', formData.content.border_color_hover);
		});
	}

	/**
	 * Updates multiple column content data.
	 * @param  {string/int} formID
	 * @param  {Array} columnContentData Data to update
	 * @return {null}
	 */
	function _updateSpanData(formID, columnContentData) {
		// If editing a separate element, will always be length = 1
		// If editing a model element, will be length >= 1
		var $formToUpdate = Rexbuilder_Util.$rexContainer
			.find('.rex-element-wrapper[data-rex-element-id="' + formID + '"]')
			.find('.wpcf7-form');
		var row = columnContentData.target.row_number;
		var column = columnContentData.target.column_number;

		var inputType = columnContentData.input_type;

		$formToUpdate.each(function () {
			var $columnData = $(this)
				.find('.wpcf7-row[wpcf7-row-number="' + row + '"]')
				.find('.wpcf7-column[wpcf7-column-number="' + column + '"]')
				.find('.rex-wpcf7-column-content-data');

			if ('submit' !== inputType && 'radio' !== inputType) {
				$columnData.attr('data-wpcf7-required-field', columnContentData.wpcf7_required_field);
			}

			if ('text' === inputType || 'email' === inputType || 'number' === inputType) {
				$columnData.attr('data-wpcf7-email', columnContentData.wpcf7_email);
				$columnData.attr('data-wpcf7-only-numbers', columnContentData.wpcf7_only_numbers);
			}

			if ('acceptance' === inputType) {
				$columnData.attr('data-wpcf7-default-check', columnContentData.wpcf7_default_check);
			}

			if (
				'text' === inputType ||
				'email' === inputType ||
				'number' === inputType ||
				'textarea' === inputType ||
				'select' === inputType
			) {
				$columnData.attr('data-wpcf7-placeholder', columnContentData.wpcf7_placeholder);
			}

			if ('file' === inputType) {
				$columnData.attr('data-wpcf7-file-max-dimensions', columnContentData.wpcf7_file_max_dimensions);
				$columnData.attr('data-wpcf7-file-types', columnContentData.wpcf7_list_fields);
			}

			if (inputType != 'file' && inputType != 'radio' && inputType != 'acceptance') {
				$columnData.attr('data-wpcf7-border-width', columnContentData.border_width);
				$columnData.attr('data-wpcf7-border-radius', columnContentData.border_radius);
				$columnData.attr('data-background-color', columnContentData.background_color);
				$columnData.attr('data-background-color-hover', columnContentData.background_color_hover);
				$columnData.attr('data-border-color', columnContentData.border_color);
				$columnData.attr('data-border-color-hover', columnContentData.border_color_hover);
			}

			$columnData.attr('data-wpcf7-input-width', columnContentData.input_width);
			$columnData.attr('data-wpcf7-input-height', columnContentData.input_height);
			$columnData.attr('data-wpcf7-font-size', columnContentData.font_size);
			$columnData.attr('data-text-color', columnContentData.text_color);
			$columnData.attr('data-text-color-hover', columnContentData.text_color_hover);
			$columnData.attr('data-text-color-focus', columnContentData.text_color_focus);

			if ('select' === inputType) {
				$columnData.attr('data-select-color-after-selection', columnContentData.select_color_after_selection);
			}

			if ('text' === inputType || 'email' === inputType || 'number' === inputType || 'textarea' === inputType) {
				$columnData.attr('data-placeholder-color', columnContentData.placeholder_color);
				$columnData.attr('data-placeholder-hover-color', columnContentData.placeholder_hover_color);
			}

			if ('file' === inputType || 'submit' === inputType) {
				$columnData.attr('data-button-text', columnContentData.wpcf7_button.text);
				$columnData.attr('data-button-text-font-size', columnContentData.wpcf7_button.font_size);
				$columnData.attr('data-button-height', columnContentData.wpcf7_button.height);
				$columnData.attr('data-button-width', columnContentData.wpcf7_button.width);
				$columnData.attr('data-button-border-width', columnContentData.wpcf7_button.border_width);
				$columnData.attr('data-button-border-radius', columnContentData.wpcf7_button.border_radius);
				$columnData.attr('data-button-margin-top', columnContentData.wpcf7_button.margin_top);
				$columnData.attr('data-button-margin-right', columnContentData.wpcf7_button.margin_right);
				$columnData.attr('data-button-margin-bottom', columnContentData.wpcf7_button.margin_bottom);
				$columnData.attr('data-button-margin-left', columnContentData.wpcf7_button.margin_left);
				$columnData.attr('data-button-padding-top', columnContentData.wpcf7_button.padding_top);
				$columnData.attr('data-button-padding-right', columnContentData.wpcf7_button.padding_right);
				$columnData.attr('data-button-padding-bottom', columnContentData.wpcf7_button.padding_bottom);
				$columnData.attr('data-button-padding-left', columnContentData.wpcf7_button.padding_left);
				$columnData.attr('data-button-text-color', columnContentData.wpcf7_button.text_color);
				$columnData.attr('data-button-text-color-hover', columnContentData.wpcf7_button.text_color_hover);
				$columnData.attr('data-button-background-color', columnContentData.wpcf7_button.background_color);
				$columnData.attr('data-button-background-color-hover', columnContentData.wpcf7_button.background_color_hover);
				$columnData.attr('data-button-border-color', columnContentData.wpcf7_button.border_color);
				$columnData.attr('data-button-border-color-hover', columnContentData.wpcf7_button.border_color_hover);
			}
		});
	}

	function _linkDocumentListeners() {
		Rexbuilder_Util.$rexContainer.find('.wpcf7-radio').each(function (i, el) {
			$(el)
				.find('.wpcf7-list-item')
				.click(function (e) {
					e.preventDefault();
					var $listItem = $(e.target).parents('.wpcf7-list-item');

					if (!$listItem.hasClass('selected')) {
						$(el)
							.find('.wpcf7-list-item')
							.each(function (i, element) {
								$(element).removeClass('selected');
								$(el).find('input').attr('checked', false);
							});
						$listItem.addClass('selected');
						$listItem.find('input').attr('checked', true);
					}
				});
		});
	}

	/* ===== PRIVATE METHODS END ===== */

	function init() {
		styleSheet = null;

		columnContentDataDefaults = {
			wpcf7_required_field: false,
			wpcf7_email: false,
			wpcf7_only_numbers: false,
			wpcf7_default_check: false,
			wpcf7_placeholder: 'Placeholder',
			// wpcf7_list_fields: [],
			wpcf7_file_max_dimensions: '25mb',
			wpcf7_button: {
				// text: "",
				// font_size: "18px",
				// height: "50px",
				// width: "200px",
				// border_width: "2px",
				// border_radius: "10px",
				// margin_top: "0px",
				// margin_right: "0px",
				// margin_bottom: "0px",
				// margin_left: "0px",
				// padding_top: "5px",
				// padding_right: "15px",
				// padding_bottom: "5px",
				// padding_left: "15px",
				// text_color: "rgba(86, 86, 86)",
				text_color_hover: 'rgba(255,255,255,1)',
				// background_color: "rgb(255, 255, 255)",
				background_color_hover: 'rgba(86,86,86,1)',
				// border_color: "rgb(86, 86, 86)",
				border_color_hover: 'rgba(255,255,255,1)'
			},
			// input_width: "",
			// input_height: "",
			// font_size: "",
			// border_width: "",
			// border_radius: "",
			// background_color: "",
			// background_color_hover: "",
			// border_color: "",
			// border_color_hover: "",
			placeholder_color: 'rgba(0,0,0,1)',
			placeholder_hover_color: 'rgba(0,0,0,1)',
			// select_color_after_selection: "",
			// text_color: "",
			// text_color_hover: "",
			text_color_focus: 'rgba(0,0,0,1)'
			// text: "",
			// type: "",
			// field_class: "",
			// input_type: "",
			// target: {
			//     element_id: "",
			//     row_number: "",
			//     column_number: "",
			// }
		};

		this.$rexFormsStyle = $('#rexpansive-builder-rexwpcf7-style-inline-css');
		_fixFormCustomStyle();

		fixInputs();
		Rexbuilder_Rexelement.addStyles();
		_linkDocumentListeners();
	}

	return {
		init: init,

		addFormStyle: addFormStyle,
		refreshFormStyle: refreshFormStyle,
		addColumnContentStyle: addColumnContentStyle,
		refreshColumnContentStyle: refreshColumnContentStyle,
		fixInputs: fixInputs,
		fixWpcf7RadioButtons: fixWpcf7RadioButtons,
		generateColumnContentData: generateColumnContentData,

		updateForm: updateForm,
		updateFormContent: updateFormContent,
		updateColumnContent: updateColumnContent,

		/* --- Rules --- */
		addFormRule: addFormRule,
		addFormMessageRule: addFormMessageRule,
		addFormColumnsRule: addFormColumnsRule,
		addColumnContentRule: addColumnContentRule,
		addColumnContentFocusRule: addColumnContentFocusRule,
		addColumnContentHoverRule: addColumnContentHoverRule,
		addColumnContentPlaceholderHoverRule: addColumnContentPlaceholderHoverRule,

		updateFormRule: updateFormRule,
		updateFormMessageRule: updateFormMessageRule,
		updateFormColumnsRule: updateFormColumnsRule,
		updateColumnContentRule: updateColumnContentRule,
		updateColumnContentFocusRule: updateColumnContentFocusRule,
		updateColumnContentHoverRule: updateColumnContentHoverRule,
		updateColumnContentPlaceholderHoverRule: updateColumnContentPlaceholderHoverRule,

		removeFormRule: removeFormRule,
		removeColumnContentRule: removeColumnContentRule,
		removeColumnContentHoverRule: removeColumnContentHoverRule,
		removeColumnContentFocusRule: removeColumnContentFocusRule
	};
})(jQuery);
