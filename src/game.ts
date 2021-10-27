import * as Phaser from "phaser"

let isGameOver = false;
const gameOver = () => {
  if (!isGameOver) {
    isGameOver = true;
    alert('game over');
    location.reload();
  }
}
export class Game extends Phaser.Scene {
  private balls: Phaser.Physics.Arcade.Group;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private rectangle: Phaser.Geom.Rectangle;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  public init() { }

  public preload() {
    this.load.setBaseURL('assets');
    this.load.image('circle_blue', 'circle_blue.png');
    this.load.image('circle_green', 'circle_green.png');
    this.load.image('square', 'square10x.png');
  }

  private createStraightShots() {
    this.balls = this.physics.add.group({
      velocityX: 0,
      velocityY: 100,
    });

    this.time.addEvent({
      callback: () => {
        const randomPoint = this.rectangle.getRandomPoint();
        this.balls.create(randomPoint.x, randomPoint.y, 'circle_green');
      },
      callbackScope: this,
      delay: 100,
      loop: true,
    });
  }

  private createCircleShots() {
    this.time.addEvent({
      callback: () => {
        const randomPoint = this.rectangle.getRandomPoint();
        const length = 7;
        for (let i=0; i<length; i++) {
          const circle = this.physics.add.sprite(randomPoint.x, randomPoint.y, 'circle_blue');
          const angle = Math.PI * (i / (length - 1));
          circle.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150);
          this.physics.add.collider(this.player, circle, gameOver);
        }
      },
      callbackScope: this,
      delay: 1000,
      loop: true,
    });
  }

  public create() {
    const { width, height } = this.sys.game.canvas;
    this.rectangle = new Phaser.Geom.Rectangle(0, 0, width, 0);

    this.player = this.physics.add.sprite(width * 0.5, height - 5, 'square');
    this.player.body.immovable = true;

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.createStraightShots();
    this.createCircleShots();

    // it should be called after addEvent
    this.physics.add.collider(this.player, this.balls, gameOver);
  }

  public update() {
    if (this.cursorKeys.left.isDown) {
      this.player.x -= 2;
    } else if (this.cursorKeys.right.isDown) {
      this.player.x += 2;
    }
    if (this.cursorKeys.up.isDown) {
      this.player.y -= 2;
    } else if (this.cursorKeys.down.isDown) {
      this.player.y += 2;
    }
  }
}