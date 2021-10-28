import * as Phaser from "phaser";
import { Level1 } from "./level1";
import { Level2 } from "./level2";
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

    this.scene.add(GameOver.KEY, GameOver, false);
    const LevelClasses = [Level1, Level2];
    for (let LevelClass of LevelClasses) {
      this.scene.add(LevelClass.KEY, LevelClass, false);
    }
    for (let LevelClass of LevelClasses) {
      if (`#${LevelClass.KEY}` === window.location.hash) {
        this.scene.start(LevelClass.KEY);
        return;
      }
    }
    this.scene.start(Level1.KEY);
  }
}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};