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
		expect(data.text).not.toBeNull();
		if(data.text) {
			expect(data.text.length).toEqual(2);
			const first_page_lines = data.text[0].split('\n');
			//expect(first_page_lines.length).toEqual(35);
			//expect(first_page_lines[10]).toMatch(/^dapibus mattis/);
		}
		expect(data.permissions).not.toBeNull();
		if(data.permissions) {
			expect(data.permissions.print).toEqual(true);
			expect(data.permissions.modifyAnnotations).toEqual(false);
		}
	});
	it('extract seperated basic data', async () => {
		let data: PdfData;

		data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
			get: {
				pages: false,
				text: false,
				fingerprint: false,
				outline: false,
				metadata: false,
				info: false,
				permissions: false
			}
		});
		expect(data.pages).toBeUndefined();
		expect(data.text).toBeUndefined();
		expect(data.fingerprint).toBeUndefined();
		expect(data.outline).toBeUndefined();
		expect(data.metadata).toBeUndefined();
		expect(data.info).toBeUndefined();
		expect(data.permissions).toBeUndefined();

		data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
			get: {
				pages: true,
				text: false,
				fingerprint: false,
				outline: false,
				metadata: false,
				info: false,
				permissions: false
			}
		});
		expect(data.pages).toBeDefined();
		expect(data.text).toBeUndefined();
		expect(data.fingerprint).toBeUndefined();
		expect(data.outline).toBeUndefined();
		expect(data.metadata).toBeUndefined();
		expect(data.info).toBeUndefined();
		expect(data.permissions).toBeUndefined();

		data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
			get: {
				pages: false,
				text: true,
				fingerprint: false,
				outline: false,
				metadata: false,
				info: false,
				permissions: false
			}
		});
		expect(data.pages).toBeUndefined();
		expect(data.text).toBeDefined();
		expect(data.fingerprint).toBeUndefined();
		expect(data.outline).toBeUndefined();
		expect(data.metadata).toBeUndefined();
		expect(data.info).toBeUndefined();
		expect(data.permissions).toBeUndefined();

		data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
			get: {
				pages: false,
				text: false,
				fingerprint: true,
				outline: false,
				metadata: false,
				info: false,
				permissions: false
			}
		});
		expect(data.pages).toBeUndefined();
		expect(data.text).toBeUndefined();
		expect(data.fingerprint).toBeDefined();
		expect(data.outline).toBeUndefined();
		expect(data.metadata).toBeUndefined();
		expect(data.info).toBeUndefined();
		expect(data.permissions).toBeUndefined();

		data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
			get: {
				pages: false,
				text: false,
				fingerprint: false,
				outline: true,
				metadata: false,
				info: false,
				permissions: false
			}
		});
		expect(data.pages).toBeUndefined();
		expect(data.text).toBeUndefined();
		expect(data.fingerprint).toBeUndefined();
		expect(data.outline).toBeDefined();
		expect(data.metadata).toBeUndefined();
		expect(data.info).toBeUndefined();
		expect(data.permissions).toBeUndefined();

		// TODO
		//data = await PdfData.extract(buffer, {
		//	password: '123456',
		//	verbosity: VerbosityLevel.ERRORS,
		//	get: {
		//		pages: false,
		//		text: false,
		//		fingerprint: false,
		//		outline: false,
		//		metadata: true,
		//		info: false,
		//		permissions: false
		//	}
		//});
		//expect(data.pages).toBeUndefined();
		//expect(data.text).toBeUndefined();
		//expect(data.fingerprint).toBeUndefined();
		//expect(data.outline).toBeUndefined();
		//expect(data.metadata).toBeDefined();
		//expect(data.info).toBeUndefined();
		//expect(data.permissions).toBeUndefined();

		data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
			get: {
				pages: false,
				text: false,
				fingerprint: false,
				outline: false,
				metadata: false,
				info: true,
				permissions: false
			}
		});
		expect(data.pages).toBeUndefined();
		expect(data.text).toBeUndefined();
		expect(data.fingerprint).toBeUndefined();
		expect(data.outline).toBeUndefined();
		expect(data.metadata).toBeUndefined();
		expect(data.info).toBeDefined();
		expect(data.permissions).toBeUndefined();

		data = await PdfData.extract(buffer, {
			password: '123456',
			verbosity: VerbosityLevel.ERRORS,
			get: {
				pages: false,
				text: false,
				fingerprint: false,
				outline: false,
				metadata: false,
				info: false,
				permissions: true
			}
		});
		expect(data.pages).toBeUndefined();
		expect(data.text).toBeUndefined();
		expect(data.fingerprint).toBeUndefined();
		expect(data.outline).toBeUndefined();
		expect(data.metadata).toBeUndefined();
		expect(data.info).toBeUndefined();
		expect(data.permissions).toBeDefined();
	})
});