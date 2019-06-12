var Rexlive_Page_Margins = (function ($) {
  'use strict';

  var container_margins_modal_properties;
  var defaultSeparatos;

  // var _resetDistances = function () {
  //   container_margins_modal_properties.$container_separator_top.val(defaultSeparatos.top);
  // }

  // var _updateDistances = function (data) {
  //   var distances = data.containerDistances;
  //   var top = isNaN(distances.top) ? defaultSeparatos.top : distances.top;

  //   container_margins_modal_properties.$container_separator_top.val(top);
  // }

  var _getDistanceValues = function () {
    var context = container_margins_modal_properties.$separatorContext.filter(':checked').val();
    var top = parseInt(container_margins_modal_properties.$separatorValsTop.filter('[data-context='+context+']').val());

    if ( 'undefined' !== typeof context )
    {
      return {
        context: context,
        vals: {
          top: isNaN(top) ? defaultSeparatos.top : top,
        }
      };
    }
    else
    {
      return false;
    }
  }

  var _applyContainerDistances = function () {
    var to_sent = _getDistanceValues();
    if ( false !== to_sent )
    {
      var data_container_margins = {
        eventName: "rexlive:set_container_margins",
        data_to_send: {
          distances: to_sent
        }
      }
  
      Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(data_container_margins);

      _updateData(to_sent);
    }
  }

  var _linkKeyDownListener = function ($target) {
    $target.keydown(function (e) {
      var $input = $(e.target);
      // Allow: backspace, delete, tab, enter and .
      if ($.inArray(e.keyCode, [46, 8, 9, 13, 110]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        if (e.keyCode == 38) { // up
          e.preventDefault();
          $input.val(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) + 1);
        }

        if (e.keyCode == 40) { //down
          e.preventDefault();
          $input.val(Math.max(isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) - 1, 0));
        }
        return;
      }

      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }

      //escape
      if (e.keyCode == 27) {
        $input.blur();
      }
    });
  }

  var _linkKeyUpListener = function ($target) {
    $target.keyup(function (e) {
      if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == 38) || (e.keyCode == 40) || (e.keyCode == 8)) {
        e.preventDefault();
        _applyContainerDistances();
      }
    });
  }

  var _linkDistancesListeners = function () {
    _linkKeyDownListener(container_margins_modal_properties.$separatorValsTop);
    _linkKeyUpListener(container_margins_modal_properties.$separatorValsTop);
  }

  /**
   * Getting the margin settings from the data retrieve from DB
   * @since 2.0.0
   */
  var _getData = function()
  {
    container_margins_modal_properties.$separatorContext.filter('global').prop('checked',true);
    container_margins_modal_properties.$separatorValsTop.val('');

    var s_global = Rexbuilder_Util_Admin_Editor.$page_global_settings.text();
    var s_custom = Rexbuilder_Util_Admin_Editor.$page_custom_settings.text();
    var context = 'global';

    if ( '' !== s_custom )
    {
      var s_custom_obj = JSON.parse( s_custom );
      if ( 'undefined' !== typeof s_custom_obj.container_distancer && 'undefined' !== typeof s_custom_obj.container_distancer.top && '' !== s_custom_obj.container_distancer.top )
      {
        context = 'custom';
        container_margins_modal_properties.$separatorValsTop.filter('[data-context=custom]').val( s_custom_obj.container_distancer.top );
      }
    }
    
    if ( '' !== s_global )
    {
      var s_global_obj = JSON.parse( s_global );
      if ( 'undefined' !== typeof s_global_obj.container_distancer && 'undefined' !== typeof s_global_obj.container_distancer.top && '' !== s_global_obj.container_distancer.top )
      {
        context = ( '' == context ? 'global' : context );
        container_margins_modal_properties.$separatorValsTop.filter('[data-context=global]').val( s_global_obj.container_distancer.top );
      }
    }

    container_margins_modal_properties.$separatorContext.filter('[value=' + context + ']').prop('checked',true);
  };

  var _updateData = function( data )
  {
    switch( data.context )
    {
      case 'global':
        var s_global = Rexbuilder_Util_Admin_Editor.$page_global_settings.text();
        if ( '' !== s_global && '[]' !== s_global )
        {
          var s_global_obj = JSON.parse( s_global );
          s_global_obj.container_distancer.top = data.vals.top;
        }
        else
        {
          var s_global_obj = {
            container_distancer: {
              top: data.vals.top
            }
          };
        }
        Rexbuilder_Util_Admin_Editor.$page_global_settings.text( JSON.stringify( s_global_obj ) );

        var s_custom = Rexbuilder_Util_Admin_Editor.$page_custom_settings.text();
        if ( '' !== s_custom )
        {
          var s_custom_obj = JSON.parse( s_custom );
          s_custom_obj.container_distancer.top = '';
        }
        else
        {
          var s_custom_obj = {
            container_distancer: {
              top: ''
            }
          };
        }
        Rexbuilder_Util_Admin_Editor.$page_custom_settings.text( JSON.stringify( s_custom_obj ) );
        break;
      case 'custom':
        var s_custom = Rexbuilder_Util_Admin_Editor.$page_custom_settings.text();
        if ( '' !== s_custom )
        {
          var s_custom_obj = JSON.parse( s_custom );
          s_custom_obj.container_distancer.top = data.vals.top;
        }
        else
        {
          var s_custom_obj = {
            container_distancer: {
              top: data.vals.top
            }
          };
        }
        Rexbuilder_Util_Admin_Editor.$page_custom_settings.text( JSON.stringify( s_custom_obj ) );
        break;
      default:
        break;
    }
  }

  /**
   * Saving settings on DB
   * @since 2.0.0
   */
  var _applyData = function () {
    var data_margins = _getDistanceValues();
    if ( false !== data_margins )
    {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: live_editor_obj.ajaxurl,
        data: {
          action: "rex_update_container_margins",
          nonce_param: live_editor_obj.rexnonce,
          pageID: $("#post_ID").val(),
          container_margins: data_margins,
          // selected_margins: container_margins_modal_properties.selected_margins,
        },
        success: function () {
          // console.log("end!");
        },
        error: function () { },
        complete: function () { }
      })
  
    }
    _applyContainerDistances();
  }

  var _init = function ($container) {
    var $self = $container;
    container_margins_modal_properties = {
      // Row separators
      $self: $self,

      $separatorContext: $self.find('input[name=container-distancer]'),
      $separatorValsTop: $self.find('input[name=container-distancer--mtop]'),

      $container_separator_top: $self.find('#margin-rexlive-content'),
      $applyAllCheckBox: $self.find("margin-rexlive-all-pages"),
      selected_margins: ""
    }

    defaultSeparatos = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    // _resetDistances();
    _linkDistancesListeners();
  }

  return {
    init: _init,
    // saveGlobal: _saveGlobal,
    // savePage: _savePage,
    applyData: _applyData,
    getData: _getData
  };

})(jQuery);