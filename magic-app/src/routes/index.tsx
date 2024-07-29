import { useEffect, useState, type ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import { DynamicPageRendererProps } from './types';
import DynamicPageRenderer from '../components/dynamic-page-renderer';
import { useApps } from '../hooks/use-app';
import { App } from '../types/app';

type ApplicationRoutesProps = {
  children?: ReactNode;
} & DynamicPageRendererProps;
const NotFound: React.FC = () => <h1>404 - Page Not Found</h1>;

const ApplicationRoutes = () => {
  const match = useRouteMatch();
  const { getApp } = useApps();

  const [appConfig, setAppConfig] = useState<App>();

  useEffect(() => {
    getApp('app-15').then((app) => setAppConfig(app));
  }, []);

  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/merchant-center-customizations/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  if (!appConfig) {
    return null;
  }

  return (
    <Spacings.Inset scale="l">
      <Switch>
        {appConfig.value?.appConfig?.pages.map((pageConfig) => (
          <Route key={pageConfig.id} path={pageConfig.route}>
            <DynamicPageRenderer
              pageConfig={pageConfig}
              parentUrl={match.url}
            />
          </Route>
        ))}
        <Route path="*" component={NotFound} />
      </Switch>
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
