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
import { useHistory } from 'react-router';

const EditAppButton = ({ parentUrl }: { parentUrl: string }) => {
  const drawerState = useModalState();
  const { appGeneralInfo } = useAppContext();
  const { replace } = useHistory();
  const { updateAppGeneralInfo, deleteApp } = useApps();

  const handleUpdateApp = async (app: AppDraft) => {
    if (!appGeneralInfo) {
      return;
    }
    await updateAppGeneralInfo(appGeneralInfo.key, app);
    drawerState.closeModal();
  };

  const handleDeleteApp = async (app: AppDraft) => {
    if (!app) {
      return;
    }
    await deleteApp(app.key);
    drawerState.closeModal();
    replace(`${parentUrl}`);
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
          onDeleteApp={handleDeleteApp}
          onCancel={drawerState.closeModal}
        />
      </Drawer>
    </Spacings.Inline>
  );
};

export default EditAppButton;
