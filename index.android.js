import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from 'react-native-button';

// Loading my api keys from external file ./apiKeys.json
const apiKeys = require('./apiKeys.json');

const Clarifai = require('clarifai');

var app = new Clarifai.App(
    apiKeys.clarifaiID,
    apiKeys.clarifaiSecret,
);

export default class what_the_thing extends Component {

    constructor(props) {
    super();
    this.state = {
        visible: false,
        concepts: [],
        lnconcepts: [],
        isOpen: false,
        isDisabled: false,
        swipeToClose: true,
        };

        this.toggleLoader = this.toggleLoader.bind(this);
        this.setTextContent = this.setTextContent.bind(this);
    }

    toggleLoader() {
        this.setState({
            visible: !this.state.visible
        });
    }

    setTextContent(concepts) {
        this.toggleLoader();
        this.setState({
            concepts: concepts,
        });
    }

    takePicture() {
        const self = this;
        self.toggleLoader();
        this.camera.capture()
            .then((image64) => {
                app.models.predict(Clarifai.GENERAL_MODEL, {base64: image64.data})
                .then(function(response) {
                    const concepts = (response.outputs[0].data.concepts.slice(0,5))
                    .map(concept => ({name:concept.name, val: concept.value}));

                    self.setTextContent(concepts);
                    console.table(concepts);
                    alert(concepts[0][0]);

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
                captureMode={Camera.constants.CaptureMode.still}
                captureTarget={Camera.constants.CaptureTarget.memory}
                captureQuality={Camera.constants.CaptureQuality.low}
                playSoundOnCapture={true}
                >
                    <View style={styles.Concept}>
                        <Text style={styles.enConceptText}>
                        </Text>
                    </View>

                    <View style={styles.Concept}>
                        <Text style={styles.lnConceptText}>
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Spinner visible={this.state.visible}
                            extContent={''} textStyle={{color: '#FFF', fontSize: 30}} />
                    </View>

                    <TouchableOpacity style={styles.cameraIco} onPress={this.takePicture.bind(this)}>
                        <View>
                            <Icon name="question-circle-o" size={70} color="#E8EAF6"/>
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
        bottom: 65,
    },
    Concept: {
        flex: 1,
        top: Dimensions.get('window').height/4,
        alignItems: 'center',
    },
    enConceptText: {
        fontSize: 35,
        color: 'white',
    },
    lnConceptText: {
        bottom: -40,
        fontSize: 35,
        color: 'white',
    }
});

AppRegistry.registerComponent('what_the_thing', () => what_the_thing);
