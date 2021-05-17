import { PdfDataExtractor } from './pdfdataextractor';
import { VerbosityLevel, Permissions, Outline, Info, Metadata } from './types';

export type PdfDataOptions = {
   /**
    * password for a password-protected PDF
    * 
    * @type {string}
    */
   password?: string,
   /**
    * the number of pages to be read
    * 
    * @type {number}
    */
   max?: number,
   /**
    * sort the text by text coordinates
    * 
    * @type {boolean}
    */
   sort?: boolean,
   /**
    * the logging level
    * 
    * @type {VerbosityLevel}
    */
   verbosity?: VerbosityLevel,
}

/**
 * the data of the pdf
 */
export class PdfData {
	/**
	 * the number of pages
	 * 
	 * @readonly
	 * @type {number}
	 */
	readonly pages: number;
	/**
	 * extracted text per page
	 * 
	 * @readonly
	 * @type {string[]}
	 */
	readonly text: readonly string[];
	/**
	 * the fingerprint
	 * 
	 * @readonly
	 * @type {string}
	 */
	readonly fingerprint: string;
	/**
	 * the outline/bookmarks
	 * 
	 * @readonly
	 * @type {Outline[] | undefined}
	 */
	readonly outline?: readonly Outline[];
	/**
	 * the informations/description
	 * 
	 * @readonly
	 * @type {Info | undefined}
	 */
	readonly info?: Info;
	/**
	 * the metadata
	 * 
	 * @readonly
	 * @type {Metadata | undefined}
	 */
	readonly metadata?: Metadata;
	/**
	 * the permission flags
	 * 
	 * @readonly
	 * @type {Permissions | undefined}
	 */
	readonly permissions?: Permissions;

	private constructor(pages: number, text: string[], fingerprint: string, outline: Outline[] | null, metaData: { info: Info; metadata: Metadata; } | null, permissions: Permissions | null) {
		this.pages = pages;
		this.text = text;
		this.fingerprint = fingerprint;
		
		if (outline != null) {
			this.outline = outline;
		}

		if (metaData != null) {
			this.info = metaData.info;
			this.metadata = metaData.metadata;
		}

		if (permissions) this.permissions = permissions;
	}

	/**
	 * get the data
	 * 
	 * @param {Uint8Array} data - the binary data file
	 * @param {PdfDataOptions} [options={}] - the options on how the data should be extracted
	 * @returns {Promise<PdfData>} a promise that is resolved with a {PdfData} object with the extracted data
	 */
	static async extract(data: Uint8Array, options: PdfDataOptions = {}): Promise<PdfData> {
		const extractor: PdfDataExtractor = await PdfDataExtractor.get(data, {
			password: options.password,
			verbosity: options.verbosity,
		});

		const pdfdata: PdfData = new PdfData(
			extractor.pages,
			await extractor.getText(options.max, options.sort),
			extractor.fingerprint,
			await extractor.getOutline(),
			await extractor.getMetadata(), 
			await extractor.getPermissions()
		);

		extractor.close();
		return pdfdata;
	}
}