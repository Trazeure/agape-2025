import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Map, Bus, Copy, Check, Clock, Car, Route, Calendar } from 'lucide-react';

const UbicacionEvento = () => {
  const [mapType, setMapType] = useState('openstreet');
  const [copiedCoord, setCopiedCoord] = useState('');
  const [selectedDay, setSelectedDay] = useState('viernes');

  // Ubicaciones para ambos días
  const locations = {
    viernes: {
      lat: 26.912727,
      lng: -101.410617,
      nombre: 'Iglesia De Cristo Heroes Del 47',
      direccion: 'Jiménez 638, Heroes del 47, 25740 Monclova, Coah.',
      dia: 'Viernes',
      fecha: '12 de diciembre',
      hora: '7:00 PM',
      color: 'from-purple-500 to-pink-600',
      colorHover: 'from-purple-600 to-pink-700',
      bgGradient: 'from-purple-50 via-pink-50 to-purple-50',
      iconBg: 'bg-purple-500',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-500'
    },
    sabado: {
      lat: 26.935114,
      lng: -101.413816,
      nombre: 'Sección 38',
      direccion: 'Mar Adriático, Santa Isabel, 25732 Monclova, Coah.',
      dia: 'Sábado',
      fecha: '13 de diciembre',
      hora: '6:00 PM',
      color: 'from-blue-500 to-indigo-600',
      colorHover: 'from-blue-600 to-indigo-700',
      bgGradient: 'from-blue-50 via-indigo-50 to-blue-50',
      iconBg: 'bg-blue-500',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-500'
    }
  };

  const eventoLocation = locations[selectedDay];
  const d = 0.01;

  const mapProviders = {
    openstreet: {
      name: 'OpenStreetMap',
      shortName: 'OSM',
      url: `https://www.openstreetmap.org/export/embed.html?bbox=${eventoLocation.lng - d},${eventoLocation.lat - d},${eventoLocation.lng + d},${eventoLocation.lat + d}&layer=mapnik&marker=${eventoLocation.lat},${eventoLocation.lng}`,
      icon: '🗺️'
    },
    google: {
      name: 'Google Maps',
      shortName: 'Google',
      url: `https://maps.google.com/maps?q=${eventoLocation.lat},${eventoLocation.lng}&hl=es&z=16&output=embed`,
      icon: '🌎'
    },
    bing: {
      name: 'Bing Maps',
      shortName: 'Bing',
      url: `https://www.bing.com/maps/embed?h=400&w=500&cp=${eventoLocation.lat}~${eventoLocation.lng}&lvl=16&typ=d&sty=r&src=SHELL&FORM=MBEDV8`,
      icon: '🗺️'
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
    <section id="ubicacion" className="relative py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden">
      {/* Elementos decorativos de fondo - Más sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${eventoLocation.color} opacity-10 rounded-full blur-3xl transition-all duration-1000`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br ${eventoLocation.color} opacity-10 rounded-full blur-3xl transition-all duration-1000`}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header mejorado con animaciones */}
        <div className="text-center mb-12 sm:mb-16">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${eventoLocation.color} rounded-3xl mb-6 shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500`}>
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            ¿Cómo llegar?
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
            Elige el día y descubre la ubicación del evento
          </p>
          
          {/* Selector de día - Diseño mejorado y más atractivo */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-4">
            <button
              onClick={() => setSelectedDay('viernes')}
              className={`group relative px-6 sm:px-8 py-5 rounded-2xl font-bold transition-all duration-500 transform ${
                selectedDay === 'viernes'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl scale-105 -translate-y-1'
                  : 'bg-white text-gray-600 hover:shadow-xl border-2 border-gray-200 hover:border-purple-300 hover:-translate-y-1'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Calendar className={`w-5 h-5 mx-auto mb-2 ${selectedDay === 'viernes' ? 'text-white' : 'text-purple-500'}`} />
              <div className="text-base sm:text-lg font-bold">Viernes</div>
              <div className="text-xs sm:text-sm opacity-90 mt-1">12 de diciembre</div>
            </button>
            
            <button
              onClick={() => setSelectedDay('sabado')}
              className={`group relative px-6 sm:px-8 py-5 rounded-2xl font-bold transition-all duration-500 transform ${
                selectedDay === 'sabado'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl scale-105 -translate-y-1'
                  : 'bg-white text-gray-600 hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 hover:-translate-y-1'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Calendar className={`w-5 h-5 mx-auto mb-2 ${selectedDay === 'sabado' ? 'text-white' : 'text-blue-500'}`} />
              <div className="text-base sm:text-lg font-bold">Sábado</div>
              <div className="text-xs sm:text-sm opacity-90 mt-1">13 de diciembre</div>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Columna izquierda - Información (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card principal de ubicación - Rediseñado */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500">
              {/* Header con gradiente */}
              <div className={`bg-gradient-to-r ${eventoLocation.color} p-6 sm:p-8`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold`}>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  {eventoLocation.nombre}
                </h3>
                <p className="text-white/90 text-sm sm:text-base">
                  {eventoLocation.dia}, {eventoLocation.fecha}
                </p>
              </div>

              {/* Contenido */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-12 h-12 ${eventoLocation.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Dirección</p>
                    <p className="text-gray-600 text-sm">{eventoLocation.direccion}</p>
                  </div>
                </div>

                {/* Coordenadas GPS - Rediseñado */}
                <div className={`bg-gradient-to-br ${eventoLocation.bgGradient} rounded-2xl p-5 mb-6 ${eventoLocation.borderColor} border-2`}>
                  <h5 className="font-bold text-gray-800 mb-4 flex items-center">
                    <Map className={`w-5 h-5 mr-2 ${eventoLocation.textColor}`} />
                    Coordenadas GPS
                  </h5>
                  
                  <div className="space-y-3">
                    {/* Latitud */}
                    <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex-1">
                        <span className="text-gray-500 text-xs font-medium block mb-1">Latitud</span>
                        <span className="font-mono text-gray-800 font-semibold text-sm">
                          {eventoLocation.lat}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(eventoLocation.lat.toString(), 'lat')}
                        className={`flex items-center space-x-1 px-3 py-2 text-xs ${eventoLocation.iconBg} text-white rounded-lg hover:opacity-90 transition-all duration-200`}
                      >
                        {copiedCoord === 'lat' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCoord === 'lat' ? '¡Listo!' : 'Copiar'}</span>
                      </button>
                    </div>

                    {/* Longitud */}
                    <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex-1">
                        <span className="text-gray-500 text-xs font-medium block mb-1">Longitud</span>
                        <span className="font-mono text-gray-800 font-semibold text-sm">
                          {eventoLocation.lng}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(eventoLocation.lng.toString(), 'lng')}
                        className={`flex items-center space-x-1 px-3 py-2 text-xs ${eventoLocation.iconBg} text-white rounded-lg hover:opacity-90 transition-all duration-200`}
                      >
                        {copiedCoord === 'lng' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCoord === 'lng' ? '¡Listo!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Copiar ambas */}
                  <button
                    onClick={() => copyToClipboard(`${eventoLocation.lat}, ${eventoLocation.lng}`, 'both')}
                    className={`w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${eventoLocation.color} text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200`}
                  >
                    {copiedCoord === 'both' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCoord === 'both' ? '¡Coordenadas copiadas!' : 'Copiar coordenadas completas'}</span>
                  </button>
                </div>

                {/* Botones de navegación - Grid mejorado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={openDirections}
                    className={`group flex items-center justify-center space-x-3 px-5 py-4 bg-gradient-to-r ${eventoLocation.color} text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300`}
                  >
                    <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Google Maps</span>
                  </button>
                  <button
                    onClick={openInWaze}
                    className="group flex items-center justify-center space-x-3 px-5 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <Route className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Waze</span>
                  </button>
                  <button
                    onClick={openInAppleMaps}
                    className="group flex items-center justify-center space-x-3 px-5 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-gray-300 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Apple Maps</span>
                  </button>
                  <button
                    onClick={openInGoogleMaps}
                    className="group flex items-center justify-center space-x-3 px-5 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-gray-300 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Ver en web</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tips de transporte - Rediseñado */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg">
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                  <Bus className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Información útil</h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 bg-white rounded-xl p-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">En automóvil</p>
                    <p className="text-gray-600 text-xs">Estacionamiento disponible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white rounded-xl p-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bus className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Transporte público</p>
                    <p className="text-gray-600 text-xs">Rutas cerca del lugar</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white rounded-xl p-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Llegada sugerida</p>
                    <p className="text-gray-600 text-xs">30 min antes del evento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white rounded-xl p-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">GPS recomendado</p>
                    <p className="text-gray-600 text-xs">Usa las coordenadas arriba</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Mapa (1/3) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-white rounded-3xl shadow-2xl p-4 border border-gray-100">
              {/* Selector de proveedor mejorado */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {Object.entries(mapProviders).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => setMapType(key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
                      mapType === key 
                        ? `bg-gradient-to-r ${eventoLocation.color} text-white shadow-lg` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{provider.icon}</span>
                    <span className="hidden sm:inline">{provider.name}</span>
                    <span className="sm:hidden">{provider.shortName}</span>
                  </button>
                ))}
              </div>

              {/* Mapa embebido */}
              <div className="w-full h-72 sm:h-80 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-200 relative shadow-inner">
                <iframe
                  key={`${selectedDay}-${mapType}`}
                  src={mapProviders[mapType].url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa - ${eventoLocation.nombre}`}
                  className="absolute inset-0"
                />
                <div className={`absolute top-3 left-3 bg-gradient-to-r ${eventoLocation.color} text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-lg`}>
                  📍 {eventoLocation.dia}
                </div>
              </div>

              {/* Info del mapa */}
              <div className="p-4">
                <div className={`bg-gradient-to-r ${eventoLocation.bgGradient} rounded-xl p-3 text-center`}>
                  <p className="font-semibold text-gray-700 text-sm">{mapProviders[mapType].name}</p>
                  <p className="text-gray-500 text-xs">Zoom nivel 16</p>
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