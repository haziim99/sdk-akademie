const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    supportFile: 'cypress/support/e2e.js',

    env: {
      firebase_config: {
        apiKey: "AIzaSyCL1zs7mVkugzizMFM-VDnSGpQkic1snWQ",
        authDomain: "sdk-akademie1.firebaseapp.com",
        projectId: "sdk-akademie1"
      },
      test_users: {
        admin: {
          email: "admin@test.com",
          password: "admin123",
          role: "admin"
        },
        user: {
          email: "user@test.com",
          password: "user123",
          role: "user"
        }
      }
    },

    setupNodeEvents(on, config) {
      // Custom tasks for Firebase operations
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    },

    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000
  }
});
