const PDF_TEST_FILE = './test/basic.pdf';

import { PdfData, VerbosityLevel } from '../src';
import { readFileSync} from 'fs';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	it('without password should fail', async () => {
		await expect(PdfData.extract(buffer)).rejects.toThrow();
	});
	it('extract basic data', async () => {
		const data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
		});
		expect(data.pages).toEqual(2);
		expect(data.text.length).toEqual(2);
		const first_page_lines = data.text[0].split('\n');
		expect(first_page_lines.length).toEqual(35);
		expect(first_page_lines[10]).toMatch(/^dapibus mattis/);
		expect(data.permissions).toBeDefined();
		if(data.permissions) {
			expect(data.permissions.print).toEqual(true);
			expect(data.permissions.modifyAnnotations).toEqual(false);
		}
	});
});