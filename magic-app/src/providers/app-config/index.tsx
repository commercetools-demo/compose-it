import React, { createContext, useContext, useEffect, useState } from 'react';
import { App } from '../../types/app';
import { ActionResponse, DatasourceResponse } from '../../types/datasource';
import { useApps } from '../../hooks/use-app';
import { useDatasource } from '../../hooks/use-datasource';
import { useAction } from '../../hooks/use-action';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useRuntimeComponents } from '../../hooks/use-runtime-components/use-runtime-components';
import { useFlyingComponents } from '../../hooks/use-flying-components';
import { builtInComponentLibrary } from '../../components/library';

export interface ContextShape {
  appConfig: App;
  datasources: DatasourceResponse[];
  actions: ActionResponse[];
  componentLibrary: Record<string, any>;
}

const initialState = {
  appConfig: {} as App,
  datasources: [] as DatasourceResponse[],
  actions: [] as ActionResponse[],
  componentLibrary: {},
} as ContextShape;

export const AppConfigContext = createContext(initialState);

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
  const { loadComponentsForRuntime } = useRuntimeComponents();
  const { fetchAllFlyingComponents } = useFlyingComponents();

  const [componentLibrary, setComponentLibrary] = useState<Record<string, any>>(
    builtInComponentLibrary
  );
  const [appConfig, setAppConfig] = useState<App>(initialState.appConfig);

  const [datasourceResponses, setDatasourceResponses] = useState<
    DatasourceResponse[]
  >([]);
  const [actionResponses, serActionResponses] = useState<ActionResponse[]>([]);

  const { appKey } = useApplicationContext<
    { appKey: string },
    { appKey: string }
  >((context) => context.environment);

  const fetchAll = async () => {
    const [datasources, app, actions, flyingComponents] = await Promise.all([
      fetchAllDatasources(),
      getApp(appKey),
      fetchAllActions(),
      fetchAllFlyingComponents(),
    ]);

    if (flyingComponents && flyingComponents.length > 0) {
      setComponentLibrary((prev) => ({
        ...prev,
        ...loadComponentsForRuntime(flyingComponents),
      }));
    }

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
        componentLibrary,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
export default AppConfigProvider;
export const useAppConfig = () => useContext(AppConfigContext);
