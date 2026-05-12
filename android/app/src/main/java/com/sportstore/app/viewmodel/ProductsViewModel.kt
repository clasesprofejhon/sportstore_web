package com.sportstore.app.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sportstore.app.api.ApiClient
import com.sportstore.app.api.Product
import kotlinx.coroutines.launch

class ProductsViewModel : ViewModel() {

    private val _products = MutableLiveData<List<Product>>()
    val products: LiveData<List<Product>> = _products

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun loadProducts(category: String? = null, search: String? = null) {
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            try {
                val response = ApiClient.apiService.getProducts(
                    category = category?.takeIf { it != "Todos" },
                    search = search?.takeIf { it.isNotBlank() }
                )
                if (response.isSuccessful) {
                    _products.value = response.body() ?: emptyList()
                } else {
                    _error.value = "Error ${response.code()}: ${response.message()}"
                }
            } catch (e: Exception) {
                _error.value = "Sin conexión al servidor. Verifica la URL en ApiClient."
            } finally {
                _loading.value = false
            }
        }
    }
}
