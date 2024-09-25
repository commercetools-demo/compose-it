import DataTable from '@commercetools-uikit/data-table';
import { ArrowRightIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Organization } from '../../../hooks/use-deployment/types/organization';
import { useDeploymentContext } from '../../../providers/deployment';
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'action', label: '' },
];

const StyledRow = styled.div`
  ${({ id, orgId }) => `${id === orgId ? 'color: blue;' : ''}`}
`;

const OrganizationList = ({ parentUrl }: { parentUrl: string }) => {
  const { organizations, onSelectOrganization, selectedOrganization } =
    useDeploymentContext();
  if (!organizations) {
    return null;
  }

  const handleRenderItem = (
    row: Organization,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return selectedOrganization === row.id ? (
          <Link
            to={
              !!selectedOrganization ? `${parentUrl}/custom-applications` : ''
            }
          >
            <Spacings.Inline alignItems="center">
              Select and continue
              <ArrowRightIcon />
            </Spacings.Inline>
          </Link>
        ) : null;
      default:
        return (
          <StyledRow id={row.id} orgId={selectedOrganization}>
            {row?.[col.key]}
          </StyledRow>
        );
    }
  };
  return (
    <Spacings.Stack scale="l">
      <Spacings.Inline scale="l">
        <Text.Subheadline>Select an organization to deploy to</Text.Subheadline>
      </Spacings.Inline>
      <DataTable
        rows={organizations}
        columns={columns}
        onRowClick={(row) => onSelectOrganization(row.id)}
        itemRenderer={handleRenderItem}
      />
    </Spacings.Stack>
  );
};

export default OrganizationList;
