import * as Phaser from "phaser"
import { LevelBase } from "./levelBase";
import { HanabiCircle } from "./canvas/HanabiCircle";
import { StraightShot } from "./canvas/StraightShot";
import { CanvasObject } from "./canvas/CanvasObject";
import { Position } from "./types";
export class Level2 extends LevelBase {
  static KEY = 'level2';
  
  private balls: Phaser.Physics.Arcade.Group;
  private rectangle: Phaser.Geom.Rectangle;
  private ctx: CanvasRenderingContext2D;
  private canvas: Phaser.Textures.CanvasTexture;
  private objects: CanvasObject[];

  public init() {
    this._init(Level2.KEY, 30);
    this.objects = [];
  }

  public preload() {
    this._preload();
    this.load.image('square', 'square10x.png');

    this.canvas = this.textures.createCanvas('shot', 800, 600);
    this.ctx = this.canvas.context;
    this.load.image('shot');
  }

  private createHanabiShot(color: string, endPos: Position, radius: number, startTime: number) {
    this.objects.push(new StraightShot(this.ctx, color, { x: endPos.x, y: 0 }, endPos, startTime, startTime + 3000));
    this.objects.push(new HanabiCircle(this.ctx, color, endPos, radius, startTime + 3000, startTime + 6000));
  }

  private createHanabiShots() {
    const colors = ['#0000ee', '#00ee00', '#00eeee', '#ee0000', '#ee00ee', '#eeee00'];
    const randomColor = () => colors[Math.floor(Math.random() * 6)];
    const randomPos = () => ({ x: Math.floor(Math.random() * 600) + 100, y: Math.floor(Math.random() * 400) + 100 });

    const { width, height } = this.sys.game.canvas;

    const canvasImage = this.add.image(width / 2, height / 2, 'shot');
    canvasImage.depth = -1000;
    this.createHanabiShot(randomColor(), { x: 400, y: 300 }, 250, 0);
    this.createHanabiShot(randomColor(), { x: 600, y: 400 }, 300, 3000);
    this.createHanabiShot(randomColor(), { x: 200, y: 200 }, 200, 4000);
    this.createHanabiShot(randomColor(), { x: 500, y: 500 }, 250, 5000);
    this.createHanabiShot(randomColor(), { x: 400, y: 300 }, 250, 6000);
    this.createHanabiShot(randomColor(), { x: 200, y: 300 }, 250, 7000);
    this.createHanabiShot(randomColor(), { x: 600, y: 300 }, 250, 8000);
    this.createHanabiShot(randomColor(), { x: 100, y: 400 }, 250, 10000);
    this.createHanabiShot(randomColor(), { x: 400, y: 400 }, 250, 10000);
    this.createHanabiShot(randomColor(), { x: 700, y: 400 }, 250, 10000);
    for (let i=0; i<5; i++) {
      this.createHanabiShot(randomColor(), randomPos(), 200, 13000 + i * 1000);
      this.createHanabiShot(randomColor(), randomPos(), 200, 13000 + i * 1000);
    }
    for (let i=0; i<5; i++) {
      this.createHanabiShot(randomColor(), randomPos(), 250, 18000 + i * 1000);
      this.createHanabiShot(randomColor(), randomPos(), 250, 18000 + i * 1000);
    }
  }

  public create() {
    this._create('Level 2');
    const { width } = this.sys.game.canvas;
    this.rectangle = new Phaser.Geom.Rectangle(0, 0, width, 0);

    this.createHanabiShots();

    // it should be called after addEvent
    this.physics.add.collider(this.player, this.balls, this.gameOver.bind(this));
  }

  public update() {
    this._update();

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
    const { width, height } = this.sys.game.canvas;
    this.ctx.fillRect(0, 0, width, height);

    const elapsedTime = Date.now() - this.startTime;
    this.objects.forEach((obj) => { obj.update(elapsedTime); });
	
    this.canvas.refresh();

    const imageData = this.ctx.getImageData(this.player.x, this.player.y, 1, 1).data;
    if (imageData[0] >= 128 || imageData[1] >= 128 || imageData[2] >= 128) {
      this.add.text(10, 300 - 24, 'BOMB!!', { fontFamily: 'sans-serif', fontSize: '48px' });
    }
  }
}