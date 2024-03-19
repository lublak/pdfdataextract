import { VerbosityLevel as RawVerbosityLevel } from 'pdfjs-dist/legacy/build/pdf.mjs';

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
	/**
	 * AFR
	 */
	AFR = 'afr',
	/**
	 * AMH
	 */
	AMH = 'amh',
	/**
	 * ARA
	 */
	ARA = 'ara',
	/**
	 * ASM
	 */
	ASM = 'asm',
	/**
	 * AZE
	 */
	AZE = 'aze',
	/**
	 * AZE_CYRL
	 */
	AZE_CYRL = 'aze_cyrl',
	/**
	 * BEL
	 */
	BEL = 'bel',
	/**
	 * BEN
	 */
	BEN = 'ben',
	/**
	 * BOD
	 */
	BOD = 'bod',
	/**
	 * BOS
	 */
	BOS = 'bos',
	/**
	 * BUL
	 */
	BUL = 'bul',
	/**
	 * CAT
	 */
	CAT = 'cat',
	/**
	 * CEB
	 */
	CEB = 'ceb',
	/**
	 * CES
	 */
	CES = 'ces',
	/**
	 * CHI_SIM
	 */
	CHI_SIM = 'chi_sim',
	/**
	 * CHI_TRA
	 */
	CHI_TRA = 'chi_tra',
	/**
	 * CHR
	 */
	CHR = 'chr',
	/**
	 * CYM
	 */
	CYM = 'cym',
	/**
	 * DAN
	 */
	DAN = 'dan',
	/**
	 * DEU
	 */
	DEU = 'deu',
	/**
	 * DZO
	 */
	DZO = 'dzo',
	/**
	 * ELL
	 */
	ELL = 'ell',
	/**
	 * ENG
	 */
	ENG = 'eng',
	/**
	 * ENM
	 */
	ENM = 'enm',
	/**
	 * EPO
	 */
	EPO = 'epo',
	/**
	 * EST
	 */
	EST = 'est',
	/**
	 * EUS
	 */
	EUS = 'eus',
	/**
	 * FAS
	 */
	FAS = 'fas',
	/**
	 * FIN
	 */
	FIN = 'fin',
	/**
	 * FRA
	 */
	FRA = 'fra',
	/**
	 * FRK
	 */
	FRK = 'frk',
	/**
	 * FRM
	 */
	FRM = 'frm',
	/**
	 * GLE
	 */
	GLE = 'gle',
	/**
	 * GLG
	 */
	GLG = 'glg',
	/**
	 * GRC
	 */
	GRC = 'grc',
	/**
	 * GUJ
	 */
	GUJ = 'guj',
	/**
	 * HAT
	 */
	HAT = 'hat',
	/**
	 * HEB
	 */
	HEB = 'heb',
	/**
	 * HIN
	 */
	HIN = 'hin',
	/**
	 * HRV
	 */
	HRV = 'hrv',
	/**
	 * HUN
	 */
	HUN = 'hun',
	/**
	 * IKU
	 */
	IKU = 'iku',
	/**
	 * IND
	 */
	IND = 'ind',
	/**
	 * ISL
	 */
	ISL = 'isl',
	/**
	 * ITA
	 */
	ITA = 'ita',
	/**
	 * ITA_OLD
	 */
	ITA_OLD = 'ita_old',
	/**
	 * JAV
	 */
	JAV = 'jav',
	/**
	 * JPN
	 */
	JPN = 'jpn',
	/**
	 * KAN
	 */
	KAN = 'kan',
	/**
	 * KAT
	 */
	KAT = 'kat',
	/**
	 * KAT_OLD
	 */
	KAT_OLD = 'kat_old',
	/**
	 * KAZ
	 */
	KAZ = 'kaz',
	/**
	 * KHM
	 */
	KHM = 'khm',
	/**
	 * KIR
	 */
	KIR = 'kir',
	/**
	 * KOR
	 */
	KOR = 'kor',
	/**
	 * KUR
	 */
	KUR = 'kur',
	/**
	 * LAO
	 */
	LAO = 'lao',
	/**
	 * LAT
	 */
	LAT = 'lat',
	/**
	 * LAV
	 */
	LAV = 'lav',
	/**
	 * LIT
	 */
	LIT = 'lit',
	/**
	 * MAL
	 */
	MAL = 'mal',
	/**
	 * MAR
	 */
	MAR = 'mar',
	/**
	 * MKD
	 */
	MKD = 'mkd',
	/**
	 * MLT
	 */
	MLT = 'mlt',
	/**
	 * MSA
	 */
	MSA = 'msa',
	/**
	 * MYA
	 */
	MYA = 'mya',
	/**
	 * NEP
	 */
	NEP = 'nep',
	/**
	 * NLD
	 */
	NLD = 'nld',
	/**
	 * NOR
	 */
	NOR = 'nor',
	/**
	 * ORI
	 */
	ORI = 'ori',
	/**
	 * PAN
	 */
	PAN = 'pan',
	/**
	 * POL
	 */
	POL = 'pol',
	/**
	 * POR
	 */
	POR = 'por',
	/**
	 * PUS
	 */
	PUS = 'pus',
	/**
	 * RON
	 */
	RON = 'ron',
	/**
	 * RUS
	 */
	RUS = 'rus',
	/**
	 * SAN
	 */
	SAN = 'san',
	/**
	 * SIN
	 */
	SIN = 'sin',
	/**
	 * SLK
	 */
	SLK = 'slk',
	/**
	 * SLV
	 */
	SLV = 'slv',
	/**
	 * SPA
	 */
	SPA = 'spa',
	/**
	 * SPA_OLD
	 */
	SPA_OLD = 'spa_old',
	/**
	 * SQI
	 */
	SQI = 'sqi',
	/**
	 * SRP
	 */
	SRP = 'srp',
	/**
	 * SRP_LATN
	 */
	SRP_LATN = 'srp_latn',
	/**
	 * SWA
	 */
	SWA = 'swa',
	/**
	 * SWE
	 */
	SWE = 'swe',
	/**
	 * SYR
	 */
	SYR = 'syr',
	/**
	 * TAM
	 */
	TAM = 'tam',
	/**
	 * TEL
	 */
	TEL = 'tel',
	/**
	 * TGK
	 */
	TGK = 'tgk',
	/**
	 * TGL
	 */
	TGL = 'tgl',
	/**
	 * THA
	 */
	THA = 'tha',
	/**
	 * TIR
	 */
	TIR = 'tir',
	/**
	 * TUR
	 */
	TUR = 'tur',
	/**
	 * UIG
	 */
	UIG = 'uig',
	/**
	 * UKR
	 */
	UKR = 'ukr',
	/**
	 * URD
	 */
	URD = 'urd',
	/**
	 * UZB
	 */
	UZB = 'uzb',
	/**
	 * UZB_CYRL
	 */
	UZB_CYRL = 'uzb_cyrl',
	/**
	 * VIE
	 */
	VIE = 'vie',
	/**
	 * YID
	 */
	YID = 'yid'
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
	getAll(): { [key: string]: string | string[] | undefined };
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
	readonly PDFFormatVersion?: string,
	/**
	 * if it is linearized
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsLinearized?: boolean,
	/**
	 * if acro form is present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsAcroFormPresent?: boolean
	/**
	 * if xfa form is present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsXFAPresent?: boolean,
	/**
	 * if collection is present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsCollectionPresent?: boolean,
	/**
	 * if signatures are present
	 * 
	 * @readonly
	 * @type {boolean | undefined}
	 */
	readonly IsSignaturesPresent?: boolean,
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
	) { }
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
	) { }
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
	) { }
}