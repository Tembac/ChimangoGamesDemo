import gameOptions from "../gameOptions"
import physicOptions from "../physicOptions"

export default class extends Phaser.Group
{
  constructor (game)
  {
    super(game);

    this.backgroundLyr01 = this.game.add.tileSprite(0, 0, this.game.width, 1024, "level", "cielo01");
    this.backgroundLyr02 = this.game.add.tileSprite(0, this.game.world.height - 320, this.game.width, 320, "level", "montanas");
    this.backgroundLyr03 = this.game.add.tileSprite(0, 200, this.game.width, 320, "level", "nubes");

  }

  update()
  {
    if(gameOptions.main.gamePaused)
    {
      return;
    }

    this.backgroundLyr01.tilePosition.x += physicOptions.MOVE_AMOUNT *0.0005;
    this.backgroundLyr02.tilePosition.x += physicOptions.MOVE_AMOUNT *0.0015;
    this.backgroundLyr03.tilePosition.x += physicOptions.MOVE_AMOUNT *0.0016;
  }
}
