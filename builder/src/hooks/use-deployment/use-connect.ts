import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { buildUrlWithParams } from '../../utils/utils';
import { ConnectorResponse, ConnectorDraft } from './types/connector';
import {
  DeploymentResponse,
  Deployment,
  DeploymentDraft,
} from './types/deployment';
import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';

export const useConnect = () => {
  const context = useApplicationContext((context) => context);

  const dispatchAppsRead = useAsyncDispatch<TSdkAction, ConnectorResponse>();
  const dispatchDeploymentsRead = useAsyncDispatch<
    TSdkAction,
    DeploymentResponse
  >();
  const dispatchDeploymentCreate = useAsyncDispatch<TSdkAction, Deployment>();
  const getConnectors = async (
    organizationId: string
  ): Promise<ConnectorDraft[]> => {
    const result = await dispatchAppsRead(
      actions.get({
        // @ts-ignore
        mcApiProxyTarget: 'connect',
        uri: buildUrlWithParams(`/${organizationId}/connectors`, {
          limit: 100,
        }),
      })
    );

    return result?.results.filter((connector) =>
      connector.repository.url.includes(context.environment.repoUrl || '')
    ) as ConnectorDraft[];
  };

  const getDeployments = async (
    organizationId: string,
    connectorId?: string
  ): Promise<Deployment[]> => {
    const result = await dispatchDeploymentsRead(
      actions.get({
        // @ts-ignore
        mcApiProxyTarget: 'connect',
        uri: buildUrlWithParams(`/${organizationId}/deployments`, {
          limit: 100,
        }),
      })
    );

    return result?.results.filter(
      (deployment) => deployment.connector.id === connectorId
    ) as Deployment[];
  };

  const createConnectorDraft = async (
    organizationId: string,
    connectorDraft: ConnectorDraft
  ) => {
    // TODO: IMPLEMENT LATER
    return undefined;
  };

  const createDeployment = async (
    organizationId: string,
    deploymentDraft: DeploymentDraft
  ) => {
    const result = await dispatchDeploymentCreate(
      actions.post({
        payload: {
          projectKey: context?.project?.key,
          draft: {
            key: deploymentDraft.key,
            connector: deploymentDraft.connector,
            region: deploymentDraft.region,
            applications: deploymentDraft.configurations.map((config) => ({
              applicationName: config.applicationName,
              standardConfiguration: config.standardConfiguration,
              securedConfiguration: [],
            })),
          },
        },
        mcApiProxyTarget: 'connect',
        uri: `/${organizationId}/deployments`,
        includeUserPermissions: true,
      })
    );
    return result;
  };

  const updateDeployment = async (
    organizationId: string,
    deployment: Deployment
  ) => {
    const result = await dispatchDeploymentCreate(
      actions.post({
        payload: {
          version: deployment.version,
          actions: [
            {
              applications: deployment.applications.map((config) => ({
                applicationName: config.applicationName,
                standardConfiguration: config.standardConfiguration,
                securedConfiguration: [],
              })),
              action: 'redeploy',
            },
          ],

          // projectKey: context?.project?.key,
          // draft: {
          //   key: deploymentDraft.key,
          //   connector: deploymentDraft.connector,
          //   region: deploymentDraft.region,
          // },
        },
        mcApiProxyTarget: 'connect',
        uri: `/${organizationId}/deployments/${deployment.id}`,
        includeUserPermissions: true,
      })
    );
    return result;
  };
  return {
    getConnectors,
    getDeployments,
    createConnectorDraft,
    createDeployment,
    updateDeployment,
  };
};
