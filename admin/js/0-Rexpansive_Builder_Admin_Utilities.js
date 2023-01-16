/**
 * Object that contains some utilities
 */
var Rexpansive_Builder_Admin_Utilities = (function($) {
  'use strict';

  var global_tooltipped;

  /**
   * Metabox html id
   * @since 2.0.0
   */
  var meta_box_selector = '#_rexbuilder_shortcode';

  /**
   * Is the awesome and new builderlive active?
   * @since 2.0.0
   */
  var builderlive = true;

  /**
   * Lunching the tooltips of the dynamic blocks created
   */
  var launchTooltips = function () {
    $('.tooltipped').not(global_tooltipped).tooltip({ delay: 50 });
    global_tooltipped = $('.tooltipped');
  };

  /**
   * Update the information of the block size
   * @param {jQuery Object}  $el
   */
  var update_live_visual_size = function ($el) {
    $el.find('.el-visual-size').text($el.attr('data-sizex') + 'x' + $el.attr('data-sizey'));
  };

  /**
   * reset a modal height to prevent dynamic content bugs
   * @param {jQuery Object}  $target
   */
  var resetModalDimensions = function ($target) {
    $target.css('height', 'auto');
    $target.css('width', 'auto');
  };

  /**
   * Creating a new block for the builder
   * @param {string} type type of the block to create
   * @param {intval} h value of the height of the block
   * @param {intval} w value of the width of the block
   */
  var createNewTextBlock = function (type, h, w) {
    type = typeof type !== 'undefined' ? type : 'text';
    h = typeof h !== 'undefined' ? h : 2;
    w = typeof w !== 'undefined' ? w : 2;

    var template,
      new_id = 'block_' + Rexpansive_Builder_Admin_Config.global_section_reference.sectIndex + '_' + Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex;

    template = Rexpansive_Builder_Admin_Templates.templates.text.replace(/\bdata.imageid\b/g, new_id).replace(/\bdata.elementactionsplaceholder\b/g, Rexpansive_Builder_Admin_Templates.templates.element_actions).replace(/\bdata.blocktype\b/g, type);

    Rexpansive_Builder_Admin_Config.global_section_reference.gridRef.add_widget(template, h, w);
    Rexpansive_Builder_Admin_Utilities.update_live_visual_size($('#' + new_id));
    Rexpansive_Builder_Admin_Config.global_section_reference.internalIndex++;

    return new_id;
  };

  /**
   * Add classes to a row on the fly
   * @param {jQuery Object}	$el 	row element
   * @param {array} classes 			classes array
   */
  var add_class_to_section = function($el, classes) {
    var configs = JSON.parse($el.attr("data-backresponsive"));
    configs.custom_classes += " " + classes.join(" ");
    $el.attr("data-backresponsive", JSON.stringify(configs));
  };

  /**
   * Get a section based on its index
   * @param {array} collection list of sections
   * @param {string} section_index index of the section
   */
  var get_section_based_on_index = function(collection, section_index) {
    var s = _.find(collection, function(obj) {
      return obj.sectIndex == section_index;
    });
    return s;
  };

  /**
   * Set a post list as modified
   * Works directly on a global array
   * @param {array} collection
   */
  var set_post_modified_list = function($collection, post_state, post_title_state) {
    post_state = typeof post_state !== 'undefined' ? post_state : false;
    post_title_state = typeof post_title_state !== 'undefined' ? post_title_state : false;
    $collection.each(function(i, el) {
      var info = {
        id: $(el).attr("id"),
        mod: post_state,
        mod_post_title: post_title_state
      };
      Rexpansive_Builder_Admin_Config.post_modified.push(info);
    });
  };

  /**
   * mark a post to modified
   * @param {array} collection
   * @param {int} id
   */
  var set_post_modified = function(collection, id) {
    var temp = _.find(collection, function(obj) {
      return obj.id == id;
    });
    temp.mod = true;
  };

  /**
   * mark a post to modified title
   * @param {array} collection
   * @param {int} id
   */
  var set_post_modified_title = function(collection, id) {
    var temp = _.find(collection, function(obj) {
      return obj.id == id;
    });
    temp.mod_post_title = true;
  };

  /**
   * Check if a post has modified
   * @param {array} collection
   * @param {int} id
   */
  var post_has_modified = function(collection, id) {
    var temp = _.find(collection, function(obj) {
      return obj.id == id;
    });
    return "undefined" !== typeof temp ? temp.mod : false;
  };

  /**
   * check if a post has a title modified
   * @param {array} collection
   * @param {int} id
   */
  var post_has_modified_title = function(collection, id) {
    var temp = _.find(collection, function(obj) {
      return obj.id == id;
    });
    return "undefined" !== typeof temp ? temp.mod_post_title : false;
  };

  /**
   * set all posts to modified
   * @param {array} collection
   */
  var set_all_posts_modified = function(collection) {
    _.each(collection, function(obj) {
      obj.mod = true;
    });
  };

  /**
   *	@var	data		string	a JSON array of objects stringified
    *	@return	shortcode	string	the shortcode created
    */
  var createSectionShortcode = function (data, settings, settsdim, settlayout, settIdentifier, settOverlayColor, settBackResp, settSepTop, settSepRight, settSepBottom, settSepLeft, settActivePhotoswipe, sectionModel) {
    var shortcode = '',
      section_settings,
      dimension;
    shortcode = '[RexpansiveSection ';
    if (settIdentifier) {
      shortcode += 'section_name="' + settIdentifier + '" ';
    } else {
      shortcode += 'section_name="" ';
    }
    if (settings) {
      section_settings = JSON.parse(settings);
      shortcode += 'color_bg_section="' + section_settings.color + '" image_bg_section="' + section_settings.url + '" id_image_bg_section="' + section_settings.image + '" video_bg_url_section="' + section_settings.youtube + '" video_bg_id_section="' + section_settings.video + '" video_bg_url_vimeo_section="' + section_settings.vimeo + '" ';
    } else {
      shortcode += 'color_bg_section="" image_bg_section="" id_image_bg_section="" ';
    }
    if (settsdim) {
      dimension = settsdim
      shortcode += 'dimension="' + dimension + '" margin="" ';
    } else {
      shortcode += 'dimension="" margin="" ';
    }
    if (settlayout) {
      shortcode += 'layout="' + settlayout + '" ';
    } else {
      shortcode += 'layout="" ';
    }
    if (settBackResp) {
      var config_settings = JSON.parse(settBackResp);
      var backrespoptions = 'rgba(' + config_settings.r + ',' + config_settings.g + ',' + config_settings.b + ',' + config_settings.a + ')';
      shortcode += 'block_distance="' + config_settings.gutter + '" ';
      shortcode += 'full_height="' + config_settings.isFull + '" ';
      shortcode += 'custom_classes="' + config_settings.custom_classes + '" ';
      shortcode += 'section_width="' + config_settings.section_width + '" ';
    } else {
      //shortcode += 'responsive_background=""';
    }
    if (settOverlayColor) {
      shortcode += 'responsive_background="' + settOverlayColor + '" ';
    } else {
      shortcode += 'responsive_background=""';
    }

    if ('' != settSepTop) {
      shortcode += ' row_separator_top="' + settSepTop + '" ';
    }

    if ('' != settSepRight) {
      shortcode += ' row_separator_right="' + settSepRight + '" ';
    }

    if ('' != settSepBottom) {
      shortcode += ' row_separator_bottom="' + settSepBottom + '" ';
    }

    if ('' != settSepLeft) {
      shortcode += ' row_separator_left="' + settSepLeft + '" ';
    }

    if ('' != settActivePhotoswipe) {
      shortcode += ' row_active_photoswipe="' + settActivePhotoswipe + '" ';
    }

    if ('' != sectionModel) {
      shortcode += ' section_model="' + sectionModel + '" ';
    }

    shortcode += ']' + data + '[/RexpansiveSection]';
    return shortcode;
  };

  var init = function() {
    global_tooltipped = $('.tooltipped');
  }
  
  return {
    init: init,
    launchTooltips: launchTooltips,
    update_live_visual_size: update_live_visual_size,
    resetModalDimensions: resetModalDimensions,
    createNewTextBlock: createNewTextBlock,
    add_class_to_section: add_class_to_section,
    get_section_based_on_index: get_section_based_on_index,
    set_post_modified_list: set_post_modified_list,
    set_post_modified_title: set_post_modified_title,
    set_post_modified: set_post_modified,
    post_has_modified: post_has_modified,
    set_all_posts_modified: set_all_posts_modified,
    post_has_modified_title: post_has_modified_title,
    createSectionShortcode: createSectionShortcode,
    meta_box_selector: meta_box_selector,
    builderlive: builderlive
  };
  
})(jQuery);