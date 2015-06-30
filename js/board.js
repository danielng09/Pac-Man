if (window.Pacman === undefined) {
  window.Pacman = {};
}

var game = Pacman.game = new Phaser.Game(448, 496, Phaser.AUTO);

var Board = function (game) {
  this.map = null;
  this.layer = null;
  this.safetile = 14;
  this.gridsize = 16;
};

Board.prototype = {
  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue005/';
    this.load.crossOrigin = 'anonymous';

    this.load.image('dot', 'assets/dot.png');
    this.load.image('tiles', 'assets/pacman-tiles.png');
    this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
    this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
  },

  create: function () {
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('pacman-tiles', 'tiles');

    this.layer = this.map.createLayer('Pacman');
    this.dots = this.add.physicsGroup();
    this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);

    //  The dots will need to be offset by 6px to put them back in the middle of the grid
    this.dots.setAll('x', 6, false, false, 1);
    this.dots.setAll('y', 6, false, false, 1);

    this.cursors = this.input.keyboard.createCursorKeys();
    //  Pacman should collide with everything except the safe tile
    //  Safe tiles are valid spaces pacman can move through
    this.map.setCollisionByExclusion([this.safetile], true, this.layer);
    player = new Player({
      game: this,
    });

    player.create();
  },

  checkKeys: function () {
    if (this.cursors.left.isDown && player.current !== Phaser.LEFT) {
        player.checkDirection(Phaser.LEFT);
    } else if (this.cursors.right.isDown && player.current !== Phaser.RIGHT) {
        player.checkDirection(Phaser.RIGHT);
    } else if (this.cursors.up.isDown && player.current !== Phaser.UP) {
        player.checkDirection(Phaser.UP);
    } else if (this.cursors.down.isDown && player.current !== Phaser.DOWN) {
        player.checkDirection(Phaser.DOWN);
    } else {
        //  This forces them to hold the key down to turn the corner
        player.turning = Phaser.NONE;
    }
  },

  update: function () {
    player.update();
  }

};

game.state.add('Game', Board, true);
