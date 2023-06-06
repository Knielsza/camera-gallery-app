import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';

class RadioGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: null
        }
    }
    render() {
        console.log(this.props.settingsArr)
        return (<View style={{display: 'flex', flexDirection: 'column', paddingBottom: 20}}>
            <Text style={styles.text}>{this.props.settingsTitle}</Text>
            {
                Array.isArray(this.props.settingsArr) ?
                    this.props.settingsArr.map((e) => {
                        return(
                        <View style={styles.setting}>
                            <RadioButton selected={e === this.props.chosen ? true : false} 
                            setting={this.props.settingsTitle}
                            val={e}/>
                            <Text style={styles.text}>{e}</Text>
                        </View>)
                    })
                    :
                    Object.entries(this.props.settingsArr).map(([key,val]) => {
                        return(
                        <View style={styles.setting}>
                            <RadioButton selected={key === this.props.chosen ? true : false} 
                            setting={this.props.settingsTitle}
                            val={key}/>
                            <Text style={styles.text}>{key}</Text>
                        </View>)
                    })
            }
        </View>)
    }
};
const styles = StyleSheet.create({
    text: {
        color: 'white'
    },
    setting: {
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    }
})
export default RadioGroup;
