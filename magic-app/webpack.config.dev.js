const {
  createWebpackConfigForDevelopment,
} = require('@commercetools-frontend/mc-scripts/webpack');

const path = require('path');

const sourceFolders = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, '../shared/src'),
];

const resolve = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  alias: {
    '@shared': path.resolve(__dirname, '../shared/src'),
  },
};



const config = createWebpackConfigForDevelopment({ sourceFolders });

config.resolve = {
  ...config.resolve,
  ...resolve,
};

config.module = {
  ...config.module,
};

module.exports = config;
