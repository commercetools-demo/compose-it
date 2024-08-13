/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import FetchMyOrganizationsQuery from './fetch-my-organization.admin.graphql';
import FetchLoggedInUser from './fetch-logged-in-user.backend.graphql';
import { User } from './types/user';
import { OrganizationResponse } from './types/organization';
import { useCustomApplications } from './use-custom-applications';
import { useDeploymentStatuses } from './use-deployment-statuses';
import { useConnect } from './use-connect';

export const useDeployment = () => {
  const { createCustomApp, myCustomApplications, updateApps } =
    useCustomApplications();
  const { createDeploymentStatus, getDeploymentStatuses } =
    useDeploymentStatuses({ updateApps, myCustomApplications });
  const {
    getConnectors,
    getDeployments,
    createConnectorDraft,
    createDeployment,
  } = useConnect();

  const { data: userData, loading: userLoading } = useMcQuery<{ user: User }>(
    FetchLoggedInUser,
    {
      context: {
        target: GRAPHQL_TARGETS.MERCHANT_CENTER_BACKEND,
      },
    }
  );

  const { data: organizationData, loading: organizationLoading } = useMcQuery<{
    myOrganizations: OrganizationResponse;
  }>(FetchMyOrganizationsQuery, {
    context: {
      target: GRAPHQL_TARGETS.ADMINISTRATION_SERVICE,
    },
  });

  return {
    getConnectors,
    getDeployments,
    createConnectorDraft,
    createDeployment,
    createCustomApp,
    updateApps,
    createDeploymentStatus,
    getDeploymentStatuses,
    user: userData?.user,
    myApps: myCustomApplications,
    myOrganizations: organizationData?.myOrganizations.results,
  };
};
