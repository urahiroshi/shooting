import * as Phaser from "phaser"

export class GameOver extends Phaser.Scene {
  static KEY = 'game-over';
  private spaceKey: Phaser.Input.Keyboard.Key;

  public init() {
    window.location.hash = GameOver.KEY;
  }

  public preload() {
  }

  public create() {
    const { height } = this.sys.game.canvas;
    this.add.text(10, height / 2 - 24, 'GAME OVER', { fontFamily: 'sans-serif', fontSize: '48px' });
    this.add.text(10, (height / 2) + 24, 'Please click space key to continue', { fontFamily: 'sans-serif', fontSize: '24px' });
    this.spaceKey = this.input.keyboard.addKey('SPACE');
  }

  public update() {
    if (this.spaceKey.isDown) { 
      this.scene.start('game');
    }
  }
}