const PDF_TEST_FILE = './test/outline.pdf';

import { PdfDataExtractor, VerbosityLevel, PageNumberOutline, UrlOutline, PdfReferenceOutline } from '../src';
import { readFileSync} from 'fs';

describe(`parse ${PDF_TEST_FILE}`, () => {
	const buffer = readFileSync(PDF_TEST_FILE);
	it('extract empty outline', async () => {
    const extractor = await PdfDataExtractor.get(buffer, {
			verbosity: VerbosityLevel.ERRORS,
		});
    const outline = await extractor.getOutline();
    expect(outline).not.toBeNull();
		if(outline) {
      const outline0 = outline[0];
      expect(outline0.title).toEqual('to_page_1');
      expect(outline0).toBeInstanceOf(PageNumberOutline);
      if(outline0 instanceof PageNumberOutline) {
        expect(outline0.page).toEqual(0);
      }

      const outline1 = outline[1];
      expect(outline1.title).toEqual('to_page_1_reference');
      expect(outline1).toBeInstanceOf(PageNumberOutline);
      if(outline1 instanceof PageNumberOutline) {
        expect(outline1.page).toEqual(0);
      }

      const outline2 = outline[2];
      expect(outline2.title).toEqual('url');
      expect(outline2).toBeInstanceOf(UrlOutline);
      if(outline2 instanceof UrlOutline) {
        expect(outline2.url).toEqual('https://github.com/lublak/pdfdataextract');
        expect(outline2.absolute).toEqual(true);
      }

      const outline3 = outline[3];
      expect(outline3.title).toEqual('to_pdf');
      expect(outline3).toBeInstanceOf(PdfReferenceOutline);
      if(outline3 instanceof PdfReferenceOutline) {
        expect(outline3.url).toEqual('specific_pages.pdf');
        expect(outline3.page).toEqual(0);
      }

      const outline4 = outline[4];
      expect(outline4.title).toEqual('open');
      expect(outline4).toBeInstanceOf(UrlOutline);
      if(outline4 instanceof UrlOutline) {
        expect(outline4.url).toEqual('specific_pages.test.ts');
        expect(outline4.absolute).toEqual(false);
      }
    }
	});
});