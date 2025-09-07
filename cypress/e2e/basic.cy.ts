describe('Basic Test', () => {
  it('should load homepage', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.title().should('contain', 'SDK Akademie');
  });
});
