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

    const shotCanvas = this.textures.createCanvas('shot', 10, 10);
    const shotCtx = shotCanvas.context;
    shotCtx.fillStyle = '#cccc00';
    shotCtx.beginPath();
    shotCtx.arc(5, 5, 5, 0, Math.PI * 2);
    shotCtx.fill();
    shotCanvas.refresh();

    this.add.image(0, 0, 'shot');
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
        for (let i=0; i<length; i++) {
          const spark = this.physics.add.sprite(x, y, 'shot');
          const angle = 2 * Math.PI * (i / (length - 1));
          spark.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150);
          this.physics.add.collider(this.player, spark, this.gameOver.bind(this));
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