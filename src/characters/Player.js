import gameOptions from "../gameOptions"
import physicOptions from "../physicOptions"

export default class extends Phaser.Sprite
{
  constructor (game)
  {
    super(game, 0, 0);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(1, .5);
    this.body.setSize(122, 105, 105, 75);

    var spriterLoader = new Spriter.Loader();
    var spriterFile = new Spriter.SpriterJSON(game.cache.getJSON("playerAnim"),
    { imageNameType: Spriter.eImageNameType.FULL_PATH_NO_EXTENSION });
    var spriterData = spriterLoader.load(spriterFile);
    this.spriterGroup = new Spriter.SpriterGroup(game, spriterData, "playerAtlas", "Player");
    game.world.add(this.spriterGroup);

    this.spriterDeviation = new Phaser.Point(195, 180)
    this.spriterGroup.position.setTo( this.spriterDeviation.x, this.spriterDeviation.y);

    this.alpha = 0;

    this.spriterGroup.playAnimationByName("Avanzar");

    // this.spriterGroup.onFinish.add(this.spriterAnimationFinished, this);
    // this.spriterGroup.onLoop.add(this.spriterAnimationLoopFinished, this);

    // Player Bullets
    physicOptions.BULLET_POOL = this.game.add.group();
    physicOptions.BULLET_POOL.enableBody = true;
    physicOptions.BULLET_POOL.physicsBodyType = Phaser.Physics.ARCADE;
    physicOptions.BULLET_POOL.createMultiple(physicOptions.NUMBER_OF_BULLETS, 'HUD', "torta");

    //hor movement
    this.chaseAngle = 0;
    this.chaseLeft = 100;
    this.chaseAmplitude = 15;

    this.MAX_SPEED = physicOptions.MAX_SPEED;
    this.DRAG = physicOptions.DRAG;
    this.body.gravity.y = physicOptions.GRAVITY;
    this.JUMP_ACCEL = physicOptions.JUMP_ACCEL;
    this.JUMP_TIME = physicOptions.JUMP_TIME;
    this.JUMP_INIT_FUEL = this.JUMP_TIME;
    this.JUMP_FUEL = this.JUMP_INIT_FUEL;

    this.body.collideWorldBounds = true;
    this.body.maxVelocity.setTo(this.MAX_SPEED * .1, this.MAX_SPEED);
    this.body.drag.setTo(this.DRAG, this.DRAG);

    this.jumpPressed = false;
    this.shootPressed = false;

    this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.jumpKey.onDown.add(this.btnClickJump, this);
    this.jumpKey.onUp.add(this.btnReleasedJump, this);

    this.shootKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.shootKey.onDown.add(this.btnClickShoot, this);
    this.shootKey.onUp.add(this.btnReleasedShot, this);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.RIGHT]);

    this.lastBulletShotAt = 0;

    if(!this.game.device.desktop)
    {
      this.btnJump = new Phaser.Button(game, this.game.width * .15, this.game.height*.85, 'HUD',
      null, this, "btn_JumpDown", "btn_JumpNormal", "btn_JumpDown", "btn_JumpNormal");
      this.btnJump.onInputDown.add(this.btnClickJump, this);
      this.btnJump.onInputUp.add(this.btnReleasedJump, this);
      this.btnJump.fixedToCamera = true;
      this.btnJump.input.useHandCursor = false;
      this.btnJump.anchor.set(.5);
      this.btnJump.hitArea = new Phaser.Rectangle(-this.btnJump.x, -this.btnJump.y, this.game.width *.5, this.game.height);
      game.world.add(this.btnJump);

      this.btnShoot = new Phaser.Button(game, this.game.width * .85, this.game.height*.85, 'HUD',
      null, this, "btn_DashDown", "btn_DashNormal", "btn_DashDown", "btn_DashNormal");
      this.btnShoot.onInputDown.add(this.btnClickShoot, this);
      this.btnShoot.onInputUp.add(this.btnReleasedShot, this);
      this.btnShoot.fixedToCamera = true;
      this.btnShoot.input.useHandCursor = false;
      this.btnShoot.anchor.set(.5);
      this.btnShoot.hitArea = new Phaser.Rectangle(this.game.width * .5 -this.btnShoot.x, -this.btnShoot.y, this.game.width *.5, this.game.height);
      game.world.add(this.btnShoot);
    }
  }

  update ()
  {
    if(gameOptions.main.gamePaused)
    {
      return;
    }

    this.playerPhysics();
    this.animatePlayer();
  }

  playerPhysics ()
  {
    this.chaseAngle += 0.025;
    this.chaseX = this.chaseLeft + Math.sin(this.chaseAngle) * this.chaseAmplitude;
    this.body.position.x = this.chaseX;

    if(this.jumpPressed)
    {
      this.body.acceleration.y = 0;
      if(this.JUMP_FUEL > 0)
      {
        this.body.acceleration.y = this.JUMP_ACCEL;
        this.JUMP_FUEL -= 1 * this.game.time.physicsElapsedMS;
      }
      else
      {
        this.jumpPressed = false;
        this.JUMP_FUEL = this.JUMP_INIT_FUEL;
        this.body.acceleration.y = 0;
      }
    }

    this.lastBulletShotAt += this.game.time.physicsElapsedMS;
    if(this.shootPressed)
    {
      this.shootBullet();
    }
  }

  btnClickJump ()
  {
    if(gameOptions.main.gamePaused)
    {
      return;
    }
    this.body.acceleration.y = 0;
    if(this.JUMP_FUEL > 0)
    {
      this.body.acceleration.y = this.JUMP_ACCEL;
      this.JUMP_FUEL -= 1 * this.game.time.physicsElapsedMS;

      this.jumpPressed = true;
    }
  }

  btnReleasedJump ()
  {
    this.jumpPressed = false;
    this.JUMP_FUEL = this.JUMP_INIT_FUEL;
    this.body.acceleration.y = 0;
  }

  btnClickShoot ()
  {
    if(gameOptions.main.gamePaused)
    {
      return;
    }
    this.shootPressed = true;
    this.shootBullet();
  }

  btnReleasedShot ()
  {
    this.shootPressed = false;
    this.lastBulletShotAt = physicOptions.SHOT_DELAY;
  }

  shootBullet() {

    if (this.lastBulletShotAt < physicOptions.SHOT_DELAY) return;
    this.lastBulletShotAt = 0;

    var bullet = physicOptions.BULLET_POOL.getFirstDead();
    if (bullet === null || bullet === undefined) return;

    bullet.revive();
    bullet.reset(this.body.position.x + this.body.width, this.body.position.y + this.body.height *.5);

    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
    bullet.body.velocity.x = physicOptions.BULLET_SPEED;
    bullet.body.velocity.y = 0;
  }

  animatePlayer ()
  {
    this.spriterGroup.updateAnimation();
    this.spriterGroup.position.setTo(this.x + this.spriterDeviation.x, this.y + this.spriterDeviation.y);
  }
}
