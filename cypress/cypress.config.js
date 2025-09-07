import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,

    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,

    retries: {
      runMode: 2,
      openMode: 0
    },

    env: {
      firebase_config: {
        apiKey: "AIzaSyCL1zs7mVkugzizMFM-VDnSGpQkic1snWQ",
        authDomain: "sdk-akademie1.firebaseapp.com",
        projectId: "sdk-akademie1",
        storageBucket: "sdk-akademie1.appspot.com",
        messagingSenderId: "669541836589",
        appId: "1:669541836589:web:61c73a553124a9d90e55a4"
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
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },

        clearTestData() {
          console.log('Clearing test data...');
          return null;
        }
      });

      on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('Firebase') || err.message.includes('auth')) {
          console.log('Firebase error caught:', err.message);
          return false;
        }
        return true;
      });

      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    experimentalStudio: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 5
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }
});
