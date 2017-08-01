import gameOptions from "../gameOptions"

import PausePanel from "../ui/PausePanel"
import TutorialPanel from "../ui/TutorialPanel"

export default class extends Phaser.Group
{
  constructor (game, player)
  {
    super(game);

    this.player = player;

    var hudY = 5;
    this.fixedToCamera = true;

    this.lifeBarEmpty = new Phaser.Image(this.game, 10, hudY + 10, "HUD", "live_barEmpty");
    this.add(this.lifeBarEmpty);

    this.lifeBar = new Phaser.Image(this.game, this.lifeBarEmpty.x + 53, this.lifeBarEmpty.y +11, "HUD", "live_barFull");
    this.add(this.lifeBar);

    this.lifeBarRect = new Phaser.Rectangle(0, 0, this.lifeBar.width, this.lifeBar.height);
    this.barInitWidth = this.lifeBarRect.width;
    this.lifeBar.crop(this.lifeBarRect);

    gameOptions.main.score = 0;
    this.txtScore = new Phaser.BitmapText(this.game, this.game.width * .5, hudY, 'gameFont', '0', 84);
    this.add(this.txtScore);

    var btnPause = new Phaser.Button(this.game, this.game.width -10 , hudY + 10, 'HUD',
    this.openPause, this, "btn_Pausaover", "btn_PausaNormal", "btn_PausaDown", "btn_PausaNormal");
    btnPause.anchor.set(1,0);
    btnPause.input.useHandCursor = false;
    this.add(btnPause);

    //panel tutorial intro
    this.grpHelpPanel = new TutorialPanel(this.game, this);
    this.add(this.grpHelpPanel);
    this.grpHelpPanel.visible = false;

    //pause
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.pauseButton.onDown.add(this.openPause, this);
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.ESC ]);

    this.groupPause = new PausePanel(this.game, this);
    this.add(this.groupPause);

    this.groupPause.x = 0;
    this.groupPause.y = 0;

    this.groupPauseShowTween = this.game.add.tween(this.groupPause);
    this.groupPauseShowTween.to({ x:0}, 250, Phaser.Easing.Linear.Out);

    //game over screen
    this.gameOverSign = new Phaser.Sprite(this.game, this.game.width*.5, -this.game.width * .5, "HUD", "GameOver");
    this.gameOverSign.anchor.set(.5);
    this.add(this.gameOverSign);

    this.fadeFilter = new Phaser.Graphics(this.game, 0,0);
    this.fadeFilter.beginFill(0x00, 1);
    this.fadeFilter.alpha = 0;
    this.fadeFilter.drawRect(0, 0, this.game.width, this.game.height);
    this.fadeFilter.endFill();
    this.add(this.fadeFilter);

    this.fadeTween = this.game.add.tween(this.fadeFilter);
    this.fadeTween.to({ alpha:1}, 1000, Phaser.Easing.Cubic.In, false, 500)
    .onComplete.add(
      function(){
          this.game.state.start('MainMenu');
      }, this);

    this.gameOverTween = this.game.add.tween(this.gameOverSign);
    this.gameOverTween.to({y: this.game.height * .5}, 1500, Phaser.Easing.Bounce.Out, false)
    .onComplete.add(
      function(){
        this.fadeTween.start();
      }, this);

    if (this.game.device.desktop)
    {
      this.cursor = new Phaser.Image(this.game, 0,0,'HUD', 'cursor');
      this.add(this.cursor);
      // this.cursor.visible = false;

      this.hideMouseCount = 0;
      this.prevMousePos = new Phaser.Point();
    }
  }

  openPause (){
		if(gameOptions.main.gamePaused
    || gameOptions.main.lvlFlowState != gameOptions.main.lvlFlowPlaying)
		{
		  return;
		}
    gameOptions.main.soundFx.play("click_GUI");

		gameOptions.main.gamePaused = true;
		this.game.physics.arcade.isPaused = gameOptions.main.gamePaused;

		//muestra el menu de pausa
	  this.showPauseMenu();
	}

  showPauseMenu(){
    this.groupPause.visible = true;
    if (this.game.device.desktop)
    {
      this.cursor.visible = true;
    }
    this.groupPauseShowTween.start();
    this.groupPause.pauseStart();
  }

  update (){

    if (this.game.device.desktop)
		{
      this.cursor.x = this.game.input.activePointer.x;
			this.cursor.y = this.game.input.activePointer.y;
		}

    if(this.game.physics.arcade.isPaused
    || gameOptions.main.gamePaused)
    {
      return;
    }

    if (this.game.device.desktop)
    {
      this.autoHideCursor();
    }
  }

  autoHideCursor()
  {
    //hide mouse
		if (this.prevMousePos.equals(this.cursor))
		{
			this.hideMouseCount += this.game.time.elapsedMS;
			if (this.hideMouseCount > 2000)
			{
				this.cursor.visible = false;
			}
		}
		else
		{
			this.cursor.visible = true;
			this.hideMouseCount = 0;
		}

		this.prevMousePos.set(this.cursor.x, this.cursor.y);
  }

  updateHUD ()
  {
    this.lifeBarRect.width = this.player.health * this.barInitWidth;
    this.lifeBar.updateCrop();
  }

  addScore(amount)
  {
    gameOptions.main.score += amount;
    this.txtScore.text = "" + gameOptions.main.score;
    gameOptions.main.soundFx.play("cassette");
  }
}
