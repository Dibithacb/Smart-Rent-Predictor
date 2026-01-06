import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { propertyData } from '../data/propertyData'
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const PropertyDetails = () => {
  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [current, setCurrent] = useState(0)

  // Load property by id
  useEffect(() => {
    const data = propertyData.find(p => p.id ===id)
    if (data) {
      setProperty(data)
    }
  }, [id])

  // Reset image index when property changes
  useEffect(() => {
    setCurrent(0)
  }, [property])

  if (!property) {
    return <p className="text-center">Loading...</p>
  }

  const images = property.images || []
  const total = images.length

  const nextImage = () => {
    setCurrent(prev => (prev === total - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrent(prev => (prev === 0 ? total - 1 : prev - 1))
  }

  return (
    <div className="px-2">
      <h1 className="text-center text-2xl font-bold">
        {property.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-2">
        {/* Image Slider */}
        <div className="lg:col-span-9">
                <Carousel
          showThumbs={false}     // hides small preview images
          showStatus={false}     // hides "1 / 5"
          showIndicators={true} // shows round dots
          infiniteLoop          // loop images
          useKeyboardArrows     // left/right arrow keys
        >
          {images.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`${property.title} ${index + 1}`}
                className="w-full h-96 object-cover rounded"
              />
            </div>
          ))}
        </Carousel>
        </div>

        {/* Amenities */}
        <div className="lg:col-span-3 w-full border border-gray-200 p-3 rounded">
          <h2 className="text-center font-semibold mb-2">Amenities</h2>
          <ul className="list-disc list-inside space-y-1">
            {property.amenities?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
