import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import createHttpUserAgent from '@commercetools/http-user-agent';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';
import { PageConfig } from '../../components/library/general';
import { useAppConfig } from '../app-config';

export interface ContextShape {
  datasources: {};
}

const initialState = {
  datasources: {} as {},
} as ContextShape;

export const PageWrapperContext = createContext(initialState);

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

const PageWrapperProvider = ({
  children,
  pageConfig,
}: React.PropsWithChildren<{ pageConfig: PageConfig }>) => {
  const { datasources: datasourceResponses } = useAppConfig();
  const [isLoading, setIsLoading] = useState(true);

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
    if (!pageConfig || !datasourceResponses) {
      return;
    }
    const availableDatasources = datasourceResponses.filter((response) =>
      pageConfig.datasourceRefs?.find((ds) => ds.key === response.key)
    );
    if (!availableDatasources || !availableDatasources.length) {
      setIsLoading(false);
      return;
    }

    availableDatasources.forEach((availableDatasource) => {
      fetcher({
        query: availableDatasource.value?.query || '',
        variables: JSON.parse(availableDatasource.value?.variables || '{}'),
      }).then((data) => {
        setDatasources((prevDatasources) => {
          return {
            ...prevDatasources,
            [availableDatasource.key]: data,
          };
        });
        setIsLoading(false);
      });
    });

    // availableDatasources.map((response) => );
  }, [datasourceResponses, pageConfig.datasourceRefs]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }
  return (
    <PageWrapperContext.Provider
      value={{
        datasources,
      }}
    >
      {children}
    </PageWrapperContext.Provider>
  );
};
export default PageWrapperProvider;
export const usePageWrapper = () => useContext(PageWrapperContext);
