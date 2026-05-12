package com.sportstore.app.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    /**
     * IMPORTANTE: Cambia esta URL según tu entorno:
     *  - Emulador Android Studio  →  http://10.0.2.2:5000/
     *  - Dispositivo físico (misma red Wi-Fi) →  http://192.168.X.X:5000/
     *  - Producción →  https://tu-dominio.com/
     */
    const val BASE_URL = "http://192.168.1.3:5000/"

    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttp = OkHttpClient.Builder()
        .addInterceptor(logging)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(okHttp)
        .build()

    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
