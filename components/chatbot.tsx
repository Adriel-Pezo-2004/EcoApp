"use client"

import { useState, useRef, useEffect } from "react"
import * as tmImage from "@teachablemachine/image"
import { Leaf, Paperclip, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Base de datos del chatbot
const recyclingAnswers: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["botella", "botellas"],
    answer:
      "¡Claro! Con las botellas puedes hacer muchas cosas. Si son de plástico (PET), vacíalas, aplástalas y ponles la tapa para reciclarlas. Si son de vidrio, enjuágalas y llévalas al contenedor verde. También puedes reutilizarlas para guardar agua, como macetas o para hacer manualidades.",
  },
  {
    keywords: ["plástico", "plastico", "pet", "hdpe", "pvc"],
    answer:
      "El plástico debe separarse según su tipo y número de reciclaje. Busca el símbolo en el envase.",
  },
  {
    keywords: ["papel", "cartón", "carton"],
    answer:
      "El papel y cartón deben estar limpios y secos antes de reciclarse. Evita mezclar con residuos orgánicos.",
  },
  {
    keywords: [
      "electrónico",
      "electronico",
      "e-waste",
      "electrónicos",
      "electronicos",
    ],
    answer:
      "Los residuos electrónicos deben llevarse a puntos de recolección especializados para evitar contaminación.",
  },
  {
    keywords: ["vidrio", "cristal"],
    answer:
      "El vidrio puede reciclarse indefinidamente. Retira tapas y enjuaga los envases antes de depositarlos.",
  },
  {
    keywords: ["orgánico", "organico", "composta", "compostaje"],
    answer:
      "Los residuos orgánicos pueden convertirse en composta. Separa restos de comida y jardín para este fin.",
  },
  {
    keywords: ["reciclaje", "cómo reciclar", "como reciclar", "reciclar"],
    answer:
      "El reciclaje consiste en separar materiales reutilizables y llevarlos a centros de acopio. Consulta las normas locales.",
  },
  {
    keywords: ["no sé", "no se", "ayuda", "duda", "pregunta"],
    answer:
      "¡Estoy aquí para ayudarte! Pregúntame sobre cualquier material y te diré cómo reciclarlo.",
  },
  {
    keywords: ["lata", "latas", "aluminio", "metal"],
    answer:
      "Las latas de aluminio y metal deben enjuagarse y aplastarse antes de reciclar. Son 100% reciclables.",
  },
  {
    keywords: ["batería", "bateria", "baterías", "baterias", "pila", "pilas"],
    answer:
      "Las baterías y pilas contienen materiales tóxicos. Deposítalas en contenedores especiales o puntos de recolección.",
  },
  {
    keywords: ["aceite", "aceite usado", "grasa"],
    answer:
      "El aceite usado nunca debe tirarse por el desagüe. Llévalo a centros de reciclaje especializados.",
  },
  {
    keywords: ["ropa", "textil", "tela", "prendas"],
    answer:
      "La ropa en buen estado puede donarse. La dañada puede llevarse a contenedores de reciclaje textil.",
  },
  {
    keywords: ["tetra pak", "tetrapak", "tetrabrik"],
    answer:
      "Los envases Tetra Pak se reciclan en contenedores amarillos. Enjuágalos y aplástalos antes.",
  },
  {
    keywords: ["bombilla", "foco", "lámpara", "lampara", "fluorescente"],
    answer:
      "Las bombillas y focos fluorescentes contienen mercurio. Llévalos a puntos de recolección especializados.",
  },
  {
    keywords: ["medicamento", "medicina", "fármaco", "farmaco"],
    answer:
      "Los medicamentos vencidos deben devolverse a farmacias o puntos de recolección. No los tires a la basura común.",
  },
  {
    keywords: ["llanta", "neumático", "neumatico", "goma"],
    answer:
      "Las llantas usadas pueden reciclarse en talleres especializados o puntos de acopio municipal.",
  },
  {
    keywords: ["bolsa", "bolsa plástica", "bolsa plastica"],
    answer:
      "Reduce el uso de bolsas plásticas. Las reutilizables son mejores. Algunas tiendas tienen contenedores para reciclarlas.",
  },
  {
    keywords: [
      "celular",
      "móvil",
      "movil",
      "teléfono",
      "telefono",
      "smartphone",
    ],
    answer:
      "Los celulares viejos contienen materiales valiosos. Llévalos a tiendas de electrónica o programas de reciclaje.",
  },
  {
    keywords: ["computadora", "ordenador", "laptop", "pc"],
    answer:
      "Las computadoras contienen metales preciosos y sustancias tóxicas. Recíclalas en centros especializados en e-waste.",
  },
  {
    keywords: ["color", "colores", "contenedor", "código", "codigo"],
    answer:
      "Los contenedores tienen códigos de color: amarillo para plásticos/latas, azul para papel, verde para vidrio.",
  },
  {
    keywords: ["contaminado", "sucio", "manchado", "grasa"],
    answer:
      "Los materiales contaminados con grasa o comida generalmente no pueden reciclarse. Lávalos si es posible.",
  },
  {
    keywords: ["poliestireno", "unicel", "icopor", "telgopor"],
    answer:
      "El poliestireno expandido es difícil de reciclar. Busca alternativas reutilizables o centros especializados.",
  },
  {
    keywords: [
      "cartón sucio",
      "carton sucio",
      "pizza",
      "cartón de pizza",
      "carton de pizza",
    ],
    answer:
      "El cartón con grasa de comida no es reciclable. Retira las partes limpias y el resto va a basura común.",
  },
  {
    keywords: ["juguete", "juguetes"],
    answer:
      "Los juguetes en buen estado pueden donarse. Los rotos deben desarmarse y separar sus materiales para reciclar.",
  },
  {
    keywords: ["cd", "dvd", "disco"],
    answer:
      "Los CDs y DVDs pueden reciclarse en algunos centros especializados o usarse para manualidades.",
  },
  {
    keywords: ["espejo", "cerámica", "ceramica", "porcelana"],
    answer:
      "Espejos, cerámica y porcelana no van con el vidrio. Deposítalos en basura común o busca centros especiales.",
  },
  {
    keywords: ["pintura", "solvente", "químico", "quimico"],
    answer:
      "Pinturas y químicos son residuos peligrosos. Llévalos a jornadas de recolección o centros especializados.",
  },
  {
    keywords: ["colchón", "colchon", "mueble", "muebles"],
    answer:
      "Los muebles y colchones grandes pueden donarse o solicitar recolección especial a tu municipio.",
  },
  {
    keywords: ["envoltorio", "papel metalizado", "papel aluminio"],
    answer:
      "El papel aluminio limpio puede reciclarse con metales. Los envoltorios metalizados generalmente no son reciclables.",
  },
  {
    keywords: ["cepillo", "cepillo de dientes"],
    answer:
      "Los cepillos de dientes tradicionales van a basura común. Considera opciones biodegradables o programas especiales.",
  },
  {
    keywords: ["pañal", "panal", "toalla sanitaria"],
    answer:
      "Pañales y toallas sanitarias no son reciclables y van a basura común por motivos sanitarios.",
  },
  {
    keywords: ["termo", "vaso térmico", "vaso termico"],
    answer:
      "Los vasos térmicos son difíciles de reciclar por sus capas múltiples. Mejor usa opciones reutilizables.",
  },
  {
    keywords: ["ticket", "recibo", "recibo térmico", "recibo termico"],
    answer:
      "Los recibos térmicos no son reciclables porque contienen BPA. Van a basura común.",
  },
  {
    keywords: ["corcho", "tapón", "tapon"],
    answer:
      "Los corchos naturales son compostables. Algunos programas los recolectan para reciclaje o manualidades.",
  },
  {
    keywords: ["radiografía", "radiografia", "placa"],
    answer:
      "Las radiografías contienen plata y deben llevarse a hospitales o centros que las reciclen adecuadamente.",
  },
  {
    keywords: ["aerosol", "spray", "lata presurizada"],
    answer:
      "Los aerosoles vacíos pueden reciclarse con metales. Si tienen contenido, llévalos a residuos peligrosos.",
  },
  {
    keywords: ["reducir", "reutilizar", "regla", "3r", "tres r"],
    answer:
      "Las 3R son: Reducir el consumo, Reutilizar lo que puedas y Reciclar lo demás. En ese orden de prioridad.",
  },
  {
    keywords: ["separar", "separación", "separacion", "clasificar"],
    answer:
      "Separa residuos en: orgánicos, papel/cartón, plásticos/latas, vidrio y basura general. Facilita el reciclaje.",
  },
  {
    keywords: ["lavar", "limpiar", "enjuagar"],
    answer:
      "Enjuaga envases antes de reciclar para evitar contaminación. No necesitan estar perfectamente limpios.",
  },
  {
    keywords: [
      "símbolo",
      "simbolo",
      "número",
      "numero",
      "triángulo",
      "triangulo",
    ],
    answer:
      "El triángulo con número indica el tipo de plástico. Del 1 al 7, algunos son más reciclables que otros.",
  },
  {
    keywords: ["biodegradable", "compostable"],
    answer:
      "Biodegradable significa que se descompone naturalmente. Compostable es biodegradable en condiciones específicas.",
  },
  {
    keywords: [
      "importancia",
      "importante",
      "por qué",
      "por que",
      "beneficio",
    ],
    answer:
      "Reciclar reduce la contaminación, ahorra recursos naturales, disminuye basura en vertederos y protege el ambiente.",
  },
  {
    keywords: ["escuela", "colegio", "clase", "proyecto"],
    answer:
      "En la escuela puedes: separar residuos, crear contenedores, educar a compañeros y organizar campañas de reciclaje.",
  },
  {
    keywords: ["casa", "hogar", "familia"],
    answer:
      "En casa inicia con contenedores para cada tipo de residuo, involucra a tu familia y establece rutinas de separación.",
  },
  {
    keywords: [
      "cuánto tiempo",
      "cuanto tiempo",
      "descomposición",
      "descomposicion",
    ],
    answer:
      "El plástico tarda 500 años en degradarse, el vidrio 4000 años, pero el papel solo 1 año. ¡Por eso es vital reciclar!",
  },
  {
    keywords: [
      "dónde llevar",
      "donde llevar",
      "punto limpio",
      "centro de acopio",
    ],
    answer:
      "Consulta con tu municipio sobre centros de acopio, puntos limpios o días de recolección especial en tu área.",
  },
  {
    keywords: ["agua", "ahorro", "conservación", "conservacion"],
    answer:
      "Reciclar ahorra agua: producir papel reciclado usa 70% menos agua que papel nuevo. Cada acción cuenta.",
  },
  {
    keywords: [
      "energía",
      "energia",
      "ahorro energético",
      "ahorro energetico",
    ],
    answer:
      "Reciclar aluminio ahorra 95% de energía comparado con producirlo desde cero. Es eficiente y sustentable.",
  },
  {
    keywords: [
      "océano",
      "oceano",
      "mar",
      "playa",
      "contaminación marina",
      "contaminacion marina",
    ],
    answer:
      "Millones de toneladas de plástico llegan al océano anualmente. Reciclar correctamente ayuda a proteger la vida marina.",
  },
  {
    keywords: ["futuro", "planeta", "tierra", "generaciones"],
    answer:
      "Reciclar hoy protege los recursos para las generaciones futuras. Pequeñas acciones crean grandes cambios.",
  },
  {
    keywords: ["empezar", "comenzar", "iniciar", "principiante"],
    answer:
      "Para empezar: consigue contenedores, aprende qué se recicla en tu zona, limpia los materiales y crea el hábito.",
  },
]

export default function RecyclingChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string; image?: string }[]
  >([])
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const modelURL = "/model/model.json"
  const metadataURL = "/model/metadata.json"

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (open && !model && !isModelLoading) {
      setIsModelLoading(true)
      const loadModel = async () => {
        try {
          const loadedModel = await tmImage.load(modelURL, metadataURL)
          setModel(loadedModel)
        } catch (error) {
          console.error("Error al cargar el modelo:", error)
        } finally {
          setIsModelLoading(false)
        }
      }
      loadModel()
    }
  }, [open, model, isModelLoading])

  const handleSend = () => {
    if (!input.trim()) return
    const newMessages = [...messages, { from: "user" as const, text: input }]
    setMessages(newMessages)

    const lowerInput = input.toLowerCase()
    const found = recyclingAnswers.find((ans) =>
      ans.keywords.some((kw) => lowerInput.includes(kw))
    )
    const botReply = found
      ? found.answer
      : "No tengo información sobre ese tema específico, pero puedes consultar fuentes oficiales de reciclaje."

    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: "bot", text: botReply }])
    }, 500)

    setInput("")
    inputRef.current?.focus()
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file || !model) return;

    // Convertir la imagen a un formato base64 para guardarla en el estado
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (!imageUrl) return;

      const newMessages = [
        ...messages,
        { from: "user" as const, text: "Analiza esta imagen:", image: imageUrl },
      ];
      setMessages(newMessages);

      const imageElement = new Image();
      imageElement.src = imageUrl;
      imageElement.onload = async () => {
        const prediction = await model.predict(imageElement);
        prediction.sort((a, b) => b.probability - a.probability);

        const bestPrediction = prediction[0];
        const predictionClassName = bestPrediction.className.toLowerCase();

        // Buscar la respuesta de reciclaje correspondiente
        const foundAnswer = recyclingAnswers.find((ans) =>
          ans.keywords.some((kw) => predictionClassName.includes(kw))
        );

        let botReply = `Creo que esto es: **${bestPrediction.className}** (confianza: ${(bestPrediction.probability * 100).toFixed(0)}%).`;

        if (foundAnswer) {
          botReply += `\n\n${foundAnswer.answer}`;
        } else {
          botReply += `\n\nNo tengo información de reciclaje específica para este objeto.`;
        }

        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      }
    };
  }

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full shadow-lg p-3 flex items-center gap-2 hover:bg-primary/90 transition"
        onClick={() => setOpen(true)}
        aria-label="Abrir Chatbot"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Leaf className="h-6 w-6" />
      </motion.button>

      {/* Modal del chatbot */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:justify-end bg-black/30 backdrop-blur-sm">
          <motion.div
            className="bg-card rounded-t-lg shadow-xl w-full max-w-sm m-0 sm:m-4 flex flex-col h-[70vh] sm:h-[500px]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                EcoBot
              </h4>
              <button
                className="text-muted-foreground hover:text-primary"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  ¡Hola! Soy EcoBot. Pregúntame cómo reciclar cualquier
                  material (ej. "¿dónde va el plástico?").
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.from === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-[80%] text-sm ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="User upload"
                        className="rounded-md mb-2 max-h-40"
                      />
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2 p-4 border-t bg-background rounded-b-lg">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="¿Cómo reciclo plástico?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={isModelLoading || !model}
                aria-label="Subir imagen"
              >
                {isModelLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Paperclip className="h-5 w-5" />
                )}
              </Button>
              <Button size="sm" onClick={handleSend}>
                Enviar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
