import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'



const RootLayout = () => {
  return (
   <>
   <AuthProvider>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AuthProvider>
   </>
  )
}

export default RootLayout
