import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useApps } from '../../hooks/use-app';
import { useBuilderStateContext } from '../../providers/process';
import { AppDraft } from '../../types/app';
import AppsList from './list';
import NewAppForm from './new-app';
type Props = {};

const Apps = (props: Props) => {
  const drawerState = useModalState();
  const { createApp } = useApps();
  const { refreshData } = useBuilderStateContext();

  const handleCreateApp = async (appDraft: AppDraft) => {
    const result = await createApp(appDraft);
    if (!!result) {
      refreshData?.();
      drawerState.closeModal();
    }
  };

  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <Text.Subheadline as="h4">List of apps</Text.Subheadline>
            <PrimaryButton
              iconLeft={<PlusBoldIcon />}
              label="Add new app"
              onClick={drawerState.openModal}
            />
          </Spacings.Inline>
          <AppsList />
        </Spacings.Stack>
      </Spacings.Stack>
      <Drawer
        title="Add new app"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
      >
        <NewAppForm
          onSubmit={handleCreateApp}
          onCancel={drawerState.closeModal}
        />
      </Drawer>
    </>
  );
};

export default Apps;
