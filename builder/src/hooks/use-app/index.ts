import { App, AppDraft } from '../../types/app';
import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import uniqueId from 'lodash/uniqueId';
import { AppConfig } from '../../components/library/general';
import { PagedQueryResponse } from '../../types/general';
import { buildUrlWithParams } from '../../utils/utils';

const CONTAINER = `${APP_NAME}_apps`;
const APPS_KEY_PREFIX = 'app-';

export const useApps = () => {
  const context = useApplicationContext((context) => context);
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<App>
  >();
  const dispatchAppsAction = useAsyncDispatch<TSdkAction, App>();

  const fetchAllApps = async (limit: number = 20, page: number = 1) => {
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

  const createApp = async (payload: AppDraft): Promise<App> => {
    const key = uniqueId(APPS_KEY_PREFIX);
    const result = await dispatchAppsAction(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects`,
        payload: {
          container: CONTAINER,
          key,
          value: {
            ...payload,
            key,
          } as AppDraft,
        },
      })
    );
    return result;
  };

  const deleteApp = async (appKey: string): Promise<App> => {
    if (!appKey) {
      return {} as App;
    }
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${appKey}`,
      })
    );
    return result;
  };

  const getApp = async (appKey: string): Promise<App> => {
    if (!appKey) {
      return {} as App;
    }
    const result = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${appKey}`,
      })
    );
    return result;
  };

  const updateAppConfig = async (
    appKey: string,
    config?: AppConfig
  ): Promise<App> => {
    if (!appKey || !config) {
      return {} as App;
    }
    const result = await getApp(appKey).then((process) => {
      return dispatchAppsAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: appKey,
            value: {
              ...process.value,
              appConfig: config,
            } as AppDraft,
          },
        })
      );
    });
    return result;
  };

  return {
    fetchAllApps,
    getApp,
    updateAppConfig,
    deleteApp,
    createApp,
  };
};
