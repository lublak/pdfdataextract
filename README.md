# pdfdataextract

[![version](https://img.shields.io/npm/v/pdfdataextract.svg)](https://www.npmjs.org/package/pdfdataextract)
[![downloads](https://img.shields.io/npm/dt/pdfdataextract.svg)](https://www.npmjs.org/package/pdfdataextract)
[![status](https://github.com/lublak/pdfdataextract/actions/workflows/node.js.yml/badge.svg)](https://github.com/lublak/pdfdataextract/actions/workflows/node.js.yml)

Extract data from a pdf with pure javascript.

Inspered by https://www.npmjs.com/package/pdf-parse, which is currently unmaintained.

## Install

`npm install pdfdataextract`

## Docs

Full documentation is available at the [wiki](https://github.com/lublak/pdfdataextract/wiki)

## Usage

```ts
import { PdfData, VerbosityLevel } from 'pdfdataextract';
import { readFileSync } from 'fs';
const file_data = readFileSync('some_pdf_file.pdf');

// all options are optional
PdfData.extract(file_data, {
	password: '123456', // password of the pdf file
	pages: 1, // how many pages should be read at most
	sort: true, // sort the text by text coordinates
	verbosity: VerbosityLevel.ERRORS, // set the verbosity level for parsing
	get: { // enable or disable data extraction (all are optional and enabled by default)
		pages: true, // get number of pages
		text: true, // get text of each page
		fingerprint: true, // get fingerprint
		outline: true, // get outline
		metadata: true, // get metadata
		info: true, // get info
		permissions: true, // get permissions
	},
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
import { readFileSync } from 'fs';
const file_data = readFileSync('some_pdf_file.pdf');

// all options are optional
PdfDataExtractor.get(file_data, {
	password: '123456', // password of the pdf file
	verbosity: VerbosityLevel.ERRORS, // set the verbosity level for parsing
}).then((extractor) => {
	extractor.pages; // the number of pages
	extractor.fingerprint; // fingerprint of the pdf document

	extractor.getText(1, true).then((text) => {
		// an array of text pages (only one page and sorted)
	});

	extractor.getText([2]).then((text) => {
		// an array of text pages (only the second page)
	});

	extractor.getOutline().then((outline) => {
		// outline data of the pdf document
	});
	
	extractor.getMetadata().then((metadata) => {
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

## Maybe TODOs

- [ ] try to find the line number of the outline
- [ ] create pdf-dist-es5 builds (seprated repo)

## License

[MIT licensed](/LICENSE)
