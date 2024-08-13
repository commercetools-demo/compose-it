/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import {
  useMcQuery,
  useMcMutation,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
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
import { Deployment, DeploymentResponse } from './types/deployment';

export const useDeployment = () => {
  const dispatchAppsRead = useAsyncDispatch<TSdkAction, ConnectorResponse>();
  const dispatchDeploymentsRead = useAsyncDispatch<TSdkAction, DeploymentResponse>();
  const dispatchAppsCreate = useAsyncDispatch<TSdkAction, ConnectorDraft>();
  const context = useApplicationContext((context) => context);

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

    return result?.results.filter(deployment => deployment.connector.id === connectorId) as Deployment[];
  };

  const createConnectorDraft = async (
    organizationId: string,
    connectorDraft: ConnectorDraft
  ) => {
    const result = await dispatchAppsCreate(
      actions.post({
        payload: connectorDraft,
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
    updateApps,
    user: userData?.user,
    myApps: myAppsData?.myCustomApplications,
    myOrganizations: organizationData?.myOrganizations.results,
    // orderDetailsResult: data,
  };
};

// /proxy/connect/:organizationId
