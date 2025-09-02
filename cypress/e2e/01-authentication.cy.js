import { LoginPage } from '../support/pages/LoginPage';

describe('Authentication Flow', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login Component', () => {
    it('should display login form correctly', () => {
      loginPage.visit();

      cy.get('h1').should('contain', 'Welcome Back!');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('p-password input[name="password"]').should('be.visible');
      cy.get('p-checkbox[name="rememberMe"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      loginPage.visit().submit();

      cy.get('small.p-error').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should show email validation error', () => {
      loginPage.visit()
        .fillEmail('invalid-email')
        .fillPassword('password123');

      cy.get('input[name="email"]').blur();
      cy.get('small.p-error').should('contain', 'Please enter a valid email address');
    });

    it('should login successfully as user', () => {
      const testUser = Cypress.env('test_users').user;

      loginPage.visit()
        .fillEmail(testUser.email)
        .fillPassword(testUser.password)
        .submit()
        .shouldRedirectToUserProfile();
    });

    it('should login successfully as admin', () => {
      const testAdmin = Cypress.env('test_users').admin;

      loginPage.visit()
        .fillEmail(testAdmin.email)
        .fillPassword(testAdmin.password)
        .submit()
        .shouldRedirectToAdmin();
    });

    it('should handle login failure', () => {
      loginPage.visit()
        .fillEmail('wrong@email.com')
        .fillPassword('wrongpassword')
        .submit()
        .shouldShowLoginError();
    });

    it('should navigate to forgot password', () => {
      loginPage.visit().clickForgotPassword();
    });

    it('should navigate to register', () => {
      loginPage.visit().clickRegisterLink();
    });

    it('should toggle remember me checkbox', () => {
      loginPage.visit().toggleRememberMe();

      cy.get('p-checkbox[name="rememberMe"] .p-checkbox-box')
        .should('have.class', 'p-highlight');
    });
  });
});
