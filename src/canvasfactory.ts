import { Canvas, createCanvas, JpegConfig } from 'canvas';
import { encodeJPEGToStream, encodePNGToStream, make } from 'pureimage';
import { Bitmap } from 'pureimage/types/bitmap';
import { PassThrough } from 'stream';
import { promisify } from 'util';

export interface CanvasApi {
  createContext():any;
  reset(width:number, height:number):void;
  destroy():void;
  toPNG():Promise<Buffer>;
  toJPEG(quality: number):Promise<Buffer>;
}

export class NodeCanvas implements CanvasApi {
  canvas:Canvas;
  public constructor(width: number, height: number) {
    this.canvas = createCanvas(width, height);
  }
  public toPNG(): Promise<Buffer> {
    return promisify<'image/png', Buffer>(this.canvas.toBuffer)('image/png');
  }
  public toJPEG(quality: number): Promise<Buffer> {
    return promisify<'image/jpeg', JpegConfig, Buffer>(this.canvas.toBuffer)('image/jpeg', {
			quality: quality
		});
  }
  public createContext(): any {
    return this.canvas.getContext('2d');
  }
  public reset(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }
  public destroy(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
  }

}

export class PureimageCanvas implements CanvasApi {
  bitmap:Bitmap;
  public constructor(width: number, height: number) {
    this.bitmap = make(width, height, null);
  }
  public async toPNG(): Promise<Buffer> {
    const result: Uint8Array[] = [];
		const stream: PassThrough = new PassThrough();
		stream.on('data', (data: Uint8Array) => result.push(data));
		await encodePNGToStream(this.bitmap, stream);
		return Buffer.concat(result);
  }
  public async toJPEG(quality: number): Promise<Buffer> {
    const result: Uint8Array[] = [];
		const stream: PassThrough = new PassThrough();
		stream.on('data', (data: Uint8Array) => result.push(data));
		await encodeJPEGToStream(this.bitmap, stream, quality);
		return Buffer.concat(result);
  }
  public createContext() {
    return this.bitmap.getContext('2d');
  }
  public reset(width: number, height: number): void {
    this.bitmap.width = width;
    this.bitmap.height = height;
  }
  public destroy(): void {
    this.bitmap.width = 0;
    this.bitmap.height = 0;
  }
}

export class CanvasFactory {
  static canvas:{ new(width: number, height: number): CanvasApi } = NodeCanvas;
  public constructor() {

  }
  public reset(canvasAndContext: {
    canvas:CanvasApi | null,
    context:any
  }, width: number, height: number): void {
    if(!canvasAndContext.canvas) throw new Error('Canvas is not specified');
    if (width <= 0 || height <= 0) throw new Error('Invalid canvas size');
    canvasAndContext.canvas.reset(width, height);
  }
  public destroy(canvasAndContext: {
    canvas:CanvasApi | null,
    context:any
  }): void {
    if(!canvasAndContext.canvas) throw new Error('Canvas is not specified');
    canvasAndContext.canvas.destroy();
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}