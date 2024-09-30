import { useModalState } from '@commercetools-frontend/application-components';
import DataTable from '@commercetools-uikit/data-table';
import { ArrowRightIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDeploymentContext } from '../../../../providers/deployment';
import Text from '@commercetools-uikit/text';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { ConnectorDraft } from '../../../../hooks/use-deployment/types/connector';
import NewConnectAppForm from './new-connect-app';

const columns = [
  { key: 'id', label: 'ID', isTruncated: true },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description', isTruncated: true },
  { key: 'action', label: '' },
];

const StyledRow = styled.div`
  ${({ id, connectorId }) => `${id === connectorId ? 'color: blue;' : ''}`}
`;

const ConnectApplicationList = ({
  parentUrl,
  nextUrl,
}: {
  parentUrl: string;
  nextUrl: string;
}) => {
  const showSuccessNotification = useShowNotification();

  const modalState = useModalState();
  const {
    connectors,
    onSelectConnector,
    selectedConnector,
    selectedApp,
    selectedOrganization,
    onCreateConnectApp,
  } = useDeploymentContext();

  const handleNewCustomAppOpen = () => {
    modalState.openModal();
    // onSelectApp(undefined);
  };

  const handleCreateNewConnectApp = async (connectApp: ConnectorDraft) => {
    if (!selectedApp || !selectedOrganization) {
      return;
    }

    const result = await onCreateConnectApp(selectedOrganization, connectApp);
    showSuccessNotification({
      domain: DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Connect application created successfully',
    });
    modalState.closeModal();
    if (result) {
      onSelectConnector(result);
    }

    // onSelectApp(app.id);
  };

  const handleRenderItem = (
    row: ConnectorDraft,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return selectedConnector?.id === row.id ? (
          <Link to={!!selectedConnector ? nextUrl : ''}>
            <Spacings.Inline alignItems="center">
              Select for deployment
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow id={row.id} connectorId={selectedConnector?.id}>
            {row?.[col.key]}
          </StyledRow>
        );
    }
  };
  if (!selectedApp) {
    return null;
  }

  return (
    <>
      <Spacings.Stack scale="l">
        <Spacings.Inline justifyContent="space-between">
          <Text.Subheadline>
            Select a connect app that deploys your application
          </Text.Subheadline>
          {/* <PrimaryButton
            label="Add a Connect Application"
            iconLeft={<PlusThinIcon />}
            onClick={handleNewCustomAppOpen}
            isDisabled={true}
          >
            Add a Connect Application
          </PrimaryButton> */}
        </Spacings.Inline>
        {!connectors?.length && (
          <Spacings.Stack>
            <Text.Headline as="h3">
              There are no connectors compatible with your application
            </Text.Headline>
            <Text.Body>Please contact your administrator</Text.Body>
          </Spacings.Stack>
        )}
        {!!connectors?.length && (
          <DataTable
            rows={connectors}
            columns={columns}
            onRowClick={(row) => onSelectConnector(row)}
            itemRenderer={handleRenderItem}
          />
        )}
      </Spacings.Stack>
      <NewConnectAppForm
        isOpen={modalState.isModalOpen}
        onClose={modalState.closeModal}
        onSubmit={handleCreateNewConnectApp}
      />
    </>
  );
};

export default ConnectApplicationList;
