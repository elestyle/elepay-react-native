#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(Elepay, ElepayModule, NSObject)

RCT_EXTERN_METHOD(initElepay:(NSDictionary *)configs)
RCT_EXTERN_METHOD(changeLanguage:(NSDictionary *)configs)
RCT_EXTERN_METHOD(changeTheme:(NSDictionary *)configs)
RCT_EXTERN_METHOD(handleOpenUrlString:(NSString *)urlString)
RCT_EXTERN_METHOD(handlePaymentWithPayload:(NSString *)payload resultHandler:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(handleSourceWithPayload:(NSString *)payload resultHandler:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(checkoutWithPayload:(NSString *)payload resultHandler:(RCTResponseSenderBlock)callback)

@end
