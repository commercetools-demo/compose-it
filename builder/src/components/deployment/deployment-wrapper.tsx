import React, { useEffect, useState } from 'react';
import { InfoModalPage } from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import NewDeployment from './new-deployment';
import { useDeployment } from '../../hooks/use-deployment';
import { Deployment } from '../../hooks/use-deployment/types/deployment';
import DataTable from '@commercetools-uikit/data-table';

type Props = {
  onClose: () => void;
};

const columns = [
  { key: 'id', label: 'ID', isTruncated: true },
  { key: 'key', label: 'Key' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: '' },
];

const DeploymentWrapper = ({ onClose }: Props) => {
  const { getDeploymentStatuses } = useDeployment();
  const [statuses, setStatuses] = useState<Deployment[]>([]);
  const getDeployments = () => {
    getDeploymentStatuses().then((statuses) => {
      setStatuses(statuses);
    });
  };

  useEffect(() => {
    getDeployments();
  }, []);

  return (
    <InfoModalPage
      title="Deployments"
      isOpen={true}
      onClose={onClose}
      topBarCurrentPathLabel="Lorem ipsum"
      topBarPreviousPathLabel="Back"
    >
      <Spacings.Stack scale="l">
        {!!statuses?.length && <DataTable rows={statuses} columns={columns} />}
        <NewDeployment />
      </Spacings.Stack>
    </InfoModalPage>
  );
};

export default DeploymentWrapper;
