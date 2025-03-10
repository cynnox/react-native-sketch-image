import React from "react";
import { Alert, Platform, Text, TouchableOpacity, View, Image } from "react-native";
import { ImageEditor } from "@hoverinc/react-native-sketch-canvas";

export const CanvasOnly = ({ styles, state, canvas, setState }) => {

  const endpointSource = Image.resolveAssetSource(require('./assets/endpoint.png'));

  console.log('endpointSource', endpointSource);
  return <View style={{ flex: 1, flexDirection: "row" }}>
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity style={styles.functionButton} onPress={() => {
          setState({ example: 0 });
        }}>
          <Text style={{ color: "white" }}>Close</Text>
        </TouchableOpacity>
        <Image style={{ height: 50, resizeMode : 'contain'}} source={require('./assets/endpoint.png')}/>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.functionButton} onPress={() => {
            canvas.current.addShape({ shapeType: "MeasurementTool", imageShapeAsset : endpointSource.uri  });
          }}>
            <Text style={{ color: "white" }}>Tool</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionButton} onPress={() => {
            canvas.current.addShape({ shapeType: "Text", textShapeText : 'WWW WW', textShapeFontSize: Platform.OS === 'ios' ? 20 : 14});
          }}>
            <Text style={{ color: "white" }}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionButton} onPress={() => {
            setState({ thickness: 10 });
          }}>
            <Text style={{ color: "white" }}>Thick</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.functionButton} onPress={() => {
            setState({ thickness: 5 });
          }}>
            <Text style={{ color: "white" }}>Thin</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ImageEditor
        localSourceImage={{ filename: "house.png", directory: ImageEditor.MAIN_BUNDLE,  }}
        ref={canvas}
        style={{
          flex : 1
        }}
        strokeColor={state.color}
        strokeWidth={state.thickness}
        onStrokeStart={(x, y) => {
          console.log("onStrokeStart", "x: ", x, ", y: ", y);
          setState({ message: "Start" });
        }}
        onStrokeChanged={(x, y) => {
          console.log("onStrokeChanged", "x: ", x, ", y: ", y);
          setState({ message: "Changed" });
        }}
        onStrokeEnd={() => {
          setState({ message: "End" });
        }}
        onPathsChange={(pathsCount) => {
          console.log("pathsCount", pathsCount);
        }}
        touchEnabled={true}
        onShapeSelectionChanged={v => {
          console.log('onShapeSelectionChanged', v)
        }}
        onDrawingStateChanged={e => {
          console.log('onDrawingStateChanged', JSON.stringify(e));
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={[styles.functionButton, { backgroundColor: "red" }]} onPress={() => {
            setState({ color: "#FF0000" });
          }}>
            <Text style={{ color: "white" }}>Red</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.functionButton, { backgroundColor: "black" }]} onPress={() => {
            setState({ color: "#000000" });
          }}>
            <Text style={{ color: "white" }}>Black</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.functionButton, { backgroundColor: "blue" }]} onPress={() => {
            canvas.current.undoShape();
          }}>
            <Text style={{ color: "white" }}>Undo</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginRight: 8, fontSize: 20 }}>{state.message}</Text>
        <TouchableOpacity style={[styles.functionButton, { backgroundColor: "black", width: 90 }]}
                          onPress={() => {
                            console.log(canvas.current.getPaths());
                            Alert.alert(JSON.stringify(canvas.current.getPaths()));
                            canvas.current.getBase64("jpg", false, true, true, (err, result) => {
                              console.log(result);
                            });
                          }}>
          <Text style={{ color: "white" }}>Get Paths</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>;
};
