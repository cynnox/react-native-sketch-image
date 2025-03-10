import React from "react";
import PropTypes from "prop-types";
import ReactNative, { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ViewPropTypes } from "deprecated-react-native-prop-types";
import ImageEditor from "./src/ImageEditor";
import { requestPermissions } from "./src/handlePermissions";

export default class RNImageEditor extends React.Component {
    static propTypes = {
        containerStyle: ViewPropTypes.style,
        canvasStyle: ViewPropTypes.style,
        onStrokeStart: PropTypes.func,
        onStrokeChanged: PropTypes.func,
        onStrokeEnd: PropTypes.func,
        onClosePressed: PropTypes.func,
        onUndoPressed: PropTypes.func,
        onClearPressed: PropTypes.func,
        onPathsChange: PropTypes.func,
        user: PropTypes.string,

        closeComponent: PropTypes.node,
        eraseComponent: PropTypes.node,
        undoComponent: PropTypes.node,
        clearComponent: PropTypes.node,
        saveComponent: PropTypes.node,
        deleteSelectedShapeComponent: PropTypes.node,
        strokeComponent: PropTypes.func,
        strokeSelectedComponent: PropTypes.func,
        strokeWidthComponent: PropTypes.func,

        strokeColors: PropTypes.arrayOf(PropTypes.shape({ color: PropTypes.string })),
        defaultStrokeIndex: PropTypes.number,
        defaultStrokeWidth: PropTypes.number,

        minStrokeWidth: PropTypes.number,
        maxStrokeWidth: PropTypes.number,
        strokeWidthStep: PropTypes.number,

        measuredWidth: PropTypes.number,
        measuredHeight: PropTypes.number,

        savePreference: PropTypes.func,
        onSketchSaved: PropTypes.func,
        onShapeSelectionChanged: PropTypes.func,
        onDrawingStateChanged: PropTypes.func,
        shapeConfiguration: PropTypes.shape({
            shapeBorderColor: PropTypes.string,
            shapeBorderStyle: PropTypes.string,
            shapeBorderStrokeWidth: PropTypes.number,
            shapeColor: PropTypes.string,
            shapeStrokeWidth: PropTypes.number
        }),

        text: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string,
                font: PropTypes.string,
                fontSize: PropTypes.number,
                fontColor: PropTypes.string,
                overlay: PropTypes.oneOf(["TextOnSketch", "SketchOnText"]),
                anchor: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
                position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
                coordinate: PropTypes.oneOf(["Absolute", "Ratio"]),
                alignment: PropTypes.oneOf(["Left", "Center", "Right"]),
                lineHeightMultiple: PropTypes.number
            })
        ),
        localSourceImage: PropTypes.shape({
            filename: PropTypes.string,
            directory: PropTypes.string,
            mode: PropTypes.string
        }),

        permissionDialogTitle: PropTypes.string,
        permissionDialogMessage: PropTypes.string,

        onPathIdAssigned: PropTypes.func,
        onStrokeChangedData: PropTypes.func
    };

    static defaultProps = {
        containerStyle: null,
        canvasStyle: null,
        onStrokeStart: () => {},
        onStrokeChanged: () => {},
        onStrokeEnd: () => {},
        onClosePressed: () => {},
        onUndoPressed: () => {},
        onClearPressed: () => {},
        onPathsChange: () => {},
        onPathIdAssigned: () => {},
        onStrokeChangedData: () => {},
        user: null,

        closeComponent: null,
        eraseComponent: null,
        undoComponent: null,
        clearComponent: null,
        saveComponent: null,
        deleteSelectedShapeComponent: null,
        strokeComponent: null,
        strokeSelectedComponent: null,
        strokeWidthComponent: null,

        strokeColors: [
            { color: "#000000" },
            { color: "#FF0000" },
            { color: "#00FFFF" },
            { color: "#0000FF" },
            { color: "#0000A0" },
            { color: "#ADD8E6" },
            { color: "#800080" },
            { color: "#FFFF00" },
            { color: "#00FF00" },
            { color: "#FF00FF" },
            { color: "#FFFFFF" },
            { color: "#C0C0C0" },
            { color: "#808080" },
            { color: "#FFA500" },
            { color: "#A52A2A" },
            { color: "#800000" },
            { color: "#008000" },
            { color: "#808000" }
        ],
        alphlaValues: ["33", "77", "AA", "FF"],
        defaultStrokeIndex: 0,
        defaultStrokeWidth: 3,

        minStrokeWidth: 3,
        maxStrokeWidth: 15,
        strokeWidthStep: 3,

        measuredWidth : 0,
        measuredHeight : 0,

        savePreference: null,
        onSketchSaved: () => {},
        onShapeSelectionChanged: () => {},
        onDrawingStateChanged: () => {},
        shapeConfiguration: {
            shapeBorderColor: "transparent",
            shapeBorderStyle: "Dashed",
            shapeBorderStrokeWidth: 1,
            shapeColor: "#000000",
            shapeStrokeWidth: 3
        },

        text: null,
        localSourceImage: null,

        permissionDialogTitle: "",
        permissionDialogMessage: ""
    };

    constructor(props) {
        super(props);

        this.state = {
            color: props.strokeColors[props.defaultStrokeIndex].color,
            strokeWidth: props.defaultStrokeWidth,
            alpha: "FF"
        };

        this._colorChanged = false;
        this._strokeWidthStep = props.strokeWidthStep;
        this._alphaStep = -1;
    }

    clear() {
        this._sketchCanvas.clear();
    }

    undo() {
        return this._sketchCanvas.undo();
    }

    undoShape() {
        return this._sketchCanvas.undoShape();
    }

    addPath(data) {
        this._sketchCanvas.addPath(data);
    }

    deletePath(id) {
        this._sketchCanvas.deletePath(id);
    }

    deleteSelectedShape() {
        this._sketchCanvas.deleteSelectedShape();
    }

    unselectShape() {
        this._sketchCanvas.unselectShape();
    }

    addShape(config) {
        this._sketchCanvas.addShape(config);
    }

    increaseSelectedShapeFontsize() {
        this._sketchCanvas.increaseSelectedShapeFontsize();
    }

    decreaseSelectedShapeFontsize() {
        this._sketchCanvas.decreaseSelectedShapeFontsize();
    }

    changeSelectedShapeText(newText) {
        this._sketchCanvas.changeSelectedShapeText(newText);
    }

    save() {
        if (this.props.savePreference) {
            const p = this.props.savePreference();
            this._sketchCanvas.save(
                p.imageType,
                p.transparent,
                p.folder ? p.folder : "",
                p.filename,
                p.includeImage !== false,
                p.includeText !== false,
                p.cropToImageSize || false,
                p.copyToGallery || false,
            );
        } else {
            const date = new Date();
            this._sketchCanvas.save(
                "png",
                false,
                "",
                date.getFullYear() +
                    "-" +
                    (date.getMonth() + 1) +
                    "-" +
                    ("0" + date.getDate()).slice(-2) +
                    " " +
                    ("0" + date.getHours()).slice(-2) +
                    "-" +
                    ("0" + date.getMinutes()).slice(-2) +
                    "-" +
                    ("0" + date.getSeconds()).slice(-2),
                true,
                true,
                false,
                false
            );
        }
    }

    nextStrokeWidth() {
        if (
            (this.state.strokeWidth >= this.props.maxStrokeWidth && this._strokeWidthStep > 0) ||
            (this.state.strokeWidth <= this.props.minStrokeWidth && this._strokeWidthStep < 0)
        )
            this._strokeWidthStep = -this._strokeWidthStep;
        this.setState({ strokeWidth: this.state.strokeWidth + this._strokeWidthStep });
    }

    _renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={{ marginHorizontal: 2.5 }}
            onPress={() => {
                if (this.state.color === item.color) {
                    const index = this.props.alphlaValues.indexOf(this.state.alpha);
                    if (this._alphaStep < 0) {
                        this._alphaStep = index === 0 ? 1 : -1;
                        this.setState({ alpha: this.props.alphlaValues[index + this._alphaStep] });
                    } else {
                        this._alphaStep = index === this.props.alphlaValues.length - 1 ? -1 : 1;
                        this.setState({ alpha: this.props.alphlaValues[index + this._alphaStep] });
                    }
                } else {
                    this.setState({ color: item.color });
                    this._colorChanged = true;
                }
            }}
        >
            {this.state.color !== item.color && this.props.strokeComponent && this.props.strokeComponent(item.color)}
            {this.state.color === item.color &&
                this.props.strokeSelectedComponent &&
                this.props.strokeSelectedComponent(item.color + this.state.alpha, index, this._colorChanged)}
        </TouchableOpacity>
    );

    componentDidUpdate() {
        this._colorChanged = false;
    }

    async componentDidMount() {
        const isStoragePermissionAuthorized = await requestPermissions(
            this.props.permissionDialogTitle,
            this.props.permissionDialogMessage
        );
    }

    render() {
        return (
            <View style={this.props.containerStyle}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-start" }}>
                        {this.props.closeComponent && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.onClosePressed();
                                }}
                            >
                                {this.props.closeComponent}
                            </TouchableOpacity>
                        )}

                        {this.props.eraseComponent && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ color: "#00000000" });
                                }}
                            >
                                {this.props.eraseComponent}
                            </TouchableOpacity>
                        )}

                        {this.props.deleteSelectedShapeComponent && (
                            <TouchableOpacity
                                style={{ opacity: this.props.touchEnabled ? 0.5 : 1 }}
                                disabled={this.props.touchEnabled}
                                onPress={() => {
                                    this.deleteSelectedShape();
                                }}
                            >
                                {this.props.deleteSelectedShapeComponent}
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-end" }}>
                        {this.props.strokeWidthComponent && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.nextStrokeWidth();
                                }}
                            >
                                {this.props.strokeWidthComponent(this.state.strokeWidth)}
                            </TouchableOpacity>
                        )}

                        {this.props.undoComponent && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.onUndoPressed(this.undo());
                                }}
                            >
                                {this.props.undoComponent}
                            </TouchableOpacity>
                        )}

                        {this.props.clearComponent && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.clear();
                                    this.props.onClearPressed();
                                }}
                            >
                                {this.props.clearComponent}
                            </TouchableOpacity>
                        )}

                        {this.props.saveComponent && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.save();
                                }}
                            >
                                {this.props.saveComponent}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <ImageEditor
                    ref={(ref) => (this._sketchCanvas = ref)}
                    style={this.props.canvasStyle}
                    strokeColor={this.state.color + (this.state.color.length === 9 ? "" : this.state.alpha)}
                    shapeConfiguration={this.props.shapeConfiguration}
                    onStrokeStart={this.props.onStrokeStart}
                    onStrokeChanged={this.props.onStrokeChanged}
                    onStrokeEnd={this.props.onStrokeEnd}
                    user={this.props.user}
                    strokeWidth={this.state.strokeWidth}
                    onSketchSaved={(success, path) => this.props.onSketchSaved(success, path)}
                    onShapeSelectionChanged={(isShapeSelected) => this.props.onShapeSelectionChanged(isShapeSelected)}
                    onDrawingStateChanged={(e) => this.props.onDrawingStateChanged(e)}
                    touchEnabled={this.props.touchEnabled}
                    onPathsChange={this.props.onPathsChange}
                    text={this.props.text}
                    localSourceImage={this.props.localSourceImage}
                    permissionDialogTitle={this.props.permissionDialogTitle}
                    permissionDialogMessage={this.props.permissionDialogMessage}
                    measuredWidth={this.props.measuredWidth}
                    measuredHeight={this.props.measuredHeight}
                />
                <View style={{ flexDirection: "row" }}>
                    <FlatList
                        data={this.props.strokeColors}
                        extraData={this.state}
                        keyExtractor={() => Math.ceil(Math.random() * 10000000).toString()}
                        renderItem={this._renderItem}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        );
    }
}

RNImageEditor.MAIN_BUNDLE = ImageEditor.MAIN_BUNDLE;
RNImageEditor.DOCUMENT = ImageEditor.DOCUMENT;
RNImageEditor.LIBRARY = ImageEditor.LIBRARY;
RNImageEditor.CACHES = ImageEditor.CACHES;

export { ImageEditor };
