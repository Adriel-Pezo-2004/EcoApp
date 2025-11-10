"use client"
 
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Search, Filter, Play, Clock, Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"

interface QuizCard {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  imageUrl: string
  completed: boolean
  score?: number
  estimatedTime: string
  totalPoints: number
}

const allQuizzes: QuizCard[] = [
  {
    id: "1",
    title: "Fundamentos del Reciclaje",
    description: "Aprende los conceptos básicos del reciclaje y su importancia para el medio ambiente",
    difficulty: "easy",
    category: "Reciclaje Básico",
    imageUrl: "https://s1.significados.com/foto/reciclaje-og.jpg",
    completed: true,
    score: 85,
    estimatedTime: "5-8 min",
    totalPoints: 30,
  },
  { 
    id: "2",
    title: "Clasificación de Plásticos",
    description: "Identifica los diferentes tipos de plásticos y cómo reciclarlos correctamente",
    difficulty: "medium",
    category: "Plásticos",
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2070&auto=format&fit=crop",
    completed: false,
    estimatedTime: "8-12 min",
    totalPoints: 50,
  },
  {
    id: "3",
    title: "Reciclaje de Papel y Cartón",
    description: "Domina las técnicas para reciclar papel y cartón de forma eficiente.",
    difficulty: "easy",
    category: "Papel y Cartón",
    imageUrl: "https://www.smurfitkappa.com/sv/-/m/images/blog-thumbnail-931-x-642/recycling.jpg?rev=-1",
    completed: false,
    estimatedTime: "4-6 min",
    totalPoints: 20,
  },
  {
    id: "4",
    title: "Manejo de Residuos Electrónicos",
    description: "Aprende a desechar de forma segura tus aparatos electrónicos viejos.",
    difficulty: "medium",
    category: "Electrónicos",
    imageUrl: "https://cdn.shopify.com/s/files/1/0593/4235/6578/files/electronic-recycling_600x600.jpg?v=1736681101",
    completed: false,
    estimatedTime: "7-10 min",
    totalPoints: 40,
  },
  {
    id: "5",
    title: "El Arte del Compostaje",
    description: "Convierte tus residuos orgánicos en abono rico en nutrientes para tus plantas.",
    difficulty: "medium",
    category: "Orgánicos",
    imageUrl: "https://www.prisma.org.pe/wp-content/uploads/compost-en-casa-con-residuos-organicos.jpg",
    completed: false,
    estimatedTime: "10-15 min",
    totalPoints: 60,
  },
  {
    id: "6",
    title: "Todo sobre el Vidrio",
    description: "Descubre por qué el vidrio es un material infinitamente reciclable y cómo tratarlo.",
    difficulty: "easy",
    category: "Vidrio",
    imageUrl: "https://traperosdeemauslimaperu.org/images/2025/10/17/reciclaje-vidrio.jpg",
    completed: false,
    estimatedTime: "5-7 min",
    totalPoints: 30,
  },
]

const categories = ["Todos", "Reciclaje Básico", "Plásticos", "Papel y Cartón", "Electrónicos", "Orgánicos", "Vidrio"]
const difficulties = ["Todos", "easy", "medium", "hard"]

function QuizzesContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos")
 
  const filteredQuizzes = allQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || quiz.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "Todos" || quiz.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty;
  })

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
    };
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil"
      case "medium":
        return "Medio"
      case "hard":
        return "Difícil"
      default:
        return difficulty
    };
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-mobile container-tablet container-desktop py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              </Button>
              <Leaf className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Todos los Quizzes</h1>
                <p className="text-sm text-muted-foreground">{filteredQuizzes.length} quizzes disponibles</p>
              </div>
            </div> 
          </div>
        </div>
      </header>

      <main className="container-mobile container-tablet container-desktop py-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div> 
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent> 
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === "Todos" ? "Todos" : getDifficultyLabel(difficulty)}
                    </SelectItem>
                  ))}
                </SelectContent> 
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Grid */}
        {filteredQuizzes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No se encontraron quizzes</CardTitle>
              <CardDescription>
                Intenta ajustar los filtros o términos de búsqueda para encontrar más quizzes.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={quiz.imageUrl || "/placeholder.svg"}
                    alt={quiz.title}
                    className="w-full h-full object-cover"
                  />
                  {quiz.completed && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white">
                        <Trophy className="h-3 w-3 mr-1" />
                        {quiz.score}%
                      </Badge>
                    </div> 
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                      {getDifficultyLabel(quiz.difficulty)}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-balance leading-tight">{quiz.title}</CardTitle>
                  <CardDescription className="text-pretty">{quiz.description}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>{quiz.totalPoints} pts</span>
                    </div>
                  </div> 
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{quiz.category}</Badge>
                    <Button size="sm" asChild>
                      <Link href={`/quiz/${quiz.id}`}>
                        <Play className="h-4 w-4 mr-1" />
                        {quiz.completed ? "Repetir" : "Comenzar"}
                      </Link>
                    </Button> 
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div> 
  )
}

export default function QuizzesPage() {
  return (
    <AuthGuard>
      <QuizzesContent />
    </AuthGuard>
  )
}
