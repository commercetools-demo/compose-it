import React from 'react';
import { InfoModalPage } from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import NewDeployment from './new-deployment';

type Props = {
  onClose: () => void;
};

const DeploymentWrapper = ({ onClose }: Props) => {
  return (
    <InfoModalPage
      title="Deployments"
      isOpen={true}
      onClose={onClose}
      topBarCurrentPathLabel="Lorem ipsum"
      topBarPreviousPathLabel="Back"
    >
      <Spacings.Stack scale="l">
        <div>Current deployments here</div>
        <NewDeployment />
      </Spacings.Stack>
    </InfoModalPage>
  );
};

export default DeploymentWrapper;
