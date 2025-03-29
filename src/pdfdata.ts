import { PdfDataExtractor } from './pdfdataextractor';
import { VerbosityLevel, Permissions, Outline, Info, Metadata } from './types';

export type PdfDataGetOptions = {
	/**
	 * get number of pages, by default it is true
	 * 
	 * @type {boolean|undefined}
	 */
	pages?: boolean,
	/**
	 * get text of each page, by default it is true
	 * 
	 * @type {boolean|undefined}
	 */
	text?: boolean,
	/**
	 * get fingerprint, by default it is true
	 * 
	 * @type {boolean|undefined}
	 */
	fingerprint?: boolean,
	/**
	 * get outline, by default it is true
	 * 
	 * @type {boolean|undefined}
	 */
	outline?: boolean,
	/**
	 * get metadata, by default it is true
	 * 
	 * @type {boolean|undefined}
	 */
	metadata?: boolean,
	/**
	 * get info, by default it is true
	 * 
	 * @type {boolean|undefined}
	 */
	info?: boolean,
	/**
	 * get permissions, by default it is true
	 * 
	 * @type {boolean|undefined}
	 */
	permissions?: boolean
};

export type PdfDataOptions = {
	/**
	 * password for a password-protected PDF
	 * 
	 * @type {string|undefined}
	 */
	password?: string,
	/**
	 * the number of pages to be read, all pages are read by default
	 *
	 * @deprecated use pages instead
	 * 
	 * @type {number|undefined}
	 */
	max?: number,
	/**
	 * sort the text by text coordinates
	 * 
	 * @type {boolean|undefined}
	 */
	sort?: boolean,
	/**
	 * the logging level
	 * 
	 * @type {VerbosityLevel|undefined}
	 */
	verbosity?: VerbosityLevel,
	/**
	 * can either be the number of pages to be read,
	 * a number array with the exact pages (sorted by page number)
	 * or a filter function (return true to parse the page)
	 * all pages are read by default
	 * not used if get.pages is false
	 * 
	 * @type {number|number[]|((pageNumber: number) => boolean|undefined)}
	 */
	pages?: number | number[] | ((pageNumber: number) => boolean),
	/**
	 * options to enable or disable parsing methods
	 * 
	 * @type {PdfDataGetOptions|undefined}
	 */
	get?: PdfDataGetOptions;
}

/**
 * the data of the pdf
 */
export class PdfData {
	/**
	 * the number of pages
	 * 
	 * @readonly
	 * @type {number|undefined}
	 */
	readonly pages?: number;
	/**
	 * extracted text per page
	 * 
	 * @readonly
	 * @type {string[]|undefined}
	 */
	readonly text?: readonly string[];
	/**
	 * the fingerprint
	 * 
	 * @readonly
	 * @type {string|undefined}
	 */
	readonly fingerprint?: string;
	/**
	 * the outline/bookmarks
	 * 
	 * @readonly
	 * @type {Outline[]|undefined}
	 */
	readonly outline?: readonly Outline[];
	/**
	 * the informations/description
	 * 
	 * @readonly
	 * @type {Info|undefined}
	 */
	readonly info?: Info;
	/**
	 * the metadata
	 * 
	 * @readonly
	 * @type {Metadata|undefined}
	 */
	readonly metadata?: Metadata;
	/**
	 * the permission flags
	 * 
	 * @readonly
	 * @type {Permissions | undefined}
	 */
	readonly permissions?: Permissions;

	private constructor(pages: number | null, text: string[] | null, fingerprint: string | null, outline: Outline[] | null, info: Info | null, metadata: Metadata | null, permissions: Permissions | null) {
		if (pages != null) this.pages = pages;
		if (text != null) this.text = text;
		if (fingerprint != null) this.fingerprint = fingerprint;
		if (outline != null) this.outline = outline;
		if (info != null) this.info = info;
		if (metadata != null) this.metadata = metadata;
		if (permissions != null) this.permissions = permissions;
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

		if (!options.get) options.get = {};

		const pages: number | number[] | ((pageNumber: number) => boolean) | undefined = options.pages ? options.pages : options.max;

		let metadata: Metadata | null = null;
		let info: Info | null = null;

		if (options.get.metadata === undefined || options.get.metadata || options.get.info === undefined || options.get.info) {
			const rawMetadata: {
				info: Info;
				metadata: Metadata;
			} | null = await extractor.getMetadata();
			if (rawMetadata != null) {
				if (options.get.info === undefined || options.get.info) info = rawMetadata.info;
				if (options.get.metadata === undefined || options.get.metadata) metadata = rawMetadata.metadata;
			}
		}

		const pdfdata: PdfData = new PdfData(
			options.get.pages === undefined || options.get.pages ? extractor.pages : null,
			options.get.text === undefined || options.get.text ? await extractor.getText(pages, options.sort) : null,
			options.get.fingerprint === undefined || options.get.fingerprint ? extractor.fingerprint : null,
			options.get.outline === undefined || options.get.outline ? await extractor.getOutline() : null,
			info,
			metadata,
			options.get.permissions === undefined || options.get.permissions ? await extractor.getPermissions() : null
		);

		extractor.close();
		return pdfdata;
	}
}