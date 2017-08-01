import gameOptions from "../gameOptions"

export default class extends Phaser.State
{
  preload ()
  {

		this.background = this.add.image( this.game.world.centerX , this.game.world.centerY, 'preloaderBarBack');
		this.background.anchor.set(0.5);
		this.preloadBar = this.add.sprite( this.game.world.centerX -220, this.game.world.centerY + 195.5, 'preloaderBar');
		this.preloadBar.anchor.set(0, 1);

		this.load.setPreloadSprite(this.preloadBar);

    //empieza la carga
    this.load.onFileComplete.add(this.fileComplete, this);

    this.load.json("levelList",  'assets/levels/List.json');

    this.load.atlasJSONHash("Splash", "assets/textures/splash_01.png", "assets/textures/splash_01.json");

    // this.load.bitmapFont('gameFont', 'assets/font/Font.png', 'assets/font/Font.xml');
    this.load.bitmapFont('gameFont', 'assets/font/Font.png', 'assets/font/Font.json');

    this.load.atlasJSONHash("HUD", "assets/textures/Hud_01.png", "assets/textures/Hud_01.json");

    this.load.atlasJSONHash("playerAtlas", "assets/textures/atlasPlayer.png", "assets/textures/atlasPlayer.json");
    this.load.json("playerAnim",  'assets/textures/Player.scon');

    this.load.atlasJSONHash("level", "assets/textures/level.png", "assets/textures/level.json");

    this.load.atlasJSONHash("enemy", "assets/textures/Enemigo1.png", "assets/textures/Enemigo1.json");

    this.load.audiosprite("audioMusic",
    [
      //"assets/audio/music.mp3",
    "assets/audio/music.m4a",
    // "assets/audio/music.ac3",
    // "assets/audio/music.ogg"
  ], "assets/audio/music.json" );
		this.load.audiosprite("audioMix",
    [
      // "assets/audio/soundFx.mp3",
    "assets/audio/soundFx.m4a",
    // "assets/audio/soundFx.ac3",
    // "assets/audio/soundFx.ogg"
  ], "assets/audio/soundFx.json" );
  }

  fileComplete (progress, cacheKey, success, totalLoaded, totalFiles) {

		//si el archivo cargado es el listado de niveles
		if(cacheKey == "levelList")
		{
			//carga los niveles
			var lvlListJson = this.game.cache.getJSON(cacheKey);
			for(var i = 0; i< lvlListJson.levels.length; i++)
    	{
      	var block = lvlListJson.levels[i].block;
      	this.load.json('level' + i, 'assets/levels/' + block);
      	gameOptions.main.levelsCacheNames[i] = 'level' + i;
      }
		}
	}

  create ()
  {
    gameOptions.main.FXEnabled = JSON.parse( localStorage.getItem("SRFXEnabled")) ;

		if(gameOptions.main.FXEnabled == null)
		{
			gameOptions.main.FXEnabled = true;
		}

	 //audio
   	gameOptions.main.soundFx = this.add.audioSprite("audioMix");
    gameOptions.main.soundFx.allowMultiple = true;

    //music
    gameOptions.main.music = this.add.audioSprite("audioMusic");
    gameOptions.main.music.allowMultiple = true;

   	//load data
    this.game.sound.mute = JSON.parse( localStorage.getItem("SRmuteState"));

    //webgl cache rendering
    // this.game.renderer.setTexturePriority(['playerAtlas', "HUD", 'gameFont', "level", "enemy", "Splash"]);

    // this.state.start('MainMenu');
    this.state.start('Game');
  }
}
