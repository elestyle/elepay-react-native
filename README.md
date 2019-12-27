# elepay-react-native

React Native wrapper of elepay SDK.

## Install
```
yarn add elepay-react-native --save
```

## Setup

### iOS
```
cd ios && pod install && cd ..
```
> CocoaPods is required.

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
// "publicKey" can be retrieved from your elepay account's dashboard page.
// "hostUrl" is the server url that you want to customised.
// If you use elepay server to perform payment processing, leave this parameter empty.
NativeModules.Elepay.initElepayWithPublicKey(publicKey, hostUrl)

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
