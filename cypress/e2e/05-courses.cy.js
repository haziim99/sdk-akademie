describe('Courses Management', () => {
  beforeEach(() => {
    // Mock courses API
    cy.intercept('GET', 'http://localhost:3000/courses', {
      fixture: 'available-courses.json'
    }).as('getCourses');

    cy.intercept('GET', 'assets/data/course-lectures.json', {
      fixture: 'course-lectures.json'
    }).as('getLectures');
  });

  it('should display available courses', () => {
    cy.visit('/courses');
    cy.wait('@getCourses');

    cy.get('[data-cy="course-card"], .course-item').should('have.length.greaterThan', 0);
  });

  it('should show course details', () => {
    cy.visit('/courses');
    cy.wait('@getCourses');

    cy.get('[data-cy="course-card"], .course-item').first().click();
    cy.get('[data-cy="course-details"], .course-description').should('be.visible');
  });

  it('should handle course purchase for logged in user', () => {
    cy.loginAsUser('user');
    cy.visit('/courses');
    cy.wait('@getCourses');

    cy.get('[data-cy="buy-course"], .buy-button').first().click();
    cy.get('[data-cy="purchase-confirmation"]').should('be.visible');
  });
});
