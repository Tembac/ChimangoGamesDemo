import gameOptions from "../gameOptions"
import physicOptions from "../physicOptions"

export default class extends Phaser.Sprite
{
  constructor (game)
  {
    super(game, 0, 0, "HUD", "particleCake/particleCake00");

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.animations.add('idleLoop', ["particleCake/particleCake00"], 60, true);
    this.animations.add('death', Phaser.Animation.generateFrameNames("particleCake/particleCake", 0, 7,'',2), 15, false)
    .onComplete.add(this.animCompleted);
    this.body.setSize( 70, 55, 75, 85);
  }

  update ()
  {
    if(gameOptions.main.gamePaused)
    {
      return;
    }
    this.body.velocity.x = physicOptions.MOVE_AMOUNT;
    if(this.body.position.x < -this.width)
    {
      this.kill();
    }
  }

  animCompleted (sprite, animation)
  {
    if(animation.name == 'death')
    {
        sprite.kill();
    }
  }
}
