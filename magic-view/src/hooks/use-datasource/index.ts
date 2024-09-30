import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { PagedQueryResponse } from '../../types/general';
import { buildUrlWithParams } from '../../utils/utils';
import { DatasourceResponse } from '../../types/datasource';

const CONTAINER = `${APP_NAME}_datasources`;

export const useDatasource = () => {
  const context = useApplicationContext((context) => context);
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<DatasourceResponse>
  >();

  const fetchAllDatasources = async (limit: number = 20, page: number = 1) => {
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
    return result;
  };

  return {
    fetchAllDatasources,
  };
};
