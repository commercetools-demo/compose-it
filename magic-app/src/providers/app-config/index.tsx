import React, { createContext, useContext, useEffect, useState } from 'react';
import { App } from '../../types/app';
import { DatasourceResponse } from '../../types/datasource';
import { useApps } from '../../hooks/use-app';
import { useDatasource } from '../../hooks/use-datasource';

export interface ContextShape {
  appConfig: App;
  datasources: DatasourceResponse[];
}

const initialState = {
  appConfig: {} as App,
  datasources: [] as DatasourceResponse[],
} as ContextShape;

export const AppConfigContext = createContext(initialState);

const APP_KEY = 'app-15';

const sortRoutes = (app: App): App => {
  if (!app.value) {
    return app;
  }
  return {
    ...app,
    value: {
      ...app.value,
      appConfig: {
        ...app.value.appConfig,
        pages: app.value.appConfig.pages.sort((a, b) => {
          // Sort by route specificity (more segments come first)
          const aSegments = a.route.split('/').filter(Boolean);
          const bSegments = b.route.split('/').filter(Boolean);

          if (aSegments.length !== bSegments.length) {
            return bSegments.length - aSegments.length;
          }

          // If same number of segments, sort alphabetically
          return a.route.localeCompare(b.route);
        }),
      },
    },
  };
};

const AppConfigProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { getApp } = useApps();
  const { fetchAllDatasources } = useDatasource();
  const [appConfig, setAppConfig] = useState<App>(initialState.appConfig);
  const [datasourceResponses, setDatasourceResponses] = useState<
    DatasourceResponse[]
  >([]);

  useEffect(() => {
    fetchAllDatasources().then((datasources) => {
      setDatasourceResponses(datasources?.results);
    });
    getApp(APP_KEY).then((app) => {
      setAppConfig(sortRoutes(app));
    });
  }, []);

  if (!appConfig || !datasourceResponses) {
    return null;
  }

  return (
    <AppConfigContext.Provider
      value={{
        appConfig,
        datasources: datasourceResponses,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
export default AppConfigProvider;
export const useAppConfig = () => useContext(AppConfigContext);
