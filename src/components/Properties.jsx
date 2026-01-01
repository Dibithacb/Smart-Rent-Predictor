import React from 'react'
import { productData } from '../data/propertyData'
import Property from './Property'

const Properties = () => {
  return (
    <div>
      {productData.map((p)=>(
        <Property key={p.id}
        id={p.id}
        title={p.title}
        price={p.price}
        image1={p.images[0]}
        image2={p.images[1]}
        image3={p.images[2]}
        image4={p.images[3]}
        image5={p.images[4]}
        predicted_rent={p.predicted_rent}
        />
  
      ))}
    </div>
  )
}

export default Properties
