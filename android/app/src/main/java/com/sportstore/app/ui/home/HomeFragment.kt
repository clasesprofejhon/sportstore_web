package com.sportstore.app.ui.home

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.sportstore.app.R
import com.sportstore.app.databinding.FragmentHomeBinding
import com.sportstore.app.ui.auth.LoginActivity
import com.sportstore.app.utils.AuthManager

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val auth = AuthManager(requireContext())

        if (auth.isLoggedIn()) {
            binding.tvWelcome.text = "¡Hola, ${auth.getUserName()}!"
            binding.btnAuthAction.text = "Ver mis pedidos"
            binding.btnAuthAction.setOnClickListener {
                findNavController().navigate(R.id.nav_orders)
            }
        } else {
            binding.tvWelcome.text = "¡Bienvenido a SportStore!"
            binding.btnAuthAction.text = "Iniciar sesión"
            binding.btnAuthAction.setOnClickListener {
                startActivity(Intent(requireContext(), LoginActivity::class.java))
            }
        }

        binding.btnGoProducts.setOnClickListener {
            findNavController().navigate(R.id.nav_products)
        }

        // Botones de categoría
        binding.btnCatFutbol.setOnClickListener { navigateToCategory("Fútbol") }
        binding.btnCatRunning.setOnClickListener { navigateToCategory("Running") }
        binding.btnCatBaloncesto.setOnClickListener { navigateToCategory("Baloncesto") }
        binding.btnCatNatacion.setOnClickListener { navigateToCategory("Natación") }
    }

    private fun navigateToCategory(cat: String) {
        val bundle = Bundle().apply { putString("category", cat) }
        findNavController().navigate(R.id.nav_products, bundle)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
