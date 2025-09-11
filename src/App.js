import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronDown, Menu, X, Star, Heart, Users, Calendar, MapPin, Send, CheckCircle, Clock, BookOpen, Shield, MessageSquare } from 'lucide-react';
import PasosDeFe from './components/PasosDeFe';
import logoPrincipal from './assets/logoprincipal.jpg';
import agape from './assets/agape.jpg';
import PanelPreguntas from './components/PanelPreguntas';
import AudiosHimnos from './components/AudiosHimnos';

const AgapeEventPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    esBautizado: '',
    congregacion: '',
    ciudad: '',
    edad: '',
    necesitaHospedaje: '',
    talleresPrioridad: {
      evangelismo: '',
      homiletica: '',
      musica: '',
      ninos: '',
      visitantes: ''
    },
    diaLlegada: ''
  });

  const galleryImages = useMemo(() => [
    { id: 1, title: 'Adoración Poderosa', color: 'from-blue-400 to-purple-600' },
    { id: 2, title: 'Comunión Hermosa',   color: 'from-yellow-400 to-orange-600' },
    { id: 3, title: 'Enseñanza Transformadora', color: 'from-green-400 to-blue-600' },
    { id: 4, title: 'Momentos de Oración', color: 'from-purple-400 to-pink-600' },
    { id: 5, title: 'Juventud Unida',      color: 'from-red-400 to-yellow-600' },
    { id: 6, title: 'Celebración Gozosa',  color: 'from-indigo-400 to-blue-600' }
  ], []);

  const buildPayload = () => ({
    form: 'registro',   // campo obligatorio para que tu Apps Script sepa a qué hoja mandar los datos
    ...formData         // todo lo que has llenado en tu formulario (nombre, ciudad, edad, etc.)
  });

  // Talleres
  const TALLERES = [
    { key: 'evangelismo', label: '1) Cómo salvar un alma (Evangelismo)' },
    { key: 'homiletica',  label: '2) De la Biblia al púlpito (Homilética)' },
    { key: 'musica',      label: '3) Armonía con propósito (Música)' },
    { key: 'ninos',       label: '4) Instruyendo con amor (Clase de niños)' },
    { key: 'visitantes',  label: '5) Conociendo a Dios (Ideal para visitantes)' },
  ];
  // === Helpers de validación ===
  // === Helpers de validación ===
  const isTalleresComplete = (tp) => {
    // Debe haber 5 valores no vacíos y ser exactamente 1..5 sin repetir
    const vals = Object.values(tp || {}).filter(Boolean);
    if (vals.length !== 5) return false;
    const uniq = new Set(vals);
    if (uniq.size !== 5) return false;
    return ['1','2','3','4','5'].every(r => uniq.has(r));
  };



  const requiredBase = [
    'nombre',
    'esBautizado',
    'congregacion',
    'ciudad',
    'edad',
    'necesitaHospedaje',
    'diaLlegada'
  ];


  const OPCIONES_RANK = ['', '1','2','3','4','5'];
  const [showThankYou, setShowThankYou] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [currentVerse, setCurrentVerse] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  // Endpoint
  const SHEETS_ENDPOINT = process.env.REACT_APP_SHEETS_ENDPOINT;
  const [submitting, setSubmitting] = useState(false);


  // Versículos bíblicos
  const bibleVerses = [
    { text: "El amor es paciente, es bondadoso...", ref: "1 Corintios 13:4" },
    { text: "Ámense los unos a los otros con amor fraternal", ref: "Romanos 12:10" },
    { text: "En esto conocerán todos que son mis discípulos, si se aman unos a otros", ref: "Juan 13:35" }
  ];

  // Mensaje dinámico según hora del día
  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días! Dios tiene grandes planes para ti hoy";
    if (hour < 18) return "¡Buenas tardes! Es el momento perfecto para asegurar tu lugar";
    return "¡Buenas noches! No dejes pasar esta oportunidad divina";
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };

    switch (name) {
      case 'nombre':
        if (!value) errors.nombre = 'Tu nombre es importante para nosotros';
        else if (value.trim().length < 3) errors.nombre = 'Por favor ingresa tu nombre completo';
        else delete errors.nombre;
        break;

      case 'edad':
        if (!value) errors.edad = 'Necesitamos saber tu edad';
        else if (Number(value) < 13 || Number(value) > 100) errors.edad = 'Por favor verifica tu edad';
        else delete errors.edad;
        break;

      case 'congregacion':
        if (!value) errors.congregacion = 'Nos encantaría conocer tu congregación';
        else delete errors.congregacion;
        break;

      case 'ciudad':
        if (!value) errors.ciudad = 'Indícanos tu ciudad';
        else delete errors.ciudad;
        break;

      case 'talleresPrioridad': {
        const vals = Object.values(value || {});
        const filled = vals.filter(Boolean);
        const duplicates = new Set(filled).size !== filled.length;
        const allRanked = ['1','2','3','4','5'].every(r => filled.includes(r));
        if (duplicates || !allRanked) {
          errors.talleresPrioridad = 'Elige prioridades únicas del 1 al 5';
        } else {
          delete errors.talleresPrioridad;
        }
        break;
      }


      case 'diaLlegada':
        if (!value) errors.diaLlegada = 'Selecciona tu día de llegada';
        else delete errors.diaLlegada;
        break;

      case 'necesitaHospedaje':
        if (!value) errors.necesitaHospedaje = 'Indícanos si necesitas hospedaje';
        else delete errors.necesitaHospedaje;
        break;

      default:
        break;
    }

    setFormErrors(errors);
  };


  // Contador regresivo
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2025-12-12T00:00:00');
      const now = new Date();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, []);

  // Rotación de versículos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % bibleVerses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animacion de entrada

  useEffect(() => {
  const timer = setTimeout(() => {
    setIntroComplete(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 500);
  }, 6068); // 5 segundos de animación

  return () => clearTimeout(timer);
  }, []);


  // Partículas optimizadas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 20 : 30;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#3B82F6' : '#FCD34D';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.001;

        if (this.opacity <= 0 || this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = useCallback((name, value, extraKey) => {
    setTouchedFields(prev => ({ ...prev, [extraKey || name]: true }));

    setFormData(prev => {
      if (name === 'talleresPrioridad') {
        const next = { ...prev.talleresPrioridad };
        next[extraKey] = value;

        if (value) {
          for (const k of Object.keys(next)) {
            if (k !== extraKey && next[k] === value) next[k] = '';
          }
        }

        const updated = { ...prev, talleresPrioridad: next };
        setTimeout(() => validateField('talleresPrioridad', next), 0);
        return updated;
      }

      const updated = { ...prev, [name]: value };
      setTimeout(() => validateField(name, value), 0);
      return updated;
    });
  }, []);

  //Sumbit
  
  const handleSubmit = useCallback(async () => {
    // Validaciones existentes
    const requiredFields = ['nombre', 'esBautizado', 'congregacion', 'ciudad', 'edad', 'necesitaHospedaje', 'diaLlegada'];
    let hasErrors = false;

    requiredFields.forEach(field => {
      const val = formData[field];
      if (!val) {
        hasErrors = true;
        validateField(field, val);
      }
    });

    validateField('talleresPrioridad', formData.talleresPrioridad);
    if (formErrors.talleresPrioridad) hasErrors = true;

    if (hasErrors) {
      alert('Por favor completa los campos requeridos correctamente');
      return;
    }

    if (!SHEETS_ENDPOINT) {
      alert('No se encontró REACT_APP_SHEETS_ENDPOINT. Configúralo en .env.local o en Vercel.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = { form: 'registro', ...formData };

      // Fire-and-forget: no leemos la respuesta (evita CORS/redirects)
      await fetch(SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      // Si llegamos aquí, asumimos éxito
      setShowThankYou(true);

      setTimeout(() => {
        setShowThankYou(false);
        setFormData({
          nombre: '',
          esBautizado: '',
          congregacion: '',
          ciudad: '',
          edad: '',
          necesitaHospedaje: '',
          talleresPrioridad: { evangelismo: '', homiletica: '', musica: '', ninos: '', visitantes: '' },
          diaLlegada: '',
        });
        setTouchedFields({});
        setFormErrors({});
      }, 5000);

    } catch (err) {
      console.error('[ERROR envío]', err);
      alert('Ocurrió un problema al guardar tu registro. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }, [formData, formErrors, SHEETS_ENDPOINT]);


  

  

  const faqs = useMemo(() => [
    {
      question: '¿Cuándo es el evento ÁGAPE?',
      answer: 'El evento se llevará a cabo del 12 al 13 de diciembre de 2025. Comenzamos el viernes a las 6:00 PM con una poderosa sesión de alabanza y concluimos el sábado a las 9:00 PM después de un tiempo especial de ministración.',
      icon: Calendar
    },
    {
      question: '¿Dónde será el evento?',
      answer: 'El evento será en Monclova, Coahuila, en el Centro de Convenciones. La dirección exacta y mapa se enviará por correo a todos los registrados una semana antes del evento.',
      icon: MapPin
    },
    {
      question: '¿Hay algún costo de inscripción?',
      answer: 'No, el evento es completamente gratuito como muestra del amor de Dios. Las comidas están incluidas. Solo pedimos que traigas un corazón dispuesto a recibir.',
      icon: Heart
    },
    {
      question: '¿Qué debo llevar?',
      answer: 'Te recomendamos llevar tu Biblia, libreta de notas, ropa cómoda para dos días, y si necesitas hospedaje, artículos de higiene personal. También trae expectativa y apertura para lo que Dios quiere hacer.',
      icon: Users
    }
  ], []);



  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenu(false);
    }
  }, []);

  // Cálculo del progreso del formulario
  const formProgress = useMemo(() => {
    const filledBase = requiredBase.reduce((acc, key) => acc + (formData[key] ? 1 : 0), 0);
    const talleresOk = isTalleresComplete(formData.talleresPrioridad) ? 1 : 0;

    const total = requiredBase.length + 1; // +1 talleres
    const filled = filledBase + talleresOk;

    const pct = Math.round((filled / total) * 100);
    return Math.min(100, pct);
  }, [formData]);



  if (showIntro) {
  return (
    <div className={`transition-opacity duration-500 ${introComplete ? 'opacity-0' : 'opacity-100'}`}>
      <PasosDeFe />
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Canvas para partículas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.4 }}
        aria-hidden="true"
      />

      {/* Header flotante mejorado */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-full p-0.5 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={logoPrincipal} 
                        alt="Logo ÁGAPE"
                        className="w-full h-full object-cover rounded-full"
                      />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                  ÁGAPE
                </h1>
                <p className="text-xs text-gray-500">Encuentro 2025</p>
              </div>
            </div>



            {/* Menú desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {[
                { name: 'Panel de Preguntas', id: 'panel-preguntas', icon: MessageSquare },
                { name: 'Registro', id: 'registro', icon: Send },
                { name: 'Sobre ÁGAPE', id: 'sobre-agape', icon: Heart },
                { name: 'Galería', id: 'galeria', icon: Star },
                { name: 'FAQ', id: 'faq', icon: Users }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium group"
                  aria-label={`Ir a ${item.name}`}
                >
                  <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Menú móvil */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Menú de navegación"
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menú móvil desplegable mejorado */}
          {mobileMenu && (
            <div className="md:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-blue-700 flex items-center">
                </p>
              </div>
              {[
                { name: 'Panel de Preguntas', id: 'panel-preguntas', icon: MessageSquare },
                { name: 'Registro', id: 'registro', icon: Send },
                { name: 'Sobre ÁGAPE', id: 'sobre-agape', icon: Heart },
                { name: 'Galería', id: 'galeria', icon: Star },
                { name: 'FAQ', id: 'faq', icon: Users }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setMobileMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                >
                  <item.icon className="w-5 h-5 text-blue-500" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section mejorado */}
      <section id="hero" className="relative z-20 pt-24 pb-16 px-4 min-h-screen flex items-center">
        <div className="container mx-auto text-center">
          {/* Mensaje dinámico */}
          <div className="mb-6 animate-fadeIn">
            <p className="text-lg text-gray-600 font-medium">
              {getDynamicGreeting()}
            </p>
          </div>

          {/* Logo principal con efectos */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-400/30 to-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="relative w-64 h-64 mx-auto p-1 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-full animate-float">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                <img 
                  src={agape} 
                  alt="Logo ÁGAPE"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
              Bienvenido a ÁGAPE 2025
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
            Un encuentro transformador de amor y hermandad que cambiará tu vida para siempre
          </p>

          {/* Versículo bíblico rotativo */}
          <div className="mb-8 max-w-xl mx-auto animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-4 shadow-lg">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-700 italic">{bibleVerses[currentVerse].text}</p>
              <p className="text-sm text-gray-500 mt-1">{bibleVerses[currentVerse].ref}</p>
            </div>
          </div>

          {/* Contador regresivo mejorado */}
          <div className="mb-12 animate-fadeInUp animation-delay-400">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Faltan solo:</h3>
            <div className="flex justify-center gap-3 md:gap-6">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white rounded-2xl shadow-xl p-4 md:p-6 min-w-[80px] transform hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{value || 0}</div>
                  <div className="text-xs md:text-sm text-gray-500 capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-gray-600 mb-8">
            <span className="flex items-center bg-white/90 backdrop-blur rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" /> 12-13 Diciembre
            </span>
            <span className="flex items-center bg-white/90 backdrop-blur rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <MapPin className="w-5 h-5 mr-2 text-yellow-500" /> Monclova, Coahuila
            </span>
            <span className="flex items-center bg-white/90 backdrop-blur rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <Users className="w-5 h-5 mr-2 text-purple-500" /> Limitado a 300 personas
            </span>
          </div>

          <button
            onClick={() => scrollToSection('registro')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl animate-bounce"
          >
            <span className="text-lg">Asegura tu Lugar Ahora</span>
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" /> 100% Seguro
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" /> Registro Gratuito
            </span>
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" /> Con Amor
            </span>
          </div>
        </div>
      </section>

      <PanelPreguntas />

      {/* Sección de Registro mejorada */}
      <section id="registro" className="relative z-20 py-16 px-4 bg-gradient-to-br from-blue-50/50 to-yellow-50/50">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
              Completa tu Registro
            </h3>
            <p className="text-center text-gray-600 mb-6">Únete a este encuentro transformador</p>

            {/* Barra de progreso */}
            {!showThankYou && formProgress > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso de registro</span>
                  <span>{Math.round(formProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${formProgress}%` }}
                  />
                </div>
              </div>
            )}

            {showThankYou ? (
              <div className="text-center py-16 animate-fadeIn">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-800 mb-3">¡Aleluya, Registro Exitoso!</h4>
                <p className="text-lg text-gray-600 mb-2">Dios tiene grandes planes para ti en ÁGAPE 2025</p>
                <p className="text-sm text-gray-500">Te enviaremos toda la información a tu correo pronto</p>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-700 font-medium">
                    "El Señor te bendiga y te guarde" - Números 6:24
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Campo Nombre con validación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ¿Cuál es tu nombre? *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      touchedFields.nombre && formErrors.nombre 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    } focus:outline-none transition-all duration-200`}
                    placeholder="Tu nombre completo"
                    aria-label="Nombre completo"
                    aria-required="true"
                    aria-invalid={touchedFields.nombre && !!formErrors.nombre}
                  />
                  {touchedFields.nombre && formErrors.nombre && (
                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">{formErrors.nombre}</p>
                  )}
                  {formData.nombre && !formErrors.nombre && (
                    <p className="mt-1 text-sm text-green-600 animate-fadeIn">
                      ¡Hermoso nombre, {formData.nombre.split(' ')[0]}! 
                    </p>
                  )}
                </div>

                {/* Campo Bautizado mejorado */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Eres bautizado? *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleInputChange('esBautizado', 'si')}
                      className={`px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                        formData.esBautizado === 'si'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      aria-pressed={formData.esBautizado === 'si'}
                    >
                      <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                      Sí, soy bautizado
                    </button>
                    <button
                      onClick={() => handleInputChange('esBautizado', 'no')}
                      className={`px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                        formData.esBautizado === 'no'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      aria-pressed={formData.esBautizado === 'no'}
                    >
                      <Heart className="w-5 h-5 mx-auto mb-1" />
                      Aún no
                    </button>
                  </div>
                  {formData.esBautizado === 'no' && (
                    <p className="mt-2 text-sm text-blue-600 animate-fadeIn">
                      ¡Qué bendición! Este evento será perfecto para ti 🙏
                    </p>
                  )}
                </div>

                {/* Campos condicionales para bautizados con animación */}
                {formData.esBautizado && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ¿A qué congregación perteneces? *
                      </label>
                      <input
                        type="text"
                        value={formData.congregacion}
                        onChange={(e) => handleInputChange('congregacion', e.target.value)}
                        className={`w-full px-5 py-4 rounded-xl border-2 ${
                          touchedFields.congregacion && formErrors.congregacion
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none transition-all duration-200`}
                        placeholder="Nombre de tu congregación"
                        aria-label="Congregación"
                        aria-required="true"
                      />
                      {touchedFields.congregacion && formErrors.congregacion && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.congregacion}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ¿De qué ciudad eres? *
                      </label>
                      <input
                        type="text"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        className={`w-full px-5 py-4 rounded-xl border-2 ${
                          touchedFields.ciudad && formErrors.ciudad
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none transition-all duration-200`}
                        placeholder="Tu ciudad"
                        aria-label="Ciudad"
                        aria-required="true"
                      />
                      {touchedFields.ciudad && formErrors.ciudad && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.ciudad}</p>
                      )}
                    </div>
                  </div>
                )}


                {/* Campo Edad con validación inteligente */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ¿Qué edad tienes? *
                  </label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => handleInputChange('edad', e.target.value)}
                    min="13"
                    max="100"
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      touchedFields.edad && formErrors.edad
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                    } focus:outline-none transition-all duration-200`}
                    placeholder="Tu edad"
                    aria-label="Edad"
                    aria-required="true"
                    aria-invalid={touchedFields.edad && !!formErrors.edad}
                  />
                  {touchedFields.edad && formErrors.edad && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.edad}</p>
                  )}
                  {formData.edad && !formErrors.edad && (
                    <p className="mt-1 text-sm text-green-600 animate-fadeIn">
                      {formData.edad < 18 
                        ? '¡Qué bendición ver jóvenes buscando a Dios!' 
                        : formData.edad < 25 
                        ? '¡La mejor edad para vivir experiencias transformadoras!'
                        : '¡Nunca es tarde para un encuentro con Dios!'}
                    </p>
                  )}
                </div>

                {/* Campo Hospedaje mejorado */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Necesitas hospedaje? *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleInputChange('necesitaHospedaje', 'si')}
                      className={`px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                        formData.necesitaHospedaje === 'si'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      aria-pressed={formData.necesitaHospedaje === 'si'}
                    >
                      <MapPin className="w-5 h-5 mx-auto mb-1" />
                      Sí necesito
                    </button>
                    <button
                      onClick={() => handleInputChange('necesitaHospedaje', 'no')}
                      className={`px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                        formData.necesitaHospedaje === 'no'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      aria-pressed={formData.necesitaHospedaje === 'no'}
                    >
                      <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                      No necesito
                    </button>
                  </div>
                  {formData.necesitaHospedaje === 'si' && (
                    <p className="mt-2 text-sm text-blue-600 animate-fadeIn">
                      Necesitas hospedaje 🏠 — 
                      <a 
                        href="https://wa.me/5218661234567" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-semibold underline hover:text-blue-800"
                      >
                        contacta a este número
                      </a>
                    </p>
                  )}
                </div>
                {/* Talleres: prioridad del 1 al 5 */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Talleres (elige prioridad del 1 al 5, sin repetir) *
                  </label>

                  <div className="grid gap-3">
                    {TALLERES.map(t => (
                      <div key={t.key} className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-200 px-4 py-3">
                        <span className="text-gray-700 text-sm md:text-base">{t.label}</span>
                        <select
                          value={formData.talleresPrioridad[t.key]}
                          onChange={(e) => handleInputChange('talleresPrioridad', e.target.value, t.key)}
                          className="ml-4 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none"
                        >
                          {OPCIONES_RANK.map(opt => (
                            <option key={opt} value={opt}>{opt === '' ? '—' : opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {formErrors.talleresPrioridad && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.talleresPrioridad}</p>
                  )}
                </div>
                {/* Día de llegada */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Día de llegada *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['viernes','sabado'].map(op => (
                      <button
                        key={op}
                        onClick={() => handleInputChange('diaLlegada', op)}
                        className={`px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200 ${
                          formData.diaLlegada === op
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        aria-pressed={formData.diaLlegada === op}
                      >
                        {op === 'viernes' ? 'Viernes' : 'Sábado'}
                      </button>
                    ))}
                  </div>
                  {touchedFields.diaLlegada && formErrors.diaLlegada && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.diaLlegada}</p>
                  )}
                </div>



                {/* Mensaje motivacional dinámico */}
                {formProgress > 50 && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 animate-fadeIn">
                    <p className="text-sm text-yellow-800 font-medium">
                      ¡Ya casi terminas! Solo faltan unos campos más para asegurar tu lugar en este encuentro transformador.
                    </p>
                  </div>
                )}

                {/* Botón de envío mejorado */}
                <button
                  onClick={handleSubmit}
                  disabled={formProgress < 100 || submitting}
                  className={`w-full py-5 font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group
                    ${formProgress < 100 || submitting
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl'}`}
                  aria-label="Completar registro"
                >
                  <span className="text-lg">
                    {submitting
                      ? 'Enviando...'
                      : formProgress < 100
                        ? `Completa los campos (${formProgress}%)`
                        : 'Completar mi Registro'}
                  </span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    * Campos obligatorios. Tu información está segura con nosotros.
                  </p>
                  <p className="text-xs text-gray-400 flex items-center justify-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Protegido con encriptación SSL
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección ¿Qué es ÁGAPE? mejorada */}
      <section id="sobre-agape" className="relative z-20 py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">¿Qué es ÁGAPE?</h3>
          <p className="text-xl text-gray-600 mb-12">Descubre el verdadero significado del amor divino</p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Heart,
                title: 'Amor Incondicional',
                description: 'Experimenta el amor de Dios manifestado en cada momento de adoración y comunión',
                color: 'from-red-400 to-pink-600',
                verse: 'Juan 3:16'
              },
              {
                icon: Users,
                title: 'Hermandad Genuina',
                description: 'Conecta con jóvenes que comparten tu pasión por Cristo y el deseo de crecer',
                color: 'from-blue-400 to-purple-600',
                verse: 'Hechos 2:44'
              },
              {
                icon: Star,
                title: 'Transformación',
                description: 'Vive dos días que marcarán un antes y después en tu caminar con Dios',
                color: 'from-yellow-400 to-orange-600',
                verse: '2 Corintios 5:17'
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <span className="text-xs text-gray-400">{item.verse}</span>
                  </div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-3xl p-10 md:p-16 shadow-xl">
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                ÁGAPE es más que un evento, es un <span className="font-bold text-blue-600">encuentro transformador</span> donde 
                el amor de Dios se manifiesta poderosamente. Durante dos días intensos, 
                experimentarás <span className="font-bold text-yellow-600">adoración profunda</span>, enseñanzas que 
                cambiarán tu perspectiva y conexiones genuinas con hermanos de toda la república.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur rounded-2xl p-6">
                  <Clock className="w-8 h-8 text-blue-500 mb-3" />
                  <h5 className="font-bold text-gray-800 mb-2">48 Horas Intensas</h5>
                  <p className="text-gray-600 text-sm">Cada momento está diseñado para acercarte más a Dios y a tus hermanos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-2xl p-6">
                  <BookOpen className="w-8 h-8 text-yellow-500 mb-3" />
                  <h5 className="font-bold text-gray-800 mb-2">Palabra Poderosa</h5>
                  <p className="text-gray-600 text-sm">Mensajes que transformarán tu forma de ver el amor de Dios</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                Únete a cientos de jóvenes que buscan <span className="font-bold text-purple-600">crecer en su fe</span>, 
                servir con pasión y construir relaciones que trascienden. En ÁGAPE, descubrirás que el 
                <span className="font-bold text-red-600"> amor incondicional</span> no es solo una teoría, 
                sino una realidad tangible que cambiará tu vida.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva Sección de Testimonios */}


      {/* Galería mejorada */}
      <section id="galeria" className="relative z-20 py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Momentos de ÁGAPE
          </h3>
          <p className="text-xl text-center text-gray-600 mb-12">Revive los mejores momentos de encuentros pasados</p>

          {/* Carrusel principal mejorado */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${img.color} flex items-center justify-center`}>
                    <div className="text-center text-white p-8">
                      <Star className="w-16 h-16 mx-auto mb-4 opacity-80 animate-pulse" />
                      <h4 className="text-3xl font-bold mb-2">{img.title}</h4>
                      <p className="text-lg opacity-90">Momento especial #{img.id}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Controles del carrusel mejorados */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'w-12 h-3 bg-white rounded-full' 
                        : 'w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full'
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Grid de miniaturas mejorado */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  index === currentImageIndex ? 'ring-4 ring-blue-500 ring-offset-2' : ''
                }`}
                aria-label={`Seleccionar ${img.title}`}
              >
                <div className={`w-full h-32 bg-gradient-to-br ${img.color} flex items-center justify-center`}>
                  <Star className="w-8 h-8 text-white/80 group-hover:scale-125 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm font-medium px-2 text-center">{img.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <AudiosHimnos />

      {/* Preguntas Frecuentes mejoradas */}
      <section id="faq" className="relative z-20 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Preguntas Frecuentes
          </h3>
          <p className="text-xl text-center text-gray-600 mb-12">Todo lo que necesitas saber sobre ÁGAPE</p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-6 md:p-8 text-left flex items-center justify-between group"
                  aria-expanded={expandedFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${
                      index === 0 ? 'from-blue-400 to-blue-600' :
                      index === 1 ? 'from-yellow-400 to-orange-600' :
                      index === 2 ? 'from-green-400 to-green-600' :
                      'from-purple-400 to-purple-600'
                    } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <faq.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-semibold text-gray-800">
                      {faq.question}
                    </h4>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    expandedFAQ === index ? 'rotate-180' : ''
                  }`} />
                </button>
                
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFAQ === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <p className="text-gray-600 ml-18">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pregunta adicional de contacto */}
          <div className="mt-12 bg-blue-50 rounded-3xl p-8 text-center">
            <h4 className="text-xl font-bold text-gray-800 mb-3">¿Tienes más preguntas?</h4>
            <p className="text-gray-600 mb-4">Estamos aquí para ayudarte en tu camino hacia ÁGAPE</p>
            <a 
              href="mailto:info@agape2025.com"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Send className="w-4 h-4" />
              <span>Contáctanos</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sección de llamada a la acción mejorada */}
      <section className="relative z-20 py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp">
              ¿Listo para vivir ÁGAPE?
            </h3>
            <p className="text-xl mb-8 opacity-90 animate-fadeInUp animation-delay-200">
              No te pierdas esta oportunidad única de experimentar el amor de Dios junto a cientos de jóvenes
            </p>
            <button
              onClick={() => scrollToSection('registro')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse"
            >
              <span className="text-lg">Asegura tu Lugar Ahora</span>
              <Heart className="w-5 h-5" />
            </button>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Entrada Gratuita</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Comidas Incluidas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Hospedaje Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Material de Estudio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mejorado */}
      <footer className="relative z-20 bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">ÁGAPE 2025</h3>
              </div>
              <p className="text-gray-400 mb-4">Un evento de amor y hermandad cristiana</p>
              <div className="flex justify-center md:justify-start space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">ig</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">yt</span>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4">Información del Evento</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center justify-center md:justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  12-13 de Diciembre 2025
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Monclova, Coahuila
                </p>
                <p className="flex items-center justify-center md:justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Entrada Gratuita
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => scrollToSection('registro')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Registro
                </button>
                <button 
                  onClick={() => scrollToSection('sobre-agape')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Sobre ÁGAPE
                </button>
                <button 
                  onClick={() => scrollToSection('testimonios')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Testimonios
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Preguntas Frecuentes
                </button>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <p>info@agape2025.com</p>
                <p>+52 55 1234 5678</p>
                <div className="mt-4">
                  <p className="text-sm mb-2">Horario de atención:</p>
                  <p className="text-xs">Lun-Vie: 9:00 AM - 6:00 PM</p>
                  <p className="text-xs">Sábado: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">© 2025 ÁGAPE. Todos los derechos reservados.</p>
              <p className="text-xs text-gray-600">Diseñado con ❤️ para la gloria de Dios</p>
              <div className="mt-4">
                <p className="text-xs text-gray-500 italic">
                  "Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor."
                </p>
                <p className="text-xs text-gray-600">1 Corintios 13:13</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default AgapeEventPage;