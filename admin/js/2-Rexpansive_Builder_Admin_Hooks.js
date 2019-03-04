/**
 * Object that contains all the callbacks that anyone can register to the builder
 */
var Rexpansive_Builder_Admin_Hooks = (function($) {
  'use strict';
  
  var switch_actions;
  var save_actions;

  var _get_switch_actions = function() {
    return switch_actions;
  }

  var _set_switch_actions = function( obj ) {
    switch_actions.push( obj );
  }

  var _get_save_actions = function() {
    console.log(save_actions);
    return save_actions;
  }

  var _set_save_actions = function( obj ) {
    save_actions.push( obj );
  }

  var init = function() {
    switch_actions = [];
    save_actions = [];
    this.collect = [];
  }
  
  return {
    init: init,
    get_switch_actions: _get_switch_actions,
    set_switch_actions: _set_switch_actions,
    get_save_actions: _get_save_actions,
    set_save_actions: _set_save_actions
  };
  
})(jQuery);