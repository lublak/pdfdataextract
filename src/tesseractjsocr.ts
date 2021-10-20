//@ts-ignore
//ignore import errors because its dynamicly loaded from pdfdataextractor
import { createScheduler, createWorker, RecognizeResult, Scheduler, Worker } from 'tesseract.js';
import { OCRLang } from './types';

export async function tesseractBuffers(buffers: Buffer[], langs: OCRLang[]) {
  const lang: string = langs.join('+');
	const scheduler: Scheduler = createScheduler();
	for (let i: number = 0; i < buffers.length; i++) {
		const worker: Worker = createWorker();
		await worker.load();
		await worker.loadLanguage(lang);
		await worker.initialize(lang);
		scheduler.addWorker(worker);
	}
	const result: RecognizeResult[] = await Promise.all(buffers.map(async (buffer: Buffer) => scheduler.addJob('recognize', buffer))) as RecognizeResult[];
	await scheduler.terminate();
	return result.map((r: RecognizeResult) => r.data.text);
}

export async function tesseractBuffer(buffer:Buffer, langs: OCRLang[]) {
  const lang: string = langs.join('+');
	const worker: Worker = createWorker();
	await worker.load();
	await worker.loadLanguage(lang);
	await worker.initialize(lang);
	const data: RecognizeResult = await worker.recognize(buffer);
	await worker.terminate();
	return data.data.text;
}