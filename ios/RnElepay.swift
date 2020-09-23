//
// Created on 2019/12/19, by Yin Tan
// Copyright © 2019 elestyle. All rights reserved.
//

import ElepaySDK

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
    func initElepay(_ configs: Dictionary<String, String>) {
        let publicKey = configs["publicKey"] ?? ""
        let apiUrl = configs["apiUrl"] ?? ""
        Elepay.initApp(key: publicKey, apiURLString: apiUrl)

        performChangingLanguage(langConfig: configs)
    }

    @objc
    func changeLanguage(_ langConfig: Dictionary<String, String>) {
        performChangingLanguage(langConfig: langConfig)
    }

    @objc
    func changeTheme(_ themeConfig: Dictionary<String, String>) {
        // Currently not supported yet.
    }

    @objc
    func handleOpenUrlString(_ urlString: String) -> Bool {
        guard let url = URL(string: urlString) else { return false }
        return Elepay.handleOpenURL(url)
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

    @objc
    func handleSource(
        payload: String,
        resultHandler callback: @escaping RCTResponseSenderBlock
    ) {
        DispatchQueue.main.async { [weak self] in
            self?.processSource(payload: payload, resultHandler: callback)
        }
    }

    @objc
    func checkout(payload: String, resultHandler callback: @escaping RCTResponseSenderBlock) {
        DispatchQueue.main.async { [weak self] in
            self?.processCheckout(payload: payload, resultHandler: callback)
        }
    }

    private func performChangingLanguage(langConfig: [String: String]) {
        let langCodeStr = langConfig["languageKey"] ?? ""
        if let langCode = retrieveLanguageCode(from: langCodeStr) {
            ElepayLocalization.shared.switchLanguage(code: langCode)
        }
    }

    private func retrieveLanguageCode(from langStr: String) -> ElepayLanguageCode? {
        let ret: ElepayLanguageCode?
        switch (langStr.lowercased()) {
            case "english": ret = .english
            case "simplifiedchinise": ret = .simplifiedChinese
            case "traditionalchinese": ret = .traditionalChinese
            case "japanese": ret = .japanese
            case "system": ret = .system
            default: ret = nil
        }
        return ret
    }

    private func processPayment(payload: String, resultHandler: @escaping RCTResponseSenderBlock) {
        let sender = UIApplication.shared.keyWindow?.rootViewController ?? UIViewController()
        _ = Elepay.handlePayment(chargeJSON: payload, viewController: sender) { [weak self] result in
            self?.processElepayResult(result, resultHandler: resultHandler)
        }
    }

    private func processSource(payload: String, resultHandler: @escaping RCTResponseSenderBlock) {
        let sender = UIApplication.shared.keyWindow?.rootViewController ?? UIViewController()
        _ = Elepay.handleSource(sourceJSON: payload, viewController: sender) { [weak self] result in
            self?.processElepayResult(result, resultHandler: resultHandler)
        }
    }

    private func processCheckout(payload: String, resultHandler: @escaping RCTResponseSenderBlock) {
        let sender = UIApplication.shared.keyWindow?.rootViewController ?? UIViewController()
        _ = Elepay.checkout(checkoutJSONString: payload, from: sender) { [weak self] result in
            self?.processElepayResult(result, resultHandler: resultHandler)
        }
    }

    private func processElepayResult(
        _ result: ElepayResult,
         resultHandler: @escaping RCTResponseSenderBlock
    ) {
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
