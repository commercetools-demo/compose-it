import React, { useContext, useEffect, useState } from 'react';
import { PagedQueryResponse } from '../../types/general';
import { App } from '../../types/app';
import { useApps } from '../../hooks/use-app';
import {
  ActionResponse,
  ComponentProp,
  ComponentPropResponse,
  DatasourceResponse,
  FlyingComponentsResponse,
} from '../../types/datasource';
import { useDatasource } from '../../hooks/use-datasource';
import { useAction } from '../../hooks/use-action';
import { useComponentProps } from '../../hooks/use-component-props';
import { useFlyingComponents } from '../../hooks/use-flying-components';
import { builtInComponentLibrary } from '../../components/library';
import { useRuntimeComponents } from '../../components/home/flying-components/hooks/use-runtime-components';

interface BuilderStateContextReturn {
  apps?: PagedQueryResponse<App>;
  datasources?: PagedQueryResponse<DatasourceResponse>;
  components?: ComponentPropResponse[];
  flyingComponents?: FlyingComponentsResponse[];
  actions?: PagedQueryResponse<ActionResponse>;
  componentLibrary: Record<string, any>;
  getComponentProps: (componentType: string) => ComponentProp | undefined;
  refreshData?: () => void;
  isLoading?: boolean;
}

const initialData = {
  Apps: {} as PagedQueryResponse<App>,
  getComponentProps: () => undefined,
  isLoading: false,
  componentLibrary: {},
};

const BuilderStateContext =
  React.createContext<BuilderStateContextReturn>(initialData);

const BuilderStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { loadComponentsForRuntime } = useRuntimeComponents();
  const [apps, setApps] = useState<PagedQueryResponse<App>>();
  const [datasources, setDatasources] =
    useState<PagedQueryResponse<DatasourceResponse>>();
  const [actions, setActions] = useState<PagedQueryResponse<ActionResponse>>();
  const [componentProps, setComponentProps] =
    useState<ComponentPropResponse[]>();
  const [flyingComponents, setFlyingComponents] =
    useState<FlyingComponentsResponse[]>();

  const [componentLibrary, setComponentLibrary] = useState<Record<string, any>>(
    builtInComponentLibrary
  );
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllApps } = useApps();
  const { fetchAllDatasources } = useDatasource();
  const { fetchAllActions } = useAction();
  const { fetchAllComponentProps } = useComponentProps();
  const { fetchAllFlyingComponents } = useFlyingComponents();

  const getComponentProps = (
    componentType: string
  ): ComponentProp | undefined => {
    return componentProps?.find((component) => component.key === componentType)
      ?.value;
  };

  const getApps = async (limit?: number, page?: number) => {
    setIsLoading(true);

    const [
      appResult,
      datasourceResult,
      actionResult,
      componentProps,
      flyingComponents,
    ] = await Promise.all([
      fetchAllApps(limit, page),
      fetchAllDatasources(limit, page),
      fetchAllActions(limit, page),
      fetchAllComponentProps(),
      fetchAllFlyingComponents(limit, page),
    ]);
    setApps(appResult);
    setDatasources(datasourceResult);
    setActions(actionResult);
    setComponentProps(componentProps);
    setFlyingComponents(flyingComponents);
    if (flyingComponents && flyingComponents.length > 0) {
      setComponentLibrary((prev) => ({
        ...prev,
        ...loadComponentsForRuntime(flyingComponents),
      }));
      // addComponentsToLibrary(flyingComponents);
    }
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
        componentLibrary,
        flyingComponents,
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
