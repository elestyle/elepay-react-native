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
> Requirements:
> * CocoaPods 1.10.0 and above.
> * iOS deployment target version 11.0 and above.
>
> Make sure both your iOS projects and your Podfile has the correct settings.

* Go to the ios folder of your project.
```bash
cd ios
```
* Then install all pods.
```base
pod install
```

### Android

> Requirements:
> * `minSdkVersion` 21.

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
// "hostUrl": Optional string value. Indicates the server url that you want to customised. If omitted, elepay's server will be used.
// "googlePayEnvironment": Optional string value. "test" or "production". Used to setup Google Pay, can be omitted if Google Pay is not used.
// "languageKey": Optional string value. Availabile values are "English", "SimplifiedChinise", "TraditionalChinese" and "Japanese". If omitted, elepay SDK will try to use the system language settings, and fallback to "English" if no supported languages are found.
// "theme": Optional string value. Only available on Android platform. Possible values are "light" and "dark". Other values will be ignored. If omitted, elepay SDK will follow system's theme setting (on API 29 and above).
NativeModules.Elepay.initElepay({
  publicKey: "the public key string",
  apiUrl: "a customised url string, can be omitted",
  googlePayEnvironment: "test", // or 'product'. Can be omitted if Google Pay is not used
  languageKey: "English", // or 'SimplifiedChinise', 'TraditionalChinese', 'Janapese'. Can be omitted.
  theme: "light", // or 'dark'.
})

// Change localization of elepay UI component.
//
// Currently elepay SDK supports the following 4 languages:
//  * English
//  * Simplified Chinese
//  * Traditional Chinese
//  * Japanese
//
// Note: this method should be called **AFTER** `initElepay` and **BEFORE** any kind of payment processing(e.g. `handlePaymentWithPayload`).
NativeModules.Elepay.changeLanguage({
  languageKey: 'Japanese' // or 'English', 'SimplifiedChinise', 'TraditionalChinese'
});

// Change theme of UI components.
// ** Currently Android only **
//
// Valid value: "light", "dark". Any other value will be ignored and follow the system's theme(on Android Q and above).
//
// Note: this method should be called **AFTER** `initElepay` and **BEFORE** any kind of payment processing(e.g. `handlePaymentWithPayload`).
if (Platform.OS === 'android') {
  NativeModules.Elepay.changeTheme({
    theme: 'light' // or 'dark'
  });
}

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
// "state" indicates the current payment's result, possible values are: "succeeded"/"cancelled"/"failed"
// Note that the payments is processed asynchronousely, please reply on the server API's webhook for the payment confirmation.
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

// Process source data.
//
// "payload" is a "stringified" JSON object that the creating source API returned. For API details, please refer to https://developer.elepay.io/reference
//
// The result is passed through the callback.
// "result" is a JSON object in a structure of:
// {
//   "state": "succeeded",
//   "paymentId": "the payment id"
// }
// "state" indicates the current payment's result, possible values are: "succeeded"/"cancelled"/"failed".
// Note that the payments is processed asynchronousely, please reply on the server API's webhook for the payment confirmation.
//
// "error" is available when "state" is "failed". The structure is:
// {
//   "code": "error code"
//   "reasose": "the reason of the error"
//   "message": "the detail message"
// }
NatvieModules.Elepay.handleSourceWithPayload(
  payload,
  (result, error) => {
    console.log('source result: ')
    console.log(result)
    console.log(error)
  }
)

// Process EasyCheckout.
// For more about EasyCheckout: https://developer.elepay.io/docs/easycheckout
//
// "payload" is a "stringified" JSON object that the checkout API returned. For API details, please refer to https://developer.elepay.io/reference
//
// The result is passed through the callback.
// "result" is a JSON object in a structure of:
// {
//   "state": "succeeded",
//   "paymentId": "the payment id"
// }
// "state" indicates the current payment's result, possible values are: "succeeded"/"cancelled"/"failed".
// Note that the payments is processed asynchronousely, please reply on the server API's webhook for the payment confirmation.
//
// "error" is available when "state" is "failed". The structure is:
// {
//   "code": "error code"
//   "reasose": "the reason of the error"
//   "message": "the detail message"
// }
NatvieModules.Elepay.checkoutWithPayload(
  payload,
  (result, error) => {
    console.log('source result: ')
    console.log(result)
    console.log(error)
  }
)
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
For detail configurations, please refer to the [payment method settings overview page](https://developer.elepay.io/docs/summary)

Then in your app's `AppDeletage.m`, add the following code to let React Native handles the callback.
```Objective-C
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:app openURL:url options:options];
}
```

### Android

Url schemes configurations(defined in `AndroidManifest.xml`) and gradle intergartions(defined in `build.gradle`) may be required. Please refer to the [payment method settings overview page](https://developer.elepay.io/docs/summary) for detail.

## Miscellaneous

1. If you see the following errors while building, you may need to to add a new swift file to the iOS project by Xcode.
    * Open the ios project with Xcode.
    * Add a new empty swift file to the project: `File` -> `New` -> `Swift File`. Any name is ok. And you can delete this file after creation. Only the changes of project settings matter.
```
- `elepay-react-native` does not specify a Swift version and none of the targets (`Your Project`) integrating it have the `SWIFT_VERSION` attribute set. Please contact the author or set the `SWIFT_VERSION` attribute in at least one of the targets that integrate this pod.
```
The reason of the error is that the default project structure that craeted by the react-native-cli does not set the swift version for iOS platform.

2. On Android platform, when setting elepay's theme, please note that elepay SDK changes its UI theme by setting its Activity's night mode configutaion. If the Activity that invokes the elepay's UI Activity has different night mode, a "uiMode" configuation change may be triggered by the system. That may cause the caller Activity recreated. To avoid the recreation, set `android:configChanges="uiMode"` to the caller Activiy in `AndroidManifest.xml`. See the [documentation](https://developer.elepay.io/docs/android-sdk#ui-%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA) of elepay SDK for detail.