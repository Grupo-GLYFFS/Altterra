import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { CartProvider } from './context/CartContext.jsx'

import './styles/variables.css'
import './styles/reset.css'
import './styles/utilities.css'
import './styles/components.css'
import './styles/cart.css'

import './styles/pages/how-it-works-page.css'
import './styles/pages/login-page.css'
import './styles/pages/product-page.css'
import './styles/pages/register-page.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/Altterra">
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)



