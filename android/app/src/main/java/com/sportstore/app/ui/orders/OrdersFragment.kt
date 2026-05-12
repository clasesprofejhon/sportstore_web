package com.sportstore.app.ui.orders

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.sportstore.app.databinding.FragmentOrdersBinding
import com.sportstore.app.ui.auth.LoginActivity
import com.sportstore.app.utils.AuthManager
import com.sportstore.app.utils.hide
import com.sportstore.app.utils.show
import com.sportstore.app.viewmodel.OrdersViewModel

class OrdersFragment : Fragment() {

    private var _binding: FragmentOrdersBinding? = null
    private val binding get() = _binding!!
    private val viewModel: OrdersViewModel by viewModels()
    private lateinit var adapter: OrdersAdapter
    private lateinit var authManager: AuthManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentOrdersBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        authManager = AuthManager(requireContext())

        if (!authManager.isLoggedIn()) {
            binding.layoutNotLoggedIn.show()
            binding.recyclerOrders.hide()
            binding.btnGoLogin.setOnClickListener {
                startActivity(Intent(requireContext(), LoginActivity::class.java))
            }
            return
        }

        adapter = OrdersAdapter { orderId, reason ->
            viewModel.requestReturn(authManager.getToken()!!, orderId, reason)
        }
        binding.recyclerOrders.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerOrders.adapter = adapter

        binding.swipeRefresh.setOnRefreshListener { loadOrders() }

        observeViewModel()
        loadOrders()
    }

    private fun loadOrders() {
        viewModel.loadOrders(authManager.getToken()!!)
    }

    private fun observeViewModel() {
        viewModel.loading.observe(viewLifecycleOwner) { loading ->
            binding.swipeRefresh.isRefreshing = loading
            if (loading) binding.progressBar.show() else binding.progressBar.hide()
        }

        viewModel.orders.observe(viewLifecycleOwner) { orders ->
            adapter.submitList(orders)
            if (orders.isEmpty()) {
                binding.tvEmpty.show()
                binding.recyclerOrders.hide()
            } else {
                binding.tvEmpty.hide()
                binding.recyclerOrders.show()
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { err ->
            err?.let { Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show() }
        }

        viewModel.returnDone.observe(viewLifecycleOwner) { done ->
            if (done == true) {
                Toast.makeText(requireContext(),
                    "Solicitud de devolución enviada ✓", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
