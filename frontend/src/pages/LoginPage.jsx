import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Completa todos los campos')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('¡Bienvenido!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl mb-2">BIENVENIDO</h1>
          <p className="text-gray-400">Inicia sesión en tu cuenta</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Correo electrónico</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input className="input-field pl-9" placeholder="correo@ejemplo.com" type="email" value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm text-gray-400">Contraseña</label>
                <Link to="/forgot-password" className="text-xs text-brand-500 hover:underline">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input className="input-field pl-9 pr-10" placeholder="Tu contraseña" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-50">
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-brand-500 hover:underline">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}
