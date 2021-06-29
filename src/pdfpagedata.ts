import { PDFPageProxy, TextContent, TextItem } from "pdfjs-dist/types/display/api";
import { Sort } from "./types";

export class PdfPageData {
  public constructor(private page: PDFPageProxy) {

  }
  /**
   * get the text of the page
   * 
   * @param {boolean} [sort] - sort the text by text coordinates
   * @returns {Promise<string>} a promise that is resolved with a {string} with the extracted text of the page
   */
  public async toText(sort?: boolean | Sort): Promise<string> {
    let sortOption:Sort | undefined = typeof sort === 'boolean' ? (sort ? Sort.ASC : undefined) : sort;
    return this.page.getTextContent().then((textContent: TextContent)  => {

      /*
        transform is a array with a transform matrix [scale x,shear x,shear y,scale y,offset x, offset y]
  
        0,1         1,1
          -----------
          |         |
          |         |
          |   pdf   |
          |         |
          |         |
          -----------
        0,0         1,0
      */

      
  
      //coordinate based sorting
      if (sortOption !== undefined) {
        if(sortOption === Sort.ASC) {
          textContent.items.sort((e1: TextItem, e2: TextItem) => {
            if (e1.transform[5] < e2.transform[5]) return 1;
            else if (e1.transform[5] > e2.transform[5]) return -1;
            else if (e1.transform[4] < e2.transform[4]) return -1;
            else if (e1.transform[4] > e2.transform[4]) return 1;
            else return 0;
          });
        } else {
          textContent.items.sort((e1: TextItem, e2: TextItem) => {
            if (e1.transform[5] < e2.transform[5]) return -1;
            else if (e1.transform[5] > e2.transform[5]) return 1;
            else if (e1.transform[4] < e2.transform[4]) return 1;
            else if (e1.transform[4] > e2.transform[4]) return -1;
            else return 0;
          });
        }
      }
      
      let lastLineY: number | undefined, text: string = '';
      for (const item of textContent.items) {
        if (!lastLineY || lastLineY == item.transform[5]) {
          // TODO if spaced by coordinates (x + text width + space width = next x)
          //textContent.styles[item.fontName];
          //dummyContext.font = '';
          //dummyContext.measureText(item.str);
          text += item.str;
        } else {
          text += '\n' + item.str;
        }
        lastLineY = item.transform[5];
      }
  
      return text;
    }, () => '');
  }
  // TODO

  //public async getCoordinates(sort?: boolean | Sort): Promise<unknown> {
  //  
  //}

  /*public async toImage(): Promise<Buffer> {
    let viewport = this.page.getViewport();
    let canvas = createCanvas(viewport.width, viewport.height);
    this.page.render({
      canvasContext: canvas.getContext('2d'),
      viewport: viewport,
    });
    let toBuffer = promisify(function(cb: (err: Error|null, result: Buffer) => void) {
      canvas.toBuffer(cb, 'image/png');
    });
    return toBuffer();
  }*/
}