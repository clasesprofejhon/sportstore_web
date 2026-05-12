package com.sportstore.app.ui.orders

import android.app.AlertDialog
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.EditText
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.sportstore.app.R
import com.sportstore.app.api.Order
import com.sportstore.app.databinding.ItemOrderBinding
import com.sportstore.app.utils.hide
import com.sportstore.app.utils.show
import com.sportstore.app.utils.toCOP

class OrdersAdapter(
    private val onReturn: (orderId: Int, reason: String) -> Unit
) : ListAdapter<Order, OrdersAdapter.ViewHolder>(DiffCallback()) {

    inner class ViewHolder(private val binding: ItemOrderBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(order: Order) {
            binding.tvOrderId.text    = "Pedido #${order.id}"
            binding.tvOrderTotal.text = order.total.toCOP()
            binding.tvOrderDate.text  = order.createdAt?.take(10) ?: "—"

            val (label, color) = statusInfo(order.status)
            binding.tvOrderStatus.text = label
            binding.tvOrderStatus.setTextColor(color)

            // Items del pedido
            val itemsAdapter = OrderItemsAdapter()
            binding.recyclerItems.layoutManager = LinearLayoutManager(binding.root.context)
            binding.recyclerItems.adapter = itemsAdapter
            itemsAdapter.submitList(order.items ?: emptyList())

            // Botón de devolución solo para pedidos entregados
            if (order.status == "delivered") {
                binding.btnReturn.show()
                binding.btnReturn.setOnClickListener {
                    showReturnDialog(order.id)
                }
            } else {
                binding.btnReturn.hide()
            }
        }

        private fun showReturnDialog(orderId: Int) {
            val ctx = binding.root.context
            val input = EditText(ctx).apply {
                hint = "Motivo de la devolución"
                setPadding(48, 32, 48, 32)
            }
            AlertDialog.Builder(ctx)
                .setTitle("Solicitar devolución")
                .setMessage("Indica el motivo de la devolución:")
                .setView(input)
                .setPositiveButton("Enviar") { _, _ ->
                    val reason = input.text.toString().trim()
                    if (reason.isNotEmpty()) onReturn(orderId, reason)
                }
                .setNegativeButton("Cancelar", null)
                .show()
        }

        private fun statusInfo(status: String): Pair<String, Int> {
            val ctx = binding.root.context
            return when (status) {
                "pending"   -> "⏳ Pendiente"   to ctx.getColor(R.color.status_pending)
                "confirmed" -> "✅ Confirmado"  to ctx.getColor(R.color.status_confirmed)
                "shipped"   -> "🚚 En camino"   to ctx.getColor(R.color.status_shipped)
                "delivered" -> "📦 Entregado"   to ctx.getColor(R.color.status_delivered)
                "returned"  -> "↩️ Devuelto"    to ctx.getColor(R.color.status_returned)
                "cancelled" -> "❌ Cancelado"   to ctx.getColor(R.color.status_cancelled)
                else        -> status           to ctx.getColor(R.color.status_pending)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemOrderBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) = holder.bind(getItem(position))

    class DiffCallback : DiffUtil.ItemCallback<Order>() {
        override fun areItemsTheSame(old: Order, new: Order) = old.id == new.id
        override fun areContentsTheSame(old: Order, new: Order) = old.status == new.status
    }
}
