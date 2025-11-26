/**
 * Simulación de Prueba para AuthGuard
 * ------------------------------------
 * Ejecuta este script con Node.js para simular el comportamiento del protector de rutas.
 *
 * Uso: node d:/10MO SEMESTRE/GERALDYNE/aplica/components/auth-guard.simulation.js
 */

// 1. Definimos los posibles estados de la sesión que AuthGuard puede recibir.
const mockUserFlow = [
  { scenario: "Flujo 1: Visita de usuario no autenticado", status: "loading", description: "Verificando sesión inicial..." },
  { scenario: "Flujo 1: Visita de usuario no autenticado", status: "unauthenticated", description: "Verificación completada. Usuario no autenticado." },
  { scenario: "Flujo 2: Visita de usuario autenticado", status: "loading", description: "Verificando sesión de usuario que regresa..." },
  { scenario: "Flujo 2: Visita de usuario autenticado", status: "authenticated", description: "Verificación completada. Usuario autenticado." },
  { scenario: "Flujo 3: Cierre de sesión", status: "authenticated", description: "Estado actual: Usuario autenticado." },
  { scenario: "Flujo 3: Cierre de sesión", status: "loading", description: "El usuario cerró sesión. Revalidando estado..." },
  { scenario: "Flujo 3: Cierre de sesión", status: "unauthenticated", description: "Revalidación completada. Sesión terminada." },
];

let currentScenario = "";

function AuthGuard(sessionEvent) {
  if (currentScenario !== sessionEvent.scenario) {
    currentScenario = sessionEvent.scenario;
    console.log(`\n// --- INICIO: ${currentScenario.toUpperCase()} --- //`);
  }

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Estado de sesión detectado: ${sessionEvent.status.toUpperCase()}`);
  console.log(`  > Detalle: ${sessionEvent.description}`);
  
  let action = "";

  // Lógica del componente auth-guard.tsx
  if (sessionEvent.status === "loading") {
    action = "Mostrando componente de carga mientras se valida la sesión.";
  } else if (sessionEvent.status === "unauthenticated") {
    action = "Acceso denegado. Redirigiendo al usuario a la página /login.";
  } else if (sessionEvent.status === "authenticated") {
    action = "Acceso permitido. Renderizando contenido de la ruta protegida.";
  }

  console.log(`  > Acción del AuthGuard: ${action}`);
}

console.log("Iniciando simulación de prueba: AuthGuard\n");

mockUserFlow.forEach(event => {
  AuthGuard(event);
  const waitTill = new Date(new Date().getTime() + 100);
  while(waitTill > new Date()){}
});

