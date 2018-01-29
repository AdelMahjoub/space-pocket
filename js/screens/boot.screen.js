const Game = {};

/**
 * @type {Phaser.State}
 * @param {Phaser.Game} game
 * @constructor
 */
Game.Boot = function (game) {

};

Game.Boot.prototype = {

    init: function() {
        this._fontHack();
    },

    preload: function () {

    },

    create: function () {

        this.state.start('screen:load');
    },

    _fontHack: function() {
        this.add.text(0, 0, "hack", {font:"1px kenvector", fill:"#FFFFFF"});
    }
};

/**
 *
 * @param {Phaser.Game} game
 */
Game.scanlines = function(game) {
    game.context.fillStyle = 'rgba(0, 0, 0, 0.6)';

    for (let y = 0; y < game.height; y += 2)
    {
        game.context.fillRect(0, y, game.width, 1);
    }
};