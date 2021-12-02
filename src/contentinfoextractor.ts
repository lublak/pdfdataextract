import { OPS } from 'pdfjs-dist/legacy/build/pdf';
import { PDFOperatorList, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

interface Glyph {
  originalCharCode:number;
  fontChar:string;
  unicode:string;
  accent:number | null;
  width: number,
  isSpace: boolean,
  isInFont: boolean
}
interface PDFObjects {
  get(objId:string, callback:(data:unknown) => void):null;
  get(objId:string):unknown;
  has(objId:string):boolean;
  resolve(objId:string, data:unknown):void;
}
export class ContentInfo {
  x:number = 0;
  y:number = 0;
}
export class PathInfo extends ContentInfo {
  
}
export enum LineCap {
  BUTT = 0,
  ROUND = 1,
  SQUARE = 2,
}
export enum LineJoin {
  MITER = 0,
  ROUND = 1,
  BEVEL = 2,
}
export enum ClipType {
  NORMAL,
  EO,
}
export enum TextRenderingMode {
  FILL = 0,
  STROKE = 1,
  FILL_STROKE = 2,
  INVISIBLE = 3,
  FILL_ADD_TO_PATH = 4,
  STROKE_ADD_TO_PATH = 5,
  FILL_STROKE_ADD_TO_PATH = 6,
  ADD_TO_PATH = 7,
  FILL_STROKE_MASK = 3,
  ADD_TO_PATH_FLAG = 4,
};
class ContentInfoExtractorState {
  lineWidth?:number;
  lineCap?:LineCap;
  lineJoin?:LineJoin;
  miterLimit?:number;
  dashArray?:number[];
  dashPhase?:number;
  transformMatrix:[number, number, number, number, number, number] = [1, 0, 0, 1, 0, 0];
  textTransformMatrix:[number, number, number, number, number, number] = [1, 0, 0, 1, 0, 0];
  path:([number, number, number, number]|[number, number, number, number, number, number])[] = [];
  pathOpen:boolean = true;
  leading:number = 0;
  x?:number;
  y?:number;
  strokeColor:number = 0;
  fillColor:number = 0;
  textRise:number = 0;
  charSpacing:number = 0;
  wordSpacing:number = 0;
  hScale:number = 0;
  textRenderingMode:TextRenderingMode = TextRenderingMode.FILL;
}
export class ContentInfoExtractor {
  private contentInfo:ContentInfo[] = [];
  private state:ContentInfoExtractorState = new ContentInfoExtractorState();
  private clipType:ClipType | null = null;
  private stateStack:ContentInfoExtractorState[] = [];
  private page:PDFPageProxy;
  private commonObjs:PDFObjects;

  public constructor(page:PDFPageProxy) {
    this.page = page;
    this.commonObjs = page.commonObjs;
  }

  public async getContentInfo():Promise<ContentInfo[]> {
    const operatorList = await this.page.getOperatorList();
    await ContentInfoExtractor.loadDependencies(this.page, operatorList);
    this.fromOperatorList(operatorList);
    return this.contentInfo;
  }

  private dependency(ids:string[]) {
    // its loaded all together with loadDependencies
  }
  
  private setLineWidth(width:number) {
    this.state.lineWidth = width;
  }
  private setLineCap(lineCap:LineCap) {
    this.state.lineCap = lineCap;
  }
  private setLineJoin(lineJoin:LineJoin) {
    this.state.lineJoin = lineJoin;
  } 
  private setMiterLimit(miterLimit:number) {
    this.state.miterLimit = miterLimit;
  }
  private setDash(dashArray:number[], dashPhase:number) {
    this.state.dashArray = dashArray;
    this.state.dashPhase = dashPhase;
  }
  private setRenderingIntent(intent:boolean) {
    // not used
  }
  private setFlatness(flatness:boolean) {
    // not used
  }
  private setGState(states:[[string, unknown]]) {
    for (const [key, value] of states) {
      switch (key) {
        case 'LW':
          this.setLineWidth(value as number);
          break;
        case 'LC':
          this.setLineCap(value as LineCap);
          break;
        case 'LJ':
          this.setLineJoin(value as LineJoin);
          break;
        case 'ML':
          this.setMiterLimit(value as number);
          break;
        case 'D':
          const d = value as [number[], number];
          this.setDash(d[0], d[1]);
          break;
        case 'RI':
          this.setRenderingIntent(value as boolean);
          break;
        case 'FL':
          this.setFlatness(value as boolean);
          break;
        case 'Font':
          const f = value as [string, number];
          this.setFont(f[0], f[1]);
          break;
        case 'CA':
          this.setStrokeAlpha(value as number);
          break;
        case 'ca':
          this.setFillAlpha(value as number);
          break;
        case 'BM':
          break;
        case 'SMask':
          break;
        case 'TR':
          break;
      }
    }
  }
  private save() {
    this.stateStack.push(this.state);
    this.state = Object.create(this.state);
  }
  private restore() {
    const restoredState = this.stateStack.pop();
    if(restoredState) this.state = restoredState;
    this.clipType = null;
  }
  private transform(scaleX:number, shearX:number, shearY:number, scaleY:number, offsetX:number, offsetY:number) {
    const oldMatrix = this.state.transformMatrix;
    this.state.transformMatrix = [
      oldMatrix[0] * scaleX + oldMatrix[2] * shearX,
      oldMatrix[1] * scaleX + oldMatrix[3] * shearX,
      oldMatrix[0] * shearY + oldMatrix[2] * scaleY,
      oldMatrix[1] * shearY + oldMatrix[3] * scaleY,
      oldMatrix[0] * offsetX + oldMatrix[2] * offsetY + oldMatrix[4],
      oldMatrix[1] * offsetX + oldMatrix[3] * offsetY + oldMatrix[5],
    ];
  }
  //private moveTo(x:number, y:number) {
  //}
  //private lineTo(x:number, y:number) {
  //}
  //private curveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number) {

  //}
  //// cx1 and cy1 is the current position
  //private curveTo2(cx1:number, cy1:number, cp2x:number, cp2y:number, x:number, y:number) {
  //  this.curveTo(cx1, cy1, cp2x, cp2y, x, y)
  //}
  //private curveTo3(cp1x:number, cp1y:number, x:number, y:number) {
  //  this.curveTo(cp1x, cp1y, x, y, x, y);
  //}
  private closePath() {
    this.state.pathOpen = false;
  }
  //private rectangle(x:number, y:number, width:number, height:number) {
  //}
  private stroke() {

  }
  private closeStroke() {
    this.closePath();
    this.stroke();
  }
  private fill() {
    
  }
  private eoFill() {
  }
  private fillStroke() {
    this.stroke();
    this.fill();
  }
  private eoFillStroke() {
    
  }
  private closeFillStroke() {
    this.closePath();
    this.fillStroke();
  }
  private closeEOFillStroke() {
    this.closePath();
    this.eoFillStroke();
  }
  private endPath() {
    if(this.clipType) {

    }
    this.state.path = [];
  }
  private clip() {
    this.clipType = ClipType.NORMAL;
  }
  private eoClip() {
    this.clipType = ClipType.EO;
  }
  private beginText() {
  }
  private endText() {
  }
  private setCharSpacing(spacing:number) {
    this.state.charSpacing = spacing;
  }
  private setWordSpacing(spacing:number) {
    this.state.wordSpacing = spacing;
  }
  private setHScale(scale:number) {
    this.state.hScale = scale;
  }
  private setLeading(leading:number) {
    this.state.leading = -leading;
  }
  private setFont(fontName:string, fontSize:number) {
    const font = this.commonObjs.get(fontName);
    // TODO
  }
  private setTextRenderingMode(mode:TextRenderingMode) {
    this.state.textRenderingMode  = mode;
  }
  private setTextRise(rise:number) {
    this.state.textRise = rise;
  }
  private moveText(x:number, y:number) {
  }
  private setLeadingMoveText(x:number, y:number) {
    this.setLeading(-y);
    this.moveText(x, y);
  }
  private setTextMatrix(scaleX:number, shearX:number, shearY:number, scaleY:number, offsetX:number, offsetY:number) {
    this.state.textTransformMatrix = [scaleX, shearX, shearY, scaleY, offsetX, offsetY];
  }
  private nextLine() {
    this.moveText(0, this.state.leading);
  }
  private showText(glyphs:(null|number|Glyph)[]) {
    for(const glyph of glyphs) {
      if(glyph === null) {

      } else if(typeof glyph === 'number') {

      } else {

      }
    }
  }
  private showSpacedText(glyphs:(null|number|Glyph)[]) {
    this.showText(glyphs);
  }
  private nextLineShowText() {
  }
  private nextLineSetSpacingShowText() {
  }
  private setCharWidth() {
  }
  private setCharWidthAndBounds() {
  }
  private setStrokeColorSpace() {
  }
  private setFillColorSpace() {
  }
  private setStrokeColor() {
  }
  private setStrokeColorN() {
  }
  private setFillColor() {
  }
  private setFillColorN() {
  }
  private setStrokeGray() {
  }
  private setFillGray() {
  }
  private setStrokeAlpha(a:number) {
    this.state.strokeColor = (a << 24) | (this.state.strokeColor & 0xffffff);
  }
  private setStrokeRGBColor(r:number, g:number, b:number) {
    this.state.strokeColor = ((this.state.strokeColor >>> 24) << 24) | (r << 16) | (g << 8) | b;
  }
  private setFillAlpha(a:number) {
    this.state.fillColor = (a << 24) | (this.state.fillColor & 0xffffff);
  }
  private setFillRGBColor(r:number, g:number, b:number) {
    this.state.fillColor = ((this.state.fillColor >>> 24) << 24) | (r << 16) | (g << 8) | b;
  }
  private setStrokeCMYKColor(c:number, m:number, y:number, k:number) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;
    k = (1 - k) + k;
    this.setStrokeRGBColor(Math.round(255 * Math.min(1, 1 - c * k)), Math.round(255 * Math.min(1, 1 - m * k)), Math.round(255 * Math.min(1, 1 - y * k)));
  }
  private setFillCMYKColor(c:number, m:number, y:number, k:number) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;
    k = (1 - k) + k;
    this.setFillRGBColor(Math.round(255 * Math.min(1, 1 - c * k)), Math.round(255 * Math.min(1, 1 - m * k)), Math.round(255 * Math.min(1, 1 - y * k)));
  }
  private shadingFill(shadingName:string) {
    const shading = this.commonObjs.get(shadingName);
  }
  private beginInlineImage() {
  }
  private beginImageData() {
  }
  private endInlineImage() {
  }
  private paintXObject() {
  }
  private markPoint() {
  }
  private markPointProps() {
  }
  private beginMarkedContent() {
  }
  private beginMarkedContentProps() {
  }
  private endMarkedContent() {
  }
  private beginCompat() {
  }
  private endCompat() {
  }
  private paintFormXObjectBegin(matrix:[number, number, number, number, number, number]|unknown, bbox:[number, number, number, number]) {
  }
  private paintFormXObjectEnd() {
  }
  private beginGroup() {
  }
  private endGroup() {
  }
  private beginAnnotations() {
  }
  private endAnnotations() {
  }
  private beginAnnotation() {
  }
  private endAnnotation() {
  }
  private paintJpegXObject() {
  }
  private paintImageMaskXObject() {
  }
  private paintImageMaskXObjectGroup() {
  }
  private paintImageXObject(imageName:string) {
  }
  private paintInlineImageXObject(imageName:string) {
  }
  private paintInlineImageXObjectGroup() {
  }
  private paintImageXObjectRepeat() {
  }
  private paintImageMaskXObjectRepeat() {
  }
  private paintSolidColorImageMask() {
  }
  private constructPath(ops:number[], args:unknown[]) {
    if(!this.state.pathOpen) this.state.path = [];
    const path:([number, number, number, number]|[number, number, number, number, number, number])[] = this.state.path;
    let x:number = 0;
    let y:number = 0;
    for (let i = 0, a = 0; i < ops.length; i++) {
      switch (ops[i]) {
        case OPS.moveTo: {
          x = args[a++] as number;
          y = args[a++] as number;
          break;
        }
        case OPS.lineTo: {
          path.push([x, y, args[a++] as number, args[a++] as number]);
          break;
        }
        case OPS.curveTo: {
          const cp1x = args[a++] as number;
          const cp1y = args[a++] as number;
          const cp2x = args[a++] as number;
          const cp2y = args[a++] as number;
          x = args[a++] as number;
          y = args[a++] as number;
          path.push([cp1x, cp1y, cp2x, cp2y, x, y]);
          break;
        }
        case OPS.curveTo2: {
          const cp2x = args[a++] as number;
          const cp2y = args[a++] as number;
          x = args[a++] as number;
          y = args[a++] as number;
          path.push([x, y, cp2x, cp2y, x, y]);
          break;
        }
        case OPS.curveTo3: {
          const cp1x = args[a++] as number;
          const cp1y = args[a++] as number;
          x = args[a++] as number;
          y = args[a++] as number;
          path.push([cp1x, cp1y, x, y, x, y]);
          break;
        }
        case OPS.closePath:
          if(path.length > 0) {
            this.state.pathOpen = false;
          }
          break;
        case OPS.rectangle:
          x = args[a++] as number;
          y = args[a++] as number;
          const width = args[a++] as number;
          const height = args[a++] as number;
          const xwidth = x + width;
          const yheight = y + height;
          path.push([x, y, xwidth, y]);
          path.push([xwidth, y, xwidth, yheight]);
          path.push([xwidth, yheight, x, yheight]);
          path.push([x, yheight, x, y]);
          break;
      }
    }
  }


  private static async loadDependencies(data: {
    commonObjs:PDFObjects,
    objs:PDFObjects,
  }, operatorList:PDFOperatorList) {
    const dependencies = [];
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if(operatorList.fnArray[i] != OPS.dependency) continue;
      for(const arg of operatorList.argsArray[i] as string[]) {
        const objs = arg.startsWith('g_') ? data.commonObjs : data.objs;
        dependencies.push(new Promise<unknown>(resolve => {
          objs.get(arg, resolve);
        }));
      }
    }
    return Promise.all(dependencies);
  }
  
  private fromOperatorList(operatorList:PDFOperatorList) {
    const mapping:unknown[] = [];
    for(let t of Object.keys(OPS)) {
      mapping[(OPS as { [key: string]: unknown; })[t] as number] = t;
    }
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      const args = operatorList.argsArray[i];
      console.log(mapping[operatorList.fnArray[i]], args);
    }
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      const args = operatorList.argsArray[i];
      switch(operatorList.fnArray[i]) {
        //case OPS.dependency:
        //  this.dependency(args);
        //  break;
        case OPS.setLineWidth:
          this.setLineWidth(args[0]);
          break;
        case OPS.setLineCap:
          this.setLineCap(args[0]);
          break;
        case OPS.setLineJoin:
          this.setLineJoin(args[0]);
          break;
        case OPS.setMiterLimit:
          this.setMiterLimit(args[0]);
          break;
        case OPS.setDash:
          this.setDash(args[0], args[1]);
          break;
        case OPS.setRenderingIntent:
          this.setRenderingIntent(args[0]);
          break;
        case OPS.setFlatness:
          this.setFlatness(args[0]);
          break;
        case OPS.setGState:
          this.setGState(args[0]);
          break;
        case OPS.save:
          this.save();
          break;
        case OPS.restore:
          this.restore();
          break;
        case OPS.transform:
          this.transform(args[0], args[1], args[2], args[3], args[4], args[5]);
          break;
        //case OPS.moveTo:
        //  this.moveTo(args[0], args[1]);
        //  break;
        //case OPS.lineTo:
        //  this.lineTo(args[0], args[1]);
        //  break;
        //case OPS.curveTo:
        //  this.curveTo(args[0], args[1], args[3], args[4], args[5], args[6]);
        //  break;
        //case OPS.curveTo2:
        //  this.curveTo2(0, 0, args[0], args[1], args[2], args[3]);
        //  break;
        //case OPS.curveTo3:
        //  this.curveTo3(args[0], args[1], args[2], args[3]);
        //  break;
        //case OPS.closePath:
        //  this.closePath();
        //  break;
        //case OPS.rectangle:
        //  this.rectangle(args[0], args[1], args[2], args[3]);
        //  break;
        case OPS.stroke:
          this.stroke();
          break;
        case OPS.closeStroke:
          this.closeStroke();
          break;
        case OPS.fill:
          this.fill();
          break;
        case OPS.eoFill:
          this.eoFill();
          break;
        case OPS.fillStroke:
          this.fillStroke();
          break;
        case OPS.eoFillStroke:
          this.eoFillStroke();
          break;
        case OPS.closeFillStroke:
          this.closeFillStroke();
          break;
        case OPS.closeEOFillStroke:
          this.closeEOFillStroke();
          break;
        case OPS.endPath:
          this.endPath();
          break;
        case OPS.clip:
          this.clip();
          break;
        case OPS.eoClip:
          this.eoClip();
          break;
        case OPS.beginText:
          this.beginText();
          break;
        case OPS.endText:
          this.endText();
          break;
        case OPS.setCharSpacing:
          this.setCharSpacing(args[0]);
          break;
        case OPS.setWordSpacing:
          this.setWordSpacing(args[0]);
          break;
        case OPS.setHScale:
          this.setHScale(args[0]);
          break;
        case OPS.setLeading:
          this.setLeading(args);
          break;
        case OPS.setFont:
          this.setFont(args[0], args[1]);
          break;
        case OPS.setTextRenderingMode:
          this.setTextRenderingMode(args[0]);
          break;
        case OPS.setTextRise:
          this.setTextRise(args[0]);
          break;
        case OPS.moveText:
          this.moveText(args[0], args[1]);
          break;
        case OPS.setLeadingMoveText:
          this.setLeadingMoveText(args[0], args[1]);
          break;
        case OPS.setTextMatrix:
          this.setTextMatrix(args[0], args[1], args[2], args[3], args[4], args[5]);
          break;
        case OPS.nextLine:
          this.nextLine();
          break;
        case OPS.showText:
          this.showText(args[0]);
          break;
        case OPS.showSpacedText:
          this.showSpacedText(args[0]);
          break;
        case OPS.nextLineShowText:
          this.nextLineShowText();
          break;
        case OPS.nextLineSetSpacingShowText:
          this.nextLineSetSpacingShowText();
          break;
        case OPS.setCharWidth:
          this.setCharWidth();
          break;
        case OPS.setCharWidthAndBounds:
          this.setCharWidthAndBounds();
          break;
        case OPS.setStrokeColorSpace:
          this.setStrokeColorSpace();
          break;
        case OPS.setFillColorSpace:
          this.setFillColorSpace();
          break;
        case OPS.setStrokeColor:
          this.setStrokeColor();
          break;
        case OPS.setStrokeColorN:
          if(args[0] === 'TilingPattern') {

          }
          //this.setStrokeColorN();
          break;
        case OPS.setFillColor:
          this.setFillColor();
          break;
        case OPS.setFillColorN:
          if(args[0] === 'TilingPattern') {
            
          }
          //this.setFillColorN();
          break;
        case OPS.setStrokeGray:
          this.setStrokeGray();
          break;
        case OPS.setFillGray:
          this.setFillGray();
          break;
        case OPS.setStrokeRGBColor:
          this.setStrokeRGBColor(args[0], args[1], args[2]);
          break;
        case OPS.setFillRGBColor:
          this.setFillRGBColor(args[0], args[1], args[2]);
          break;
        case OPS.setStrokeCMYKColor:
          this.setStrokeCMYKColor(args[0], args[1], args[2], args[3]);
          break;
        case OPS.setFillCMYKColor:
          this.setFillCMYKColor(args[0], args[1], args[2], args[3]);
          break;
        case OPS.shadingFill:
          this.shadingFill(args[0]);
          break;
        case OPS.beginInlineImage:
          this.beginInlineImage();
          break;
        case OPS.beginImageData:
          this.beginImageData();
          break;
        case OPS.endInlineImage:
          this.endInlineImage();
          break;
        case OPS.paintXObject:
          this.paintXObject();
          break;
        case OPS.markPoint:
          this.markPoint();
          break;
        case OPS.markPointProps:
          this.markPointProps();
          break;
        case OPS.beginMarkedContent:
          this.beginMarkedContent();
          break;
        case OPS.beginMarkedContentProps:
          this.beginMarkedContentProps();
          break;
        case OPS.endMarkedContent:
          this.endMarkedContent();
          break;
        case OPS.beginCompat:
          this.beginCompat();
          break;
        case OPS.endCompat:
          this.endCompat();
          break;
        case OPS.paintFormXObjectBegin:
          this.paintFormXObjectBegin(args[0], args[1]);
          break;
        case OPS.paintFormXObjectEnd:
          this.paintFormXObjectEnd();
          break;
        case OPS.beginGroup:
          this.beginGroup();
          break;
        case OPS.endGroup:
          this.endGroup();
          break;
        case OPS.beginAnnotations:
          this.beginAnnotations();
          break;
        case OPS.endAnnotations:
          this.endAnnotations();
          break;
        case OPS.beginAnnotation:
          this.beginAnnotation();
          break;
        case OPS.endAnnotation:
          this.endAnnotation();
          break;
        case OPS.paintJpegXObject:
          this.paintJpegXObject();
          break;
        case OPS.paintImageMaskXObject:
          this.paintImageMaskXObject();
          break;
        case OPS.paintImageMaskXObjectGroup:
          this.paintImageMaskXObjectGroup();
          break;
        case OPS.paintImageXObject:
          this.paintImageXObject(args[0]);
          break;
        case OPS.paintInlineImageXObject:
          this.paintInlineImageXObject(args[0]);
          break;
        case OPS.paintInlineImageXObjectGroup:
          this.paintInlineImageXObjectGroup();
          break;
        case OPS.paintImageXObjectRepeat:
          this.paintImageXObjectRepeat();
          break;
        case OPS.paintImageMaskXObjectRepeat:
          this.paintImageMaskXObjectRepeat();
          break;
        case OPS.paintSolidColorImageMask:
          this.paintSolidColorImageMask();
          break;
        case OPS.constructPath:
          this.constructPath(args[0], args[1]);
          break;
        //case 92: // group
        //  this.group()
          break;
      }
    }
  }
}