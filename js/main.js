window.onload = function() {
    const game = new window.Phaser.Game(800, 600, window.Phaser.CANVAS, 'stage');

    game.state.add('screen:boot', Game.Boot);
    game.state.add('screen:load', Game.Load);
    game.state.add('screen:start_menu'  , Game.Start);
    game.state.add('screen:play'   , Game.Play);
    game.state.add('screen:over'   , Game.Over);

    game.state.start('screen:boot');
};