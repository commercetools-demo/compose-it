import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import {
  DeployedStatus,
  Deployment,
  DeploymentResponse,
  DeploymentStatus,
  DeploymentStatusValue,
} from './types/deployment';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { buildUrlWithParams } from '../../utils/utils';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { APP_NAME } from '../../constants';
import { useAppContext } from '../../providers/app';
import { MyCustomApplication } from './types/app';
import { useCallback } from 'react';

const CONTAINER = `${APP_NAME}_deployments`;
const DEPLOYMENT_KEY_PREFIX = 'deployment-';

const getDeploymentKey = (appKey?: string) =>
  `${DEPLOYMENT_KEY_PREFIX}${appKey}`;

export const useDeploymentStatuses = ({
  updateApps,
  myCustomApplications,
}: {
  updateApps: () => Promise<any>;
  myCustomApplications?: MyCustomApplication[];
}) => {
  const context = useApplicationContext((context) => context);
  const { appGeneralInfo } = useAppContext();

  const dispatchCustomObjectsRead = useAsyncDispatch<
    TSdkAction,
    DeploymentStatus
  >();
  const dispatchCustomObjectCreate = useAsyncDispatch<
    TSdkAction,
    DeploymentStatus
  >();

  const dispatchDeploymentsRead = useAsyncDispatch<
    TSdkAction,
    DeploymentResponse
  >();
  const fetchDeploymentStatuses = async () => {
    const result = await dispatchCustomObjectsRead(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        uri: buildUrlWithParams(
          `/${
            context?.project?.key
          }/custom-objects/${CONTAINER}/${getDeploymentKey(
            appGeneralInfo?.key
          )}`,
          {}
        ),
      })
    ).catch((e) => {
      return {
        value: [],
      };
    });
    return result.value;
  };

  const createDeploymentStatus = async (
    deploymentStatus: DeploymentStatusValue
  ) => {
    const result = await fetchDeploymentStatuses().then((result) =>
      dispatchCustomObjectCreate(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          uri: buildUrlWithParams(
            `/${context?.project?.key}/custom-objects`,
            {}
          ),
          payload: {
            container: CONTAINER,
            key: getDeploymentKey(appGeneralInfo?.key),
            value: [...(result || []), deploymentStatus],
          },
        })
      )
    );
    return result;
  };
  const getDeploymentStatuses = useCallback(async (): Promise<
    DeployedStatus[]
  > => {
    const statuses = await fetchDeploymentStatuses();
    if (!statuses) {
      return [];
    }
    await updateApps();

    const deploymentResults: DeployedStatus[][] = await Promise.all(
      statuses.map((status) => {
        return dispatchDeploymentsRead(
          actions.get({
            // @ts-ignore
            mcApiProxyTarget: 'connect',
            uri: buildUrlWithParams(`/${status.organizationId}/deployments`, {
              limit: 100,
            }),
          })
        ).then((result) =>
          result?.results
            .filter((deployment) => deployment.id === status.deploymentId)
            .map((deployment) => {
              const app = myCustomApplications?.find(
                (app) => app.id === status.customAppId
              );

              return {
                ...deployment,
                app,
                organizationId: status.organizationId,
              };
            })
        );
      })
    );

    const deployments = deploymentResults.flat();

    return deployments;
  }, [myCustomApplications]);

  return {
    createDeploymentStatus,
    getDeploymentStatuses,
  };
};
