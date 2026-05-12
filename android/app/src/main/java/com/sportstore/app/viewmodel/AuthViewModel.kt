package com.sportstore.app.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sportstore.app.api.ApiClient
import com.sportstore.app.api.CardData
import com.sportstore.app.api.LoginRequest
import com.sportstore.app.api.LoginResponse
import com.sportstore.app.api.RegisterRequest
import kotlinx.coroutines.launch

sealed class AuthResult {
    data class Success(val data: LoginResponse) : AuthResult()
    data class Error(val message: String) : AuthResult()
    object RegisterSuccess : AuthResult()
}

class AuthViewModel : ViewModel() {

    private val _authResult = MutableLiveData<AuthResult?>()
    val authResult: LiveData<AuthResult?> = _authResult

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _loading.value = true
            _authResult.value = null
            try {
                val response = ApiClient.apiService.login(LoginRequest(email, password))
                if (response.isSuccessful) {
                    _authResult.value = AuthResult.Success(response.body()!!)
                } else {
                    val errBody = response.errorBody()?.string() ?: ""
                    val msg = errBody.parseErrorMessage() ?: "Credenciales incorrectas"
                    _authResult.value = AuthResult.Error(msg)
                }
            } catch (e: Exception) {
                _authResult.value = AuthResult.Error("Sin conexión al servidor")
            } finally {
                _loading.value = false
            }
        }
    }

    fun register(name: String, email: String, password: String, card: CardData) {
        viewModelScope.launch {
            _loading.value = true
            _authResult.value = null
            try {
                val req = RegisterRequest(name, email, password, card)
                val response = ApiClient.apiService.register(req)
                if (response.isSuccessful) {
                    _authResult.value = AuthResult.RegisterSuccess
                } else {
                    val errBody = response.errorBody()?.string() ?: ""
                    val msg = errBody.parseErrorMessage() ?: "Error al registrar"
                    _authResult.value = AuthResult.Error(msg)
                }
            } catch (e: Exception) {
                _authResult.value = AuthResult.Error("Sin conexión al servidor")
            } finally {
                _loading.value = false
            }
        }
    }

    private fun String.parseErrorMessage(): String? {
        return try {
            val gson = com.google.gson.Gson()
            val obj = gson.fromJson(this, com.sportstore.app.api.ApiError::class.java)
            obj.message
        } catch (e: Exception) { null }
    }
}
