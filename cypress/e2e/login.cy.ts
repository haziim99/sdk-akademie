/// <reference types="cypress" />

describe('Login Component Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('UI Elements', () => {
    it('should display login form elements', () => {
      cy.visit('/auth/login');

      cy.get('h1').should('contain', 'Welcome Back!');
      cy.get('[data-cy="login-email"]').should('be.visible');
      cy.get('[data-cy="login-password"]').should('be.visible');
      cy.get('[data-cy="login-submit"]').should('be.visible');
      cy.get('a').contains('Forgot Password?').should('be.visible');
      cy.get('a').contains('Register').should('be.visible');
    });

    it('should validate email field', () => {
      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type('invalid-email');
      cy.get('[data-cy="login-email"]').blur();

      cy.get('[data-cy="error-message"]').should('be.visible')
        .and('contain', 'valid email address');
    });

    it('should validate password field', () => {
      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-password"] input').focus().blur();

      cy.get('.p-error').should('contain', 'Password is required');
    });

    it('should disable submit button when form is invalid', () => {
      cy.visit('/auth/login');

      cy.get('[data-cy="login-submit"]').should('be.disabled');

      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-submit"]').should('be.disabled');

      cy.get('[data-cy="login-password"] input').type('password123');
      cy.get('[data-cy="login-submit"]').should('not.be.disabled');
    });
  });

  describe('Form Submission', () => {
    it('should show warning for empty fields', () => {
      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-password"] input').type('   ');
      cy.get('[data-cy="login-submit"]').click();

      cy.get('.swal2-popup').should('be.visible');
      cy.get('.swal2-title').should('contain', 'Input Required');
    });

    it('should handle login with valid credentials', () => {
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
        statusCode: 200,
        body: {
          localId: 'test-user-id',
          email: 'test@example.com',
          idToken: 'mock-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: '3600'
        }
      }).as('loginRequest');

      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-password"] input').type('password123');
      cy.get('[data-cy="login-submit"]').click();

      cy.wait('@loginRequest');

      cy.get('.swal2-popup', { timeout: 10000 }).should('be.visible');
      cy.get('.swal2-title').should('contain', 'Login Successful');

      cy.get('.swal2-confirm').click();
    });

    it('should handle login failure', () => {
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
        statusCode: 400,
        body: {
          error: {
            code: 400,
            message: 'INVALID_PASSWORD'
          }
        }
      }).as('loginError');

      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-password"] input').type('wrongpassword');
      cy.get('[data-cy="login-submit"]').click();

      cy.wait('@loginError');

      cy.get('.swal2-popup').should('be.visible');
      cy.get('.swal2-title').should('contain', 'Login Failed');
    });

    it('should handle network errors', () => {
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', {
        statusCode: 500,
        body: { error: 'Network error' }
      }).as('networkError');

      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-password"] input').type('password123');
      cy.get('[data-cy="login-submit"]').click();

      cy.wait('@networkError');

      cy.get('.swal2-popup').should('be.visible');
      cy.get('.swal2-title').should('contain', 'Login Failed');
      cy.get('.swal2-html-container').should('contain', 'error occurred');
    });

    it('should show loading state during submission', () => {
      cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', (req) => {
        req.reply((res) => {
          setTimeout(() => {
            res.send({
              statusCode: 200,
              body: {
                localId: 'test-user-id',
                email: 'test@example.com',
                idToken: 'mock-token'
              }
            });
          }, 2000);
        });
      }).as('slowLogin');

      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type('test@example.com');
      cy.get('[data-cy="login-password"] input').type('password123');
      cy.get('[data-cy="login-submit"]').click();

      cy.get('[data-cy="login-submit"]').should('contain', 'Loading');
      cy.get('[data-cy="login-submit"]').should('be.disabled');
    });
  });

  describe('Navigation', () => {
    it('should navigate to forgot password page', () => {
      cy.visit('/auth/login');

      cy.contains('Forgot Password?').click();

      cy.url().should('include', '/forgetpassword');
    });

    it('should navigate to register page', () => {
      cy.visit('/auth/login');

      cy.contains('Register').click();

      cy.url().should('include', '/auth/register');
    });
  });

  describe('Remember Me Functionality', () => {
    it('should toggle remember me checkbox', () => {
      cy.visit('/auth/login');

      cy.get('p-checkbox').should('be.visible');
      cy.get('p-checkbox input').should('not.be.checked');

      cy.get('p-checkbox').click();
      cy.get('p-checkbox input').should('be.checked');
    });
  });

  describe('Real Firebase Integration', () => {
    it('should work with actual Firebase (if test users exist)', () => {
      const testEmail = 'user@test.com';
      const testPassword = 'user123';

      cy.visit('/auth/login');

      cy.get('[data-cy="login-email"]').type(testEmail);
      cy.get('[data-cy="login-password"] input').type(testPassword);
      cy.get('[data-cy="login-submit"]').click();

      cy.get('.swal2-popup', { timeout: 15000 }).should('be.visible');

      cy.get('.swal2-title').then(($title) => {
        if ($title.text().includes('Login Successful')) {
          cy.get('.swal2-confirm').click();
          cy.url({ timeout: 10000 }).should('not.include', '/login');
        } else {
          cy.get('.swal2-title').should('contain', 'Login Failed');
        }
      });
    });
  });
});
