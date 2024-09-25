import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import DataTable from '@commercetools-uikit/data-table';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDeploymentContext } from '../../../../providers/deployment';
import { ArrowRightIcon } from '@commercetools-uikit/icons';
import { ApplicationTypes } from '../../../../hooks/use-deployment/types/deployment';

const StyledRow = styled.div<{
  id: ApplicationTypes;
  applicationType: ApplicationTypes;
}>`
  ${({ id, applicationType }) =>
    `${id === applicationType ? 'color: blue;' : ''}`}
`;

const ROWS: { id: ApplicationTypes; name: string }[] = [
  {
    id: 'custom-app',
    name: 'Custom MC application',
  },
  {
    id: 'custom-view',
    name: 'Custom View',
  },
];

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'action', label: '' },
];

const AppType = ({ parentUrl }: { parentUrl: string }) => {
  const { selectedApplicationType, onSelectApplicationType } =
    useDeploymentContext();

  const handleRenderItem = (
    row: { id: ApplicationTypes; name: string },
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return selectedApplicationType === row.id ? (
          <Link
            to={!!selectedApplicationType ? `${parentUrl}/organization` : ''}
          >
            <Spacings.Inline alignItems="center">
              Select and continue
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow id={row.id} applicationType={selectedApplicationType}>
            {row?.[col.key]}
          </StyledRow>
        );
    }
  };
  return (
    <Spacings.Stack scale="l">
      <Spacings.Inline scale="l">
        <Text.Subheadline>Select an application type</Text.Subheadline>
      </Spacings.Inline>
      <DataTable
        rows={ROWS}
        columns={COLUMNS}
        onRowClick={(row) => onSelectApplicationType(row.id)}
        itemRenderer={handleRenderItem}
      />
    </Spacings.Stack>
  );
};

export default AppType;
