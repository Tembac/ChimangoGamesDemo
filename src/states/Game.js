import gameOptions from "../gameOptions"
import physicOptions from "../physicOptions"

import Background01 from "../backgrounds/Background01"

import Player from "../characters/Player"
import Enemy from "../characters/Enemy"
import Collectible from "../characters/Collectible"

import InGameHud from "../ui/InGameHud"

export default class extends Phaser.State
{
  create () {

    this.levelSpawnX = this.game.width;

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, this.game.width, 1024);

    //physics
    this.levelSpeed = physicOptions.INITIAL_LEVEL_SPEED;
    this.levelAcceleration = physicOptions.LEVEL_ACCELERATION;

    this.LevelSpawnDistanceGuide = 0;

    //lista de levels
    this.minimumIndex = 3;
    this.minimumIndex = Math.max(this.minimumIndex, physicOptions.ORIGINAL_LEVEL_INDEX)
    this.levelsJsonNames = gameOptions.main.levelsCacheNames;

    gameOptions.main.lvlFlowState = 0;

    gameOptions.main.lvlFlowIntro = 0;
    gameOptions.main.lvlFlowPlaying = 1;
    gameOptions.main.lvlFlowGameOver = 2;

    //stage elements
    this.backgrounds = new Background01(this.game);
    this.add.existing(this.backgrounds);

    this.player = new Player(this.game);
    this.add.existing(this.player);

    //camara
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 1);
    this.game.camera.deadzone = new Phaser.Rectangle(0, 50, this.game.width, 150);

    //level
    this.elementsLevel = [];
    this.elementsLevelLength = 0;

    this.allObjects = 0;
    //enemies
    this.enemiesGroup = this.game.add.group();
    this.enemiesGroup.enableBody = true;
    for(var i=0; i<15; i++) {
       this.addEnemyToGroup();
    }

    //Collectible
    this.collectibleGroup = this.game.add.group();
    this.collectibleGroup.enableBody = true;
    for(var i=0; i<40; i++) {
       this.addCollectibleToGroup();
    }

    //hud
    this.HUD = new InGameHud(this.game, this.player);
    this.add.existing(this.HUD);

    //framerate only on debug
    if(indexInfo.buildState == "Debug")
    {
      this.txtFPS = this.add.bitmapText(15, this.game.height - 20,'gameFont', '0', 18);
      this.txtFPS.fixedToCamera = true;
      this.txtFPS.visible = true;
      this.txtFPS.anchor.set(0,1);
    }

    this.game.time.advancedTiming = true;
    //30 fps for update logic is safer for slower devices.
    this.game.time.desiredFps = 30;
    // this.game.time.slowMotion = 2;

    this.startIntroState();
  }

  startIntroState (){

    gameOptions.main.lvlFlowState = gameOptions.main.lvlFlowIntro;

    this.levelIndex = physicOptions.ORIGINAL_LEVEL_INDEX;
    this.randomLevelsUnlocked = false;
    gameOptions.main.score = 0;
    this.HUD.txtScore.text = "0";
    this.HUD.grpHelpPanel.visible = true;

    gameOptions.main.music.play("TTG_RR_intro_music");
  }

  startPlayingState()
  {
    gameOptions.main.lvlFlowState = gameOptions.main.lvlFlowPlaying;

    this.physics.arcade.isPaused = false;
    this.LevelSpawnDistanceGuide = 0;
    this.getNewLevelFile();

    this.HUD.grpHelpPanel.visible = false;
  }

  addEnemy (X, Y)
  {
    //enemy
    var enemy = this.enemiesGroup.getFirstDead();
    if(enemy == null)
    {
        enemy= this.addEnemyToGroup();
    }
    enemy.play('idleLoop');
    enemy.reset(X,Y - enemy.height);
  }

  addEnemyToGroup (){
    var newItem = new Enemy(this.game);
    this.enemiesGroup.add(newItem);
    newItem.kill();
    return newItem;
  }

  addCollectible (X, Y)
  {
    //Collectible
    var Collectible = this.collectibleGroup.getFirstDead();
    if(Collectible == null)
    {
        Collectible= this.addCollectibleToGroup();
    }
    Collectible.play('idleLoop');
    Collectible.reset(X,Y - Collectible.height);
  }

  addCollectibleToGroup (){
    var newItem = new Collectible(this.game);
    this.collectibleGroup.add(newItem);
    newItem.kill();
    return newItem;
  }

  update (){

    //framerate
    if(indexInfo.buildState == "Debug")
    {
		  this.txtFPS.text = gameOptions.main.version
      + " /render type: " + this.game.renderType
      + " /render FPS: " + this.game.time.fps;
    }

    if(this.physics.arcade.isPaused
    || gameOptions.main.gamePaused)
    {
      return;
    }

    if( gameOptions.main.lvlFlowState == gameOptions.main.lvlFlowPlaying)
    {
      this.updatePlayingState();
    }
    else
    {
      this.physics.arcade.isPaused = true;
    }
  }

  updatePlayingState ()
  {
    this.levelUpdate();

    //colisiones
    if(this.player.alive)
    {
      this.game.physics.arcade.overlap(this.player, this.enemiesGroup, this.playerCollideEnemy, null, this);
      this.game.physics.arcade.overlap(this.player, this.collectibleGroup, this.playerCollideCollectible, null, this);
      this.game.physics.arcade.overlap(physicOptions.BULLET_POOL, this.enemiesGroup, this.playerCollideCollectible, null, this);
    }
  }

  levelUpdate()
  {
    //movimientos escenario
    this.levelSpeed += this.levelAcceleration;
    this.levelSpeed = Math.max(this.levelSpeed, physicOptions.MAX_LEVEL_SPEED);
    physicOptions.MOVE_AMOUNT = this.levelSpeed;

    this.LevelSpawnDistanceGuide -= physicOptions.MOVE_AMOUNT * this.game.time.physicsElapsed;
    var lastPiece = false;
    if(this.nextLevelElementIndex >= this.elementsLevelLength-1)
    {
      lastPiece = true;
    }
    if(!lastPiece)
    {
      var elementX = this.elementsLevel[this.nextLevelElementIndex].x;
      if(this.LevelSpawnDistanceGuide >= elementX)
      {

        //x correction fixes the delay between updates.
        //A piece can need to be spawned between updates.
        //x correction corrige el desfasaje que existe entre updates.
        //Cada update se genera a cierta distancia y algunos elementos pueden estar entre esa distancia.
        var xCorrection = this.LevelSpawnDistanceGuide - elementX;
        var obj = this.elementsLevel[this.nextLevelElementIndex];
        this.spawnLevelElement(obj, xCorrection);

        this.nextLevelElementIndex++;

      }
    }
    else
    {
      //llega al final del nivel y agarra otro archivo
      if (this.LevelSpawnDistanceGuide >= physicOptions.LEVEL_SIZE)
      {
        this.LevelSpawnDistanceGuide = 0;
        this.getNewLevelFile();
      }
    }
  }

  getNewLevelFile()
  {
    //va cargando piezas de niveles
    if(this.randomLevelsUnlocked)
    {
      //toma un nivel al azar en el rango de los niveles posibles
      this.levelIndex = Math.floor(Math.random() * (this.levelsJsonNames.length -1 - this.minimumIndex + 1)) + this.minimumIndex;
    }
    else
    {
      this.levelIndex ++;
      if(this.levelIndex >= this.minimumIndex)
      {
        this.levelIndex = this.minimumIndex;
        this.randomLevelsUnlocked = true;
      }
    }

    this.currentLevel = this.game.cache.getJSON(this.levelsJsonNames[this.levelIndex]);
    this.parseLevelBlock(this.currentLevel);
  }

  playerCollideEnemy(obj1, obj2)
  {
    if(obj2.animations.currentAnim.name != 'death')
    {
      this.player.damage(physicOptions.ENEMY_DAMAGE);
      this.HUD.updateHUD();
      obj2.play('death');
      gameOptions.main.soundFx.play("muerte_enemigo");

      this.levelSpeed = physicOptions.INITIAL_LEVEL_SPEED;

      if(!this.player.alive)
      {
        this.levelOver();
      }
    }
  }

  playerCollideCollectible(obj1, obj2)
  {
    if(obj2.animations.currentAnim.name != 'death')
    {
      obj2.play('death');
      this.HUD.addScore(1);
      //si no es el jugador es un disparo
      if(obj1!= this.player)
      {
        obj1.kill();
      }
    }
  }

  levelOver()
  {
    gameOptions.main.lvlFlowState = gameOptions.main.lvlFlowGameOver;

    gameOptions.main.music.stop();

    this.HUD.gameOverTween.start();

    physicOptions.MOVE_AMOUNT = 0;
  }

  spawnLevelElement(obj, spawnXcorrection)
  {
    switch(obj.gid)
    {
      case 1:
        this.addCollectible(this.levelSpawnX - spawnXcorrection, obj.y);
      break;
      case 2:
        this.addEnemy(this.levelSpawnX - spawnXcorrection, obj.y);
      break;
    }
  }

  parseLevelBlock(levelJson)
  {
    this.elementsLevel = [];
    //parsea el nivel
    var layer = levelJson.layers[0];
    for(var i = 0; i< layer.objects.length; i++)
    {
      var obj = layer.objects[i];
      this.elementsLevel.push(obj);
    }
    //acomoda los array por x
    this.elementsLevel.sort(function(a,b)
    {
      return a.x - b.x;
    });
    this.nextLevelElementIndex = 0;

    this.elementsLevelLength = this.elementsLevel.length;

    //counts level objects
    // this.liveEnemies = this.enemiesGroup.countLiving();
    // this.deadEnemies = this.enemiesGroup.countDead();
    // this.liveCollectibles = this.collectibleGroup.countLiving();
    // this.deadCollectibles = this.collectibleGroup.countDead();
    // this.allObjects = this.liveEnemies + this.deadEnemies + this.liveCollectibles + this.deadCollectibles;
  }

  render(){
    if(indexInfo.buildState != "Debug")
    {
      return;
    }
    // this.game.debug.body(this.player);
    //
    // this.enemiesGroup.forEachAlive(this.renderGroup, this);
    // this.collectibleGroup.forEachAlive(this.renderGroup, this);
    // this.player.spriterGroup.forEachAlive(this.renderGroup, this);
  }

  renderGroup(member){
    // this.Group.forEachAlive(this.renderGroup, this);
      this.game.debug.body(member);
  }

}
