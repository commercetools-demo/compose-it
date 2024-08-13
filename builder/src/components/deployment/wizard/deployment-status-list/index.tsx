import React, { useEffect, useState } from 'react';
import DataTable from '@commercetools-uikit/data-table';
import { DeployedStatus } from '../../../../hooks/use-deployment/types/deployment';
import { useDeployment } from '../../../../hooks/use-deployment';
import { CheckActiveIcon } from '@commercetools-uikit/icons';
import DeployedStatusActions from './deployed-status-actions';

type Props = {};

const columns = [
  { key: 'id', label: 'ID', isTruncated: true },
  { key: 'key', label: 'Key' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: '' },
];

const DeploymentStatusList = (props: Props) => {
  const { getDeploymentStatuses } = useDeployment();
  const [statuses, setStatuses] = useState<DeployedStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRenderItem = (
    row: DeployedStatus,
    col: { key: string; label: string }
  ) => {
    switch (col.key) {
      case 'action':
        return <DeployedStatusActions deployedStatus={row} />;
      default:
        return row?.[col.key];
    }
  };

  const getDeployments = () => {
    setIsLoading(true);
    getDeploymentStatuses()
      .then((statuses) => {
        setStatuses(statuses);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getDeployments();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!statuses?.length) {
    return <div>No deployment statuses found</div>;
  }

  return (
    <DataTable
      rows={statuses}
      columns={columns}
      itemRenderer={handleRenderItem}
    />
  );
};

export default DeploymentStatusList;
