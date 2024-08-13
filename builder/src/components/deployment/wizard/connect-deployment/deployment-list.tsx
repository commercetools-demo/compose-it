import { useModalState } from '@commercetools-frontend/application-components';
import DataTable from '@commercetools-uikit/data-table';
import { ArrowRightIcon, PlusThinIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDeploymentContext } from '../../../../providers/deployment';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import {
  Deployment,
  DeploymentDraft,
} from '../../../../hooks/use-deployment/types/deployment';
import NewDeploymentForm from './new-deployment';

const columns = [
  { key: 'id', label: 'ID', isTruncated: true },
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: '' },
];

const StyledRow = styled.div`
  ${({ rowKey, deploymentKey }) =>
    `${rowKey === deploymentKey ? 'color: blue;' : ''}`}
`;

const DeploymentList = ({ parentUrl }: { parentUrl: string }) => {
  const modalState = useModalState();
  const {
    selectedDeployment,
    deployments,
    selectedConnector,
    onSelectDeployment,
    onSelectDeploymentDraft,
  } = useDeploymentContext();

  const handleNewCustomAppOpen = () => {
    modalState.openModal();
    // onSelectApp(undefined);
  };

  const handleNewDeployment = (deployment: DeploymentDraft) => {
    onSelectDeploymentDraft(deployment);
    modalState.closeModal();
  };

  const handleRenderItem = (
    row: Deployment,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return selectedDeployment?.key === row.key ? (
          <Link to={!!selectedDeployment ? `${parentUrl}/deploy` : ''}>
            <Spacings.Inline alignItems="center">
              Deploy
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow rowKey={row.key} deploymentKey={selectedDeployment?.key}>
            {row?.[col.key]}
          </StyledRow>
        );
    }
  };
  if (!selectedConnector) {
    return null;
  }

  return (
    <>
      <Spacings.Stack scale="l">
        <Spacings.Inline justifyContent="space-between">
          <Text.Subheadline>
            Select a connect app that deploys your application
          </Text.Subheadline>
          <PrimaryButton
            label="Add a new deloyment"
            iconLeft={<PlusThinIcon />}
            onClick={handleNewCustomAppOpen}
          >
            Add a new deployment
          </PrimaryButton>
        </Spacings.Inline>
        {!deployments?.length && (
          <Spacings.Stack>
            <Text.Headline as="h3">
              There are no deployments compatible with your application
            </Text.Headline>
            <Text.Body>Please create one</Text.Body>
          </Spacings.Stack>
        )}
        {!!deployments?.length && (
          <DataTable
            rows={deployments}
            columns={columns}
            onRowClick={(row) => onSelectDeployment(row)}
            itemRenderer={handleRenderItem}
          />
        )}
      </Spacings.Stack>
      <NewDeploymentForm
        isOpen={modalState.isModalOpen}
        onClose={modalState.closeModal}
        onSubmit={handleNewDeployment}
      />
    </>
  );
};

export default DeploymentList;
