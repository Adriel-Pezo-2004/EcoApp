import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I am on the login page', () => {
  cy.visit('/login');
});

When('I enter valid credentials', () => {
  cy.get('input[name="email"]').type('test@example.com');
  cy.get('input[name="password"]').type('password123');
});

When('I click the login button', () => {
  cy.get('form').submit();
});

Then('I should be redirected to the dashboard', () => {
  cy.url().should('include', '/dashboard');
});