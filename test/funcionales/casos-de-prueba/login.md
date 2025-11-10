| ID | Descripción | Pasos | Resultado Esperado |
|---|---|---|---|
| 1 | Inicio de sesión exitoso | 1. Navegar a /login<br>2. Ingresar email válido<br>3. Ingresar contraseña válida<br>4. Hacer clic en "Iniciar Sesión" | Redirección al /dashboard |
| 2 | Inicio de sesión fallido (contraseña incorrecta) | 1. Navegar a /login<br>2. Ingresar email válido<br>3. Ingresar contraseña incorrecta<br>4. Hacer clic en "Iniciar Sesión" | Mensaje de error "Credenciales inválidas" |
| 3 | Inicio de sesión fallido (email no existe) | 1. Navegar a /login<br>2. Ingresar email no registrado<br>3. Ingresar contraseña<br>4. Hacer clic en "Iniciar Sesión" | Mensaje de error "Credenciales inválidas" |
| 4 | Campos vacíos | 1. Navegar a /login<br>2. Dejar campos vacíos<br>3. Hacer clic en "Iniciar Sesión" | Mensajes de validación en los campos |