/**
 *
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Player(game, x, y) {
    window.Phaser.Sprite.call(this, game, x, y, 'player:ship');

    this.canon = null;
    this.weapon = null;
    this.speed = Player.MAX_SPEED;

    this._init();
}

Player.MAX_SPEED = 400;

/** @type {window.Phaser.Sprite} */
Player.prototype = Object.create(window.Phaser.Sprite.prototype);

/** @type {Player} */
Player.prototype.constructor = Player;

/**
 *
 * @param {object} directions
 */
Player.prototype.move = function(directions) {
    this.body.velocity.x = directions.left.isDown ? -this.speed : directions.right.isDown ? this.speed : 0;
    this.body.velocity.y = directions.up.isDown ? -this.speed : directions.down.isDown ? this.speed : 0;

    this.rotation = this.game.physics.arcade.angleToPointer(this);
    this.angle += 90;

    this._alignCanon();
};

Player.prototype.shoot = function() {
    this.weapon.trackedSprite = this.canon;
    this.weapon.fireAngle = this.angle - 90;
    this.weapon.fire();
};

Player.prototype.throttle = function() {
    this.speed = Player.MAX_SPEED / 2;
};

Player.prototype.unThrottle = function() {
    this.speed = Player.MAX_SPEED;
};

/**
 *
 * @private
 */
Player.prototype._alignCanon = function() {
    this.canon.alignIn(this, window.Phaser.CENTER);
    this.canon.angle = this.angle;
};

/**
 *
 * @private
 */
Player.prototype._init = function() {
    this._initSelf();
    this._initCanon();
    this._initWeapon();
};

/**
 *
 * @private
 */
Player.prototype._initSelf = function() {
    this.frame = 0;
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 0.5);
    this.angle = 0;
};

/**
 * Initialize canon sprite
 * tracked by the weapon group to align bullets angle
 * @private
 */
Player.prototype._initCanon = function() {
    let box = this.game.make.graphics(0, 0);

    box.lineStyle(8, 0xFF0000, 0.8);
    box.beginFill(0xFF700B, 1);
    box.drawRect(-50, -50, 10, 10);
    box.endFill();

    this.canon = this.game.add.sprite(0, 0, box.generateTexture());
    this.canon.anchor.set(0.5);
    this.canon.alignIn(this, window.Phaser.CENTER);
    this.canon.angle = this.angle;
    this.canon.pivot.y = this.height;
    // this.canon.alpha = 0;
};

/**
 * Initialize weapon group
 * @private
 */
Player.prototype._initWeapon = function() {
    this.weapon = this.game.add.weapon(64, 'bullet:laser-green');
    this.weapon.enableBody = true;
    this.weapon.bulletSpeed = 800;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.fireRate = 200;
};