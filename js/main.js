window.onload = function() {
    const game = new window.Phaser.Game(800, 600, window.Phaser.CANVAS, 'stage');

    game.state.add('state:loading', Game.Loading);
    game.state.add('state:start'  , Game.Start);
    game.state.add('state:play'   , Game.Play);
    game.state.add('state:over'   , Game.Over);

    game.state.start('state:loading');
};