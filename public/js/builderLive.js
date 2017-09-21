; (function ($) {
    'use strict';
    //If true table is split in 12 columns | if false table is split in width columns
    var $modeMatrix = true;

    function prepareMatrix($matrix, $rows, $columns) {
        var $i, $j;
        var $k = 1;
        for ($i = 0; $i < $rows; $i++) {
            for ($j = 0; $j < $columns; $j++) {
                $matrix[$i][$j] = $k.toString();
                $k++;
            }
        }
    }

    function create2DMatrix(rows) {
        var arr = [];

        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }

        return arr;
    }

    function fillMatrix($matrix) {
        $('.perfect-grid-item').each(function () {
            var $i, $j;
            var $x = parseInt(this['attributes']['data-col'].value),
                $columns = parseInt(this['attributes']['data-width'].value),
                $y = parseInt(this['attributes']['data-row'].value),
                $rows = parseInt(this['attributes']['data-height'].value);
            $x -= 1;
            $y -= 1;
            if (!$modeMatrix) {
                $x *= 12;
                $columns *= 12;
                $y *= 12;
                $rows *= 12;
            };
            var $startX = $x;
            var $endX = $startX + $columns;
            var $startY = $y;
            var $endY = $startY + $rows;
            for ($i = $startY; $i < $endY; $i++) {
                for ($j = $startX; $j < $endX; $j++) {
                    $matrix[$i][$j] = this['attributes']['id'].value;
                }
            }
        });
    }

    function createMatrix($elem) {
        //console.log($elem);
        var $elemWidth = $($elem).width();
        var $elemHeight = $($elem).height();
        var $cellSide;
        var $rows;
        var $columns;
        if ($modeMatrix) {
            $cellSide = Math.round($elemWidth / 12);
        } else {
            $cellSide = 1;
        }
        $rows = Math.floor($elemHeight / $cellSide);
        $columns = Math.floor($elemWidth / $cellSide);
        store.set("matrix", {
            "properties": [
                {
                    "total width": $elemWidth
                },
                {
                    "total height": $elemHeight
                },
                {
                    "cell side": $cellSide
                },
                {
                    "rows": $rows
                },
                {
                    "columns": $columns
                }
            ]
        });

        var $matrix = create2DMatrix($rows);
        prepareMatrix($matrix, $rows, $columns);
        fillMatrix($matrix);
        //console.log($matrix);
        return $matrix;
    }
    /*
    Codice per muovere liberamente gli oggetti nella matrice:
    this.options.drag.snap.targets = [
        interact.createSnapGrid({
            x :  <new value>,
            y : <new value>
        })
        ];
    */
    var $dragType = false;


    function prepareElem($elem) {
        // adding draggable property to the elem
        $elem.className += " draggable";

        // Saving current properties of the item
        store.set($elem['id'], {
            "properties": [
                {
                    "x": $elem['attributes']['data-row'].value
                },
                {
                    "y": $elem['attributes']['data-col'].value
                },
                {
                    "w": $elem['attributes']['data-width'].value
                },
                {
                    "h": $elem['attributes']['data-height'].value
                }
            ]
        });
        // adding handles to the elem
        addHandles($elem);
    }

    function makeDraggable() {
        $('.draggable').each(function () {
            var $w = $(this.parentNode).width();
            var $h = $(this.parentNode).height();
            console.log("w: " + $w + " h: " + $h);
            var $wcell = Math.round($w / 12);
            console.log("wcell: " + $wcell);
            var $x = 0;
            var $y = 0;
            var $grid = interact.createSnapGrid({ x: $wcell, y: $wcell });
            console.log($grid);
            interact(this).draggable({
                snap: {
                    targets: [
                        $grid
                    ],
                    range: Infinity,
                    relativePoints: [{ x: 0, y: 0 }],
                },
                inertia: true,
                restrict: {
                    restriction: "parent",
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true
                },
                onmove: function ($event) {
                    console.log('moving item');
                    var $target = $event.target;

                    // keep the dragged position in the data-x/data-y attributes
                    $x += $event.dx;
                    $y += $event.dy;
                    console.log("x: " + $x + " $y: " + $y);
                    // translate the element
                    $target.style.webkitTransform =
                        $target.style.transform =
                        'translate(' + $x + 'px, ' + $y + 'px)';
                },
                onend: function ($event) {
                    console.log('Ended drag');
                }
            })
        });
    }

    function addHandles($elem) {
        var $handles = [];
        for (var $i = 0; $i < 8; $i++) {
            $handles[$i] = document.createElement('span');
        }
        $handles[0].setAttribute('class', 'handle top-left');
        $handles[1].setAttribute('class', 'handle top-center');
        $handles[2].setAttribute('class', 'handle top-right');
        $handles[3].setAttribute('class', 'handle mid-left');
        $handles[4].setAttribute('class', 'handle mid-right');
        $handles[5].setAttribute('class', 'handle bottom-left');
        $handles[6].setAttribute('class', 'handle bottom-center');
        $handles[7].setAttribute('class', 'handle bottom-right');

        // Appending span elements to the current elem
        for (var $i = 0; $i < 8; $i++) {
            $('#' + $elem['id']).append($handles[$i]);
        }
    }

    function addResizers() {
        $(document).on('click', '.top-left', function () {
            console.log('1');
            if (store.get()) {

            }
            console.log(this.parentNode);
        });
        $(document).on('click', '.top-center', function () {
            console.log('2');
            console.log(this.parentNode);
        });
        $(document).on('click', '.top-right', function () {
            console.log('3');
            console.log(this.parentNode);
        });
        $(document).on('click', '.mid-left', function () {
            console.log('4');
            console.log(this.parentNode);
        });
        $(document).on('click', '.mid-right', function () {
            console.log('5');
            console.log(this.parentNode);
        });
        $(document).on('click', '.bottom-left', function () {
            console.log('6');
            console.log(this.parentNode);
        });
        $(document).on('click', '.bottom-center', function () {
            console.log('7');
            console.log(this.parentNode);
        });
        $(document).on('click', '.bottom-right', function () {
            console.log('8');
            console.log(this.parentNode);
        });
    }

    function addToolBox($elem) {
        var $div = document.createElement("div");
        $div.setAttribute("id", "toolBox");
        addCheckBox($div);
        $elem.appendChild($div);
    }
    // add a checkbox in the bottom of the elem
    function addCheckBox($elem) {
        var $input = document.createElement('input');
        var $labelBox = document.createElement('label');
        $($labelBox).text("aabbcc");
        $input.setAttribute('type', 'checkbox');
        $input.setAttribute('id', 'tableDrag');
        //$input.setAttribute('checked', 'false');

        $($input).on('click', function () {
            if (this.checked == true) {
                console.log('first type');
                $dragType = true;
            } else {
                console.log('second type');
                $dragType = false;
            }
        });

        var $div = document.createElement('div');
        $div.setAttribute('id', 'dragging-mode');
        $div.appendChild($labelBox);
        $div.appendChild($input);
        $elem.appendChild($div);
    }

    $(function () {
        $('.perfect-grid-item').each(function () {
            prepareElem(this);
        });
        addToolBox($('.entry-content')[0]);
        createMatrix($('.entry-content')[0]);

        //makeDraggable();
        //addResizers();


    }); // DOM Ready

    $(window).load(function () {
        var $item = $('#block_0_7');
        console.log($item);
        $item.draggable();
        $item.resizable();
        $().each();
            /*{
                drag: function () {
                    var $offset = $(this).offset();
                    var $xPos = $offset.left;
                    var $yPos = $offset.top;
                    console.log($xPos);
                    console.log($yPos);
                }
            });
            */
    }); // Entire content loaded

})(jQuery);