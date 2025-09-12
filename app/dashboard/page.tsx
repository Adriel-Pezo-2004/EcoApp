"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Leaf, Trophy, BookOpen, Target, TrendingUp, Star, Play, Clock, Award, Users, LogOut } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface QuizCard {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  imageUrl: string
  completed: boolean
  score?: number
}

const mockQuizzes: QuizCard[] = [
  {
    id: "1",
    title: "Fundamentos del Reciclaje",
    description: "Aprende los conceptos básicos del reciclaje",
    difficulty: "easy",
    category: "Reciclaje Básico",
    imageUrl: "/recycling-basics.jpg",
    completed: true,
    score: 85,
  },
  {
    id: "2",
    title: "Clasificación de Plásticos",
    description: "Identifica los diferentes tipos de plásticos",
    difficulty: "medium",
    category: "Plásticos",
    imageUrl: "/plastic-recycling-types.jpg",
    completed: false,
  },
  {
    id: "3",
    title: "Reciclaje de Papel",
    description: "Todo sobre el reciclaje de papel y cartón",
    difficulty: "easy",
    category: "Papel y Cartón",
    imageUrl: "/paper-recycling.png",
    completed: false,
  },
  {
    id: "4",
    title: "Residuos Electrónicos",
    description: "Manejo responsable de e-waste",
    difficulty: "hard",
    category: "Electrónicos",
    imageUrl: "/electronic-waste-recycling.png",
    completed: false,
  },
]

function DashboardContent() {
  const [user, setUser] = useState(getCurrentUser())
  const router = useRouter()

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

  if (!user) return null

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
        <motion.section variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-3xl font-bold text-balance">¡Hola, {user.name.split(" ")[0]}!</h2>
              <p className="text-muted-foreground text-pretty">Continúa tu viaje de aprendizaje sobre reciclaje</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Nivel {user.level}
              </Badge>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" variants={containerVariants}>
            <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
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

            <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{mockQuizzes.filter((q) => q.completed).length}</p>
                      <p className="text-xs text-muted-foreground">Completados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
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

            <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{user.badges.length}</p>
                      <p className="text-xs text-muted-foreground">Insignias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Progress Section */}
          <motion.div variants={itemVariants} whileHover={cardHoverVariants.hover}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tu Progreso
                </CardTitle>
                <CardDescription>Sigue avanzando hacia el siguiente nivel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Nivel {user.level}</span>
                    <span>Nivel {user.level + 1}</span>
                  </div>
                  <Progress value={((user.points % 500) / 500) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {500 - (user.points % 500)} puntos para el siguiente nivel
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Quizzes Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
            <h3 className="text-2xl font-bold text-balance">Quizzes Disponibles</h3>
            <Button variant="outline" size="sm" asChild>
              <Link href="/quizzes">Ver Todos</Link>
            </Button>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
            {mockQuizzes.map((quiz, index) => (
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
                    {quiz.completed && (
                      <motion.div
                        className="absolute top-2 right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Badge className="bg-green-500 text-white">
                          <Trophy className="h-3 w-3 mr-1" />
                          {quiz.score}%
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg text-balance leading-tight">{quiz.title}</CardTitle>
                      <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-pretty">{quiz.description}</CardDescription>
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
                          {quiz.completed ? "Repetir" : "Comenzar"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section variants={containerVariants} initial="hidden" animate="visible">
          <motion.h3 className="text-2xl font-bold mb-6" variants={itemVariants}>
            Tus Insignias
          </motion.h3>
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" variants={containerVariants}>
            {user.badges.map((badge, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card className="text-center p-4">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-balance">{badge}</p>
                </Card>
              </motion.div>
            ))}
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
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
