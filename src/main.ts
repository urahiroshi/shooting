import * as Phaser from "phaser";
import { Level1 } from "./level1";
import { GameOver } from "./game-over";

class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 800,
      height: 600,
      backgroundColor: '#222',
      physics: {
        default: 'arcade',
      },
    };
    super(config);

    this.scene.add(Level1.KEY, Level1, false);
    this.scene.add(GameOver.KEY, GameOver, false);
    this.scene.start(Level1.KEY);
  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};