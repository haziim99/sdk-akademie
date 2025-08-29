/// <reference types="cypress" />

describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form correctly', () => {
    cy.get('.login-container').should('exist');
    cy.get('h1').should('contain', 'Welcome Back!');
    cy.get('#email').should('exist');
    cy.get('p-password input').should('exist'); // تعديل هنا
    cy.get('button[type="submit"]').should('contain', 'Log In');
    cy.get('.forgot-password').should('contain', 'Forgot Password?');
    cy.get('.register-link a').should('contain', 'Register');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('#email').clear();
    cy.get('p-password input').clear();
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.p-error').should('be.visible');
  });

  it('should show validation error for invalid email', () => {
    cy.get('#email').clear().type('invalid-email');
    cy.get('p-password input').clear().type('password123');
    cy.get('button[type="submit"]').click({ force: true });

    cy.get('.p-error')
      .should('be.visible')
      .should('contain', 'Please enter a valid email address.');
  });

  it('should log in successfully with valid credentials', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        token: 'fake-jwt-token',
        role: 'user'
      }
    }).as('loginRequest');

    cy.log('Filling in login form');
    cy.get('#email').type('hm1@gmail.com');
    cy.get('p-password input').type('123456');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.log('Confirming Swal success alert');
    cy.get('.swal2-confirm').click();


  });

  it('should display an error message for incorrect credentials', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: {
        success: false,
        message: 'Invalid login credentials.'
      }
    }).as('loginRequest');

    cy.get('#email').type('wrong@example.com');
    cy.get('p-password input').type('wrongpassword');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.get('.swal2-html-container', { timeout: 10000 })
      .should('be.visible')
      .should('contain', 'Invalid login credentials.');
  });

  it('should navigate to the register page', () => {
    cy.get('.register-link a').click();
    cy.url().should('include', '/register');
  });

  it('should navigate to the forgot password page', () => {
    cy.get('.forgot-password').click();
    cy.url().should('include', '/forgetpassword');
  });
});
