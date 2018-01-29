/**
 *
 * @param {Phaser.Game} game
 * @constructor
 */
Game.Play = function (game) {

    this.WORLD_WIDTH = 3000;
    this.WORLD_HEIGHT = 3000;

    /** @type {Phaser.TileSprite} */
    this.background = null;

    /** @type {Player} */
    this.player = null;

    this.lifeIcon = null;
    this.scoreText = null;
    this.livesText = null;
    this.heatMeter = null;

    this.livesCount = 3;
    this.scoreCount = 0;

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

    },

    update: function () {
        this._handleInput();
        this.heatMeter.crop(new Phaser.Rectangle(0, 0, this.player.weapon.heat, this.heatMeter.height));
    },

    render: function () {
        // Game.scanlines(this.game);

        // let zone = this.game.camera.deadzone;
        // this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
        // this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
        // this.game.debug.cameraInfo(this.camera, 32, 64);
        // this.game.debug.spriteCoords(this.player, 32, 500);
        // this.game.debug.spriteInfo(this.player, 10, 64);
        // this.game.debug.pointer(this.input.activePointer)
    },

    /**
     *
     * @private
     */
    _loadLevel: function () {
        this._spawnActors();
        this._setCamera();
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
     * Set Head up display
     * @private
     */
    _buildHud: function () {

        this.hud = this.add.group();

        this.lifeIcon = this.make.image(0, 0, 'icon:life');
        this.livesText = this.make.text(this.lifeIcon.width, 0, 'x' + this.livesCount, {fill: '#ffffff'});

        this.scoreText = this.make.text(this.game.width / 2, 0, this.scoreCount.toString(), {fill: '#ffffff'});
        this.scoreText.anchor.set(0.5, 0);

        this.heatMeter = this.make.image(this.game.width * 5 / 6, 0, 'hud:heat-meter_inner');
        this.heatMeter.crop(new Phaser.Rectangle(0, 0, this.player.weapon.heat, this.heatMeter.height));
        let heatMeterContainer = this.make.image(this.game.width * 5 / 6, 0, 'hud:heat-meter_container');

        this.hud.add(this.lifeIcon);
        this.hud.add(this.livesText);
        this.hud.add(this.scoreText);
        this.hud.add(this.heatMeter);
        this.hud.add(heatMeterContainer);

        this.hud.fixedToCamera = true;
        this.hud.cameraOffset.set(10);
    },

    /**
     * Initialize Camera settings
     * @private
     */
    _setCamera: function() {
        this.camera.follow(this.player, null, 0.1, 0.1);
        this.camera.deadzone = new window.Phaser.Rectangle(
            this.game.width * 0.25,
            this.game.height * 0.25,
            this.game.width - this.game.width * 0.5,
            this.game.height - this.game.height * 0.5
        );
        this.camera.focusOnXY(this.world.centerX, this.world.centerY);
    },

    /**
     *
     * @private
     */
    _handleInput: function () {

        this.player.move(this.cursorKeys);

        if (this.input.activePointer.isDown) {
            this.player.throttle();
            this.player.shoot();
        } else {
            this.player.unThrottle();
        }
    }
};