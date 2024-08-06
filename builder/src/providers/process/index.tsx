import React, { useContext, useEffect, useState } from 'react';
import { PagedQueryResponse } from '../../types/general';
import { App } from '../../types/app';
import { useApps } from '../../hooks/use-app';
import { ActionResponse, DatasourceResponse } from '../../types/datasource';
import { useDatasource } from '../../hooks/use-datasource';
import { useAction } from '../../hooks/use-action';

interface BuilderStateContextReturn {
  apps?: PagedQueryResponse<App>;
  datasources?: PagedQueryResponse<DatasourceResponse>;
  actions?: PagedQueryResponse<ActionResponse>;
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
  const [actions, setActions] = useState<PagedQueryResponse<ActionResponse>>();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllApps } = useApps();
  const { fetchAllDatasources } = useDatasource();
  const { fetchAllActions } = useAction();

  const getApps = async (limit?: number, page?: number) => {
    setIsLoading(true);

    const [appResult, datasourceResult, actionResult] = await Promise.all([
      fetchAllApps(limit, page),
      fetchAllDatasources(limit, page),
      fetchAllActions(limit, page),
    ]);
    setApps(appResult);
    setDatasources(datasourceResult);
    setActions(actionResult);
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
        actions,
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
