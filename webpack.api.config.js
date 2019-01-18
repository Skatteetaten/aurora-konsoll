const path = require('path');

module.exports = {
  entry: './api/server.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.json'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      models: path.resolve(__dirname, 'src/models/')
    }
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build-api')
  },
  target: 'node'
};
