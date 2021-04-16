# pdfdata

Extract data from a pdf with pure javascript

## Usage

```js
import { PdfData } from 'pdfdata';
import { readFileSync} from 'fs';
const file_data = readFileSync('some_pdf_file.pdf');
PdfData.parse(file_data).then( (data) => {
  
});
```

## Test

Just run `npm test`

## License

[MIT licensed](/LICENSE).
