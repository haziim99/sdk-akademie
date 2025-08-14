const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // Target node environment (SSR or server-side features)
  target: 'node',

  // Entry point of the application
  entry: './src/main.ts',

  // Output bundled file configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  // Resolve fallbacks for Node.js core modules in the browser
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
      "assert": require.resolve("assert/"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "zlib": require.resolve("browserify-zlib"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/"),
      "crypto": require.resolve("crypto-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "process": require.resolve("process/browser"),

      // These modules cannot run in browser environments, so we disable them
      "net": false,
      "tls": false,
      "fs": false,
      "child_process": false,
      "worker_threads": false,
    }
  },

  // Plugins to inject polyfills and global variables
  plugins: [
    new NodePolyfillPlugin(), // Provides polyfills for Node core modules
    new webpack.ProvidePlugin({
      process: 'process/browser', // Makes 'process' globally available
      Buffer: ['buffer', 'Buffer'], // Makes 'Buffer' globally available
    }),
  ],

  // Exclude certain modules from the bundle (use native Node versions)
  externals: {
    'node:http': 'commonjs node:http',
    'node:buffer': 'commonjs node:buffer',
    'node:querystring': 'commonjs node:querystring',
    'node:events': 'commonjs node:events'
  },
};
