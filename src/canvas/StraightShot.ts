import { Position } from '../types';
import { CanvasObject } from './CanvasObject';

export class StraightShot implements CanvasObject {
  private _ctx: CanvasRenderingContext2D;
  private _pos: Position;
  private _startPos: Position;
  private _endPos: Position;
  private _startTime: number;
  private _endTime: number;

  public constructor(ctx: CanvasRenderingContext2D, startPos: Position, endPos: Position, startTime: number, endTime: number) {
    this._ctx = ctx;
    this._startPos = startPos;
    this._endPos = endPos;
    this._pos = {...this._startPos};
    this._startTime = startTime;
    this._endTime = endTime;
  }
  
  public update(elapsedTime: number) {
    if (elapsedTime < this._startTime || elapsedTime > this._endTime) {
      return;
    }

    this._ctx.globalCompositeOperation = 'lighter';

    this._ctx.strokeStyle = 'rgba(0, 228, 233, 1)';
    this._ctx.lineWidth = 5;
    this._ctx.beginPath();

    const x = this._startPos.x + (this._endPos.x - this._startPos.x) * ((elapsedTime - this._startTime) / (this._endTime - this._startTime));
    const y = this._startPos.y + (this._endPos.y - this._startPos.y) * ((elapsedTime - this._startTime) / (this._endTime - this._startTime));

    this._ctx.moveTo(this._pos.x, this._pos.y);
    this._ctx.lineTo(x, y);
    this._pos = { x, y };
    
    this._ctx.stroke();
  }
}