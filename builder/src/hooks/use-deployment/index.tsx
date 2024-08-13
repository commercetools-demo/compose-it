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
import { ConnectorDraft } from './types/connector';

export const useDeployment = () => {
  const dispatchAppsRead = useAsyncDispatch<TSdkAction, any>();
  //   const context = useApplicationContext((context) => context);

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

  const getConnectors = async (organizationId: string) => {
    const result = await dispatchAppsRead(
      actions.get({
        mcApiProxyTarget: 'connect',
        uri: `/${organizationId}/connectors`,
        includeUserPermissions: true,
      })
    );
  };

  const createConnectorDraft = async (connectorDraft: ConnectorDraft) => {
    const result = await dispatchAppsRead(
      actions.post({
        payload: connectorDraft,
        mcApiProxyTarget: 'connect',
        uri: `/${organizationId}/connectors/drafts`,
        includeUserPermissions: true,
      })
    );
  };

  return {
    getConnectors,
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
