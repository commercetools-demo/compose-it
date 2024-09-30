import { App } from '../../types/app';
import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';

const CONTAINER = `${APP_NAME}_apps`;

export const useApps = () => {
  const context = useApplicationContext((context) => context);
  const dispatchAppsAction = useAsyncDispatch<TSdkAction, App>();

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

  return {
    getApp,
  };
};
