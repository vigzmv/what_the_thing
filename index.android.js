import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from 'react-native-button';

// Loading my api keys from external file ./apiKeys.json
const apiKeys = require('./apiKeys.json');
const yandexKey = apiKeys.yandexTranslateKey;

const yandexGetLang = `https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${yandexKey}&ui=en`
const yandexGetTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexKey}`

const Clarifai = require('clarifai');

var app = new Clarifai.App(
    apiKeys.clarifaiID,
    apiKeys.clarifaiSecret,
);

export default class what_the_thing extends Component {

    constructor(props) {

    super();
    this.state = {
        loadingVisible: false,
        concepts: '',
        lnconcept: '',
        lang: 'hi',
        isOpen: false,
        isDisabled: false,
        swipeToClose: false,
        };

        this.toggleLoader = this.toggleLoader.bind(this);
        this.setTextContent = this.setTextContent.bind(this);
        this.loadConcept = this.loadConcept.bind(this);
        this.emptyState = this.emptyState.bind(this);
        this.translateConcept = this.translateConcept.bind(this);
        this.loadLnConcept = this.loadLnConcept.bind(this);
        this.langList = this.langList.bind(this);
    }

    toggleLoader() {
        this.setState({
            loadingVisible: !this.state.loadingVisible
        });
    }

    emptyState() {
        this.setState({
            concepts: '',
            lnconcept: '',
        });
    }

    langList(){
        list = []
        for (var i=0;i<50;i++) {
            list.push(<Text key={i}>Elem {i}</Text>);
        }
        return list;
    }

    setTextContent(concepts) {
        this.setState({
            concepts: concepts,
        });
    }

    loadConcept() {
        const concept = this.state.concepts;

        if(concept!='')
            return concept[0]['name'];
        else
            return ''
    }

    loadLnConcept() {
        return this.state.lnconcept;
    }

    translateConcept(concept) {

        fetch(`${yandexGetTranslate}&text=${concept}&lang=${this.state.lang}`)
        .then(res => res.json())
        .then(data => {
            this.setState({
                lnconcept: data.text[0]
            })
            this.toggleLoader();
        })
        .catch(err => console.log(err));
    }

    takePicture() {

        const self = this;
        self.toggleLoader();
        self.emptyState();

        setTimeout(() => {
            this.camera.capture()
                .then((image64) => {
                    app.models.predict(Clarifai.GENERAL_MODEL, {base64: image64.data})
                    .then(function(response) {
                        const concepts = (response.outputs[0].data.concepts.slice(0,5))
                        .map(concept => ({name:concept.name, val: concept.value}));

                        //TODO: gota cleanup concepts first

                        conceptToTanslate = concepts[0]['name'];
                        self.translateConcept(conceptToTanslate);
                        self.setTextContent(concepts);

                        console.table(concepts);

                        }, function(err) {
                            alert(err);
                        });
                })
                .catch(err => alert(err));
        },50);
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
                    <View style={[styles.topIcons, {height:this.state.loadingVisible?0:65}]}>
                        <View style={[styles.info]}>
                            <TouchableOpacity>
                                <Icon name="question-circle-o" size={50} color="#E8EAF6"/>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.lang]}>
                            <TouchableOpacity onPress={() => this.refs.langs.open()}>
                                <Icon name="gear" size={50} color="#E8EAF6"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal
                        style={[styles.modal, styles.langs]}
                        position={"center"}
                        ref={"langs"}
                        isDisabled={this.state.isDisabled}
                        swipeToClose={this.state.swipeToClose}
                        onClosed={this.onLangClose}
                        onOpened={this.onLangOpen}
                        >
                            <ScrollView style={styles.langList}>
                                <View>
                                  {this.langList()}
                                </View>
                            </ScrollView>
                    </Modal>

                    <View style={styles.Concept}>
                        <Text style={styles.enConceptText}>
                            {this.loadLnConcept()}
                        </Text>
                    </View>

                    <View style={styles.Concept}>
                        <Text style={styles.lnConceptText}>
                            {this.loadConcept()}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Spinner size='large' visible={this.state.loadingVisible} />
                    </View>

                    <TouchableOpacity
                        style={[styles.cameraIco, {height:this.state.loadingVisible?0:66}]}
                        onPress={this.takePicture.bind(this)}>
                        <View>
                            <Icon name="eercast" size={65} color="#E8EAF6"/>
                        </View>
                    </TouchableOpacity>

                </Camera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },

    cameraIco: {
        bottom: 30,
    },

    topIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        top: 10,
    },

    info: {
        flex: 1,
        left: 12,
        alignItems: 'flex-start',
    },

    lang: {
        flex: 1,
        right: 12,
        alignItems: 'flex-end',
    },

    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    langs: {
        top: -20,
        height: Dimensions.get('window').height - 160,
        width: Dimensions.get('window').width - 60,
    },

    langList: {
        width: 300,
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
