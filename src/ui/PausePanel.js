import gameOptions from "../gameOptions"
import physicOptions from "../physicOptions"

import TutorialPanel from "./TutorialPanel"

export default class extends Phaser.Group
{
  constructor (game)
  {
    super(game);

    //Pausa
    this.backPausa = new Phaser.TileSprite(game, 0,0, this.game.width , this.game.height, "HUD", "color16x16");

    this.panelPausa = new Phaser.Image(game, this.game.width , 0, "HUD", "pause_panel");
    this.panelPausa.anchor.set( 1 , 0);
    this.panelPausa.height = this.game.height;

    this.btnClosePause = new Phaser.Button(game, this.game.width -10 , 10, 'HUD',
    this.btnPauseClose, this, "btnNo_over", "btnNo_normal", "btnNo_down", "btnNo_normal");
    this.btnClosePause.input.useHandCursor = false;
    this.btnClosePause.anchor.set(1,0);

    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.pauseButton.onDown.add(this.btnPauseClose, this);

    this.allowClose = false;
    this.timerCloseAllow = game.time.create(false);

    this.btLeft = this.game.width -50;
    this.btTop = 160;
    this.btSep = 120;

    this.btnAudioOn = new Phaser.Button(game, this.btLeft, this.btTop, 'HUD', this.btnAudioOnClick, this, "btn_sonidoOver", "btn_sonidoNormal", "btn_sonidoDown", "btn_sonidoNormal");
    this.btnAudioOn.input.useHandCursor = false;
    this.btnAudioOn.anchor.set(1,0);

    this.btnAudioOff = new Phaser.Button( game, this.btLeft, this.btTop, 'HUD', this.btnAudioOnClick, this, "btn_sonidoOFFOver", "btn_sonidoOFFNormal", "btn_sonidoOFFDown", "btn_sonidoOFFNormal");
    this.btnAudioOff.input.useHandCursor = false;
    this.btnAudioOff.anchor.set(1,0);

    if(this.game.sound.mute)
    {
      this.btnAudioOn.visible = false;
      this.btnAudioOff.visible = true;
    }
    else
    {
      this.btnAudioOn.visible = true;
      this.btnAudioOff.visible = false;
    }

    this.btnHome = new Phaser.Button(game, this.btLeft, this.btTop + this.btSep, 'HUD', this.btnHomeClick
    , this, "btn_homeOver", "btn_homeNormal", "btn_homeDoen", "btn_homeNormal");

    this.btnHome.input.useHandCursor = false;
    this.btnHome.anchor.set(1,0);

    this.btnHelp = new Phaser.Button(game, this.btLeft, this.btTop + this.btSep*2, 'HUD',
    this.btnClickHelp, this, "btn_helpOver", "btn_helpNormal", "btn_helpDown", "btn_helpNormal");
    this.btnHelp.input.useHandCursor = false;
    this.btnHelp.anchor.set(1,0);

    //panel tutorial
    this.grpHelpPanel = new TutorialPanel(this.game);

    //animaciones
    this.groupPauseHideTween = new Phaser.Tween(this, game, game.tweens);
    this.groupPauseHideTween.to({ x:500}, 250, Phaser.Easing.Linear.Out)
    .onComplete.add(function()
    {
      this.visible = false;

      this.game.physics.arcade.isPaused = false;
      gameOptions.main.gamePaused = false;
    }, this);

    this.add(this.backPausa);
    this.add(this.panelPausa);
    this.add(this.btnClosePause);
    this.add(this.btnAudioOn);
    this.add(this.btnAudioOff);
    this.add(this.btnHome);
    this.add(this.btnHelp);
    this.add(this.grpHelpPanel);

    this.visible = false;
  }

  pauseStart () {
    this.timerCloseAllow.add(250, function() {this.allowClose = true; }, this);
    this.timerCloseAllow.start();
  }

  btnAudioOnClick () {
     gameOptions.main.soundFx.play("click_GUI");
     this.game.sound.mute = !this.game.sound.mute;
     localStorage.setItem("SRmuteState", JSON.stringify(this.game.sound.mute));
     if(this.game.sound.mute)
     {
        this.btnAudioOn.visible = false;
        this.btnAudioOff.visible = true;
     }
     else
     {
        this.btnAudioOn.visible = true;
        this.btnAudioOff.visible = false;
     }

  }

  btnHomeClick () {
    gameOptions.main.soundFx.play("click_GUI");
    this.btnPauseClose();
    gameOptions.main.music.stop();
    gameOptions.main.soundFx.stop();
    physicOptions.MOVE_AMOUNT = 0;
    this.game.physics.arcade.isPaused = false;
    gameOptions.main.gamePaused = false;
    this.game.state.start('MainMenu');
  }

  btnPauseClose (){
    if(!this.allowClose)
    {
      return;
    }

    this.allowClose = false;

    gameOptions.main.soundFx.play("click_GUI");

    this.groupPauseHideTween.start();
  }

  btnClickHelp (){
    gameOptions.main.soundFx.play("click_GUI");
    this.grpHelpPanel.showHidePanel();
  }
}
