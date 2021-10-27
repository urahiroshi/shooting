import * as Phaser from "phaser";
import { Game } from "./game";
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

    this.scene.add(Game.KEY, Game, false);
    this.scene.add(GameOver.KEY, GameOver, false);
    if (window.location.hash === `#${GameOver.KEY}`) {
      this.scene.start(GameOver.KEY);
    } else {
      this.scene.start(Game.KEY);
    }
  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};