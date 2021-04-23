# pdfdataextract

Extract data from a pdf with pure javascript.

Inspered by https://www.npmjs.com/package/pdf-parse, which is currently unmaintained.

## Install

`npm install pdfdataextract`

## Usage

```ts
import { PdfData, VerbosityLevel } from 'pdfdataextract';
import { readFileSync} from 'fs';
const file_data = readFileSync('some_pdf_file.pdf');
PdfData.extract(file_data, {
	password: '123456', // password of the pdf file
	max: 1, // how many pages should be read at most
	sort: true, // sort the text by text coordinates
	verbosity: VerbosityLevel.ERRORS, // set the verbosity level for parsing
}).then((data) => {
	data.pages; // the number of pages
	data.text; // an array of text pages
	data.fingerprint; // fingerprint of the pdf document
	data.outline; // outline data of the pdf document
	data.info; // information of the pdf document, such as Author
	data.metadata; // metadata of the pdf document
	data.permissions; // permissions for the document
});
```

```ts
import { PdfDataExtractor, VerbosityLevel } from 'pdfdataextract';
import { readFileSync} from 'fs';
const file_data = readFileSync('some_pdf_file.pdf');
PdfDataExtractor.get(file_data, {
	password: '123456', // password of the pdf file
	verbosity: VerbosityLevel.ERRORS, // set the verbosity level for parsing
}).then((extractor) => {
	extractor.pages; // the number of pages
	extractor.fingerprint; // fingerprint of the pdf document

	extractor.getText(1, true).then((text) => {
		// an array of text pages (only one page and sorted)
	});

	extractor.getOutline().then((text) => {
		// outline data of the pdf document
	});
	
	extractor.getMetadata().then((text) => {
		// metadata of the pdf document
	});

	extractor.getPermissions().then((permissions) => {
		// permissions for the document
	});

	extractor.close();
});
```

## Test

`npm test`

## TODOs

- [ ] add more tests
- [ ] clean up code even more
- [ ] allow only specific pages to be read

## Maybe TODOs

- [ ] try to find the line number of the outline
- [ ] function to convert it as an image
- [ ] create pdf-dist-es5 builds (seprated repo)

## License

[MIT licensed](/LICENSE).
