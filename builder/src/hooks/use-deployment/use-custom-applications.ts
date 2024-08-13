import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell-connectors';
import CreateCustomApp from './create-custom-app.setting.graphql';
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
    myCustomApplications: myAppsData?.myCustomApplications,
    updateApps,
  };
};
