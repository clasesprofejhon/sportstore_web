package com.sportstore.app.api

import com.google.gson.annotations.SerializedName

// ── Autenticación ────────────────────────────────────────────────────────────

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class User(
    val id: Int,
    val name: String,
    val email: String,
    @SerializedName("credit_card") val creditCard: String?,
    val role: String,
    val verified: Int?
)

data class CardData(
    val last4: String,
    val holder: String,
    val expiry: String,
    val cvv: String,
    val isAmex: Boolean = false
)

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val card: CardData
)

data class RegisterResponse(
    val message: String,
    val user: User
)

// ── Productos ────────────────────────────────────────────────────────────────

data class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val category: String,
    val description: String?,
    val stock: Int,
    val image: String?,
    val rating: Double,
    val active: Int?
)

// ── Pedidos ──────────────────────────────────────────────────────────────────

data class OrderItem(
    val name: String,
    val qty: Int,
    val price: Double,
    val product: Int? = null
)

data class OrderRequest(
    val items: List<OrderItem>,
    val total: Double
)

data class Order(
    val id: Int,
    @SerializedName("_id") val _id: Any?,  // puede venir como Int o String
    val total: Double,
    val status: String,
    val items: List<OrderItem>?,
    @SerializedName("created_at") val createdAt: String?,
    @SerializedName("return_reason") val returnReason: String?
) {
    fun displayId(): String = id.toString()
}

data class ReturnRequest(val reason: String)

// ── Error genérico ───────────────────────────────────────────────────────────

data class ApiError(val message: String)

// ── Carrito (local) ──────────────────────────────────────────────────────────

data class CartItem(
    val product: Product,
    var qty: Int
) {
    fun subtotal() = product.price * qty
}
