const PDF_TEST_FILE = './test/specific_pages.pdf';

import { PdfDataExtractor, VerbosityLevel } from '../src';
import { readFileSync} from 'fs';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	it('extract specific pages', async () => {
		const extractor = await PdfDataExtractor.get(buffer, {
			verbosity: VerbosityLevel.ERRORS,
		});
		const pages = await extractor.getPageData([1]);
		expect(await extractor.getText([2])).toEqual(['2']);
		expect(await extractor.getText([5, 9])).toEqual(['5', '9']);
		expect(await extractor.getText((pageNumber) => pageNumber == 7)).toEqual(['7']);
		expect(await extractor.getText([5, 9, 5])).toEqual(['5', '9']);
	});
});