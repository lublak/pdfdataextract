import { OPS } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFOperatorList, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

interface Glyph {
	originalCharCode: number;
	fontChar: string;
	unicode: string;
	accent?: number;
	width: number;
	isSpace: boolean;
	isInFont: boolean;
	vmetric: [number, number, number];
	operatorListId: string;
}
interface PDFObjects {
	get(objId: string, callback: (data: unknown) => void): null;
	get(objId: string): unknown;
	has(objId: string): boolean;
	resolve(objId: string, data: unknown): void;
}
interface CMap {
	addCodespaceRange(n: number, low: number, high: number): void;
	mapCidRange(low: number, high: number, dstLow: number): void;
	mapBfRange(low: number, high: number, dstLow: number): void;
	mapBfRangeToArray(low: number, high: number, array: number[]): void;
	mapOne(src: number, dst: number): void;
	lookup(code: number): number;
	contains(code: number): boolean;
	forEach(callback: (i: number, m: number) => void): void;
	charCodeOf(value: number): number;
	getMap(): {
		[key: number]: number;
	};
	readCharCode(str: string, offset: number, out: {
		charcode: number;
		length: number;
	}): void;
	getCharCodeLength(charCode: number): number;
	length: number;
	isIdentityCMap: boolean;
}
interface ToUnicodeMap {
	length: number;
	forEach(callback: (char1: number, char2: number) => void): void;
	get(i: number): string | undefined;
	has(i: number): boolean;
	charCodeOf(v: number | unknown): number;
	amend(map: number[] | string[]): void;
}
interface Font {
	ascent: number;
	bbox: [number, number, number, number];
	black: boolean;
	bold: boolean;
	charProcOperatorList: {
		[key: string]: PDFOperatorList;
	};
	cMap: CMap;
	composite: boolean;
	cssFontInfo: {
		fontFamily: string;
		fontWeight: number;
		italicAngle: number;
	};
	data: BufferSource;
	defaultEncoding: string;
	defaultVMetrics: [number, number, number];
	defaultWidth: number;
	descent: number;
	differences: {
		[key: number]: string;
	};
	fallbackName: string;
	fontMatrix?: [number, number, number, number, number, number];
	fontType: FontType;
	isMonospace: boolean;
	isSerifFont: boolean;
	isSymbolicFont: boolean;
	isType3Font: boolean;
	italic: boolean;
	loadedName: string;
	mimetype: string;
	missingFile: boolean;
	name: string;
	remeasure: boolean;
	seacMap?: {
		[key: number]: {
			baseFontCharCode: number,
			accentFontCharCode: number,
			accentOffset: number,
		};
	};
	subtype: string;
	toFontChar?: {
		[key: number]: number;
	};
	toUnicode?: ToUnicodeMap;
	type: string;
	vertical: boolean;
	vmetrics: [number, number, number];
	widths: number[];
}


export enum ImageKind {
	/**
	 *
	 */
	GRAYSCALE_1BPP = 1,
	/**
	 *
	 */
	RGB_24BPP = 2,
	/**
	 *
	 */
	RGBA_32BPP = 3,
}

interface ImageData {
	width: number;
	height: number;
	// GRAYSCALE_1BPP
	kind?: ImageKind;
	data: Uint8Array;
}

/**
 *
 */
export class ContentInfo {

}
/**
 *
 */
export class PathInfo extends ContentInfo {
	/**
	 *
	 */
	path: ([number, number, number, number] | [number, number, number, number, number, number])[];
	/**
	 *
	 */
	open: boolean;
	/**
	 *
	 */
	stroke: {
		/**
		 *
		 */
		color: number;
		/**
		 *
		 */
		width: number;
	} | null;
	/**
	 *
	 */
	fill: {
		/**
		 *
		 */
		color: number;
	} | null;
	/**
	 * @param path
	 * @param open
	 * @param stroke
	 * @param fill
	 */
	public constructor(
		path: ([number, number, number, number] | [number, number, number, number, number, number])[],
		open: boolean,
		stroke: {
			/**
			 *
			 */
			color: number;
			/**
			 *
			 */
			width: number;
		} | null,
		fill: {
			/**
			 *
			 */
			color: number;
			/**
			 *
			 */
			eo: boolean;
		} | null
	) {
		super();
		this.path = path;
		this.open = open;
		this.stroke = stroke;
		this.fill = fill;
	}
}
/**
 *
 */
export class TextContent extends ContentInfo {
	/**
	 *
	 */
	text: string;
	/**
	 * @param text
	 */
	public constructor(text: string) {
		super();
		this.text = text;
	}
}
/**
 *
 */
export class ImageContent extends ContentInfo {
	/**
	 *
	 */
	width: number;
	/**
	 *
	 */
	height: number;
	/**
	 *
	 */
	kind: ImageKind;
	/**
	 *
	 */
	data: Uint8Array;
	/**
	 * @param width
	 * @param height
	 * @param kind
	 * @param data
	 */
	public constructor(width: number, height: number, kind: ImageKind = ImageKind.GRAYSCALE_1BPP, data: Uint8Array) {
		super();
		this.width = width;
		this.height = height;
		this.kind = kind;
		this.data = data;
	}
}

enum FontType {
	CIDFONTTYPE0 = 'CIDFONTTYPE0',
	CIDFONTTYPE0C = 'CIDFONTTYPE0C',
	CIDFONTTYPE2 = 'CIDFONTTYPE2',
	MMTYPE1 = 'MMTYPE1',
	OPENTYPE = 'OPENTYPE',
	TRUETYPE = 'TRUETYPE',
	TYPE0 = 'TYPE0',
	TYPE1 = 'TYPE1',
	TYPE1C = 'TYPE1C',
	TYPE1STANDARD = 'TYPE1STANDARD',
	TYPE3 = 'TYPE3',
	UNKNOWN = 'UNKNOWN',
}

export enum LineCap {
	/**
	 *
	 */
	BUTT = 0,
	/**
	 *
	 */
	ROUND = 1,
	/**
	 *
	 */
	SQUARE = 2,
}
export enum LineJoin {
	/**
	 *
	 */
	MITER = 0,
	/**
	 *
	 */
	ROUND = 1,
	/**
	 *
	 */
	BEVEL = 2,
}
export enum ClipType {
	/**
	 *
	 */
	NORMAL,
	/**
	 *
	 */
	EO,
}
export enum TextRenderingMode {
	/**
	 *
	 */
	FILL = 0,
	/**
	 *
	 */
	STROKE = 1,
	/**
	 *
	 */
	FILL_STROKE = 2,
	/**
	 *
	 */
	INVISIBLE = 3,
	/**
	 *
	 */
	FILL_ADD_TO_PATH = 4,
	/**
	 *
	 */
	STROKE_ADD_TO_PATH = 5,
	/**
	 *
	 */
	FILL_STROKE_ADD_TO_PATH = 6,
	/**
	 *
	 */
	ADD_TO_PATH = 7,
	/**
	 *
	 */
	FILL_STROKE_MASK = 3,
	/**
	 *
	 */
	ADD_TO_PATH_FLAG = 4,
}
class ContentInfoExtractorState {
	lineWidth: number = 1;
	lineCap?: LineCap;
	lineJoin?: LineJoin;
	miterLimit?: number;
	dashArray?: number[];
	dashPhase?: number;
	transformMatrix?: [number, number, number, number, number, number];
	textMatrix?: [number, number, number, number, number, number];
	textMatrixScale: number = 1;
	fontMatrix?: [number, number, number, number, number, number];
	path: ([number, number, number, number] | [number, number, number, number, number, number])[] = [];
	pathOpen: boolean = true;
	leading: number = 0;
	lineX: number = 0;
	lineY: number = 0;
	x: number = 0;
	y: number = 0;
	strokeColor: number = 0;
	fillColor: number = 0;
	textRise: number = 0;
	charSpacing: number = 0;
	wordSpacing: number = 0;
	hScale: number = 0;
	textRenderingMode: TextRenderingMode = TextRenderingMode.FILL;
	font?: Font;
	fontSize: number = 0;
	fontDirection: number = 1;
}
/**
 *
 */
export class ContentInfoExtractor {
	private contentInfo: ContentInfo[] = [];
	private state: ContentInfoExtractorState = new ContentInfoExtractorState();
	private clipType: ClipType | null = null;
	private stateStack: ContentInfoExtractorState[] = [];
	private page: PDFPageProxy;
	private commonObjs: PDFObjects;
	private objs: PDFObjects;

	/**
	 * @param page
	 */
	public constructor(page: PDFPageProxy) {
		this.page = page;
		this.commonObjs = page.commonObjs;
		this.objs = page.objs as unknown as PDFObjects;
	}

	/**
	 *
	 */
	public async getContentInfo(): Promise<ContentInfo[]> {
		const operatorList = await this.page.getOperatorList();
		await ContentInfoExtractor.loadDependencies(this.page as unknown as {
			commonObjs: PDFObjects;
			objs: PDFObjects;
		}, operatorList);
		this.fromOperatorList(operatorList);
		return this.contentInfo;
	}

	private dependency(ids: string[]) {
		// its loaded all together with loadDependencies
	}

	private setLineWidth(width: number) {
		this.state.lineWidth = width;
	}
	private setLineCap(lineCap: LineCap) {
		this.state.lineCap = lineCap;
	}
	private setLineJoin(lineJoin: LineJoin) {
		this.state.lineJoin = lineJoin;
	}
	private setMiterLimit(miterLimit: number) {
		this.state.miterLimit = miterLimit;
	}
	private setDash(dashArray: number[], dashPhase: number) {
		this.state.dashArray = dashArray;
		this.state.dashPhase = dashPhase;
	}
	private setRenderingIntent(intent: boolean) {
		// not used
	}
	private setFlatness(flatness: boolean) {
		// not used
	}
	private setGState(states: [[string, unknown]]) {
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
				//case 'RI':
				//	this.setRenderingIntent(value as boolean);
				//	break;
				//case 'FL':
				//	this.setFlatness(value as boolean);
				//	break;
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
			case 'OP':
			case 'op':
			case 'OPM':
			case 'BG':
			case 'BG2':
			case 'UCR':
			case 'UCR2':
			case 'TR2':
			case 'HT':
			case 'SM':
			case 'SA':
			case 'AIS':
			case 'TK':
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
		if (restoredState) this.state = restoredState;
		this.clipType = null;
	}
	private transform(scaleX: number, shearX: number, shearY: number, scaleY: number, offsetX: number, offsetY: number) {
		const oldMatrix = this.state.transformMatrix;
		if (oldMatrix == null) {
			this.state.transformMatrix = [scaleX, shearX, shearY, scaleY, offsetX, offsetY];
		} else {
			this.state.transformMatrix = [
				oldMatrix[0] * scaleX + oldMatrix[2] * shearX,
				oldMatrix[1] * scaleX + oldMatrix[3] * shearX,
				oldMatrix[0] * shearY + oldMatrix[2] * scaleY,
				oldMatrix[1] * shearY + oldMatrix[3] * scaleY,
				oldMatrix[0] * offsetX + oldMatrix[2] * offsetY + oldMatrix[4],
				oldMatrix[1] * offsetX + oldMatrix[3] * offsetY + oldMatrix[5],
			];
		}
	}
	//private moveTo(x:number, y:number) {
	//}
	//private lineTo(x:number, y:number) {
	//}
	//private curveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number) {

	//}
	//// cx1 and cy1 is the current position
	//private curveTo2(cx1:number, cy1:number, cp2x:number, cp2y:number, x:number, y:number) {
	//	this.curveTo(cx1, cy1, cp2x, cp2y, x, y)
	//}
	//private curveTo3(cp1x:number, cp1y:number, x:number, y:number) {
	//	this.curveTo(cp1x, cp1y, x, y, x, y);
	//}
	private closePath() {
		this.state.pathOpen = false;
	}
	//private rectangle(x:number, y:number, width:number, height:number) {
	//}
	private stroke() {
		this.contentInfo.push(new PathInfo(this.state.path, this.state.pathOpen, {
			color: this.state.strokeColor,
			width: this.state.lineWidth
		}, null));
		this.endPath();
	}
	private closeStroke() {
		this.closePath();
		this.stroke();
	}
	private fill() {
		this.contentInfo.push(new PathInfo(this.state.path, this.state.pathOpen, null, {
			color: this.state.fillColor,
			eo: false,
		}));
		this.endPath();
	}
	private eoFill() {
		this.contentInfo.push(new PathInfo(this.state.path, this.state.pathOpen, null, {
			color: this.state.fillColor,
			eo: true,
		}));
		this.endPath();
	}
	private fillStroke() {
		this.contentInfo.push(new PathInfo(this.state.path, this.state.pathOpen, {
			color: this.state.strokeColor,
			width: this.state.lineWidth
		}, {
			color: this.state.fillColor,
			eo: false,
		}));
		this.endPath();
	}
	private eoFillStroke() {
		this.contentInfo.push(new PathInfo(this.state.path, this.state.pathOpen, {
			color: this.state.strokeColor,
			width: this.state.lineWidth
		}, {
			color: this.state.fillColor,
			eo: true,
		}));
		this.endPath();
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
		if (this.clipType) {

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
		this.state.x = this.state.lineX = 0;
		this.state.y = this.state.lineY = 0;
		this.state.textMatrix = undefined;
		this.state.textMatrixScale = 1;
	}
	private endText() {
	}
	private setCharSpacing(spacing: number) {
		this.state.charSpacing = spacing;
	}
	private setWordSpacing(spacing: number) {
		this.state.wordSpacing = spacing;
	}
	private setHScale(scale: number) {
		this.state.hScale = scale / 100;
	}
	private setLeading(leading: number) {
		this.state.leading = -leading;
	}
	private setFont(fontName: string, fontSize: number) {
		const font = this.commonObjs.get(fontName);
		this.state.font = font as Font;
		this.state.fontSize = fontSize;
		if (fontSize < 0) {
			fontSize = -fontSize;
			this.state.fontDirection = -1;
		} else {
			this.state.fontDirection = 1;
		}
	}
	private setTextRenderingMode(mode: TextRenderingMode) {
		this.state.textRenderingMode = mode;
	}
	private setTextRise(rise: number) {
		this.state.textRise = rise;
	}
	private moveText(x: number, y: number) {
		this.state.x = this.state.lineX += x;
		this.state.y = this.state.lineY += y;
	}
	private setLeadingMoveText(x: number, y: number) {
		this.setLeading(-y);
		this.moveText(x, y);
	}
	private setTextMatrix(scaleX: number, shearX: number, shearY: number, scaleY: number, offsetX: number, offsetY: number) {
		this.state.textMatrix = [scaleX, shearX, shearY, scaleY, offsetX, offsetY];
		this.state.textMatrixScale = Math.hypot(scaleX, shearX);

		this.state.x = this.state.lineX = 0;
		this.state.y = this.state.lineY = 0;
	}
	private nextLine() {
		this.moveText(0, this.state.leading);
	}
	private showText(glyphs: (null | number | Glyph)[]) {
		const font = this.state.font;
		if (font == null) return;
		const fontSize = this.state.fontSize;
		if (fontSize === 0) return;
		const charSpacing = this.state.charSpacing;
		const wordSpacing = this.state.wordSpacing;
		const fontDirection = this.state.fontDirection;

		const hScale = this.state.hScale * fontDirection;
		const vertical = font.vertical;
		const spacingDir = vertical ? 1 : -1;
		const defaultVMetrics = font.defaultVMetrics;
		const widthAdvanceScale = fontSize * (this.state.fontMatrix == null ? 1 : this.state.fontMatrix[0]);

		let textContent = '';

		let x = 0;
		for (const glyph of glyphs) {
			if (glyph === null) {
				x += fontDirection * wordSpacing;
			} else if (typeof glyph === 'number') {
				x += (spacingDir * glyph * fontSize) / 1000;
			} else {
				const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
				const character = glyph.fontChar;
				let scaledX, scaledY;
				let width = glyph.width;
				if (vertical) {
					let vx;
					const vmetric = glyph.vmetric || defaultVMetrics;
					vx = glyph.vmetric ? vmetric[1] : width * 0.5;
					vx = -vx * widthAdvanceScale;
					const vy = vmetric[2] * widthAdvanceScale;

					width = vmetric ? -vmetric[0] : width;
					scaledX = vx / 1;
					scaledY = (x + vy) / 1;
				} else {
					scaledX = x / 1;
					scaledY = 0;
				}

				if (glyph.isInFont || font.missingFile) {
					// TODO
					textContent += character;
				} else {

				}

				let charWidth;
				if (vertical) {
					charWidth = width * widthAdvanceScale - spacing * fontDirection;
				} else {
					charWidth = width * widthAdvanceScale + spacing * fontDirection;
				}

				x += charWidth;
			}
		}
		this.contentInfo.push(new TextContent(textContent));
		if (vertical) {
			this.state.y -= x;
		} else {
			this.state.x += x * hScale;
		}
	}
	private showSpacedText(glyphs: (null | number | Glyph)[]) {
		// not used
	}
	private nextLineShowText(glyphs: (number | Glyph | null)[]) {
		// not used
	}
	private nextLineSetSpacingShowText(wordSpacing: number, charSpacing: number, glyphs: (number | Glyph | null)[]) {
		// not used
	}
	private setCharWidth(xWidth: number, yWidth: number) {
		// not used
	}
	private setCharWidthAndBounds(xWidth: number, yWidth: number, llx: number, lly: number, urx: number, ury: number) {
	}
	private setStrokeColorSpace() {
		// not used
	}
	private setFillColorSpace() {
		// not used
	}
	private setStrokeColor() {
		// not used
	}
	private setStrokeColorN() {
		// not used
	}
	private setFillColor() {
		// not used
	}
	private setFillColorN() {
		// not used
	}
	private setStrokeGray(g: number) {
		// not used
	}
	private setFillGray(g: number) {
		// not used
	}
	private setStrokeAlpha(a: number) {
		this.state.strokeColor = (a << 24) | (this.state.strokeColor & 0xffffff);
	}
	private setStrokeRGBColor(r: number, g: number, b: number) {
		this.state.strokeColor = ((this.state.strokeColor >>> 24) << 24) | (r << 16) | (g << 8) | b;
	}
	private setFillAlpha(a: number) {
		this.state.fillColor = (a << 24) | (this.state.fillColor & 0xffffff);
	}
	private setFillRGBColor(r: number, g: number, b: number) {
		this.state.fillColor = ((this.state.fillColor >>> 24) << 24) | (r << 16) | (g << 8) | b;
	}
	private setStrokeCMYKColor(c: number, m: number, y: number, k: number) {
		// not used
	}
	private setFillCMYKColor(c: number, m: number, y: number, k: number) {
		// not used
	}
	private shadingFill(shadingName: string) {
		const shading = this.commonObjs.get(shadingName);
	}
	private beginInlineImage() {
		// not used
	}
	private beginImageData() {
		// not used
	}
	private endInlineImage() {
		// not used
	}
	private paintXObject() {
		// not used
	}
	private markPoint() {
		// not used
	}
	private markPointProps() {
		// not used
	}
	private beginMarkedContent() {
	}
	private beginMarkedContentProps() {
	}
	private endMarkedContent() {
	}
	private beginCompat() {
		// not used
	}
	private endCompat() {
		// not used
	}
	private paintFormXObjectBegin(matrix: [number, number, number, number, number, number] | unknown, bbox: [number, number, number, number]) {
	}
	private paintFormXObjectEnd() {
	}
	private beginGroup() {
	}
	private endGroup() {
	}
	private beginAnnotation() {
	}
	private endAnnotation() {
	}
	private paintJpegXObject() {
		// not used
	}
	private paintImageMaskXObject() {
	}
	private paintImageMaskXObjectGroup() {
	}
	private paintImageXObject(imageName: string) {
		this.paintInlineImageXObject((imageName.startsWith('g_') ? this.commonObjs.get(imageName) : this.objs.get(imageName)) as ImageData);
	}
	private paintInlineImageXObject(imageData: ImageData) {
		this.contentInfo.push(new ImageContent(imageData.width, imageData.height, imageData.kind, imageData.data));
	}
	private paintInlineImageXObjectGroup() {
		// not used
	}
	private paintImageXObjectRepeat() {
		// not used
	}
	private paintImageMaskXObjectRepeat() {
		// not used
	}
	private paintSolidColorImageMask() {
	}
	private constructPath(ops: number[], args: unknown[]) {
		if (!this.state.pathOpen) this.state.path = [];
		const path: ([number, number, number, number] | [number, number, number, number, number, number])[] = this.state.path;
		let x: number = 0;
		let y: number = 0;
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
				if (path.length > 0) {
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
		/**
		 *
		 */
		commonObjs: PDFObjects,
		/**
		 *
		 */
		objs: PDFObjects,
	}, operatorList: PDFOperatorList) {
		const dependencies = [];
		for (let i = 0; i < operatorList.fnArray.length; i++) {
			if (operatorList.fnArray[i] != OPS.dependency) continue;
			for (const arg of operatorList.argsArray[i] as string[]) {
				const objs = arg.startsWith('g_') ? data.commonObjs : data.objs;
				dependencies.push(new Promise<unknown>(resolve => {
					objs.get(arg, resolve);
				}));
			}
		}
		return Promise.all(dependencies);
	}

	private fromOperatorList(operatorList: PDFOperatorList) {
		const mapping: unknown[] = [];
		for (const t of Object.keys(OPS)) {
			mapping[(OPS as { [key: string]: unknown; })[t] as number] = t;
		}
		for (let i = 0; i < operatorList.fnArray.length; i++) {
			const args = operatorList.argsArray[i];
			console.log(mapping[operatorList.fnArray[i]], args);
		}
		for (let i = 0; i < operatorList.fnArray.length; i++) {
			const args = operatorList.argsArray[i];
			switch (operatorList.fnArray[i]) {
			//case OPS.dependency:
			//	this.dependency(args);
			//	break;
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
				//case OPS.setRenderingIntent:
				//	this.setRenderingIntent(args[0]);
				//	break;
				//case OPS.setFlatness:
				//	this.setFlatness(args[0]);
				//	break;
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
				//	this.moveTo(args[0], args[1]);
				//	break;
				//case OPS.lineTo:
				//	this.lineTo(args[0], args[1]);
				//	break;
				//case OPS.curveTo:
				//	this.curveTo(args[0], args[1], args[3], args[4], args[5], args[6]);
				//	break;
				//case OPS.curveTo2:
				//	this.curveTo2(0, 0, args[0], args[1], args[2], args[3]);
				//	break;
				//case OPS.curveTo3:
				//	this.curveTo3(args[0], args[1], args[2], args[3]);
				//	break;
				//case OPS.closePath:
				//	this.closePath();
				//	break;
				//case OPS.rectangle:
				//	this.rectangle(args[0], args[1], args[2], args[3]);
				//	break;
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
				//case OPS.showSpacedText:
				//	this.showSpacedText(args[0]);
				//	break;
				//case OPS.nextLineShowText:
				//	this.nextLineShowText(args[0]);
				//	break;
				//case OPS.nextLineSetSpacingShowText:
				//	this.nextLineSetSpacingShowText(args[0], args[1], args[2]);
				//	break;
				//case OPS.setCharWidth:
				//	this.setCharWidth(args[0], args[1]);
				//	break;
			case OPS.setCharWidthAndBounds:
				this.setCharWidthAndBounds(args[0], args[1], args[2], args[3], args[4], args[5]);
				break;
				//case OPS.setStrokeColorSpace:
				//	this.setStrokeColorSpace();
				//	break;
				//case OPS.setFillColorSpace:
				//	this.setFillColorSpace();
				//	break;
				//case OPS.setStrokeColor:
				//	this.setStrokeColor();
				//	break;
				//case OPS.setStrokeColorN:
				//	this.setStrokeColorN();
				//	break;
				//case OPS.setFillColor:
				//	this.setFillColor();
				//	break;
				//case OPS.setFillColorN:
				//	this.setFillColorN();
				//	break;
				//case OPS.setStrokeGray:
				//	this.setStrokeGray(args[0]);
				//	break;
				//case OPS.setFillGray:
				//	this.setFillGray(args[0]);
				//	break;
			case OPS.setStrokeRGBColor:
				this.setStrokeRGBColor(args[0], args[1], args[2]);
				break;
			case OPS.setFillRGBColor:
				this.setFillRGBColor(args[0], args[1], args[2]);
				break;
				//case OPS.setStrokeCMYKColor:
				//	this.setStrokeCMYKColor(args[0], args[1], args[2], args[3]);
				//	break;
				//case OPS.setFillCMYKColor:
				//	this.setFillCMYKColor(args[0], args[1], args[2], args[3]);
				//	break;
			case OPS.shadingFill:
				this.shadingFill(args[0]);
				break;
				//case OPS.beginInlineImage:
				//	this.beginInlineImage();
				//	break;
				//case OPS.beginImageData:
				//	this.beginImageData();
				//	break;
				//case OPS.endInlineImage:
				//	this.endInlineImage();
				//	break;
				//case OPS.paintXObject:
				//	this.paintXObject();
				//	break;
				//case OPS.markPoint:
				//	this.markPoint();
				//	break;
				//case OPS.markPointProps:
				//	this.markPointProps();
				//	break;
			case OPS.beginMarkedContent:
				this.beginMarkedContent();
				break;
			case OPS.beginMarkedContentProps:
				this.beginMarkedContentProps();
				break;
			case OPS.endMarkedContent:
				this.endMarkedContent();
				break;
				//case OPS.beginCompat:
				//	this.beginCompat();
				//	break;
				//case OPS.endCompat:
				//	this.endCompat();
				//	break;
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
			case OPS.beginAnnotation:
				this.beginAnnotation();
				break;
			case OPS.endAnnotation:
				this.endAnnotation();
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
				//case OPS.paintInlineImageXObject:
				//	this.paintInlineImageXObject(args[0]);
				//	break;
				//case OPS.paintInlineImageXObjectGroup:
				//	this.paintInlineImageXObjectGroup(args[0], args[1]);
				//	break;
				//case OPS.paintImageXObjectRepeat:
				//	this.paintImageXObjectRepeat(args[0], args[1], args[2], args[3]);
				//	break;
				//case OPS.paintImageMaskXObjectRepeat:
				//	this.paintImageMaskXObjectRepeat();
				//	break;
			case OPS.paintSolidColorImageMask:
				this.paintSolidColorImageMask();
				break;
			case OPS.constructPath:
				this.constructPath(args[0], args[1]);
				break;
				//case 92: // group
				//	this.group()
				break;
			}
		}
	}
}