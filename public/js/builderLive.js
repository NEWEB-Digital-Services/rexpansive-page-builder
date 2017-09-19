; (function ($) {
    'use strict';

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

    
    function dragFreeMoveListener(event) {
        console.log('moving item');
        var target = event.target;

        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        console.log(x + ' ' + y);
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
    // add a checkbox in the bottom of the elem
    function addCheckBox($elem) {
        var $input = document.createElement('input');
        var $labelBox = document.createElement('label');
        $($labelBox).text("aabbcc");
        $input.setAttribute('type', 'checkbox');
        $input.setAttribute('id', 'tableDrag');
        $input.setAttribute('checked', 'checked');
        $($input).on('click', function () {
            $('.draggable').each(function () {
                interact(this).unset();
                console.log('removing listeners');
            });

            if (this.checked == true) {
                console.log('first type');
                $('.draggable').each(function () {
                    var x = 0;
                    var y = 0;
                    var $w = $(this.parentNode).width();
                    $w = Math.round($w / 12);
                    interact(this)
                        .draggable({
                            snap: {
                                targets: [
                                    interact.createSnapGrid({ x: $w, y: $w })
                                ],
                                range: Infinity,
                                relativePoints: [{ x: 0, y: 0 }]
                            },
                            inertia: true,
                            restrict: {
                                restriction: this.parentNode,
                                elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                                endOnly: true
                            }
                        })
                        .on('dragmove', function (event) {
                            console.log('check');
                            x += event.dx;
                            y += event.dy;

                            event.target.style.webkitTransform =
                                event.target.style.transform =
                                'translate(' + x + 'px, ' + y + 'px)';
                        });
                }, this);
                
            } else {
                console.log('second type');
                interact('.draggable')
                    .draggable({
                        // enable inertial throwing
                        inertia: true,
                        // keep the element within the area of it's parent
                        restrict: {
                            restriction: "parent",
                            endOnly: true,
                            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                        },
                        // enable autoScroll
                        autoScroll: true,

                        // call this function on every dragmove event
                        onmove: dragFreeMoveListener,
                        // call this function on every dragend event
                        onend: function (event) {
                            console.log('Ended drag');
                        }
                    });
            }
        });
        var $div = document.createElement('div');
        $div.setAttribute('class', 'test');
        $div.appendChild($labelBox);
        $div.appendChild($input);
        $elem.appendChild($div);
    }

    $(function () {
        $();
        $('.perfect-grid-item').each(function () {
            prepareElem(this);
        });
        addCheckBox($('.entry-content')[0]);
        //addResizers();


    }); // DOM Ready

    $(window).load(function () {
        ;
    }); // Entire content loaded

})(jQuery);