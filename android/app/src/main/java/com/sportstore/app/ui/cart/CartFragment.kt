package com.sportstore.app.ui.cart

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.sportstore.app.R
import com.sportstore.app.databinding.FragmentCartBinding
import com.sportstore.app.ui.MainActivity
import com.sportstore.app.ui.auth.LoginActivity
import com.sportstore.app.utils.AuthManager
import com.sportstore.app.utils.CartManager
import com.sportstore.app.utils.hide
import com.sportstore.app.utils.show
import com.sportstore.app.utils.toCOP
import com.sportstore.app.viewmodel.OrdersViewModel

class CartFragment : Fragment() {

    private var _binding: FragmentCartBinding? = null
    private val binding get() = _binding!!
    private val viewModel: OrdersViewModel by viewModels()
    private lateinit var adapter: CartAdapter
    private lateinit var authManager: AuthManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentCartBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        authManager = AuthManager(requireContext())

        adapter = CartAdapter(
            onIncrease = { productId ->
                CartManager.increaseQty(productId)
                refreshCart()
            },
            onDecrease = { productId ->
                CartManager.decreaseQty(productId)
                refreshCart()
            },
            onRemove = { productId ->
                CartManager.removeItem(productId)
                refreshCart()
            }
        )
        binding.recyclerCart.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerCart.adapter = adapter

        binding.btnCheckout.setOnClickListener { handleCheckout() }

        observeViewModel()
        refreshCart()
    }

    private fun refreshCart() {
        val items = CartManager.items
        adapter.submitList(items.toList())
        (activity as? MainActivity)?.updateCartBadge()

        if (items.isEmpty()) {
            binding.layoutEmpty.show()
            binding.layoutCart.hide()
        } else {
            binding.layoutEmpty.hide()
            binding.layoutCart.show()
            binding.tvTotal.text = "Total: ${CartManager.total.toCOP()}"
            binding.tvItemCount.text = "${CartManager.itemCount} artículo(s)"
        }
    }

    private fun handleCheckout() {
        if (!authManager.isLoggedIn()) {
            Toast.makeText(requireContext(), "Debes iniciar sesión para comprar", Toast.LENGTH_SHORT).show()
            startActivity(Intent(requireContext(), LoginActivity::class.java))
            return
        }
        if (CartManager.isEmpty()) {
            Toast.makeText(requireContext(), "Tu carrito está vacío", Toast.LENGTH_SHORT).show()
            return
        }
        viewModel.createOrder(authManager.getToken()!!)
    }

    private fun observeViewModel() {
        viewModel.loading.observe(viewLifecycleOwner) { loading ->
            binding.btnCheckout.isEnabled = !loading
            if (loading) binding.progressBar.show() else binding.progressBar.hide()
        }

        viewModel.orderCreated.observe(viewLifecycleOwner) { order ->
            order ?: return@observe
            Toast.makeText(requireContext(),
                "¡Pedido #${order.id} realizado con éxito! 🎉", Toast.LENGTH_LONG).show()
            refreshCart()
            findNavController().navigate(R.id.nav_orders)
        }

        viewModel.error.observe(viewLifecycleOwner) { err ->
            err?.let { Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show() }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
