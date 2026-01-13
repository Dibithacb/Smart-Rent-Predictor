import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Properties from './components/Properties'
import RootLayout from './routes/RootLayout'
import Home from './pages/Home'
import ProperyDetails from './components/ProperyDetails'
import MapPage from './components/MapPage'
import ComparisonTool from './components/ComparisonTool'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Favorites from './components/Favorites'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/properties' element={<Properties />} />
          <Route path='/properties/:id' element={<ProperyDetails />} />
          <Route path="/map" element={<MapPage />} />
          <Route path='/compare' element={<ComparisonTool />} />

          {/* Auth routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Require Login */}
          <Route path='/favorites' element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App