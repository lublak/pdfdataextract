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
	toJPEG(quality: number): Promise<Buffer>;
}

/**
 * The factory for the canvas (used to create an image from a pdf)
 */
export class CanvasFactory {
	/**
	 * the class to create the {CanvasApi} defaults to node-canvas or pureimage if installed
	 */
	static canvasApi: { new(width: number, height: number): CanvasApi } | null = null;
	/**
	 * @internal
	 */
	public reset(canvasAndContext: {
		canvas: CanvasApi | null,
		context: CanvasRenderingContext2D | null
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
		context: CanvasRenderingContext2D | null
	}): void {
		if (!canvasAndContext.canvas) throw new Error('Canvas is not specified');
		canvasAndContext.canvas.destroy();
		canvasAndContext.canvas = null;
		canvasAndContext.context = null;
	}
}