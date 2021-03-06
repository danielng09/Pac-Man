var Barrier = function(options) {
  this.game = options.game;
  this.barrier_type = options.barrier_type;
  this.marker_x = options.marker_x;
  this.marker_y = options.marker_y;
};

Barrier.prototype.create = function () {
  this.sprite = this.game.add.sprite((this.marker_x * 16), (this.marker_y * 16) + 8, 'barriers', this.barrier_type);
  this.game.physics.arcade.enable(this.sprite);
  this.sprite.anchor.set(0.5);
  this.sprite.body.immovable = true;
  this.sprite.body.moves = false;
};
