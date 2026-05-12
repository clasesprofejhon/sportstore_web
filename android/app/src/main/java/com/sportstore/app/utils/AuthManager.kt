package com.sportstore.app.utils

import android.content.Context

class AuthManager(context: Context) {

    private val prefs = context.getSharedPreferences("sportstore_auth", Context.MODE_PRIVATE)

    fun saveSession(token: String, name: String, email: String, role: String) {
        prefs.edit()
            .putString("jwt_token", token)
            .putString("user_name", name)
            .putString("user_email", email)
            .putString("user_role", role)
            .apply()
    }

    fun getToken(): String? = prefs.getString("jwt_token", null)

    fun getBearerToken(): String = "Bearer ${getToken() ?: ""}"

    fun getUserName(): String = prefs.getString("user_name", "") ?: ""

    fun getUserEmail(): String = prefs.getString("user_email", "") ?: ""

    fun isAdmin(): Boolean = prefs.getString("user_role", "") == "admin"

    fun isLoggedIn(): Boolean = getToken() != null

    fun logout() = prefs.edit().clear().apply()
}
