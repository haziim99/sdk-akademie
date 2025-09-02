describe('Routing & Navigation', () => {
  it('should redirect to home by default', () => {
    cy.visit('/');
    cy.url().should('include', '/home');
  });

  it('should handle lazy loaded routes', () => {
    // Test all your main routes
    const routes = [
      '/home',
      '/courses',
      '/auth/login',
      '/contact',
      '/about'
    ];

    routes.forEach(route => {
      cy.visit(route);
      cy.url().should('include', route);
    });
  });

  it('should redirect unknown routes to home', () => {
    cy.visit('/non-existent-route');
    cy.url().should('include', '/home');
  });

  it('should protect admin routes', () => {
    cy.visit('/admin');
    cy.url().should('include', '/auth/login');
  });

  it('should protect user routes', () => {
    cy.visit('/user/profile');
    cy.url().should('include', '/auth/login');
  });
});
