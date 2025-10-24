import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextResponse } from "next/server"

/**
 * Handler seguro: intenta inicializar NextAuth pero tiene un fallback
 * para que la build no falle si faltan variables o hay errores en tiempo de build.
 *
 * NOTA: reemplaza la lógica de authorize por tu validación real (Prisma, etc.)
 * cuando soluciones las variables de entorno y dependencias.
 */

let handler: any = async (req: Request) => {
  return NextResponse.json({ ok: false, message: "Auth temporalmente no disponible" })
}

try {
  const providers = [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        // TODO: reemplazar por validación real (Prisma)
        return { id: "temp-user", name: credentials.email, email: credentials.email }
      },
    }),
  ]

  const options = {
    providers,
    secret: process.env.NEXTAUTH_SECRET || undefined,
    session: { strategy: "jwt" as const },
  }

  // NextAuth devuelve un handler que expone GET/POST
  handler = NextAuth(options)
} catch (err) {
  // Evita que la build falle; muestra el error en logs para que lo revises.
  // No modificar esto hasta tener las vars/deps correctas.
  // eslint-disable-next-line no-console
  console.error("NextAuth init failed (safe fallback):", err)
}

export { handler as GET, handler as POST }