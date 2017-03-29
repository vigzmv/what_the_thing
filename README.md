# What the Thing ?
Point camera at things to learn how to say them in a different language.  
<!-- _Select a language, point, shoot and get the translation._ -->

Made it as a part of my learning process of [React](https://github.com/facebook/react-native) and [React Native](https://github.com/facebook/react-native).

## How it works ?

Uses [Clarifai's](https://clarifai.com/) concept recognition from images and [Yandex's](https://tech.yandex.com/translate/) text language translation.

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

I would be releasing a signed apk package soon which can be installed directly

## Licence
[MIT Licence](https://github.com/vigzmv/what_the_thing/blob/master/LICENSE) © [Vignesh M](https://vigneshm.com)
