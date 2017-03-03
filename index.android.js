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

var Clarifai = require('clarifai');
var app = new Clarifai.App(
    'NC_zCTITbajnUlNUJ8LrFMl4FH5tl-1Bl8nSp30p',
    '1QoTBYaR8MDQRIr_rRHI3RDVvYeMyslkHtq7D9BY'
);

export default class what_the_thing extends Component {

    takePicture() {
        this.camera.capture()
            .then((image64) => {
                console.log("cap");
                app.models.predict(Clarifai.GENERAL_MODEL, {base64: image64.data})
                    .then(function(response) {
                        const concepts = (response.outputs[0].data.concepts.slice(0,3)).map(
                            concept => ({name:concept.name, val: concept.value})
                        );
                        console.table(concepts);
                        alert(concepts);
                        
                    }, function(err) {
                        alert(err);
                    });
            })
            .catch(err => alert(err));
    }

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
                captureTarget={Camera.constants.CaptureTarget.memory}
                captureQuality={Camera.constants.CaptureQuality.high}
                >

                    <TouchableOpacity onPress={this.takePicture.bind(this)}>
                        <View style={styles.cameraIco}>
                            <Icon name="camera" size={50} color="#E8EAF6"/>
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
    cameraIco: {
        marginBottom: 50
    }
});

AppRegistry.registerComponent('what_the_thing', () => what_the_thing);
