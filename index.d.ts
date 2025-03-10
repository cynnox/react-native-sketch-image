import * as React from "react";
import { ImageResolvedAssetSource, StyleProp, ViewProperties, ViewStyle } from "react-native";

type ImageType = "png" | "jpg";

type Size = {
    width: number;
    height: number;
};

type PathData = {
    id: number;
    color: string;
    width: number;
    data: string[];
};

type Path = {
    drawer?: string;
    size: Size;
    path: PathData;
};

type DrawingStateEvent = {
    canUndo?: boolean;
    canDelete?:boolean;
    shapeType ?: string;
    drawingStep ?: number;
}

type CanvasText = {
    text: string;
    font?: string;
    fontSize?: number;
    fontColor?: string;
    overlay?: "TextOnSketch" | "SketchOnText";
    anchor: { x: number; y: number };
    position: { x: number; y: number };
    coordinate?: "Absolute" | "Ratio";
    /**
     * If your text is multiline, `alignment` can align shorter lines with left/center/right.
     */
    alignment?: "Left" | "Center" | "Right";
    /**
     * If your text is multiline, `lineHeightMultiple` can adjust the space between lines.
     */
    lineHeightMultiple?: number;
};

export interface SavePreference {
    folder: string;
    filename: string;
    transparent: boolean;
    imageType: ImageType;
    includeImage?: boolean;
    includeText?: boolean;
    cropToImageSize?: boolean;
    copyToGallery?: boolean;
}

export interface LocalSourceImage {
    filename: string;
    directory?: string;
    mode?: "AspectFill" | "AspectFit" | "ScaleToFill";
}

export interface ShapeConfiguration {
    shapeBorderColor?: string;
    shapeBorderStyle?: "Dashed" | "Solid";
    shapeBorderStrokeWidth?: number;
    shapeColor?: string;
    shapeStrokeWidth?: number;
}

export interface AddShapeConfig {
    shapeType: "Circle" | "Text" | "Image" | "Rect" | "Square" | "Triangle" | "Arrow" | "Ruler" | "MeasurementTool";
    textShapeFontType?: string;
    textShapeFontSize?: number;
    textShapeText?: string;
    imageShapeAsset?: string | ImageResolvedAssetSource;
}

export interface ImageEditorProps {
    style?: StyleProp<ViewStyle>;
    strokeColor?: string;
    strokeWidth?: number;
    user?: string;

    text?: CanvasText[];
    localSourceImage?: LocalSourceImage;
    touchEnabled?: boolean;
    measuredWidth?: number,
    measuredHeight?: number,
    /**
     * {
     *    shapeBorderColor: string,
     *    shapeBorderStyle?: 'Dashed' | 'Solid'
     *    shapeBorderStrokeWidth?: number
     *    shapeColor: string,
     *    shapeStrokeWidth: number
     * }
     */
    shapeConfiguration?: ShapeConfiguration;

    /**
     * Android Only: Provide a Dialog Title for the Image Saving PermissionDialog. Defaults to empty string if not set
     */
    permissionDialogTitle?: string;

    /**
     * Android Only: Provide a Dialog Message for the Image Saving PermissionDialog. Defaults to empty string if not set
     */
    permissionDialogMessage?: string;

    onStrokeStart?: () => void;
    onStrokeChanged?: () => void;
    onStrokeEnd?: (path: Path, gestureState : string) => void;
    onSketchSaved?: (result: boolean, path: string) => void;
    onPathsChange?: (pathsCount: number) => void;
    onShapeSelectionChanged?: (isShapeSelected: boolean) => void;
    onDrawingStateChanged?: (event: DrawingStateEvent) => void;
    onPathIdAssigned?:() => void
    onStrokeChangedData?:(path : Path) => void;
}

export class ImageEditor extends React.Component<ImageEditorProps & ViewProperties> {
    clear(): void;
    undo(): number;
    undoShape(): number;
    addPath(data: Path): void;
    deletePath(id: number): void;
    addShape(config: AddShapeConfig): void;
    deleteSelectedShape(): void;
    unselectShape(): void;
    increaseSelectedShapeFontsize(): void;
    decreaseSelectedShapeFontsize(): void;
    changeSelectedShapeText(newText: String): void;
    setPathId(id : any): void;

    /**
     * @param imageType "png" or "jpg"
     * @param includeImage Set to `true` to include the image loaded from `LocalSourceImage`
     * @param includeText Set to `true` to include the text drawn from `Text`.
     * @param cropToImageSize Set to `true` to crop output image to the image loaded from `LocalSourceImage`
     */
    save(
        imageType: ImageType,
        transparent: boolean,
        folder: string,
        filename: string,
        includeImage: boolean,
        includeText: boolean,
        cropToImageSize: boolean,
        copyToGallery: boolean,
    ): void;
    getPaths(): Path[];

    /**
     * @param imageType "png" or "jpg"
     * @param includeImage Set to `true` to include the image loaded from `LocalSourceImage`
     * @param includeText Set to `true` to include the text drawn from `Text`.
     * @param cropToImageSize Set to `true` to crop output image to the image loaded from `LocalSourceImage`
     */
    getBase64(
        imageType: ImageType,
        transparent: boolean,
        includeImage: boolean,
        includeText: boolean,
        cropToImageSize: boolean,
        callback: (error: any, result?: string) => void
    ): void;

    static MAIN_BUNDLE: string;
    static DOCUMENT: string;
    static LIBRARY: string;
    static CACHES: string;
}

export interface RNImageEditorProps {
    containerStyle?: StyleProp<ViewStyle>;
    canvasStyle?: StyleProp<ViewStyle>;
    onStrokeStart?: () => void;
    onStrokeChanged?: () => void;
    onStrokeEnd?: (path: Path, gestureState : string) => void;
    onClosePressed?: () => void;
    onUndoPressed?: (id: number) => void;
    onDrawingStateChanged?: (event: DrawingStateEvent) => void;
    onClearPressed?: () => void;
    onPathsChange?: (pathsCount: number) => void;
    user?: string;

    closeComponent?: JSX.Element;
    eraseComponent?: JSX.Element;
    deleteSelectedShapeComponent?: JSX.Element;
    undoComponent?: JSX.Element;
    clearComponent?: JSX.Element;
    saveComponent?: JSX.Element;
    strokeComponent?: (color: string) => JSX.Element;
    strokeSelectedComponent?: (color: string, index: number, changed: boolean) => JSX.Element;
    strokeWidthComponent?: (width: number) => JSX.Element;

    strokeColors?: { color: string }[];
    defaultStrokeIndex?: number;
    defaultStrokeWidth?: number;

    minStrokeWidth?: number;
    maxStrokeWidth?: number;
    strokeWidthStep?: number;

    measuredWidth?: number,
    measuredHeight?: number,

    /**
     * @param imageType "png" or "jpg"
     * @param includeImage default true
     * @param cropToImageSize default false
     */
    savePreference?: () => {
        folder: string;
        filename: string;
        transparent: boolean;
        imageType: ImageType;
        includeImage?: boolean;
        includeText?: boolean;
        cropToImageSize?: boolean;
    };
    onSketchSaved?: (result: boolean, path: string) => void;
    onShapeSelectionChanged?: (isShapeSelected: boolean) => void;

    text?: CanvasText[];
    /**
     * {
     *    path: string,
     *    directory: string,
     *    mode: 'AspectFill' | 'AspectFit' | 'ScaleToFill'
     * }
     */
    localSourceImage?: LocalSourceImage;
    touchEnabled?: boolean;
    /**
     * {
     *    shapeBorderColor: string,
     *    shapeBorderStyle?: 'Dashed' | 'Solid'
     *    shapeBorderStrokeWidth?: number
     *    shapeColor: string,
     *    shapeStrokeWidth: number
     * }
     */
    shapeConfiguration?: ShapeConfiguration;
}

export default class RNImageEditor extends React.Component<RNImageEditorProps & ViewProperties> {
    clear(): void;
    undo(): number;
    addPath(data: Path): void;
    deletePath(id: number): void;
    addShape(config: AddShapeConfig): void;
    deleteSelectedShape(): void;
    unselectShape(): void;
    increaseSelectedShapeFontsize(): void;
    decreaseSelectedShapeFontsize(): void;
    changeSelectedShapeText(newText: String): void;
    save(): void;
    nextStrokeWidth(): void;

    static MAIN_BUNDLE: string;
    static DOCUMENT: string;
    static LIBRARY: string;
    static CACHES: string;
}
