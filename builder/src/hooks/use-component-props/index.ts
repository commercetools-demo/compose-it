import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { PagedQueryResponse } from '../../types/general';
import { ComponentProp, ComponentPropResponse } from '../../types/datasource';
import { buildUrlWithParams } from '../../utils/utils';
import { DEFAULT_BUILTIN_COMPONENTS } from './default-builtin-components';

const CONTAINER = `${APP_NAME}_component_props`;

export const useComponentProps = () => {
  const context = useApplicationContext((context) => context);
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<ComponentPropResponse>
  >();
  const dispatchAppsAction = useAsyncDispatch<
    TSdkAction,
    ComponentPropResponse
  >();

  const fetchAllComponentProps = async (
    limit: number = 500,
    page: number = 1
  ) => {
    const offset = (page - 1) * limit;

    const result = await dispatchAppsRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${context?.project?.key}/custom-objects/${CONTAINER}`,
          {
            ...(limit && { limit: limit.toString() }),
            ...(offset && { offset: offset.toString() }),
          }
        ),
      })
    );
    return result?.results;
  };

  const updateComponentProp = async (
    componentType: string,
    payload: ComponentProp
  ): Promise<ComponentPropResponse> => {
    const key = componentType;
    const result = await dispatchAppsAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key,
          value: payload,
        },
      })
    );
    return result;
  };

  const createDefaultComponents = async (): Promise<
    ComponentPropResponse[]
  > => {
    for await (const component of DEFAULT_BUILTIN_COMPONENTS) {
      await updateComponentProp(component.key, component.value);
    }
    return fetchAllComponentProps();
  };

  return {
    fetchAllComponentProps,
    createDefaultComponents,
    updateComponentProp,
  };
};
