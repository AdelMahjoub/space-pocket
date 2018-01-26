/**
 *
 * @param {Phaser.Game} game
 * @constructor
 */
Game.Play = function(game) {

    this.background = null;
    this.player = null;

    this.triesCount = 3;
    this.scoreCount = 0;
    this.killCount = 0;

    this.cursorcursorKeys = null;
};

Game.Play.prototype = {

    init: function() {
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(window.Phaser.Physics.ARCADE);
        this.cursorKeys = this.input.keyboard.createCursorKeys();

    },

    preload: function() {

    },

    create: function() {
        this._loadLevel();
    },

    update: function() {

        this._handleInput();
        this.background.tilePosition.y += 1;
    },

    render: function() {
        Game.scanlines(this.game);

        this.game.debug.spriteInfo(this.player, 10, 64);
        this.game.debug.spriteInfo(this.player.canon, 10, 164);
        this.game.debug.pointer(this.input.activePointer)
    },

    /**
     *
     * @private
     */
    _loadLevel: function() {
        this._spawnBackground();
        this._spawnActors();
        this._buildHud();
    },

    /**
     *
     * @private
     */
    _spawnBackground: function() {
        this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg:stars');
    },

    /**
     *
     * @private
     */
    _spawnActors: function() {

        this.player = new Player(this.game, this.world.centerX, this.world.centerY);
        this.add.existing(this.player);

    },

    /**
     *
     * @private
     */
    _buildHud: function() {
        this.hud = this.add.group();

        for(let i = 0; i < this.triesCount; i++) {
            let life = this.make.image(0, 0, 'icon:life');
            life.x = i * (life.width + 2);
            this.hud.add(life);
        }

        this.score = this.make.text(this.world.width / 2, 0, '0', { fill: '#ffffff' });
        this.score.anchor.set(0.5, 0);
        this.hud.add(this.score);
        this.hud.position.set(10, 10);
    },

    /**
     *
     * @private
     */
    _handleInput: function() {

        this.player.move(this.cursorKeys);

        if(this.input.activePointer.leftButton.isDown) {
            this.player.shoot();
            this.player.throttle();
        } else if(this.input.activePointer.leftButton.isUp) {
            this.player.unThrottle();
        }

    }
};