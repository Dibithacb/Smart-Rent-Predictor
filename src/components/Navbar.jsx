import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const navLinkClass=({isActive})=>
    `hover:text-white ${isActive ? "text-pink-600": "text-black"}` 
  return (
    <nav className='flex justify-between items-center py-10 px-12 bg-gray-400'>
      <div className='flex justify-between items-center gap-3'>
        <img className='w-10 h-10' src="./logo.png" alt="" />
        <span className='text-3xl'>HomeWorth</span>

      </div>
      <ul className='flex justify-between items-center gap-5'>
        <li><NavLink to='/' className={navLinkClass}>Home</NavLink></li>
        <li><NavLink to='/about' className={navLinkClass}>About</NavLink></li>
        <li><NavLink to='/careers' className={navLinkClass}>Careers</NavLink></li>
        <li><NavLink to='/contact' className={navLinkClass}>Contact</NavLink></li>
      </ul> 
    </nav>
  )
}

export default Navbar