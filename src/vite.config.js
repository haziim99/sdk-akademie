// vite.config.js
import { defineConfig } from 'vite';
import externalize from 'rollup-plugin-externalize';

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      externalize({
        modules: ['undici', 'node:http', 'node:buffer', 'node:querystring', 'node:events']
      }),
    ],
    resolve: {
      alias: {
      },
    },
    build: {
      rollupOptions: {
        external: ['undici', 'node:http', 'node:buffer', 'node:querystring', 'node:events'],
        output: {
          globals: {
            'undici': 'undici',
            'node:http': 'http',
            'node:buffer': 'buffer',
            'node:querystring': 'querystring',
            'node:events': 'events',
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ['undici', 'firebase'],
    },
  };
});
