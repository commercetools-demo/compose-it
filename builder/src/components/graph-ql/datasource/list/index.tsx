import Constraints from '@commercetools-uikit/constraints';
import { useState } from 'react';
import { useDatasource } from '../../../../hooks/use-datasource';
import { Datasource, DatasourceResponse } from '../../../../types/datasource';

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
import DatasourceForm from '../datasource-form';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

const columns = [
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Datasource Name' },
];

const DatasourceList = () => {
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { page, perPage } = usePaginationState();
  const [selectedDatasourceResponse, setSelectedDatasourceResponse] =
    useState<DatasourceResponse>();

  const { datasources, refreshData, isLoading } = useBuilderStateContext();
  const { updateDatasource } = useDatasource();

  const drawerState = useModalState();

  const handleUpdateDatasource = async (datasource: Datasource) => {
    const result = await updateDatasource(
      selectedDatasourceResponse?.key || '',
      datasource
    );

    refreshData?.();
    if (!!result) {
      drawerState.closeModal();
    }
  };

  const handleOpenModal = (datasource: DatasourceResponse) => {
    setSelectedDatasourceResponse(datasource);
    drawerState.openModal();
  };

  return (
    <Constraints.Horizontal max={'scale'}>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !!datasources && (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<DatasourceResponse>>
            isCondensed
            columns={columns}
            rows={datasources.results}
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
            totalItems={datasources.count ?? 0}
          />
        </Spacings.Stack>
      )}
      <Drawer
        title={`Edit ${selectedDatasourceResponse?.key}`}
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={30}
      >
        <DatasourceForm
          onSubmit={handleUpdateDatasource}
          onCancel={drawerState.closeModal}
          datasource={selectedDatasourceResponse?.value}
        />
      </Drawer>
    </Constraints.Horizontal>
  );
};

export default DatasourceList;
