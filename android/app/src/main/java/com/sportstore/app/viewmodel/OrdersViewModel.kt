package com.sportstore.app.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sportstore.app.api.ApiClient
import com.sportstore.app.api.Order
import com.sportstore.app.api.OrderItem
import com.sportstore.app.api.OrderRequest
import com.sportstore.app.api.ReturnRequest
import com.sportstore.app.utils.CartManager
import kotlinx.coroutines.launch

class OrdersViewModel : ViewModel() {

    private val _orders = MutableLiveData<List<Order>>()
    val orders: LiveData<List<Order>> = _orders

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private val _orderCreated = MutableLiveData<Order?>()
    val orderCreated: LiveData<Order?> = _orderCreated

    private val _returnDone = MutableLiveData<Boolean?>()
    val returnDone: LiveData<Boolean?> = _returnDone

    fun loadOrders(token: String) {
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            try {
                val response = ApiClient.apiService.getMyOrders("Bearer $token")
                if (response.isSuccessful) {
                    _orders.value = response.body() ?: emptyList()
                } else {
                    _error.value = "Error ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Sin conexión al servidor"
            } finally {
                _loading.value = false
            }
        }
    }

    fun createOrder(token: String) {
        viewModelScope.launch {
            _loading.value = true
            _error.value = null
            try {
                val items = CartManager.items.map {
                    OrderItem(
                        name = it.product.name,
                        qty = it.qty,
                        price = it.product.price,
                        product = it.product.id
                    )
                }
                val body = OrderRequest(items, CartManager.total)
                val response = ApiClient.apiService.createOrder("Bearer $token", body)
                if (response.isSuccessful) {
                    _orderCreated.value = response.body()
                    CartManager.clear()
                } else {
                    _error.value = "Error al crear pedido: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = "Sin conexión al servidor"
            } finally {
                _loading.value = false
            }
        }
    }

    fun requestReturn(token: String, orderId: Int, reason: String) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val response = ApiClient.apiService.returnOrder(
                    "Bearer $token", orderId, ReturnRequest(reason)
                )
                if (response.isSuccessful) {
                    _returnDone.value = true
                    loadOrders(token)
                } else {
                    _error.value = "No se pudo procesar la devolución"
                }
            } catch (e: Exception) {
                _error.value = "Sin conexión al servidor"
            } finally {
                _loading.value = false
            }
        }
    }
}
