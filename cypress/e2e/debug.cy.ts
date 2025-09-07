describe('Debug Login Page', () => {
  it('should show what elements exist on the page', () => {
    cy.visit('/auth/login');

    // Wait for page to load completely
    cy.wait(3000);

    // Check what's actually on the page
    cy.get('body').then(($body) => {
      console.log('Page HTML:', $body.html());
    });

    // Try to find any h1, h2, h3 tags
    cy.get('body').find('h1, h2, h3, h4, h5, h6').then(($headings) => {
      if ($headings.length > 0) {
        cy.log(`Found ${$headings.length} headings`);
        $headings.each((index, element) => {
          cy.log(`Heading ${index}: ${element.tagName} - "${element.textContent}"`);
        });
      } else {
        cy.log('No headings found');
      }
    });

    // Try to find any inputs
    cy.get('body').find('input').then(($inputs) => {
      if ($inputs.length > 0) {
        cy.log(`Found ${$inputs.length} inputs`);
        $inputs.each((index, element) => {
          cy.log(`Input ${index}: type="${element.type}" name="${element.getAttribute('name')}" placeholder="${element.getAttribute('placeholder')}"`);
        });
      } else {
        cy.log('No inputs found');
      }
    });

    // Try to find any buttons
    cy.get('body').find('button').then(($buttons) => {
      if ($buttons.length > 0) {
        cy.log(`Found ${$buttons.length} buttons`);
        $buttons.each((index, element) => {
          cy.log(`Button ${index}: "${element.textContent}" class="${element.className}"`);
        });
      } else {
        cy.log('No buttons found');
      }
    });

    // Check if Angular is loaded
    cy.window().then((win) => {
      if ((win as any)?.ng) {
        cy.log('Angular is loaded');
      } else {
        cy.log('Angular is NOT loaded');
      }
    });

    // Check for any error messages in console
    cy.window().then((win) => {
      const errors: string[] = [];
      const originalError = win.console.error;
      win.console.error = (...args) => {
        errors.push(args.join(' '));
        originalError.apply(win.console, args);
      };

      if (errors.length > 0) {
        cy.log('Console errors:', errors);
      }
    });

    // Take a screenshot
    cy.screenshot('login-page-debug');
  });

  it('should check if route exists', () => {
    cy.visit('/auth/login', { failOnStatusCode: false });

    cy.url().then((url) => {
      cy.log('Current URL:', url);
    });

    cy.get('body').should('exist');
  });
});
