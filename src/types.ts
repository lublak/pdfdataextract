import { VerbosityLevel as RawVerbosityLevel } from 'pdfjs-dist/legacy/build/pdf';

export enum VerbosityLevel {
	/**
	 * logs all errors
	 */
	ERRORS = RawVerbosityLevel.ERRORS,
	/**
	 * logs all infos
	 */
	INFOS = RawVerbosityLevel.INFOS,
	/**
	 * logs all warnings
	 */
	WARNINGS = RawVerbosityLevel.WARNINGS,
}

export interface Permissions {
	/**
	 * allow to assemble
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly assemble: boolean,
	/**
	 * allow to copy the content
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly copy: boolean,
	/**
	 * allow to fill interactive forms
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly fillInteractiveForms: boolean,
	/**
	 * allow to modify annotations
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly modifyAnnotations: boolean,
	/**
	 * allow to modify contents
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly modifyContents: boolean,
	/**
	 * allow to print
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly print: boolean,
	/**
	 * allow to print in highquality
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly printHQ: boolean,
	/**
	 * allow to copy the content for accessibility
	 * 
	 * @readonly
	 * @type {boolean}
	 */
	readonly copyForAccessibility: boolean,
}

export interface Metadata {
	/**
	 * get the raw metadata
	 * 
	 * @returns {string} the raw metadata
	 */
	getRaw(): string;
	/**
	 * get data by name
	 * 
	 * @returns {string} the data
	 */
	get(name: string): string | string[];
	/**
	 * get all data
	 * 
	 * @returns {Object<string, string | string[] | undefined>} all data
	 */
	getAll(): {[key: string]: string | string[] | undefined};
	/**
	 * check whether data with the name are available
	 * 
	 * @returns {boolean} if available then true is returned
	 */
	has(name: string): boolean;
}

export interface Name {
	/**
	 * the name
	 * 
	 * @type {string}
	 */
	readonly name: string
};

export interface Info {
	/**
	 * the title
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Title?: string,
	/**
	 * the author
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Author?: string,
	/**
	 * the subject
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Subject?: string,
	/**
	 * the keywords
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Keywords?: string,
	/**
	 * the creator
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Creator?: string,
	/**
	 * the producer
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly Producer?: string,
	/**
	 * the creation date
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly CreationDate?: string,
	/**
	 * the modification date
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly ModDate?: string,
	/**
	 * the trapped
	 * 
	 * @readonly
	 * @type {Name | undefined}
	 */
	readonly Trapped?: Name,
	/**
	 * the format version
	 * 
	 * @readonly
	 * @type {string | undefined}
	 */
	readonly PDFFormatVersion: string,
	/**
	 * if it is linearized
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsLinearized: boolean,
	/**
	 * if acro form is present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsAcroFormPresent: boolean
	/**
	 * if xfa form is present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsXFAPresent: boolean,
	/**
	 * if collection is present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsCollectionPresent: boolean,
	/**
	 * if signatures are present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsSignaturesPresent: boolean,
	readonly [key: string]: string | number | boolean | Name | undefined,
}

export class BaseOutline {
	constructor(
		/**
		 * the title
		 * 
		 * @readonly
		 * @type {string}
		 */
		 readonly title: string,
		/**
		 * the childrens
		 * 
		 * @readonly
		 * @type {ReadonlyArray<Outline> | undefined}
		 */
		 readonly childs?: readonly Outline[],
	) {}
}

export class UrlOutline extends BaseOutline {
	constructor(
		/**
		 * the title
		 * 
		 * @readonly
		 * @type {string}
		 */
		readonly title: string,
		/**
		 * the url to which the outline points
		 * 
		 * @readonly
		 * @type {string}
		 */
		readonly url: string,
		/**
		 * if the url is absolute
		 * 
		 * @readonly
		 * @type {boolean}
		 */
		readonly absolute: boolean,
		/**
		 * the childrens
		 * 
		 * @readonly
		 * @type {ReadonlyArray<Outline> | undefined}
		 */
		readonly childs?: readonly Outline[],
	) {
		super(title, childs);
	}
};

export class PageNumberOutline {
	constructor(
		/**
		 * the title
		 * 
		 * @readonly
		 * @type {string}
		 */
		readonly title: string,
		/**
			* the page to which the outline points
			* 
			* @readonly
			* @type {number}
			*/
		readonly page: number,
		/**
			* the childrens
			* 
			* @readonly
			* @type {ReadonlyArray<Outline> | undefined}
			*/
		readonly childs?: readonly Outline[],
	) {}
}

export class PdfReferenceOutline {
	constructor(
		/**
		 * the title
		 * 
		 * @readonly
		 * @type {string}
		 */
		readonly title: string,
		/**
		 * the url to which the outline points
		 * 
		 * @readonly
		 * @type {string}
		 */
		 readonly url: string,
		/**
			* the page to which the outline points
			* 
			* @readonly
			* @type {number}
			*/
		readonly page?: number,
		/**
			* the childrens
			* 
			* @readonly
			* @type {ReadonlyArray<Outline> | undefined}
			*/
		readonly childs?: readonly Outline[],
	) {}
}

export type Outline = UrlOutline | PageNumberOutline | PdfReferenceOutline;