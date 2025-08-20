import React, { useState } from 'react';
import { MessageSquare, Send, User, Clock, CheckCircle } from 'lucide-react';

const PanelPreguntas = () => {
  const [pregunta, setPregunta] = useState('');
  const [nombre, setNombre] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pregunta.trim() && nombre.trim()) {
      // Aquí se enviaría la pregunta al servidor/base de datos
      console.log('Pregunta enviada:', { nombre, pregunta });
      
      setPregunta('');
      setNombre('');
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <section id="panel-preguntas" className="relative z-20 py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Panel de Preguntas
          </h3>
          <p className="text-xl text-gray-600 mb-2">
            Dejanos tus dudas para el panel de preguntas
          </p>
          <div className="bg-white rounded-xl p-4 max-w-md mx-auto shadow-lg">
            <p className="text-sm font-medium text-purple-700 mb-1">Versículo:</p>
            <p className="text-gray-700 font-semibold">Proverbios 6:23</p>
            <p className="text-sm text-gray-600 italic mt-1">
              "Porque el mandamiento es lámpara, y la enseñanza es luz"
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Formulario centrado para enviar preguntas */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-8">
              <h4 className="text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-purple-500 mr-3" />
                Envía tu Pregunta
              </h4>
              <p className="text-gray-600">
                Tus preguntas serán respondidas durante el evento por nuestros líderes
              </p>
            </div>
            
            {showSuccess ? (
              <div className="text-center py-12 animate-fadeIn">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h5 className="text-2xl font-bold text-gray-800 mb-3">¡Pregunta Enviada!</h5>
                <p className="text-lg text-gray-600 mb-2">Tu pregunta será respondida en el panel durante el evento</p>
                <p className="text-sm text-gray-500">¡Asegúrate de estar presente para escuchar la respuesta!</p>
                <div className="mt-6 p-4 bg-purple-50 rounded-xl max-w-md mx-auto">
                  <p className="text-purple-700 font-medium text-sm">
                    "Pedid, y se os dará; buscad, y hallaréis" - Mateo 7:7
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Cuál es tu nombre?
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-200 text-lg"
                      placeholder="Escribe tu nombre completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Cuál es tu pregunta para el panel?
                  </label>
                  <textarea
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    rows="5"
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-200 resize-none text-lg"
                    placeholder="Escribe aquí tu pregunta sobre fe, vida cristiana, el evento, o cualquier tema que te interese..."
                    required
                    maxLength={300}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Sé específico para obtener una mejor respuesta</span>
                    <span>{pregunta.length}/300</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!pregunta.trim() || !nombre.trim() || pregunta.length > 300}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
                >
                  <Send className="w-6 h-6" />
                  <span>Enviar mi Pregunta</span>
                </button>

                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-purple-700 mb-1">Panel en Vivo</p>
                    <p className="text-xs text-purple-600">
                      Las preguntas serán respondidas durante el evento
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <MessageSquare className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-blue-700 mb-1">Respuestas Expertas</p>
                    <p className="text-xs text-blue-600">
                      Nuestros hermanos más experimentados responderán
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 max-w-3xl mx-auto">
            <h5 className="text-xl font-bold text-gray-800 mb-4">¿Qué tipos de preguntas puedes enviar?</h5>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/70 rounded-xl p-4">
                <h6 className="font-semibold text-purple-700 mb-2">Vida Cristiana</h6>
                <p className="text-gray-600">Preguntas sobre fe, oración, lectura bíblica, crecimiento espiritual</p>
              </div>
              <div className="bg-white/70 rounded-xl p-4">
                <h6 className="font-semibold text-blue-700 mb-2">Relaciones</h6>
                <p className="text-gray-600">Familia, amistades, noviazgo, matrimonio desde una perspectiva cristiana</p>
              </div>
              <div className="bg-white/70 rounded-xl p-4">
                <h6 className="font-semibold text-green-700 mb-2">Propósito</h6>
                <p className="text-gray-600">Llamado, ministerio, servicio, talentos y dones espirituales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanelPreguntas;