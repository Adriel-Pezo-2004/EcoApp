import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Reciclaje Básico",
        description: "Conceptos fundamentales del reciclaje",
        icon: "recycle",
        color: "#4caf50",
      },
    }),
    prisma.category.create({
      data: {
        name: "Plásticos",
        description: "Todo sobre el reciclaje de plásticos",
        icon: "bottle",
        color: "#2196f3",
      },
    }),
    prisma.category.create({
      data: {
        name: "Papel y Cartón",
        description: "Reciclaje de materiales de papel",
        icon: "file-text",
        color: "#ff9800",
      },
    }),
    prisma.category.create({
      data: {
        name: "Vidrio",
        description: "Reciclaje de vidrio y cristal",
        icon: "glass-water",
        color: "#9c27b0",
      },
    }),
  ])

  console.log("✅ Categories created")

  // Create sample quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      title: "Fundamentos del Reciclaje",
      description: "Aprende los conceptos básicos del reciclaje",
      category: "Reciclaje Básico",
      difficulty: "easy",
      imageUrl: "/recycling-basics.jpg",
      questions: {
        create: [
          {
            question: "¿Cuál es el símbolo universal del reciclaje?",
            options: ["Tres flechas en círculo", "Una hoja verde", "Un contenedor azul", "Una botella"],
            correct: 0,
            points: 10,
            order: 1,
          },
          {
            question: "¿Qué significa la regla de las 3 R?",
            options: [
              "Reducir, Reutilizar, Reciclar",
              "Recoger, Revisar, Reparar",
              "Renovar, Restaurar, Reconstruir",
              "Ninguna de las anteriores",
            ],
            correct: 0,
            points: 10,
            order: 2,
          },
          {
            question: "¿Cuál de estos materiales NO es reciclable?",
            options: ["Papel", "Vidrio", "Pañales desechables", "Latas de aluminio"],
            correct: 2,
            points: 10,
            order: 3,
          },
        ],
      },
    },
  })

  const quiz2 = await prisma.quiz.create({
    data: {
      title: "Clasificación de Plásticos",
      description: "Identifica los diferentes tipos de plásticos",
      category: "Plásticos",
      difficulty: "medium",
      imageUrl: "/plastic-recycling-types.jpg",
      questions: {
        create: [
          {
            question: "¿Qué significa el número 1 en el símbolo de reciclaje de plásticos?",
            options: ["PET", "HDPE", "PVC", "LDPE"],
            correct: 0,
            points: 15,
            order: 1,
          },
          {
            question: "¿Cuál es el plástico más comúnmente reciclado?",
            options: ["PVC", "PET", "Poliestireno", "Polipropileno"],
            correct: 1,
            points: 15,
            order: 2,
          },
        ],
      },
    },
  })

  console.log("✅ Quizzes created")

  // Create sample user
  const user = await prisma.user.create({
    data: {
      email: "demo@ecoquiz.com",
      name: "Usuario Demo",
      password: "hashedpassword123", // In real app, this would be properly hashed
      level: 3,
      points: 450,
      badges: ["Principiante", "Reciclador", "Eco-Warrior"],
    },
  })

  console.log("✅ Demo user created")

  // Create sample quiz attempts
  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz1.id,
      score: 3,
      totalPoints: 30,
      answers: {
        "1": 0,
        "2": 0,
        "3": 2,
      },
    },
  })

  console.log("✅ Sample quiz attempts created")

  console.log("🎉 Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
