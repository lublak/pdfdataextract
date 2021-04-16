# pdfdataextract

Extract data from a pdf with pure javascript

## Install

`npm install pdfdataextract`

## Usage

```js
import { PdfData } from 'pdfdataextract';
import { readFileSync} from 'fs';
const file_data = readFileSync('some_pdf_file.pdf');
PdfData.extract(file_data).then( (data) => {
  
});
```

## Test

`npm test`

## License

[MIT licensed](/LICENSE).
