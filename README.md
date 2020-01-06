# elepay-react-native

React Native wrapper of elepay SDK.

## Install
```
yarn add elepay-react-native --save
```

## Setup

### iOS
> Note: CocoaPods is required.

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
NativeModules.Elepay.initElepay({
  publicKey: "the public key string",
  apiUrl: "a customised url string, can be omitted",
  googlePayEnvironment: "either 'test' or 'product' if presented. Can be omitted if Google Pay is not used"
})

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
// "error" is available when there's something wrong.
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

### iOS

Your app needs to be configured with URL scheme and `LSApplicationQueriesSchemes`.
For detail configurations, please [refere to elepay iOS SDK document](https://developer.elepay.io/docs/ios-sdk)

Then in your app's `AppDeletage.m`, add the following code to let React Native handles the callback.
```Objective-C
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:app openURL:url options:options];
}
```

### Android

Url schemes configurations are required. Please refer to [elepay Android SDK document](https://developer.elepay.io/docs/android-sdk) for detail.

## Miscellaneous

1. If you see the following errors while building, you may need to to add a new swift file to the iOS project by Xcode.
    * Open the ios project with Xcode.
    * Add a new empty swift file to the project: `File` -> `New` -> `Swift File`. Any name is ok. And you can delete this file after creation. Only the changes of project settings matter.
```
- `elepay-react-native` does not specify a Swift version and none of the targets (`Your Project`) integrating it have the `SWIFT_VERSION` attribute set. Please contact the author or set the `SWIFT_VERSION` attribute in at least one of the targets that integrate this pod.
```
The reason of the error is that the default project structure that craeted by the react-native-cli does not set the swift version for iOS platform.