const PDF_TEST_FILE = './test/simple.pdf';

import { PdfDataExtractor, VerbosityLevel } from '../src';
import { readFileSync } from 'fs';
import { test, describe, expect } from 'vitest';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	test('extract basic data', async () => {
		const extractor = await PdfDataExtractor.get(buffer, {
			verbosity: VerbosityLevel.ERRORS,
		});
		//(await extractor.getPageData()).forEach(async cf => {
		//	console.log(await cf?.contentInfo());
		//});
	});
});