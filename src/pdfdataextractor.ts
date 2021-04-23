import { getDocument, PermissionFlag } from 'pdfjs-dist/es5/build/pdf';
import { PDFDocumentProxy } from 'pdfjs-dist/types/display/api';
import { VerbosityLevel, Permissions, Outline, Info, Metadata } from './types';

export type PdfDataExtractorOptions = {
    password?: string,
    verbosity?: VerbosityLevel,
}

type RawOutline = {
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

async function getPageNumber(pdf_document:PDFDocumentProxy, pageRef:{ num: number, gen: number }, cache:{ [key:string]:number; }) {
	const ref = pageRef.gen === 0 ? `${pageRef.num}R` : `${pageRef.num}R${pageRef.gen}`;
	let number = cache[ref];
	if(number == null) {
		number = await pdf_document.getPageIndex(pageRef) as unknown as number;
		cache[ref] = number;
	}
	return number;
}

async function parseOutline(pdf_document:PDFDocumentProxy, outlineData:RawOutline[], cache:{ [key:string]:number; }) {
	const outline:Outline[] = [];
	for(const o of outlineData) {
		let dest = o.dest ? o.dest[0] as { num: number, gen: number } : null;
		if(dest == null) {
			if(o.unsafeUrl != null) {
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

export class PdfDataExtractor {
	private readonly pdf_document: PDFDocumentProxy;

	private constructor(pdf_document: PDFDocumentProxy) {
		this.pdf_document = pdf_document;
	}

	/**
	 * Returns the extracted data from a pdf file
	 * 
	 * @param {Uint8Array} data The pdf file in the form of byte data
	 * @param {PdfDataOptions} options The options how to read the data
	 * @returns {Promise<PdfData>}
	 * @memberof PdfData
	 */

	static async get(data:Uint8Array, options:PdfDataExtractorOptions = {}) {
		const pdf_document = await getDocument({
			data: data,
			password: options.password,
			verbosity: options.verbosity ?? VerbosityLevel.ERRORS,
		}).promise;

		return new PdfDataExtractor(pdf_document);
	}

    
    get fingerprint() : string {
        return this.pdf_document.fingerprint;
    }

    get pages() : number {
        return this.pdf_document.numPages;
    }
    
    

    async getPermissions():Promise<Permissions | null> {
        const permission_flag_array = await this.pdf_document.getPermissions();
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

    async getText(max?:number, sort?:boolean) {
        const counter = max && max > 0 ?
			(
				max > this.pdf_document.numPages ?
                this.pdf_document.numPages
					: max
			)
			: this.pdf_document.numPages;

        const text_array = [];
		
		for (let i = 1; i <= counter; i++) {
			const page = await this.pdf_document.getPage(i).catch(_ => null);
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

        return text_array;
    }

    async getOutline() {
        return await parseOutline(this.pdf_document, await this.pdf_document.getOutline(), {});
    }

    async getMetadata() {
        return await this.pdf_document.getMetadata().catch(_ => null) as { info: Info; metadata: Metadata; } | null;
    }

    async close() {
        return this.pdf_document.destroy();
    }
}