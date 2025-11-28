"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogOut, Crown, Award, Star, CheckCircle, BarChart, Clock } from "lucide-react"
import { logout } from "@/lib/auth"

// Datos ficticios para el ranking
const mockStudents = [
  { id: "1", name: "Juan García", points: 1250, quizzesCompleted: 15, averageScore: 88, lastActivity: "hace 2 horas" },
  { id: "2", name: "María Mamani", points: 1100, quizzesCompleted: 12, averageScore: 92, lastActivity: "hace 1 día" },
  { id: "3", name: "Carlos Quispe", points: 980, quizzesCompleted: 10, averageScore: 85, lastActivity: "hace 5 horas" },
  { id: "4", name: "Sofía Carpio", points: 850, quizzesCompleted: 9, averageScore: 80, lastActivity: "hace 3 días" },
  { id: "5", name: "Luis Caceres", points: 720, quizzesCompleted: 7, averageScore: 75, lastActivity: "hace 1 semana" },
]

// Tipos para los datos de los estudiantes
type StudentData = (typeof mockStudents)[0]

const rankingIcons = [
  <Crown key="1" className="h-5 w-5 text-yellow-400" />,
  <Award key="2" className="h-5 w-5 text-gray-400" />,
  <Star key="3" className="h-5 w-5 text-yellow-600" />,
]

export default function TeacherDashboard() {
  const router = useRouter()
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden p-4">
      {/* Fondo animado */}
      <div className="absolute inset-0 z-0 opacity-50">
        <motion.div
          className="absolute top-[5%] left-[10%] h-72 w-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            rotate: [0, 180, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 40, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] h-80 w-80 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [100, -100, 100],
            y: [50, -150, 50],
            rotate: [0, -180, 0],
            scale: [1.1, 0.8, 1.1],
          }}
          transition={{ duration: 50, repeat: Infinity, repeatType: "mirror", delay: 5 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-balance">Panel de Profesor</h1>
          <Button
            variant="ghost"
            onClick={() => {
              logout()
              router.push("/")
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-full bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="font-bold text-2xl mb-4 text-center">Ranking de Estudiantes</h2>
              <ul className="space-y-3">
                {mockStudents
                  .sort((a, b) => b.points - a.points)
                  .map((student, index) => (
                    <motion.li
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg w-8 text-center text-muted-foreground">
                          {index < 3 ? rankingIcons[index] : `${index + 1}.`}
                        </span>
                        <span className="font-medium">{student.name}</span>
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"} className="text-sm">
                        {student.points} pts
                      </Badge>
                    </motion.li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal de Detalles del Estudiante */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedStudent?.name}</DialogTitle>
            <DialogDescription>Resumen de actividad del estudiante.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5" /> Quizzes Completados
              </span>
              <span className="font-bold text-lg">{selectedStudent?.quizzesCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <BarChart className="h-5 w-5" /> Puntaje Promedio
              </span>
              <span className="font-bold text-lg">{selectedStudent?.averageScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" /> Última Actividad
              </span>
              <span className="font-bold text-lg">{selectedStudent?.lastActivity}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
