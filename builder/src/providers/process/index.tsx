import React, { useContext, useEffect, useState } from 'react';
import { PagedQueryResponse } from '../../types/general';
import { App } from '../../types/app';
import { useApps } from '../../hooks/use-app';
import { DatasourceResponse } from '../../types/datasource';
import { useDatasource } from '../../hooks/use-datasource';

interface BuilderStateContextReturn {
  apps?: PagedQueryResponse<App>;
  datasources?: PagedQueryResponse<DatasourceResponse>;
  refreshData?: () => void;
  isLoading?: boolean;
}

const initialData = {
  Apps: {} as PagedQueryResponse<App>,
  isLoading: false,
};

const BuilderStateContext =
  React.createContext<BuilderStateContextReturn>(initialData);

const BuilderStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [apps, setApps] = useState<PagedQueryResponse<App>>();
  const [datasources, setDatasources] =
    useState<PagedQueryResponse<DatasourceResponse>>();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllApps } = useApps();
  const { fetchAllDatasources } = useDatasource();

  const getApps = async (limit?: number, page?: number) => {
    setIsLoading(true);

    const [appResult, datasourceResult] = await Promise.all([
      fetchAllApps(limit, page),
      fetchAllDatasources(limit, page),
    ]);
    setApps(appResult);
    setDatasources(datasourceResult);
    setIsLoading(false);
  };

  const refreshData = () => {
    getApps();
  };

  useEffect(() => {
    getApps();
  }, []);

  return (
    <BuilderStateContext.Provider
      value={{
        apps,
        datasources,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </BuilderStateContext.Provider>
  );
};

export default BuilderStateProvider;

export const useBuilderStateContext = () => useContext(BuilderStateContext);
