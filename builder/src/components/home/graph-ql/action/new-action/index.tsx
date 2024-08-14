import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { ActionDraft } from '../../../../../types/datasource';
import { useAction } from '../../../../../hooks/use-action';
import ActionForm from '../action-form';

const NewAction = () => {
  const drawerState = useModalState();

  const { createAction } = useAction();

  const handleCreateAction = async (action: ActionDraft) => {
    const result = await createAction(action);
    if (!!result) {
      drawerState.closeModal();
    }
  };

  return (
    <>
      <PrimaryButton
        iconLeft={<PlusBoldIcon />}
        label="Add a new action"
        onClick={drawerState.openModal}
      />
      <Drawer
        title="Add a new action"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={30}
      >
        <ActionForm
          onSubmit={handleCreateAction}
          onCancel={drawerState.closeModal}
        />
      </Drawer>
    </>
  );
};

export default NewAction;
