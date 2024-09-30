import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell-connectors';
import UpdateCustomView from './update-custom-view.setting.graphql';
import ChangeCustomViewStatus from './change-custom-view-status.setting.graphql';
import CreateCustomView from './create-custom-view.setting.graphql';
import InstallCustomView from './install-custom-view.setting.graphql';
import UninstallCustomView from './uninstall-custom-view.setting.graphql';
import MyCustomViews from './fetch-my-custom-views.setting.graphql';
import { CustomAppDraft, MyCustomApplication } from './types/app';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { CustomViewDraft, MyCustomView } from './types/view';
export const useCustomViews = () => {
  const {
    data: myViewsData,
    loading: myViewsLoading,
    refetch: updateViews,
  } = useMcQuery<{
    myCustomViews: MyCustomView[];
  }>(MyCustomViews, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [executeCustomView, { loading: addLoading }] = useMcMutation<{
    createCustomView: MyCustomView;
  }>(CreateCustomView, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [updateCustomView, { loading: updateLoading }] = useMcMutation<{
    updateCustomView: MyCustomView;
  }>(UpdateCustomView, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [changeCustomViewStatus, { loading: changeLoading }] = useMcMutation<{
    changeCustomViewStatus: MyCustomView;
  }>(ChangeCustomViewStatus, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [installCustomView, { loading: installLoading }] = useMcMutation<{
    installCustomView: {
      id: string;
      view: MyCustomView;
    };
  }>(InstallCustomView, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const [uninstallCustomView, { loading: uninstallLoading }] = useMcMutation<{
    uninstallCustomView: {
      id: string;
      view: MyCustomView;
    };
  }>(UninstallCustomView, {
    context: {
      target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
    },
  });

  const createCustomView = async (
    organizationId: string,
    customViewDraft: CustomViewDraft
  ): Promise<MyCustomView| undefined> => {
    const result = await executeCustomView({
      variables: {
        organizationId,
        data: customViewDraft,
      },
    });

    return result?.data?.createCustomView;
  };

  return {
    createCustomView,
    updateCustomView,
    changeCustomViewStatus,
    installCustomView,
    uninstallCustomView,
    myCustomViews: myViewsData?.myCustomViews || [],
    updateViews,
  };
};
