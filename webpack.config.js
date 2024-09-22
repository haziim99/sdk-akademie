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
      "net": false,
      "tls": false,
      "fs": false,
      "child_process": false,
      "worker_threads": false,
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
