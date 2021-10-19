import { PDFOperatorList, PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
import { NodeCanvasFactory } from 'pdfjs-dist/types/src/display/node_utils';
import { OCRLang, Sort } from './types';
import { Canvas, createCanvas, JpegConfig } from 'canvas';
// import { encodeJPEGToStream, encodePNGToStream, make } from 'pureimage';
import { promisify } from 'util';
import { createScheduler, createWorker, RecognizeResult, Scheduler, Worker } from 'tesseract.js';
//import { PassThrough } from 'stream';
//import { Bitmap } from 'pureimage/types/bitmap';
import { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';

/**
 * pdf data information per page
 */
export class PdfPageData {
	/**
	 * create a {PdfPageData} from a pdfjs based {PDFPageProxy}
	 *
	 * @param {PDFPageProxy} page - the page from pdfjs
	 */
	public constructor(private page: PDFPageProxy) {}

	/**
	 * get the text of the page
	 * 
	 * @param {boolean|Sort} [sort=false] - sort the text by text coordinates
	 * @returns {Promise<string>} a promise that is resolved with a {string} with the extracted text of the page
	 */
	public async toText(sort: boolean | Sort = false): Promise<string> {
		const sortOption: Sort | null = typeof sort === 'boolean' ? (sort ? Sort.ASC : null) : sort;
		return this.page.getTextContent({
			disableCombineTextItems: false,
			normalizeWhitespace: false,
			includeMarkedContent: false
		}).then((textContent: TextContent)  => {
			const items: TextItem[] = textContent.items as TextItem[];
			/*
				transform is a array with a transform matrix [scale x,shear x,shear y,scale y,offset x, offset y]
			
				0,1         1,1
				  -----------
				  |         |
				  |         |
				  |   pdf   |
				  |         |
				  |         |
				  -----------
				0,0         1,0
			*/

			//coordinate based sorting
			if (sortOption !== null) {
				if (sortOption === Sort.ASC) {
					items.sort((e1: TextItem, e2: TextItem) => {
						if (e1.transform[5] < e2.transform[5]) return 1;
						else if (e1.transform[5] > e2.transform[5]) return -1;
						else if (e1.transform[4] < e2.transform[4]) return -1;
						else if (e1.transform[4] > e2.transform[4]) return 1;
						else return 0;
					});
				} else {
					items.sort((e1: TextItem, e2: TextItem) => {
						if (e1.transform[5] < e2.transform[5]) return -1;
						else if (e1.transform[5] > e2.transform[5]) return 1;
						else if (e1.transform[4] < e2.transform[4]) return 1;
						else if (e1.transform[4] > e2.transform[4]) return -1;
						else return 0;
					});
				}
			}

			let lastLineY: number = -1, text: string = '';
			for (const item of items) {
				if (lastLineY === -1 || lastLineY == item.transform[5]) {
					text += item.str;
					// TODO if spaced by coordinates (x + text width + space width = next x)
					//textContent.styles[item.fontName];
					//dummyContext.font = '';
					//dummyContext.measureText(item.str);
				} else {
					text += '\n' + item.str;
				}
				lastLineY = item.transform[5];
			}
			return text;
		}, () => '');
	}

	/**
	 * recognizes the text from the image information of several pdf pages
	 * requires node-canvas/node-pureimage and tesseract.js as additional installation
	 * 
	 * @param {PdfPageData} pages - the pages from which the text is to be read out
	 * @param {OCRLang[]} langs - the language libraries used for recognition
	 * @returns {Promise<string[]>} an array with text from each side
	 */
	public static async ocr(pages: PdfPageData[], langs: OCRLang[]): Promise<string[]> {
		const lang: string = langs.join('+');
		const scheduler: Scheduler = createScheduler();
		for (let i: number = 0; i < pages.length; i++) {
			const worker: Worker = createWorker();
			await worker.load();
			await worker.loadLanguage(lang);
			await worker.initialize(lang);
			scheduler.addWorker(worker);
		}
		const result: RecognizeResult[] = await Promise.all(pages.map(async (page: PdfPageData) => scheduler.addJob('recognize', await page.toJPEG()))) as RecognizeResult[];
		await scheduler.terminate();
		return result.map((r: RecognizeResult) => r.data.text);
	}

	/**
	 * recognizes the text from the image information of this pdf page
	 * 
	 * @param {OCRLang[]} langs - the language libraries used for recognition
	 * @returns {Promise<string>} the result as text
	 */
	public async ocr(langs: OCRLang[]): Promise<string> {
		const lang: string = langs.join('+');
		const worker: Worker = createWorker();
		await worker.load();
		await worker.loadLanguage(lang);
		await worker.initialize(lang);
		const data: RecognizeResult = await worker.recognize(await this.toJPEG());
		await worker.terminate();
		return data.data.text;
	}
	
	/**
	 * converts to a jpeg image
	 *
	 * @param {number} [quality=0.8] - the quality of the image (0.0-1.0)
	 * @returns {Promise<Buffer>} the jpeg image as a {Buffer}
	 */
	public async toJPEG(quality: number = 0.8): Promise<Buffer> {
		const viewport: PageViewport = this.page.getViewport({scale: 1.0});
		//if (false) {
		//	const canvas: Bitmap = make(viewport.width, viewport.height, null);
		//	await this.page.render({
		//		canvasContext: canvas.getContext('2d'),
		//		viewport: viewport,
		//		canvasFactory: new NodeCanvasFactory()
		//	}).promise;
		//	const result: Uint8Array[] = [];
		//	const stream: PassThrough = new PassThrough();
		//	stream.on('data', (data: Uint8Array) => result.push(data));
		//	await encodeJPEGToStream(canvas, stream, quality);
		//	return Buffer.concat(result);
		//} else {
		//	
		//}

		const canvas: Canvas = createCanvas(viewport.width, viewport.height);
		await this.page.render({
			canvasContext: canvas.getContext('2d'),
			viewport: viewport,
			canvasFactory: new NodeCanvasFactory()
		}).promise;
		return promisify<'image/jpeg', JpegConfig, Buffer>(canvas.toBuffer)('image/jpeg', {
			quality: quality
		});
	}

	/**
	 * converts to a png image
	 *
	 * @returns {Promise<Buffer>} the png image as a {Buffer}
	 */
	public async toPNG(): Promise<Buffer> {
		const viewport: PageViewport = this.page.getViewport({scale: 1.0});
		//if (false) {
		//	const canvas: Bitmap = make(viewport.width, viewport.height, null);
		//	await this.page.render({
		//		canvasContext: canvas.getContext('2d'),
		//		viewport: viewport,
		//		canvasFactory: new NodeCanvasFactory()
		//	}).promise;
		//	const result: Uint8Array[] = [];
		//	const stream: PassThrough = new PassThrough();
		//	stream.on('data', (data: Uint8Array) => result.push(data));
		//	await encodePNGToStream(canvas, stream);
		//	return Buffer.concat(result);
		//} else {
		//	
		//}
		const canvas: Canvas = createCanvas(viewport.width, viewport.height);
		await this.page.render({
			canvasContext: canvas.getContext('2d'),
			viewport: viewport,
			canvasFactory: new NodeCanvasFactory()
		}).promise;
		return promisify<'image/png', Buffer>(canvas.toBuffer)('image/png');
	}
}