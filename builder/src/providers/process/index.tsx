import React, { useContext, useEffect, useState } from 'react';
import { PagedQueryResponse } from '../../types/general';
import { App } from '../../types/app';
import { useApps } from '../../hooks/use-app';
import {
  ActionResponse,
  ComponentProp,
  ComponentPropResponse,
  DatasourceResponse,
} from '../../types/datasource';
import { useDatasource } from '../../hooks/use-datasource';
import { useAction } from '../../hooks/use-action';
import { useComponentProps } from '../../hooks/use-components';

interface BuilderStateContextReturn {
  apps?: PagedQueryResponse<App>;
  datasources?: PagedQueryResponse<DatasourceResponse>;
  components?: ComponentPropResponse[];
  actions?: PagedQueryResponse<ActionResponse>;
  getComponentProps: (componentType: string) => ComponentProp | undefined;
  refreshData?: () => void;
  isLoading?: boolean;
}

const initialData = {
  Apps: {} as PagedQueryResponse<App>,
  getComponentProps: () => undefined,
  isLoading: false,
};

const BuilderStateContext =
  React.createContext<BuilderStateContextReturn>(initialData);

const BuilderStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [apps, setApps] = useState<PagedQueryResponse<App>>();
  const [datasources, setDatasources] =
    useState<PagedQueryResponse<DatasourceResponse>>();
  const [actions, setActions] = useState<PagedQueryResponse<ActionResponse>>();
  const [componentProps, setComponentProps] =
    useState<ComponentPropResponse[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllApps } = useApps();
  const { fetchAllDatasources } = useDatasource();
  const { fetchAllActions } = useAction();
  const { fetchAllComponentProps } = useComponentProps();

  const getComponentProps = (
    componentType: string
  ): ComponentProp | undefined => {
    return componentProps?.find((component) => component.key === componentType)
      ?.value;
  };

  const getApps = async (limit?: number, page?: number) => {
    setIsLoading(true);

    const [appResult, datasourceResult, actionResult, componentProps] =
      await Promise.all([
        fetchAllApps(limit, page),
        fetchAllDatasources(limit, page),
        fetchAllActions(limit, page),
        fetchAllComponentProps(),
      ]);
    setApps(appResult);
    setDatasources(datasourceResult);
    setActions(actionResult);
    setComponentProps(componentProps);
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
        components: componentProps,
        getComponentProps,
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
