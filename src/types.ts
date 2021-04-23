import { VerbosityLevel as RawVerbosityLevel } from 'pdfjs-dist/es5/build/pdf';

export enum VerbosityLevel {
	ERRORS = RawVerbosityLevel.ERRORS,
	INFOS = RawVerbosityLevel.INFOS,
	WARNINGS = RawVerbosityLevel.WARNINGS,
}

export type Permissions = {
	readonly assemble:boolean,
	readonly copy:boolean,
	readonly fillInteractiveForms:boolean,
	readonly modifyAnnotations:boolean,
	readonly modifyContents:boolean,
	readonly print:boolean,
	readonly printHQ:boolean,
	readonly copyForAccessibility:boolean,
}

export interface Metadata {
    getRaw(): any;
    get(name: any): any;
    getAll(): any;
    has(name: any): boolean;
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
	[key: string]: string | number | boolean | { readonly name:string } | undefined,
}>

export type Outline = {
	readonly title:string,
	readonly url:string,
	readonly childs?: readonly Outline[],
} | {
	readonly title:string,
	readonly page:number,
	readonly childs?: readonly Outline[],
}