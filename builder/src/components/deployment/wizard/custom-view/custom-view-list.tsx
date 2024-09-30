import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useModalState } from '@commercetools-frontend/application-components';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import DataTable from '@commercetools-uikit/data-table';
import { ArrowRightIcon, PlusThinIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CustomViewDraft, MyCustomView } from '../../../../hooks/use-deployment/types/view';
import { useDeploymentContext } from '../../../../providers/deployment';
import NewCustomViewForm from './new-custom-view';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'label', label: 'Label' },
  { key: 'description', label: 'Description' },
  { key: 'action', label: '' },
];

const StyledRow = styled.div<{ id: string; viewId?: string }>`
  ${({ id, viewId }) => `${id === viewId ? 'color: blue;' : ''}`}
`;

const CustomViewList = ({ parentUrl, nextUrl }: { parentUrl: string, nextUrl: string }) => {
  const showSuccessNotification = useShowNotification();

  const modalState = useModalState();
  const {
    selectedOrganization,
    views,
    selectedView,
    selectedConnector,
    onSelectView,
    onCreateCustomView,
  } = useDeploymentContext();

  const handleNewCustomViewOpen = () => {
    modalState.openModal();
    onSelectView(undefined);
  };

  const handleCreateNewCustomView = async (customView: CustomViewDraft) => {
    if (!selectedOrganization) {
      return;
    }

    const result = await onCreateCustomView(selectedOrganization, customView);
    showSuccessNotification({
      domain: DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Custom view created successfully',
    });
    modalState.closeModal();
    if (result) {
      onSelectView(result);
    }
  };

  const handleRenderItem = (
    row: MyCustomView,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        const url = !!selectedConnector
          ? `/deployments`
          : nextUrl;
        return selectedView?.id === row.id ? (
          <Link to={!!selectedView ? `${parentUrl}${url}` : ''}>
            <Spacings.Inline alignItems="center">
              Select for update
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow id={row.id} viewId={selectedView?.id}>
            {row?.[col.key]}
          </StyledRow>
        );
    }
  };

  if (!views) {
    return null;
  }
  return (
    <>
      <Spacings.Stack scale="l">
        <Spacings.Inline justifyContent="space-between">
          <Text.Subheadline>
            Select a custom view to deploy to
          </Text.Subheadline>
          <PrimaryButton
            label="Add a Custom View"
            iconLeft={<PlusThinIcon />}
            onClick={handleNewCustomViewOpen}
            isDisabled={!selectedOrganization}
          >
            Add Custom View
          </PrimaryButton>
        </Spacings.Inline>
        <DataTable
          rows={views}
          columns={columns}
          onRowClick={(row) => onSelectView(row)}
          itemRenderer={handleRenderItem}
        />
      </Spacings.Stack>
      <NewCustomViewForm
        isOpen={modalState.isModalOpen}
        onClose={modalState.closeModal}
        onSubmit={handleCreateNewCustomView}
      />
    </>
  );
};

export default CustomViewList;
