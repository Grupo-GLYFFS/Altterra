import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage'
import HowItWorksPage from './pages/HowItWorksPage'
import ProductPage from './pages/ProductPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'

import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

function App() {
  return (
    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/product" element={<Navigate to="/product/tomate-carmem" replace />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pedidos" element={<OrdersPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

    </Routes>
  )
}

export default App