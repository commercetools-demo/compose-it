import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { App } from '../../types/app';
import { DatasourceResponse } from '../../types/datasource';
import { useApps } from '../../hooks/use-app';
import { useDatasource } from '../../hooks/use-datasource';
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import createHttpUserAgent from '@commercetools/http-user-agent';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';

export interface ContextShape {
  appConfig: App;
  datasources: {};
}

const initialState = {
  appConfig: {} as App,
  datasources: {} as {},
} as ContextShape;

export const AppConfigContext = createContext(initialState);

const APP_KEY = 'app-15';

const userAgent = createHttpUserAgent({
  name: 'fetch-client',
  libraryName: window.app.applicationName,
});

const graphqlFetcher = async (
  graphQLParams: FetcherParams,
  fetcherOpts?: FetcherOpts
) => {
  const data = await executeHttpClientRequest(
    async (options) => {
      const res = await fetch(buildApiUrl('/graphql'), {
        ...options,
        method: 'POST',
        body: JSON.stringify(graphQLParams),
      });
      const data = res.json();
      return {
        data,
        statusCode: res.status,
        getHeader: (key) => res.headers.get(key),
      };
    },
    {
      userAgent,
      headers: {
        'content-type': 'application/json',
        ...fetcherOpts?.headers,
      },
    }
  );
  return data;
};

const AppConfigProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { getApp } = useApps();
  const { fetchAllDatasources } = useDatasource();
  const [appConfig, setAppConfig] = useState<App>(initialState.appConfig);
  const [datasourceResponses, setDatasourceResponses] = useState<
    DatasourceResponse[]
  >([]);

  const [datasources, setDatasources] = useState({});

  const fetcher = useCallback(
    (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) =>
      graphqlFetcher(graphQLParams, {
        ...fetcherOpts,
        headers: {
          'X-GraphQL-Target': 'ctp',
        },
      }),
    []
  );

  useEffect(() => {
    fetchAllDatasources().then((datasources) => {
      setDatasourceResponses(datasources?.results);
    });
    getApp(APP_KEY).then((app) => {
      setAppConfig(app);
    });
  }, []);

  useEffect(() => {
    datasourceResponses.map((response) => {
      fetcher({
        query: response.value?.query || '',
        variables: JSON.parse(response.value?.variables || '{}'),
      }).then((data) => {
        setDatasources((prevDatasources) => {
          return {
            ...prevDatasources,
            [response.key]: data,
          };
        });
      });
    });
  }, [datasourceResponses]);

  if (!appConfig || !datasources) {
    return null;
  }

  return (
    <AppConfigContext.Provider
      value={{
        appConfig,
        datasources,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
export default AppConfigProvider;
export const useAppConfig = () => useContext(AppConfigContext);
