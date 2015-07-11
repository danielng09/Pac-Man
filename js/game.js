var game = new Phaser.Game(448, 530, Phaser.AUTO, 'parent');
//496
var board = new Board(game);

game.state.add('Game', board, true);
