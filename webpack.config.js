const path = require('path');

var main = {
  mode: 'development',
  target: 'electron-main',
  entry: path.join(__dirname, './src/main/index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist/main')
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: {
    rules: [{
      test: /.ts?$/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
      loader: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
    },
  },
};

var renderer = {
  mode: 'development',
  target: 'electron-renderer',
  entry: {
    index: path.join(__dirname, 'src/renderer/index.tsx'),
    settings: path.join(__dirname, 'src/renderer/settings.tsx')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/renderer')
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css', '.ts', '.tsx'],
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
    },
  },
  module: {
    rules: [{
      test: /\.(tsx|ts)$/,
      use: [
        'ts-loader'
      ],
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules'),
      ],
    }]
  },
};

var preload = {
  mode: 'development',
  target: 'electron-main',
  entry: path.join(__dirname, 'src/preload.ts'),
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.(ts)$/,
      use: [
        'ts-loader'
      ],
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules'),
      ],
    }]
  },
};

module.exports = [
  main, renderer, preload
];
