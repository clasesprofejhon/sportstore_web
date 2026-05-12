import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'

function Footer() {
  return (
    <footer className="border-t border-dark-700 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
        <p className="font-display text-2xl text-dark-600 mb-2">SPORTSTORE</p>
        <p>© {new Date().getFullYear()} SportStore · Plataforma E-Commerce Deportiva</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"         element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/cart"     element={<CartPage />} />
              <Route path="/orders"   element={<OrdersPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e1e1e', color: '#fff', border: '1px solid #2a2a2a' },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  )
}
