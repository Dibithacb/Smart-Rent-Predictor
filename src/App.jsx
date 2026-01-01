import React from 'react'
import Properties from './components/Properties'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import RootLayout from './routes/RootLayout'
import Home from './pages/Home'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout/>}>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/about' element={<About/>}></Route>
            <Route path='/careers' element={<Careers/>}></Route>
            <Route path='/contact' element={<Contact/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
