import { PdfDataExtractor } from './pdfdataextractor';
import { VerbosityLevel, Permissions, Outline, Info, Metadata } from './types';

export type PdfDataOptions = {
   password?: string,
   max?: number,
   sort?: boolean,
   verbosity?: VerbosityLevel,
}

/**
 *
 */
export class PdfData {
	readonly pages: number;
	readonly text: readonly string[];
	readonly fingerprint: string;
	readonly outline: readonly Outline[];
	readonly info?: Info;
	readonly metadata?: Metadata;
	readonly permissions?: Permissions;

	/**
	 * @param pages
	 * @param text
	 * @param fingerprint
	 * @param outline
	 * @param metaData
	 * @param permissions
	 */
	private constructor(pages: number, text: string[], fingerprint: string, outline: Outline[], metaData: { info: Info; metadata: Metadata; } | null, permissions: Permissions | null) {
		this.pages = pages;
		this.text = text;
		this.fingerprint = fingerprint;
		this.outline = outline;

		if (metaData != null) {
			this.info = metaData.info;
			this.metadata = metaData.metadata;
		}

		if (permissions) this.permissions = permissions;
	}

	/**
	 * @param data
	 * @param options
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
			null, 
			await extractor.getPermissions()
		);

		extractor.close();
		return pdfdata;
	}
}