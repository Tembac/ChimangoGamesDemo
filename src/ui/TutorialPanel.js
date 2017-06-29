import gameOptions from "../gameOptions"

export default class extends Phaser.Group
{
  constructor (game)
  {
    super(game);

    //panel tutorial de pause
    this.panelTutorial = new Phaser.Sprite(game, this.game.width *.5, this.game.height*.5-10, "HUD", "tutorialScreen");
    this.panelTutorial.anchor.set(0.5);
    this.add(this.panelTutorial);

    this.btnClosepanelTutorial = new Phaser.Button(game, this.game.width *.5 , this.game.height - 10,
      'HUD', this.showHidePanel, this, "btnNo_over", "btnNo_normal", "btnNo_down", "btnNo_normal");
    this.btnClosepanelTutorial.anchor.set(0.5,1);
    this.btnClosepanelTutorial.input.useHandCursor = false;
    this.add(this.btnClosepanelTutorial);

    this.visible = false;
  }

  showHidePanel()
  {
    this.visible = !this.visible;

    if(gameOptions.main.lvlFlowState == gameOptions.main.lvlFlowIntro)
    {
      //comienza el juego.
      this.game.state.states[this.game.state.current].startPlayingState();
    }
  }
}
