//@ts-ignore: ignore import errors because its dynamicly loaded from pdfdataextractor
import { Canvas, createCanvas } from '@napi-rs/canvas';
import { CanvasApi } from './canvasapi';

/**
 * implementation for node-skia
 */
export class NodeSkiaCanvas implements CanvasApi {
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
		return this.canvas.encode('png');
	}
	/**
	 * @internal
	 */
	public toJPEG(quality?: number): Promise<Buffer> {
		return this.canvas.encode('jpeg', quality);
	}
	/**
	 * @internal
	 */
	public createContext(): CanvasRenderingContext2D {
		return this.canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
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