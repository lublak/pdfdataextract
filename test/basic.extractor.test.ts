const PDF_TEST_FILE = './test/basic.pdf';

import { PdfDataExtractor, VerbosityLevel } from '../src';
import { readFileSync } from 'fs';
import { test, describe, expect } from 'vitest';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	test('without password should fail', async () => {
		await expect(PdfDataExtractor.get(buffer)).rejects.toThrow();
	});
	test('extract basic data', async () => {
		const extractor = await PdfDataExtractor.get(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
		});
		//(await extractor.getPageData()).forEach(async cf => {
		//	console.log(await cf?.contentInfo());
		//});
		expect(extractor.pages).toEqual(2);
		const text = await extractor.getText();
		expect(text.length).toEqual(2);
		const first_page_lines = text[0].split('\n');
		expect(first_page_lines.length).toEqual(31);
		expect(first_page_lines[7]).toMatch(/^dapibus mattis/);
		const permissions = await extractor.getPermissions();
		expect(permissions).not.toBeNull();
		if (permissions) {
			expect(permissions.print).toEqual(true);
			expect(permissions.modifyAnnotations).toEqual(false);
		}
	});
});