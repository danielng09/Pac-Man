var Player = function(options) {
  this.game = options.game;

  this.speed = 150;
  this.threshold = 5;

  this.marker = new Phaser.Point();
  this.turnPoint = new Phaser.Point();

  this.directions = [ null, null, null, null, null ];
  this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

  this.current = Phaser.NONE;
  this.turning = Phaser.NONE;
};

Player.prototype.create = function () {
  this.sprite = this.game.add.sprite((18 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
  this.sprite.anchor.set(0.5);
  this.sprite.animations.add('munch', [0, 1, 2, 1], 13, true);

  this.game.physics.arcade.enable(this.sprite);
  this.sprite.body.setSize(16, 16);

  this.sprite.play('munch');


  this.move(Phaser.LEFT);
};

Player.prototype.move = function (direction) {
  var speed = this.speed;
  if (direction === Phaser.LEFT || direction === Phaser.UP) {
      speed = -speed;
  }
  if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
    this.sprite.body.velocity.x = speed;
  } else {
    this.sprite.body.velocity.y = speed;
  }

  //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
  this.sprite.scale.x = 1;
  this.sprite.angle = 0;

  if (direction === Phaser.LEFT) {
    this.sprite.scale.x = -1;
  } else if (direction === Phaser.UP) {
    this.sprite.angle = 270;
  } else if (direction === Phaser.DOWN) {
    this.sprite.angle = 90;
  }

  this.current = direction;
};

Player.prototype.checkDirection = function (turnDir) {
  if (this.turning === turnDir || this.directions[turnDir] === null || this.directions[turnDir].index !== this.game.safetile) {
    //  Invalid direction if they're already set to turn that way
    //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
    return;
  }

  //  Check if they want to turn around and can
  if (this.current === this.opposites[turnDir]) {
    this.move(turnDir);
  } else {
    this.turning = turnDir;

    this.turnPoint.x = (this.marker.x * this.game.gridsize) + (this.game.gridsize / 2);
    this.turnPoint.y = (this.marker.y * this.game.gridsize) + (this.game.gridsize / 2);
  }
};

Player.prototype.turn = function () {
  var cx = Math.floor(this.sprite.x);
  var cy = Math.floor(this.sprite.y);

  //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
  if (!this.game.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.game.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
    return false;
  }

  //  Grid align before turning
  this.sprite.x = this.turnPoint.x;
  this.sprite.y = this.turnPoint.y;
  this.sprite.body.reset(this.turnPoint.x, this.turnPoint.y);
  this.move(this.turning);
  this.turning = Phaser.NONE;

  return true;
};

Player.prototype.eatDot = function (pacman, dot) {
  dot.kill();
  if (this.dots.total === 0) {
    this.dots.callAll('revive');
  }
};

Player.prototype.update = function () {
  this.game.physics.arcade.collide(this.sprite, this.game.layer);
  this.game.physics.arcade.overlap(this.sprite, this.game.dots, this.eatDot, null, this.game);

  this.marker.x = this.game.math.snapToFloor(Math.floor(this.sprite.x), this.game.gridsize) / this.game.gridsize;
  this.marker.y = this.game.math.snapToFloor(Math.floor(this.sprite.y), this.game.gridsize) / this.game.gridsize;

  //  Update our grid sensors
  this.directions[1] = this.game.map.getTileLeft(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[2] = this.game.map.getTileRight(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[3] = this.game.map.getTileAbove(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[4] = this.game.map.getTileBelow(this.game.layer.index, this.marker.x, this.marker.y);

  this.game.checkKeys();

  if (this.turning !== Phaser.NONE) {
    this.turn();
  }
};
