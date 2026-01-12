import React from 'react'
import Properties from './components/Properties'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import RootLayout from './routes/RootLayout'
import Home from './pages/Home'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import ProperyDetails from './components/ProperyDetails'
import MapView from './components/MapView'
import MapPage from './components/MapPage'
import ComparisonTool from './components/ComparisonTool'





const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout/>}>
            <Route path='/' element={<Home/>}/>
            {/* <Route path='/about' element={<About/>}></Route>
            <Route path='/careers' element={<Careers/>}></Route>
            <Route path='/contact' element={<Contact/>}></Route> */}
            <Route path='/properties' element={<Properties/>}/>
            <Route path='/properties/:id' element={<ProperyDetails/>}/>
            <Route path="/map" element={<MapPage />} />
            <Route path='/compare' element={<ComparisonTool/>}></Route>
            
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
