describe('User Dashboard', () => {
  beforeEach(() => {
    cy.loginAsUser('user');
  });

  it('should display user profile', () => {
    cy.url().should('include', '/user/profile');
    cy.get('[data-cy="user-name"], .user-profile').should('be.visible');
  });

  it('should show user courses', () => {
    cy.visit('/user/profile');
    cy.get('[data-cy="user-courses"], .courses-section').should('be.visible');
  });

  it('should allow course purchase', () => {
    cy.visit('/courses');

    // Mock API calls for courses
    cy.intercept('GET', 'http://localhost:3000/courses', {
      fixture: 'available-courses.json'
    }).as('getCourses');

    cy.wait('@getCourses');
    cy.get('[data-cy="buy-course"], .buy-button').first().click();

    // Verify purchase flow
    cy.get('[data-cy="purchase-success"], .success-message')
      .should('be.visible');
  });
});
