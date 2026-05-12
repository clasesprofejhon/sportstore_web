import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, CreditCard, Mail, User, Lock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const STEPS = ['Cuenta', 'Tarjeta', 'Confirmar']

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    cardNumber: '', cardHolder: '', expiry: '', cvv: ''
  })

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '')
    return d.length >= 2 ? d.slice(0,2) + '/' + d.slice(2,4) : d
  }

  // Detecta Amex (empieza en 34 o 37) → CVV de 4 dígitos, 15 dígitos de tarjeta
  const isAmex = () => {
    const digits = form.cardNumber.replace(/\s/g, '')
    return digits.startsWith('34') || digits.startsWith('37')
  }

  // Algoritmo de Luhn — verifica que el número de tarjeta sea matemáticamente válido
  const luhnCheck = (num) => {
    const digits = num.replace(/\s/g, '').split('').reverse().map(Number)
    const sum = digits.reduce((acc, d, i) => {
      if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9 }
      return acc + d
    }, 0)
    return sum % 10 === 0
  }

  // Valida que la tarjeta no esté vencida
  const isExpiryValid = () => {
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return false
    const [mm, yy] = form.expiry.split('/').map(Number)
    if (mm < 1 || mm > 12) return false
    const now     = new Date()
    const expDate = new Date(2000 + yy, mm - 1, 1)
    const today   = new Date(now.getFullYear(), now.getMonth(), 1)
    return expDate >= today
  }

  const validateStep0 = () => {
    if (!form.name.trim()) return toast.error('Ingresa tu nombre')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error('Email inválido')
    if (form.password.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres')
    if (form.password !== form.confirmPassword) return toast.error('Las contraseñas no coinciden')
    setStep(1)
  }

  const validateStep1 = () => {
    const rawCard   = form.cardNumber.replace(/\s/g, '')
    const amex      = isAmex()
    const expectedLen = amex ? 15 : 16
    const cvvLen    = amex ? 4 : 3

    if (rawCard.length !== expectedLen)
      return toast.error(`El número de tarjeta debe tener ${expectedLen} dígitos`)
    if (!luhnCheck(rawCard))
      return toast.error('Número de tarjeta inválido (verificación Luhn fallida)')
    if (!form.cardHolder.trim())
      return toast.error('Ingresa el nombre del titular')
    if (!isExpiryValid())
      return toast.error('La tarjeta está vencida o la fecha es inválida')
    if (!/^\d+$/.test(form.cvv) || form.cvv.length !== cvvLen)
      return toast.error(`El CVV debe tener exactamente ${cvvLen} dígitos${amex ? ' (Amex)' : ''}`)

    setStep(2)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        card: {
          last4:   form.cardNumber.replace(/\s/g, '').slice(-4),
          holder:  form.cardHolder,
          expiry:  form.expiry,
          cvv:     form.cvv,
          isAmex:  isAmex()
        }
      })
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="font-display text-4xl mb-3">¡REGISTRO EXITOSO!</h2>
          <p className="text-gray-400 mb-2">Hemos enviado un correo de confirmación a</p>
          <p className="text-brand-500 font-semibold mb-6">{form.email}</p>
          <p className="text-sm text-gray-500 mb-8">Por favor verifica tu bandeja de entrada para activar tu cuenta.</p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full">
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl mb-2">CREAR CUENTA</h1>
          <p className="text-gray-400">Únete a la comunidad deportiva</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-brand-500 text-white' :
                'bg-dark-700 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`ml-1 text-xs hidden sm:block ${i === step ? 'text-white' : 'text-gray-500'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-10 h-px mx-2 ${i < step ? 'bg-green-500' : 'bg-dark-600'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {/* Step 0 - Account info */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Nombre completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input-field pl-9" placeholder="Juan Pérez" value={form.name} onChange={set('name')} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Correo electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input-field pl-9" placeholder="correo@ejemplo.com" type="email" value={form.email} onChange={set('email')} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input-field pl-9 pr-10" placeholder="Mínimo 6 caracteres" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Confirmar contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input className="input-field pl-9" placeholder="Repite la contraseña" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} />
                </div>
              </div>
              <button onClick={validateStep0} className="btn-primary w-full mt-2">Continuar</button>
            </div>
          )}

          {/* Step 1 - Credit card */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-brand-600 to-brand-900 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-start mb-8">
                  <CreditCard size={24} className="text-white/70" />
                  <span className="text-white/60 text-sm font-mono">VISA / MC</span>
                </div>
                <p className="font-mono text-white text-lg tracking-widest mb-4">
                  {form.cardNumber || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>{form.cardHolder || 'TITULAR'}</span>
                  <span>{form.expiry || 'MM/AA'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Número de tarjeta</label>
                <input className="input-field font-mono" placeholder="0000 0000 0000 0000" value={form.cardNumber}
                  onChange={e => setForm(p => ({ ...p, cardNumber: formatCard(e.target.value) }))} maxLength={19} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Titular</label>
                <input className="input-field" placeholder="Como aparece en la tarjeta" value={form.cardHolder} onChange={set('cardHolder')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Vencimiento</label>
                  <input className="input-field font-mono" placeholder="MM/AA" value={form.expiry}
                    onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} maxLength={5} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">
                    CVV {isAmex() ? <span className="text-xs text-brand-500">(Amex: 4 dígitos)</span> : ''}
                  </label>
                  <input
                    className="input-field font-mono"
                    placeholder={isAmex() ? '••••' : '•••'}
                    type="password"
                    maxLength={isAmex() ? 4 : 3}
                    value={form.cvv}
                    onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1">Atrás</button>
                <button onClick={validateStep1} className="btn-primary flex-1">Continuar</button>
              </div>
            </div>
          )}

          {/* Step 2 - Confirm */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-3">Resumen del registro</h3>
                {[
                  ['Nombre', form.name],
                  ['Email', form.email],
                  ['Tarjeta', `•••• •••• •••• ${form.cardNumber.replace(/\s/g,'').slice(-4)}`],
                  ['Titular', form.cardHolder],
                  ['Vence', form.expiry],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-dark-700 text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 bg-dark-700 rounded-lg p-3">
                Al registrarte, recibirás un correo de confirmación. Tu tarjeta se vinculará de forma segura para futuras compras.
              </p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Atrás</button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                  {loading ? 'Registrando...' : 'Confirmar registro'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-500 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
