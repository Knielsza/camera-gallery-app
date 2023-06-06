import React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

class RadioButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    emitMessage() {
        DeviceEventEmitter.emit('newChosen', {setting: this.props.setting, val: this.props.val})
    }
    render() {
        return(
        <Pressable style={{
            height: 26,
            width: 26,
            borderRadius: 32,
            borderWidth: 2,
            borderColor: '#7b2cbf',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        }} onPress={() => this.emitMessage()}>
            {
                this.props.selected ?
                    <View style={{
                        height: 16,
                        width: 16,
                        borderRadius: 26,
                        backgroundColor: '#e0aaff',
                    }} />
                    : null
            }
        </Pressable>)
    }
};
export default RadioButton;
