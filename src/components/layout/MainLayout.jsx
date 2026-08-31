import { Outlet } from 'react-router-dom'
import Navbar from './navbar/Navbars'
import Footer from './footer/Footer'
import CartPanel from '../cart/CartPanel'

function MainLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <CartPanel />
    </>
  )
}

export default MainLayout