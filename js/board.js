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
    // this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue005/';
    // this.load.crossOrigin = 'anonymous';

    this.load.image('dot', 'assets/dot.png');
    this.load.image('tiles', 'assets/pacman-tiles.png');
    this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
    this.load.spritesheet('blinky', 'assets/blinky.png', 34, 34);
    this.load.spritesheet('pinky', 'assets/pinky.png', 34, 34);
    this.load.spritesheet('inky', 'assets/inky.png', 34, 34);
    this.load.spritesheet('clyde', 'assets/clyde.png', 34, 34);
    this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
  },

  create: function () {
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('pacman-tiles', 'tiles');

    this.layer = this.map.createLayer('Pacman');
    this.dots = this.add.physicsGroup();
    this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);

    this.dots.setAll('x', 6, false, false, 1);
    this.dots.setAll('y', 6, false, false, 1);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.map.setCollisionByExclusion([this.safetile], true, this.layer);
    player = new Player({ game: this });
    player.create();

    blinky = new Ghost({ game: this, spriteName: "blinky" });
    blinky.create();

    pinky = new Ghost({ game: this, spriteName: "pinky" });
    pinky.create();

    inky = new Ghost({ game: this, spriteName: "inky" });
    inky.create();

    clyde = new Ghost({ game: this, spriteName: "clyde" });
    clyde.create();
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
      player.turning = Phaser.NONE;
    }
  },

  update: function () {
    player.update();
    blinky.update();
    pinky.update();
    inky.update();
    clyde.update();

  }

};
