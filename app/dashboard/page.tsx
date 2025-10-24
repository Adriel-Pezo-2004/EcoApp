"use client"

import { useState, useRef, useEffect } from "react"
// 1. IMPORT DE PRISMA
import {
  User as PrismaUser,
  Quiz,
  QuizAttempt,
  Achievement,
  UserRole,
} from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Leaf,
  Trophy,
  BookOpen,
  Target,
  TrendingUp,
  Star,
  Play,
  Clock,
  Award,
  Users,
  LogOut,
  Gamepad2, // Icono para la nueva sección de juegos
  Droplet,
} from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import RecyclingChatbot from "@/components/chatbot" // Importando el Chatbot

// 2. DATOS SIMULADOS DE QUIZZES
const mockQuizzes: Quiz[] = [
  {
    id: "clx123abc",
    title: "Conceptos Básicos de Reciclaje",
    description: "Aprende qué va en cada contenedor de color.",
    category: "General",
    difficulty: "easy",
    imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fes%2Fvector%2Frecycling-icon-cartoon-style-117614716.html&psig=AOvVaw2glehSYzm3TfGbhGv_CiDI&ust=1761408045109000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjH5rqavZADFQAAAAAdAAAAABAE", // Asegúrate de tener o cambiar esta imagen
    isActive: true, // Este quiz se mostrará
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "clx123def",
    title: "Identificación de Plásticos",
    description: "Domina los 7 tipos de plásticos y su reciclabilidad.",
    category: "Plásticos",
    difficulty: "medium",
    imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fes%2Fvector%2Frecycling-icon-cartoon-style-117614716.html&psig=AOvVaw2glehSYzm3TfGbhGv_CiDI&ust=1761408045109000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjH5rqavZADFQAAAAAdAAAAABAE",
    isActive: true, // Este quiz se mostrará
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "clx123ghi",
    title: "El Arte del Compostaje",
    description: "Conviértete en un maestro compostador en casa.",
    category: "Orgánicos",
    difficulty: "hard",
    imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fes%2Fvector%2Frecycling-icon-cartoon-style-117614716.html&psig=AOvVaw2glehSYzm3TfGbhGv_CiDI&ust=1761408045109000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjH5rqavZADFQAAAAAdAAAAABAE",
    isActive: true, // Este quiz se mostrará
    createdAt: new Date(),
    updatedAt: new Date(),
  },
   {
    id: "clx123jkl",
    title: "Quiz Oculto (En Mantenimiento)",
    description: "Este quiz no debería aparecer en la lista.",
    category: "General",
    difficulty: "easy",
    imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fes%2Fvector%2Frecycling-icon-cartoon-style-117614716.html&psig=AOvVaw2glehSYzm3TfGbhGv_CiDI&ust=1761408045109000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjH5rqavZADFQAAAAAdAAAAABAE",
    isActive: false, // Este quiz NO se mostrará
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
// --- FIN DE DATOS SIMULADOS ---

// Tipo para los datos completos del usuario según el esquema Prisma
export type FullUserData = PrismaUser & {
  quizAttempts: (QuizAttempt & { quiz: Quiz })[]
  achievements: Achievement[]
  students: PrismaUser[]
}

// -------------------------------------------------------------------
// 3. USUARIO SIMULADO (PARA DIAGNÓSTICO)
// -------------------------------------------------------------------
const mockStudentUser: FullUserData = {
  id: "mock-student-id",
  email: "estudiante@prueba.com",
  name: "Estudiante de Prueba",
  password: "hashedpassword",
  avatar: "https://i.pravatar.cc/150?img=5",
  level: 2,
  points: 650,
  badges: ["Bienvenida"], // Campo de tu esquema Prisma
  role: "STUDENT",
  teacherId: "mock-teacher-id",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Relaciones (esto es crucial, tu tipo FullUserData las requiere)
  achievements: [
    {
      id: "ach1",
      userId: "mock-student-id",
      name: "Primeros Pasos",
      description: "Completaste tu primer quiz.",
      icon: "star",
      unlockedAt: new Date(),
    },
    {
      id: "ach2",
      userId: "mock-student-id",
      name: "Eco-Aprendiz",
      description: "Llegaste a nivel 2.",
      icon: "leaf",
      unlockedAt: new Date(),
    },
  ],
  quizAttempts: [
    {
      id: "attempt1",
      userId: "mock-student-id",
      quizId: "clx123abc", // Coincide con el primer mockQuiz
      score: 80,
      totalPoints: 100,
      answers: {}, // Simulado
      completedAt: new Date(),
      quiz: mockQuizzes[0], // Objeto Quiz anidado
    },
  ],
  students: [], // Un estudiante no tiene estudiantes
}

// Opcional: un profesor simulado para probar
const mockTeacherUser: FullUserData = {
  id: "mock-teacher-id",
  email: "profesor@prueba.com",
  name: "Profesor Oak",
  password: "hashedpassword",
  avatar: "https://i.pravatar.cc/150?img=10",
  level: 10,
  points: 9000,
  badges: ["Guía Experto"],
  role: "TEACHER",
  teacherId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  
  // Relaciones
  achievements: [], // Un profesor no necesita logros de estudiante
  quizAttempts: [], // Ni intentos de quiz
  students: [ // Un profesor SÍ tiene estudiantes
    { ...mockStudentUser, id: "student-1", name: "Ash Ketchum", points: 800, email: "ash@test.com", password: "123", avatar: null, level: 3, badges: [], role: "STUDENT", teacherId: "mock-teacher-id", createdAt: new Date(), updatedAt: new Date(), achievements: [], quizAttempts: [], students: [] },
    { ...mockStudentUser, id: "student-2", name: "Misty Waterflower", points: 1200, email: "misty@test.com", password: "123", avatar: null, level: 5, badges: [], role: "STUDENT", teacherId: "mock-teacher-id", createdAt: new Date(), updatedAt: new Date(), achievements: [], quizAttempts: [], students: [] },
    { ...mockStudentUser, id: "student-3", name: "Brock Slate", points: 500, email: "brock@test.com", password: "123", avatar: null, level: 2, badges: [], role: "STUDENT", teacherId: "mock-teacher-id", createdAt: new Date(), updatedAt: new Date(), achievements: [], quizAttempts: [], students: [] },
  ],
}
// --- FIN DE USUARIO SIMULADO ---


// -------------------------------------------------------------------
// COMPONENTE HIJO: DashboardContent (Recibe props)
// -------------------------------------------------------------------
function DashboardContent({
  user,
  quizzes,
}: {
  user: FullUserData
  quizzes: Quiz[]
}) {
  const router = useRouter()

  // Panel para profesores
  if (user.role === "TEACHER") {
    return (
      <div className="container-mobile container-tablet container-desktop py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Panel de Profesor</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout()
              router.push("/")
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
        <h2 className="font-bold text-xl mb-4">Ranking de Estudiantes</h2>
        <Card>
          <CardContent className="p-4">
            <ul className="space-y-2">
              {Array.isArray(user.students) && user.students.length > 0 ? (
                user.students
                  .sort((a, b) => b.points - a.points) // Ordena por puntos
                  .map((student, index) => (
                    <li
                      key={student.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold w-6 text-center">{index + 1}.</span>
                        <span>{student.name}</span>
                      </div>
                      <Badge variant="secondary">{student.points} pts</Badge>
                    </li>
                  ))
              ) : (
                <p className="text-muted-foreground">
                  Aún no tienes estudiantes.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
        <h2 className="font-bold text-xl mt-8 mb-4">
          Resultados de Quizzes (Próximamente)
        </h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">
              Aquí podrás ver un resumen detallado del progreso de tus
              estudiantes.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- Panel para Estudiantes ---

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Lógica para progreso (asumiendo 500 puntos por nivel)
  const pointsPerLevel = 500
  const currentLevelPoints = user.points % pointsPerLevel
  const progressPercentage = (currentLevelPoints / pointsPerLevel) * 100
  const pointsToNextLevel = pointsPerLevel - currentLevelPoints

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-mobile container-tablet container-desktop py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">EcoQuiz</h1>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="hidden sm:flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{user.points} pts</span>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="container-mobile container-tablet container-desktop py-6 space-y-8">
        {/* Welcome Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-3xl font-bold text-balance">
                ¡Hola, {user.name.split(" ")[0]}!
              </h2>
              <p className="text-muted-foreground text-pretty">
                Continúa tu viaje de aprendizaje sobre reciclaje
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Nivel {user.level}
              </Badge>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{user.points}</p>
                      <p className="text-xs text-muted-foreground">Puntos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {user.quizAttempts.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Completados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{user.level}</p>
                      <p className="text-xs text-muted-foreground">Nivel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHoverVariants.hover}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {user.achievements.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Insignias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHoverVariants.hover}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tu Progreso
                </CardTitle>
                <CardDescription>
                  Sigue avanzando hacia el siguiente nivel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Nivel {user.level}</span>
                    <span>Nivel {user.level + 1}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {pointsToNextLevel} puntos para el siguiente nivel
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
        
        {/* ========================================================== */}
        {/* SECCIÓN DE QUIZZES (ACTUALIZADA CON TU LÓGICA)             */}
        {/* ========================================================== */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-balance">
              Quizzes Disponibles
            </h3>
            <Button variant="outline" size="sm" asChild>
              <Link href="/quizzes">Ver Todos</Link>
            </Button>
          </motion.div>

          {/* Only show quizzes that can be taken (isActive !== false) */}
          {(() => {
            const availableQuizzes = quizzes.filter((q) => q.isActive !== false)
            if (availableQuizzes.length === 0) {
              return (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground">No hay quizzes disponibles ahora mismo.</p>
                  </CardContent>
                </Card>
              )
            }

            return (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {availableQuizzes.map((quiz, index) => {
                  const attempt = user.quizAttempts.find((a) => a.quizId === quiz.id)
                  const isCompleted = !!attempt
                  const score =
                    attempt && attempt.totalPoints > 0
                      ? Math.round((attempt.score / attempt.totalPoints) * 100)
                      : 0

                  return (
                    <motion.div
                      key={quiz.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={quiz.imageUrl || "/placeholder.svg"}
                            alt={quiz.title}
                            className="w-full h-full object-cover"
                          />
                          {isCompleted && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                            >
                              <Badge className="bg-green-500 text-white">
                                <Trophy className="h-3 w-3 mr-1" />
                                {score}%
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg text-balance leading-tight">
                              {quiz.title}
                            </CardTitle>
                            <Badge
                              className={getDifficultyColor(quiz.difficulty)}
                              variant="secondary"
                            >
                              {quiz.difficulty}
                            </Badge>
                          </div>
                          <CardDescription className="text-pretty">
                            {quiz.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>5-10 min</span>
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/quiz/${quiz.id}`}>
                                <Play className="h-4 w-4 mr-1" />
                                {isCompleted ? "Repetir" : "Comenzar"}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )
          })()}
        </motion.section>

        {/* ========================================================== */}
        {/* NUEVA SECCIÓN DE JUEGOS (AÑADIDA SEGÚN TU SOLICITUD)      */}
        {/* ========================================================== */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <motion.div className="flex items-center justify-between mb-4" variants={itemVariants}>
            <h3 className="text-2xl font-bold text-balance">Juegos</h3>
            <p className="text-sm text-muted-foreground">Diviértete y refuerza lo aprendido</p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                    <CardTitle>Recycling Time 2</CardTitle>
                  </div>
                  <CardDescription>Selecciona el residuo y llévalo a cada contenedor correcto</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/juego1">Jugar</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                    <CardTitle>Clean Ocean</CardTitle>
                  </div>
                  <CardDescription>Ayuda a que los animales tengan un entorno limpio</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href="/juego2">Jugar</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h3
            className="text-2xl font-bold mb-6"
            variants={itemVariants}
          >
            Tus Insignias
          </motion.h3>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={containerVariants}
          >
            {user.achievements.length > 0 ? (
              user.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="text-center p-4">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-balance">
                      {achievement.name}
                    </p>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.p
                variants={itemVariants}
                className="text-muted-foreground col-span-full"
              >
                Aún no has ganado insignias. ¡Sigue jugando!
              </motion.p>
            )}
          </motion.div>
        </motion.section>

        {/* Community Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Únete a la Comunidad
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Conecta con otros eco-warriors y comparte tus logros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" asChild>
                <Link href="/community">Explorar Comunidad</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  )
} // Fin de DashboardContent


// -------------------------------------------------------------------
// COMPONENTE PADRE: DashboardPage (Maneja la carga de datos)
// -------------------------------------------------------------------
export default function DashboardPage() {
  const [user, setUser] = useState<FullUserData | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  // -----------------------------------------------------------------
  // USEEFFECT USANDO EL USUARIO SIMULADO
  // -----------------------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // --- SIMULACIÓN ---
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // Elige qué usuario probar:
        const usuario = mockStudentUser; 
        // const usuario = mockTeacherUser; // <-- Descomenta esta para probar el rol de profesor

        setUser(usuario); // Usamos el usuario simulado
        
        // --- FIN SIMULACIÓN ---
        
        /*
        // --- CÓDIGO REAL (descomenta esto cuando `getCurrentUser` funcione) ---
        // const usuario = await getCurrentUser()
        // setUser(usuario)
        // --- FIN CÓDIGO REAL ---
        */

        setQuizzes(mockQuizzes)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  
  return (
    <AuthGuard>
      {/* El Chatbot está ahora en el layout.tsx o aquí.
          Si lo moviste al layout, borra esta línea.
          Si no, déjala aquí. */}
      <RecyclingChatbot />

      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          Cargando...
        </div>
      )}

      {!loading && !user && (
        <div className="flex justify-center items-center min-h-screen">
          Error: No se pudo cargar el usuario. (Revisa `lib/auth.ts`)
        </div>
      )}

      {!loading && user && (
        <DashboardContent user={user} quizzes={quizzes} />
      )}
    </AuthGuard>
  )
}