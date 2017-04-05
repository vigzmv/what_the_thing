# What the Thing ?
Point camera at things to learn how to say them in a different language.  
Native Android App built with [React Native](https://github.com/facebook/react-native).  
<!-- _Select a language, point, shoot and get the translation._ -->
Made it as a part of my learning process of [React](https://github.com/facebook/react-native) and [React Native](https://github.com/facebook/react-native).

Inspired by [Thing Translator](https://github.com/dmotz/thing-translator) by [dmotz](https://github.com/dmotz).

![58e4ef54dc57a683107473](https://cloud.githubusercontent.com/assets/14950089/24707370/ec75d8d2-1a30-11e7-84ff-5040949f6645.gif)
![58e4ef22e1d7d646107794](https://cloud.githubusercontent.com/assets/14950089/24707372/ec7b4538-1a30-11e7-944d-98addd4ff146.gif)  

## How it works ?

It uses [Clarifai's](https://clarifai.com/) concept recognition from images and [Yandex's](https://tech.yandex.com/translate/) language translation.

## Try it ?
Have a look at the [React-native Docs](https://facebook.github.io/react-native/docs/getting-started.html) to set up a development environment for React-native and Android.

```sh
# Install react-native
sudo npm install -g react-native-cli

# Clone repository
git clone https://github.com/vigzmv/what_the_thing.git
cd what_the_thing

```

Get your free API keys from [Clarifai](https://clarifai.com/) and [Yandex](https://tech.yandex.com/translate/). It is easy and free.  
Place them in `./apiKeys.json`.

```sh
# Install required packages
yarn install || npm install

# Install the project on device
react-native run-android

# Run the server/bundler
react-native start
```

I would be releasing a signed apk package soon which could be installed directly

## Licence
[MIT Licence](https://github.com/vigzmv/what_the_thing/blob/master/LICENSE) © [Vignesh M](https://vigneshm.com)
