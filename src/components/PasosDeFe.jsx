import React, { useState, useEffect } from 'react';
import { Footprints, Heart, Star, Shield, Users } from 'lucide-react';
import logoPrincipal from '../assets/logoprincipal.jpg';

const PasosDeFe = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const [showMainContent, setShowMainContent] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [footstepOpacity, setFootstepOpacity] = useState([0, 0, 0, 0, 0]);
  
  const verse = '"Esta es la victoria que ha vencido al mundo, nuestra fe" — 1 Juan 5:4';
  
  useEffect(() => {
    // Animación más suave con delays progresivos
    const animateSteps = async () => {
      // Mostrar la cruz de fondo suavemente
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnimationStage(1);
      
      // Animar cada paso individualmente con transición suave
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setFootstepOpacity(prev => {
          const newOpacity = [...prev];
          newOpacity[i] = 1;
          return newOpacity;
        });
      }
      
      // Mostrar el título después de los pasos
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnimationStage(2);
      
      // Iniciar el efecto de tipeo del versículo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimationStage(3);
      
      // Transición final a la página principal
      await new Promise(resolve => setTimeout(resolve, 100000));
      setShowMainContent(true);
    };
    
    animateSteps();
  }, []);
  
  useEffect(() => {
    if (animationStage === 3) {
      let currentChar = 0;
      const typeInterval = setInterval(() => {
        if (currentChar <= verse.length) {
          setTypedText(verse.substring(0, currentChar));
          currentChar++;
        } else {
          clearInterval(typeInterval);
        }
      }, 40);
      
      return () => clearInterval(typeInterval);
    }
  }, [animationStage]);
  
  const footsteps = [
    { id: 0, x: '15%', y: '75%', rotation: -15, delay: 0 },
    { id: 1, x: '30%', y: '60%', rotation: 10, delay: 0.2 },
    { id: 2, x: '50%', y: '45%', rotation: -5, delay: 0.4 },
    { id: 3, x: '70%', y: '30%', rotation: 15, delay: 0.6 },
    { id: 4, x: '85%', y: '15%', rotation: -10, delay: 0.8 }
  ];

  if (showMainContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center p-8">
        <div className="text-center opacity-0 animate-smooth-fade-in">
          <div className="mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-full p-0.5 mx-auto mb-6">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">¡Bienvenido a ÁGAPE 2025!</h1>
            <p className="text-xl text-gray-600">Un encuentro transformador te espera</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Ver animación nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-yellow-50/50 flex items-center justify-center overflow-hidden relative">
      {/* Partículas de fondo sutiles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${20 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>
      
      {/* Cruz de fondo con animación muy suave */}
      <div 
        className="absolute inset-0 flex items-center justify-center transition-all duration-2000 ease-out"
        style={{
          opacity: animationStage >= 1 ? 0.05 : 0,
          transform: animationStage >= 1 ? 'scale(1)' : 'scale(0.8)'
        }}
      >
        <img
            src={logoPrincipal}
            alt="Cruz fondo"
            className="w-96 h-96 object-contain"
        />
      </div>
      
      {/* Gradiente radial suave */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/30" />
      
      {/* Pasos animados con transición suave */}
      <div className="absolute inset-0">
        {footsteps.map((step, index) => (
          <div
            key={step.id}
            className="absolute transition-all duration-1500 ease-out"
            style={{
              left: step.x,
              top: step.y,
              transform: `translate(-50%, -50%) rotate(${step.rotation}deg) scale(${footstepOpacity[index]})`,
              opacity: footstepOpacity[index]
            }}
          >
            <div className="relative">
              {/* Efecto de brillo suave */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-yellow-400/20 rounded-full blur-xl scale-150" />
              <Footprints className="w-14 h-14 text-blue-600 relative z-10" strokeWidth={2} />
            </div>
          </div>
        ))}
        
        {/* Línea de conexión entre pasos */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: animationStage >= 1 ? 0.2 : 0 }}>
          <path
            d={`M ${footsteps[0].x} ${footsteps[0].y} 
                Q ${footsteps[1].x} ${footsteps[1].y} ${footsteps[2].x} ${footsteps[2].y}
                T ${footsteps[3].x} ${footsteps[3].y}
                Q ${footsteps[4].x} ${footsteps[4].y} ${footsteps[4].x} ${footsteps[4].y}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-dash"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 text-center px-8 max-w-3xl">
        {/* Título "Pasos de Fe" con animación suave */}
        <h1 
          className="text-6xl md:text-7xl font-bold mb-8 transition-all duration-1500 ease-out"
          style={{
            opacity: animationStage >= 2 ? 1 : 0,
            transform: animationStage >= 2 ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
            Pasos de Fe
          </span>
        </h1>
        
        
        {/* Versículo bíblico con efecto de tipeo más sutil */}
        <div 
          className="max-w-xl mx-auto transition-all duration-1000 ease-out"
          style={{
            opacity: animationStage >= 3 ? 0.7 : 0
          }}
        >
          <p className="text-sm text-gray-600 italic">
            {typedText}
            {typedText.length < verse.length && (
              <span className="inline-block w-0.5 h-4 bg-gray-400 ml-1 animate-blink" />
            )}
          </p>
        </div>
        
        {/* Iconos decorativos con animación tardía */}
        <div 
          className="flex justify-center gap-8 mt-8 transition-all duration-1500 ease-out"
          style={{
            opacity: animationStage >= 3 ? 1 : 0,
            transform: animationStage >= 3 ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <div className="animate-pulse-slow" style={{animationDelay: '0s'}}>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <div className="animate-pulse-slow" style={{animationDelay: '0.5s'}}>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <div className="animate-pulse-slow" style={{animationDelay: '1s'}}>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="animate-pulse-slow" style={{animationDelay: '1.5s'}}>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        {/* Mensaje de bienvenida */}
        <div 
          className="mt-12 transition-all duration-1500 ease-out"
          style={{
            opacity: animationStage >= 3 ? 0.8 : 0
          }}
        >
          <p className="text-sm text-gray-500">
            Dios te bendiga!
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes smooth-fade-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-30px) translateX(10px);
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-10px) translateX(-10px);
            opacity: 0.3;
          }
          75% { 
            transform: translateY(-40px) translateX(5px);
            opacity: 0.5;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
        
        .animate-smooth-fade-in {
          animation: smooth-fade-in 1.5s ease-out forwards;
        }
        
        .animate-float-slow {
          animation: float-slow linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        .animate-dash {
          animation: dash 20s linear infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.3) 100%);
        }
      `}</style>
    </div>
  );
};

export default PasosDeFe;