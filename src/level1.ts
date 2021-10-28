import * as Phaser from "phaser"

export class Level1 extends Phaser.Scene {
  static KEY = 'level1';
  
  private balls: Phaser.Physics.Arcade.Group;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private rectangle: Phaser.Geom.Rectangle;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private timerText: Phaser.GameObjects.Text;
  private startTime: number;
  private clearTime: number;
  private cleared: boolean;
  private timerEvents: Phaser.Time.TimerEvent[];
  private spaceKey: Phaser.Input.Keyboard.Key;

  public init() {
    window.location.hash = Level1.KEY;
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
    this.timerText = this.add.text(width - 55, 10, String(this.clearTime), { fontFamily: 'sans-serif', fontSize: '32px' });
    this.startTime = Date.now();
  }

  private showLevelText() {
    this.add.text(10, 10, "Level 1", { fontFamily: 'sans-serif', fontSize: '16px' });
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
    this.showLevelText();

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
    if (this.cleared) {
      if (this.spaceKey.isDown) { 
        this.scene.start('level2');
      }
      return;
    }

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
    this.add.text(10, height / 2 - 24, 'CLEAR!!', { fontFamily: 'sans-serif', fontSize: '48px' });
    this.add.text(10, (height / 2) + 24, 'Please click space key to move next stage', { fontFamily: 'sans-serif', fontSize: '24px' });
    this.spaceKey = this.input.keyboard.addKey('SPACE');
  }
}