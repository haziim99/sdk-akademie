import './commands';

// Custom commands for your Angular + Firebase app
Cypress.Commands.add('loginAsUser', (userType = 'user') => {
  const users = Cypress.env('test_users');
  const user = users[userType];

  cy.visit('/auth/login');
  cy.get('input[name="email"]').clear().type(user.email);
  cy.get('p-password input[name="password"]').clear().type(user.password);
  cy.get('button[type="submit"]').click();

  // Wait for SweetAlert and dismiss it
  cy.get('.swal2-confirm').should('be.visible').click();

  // Verify navigation based on role
  if (userType === 'admin') {
    cy.url().should('include', '/admin');
  } else {
    cy.url().should('include', '/user/profile');
  }
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"], .logout-button, [data-testid="logout"]')
    .first()
    .click({ force: true });
  cy.url().should('include', '/home');
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
  } else {
    cy.intercept('POST', '**/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword*', {
      statusCode: 400,
      body: {
        error: {
          code: 400,
          message: 'INVALID_PASSWORD'
        }
      }
    }).as('firebaseLoginError');
  }
});

Cypress.Commands.add('mockFirestore', () => {
  // Mock Firestore user data fetch
  cy.intercept('GET', '**/firestore.googleapis.com/**', {
    statusCode: 200,
    body: {
      documents: [{
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
});
