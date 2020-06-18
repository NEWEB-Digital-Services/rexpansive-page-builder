;(function(window, factory) {
	'use strict';
	window.RexEditedData = factory(window);
})(typeof window !== 'undefined' ? window : this, function() {
	// synch section props
	var tracePropsSection = [
		'section_name',					// section name
		'section_nav_label',			// section label
		'color_bg_section',				// background color
		'color_bg_section_active',
		'image_bg_section_active',		// background image
		'image_bg_section',
		'image_width',
		'image_height',
		'id_image_bg_section',
		'image_size',
		'video_bg_id',					// mp4 video background
		'video_mp4_url',
		'video_bg_width_section',
		'video_bg_height_section',
		'video_bg_url_section',			// youtube video background
		'video_bg_url_vimeo_section',	// vimeo video background
		'block_distance',				// gutter & paddings
		'row_separator_top',
		'row_separator_bottom',
		'row_separator_right',
		'row_separator_left',
		'margin',						// margins
		'row_margin_top',
		'row_margin_bottom',
		'row_margin_right',
		'row_margin_left',
		'custom_classes',				// custom classes
		'row_overlay_color',			// overlay color
		'row_overlay_active',
		// 'layout',						// layout
		// 'collapse_grid'					// collapse
	];

	// synch block props
	var tracePropsBlock = [
		'color_bg_block', 				// background color
		'color_bg_block_active',
		'image_bg_url',					// background image
		'image_width',
		'image_height',
		'id_image_bg',
		'image_size',
		'image_bg_elem_active',
		'type_bg_image',
		'video_bg_id',					// mp4 video background
		'video_bg_width',
		'video_bg_height',
		'video_mp4_url',
		'video_bg_url_youtube',			// youtube video background
		'video_bg_url_vimeo',			// vimeo video background
		'photoswipe',					// photoswipe
		'block_custom_class',			// custom class
		'block_padding',				// block padding
		'overlay_block_color',			// overlay color
		'overlay_block_color_active',
		'linkurl',						// links
		'block_flex_position',			// content position
		'block_flex_img_position',		// image position
		// 'gs_start_h',					// block dimensions
		// 'gs_width',
		// 'gs_height',
		// 'gs_x',
		// 'gs_y',
	];

	function RexEditedData() {
		this.editedInfo = null;
		this.startData = null;

		if (arguments[0]) {
			this.startData = arguments[0];
		}

		_checkData.call(this);
		_generateData.call(this);
	}

	/** PRIVATE METHODS */

	/**
	 * Check if data passaed is an array, if not, convert it to an array
	 * @return {void}
	 */
	function _checkData() {
		if ( ! Array.isArray(this.startData) ) {
			var temp = [];
			for( var t in this.startData ) {
				temp.push( this.startData[t] );
			}

			this.startData = temp;
		}
	}

	/**
	 * Generate the information to understand if a data has changed
	 * and save it accordly
	 * @param  {Object} data section targets information
	 * @return {void}
	*/
	function _generateData( data ) {
		data = 'undefined' !== typeof data ? data : this.startData;

		var result = [];
		var i, tot = data.length;
		var j, totTargets = 0;
		// cycle all sections
		for( i=0; i < tot; i++ ) {
			var state = {};
			state.section_rex_id = data[i].section_rex_id;
			state.targets = [];
			totTargets = data[i].targets.length;
			// cycle all targets
			for( j=0; j < totTargets; j++ ) {
				var targetState = {};
				targetState.name = data[i].targets[j].name;
				targetState.props = {};
				var z;

				if ( 'self' === targetState.name ) { // row
					for ( z=0; z < tracePropsSection.length; z++ ) {
						// if (  'undefined' === typeof data[i].targets[j].props[tracePropsSection[z]] || '' === data[i].targets[j].props[tracePropsSection[z]] ) {
						if (  'undefined' === typeof data[i].targets[j].props[tracePropsSection[z]] ) {
							targetState.props[tracePropsSection[z]] = false;
						} else {
							targetState.props[tracePropsSection[z]] = true;
						}
					}
				} else {	// block
					for ( z=0; z < tracePropsBlock.length; z++ ) {
						// if ( 'undefined' === typeof data[i].targets[j].props[tracePropsBlock[z]] || '' === data[i].targets[j].props[tracePropsBlock[z]] ) {
						if ( 'undefined' === typeof data[i].targets[j].props[tracePropsBlock[z]] ) {
							targetState.props[tracePropsBlock[z]] = false;
						} else {
							targetState.props[tracePropsBlock[z]] = true;
						}
					}
				}
				state.targets.push( targetState );
			}
			result.push( state );
		}

		this.editedInfo = result;
	}

	/**
	 * Get the index of the section searched inside the traced data array
	 * @param  {String} sectionId section id
	 * @return {Integer|Boolean}           index of section, otherwise false
	 */
	function _getSectionDataIndex( sectionId ){
		var t = false, z, tot = this.editedInfo.length;
		// get section index, based on its id
		for( z=0; z < tot; z++ ) {
			if ( sectionId === this.editedInfo[z].section_rex_id ) {
				return z;
			}
		}
		return false;
	}

	/**
	 * Get the target props index inside a section information
	 * @param  {String} sectionIndex section index
	 * @param  {String} name         block id, or 'self' for section
	 * @return {Integer|Boolean}              index of target prop, otherwise false
	 */
	function _getPropsIndex( sectionIndex, name ) {
		// get section data, searching for 'self' name
		var i, tot = this.editedInfo[sectionIndex].targets.length;
		for( i=0; i< tot; i++ ) {
			if ( name === this.editedInfo[sectionIndex].targets[i].name ) {
				return i;
			}
		}
		return false;
	}

	/**
	 * Get prop value
	 * @param  {String} sectionIndex section index
	 * @param  {String} name         element props searched
	 * @return {Object|Boolean}              props object, otherwise false
	 */
	function _getProps( sectionIndex, name ) {
		var i = _getPropsIndex.call( this, sectionIndex, name );
		if ( false !== i ) {
			return this.editedInfo[sectionIndex].targets[i].props;
		}
		return false;
	}

	/**
	 * Set data of a prop
	 * @param {String} sectionId  section id
	 * @param {String} targetName target name
	 * @param {String} prop       property to set
	 * @param {Boolen} edited     was the property edited
	 */
	function _setData( sectionId, targetName, prop, edited ) {
		edited = 'undefined' !== typeof edited ? edited : true;
		var sectiondIndex = _getSectionDataIndex.call( this, sectionId );

		if ( sectiondIndex === false ) return;

		var sectionPropsIndex = _getPropsIndex.call( this, sectiondIndex, targetName );

		if ( false === sectionPropsIndex ) return;

		this.editedInfo[sectiondIndex].targets[sectionPropsIndex].props[prop] = edited;
	}

	/**
	 * Set data of a prop
	 * @param {String} sectionId  section id
	 * @param {String} targetName target name
	 * @param {Boolen} edited     was the property edit
	 */
	function _setBulkData( sectionId, targetName, edited ) {
		edited = 'undefined' !== typeof edited ? edited : true;
		var sectiondIndex = _getSectionDataIndex.call( this, sectionId );

		if ( sectiondIndex === false ) return;

		var sectionPropsIndex = _getPropsIndex.call( this, sectiondIndex, targetName );

		if ( false === sectionPropsIndex ) return;

		var i, tot;
		if( 'self' === targetName ) {
			// bulk set section props
			tot = tracePropsSection.length;
			for( i=0; i<tot; i++ ) {
				this.editedInfo[sectiondIndex].targets[sectionPropsIndex].props[tracePropsSection[i]] = edited;
			}
		} else {
			// bulk set block props
			tot = tracePropsBlock.length;
			for( i=0; i<tot; i++ ) {
				this.editedInfo[sectiondIndex].targets[sectionPropsIndex].props[tracePropsBlock[i]] = edited;
			}
		}
	}

	/** PUBLIC METHODS */

	// maybe
	// RexEditedData.prototype.generateData = function( data ) { _generateData.call(this, data); };

	/**
	 * Get the section edited data information
	 * @param  {String} sectionId section to search
	 * @return {Object}           edited data information
	*/
	RexEditedData.prototype.getSectionData = function( sectionId ) {
		var sectiondIndex = _getSectionDataIndex.call( this, sectionId );

		if ( sectiondIndex === false ) return false;

		// get section data, searching for 'self' name
		return _getProps.call( this, sectiondIndex, 'self' );
	};

	/**
	 * [getBlockData description]
	 * @param  {[type]} sectionId [description]
	 * @param  {[type]} blockId   [description]
	 * @return {[type]}           [description]
	 */
	RexEditedData.prototype.getBlockData = function( sectionId, blockId ) {
		var sectiondIndex = _getSectionDataIndex.call( this, sectionId );

		if ( sectiondIndex === false ) return false;

		// get block data, searching for 'id' name
		return _getProps.call( this, sectiondIndex, blockId );
	};

	/**
	 * Add empty section tracing data
	 * @param {String} sectionId new section id
	*/
	RexEditedData.prototype.addSectionData = function( sectionId ){
		var sectiondIndex = _getSectionDataIndex.call( this, sectionId );
		if ( false !== sectiondIndex ) return; // section already present

		var props = {};
		for ( z=0; z < tracePropsSection.length; z++ ) {
			props[tracePropsSection[z]] = false;
		}

		var data = {
			section_rex_id: sectionId,
			targets: [
				{
					name: 'self',
					props: props
				}
			]
		};

		this.editedInfo.push( data );
	};

	/**
	 * Add empty block tracing data
	 * @param {String} sectionId block parent section
	 * @param {String} blockId new block id
	 */
	RexEditedData.prototype.addBlockData = function( sectionId, blockId ){
		var sectiondIndex = _getSectionDataIndex.call( this, sectionId );
		if ( false === sectiondIndex ) return; // section not present, something wrong

		var blockIndex = _getPropsIndex.call( this, sectiondIndex, blockId );
		if ( false !== blockIndex ) return;			// block already present

		var props = {};
		for ( z=0; z < tracePropsBlock.length; z++ ) {
			props[tracePropsBlock[z]] = false;
		}

		var data = {
			name: blockId,
			props: props
		};

		this.editedInfo[sectiondIndex].targets.push(data);
	};

	/**
	 * Set edited data of a section
	 * @param {String} sectionId section to set
	 * @param {String} prop      parameter to set
	 * @param {Bool} edited    the data has changed or not?
	*/
	RexEditedData.prototype.setSectionData = function( sectionId, prop, edited ) {
		_setData.call( this, sectionId, 'self', prop, edited );
	};

	/**
	 * Set edited data of a block
	 * @param {String} sectionId section to set
	 * @param {String} blockId block to set
	 * @param {String} prop      parameter to set
	 * @param {Bool} edited    the data has changed or not?
	*/
	RexEditedData.prototype.setBlockData = function( sectionId, blockId, prop, edited ) {
		_setData.call( this, sectionId, blockId, prop, edited );
	};

	/**
	 * Set all edited data of a section
	 * @param {String} sectionId section to set
	 * @param {Bool} edited    the data has changed or not?
	 */
	RexEditedData.prototype.setBulkSectionData = function( sectionId, edited ){
		_setBulkData.call( this, sectionId, 'self', edited );
	};

	/**
	 * Set all edited data of a block
	 * @param {String} sectionId section to set
	 * @param {String} blockId   block to set
	 * @param {Bool} edited    the data has changed or not?
	 */
	RexEditedData.prototype.setBulkBlockData = function( sectionId, blockId, edited ){
		_setBulkData.call( this, sectionId, blockId, edited );
	};

	/**
	 * Get trace props section
	 * @return {Array} array of section props synched between layouts
	 */
	RexEditedData.getTracePropsSection = function() {
		return tracePropsSection;
	};

	/**
	 * Get trace props block
	 * @return {Array} array of block props synched between layouts
	 */
	RexEditedData.getTracePropsBlock = function() {
		return tracePropsBlock;
	};

	return RexEditedData;
});