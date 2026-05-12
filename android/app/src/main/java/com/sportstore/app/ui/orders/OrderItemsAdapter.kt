package com.sportstore.app.ui.orders

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.sportstore.app.api.OrderItem
import com.sportstore.app.databinding.ItemOrderLineBinding
import com.sportstore.app.utils.toCOP

class OrderItemsAdapter : ListAdapter<OrderItem, OrderItemsAdapter.ViewHolder>(DiffCallback()) {

    inner class ViewHolder(private val binding: ItemOrderLineBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: OrderItem) {
            binding.tvItemName.text     = item.name
            binding.tvItemQtyPrice.text = "x${item.qty}  ·  ${item.price.toCOP()}"
            binding.tvItemSubtotal.text = (item.price * item.qty).toCOP()
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemOrderLineBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) = holder.bind(getItem(position))

    class DiffCallback : DiffUtil.ItemCallback<OrderItem>() {
        override fun areItemsTheSame(old: OrderItem, new: OrderItem) = old.name == new.name
        override fun areContentsTheSame(old: OrderItem, new: OrderItem) = old == new
    }
}
