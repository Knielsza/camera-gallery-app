import React from 'react';
import { View, StyleSheet, Pressable, Text, FlatList, ActivityIndicator, Dimensions, ToastAndroid, Animated } from 'react-native';
import Item from './Item';
import * as MediaLibrary from "expo-media-library";
import {DeviceEventEmitter} from "react-native"
import SlidingUpPanel from "rn-sliding-up-panel";

class Screen2 extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        photos: [],
        numColumns: 5,
        selects: [],
        _draggedValue: new Animated.Value(45),
        draggableRange: { top: Dimensions.get("window").height - 50, bottom: 45 },
        up: false
      }
    }
    async componentDidMount(){
      let { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
          alert('brak uprawnień do czytania zdjęć z galerii')
      }
        this.setState({
            loading: true
        })
        let obj = await MediaLibrary.getAssetsAsync({
            first: 150,           // ilość pobranych assetów
            mediaType: 'photo',    // typ pobieranych danych, photo jest domyślne
            sortBy: 'modificationTime'
        })
        this.setState({
            photos: obj.assets
        })
        ToastAndroid.showWithGravity(
          'photos swallowed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
          );
      
          this.setState({
              loading: false
          })
          DeviceEventEmitter.addListener("refreshevent", () => {this.refresh()});
          this.state.up ? this._panel.show() : null
    }

    async refresh() {
        this.setState({
            loading: true
        })
        let obj = await MediaLibrary.getAssetsAsync({
            first: 150,           // ilość pobranych assetów
            mediaType: 'photo',    // typ pobieranych danych, photo jest domyślne
            sortBy: 'modificationTime'
        })
        this.setState({
            photos: obj.assets
        })
        this.setState({
            loading: false
        })
    }

    layout() {
        this.setState({
            numColumns: this.state.numColumns === 1 ? 5 : 1
        })
    }

    endDrag() {
        this.setState({up:true})
    }

    render(){
        return(<View style={{flex:1}}>
                <View style={{backgroundColor: '#171717'}}>
                    <View style={styles.flex}>
                        <Pressable style={styles.buttons} onPress={() => this.delSelected()}><Text style={styles.text}>DELETE</Text></Pressable> 
                        <Pressable style={styles.buttons} onPress={() => this.makePhoto()}><Text style={styles.text}>CAMERA</Text></Pressable>
                        <Pressable style={styles.buttons} onPress={() => this.layout()}><Text style={styles.text}>GRID</Text></Pressable> 
                    </View>
                    {
                        this.state.loading ?
                            <ActivityIndicator size="large" color="white" />
                            :
                            null
                    }
                    <FlatList
                        data={this.state.photos}
                        renderItem={({item}) => <Item res={`${item.width} x ${item.height}`} loc={item.uri} ids={item.id} wid={item.width} hig={item.height} rem={(x) => {this.removeSelected(x)}} select={(x) => {this.addSelected(x)}} cols={this.state.numColumns} navigation={this.props.navigation} />}
                        numColumns={this.state.numColumns}
                        key={this.state.numColumns}
                    />
                </View>
            </View>)
    }
    makePhoto = async() => {
        this.props.navigation.navigate('camera')
    }
    addSelected(selectedPath) {
        this.setState({
            selects: [...this.state.selects, selectedPath]
        })
        console.log(this.state.selects);
    }
    removeSelected(selectedPath) {
        this.setState({
            selects: [...this.state.selects.filter((item) => item !== selectedPath)]
        })
        console.log(this.state.selects);
    }
    async delSelected() {
        await MediaLibrary.deleteAssetsAsync(this.state.selects)
        this.setState({
            selects: []
        })
        this.refresh()
    }
}

const styles = StyleSheet.create({
    centered: {
        display: 'flex',
        flexDirection: 'column'
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    buttons: {
        height: 40,
        alignSelf: 'center',
        borderColor: 'transparent',
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 5
    },
    text: {
        color: '#7b2cbf',
        fontWeight: 'bold',
        fontSize: 20
    },
    colored: {
      width: Dimensions.get('window').width*.5,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    rt: {
      fontSize: 65,
      color: '#7b2cbf',
      fontWeight: 'bold',
      lineHeight: 70,
      height: 50
    },
    goText: {
        width: Dimensions.get('window').width*.49, 
        fontSize: 80, 
        lineHeight: 102.5, 
        textAlign: 'center', 
        color: '#7b2cbf', 
        fontWeight: 'bold'
    },
    titleCard: {
        height: 100,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    goButton: {
        borderColor: 'limegreen',
        borderWidth: 1,
        borderRadius: 25,
        backgroundColor: 'transparent'
    },
    backgroundText: {
        color: 'rgba(255,255,255,.05)', 
        fontSize: 170, 
        fontWeight: 'bold', 
        lineHeight: 180, 
        height: 135,
        marginLeft: -6,
        letterSpacing: 2,
    },
    backgroundTextSmall: {
        color: 'rgba(255,255,255,.05)', 
        fontSize: 75, 
        fontWeight: 'bold', 
        lineHeight: 84, 
        height: 65
    }
});

export default Screen2;
