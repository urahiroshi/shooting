import * as Phaser from "phaser";
import { Game } from "./game";

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

    this.scene.add("game", Game, false);
    this.scene.start("game");
  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};