import React, { useState } from 'react'
import { FaSlidersH, FaTimes } from "react-icons/fa";

const Filter = ({onFilterChange}) => {
    const [filters,setFilters]=useState({
        emirate:'',
        area:'',
        bedrooms:'',
        priceRange:[0,1000000],
        type:'all',
        amenities:[]
    })

    const emirates=['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah']

    const areas={
      'Dubai':['Dubai Marina', 'Downtown Dubai', 'JBR', 'Palm Jumeirah', 'Arabian Ranches', 'Business Bay', 'JLT', 'Al Barsha'],
      'Abu Dhabi':['Corniche Area', 'Al Reem Island', 'Yas Island'],
      'Sharjah':['Al Nahda', 'Al Majaz']
    }

    const propertyTypes=['apartment', 'villa', 'townhouse', 'penthouse', 'studio']
    const amenitiesList=['pool', 'gym', 'parking', 'security', 'balcony', 'garden', 'beach', 'concierge']
    const bedroomOptions=['1', '2', '3', '4+']
    
    const handleFilterChange=(key,value)=>{
      const newFilters={...filters,[key]:value}
      setFilters(newFilters)
      onFilterChange(newFilters)
    }

    const handleAmenityToggle=(amenity)=>{
      const newAmenities=filters.amenities.includes(amenity)
      ? filters.amenities.filter(a=>a !== amenity) : [...filters.amenities,amenity]
      handleFilterChange('amenities',newAmenities)
    }

    const handlePriceChange=(min,max)=>{
      handleFilterChange('priceRange',[parseInt(min),parseInt(max)])
    }

    const clearFilters=()=>{
      const clearedFilters={
        emirate:'',
        area:'',
        bedrooms:'',
        priceRange:[0,1000000],
        type:'all',
        amenities:[]
      }
      setFilters(clearedFilters)
      onFilterChange(clearedFilters)
    }
    

  return (
    <div className='bg-white p-6 rounded-xl shadow-lg border'>
    <div>
      <h3>
        <FaSlidersH/>
        Advanced Filters
      </h3>
    </div>

    </div>
  )
}

export default Filter