Game.Start = function(game) {

    /** @type {Phaser.Text} */
    this.welcomeText = null;

    this.welcomeString = 'Press [Enter] to Start';
};

Game.Start.prototype = {
    init: function() {
        this._loadStartScreen();
    },

    update: function() {
        this._handleInput();
    },

    render: function() {
        Game.scanlines(this.game);
    },

    /**
     *
     * @private
     */
    _loadStartScreen: function() {
        this._spawnBackground();
        this._spawnText();

        this.keys = this.input.keyboard.addKeys({
            enter: window.Phaser.KeyCode.ENTER
        });
    },

    /**
     *
     * @private
     */
    _spawnBackground: function() {
        this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg:purple');
    },

    /**
     *
     * @private
     */
    _spawnText: function() {

        const textOptions = {
            x: this.world.width / 2,
            y: this.world.height / 2,
            style: {
                fill: '#ffffff'
            }
        };

        this.welcomeText = this.add.text(textOptions.x, textOptions.y, this.welcomeString, textOptions.style);
        this.welcomeText.anchor.set(0.5, 0.5);
    },

    _handleInput: function() {
        if(this.keys.enter.isDown) {
            this.state.start('state:play');
        }
    }
};