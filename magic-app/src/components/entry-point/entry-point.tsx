import { lazy } from 'react';
import {
  ApplicationShell,
  setupGlobalErrorListener,
} from '@commercetools-frontend/application-shell';
import type { ApplicationWindow } from '@commercetools-frontend/constants';
import loadMessages from '../../load-messages';
import { AppConfig } from '../library/general';

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

const sampleAppConfig: AppConfig = {
  pages: [
    {
      id: 'home-page',
      route: '/',
      layout: {
        type: 'grid',
        columns: 12,
      },
      components: [
        {
          type: 'Page',
          id: 'main-page',
          props: {
            layout: [
              { column: 1, row: 1, width: 12, height: 1 },
              { column: 1, row: 2, width: 6, height: 2 },
              { column: 7, row: 2, width: 6, height: 2 },
              { column: 1, row: 4, width: 6, height: 2 },
            ],
          },
          children: [
            {
              type: 'Text.Headline',
              id: 'header',
              props: { children: 'Welcome to our Dynamic Page' },
            },
            {
              type: 'Card',
              id: 'info-card',
              props: { title: 'Information' },
              children: [
                {
                  type: 'Text.Body',
                  id: 'info-text',
                  props: { children: 'This is a dynamically rendered page.' },
                },
              ],
            },
            {
              type: 'PrimaryButton',
              id: 'action-button',
              props: {
                label: 'Click me',
                onClick: () => alert('Button clicked!'),
              },
            },
            {
              type: 'Link',
              id: 'action-sasda',
              props: { to: 'about' },
              children: [
                {
                  type: 'Text.Body',
                  id: 'action-sasda-text',
                  props: { children: 'About' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'about-page',
      route: '/about',
      layout: {
        type: 'grid',
        columns: 12,
      },
      components: [
        {
          type: 'Page',
          id: 'main-page',
          props: {
            layout: [
              { column: 1, row: 1, width: 12, height: 1 },
              { column: 1, row: 2, width: 6, height: 2 },
              { column: 7, row: 2, width: 6, height: 2 },
            ],
          },
          children: [
            {
              type: 'Text',
              id: 'header',
              props: { content: 'Welcome to our Dynamic Page' },
            },
            {
              type: 'Card',
              id: 'info-card',
              props: { title: 'Information' },
              children: [
                {
                  type: 'Text',
                  id: 'info-text',
                  props: { content: 'This is a dynamically rendered page.' },
                },
              ],
            },
            {
              type: 'Button',
              id: 'action-button',
              props: {
                label: 'Click me',
                onClick: () => alert('Button clicked!'),
              },
            },
          ],
        },
      ],
    },
    // ... more pages
  ],
};

const EntryPoint = () => (
  <ApplicationShell
    enableReactStrictMode
    environment={window.app}
    applicationMessages={loadMessages}
  >
    <AsyncApplicationRoutes appConfig={sampleAppConfig} />
  </ApplicationShell>
);
EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
