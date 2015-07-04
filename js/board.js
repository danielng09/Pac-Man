var Board = function (game) {
  this.map = null;
  this.layer = null;
  this.safetile = 14;
  this.teleportTile = 36;
  this.gridsize = 16;
};

Board.prototype = {
  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.image('dot', 'assets/dot.png');
    this.load.image('tiles', 'assets/pacman-tiles.png');
    this.load.spritesheet('pacman', 'assets/pacman-3.png', 32, 32);
    this.load.spritesheet('barriers', 'assets/barriers.png', 32, 32);
    this.load.spritesheet('blinky', 'assets/blinky.png', 34, 34);
    this.load.spritesheet('pinky', 'assets/pinky.png', 34, 34);
    this.load.spritesheet('inky', 'assets/inky.png', 34, 34);
    this.load.spritesheet('clyde', 'assets/clyde.png', 34, 34);
    this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.audio('pacman-chomp', 'assets/sound/pacman_chomp.wav');
    this.load.audio('pacman-beginning', 'assets/sound/pacman_beginning.wav');
  },

  create: function () {
    this.beginSound = game.add.audio('pacman-beginning');
    this.beginSound.play();

    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('pacman-tiles', 'tiles');


    this.layer = this.map.createLayer('Pacman');
    this.dots = this.add.physicsGroup();
    this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);

    this.dots.setAll('x', 6, false, false, 1);
    this.dots.setAll('y', 6, false, false, 1);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.map.setCollisionByExclusion([this.safetile, this.teleportTile], true, this.layer);
    player = new Player({ game: this });
    player.create();

    this.barrier = new Barrier({ game: this, marker_x: 5, marker_y: 14, barrier_type: 0 });
    this.barrier.create();

    this.barrier2 = new Barrier({ game: this, marker_x: 23, marker_y: 14, barrier_type: 0 });
    this.barrier2.create();

    this.barrier3 = new Barrier({ game: this, marker_x: 14, marker_y: 12.5, barrier_type: 1 });
    this.barrier3.create();

    blinky = pinky = inky = clyde = false;

    blinky = new Ghost({ game: this, spriteName: "blinky" });
    blinky.create();

    setTimeout(function() {
      pinky = new Ghost({ game: this, spriteName: "pinky" });
      pinky.create();
    }.bind(this), 1000);
    setTimeout(function() {
      inky = new Ghost({ game: this, spriteName: "inky" });
      inky.create();
    }.bind(this), 2000);
    setTimeout(function() {
      clyde = new Ghost({ game: this, spriteName: "clyde" });
      clyde.create();
    }.bind(this), 3000);
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
    if (blinky) { blinky.update(); }
    if (pinky) { pinky.update(); }
    if (inky) { inky.update(); }
    if (clyde) { clyde.update(); }
  },

};
