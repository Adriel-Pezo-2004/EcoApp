/**
 * Archivo: /__tests__/chatbot.logic.test.js
 * 
 * Descripción: Pruebas unitarias para la lógica de predicción del RecyclingChatbot.
 * Framework: Jest
 */

// La información de reciclaje que usa el chatbot para dar respuestas.
const recyclingInfo = {
  "Envase HDPE": {
    title: "Envase HDPE Detectado",
    description: "Este plástico (Polietileno de Alta Densidad) es reciclable. Búscalo en envases de leche, detergentes o champú. Deposítalo en el contenedor amarillo.",
  },
  "Botella PET": {
    title: "Botella PET Detectada",
    description: "El PET es uno de los plásticos más reciclados. Común en botellas de agua y refrescos. ¡Al contenedor amarillo!",
  },
  "Bolsa Plástica": {
    title: "Bolsa Plástica Detectada",
    description: "Aunque algunas son reciclables, muchas bolsas de un solo uso no lo son. Intenta reutilizarlas o busca puntos de reciclaje específicos. Si no, al contenedor de restos.",
  },
  "Cartones": {
    title: "Cartón Detectado",
    description: "¡Totalmente reciclable! Asegúrate de que esté limpio y pliégalo para que ocupe menos espacio. Deposítalo en el contenedor azul.",
  },
};

/**
 * Esta función replica la lógica central del componente de React para poder probarla de forma aislada.
 * @param {object} topPrediction - La predicción con la probabilidad más alta del modelo.
 * @returns {object|null} El objeto con el título y la descripción, o null si no es concluyente.
 */
function getPredictionResult(topPrediction) {
  const CONFIDENCE_THRESHOLD = 0.8;

  if (topPrediction.className === "Persona" && topPrediction.probability > CONFIDENCE_THRESHOLD) {
    return {
      title: "Persona Detectada",
      description: "Esto no parece ser un residuo. No sé cómo clasificar a una persona, ¡pero recuerda reciclar!",
    };
  }
  
  if (recyclingInfo[topPrediction.className] && topPrediction.probability > CONFIDENCE_THRESHOLD) {
    return recyclingInfo[topPrediction.className];
  }
  
  // Si la confianza es baja o la clase es desconocida, no se devuelve un resultado claro.
  return {
    title: "No estoy seguro...",
    description: "No pude identificar el objeto con suficiente claridad. Intenta con mejor luz o desde otro ángulo."
  };
}


// --- Suite de Pruebas para la Lógica del Chatbot ---

describe('Lógica de Predicción del RecyclingChatbot', () => {

  test('Debe identificar correctamente una "Botella PET" con alta confianza', () => {
    const prediction = { className: 'Botella PET', probability: 0.97 };
    const result = getPredictionResult(prediction);
    expect(result.title).toBe('Botella PET Detectada');
    expect(result.description).toContain('¡Al contenedor amarillo!');
  });

  test('Debe identificar correctamente "Cartones" con alta confianza', () => {
    const prediction = { className: 'Cartones', probability: 0.99 };
    const result = getPredictionResult(prediction);
    expect(result.title).toBe('Cartón Detectado');
  });

  test('Debe mostrar un mensaje genérico para objetos con baja confianza', () => {
    const prediction = { className: 'Envase HDPE', probability: 0.55 };
    const result = getPredictionResult(prediction);
    expect(result.title).toBe('No estoy seguro...');
  });

  test('Debe mostrar un mensaje especial cuando detecta una "Persona"', () => {
    const prediction = { className: 'Persona', probability: 0.91 };
    const result = getPredictionResult(prediction);
    expect(result.title).toBe('Persona Detectada');
    expect(result.description).toContain('no parece ser un residuo');
  });

  test('Debe mostrar un mensaje genérico para clases no registradas en recyclingInfo', () => {
    const prediction = { className: 'ObjetoDesconocido', probability: 0.94 };
    const result = getPredictionResult(prediction);
    expect(result.title).toBe('No estoy seguro...');
  });

});
