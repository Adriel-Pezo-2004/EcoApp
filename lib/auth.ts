import { getServerSession } from "next-auth/next"
import { signOut } from "next-auth/react"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

/**
 * Obtiene los datos del usuario de la sesión del servidor.
 * Esta función es segura para usar tanto en el cliente como en el servidor.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

/**
 * Cierra la sesión del usuario.
 */
export function logout(): void {
  signOut({ callbackUrl: "/" })
}
