export type CanvasApiConstructor<T extends CanvasApi> = { new(width: number, height: number): T };

export interface CanvasApi {
	/**
	 * create the 2d context of the canvas
	 * 
	 * @returns canvas 2d context
	 */
	createContext(): CanvasRenderingContext2D;
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
	toJPEG(quality?: number): Promise<Buffer>;
}