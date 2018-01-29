Game.Start = function(game) {

    this.data = null;

    this.buttons = {
        start: null,
        options: null,
        credits: null
    };

    this.sfx = {
        buttons: {
            hover: null,
            click: null
        }
    };

    this.textStyles = {
        title: {

        },
        buttons: {
            primary: {
                font: '24px kenvector',
                fill: '#FFFFFF'
            },
            secondary: {
                font: '16px kenvector',
                fill: '#FFFFFF'
            }
        }
    };
};

Game.Start.prototype = {

    init: function() {

    },

    preload: function() {

    },

    create: function() {
        this.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg:purple');

        this.sfx.buttons.hover = this.add.audio('sfx:btn-hover');
        this.sfx.buttons.click = this.add.audio('sfx:btn-click');

        this._buildStartMenu();
    },

    update: function() {

    },

    render: function() {

    },

    _buildStartMenu : function() {

        this.buttons.start = this._createBtn(
            {x: this.world.centerX, y: this.world.centerY},
            'ui:buttons',
            this._start,
            {hover: 1, out: 0, click: 2},
            {btn: {x: 0.5, y: 0.5}, text: {x: 0.5, y: 0.5}},
            {x:1, y: 1},
            'start',
            this.textStyles.buttons.primary
        );

        this.buttons.options = this._createBtn(
            {x: this.buttons.start.x, y: this.buttons.start.y + this.buttons.start.height},
            'ui:buttons',
            this._options,
            {hover: 4, out: 3, click: 5},
            {btn: {x: 0.5, y: 0}, text: {x: 0.5, y: 0.5}},
            {x:1, y: 0.7},
            'options',
            this.textStyles.buttons.secondary
        );

        this.buttons.credits = this._createBtn(
            {x: this.buttons.options.x, y: this.buttons.options.y + this.buttons.options.height},
            'ui:buttons',
            this._credits(),
            {hover: 4, out: 3, click: 5},
            {btn: {x: 0.5, y: -0.5}, text: {x: 0.5, y: 0.5}},
            {x:1, y: 0.7},
            'credits',
            this.textStyles.buttons.secondary
        );

    },

    _start: function() {
        this.state.start('screen:play');
    },

    _options: function() {

    },

    _credits: function() {

    },

    /**
     *
     * @param {{x: number, y: number}} coords
     * @param {string} key
     * @param {object} cb
     * @param {{hover: number, out: number, click: number}} frames
     * @param {{btn: {x: number, y: number}, text: {x: number, y: number}}} anchors
     * @param {{x: number, y: number}}scale
     * @param {string} text
     * @param {object} style
     * @private
     */
    _createBtn: function(coords, key, cb, frames, anchors, scale, text, style) {

        const btn = this.add.button(coords.x, coords.y, key, cb, this, frames.hover, frames.out, frames.click);
        btn.anchor.set(anchors.btn.x, anchors.btn.y);
        btn.scale.set(scale.x, scale.y);

        const btnText = this.add.text(btn.centerX, btn.centerY, text, style);
        btnText.anchor.set(anchors.text.x, anchors.text.y);

        btn.events.onInputDown.add(function() {
            btnText.y += 4;
            this.sfx.buttons.click.play();
        }, this);

        btn.events.onInputUp.add(function() {
            btnText.y -= 4;
        }, this);

        btn.events.onInputOver.add(function() {
            this.sfx.buttons.hover.play();
        }, this);

        return btn;
    }

};