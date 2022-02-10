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
          configFile: 'tsconfig.api.json',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '!.test.ts'],
    fallback: {
      util: require.resolve('util/'),
    },
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build-api'),
  },
  target: 'node',
};
