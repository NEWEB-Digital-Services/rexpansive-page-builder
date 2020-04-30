;(function(window, factory) {
	'use strict';
	window.RexEditedData = factory(window);
})(typeof window !== 'undefined' ? window : this, function() {
	var tracePropsSection = ['color_bg_section', 'color_bg_section_active'];
	var tracePropsBlock = ['color_bg_block', 'color_bg_block_active'];

	function RexEditedData() {
		this.editedInfo = null;
		this.startData = null;

		if (arguments[0]) {
			this.startData = arguments[0];
		}

		_generateData.call(this);
	}

	/** PRIVATE METHODS */

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
						targetState.props[tracePropsSection[z]] = false;
					}
				} else {    // block
					for ( z=0; z < tracePropsBlock.length; z++ ) {
						targetState.props[tracePropsBlock[z]] = false;
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

	return RexEditedData;
});