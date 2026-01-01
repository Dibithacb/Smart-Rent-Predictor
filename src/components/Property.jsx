import React from 'react'
import { NavLink } from 'react-router-dom'
import Properties from './Properties'

const Property = ({id,title,price,image1,image2,image3,image4,image5}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md
     border border-gray-300 shadow-xl rounded-2xl p-4
      flex flex-col h-auto transform hover:-translate-y-2
       hover:shadow-gray-200 transition-all duration-300 gap-2">
      <div className="w-full max-w-xs h-52 rounded-lg flex justify-center items-center overflow-hidden">
        <img src={image1} alt={title} className='object-contain' />
      </div>
      <h2>{title}</h2>
      <p>${price}</p>
      <NavLink to={`properties/${id}`}>
        <button className='bg-blue-600 rounded px-2 py-2'>View Details</button>
      </NavLink>
      
    </div>
  )
}

export default Property
