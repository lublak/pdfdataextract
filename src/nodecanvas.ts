//@ts-ignore: ignore import errors because its dynamicly loaded from pdfdataextractor
import { Canvas, createCanvas, JpegConfig } from 'canvas';
import { promisify } from 'util';
import { CanvasApi } from './canvasfactory';

/**
 * default implementation for node-canvas
 * look at the {CanvasApi} doc
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
	public createContext(): CanvasRenderingContext2D {
		return this.canvas.getContext('2d') as any as CanvasRenderingContext2D;
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