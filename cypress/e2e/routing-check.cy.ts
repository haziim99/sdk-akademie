describe('Check Available Routes', () => {
  const routes = [
    '/auth/login',
    '/login',
    '/auth/signin',
    '/signin',
    '/user/login'
  ];

  routes.forEach(route => {
    it(`should check route: ${route}`, () => {
      cy.visit(route, { failOnStatusCode: false });

      cy.url().then((currentUrl) => {
        cy.log(`Visited: ${route}`);
        cy.log(`Redirected to: ${currentUrl}`);
      });

      // Check if login form exists on this page
      cy.get('body').then(($body) => {
        const hasLoginForm = $body.find('form').length > 0;
        const hasEmailInput = $body.find('input[type="email"], input[name="email"]').length > 0;
        const hasPasswordInput = $body.find('input[type="password"], input[name="password"]').length > 0;

        cy.log(`Has form: ${hasLoginForm}`);
        cy.log(`Has email input: ${hasEmailInput}`);
        cy.log(`Has password input: ${hasPasswordInput}`);

        if (hasEmailInput && hasPasswordInput) {
          cy.log(`✅ Login form found at: ${route}`);
        }
      });

      cy.screenshot(`route-${route.replace(/\//g, '-')}`);
    });
  });

  it('should find the correct login route', () => {
    // Try to find login page by looking at navigation
    cy.visit('/home');

    // Look for login link in navigation
    cy.get('body').find('a').then(($links) => {
      const loginLinks: { href: string | null, text: string }[] = [];

      $links.each((index, link) => {
        const href = link.getAttribute('href');
        const text = link.textContent.toLowerCase();

        if (text.includes('login') || text.includes('sign in') || href && href.includes('login')) {
          loginLinks.push({
            href: href,
            text: text.trim()
          });
        }
      });

      cy.log('Found login links:', loginLinks);

      if (loginLinks.length > 0) {
        // Click the first login link found
        cy.contains('a', /login|sign in/i).first().click();

        cy.url().then((url) => {
          cy.log(`Login page URL: ${url}`);
        });

        // Now check for login form
        cy.get('body').should('contain.text', 'email').should('contain.text', 'Email');
      }
    });
  });
});
