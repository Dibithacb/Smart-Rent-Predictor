import React from 'react'
import { propertyData } from '../data/propertyData'
import Property from './Property'
import Filter from './Filter'

const Properties = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-4'>
      {propertyData.map((p)=>(
        <Property key={p.id}
        property={p}
        
        />
  
      ))}
    </div>
  )
}

export default Properties
