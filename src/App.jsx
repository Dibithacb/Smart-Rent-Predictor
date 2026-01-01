import React from 'react'
import Properties from './components/Properties'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import RootLayout from './routes/RootLayout'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout/>}>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
