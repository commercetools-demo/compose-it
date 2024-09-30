import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { PagedQueryResponse } from '../../types/general';
import {
  FlyingComponent,
  FlyingComponentsResponse,
} from '../../types/datasource';
import { buildUrlWithParams } from '../../utils/utils';

const CONTAINER = `${APP_NAME}_flying_components`;

export const useFlyingComponents = () => {
  const context = useApplicationContext((context) => context);
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<FlyingComponentsResponse>
  >();
  const dispatchAppsAction = useAsyncDispatch<
    TSdkAction,
    FlyingComponentsResponse
  >();

  const fetchAllFlyingComponents = async (
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
    ).catch((error) => {
      console.error(error);
      return {
        results: [],
      };
    });
    return result?.results;
  };

  const updateFlyingComponent = async (
    componentType: string,
    payload: FlyingComponent
  ): Promise<FlyingComponentsResponse> => {
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

  return {
    fetchAllFlyingComponents,
    updateFlyingComponent,
  };
};
