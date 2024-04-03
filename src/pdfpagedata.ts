import { PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
import { OCRLang, Sort } from './types';
import { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
import { CanvasApi, CanvasFactory } from './canvasfactory';
import { ContentInfo, ContentInfoExtractor } from './contentinfoextractor';
import { OcrApi, OcrFactory } from './ocrfactory';

/**
 * pdf data information per page
 */
export class PdfPageData {
	/**
	 * @internal
	 */
	public constructor(private page: PDFPageProxy) { }

	/**
	 * get the text of the page
	 * 
	 * @param {boolean|Sort} [sort=false] - sort the text by text coordinates
	 * @returns {Promise<string>} a promise that is resolved with a {string} with the extracted text of the page
	 */
	public async toText(sort: boolean | Sort = false): Promise<string> {
		const sortOption: Sort | null = typeof sort === 'boolean' ? (sort ? Sort.ASC : null) : sort;
		return this.page.getTextContent({
			disableNormalization: false,
			includeMarkedContent: false,
		}).then((textContent: TextContent) => {
			const items: TextItem[] = textContent.items as TextItem[];
			/*
				transform is a array with a transform matrix [scale x,shear x,shear y,scale y,offset x,offset y]
			
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
	 * @param {OCRLang[]} langs - the language traineddata used for recognition
	 * @param {boolean} [asFullPage=false]
	 * @returns {Promise<string[]>} an array with text from each side
	 */
	public static async ocr(pages: PdfPageData[], langs: OCRLang[], asFullPage: boolean = false): Promise<string[]> {
		const tesseract = (await import('./tesseractjsocr').catch(() => {
			throw new Error('tesseract.js is not installed');
		}));
		if (asFullPage) {
			if (!OcrFactory.ocrApi) throw new Error('OcrFactory.ocrApi is not set (tesseractjs)');
			const ocr: OcrApi = new OcrFactory.ocrApi();
			return ocr.ocrBuffers(await Promise.all(pages.map((page: PdfPageData) => page.toJPEG())), langs);
		} else {
			// TODO
			return [];
		}
	}

	/**
	 *
	 */
	public async contentInfo(): Promise<ContentInfo[]> {
		return new ContentInfoExtractor(this.page).getContentInfo();
	}

	/**
	 * recognizes the text from the image information of this pdf page
	 * requires node-canvas/node-pureimage and tesseract.js as additional installation
	 * 
	 * @param {OCRLang[]} langs - the language traineddata used for recognition
	 * @param {boolean} [asFullPage=false] - ocr the page as a whole and not individual image content (needs a canvas library)
	 * @returns {Promise<string>} the result as text
	 */
	public async ocr(langs: OCRLang[], asFullPage: boolean = false): Promise<string> {
		if (asFullPage) {
			if (!OcrFactory.ocrApi) throw new Error('OcrFactory.ocrApi is not set (tesseractjs)');
			const ocr: OcrApi = new OcrFactory.ocrApi();
			const result = await ocr.ocrBuffers([await this.toJPEG()], langs);
			return result[0];
		}
		return '';
	}

	/**
	 * converts to a jpeg image
	 *
	 * @param {number} [quality=0.8] - the quality of the image (0.0-1.0)
	 * @returns {Promise<Buffer>} the jpeg image as a {Buffer}
	 */
	public async toJPEG(quality: number = 0.8): Promise<Buffer> {
		if (!CanvasFactory.canvasApi) throw new Error('CanvasFactory.canvasApi is not set (node-canvas or pureimage is not installed)');
		const viewport: PageViewport = this.page.getViewport({ scale: 1.0 });
		const canvas: CanvasApi = new CanvasFactory.canvasApi(viewport.width, viewport.height);
		await this.page.render({
			canvasContext: canvas.createContext(),
			viewport: viewport,
		}).promise;
		return canvas.toJPEG(quality);
	}

	/**
	 * converts to a png image
	 *
	 * @returns {Promise<Buffer>} the png image as a {Buffer}
	 */
	public async toPNG(): Promise<Buffer> {
		if (!CanvasFactory.canvasApi) throw new Error('CanvasFactory.canvasApi is not set (node-canvas or pureimage is not installed)');
		const viewport: PageViewport = this.page.getViewport({ scale: 1.0 });
		const canvas: CanvasApi = new CanvasFactory.canvasApi(viewport.width, viewport.height);
		await this.page.render({
			canvasContext: canvas.createContext(),
			viewport: viewport,
		}).promise;
		return canvas.toPNG();
	}
}