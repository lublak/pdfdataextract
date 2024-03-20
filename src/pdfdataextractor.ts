import { getDocument, PermissionFlag } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { CanvasFactory } from './canvasfactory';
import { OcrFactory } from './ocrfactory';
import { PdfPageData } from './pdfpagedata';
import { VerbosityLevel, Permissions, Outline, PageNumberOutline, UrlOutline, PdfReferenceOutline, MetadataInfo, Sort } from './types';

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

interface RawOutline {
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
}

async function getPageNumber(pdf_document: PDFDocumentProxy, pageRef: { num: number, gen: number }, cache: { [key: string]: number; }) {
	const ref: string = pageRef.gen === 0 ? `${pageRef.num}R` : `${pageRef.num}R${pageRef.gen}`;
	let number: number = cache[ref];
	if (number == null) {
		number = await pdf_document.getPageIndex(pageRef) as unknown as number;
		cache[ref] = number;
	}
	return number;
}

function parseRemoteUrlDest(remoteUrlDest: string) {
	try {
		const remoteDest: unknown = JSON.parse(remoteUrlDest);
		if (Array.isArray(remoteDest) && Number.isInteger(remoteDest[0])) {
			return remoteDest[0];
		}
	} catch { }
	return undefined;
}

async function parseOutline(pdf_document: PDFDocumentProxy, outlineData: RawOutline[], cache: { [key: string]: number; }) {
	const outline: Outline[] = [];
	for (const o of outlineData) {
		const dest: unknown = typeof (o.dest) === 'string' ? await pdf_document.getDestination(o.dest) : o.dest;
		if (dest == null) {
			if (o.unsafeUrl != null) {
				if (o.url == null) {
					const remoteUrl: string[] = o.unsafeUrl.split('#', 2);
					const remoteBaseUrl: string = remoteUrl[0];
					if (remoteBaseUrl.toLowerCase().endsWith('.pdf')) {
						if (remoteUrl.length == 2) {
							outline.push(new PdfReferenceOutline(o.title, remoteBaseUrl, parseRemoteUrlDest(remoteUrl[1]), o.items ? await parseOutline(pdf_document, o.items, cache) : undefined));
						} else {
							outline.push(new PdfReferenceOutline(o.title, remoteBaseUrl, undefined, o.items ? await parseOutline(pdf_document, o.items, cache) : undefined));
						}
					} else {
						outline.push(new UrlOutline(o.title, o.unsafeUrl, false, o.items ? await parseOutline(pdf_document, o.items, cache) : undefined));
					}
				} else {
					outline.push(new UrlOutline(o.title, o.url, true, o.items ? await parseOutline(pdf_document, o.items, cache) : undefined));
				}
			} else {
				// TODO: ?
			}
		} else if (Array.isArray(dest)) {
			if (typeof dest[0] === 'object') {
				outline.push(new PageNumberOutline(
					o.title,
					await getPageNumber(pdf_document, dest[0] as { num: number, gen: number }, cache),
					o.items ? await parseOutline(pdf_document, o.items, cache) : undefined
				));
			} else if (Number.isInteger(dest[0])) {
				outline.push(new PageNumberOutline(o.title, dest[0], o.items ? await parseOutline(pdf_document, o.items, cache) : undefined));
			} else {
				// TODO: ?
			}
		}
	}
	return outline;
}

/**
 * the extractor for the data of the pdf
 */
export class PdfDataExtractor {
	private constructor(private readonly pdf_document: PDFDocumentProxy) { }

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
			canvasFactory: new CanvasFactory(),
		}).promise;
		if (CanvasFactory.canvasApi === null) {
			try {
				require.resolve('canvas');
				CanvasFactory.canvasApi = (await import('./nodecanvas')).NodeCanvas;
			} catch (e) {
				try {
					require.resolve('pureimage');
					CanvasFactory.canvasApi = (await import('./pureimagecanvas')).PureimageCanvas;
				} catch (e) {
					CanvasFactory.canvasApi = null;
				}
			}
		}
		if (OcrFactory.ocrApi === null) {
			try {
				require.resolve('tesseract.js');
				OcrFactory.ocrApi = (await import('./tesseractjsocr')).TesseractJsOcr;
			} catch (e) {
				OcrFactory.ocrApi = null;
			}
		}
		return new PdfDataExtractor(pdf_document);
	}

	/**
	 * get the fingerprint
	 * 
	 * @returns {string} the fingerprint
	 */
	get fingerprint(): string {
		return this.pdf_document.fingerprints[0];
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
	 * @param {boolean|Sort} [sort=false] - sort the text by text coordinates
	 * @returns {Promise<string[]>} a promise that is resolved with a {string[]} array with the extracted text per page
	 */
	async getText(pages?: number | number[] | ((pageNumber: number) => boolean), sort: boolean | Sort = false): Promise<string[]> {
		return Promise.all((await this.getPageData(pages)).map(async (page: PdfPageData | null) => page == null ? '' : page.toText(sort)));
	}

	/**
	 * get the text
	 * 
	 * @param {number|number[]|((pageNumber: number) => boolean)} [pages] - can either be the number of pages to be read,
	 *     a number array with the specific pages (sorted by page number)
	 *     or a filter function (return true to parse the page)
	 * @returns {Promise<string[]>} a promise that is resolved with a {string[]} array with the extracted text per page
	 */
	async getPageData(pages?: number | number[] | ((pageNumber: number) => boolean)): Promise<(PdfPageData | null)[]> {
		const page_array: (PdfPageData | null)[] = [];
		const numPages: number = this.pdf_document.numPages;

		if (pages === undefined) {
			for (let pageNumber: number = 1; pageNumber <= numPages; pageNumber++) {
				const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
				page_array.push(page == null ? null : new PdfPageData(page));
			}
		} else if (typeof (pages) === 'number') {
			const counter: number = pages > numPages ? numPages : pages;

			for (let pageNumber: number = 1; pageNumber <= counter; pageNumber++) {
				const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
				page_array.push(page == null ? null : new PdfPageData(page));
			}
		} else if (typeof (pages) === 'function') {
			for (let pageNumber: number = 1; pageNumber <= numPages; pageNumber++) {
				if (pages(pageNumber)) {
					const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
					page_array.push(page == null ? null : new PdfPageData(page));
				}
			}
		} else {
			pages = pages.filter((value: number, index: number, self: number[]) => self.indexOf(value) === index).sort((a: number, b: number) => a - b);
			for (const pageNumber of pages) {
				if (pageNumber <= numPages) {
					const page: PDFPageProxy | null = await this.pdf_document.getPage(pageNumber).catch(() => null);
					page_array.push(page == null ? null : new PdfPageData(page));
				}
			}
		}

		return page_array;
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
	 * @returns {Promise<MetadataInfo | null>} a promise that is resolved with a {MetadataInfo | null} object with information from the metadata section
	 */
	async getMetadata(): Promise<MetadataInfo | null> {
		return await this.pdf_document.getMetadata().catch(() => null) as MetadataInfo | null;
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