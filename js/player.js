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
  this.playingSound = false;

};

Player.prototype.create = function () {
  this.sprite = this.game.add.sprite((14 * 16) + 8, (23 * 16) + 8, 'pacman', 1);
  this.sprite.anchor.set(0.5);
  this.sprite.animations.add('munch', [1, 2, 1, 0], 13, true);
  this.sprite.animations.add('death', [0, 2], 13, true);
  this.munchSound = this.game.add.audio('pacman-chomp');
  this.deathSound = this.game.add.audio('death');

  this.game.physics.arcade.enable(this.sprite);
  this.sprite.body.setSize(16, 16);

  this.sprite.body.enable = false;
  setTimeout(function() {
    this.sprite.body.enable = true;
    this.sprite.play('munch');
    this.move(Phaser.LEFT);
  }.bind(this), 4500);

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

  this.sprite.scale.x = 1;
  this.sprite.angle = 0;

  if (direction === Phaser.RIGHT) {
    this.sprite.scale.x = -1;
  } else if (direction === Phaser.UP) {
    this.sprite.angle = 90;
  } else if (direction === Phaser.DOWN) {
    this.sprite.angle = 270;
  }

  this.sprite.play('munch');
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
  this.game.score += 10;
  this.game.text.setText("Score: " + this.game.score);

  if (!this.playingSound) {
    this.munchSound.play();
    this.playingSound = true;
    setTimeout(function() {
      this.playingSound = false;
    }.bind(this), 600);
  }
  if (this.game.dots.total === 0) {
    this.winGame().bind(this);
    // this.game.dots.callAll('revive');
  }
};

Player.prototype.update = function () {
  this.game.physics.arcade.collide(this.sprite, this.game.layer, this.stop.bind(this));
  this.game.physics.arcade.collide(this.sprite, this.game.barriers[2]);
  this.game.physics.arcade.collide(this.sprite, this.game.ghosts, this.loseGame.bind(this));

  this.game.physics.arcade.overlap(this.sprite, this.game.dots, this.eatDot.bind(this), null, this.game);

  this.marker.x = this.game.math.snapToFloor(Math.floor(this.sprite.x), this.game.gridsize) / this.game.gridsize;
  this.marker.y = this.game.math.snapToFloor(Math.floor(this.sprite.y), this.game.gridsize) / this.game.gridsize;
  if (this.sprite.x < 0) {
    this.sprite.x = this.sprite.x + 448;
  } else if (this.sprite.x > 448) {
    this.sprite.x = this.sprite.x % 448;
  }

  this.directions[1] = this.game.map.getTileLeft(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[2] = this.game.map.getTileRight(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[3] = this.game.map.getTileAbove(this.game.layer.index, this.marker.x, this.marker.y);
  this.directions[4] = this.game.map.getTileBelow(this.game.layer.index, this.marker.x, this.marker.y);

  this.game.checkKeys();

  if (this.turning !== Phaser.NONE && this.sprite.body.enable) {
    this.turn();
  }
};

Player.prototype.stop = function () {
  this.sprite.animations.stop();
};

Player.prototype.loseGame = function () {
  this.deathSound.play();
  this.sprite.body.enable = false;
  // play death animation
  this.sprite.kill();
  this.game.paused = true;
  $('.game-over').removeClass('hide');
  $('.backdrop').removeClass('hide');
};

Player.prototype.winGame = function () {
  this.sprite.body.enable = false;
  this.game.ghosts.forEach(function(ghost) {
    ghost.kill();
  });
  this.game.paused = true;
  $('.win').removeClass('hide');
  $('.backdrop').removeClass('hide');
};
