
var Rexbuilder_Util_Admin_Editor = (function ($) {
    'use strict';

    var updateGroups = function (selectedlayouts, oldGroups) {

        var layout;
        var newGroup = [];
        var newGroups = [];
        var flag = true;
        var index;

        //removing layouts from old groups
        $.each(selectedlayouts, function (i, e) {
            layout = e.name;
            $.each(oldGroups, function (i, oldGroup) {
                if (flag) {
                    index = oldGroup.indexOf(layout);
                    if (index > -1) {
                        flag = false;
                        oldGroup.splice(index, 1);
                    }
                }
            });
            flag = true;
        });

        //creating new group
        $.each(selectedlayouts, function (i, layout) {
            newGroup.push(layout.name);
        });

        //creating new groups
        $.each(oldGroups, function (i, oldGroup) {
            if (oldGroup.length != 0) {
                newGroups.push(oldGroup);
            }
        });
        newGroups.push(newGroup);

        return newGroups;
    }

    var updateLayouts = function (selectedlayouts, oldLayouts) {
        var availableLayouts = [];
        var selectedLayout;
        var oldLayout;

        $.each(selectedlayouts, function (i, l) {
            selectedLayout = l;
            $.each(oldLayouts, function (i, ol) {
                oldLayout = ol;
                if (selectedLayout.name == oldLayout[0]) {
                    if (selectedLayout.minWidth != oldLayout[1]) {
                        oldLayout[1] = selectedLayout.minWidth;
                    }
                    if (selectedLayout.maxWidth != oldLayout[2]) {
                        oldLayout[2] = selectedLayout.maxWidth;
                    }
                    selectedLayout.presente = true;
                }
            });
        });
        $.each(oldLayouts, function (i, l) {
            availableLayouts.push(l);
        });

        $.each(selectedlayouts, function (i, l) {
            if (!l.presente) {
                var newL = [];
                newL.push(l.name);
                newL.push(l.minWidth);
                newL.push(l.maxWidth);
                availableLayouts.push(newL);
            }
        });

        return availableLayouts;
    }

    var addResponsiveListeners = function () {
        console.log("adding listeners");
        var $frameContainer = $(".rexpansive-live-frame-container");
        var $frameBuilder = $("#rexpansive-live-frame");
        var $responsiveToolbar = $(".rexlive-responsive-toolbox");

        $(document).on('click', '.btn-builder-layout', function (e) {
            var $btn = $(e.target);
            var btnName = $btn.data("name");
            var $layoutData = $("#rexbuilder-layout-data-backend");
            var groups = JSON.parse($layoutData.children(".groups").text());
            var layoutGroup = -1;

            $.each(groups, function (i, group) {
                if (group.indexOf(btnName) > -1) {
                    layoutGroup = i;
                }
            });

            $responsiveToolbar.find("input[value=" + btnName + "]").prop('checked', true);

            $.each(groups, function (currentGroup, group) {
                $.each(group, function (i, name) {
                    if (layoutGroup != -1 && currentGroup == layoutGroup) {
                        $responsiveToolbar.find("input[value=" + name + "]").prop('checked', true);
                    } else {
                        if (name != btnName) {
                            $responsiveToolbar.find("input[value=" + name + "]").prop('checked', false);
                        }
                    }
                });
            });

            $frameBuilder.remove();
            if ($btn.data("min-width") != "") {
                $frameContainer.css("max-width", $btn.data("min-width"));
            } else {
                $frameContainer.css("width", "100%");
            }

            var frameDiv = document.createElement("iframe");
            var $frameDiv = $(frameDiv);

            $frameDiv.attr({
                src: source_url + "?layout=" + btnName + "&editor=true",
                allowfullscreen: "1"
            });

            $frameDiv.css({
                "width": "100%",
                "height": "100%",
            });

            $frameBuilder = $frameDiv;
            $frameContainer.append($frameDiv);
        });

        $(document).on('click', '.btn-save', function (e) {
            console.log("saving");
            var checkboxSelected = [];
            var $layoutData = $("#rexbuilder-layout-data-backend");

            $responsiveToolbar.find("input[name=device]:checked").each(function (i, checkbox) {
                var $checkbox = $(checkbox);
                checkboxSelected.push({
                    name: checkbox.value,
                    minWidth: $checkbox.data("min-width"),
                    maxWidth: $checkbox.data("max-width")
                });
            });

            var oldGroups = JSON.parse($layoutData.children(".groups").text());
            var oldLayouts = JSON.parse($layoutData.children(".available-layouts").text());

            var updatedGroups = updateGroups(checkboxSelected, oldGroups);
            var updatedLayouts = updateLayouts(checkboxSelected, oldLayouts);

            $layoutData.children(".groups").text(JSON.stringify(updatedGroups));
            $layoutData.children(".available-layouts").text(JSON.stringify(updatedLayouts));

            var infos = {
                selected: checkboxSelected,
                eventName: "rexlive:save",
                updatedGroups: updatedGroups,
                updatedLayouts: updatedLayouts,
                rexliveEvent: true
            };

            var frame = $frameBuilder[0].contentWindow;

            frame.postMessage(infos, '*');
        });

        $(document).on('click', '.btn-undo', function (e) {
            console.log("undo");
            var infos = {
                eventName: "rexlive:undo",
                rexliveEvent: true
            };

            var frame = $frameBuilder[0].contentWindow;

            frame.postMessage(infos, '*');
        });

        $(document).on('click', '.btn-redo', function (e) {
            console.log("redo");
            var infos = {
                eventName: "rexlive:redo",
                rexliveEvent: true
            };

            var frame = $frameBuilder[0].contentWindow;

            frame.postMessage(infos, '*');
        });
    }

    // init the utilities
    var init = function () {

    }

    return {
        addResponsiveListeners: addResponsiveListeners
    };

})(jQuery);