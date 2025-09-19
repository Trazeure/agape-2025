import React, { useState, useEffect } from 'react';
import { Footprints, Heart, Shield, Users, Crown } from 'lucide-react';

const PasosDeFe = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const [showMainContent, setShowMainContent] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [footstepOpacity, setFootstepOpacity] = useState([0, 0, 0, 0, 0]);
  
  const verse = '"Esta es la victoria que ha vencido al mundo, nuestra fe" — 1 Juan 5:4';
  
  useEffect(() => {
    const animateSteps = async () => {
      // Fase 1: Título aparece (2 segundos)
      setAnimationStage(1);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fase 2: Pasos aparecen uno por uno (3 segundos)
      setAnimationStage(2);
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setFootstepOpacity(prev => {
          const newOpacity = [...prev];
          newOpacity[i] = 1;
          return newOpacity;
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Fase 3: Esperar (1 segundo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fase 4: Versículo con efecto de tipeo (3 segundos)
      setAnimationStage(3);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fase 5: Transición a la página principal (1 segundo)
      setTimeout(() => {
        setShowMainContent(true);
      }, 1000);
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
      }, 35);
      
      return () => clearInterval(typeInterval);
    }
  }, [animationStage]);
  
  const footsteps = [
    { id: 0, x: '20%', y: '80%', rotation: -20, scale: 1.2 },
    { id: 1, x: '35%', y: '65%', rotation: 15, scale: 1.0 },
    { id: 2, x: '50%', y: '50%', rotation: -10, scale: 1.3 },
    { id: 3, x: '65%', y: '35%', rotation: 25, scale: 1.1 },
    { id: 4, x: '80%', y: '20%', rotation: -15, scale: 1.4 }
  ];

  if (showMainContent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center overflow-hidden relative">
      {/* Campo de estrellas completamente independiente - sin vincular a fases */}
      <div className="absolute inset-0">
        {/* Solo estrellas horizontales que fluyen constantemente */}
        {[...Array(120)].map((_, i) => {
          const size = Math.random() * 1.5 + 0.3;
          const delay = Math.random() * 40; // Distribución amplia
          const verticalPos = Math.random() * 100;
          const speed = 15 + Math.random() * 10; // Variación mínima de velocidad
          
          return (
            <div
              key={`flow-horizontal-${i}`}
              className="absolute bg-white rounded-full animate-constant-horizontal-flow"
              style={{
                left: '-15px',
                top: `${verticalPos}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${speed}s`,
                opacity: Math.random() * 0.6 + 0.2,
                boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.3)`
              }}
            />
          );
        })}
        
        {/* Polvo estelar ultra fino que fluye */}
        {[...Array(80)].map((_, i) => {
          const size = Math.random() * 0.8 + 0.2;
          const delay = Math.random() * 30;
          const verticalPos = Math.random() * 100;
          const speed = 12 + Math.random() * 8;
          
          return (
            <div
              key={`flow-dust-${i}`}
              className="absolute bg-blue-100 rounded-full animate-constant-dust-flow"
              style={{
                left: '-8px',
                top: `${verticalPos}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${speed}s`,
                opacity: Math.random() * 0.4 + 0.1,
                boxShadow: `0 0 ${size * 3}px rgba(191, 219, 254, 0.2)`
              }}
            />
          );
        })}
      </div>
      
      {/* Pasos de fe CON efectos de brillo al pisar */}
      <div className="absolute inset-0 z-20">
        {footsteps.map((step, index) => (
          <div key={step.id}>
            <div
              className="absolute transition-all duration-1500 ease-out"
              style={{
                left: step.x,
                top: step.y,
                transform: `translate(-50%, -50%) rotate(${step.rotation}deg) scale(${footstepOpacity[index] * step.scale})`,
                opacity: footstepOpacity[index],
                zIndex: 10
              }}
            >
              <div className="relative">
                {/* Aura de brillo cuando aparece el paso */}
                {footstepOpacity[index] > 0 && (
                  <div 
                    className="absolute inset-0 rounded-full blur-xl animate-step-glow"
                    style={{
                      background: `radial-gradient(circle, ${
                        index % 2 === 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(251, 191, 36, 0.4)'
                      } 0%, transparent 70%)`,
                      width: '120px',
                      height: '120px',
                      left: '-35px',
                      top: '-35px'
                    }}
                  />
                )}
                
                <div className="relative z-10">
                  <Footprints 
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-all duration-500 ${
                      index % 2 === 0 ? 'text-blue-400' : 'text-yellow-400'
                    } filter drop-shadow-lg`}
                    strokeWidth={2.5}
                    style={{
                      filter: footstepOpacity[index] > 0 ? 'drop-shadow(0 0 15px currentColor)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Contenido principal con efectos épicos */}
      <div className="relative z-30 text-center px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        {/* Título con efectos divinos */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 sm:mb-10 md:mb-12 relative transition-all duration-2000 ease-out"
          style={{
            opacity: animationStage >= 1 ? 1 : 0,
            transform: animationStage >= 1 ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.8)'
          }}
        >
          <span className="bg-gradient-to-r from-blue-300 via-white to-yellow-300 bg-clip-text text-transparent animate-title-glow relative">
            Pasos de Fe
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-white/20 to-yellow-400/20 blur-2xl animate-title-aura"></div>
          </span>
        </h1>
        
        {/* Versículo con efectos cinematográficos */}
        <div 
          className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto relative transition-all duration-1500 ease-out"
          style={{
            opacity: animationStage >= 3 ? 1 : 0,
            transform: animationStage >= 3 ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-yellow-400/20 rounded-2xl md:rounded-3xl blur-xl animate-verse-glow"></div>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium leading-relaxed relative z-10">
              {typedText}
              {typedText.length < verse.length && (
                <span className="inline-block w-0.5 h-4 sm:h-5 md:h-6 bg-yellow-400 ml-1 animate-divine-cursor shadow-lg" />
              )}
            </p>
          </div>
        </div>
        
        {/* Iconos celestiales */}
        <div 
          className="flex justify-center gap-6 sm:gap-8 md:gap-12 mt-8 sm:mt-12 md:mt-16 transition-all duration-2000 ease-out"
          style={{
            opacity: animationStage >= 3 ? 1 : 0,
            transform: animationStage >= 3 ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          {[
            { Icon: Heart, color: 'text-red-400', delay: '0s' },
            { Icon: Shield, color: 'text-blue-400', delay: '0.5s' },
            { Icon: Crown, color: 'text-yellow-400', delay: '1s' },
            { Icon: Users, color: 'text-purple-400', delay: '1.5s' }
          ].map(({ Icon, color, delay }, index) => (
            <div 
              key={index}
              className="relative animate-celestial-float"
              style={{ animationDelay: delay }}
            >
              <div className={`absolute inset-0 ${color} blur-xl opacity-50 animate-icon-glow`}></div>
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${color} relative z-10 animate-celestial-pulse filter drop-shadow-lg`} />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        /* Solo animaciones completamente constantes e independientes */
        @keyframes constant-horizontal-flow {
          0% { 
            transform: translateX(-15px);
            opacity: 0;
          }
          3% {
            opacity: 1;
          }
          97% {
            opacity: 1;
          }
          100% { 
            transform: translateX(calc(100vw + 15px));
            opacity: 0;
          }
        }
        
        @keyframes constant-dust-flow {
          0% { 
            transform: translateX(-8px);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 0.6;
          }
          100% { 
            transform: translateX(calc(100vw + 8px));
            opacity: 0;
          }
        }
        
        /* Efecto de brillo para las pisadas */
        @keyframes step-glow {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.2) rotate(180deg);
            opacity: 0.6;
          }
        }
        
        @keyframes title-glow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
          }
          50% { 
            text-shadow: 0 0 40px rgba(255, 255, 255, 0.7), 0 0 60px rgba(59, 130, 246, 0.4);
          }
        }
        
        @keyframes title-aura {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.4;
            transform: scale(1.03);
          }
        }
        
        @keyframes verse-glow {
          0%, 100% { 
            opacity: 0.3;
          }
          50% { 
            opacity: 0.5;
          }
        }
        
        @keyframes divine-cursor {
          0%, 50% { 
            opacity: 1;
            box-shadow: 0 0 8px currentColor;
          }
          51%, 100% { 
            opacity: 0;
            box-shadow: 0 0 4px currentColor;
          }
        }
        
        @keyframes celestial-float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(-8px) rotate(3deg);
          }
          50% { 
            transform: translateY(-4px) rotate(0deg);
          }
          75% { 
            transform: translateY(-12px) rotate(-3deg);
          }
        }
        
        @keyframes celestial-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 8px currentColor);
          }
          50% { 
            transform: scale(1.15);
            filter: drop-shadow(0 0 16px currentColor);
          }
        }
        
        @keyframes icon-glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.3);
          }
        }
        
        /* Solo clases para animaciones constantes */
        .animate-constant-horizontal-flow {
          animation: constant-horizontal-flow linear infinite;
        }
        
        .animate-constant-dust-flow {
          animation: constant-dust-flow linear infinite;
        }
        
        .animate-step-glow {
          animation: step-glow 3s ease-in-out infinite;
        }
        
        .animate-title-glow {
          animation: title-glow 4s ease-in-out infinite;
        }
        
        .animate-title-aura {
          animation: title-aura 5s ease-in-out infinite;
        }
        
        .animate-verse-glow {
          animation: verse-glow 4s ease-in-out infinite;
        }
        
        .animate-divine-cursor {
          animation: divine-cursor 1.2s infinite;
        }
        
        .animate-celestial-float {
          animation: celestial-float 5s ease-in-out infinite;
        }
        
        .animate-celestial-pulse {
          animation: celestial-pulse 3s ease-in-out infinite;
        }
        
        .animate-icon-glow {
          animation: icon-glow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PasosDeFe;