import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

// Es una buena práctica instanciar PrismaClient una vez y reutilizarlo.
const prisma = new PrismaClient();

/**
 * Maneja el registro de un nuevo usuario.
 * Valida los datos de entrada, hashea la contraseña y crea el usuario en la base de datos.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    // 1. Validación de campos obligatorios
    if (!email || !password || !name) {
      return NextResponse.json(
        { ok: false, error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // 2. Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: "User with this email already exists" },
        { status: 409 } // 409 Conflict es un código de estado más apropiado
      );
    }

    // 3. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        // El rol se asignará si se provee, de lo contrario, usará el default "STUDENT" del esquema
        role: role === "TEACHER" ? UserRole.TEACHER : UserRole.STUDENT,
      },
    });

    // Por seguridad, nunca devuelvas la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        ok: true,
        message: "User created successfully!",
        payload: userWithoutPassword,
      },
      { status: 201 } // 201 Created
    );
  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      { ok: false, error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

/**
 * Handler mínimo y seguro para build:
 * - No importa Prisma ni otras dependencias en tiempo de build
 * - Responde GET para evitar que Next intente "collect page data" y falle
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Registration endpoint is active.",
  });
}
