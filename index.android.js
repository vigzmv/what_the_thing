import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Dimensions,
	Text,
	View,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class what_the_thing extends Component {
	render() {
        return (
            <View style={styles.container}>
                <Camera ref={(cam) => {
                    this.camera = cam;
                }}

				style={styles.preview}
				aspect={Camera.constants.Aspect.fill}
				type={Camera.constants.Type.back}
                playSoundOnCapture={true}
                captureMode={Camera.constants.CaptureMode.still}
                captureQuality={Camera.constants.CaptureQuality.high}
                >
                    <TouchableOpacity onPress={()=>alert(1)}>
                        <View style={styles.cameraIco}>
                            <Icon name="camera" size={50} color="#E8EAF6" />
                        </View>
                    </TouchableOpacity>
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
    cameraIco:{
        marginBottom: 50
    }
});

AppRegistry.registerComponent('what_the_thing', () => what_the_thing);
