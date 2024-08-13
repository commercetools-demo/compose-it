/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import {
  useMcQuery,
  useMcMutation,
} from '@commercetools-frontend/application-shell';
import {
  GRAPHQL_TARGETS,
  MC_API_PROXY_TARGETS,
} from '@commercetools-frontend/constants';
//import type { TDataTableSortingState } from '@commercetools-uikit/hooks';
import FetchMyOrganizationsQuery from './fetch-my-organization.admin.graphql';
import MyCustomApps from './fetch-my-custom-apps.setting.graphql';
import CreateCustomApp from './create-custom-app.setting.graphql';
import FetchLoggedInUser from './fetch-logged-in-user.backend.graphql';
import {
  useAsyncDispatch,
  actions,
  TSdkAction,
} from '@commercetools-frontend/sdk';
import { User } from './types/user';
import { OrganizationResponse } from './types/organization';
import { CustomAppDraft, MyCustomApplication } from './types/app';
import { ConnectorDraft, ConnectorResponse } from './types/connector';
import {
  buildApiUrl,
  useApplicationContext,
} from '@commercetools-frontend/application-shell-connectors';
import { buildUrlWithParams } from '../../utils/utils';
import {
  Deployment,
  DeploymentDraft,
  DeploymentResponse,
  DeploymentStatus,
  DeploymentStatusValue,
} from './types/deployment';
import { APP_NAME } from '../../constants';
import { useAppContext } from '../../providers/app';

const CONTAINER = `${APP_NAME}_deployments`;
const DEPLOYMENT_KEY_PREFIX = 'deployment-';

const getDeploymentKey = (appKey?: string) =>
  `${DEPLOYMENT_KEY_PREFIX}${appKey}`;

export const useDeployment = () => {
  const dispatchCustomObjectsRead = useAsyncDispatch<
    TSdkAction,
    DeploymentStatus
  >();
  const dispatchCustomObjectCreate = useAsyncDispatch<
    TSdkAction,
    DeploymentStatus
  >();
  const dispatchAppsRead = useAsyncDispatch<TSdkAction, ConnectorResponse>();
  const dispatchDeploymentsRead = useAsyncDispatch<
    TSdkAction,
    DeploymentResponse
  >();
  const dispatchAppsCreate = useAsyncDispatch<TSdkAction, ConnectorDraft>();
  const dispatchDeploymentCreate = useAsyncDispatch<TSdkAction, Deployment>();
  const context = useApplicationContext((context) => context);
  const { appGeneralInfo } = useAppContext();

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

  const [executeCustomApp, { loading: addLoading }] = useMcMutation<{
    createCustomApplication: MyCustomApplication;
  }>(CreateCustomApp, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });
  const createCustomApp = async (
    organizationId: string,
    customAppDraft: CustomAppDraft
  ): Promise<MyCustomApplication | undefined> => {
    const result = await executeCustomApp({
      variables: {
        organizationId,
        data: customAppDraft,
      },
    });

    return result?.data?.createCustomApplication;
  };

  const { data: userData, loading: userLoading } = useMcQuery<{ user: User }>(
    FetchLoggedInUser,
    {
      context: {
        target: GRAPHQL_TARGETS.MERCHANT_CENTER_BACKEND,
      },
    }
  );
  const {
    data: myAppsData,
    loading: myAppsLoading,
    refetch: updateApps,
  } = useMcQuery<{
    myCustomApplications: MyCustomApplication[];
  }>(MyCustomApps, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });
  const { data: organizationData, loading: organizationLoading } = useMcQuery<{
    myOrganizations: OrganizationResponse;
  }>(FetchMyOrganizationsQuery, {
    context: {
      target: GRAPHQL_TARGETS.ADMINISTRATION_SERVICE,
    },
  });

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

  const getDeploymentStatuses = async (): Promise<Deployment[]> => {
    const statuses = await fetchDeploymentStatuses();
    if (!statuses) {
      return [];
    }

    const results: Deployment[] = [];
    for await (const status of statuses) {
      const result = await dispatchDeploymentsRead(
        actions.get({
          // @ts-ignore
          mcApiProxyTarget: 'connect',
          uri: buildUrlWithParams(`/${status.organizationId}/deployments`, {
            limit: 100,
          }),
        })
      );
      const filteredResults = result?.results.filter(
        (deployment) => deployment.id === status.deploymentId
      ) as Deployment[];

      results.push(...(filteredResults || []));
    }

    return results;
  };

  const createConnectorDraft = async (
    organizationId: string,
    connectorDraft: ConnectorDraft
  ) => {
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

  return {
    getConnectors,
    getDeployments,
    createCustomApp,
    createConnectorDraft,
    createDeployment,
    updateApps,
    createDeploymentStatus,
    getDeploymentStatuses,
    user: userData?.user,
    myApps: myAppsData?.myCustomApplications,
    myOrganizations: organizationData?.myOrganizations.results,
    // orderDetailsResult: data,
  };
};

// /proxy/connect/:organizationId
