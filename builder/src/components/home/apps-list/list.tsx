import React from 'react';
import Constraints from '@commercetools-uikit/constraints';
import DataTable from '@commercetools-uikit/data-table';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import { useHistory, useRouteMatch } from 'react-router';
import { useBuilderStateContext } from '../../../providers/process';
import { App } from '../../../types/app';

const columns = [
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'App Name' },
  { key: 'description', label: 'Description' },
];

const AppsList = () => {
  const { push } = useHistory();
  const match = useRouteMatch();
  const { apps, isLoading } = useBuilderStateContext();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { page, perPage } = usePaginationState();

  const handleRowClick = (row: NonNullable<App>) => {
    push(`${match.url}/app/${row.key}`);
  };
  return (
    <Constraints.Horizontal max={'scale'}>
      <Spacings.Stack scale="xl">
        {isLoading && <LoadingSpinner />}

        {!isLoading && apps ? (
          <Spacings.Stack scale="l">
            <DataTable<NonNullable<App>>
              isCondensed
              columns={columns}
              rows={apps.results}
              itemRenderer={(item, column) => {
                switch (column.key) {
                  case 'key':
                    return item.key;
                  case 'name':
                    return item.value?.name;
                  case 'description':
                    return item.value?.description;
                  default:
                    return null;
                }
              }}
              sortedBy={tableSorting.value.key}
              sortDirection={tableSorting.value.order}
              onSortChange={tableSorting.onChange}
              onRowClick={handleRowClick}
            />
            <Pagination
              page={page.value}
              onPageChange={page.onChange}
              perPage={perPage.value}
              onPerPageChange={perPage.onChange}
              totalItems={apps.total ?? 0}
            />
          </Spacings.Stack>
        ) : null}
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};

export default AppsList;
