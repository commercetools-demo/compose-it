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
import { useBuilderStateContext } from '../../../providers/process';
import { ComponentPropResponse } from '../../../types/datasource';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'createdAt', label: 'Created At' },
];

type Props = {
  onSelectComponent: (component: ComponentPropResponse) => void;
};

const ComponentList = ({ onSelectComponent }: Props) => {
  const { components } = useBuilderStateContext();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { page, perPage } = usePaginationState();

  return (
    <Constraints.Horizontal max={'scale'}>
      <Spacings.Stack scale="xl">
        {!components && <LoadingSpinner />}

        {!!components ? (
          <Spacings.Stack scale="l">
            <DataTable<NonNullable<ComponentPropResponse>>
              isCondensed
              columns={columns}
              rows={components}
              itemRenderer={(item, column) => {
                switch (column.key) {
                  case 'name':
                    return item.key;
                  case 'createdAt':
                    return new Date(item.createdAt).toLocaleString();

                  default:
                    return null;
                }
              }}
              sortedBy={tableSorting.value.key}
              sortDirection={tableSorting.value.order}
              onSortChange={tableSorting.onChange}
              onRowClick={onSelectComponent}
            />
            <Pagination
              page={page.value}
              onPageChange={page.onChange}
              perPage={perPage.value}
              onPerPageChange={perPage.onChange}
              totalItems={components.length ?? 0}
            />
          </Spacings.Stack>
        ) : null}
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};

export default ComponentList;
