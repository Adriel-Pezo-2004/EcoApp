/**
 * Simulación de Prueba para RecyclingChatbot
 * ------------------------------------------
 * Ejecuta este script con Node.js para simular las predicciones del chatbot en la terminal.
 *
 * Uso: node d:/10MO SEMESTRE/GERALDYNE/aplica/components/chatbot.simulation.js
 */

// 1. Definimos los mensajes para cada tipo de residuo (copiado de tu componente)
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
  Cartones: {
    title: "Cartón Detectado",
    description: "¡Totalmente reciclable! Asegúrate de que esté limpio y pliégalo para que ocupe menos espacio. Deposítalo en el contenedor azul.",
  },
};

// 2. Creamos un conjunto de predicciones simuladas del modelo
const mockPredictions = [
  { className: "Botella PET", probability: 0.9545 },      // Caso positivo
  { className: "Cartones", probability: 0.982 },         // Caso positivo
  { className: "Persona", probability: 0.9201 },          // Caso negativo (persona)
  { className: "Envase HDPE", probability: 0.6509 },      // Caso negativo (baja confianza)
  { className: "Bolsa Plástica", probability: 0.899 },    // Caso positivo
  { className: "ObjetoDesconocido", probability: 0.90 }, // Caso negativo (clase no registrada)
];

function simulatePrediction(topPrediction) {
  console.log("--- Simulando Escaneo ---");
  console.log(`Objeto detectado: ${topPrediction.className} (Confianza: ${(topPrediction.probability * 100).toFixed(2)}%)`);
  
  let result = null;

  if (topPrediction.className === "Persona" && topPrediction.probability > 0.8) {
    result = {
      title: "Persona Detectada",
      description: "Esto no parece ser un residuo. No sé cómo clasificar a una persona, ¡pero recuerda reciclar!",
    };
  } else if (recyclingInfo[topPrediction.className] && topPrediction.probability > 0.8) {
    result = recyclingInfo[topPrediction.className];
  } else {
    result = {
        title: "No estoy seguro...",
        description: "No pude identificar el objeto con suficiente claridad. Intenta con mejor luz o desde otro ángulo."
    };
  }

  console.log(">> Respuesta generada:");
  if (result) {
    console.log(`   [Título] ${result.title}`);
    console.log(`   [Descripción] ${result.description}`);
  }
  console.log("--- Fin de Escaneo ---\n");
}

console.log("Iniciando simulación de prueba: Chatbot de Reciclaje\n");

mockPredictions.forEach(prediction => {
  simulatePrediction(prediction);
});

console.log("Simulación completada.");
