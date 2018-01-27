/**
 *
 * @param {Phaser.Game} game
 * @constructor
 */
Game.Play = function (game) {

    this.WORLD_WIDTH = 3000;
    this.WORLD_HEIGHT = 3000;

    this.background = null;

    /** @type {Player} */
    this.player = null;

    this.triesCount = 3;
    this.scoreCount = 0;
    this.killCount = 0;

    this.cursorKeys = null;
};

Game.Play.prototype = {

    init: function () {

        this.physics.startSystem(window.Phaser.Physics.ARCADE);
        this.cursorKeys = this.input.keyboard.createCursorKeys();

    },

    create: function () {

        this.world.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);

        this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg:stars');

        this._loadLevel();

        this.camera.follow(this.player, 0.1, 0.1);
        this.camera.deadzone = new window.Phaser.Rectangle(
            this.game.width * 0.12,
            this.game.height * 0.12,
            this.game.width - this.game.width * 0.24,
            this.game.height - this.game.height * 0.24
        );
        this.camera.focusOnXY(this.world.centerX, this.world.centerY);

    },

    update: function () {

        this._handleInput();
    },

    render: function () {
        Game.scanlines(this.game);

        let zone = this.game.camera.deadzone;

        this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
        this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);

        this.game.debug.cameraInfo(this.camera, 32, 64);
        this.game.debug.spriteCoords(this.player, 32, 500);
        // this.game.debug.spriteInfo(this.player, 10, 64);
        // this.game.debug.spriteInfo(this.player.canon, 10, 164);
        // this.game.debug.pointer(this.input.activePointer)
    },

    /**
     *
     * @private
     */
    _loadLevel: function () {
        this._spawnActors();
        this._buildHud();
    },

    /**
     *
     * @private
     */
    _spawnActors: function () {
        this.player = new Player(this.game, this.world.centerX, this.world.centerY);
        this.add.existing(this.player);

    },

    /**
     *
     * @private
     */
    _buildHud: function () {
        this.hud = this.add.group();
        this.hud.fixedToCamera = true;
        for (let i = 0; i < this.triesCount; i++) {
            let life = this.make.image(0, 0, 'icon:life');
            life.x = i * (life.width + 2);
            this.hud.add(life);
        }

        this.score = this.make.text(this.world.width / 2, 0, '0', {fill: '#ffffff'});
        this.score.anchor.set(0.5, 0);
        this.hud.add(this.score);
        this.hud.position.set(10, 10);
    },

    /**
     *
     * @private
     */
    _handleInput: function () {

        this.player.move(this.cursorKeys);

        if (this.input.activePointer.leftButton.isDown) {
            this.player.shoot();
            this.player.throttle();
        } else if (this.input.activePointer.leftButton.isUp) {
            this.player.unThrottle();
        }

    }
};