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
import { FlyingComponentsResponse } from '../../../types/datasource';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'createdAt', label: 'Created At' },
];

type Props = {
  onSelectComponent: (component: FlyingComponentsResponse) => void;
};

const FlyingComponentList = ({ onSelectComponent }: Props) => {
  const { flyingComponents } = useBuilderStateContext();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { page, perPage } = usePaginationState();

  return (
    <Constraints.Horizontal max={'scale'}>
      <Spacings.Stack scale="xl">
        {!flyingComponents && <LoadingSpinner />}

        {!!flyingComponents ? (
          <Spacings.Stack scale="l">
            <DataTable<NonNullable<FlyingComponentsResponse>>
              isCondensed
              columns={columns}
              rows={flyingComponents}
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
              totalItems={flyingComponents.length ?? 0}
            />
          </Spacings.Stack>
        ) : null}
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};

export default FlyingComponentList;
