"use client"

import * as tmImage from "@teachablemachine/image"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { MessageSquare, Camera, X, Loader, AlertTriangle } from "lucide-react"

// Definimos los mensajes para cada tipo de residuo
const recyclingInfo: { [key: string]: { title: string; description: string } } = {
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
}

export default function RecyclingChatbot() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [prediction, setPrediction] = useState<{ title: string; description: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const webcamRef = useRef<tmImage.Webcam | null>(null)
  const requestRef = useRef<number>()

  const MODEL_URL = "/model/model.json"
  const METADATA_URL = "/model/metadata.json"

  // Carga el modelo una sola vez
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

  const setupWebcam = async () => {
    if (!webcamRef.current) {
      const flip = true // Invertir la cámara para que funcione como un espejo
      const webcam = new tmImage.Webcam(300, 300, flip)
      await webcam.setup()
      webcamRef.current = webcam
      document.getElementById("webcam-container")?.appendChild(webcam.canvas)
      setIsCameraReady(true)
      webcam.play()
      requestRef.current = requestAnimationFrame(loop)
    }
  }

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update()
      await predict()
      requestRef.current = requestAnimationFrame(loop)
    }
  }

  const predict = async () => {
    if (model && webcamRef.current?.canvas) {
      const predictions = await model.predict(webcamRef.current.canvas)
      const topPrediction = predictions.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      )

      // --- LÓGICA MEJORADA ---
      // Si la clase es "Persona", muestra el mensaje especial.
      if (topPrediction.className === "Persona" && topPrediction.probability > 0.8) {
        setPrediction({
          title: "Persona Detectada",
          description: "Esto no parece ser un residuo. No sé cómo clasificar a una persona, ¡pero recuerda reciclar!",
        })
      } else if (recyclingInfo[topPrediction.className] && topPrediction.probability > 0.8) {
        // Si es una de las clases de residuos, muestra su información.
        setPrediction(recyclingInfo[topPrediction.className])
      } else {
        // Si no está seguro, no muestra nada.
        setPrediction(null)
      }
    }
  }

  const handleOpen = async (open: boolean) => {
    if (open && model) {
      setIsLoading(true)
      await setupWebcam()
      setIsLoading(false)
    } else {
      // Detener la cámara y limpiar recursos
      if (webcamRef.current) {
        await webcamRef.current.stop()
        const container = document.getElementById("webcam-container")
        if (container) container.innerHTML = ""
        webcamRef.current = null
        setIsCameraReady(false)
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
      setPrediction(null)
    }
  }

  return (
    <Drawer onOpenChange={handleOpen}>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        size="icon"
        onClick={() => document.querySelector('[vaul-drawer-trigger=""]')?.dispatchEvent(new MouseEvent('click'))}
        disabled={!model}
      >
        {!model ? <Loader className="animate-spin" /> : <MessageSquare />}
      </Button>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Asistente de Reciclaje</DrawerTitle>
            <DrawerDescription>
              Apunta con la cámara a un objeto para saber cómo reciclarlo.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <div
              id="webcam-container"
              className="w-[300px] h-[300px] mx-auto bg-muted rounded-md flex items-center justify-center"
            >
              {isLoading && <Loader className="animate-spin" />}
            </div>

            {prediction && (
              <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
                <h3 className="font-bold text-lg flex items-center justify-center gap-2">
                  {prediction.title === "Persona Detectada" && (
                    <AlertTriangle className="text-yellow-500" />
                  )}
                  {prediction.title}
                </h3>
                <p className="text-sm text-muted-foreground">{prediction.description}</p>
              </div>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}