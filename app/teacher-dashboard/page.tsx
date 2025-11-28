"use client"

import { AuthGuard } from "@/components/auth-guard"
import TeacherDashboardComponent from "@/components/teacher-dashboard"

export default function TeacherDashboardPage() {
  return (
    <AuthGuard>
      {/* Simplemente renderizamos el componente, que ahora tiene sus propios datos de prueba */}
      <TeacherDashboardComponent />
    </AuthGuard>
  )
}