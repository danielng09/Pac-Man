var game = new Phaser.Game(448, 496, Phaser.AUTO, 'parent');

var board = new Board(game);

game.state.add('Game', board, true);
