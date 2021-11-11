import { Position } from '../types';
import { CanvasObject } from './CanvasObject';

export class HanabiCircle implements CanvasObject {
  private _ctx: CanvasRenderingContext2D;
  private _color: string;
  private _centerPos: Position;
  private _radius: number;
  private _startTime: number;
  private _endTime: number;
  private _shots: any[] = [];
  private _shotsCount = 150;

  private random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  public constructor(
    ctx: CanvasRenderingContext2D,
    color: string,
    centerPos: Position,
    radius: number,
    startTime: number,
    endTime: number,
  ) {
    this._radius = radius;
    this._ctx = ctx;
    this._color = color;
    this._startTime = startTime;
    this._endTime = endTime;
    this._centerPos = centerPos;

    for (let i = 0; i < this._shotsCount; i++) {
      this._shots.push({
        color: this._color,
        rand: this.random(0,10),
        size: this.random(1,5),
        angle: this.random(0, 359),
        lastPos: {...centerPos},
      });
    }
  }

  public update(elapsedTime: number) {
    if (elapsedTime < this._startTime || elapsedTime > this._endTime) {
      return;
    }

    const flightTime = 1000;
    const expandTime = this._endTime - this._startTime - flightTime;
    const currentRadius = (elapsedTime - this._startTime) > expandTime ?
      this._radius :
      this._radius * Math.sin(0.5 * Math.PI * (elapsedTime - this._startTime) / expandTime);

    this._ctx.globalCompositeOperation = 'lighter';

    for (const shot of this._shots) {
      this._ctx.strokeStyle = shot.color;
      this._ctx.lineWidth = shot.size;
      this._ctx.beginPath();
      
      const angle = shot.angle + Math.sin((elapsedTime * shot.rand) / 2000) * 5;
      const x = this._centerPos.x + currentRadius * Math.cos(Math.PI * angle / 180);
      const y = this._centerPos.y + currentRadius * Math.sin(Math.PI * angle / 180);
      
      this._ctx.moveTo(shot.lastPos.x, shot.lastPos.y);
      this._ctx.lineTo(x, y);
      
      shot.lastPos = { x, y };
      this._ctx.stroke();
    }
  }



}
