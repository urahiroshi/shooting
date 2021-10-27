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
  static KEY = 'game';
  
  private balls: Phaser.Physics.Arcade.Group;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private rectangle: Phaser.Geom.Rectangle;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private timerText: Phaser.GameObjects.Text;
  private startTime: number;
  private clearTime: number;
  private cleared: boolean;
  private timerEvents: Phaser.Time.TimerEvent[];

  public init() {
    window.location.hash = Game.KEY;
    this.clearTime = 30;
    this.cleared = false;
    this.timerEvents = [];
  }

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

  private gameOver() {
    this.scene.start('game-over');
  }

  private createTimer(width: number) {
    this.timerText = this.add.text(width - 60, 20, String(this.clearTime), { fontFamily: 'sans-serif', fontSize: '32px' });
    this.startTime = Date.now();
  }

  public create() {
    const { width, height } = this.sys.game.canvas;
    this.rectangle = new Phaser.Geom.Rectangle(0, 0, width, 0);

    this.player = this.physics.add.sprite(width * 0.5, height - 5, 'square');
    this.player.body.immovable = true;

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.createStraightShots();
    this.createCircleShots();

    this.createTimer(width);

    // it should be called after addEvent
    this.physics.add.collider(this.player, this.balls, this.gameOver.bind(this));
  }

  private updateTimer() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.trunc(this.clearTime - (elapsedTime / 1000));
    const displayTime = remainingTime > 0 ? String(remainingTime) : '0';
    this.timerText.setText(displayTime);
    return remainingTime;
  }

  public update() {
    if (this.cleared) { return; }

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

    const remainingTime = this.updateTimer();
    if (remainingTime <= 0) {
      this.clear();
    }
  }

  private clear() {
    this.cleared = true;
    this.timerEvents.forEach((timerEvent) => {
      timerEvent.destroy();
    });
    this.physics.pause();
    const { height } = this.sys.game.canvas;
    this.add.text(20, (height / 2) - 20, 'CLEAR!!', { fontFamily: 'sans-serif', fontSize: '40px' });
  }
}