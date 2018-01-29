/**
 *
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Player(game, x, y) {

    /** Call Phaser.Sprite Constructor */
    window.Phaser.Sprite.call(this, game, x, y, 'player:ship');

    /** Player ship sprite Maximum velocity */
    this.MAX_SPEED = 400;

    /** Player ship sprite is facing up */
    this.OFFSET_ANGLE = 90;

    /** Current velocity */
    this.speed = this.MAX_SPEED;

    /* ============================================================================================================== */
    /*                                       Player laser blaster                                                     */
    /* ============================================================================================================== */
    /** @type {Phaser.Weapon} */
    this.weapon = this.game.add.weapon(60, 'bullet:laser-green');

    /** @type {number} weapon heat value */
    this.weapon.heatLimit = 100;

    /** @type {number} weapon heat value */
    this.weapon.heat = 0;

    /** @type {boolean} true when the weapon overheat: firelimit reached*/
    this.weapon.isOverHeated = false;

    /* ============================================================================================================== */

    this._init();
}

/** @type {window.Phaser.Sprite} */
Player.prototype = Object.create(window.Phaser.Sprite.prototype);

/** @type {Player} */
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if(this.game.input.activePointer.isUp && this.weapon.heat > 0 && !this.weapon.isOverHeated) {
      this.weapon.heat -= 0.5;
  } else if(this.game.input.activePointer.isUp && this.weapon.heat > 0 && this.weapon.isOverHeated) {
      this.weapon.heat -= 0.2;
      if(this.weapon.heat <= 0) {
          this.weapon.isOverHeated = false;
      }
  }
};

/**
 *
 * @param {object} directions
 */
Player.prototype.move = function(directions) {

    let left = directions.left.isDown;
    let right = directions.right.isDown;
    let up = directions.up.isDown;
    let down = directions.down.isDown;

    let velocityX = left ? -this.speed : right ? this.speed : 0;
    let velocityY = up ? -this.speed : down ? this.speed : 0;

    this.body.velocity.set(velocityX, velocityY);

    let previouisAngle = this.previousRotation * 180 / Math.PI;
    let angle = right && up ? -45
        : right && down ? 45
            : left && up ? -135
                : left && down ? -225
                    : left ? -180
                        : right ? 0
                            : up ? -90
                                : down ? 90 : previouisAngle - this.OFFSET_ANGLE;

    this.angle = angle + this.OFFSET_ANGLE;

};

/**
 * Fire bullets
 */
Player.prototype.shoot = function() {

    if(!this.weapon.isOverHeated) {
        this.rotation = this.game.physics.arcade.angleToPointer(this) + this.OFFSET_ANGLE * Math.PI / 180;
        this.weapon.fireAngle = this.angle - this.OFFSET_ANGLE;
        this.weapon.fire();
    } else {
        console.log('weapon is overheated, wait for full cooldown !')
    }
};

/**
 * Decrease velocity
 */
Player.prototype.throttle = function() {
    this.speed = this.MAX_SPEED / 2;
};

/**
 * Reset velocity
 */
Player.prototype.unThrottle = function() {
    this.speed = this.MAX_SPEED;
};


/**
 *
 * @private
 */
Player.prototype._init = function() {
    this._initShip();
    this._initWeapon();
};

/**
 *
 * @private
 */
Player.prototype._initShip = function() {

    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 0.5);
    this.angle = 0;
};

/**
 *
 * @private
 */
Player.prototype._initWeapon = function() {

    this.weapon.enableBody = true;

    this.weapon.bulletSpeed = 700;
    this.weapon.bulletSpeedVariance = 20;

    this.weapon.fireRate = 100;
    this.weapon.fireRateVariance = 20;

    this.weapon.bulletAngleOffset = this.OFFSET_ANGLE;

    this.weapon.bulletAngleVariance = 4;

    this.weapon.trackedSprite = this;
    this.weapon.bulletKillType = window.Phaser.Weapon.KILL_CAMERA_BOUNDS;

    this.weapon.onFire.add(this._increaseWeaponHeat, this);

};

/**
 *
 * @private
 */
Player.prototype._increaseWeaponHeat = function() {
    if(!this.weapon.isOverHeated) {
        this.weapon.heat += 2;
        if(this.weapon.heat >= this.weapon.heatLimit) {
            this.weapon.isOverHeated = true;
        }
    }
};

