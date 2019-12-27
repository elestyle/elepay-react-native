package com.reactlibrary

import androidx.annotation.Nullable
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap

data class RnElepayError(val code: String, val reason: String, val message: String) {
    val asMap: WritableMap
        get() {
            val res = WritableNativeMap()

            res.putString("code", code)
            res.putString("reason", reason)
            res.putString("message", message)

            return res
        }
}

data class RnElepayResult(val state: String, val paymentId: String?) {
    val asMap: WritableMap
        get() {
            val res = WritableNativeMap()

            res.putString("state", state)
            if (paymentId == null) {
                res.putNull("paymentId")
            } else {
                res.putString("paymentId", paymentId)
            }

            return res
        }
}