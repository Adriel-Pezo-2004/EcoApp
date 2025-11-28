"use client"

import * as tmImage from "@teachablemachine/image"
import { useState, useRef, useEffect } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, Paperclip, Loader, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Información de reciclaje para el bot de texto
const textRecyclingInfo: { [key: string]: string } = {
  pet:
    "¡Claro! Las botellas PET son muy valiosas. Recomendación: Enjuágalas un poco, quítales la tapa y aplástalas para que ocupen menos espacio. Luego, deposítalas en el contenedor amarillo. También puedes reutilizarlas como maceteros o para manualidades.",
  hdpe:
    "El HDPE es un plástico resistente. Recomendación: Asegúrate de que los envases de leche, champú o detergente estén vacíos y enjuagados. No es necesario quitar la etiqueta. Deposítalos en el contenedor amarillo.",
  carton:
    "¡El cartón es un campeón del reciclaje! Recomendación: Quita cualquier cinta plástica, asegúrate de que no esté manchado de grasa o comida, y pliégalo bien. Así ocupa menos espacio en el contenedor azul. También puedes usarlo para hacer compost.",
  bolsa:
    "Las bolsas de plástico son complicadas. Recomendación: La mejor opción es reducir su uso llevando tus propias bolsas reutilizables. Si tienes bolsas limpias y secas, busca un punto limpio o supermercado que las recolecte específicamente. Si no, úsalas como bolsas de basura para no desecharlas inmediatamente.",
  default: "No estoy seguro de cómo reciclar eso. Intenta preguntarme sobre 'botella PET', 'cartón' o 'bolsa de plástico'.",
}

// Información de reciclaje para el modelo de imagen
const imageRecyclingInfo: { [key: string]: string } = {
  "Envase HDPE":
    "Detecté un envase HDPE. Recomendación: Vacíalo y enjuágalo bien antes de depositarlo en el contenedor amarillo. Este plástico es muy resistente y se usa para crear nuevos envases o incluso muebles de jardín.",
  "Botella PET":
    "¡Eso parece una botella PET! Recomendación: Enjuágala, quítale la tapa y aplástala antes de llevarla al contenedor amarillo. ¡Así ayudas a que el proceso sea más eficiente!",
  "Bolsa Plástica":
    "Detecté una bolsa plástica. Recomendación: Lo ideal es reutilizarlas al máximo. Si no puedes, busca un punto de recolección especial, ya que no suelen reciclarse con el resto de plásticos. La mejor alternativa es usar bolsas de tela.",
  Cartones:
    "¡He detectado cartón! Recomendación: Asegúrate de que esté limpio, sin restos de comida, y quita la cinta adhesiva. Pliégalo siempre para ahorrar espacio y deposítalo en el contenedor azul.",
  Persona: "Detecté una persona. ¡Recuerda reciclar tus residuos, no a tus amigos!",
}

// Tipos para los mensajes
interface Message {
  text: string
  sender: "user" | "bot"
  imageUrl?: string
}

export default function RecyclingChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "¡Hola! Soy tu asistente de reciclaje. Pregúntame cómo reciclar algo." },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MODEL_URL = "/model/model.json"
  const METADATA_URL = "/model/metadata.json"

  // Carga el modelo de Teachable Machine
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL)
        setModel(loadedModel)
      } catch (error) {
        console.error("Error al cargar el modelo:", error)
      }
    }
    loadModel()
  }, [])

  useEffect(() => {
    // Mover el scroll hacia abajo cuando llegan mensajes nuevos
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    if (lowerInput.includes("pet") || lowerInput.includes("botella")) return textRecyclingInfo.pet
    if (lowerInput.includes("hdpe")) return textRecyclingInfo.hdpe
    if (lowerInput.includes("carton") || lowerInput.includes("caja")) return textRecyclingInfo.carton
    if (lowerInput.includes("bolsa")) return textRecyclingInfo.bolsa
    return textRecyclingInfo.default
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (inputValue.trim() === "") return

    const userMessage: Message = { sender: "user", text: inputValue }
    const botResponse: Message = { sender: "bot", text: getBotResponse(inputValue) }

    setMessages(prev => [...prev, userMessage, botResponse])
    setInputValue("")
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !model) return

    setIsPredicting(true)

    const imageUrl = URL.createObjectURL(file)
    // Mensaje de usuario con la imagen
    const userImageMessage: Message = { sender: "user", text: "", imageUrl: imageUrl }
    // Mensaje de "analizando" del bot
    const thinkingMessage: Message = { sender: "bot", text: "Analizando imagen..." }
    setMessages(prev => [...prev, userImageMessage, thinkingMessage])

    const imageElement = document.createElement("img")
    imageElement.src = imageUrl

    imageElement.onload = async () => {
      const predictions = await model.predict(imageElement)
      const topPrediction = predictions.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      )

      let botResponseText: string
      if (topPrediction.probability > 0.8) {
        botResponseText =
          imageRecyclingInfo[topPrediction.className] ??
          "No pude identificar con claridad el objeto en la imagen. Intenta con otra foto."
      } else {
        botResponseText =
          "No estoy seguro de qué es esto. Asegúrate de que la imagen sea clara y el objeto esté bien iluminado."
      }

      // Reemplazar el mensaje "Analizando..." con la respuesta final
      const botMessage: Message = { sender: "bot", text: botResponseText }
      setMessages(prev => {
        const newMessages = prev.slice(0, -1) // Quita el mensaje "Analizando..."
        return [...newMessages, botMessage]
      })
      setIsPredicting(false)
    }

    // Limpiar el input para poder subir la misma imagen de nuevo
    event.target.value = ""
  }

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        {model ? <MessageSquare /> : <Loader className="animate-spin" />}
      </Button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setIsOpen(false)} />}

      {/* Contenedor del Chatbot */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Asistente de Reciclaje</h2>
                <p className="text-sm text-muted-foreground">Escribe tu duda y te ayudaré a reciclar.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <div className="flex-grow p-4 overflow-y-auto min-h-0">
            <ScrollArea className="h-full overflow-x-hidden" ref={scrollAreaRef}>
              <div className="flex flex-col gap-4 w-full">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-all ${
                      msg.sender === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.imageUrl ? (
                      <img
                        src={msg.imageUrl}
                        alt="Imagen subida por el usuario"
                        className="max-w-full h-auto rounded-md"
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <form className="flex w-full items-center gap-2 p-4 border-t" onSubmit={handleSendMessage}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={isPredicting || !model || !isOpen}>
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input placeholder="Escribe aquí..." value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isPredicting || !model || !isOpen} />
            <Button type="submit" size="icon" disabled={isPredicting || !model || !isOpen}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}