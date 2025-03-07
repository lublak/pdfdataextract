import { OCRLang } from './types';

export type OcrApiConstructor<T extends OcrApi> = { new(): T };

export interface OcrApi {
	/**
	 * recognize characters of buffers
	 * 
	 * @param {Buffer[]} buffers - the image buffers
	 * @param {OCRLang[]} langs - the language traineddata used for recognition
	 * @returns {Promise<string[]>} an array with text from each side
	 */
	ocrBuffers(buffers: Buffer[], langs: OCRLang[]): Promise<string[]>;
}