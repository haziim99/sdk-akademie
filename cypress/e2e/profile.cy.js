describe('Profile Page Tests', () => {
  beforeEach(() => {
    // Set up user authentication and navigate to the profile page
    cy.window().then((win) => {
      // Simulate login by setting local storage
      win.storageService.setItem('userToken', 'dummy-token');
      win.storageService.setItem('currentUser', JSON.stringify({
        id: '1',
        name: 'Ahmed El Masry',
        email: 'ahmed@example.com',
        phone: '01012345678',
        profilePicture: 'assets/images/ahmed.jpg',
        password: 'password123',
        role: 'user'
      }));
      win.storageService.setItem('role', 'user');
    });

    cy.visit('/profile');
  });

  it('should perform login operation correctly', () => {
    // Ensure that profile information is present
    cy.get('.profile-header h1').should('contain', 'Welcome, Ahmed El Masry'); // Checking the name in profile header
    cy.get('.user-info').should('exist'); // Ensure user info section exists

    // Optionally, check for other elements and their content
    cy.get('.user-info').within(() => {
      cy.get('p').first().should('contain', 'Email: ahmed@example.com');
      cy.get('p').eq(1).should('contain', 'Phone: 01012345678');
    });
  });

  it('should update user data correctly', () => {
    // Simulate user update action
    cy.window().then((win) => {
      const updatedUser = {
        id: '1',
        name: 'Ahmed El Masry Updated',
        email: 'ahmed@example.com',
        phone: '01012345678',
        profilePicture: 'assets/images/ahmed.jpg',
        password: 'password123',
        role: 'user'
      };
      win.storageService.setItem('currentUser', JSON.stringify(updatedUser));
    });

    // Trigger the profile update
    cy.get('button.btn-primary').contains('Edit Profile').click(); // Enter edit mode
    cy.get('input#name').clear().type('Ahmed El Masry Updated'); // Update name
    cy.get('button.btn-success').contains('Save Changes').click(); // Save changes

    // Verify the update
    cy.get('.profile-header h1').should('contain', 'Welcome, Ahmed El Masry Updated');
    cy.get('.user-info').within(() => {
      cy.get('p').first().should('contain', 'Email: ahmed@example.com');
      cy.get('p').eq(1).should('contain', 'Phone: 01012345678');
    });
  });
});
