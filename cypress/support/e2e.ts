/// <reference types="cypress" />

import './commands';

const firebaseConfig = {
  apiKey: "AIzaSyCL1zs7mVkugzizMFM-VDnSGpQkic1snWQ",
  authDomain: "sdk-akademie1.firebaseapp.com",
  projectId: "sdk-akademie1",
  storageBucket: "sdk-akademie1.appspot.com",
  messagingSenderId: "669541836589",
  appId: "1:669541836589:web:61c73a553124a9d90e55a4",
  measurementId: "G-R3BQ9VTS5X"
};

beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();

  setupFirebaseIntercepts();

  cy.viewport(1280, 720);
});

function setupFirebaseIntercepts() {
  cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', (req) => {
    req.reply((res) => {
      setTimeout(() => res.send(), 1000);
    });
  }).as('firebaseAuth');

  cy.intercept('POST', '**/firestore.googleapis.com/**', (req) => {
    req.reply((res) => {
      setTimeout(() => res.send(), 500);
    });
  }).as('firestore');

  cy.intercept('GET', '**/firebasestorage.googleapis.com/**').as('firebaseStorage');

  cy.intercept('GET', '**/googleapis.com/**').as('googleApis');
}

Cypress.on('uncaught:exception', (err, runnable) => {
  const expectedErrors = [
    'Firebase: Error (auth/network-request-failed)',
    'Firebase: Error (auth/timeout)',
    'Firebase: Error (auth/too-many-requests)',

    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'ChunkLoadError',
    'Loading chunk',

    'Script error',
    'Network Error',

    'Cannot read property',
    'Cannot read properties of null',
    'ExpressionChangedAfterItHasBeenCheckedError'
  ];

  const shouldIgnore = expectedErrors.some(expectedError =>
    err.message.includes(expectedError)
  );

  if (shouldIgnore) {
    console.log('Ignoring expected error:', err.message);
    return false;
  }

  return true;
});

Cypress.config('defaultCommandTimeout', 30000);
Cypress.config('requestTimeout', 30000);
Cypress.config('responseTimeout', 30000);
Cypress.config('pageLoadTimeout', 60000);

beforeEach(() => {
  cy.window().then((win) => {
    const originalWarn = win.console.warn;
    win.console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('Firebase') ||
          message.includes('auth') ||
          message.includes('firestore')) {
        return;
      }
      originalWarn.apply(win.console, args);
    };
  });
});

Cypress.Commands.add('getByDataCy', (selector: string, options?: any) => {
  return cy.get(`[data-cy="${selector}"]`, options);
});

Cypress.Commands.add('getByTestId', (selector: string, options?: any) => {
  return cy.get(`[data-testid="${selector}"]`, options);
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('.loading, .spinner, .loader', { timeout: 30000 }).should('not.exist');

  cy.window().should('have.property', 'ng');

  cy.wait(1000);
});

declare global {
  namespace Cypress {
    interface Chainable {
      getByDataCy(selector: string, options?: any): Chainable<JQuery<HTMLElement>>;
      getByTestId(selector: string, options?: any): Chainable<JQuery<HTMLElement>>;
      waitForPageLoad(): Chainable<void>;
    }
  }
}
