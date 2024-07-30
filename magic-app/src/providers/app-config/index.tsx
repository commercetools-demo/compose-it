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
      setAppConfig(app);
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
