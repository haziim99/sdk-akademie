/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {

      loginAsUser(userType?: 'admin' | 'user'): Chainable<void>;

      logout(): Chainable<void>;


      mockFirebaseAuth(shouldSucceed?: boolean): Chainable<void>;

      mockFirestore(): Chainable<void>;

      waitForFirebase(): Chainable<void>;

      cleanupTestData(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsUser', (userType = 'user') => {
  const users = Cypress.env('test_users');
  const user = users[userType];

  cy.log(`Logging in as ${userType}`);

  cy.visit('/auth/login', { timeout: 30000 });
  cy.waitForFirebase();

  cy.get('input[name="email"], input[type="email"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(user.email);

  cy.get('input[name="password"], p-password input, input[type="password"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(user.password);

  cy.get('button[type="submit"], .login-button', { timeout: 10000 })
    .should('be.visible')
    .should('not.be.disabled')
    .click();

  cy.intercept('POST', '**/identitytoolkit.googleapis.com/**').as('firebaseAuth');

  cy.get('.swal2-popup', { timeout: 20000 }).should('be.visible');
  cy.get('.swal2-confirm', { timeout: 10000 })
    .should('be.visible')
    .click();

  if (userType === 'admin') {
    cy.url({ timeout: 20000 }).should('include', '/admin');
  } else {
    cy.url({ timeout: 20000 }).should('match', /\/(user|profile|dashboard)/);
  }

  cy.log(`Successfully logged in as ${userType}`);
});

Cypress.Commands.add('logout', () => {
  cy.log('Logging out...');

  const logoutSelectors = [
    '[data-cy="logout"]',
    '[data-testid="logout"]',
    '.logout-button',
    'button:contains("Logout")',
    'button:contains("تسجيل الخروج")',
    '[data-cy="user-menu"]',
    '.user-menu'
  ];

  cy.get('body').then($body => {
    let found = false;
    for (const selector of logoutSelectors) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).first().click({ force: true });
        found = true;
        break;
      }
    }

    if (!found) {
      cy.visit('/auth/logout');
    }
  });

  cy.url({ timeout: 15000 }).should('match', /\/(home|login|auth)/);
  cy.log('Successfully logged out');
});

Cypress.Commands.add('waitForFirebase', () => {
  cy.log('Waiting for Firebase to initialize...');

  cy.window().should('have.property', 'firebase');

  cy.wait(2000);

  cy.log('Firebase is ready');
});

Cypress.Commands.add('mockFirebaseAuth', (shouldSucceed = true) => {
  if (shouldSucceed) {
    cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*', {
      statusCode: 200,
      body: {
        localId: 'test-user-id',
        email: 'test@example.com',
        idToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: '3600'
      }
    }).as('firebaseLogin');

    cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:lookup*', {
      statusCode: 200,
      body: {
        users: [{
          localId: 'test-user-id',
          email: 'test@example.com',
          emailVerified: true
        }]
      }
    }).as('firebaseUserInfo');

  } else {
    cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*', {
      statusCode: 400,
      body: {
        error: {
          code: 400,
          message: 'INVALID_PASSWORD',
          errors: [{
            message: 'INVALID_PASSWORD',
            domain: 'global',
            reason: 'invalid'
          }]
        }
      }
    }).as('firebaseLoginError');
  }
});

Cypress.Commands.add('mockFirestore', () => {
  cy.intercept('POST', '**/firestore.googleapis.com/v1/projects/*/databases/(default)/documents:batchGet*', {
    statusCode: 200,
    body: {
      found: [{
        name: 'projects/sdk-akademie1/databases/(default)/documents/users/test-user-id',
        fields: {
          id: { stringValue: 'test-user-id' },
          email: { stringValue: 'test@example.com' },
          role: { stringValue: 'user' },
          name: { stringValue: 'Test User' }
        }
      }]
    }
  }).as('firestoreUser');

  cy.intercept('POST', '**/firestore.googleapis.com/v1/projects/*/databases/(default)/documents:runQuery*', {
    statusCode: 200,
    body: [{
      document: {
        name: 'projects/sdk-akademie1/databases/(default)/documents/courses/test-course-1',
        fields: {
          id: { stringValue: 'test-course-1' },
          title: { stringValue: 'Test Course' },
          description: { stringValue: 'Test Description' }
        }
      }
    }]
  }).as('firestoreCourses');
});

Cypress.Commands.add('cleanupTestData', () => {
  cy.log('Cleaning up test data...');
  cy.task('clearTestData');

  cy.clearLocalStorage();
  cy.clearCookies();

  cy.log('Test data cleaned up');
});

Cypress.on('uncaught:exception', (err, runnable) => {
  const ignoredErrors = [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Firebase: Error (auth/network-request-failed)',
    'Firebase: Error (auth/timeout)',
    'ChunkLoadError'
  ];

  return !ignoredErrors.some(error => err.message.includes(error));
});
