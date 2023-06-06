import React from 'react';
import { Text, View, StyleSheet, BackHandler, ToastAndroid, ScrollView, Animated, Dimensions, DeviceEventEmitter } from 'react-native'
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import RadioGroup from './RadioGroup';

class Screen3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,         // przydzielone uprawnienia do używania kamery
      type: Camera.Constants.Type.back,  // typ kamery
      ratio: "16:9",
      wb: "auto",
      ps: "1920x1080",
      fm: "off",
      ratios: [],
      sizes: [],
      settingsOpen: true,
      pos: new Animated.Value(-500)
    };
  }
  camera
  async componentDidMount() {
    DeviceEventEmitter.addListener('newChosen', (data) => {
      switch (data.setting) {
        case 'CAMERA RATIO':
          this.setState({
            ratio: data.val
          })
          break
        case 'WHITE BALANCE':
          this.setState({
            wb: data.val
          })
          break
        case 'PICTURE SIZES':
          this.setState({
            ps: data.val
          })
          break
        case 'FLASH':
          this.setState({
            fm: data.val
          })
          break
      }
    })
    let { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status == 'granted' });
    BackHandler.addEventListener("hardwareBackPress", () => { DeviceEventEmitter.emit("refreshevent", {}) });
  }

  flip() {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  }

  async photo() {
    if (this.camera) {
      let foto = await this.camera.takePictureAsync();
      let asset = await MediaLibrary.createAssetAsync(foto.uri); // domyślnie zapisuje w folderze DCIM
      ToastAndroid.showWithGravity(
        'photo made',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      DeviceEventEmitter.emit("refreshevent", {})
    }
  }

  async getSizes() {
    if (this.camera) {
      this.setState({
        sizes: (await this.camera.getAvailablePictureSizesAsync(this.state.ratio))
      })
    }
  }
  
  async getRatios() {
    if (this.camera) {
      this.setState({
        ratios: (await this.camera.getSupportedRatiosAsync())
      })
    }
  }
  openSettings() {
    let toPos
    this.setState({
      settingsOpen: !this.state.settingsOpen
    })
    this.state.settingsOpen ? toPos = 0 : toPos = -500
    Animated.spring(
        this.state.pos,
        {
            toValue: toPos,
            velocity: 1,
            tension: 0,
            friction: 10,
            useNativeDriver:true
        }
    ).start();
  }

  render() {
    const hasCameraPermission = this.state.hasCameraPermission; // podstawienie zmiennej ze state
    if (hasCameraPermission == null) {
      return (<View />);
    } else if (hasCameraPermission == false) {
      return (<Text>brak dostępu do kamery</Text>);
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => {
              this.camera = ref; // Uwaga: referencja do kamery używana później
            }}
            style={{ flex: 1 }}
            type={this.state.type}
            ratio={this.state.ratio}
            whiteBalance={this.state.wb}
            pictureSize={this.state.ps}
            flashMode={this.state.fm}
            onCameraReady={() => {
              this.getRatios()
              this.getSizes()}}>
            <Pressable onPress={() => this.openSettings()} style={[styles.buttons, {position: 'absolute', right: 20, top: 20, height: 50, width: 50}]}><Text style={[styles.text, { fontSize: 30, color: 'white' }]}>⛭</Text></Pressable>

            <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              <Pressable onPress={() => this.photo()} style={styles.buttons}><Text style={styles.text}>+</Text></Pressable>
              <Pressable onPress={() => this.flip()} style={styles.buttons}><Text style={[styles.text, { paddingBottom: 11 }]}>↺</Text></Pressable>
            </View>
          </Camera>
          <Animated.ScrollView style={[styles.settings,{
                          transform: [
                              { translateX: this.state.pos }
                          ]
                      }]}>
            <RadioGroup
              settingsTitle="WHITE BALANCE"
              settingsArr={Camera.Constants.WhiteBalance}
              chosen={this.state.wb}
              key={1}
            />
            <RadioGroup
              settingsTitle="FLASH"
              settingsArr={Camera.Constants.FlashMode}
              chosen={this.state.fm}
              key={2}
            />
            <RadioGroup
              settingsTitle="CAMERA RATIO"
              settingsArr={this.state.ratios}
              chosen={this.state.ratio}
              key={3}
            />
            <RadioGroup
              settingsTitle="PICTURE SIZES"
              settingsArr={this.state.sizes}
              chosen={this.state.ps}
              key={4}
            />
          </Animated.ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttons: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: 40
  },
  text: {
    color: '#7b2cbf',
    fontWeight: 'bold',
    fontSize: 70,
    alignSelf: 'center',
    textAlign: 'center'
  },
  settings: { 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    maxWidth: Dimensions.get('window').width*.5,
    height: Dimensions.get('window').height*.925, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 20
  }
})

export default Screen3;
