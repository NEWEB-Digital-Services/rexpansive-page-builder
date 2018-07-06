var VimeoVideo = (function ($) {
    'use strict';

    var $vimeoSectionVideos = null;
    var $vimeoBlockVideos = null;

    var _initObjects = function () {
        $vimeoSectionVideos = Rexbuilder_Util.$rexContainer.find('.rex-video-vimeo-wrap--section');
        $vimeoBlockVideos = Rexbuilder_Util.$rexContainer.find('.rex-video-vimeo-wrap--block');
    };

    /**
     *  init videos for a section
     *  always muted
     */
    var _initSectionVideos = function () {
        // check if exists
        if ($vimeoSectionVideos.length > 0) {
            // cycle foreach section
            $vimeoSectionVideos.each(function (i, el) {
                // mute videos on section
                var video = $(el).find('iframe')[0];
                if ("undefined" != typeof Vimeo) {
                    var player = new Vimeo.Player(video);
                    player.ready().then(function () {
                        player.setVolume(0);
                    });
                }
            });
        }
    };

    /**
     * Initi videos for a block
     * user can set if video has or not audio
     * @param {jQuery Object} reference 
     */
    var _initBlockVideos = function (reference) {
        var VimeoObj = reference;
        if ($vimeoBlockVideos.length > 0) {
            // cycle foreach section
            $vimeoBlockVideos.each(function (i, el) {
                // mute videos on block if set to do that
                var mute = $(el).attr('data-vimeo-video-mute');
                var video = $(el).find('iframe')[0];
                if ("undefined" != typeof Vimeo) {
                    VimeoObj.addPlayer(mute, video);
                }
            });
        }
    };

    /**
     * 
     * @param {string} mute
     * @param {iframe} video iframe to link
     */
    var _addPlayer = function (mute, video) {
        var player = new Vimeo.Player(video);
        if ("1" == mute) {
            // set to mute -> videos remain mute
            player.ready().then(function () {
                player.setVolume(0);
            });
        }
        // save info to later use -> videos can change audio state
        var video_block = {
            el: video,
            player: player
        };
        this.blockVideos.push(video_block);
    };

    /**
     * finding the player relative to the iframe passed
     * searching in the array of players
     * @param {DOM object} el 
     */
    var _findVideo = function (el) {
        for (var i = 0; i < this.blockVideos.length; i++) {
            if (this.blockVideos[i].el === el) {
                return this.blockVideos[i].player;
            }
        }
        return null;
    };

    var _removePlayer = function (el) {
        var playerRemoved = false;
        var i;

        for (i = 0; i < this.blockVideos.length; i++) {
            if (this.blockVideos[i].el === el) {
                this.blockVideos[i].player.destroy().then(function () {
                    console.log("player destroyed");
                    // the player was destroyed
                }).catch(function (error) {
                    console.log(error);
                    // an error occurred
                });
                playerRemoved = true;
                break;
            }
        }

        if (playerRemoved) {
            this.blockVideos.splice(i, 1);
        }
        return;
    }
    /**
     * init function
     */
    var init = function () {
        this.blockVideos = [];
        _initObjects();
        _initSectionVideos();
        _initBlockVideos(this);
    };

    return {
        init: init,
        findVideo: _findVideo,
        initBlockVideos: _initBlockVideos,
        addPlayer: _addPlayer,
        removePlayer: _removePlayer
    }
})(jQuery);