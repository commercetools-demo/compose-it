import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell-connectors';
import UpdateCustomApp from './update-custom-app.setting.graphql';
import ChangeCustomAppStatus from './change-custom-app-status.setting.graphql';
import CreateCustomApp from './create-custom-app.setting.graphql';
import InstallCustomApp from './install-custom-app.setting.graphql';
import UninstallCustomApp from './uninstall-custom-app.setting.graphql';
import MyCustomApps from './fetch-my-custom-apps.setting.graphql';
import { CustomAppDraft, MyCustomApplication } from './types/app';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
export const useCustomApplications = () => {
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

  const [executeCustomApp, { loading: addLoading }] = useMcMutation<{
    createCustomApplication: MyCustomApplication;
  }>(CreateCustomApp, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [updateCustomApp, { loading: updateLoading }] = useMcMutation<{
    updateCustomApplication: MyCustomApplication;
  }>(UpdateCustomApp, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [changeCustomAppStatus, { loading: changeLoading }] = useMcMutation<{
    changeCustomApplicationStatus: MyCustomApplication;
  }>(ChangeCustomAppStatus, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [installCustomApp, { loading: installLoading }] = useMcMutation<{
    installCustomApplication: {
      id: string;
      application: MyCustomApplication;
    };
  }>(InstallCustomApp, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [uninstallCustomApp, { loading: uninstallLoading }] = useMcMutation<{
    uninstallCustomApplication: {
      id: string;
      application: MyCustomApplication;
    };
  }>(UninstallCustomApp, {
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

  return {
    createCustomApp,
    updateCustomApp,
    changeCustomAppStatus,
    installCustomApp,
    uninstallCustomApp,
    myCustomApplications: myAppsData?.myCustomApplications,
    updateApps,
  };
};
