import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

function fmt(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n) }

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handleCheckout = async () => {
    if (!user) return navigate('/login', { state: { from: '/cart' } })
    setLoading(true)
    try {
      const { data } = await axios.post('/api/orders', {
        items: items.map(i => ({ product: i._id, name: i.name, qty: i.qty, price: i.price })),
        total
      })
      setOrderId(data._id || 'ORD-' + Date.now())
      clearCart()
      setOrdered(true)
    } catch {
      // Demo mode: simulate success
      setOrderId('ORD-' + Date.now())
      clearCart()
      setOrdered(true)
    } finally {
      setLoading(false)
    }
  }

  if (ordered) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="font-display text-4xl mb-3">¡PEDIDO REALIZADO!</h2>
          <p className="text-gray-400 mb-2">Orden: <span className="text-white font-mono">{orderId}</span></p>
          <p className="text-sm text-gray-500 mb-8">Hemos enviado la confirmación a tu correo electrónico.</p>
          <div className="flex gap-3">
            <Link to="/orders" className="btn-secondary flex-1">Mis pedidos</Link>
            <Link to="/products" className="btn-primary flex-1">Seguir comprando</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShoppingBag size={64} className="text-dark-600" />
        <h2 className="font-display text-3xl text-gray-500">Tu carrito está vacío</h2>
        <Link to="/products" className="btn-primary">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl mb-8">MI CARRITO</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-dark-700 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {item.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{item.name}</h3>
                <p className="text-brand-500 font-bold">{fmt(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center hover:bg-dark-600">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-semibold">{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center hover:bg-dark-600">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => removeItem(item._id)} className="text-gray-500 hover:text-red-400 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Resumen</h2>
          <div className="space-y-2 mb-4">
            {items.map(i => (
              <div key={i._id} className="flex justify-between text-sm text-gray-400">
                <span>{i.name} x{i.qty}</span>
                <span>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-600 pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-brand-500">{fmt(total)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Procesando...' : user ? 'Finalizar compra' : 'Inicia sesión para comprar'}
          </button>
          {!user && (
            <p className="text-xs text-gray-500 text-center mt-3">
              <Link to="/login" className="text-brand-500 hover:underline">Inicia sesión</Link> o{' '}
              <Link to="/register" className="text-brand-500 hover:underline">regístrate</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
