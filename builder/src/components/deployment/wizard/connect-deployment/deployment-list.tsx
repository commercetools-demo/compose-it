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
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useAppContext } from '../../../../providers/app';

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

const DeploymentList = ({ parentUrl, nextUrl }: { parentUrl: string, nextUrl: string }) => {
  const { selectedApp } = useDeploymentContext();
  const context = useApplicationContext((context) => context);
  const { appGeneralInfo } = useAppContext();
  const modalState = useModalState();
  const {
    selectedDeployment,
    selectedDeploymentDraft,
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

  const handleSelectDeployment = (deployment: Deployment | DeploymentDraft) => {
    if ('deployedRegion' in deployment) {
      onSelectDeployment({
        ...deployment,
        applications: [
          {
            // TODO: move to .env
            applicationName: 'magic-app',
            standardConfiguration: [
              {
                key: 'CUSTOM_APPLICATION_ID',
                value: selectedApp?.id || '',
              },
              {
                key: 'APP_KEY',
                value: appGeneralInfo?.key || '',
              },
              {
                key: 'CLOUD_IDENTIFIER',
                value: context.environment.location,
              },
              {
                key: 'ENTRY_POINT_URI_PATH',
                value: selectedApp?.entryPointUriPath,
              },
              {
                key: 'APPLICATION_URL',
                value: deployment.applications[0].url || 'https://todo.com',
              },
              {
                key: 'INITIAL_PROJECT_KEY',
                value: context.project?.key || '',
              },
            ],
          },
        ],
      });
    } else {
      onSelectDeploymentDraft(deployment);
    }
  };

  const handleRenderItem = (
    row: Deployment,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return selectedDeployment?.key === row.key ||
          selectedDeploymentDraft?.key === row.key ? (
          <Link
            to={
              !!selectedDeployment || !!selectedDeploymentDraft
                ? nextUrl
                : ''
            }
          >
            <Spacings.Inline alignItems="center">
              Install
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow
            rowKey={row.key}
            deploymentKey={
              selectedDeployment?.key || selectedDeploymentDraft?.key
            }
          >
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
            Select a connect app installation to update or install a new one
          </Text.Subheadline>
          <PrimaryButton
            label="Install connector"
            iconLeft={<PlusThinIcon />}
            onClick={handleNewCustomAppOpen}
          >
            Install connector
          </PrimaryButton>
        </Spacings.Inline>
        {!deployments?.length && (
          <Spacings.Stack>
            <Text.Headline as="h3">
              There are no installation compatible with your application
            </Text.Headline>
            <Text.Body>Please create one</Text.Body>
          </Spacings.Stack>
        )}
        {!!deployments?.length && (
          <DataTable
            rows={deployments}
            columns={columns}
            onRowClick={(row) => handleSelectDeployment(row)}
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
