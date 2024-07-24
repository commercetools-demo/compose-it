import React, { useContext, useEffect, useState } from 'react';
import { PagedQueryResponse } from '../../types/general';
import { App } from '../../types/app';
import { useApps } from '../../hooks/use-app';

interface BuilderStateContextReturn {
  apps?: PagedQueryResponse<App>;
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
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllApps } = useApps();

  const getApps = async (limit?: number, page?: number) => {
    setIsLoading(true);
    const result = await fetchAllApps(limit, page);
    setApps(result);
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
