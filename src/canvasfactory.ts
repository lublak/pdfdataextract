import { Canvas, createCanvas, JpegConfig } from 'canvas';
import { encodeJPEGToStream, encodePNGToStream, make } from 'pureimage';
import { Bitmap } from 'pureimage/types/bitmap';
import { PassThrough } from 'stream';
import { promisify } from 'util';

export interface CanvasApi {
	/**
	 * create the 2d context of the canvas
	 * 
	 * @returns canvas 2d context
	 */
	createContext(): object;
	/**
	 * resets the canvas to the give size
	 * 
	 * @param {number} width - the canvas width
	 * @param {number} height - the canvas height
	 */
	reset(width: number, height: number): void;
	/**
	 * destroys the canvas
	 */
	destroy(): void;
	/**
	 * converts the canvas to a png
	 * 
	 * @returns the image as a {Buffer}
	 */
	toPNG(): Promise<Buffer>;
	/**
	 * converts the canvas to a jpeg
	 * 
	 * @param {number} quality - the quality of the jpeg
	 * @returns the image as a {Buffer}
	 */
	toJPEG(quality: number): Promise<Buffer>;
}

/**
 * default implementation for node-canvas
 */
export class NodeCanvas implements CanvasApi {
	private canvas: Canvas;
	/**
	 * @internal
	 */
	public constructor(width: number, height: number) {
		this.canvas = createCanvas(width, height);
	}
	/**
	 * @internal
	 */
	public toPNG(): Promise<Buffer> {
		return promisify<'image/png', Buffer>(this.canvas.toBuffer)('image/png');
	}
	/**
	 * @internal
	 */
	public toJPEG(quality: number): Promise<Buffer> {
		return promisify<'image/jpeg', JpegConfig, Buffer>(this.canvas.toBuffer)('image/jpeg', {
			quality: quality
		});
	}
	/**
	 * @internal
	 */
	public createContext(): object {
		return this.canvas.getContext('2d');
	}
	/**
	 * @internal
	 */
	public reset(width: number, height: number): void {
		this.canvas.width = width;
		this.canvas.height = height;
	}
	/**
	 * @internal
	 */
	public destroy(): void {
		this.canvas.width = 0;
		this.canvas.height = 0;
	}

}

/**
 * default implementation for pureimage
 */
export class PureimageCanvas implements CanvasApi {
	private bitmap: Bitmap;
	/**
	 * @internal
	 */
	public constructor(width: number, height: number) {
		this.bitmap = make(width, height, null);
	}
	/**
	 * @internal
	 */
	public async toPNG(): Promise<Buffer> {
		const result: Uint8Array[] = [];
		const stream: PassThrough = new PassThrough();
		stream.on('data', (data: Uint8Array) => result.push(data));
		await encodePNGToStream(this.bitmap, stream);
		return Buffer.concat(result);
	}
	/**
	 * @internal
	 */
	public async toJPEG(quality: number): Promise<Buffer> {
		const result: Uint8Array[] = [];
		const stream: PassThrough = new PassThrough();
		stream.on('data', (data: Uint8Array) => result.push(data));
		await encodeJPEGToStream(this.bitmap, stream, quality);
		return Buffer.concat(result);
	}
	/**
	 * @internal
	 */
	public createContext(): object {
		return this.bitmap.getContext('2d');
	}
	/**
	 * @internal
	 */
	public reset(width: number, height: number): void {
		this.bitmap.width = width;
		this.bitmap.height = height;
	}
	/**
	 * @internal
	 */
	public destroy(): void {
		this.bitmap.width = 0;
		this.bitmap.height = 0;
	}
}

/**
 * The factory for the canvas (used to create an image from a pdf)
 */
export class CanvasFactory {
	/**
	 * the class to create the canvasapi defaults to pureimage or if installed node-canvas
	 */
	static canvasApi: { new(width: number, height: number): CanvasApi } = NodeCanvas;
	/**
	 * @internal
	 */
	public reset(canvasAndContext: {
		canvas: CanvasApi | null,
		context: object | null
	}, width: number, height: number): void {
		if (!canvasAndContext.canvas) throw new Error('Canvas is not specified');
		if (width <= 0 || height <= 0) throw new Error('Invalid canvas size');
		canvasAndContext.canvas.reset(width, height);
	}
	/**
	 * @internal
	 */
	public destroy(canvasAndContext: {
		canvas: CanvasApi | null,
		context: object | null
	}): void {
		if (!canvasAndContext.canvas) throw new Error('Canvas is not specified');
		canvasAndContext.canvas.destroy();
		canvasAndContext.canvas = null;
		canvasAndContext.context = null;
	}
}