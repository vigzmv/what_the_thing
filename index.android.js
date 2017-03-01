import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Dimensions,
	Text,
	View
} from 'react-native';
import Camera from 'react-native-camera';

export default class what_the_thing extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Camera ref={(cam) => {
                    this.camera = cam;
                }}
				style={styles.preview}
				aspect={Camera.constants.Aspect.fill}>
                    <Text style={styles.capture} onPress={()=>console.log(1)}>[CAPTURE]</Text>
                </Camera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

AppRegistry.registerComponent('what_the_thing', () => what_the_thing);
