import React from 'react';
import { Image, StyleSheet, Pressable, Dimensions } from 'react-native';

class Item extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: false
        }
    }
    render() {
        const img = this.props.loc
        return (<Pressable onPress={() => this.showImg()} onLongPress={() => this.select()}><Image
            style={[this.props.cols === 1 ? styles.big : styles.image, this.getStyle()]}
            source={{ uri: img }}
        />
        </Pressable>)
    }
    showImg() {
        this.props.navigation.navigate('bigphoto', { res: this.props.res, loc: this.props.loc, ids: this.props.ids, wid: this.props.wid, hig: this.props.hig })
    }
    select() {
        if (!this.state.selected) {
            this.props.select(this.props.ids)
            this.setState({
                selected: true
            })
        }
        else {
            this.props.rem(this.props.ids)
            this.setState({
                selected: false
            })
        }
    }
    getStyle() {
        if (this.state.selected) {
            return { borderWidth: 5, borderColor: 'limegreen', opacity: .7 }
        }
    }
}
const styles = StyleSheet.create({
    centered: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: 'rgba(255 255 255 / .07)',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20
    },
    image: {
        width: Dimensions.get("window").width / 6,
        height: Dimensions.get("window").width / 6,
        borderRadius: 10,
        margin: Dimensions.get("window").width / 60,
    },
    big: {
        width: Dimensions.get("window").width * .9,
        height: 150,
        margin: Dimensions.get("window").width * .05,
        marginBottom: 0,
        borderRadius: 10,
    },
    buttons: {
        height: 40,
        marginBottom: 20,
        alignSelf: 'center',
        borderColor: 'gainsboro',
        borderBottomWidth: .5,
        borderTopWidth: .5,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'gainsboro',
        fontWeight: 'bold',
        fontSize: 20
    }
});
export default Item;
