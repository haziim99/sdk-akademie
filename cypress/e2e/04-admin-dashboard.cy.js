describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAsUser('admin');
  });

  it('should display admin dashboard', () => {
    cy.url().should('include', '/admin');
    cy.get('[data-cy="admin-panel"], .admin-dashboard').should('be.visible');
  });

  it('should show users management', () => {
    cy.get('[data-cy="users-section"], .users-management').should('be.visible');
  });

  it('should allow user creation', () => {
    cy.get('[data-cy="add-user"], .add-user-button').click();

    // Fill user form
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('newuser@test.com');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="success-message"], .success-toast')
      .should('be.visible');
  });
});
