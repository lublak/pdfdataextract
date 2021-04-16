const PDF_TEST_FILE = './test/basic.pdf';

import { PdfData } from '../src';
import { readFileSync} from 'fs';

describe(`parse ${PDF_TEST_FILE}`, () => {
    const data = readFileSync(PDF_TEST_FILE);
    it('without password should fail', async () => {
      await expect(PdfData.extract(data)).rejects.toThrow();
    });
    it('extract basic data', async () => {
      const result = await PdfData.extract(data, {
        password: '123456'
      });
      expect(result.pages).toEqual(2);
      expect(result.text.length).toEqual(2);
      const first_page_lines = result.text[0].split('\n');
      expect(first_page_lines.length).toEqual(35);
      expect(first_page_lines[10]).toMatch(/^dapibus mattis/);
    });
});