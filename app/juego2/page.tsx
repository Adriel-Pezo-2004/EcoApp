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
import { ArrowLeft, Gamepad2, Droplet } from "lucide-react" // Añadimos Droplet
import Link from "next/link"


// Estilos para el iframe responsivo (Proporción 4:3)
const iframeContainerStyles: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  paddingTop: "75%", 
}

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
      {/* NUEVO LAYOUT:
        Contenedor principal que usa flexbox para centrar 
        vertical y horizontalmente todo el contenido.
      */}
      <main className="flex flex-col justify-center items-center min-h-screen w-full p-4 sm:p-6 bg-background">
        
        {/* Envoltura para limitar el ancho del contenido */}
        <div className="w-full max-w-4xl">
          
          {/* Botón para regresar al Dashboard (alineado al inicio) */}
          <div className="mb-4 w-full">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>

          {/* Tarjeta que contiene el juego (ya centrada por el 'main') */}
          <Card className="overflow-hidden shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Droplet className="h-6 w-6 text-primary" /> {/* Nuevo ícono */}
                <CardTitle className="text-2xl font-bold">
                  Juego: Clean Ocean
                </CardTitle>
              </div>
              <CardDescription>
                ¡Ayuda a limpiar el océano de basura en este juego!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Contenedor responsivo del iframe */}
              <div style={iframeContainerStyles}>
                <iframe
                  // ¡NUEVA URL DEL JUEGO!
                  src="https://www.cokitos.com/limpiar-el-mar/play"
                  style={iframeStyles}
                  allowFullScreen
                  title="Juego Clean Ocean de Cokitos"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Juego proporcionado por{" "}
                <a
                  href="https://www.cokitos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Cokitos.com
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthGuard>
  )
}