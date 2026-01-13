import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'



const RootLayout = () => {
   const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
   <>
   <AuthProvider>
      <Navbar onSearch={handleSearch}/>
      <main>
        <Outlet context={{ searchTerm }}/>
      </main>
      <Footer />
    </AuthProvider>
   </>
  )
}

export default RootLayout
