import DataTable from '@commercetools-uikit/data-table';
import { ArrowRightIcon, PlusThinIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  CustomAppDraft,
  MyCustomApplication,
} from '../../../hooks/use-deployment/types/app';
import { useDeploymentContext } from '../../../providers/deployment';
import {
  useModalState,
  Drawer,
} from '@commercetools-frontend/application-components';
import NewCustomAppForm from './new-custom-app';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'action', label: '' },
];

const StyledRow = styled.div`
  ${({ id, appId }) => `${id === appId ? 'color: blue;' : ''}`}
`;

const CustomApplicationList = ({ parentUrl }: { parentUrl: string }) => {
  const modalState = useModalState();
  const {
    selectedOrganization,
    apps,
    selectedApp,
    onSelectApp,
    onCreateCustomApp,
  } = useDeploymentContext();

  const handleNewCustomAppOpen = () => {
    modalState.openModal();
    onSelectApp(undefined);
  };

  const handleCreateNewCustomApp = async (customApp: CustomAppDraft) => {
    console.log('customApp', customApp);

    if (!selectedOrganization) {
      return;
    }
    console.log('selectedOrganization', selectedOrganization);

    await onCreateCustomApp(selectedOrganization, customApp);
    modalState.closeModal();
    // onSelectApp(app.id);
  };

  const handleRenderItem = (
    row: MyCustomApplication,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return selectedApp === row.id ? (
          <Link to={!!selectedApp ? `${parentUrl}/custom-applications` : ''}>
            <Spacings.Inline alignItems="center">
              Select for update
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow id={row.id} appId={selectedApp}>
            {row?.[col.key]}
          </StyledRow>
        );
    }
  };

  if (!apps) {
    return null;
  }
  return (
    <>
      <Spacings.Stack scale="l">
        <Spacings.Inline justifyContent="flex-end">
          <PrimaryButton
            label="Add a Custom Application"
            iconLeft={<PlusThinIcon />}
            onClick={handleNewCustomAppOpen}
            isDisabled={!selectedOrganization}
          >
            Add Custom Application
          </PrimaryButton>
        </Spacings.Inline>
        <DataTable
          rows={apps}
          columns={columns}
          onRowClick={(row) => onSelectApp(row.id)}
          itemRenderer={handleRenderItem}
        />
      </Spacings.Stack>
      <NewCustomAppForm
        isOpen={modalState.isModalOpen}
        onClose={modalState.closeModal}
        onSubmit={handleCreateNewCustomApp}
      />
    </>
  );
};

export default CustomApplicationList;
