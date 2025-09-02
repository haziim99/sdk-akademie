export class DashboardPage {
  visitUser() {
    cy.visit('/user/profile');
    return this;
  }

  visitAdmin() {
    cy.visit('/admin');
    return this;
  }

  shouldShowUserProfile() {
    cy.url().should('include', '/user/profile');
    return this;
  }

  shouldShowAdminDashboard() {
    cy.url().should('include', '/admin');
    return this;
  }
}
