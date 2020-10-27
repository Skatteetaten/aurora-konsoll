const path = require('path');

module.exports = config => {
  if (process.env.NODE_ENV === 'production') {
    config.output.libraryTarget = 'system';
  }
  config.entry = './src/skatteetaten-aurora-konsoll.tsx';
  config.externals = ['react', 'react-dom', '@skatteetaten/frontend-components'];
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