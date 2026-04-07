import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, RotateCcw, Zap } from 'lucide-react'

const CATEGORIES = [
  { name: 'Fútbol', img: '/images/futbol.png', color: 'from-green-900 to-green-700' },
  { name: 'Baloncesto', img: '/images/baloncesto.png', color: 'from-orange-900 to-orange-700' },
  { name: 'Running', img: '/images/running.png', color: 'from-blue-900 to-blue-700' },
  { name: 'Natación', img: '/images/natacion.png', color: 'from-cyan-900 to-cyan-700' },
]

const FEATURES = [
  { icon: Shield, title: 'Pago Seguro', desc: 'Transacciones cifradas con tu tarjeta vinculada' },
  { icon: Truck, title: 'Envío Rápido', desc: 'Entrega en todo el país en 2 a 5 días hábiles' },
  { icon: RotateCcw, title: 'Devoluciones', desc: 'Devuelve tu producto sin complicaciones' },
  { icon: Zap, title: 'Confirmación Email', desc: 'Recibe el detalle de tu compra al instante' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <h1 style={{ color: 'red', fontSize: '40px' }}>VERSIÓN NUEVA</h1>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block bg-brand-500/10 text-brand-500 text-sm font-semibold px-3 py-1 rounded-full border border-brand-500/20 mb-6">
              E-Commerce Deportivo
            </span>
            <h1 className="font-display text-6xl md:text-8xl leading-none mb-6">
              EQUÍPATE<br />
              <span className="text-brand-500">COMPRA CON EL SENA</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              Los mejores productos deportivos, ahora disponibles en tu móvil y en la web. Regístrate y empieza a comprar hoy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary flex items-center gap-2">
                Ver productos <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn-secondary">
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="font-display text-3xl mb-8">CATEGORÍAS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(c => (
            <Link
              key={c.name}
              to={`/products?category=${c.name}`}
              className={`relative overflow-hidden bg-gradient-to-br ${c.color} rounded-2xl p-6 flex flex-col items-end justify-end gap-3 hover:scale-105 transition-transform cursor-pointer h-40`}
            >
              <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover opacity-50 rounded-2xl" />
              <span className="relative font-display text-xl text-white z-10">{c.name.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-display text-3xl mb-10 text-center">¿POR QUÉ NOSOTROS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-brand-500" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
