package com.reactlibrary

import androidx.annotation.NonNull
import androidx.annotation.Nullable
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import jp.elestyle.androidapp.elepay.Elepay
import jp.elestyle.androidapp.elepay.ElepayConfiguration
import jp.elestyle.androidapp.elepay.ElepayError
import jp.elestyle.androidapp.elepay.ElepayResult
import jp.elestyle.androidapp.elepay.ElepayResultListener
import jp.elestyle.androidapp.elepay.GooglePayEnvironment
import org.json.JSONObject

class RnElepayModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Elepay"

    @ReactMethod
    fun initElepayWithPublicKey(publicKey: String, apiUrl: String) {
        Elepay.setup(ElepayConfiguration(publicKey, apiUrl, null))
    }

    @ReactMethod
    fun initElepayWithPublicKeyAndGooglePayConfig(publicKey: String, apiUrl: String, googlePayEnvironment: String?) {
        val googlePayEnv =
            if (googlePayEnvironment != null) {
                if (googlePayEnvironment.toLowerCase().contains("test")) GooglePayEnvironment.TEST
                else GooglePayEnvironment.PRODUCTION
            } else null
        Elepay.setup(ElepayConfiguration(publicKey, apiUrl, googlePayEnv))
    }

    @ReactMethod
    fun handleOpenUrlString(urlString: String) {
    }

    @ReactMethod
    fun handlePaymentWithPayload(payload: String, resultHandler: Callback) {
        Elepay.processPayment(chargeDataString = payload, fromActivity = getCurrentActivity()!!) { result ->
            when (result) {
                is ElepayResult.Succeeded ->
                    resultHandler.invoke(RnElepayResult("succeeded", result.paymentId).asMap)

                is ElepayResult.Canceled ->
                    resultHandler.invoke(RnElepayResult("cancelled", result.paymentId).asMap)

                is ElepayResult.Failed -> {
                    val rnElepayError = when (val error = result.error) {
                        is ElepayError.UnsupportedPaymentMethod ->
                            RnElepayError("", "Unsupported payment method", error.paymentMethod)

                        is ElepayError.AlreadyMakingPayment ->
                            RnElepayError("", "Already making payment", error.paymentId)

                        is ElepayError.InvalidPayload ->
                            RnElepayError(error.errorCode, "Invalid payload", error.message)

                        is ElepayError.UninitializedPaymentMethod ->
                            RnElepayError(
                                error.errorCode,
                                "Uninitialized payment method",
                                "${error.paymentMethod} ${error.message}"
                            )

                        is ElepayError.SystemError ->
                            RnElepayError(error.errorCode, "System Error", error.message)

                        is ElepayError.PaymentFailure ->
                            RnElepayError(error.errorCode, "Payment failure", error.message)

                        is ElepayError.PermissionRequired ->
                            RnElepayError("", "Permissions required", error.permissions.joinToString(", "))
                    }
                    resultHandler.invoke(
                        RnElepayResult("failed", result.paymentId).asMap,
                        rnElepayError.asMap
                    )
                }
            }
        }
    }
}
