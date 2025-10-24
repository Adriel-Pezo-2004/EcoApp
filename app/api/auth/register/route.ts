import { NextResponse } from "next/server"

/**
 * Handler mínimo y seguro para build:
 * - No importa Prisma ni otras dependencias en tiempo de build
 * - Responde GET/POST para evitar que Next intente "collect page data" y falle
 *
 * Reemplaza la lógica de creación de usuario (TODO) por tu implementación con Prisma
 * cuando tengas las variables de entorno y dependencias disponibles.
 */

export async function GET() {
  return NextResponse.json({ ok: true, message: "Endpoint de registro activo (fallback)" })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const email = body?.email
    const password = body?.password

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "email and password required" }, { status: 400 })
    }

    // TODO: reemplazar este bloque por la creación real de usuario con Prisma.
    // Ejemplo (no ejecutar aquí en build): await prisma.user.create({ data: { email, password: hash } })

    return NextResponse.json({
      ok: true,
      message: "Registro simulado — reemplaza con la lógica real de creación de usuario",
      payload: { email },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}