// Simple authentication utilities for demo purposes
// In a real app, this would integrate with a proper auth service

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  points: number
  badges: string[]
}

export const mockUser: User = {
  id: "1",
  name: "María González",
  email: "maria@example.com",
  level: 5,
  points: 1250,
  badges: ["Principiante", "Reciclador", "Eco-Warrior"],
}

export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("user", JSON.stringify(mockUser))
      resolve(mockUser)
    }, 1000)
  })
}

export function register(userData: {
  name: string
  email: string
  password: string
}): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        level: 1,
        points: 0,
        badges: ["Principiante"],
      }
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("user", JSON.stringify(newUser))
      resolve(newUser)
    }, 1000)
  })
}

export function logout(): void {
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  return localStorage.getItem("isLoggedIn") === "true"
}
