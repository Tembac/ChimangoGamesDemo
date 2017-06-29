import gameOptions from "../gameOptions"
import physicOptions from "../physicOptions"

export default class extends Phaser.Sprite
{
  constructor (game)
  {
    super(game, 0, 0, "enemy");

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.animations.add('idleLoop', Phaser.Animation.generateFrameNames("anim_Enemigo_idle_",0,14,'',3), 60, true);
    this.animations.add('death', Phaser.Animation.generateFrameNames("anim_Enemigo_muerte_",0,10,'',3), 60, false)
    .onComplete.add(this.animCompleted);
    this.body.setSize( 60, 50, 73, 65);

  }

  update()
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

  animCompleted(sprite, animation)
  {
    if(animation.name == 'death')
    {
        sprite.kill();
    }
  }
}
