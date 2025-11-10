describe('Login Functionality', () => {
  it('debe permitir a un usuario iniciar sesión y cerrar sesión', () => {
    // Visitar la página de inicio de sesión
    cy.visit('/login');

    // Rellenar el formulario y enviarlo
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('form').submit();

    // Verificar que el usuario es redirigido al dashboard
    cy.url().should('include', '/dashboard');

    // Cerrar sesión (suponiendo que hay un botón de cierre de sesión)
    cy.get('button#logout').click();
    cy.url().should('include', '/login');
  });
});

