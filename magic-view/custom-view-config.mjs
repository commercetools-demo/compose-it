/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Magic View',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
    production: {
      customViewId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  additionalEnv: {
    appKey: '${env:APP_KEY}',
  },
  oAuthScopes: {
    view: ['view_products', 'view_customers', 'view_orders'],
    manage: ['manage_products', 'manage_customers', 'manage_orders'],
  },
  headers: {
    csp: {
      'connect-src': ["'unsafe-eval'"],
      'script-src': ["'unsafe-eval'"],
    },
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'LARGE',
  },
  locators: ['products.product_details.general'],
};

export default config;
