/**
 * @type {Phaser.State}
 * @param {Phaser.Game} game
 * @constructor
 */
Game.Load = function (game) {

    /**  @type {Phaser.Text} */
    this.loadingText = null;

};

Game.Load.prototype = {

    init: function () {
        this._spawnLoadingText();
    },

    preload: function () {

        this.load.path = 'assets/';

        this.load.image('bg:purple', 'backgrounds/purple.png');
        this.load.image('bg:stars', 'backgrounds/stars.png');

        this.load.image('icon:life','icons/life.png');

        this.load.image('bullet:laser-green', 'sprites/laserGreen.png');

        this.load.image('player:ship', 'sprites/player.png');

        this.load.image('hud:heat-meter_container', 'ui/heat-meter_container.png');
        this.load.image('hud:heat-meter_inner', 'ui/heat-meter_inner.png');

        this.load.spritesheet('ui:buttons', 'ui/buttons.png', 190, 50);

        this.load.audio('sfx:btn-hover', 'audio/btn_hover.ogg');
        this.load.audio('sfx:btn-click', 'audio/btn_click.ogg');

        this.load.onFileComplete.add(this._fileLoaded, this);
    },

    create: function () {
        this.state.start('screen:start_menu');
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