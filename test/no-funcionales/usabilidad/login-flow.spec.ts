describe('Login Usability', () => {
  it('debe tener un flujo de inicio de sesión claro y fácil', () => {
    cy.visit('/login');
    cy.contains('Bienvenido').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('¿No tienes una cuenta?').should('be.visible');
  });
});