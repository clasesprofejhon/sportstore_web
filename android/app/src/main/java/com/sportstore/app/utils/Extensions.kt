package com.sportstore.app.utils

import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import java.text.NumberFormat
import java.util.Locale

fun View.show() { visibility = View.VISIBLE }
fun View.hide() { visibility = View.GONE }
fun View.invisible() { visibility = View.INVISIBLE }

fun Fragment.toast(msg: String) =
    Toast.makeText(requireContext(), msg, Toast.LENGTH_SHORT).show()

fun Double.toCOP(): String {
    val fmt = NumberFormat.getCurrencyInstance(Locale("es", "CO"))
    fmt.maximumFractionDigits = 0
    return fmt.format(this)
}

fun String.parseApiError(): String {
    return try {
        val gson = com.google.gson.Gson()
        val err = gson.fromJson(this, com.sportstore.app.api.ApiError::class.java)
        err.message
    } catch (e: Exception) {
        this
    }
}
