# elepay-react-native

React Native wrapper of elepay SDK.

> NOTE: elepay SDK requires [React Native](https://reactnative.dev) version **0.61.5** and above.

## Install
```
yarn add elepay-react-native --save
```

Note: this sdk only wraps the basic native elepay SDK(iOS/Android).
Some payment methods may require individual dependency setup. Please refer to the official guide for details.
* [elepay iOS SDK document](https://developer.elepay.io/docs/ios-sdk)
* [elepay Android SDK document](https://developer.elepay.io/docs/android-sdk)

## Setup

### iOS
> Note:
> * CocoaPods is required.
> * The native iOS SDK requires the deployment target OS version to be minimus as **10.0**. Make sure both your iOS projects and your Podfile has the correct setting.

* Go to the ios folder of your project.
```bash
cd ios
```
* Add the following line to the `Podfile` if it does not appear.
```ruby
use_frameworks!
```
* Then install all pods.
```base
pod install
```

### Android

> Note:
> * The native Android SDK requires `minSdkVersion` to be **21**. If you see build errors relative to the `minSdkVersion`, please check your Android project settings.

elepay Android SDK hosted in a separated github repository.
Add the following code to your app project's `repositories` block of the root `build.gradle` file.
> Normally in your app project's `android/build.gradle`
```groovy
maven {
    url "https://elestyle.github.io/elepay-android/repository"
}
```

## Usage

```javascript
// All modules are exported to the NativeModules
import { NativeModules } from 'react-native'

// Setup elepay SDK.
//
// The parameter object could contain the following fields:
// "publicKey": String value. Required. Can be retrieved from your elepay account's dashboard page.
// "hostUrl": String value. Optional. Indicates the server url that you want to customised. Omitted to use elepay's server.
// "googlePayEnvironment": String value. "test" or "production". Used to setup Google Pay, can be omitted if Google Pay is not used.
// "languageKey": String value. Availabile values are "English", "SimplifiedChinise", "TraditionalChinese" and "Japanese". Could be omitted. elepay SDK will try to use the system language settings, and fallback to "English" if no supported languages are found.
NativeModules.Elepay.initElepay({
  publicKey: "the public key string",
  apiUrl: "a customised url string, can be omitted",
  googlePayEnvironment: "either 'test' or 'product' if presented. Can be omitted if Google Pay is not used",
  languageKey: "one of 'English', 'SimplifiedChinise', 'TraditionalChinese', 'Janapese'. Can be omitted."
})

// Change localization of elepay UI component.
//
// Currently elepay SDK supports the following 4 languages:
//  * English
//  * Simplified Chinese
//  * Traditional Chinese
//  * Japanese
//
// Note: this method should be called **AFTER** `initElepay` and before `handlePaymentWithPayload`.
// Any invoking before `initELepay` won't work. But this method only requires being called once.
NativeModules.Elepay.changeLanguage({
    languageKey: 'Japanese' // or 'English', 'SimplifiedChinise', 'TraditionalChinese'
});


// Process payment after charging.
//
// "payload" is a "stringified" JSON object that the charge API returned. For API details, please refer to https://developer.elepay.io/reference
//
// The result is passed through the callback.
// "result" is a JSON object in a structure of:
// {
//   "state": "succeeded",
//   "paymentId": "the payment id"
// }
// "state" indicates the current payment's result, available values are: "succeeded"/"cancelled"/"failed"
//
// "error" is available when "state" is "failed". The structure is:
// {
//   "code": "error code"
//   "reasose": "the reason of the error"
//   "message": "the detail message"
// }
NativeModules.Elepay.handlePaymentWithPayload(
  payload,
  (result, error) => {
    console.log('payment result: ')
    console.log(result)
    console.log(error)
  })
```

## Callback

Some payment methods(like Line Pay, PayPay, etc.) require to process the payment outside your app. You need to setup the app with extras configurations.

First, in your app's js source, listen to `Linking` module's url event and pass the url to elepay SDK:
```JavaScript
    if (Platform.OS === 'android') {
      // On Android, just let the react handles the url.
      Linking.getInitialURL().then(url => {
        this.navigate(url)
      })
    } else {
      // Register url event listener on iOS.
      Linking.addEventListener('url', this._handleOpenURL)
    }

    // ...

    _handleOpenURL(event) {
      NativeModules.Elepay.handleOpenUrlString(event.url)
    }
```

### iOS

Your app needs to be configured with URL scheme and `LSApplicationQueriesSchemes`.
For detail configurations, please refer to the [payment method settings overview page](https://developer.elepay.io/docs/%E6%A6%82%E8%A6%81)

Then in your app's `AppDeletage.m`, add the following code to let React Native handles the callback.
```Objective-C
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:app openURL:url options:options];
}
```

### Android

Url schemes configurations(defined in `AndroidManifest.xml`) and gradle intergartions(defined in `build.gradle`) may be required. Please refer to the [payment method settings overview page](https://developer.elepay.io/docs/%E6%A6%82%E8%A6%81) for detail.

## Miscellaneous

1. If you see the following errors while building, you may need to to add a new swift file to the iOS project by Xcode.
    * Open the ios project with Xcode.
    * Add a new empty swift file to the project: `File` -> `New` -> `Swift File`. Any name is ok. And you can delete this file after creation. Only the changes of project settings matter.
```
- `elepay-react-native` does not specify a Swift version and none of the targets (`Your Project`) integrating it have the `SWIFT_VERSION` attribute set. Please contact the author or set the `SWIFT_VERSION` attribute in at least one of the targets that integrate this pod.
```
The reason of the error is that the default project structure that craeted by the react-native-cli does not set the swift version for iOS platform.