import React, { createContext, useContext, useEffect, useState } from 'react';
import { App } from '../../types/app';
import { ActionResponse, DatasourceResponse } from '../../types/datasource';
import { useApps } from '../../hooks/use-app';
import { useDatasource } from '../../hooks/use-datasource';
import { useAction } from '../../hooks/use-action';

export interface ContextShape {
  appConfig: App;
  datasources: DatasourceResponse[];
  actions: ActionResponse[];
}

const initialState = {
  appConfig: {} as App,
  datasources: [] as DatasourceResponse[],
  actions: [] as ActionResponse[],
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
  const { fetchAllActions } = useAction();
  const [appConfig, setAppConfig] = useState<App>(initialState.appConfig);
  const [datasourceResponses, setDatasourceResponses] = useState<
    DatasourceResponse[]
  >([]);
  const [actionResponses, serActionResponses] = useState<ActionResponse[]>([]);

  const fetchAll = async () => {
    const [datasources, app, actions] = await Promise.all([
      fetchAllDatasources(),
      getApp(APP_KEY),
      fetchAllActions(),
    ]);

    setDatasourceResponses(datasources?.results);
    setAppConfig(sortRoutes(app));
    serActionResponses(actions?.results);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (!appConfig || !datasourceResponses) {
    return null;
  }

  return (
    <AppConfigContext.Provider
      value={{
        appConfig,
        datasources: datasourceResponses,
        actions: actionResponses,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
export default AppConfigProvider;
export const useAppConfig = () => useContext(AppConfigContext);
