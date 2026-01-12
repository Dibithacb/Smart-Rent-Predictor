import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet - REMOVE ALL require() statements
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  // Use CDN URLs or import the images directly
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const MapView = ({ properties = [], onPropertySelect }) => {
  const safeProperties = properties || []
  const center = [25.2048, 55.2708] // UAE center
  
  // Custom icon colors based on property type
  const getIconColor = (type) => {
    switch(type) {
      case 'villa': return 'bg-green-500 border-green-600'
      case 'apartment': return 'bg-blue-500 border-blue-600'
      case 'penthouse': return 'bg-purple-500 border-purple-600'
      case 'townhouse': return 'bg-yellow-500 border-yellow-600'
      default: return 'bg-red-500 border-red-600'
    }
  }

  const createCustomIcon = (type) => {
    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-8 h-8 ${getIconColor(type)} rounded-full border-2 flex items-center justify-center text-white font-bold shadow-lg">
            ${type === 'villa' ? 'V' : type === 'apartment' ? 'A' : type === 'penthouse' ? 'P' : 'T'}
          </div>
          <div class="w-4 h-4 ${getIconColor(type)} transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })
  }

  // Show loading state if properties is undefined/null
  if (!properties) {
    return (
      <div className="h-150 w-full rounded-xl overflow-hidden shadow-xl relative flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-150 w-full rounded-xl overflow-hidden shadow-xl relative">
      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {safeProperties.length === 0 ? (
          // Show message when no properties
          <div className="leaflet-control leaflet-top leaflet-right">
            <div className="leaflet-control-attribution bg-white p-2 rounded shadow">
              No properties to display
            </div>
          </div>
        ) : (
          // Map over properties only if array exists and has items
          safeProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.location.lat, property.location.lng]}
              icon={createCustomIcon(property.type)}
              eventHandlers={{
                click: () => onPropertySelect?.(property),
              }}
            >
              <Popup>
                <div className="p-2 min-w-62.5">
                  <img 
                    src={property.images?.[0] || 'https://via.placeholder.com/250x150'} 
                    alt={property.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-lg mb-1">{property.title}</h3>
                  <p className="text-blue-600 font-bold text-xl mb-2">
                    AED {property.price?.toLocaleString() || 'N/A'}/year
                  </p>
                  <div className="text-gray-600 text-sm mb-3">
                    <span className="block">{property.location?.area}, {property.location?.emirate}</span>
                    <span className="flex items-center mt-1">
                      <span className="mr-3">🛏️ {property.bedrooms || 0}</span>
                      <span className="mr-3">🚿 {property.bathrooms || 0}</span>
                      <span>⭐ {property.rating || 0}</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/properties/${property.id}`}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-1000">
        <h4 className="font-bold mb-2">Property Types</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Apartments</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Villas</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm">Penthouses</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Townhouses</span>
          </div>
        </div>
        
        {/* Property Count */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Showing: <span className="font-bold">{safeProperties.length}</span> properties
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView