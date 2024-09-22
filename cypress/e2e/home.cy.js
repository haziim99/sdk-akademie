/// <reference types="cypress" />

describe('HomeComponent Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render hero section with correct text and button', () => {
    cy.get('.hero').should('exist');
    cy.get('.hero-text').contains('Willkommen Bei SDK');
    cy.get('.hero-subtext').contains('Die bekannteste Akademie für die Deutschsprache in Ägypten');
    cy.get('.styled-button').should('contain', 'Get Started');
  });

  it('should render students reviews header', () => {
    cy.get('.students-reviews-header').should('exist');
    cy.get('.students-reviews-header h2').should('contain', 'Our Students Reviews');
  });

  it('should render why SDK section with correct items', () => {
    cy.get('.why-sdk').should('exist');
    cy.get('.why-sdk h2').should('contain', 'Why SDK?');

    // Check each item in the why-sdk section
    const items = [
      'Experienced Tutors',
      'Interactive Online Classes',
      'Flexible Scheduling',
      'Comprehensive Learning Materials',
      'Internationally Recognized Certification'
    ];

    items.forEach((item, index) => {
      cy.get(`.why-sdk-item`).eq(index).should('contain', item);
    });
  });

  it('should render our services section with correct details', () => {
    cy.get('.courses').should('exist');
    cy.get('.courses h2').should('contain', 'Our Services');

    const services = [
      'Online Courses',
      'Offline Courses',
      'Conversation Courses',
      'Buying Books'
    ];

    services.forEach((service, index) => {
      cy.get('.course').eq(index).should('contain', service);
    });
  });

  it('should navigate to courses on button click', () => {
    cy.get('.hero-content .styled-button').should('have.length', 1).click();
    cy.url().should('include', '/courses');
  });

    it('should perform login operation correctly', () => {
      cy.request('POST', '/api/login', { email: 'test@example.com', password: 'password' })
        .its('body')
        .then((response) => {
          storageService.setItem('userToken', response.token);
          storageService.setItem('currentUser', JSON.stringify(response.user));
          storageService.setItem('role', response.role);

          cy.visit('/profile');
          cy.url().should('include', '/profile');
        });
    });
});
