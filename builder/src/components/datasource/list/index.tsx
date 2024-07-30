import { useEffect, useState } from 'react';
import { useDatasource } from '../../../hooks/use-datasource';
import { Datasource, DatasourceResponse } from '../../../types/datasource';
import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import DatasourceForm from '../datasource-form';
import Spacings from '@commercetools-uikit/spacings';
import { Pagination } from '@commercetools-uikit/pagination';
import DataTable from '@commercetools-uikit/data-table';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';

const columns = [
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Datasource Name' },
];

const DatasourceList = () => {
  const [datasources, setDatasources] = useState<DatasourceResponse[]>([]);
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { page, perPage } = usePaginationState();
  const [selectedDatasourceResponse, setSelectedDatasourceResponse] =
    useState<DatasourceResponse>();

  const { updateDatasource, fetchAllDatasources } = useDatasource();

  const drawerState = useModalState();

  const refresh = () => {
    fetchAllDatasources().then((data) => setDatasources(data?.results || []));
  };

  const handleUpdateDatasource = async (datasource: Datasource) => {
    const result = await updateDatasource(
      selectedDatasourceResponse?.key || '',
      datasource
    );

    refresh();
    if (!!result) {
      drawerState.closeModal();
    }
  };

  const handleOpenModal = (datasource: DatasourceResponse) => {
    setSelectedDatasourceResponse(datasource);
    drawerState.openModal();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      {datasources && (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<DatasourceResponse>>
            isCondensed
            columns={columns}
            rows={datasources}
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
            totalItems={datasources.length ?? 0}
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
    </>
  );
};

export default DatasourceList;
