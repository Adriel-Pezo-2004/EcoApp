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
import { AuthGuard } from "@/components/auth-guard" // Asegúrate de que AuthGuard no interfiera con las pruebas si no es necesario
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
    imageUrl: "https://s1.significados.com/foto/reciclaje-og.jpg",
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
      {
        id: "4",
        question: "¿Qué color de contenedor se usa generalmente para el papel y cartón?",
        options: ["Verde", "Azul", "Amarillo", "Gris"],
        correct: 1,
        points: 10,
        explanation:
          "El contenedor azul es el estándar en muchos lugares para depositar papel y cartón, facilitando su recolección y reciclaje.",
      },
      {
        id: "5",
        question: "¿Por qué es importante lavar los envases antes de reciclarlos?",
        options: ["Para que huelan bien", "Para evitar la contaminación de otros materiales", "Es un mito, no es necesario", "Para que ocupen menos espacio"],
        correct: 1,
        points: 10,
        explanation:
          "Lavar los envases elimina restos de comida y otros contaminantes que pueden arruinar lotes enteros de material reciclable, especialmente el papel.",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Clasificación de Plásticos",
    description: "Identifica los diferentes tipos de plásticos",
    difficulty: "medium",
    category: "Plásticos",
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2070&auto=format&fit=crop",
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
      {
        id: "3",
        question: "¿Qué tipo de plástico (HDPE) se encuentra comúnmente en envases de leche y detergente?",
        options: ["1 (PET)", "2 (HDPE)", "3 (PVC)", "5 (PP)"],
        correct: 1,
        points: 15,
        explanation:
          "El número 2 (HDPE o Polietileno de Alta Densidad) es un plástico rígido utilizado para envases de leche, detergentes y otros productos de limpieza.",
      },
      {
        id: "4",
        question: "El poliestireno (unicel o telgopor), marcado con el número 6, es...",
        options: ["Fácilmente reciclable en cualquier contenedor", "No reciclable en la mayoría de los sistemas", "Compostable", "Se recicla con el cartón"],
        correct: 1,
        points: 15,
        explanation:
          "El poliestireno (PS) es técnicamente reciclable, pero muy pocos centros lo aceptan debido a su bajo peso y alto volumen, lo que lo hace poco rentable.",
      },
      {
        id: "5",
        question: "¿Qué significa el número 7 en la clasificación de plásticos?",
        options: ["Es el más seguro para alimentos", "Es una mezcla de varios plásticos o 'Otros'", "Es exclusivo para juguetes", "Es biodegradable"],
        correct: 1,
        points: 15,
        explanation:
          "El número 7 agrupa a una variedad de plásticos que no encajan en las otras categorías, como el policarbonato (PC) y nuevas resinas, lo que dificulta su reciclaje.",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Reciclaje de Papel y Cartón",
    description: "Domina las técnicas para reciclar papel y cartón de forma eficiente.",
    difficulty: "easy",
    category: "Papel y Cartón",
    imageUrl: "https://www.smurfitkappa.com/sv/-/m/images/blog-thumbnail-931-x-642/recycling.jpg?rev=-1",
    questions: [
      {
        id: "1",
        question: "¿Se puede reciclar el cartón de una caja de pizza con grasa?",
        options: ["Sí, siempre", "No, la grasa contamina el papel", "Solo si se quita el queso", "Sí, pero en el contenedor de orgánicos"],
        correct: 1,
        points: 10,
        explanation: "La grasa y los restos de comida contaminan las fibras del papel, impidiendo que se reciclen correctamente. Solo las partes limpias del cartón son reciclables.",
      },
      {
        id: "2",
        question: "¿Qué tipo de papel NO se debe reciclar en el contenedor azul?",
        options: ["Periódicos y revistas", "Papel de cocina usado", "Folios de oficina", "Cajas de cereales"],
        correct: 1,
        points: 10,
        explanation: "El papel de cocina, servilletas o pañuelos usados están contaminados con materia orgánica y deben ir al contenedor de restos o al de compostaje si es posible.",
      },
      {
        id: "3",
        question: "¿Es necesario quitar las cintas adhesivas y grapas de las cajas de cartón?",
        options: ["Sí, siempre se debe quitar todo", "No, los procesos de reciclaje modernos pueden separarlos", "Solo si la cinta es de plástico", "Depende del color del cartón"],
        correct: 1,
        points: 10,
        explanation: "Aunque se agradece, no es estrictamente necesario. Las plantas de reciclaje tienen sistemas para separar estos contaminantes (como plásticos y metales) durante el proceso de pulpado.",
      },
      {
        id: "4",
        question: "¿Qué se hace con el papel y cartón una vez reciclado?",
        options: ["Se quema para generar energía", "Se entierra en vertederos especiales", "Se convierte en nuevos productos de papel y cartón", "Se usa como alimento para animales"],
        correct: 2,
        points: 10,
        explanation: "Las fibras de celulosa se reutilizan para fabricar nuevos productos como cajas de cartón, papel de periódico, cartulinas y otros materiales de papel.",
      },
      {
        id: "5",
        question: "¿El papel fotográfico se puede reciclar junto con el papel normal?",
        options: ["Sí, es igual que cualquier otro papel", "No, debido a su recubrimiento plástico y químico", "Solo si se le quita la foto", "Sí, pero en el contenedor de plásticos"],
        correct: 1,
        points: 10,
        explanation: "El papel fotográfico tiene una capa de emulsión plástica que lo hace no apto para el reciclaje convencional de papel. Debe ir a la basura común.",
      },
    ],
  },
  "4": {
    id: "4",
    title: "Manejo de Residuos Electrónicos",
    description: "Aprende a desechar de forma segura tus aparatos electrónicos viejos.",
    difficulty: "medium",
    category: "Electrónicos",
    imageUrl: "https://cdn.shopify.com/s/files/1/0593/4235/6578/files/electronic-recycling_600x600.jpg?v=1736681101",
    questions: [
      {
        id: "1",
        question: "¿Dónde debes desechar las baterías y pilas usadas?",
        options: ["En la basura común", "En el contenedor de plásticos", "En puntos de recolección específicos", "En el desagüe"],
        correct: 2,
        points: 15,
        explanation: "Las pilas y baterías contienen metales pesados y químicos tóxicos que contaminan el suelo y el agua. Deben llevarse a puntos limpios o contenedores especiales.",
      },
      {
        id: "2",
        question: "¿Qué significa el término 'e-waste'?",
        options: ["Basura extra grande", "Residuos de aparatos eléctricos y electrónicos", "Envases de plástico especiales", "Basura ecológica"],
        correct: 1,
        points: 10,
        explanation: "'E-waste' (o RAEE en español) se refiere a todos los dispositivos electrónicos que han llegado al final de su vida útil, como celulares, computadoras, televisores, etc.",
      },
      {
        id: "3",
        question: "¿Por qué es peligroso tirar un celular viejo a la basura común?",
        options: ["Puede explotar", "Ocupa mucho espacio", "Contiene metales pesados que contaminan", "Atrae a los roedores"],
        correct: 2,
        points: 15,
        explanation: "Los celulares contienen sustancias tóxicas como plomo, mercurio y cadmio, que pueden filtrarse en el suelo y el agua si no se gestionan adecuadamente.",
      },
      {
        id: "4",
        question: "Un cable de cargador roto, ¿dónde debería desecharse?",
        options: ["En la basura común", "En el contenedor de plásticos", "En un punto de recolección de e-waste", "En el contenedor de metales"],
        correct: 2,
        points: 10,
        explanation: "Los cables son considerados residuos electrónicos y deben ser llevados a puntos de recolección especializados para su correcto tratamiento y reciclaje.",
      },
      {
        id: "5",
        question: "Antes de reciclar una computadora o celular, ¿qué es recomendable hacer por seguridad?",
        options: ["Quitarle la batería", "Limpiarlo con un paño húmedo", "Borrar toda tu información personal", "Romper la pantalla"],
        correct: 2,
        points: 15,
        explanation: "Es fundamental borrar de forma segura toda tu información personal y restaurar el dispositivo a su estado de fábrica para proteger tu privacidad antes de reciclarlo.",
      },
    ],
  },
  "5": {
    id: "5",
    title: "El Arte del Compostaje",
    description: "Convierte tus residuos orgánicos en abono rico en nutrientes para tus plantas.",
    difficulty: "medium",
    category: "Orgánicos",
    imageUrl: "https://www.prisma.org.pe/wp-content/uploads/compost-en-casa-con-residuos-organicos.jpg",
    questions: [
      {
        id: "1",
        question: "¿Cuál de estos elementos es un 'residuo verde' ideal para el compostaje?",
        options: ["Restos de carne", "Cáscaras de plátano", "Aceite de cocina", "Huesos"],
        correct: 1,
        points: 15,
        explanation: "Los residuos verdes, como restos de frutas y verduras, son ricos en nitrógeno y se descomponen rápidamente, siendo ideales para iniciar el compostaje.",
      },
      {
        id: "2",
        question: "¿Cuál de estos es un 'residuo marrón', rico en carbono, para el compostaje?",
        options: ["Césped recién cortado", "Restos de café", "Hojas secas y ramas", "Cáscaras de huevo"],
        correct: 2,
        points: 10,
        explanation: "Los residuos marrones, como hojas secas, cartón o aserrín, aportan carbono a la composta, equilibrando la mezcla y ayudando a la aireación.",
      },
      {
        id: "3",
        question: "¿Qué residuo NO se recomienda añadir a una composta casera?",
        options: ["Filtros de café", "Pelo y uñas", "Productos lácteos y carne", "Servilletas de papel"],
        correct: 2,
        points: 15,
        explanation: "Los restos de carne, pescado y productos lácteos pueden generar malos olores y atraer plagas, por lo que generalmente se evitan en el compostaje doméstico.",
      },
      {
        id: "4",
        question: "¿Para qué sirve voltear o airear la pila de composta regularmente?",
        options: ["Para que se vea más ordenada", "Para acelerar la descomposición y evitar malos olores", "Para enfriarla", "Para atraer más insectos beneficiosos"],
        correct: 1,
        points: 10,
        explanation: "Airear la composta proporciona el oxígeno necesario para que los microorganismos aeróbicos trabajen eficientemente, acelerando el proceso y previniendo olores desagradables.",
      },
      {
        id: "5",
        question: "El resultado final del compostaje es un material oscuro y rico en nutrientes llamado:",
        options: ["Tierra de diatomeas", "Turba", "Humus", "Arcilla"],
        correct: 2,
        points: 15,
        explanation: "El humus es el producto final estable del compostaje. Es un abono orgánico de alta calidad, excelente para mejorar la estructura y fertilidad del suelo.",
      },
    ],
  },
  "6": {
    id: "6",
    title: "Todo sobre el Vidrio",
    description: "Descubre por qué el vidrio es un material infinitamente reciclable y cómo tratarlo.",
    difficulty: "easy",
    category: "Vidrio",
    imageUrl: "https://traperosdeemauslimaperu.org/images/2025/10/17/reciclaje-vidrio.jpg",
    questions: [
      {
        id: "1",
        question: "¿El vidrio se puede reciclar infinitas veces sin perder su calidad?",
        options: ["Sí, es 100% reciclable indefinidamente", "No, solo se puede reciclar 2 o 3 veces", "Depende del color del vidrio", "No, pierde transparencia con cada ciclo"],
        correct: 0,
        points: 10,
        explanation: "El vidrio es un material noble que puede ser reciclado una y otra vez sin perder sus propiedades ni su calidad, lo que lo hace extremadamente sostenible.",
      },
      {
        id: "2",
        question: "¿Qué color de contenedor se utiliza habitualmente para depositar el vidrio?",
        options: ["Amarillo", "Azul", "Verde", "Gris"],
        correct: 2,
        points: 10,
        explanation: "El contenedor verde (iglú) es el destinado exclusivamente para el reciclaje de envases de vidrio como botellas, frascos y tarros.",
      },
      {
        id: "3",
        question: "¿Se deben quitar las tapas y tapones de los envases de vidrio antes de reciclarlos?",
        options: ["No, se reciclan junto con el vidrio", "Solo si son de metal", "Sí, deben depositarse en el contenedor correspondiente", "Solo si son de plástico"],
        correct: 2,
        points: 10,
        explanation: "Sí, las tapas (de metal o plástico) deben retirarse y depositarse en el contenedor amarillo para que ambos materiales puedan ser reciclados correctamente por separado.",
      },
      {
        id: "4",
        question: "¿Cuál de estos objetos de vidrio NO debe tirarse al contenedor verde?",
        options: ["Una botella de vino", "Un frasco de mermelada", "Un vaso de cristal roto", "Una botella de cerveza"],
        correct: 2,
        points: 15,
        explanation: "Los vasos, copas de cristal, espejos o bombillas tienen una composición diferente a la del vidrio de los envases y no deben mezclarse, ya que contaminan el proceso de reciclaje.",
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
    };
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
                    <Button size="lg" className="w-full" onClick={() => setQuizStarted(true)} data-testid="start-quiz-button">
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
