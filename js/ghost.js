var Ghost = function(options) {
  this.game = options.game;
  this.spriteName = options.spriteName;

  this.speed = 150;
  this.threshold = 5;

  this.marker = new Phaser.Point();
  this.turnPoint = new Phaser.Point();

  this.directions = [ null, null, null, null, null ];
  this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];

  this.current = Phaser.NONE;
  this.turning = Phaser.NONE;
};

Ghost.prototype.create = function () {
  this.sprite = this.game.add.sprite((13 * 16) + 8, (14 * 16) + 8, this.spriteName, 0);
  this.sprite.anchor.set(0.5);
  this.game.physics.arcade.enable(this.sprite);

  this.sprite.animations.add('moveLeft', [0,1], 15, true);
  this.sprite.animations.add('moveRight', [6,7], 15, true);
  this.sprite.animations.add('moveUp', [2,3], 15, true);
  this.sprite.animations.add('moveDown', [4,5], 15, true);

  this.sprite.body.setSize(16, 16, 0, 0);

  this.sprite.play('moveUp');

  this.move(Phaser.UP);
};

Ghost.prototype.move = function (direction) {
  var speed = this.speed;
  if (direction === Phaser.LEFT || direction === Phaser.UP) {
      speed = -speed;
  }
  if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
    this.sprite.body.velocity.x = speed;
  } else {
    this.sprite.body.velocity.y = speed;
  }

  this.current = direction;
};

Ghost.prototype.checkDirection = function (turnDir) {
  if (this.turning === turnDir || this.directions[turnDir] === null || this.directions[turnDir].index !== this.game.safetile) {
    //  Invalid direction if they're already set to turn that way
    //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
    return;
  }

  this.turning = turnDir;
  this.turnPoint.x = (this.marker.x * this.game.gridsize) + (this.game.gridsize / 2);
  this.turnPoint.y = (this.marker.y * this.game.gridsize) + (this.game.gridsize / 2);
};

Ghost.prototype.turn = function () {
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

Ghost.prototype.update = function () {
  this.game.physics.arcade.collide(this.sprite, this.game.layer, this.randomMove.bind(this));
  this.marker.x = this.game.math.snapToFloor(Math.floor(this.sprite.x), this.game.gridsize) / this.game.gridsize;
  this.marker.y = this.game.math.snapToFloor(Math.floor(this.sprite.y), this.game.gridsize) / this.game.gridsize;

  //  Update our grid sensors
  this.directions[1] = this.game.map.getTileLeft(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[2] = this.game.map.getTileRight(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[3] = this.game.map.getTileAbove(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[4] = this.game.map.getTileBelow(this.game.layer.index, this.marker.x, this.marker.y);

  if (this.turning !== Phaser.NONE) {
    this.turn();
  }
};

Ghost.prototype.randomMove = function () {
  var valid_moves = [];

  for (var t = 1; t < 5; t++) {
    if (this.directions[t] !== null && this.directions[t].index === this.game.safetile && t !== this.current) {
      valid_moves.push(this.directions[t]);
    }
  }
  var randTile = valid_moves[Math.round(Math.random() * (valid_moves.length -1))];
  var xDiff = this.marker.x - randTile.x;
  var yDiff = this.marker.y - randTile.y;
  var randDir;
  if (xDiff === 1) {
    randDir = Phaser.LEFT;
    this.sprite.play('moveLeft');
  } else if (xDiff === -1) {
    randDir = Phaser.RIGHT;
    this.sprite.play('moveRight');
  } else if (yDiff === 1) {
    randDir = Phaser.UP;
    this.sprite.play('moveUp');
  } else if (yDiff === -1) {
    randDir = Phaser.DOWN;
    this.sprite.play('moveDown');
  }

  this.move(randDir);
};
