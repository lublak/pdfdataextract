import { PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/display/api';
import { Sort } from './types';

/**
 * pdf data information per page
 */
export class PdfPageData {
	private constructor(private page: PDFPageProxy) {}

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
}