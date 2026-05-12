package com.sportstore.app.api

import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // ── Health ────────────────────────────────────────────────────────────────
    @GET("api/health")
    suspend fun health(): Response<Map<String, String>>

    // ── Autenticación ─────────────────────────────────────────────────────────
    @POST("api/auth/login")
    suspend fun login(@Body req: LoginRequest): Response<LoginResponse>

    @POST("api/auth/register")
    suspend fun register(@Body req: RegisterRequest): Response<RegisterResponse>

    @GET("api/auth/me")
    suspend fun getMe(@Header("Authorization") token: String): Response<User>

    // ── Productos ─────────────────────────────────────────────────────────────
    @GET("api/products")
    suspend fun getProducts(
        @Query("category") category: String? = null,
        @Query("search") search: String? = null
    ): Response<List<Product>>

    @GET("api/products/{id}")
    suspend fun getProduct(@Path("id") id: Int): Response<Product>

    // ── Pedidos ───────────────────────────────────────────────────────────────
    @POST("api/orders")
    suspend fun createOrder(
        @Header("Authorization") token: String,
        @Body body: OrderRequest
    ): Response<Order>

    @GET("api/orders/my")
    suspend fun getMyOrders(
        @Header("Authorization") token: String
    ): Response<List<Order>>

    @POST("api/orders/{id}/return")
    suspend fun returnOrder(
        @Header("Authorization") token: String,
        @Path("id") id: Int,
        @Body body: ReturnRequest
    ): Response<Order>
}
