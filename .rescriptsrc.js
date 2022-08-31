const path = require('path');

// TODO: rescripts is deprecated (https://github.com/harrysolovay/rescripts)
module.exports = config => {
  config.output.libraryTarget = 'system';
  config.entry = './src/skatteetaten-aurora-konsoll.tsx';
  config.optimization.runtimeChunk = false;
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false
    }
  };
  config.output.path = path.resolve(__dirname, 'build');
  config.output.filename = 'skatteetaten-aurora-konsoll.js';

  return config;
};