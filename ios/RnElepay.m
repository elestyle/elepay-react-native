#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(Elepay, ElepayModule, NSObject)

RCT_EXTERN_METHOD(sampleMethod:(NSString *)str number:(nonnull NSNumber *)num callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(initElepay:(NSDictionary *)configs)
RCT_EXTERN_METHOD(handleOpenUrlString:(NSString *)urlString)
RCT_EXTERN_METHOD(handlePaymentWithPayload:(NSString *)payload resultHandler:(RCTResponseSenderBlock)callback)

@end
