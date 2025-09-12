"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy, Clock, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  points: number
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  imageUrl: string
  questions: Question[]
}

const mockQuizzes: Record<string, Quiz> = {
  "1": {
    id: "1",
    title: "Fundamentos del Reciclaje",
    description: "Aprende los conceptos básicos del reciclaje",
    difficulty: "easy",
    category: "Reciclaje Básico",
    imageUrl: "/recycling-basics.jpg",
    questions: [
      {
        id: "1",
        question: "¿Cuál es el símbolo universal del reciclaje?",
        options: ["Tres flechas en círculo", "Una hoja verde", "Un contenedor azul", "Una botella"],
        correct: 0,
        points: 10,
        explanation:
          "El símbolo de reciclaje consiste en tres flechas que forman un triángulo, representando el ciclo continuo de reducir, reutilizar y reciclar.",
      },
      {
        id: "2",
        question: "¿Qué significa la regla de las 3 R?",
        options: [
          "Reducir, Reutilizar, Reciclar",
          "Recoger, Revisar, Reparar",
          "Renovar, Restaurar, Reconstruir",
          "Ninguna de las anteriores",
        ],
        correct: 0,
        points: 10,
        explanation:
          "Las 3 R son: Reducir el consumo, Reutilizar productos y materiales, y Reciclar lo que ya no se puede usar.",
      },
      {
        id: "3",
        question: "¿Cuál de estos materiales NO es reciclable?",
        options: ["Papel", "Vidrio", "Pañales desechables", "Latas de aluminio"],
        correct: 2,
        points: 10,
        explanation:
          "Los pañales desechables contienen múltiples materiales difíciles de separar y no son reciclables en los sistemas convencionales.",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Clasificación de Plásticos",
    description: "Identifica los diferentes tipos de plásticos",
    difficulty: "medium",
    category: "Plásticos",
    imageUrl: "/plastic-recycling-types.jpg",
    questions: [
      {
        id: "1",
        question: "¿Qué significa el número 1 en el símbolo de reciclaje de plásticos?",
        options: ["PET", "HDPE", "PVC", "LDPE"],
        correct: 0,
        points: 15,
        explanation:
          "El número 1 corresponde al PET (Polietileno Tereftalato), comúnmente usado en botellas de agua y refrescos.",
      },
      {
        id: "2",
        question: "¿Cuál es el plástico más comúnmente reciclado?",
        options: ["PVC", "PET", "Poliestireno", "Polipropileno"],
        correct: 1,
        points: 15,
        explanation:
          "El PET es el plástico más reciclado debido a su uso extensivo en botellas y su facilidad de procesamiento.",
      },
    ],
  },
}

function QuizContent() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  const quiz = mockQuizzes[quizId]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (!quizStarted || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, showResults])

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Quiz no encontrado</CardTitle>
            <CardDescription>El quiz que buscas no existe o ha sido eliminado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Volver al Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }

  const handleNext = () => {
    setDirection(1)
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    setDirection(-1)
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    let totalPoints = 0

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points
      if (selectedAnswers[index] === question.correct) {
        correct += question.points
      }
    })

    return { correct, totalPoints, percentage: Math.round((correct / totalPoints) * 100) }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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

  if (!quizStarted) {
    return (
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header
          className="border-b bg-card/50 backdrop-blur-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container-mobile container-tablet container-desktop py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Volver
                </Link>
              </Button>
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-semibold">EcoQuiz</span>
            </div>
          </div>
        </motion.header>

        <main className="container-mobile container-tablet container-desktop py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="aspect-video relative overflow-hidden rounded-lg mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src={quiz.imageUrl || "/placeholder.svg"} alt={quiz.title} className="w-full h-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-balance">{quiz.title}</CardTitle>
                      <CardDescription className="text-pretty mt-2">{quiz.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>10 minutos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>{quiz.questions.reduce((acc, q) => acc + q.points, 0)} puntos</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Instrucciones:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Lee cada pregunta cuidadosamente</li>
                      <li>Selecciona la respuesta que consideres correcta</li>
                      <li>Puedes navegar entre preguntas antes de finalizar</li>
                      <li>Tienes 10 minutos para completar el quiz</li>
                    </ul>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" className="w-full" onClick={() => setQuizStarted(true)}>
                      Comenzar Quiz
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </motion.div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container-mobile container-tablet container-desktop py-4">
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-semibold">EcoQuiz - Resultados</span>
            </div>
          </div>
        </header>

        <main className="container-mobile container-tablet container-desktop py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Results Summary */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="text-center">
                <CardHeader>
                  <motion.div
                    className="mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {score.percentage >= 70 ? (
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-500" />
                    )}
                  </motion.div>
                  <CardTitle className="text-2xl">
                    {score.percentage >= 70 ? "¡Felicidades!" : "Sigue practicando"}
                  </CardTitle>
                  <CardDescription>
                    {score.percentage >= 70
                      ? "Has completado el quiz exitosamente"
                      : "Puedes intentarlo de nuevo para mejorar tu puntuación"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    className="text-4xl font-bold text-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {score.percentage}%
                  </motion.div>
                  <p className="text-muted-foreground">
                    {score.correct} de {score.totalPoints} puntos
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild>
                      <Link href="/dashboard">Volver al Dashboard</Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Intentar de nuevo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Question Review */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold">Revisión de Respuestas</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index]
                const isCorrect = userAnswer === question.correct
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-lg text-balance">{question.question}</CardTitle>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Tu respuesta:</span>{" "}
                                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                  {userAnswer !== undefined ? question.options[userAnswer] : "Sin respuesta"}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm">
                                  <span className="font-medium">Respuesta correcta:</span>{" "}
                                  <span className="text-green-600">{question.options[question.correct]}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      {question.explanation && (
                        <CardContent className="pt-0">
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm text-pretty">{question.explanation}</p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </main>
      </motion.div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-mobile container-tablet container-desktop py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 text-primary" />
              <div>
                <span className="font-semibold">{quiz.title}</span>
                <p className="text-sm text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {quiz.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 60 ? "text-red-500 font-medium" : ""}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      </motion.header>

      <main className="container-mobile container-tablet container-desktop py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-balance">{question.question}</CardTitle>
                  <CardDescription>{question.points} puntos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={selectedAnswers[currentQuestion]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(currentQuestion, Number.parseInt(value))}
                  >
                    {question.options.map((option, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 text-pretty cursor-pointer">
                          {option}
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}>
                        {currentQuestion === quiz.questions.length - 1 ? "Finalizar" : "Siguiente"}
                        {currentQuestion !== quiz.questions.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default function QuizPage() {
  return (
    <AuthGuard>
      <QuizContent />
    </AuthGuard>
  )
}
