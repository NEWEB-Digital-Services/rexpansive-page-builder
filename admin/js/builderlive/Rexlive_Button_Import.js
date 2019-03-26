/**
 * https://www.html5rocks.com/en/tutorials/dnd/basics/
 * https://github.com/StackHive/DragDropInterface
 * http://mereskin.github.io/dnd/
 */

var Button_Import_Modal = (function ($) {
    "use strict";
    var rexbutton_import_props;
    var styleSheet;

    /////////////////////////////////////////////////////////////////////////////////////////
    // CSS FUNCTIONS
    /////////////////////////////////////////////////////////////////////////////////////////

    var _fixCustomStyleElement = function () {
        if (Button_Import_Modal.$buttonsStyle.length == 0) {
            var css = "",
                head = document.head || document.getElementsByTagName("head")[0],
                style = document.createElement("style");

            style.type = "text/css";
            style.id = "rexliveStyle-inline-css";
            style.dataset.rexName = "buttons-style";
            if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        }
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].ownerNode.id == "rexliveStyle-inline-css") {
                styleSheet = document.styleSheets[i];
            }
        }
    };

    var _addButtonContainerRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addButtonBackgroundRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addButtonBackgroundHoverRule = function (buttonID, property) {
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover{" + property + "}", styleSheet.cssRules.length);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover{" + property + "}", styleSheet.cssRules.length);
        }
    }

    var _addCSSRules = function (buttonID, buttonProperties) {
        var containerRule = "";
        containerRule += "font-size: " + buttonProperties.font_size + ";";
        containerRule += "color: " + buttonProperties.text_color + ";";
        containerRule += "height: " + buttonProperties.button_height + ";";
        containerRule += "margin-top: " + buttonProperties.margin_top + ";";
        containerRule += "margin-bottom: " + buttonProperties.margin_bottom + ";";
        containerRule += "margin-left: " + buttonProperties.margin_left + ";";
        containerRule += "margin-right: " + buttonProperties.margin_right + ";";
        _addButtonContainerRule(buttonID, containerRule);

        var backgroundRule = "";
        backgroundRule += "border-width: " + buttonProperties.border_width + ";";
        backgroundRule += "border-color: " + buttonProperties.border_color + ";";
        backgroundRule += "border-style: " + "solid" + ";";
        backgroundRule += "border-radius: " + buttonProperties.border_radius + ";";
        backgroundRule += "background-color: " + buttonProperties.background_color + ";";
        _addButtonBackgroundRule(buttonID, backgroundRule);

        var backgroundHoverRule = "";
        backgroundHoverRule += "background-color: " + buttonProperties.hover_color + ";";
        _addButtonBackgroundHoverRule(buttonID, backgroundHoverRule);
    }

    var _removeButtonContainerRule = function (buttonID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-container") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }
    var _removeButtonBackgroundRule = function (buttonID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }
    var _removeButtonBackgroundHoverRule = function (buttonID) {
        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == ".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"] .rex-button-background:hover") {
                styleSheet.deleteRule(i);
                break;
            }
        }
    }

    var _removeCSSRules = function (buttonID) {
        _removeButtonContainerRule(buttonID);
        _removeButtonBackgroundRule(buttonID);
        _removeButtonBackgroundHoverRule(buttonID);
    }

    var _getActiveStyleSheet = function () {
        return styleSheet;
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // Buttons Functions
    /////////////////////////////////////////////////////////////////////////////////////////
    var _updateButtonList = function (data) {
        var buttonData = data.buttonData;
        var buttonID = buttonData.buttonTarget.button_id;
        var buttonHTML = data.html;
        _removeCSSRules(buttonID);
        _addCSSRules(buttonID, buttonData);
        // chiedere a stefano come far andare height anche qua

        //togliere l'elemento se c'è già e aggiungere quello nuovo
        var $buttonEL = rexbutton_import_props.$buttonList.find(".rex-button-wrapper[data-rex-button-id=\"" + buttonID + "\"]");
        if ($buttonEL.length == 0) {
            var $liEL = $(document.createElement("li"));
            $liEL.attr("draggable", true);
            var $div = $(document.createElement("div"));
            $div.append($(jQuery.parseHTML(buttonHTML)));
            $div.addClass("rex-container");
            $div.appendTo($liEL);
            $liEL.appendTo(rexbutton_import_props.$buttonList);
        } else {
            var $buttonParent = $buttonEL.parent();
            $buttonEL.remove();
            $buttonParent.append($(jQuery.parseHTML(buttonHTML)));
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////
    // Function for drag & drop
    /////////////////////////////////////////////////////////////////////////////////////////

    var _linkDraggable = function () {

        var currentElement,
            currentElementChangeFlag,
            elementRectangle,
            countdown,
            dragoverqueue_processtimer;

        var clientFrameWindow = Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow;
        var $frameContentWindow = $(clientFrameWindow);

        var buttonDimensions = {
            width: 0,
            height: 0
        }

        var breakPointNumber = { x: 10, y: 10 };
        var fixedBreakPoints = false;
        var customBreakPoints = { x: 50, y: 50 };

        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        /*
        da capire come fare, servirà per il pulsante vicino al mouse durante il drag
        */
        var $imgPreview;

        var mouseClientX = 0,
            mouseClientY = 0;

        Rexlive_Base_Settings.$document.on("dragstart", ".button-list li", function (
            event
        ) {
            Rexbuilder_Util_Admin_Editor.dragImportType = "rexbutton";
            event.originalEvent.dataTransfer.effectAllowed = "all";
            dragoverqueue_processtimer = setInterval(function () {
                DragDropFunctions.ProcessDragOverQueue();
            }, 100);

            var insertingHTML = $(this).html();
            var $buttonBackground = $(this).find(".rex-button-background").eq(0);
            buttonDimensions.width = $buttonBackground.outerWidth();
            buttonDimensions.height = $buttonBackground.outerHeight();
            if(isIE){
                event.originalEvent.dataTransfer.setData("text", insertingHTML);
            } else {
                event.originalEvent.dataTransfer.setData("text/plain", insertingHTML);
            }
            Rexbuilder_Util_Admin_Editor.addClassToLiveFrameRexContainer("rex-dragging-button");

            var dataDnDstart = {
                eventName: "rexlive:drag_drop_starded",
                data_to_send: {}
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDstart);
        });

        // definisce quando bisogna scrollare in alto o in basso
        Rexlive_Base_Settings.$document.on("drag", ".button-list li", function (
            event
        ) {
            Rexbuilder_Util_Admin_Editor.setScroll(true);

            if (mouseClientY < 150) {
                Rexbuilder_Util_Admin_Editor.setScroll(false);
                Rexbuilder_Util_Admin_Editor.scrollFrame(-1);
            }

            if (mouseClientY > $frameContentWindow.height() - 150) {
                Rexbuilder_Util_Admin_Editor.setScroll(false);
                Rexbuilder_Util_Admin_Editor.scrollFrame(1);
            }
        });

        Rexlive_Base_Settings.$document.on("dragend", ".button-list li", function (event) {
            clearInterval(dragoverqueue_processtimer);
            DragDropFunctions.removePlaceholder();
            DragDropFunctions.ClearContainerContext();
            Rexbuilder_Util_Admin_Editor.removeClassToLiveFrameRexContainer("rex-dragging-button");
            Rexbuilder_Util_Admin_Editor.dragImportType = "";
            var dataDnDend = {
                eventName: "rexlive:drag_drop_ended",
                data_to_send: {}
            };
            Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataDnDend);
        });

        Rexbuilder_Util_Admin_Editor.$frameBuilder.load(function () {

            var $rexContainer = $(Rexbuilder_Util_Admin_Editor.$frameBuilder.get(0).contentWindow.document).find(".rex-container").eq(0);

            var mousePosition = {};
            var mousePositionToIFrame = {};

            $frameContentWindow.on('dragover', function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexbutton") {
                    // mouse position for scrolling
                    event.preventDefault();
                    event.stopPropagation();
                    mouseClientX = event.originalEvent.clientX;
                    mouseClientY = event.originalEvent.clientY;
                }
            });

            $rexContainer.on('dragenter', ".grid-stack-row", function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexbutton") {
                    currentElement = $(event.target);
                    currentElementChangeFlag = true;
                    elementRectangle = event.target.getBoundingClientRect();
                    countdown = 1;
                }
            });

            $rexContainer.on('dragover', ".grid-stack-row", function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexbutton") {

                    if (countdown % 15 != 0 && currentElementChangeFlag == false) {
                        countdown = countdown + 1;
                        return;
                    }
                    event = event || window.event;
                    countdown = countdown + 1;
                    currentElementChangeFlag = false;

                    mousePosition.x = event.originalEvent.clientX;
                    mousePosition.y = event.originalEvent.clientY;

                    mousePositionToIFrame.x = event.originalEvent.pageX
                    mousePositionToIFrame.y = event.originalEvent.pageY;
                    DragDropFunctions.AddEntryToDragOverQueue(currentElement, elementRectangle, mousePosition);
                }
            });

            $rexContainer.on('drop', ".grid-stack-row", function (event) {
                if (Rexbuilder_Util_Admin_Editor.dragImportType == "rexbutton") {
                    event.preventDefault();
                    event.stopPropagation();
                    var e;
                    if (event.isTrigger) {
                        e = triggerEvent.originalEvent;
                    } else {
                        e = event.originalEvent;
                    }
                    try {
                        var textData = "";
                        if(isIE){
                            textData = e.dataTransfer.getData("text");
                        } else {
                            textData = e.dataTransfer.getData("text/plain");
                        }
                        var $insertionPoint = Rexbuilder_Util_Admin_Editor.$frameBuilder
                            .contents()
                            .find(".drop-marker");

                        var $divInsert = $(jQuery.parseHTML(textData));
                        $divInsert.addClass("rex-loading-button");
                        $divInsert.insertAfter($insertionPoint[0]);
                        $insertionPoint.remove();
                        var dataEndDrop = {
                            eventName: "rexlive:importButton",
                            data_to_send: {
                                buttonDimensions: buttonDimensions,
                                mousePosition: mousePositionToIFrame
                            }
                        };
                        Rexbuilder_Util_Admin_Editor.sendIframeBuilderMessage(dataEndDrop);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            });
        });
        
        var mousePercents;
        var voidelements = ['i', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'video', 'iframe', 'source', 'track', 'wbr'];
        var selectorVoidElements = voidelements.join(",");
        
        var DragDropFunctions =
        {
            dragoverqueue: [],
            GetMouseBearingsPercentage: function ($element, elementRect, mousePos) {
                if (!elementRect) {
                    elementRect = $element.get(0).getBoundingClientRect();
                }
                return {
                    x: ((mousePos.x - elementRect.left) / (elementRect.right - elementRect.left)) * 100,
                    y: ((mousePos.y - elementRect.top) / (elementRect.bottom - elementRect.top)) * 100
                };
            },
            OrchestrateDragDrop: function ($element, elementRect, mousePos) {
                //If no element is hovered or element hovered is the placeholder -> not valid -> return false;
                if (!$element || $element.length == 0 || !elementRect || !mousePos) {
                    return false;
                }

                if ($element.is('html')) {
                    $element = $element.find('body');
                }
                //Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]

                mousePercents = this.GetMouseBearingsPercentage($element, elementRect, mousePos);

                // se devo entrare dentro l'elemento
                if ($element.hasClass("rex-button-wrapper") || $element.parents(".rex-button-wrapper").length != 0) {
                    $element = $element.hasClass("rex-button-wrapper") ? $element : $element.parents(".rex-button-wrapper").eq(0);
                    customBreakPoints = jQuery.extend(true, {}, breakPointNumber);
                    fixedBreakPoints = true;
                    breakPointNumber.x = 50;
                    breakPointNumber.y = 50;
                }
                if ((mousePercents.x > breakPointNumber.x && mousePercents.x < 100 - breakPointNumber.x)
                    && (mousePercents.y > breakPointNumber.y && mousePercents.y < 100 - breakPointNumber.y)) {
                    //Case 1 -
                    var $tempelement = $element.clone();
                    $tempelement.find(".drop-marker").remove();
                    if ($tempelement.html() == "" && !this.checkVoidElement($tempelement)) {
                        if (mousePercents.y < 90) {
                            return this.PlaceInside($element);
                        }
                    } else if ($tempelement.children().length == 0) {
                        //text element detected
                        this.DecideBeforeAfter($element, mousePercents);
                    } else if ($tempelement.children().length == 1) {
                        //only 1 child element detected
                        if ($tempelement.hasClass("rex-buttons-paragraph")) {
                            var positionAndElement = this.findNearestElement($element, mousePos.x, mousePos.y);
                            this.DecideBeforeAfter(positionAndElement.el, mousePercents, mousePos);
                        } else {
                            this.DecideBeforeAfter($element.children(":not(.drop-marker,[data-dragcontext-marker])").first(), mousePercents);
                        }
                    } else {
                        var positionAndElement = this.findNearestElement($element, mousePos.x, mousePos.y);
                        this.DecideBeforeAfter(positionAndElement.el, mousePercents, mousePos);
                    }
                } else if ((mousePercents.x <= breakPointNumber.x) || (mousePercents.y <= breakPointNumber.y)) {
                    if (mousePercents.y <= mousePercents.x) {
                        validElement = this.FindValidParent($element, 'top');
                    } else {
                        validElement = this.FindValidParent($element, 'left');
                    }

                    if (validElement.is("body,html")) {
                        validElement = Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").first();
                    }
                    this.DecideBeforeAfter(validElement, mousePercents, mousePos);
                } else if ((mousePercents.x >= 100 - breakPointNumber.x) || (mousePercents.y >= 100 - breakPointNumber.y)) {
                    var validElement = null;
                    if (mousePercents.y >= mousePercents.x) {
                        validElement = this.FindValidParent($element, 'bottom');
                    } else {
                        validElement = this.FindValidParent($element, 'right');
                    }

                    if (validElement.is("body,html")) {
                        validElement = Rexbuilder_Util_Admin_Editor.$frameBuilder.contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").last();
                    }
                    this.DecideBeforeAfter(validElement, mousePercents, mousePos);
                }
                if (fixedBreakPoints) {
                    breakPointNumber.x = customBreakPoints.x;
                    breakPointNumber.y = customBreakPoints.y;
                    fixedBreakPoints = false;
                }

                /**
                 * Checks if current element, where placeholder is, is a valid element. If not checks if has a grid-stack-item as parent. If has moves placeholder in right position
                 */
                if (!$element.hasClass("rex-buttons-paragraph") && !$element.hasClass("text-wrap") && !$element.hasClass("rex-button-wrapper")) {
                    var $gridItem = $element.parents(".grid-stack-item");
                    if ($gridItem.length != 0) {
                        this.removePlaceholder();
                        $gridItem.find(".text-wrap").eq(0).append(this.getPlaceHolder());
                    }
                }
            },
            DecideBeforeAfter: function ($targetElement, mousePercents, mousePos) {
                if (mousePos) {
                    mousePercents = this.GetMouseBearingsPercentage($targetElement, null, mousePos);
                }

                /*if(!mousePercents)
                 {
                 mousePercents = this.GetMouseBearingsPercentage($targetElement, $targetElement.get(0).getBoundingClientRect(), mousePos);
                 } */

                var $orientation = ($targetElement.css('display') == "inline" || $targetElement.css('display') == "inline-block" || $targetElement.css('display') == "inline-flex");
                if ($targetElement.is("br")) {
                    $orientation = false;
                }

                if ($orientation) {
                    if (mousePercents.x < 50) {
                        return this.PlaceBefore($targetElement);
                    }
                    else {
                        return this.PlaceAfter($targetElement);
                    }
                }
                else {
                    if (mousePercents.y < 50) {
                        return this.PlaceBefore($targetElement);
                    }
                    else {
                        return this.PlaceAfter($targetElement);
                    }
                }
            },
            checkVoidElement: function ($element) {
                return $element.is(selectorVoidElements);
            },
            calculateDistance: function (elementData, mouseX, mouseY) {
                return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
            },
            FindValidParent: function ($element, direction) {
                switch (direction) {
                    case "left":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-buttons-paragraph")) {
                                return $element;
                            }
                            if (Math.abs(tempelementRect.left - elementRect.left) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-button-wrapper").length != 0) {
                                    return $element.parents(".rex-button-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    case "right":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-buttons-paragraph")) {
                                console.log($element);
                                return $element;
                            }
                            if (Math.abs(tempelementRect.right - elementRect.right) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-button-wrapper").length != 0) {
                                    return $element.parents(".rex-button-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    case "top":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-buttons-paragraph")) {
                                return $element;
                            }
                            if (Math.abs(tempelementRect.top - elementRect.top) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-button-wrapper").length != 0) {
                                    return $element.parents(".rex-button-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    case "bottom":
                        while (true) {
                            var elementRect = $element.get(0).getBoundingClientRect();
                            var $tempElement = $element.parent();
                            var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                            if ($element.is("body") || $element.hasClass("grid-stack-row") || $tempElement.hasClass("rex-buttons-paragraph"))
                                return $element;
                            if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0) {
                                $element = $element.parent();
                            } else {
                                if ($element.parents(".rex-button-wrapper").length != 0) {
                                    return $element.parents(".rex-button-wrapper").eq(0);
                                }
                                return $element;
                            }
                        }
                        break;
                    default:
                        break;
                }
            },
            addPlaceHolder: function ($element, position, placeholder) {
                if (!placeholder)
                    placeholder = this.getPlaceHolder();
                this.removePlaceholder();
                switch (position) {
                    case "before":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        //buttons have to be inside grid-stack-row
                        if ($element.hasClass("grid-stack-row")) {
                            $element.prepend(placeholder);
                        } else {
                            $element.before(placeholder);
                        }
                        this.AddContainerContext($element, 'sibling');
                        break;
                    case "after":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        //buttons have to be inside grid-stack-row
                        if ($element.hasClass("grid-stack-row")) {
                            $element.append(placeholder);
                        } else {
                            $element.after(placeholder);
                        }
                        this.AddContainerContext($element, 'sibling');
                        break;
                    case "inside-prepend":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        $element.prepend(placeholder);
                        this.AddContainerContext($element, 'inside');
                        break;
                    case "inside-append":
                        placeholder.find(".message").html($element.data('sh-dnd-error'));
                        $element.append(placeholder);
                        this.AddContainerContext($element, 'inside');
                        break;
                }
            },
            removePlaceholder: function () {
                Rexbuilder_Util_Admin_Editor.$frameBuilder
                    .contents()
                    .find(".drop-marker")
                    .remove();
            },
            getPlaceHolder: function () {
                return $("<li class='drop-marker'></li>");
            },
            PlaceInside: function ($element) {
                var placeholder = this.getPlaceHolder();
                placeholder.addClass('horizontal').css('width', $element.width() + "px");
                this.addPlaceHolder($element, "inside-append", placeholder);
            },
            PlaceBefore: function ($element) {
                var placeholder = this.getPlaceHolder();

                var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block" || $element.css('display') == "inline-flex");
                if ($element.is("br")) {
                    inlinePlaceholder = false;
                }
                else if ($element.is("td,th")) {
                    placeholder.addClass('horizontal').css('width', $element.width() + "px");
                    return this.addPlaceHolder($element, "inside-prepend", placeholder);
                }
                if (inlinePlaceholder) {
                    placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
                } else {
                    placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
                }
                this.addPlaceHolder($element, "before", placeholder);
            },

            PlaceAfter: function ($element) {
                var placeholder = this.getPlaceHolder();
                var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block" || $element.css('display') == "inline-flex");
                if ($element.is("br")) {
                    inlinePlaceholder = false;
                }
                else if ($element.is("td,th")) {
                    placeholder.addClass('horizontal').css('width', $element.width() + "px");
                    return this.addPlaceHolder($element, "inside-append", placeholder);
                }
                if (inlinePlaceholder)
                    placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
                else
                    placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
                this.addPlaceHolder($element, "after", placeholder);
            },

            findNearestElement: function ($container, clientX, clientY) {
                var _this = this;
                var previousElData = null;
                var childElement = $container.children(":not(.drop-marker,[data-dragcontext-marker])");
                if (childElement.length > 0) {
                    childElement.each(function () {
                        if ($(this).is(".drop-marker"))
                            return;

                        var offset = $(this).get(0).getBoundingClientRect();
                        var distance = 0;
                        var distance1, distance2 = null;
                        var position = '';
                        var xPosition1 = offset.left;
                        var xPosition2 = offset.right;
                        var yPosition1 = offset.top;
                        var yPosition2 = offset.bottom;
                        var corner1 = null;
                        var corner2 = null;

                        //Parellel to Yaxis and intersecting with x axis
                        if (clientY > yPosition1 && clientY < yPosition2) {
                            if (clientX < xPosition1 && clientY < xPosition2) {
                                corner1 = { x: xPosition1, y: clientY, 'position': 'before' };
                            }
                            else {
                                corner1 = { x: xPosition2, y: clientY, 'position': 'after' };
                            }

                        }
                        //Parellel to xAxis and intersecting with Y axis
                        else if (clientX > xPosition1 && clientX < xPosition2) {
                            if (clientY < yPosition1 && clientY < yPosition2) {
                                corner1 = { x: clientX, y: yPosition1, 'position': 'before' };
                            }
                            else {
                                corner1 = { x: clientX, y: yPosition2, 'position': 'after' };
                            }

                        }
                        else {
                            //runs if no element found!
                            if (clientX < xPosition1 && clientX < xPosition2) {
                                corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' };          //left top
                                corner2 = { x: xPosition1, y: yPosition2, 'position': 'after' };       //left bottom
                            }
                            else if (clientX > xPosition1 && clientX > xPosition2) {
                                //console.log('I m on the right of the element');
                                corner1 = { x: xPosition2, y: yPosition1, 'position': 'before' };   //Right top
                                corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' }; //Right Bottom
                            }
                            else if (clientY < yPosition1 && clientY < yPosition2) {
                                // console.log('I m on the top of the element');
                                corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' }; //Top Left
                                corner2 = { x: xPosition2, y: yPosition1, 'position': 'after' }; //Top Right
                            }
                            else if (clientY > yPosition1 && clientY > yPosition2) {
                                // console.log('I m on the bottom of the element');
                                corner1 = { x: xPosition1, y: yPosition2, 'position': 'before' }; //Left bottom
                                corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' } //Right Bottom
                            }
                        }

                        distance1 = _this.calculateDistance(corner1, clientX, clientY);

                        if (corner2 !== null)
                            distance2 = _this.calculateDistance(corner2, clientX, clientY);

                        if (distance1 < distance2 || distance2 === null) {
                            distance = distance1;
                            position = corner1.position;
                        }
                        else {
                            distance = distance2;
                            position = corner2.position;
                        }

                        if (previousElData !== null) {
                            if (previousElData.distance < distance) {
                                return true; //continue statement
                            }
                        }
                        previousElData = {
                            'el': this,
                            'distance': distance,
                            'xPosition1': xPosition1,
                            'xPosition2': xPosition2,
                            'yPosition1': yPosition1,
                            'yPosition2': yPosition2,
                            'position': position
                        };
                    });
                    if (previousElData !== null) {
                        var position = previousElData.position;
                        return {
                            'el': $(previousElData.el),
                            'position': position
                        };
                    }
                    else {
                        return false;
                    }
                }
            },
            AddEntryToDragOverQueue: function ($element, elementRect, mousePos) {
                var newEvent = [$element, elementRect, mousePos];
                this.dragoverqueue.push(newEvent);
            },
            ProcessDragOverQueue: function ($element, elementRect, mousePos) {
                var processing = this.dragoverqueue.pop();
                this.dragoverqueue = [];
                if (processing && processing.length == 3) {
                    var $el = processing[0];
                    var elRect = processing[1];
                    var mousePos = processing[2];
                    this.OrchestrateDragDrop($el, elRect, mousePos);
                }

            },
            GetContextMarker: function () {
                var $contextMarker = $("<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>");
                return $contextMarker;
            },
            AddContainerContext: function ($element, position) {
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
                        ) {
                            Rexbuilder_Util_Admin_Editor.$frameBuilder
                                .contents()
                                .find("body [data-sh-parent-marker]")
                                .first()
                                .before($contextMarker);
                        } else {

                        }
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
                        ) {

                            Rexbuilder_Util_Admin_Editor.$frameBuilder
                                .contents()
                                .find("body [data-sh-parent-marker]")
                                .first()
                                .before($contextMarker);
                        } else {

                        }
                        break;
                    default:
                        break;
                }
            },
            PositionContextMarker: function ($contextMarker, $element) {
                var rect = $element.get(0).getBoundingClientRect();
                $contextMarker.css({
                    height: rect.height + 4 + "px",
                    width: rect.width + 4 + "px",
                    top:
                        rect.top +
                        $frameContentWindow.scrollTop() -
                        2 +
                        "px",
                    left:
                        rect.left +
                        $frameContentWindow.scrollLeft() -
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
            ClearContainerContext: function () {
                Rexbuilder_Util_Admin_Editor.$frameBuilder
                    .contents()
                    .find("[data-dragcontext-marker]")
                    .remove();
            },
            getElementName: function ($element) {
                return $element.prop('tagName');
            }
        };
    };

    var _init = function () {
        var $self = $("#rex-buttons-list");
        rexbutton_import_props = {
            $self: $self,
            $buttonList: $self.find(".button-list")
        };

        this.$buttonsStyle = $("#rexliveStyle-inline-css");
        _fixCustomStyleElement();

        _linkDraggable();
    };

    return {
        init: _init,
        updateButtonList: _updateButtonList,
        getActiveStyleSheet: _getActiveStyleSheet
    };
})(jQuery);