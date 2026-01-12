import React from 'react'
import { NavLink } from 'react-router-dom'


const Property = ({property}) => {
  if(!property || !property.images || property.images.length === 0){
    return null;
  }
  return (
    <div className="bg-white/90 backdrop-blur-md
     border border-gray-300 shadow-xl rounded-2xl p-4
      flex flex-col h-auto transform hover:-translate-y-2
       hover:shadow-gray-200 transition-all duration-300 gap-2">
      <div className="w-full max-w-xs h-52 rounded-lg flex justify-center items-center overflow-hidden">
        <img src={property.images[0]} alt={property.title} className='object-contain' />
      </div>
      <h2>{property.title}</h2>
      <p>${property.price}</p>
      <NavLink to={`properties/${property.id}`}>
        <button className='bg-blue-600 rounded px-2 py-2'>View Details</button>
      </NavLink>
      
    </div>
  )
}

export default Property
