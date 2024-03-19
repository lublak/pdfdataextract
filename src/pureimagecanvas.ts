//@ts-ignore: ignore import errors because its dynamicly loaded from pdfdataextractor
import { encodeJPEGToStream, encodePNGToStream, make } from 'pureimage';
//@ts-ignore: ignore import errors because its dynamicly loaded from pdfdataextractor
import { Bitmap } from 'pureimage/types/bitmap';
import { PassThrough } from 'stream';
import { CanvasApi } from './canvasfactory';

/**
 * default implementation for pureimage
 * look at the {CanvasApi} doc
 */
export class PureimageCanvas implements CanvasApi {
	private bitmap: Bitmap;
	/**
	 * @internal
	 */
	public constructor(width: number, height: number) {
		this.bitmap = make(width, height);
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
	public createContext(): CanvasRenderingContext2D {
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