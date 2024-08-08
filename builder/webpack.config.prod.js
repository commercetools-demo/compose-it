const {
  createWebpackConfigForDevelopment,
} = require('@commercetools-frontend/mc-scripts/webpack');

// Create the default config
const config = createWebpackConfigForDevelopment();


// Export the config
module.exports = config;
