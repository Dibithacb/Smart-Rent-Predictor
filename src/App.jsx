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
import AIPredictor from './components/AIPredictor'
import AdminDashboard from './components/admin/AdminDashboard'
import EditProperty from './components/admin/EditProperty'
import AddProperty from './components/admin/AddProperty'


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
          <Route path='/predictor' element={<AIPredictor/>}/>  

          {/* Auth routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Admin dashboard */}
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/edit-property/:id" element={<EditProperty/>} />
          <Route path="/admin/add-property" element={<AddProperty/>} />

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