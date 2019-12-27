//
// Created on 2019/12/19, by Yin Tan
// Copyright © 2019 elestyle. All rights reserved.
//

import ElePay

fileprivate struct RnElepayResult {
    let state: String
    let paymentId: String?

    var asNSDictionary: NSDictionary {
        return [
            "state": state,
            "paymentId": paymentId ?? NSNull()
        ]
    }
}

fileprivate struct RnElepayError {
    let code: String
    let reason: String
    let message: String

    var asNSDictionary: NSDictionary {
        return [
            "errorCode": code,
            "reason": reason,
            "message": message
        ]
    }
}

@objc(ElepayModule)
final class ElepayModule: NSObject {

    @objc
    func initElepay(publicKey: String, apiUrl: String?) {
        ElePay.initApp(key: publicKey, apiURLString: apiUrl)
    }

    @objc
    func handleOpenUrlString(_ urlString: String) -> Bool {
        guard let url = URL(string: urlString) else { return false }
        return ElePay.handleOpenURL(url)
    }

    @objc
    func handlePayment(
        payload: String,
        resultHandler callback: @escaping RCTResponseSenderBlock
    ) {
        // React-Native always invoke the native module method in a background thread.
        // Manually call through main thread to work around it.
        // The trade-off is that we can't return the result of the `handlePaymentEvent`.
        DispatchQueue.main.async { [weak self] in
            self?.processPayment(payload: payload, resultHandler: callback)
        }
    }

    private func processPayment(payload: String, resultHandler: @escaping RCTResponseSenderBlock) {
        let sender = UIApplication.shared.keyWindow?.rootViewController ?? UIViewController()
        _ = ElePay.handlePayment(chargeJSON: payload, viewController: sender) { result in
            switch result {
            case .succeeded(let paymentId):
                let res = RnElepayResult(state: "succeeded", paymentId: paymentId)
                resultHandler([res.asNSDictionary, NSNull()])
            case .cancelled(let paymentId):
                let res = RnElepayResult(state: "cancelled", paymentId: paymentId)
                resultHandler([res.asNSDictionary, NSNull()])
            case .failed(let paymentId, let error):
                let err: RnElepayError
                switch error {
                case .alreadyMakingPayment(_):
                    err = RnElepayError(code: "", reason: "Already making payment", message: "")
                case .invalidPayload(let errorCode, let message):
                    err = RnElepayError(code: errorCode, reason: "Invalid payload", message: message)
                case .paymentFailure(let errorCode, let message):
                    err = RnElepayError(code: errorCode, reason: "Payment failure", message: message)
                case .paymentMethodNotInitialized(let errorCode, let message):
                    err = RnElepayError(code: errorCode, reason: "Payment method not initialized", message: message)
                case .serverError(let errorCode, let message):
                    err = RnElepayError(code: errorCode, reason: "Server error", message: message)
                case .systemError(let errorCode, let message):
                    err = RnElepayError(code: errorCode, reason: "System error", message: message)
                case .unsupportedPaymentMethod(let errorCode, let paymentMethod):
                    err = RnElepayError(code: errorCode, reason: "Unsupported payment method", message: paymentMethod)
                @unknown default:
                    err = RnElepayError(code: "-1", reason: "Undefined reason", message: "Unknonw error")
                    break
                }

                let res = RnElepayResult(state: "failed", paymentId: paymentId)
                resultHandler([res.asNSDictionary, err.asNSDictionary])
            @unknown default:
                break
            }
        }
    }
}
