import { lazy } from 'react';
import {
  ApplicationShell,
  CustomViewShell,
  setupGlobalErrorListener,
} from '@commercetools-frontend/application-shell';
import type { ApplicationWindow } from '@commercetools-frontend/constants';
import loadMessages from '../../load-messages';
import AppConfigProvider from '../../providers/app-config';

declare let window: ApplicationWindow;

// Here we split up the main (app) bundle with the actual application business logic.
// Splitting by route is usually recommended and you can potentially have a splitting
// point for each route. More info at https://reactjs.org/docs/code-splitting.html
const AsyncApplicationRoutes = lazy(
  () => import('../../routes' /* webpackChunkName: "routes" */)
);

// Ensure to setup the global error listener before any React component renders
// in order to catch possible errors on rendering/mounting.
setupGlobalErrorListener();

const EntryPoint = () => (
  <CustomViewShell
    enableReactStrictMode
    applicationMessages={loadMessages}
  >
    <AppConfigProvider>
      <AsyncApplicationRoutes />
    </AppConfigProvider>
  </CustomViewShell>
);
EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
