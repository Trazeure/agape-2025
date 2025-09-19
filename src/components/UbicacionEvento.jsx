import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Map, Bus } from 'lucide-react';

const UbicacionEvento = () => {
  const [mapType, setMapType] = useState('openstreet');

  // Gimnasio y Auditorio Salvador Kamar — coords correctas
  const eventoLocation = {
    lat: 26.9161119,
    lng: -101.3912451,
    nombre: 'Gimnasio y Auditorio Salvador Kamar',
    direccion: 'C. 34 1422, Tierra y Libertad Ampliación, 25740 Monclova, Coah.',
    telefono: '' // opcional
  };

  // delta para el bbox de OpenStreetMap (zoom aproximado)
  const d = 0.01;

  const mapProviders = {
    openstreet: {
      name: 'OpenStreetMap',
      url: `https://www.openstreetmap.org/export/embed.html?bbox=${eventoLocation.lng - d},${eventoLocation.lat - d},${eventoLocation.lng + d},${eventoLocation.lat + d}&layer=mapnik&marker=${eventoLocation.lat},${eventoLocation.lng}`,
      color: 'bg-green-500'
    },
    google: {
      name: 'Google Maps (iframe)',
      url: `https://maps.google.com/maps?q=${eventoLocation.lat},${eventoLocation.lng}&hl=es&z=16&output=embed`,
      color: 'bg-blue-500'
    },
    bing: {
      name: 'Bing Maps',
      url: `https://www.bing.com/maps/embed?h=400&w=500&cp=${eventoLocation.lat}~${eventoLocation.lng}&lvl=16&typ=d&sty=r&src=SHELL&FORM=MBEDV8`,
      color: 'bg-orange-500'
    }
  };

  const openInGoogleMaps = () =>
    window.open(`https://www.google.com/maps?q=${eventoLocation.lat},${eventoLocation.lng}`, '_blank');

  const openDirections = () =>
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${eventoLocation.lat},${eventoLocation.lng}`, '_blank');

  const openInWaze = () =>
    window.open(`https://waze.com/ul?ll=${eventoLocation.lat},${eventoLocation.lng}&navigate=yes`, '_blank');

  const openInAppleMaps = () =>
    window.open(`https://maps.apple.com/?q=${eventoLocation.lat},${eventoLocation.lng}`, '_blank');

  return (
    <section id="ubicacion" className="relative z-20 py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">¿Cómo llegar?</h3>
          <p className="text-xl text-gray-600 mb-8">Te esperamos en el {eventoLocation.nombre}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Información */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{eventoLocation.nombre}</h4>
                  <p className="text-gray-600 mb-1">{eventoLocation.direccion}</p>
                  <p className="text-gray-500 text-sm">Monclova, Coahuila, México</p>
                </div>
              </div>

              {/* Coordenadas exactas */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Map className="w-4 h-4 mr-2" />
                  Coordenadas GPS
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Latitud:</span>
                    <span className="font-mono ml-2 text-gray-800">{eventoLocation.lat}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Longitud:</span>
                    <span className="font-mono ml-2 text-gray-800">{eventoLocation.lng}</span>
                  </div>
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={openDirections}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps</span>
                </button>
                <button
                  onClick={openInWaze}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Waze</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openInAppleMaps}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Apple Maps</span>
                </button>
                <button
                  onClick={openInGoogleMaps}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver en Web</span>
                </button>
              </div>
            </div>

            {/* Tips de transporte */}
            <div className="mt-6 bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Bus className="w-5 h-5 mr-2 text-yellow-600" />
                Recomendaciones
              </h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Llegando en auto: Estacionamiento disponible
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Transporte público: Varias rutas pasan cerca del centro
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Te recomendamos llegar 30 minutos antes del evento
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Puedes copiar las coordenadas GPS para tu navegador
                </li>
              </ul>
            </div>
          </div>

          {/* Columna derecha - Mapa */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl shadow-xl p-2 border border-gray-100">
              {/* Selector de proveedor */}
              <div className="flex justify-center space-x-2 mb-4 p-4">
                {Object.entries(mapProviders).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => setMapType(key)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      mapType === key ? `${provider.color} text-white shadow-md` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>

              {/* Mapa embebido */}
              <div className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-200 relative">
                <iframe
                  src={mapProviders[mapType].url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ubicación - ${mapProviders[mapType].name}`}
                  className="absolute inset-0"
                />
              </div>

              {/* Info del mapa */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Proveedor actual</p>
                    <p className="text-xs text-gray-500">{mapProviders[mapType].name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">Zoom nivel</p>
                    <p className="text-xs text-gray-500">16 (detallado)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* fin columna mapa */}
        </div>
      </div>
    </section>
  );
};

export default UbicacionEvento;
