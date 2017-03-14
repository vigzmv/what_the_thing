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
    ActivityIndicator,
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
var StatusBarAndroid = require('react-native-android-statusbar');

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
        langsList: '',
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

    componentWillMount() {
        this.langList();
        // StatusBarAndroid.hideStatusBar();
        StatusBarAndroid.setHexColor('grey');
    }

    toggleLoader() {
        this.setState({
            loadingVisible: !this.state.loadingVisible
        });
        // StatusBarAndroid.hideStatusBar();
    }

    emptyState() {
        this.setState({
            concepts: '',
            lnconcept: '',
        });
    }

    langList() {

        fetch(yandexGetLang)
        .then(res => res.json())
        .then(data => {
            const langsList = data.langs;
            // console.log(langsList);
            let list = [];
            for (var key in langsList) {
                if (langsList.hasOwnProperty(key)) {
                    list.push(<Text style={styles.text} key={key}>{langsList[key]} - {key}</Text>);
                }
            }
            // console.log(list);
            this.setState({
                langsList: list
            });
        })
        .catch(err => console.log(err));
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
        self.emptyState();
        self.toggleLoader();

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

                    // console.table(concepts);

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
                    <View style={[styles.topIcons,]}>
                        <View style={[styles.info]}>
                            <TouchableOpacity>
                                <Icon name="question-circle-o" size={50}
                                color={this.state.loadingVisible?"#00000000":"#E8EAF6"}
                            />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.lang]}>
                            <TouchableOpacity onPress={() => this.refs.langs.open()}>
                                <Icon name="gear" size={50}
                                color={this.state.loadingVisible?"#00000000":"#E8EAF6"}
                            />
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
                                    {this.state.langsList}
                                </View>
                            </ScrollView>
                    </Modal>

                    <View style={styles.Concept}>
                        <Text style={styles.enConceptText}>
                            {this.loadLnConcept()}
                        </Text>
                    </View>

                    <View style={[{ flex: 1 },]}>
                        <ActivityIndicator
                            animating={this.state.loadingVisible}
                            style={[styles.activityIcon,]}
                            size="large"
                            // color="white"
                        />
                    </View>

                    <View style={styles.Concept}>
                        <Text style={styles.lnConceptText}>
                            {this.loadConcept()}
                        </Text>
                    </View>

                    <View style={[{height:70}]}>
                        <TouchableOpacity
                            style={[styles.cameraIco,{height:this.state.loadingVisible?0:70}]}
                            onPress={this.takePicture.bind(this)}>
                            <View>
                                <Icon name="eercast" size={70}
                                color={this.state.loadingVisible?"#00000000":"#E8EAF6"}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                </Camera>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    activityIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        top: Dimensions.get('window').height/8,
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
        top: 12,
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
        top: Dimensions.get('window').height/7,
        alignItems: 'center',
    },

    enConceptText: {
        fontSize: 35,
        color: 'white',
        top: 0,
    },

    lnConceptText: {
        bottom: Dimensions.get('window').height/8,
        fontSize: 35,
        color: 'white',
    }
});

AppRegistry.registerComponent('what_the_thing', () => what_the_thing);
