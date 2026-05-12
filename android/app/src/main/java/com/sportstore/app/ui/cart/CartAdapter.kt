package com.sportstore.app.ui.cart

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.sportstore.app.api.CartItem
import com.sportstore.app.databinding.ItemCartBinding
import com.sportstore.app.utils.toCOP

class CartAdapter(
    private val onIncrease: (Int) -> Unit,
    private val onDecrease: (Int) -> Unit,
    private val onRemove:   (Int) -> Unit
) : ListAdapter<CartItem, CartAdapter.ViewHolder>(DiffCallback()) {

    inner class ViewHolder(private val binding: ItemCartBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: CartItem) {
            binding.tvCartItemName.text  = item.product.name
            binding.tvCartItemPrice.text = item.product.price.toCOP()
            binding.tvCartItemSubtotal.text = "Subtotal: ${item.subtotal().toCOP()}"
            binding.tvCartItemQty.text   = item.qty.toString()
            binding.tvCartItemImage.text = item.product.image ?: "🏅"

            binding.btnIncrease.setOnClickListener { onIncrease(item.product.id) }
            binding.btnDecrease.setOnClickListener { onDecrease(item.product.id) }
            binding.btnRemove.setOnClickListener   { onRemove(item.product.id)   }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemCartBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) = holder.bind(getItem(position))

    class DiffCallback : DiffUtil.ItemCallback<CartItem>() {
        override fun areItemsTheSame(old: CartItem, new: CartItem) = old.product.id == new.product.id
        override fun areContentsTheSame(old: CartItem, new: CartItem) = old.qty == new.qty && old.product == new.product
    }
}
