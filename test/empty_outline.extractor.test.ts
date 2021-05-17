const PDF_TEST_FILE = './test/empty_outline.pdf';

import { PdfDataExtractor, VerbosityLevel } from '../src';
import { readFileSync} from 'fs';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	it('extract empty outline', async () => {
		const extractor = await PdfDataExtractor.get(buffer, {
			verbosity: VerbosityLevel.ERRORS,
		});
		expect(await extractor.getOutline()).toBeNull();
	});
});