import { useState, useEffect } from 'react'
import axios from 'axios'
import { Package, RotateCcw, CheckCircle, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

function fmt(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n) }

const STATUS = {
  pending:   { label: 'Pendiente',   color: 'text-yellow-400 bg-yellow-400/10', Icon: Clock       },
  confirmed: { label: 'Confirmado',  color: 'text-blue-400 bg-blue-400/10',     Icon: CheckCircle },
  shipped:   { label: 'Enviado',     color: 'text-purple-400 bg-purple-400/10', Icon: Package     },
  delivered: { label: 'Entregado',   color: 'text-green-400 bg-green-400/10',   Icon: CheckCircle },
  returned:  { label: 'Devuelto',    color: 'text-red-400 bg-red-400/10',       Icon: RotateCcw   },
}

// Mock orders for demo
const MOCK_ORDERS = [
  { _id: 'ORD-001', createdAt: new Date().toISOString(), status: 'delivered',
    items: [{ name: 'Camiseta Deportiva Pro', qty: 2, price: 49900 }], total: 99800 },
  { _id: 'ORD-002', createdAt: new Date(Date.now() - 86400000*2).toISOString(), status: 'shipped',
    items: [{ name: 'Tenis de Running Air', qty: 1, price: 189900 }], total: 189900 },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [returning, setReturning] = useState(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    axios.get('/api/orders/my').then(r => setOrders(r.data)).catch(() => {})
  }, [])

  const handleReturn = async (orderId) => {
    if (!reason.trim()) return toast.error('Por favor indica el motivo de la devolución')
    try {
      await axios.post(`/api/orders/${orderId}/return`, { reason })
      setOrders(o => o.map(ord => ord._id === orderId ? { ...ord, status: 'returned' } : ord))
      toast.success('Solicitud de devolución enviada. Recibirás confirmación por correo.')
      setReturning(null)
      setReason('')
    } catch {
      // Demo mode
      setOrders(o => o.map(ord => ord._id === orderId ? { ...ord, status: 'returned' } : ord))
      toast.success('Solicitud de devolución registrada.')
      setReturning(null)
      setReason('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl mb-8">MIS PEDIDOS</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p>Aún no tienes pedidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const s = STATUS[order.status] || STATUS.pending
            const canReturn = ['delivered'].includes(order.status)
            return (
              <div key={order._id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-mono text-sm text-gray-500">#{order._id}</p>
                    <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString('es-CO')}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
                    <s.Icon size={13} /> {s.label}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name} <span className="text-gray-600">x{item.qty}</span></span>
                      <span className="text-gray-400">{fmt(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                  <span className="font-bold text-white">{fmt(order.total)}</span>
                  {canReturn && returning !== order._id && (
                    <button
                      onClick={() => setReturning(order._id)}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-500 transition-colors"
                    >
                      <RotateCcw size={15} /> Solicitar devolución
                    </button>
                  )}
                  {order.status === 'returned' && (
                    <span className="text-xs text-red-400">Devolución en proceso</span>
                  )}
                </div>

                {/* Return form */}
                {returning === order._id && (
                  <div className="mt-4 bg-dark-700 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-sm">Motivo de la devolución</h4>
                    <textarea
                      className="input-field resize-none text-sm"
                      rows={3}
                      placeholder="Describe el motivo (producto defectuoso, talla incorrecta, etc.)"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setReturning(null)} className="btn-secondary text-sm py-2 flex-1">Cancelar</button>
                      <button onClick={() => handleReturn(order._id)} className="btn-primary text-sm py-2 flex-1">Enviar solicitud</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
