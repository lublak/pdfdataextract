//@ts-ignore: ignore import errors because its dynamicly loaded from pdfdataextractor
import { createScheduler, createWorker, RecognizeResult, Scheduler, Worker } from 'tesseract.js';
import { OcrApi } from './ocrfactory';
import { OCRLang } from './types';

/**
 *
 */
export class TesseractJsOcr implements OcrApi {
	/**
	 * recognize characters of buffers
	 * 
	 * @param {Buffer[]} buffers - the image buffers
	 * @param {OCRLang[]} langs - the language traineddata used for recognition
	 * @returns {Promise<string[]>} an array with text from each side
	 */

	/**
	 *
	 * @param buffers
	 * @param langs
	 */
	async ocrBuffers(buffers: Buffer[], langs: OCRLang[]): Promise<string[]> {
		if (buffers.length == 0) return [];
		if (buffers.length == 1) {
			const lang: string = langs.join('+');
			const worker: Worker = await createWorker(lang);
			const data: RecognizeResult = await worker.recognize(buffers[0]);
			await worker.terminate();
			return [data.data.text];
		}
		const lang: string = langs.join('+');
		const scheduler: Scheduler = createScheduler();
		for (let i: number = 0; i < buffers.length; i++) {
			const worker: Worker = await createWorker(lang);
			scheduler.addWorker(worker);
		}
		const result: RecognizeResult[] = await Promise.all(buffers.map(async (buffer: Buffer) => scheduler.addJob('recognize', buffer))) as RecognizeResult[];
		await scheduler.terminate();
		return result.map((r: RecognizeResult) => r.data.text);
	}
}