package com.sportstore.app.ui.products

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import com.google.android.material.chip.Chip
import com.sportstore.app.databinding.FragmentProductsBinding
import com.sportstore.app.ui.MainActivity
import com.sportstore.app.utils.CartManager
import com.sportstore.app.utils.hide
import com.sportstore.app.utils.show
import com.sportstore.app.viewmodel.ProductsViewModel

class ProductsFragment : Fragment() {

    private var _binding: FragmentProductsBinding? = null
    private val binding get() = _binding!!
    private val viewModel: ProductsViewModel by viewModels()
    private lateinit var adapter: ProductsAdapter

    private val categories = listOf("Todos", "Fútbol", "Running", "Baloncesto", "Natación")
    private var selectedCategory: String = "Todos"

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProductsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Categoria desde argumentos (navegación desde Home)
        arguments?.getString("category")?.let { selectedCategory = it }

        setupRecyclerView()
        setupCategoryChips()
        setupSearch()
        observeViewModel()

        loadProducts()
    }

    private fun setupRecyclerView() {
        adapter = ProductsAdapter { product ->
            CartManager.addItem(product)
            (activity as? MainActivity)?.updateCartBadge()
            Toast.makeText(requireContext(), "${product.name} agregado al carrito ✓", Toast.LENGTH_SHORT).show()
        }
        binding.recyclerProducts.layoutManager = GridLayoutManager(requireContext(), 2)
        binding.recyclerProducts.adapter = adapter
    }

    private fun setupCategoryChips() {
        binding.chipGroupCategories.removeAllViews()
        categories.forEach { cat ->
            val chip = Chip(requireContext()).apply {
                text = cat
                isCheckable = true
                isChecked = cat == selectedCategory
                setOnClickListener {
                    selectedCategory = cat
                    loadProducts()
                }
            }
            binding.chipGroupCategories.addView(chip)
        }
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) { loadProducts() }
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
    }

    private fun loadProducts() {
        val cat = selectedCategory.takeIf { it != "Todos" }
        val search = binding.etSearch.text.toString().trim().takeIf { it.isNotEmpty() }
        viewModel.loadProducts(cat, search)
    }

    private fun observeViewModel() {
        viewModel.loading.observe(viewLifecycleOwner) { loading ->
            if (loading) binding.progressBar.show() else binding.progressBar.hide()
        }
        viewModel.products.observe(viewLifecycleOwner) { products ->
            adapter.submitList(products)
            if (products.isEmpty()) binding.tvEmpty.show() else binding.tvEmpty.hide()
        }
        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let { Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show() }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
