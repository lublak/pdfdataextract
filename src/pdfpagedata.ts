import { PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
import { OCRLang, Sort } from './types';
import { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
import { CanvasApi, CanvasApiConstructor } from './canvasapi';
import { OcrApi, OcrApiConstructor } from './ocrapi';

/**
 * pdf data information per page
 */
export class PdfPageData {
	/**
	 * @internal
	 */
	public constructor(
		private page: PDFPageProxy,
		private readonly canvasApi: CanvasApiConstructor<CanvasApi> | null,
		private readonly ocrApi: OcrApiConstructor<OcrApi> | null,
	) { }

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
	 * recognizes the text from the image information of this pdf page
	 * requires node-canvas/node-pureimage and tesseract.js as additional installation
	 * 
	 * @param {OCRLang[]} langs - the language traineddata used for recognition
	 * @returns {Promise<string>} the result as text
	 */
	public async ocr(langs: OCRLang[]): Promise<string> {
		if (!this.ocrApi) throw new Error('OcrFactory.ocrApi is not set (tesseractjs)');
		const ocr: OcrApi = new this.ocrApi();
		const result = await ocr.ocrBuffers([await this.toJPEG()], langs);
		return result[0];
	}

	/**
	 * creates a canvas and renders 
	 *
	 * @returns {Promise<T>} the canvas
	 */
	public async toCanvasApi<T extends CanvasApi>(canvasApi: CanvasApiConstructor<T>): Promise<T> {
		const viewport: PageViewport = this.page.getViewport({ scale: 1.0 });
		const canvas = new canvasApi(viewport.width, viewport.height);
		await this.page.render({
			canvasContext: canvas.createContext(),
			viewport: viewport,
		}).promise;
		return canvas;
	}

	/**
	 * converts to a jpeg image
	 *
	 * @param {number} [quality=0.8] - the quality of the image (0.0-1.0)
	 * @returns {Promise<Buffer>} the jpeg image as a {Buffer}
	 */
	public async toJPEG(quality: number = 0.8): Promise<Buffer> {
		if (!this.canvasApi) throw new Error('canvasApi is not set (node-canvas or pureimage is not installed)');
		return (await this.toCanvasApi(this.canvasApi)).toJPEG(quality);
	}

	/**
	 * converts to a png image
	 *
	 * @returns {Promise<Buffer>} the png image as a {Buffer}
	 */
	public async toPNG(): Promise<Buffer> {
		if (!this.canvasApi) throw new Error('canvasApi is not set (node-canvas or pureimage is not installed)');
		return (await this.toCanvasApi(this.canvasApi)).toPNG();
	}

	public close(): boolean {
		return this.page.cleanup();
	}
}