import gameOptions from "../gameOptions"
import TutorialPanel from "../ui/TutorialPanel"

export default class extends Phaser.State
{
  create () {

    this.back = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'Splash', "imagen");
    this.clouds = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'Splash', "clouds");

    this.hillL = this.add.image(0, this.game.height, "Splash", "BGSelectorL");
    this.hillL.anchor.set(0,1);
    this.hillR = this.add.image(this.game.width, this.game.height, "Splash", "BGSelectorR");
    this.hillR.anchor.set(1,1);

    this.container = this.add.image( 160, this.game.height * .5, 'Splash', "container");
    this.container.anchor.set(.5);
    this.logo = this.add.image(this.container.x, 50, 'Splash', "logo");
    this.logo.anchor.set(.5, 0);
    this.title = this.add.image(this.container.x, 400, 'Splash', "title");
    this.title.anchor.set(.5, 0);

    this.autoFeo = this.add.image(this.game.width *.60, -100, 'Splash', "auto");
    this.autoFeo.anchor.set(.5);

    this.autoFeoTween1 = this.add.tween(this.autoFeo);
    this.autoFeoTween1.to({y: this.game.height * .5 }, 2500, Phaser.Easing.Elastic.Out, true)
    .onComplete.add(
      function(){
        this.autoFeoTween2 = this.add.tween(this.autoFeo);
        this.autoFeoTween2.to({y: this.game.height * .5 - 15}, 500, Phaser.Easing.Linear.Out, true, 0, -1, true);

      }, this);

    this.btnPlay = this.add.button(this.game.width - 50, this.game.height-50,
      'Splash', this.btnPlayOnClick, this, "btnPlayMain_over", "btnPlayMain_normal", "btnPlayMain_down", "btnPlayMain_normal");
    this.btnPlay.anchor.set( 1, 1);
    this.btnPlay.input.useHandCursor = false;

    this.btnHelp = this.add.button(this.game.width - 130, 20, 'HUD',
    this.btnClickHelp, this, "btn_helpOver", "btn_helpNormal", "btn_helpDown", "btn_helpNormal");
    // this.btnHelp.fixedToCamera = true;
    this.btnHelp.input.useHandCursor = false;
    this.btnHelp.anchor.set(1,0);

    //panel tutorial
    this.grpHelpPanel = new TutorialPanel(this.game);

    this.btnAudioOn = this.add.button(this.game.width - 20, 20,
      'Splash', this.btnAudioOnClick, this, "btn_sonidoOver", "btn_sonidoNormal", "btn_sonidoDown", "btn_sonidoNormal");
    this.btnAudioOn.anchor.set(1,0);
    this.btnAudioOn.input.useHandCursor = false;

    this.btnAudioOff = this.add.button(this.game.width - 20 , 20,
      'Splash', this.btnAudioOnClick, this, "btn_sonidoOFFOver", "btn_sonidoOFFNormal", "btn_sonidoOFFDown", "btn_sonidoOFFNormal");
    this.btnAudioOff.anchor.set(1,0);
    this.btnAudioOff.input.useHandCursor = false;

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

    if (this.game.device.desktop)
		{
			this.cursor = this.add.image(0,0,'HUD', 'cursor');
		}

    //music
		gameOptions.main.music.stop();
		gameOptions.main.music.play("TTG_RR_Splash_music_loop");
  }

  btnClickHelp (){
    gameOptions.main.soundFx.play("click_GUI");
    this.grpHelpPanel.showHidePanel();
  }

  btnPlayOnClick (){

		gameOptions.main.soundFx.play("click_GUI");
		this.state.start('Game');

		gameOptions.main.music.stop();
	}

	btnAudioOnClick() {

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

	update() {

    if (this.game.device.desktop)
		{
			this.cursor.x = this.game.input.worldX;
			this.cursor.y = this.game.input.worldY;
		}

    this.clouds.tilePosition.x -= 0.5;

	}
}
