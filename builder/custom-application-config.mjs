import { PERMISSIONS } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Compose It Builder',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  additionalEnv: {
    repoUrl: '${env:REPO_URL}',
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  headers: {
    csp: {
      'connect-src': [
        'https://cdn.jsdelivr.net',
        'blob:',
        'https://unpkg.com',
        "'unsafe-eval'",
      ],
      'script-src': [
        'https://cdn.jsdelivr.net',
        'blob:',
        'https://unpkg.com',
        "'unsafe-eval'",
      ],
      'style-src': ['https://cdn.jsdelivr.net'],
      'font-src': ['https://cdn.jsdelivr.net'],
    },
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
};

export default config;
