import { PdfDataExtractor } from './pdfdataextractor';
import { VerbosityLevel, Permissions, Outline, Info, Metadata } from './types';

export type PdfDataOptions = {
   password?: string,
   max?: number,
   sort?: boolean,
   verbosity?: VerbosityLevel,
}

export class PdfData {
	readonly pages: number;
	readonly text: readonly string[];
	readonly fingerprint:string;
	readonly outline:readonly Outline[];
	readonly info?:Info;
	readonly metadata?:Metadata;
	readonly permissions?:Permissions;

	private constructor(pages: number, text:string[], fingerprint: string, outline:Outline[], metaData: { info: Object; metadata: Metadata; } | null, permissions:Permissions | null) {
		this.pages = pages;
		this.text = text;
		this.fingerprint = fingerprint;
		this.outline = outline;

		if(metaData != null) {
			this.info = metaData.info as Info;
			this.metadata = metaData.metadata;
		}

		if(permissions) this.permissions = permissions;
	}

	/**
	 * Returns the extracted data from a pdf file
	 * 
	 * @param {Uint8Array} data The pdf file in the form of byte data
	 * @param {PdfDataOptions} options The options how to read the data
	 * @returns {Promise<PdfData>}
	 * @memberof PdfData
	 */

	static async extract(data:Uint8Array, options:PdfDataOptions = {}) {
		const extractor = await PdfDataExtractor.get(data, {
            password: options.password,
            verbosity: options.verbosity,
        });

        const pdfdata = new PdfData(
            extractor.pages,
            await extractor.getText(options.max, options.sort),
            extractor.fingerprint,
            await extractor.getOutline(),
            null, 
            await extractor.getPermissions()
        );

        extractor.close();
        return pdfdata;
    }
}