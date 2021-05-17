import { getDocument, PermissionFlag } from 'pdfjs-dist/es5/build/pdf';
import { PDFDocumentProxy, PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/display/api';
import { VerbosityLevel, Permissions, Outline, Info, Metadata } from './types';

export type PdfDataExtractorOptions = {
	/**
	 * password for a password-protected PDF
	 * 
	 * @type {string}
	 */
	password?: string,
	/**
	 * the logging level
	 * 
	 * @type {VerbosityLevel}
	 */
	verbosity?: VerbosityLevel,
}

type RawOutline = {
	title: string;
	bold: boolean;
	italic: boolean;
	color: Uint8ClampedArray;
	dest: string | Array<unknown> | null;
	url: string | null;
	unsafeUrl: string | undefined;
	newWindow: boolean | undefined;
	count: number | undefined;
	items: RawOutline[] | undefined;
};

async function getPageNumber(pdf_document: PDFDocumentProxy, pageRef: { num: number, gen: number }, cache: { [key: string]: number; }) {
	const ref: string = pageRef.gen === 0 ? `${pageRef.num}R` : `${pageRef.num}R${pageRef.gen}`;
	let number: number = cache[ref];
	if (number == null) {
		number = await pdf_document.getPageIndex(pageRef) as unknown as number;
		cache[ref] = number;
	}
	return number;
}

async function parseOutline(pdf_document: PDFDocumentProxy, outlineData: RawOutline[], cache: { [key: string]: number; }) {
	const outline: Outline[] = [];
	for (const o of outlineData) {
		const dest: { num: number, gen: number } | null = o.dest ? o.dest[0] as { num: number, gen: number } : null;
		if (dest == null) {
			if (o.unsafeUrl != null) {
				outline.push({
					title: o.title,
					url: o.unsafeUrl,
					childs: o.items ? await parseOutline(pdf_document, o.items, cache) : undefined
				});
			}
		} else {
			outline.push({
				title: o.title,
				page: await getPageNumber(pdf_document, dest, cache),
				childs: o.items ? await parseOutline(pdf_document, o.items, cache) : undefined
			});
		}
	}
	return outline;
}

async function parsePage(page: PDFPageProxy, sort?: boolean) {
	return page.getTextContent().then((textContent: TextContent)  => {

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
		if (sort) textContent.items.sort((e1: TextItem, e2: TextItem) => {
			if (e1.transform[5] < e2.transform[5]) return 1;
			else if (e1.transform[5] > e2.transform[5]) return -1;
			else if (e1.transform[4] < e2.transform[4]) return -1;
			else if (e1.transform[4] > e2.transform[4]) return 1;
			else return 0;
		});
		
		let lastLineY: number | undefined, text: string = '';
		for (const item of textContent.items) {
			if (!lastLineY || lastLineY == item.transform[5]) {
				text += item.str;
			} else {
				text += '\n' + item.str;
			}
			lastLineY = item.transform[5];
		}

		return text;
	}, () => '');
}

/**
 * the extractor for the data of the pdf
 */
export class PdfDataExtractor {
	private readonly pdf_document: PDFDocumentProxy;

	private constructor(pdf_document: PDFDocumentProxy) {
		this.pdf_document = pdf_document;
	}

	/**
	 * get the extractor for the data
	 * 
	 * @param {Uint8Array} data - the binary data file
	 * @param {PdfDataExtractorOptions} [options={}] - the options on how to open the data in the extractor
	 * @returns {Promise<PdfDataExtractor>} a promise that is resolved with a {PdfDataExtractor} object to pull the extracted data from
	 */
	static async get(data: Uint8Array, options: PdfDataExtractorOptions = {}): Promise<PdfDataExtractor> {
		const pdf_document: PDFDocumentProxy = await getDocument({
			data: data,
			password: options.password,
			verbosity: options.verbosity ?? VerbosityLevel.ERRORS,
			isEvalSupported: false,
		}).promise;

		return new PdfDataExtractor(pdf_document);
	}

	/**
	 * get the fingerprint
	 * 
	 * @returns {string} the fingerprint
	 */
	get fingerprint(): string {
		return this.pdf_document.fingerprint;
	}

	/**
	 * get the number of pages
	 * 
	 * @returns {string} the number of pages
	 */
	get pages(): number {
		return this.pdf_document.numPages;
	}
	
	/**
	 * get the permission flags
	 *
	 * @returns {Promise<Permissions | null>} a promise that is resolved with a {Permissions | null} object that contains the permission flags for the PDF
	 */
	async getPermissions(): Promise<Permissions | null> {
		const permission_flag_array: number[] | null = await this.pdf_document.getPermissions();
		return permission_flag_array == null ? null : {
			assemble: permission_flag_array.includes(PermissionFlag.ASSEMBLE),
			copy: permission_flag_array.includes(PermissionFlag.COPY),
			copyForAccessibility: permission_flag_array.includes(PermissionFlag.COPY_FOR_ACCESSIBILITY),
			fillInteractiveForms: permission_flag_array.includes(PermissionFlag.FILL_INTERACTIVE_FORMS),
			modifyAnnotations: permission_flag_array.includes(PermissionFlag.MODIFY_ANNOTATIONS),
			print: permission_flag_array.includes(PermissionFlag.PRINT),
			printHQ: permission_flag_array.includes(PermissionFlag.PRINT_HIGH_QUALITY),
			modifyContents: permission_flag_array.includes(PermissionFlag.MODIFY_CONTENTS),
		};
	}

	/**
	 * get the text
	 * 
	 * @param {number|number[]|((pageNumber: number) => boolean)} [pages] - can either be the number of pages to be read,
	 *     a number array with the specific pages (sorted by page number)
	 *     or a filter function (return true to parse the page)
	 * @param {boolean} [sort] - sort the text by text coordinates
	 * @returns {Promise<string[]>} a promise that is resolved with a {string[]} array with the extracted text per page
	 */
	async getText(pages?: number | number[] | ((pageNumber: number) => boolean), sort?: boolean): Promise<string[]> {
		const text_array: string[] = [];
		const numPages: number = this.pdf_document.numPages;

		if (typeof(pages) === 'undefined') {
			for (let pageNumber: number = 1; pageNumber <= numPages; pageNumber++) {
				const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
				text_array.push(page == null ? '' : await parsePage(page, sort));
			}
		} else if (typeof(pages) === 'number') {
			const counter: number = pages > numPages ? numPages : pages;
			
			for (let pageNumber: number = 1; pageNumber <= counter; pageNumber++) {
				const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
				text_array.push(page == null ? '' : await parsePage(page, sort));
			}
		} else if (typeof(pages) == 'function') {
			for (let pageNumber: number = 1; pageNumber <= numPages; pageNumber++) {
				if (pages(pageNumber)) {
					const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
					text_array.push(page == null ? '' : await parsePage(page, sort));
				}
			}
		} else {
			pages = pages.sort((a: number, b: number) => a - b);
			for (const pageNumber of pages) {
				if (pageNumber <= numPages) {
					const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
					text_array.push(page == null ? '' : await parsePage(page, sort));
				}
			}
		}

		return text_array;
	}

	/**
	 * get the outline/bookmarks
	 *
	 * @returns {Promise<Outline[]>} a promise that is resolved with a {Outline[]} array with information from the tree outline
	 */
	async getOutline(): Promise<Outline[] | null> {
		const outlineData: RawOutline[] = await this.pdf_document.getOutline();
		if (outlineData == null) return null;
		return parseOutline(this.pdf_document, outlineData, {});
	}

	/**
	 * get the metadata
	 *
	 * @returns {Promise<{ info: Info; metadata: Metadata; } | null>} a promise that is resolved with a {{ info: Info; metadata: Metadata; } | null} object with information from the metadata section
	 */
	async getMetadata(): Promise<{ info: Info; metadata: Metadata; } | null> {
		return await this.pdf_document.getMetadata().catch(() => null) as { info: Info; metadata: Metadata; } | null;
	}

	/**
	 * close the extractor
	 *
	 * @returns {Promise<void>} a promise that is resolved when destruction is completed
	 */
	async close(): Promise<void> {
		return this.pdf_document.destroy();
	}
}