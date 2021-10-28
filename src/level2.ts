import * as Phaser from "phaser"
import { LevelBase } from "./levelBase";

export class Level2 extends LevelBase {
  static KEY = 'level2';
  
  private balls: Phaser.Physics.Arcade.Group;
  private rectangle: Phaser.Geom.Rectangle;

  public init() {
    this._init(Level2.KEY, 30);
  }

  public preload() {
    this._preload();
    this.load.image('square', 'square10x.png');

    const shotCanvas = this.textures.createCanvas('shot', 10, 16);
    const shotCtx = shotCanvas.context;
    shotCtx.fillStyle = '#e6eeef';
    shotCtx.beginPath();
    shotCtx.arc(5, 9, 5, 0, Math.PI * 2);
    shotCtx.shadowBlur = 2;
    shotCtx.shadowColor = 'rgba(0, 228, 233, 1)';
    shotCtx.shadowOffsetY = -2;
    shotCtx.fill();
    shotCanvas.refresh();

    this.load.image('shot');
  }

  private createHanabiShots() {
    const { width } = this.sys.game.canvas;

    const firstShot = this.physics.add.sprite(width / 2, 0, 'shot');
    firstShot.setVelocity(0, 100);
    this.physics.add.collider(this.player, firstShot, this.gameOver.bind(this));

    this.timerEvents.push(this.time.addEvent({
      callback: () => {
        const { x, y } = firstShot;
        firstShot.destroy();
        const length = 16; // 4 + (3 * 4)
        const initialSpeed = 200;
        const sparkTTL = 3;
        for (let i=0; i<length; i++) {
          const spark = this.physics.add.sprite(x, y, 'shot');
          const angle = 2 * Math.PI * (i / (length - 1));
          spark.setVelocity(Math.cos(angle) * initialSpeed, Math.sin(angle) * initialSpeed);
          spark.setRotation(angle - (Math.PI / 2));
          spark.setAcceleration(-Math.cos(angle) * (initialSpeed / sparkTTL), -Math.sin(angle) * (initialSpeed / sparkTTL));
          this.physics.add.collider(this.player, spark, this.gameOver.bind(this));
          this.timerEvents.push(this.time.addEvent({
            callback: () => {
              spark.destroy();
            },
            delay: sparkTTL * 1000,
            loop: false,
          }));

          this.tweens.add({
            targets: [spark],
            alpha: 0,
            duration: sparkTTL * 1000,
            ease: 'Power2',
          });
        }
      },
      callbackScope: this,
      delay: 3000,
      loop: false,
    }));
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
  }
}