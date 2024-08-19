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
import LandingPageRenderer from '../../components/dynamic-page-renderer/landing-page';
import { useParams, useRouteMatch } from 'react-router';
import ModalPageRenderer from '../../components/dynamic-page-renderer/modal-page';

export interface ContextShape {
  datasources: {};
  fetcher: (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) => any;
  cachedData: Record<string, any>;
  updateCachedData: (key: string, value: any) => void;
}

const initialState = {
  datasources: {} as {},
  fetcher: () => {},
  cachedData: {} as Record<string, any>,
  updateCachedData: () => {},
} as ContextShape;

export const PageWrapperContext = createContext(initialState);

const userAgent = createHttpUserAgent({
  name: 'fetch-client',
  libraryName: window.app.applicationName,
});

const substituteParams = (variables: Record<string, any>, params: Record<string, any>) => {
  const substituteValue = (value: any): any => {
    if (typeof value === 'string') {
      return value.replace(/:(\w+)/g, (match, key) => {
        return params[key] || match;
      });
    } else if (Array.isArray(value)) {
      return value.map(substituteValue);
    } else if (typeof value === 'object' && value !== null) {
      return substituteParams(value, params);
    }
    return value;
  };

  return Object.entries(variables).reduce((acc: Record<string, any>, [key, value]) => {
    acc[key] = substituteValue(value);
    return acc;
  }, {});
};

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
  parentUrl,
  pageConfig,
}: React.PropsWithChildren<{ pageConfig: PageConfig; parentUrl?: string }>) => {
  const { datasources: datasourceResponses } = useAppConfig();
  const [isLoading, setIsLoading] = useState(true);
  const match = useRouteMatch();
  const params = useParams<Record<string, string>>();

  const [datasources, setDatasources] = useState({});
  const [cachedData, setCachedData] = useState<Record<string, any>>({});

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

  const updateCachedData = useCallback((key: string, value: any) => {
    setCachedData((prevData) => ({ ...prevData, [key]: value }));
  }, []);

  const renderPageType = (pageConfig: PageConfig, parentUrl?: string) => {
    switch (pageConfig.type) {
      case 'landing':
      case 'FormDetailPage':
        return (
          <LandingPageRenderer
            pageConfig={pageConfig}
            parentUrl={match.url}
            {...pageConfig.props}
          />
        );
      case 'FormModalPage':
        return (
          <ModalPageRenderer
            pageConfig={pageConfig}
            parentUrl={parentUrl}
            {...pageConfig.props}
          />
        );
      default:
        return <div>Unknown page type</div>;
    }
  };

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
        variables: availableDatasource.value?.variables
          ? substituteParams(JSON.parse(availableDatasource.value?.variables), match.params)
          : match.params,
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

  useEffect(() => {
    // Update cachedData with route params
    setCachedData((prevData) => ({ ...prevData, ...params }));
  }, [params]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }
  return (
    <PageWrapperContext.Provider
      value={{
        datasources,
        fetcher,
        cachedData,
        updateCachedData,
      }}
    >
      {renderPageType(pageConfig, parentUrl)}
    </PageWrapperContext.Provider>
  );
};
export default PageWrapperProvider;
export const usePageWrapper = () => useContext(PageWrapperContext);
