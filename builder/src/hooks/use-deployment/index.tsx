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
import { useCustomViews } from './use-custom-views';

export const useDeployment = () => {
  const {
    createCustomApp,
    myCustomApplications,
    updateApps,
    updateCustomApp,
    changeCustomAppStatus,
    installCustomApp,
    uninstallCustomApp,
  } = useCustomApplications();
  const {
    createCustomView,
    myCustomViews,
    updateViews,
    updateCustomView,
    changeCustomViewStatus,
    installCustomView,
    uninstallCustomView,
  } = useCustomViews();
  const {
    createDeploymentStatus,
    getDeploymentStatuses,
    updateDeploymentStatus,
  } = useDeploymentStatuses({ updateApps, myCustomApplications });
  const {
    getConnectors,
    getDeployments,
    createConnectorDraft,
    createDeployment,
    updateDeployment,
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
    updateDeployment,
    createConnectorDraft,
    createDeployment,
    createCustomApp,
    updateCustomApp,
    changeCustomAppStatus,
    installCustomApp,
    uninstallCustomApp,
    updateApps,
    createCustomView,
    updateViews,
    updateCustomView,
    changeCustomViewStatus,
    installCustomView,
    uninstallCustomView,
    createDeploymentStatus,
    getDeploymentStatuses,
    updateDeploymentStatus,
    user: userData?.user,
    myApps: myCustomApplications,
    myViews: myCustomViews,
    myOrganizations: organizationData?.myOrganizations.results,
  };
};
