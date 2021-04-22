# pdfdataextract

Extract data from a pdf with pure javascript.

Inspered by https://www.npmjs.com/package/pdf-parse, which is currently unmaintained.

## Install

`npm install pdfdataextract`

## Usage

```js
import { PdfData } from 'pdfdataextract';
import { readFileSync} from 'fs';
const file_data = readFileSync('some_pdf_file.pdf');
PdfData.extract(file_data).then( (data) => {
	data.text; // an array of text pages
	data.fingerprint; // fingerprint of the pdf document
	data.outline; // outline data of the pdf document
	data.info; // information of the pdf document, such as Author
	data.metadata; // metadata of the pdf document
});
```

## Test

`npm test`

## TODO

- [ ] add more tests
- [ ] clean up code even more

## License

[MIT licensed](/LICENSE).
