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

const whiteColor = '#E8EAF6CC';
const transparent = '#00000000';

export default class what_the_thing extends Component {

    constructor(props) {
    super();

    this.state = {
        loadingVisible: false,
        concepts: '',
        lnconcept: '',
        lang: 'hi',
        langsList: (<Text></Text>),
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
        this.conceptCleanup = this.conceptCleanup.bind(this);
        this.loadOtherConcept = this.loadOtherConcept.bind(this);
        this.setLang = this.setLang.bind(this);
    }


    componentWillMount() {
        this.langList();
        // StatusBarAndroid.hideStatusBar();
        StatusBarAndroid.setHexColor('#757575');
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
            lang: 'hi',
        });
    }


    setLang(key) {
        this.setState({lang:key});
        this.refs.langs.close()
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
                    list.push(<View style={styles.listBoxes} key={key}>
                        <TouchableOpacity
                            onPress={this.setLang.bind(this, key)}>
                            <Text
                                style={[styles.list, {color:this.state.lang == key?`#1b1b1b`:'#777777'}]}
                                key={key}
                                >
                                {langsList[key]}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    );
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
            return (<Text> {concept[0]['name']}{'\n'}</Text>);
        else
            return ''
    }


    loadOtherConcept() {
        const C = this.state.concepts;

        if(C!='')
        return (
            `${C[1]['name']}: ${C[1]['val']}, ${C[2]['name']}: ${C[2]['val']}, ${C[3]['name']}: ${C[3]['val']}`
        );
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


    conceptCleanup(concepts) {
        return concepts.map((concept) => {
            concept.val = concept.val.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
            if(!(concept.name.startsWith('no ')))
                return ({name:concept.name, val: concept.val});
            }
        )
    }


    takePicture() {

        const self = this;
        self.emptyState();
        self.toggleLoader();

        this.camera.capture()
            .then((image64) => {
                app.models.predict(Clarifai.GENERAL_MODEL, {base64: image64.data})
                .then(function(response) {
                    const concepts = (response.outputs[0].data.concepts.slice(0,10))
                    .map(concept => ({name:concept.name, val: concept.value}));

                    console.table(concepts);
                    //TODO: gota cleanup concepts first
                    const cleanConcept = self.conceptCleanup(concepts);
                    console.table(cleanConcept);
                    conceptToTanslate = cleanConcept[0]['name'];
                    self.translateConcept(conceptToTanslate);
                    self.setTextContent(concepts);

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
                                color={this.state.loadingVisible?transparent:whiteColor}
                            />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.lang]}>
                            <TouchableOpacity onPress={() => {this.refs.langs.open(); this.langList();}}>
                                <Icon name="gear" size={50}
                                color={this.state.loadingVisible?transparent:whiteColor}
                            />
                            </TouchableOpacity>
                        </View>
                    </View>


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
                    <View style={{top: 18}}>
                        <Text style={[styles.lnConceptText,]}>
                            <Text style={{fontSize:14}}> {this.loadOtherConcept()}</Text>
                        </Text>
                    </View>

                    <View style={[{height:70}]}>
                        <TouchableOpacity
                            style={[styles.cameraIco,{height:this.state.loadingVisible?0:72}]}
                            onPress={this.takePicture.bind(this)}>
                            <View>
                                <Icon name="eercast" size={70}
                                color={this.state.loadingVisible?transparent:whiteColor}
                                />
                            </View>
                        </TouchableOpacity>
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
                                <View style={styles.langListView}>
                                    {this.state.langsList}
                                </View>
                            </ScrollView>
                    </Modal>

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
        top: Dimensions.get('window').height/7,
    },

    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },

    cameraIco: {
        bottom: 20,
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
        height: Dimensions.get('window').height - 190,
        width: Dimensions.get('window').width - 80,
        paddingBottom: 10,
    },

    langListView: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    langList: {
        width: Dimensions.get('window').width - 80,
        // paddingLeft: 50,
        paddingTop: 4,
        paddingBottom: 10,
    },

    listBoxes: {
        borderBottomWidth: 1,
        borderBottomColor: '#CFD8DC',
        width: Dimensions.get('window').width - 100,
        justifyContent: 'center',
        alignItems: 'center',
    },

    list: {
        fontSize: 20,
        paddingTop: 8,
        paddingBottom: 2,
    },

    Concept: {
        flex: 1,
        top: Dimensions.get('window').height/5.5,
        alignItems: 'center',
    },

    enConceptText: {
        fontSize: 40,
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
