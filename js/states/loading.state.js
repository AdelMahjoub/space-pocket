const Game = {};

/**
 * @type {Phaser.State}
 * @param {Phaser.Game} game
 * @constructor
 */
Game.Loading = function (game) {

    /**  @type {Phaser.Text} */
    this.loadingText = null;

};

Game.Loading.prototype = {

    init: function () {
        this._spawnLoadingText();
    },

    preload: function () {

        this.load.path = 'images/';
        this.load.image('bg:purple', 'Background/backgroundColor.png');
        this.load.image('bg:stars', 'Background/starBackground.png');

        this.load.image('icon:life','life.png');

        this.load.image('bullet:laser-green', 'laserGreen.png');
        this.load.image('bullet:laser-red', 'laserRed.png');

        this.load.image('effect:laser-green', 'laserGreenShot.png');
        this.load.image('effect:laser-red', 'laserRedShot.png');

        this.load.image('player:ship', 'player.png');

        this.load.image('enemy:ship', 'enemyShip.png');
        this.load.image('enemy:ufo', 'enemyUFO.png');

        this.load.onFileComplete.add(this._fileLoaded, this);
    },

    create: function () {
        this.state.start('state:start');
    },

    /**
     *
     * @param {number} progress
     * @private
     */
    _fileLoaded: function(progress) {
        this.loadingText.text = 'Loading ' + progress + '%';
    },

    /**
     *
     * @private
     */
    _spawnLoadingText: function() {
        const textOptions = {
            x: this.world.width / 2,
            y: this.world.height / 2,
            style: {
                fill: '#ffffff'
            }
        };
        this.loadingText = this.add.text(textOptions.x, textOptions.y, 'Loading 0%', textOptions.style);
        this.loadingText.anchor.set(0.5, 0.5);
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