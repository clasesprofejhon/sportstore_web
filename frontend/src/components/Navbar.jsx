import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display text-2xl tracking-wide text-white">SPORTSTORE</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link to="/products" className="hover:text-white transition-colors">Productos</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-brand-500 transition-colors">Admin</Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 hover:text-brand-500 transition-colors">
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/orders" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Mis pedidos
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors ml-2"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Ingresar</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Registro</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-dark-700 bg-dark-800 px-4 py-4 flex flex-col gap-3">
          <Link to="/products" className="text-gray-300 hover:text-white py-2" onClick={() => setOpen(false)}>Productos</Link>
          {user ? (
            <>
              <Link to="/orders" className="text-gray-300 hover:text-white py-2" onClick={() => setOpen(false)}>Mis pedidos</Link>
              <button onClick={() => { handleLogout(); setOpen(false) }} className="text-left text-red-400 py-2">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-center" onClick={() => setOpen(false)}>Ingresar</Link>
              <Link to="/register" className="btn-primary text-center" onClick={() => setOpen(false)}>Registro</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
