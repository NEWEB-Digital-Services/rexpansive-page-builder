/**
 * Handling the custom layouts editing and sorting
 * @since 2.0.0
 */
var CustomLayouts_Modal = (function($) {
  "use strict";

  var custom_layouts_modal_props;
  var activeLayout;
  var activeLayoutData;

  /**
   * Creating the ID of a new layout. Checks if one exists
   * @return {string} id
   */
  var create_layout_id = function() {
    var id;
    var flag;
    var idLength = 4;
    do {
      flag = true;
      id = Rexbuilder_Util_Admin_Editor.createRandomID(idLength);
      custom_layouts_modal_props.$layoutsList
        .find(".layout__item")
        .each(function() {
          if (
            $(this)
              .find("input[name=rexlive-layout-id]")
              .val() == id
          ) {
            flag = false;
          }
        });
    } while (!flag);
    return id;
  };

  var _updateLayoutsDB = function(updatedLayouts) {
    $.ajax({
      type: "POST",
      dataType: "json",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_save_custom_layouts",
        nonce_param: live_editor_obj.rexnonce,
        custom_layouts: updatedLayouts
      },
      success: function(response) {
        console.log(response);
        if (response.success) {
          console.log("custom layouts aggiornati");
        }
        console.log("chiama effettuata con successo");
      },
      error: function(response) {
        console.log("errore chiama ajax");
      }
    });
  };

  var _getLayoutsData = function() {
    var layouts = [];
    custom_layouts_modal_props.$layoutsList
      .find(".layout__item")
      .each(function(i, e) {
        var $item = $(e);
        var buttonData = {
          id: $item.find("input[name=rexlive-layout-id]").val(),
          label: $item.find("input[name=rexlive-layout-label]").val(),
          min: $item.find("input[name=rexlive-layout-min]").val(),
          max: $item.find("input[name=rexlive-layout-max]").val(),
          type: $item.find("input[name=rexlive-layout-type]").val()
        };
        layouts.push(buttonData);
      });
    return layouts;
  };

  var _updateLayoutsDataIframe = function(data) {
    var layoutFounded = false;
    var updateHeights = false;

    for (i = 0; i < data.length; i++) {
      if (activeLayoutData.id == data[i].id) {
        layoutFounded = true;
        if (activeLayoutData.min != data[i].min && data[i].id != "default") {
          updateHeights = true;
          activeLayoutData.min = data[i].min;
          Rexbuilder_Util_Admin_Editor.updateLayoutActiveData(null);
          Rexbuilder_Util_Admin_Editor.updateIframeWidth(data[i].min);
        }
        break;
      }
    }
    var dataLayout = {
      eventName: "rexlive:updateLayoutsDimensions",
      data_to_send: {
        layouts: data,
        updateHeights: updateHeights
      }
    };
    Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataLayout);
    setTimeout(
      function() {
        if (!layoutFounded) {
          Rexbuilder_Util_Admin_Editor.setActiveLayout("default");
          Rexbuilder_Util_Admin_Editor.updateLayoutPage({
            min: "",
            max: "",
            id: "default",
            label: "My Desktop",
            type: "standard"
          });
          _updateActiveLayout("default");
        }
      },
      50,
      layoutFounded
    );
  };

  var _updateLayoutsDataDiv = function(data) {
    custom_layouts_modal_props.$layoutDataContainer.text(JSON.stringify(data));
  };

  var _updateButtons = function(data) {
    var k;
    custom_layouts_modal_props.$buttonsWrapper
      .find(".btn-builder-layout")
      .each(function(i, button) {
        var $button = $(button);
        for (k = 0; k < data.length; k++) {
          if (
            $button.attr("data-name") == data[k].id &&
            data[k].id != "default"
          ) {
            if ($button.attr("data-min-width") != data[k].min) {
              $button.attr("data-min-width", data[k].min);
            }
            if ($button.attr("data-max-width") != data[k].max) {
              $button.attr("data-max-width", data[k].max);
            }
            break;
          }
        }
      });
    custom_layouts_modal_props.$buttonsWrapper
      .find('.btn-builder-layout[data-layout-type="custom"]')
      .each(function(i, custom) {
        $(custom)
          .find(".rex-number")
          .text(i + 1);
      });
  };

  var _updateLayoutsData = function() {
    var dataAvaiableLayouts = _getLayoutsData();
    _updateButtons(dataAvaiableLayouts);
    _updateLayoutsDataDiv(dataAvaiableLayouts);
    _updateLayoutsDataIframe(dataAvaiableLayouts);
  };

  var _updateActiveLayout = function(activeLayout) {
    custom_layouts_modal_props.$layoutsList
      .find(".layout.active-on-page")
      .removeClass("active-on-page");
    custom_layouts_modal_props.$layoutsList
      .find(
        '.layout input[name="rexlive-layout-id"][value="' + activeLayout + '"]'
      )
      .parents(".layout")
      .addClass("active-on-page");
  };

  var _openModal = function() {
    Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.addClass(
      "layout-window--active"
    );
    Rexlive_Modals_Utils.openModal(
      custom_layouts_modal_props.$self.parent(".rex-modal-wrap")
    );
  };

  var _closeModal = function() {
    Rexlive_Modals_Utils.closeModal(
      custom_layouts_modal_props.$self.parent(".rex-modal-wrap")
    );
    Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.removeClass(
      "layout-window--active"
    );
  };

  var _keyDownHandlerNumber = function(e) {
    var $input = $(e.target);
    // Allow: backspace, delete, tab, enter and .
    if (
      $.inArray(e.keyCode, [46, 8, 9, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      // let it happen, don't do anything
      if (e.keyCode == 38) {
        // up
        e.preventDefault();
        $input.val(
          isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) + 1
        );
      }

      if (e.keyCode == 40) {
        //down
        e.preventDefault();
        $input.val(
          Math.max(
            isNaN(parseInt($input.val())) ? 0 : parseInt($input.val()) - 1,
            0
          )
        );
      }
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  var _keyUpHandlerNumber = function(e) {
    var $target = $(e.target);
    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      e.keyCode == 38 ||
      e.keyCode == 40 ||
      e.keyCode == 8
    ) {
      e.preventDefault();
      $target
        .parents(".layout__setting")
        .find(".layout-value")
        .text($target.val() + "px");
      _updateLayoutsData();
    }
    if (e.keyCode == 13 || e.keyCode == 27) {
      e.preventDefault();
      var $layoutWrapper = $target.parents(".layout").eq(0);
      $layoutWrapper
        .find(".dashicons-before.dashicons-edit")
        .removeClass("hide-icon");
      $layoutWrapper
        .find(".dashicons-before.dashicons-trash")
        .removeClass("hide-icon");
      $layoutWrapper
        .find(".dashicons-before.dashicons-yes")
        .addClass("hide-icon");
      $layoutWrapper.parent().removeClass("editing");
      $layoutWrapper
        .find("input[data-editable-field=true]")
        .attr("type", "hidden");
    }
  };

  var _keyUpHandlerLabel = function(e) {
    e.preventDefault();
    var $target = $(e.target);
    $target
      .parents(".layout__setting")
      .find(".layout-value")
      .text($target.val());
    if (e.keyCode == 13 || e.keyCode == 27) {
      e.preventDefault();
      var $layoutWrapper = $target.parents(".layout").eq(0);
      $layoutWrapper
        .find(".dashicons-before.dashicons-edit")
        .removeClass("hide-icon");
      $layoutWrapper
        .find(".dashicons-before.dashicons-trash")
        .removeClass("hide-icon");
      $layoutWrapper
        .find(".dashicons-before.dashicons-yes")
        .addClass("hide-icon");
      $layoutWrapper.parent().removeClass("editing");
      $layoutWrapper
        .find("input[data-editable-field=true]")
        .attr("type", "hidden");
    }
    _updateLayoutsData();
  };

  var _linkDocumentListeners = function() {
    custom_layouts_modal_props.$close_button.click(function(e) {
      e.preventDefault();
      _updateLayoutsDB(_getLayoutsData());
      _closeModal();
    });

    custom_layouts_modal_props.$config_layouts.on("click", function(e) {
      e.preventDefault();
      activeLayout = Rexbuilder_Util_Admin_Editor.getActiveLayout();
      activeLayoutData = {
        id: "",
        min: "",
        max: ""
      };

      var $activeButton = custom_layouts_modal_props.$buttonsWrapper.find(
        'div[data-name="' + activeLayout + '"]'
      );
      activeLayoutData.id = $activeButton.attr("data-name");
      activeLayoutData.min = $activeButton.attr("data-min-width");
      activeLayoutData.max = $activeButton.attr("data-max-width");

      _updateActiveLayout(activeLayout);
      _openModal();
    });

    custom_layouts_modal_props.$add_custom_layout_button.on(
      "click",
      function() {
        var idCreated = create_layout_id();

        tmpl.arg = "customLayout";
        var $newCustom = $(
          tmpl("rexlive-tmpl-custom-layout-modal", {
            id: idCreated,
            label: "",
            minWidth: "",
            maxWidth: "",
            type: "custom"
          })
        );
        custom_layouts_modal_props.$layoutsList.append($newCustom[0]);

        var $layoutWrapper = $newCustom.find(".layout").eq(0);
        $layoutWrapper
          .find(".dashicons-before.dashicons-edit")
          .addClass("hide-icon");
        $layoutWrapper
          .find(".dashicons-before.dashicons-trash")
          .removeClass("hide-icon");
        $layoutWrapper
          .find(".dashicons-before.dashicons-yes")
          .removeClass("hide-icon");
        $layoutWrapper.parent().addClass("editing");
        $layoutWrapper
          .find("input[data-editable-field=true]")
          .attr("type", "input");

        switch( custom_layouts_modal_props.layoutListType ) {
          case 'dropdown':
            custom_layouts_modal_props.$buttonsWrapper.find('.builder-add-custom-layout').parent().before(
              tmpl("rexlive-tmpl-custom-layout-button-list", {
                id: idCreated,
                label: "",
                minWidth: "",
                maxWidth: "",
                type: "custom"
              })
            );
            // custom_layouts_modal_props.$buttonsWrapper.find('.active-layout__icon')[0].innerHTML = );
            break;
          case 'list':
          default:
            custom_layouts_modal_props.$buttonsWrapper.append(
              tmpl("rexlive-tmpl-custom-layout-button", {
                id: idCreated,
                label: "",
                minWidth: "",
                maxWidth: "",
                type: "custom"
              })
            );
            break;
        }
        Rexlive_Base_Settings.launchTooltips();
        _updateLayoutsData();
      }
    );

    custom_layouts_modal_props.$self.on(
      "click",
      ".rexlive-layout--edit",
      function(e) {
        $(e.currentTarget)
          .find(".dashicons-before")
          .toggleClass("hide-icon");
        if ($(e.target).hasClass("dashicons-yes")) {
          $(this)
            .parents(".layout__item")
            .eq(0)
            .removeClass("editing")
            .find("input[data-editable-field=true]")
            .attr("type", "hidden");
        } else if ($(e.target).hasClass("dashicons-edit")) {
          $(this)
            .parents(".layout__item")
            .eq(0)
            .addClass("editing")
            .find("input[data-editable-field=true]")
            .attr("type", "input");
        }
      }
    );

    custom_layouts_modal_props.$self.on(
      "click",
      ".rexlive-layout--delete",
      function(e) {
        if (confirm("Are you sure?")) {
          var idLayout = $(this)
            .parents(".layout__item")
            .find("input[name=rexlive-layout-id]")
            .val();
          custom_layouts_modal_props.$buttonsWrapper
            .find('div[data-name="' + idLayout + '"]')
            .parent()
            .remove();
          $(this)
            .parents(".layout__item")
            .remove();
          _updateLayoutsData();
        }
      }
    );

    custom_layouts_modal_props.$self.on(
      "keydown",
      "input.layout-min-input",
      function(e) {
        _keyDownHandlerNumber(e);
      }
    );

    custom_layouts_modal_props.$self.on(
      "keydown",
      "input.layout-max-input",
      function(e) {
        _keyDownHandlerNumber(e);
      }
    );

    custom_layouts_modal_props.$self.on(
      "keyup",
      "input.layout-min-input",
      function(e) {
        _keyUpHandlerNumber(e);
      }
    );

    custom_layouts_modal_props.$self.on(
      "keyup",
      "input.layout-max-input",
      function(e) {
        _keyUpHandlerNumber(e);
      }
    );

    custom_layouts_modal_props.$self.on(
      "keyup",
      "input.layout-label-input",
      function(e) {
        _keyUpHandlerLabel(e);
      }
    );
  };

  var _addSortableHandles = function() {
    custom_layouts_modal_props.$layoutsList
      .children(".layout__item")
      .each(function(i, item) {
        var $item = $(item);
        var layoutName = $item.find('input[name="rexlive-layout-id"]').val();
        if (
          layoutName != "default" &&
          layoutName != "tablet" &&
          layoutName != "mobile"
        ) {
          // if ($item.find(".rexlive-layout--move").length == 0) {
          //   // $item.find(".layout").append(tmpl("rexlive-tmpl-custom-layout-handle", {}));
          //   $item.append(tmpl("rexlive-tmpl-custom-layout-handle", {}));
          // }
        }
      });
  };

  var _init = function() {
    var $container = $("#rexlive-custom-layout-modal");
    var $buttonsWrapper = Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.find(
      ".rexlive-responsive-buttons-wrapper"
    );
    var $layoutData = Rexbuilder_Util_Admin_Editor.$rexpansiveContainer.find(
      "#rexbuilder-layout-data-backend > .avaiable-layouts"
    );
    custom_layouts_modal_props = {
      $self: $container,
      $close_button: $container.find(".rex-cancel-button"),
      $buttonsWrapper: $buttonsWrapper,
      $config_layouts: $buttonsWrapper.find(".builder-config-layouts"),
      $layoutDataContainer: $layoutData,
      $layoutsList: $container.find(".layout__list"),
      $add_custom_layout_button: $container.find("#rexlive-add-custom-layout"),
      layoutListType: $container.attr("data-layout-list-type"),
    };

    _addSortableHandles();
    _linkDocumentListeners();

    custom_layouts_modal_props.$layoutsList.sortable({
      items: ".layout__item:not(.layout__item--standard)",
      handle: ".rexlive-layout--move",
      stop: function(event, ui) {
        var idLayoutMoved = ui.item
          .find('input[name="rexlive-layout-id"]')
          .val();
        var idLayoutBefore = ui.item
          .prev()
          .find('input[name="rexlive-layout-id"]')
          .val();
        var $layoutMoved = custom_layouts_modal_props.$buttonsWrapper
          .find('div[data-name="' + idLayoutMoved + '"]')
          .parent("div");
        if( "default" !== idLayoutBefore ) {
          var $layoutBefore = custom_layouts_modal_props.$buttonsWrapper
            .find('div[data-name="' + idLayoutBefore + '"]')
            .parent("div");
        } else {
          var $layoutBefore = custom_layouts_modal_props.$buttonsWrapper
            .find('.builder-add-custom-layout')
            .parent("div");
        }

        $layoutBefore.after($layoutMoved.detach());
        custom_layouts_modal_props.$buttonsWrapper
          .find('.btn-builder-layout[data-layout-type="custom"]')
          .each(function(i, custom) {
            $(custom)
              .find(".rex-number")
              .text(i + 1);
          });
      }
    });
  };

  return {
    init: _init
  };
})(jQuery);
