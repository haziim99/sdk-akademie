import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'u5ooff',
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
