import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Map, Bus, Copy, Check, Clock, Car, Route } from 'lucide-react';

const UbicacionEvento = () => {
  const [mapType, setMapType] = useState('openstreet');
  const [copiedCoord, setCopiedCoord] = useState('');

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
      shortName: 'OSM',
      url: `https://www.openstreetmap.org/export/embed.html?bbox=${eventoLocation.lng - d},${eventoLocation.lat - d},${eventoLocation.lng + d},${eventoLocation.lat + d}&layer=mapnik&marker=${eventoLocation.lat},${eventoLocation.lng}`,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500'
    },
    google: {
      name: 'Google Maps',
      shortName: 'Google',
      url: `https://maps.google.com/maps?q=${eventoLocation.lat},${eventoLocation.lng}&hl=es&z=16&output=embed`,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500'
    },
    bing: {
      name: 'Bing Maps',
      shortName: 'Bing',
      url: `https://www.bing.com/maps/embed?h=400&w=500&cp=${eventoLocation.lat}~${eventoLocation.lng}&lvl=16&typ=d&sty=r&src=SHELL&FORM=MBEDV8`,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500'
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCoord(type);
      setTimeout(() => setCopiedCoord(''), 2000);
    });
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
    <section id="ubicacion" className="relative py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header mejorado */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            ¿Cómo llegar?
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Te esperamos en el <span className="font-semibold text-blue-600">{eventoLocation.nombre}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Columna izquierda - Información (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Card principal de ubicación */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                    {eventoLocation.nombre}
                  </h4>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base leading-relaxed">{eventoLocation.direccion}</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-500 text-xs sm:text-sm">Monclova, Coahuila, México</p>
                  </div>
                </div>
              </div>

              {/* Coordenadas GPS - Mejorado para móvil */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-4 sm:p-6 mb-6 border border-gray-100">
                <h5 className="font-bold text-gray-800 mb-4 flex items-center text-sm sm:text-base">
                  <Map className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Coordenadas GPS
                </h5>
                
                {/* Layout responsive para coordenadas */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Latitud */}
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center mb-2 xs:mb-0">
                      <span className="text-gray-500 text-xs sm:text-sm font-medium">Latitud:</span>
                      <span className="font-mono ml-2 text-gray-800 text-sm sm:text-base font-semibold break-all">
                        {eventoLocation.lat}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(eventoLocation.lat.toString(), 'lat')}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-all duration-200 self-start xs:self-center"
                    >
                      {copiedCoord === 'lat' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCoord === 'lat' ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {/* Longitud */}
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center mb-2 xs:mb-0">
                      <span className="text-gray-500 text-xs sm:text-sm font-medium">Longitud:</span>
                      <span className="font-mono ml-2 text-gray-800 text-sm sm:text-base font-semibold break-all">
                        {eventoLocation.lng}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(eventoLocation.lng.toString(), 'lng')}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-all duration-200 self-start xs:self-center"
                    >
                      {copiedCoord === 'lng' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCoord === 'lng' ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* Botón para copiar coordenadas completas */}
                <button
                  onClick={() => copyToClipboard(`${eventoLocation.lat}, ${eventoLocation.lng}`, 'both')}
                  className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  {copiedCoord === 'both' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCoord === 'both' ? '¡Coordenadas copiadas!' : 'Copiar coordenadas completas'}</span>
                </button>
              </div>

              {/* Botones de navegación - Grid responsivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={openDirections}
                  className="flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
                >
                  <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Ir con Google Maps</span>
                </button>
                <button
                  onClick={openInWaze}
                  className="flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
                >
                  <Route className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>Navegar con Waze</span>
                </button>
                <button
                  onClick={openInAppleMaps}
                  className="flex items-center justify-center space-x-3 px-4 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 group"
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Apple Maps</span>
                </button>
                <button
                  onClick={openInGoogleMaps}
                  className="flex items-center justify-center space-x-3 px-4 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 group"
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Ver en navegador</span>
                </button>
              </div>
            </div>

            {/* Tips de transporte - Rediseñado */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg">
              <h5 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                  <Bus className="w-4 h-4 text-white" />
                </div>
                Información útil
              </h5>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Car className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">En automóvil</p>
                    <p className="text-gray-600 text-xs">Estacionamiento disponible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bus className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Transporte público</p>
                    <p className="text-gray-600 text-xs">Varias rutas cerca del centro</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Llegada</p>
                    <p className="text-gray-600 text-xs">30 minutos antes del evento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Navigation className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">GPS</p>
                    <p className="text-gray-600 text-xs">Copia las coordenadas arriba</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Mapa (2/5) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-3 sm:p-4 border border-white/20">
              {/* Selector de proveedor mejorado */}
              <div className="flex flex-wrap justify-center gap-2 mb-4 p-2">
                {Object.entries(mapProviders).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => setMapType(key)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
                      mapType === key 
                        ? `bg-gradient-to-r ${provider.color} text-white shadow-lg` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="hidden sm:inline">{provider.name}</span>
                    <span className="sm:hidden">{provider.shortName}</span>
                  </button>
                ))}
              </div>

              {/* Mapa embebido */}
              <div className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] rounded-2xl overflow-hidden bg-gray-200 relative shadow-inner">
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
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
                  📍 {mapProviders[mapType].shortName || mapProviders[mapType].name}
                </div>
              </div>

              {/* Info del mapa - Más compacta */}
              <div className="p-3 sm:p-4">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Proveedor activo</p>
                    <p className="text-gray-500">{mapProviders[mapType].name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">Zoom</p>
                    <p className="text-gray-500">Nivel 16</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UbicacionEvento;