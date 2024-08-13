import { useModalState } from '@commercetools-frontend/application-components';
import DataTable from '@commercetools-uikit/data-table';
import { ArrowRightIcon, PlusThinIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  CustomAppDraft,
  MyCustomApplication,
} from '../../../../hooks/use-deployment/types/app';
import { useDeploymentContext } from '../../../../providers/deployment';
import NewCustomAppForm from '../custom-app/new-custom-app';
import Text from '@commercetools-uikit/text';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';

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
  const showSuccessNotification = useShowNotification();

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
    if (!selectedOrganization) {
      return;
    }

    const result = await onCreateCustomApp(selectedOrganization, customApp);
    showSuccessNotification({
      domain: DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Custom application created successfully',
    });
    modalState.closeModal();
    if (result) {
      onSelectApp(result);
    }

    // onSelectApp(app.id);
  };

  const handleRenderItem = (
    row: MyCustomApplication,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return selectedApp?.id === row.id ? (
          <Link to={!!selectedApp ? `${parentUrl}/connect-applications` : ''}>
            <Spacings.Inline alignItems="center">
              Select for update
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow id={row.id} appId={selectedApp?.id}>
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
        <Spacings.Inline justifyContent="space-between">
          <Text.Subheadline>
            Select a custom MC application to deploy to
          </Text.Subheadline>
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
          onRowClick={(row) => onSelectApp(row)}
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
