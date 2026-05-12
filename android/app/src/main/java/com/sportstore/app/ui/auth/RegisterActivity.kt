package com.sportstore.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.sportstore.app.databinding.ActivityRegisterBinding
import com.sportstore.app.api.CardData
import com.sportstore.app.utils.AuthManager
import com.sportstore.app.viewmodel.AuthResult
import com.sportstore.app.viewmodel.AuthViewModel

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding
    private val viewModel: AuthViewModel by viewModels()
    private lateinit var authManager: AuthManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.title = "Crear Cuenta"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        authManager = AuthManager(this)

        binding.btnRegister.setOnClickListener { attemptRegister() }

        binding.tvGoLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        viewModel.loading.observe(this) { loading ->
            binding.progressBar.visibility = if (loading) android.view.View.VISIBLE else android.view.View.GONE
            binding.btnRegister.isEnabled = !loading
        }

        viewModel.authResult.observe(this) { result ->
            when (result) {
                is AuthResult.RegisterSuccess -> {
                    Toast.makeText(this,
                        "¡Registro exitoso! Revisa tu correo para verificar tu cuenta.",
                        Toast.LENGTH_LONG).show()
                    startActivity(Intent(this, LoginActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                    })
                    finish()
                }
                is AuthResult.Error -> {
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                }
                else -> {}
            }
        }
    }

    private fun attemptRegister() {
        val name     = binding.etName.text.toString().trim()
        val email    = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString()
        val last4    = binding.etCardLast4.text.toString().trim()
        val holder   = binding.etCardHolder.text.toString().trim()
        val expiry   = binding.etCardExpiry.text.toString().trim()
        val cvv      = binding.etCardCvv.text.toString().trim()

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Completa los datos personales", Toast.LENGTH_SHORT).show()
            return
        }
        if (last4.length != 4 || holder.isEmpty() || expiry.isEmpty() || cvv.isEmpty()) {
            Toast.makeText(this, "Completa los datos de tarjeta", Toast.LENGTH_SHORT).show()
            return
        }
        if (password.length < 6) {
            Toast.makeText(this, "La contraseña debe tener al menos 6 caracteres", Toast.LENGTH_SHORT).show()
            return
        }

        val card = CardData(last4 = last4, holder = holder, expiry = expiry, cvv = cvv)
        viewModel.register(name, email, password, card)
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }
}
