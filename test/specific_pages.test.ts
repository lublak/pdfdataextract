const PDF_TEST_FILE = './test/specific_pages.pdf';

import { PdfData, VerbosityLevel } from '../src';
import { readFileSync } from 'fs';
import { test, describe, expect } from 'vitest';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	test('extract specific pages', async () => {

		expect((await PdfData.extract(buffer, {
			verbosity: VerbosityLevel.ERRORS,
			pages: [2]
		})).text).toEqual(['2']);

		expect((await PdfData.extract(buffer, {
			verbosity: VerbosityLevel.ERRORS,
			pages: [5, 9]
		})).text).toEqual(['5', '9']);

		expect((await PdfData.extract(buffer, {
			verbosity: VerbosityLevel.ERRORS,
			pages: (pageNumber) => pageNumber == 7
		})).text).toEqual(['7']);

		expect((await PdfData.extract(buffer, {
			verbosity: VerbosityLevel.ERRORS,
			pages: [5, 9, 5]
		})).text).toEqual(['5', '9']);
	});
});