import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import uniqueId from 'lodash/uniqueId';
import { PagedQueryResponse } from '../../types/general';
import { ActionResponse, ActionDraft, Action } from '../../types/datasource';
import { buildUrlWithParams } from '../../utils/utils';

const CONTAINER = `${APP_NAME}_actions`;
const ACTIONS_KEY_PREFIX = 'action-';

export const useAction = () => {
  const context = useApplicationContext((context) => context);
  const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    PagedQueryResponse<ActionResponse>
  >();
  const dispatchAppsAction = useAsyncDispatch<TSdkAction, ActionResponse>();

  const fetchAllActions = async (limit: number = 20, page: number = 1) => {
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

  const createAction = async (
    payload: ActionDraft
  ): Promise<ActionResponse> => {
    const key = uniqueId(ACTIONS_KEY_PREFIX);
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
          } as ActionDraft,
        },
      })
    );
    return result;
  };

  const deleteAction = async (actionKey: string): Promise<ActionResponse> => {
    if (!actionKey) {
      return {} as ActionResponse;
    }
    const result = await dispatchAppsAction(
      actions.del({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${actionKey}`,
      })
    );
    return result;
  };

  const getAction = async (actionKey: string): Promise<ActionResponse> => {
    if (!actionKey) {
      return {} as ActionResponse;
    }
    const result = await dispatchAppsAction(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: `/${context?.project?.key}/custom-objects/${CONTAINER}/${actionKey}`,
      })
    );
    return result;
  };

  const updateAction = async (
    actionKey: string,
    action?: Action
  ): Promise<ActionResponse> => {
    if (!actionKey || !action) {
      return {} as ActionResponse;
    }
    const result = await getAction(actionKey).then((ac) => {
      return dispatchAppsAction(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: `/${context?.project?.key}/custom-objects`,
          payload: {
            container: CONTAINER,
            key: actionKey,
            value: {
              ...ac.value,
              ...action,
            } as ActionDraft,
          },
        })
      );
    });
    return result;
  };

  return {
    fetchAllActions: fetchAllActions,
    getAction: getAction,
    updateAction: updateAction,
    deleteAction: deleteAction,
    createAction: createAction,
  };
};
