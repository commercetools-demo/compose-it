import Constraints from '@commercetools-uikit/constraints';
import { useState } from 'react';
import { Action, ActionResponse } from '../../../../types/datasource';

import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import DataTable from '@commercetools-uikit/data-table';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import { useBuilderStateContext } from '../../../../providers/process';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useAction } from '../../../../hooks/use-action';
import ActionForm from '../action-form';

const columns = [
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Action Name' },
];

const ActionList = () => {
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { page, perPage } = usePaginationState();
  const [selectedActionResponse, setSelectedActionResponse] =
    useState<ActionResponse>();

  const { actions, refreshData, isLoading } = useBuilderStateContext();
  const { updateAction } = useAction();

  const drawerState = useModalState();

  const handleUpdateAction = async (action: Action) => {
    const result = await updateAction(
      selectedActionResponse?.key || '',
      action
    );

    refreshData?.();
    if (!!result) {
      drawerState.closeModal();
    }
  };

  const handleOpenModal = (action: ActionResponse) => {
    setSelectedActionResponse(action);
    drawerState.openModal();
  };

  return (
    <Constraints.Horizontal max={'scale'}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !!actions && (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<ActionResponse>>
            isCondensed
            columns={columns}
            rows={actions.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'key':
                  return item.key;
                case 'name':
                  return item.value?.name;
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={handleOpenModal}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={actions.count ?? 0}
          />
        </Spacings.Stack>
      )}
      <Drawer
        title={`Edit ${selectedActionResponse?.key}`}
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={30}
      >
        <ActionForm
          onSubmit={handleUpdateAction}
          onCancel={drawerState.closeModal}
          action={selectedActionResponse?.value}
        />
      </Drawer>
    </Constraints.Horizontal>
  );
};

export default ActionList;
