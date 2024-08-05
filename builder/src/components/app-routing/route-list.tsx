import React, { useState } from 'react';
import { PageConfig } from '../library/general';
import { useAppContext } from '../../providers/app';
import DataTable from '@commercetools-uikit/data-table';
import Spacings from '@commercetools-uikit/spacings';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Text from '@commercetools-uikit/text';

interface Props {
  onClose: () => void;
  onSave: () => void;
  onEditPage: (page?: PageConfig) => void;
}
const RouteList: React.FC<Props> = ({ onClose, onEditPage, onSave }) => {
  const {
    appConfig: { pages },
    isPageDirty,
    updateCurrentPageId,
  } = useAppContext();
  return (
    <Spacings.Stack scale="xl">
      <Spacings.Inline justifyContent="space-between">
        <div></div>
        <Spacings.Inline>
          <PrimaryButton label="Add a Route" onClick={() => onEditPage()} />
          <PrimaryButton
            label="Save Routes"
            onClick={onSave}
            isDisabled={!isPageDirty}
          />
        </Spacings.Inline>
      </Spacings.Inline>
      <DataTable
        rows={pages}
        columns={[
          {
            key: 'name',
            label: 'Name',
            renderItem(row) {
              return <Text.Detail>{row.name}</Text.Detail>;
            },
          },
          {
            key: 'route',
            label: 'Route',
            renderItem(row) {
              return <Text.Detail>{row.route ? row.route : '/'}</Text.Detail>;
            },
          },
          {
            key: 'type',
            label: 'Type',
            renderItem(row) {
              return <Text.Detail>{row.type}</Text.Detail>;
            },
          },
          {
            key: 'actions',
            label: '',
            renderItem(row) {
              return (
                <Spacings.Inline justifyContent="flex-end">
                  <PrimaryButton
                    label="Edit Route"
                    size="small"
                    onClick={() => onEditPage(row)}
                  />
                  <PrimaryButton
                    label="Select Page"
                    size="small"
                    tone="urgent"
                    onClick={() => {
                      updateCurrentPageId(row.id);
                      onClose();
                    }}
                  />
                </Spacings.Inline>
              );
            },
          },
        ]}
      />
    </Spacings.Stack>
  );
};

export default RouteList;
