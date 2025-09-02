export class LoginPage {
  visit() {
    cy.visit('/auth/login');
    return this;
  }

  fillEmail(email) {
    cy.get('input[name="email"]').clear().type(email);
    return this;
  }

  fillPassword(password) {
    cy.get('p-password input[name="password"]').clear().type(password);
    return this;
  }

  toggleRememberMe() {
    cy.get('p-checkbox[name="rememberMe"] .p-checkbox-box').click();
    return this;
  }

  submit() {
    cy.get('button[type="submit"]').click();
    return this;
  }

  shouldShowValidationError(field) {
    cy.get(`small.p-error`).should('be.visible');
    return this;
  }

  shouldShowLoginError() {
    cy.get('.swal2-popup').should('be.visible');
    cy.get('.swal2-title').should('contain', 'Login Failed');
    return this;
  }

  shouldRedirectToAdmin() {
    cy.get('.swal2-confirm').click();
    cy.url().should('include', '/admin');
    return this;
  }

  shouldRedirectToUserProfile() {
    cy.get('.swal2-confirm').click();
    cy.url().should('include', '/user/profile');
    return this;
  }

  clickForgotPassword() {
    cy.get('.forgot-password').click();
    cy.url().should('include', '/forgetpassword');
    return this;
  }

  clickRegisterLink() {
    cy.get('a[routerLink="/auth/register"]').click();
    cy.url().should('include', '/auth/register');
    return this;
  }
}
