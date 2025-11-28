"use client"

import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center">
      <h1 className="text-2xl font-bold">Esta página ha sido movida.</h1>
      <p className="text-muted-foreground">Serás redirigido desde el login a tu dashboard correcto.</p>
      <Link href="/login" className="mt-4 text-primary hover:underline">
        Volver al Login
      </Link>
    </div>
  )
}