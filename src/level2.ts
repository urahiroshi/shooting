import * as Phaser from "phaser"
import { LevelBase } from "./levelBase";
import { HanabiCircle } from "./canvas/HanabiCircle";
import { StraightShot } from "./canvas/StraightShot";
import { CanvasObject } from "./canvas/CanvasObject";
export class Level2 extends LevelBase {
  static KEY = 'level2';
  
  private balls: Phaser.Physics.Arcade.Group;
  private rectangle: Phaser.Geom.Rectangle;
  private ctx: CanvasRenderingContext2D;
  private canvas: Phaser.Textures.CanvasTexture;
  private objects: CanvasObject[];

  public init() {
    this._init(Level2.KEY, 30);
    this.objects = [];
  }

  public preload() {
    this._preload();
    this.load.image('square', 'square10x.png');

    this.canvas = this.textures.createCanvas('shot', 800, 600);
    this.ctx = this.canvas.context;
    this.load.image('shot');
  }

  private createHanabiShots() {
    const { width, height } = this.sys.game.canvas;

    const canvasImage = this.add.image(width / 2, height / 2, 'shot');
    canvasImage.depth = -1000;
    this.objects.push(new StraightShot(this.ctx, { x: width / 2, y: 0 }, { x: width / 2, y: height / 2 }, 0, 5000));
    this.objects.push(new HanabiCircle(this.ctx, { x: width / 2, y: height / 2 }, 250, 5000, 8000));

    this.objects.push(new StraightShot(this.ctx, { x: 600, y: 0 }, { x: 600, y: 400 }, 5000, 10000));
    this.objects.push(new HanabiCircle(this.ctx, { x: 600, y: 400 }, 300, 10000, 13000));

    this.objects.push(new StraightShot(this.ctx, { x: 200, y: 0 }, { x: 200, y: 200 }, 8000, 13000));
    this.objects.push(new HanabiCircle(this.ctx, { x: 200, y: 200 }, 200, 13000, 16000));
    // this.physics.add.sprite(width / 2, 0, 'shot');
    // firstShot.setVelocity(0, 100);
    // this.physics.add.collider(this.player, firstShot, this.gameOver.bind(this));

    // this.timerEvents.push(this.time.addEvent({
    //   callback: () => {
    //     const { x, y } = firstShot;
    //     firstShot.destroy();
    //     const length = 16; // 4 + (3 * 4)
    //     const initialSpeed = 200;
    //     const sparkTTL = 3;
    //     for (let i=0; i<length; i++) {
    //       const spark = this.physics.add.sprite(x, y, 'shot');
    //       const angle = 2 * Math.PI * (i / (length - 1));
    //       spark.setVelocity(Math.cos(angle) * initialSpeed, Math.sin(angle) * initialSpeed);
    //       spark.setRotation(angle - (Math.PI / 2));
    //       spark.setAcceleration(-Math.cos(angle) * (initialSpeed / sparkTTL), -Math.sin(angle) * (initialSpeed / sparkTTL));
    //       this.physics.add.collider(this.player, spark, this.gameOver.bind(this));
    //       this.timerEvents.push(this.time.addEvent({
    //         callback: () => {
    //           spark.destroy();
    //         },
    //         delay: sparkTTL * 1000,
    //         loop: false,
    //       }));

    //       this.tweens.add({
    //         targets: [spark],
    //         alpha: 0,
    //         duration: sparkTTL * 1000,
    //         ease: 'Power2',
    //       });
    //     }
    //   },
    //   callbackScope: this,
    //   delay: 3000,
    //   loop: false,
    // }));
  }

  public create() {
    this._create('Level 2');
    const { width } = this.sys.game.canvas;
    this.rectangle = new Phaser.Geom.Rectangle(0, 0, width, 0);

    this.createHanabiShots();

    // it should be called after addEvent
    this.physics.add.collider(this.player, this.balls, this.gameOver.bind(this));
  }

  public update() {
    this._update();

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
    const { width, height } = this.sys.game.canvas;
    this.ctx.fillRect(0, 0, width, height);

    const elapsedTime = Date.now() - this.startTime;
    this.objects.forEach((obj) => { obj.update(elapsedTime); });
	
    this.canvas.refresh();

    const imageData = this.ctx.getImageData(this.player.x, this.player.y, 1, 1).data;
    if (imageData[0] >= 128 || imageData[1] >= 128 || imageData[2] >= 128) {
      this.add.text(10, 300 - 24, 'BOMB!!', { fontFamily: 'sans-serif', fontSize: '48px' });
    }
  }
}