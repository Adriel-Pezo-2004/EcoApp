"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, BookOpen, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
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
        duration: 0.6,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="container-mobile container-tablet container-desktop py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Leaf className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground">EcoQuiz</h1>
          </motion.div>
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="container-mobile container-tablet container-desktop">
        <motion.section
          className="text-center py-12 md:py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl mx-auto">
            <motion.h2 className="text-4xl md:text-6xl font-bold text-balance mb-6" variants={itemVariants}>
              Aprende a reciclar de forma <span className="text-primary">divertida</span>
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground text-pretty mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Descubre el mundo del reciclaje a través de quizzes interactivos. Aprende, compite y contribuye a un
              planeta más verde.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/register">Comenzar Ahora</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/about">Saber Más</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-bold text-balance mb-4">¿Por qué elegir EcoQuiz?</h3>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Una experiencia de aprendizaje completa diseñada para hacer el reciclaje accesible y emocionante
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="text-center h-full">
                <CardHeader>
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                    <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                  </motion.div>
                  <CardTitle>Aprende Jugando</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">
                    Quizzes interactivos que hacen el aprendizaje sobre reciclaje divertido y memorable
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="text-center h-full">
                <CardHeader>
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ duration: 0.2 }}>
                    <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                  </motion.div>
                  <CardTitle>Sistema de Logros</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">
                    Gana puntos, desbloquea insignias y compite con otros usuarios eco-conscientes
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="text-center h-full">
                <CardHeader>
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                    <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                  </motion.div>
                  <CardTitle>Impacto Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">
                    Aprende técnicas de reciclaje que puedes aplicar inmediatamente en tu vida diaria
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="text-center h-full">
                <CardHeader>
                  <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ duration: 0.2 }}>
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  </motion.div>
                  <CardTitle>Comunidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty">
                    Únete a una comunidad de personas comprometidas con el cuidado del medio ambiente
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-3xl text-balance">¿Listo para comenzar tu viaje eco-friendly?</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg text-pretty">
                  Únete a miles de usuarios que ya están aprendiendo y marcando la diferencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                    <Link href="/register">Crear Cuenta Gratis</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        className="border-t bg-muted/30 py-8 mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-mobile container-tablet container-desktop">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-semibold">EcoQuiz</span>
            </motion.div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 EcoQuiz. Construyendo un futuro más verde, un quiz a la vez.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
