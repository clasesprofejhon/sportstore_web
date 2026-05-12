package com.sportstore.app.utils

import com.sportstore.app.api.CartItem
import com.sportstore.app.api.Product

object CartManager {

    private val _items = mutableListOf<CartItem>()

    val items: List<CartItem> get() = _items.toList()

    val itemCount: Int get() = _items.sumOf { it.qty }

    val total: Double get() = _items.sumOf { it.subtotal() }

    fun addItem(product: Product) {
        val existing = _items.find { it.product.id == product.id }
        if (existing != null) {
            existing.qty++
        } else {
            _items.add(CartItem(product, 1))
        }
    }

    fun removeItem(productId: Int) {
        _items.removeAll { it.product.id == productId }
    }

    fun increaseQty(productId: Int) {
        _items.find { it.product.id == productId }?.qty = (_items.find { it.product.id == productId }?.qty ?: 0) + 1
    }

    fun decreaseQty(productId: Int) {
        val item = _items.find { it.product.id == productId } ?: return
        if (item.qty <= 1) removeItem(productId) else item.qty--
    }

    fun clear() = _items.clear()

    fun isEmpty() = _items.isEmpty()
}
