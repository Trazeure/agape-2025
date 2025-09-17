import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Music, Heart, FileMusic, X, Download, Maximize2 } from 'lucide-react';

const AudiosHimnos = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [volumes, setVolumes] = useState({});
  const [currentTimes, setCurrentTimes] = useState({});
  const [durations, setDurations] = useState({});
  const [scoreOpenFor, setScoreOpenFor] = useState(null);
  const audioRefs = useRef({});

  // === SOLO TUS 4 HIMNOS ===
  const himnos = [
    {
      id: 101,
      titulo: "Identidad",
      artista: "Luis Ángel Salazar Reyes",
      audioUrl: "/audios/identidad.mp3",
      partituraUrl: "/partituras/Identidad.pdf",
      color: "from-indigo-400 to-indigo-600",
      shadowColor: "shadow-indigo-200",
      description: "Un himno de reflexión sobre nuestra identidad en Cristo"
    },
    {
      id: 102,
      titulo: "Mi Esperanza En Ti",
      artista: "Stephanie Salazar Araujo / Luis Ángel Salazar Reyes",
      audioUrl: "/audios/mi-esperanza-en-ti.mp3",
      partituraUrl: "/partituras/Mi-Esperanza-En-Ti.pdf",
      color: "from-emerald-400 to-emerald-600",
      shadowColor: "shadow-emerald-200",
      description: "Una declaración de fe y esperanza en tiempos difíciles"
    },
    {
      id: 103,
      titulo: "Bástame Tu Gracia",
      artista: "Luis Ángel Salazar Reyes",
      audioUrl: "/audios/bastame-tu-gracia.mp3",
      partituraUrl: "/partituras/Bastame-Tu-Gracia.pdf",
      color: "from-rose-400 to-rose-600",
      shadowColor: "shadow-rose-200",
      description: "Sobre la suficiencia de la gracia divina en nuestra vida"
    },
    {
      id: 104,
      titulo: "Un Propósito Te Dio",
      artista: "Adriel Ferrel (2021)",
      audioUrl: "/audios/un-proposito-te-dio.mp3",
      partituraUrl: "/partituras/Un-Proposito-Te-Dio.pdf",
      color: "from-amber-400 to-orange-600",
      shadowColor: "shadow-amber-200",
      description: "Descubre el propósito que Dios tiene para tu vida"
    },
  ];

  // Inicializar volúmenes
  useEffect(() => {
    const initialVolumes = {};
    himnos.forEach(h => { initialVolumes[h.id] = 70; });
    setVolumes(initialVolumes);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  const [pdfError, setPdfError] = useState({});

  // Detectar móvil una sola vez al cargar
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (scoreOpenFor) {
      document.body.style.overflow = 'hidden';
      // Resetear el error cuando se abre un nuevo modal
      setPdfError(prev => ({ ...prev, [scoreOpenFor]: false }));
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [scoreOpenFor]);

  // Manejar error de PDF
  const handlePdfError = (himnoId) => {
    setPdfError(prev => ({ ...prev, [himnoId]: true }));
  };

  // Control de reproducción
  const togglePlay = (himnoId) => {
    const audio = audioRefs.current[himnoId];
    if (!audio) return;

    if (currentlyPlaying === himnoId) {
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying) {
        const currentAudio = audioRefs.current[currentlyPlaying];
        if (currentAudio) currentAudio.pause();
      }
      audio.play();
      setCurrentlyPlaying(himnoId);
    }
  };

  // Volumen
  const handleVolumeChange = (himnoId, volume) => {
    const audio = audioRefs.current[himnoId];
    if (audio) {
      audio.volume = volume / 100;
      setVolumes(prev => ({ ...prev, [himnoId]: volume }));
    }
  };

  // Tiempo
  const updateTime = (himnoId) => {
    const audio = audioRefs.current[himnoId];
    if (audio) {
      setCurrentTimes(p => ({ ...p, [himnoId]: audio.currentTime }));
      setDurations(p => ({ ...p, [himnoId]: audio.duration }));
    }
  };

  // Barra de progreso
  const handleProgressChange = (himnoId, value) => {
    const audio = audioRefs.current[himnoId];
    if (audio && durations[himnoId]) {
      audio.currentTime = (value / 100) * durations[himnoId];
    }
  };

  // Formatear mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentHimno = himnos.find(h => h.id === scoreOpenFor);

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50">
      <div className="container mx-auto max-w-7xl">
        {/* Header mejorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl mb-8 shadow-2xl">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Audios de Himnos
          </h3>
          <p className="text-2xl text-gray-600 mb-6 font-light">
            Himnos de anteriores ediciones
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto shadow-xl border border-white/50">
            <p className="text-gray-700 font-semibold flex items-center justify-center text-lg">
              <Heart className="w-6 h-6 text-red-500 mr-3 animate-pulse" />
              "Cantad alegres a Dios" - Salmos 66:1
            </p>
          </div>
        </div>

        {/* Grid mejorado */}
        <div className="grid lg:grid-cols-2 gap-8">
          {himnos.map((himno) => (
            <div key={himno.id} 
                 className={`group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 ${himno.shadowColor}`}>
              
              {/* Header del himno mejorado */}
              <div className={`bg-gradient-to-br ${himno.color} p-8 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold mb-2">{himno.titulo}</h4>
                  <p className="text-white/90 text-base mb-3">{himno.artista}</p>
                  <p className="text-white/80 text-sm italic">{himno.description}</p>
                </div>
              </div>

              {/* Reproductor mejorado */}
              <div className="p-8">
                <audio
                  ref={(el) => (audioRefs.current[himno.id] = el)}
                  src={himno.audioUrl}
                  onTimeUpdate={() => updateTime(himno.id)}
                  onLoadedMetadata={() => updateTime(himno.id)}
                  onEnded={() => setCurrentlyPlaying(null)}
                  preload="metadata"
                />

                {/* Controles principales mejorados */}
                <div className="flex items-center space-x-5 mb-6">
                  <button
                    onClick={() => togglePlay(himno.id)}
                    className={`group relative w-16 h-16 rounded-full bg-gradient-to-br ${himno.color} text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95`}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {currentlyPlaying === himno.id ? 
                      <Pause className="w-7 h-7 relative z-10" /> : 
                      <Play className="w-7 h-7 ml-1 relative z-10" />
                    }
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                      <span>{formatTime(currentTimes[himno.id] || 0)}</span>
                      <span>{formatTime(durations[himno.id] || 0)}</span>
                    </div>
                    <div className="relative group">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={durations[himno.id] ? (currentTimes[himno.id] / durations[himno.id]) * 100 : 0}
                        onChange={(e) => handleProgressChange(himno.id, Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider-progress group-hover:h-4 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Volumen mejorado */}
                <div className="flex items-center space-x-4 mb-6">
                  <Volume2 className="w-6 h-6 text-gray-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volumes[himno.id] || 70}
                    onChange={(e) => handleVolumeChange(himno.id, Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider-volume"
                  />
                  <span className="text-sm font-semibold text-gray-600 min-w-[3rem] bg-gray-100 px-2 py-1 rounded-lg">
                    {volumes[himno.id] || 70}%
                  </span>
                </div>

                {/* Botón de partitura mejorado */}
                {himno.partituraUrl && (
                  <button
                    onClick={() => setScoreOpenFor(himno.id)}
                    className={`w-full py-4 rounded-2xl border-2 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 group bg-gradient-to-r ${himno.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0`}
                  >
                    <FileMusic className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span>Ver Partitura</span>
                    <Maximize2 className="w-5 h-5 opacity-70" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional mejorada */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-100/80 via-purple-100/80 to-indigo-100/80 backdrop-blur-sm rounded-3xl p-10 max-w-4xl mx-auto shadow-xl border border-white/50">
            <h5 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
              <Music className="w-7 h-7 mr-3 text-blue-600" />
              Disfruta estos himnos durante tu tiempo de reflexión
            </h5>
          </div>
        </div>
      </div>

      {/* Modal de Partitura Completamente Rediseñado */}
      {scoreOpenFor && currentHimno && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-6xl h-full max-h-[95vh] sm:max-h-[90vh] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header del modal mejorado */}
            <div className={`bg-gradient-to-r ${currentHimno.color} p-4 sm:p-6 text-white flex items-center justify-between relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10 flex-1 min-w-0 mr-4">
                <h4 className="font-bold text-lg sm:text-xl mb-1 truncate">
                  {currentHimno.titulo}
                </h4>
                <p className="text-white/90 text-sm truncate">
                  {currentHimno.artista}
                </p>
              </div>
              
              <div className="relative z-10 flex items-center space-x-2">
                {/* Botón de descarga */}
                <a
                  href={currentHimno.partituraUrl}
                  download
                  className="hidden sm:flex p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 items-center justify-center group"
                  title="Descargar PDF"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </a>
                
                {/* Botón de cerrar mejorado */}
                <button
                  onClick={() => setScoreOpenFor(null)}
                  className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 group"
                  aria-label="Cerrar partitura"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Contenido del PDF - Método confiable para móviles */}
            <div className="flex-1 relative bg-gray-50">
              <div className="absolute inset-0 p-0 sm:p-4">
                <div className="w-full h-full bg-white rounded-none sm:rounded-2xl overflow-hidden shadow-inner">
                  
                  {!pdfError[currentHimno.id] ? (
                    /* PDF usando métodos más confiables */
                    <>
                      {isMobile ? (
                        /* Para móviles: PDF.js es MÁS CONFIABLE */
                        <iframe
                          src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(window.location.origin + currentHimno.partituraUrl)}`}
                          className="w-full h-full border-0"
                          title={`Partitura de ${currentHimno.titulo}`}
                          onError={() => {
                            // Si PDF.js falla, intentar con Google Docs
                            const googleViewer = `https://docs.google.com/gview?url=${encodeURIComponent(window.location.origin + currentHimno.partituraUrl)}&embedded=true`;
                            const iframe = document.querySelector(`iframe[title="Partitura de ${currentHimno.titulo}"]`);
                            if (iframe) {
                              iframe.src = googleViewer;
                            }
                            // Si después de 5 segundos no funciona, mostrar fallback
                            setTimeout(() => handlePdfError(currentHimno.id), 5000);
                          }}
                          onLoad={() => {
                            // Ocultar el spinner cuando carga
                            setTimeout(() => {
                              const spinner = document.getElementById(`loading-${currentHimno.id}`);
                              if (spinner) spinner.style.display = 'none';
                            }, 1000);
                          }}
                        />
                      ) : (
                        /* Para escritorio: método tradicional */
                        <object
                          data={`${currentHimno.partituraUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                          type="application/pdf"
                          className="w-full h-full"
                          onError={() => handlePdfError(currentHimno.id)}
                        >
                          <div className="w-full h-full flex items-center justify-center p-8">
                            <button
                              onClick={() => handlePdfError(currentHimno.id)}
                              className={`py-4 px-6 bg-gradient-to-r ${currentHimno.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2`}
                            >
                              <FileMusic className="w-5 h-5" />
                              <span>Ver opciones alternativas</span>
                            </button>
                          </div>
                        </object>
                      )}

                      {/* Spinner de carga para móviles */}
                      {isMobile && (
                        <div 
                          id={`loading-${currentHimno.id}`}
                          className="absolute inset-0 bg-white/95 flex items-center justify-center transition-all duration-500 z-10"
                        >
                          <div className="text-center">
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentHimno.color} flex items-center justify-center mb-6 animate-spin mx-auto`}>
                              <FileMusic className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              Cargando Partitura
                            </h4>
                            <p className="text-gray-600 text-sm mb-4">
                              Preparando la mejor vista para tu móvil...
                            </p>
                            <div className="flex items-center justify-center space-x-1">
                              <div className={`w-2 h-2 bg-gradient-to-r ${currentHimno.color} rounded-full animate-bounce`}></div>
                              <div className={`w-2 h-2 bg-gradient-to-r ${currentHimno.color} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
                              <div className={`w-2 h-2 bg-gradient-to-r ${currentHimno.color} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Fallback solo si TODO falla - pero esto casi nunca debería pasar */
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-red-50 to-orange-50">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        ⚠️ Error de conexión
                      </h3>
                      
                      <p className="text-gray-600 mb-6 max-w-md text-sm leading-relaxed">
                        Hay problemas para cargar la partitura. Esto puede ser por tu conexión a internet.
                      </p>
                      
                      <div className="space-y-3 w-full max-w-sm">
                        {/* Botón principal para recargar */}
                        <button
                          onClick={() => {
                            setPdfError(prev => ({ ...prev, [currentHimno.id]: false }));
                            // Forzar recarga de la página si es necesario
                            if (isMobile) {
                              window.location.reload();
                            }
                          }}
                          className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r ${currentHimno.color} text-white font-semibold shadow-lg active:shadow-md transition-all duration-200 flex items-center justify-center space-x-3 active:scale-95`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          <span>🔄 Reintentar</span>
                        </button>

                        {/* Opción de descarga como último recurso */}
                        <a
                          href={currentHimno.partituraUrl}
                          download={`${currentHimno.titulo.replace(/\s+/g, '-')}-Partitura.pdf`}
                          className="w-full py-3 px-4 rounded-xl border-2 border-gray-400 text-gray-700 font-medium hover:border-gray-500 active:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95"
                        >
                          <Download className="w-4 h-4" />
                          <span>📥 Descargar mientras tanto</span>
                        </a>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                        <p className="text-yellow-800 text-xs">
                          🔗 Verifica tu conexión a internet y vuelve a intentar
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer del modal (solo en móvil) */}
            <div className="sm:hidden p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4">
                <a
                  href={currentHimno.partituraUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-600 text-white font-semibold text-center flex items-center justify-center space-x-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Abrir</span>
                </a>
                <a
                  href={currentHimno.partituraUrl}
                  download
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-center flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS mejorados */}
      <style jsx>{`
        /* Sliders de progreso */
        .slider-progress::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3B82F6, #1D4ED8);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }
        .slider-progress:hover::-webkit-slider-thumb {
          width: 28px;
          height: 28px;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }
        .slider-progress::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3B82F6, #1D4ED8);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        /* Sliders de volumen */
        .slider-volume::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6B7280, #374151);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        .slider-volume:hover::-webkit-slider-thumb {
          width: 24px;
          height: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .slider-volume::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6B7280, #374151);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* Animaciones */
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes modalFadeIn {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1; 
            backdrop-filter: blur(8px);
          }
        }
        
        .animate-modalFadeIn {
          animation: modalFadeIn 0.3s ease-out;
        }

        /* Mejoras para dispositivos táctiles */
        @media (hover: none) {
          .group:hover .group-hover\\:opacity-100 {
            opacity: 1;
          }
          .group:hover .group-hover\\:scale-110 {
            transform: scale(1.1);
          }
        }

        /* Asegurar que el modal esté por encima de todo */
        .z-\\[9999\\] {
          z-index: 9999 !important;
        }
      `}</style>
    </section>
  );
};

export default AudiosHimnos;