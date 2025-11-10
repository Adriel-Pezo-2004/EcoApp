describe('Authentication E2E Flow', () => {
  it('debe permitir a un usuario registrarse, iniciar sesión y cerrar sesión', () => {
    // Visitar la página de registro
    cy.visit('/register');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('newpassword123');
    cy.get('form').submit();

    // Verificar que el usuario es redirigido a la página de login
    cy.url().should('include', '/login');

    // Iniciar sesión con la nueva cuenta
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('newpassword123');
    cy.get('form').submit();

    // Verificar que el usuario es redirigido al dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenido, newuser@example.com').should('be.visible');
  });
});


