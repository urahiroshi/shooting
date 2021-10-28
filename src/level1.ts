import * as Phaser from "phaser"
import { LevelBase } from "./levelBase";

export class Level1 extends LevelBase {
  static KEY = 'level1';
  
  private balls: Phaser.Physics.Arcade.Group;
  private rectangle: Phaser.Geom.Rectangle;

  public init() {
    this._init(Level1.KEY, 30);
  }

  public preload() {
    this._preload();
    this.load.image('circle_blue', 'circle_blue.png');
    this.load.image('circle_green', 'circle_green.png');
    this.load.image('square', 'square10x.png');
  }

  private createStraightShots() {
    this.balls = this.physics.add.group({
      velocityX: 0,
      velocityY: 100,
    });

    this.timerEvents.push(this.time.addEvent({
      callback: () => {
        const randomPoint = this.rectangle.getRandomPoint();
        this.balls.create(randomPoint.x, randomPoint.y, 'circle_green');
      },
      callbackScope: this,
      delay: 100,
      loop: true,
    }));
  }

  private createCircleShots() {
    this.timerEvents.push(this.time.addEvent({
      callback: () => {
        const randomPoint = this.rectangle.getRandomPoint();
        const length = 7;
        for (let i=0; i<length; i++) {
          const circle = this.physics.add.sprite(randomPoint.x, randomPoint.y, 'circle_blue');
          const angle = Math.PI * (i / (length - 1));
          circle.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150);
          this.physics.add.collider(this.player, circle, this.gameOver.bind(this));
        }
      },
      callbackScope: this,
      delay: 1000,
      loop: true,
    }));
  }

  public create() {
    this._create('Level 1');
    const { width } = this.sys.game.canvas;
    this.rectangle = new Phaser.Geom.Rectangle(0, 0, width, 0);

    this.createStraightShots();
    this.createCircleShots();

    // it should be called after addEvent
    this.physics.add.collider(this.player, this.balls, this.gameOver.bind(this));
  }

  public update() {
    this._update('level2');
  }
}