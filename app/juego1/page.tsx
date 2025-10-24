"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import Link from "next/link"

// Estilos para el iframe responsivo
// Ajustado a la proporción 1000x600 (600 / 1000 = 0.6 = 60%)
const iframeContainerStyles: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  paddingTop: "60.0%", // Proporción 5:3 
}

// Esto hace que el iframe llene el contenedor
const iframeStyles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: "100%",
  height: "100%",
  border: "none",
}

export default function JuegoPage() {
  return (
    <AuthGuard>
      <main className="container-mobile container-tablet container-desktop py-6 space-y-6">
        {/* Botón para regresar al Dashboard */}
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>

        {/* Tarjeta que contiene el juego */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">
                Juego: Recycling Time 2
              </CardTitle>
            </div>
            <CardDescription>
              ¡Clasifica la basura correctamente antes de que se acabe el tiempo!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Contenedor responsivo del iframe */}
            <div style={iframeContainerStyles}>
              <iframe
                // URL ACTUALIZADA
                src="https://www.cokoplay.com/games/recycling-time-2/"
                style={iframeStyles}
                allowFullScreen
                scrolling="no" // Añadido de tu snippet
              />
            </div>
            
          </CardContent>
        </Card>
      </main>
    </AuthGuard>
  )
}