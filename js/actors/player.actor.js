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

    /** @type {number} shots before weapon overheat */
    this.weapon.MAX_SHOTS_LIMIT = 100;

    this.weapon.fireLimit = this.weapon.MAX_SHOTS_LIMIT;

    /** @type {number} weapon heat value */
    this.weapon.heat = 0;

    /** @type {boolean} true when the weapon overheat: firelimit reached*/
    this.weapon.isOverHeated = false;

    /** @type {null|number} cooling setInterval timer */
    this.weapon.coolingTimer = null;

    /** @type {null|number} delay before cooling the weapon after overheat: setTimout timer */
    this.weapon.coolingDelayTimer = null;

    /* ============================================================================================================== */

    this._init();
}

/** @type {window.Phaser.Sprite} */
Player.prototype = Object.create(window.Phaser.Sprite.prototype);

/** @type {Player} */
Player.prototype.constructor = Player;

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
    this.game.input.onUp.add(this._handleWeaponHeat, this);
    this.weapon.onFireLimit.add(this._handleWeaponOverHeat, this);

};

/**
 *
 * @private
 */
Player.prototype._increaseWeaponHeat = function() {
    // Stop weapon cooldown if started
    if(this.weapon.coolingTimer) {
        window.clearInterval(this.weapon.coolingTimer);
        this.weapon.coolingTimer = null;
    }
    this.weapon.heat++;
    console.log('weapon is heating: ', this.weapon.heat);
};

/**
 * Cooldown heated (not overheated) weapon
 * @private
 */
Player.prototype._handleWeaponHeat = function() {
    // weapon not overheated and weapon cooldown not started
    if(!this.weapon.isOverHeated && !this.weapon.coolingTimer) {
        this.weapon.coolingTimer = this._cooldownWeapon(50);
    }
};

/**
 * Cooldown overheated weapon
 * @private
 */
Player.prototype._handleWeaponOverHeat = function() {
    this.weapon.isOverHeated = true;

    this.weapon.coolingDelayTimer = setTimeout(function() {
        this.weapon.coolingTimer = this._cooldownWeapon(100);
    }.bind(this), 1000);
};

/**
 * Gradually decrease weapon heat
 * @param {number} interval
 * @returns {number}
 * @private
 */
Player.prototype._cooldownWeapon = function(interval) {
    return setInterval(function() {
        this.weapon.heat--;
        this.weapon.resetShots(this.weapon.MAX_SHOTS_LIMIT - this.weapon.heat);
        console.log(this.weapon.isOverHeated ? 'cooling weapon after overheat' : 'cooling weapon ', this.weapon.heat);
        if(this.weapon.heat <= 0) {
            clearInterval(this.weapon.coolingTimer);
            this.weapon.isOverHeated = false;
            console.log(this.weapon.isOverHeated ? 'weapon cooled after overheat !' : 'weapon cooled !', this.weapon.heat);
        }
    }.bind(this), interval);
};
