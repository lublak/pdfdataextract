import { OCRLang } from './types';

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

/**
 * The factory for ocr (used to text from a pdf)
 */
export class OcrFactory {
	/**
	 * the class to create the {OcrApi} defaults to tesseractjsocr if installed
	 */
	static ocrApi?: { new(): OcrApi } | null;
}