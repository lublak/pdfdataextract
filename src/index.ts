import { getDocument, VerbosityLevel } from 'pdfjs-dist/es5/build/pdf';
import { Metadata } from 'pdfjs-dist/types/display/metadata';
import { PDFDocumentProxy } from 'pdfjs-dist/types/display/api';

export type PdfDataOptions = {
   password?: string,
   max?: number,
   sort?: boolean
}

export type Info = Readonly<{
	Title?:string,
	Author?:string,
	Subject?:string,
	Keywords?:string,
	Creator?:string,
	Producer?:string,
	CreationDate?:string,
	ModDate?:string,
	Trapped?:{ readonly name:string },

	PDFFormatVersion:string,
	IsLinearized:boolean,
	IsAcroFormPresent:boolean
	IsXFAPresent:boolean,
	IsCollectionPresent:boolean,
	IsSignaturesPresent:boolean,
	[key: string]: string | number | boolean | { readonly name:string } | undefined
}>

export type PdfOutline = {
	readonly title:string,
	readonly url:string,
	readonly childs?: readonly PdfOutline[];
} | {
	readonly title:string,
	readonly page:number,
	readonly childs?: readonly PdfOutline[]
};

type RawPdfOutline = {
	title: string;
	bold: boolean;
	italic: boolean;
	color: Uint8ClampedArray;
	dest: string | Array<any> | null;
	url: string | null;
	unsafeUrl: string | undefined;
	newWindow: boolean | undefined;
	count: number | undefined;
	items: any[];
};

export class PdfData {
	readonly pages: number;
	readonly text: readonly string[];
	readonly fingerprint:string;
	readonly outline:readonly PdfOutline[];
	readonly info?:Info;
	readonly metadata?:Metadata;

	private constructor(pages: number, text:string[], fingerprint: string, outline:PdfOutline[], metaData: { info: Object; metadata: Metadata; } | null) {
		this.pages = pages;
		this.text = text;
		this.fingerprint = fingerprint;
		this.outline = outline;

		if(metaData != null) {
			this.info = metaData.info as Info;
			this.metadata = metaData.metadata;
		}
	}

	private static async getPageNumber(pdf_document:PDFDocumentProxy, pageRef:{ num: number, gen: number }, cache:{ [key:string]:number; }) {
		const ref = pageRef.gen === 0 ? `${pageRef.num}R` : `${pageRef.num}R${pageRef.gen}`;
		let number = cache[ref];
		if(number == null) {
			number = await pdf_document.getPageIndex(pageRef) as unknown as number;
			cache[ref] = number;
		}
		return number;
	}
	
	private static async parseOutline(pdf_document:PDFDocumentProxy, outlineData:RawPdfOutline[], cache:{ [key:string]:number; }) {
		const outline:PdfOutline[] = [];
		for(const o of outlineData) {
			let dest = o.dest ? o.dest[0] as { num: number, gen: number } : null;
			if(dest == null) {
				if(o.unsafeUrl != null) {
					outline.push({
						title: o.title,
						url: o.unsafeUrl,
						childs: o.items ? await PdfData.parseOutline(pdf_document, o.items, cache) : undefined
					});
				}
			} else {
				outline.push({
					title: o.title,
					page: await PdfData.getPageNumber(pdf_document, dest, cache),
					childs: o.items ? await PdfData.parseOutline(pdf_document, o.items, cache) : undefined
				});
			}
		}
		return outline;
	}

	/**
	 * Returns the extracted data from a pdf file
	 * 
	 * @param {Uint8Array} data The pdf file in the form of byte data
	 * @param {PdfDataOptions} options The options how to read the data
	 * @returns {Promise<PdfData>}
	 * @memberof PdfData
	 */

	static async parse(data:Uint8Array, options:PdfDataOptions = {}) {

		const pdf_document = await getDocument({
			data: data,
			password: options.password,
			verbosity: VerbosityLevel.ERRORS
		}).promise;

		const counter = options.max && options.max > 0 ?
			(
				options.max > pdf_document.numPages ?
					pdf_document.numPages
					: options.max
			)
			: pdf_document.numPages;

		const sort = !!options.sort;
		const text_array = [];

		const pages = [];
		
		for (let i = 1; i <= counter; i++) {
			const page = await pdf_document.getPage(i).catch(_ => null);
			pages[i] = page;
			const pageText = page == null ? '' : await page.getTextContent().then(textContent => {

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
				if(sort) textContent.items.sort((e1, e2) => {
					if(e1.transform[5] < e2.transform[5]) return 1;
					else if(e1.transform[5] > e2.transform[5]) return -1;
					else if(e1.transform[4] < e2.transform[4]) return -1;
					else if(e1.transform[4] > e2.transform[4]) return 1;
					else return 0;
				});
				
				let lastLineY, text = '';
				for (let item of textContent.items) {
					if (!lastLineY || lastLineY == item.transform[5]) {
						text += item.str;
					} else{
						text += '\n' + item.str;
					}
					lastLineY = item.transform[5];
				}
				return text;
			}, _ => '');

			text_array.push(pageText);
		}

		const metaData = await pdf_document.getMetadata().catch(_ => null);
		const outline = await this.parseOutline(pdf_document, await pdf_document.getOutline(), {});
		
		pdf_document.destroy();

		return new PdfData(pdf_document.numPages, text_array, pdf_document.fingerprint, outline, metaData);
	}
}