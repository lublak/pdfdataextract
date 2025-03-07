const PDF_TEST_FILE = './test/empty_outline.pdf';

import { PdfData, VerbosityLevel } from '../src';
import { readFileSync } from 'fs';
import { test, describe, expect } from 'vitest';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	test('extract empty outline', async () => {
		const data = await PdfData.extract(buffer, {
			verbosity: VerbosityLevel.ERRORS,
		});
		expect(await data.outline).toBeUndefined();
	});
});