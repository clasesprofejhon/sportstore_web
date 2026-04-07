import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// Mock products for demo (when backend not connected)
const MOCK = [
  { _id: '1', name: 'Camiseta Deportiva Pro', price: 49900, category: 'Fútbol', rating: 4.8, stock: 15, image: '⚽' },
  { _id: '2', name: 'Tenis de Running Air', price: 189900, category: 'Running', rating: 4.9, stock: 8, image: '👟' },
  { _id: '3', name: 'Balón de Baloncesto', price: 79900, category: 'Baloncesto', rating: 4.7, stock: 20, image: '🏀' },
  { _id: '4', name: 'Gafas de Natación', price: 34900, category: 'Natación', rating: 4.6, stock: 30, image: '🥽' },
  { _id: '5', name: 'Shorts Deportivos', price: 29900, category: 'Running', rating: 4.5, stock: 25, image: '🩳' },
  { _id: '6', name: 'Guantes de Portero', price: 59900, category: 'Fútbol', rating: 4.8, stock: 12, image: '🧤' },
]

const CATS = ['Todos', 'Fútbol', 'Baloncesto', 'Running', 'Natación']

function fmt(n) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n) }

export default function ProductsPage() {
  const [products, setProducts] = useState(MOCK)
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()
  const [cat, setCat] = useState(searchParams.get('category') || 'Todos')
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    axios.get('/api/products').then(r => setProducts(r.data)).catch(() => { })
  }, [])

  const filtered = products.filter(p =>
    (cat === 'Todos' || p.category === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (p) => {
    addItem(p)
    toast.success(`${p.name} agregado al carrito`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-4xl">PRODUCTOS</h1>
        <input
          className="input-field max-w-xs"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === c ? 'bg-brand-500 text-white' : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p._id} className="card overflow-hidden hover:border-brand-500/50 transition-colors group">
            <div className="bg-dark-700 h-48 flex items-center justify-center text-7xl">
              {p.image}
            </div>
            <div className="p-5">
              <span className="text-xs text-brand-500 font-semibold uppercase tracking-wide">{p.category}</span>
              <h3 className="font-semibold text-white text-lg mt-1 mb-1">{p.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-400">{p.rating} · {p.stock} en stock</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">{fmt(p.price)}</span>
                <button
                  onClick={() => handleAdd(p)}
                  className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-95"
                >
                  <ShoppingCart size={15} /> Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">No se encontraron productos</div>
      )}
    </div>
  )
}
