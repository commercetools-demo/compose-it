import Spacings from '@commercetools-uikit/spacings';
import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import NewAppForm from '../../apps-list/new-app';
import { AppDraft } from '../../../types/app';
import { useAppContext } from '../../../providers/app';
import { useApps } from '../../../hooks/use-app';
import IconButton from '@commercetools-uikit/icon-button';
import { GearIcon } from '@commercetools-uikit/icons';

const EditAppButton = () => {
  const drawerState = useModalState();
  const { appGeneralInfo } = useAppContext();
  const { updateAppGeneralInfo } = useApps();

  const handleUpdateApp = async (app: AppDraft) => {
    if (!appGeneralInfo) {
      return;
    }
    await updateAppGeneralInfo(appGeneralInfo.key, app);
    drawerState.closeModal();
  };
  return (
    <Spacings.Inline>
      <IconButton
        label="Edit App"
        onClick={() => drawerState.openModal()}
        icon={<GearIcon />}
      ></IconButton>
      <Drawer
        title={'Edit App ' + appGeneralInfo?.key}
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={20}
      >
        <NewAppForm
          app={appGeneralInfo as AppDraft}
          onSubmit={handleUpdateApp}
          onCancel={drawerState.closeModal}
        />
      </Drawer>
    </Spacings.Inline>
  );
};

export default EditAppButton;
