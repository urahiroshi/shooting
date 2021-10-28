import * as Phaser from "phaser"

export class LevelBase extends Phaser.Scene {
  protected player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  protected cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  protected timerText: Phaser.GameObjects.Text;
  protected startTime: number;
  protected clearTime: number;
  protected cleared: boolean;
  protected timerEvents: Phaser.Time.TimerEvent[];
  protected spaceKey: Phaser.Input.Keyboard.Key;

  protected gameOver() {
    this.scene.start('game-over');
  }

  /*
    Please call this method in `init()`
  */
  protected _init(key: string, clearTime: number) {
    window.location.hash = key;
    this.clearTime = clearTime;
    this.cleared = false;
    this.timerEvents = [];
  }

  /*
    Please call this method in `preload()`
  */
  protected _preload() {
    this.load.setBaseURL('assets');
  }

  protected createTimer(width: number) {
    this.timerText = this.add.text(width - 55, 10, String(this.clearTime), { fontFamily: 'sans-serif', fontSize: '32px' });
    this.startTime = Date.now();
  }

  protected showLevelText(text: string) {
    this.add.text(10, 10, text, { fontFamily: 'sans-serif', fontSize: '16px' });
  }

  /*
    Please call this method in `create()`
  */
  protected _create(levelText: string) {
    const { width, height } = this.sys.game.canvas;

    this.player = this.physics.add.sprite(width * 0.5, height - 5, 'square');
    this.player.body.immovable = true;

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.createTimer(width);
    this.showLevelText(levelText);
  }

  private updateTimer() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.trunc(this.clearTime - (elapsedTime / 1000));
    const displayTime = remainingTime > 0 ? String(remainingTime) : '0';
    this.timerText.setText(displayTime);
    return remainingTime;
  }

  protected clear(hasNextLevel: boolean) {
    this.cleared = true;
    this.timerEvents.forEach((timerEvent) => {
      timerEvent.destroy();
    });
    this.physics.pause();
    const { height } = this.sys.game.canvas;
    this.add.text(10, height / 2 - 24, 'CLEAR!!', { fontFamily: 'sans-serif', fontSize: '48px' });
    if (hasNextLevel) {
      this.add.text(10, (height / 2) + 24, 'Please click space key to move next stage', { fontFamily: 'sans-serif', fontSize: '24px' });
      this.spaceKey = this.input.keyboard.addKey('SPACE');
    }
  }

  /*
    Please call this method in `update()`
  */
  protected _update(nextLevel?: string) {
    if (this.cleared) {
      if (this.spaceKey.isDown && nextLevel) { 
        this.scene.start(nextLevel);
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
      this.clear(!!nextLevel);
    }
  }
}