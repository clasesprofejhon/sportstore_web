package com.sportstore.app.ui.products

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.sportstore.app.api.Product
import com.sportstore.app.databinding.ItemProductBinding
import com.sportstore.app.utils.toCOP

class ProductsAdapter(
    private val onAddToCart: (Product) -> Unit
) : ListAdapter<Product, ProductsAdapter.ViewHolder>(DiffCallback()) {

    inner class ViewHolder(private val binding: ItemProductBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(product: Product) {
            binding.tvProductName.text = product.name
            binding.tvProductPrice.text = product.price.toCOP()
            binding.tvProductCategory.text = product.category
            binding.tvProductRating.text = "★ ${product.rating}"
            binding.tvProductStock.text = "${product.stock} en stock"
            binding.tvProductImage.text = product.image ?: "🏅"
            binding.btnAddToCart.setOnClickListener { onAddToCart(product) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemProductBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class DiffCallback : DiffUtil.ItemCallback<Product>() {
        override fun areItemsTheSame(oldItem: Product, newItem: Product) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Product, newItem: Product) = oldItem == newItem
    }
}
