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

export enum Sort {
	/**
	 * if it should sort ascending
	 */
	ASC,
	/**
	 * if it should sort descending
	 */
	DESC
}

export enum OCRLang {
	AFR = "afr",
	AMH = "amh",
	ARA = "ara",
	ASM = "asm",
	AZE = "aze",
	AZE_CYRL = "aze_cyrl",
	BEL = "bel",
	BEN = "ben",
	BOD = "bod",
	BOS = "bos",
	BUL = "bul",
	CAT = "cat",
	CEB = "ceb",
	CES = "ces",
	CHI_SIM = "chi_sim",
	CHI_TRA = "chi_tra",
	CHR = "chr",
	CYM = "cym",
	DAN = "dan",
	DEU = "deu",
	DZO = "dzo",
	ELL = "ell",
	ENG = "eng",
	ENM = "enm",
	EPO = "epo",
	EST = "est",
	EUS = "eus",
	FAS = "fas",
	FIN = "fin",
	FRA = "fra",
	FRK = "frk",
	FRM = "frm",
	GLE = "gle",
	GLG = "glg",
	GRC = "grc",
	GUJ = "guj",
	HAT = "hat",
	HEB = "heb",
	HIN = "hin",
	HRV = "hrv",
	HUN = "hun",
	IKU = "iku",
	IND = "ind",
	ISL = "isl",
	ITA = "ita",
	ITA_OLD = "ita_old",
	JAV = "jav",
	JPN = "jpn",
	KAN = "kan",
	KAT = "kat",
	KAT_OLD = "kat_old",
	KAZ = "kaz",
	KHM = "khm",
	KIR = "kir",
	KOR = "kor",
	KUR = "kur",
	LAO = "lao",
	LAT = "lat",
	LAV = "lav",
	LIT = "lit",
	MAL = "mal",
	MAR = "mar",
	MKD = "mkd",
	MLT = "mlt",
	MSA = "msa",
	MYA = "mya",
	NEP = "nep",
	NLD = "nld",
	NOR = "nor",
	ORI = "ori",
	PAN = "pan",
	POL = "pol",
	POR = "por",
	PUS = "pus",
	RON = "ron",
	RUS = "rus",
	SAN = "san",
	SIN = "sin",
	SLK = "slk",
	SLV = "slv",
	SPA = "spa",
	SPA_OLD = "spa_old",
	SQI = "sqi",
	SRP = "srp",
	SRP_LATN = "srp_latn",
	SWA = "swa",
	SWE = "swe",
	SYR = "syr",
	TAM = "tam",
	TEL = "tel",
	TGK = "tgk",
	TGL = "tgl",
	THA = "tha",
	TIR = "tir",
	TUR = "tur",
	UIG = "uig",
	UKR = "ukr",
	URD = "urd",
	UZB = "uzb",
	UZB_CYRL = "uzb_cyrl",
	VIE = "vie",
	YID = "yid"
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

export interface MetadataInfo {
	/**
	 * the meta information of the document
	 */
	info: Info;
	/**
	 * the metadata of the document
	 */
	metadata: Metadata;
}

export interface Name {
	/**
	 * the name
	 * 
	 * @type {string}
	 */
	readonly name: string
}

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

/**
 * it is an outline (bookmark) of the pdf document
 */
export interface Outline {
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
}

/**
 * the outline which includes a url
 */
export class UrlOutline implements Outline {
	/**
	 * @param {string} title - the title
	 * @param {string} url - the url to which the outline points
	 * @param {boolean} absolute - if the url is absolute
	 * @param {Outline[]} [childs] - the childrens
	 */
	constructor(
		readonly title: string,
		readonly url: string,
		readonly absolute: boolean,
		readonly childs?: readonly Outline[],
	) {}
}


/**
 * the outline which includes a page number
 */
export class PageNumberOutline implements Outline {
	/**
	 * @param {string} title - the title
	 * @param {number} page - the page number to which the outline points
	 * @param {Outline[]} [childs] - the childrens
	 */
	constructor(
		readonly title: string,
		readonly page: number,
		readonly childs?: readonly Outline[],
	) {}
}

/**
 * the outline which includes a reference to another pdf
 */
export class PdfReferenceOutline implements Outline {
	/**
	 * @param {string} title - the title
	 * @param {string} url - the url to which the outline points
	 * @param {number} page - the remote page number to which the outline points
	 * @param {Outline[]} [childs] - the childrens
	 */
	constructor(
		readonly title: string,
		readonly url: string,
		readonly page?: number,
		readonly childs?: readonly Outline[],
	) {}
}