/**
 * https://www.html5rocks.com/en/tutorials/dnd/basics/
 * https://github.com/StackHive/DragDropInterface
 * http://mereskin.github.io/dnd/
 */

var Model_Import_Modal = (function($) {
  "use strict";
  var rexmodel_import_props;

  var _updateModelList = function() {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: live_editor_obj.ajaxurl,
      data: {
        action: "rex_get_model_list",
        nonce_param: live_editor_obj.rexnonce
      },
      success: function(response) {
        if (response.success) {
          var currentList = [];
          rexmodel_import_props.$self
            .find(".model__element")
            .each(function(i, model) {
              var modelID = $(model).attr("data-rex-model-id");
              var modelObj = {
                id: modelID,
                founded: false
              };
              currentList.push(modelObj);
            });

          var updatedList = response.data.updated_list;

          var i, j;

          for (i = 0; i < updatedList.length; i++) {
            updatedList[i].founded = false;
          }

          for (i = 0; i < updatedList.length; i++) {
            for (j = 0; j < currentList.length; j++) {
              if (updatedList[i].id == currentList[j].id) {
                updatedList[i].founded = true;
                currentList[j].founded = true;
                break;
              }
            }
          }

          tmpl.arg = "model";

          for (i = 0; i < updatedList.length; i++) {
            if (!updatedList[i].founded) {
              rexmodel_import_props.$self.find(".model-list").prepend(
                tmpl("rexlive-tmpl-model-item-list", {
                  id: updatedList[i].id,
                  name: updatedList[i].name,
                  preview:
                    updatedList[i].preview_image_url != ""
                      ? updatedList[i].preview_image_url
                      : ""
                })
              );
            }
          }

          for (i = 0; i < currentList.length; i++) {
            if (!currentList[i].founded) {
              rexmodel_import_props.$self
                .find(
                  '.model__element[data-rex-model-id="' +
                    currentList[i].id +
                    '"]'
                )
                .remove();
            }
          }

          rexmodel_import_props.$self.addClass("rex-lateral-panel--open");
          // Rexlive_Modals_Utils.openModal(rexmodel_import_props.$self.parent('.rex-modal-wrap'), true);
        }
      },
      error: function(response) {},
      complete: function(response) {
        rexmodel_import_props.$self.removeClass("rex-modal--loading");
      }
    });
  };

  var _openModal = function() {
    _updateModelList();
  };

  var _closeModal = function() {
    rexmodel_import_props.$self.removeClass("rex-lateral-panel--open");
    // Rexlive_Modals_Utils.closeModal(rexmodel_import_props.$self.parent('.rex-modal-wrap'));
  };

  var _linkDocumentListeners = function() {
    rexmodel_import_props.$close_button.click(function(e) {
      e.preventDefault();
      _closeModal();
    });
  };

  var _linkDraggable = function() {
    var currentElement,
      currentElementChangeFlag,
      elementRectangle,
      countdown,
      dragoverqueue_processtimer;

    var clientFrameWindow = Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0)
      .contentWindow;

    var stop = true;
    /*
        Funzione che esegue lo scrolling nell'iframe
        */
    var scroll = function(step) {
      var scrollY = $(
        Rexbuilder_Util_Admin_Editor.$frameBuilder[0].contentWindow
      ).scrollTop();
      $(Rexbuilder_Util_Admin_Editor.$frameBuilder[0].contentWindow).scrollTop(
        scrollY + step
      );
      if (!stop) {
        setTimeout(function() {
          scroll(step);
        }, 20);
      }
    };

    $(document).on("dragstart", ".model-list li", function(event) {
      Rexbuilder_Util_Admin_Editor.blockIframeRows();
      event.originalEvent.dataTransfer.effectAllowed = "all";
      dragoverqueue_processtimer = setInterval(function() {
        DragDropFunctions.ProcessDragOverQueue();
      }, 100);
      var insertingHTML =
        '<div class="import-model" data-rex-model-id="' +
        $(this).attr("data-rex-model-id") +
        '"><h1>Importing Model</h1></div>';
      event.originalEvent.dataTransfer.setData("text/plain", insertingHTML);
    });

    // definisce quando bisogna scrollare in alto o in basso
    $(document).on("drag", ".model-list li", function(event) {
      stop = true;

      if (event.clientY < 150) {
        stop = false;
        scroll(-1);
      }

      if (
        event.clientY >
        $(
          Rexbuilder_Util_Admin_Editor.$frameBuilder[0].contentWindow
        ).height() -
          150
      ) {
        stop = false;
        scroll(1);
      }
    });

    $(document).on("dragend", ".model-list li", function(event) {
      Rexbuilder_Util_Admin_Editor.releaseIframeRows();
      stop = true;
      clearInterval(dragoverqueue_processtimer);
      DragDropFunctions.removePlaceholder();
      DragDropFunctions.ClearContainerContext();
    });

    Rexbuilder_Util_Admin_Editor.$frameBuilder.load(function() {
      var $rexContainer = $(clientFrameWindow.document)
        .find(".rex-container")
        .eq(0);

      $rexContainer.on("dragenter", function(event) {
        event.stopPropagation();
        currentElement = $(event.target);
        currentElementChangeFlag = true;
        elementRectangle = event.target.getBoundingClientRect();
        countdown = 1;
      });

      $rexContainer.on("dragover", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (countdown % 15 != 0 && currentElementChangeFlag == false) {
          countdown = countdown + 1;
          return;
        }
        event = event || window.event;
        countdown = countdown + 1;
        currentElementChangeFlag = false;
        var mousePosition = {
          x: event.originalEvent.clientX,
          y: event.originalEvent.clientY
        };
        DragDropFunctions.AddEntryToDragOverQueue(
          currentElement,
          elementRectangle,
          mousePosition
        );
      });

      $rexContainer.on("drop", function(event) {
        event.preventDefault();
        event.stopPropagation();
        var e;
        if (event.isTrigger) {
          e = triggerEvent.originalEvent;
        } else {
          e = event.originalEvent;
        }
        try {
          var textData = e.dataTransfer.getData("text/plain");
          var $insertionPoint = Rexbuilder_Util_Admin_Editor.$frameBuilder
            .contents()
            .find(".drop-marker");
          var $divInsert = $(jQuery.parseHTML(textData));
          $divInsert.insertAfter($insertionPoint[0]);
          $insertionPoint.remove();
          var dataEndDrop = {
            eventName: "rexlive:importModels"
          };
          Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataEndDrop);
        } catch (e) {
          console.log(e);
        }
      });
    });

    var DragDropFunctions = {
      dragoverqueue: [],
      GetMouseBearingsPercentage: function($element, elementRect, mousePos) {
        if (!elementRect) elementRect = $element.get(0).getBoundingClientRect();
        var mousePosPercent_X =
          ((mousePos.x - elementRect.left) /
            (elementRect.right - elementRect.left)) *
          100;
        var mousePosPercent_Y =
          ((mousePos.y - elementRect.top) /
            (elementRect.bottom - elementRect.top)) *
          100;

        return { x: mousePosPercent_X, y: mousePosPercent_Y };
      },
      OrchestrateDragDrop: function($element, elementRect, mousePos) {
        //If no element is hovered or element hovered is the placeholder -> not valid -> return false;
        if (!$element || $element.length == 0 || !elementRect || !mousePos) {
          return false;
        }

        if ($element.is("html")) {
          $element = $element.find("body");
        }

        //Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
        var breakPointNumber = { x: 50, y: 50 };
        var mousePercents = this.GetMouseBearingsPercentage(
          $element,
          elementRect,
          mousePos
        );
        if (
          mousePercents.x > breakPointNumber.x &&
          mousePercents.x < 100 - breakPointNumber.x &&
          (mousePercents.y > breakPointNumber.y &&
            mousePercents.y < 100 - breakPointNumber.y)
        ) {
          var $tempElement = $element.clone();
          $tempElement.find(".drop-marker").remove();
          if (
            $tempElement.html() == "" &&
            !this.checkVoidElement($tempElement)
          ) {
            if (mousePercents.y < 90) {
              return this.PlaceInside($element);
            }
          } else if ($tempElement.children().length == 0) {
            this.DecideBeforeAfter($element, mousePercents);
          } else if ($tempElement.children().length == 1) {
            this.DecideBeforeAfter(
              $element
                .children(":not(.drop-marker,[data-dragcontext-marker])")
                .first(),
              mousePercents
            );
          } else {
            var positionAndElement = this.findNearestElement(
              $element,
              mousePos.x,
              mousePos.y
            );
            this.DecideBeforeAfter(
              positionAndElement.el,
              mousePercents,
              mousePos
            );
          }
        } else if (
          mousePercents.x <= breakPointNumber.x ||
          mousePercents.y <= breakPointNumber.y
        ) {
          var validElement = this.FindValidParent($element, "top");

          if (validElement.is("body,html")) {
            validElement = Rexbuilder_Util_Admin_Editor.$frameBuilder
              .contents()
              .find("body")
              .children(":not(.drop-marker,[data-dragcontext-marker])")
              .first();
          }
          this.DecideBeforeAfter(validElement, mousePercents, mousePos);
        } else if (
          mousePercents.x >= 100 - breakPointNumber.x ||
          mousePercents.y >= 100 - breakPointNumber.y
        ) {
          var validElement = this.FindValidParent($element, "bottom");

          if (validElement.is("body,html")) {
            validElement = Rexbuilder_Util_Admin_Editor.$frameBuilder
              .contents()
              .find("body")
              .children(":not(.drop-marker,[data-dragcontext-marker])")
              .last();
          }
          this.DecideBeforeAfter(validElement, mousePercents, mousePos);
        }
      },
      DecideBeforeAfter: function($targetElement, mousePercents, mousePos) {
        if (mousePos) {
          mousePercents = this.GetMouseBearingsPercentage(
            $targetElement,
            null,
            mousePos
          );
        }

        var $orientation =
          $targetElement.css("display") == "inline" ||
          $targetElement.css("display") == "inline-block";
        if ($targetElement.is("br")) {
          $orientation = false;
        }

        if ($orientation) {
          if (mousePercents.x < 50) {
            return this.PlaceBefore($targetElement);
          } else {
            return this.PlaceAfter($targetElement);
          }
        } else {
          if (mousePercents.y < 50) {
            return this.PlaceBefore($targetElement);
          } else {
            return this.PlaceAfter($targetElement);
          }
        }
      },
      checkVoidElement: function($element) {
        var voidelements = [
          "i",
          "area",
          "base",
          "br",
          "col",
          "command",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "meta",
          "param",
          "video",
          "iframe",
          "source",
          "track",
          "wbr"
        ];
        var selector = voidelements.join(",");
        if ($element.is(selector)) {
          return true;
        } else {
          return false;
        }
      },
      calculateDistance: function(elementData, mouseX, mouseY) {
        return Math.sqrt(
          Math.pow(elementData.x - mouseX, 2) +
            Math.pow(elementData.y - mouseY, 2)
        );
      },
      FindValidParent: function($element, direction) {
        switch (direction) {
          case "left":
            while (true) {
              var elementRect = $element.get(0).getBoundingClientRect();
              var $tempElement = $element.parent();
              var tempelementRect = $tempElement.get(0).getBoundingClientRect();
              if ($element.is("body") || $element.hasClass("rex-container")) {
                return $element;
              }
              if (Math.abs(tempelementRect.left - elementRect.left) == 0) {
                $element = $element.parent();
              } else {
                return $element;
              }
            }
            break;
          case "right":
            while (true) {
              var elementRect = $element.get(0).getBoundingClientRect();
              var $tempElement = $element.parent();
              var tempelementRect = $tempElement.get(0).getBoundingClientRect();
              if ($element.is("body") || $element.hasClass("rex-container")) {
                return $element;
              }
              if (Math.abs(tempelementRect.right - elementRect.right) == 0) {
                $element = $element.parent();
              } else {
                return $element;
              }
            }
            break;
          case "top":
            while (true) {
              var elementRect = $element.get(0).getBoundingClientRect();
              var $tempElement = $element.parent();
              var tempelementRect = $tempElement.get(0).getBoundingClientRect();
              if ($element.is("body") || $element.hasClass("rex-container")) {
                return $element;
              }
              if (Math.abs(tempelementRect.top - elementRect.top) == 0) {
                $element = $element.parent();
              } else {
                return $element;
              }
            }
            break;
          case "bottom":
            while (true) {
              var elementRect = $element.get(0).getBoundingClientRect();
              var $tempElement = $element.parent();
              var tempelementRect = $tempElement.get(0).getBoundingClientRect();
              if ($element.is("body") || $element.hasClass("rex-container")) {
                return $element;
              }
              if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0) {
                $element = $element.parent();
              } else {
                return $element;
              }
            }
            break;
          default:
            break;
        }
      },
      addPlaceHolder: function($element, position, placeholder) {
        if ($element.hasClass("rex-container")) {
          if (position == "before") {
            position = "inside-prepend";
          } else {
            position = "inside-append";
          }
        }
        if (!placeholder) {
          placeholder = this.getPlaceHolder();
        }
        this.removePlaceholder();
        switch (position) {
          case "before":
            placeholder
              .find(".message")
              .html($element.parent().data("sh-dnd-error"));
            $element.before(placeholder);
            this.AddContainerContext($element, "sibling");
            break;
          case "after":
            placeholder
              .find(".message")
              .html($element.parent().data("sh-dnd-error"));
            $element.after(placeholder);
            this.AddContainerContext($element, "sibling");
            break;
          case "inside-prepend":
            placeholder.find(".message").html($element.data("sh-dnd-error"));
            $element.prepend(placeholder);
            this.AddContainerContext($element, "inside");
            break;
          case "inside-append":
            placeholder.find(".message").html($element.data("sh-dnd-error"));
            $element.append(placeholder);
            this.AddContainerContext($element, "inside");
            break;
        }
      },

      removePlaceholder: function() {
        Rexbuilder_Util_Admin_Editor.$frameBuilder
          .contents()
          .find(".drop-marker")
          .remove();
      },

      getPlaceHolder: function() {
        return $("<li class='drop-marker'></li>");
      },

      PlaceInside: function($element) {
        var placeholder = this.getPlaceHolder();
        placeholder
          .addClass("horizontal")
          .css("width", $element.width() + "px");
        this.addPlaceHolder($element, "inside-append", placeholder);
      },

      PlaceBefore: function($element) {
        var placeholder = this.getPlaceHolder();
        var inlinePlaceholder =
          $element.css("display") == "inline" ||
          $element.css("display") == "inline-block";
        if ($element.is("br")) {
          inlinePlaceholder = false;
        } else if ($element.is("td,th")) {
          placeholder
            .addClass("horizontal")
            .css("width", $element.width() + "px");
          return this.addPlaceHolder($element, "inside-prepend", placeholder);
        }
        if (inlinePlaceholder) {
          placeholder
            .addClass("vertical")
            .css("height", $element.innerHeight() + "px");
        } else {
          placeholder
            .addClass("horizontal")
            .css("width", $element.parent().width() + "px");
        }
        this.addPlaceHolder($element, "before", placeholder);
      },

      PlaceAfter: function($element) {
        var placeholder = this.getPlaceHolder();
        var inlinePlaceholder =
          $element.css("display") == "inline" ||
          $element.css("display") == "inline-block";
        if ($element.is("br")) {
          inlinePlaceholder = false;
        } else if ($element.is("td,th")) {
          placeholder
            .addClass("horizontal")
            .css("width", $element.width() + "px");
          return this.addPlaceHolder($element, "inside-append", placeholder);
        }
        if (inlinePlaceholder) {
          placeholder
            .addClass("vertical")
            .css("height", $element.innerHeight() + "px");
        } else {
          placeholder
            .addClass("horizontal")
            .css("width", $element.parent().width() + "px");
        }
        this.addPlaceHolder($element, "after", placeholder);
      },

      findNearestElement: function($container, clientX, clientY) {
        var _this = this;
        var previousElData = null;
        var childElement = $container.children(
          ":not(.drop-marker,[data-dragcontext-marker])"
        );
        if (childElement.length > 0) {
          childElement.each(function() {
            if ($(this).is(".drop-marker")) {
              return;
            }

            var offset = $(this)
              .get(0)
              .getBoundingClientRect();
            var distance = 0;
            var distance1,
              distance2 = null;
            var position = "";
            var xPosition1 = offset.left;
            var xPosition2 = offset.right;
            var yPosition1 = offset.top;
            var yPosition2 = offset.bottom;
            var corner1 = null;
            var corner2 = null;

            //Parellel to Yaxis and intersecting with x axis
            if (clientY > yPosition1 && clientY < yPosition2) {
              if (clientX < xPosition1 && clientY < xPosition2) {
                corner1 = { x: xPosition1, y: clientY, position: "before" };
              } else {
                corner1 = { x: xPosition2, y: clientY, position: "after" };
              }
            }
            //Parellel to xAxis and intersecting with Y axis
            else if (clientX > xPosition1 && clientX < xPosition2) {
              if (clientY < yPosition1 && clientY < yPosition2) {
                corner1 = { x: clientX, y: yPosition1, position: "before" };
              } else {
                corner1 = { x: clientX, y: yPosition2, position: "after" };
              }
            } else {
              //runs if no element found!
              if (clientX < xPosition1 && clientX < xPosition2) {
                corner1 = { x: xPosition1, y: yPosition1, position: "before" }; //left top
                corner2 = { x: xPosition1, y: yPosition2, position: "after" }; //left bottom
              } else if (clientX > xPosition1 && clientX > xPosition2) {
                corner1 = { x: xPosition2, y: yPosition1, position: "before" }; //Right top
                corner2 = { x: xPosition2, y: yPosition2, position: "after" };
                //Right Bottom
              } else if (clientY < yPosition1 && clientY < yPosition2) {
                corner1 = { x: xPosition1, y: yPosition1, position: "before" };
                //Top Left
                corner2 = { x: xPosition2, y: yPosition1, position: "after" };
                //Top Right
              } else if (clientY > yPosition1 && clientY > yPosition2) {
                corner1 = { x: xPosition1, y: yPosition2, position: "before" };
                //Left bottom
                corner2 = { x: xPosition2, y: yPosition2, position: "after" };
                //Right Bottom
              }
            }

            distance1 = _this.calculateDistance(corner1, clientX, clientY);

            if (corner2 !== null) {
              distance2 = _this.calculateDistance(corner2, clientX, clientY);
            }

            if (distance1 < distance2 || distance2 === null) {
              distance = distance1;
              position = corner1.position;
            } else {
              distance = distance2;
              position = corner2.position;
            }

            if (previousElData !== null) {
              if (previousElData.distance < distance) {
                return true; //continue statement
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
            return { el: $(previousElData.el), position: position };
          } else {
            return false;
          }
        }
      },
      AddEntryToDragOverQueue: function($element, elementRect, mousePos) {
        var newEvent = [$element, elementRect, mousePos];
        this.dragoverqueue.push(newEvent);
      },
      ProcessDragOverQueue: function($element, elementRect, mousePos) {
        var processing = this.dragoverqueue.pop();
        this.dragoverqueue = [];
        if (processing && processing.length == 3) {
          var $el = processing[0];
          var $elRect = processing[1];
          var mousePos = processing[2];
          this.OrchestrateDragDrop($el, $elRect, mousePos);
        }
      },
      GetContextMarker: function() {
        var $contextMarker = $(
          "<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>"
        );
        return $contextMarker;
      },
      AddContainerContext: function($element, position) {
        var $contextMarker = this.GetContextMarker();
        this.ClearContainerContext();
        if ($element.is("html,body")) {
          position = "inside";
          $element = Rexbuilder_Util_Admin_Editor.$frameBuilder
            .contents()
            .find("body");
        }
        switch (position) {
          case "inside":
            this.PositionContextMarker($contextMarker, $element);
            if ($element.hasClass("stackhive-nodrop-zone"))
              $contextMarker.addClass("invalid");
            var name = this.getElementName($element);
            $contextMarker.find("[data-dragcontext-marker-text]").html(name);
            if (
              Rexbuilder_Util_Admin_Editor.$frameBuilder
                .contents()
                .find("body [data-sh-parent-marker]").length != 0
            )
              Rexbuilder_Util_Admin_Editor.$frameBuilder
                .contents()
                .find("body [data-sh-parent-marker]")
                .first()
                .before($contextMarker);
            else
              Rexbuilder_Util_Admin_Editor.$frameBuilder
                .contents()
                .find("body")
                .append($contextMarker);
            break;
          case "sibling":
            this.PositionContextMarker($contextMarker, $element.parent());
            if ($element.parent().hasClass("stackhive-nodrop-zone"))
              $contextMarker.addClass("invalid");
            var name = this.getElementName($element.parent());
            $contextMarker.find("[data-dragcontext-marker-text]").html(name);
            $contextMarker.attr("data-dragcontext-marker", name.toLowerCase());
            if (
              Rexbuilder_Util_Admin_Editor.$frameBuilder
                .contents()
                .find("body [data-sh-parent-marker]").length != 0
            )
              Rexbuilder_Util_Admin_Editor.$frameBuilder
                .contents()
                .find("body [data-sh-parent-marker]")
                .first()
                .before($contextMarker);
            else
              Rexbuilder_Util_Admin_Editor.$frameBuilder
                .contents()
                .find("body")
                .append($contextMarker);
            break;
        }
      },

      PositionContextMarker: function($contextMarker, $element) {
        var rect = $element.get(0).getBoundingClientRect();
        $contextMarker.css({
          height: rect.height + 4 + "px",
          width: rect.width + 4 + "px",
          top:
            rect.top +
            $(
              Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow
            ).scrollTop() -
            2 +
            "px",
          left:
            rect.left +
            $(
              Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow
            ).scrollLeft() -
            2 +
            "px"
        });
        if (
          rect.top +
            Rexbuilder_Util_Admin_Editor.$frameBuilder
              .contents()
              .find("body")
              .scrollTop() <
          24
        )
          $contextMarker
            .find("[data-dragcontext-marker-text]")
            .css("top", "0px");
      },

      ClearContainerContext: function() {
        Rexbuilder_Util_Admin_Editor.$frameBuilder
          .contents()
          .find("[data-dragcontext-marker]")
          .remove();
      },

      getElementName: function($element) {
        return $element.prop("tagName");
      }
    };
  };

  var _init = function() {
    var $self = $("#rex-models-list");
    rexmodel_import_props = {
      $self: $self,
      $close_button: $self.find(".rex-close-button")
    };
    _linkDocumentListeners();
    _linkDraggable();
  };

  return {
    init: _init,
    openModal: _openModal,
    closeModal: _closeModal
  };
})(jQuery);
