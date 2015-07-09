var Board = function(game) {
  this.map = null;
  this.layer = null;
  this.safetile = 14;
  this.teleportTile = 36;
  this.gridsize = 16;
  this.ghosts = [];
  this.score = 0;
};

Board.prototype = {
  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function() {
    this.load.image('dot', 'assets/dot.png');
    this.load.image('tiles', 'assets/pacman-tiles.png');
    this.load.spritesheet('pacman', 'assets/player.png', 32, 32);
    this.load.spritesheet('barriers', 'assets/barriers.png', 32, 32);
    this.load.spritesheet('blinky', 'assets/blinky.png', 34, 34);
    this.load.spritesheet('pinky', 'assets/pinky.png', 34, 34);
    this.load.spritesheet('inky', 'assets/inky.png', 34, 34);
    this.load.spritesheet('clyde', 'assets/clyde.png', 34, 34);
    this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.audio('pacman-chomp', 'assets/sound/pacman_chomp.wav');
    this.load.audio('pacman-beginning', 'assets/sound/pacman_beginning.wav');
    this.load.audio('death', 'assets/sound/pacman_death.wav');
  },

  create: function() {
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

    this.barriers = [new Barrier({ game: this, marker_x: 5, marker_y: 14, barrier_type: 0 }),
                     new Barrier({ game: this, marker_x: 23, marker_y: 14, barrier_type: 0 }),
                     new Barrier({ game: this, marker_x: 14, marker_y: 12.5, barrier_type: 1 })];

    this.barriers.forEach(function(barrier) {
      barrier.create();
    });

    this.barriers = this.barriers.map(function(barrier) {
      return barrier.sprite;
    });

    blinky = pinky = inky = clyde = false;

    setTimeout(function() {
      blinky = new Ghost({ game: this, spriteName: "blinky" });
      blinky.create();
      this.ghosts.push(blinky);
    }.bind(this), 4500);

    setTimeout(function() {
      pinky = new Ghost({ game: this, spriteName: "pinky" });
      pinky.create();
      this.ghosts.push(pinky);
    }.bind(this), 5500);

    setTimeout(function() {
      inky = new Ghost({ game: this, spriteName: "inky" });
      inky.create();
      this.ghosts.push(inky);
    }.bind(this), 6500);

    setTimeout(function() {
      clyde = new Ghost({ game: this, spriteName: "clyde" });
      clyde.create();
      this.ghosts.push(clyde);
      this.ghosts = this.ghosts.map(function(ghost) {
        return ghost.sprite;
      });
    }.bind(this), 7500);

    var style = { font: "18px Droid Sans", fill: "#fff", align: "center" };
    this.text = game.add.text(10, 500, "Score: " + this.score, style);
  },

  checkKeys: function() {
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

  update: function() {
    player.update();
    if (blinky) { blinky.update(); }
    if (pinky) { pinky.update(); }
    if (inky) { inky.update(); }
    if (clyde) { clyde.update(); }
  },
};
