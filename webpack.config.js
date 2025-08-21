/***************************************************************************************************
 * WEBPACK CONFIG
 *
 * Purpose:
 * Configure Webpack to bundle the app with Node.js polyfills so it can run in the browser.
 *
 * Includes:
 * 1. target: 'node'       → Target Node environment (SSR or Node-like features).
 * 2. entry/output         → Define entry file and output bundle.
 * 3. resolve.fallback     → Map Node core modules to browser-friendly polyfills.
 * 4. plugins              → Add Node polyfills and global variables (process, Buffer).
 * 5. externals            → Exclude certain Node modules, keep them as native.
 **************************************************************************************************/

const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  target: 'node',

  entry: './src/main.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      crypto: require.resolve('crypto-browserify'),
      querystring: require.resolve('querystring-es3'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser'),
      net: false,
      tls: false,
      fs: false,
      child_process: false,
      worker_threads: false,
    }
  },

  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],

  externals: {
    'node:http': 'commonjs node:http',
    'node:buffer': 'commonjs node:buffer',
    'node:querystring': 'commonjs node:querystring',
    'node:events': 'commonjs node:events'
  },
};
